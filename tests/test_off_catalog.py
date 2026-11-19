import importlib.util
import pathlib
import unittest
import tempfile
import json
import gzip
import subprocess
import sys

MODULE_PATH = pathlib.Path(__file__).parents[1] / "tools" / "update_openfoodfacts_catalog.py"
spec = importlib.util.spec_from_file_location("off_catalog", MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(mod)

class CatalogueTests(unittest.TestCase):
    def test_poland_detection(self):
        self.assertTrue(mod.is_polish({"countries_tags": ["en:poland", "pl:polska"]}))
        self.assertFalse(mod.is_polish({"countries_tags": ["en:germany"]}))

    def test_retailer_detected_from_store(self):
        product = {"stores": "Lidl, Carrefour"}
        self.assertEqual(mod.matched_retailers(product, set(mod.RETAILER_ALIASES)), ["Lidl", "Carrefour"])

    def test_retailer_detected_from_own_brand(self):
        product = {"brands": "Pilos"}
        self.assertIn("Lidl", mod.matched_retailers(product, set(mod.RETAILER_ALIASES)))

    def test_projection_kcal_and_macros(self):
        product = {"code": "590123", "product_name": "Bułka", "brands": "Pilos", "nutriments": {
            "energy-kj_100g": 1046, "proteins_100g": 9, "fat_100g": 3, "carbohydrates_100g": 47
        }}
        projected = mod.project(product, ["Lidl"])
        self.assertAlmostEqual(projected["kcal100"], 250.0, places=1)
        self.assertEqual(projected["stores"], ["Lidl"])
        self.assertEqual(projected["protein100"], 9)

    def test_rejects_no_kcal_or_code(self):
        self.assertIsNone(mod.project({"product_name": "No kcal", "nutriments": {}}, ["Lidl"]))

    def test_cli_streams_jsonl_to_compressed_retailer_catalog(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = pathlib.Path(tmp) / "source.jsonl"
            output = pathlib.Path(tmp) / "retailers.jsonl.gz"
            rows = [
                {"code":"5900001","product_name_pl":"Bułka testowa","brands":"Pilos","stores":"Lidl","countries_tags":["en:poland"],"nutriments":{"energy-kcal_100g":265}},
                {"code":"5900002","product_name":"Produkt z Niemiec","brands":"Pilos","stores":"Lidl","countries_tags":["en:germany"],"nutriments":{"energy-kcal_100g":200}},
                {"code":"5900003","product_name":"Bez kalorii","brands":"Pilos","stores":"Lidl","countries_tags":["en:poland"],"nutriments":{}},
            ]
            source.write_text("\n".join(json.dumps(row, ensure_ascii=False) for row in rows) + "\n", encoding="utf-8")
            result = subprocess.run([sys.executable, str(MODULE_PATH), "--input", str(source), "--output", str(output)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            with gzip.open(output, "rt", encoding="utf-8") as stream:
                products = [json.loads(line) for line in stream if line.strip()]
            self.assertEqual(len(products), 1)
            self.assertEqual(products[0]["stores"], ["Lidl"])
            self.assertEqual(products[0]["kcal100"], 265)

if __name__ == "__main__":
    unittest.main()
