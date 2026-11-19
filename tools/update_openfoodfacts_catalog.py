#!/usr/bin/env python3
"""Build a small Polish retail-focused catalogue from an Open Food Facts JSONL dump.

This script streams the upstream multi-GB gzip export and writes a compressed JSONL
subset compatible with Dziennik Żywieniowy. It does NOT query FatSecret and does NOT
claim to recover the complete assortment of any retailer.
"""
from __future__ import annotations

import argparse
import gzip
import io
import json
import os
import re
import sys
import tempfile
import time
import urllib.error
import urllib.request
from collections import Counter
from pathlib import Path
from typing import BinaryIO, TextIO

SOURCE_URL = "https://static.openfoodfacts.org/data/openfoodfacts-products.jsonl.gz"
USER_AGENT = "DziennikZywieniowy-CatalogBuilder/1.0 (local user-initiated monthly update)"

RETAILER_ALIASES = {
    "Lidl": ["lidl", "pilos", "milbona", "deluxe", "alesto", "crownfield", "pikok", "vemondo", "eridanous", "freshona", "italiamo", "chef select", "solevita", "combino", "alpenfest", "favorina", "lord nelson", "snack day", "mckennedy", "gelatelli", "belbake", "baresa", "newgate"],
    "Biedronka": ["biedronka", "mleczna dolina", "go active", "kraina wedlin", "kraina wędlin", "vital fresh", "marinero", "swiatowid", "światowid", "fruvita", "nasza spizarnia", "nasza spiżarnia"],
    "Kaufland": ["kaufland", "k-classic", "k classic", "k-bio", "k bio", "k-purland", "k purland", "k-take it veggie", "k take it veggie", "k-favourites"],
    "Carrefour": ["carrefour", "carrefour classic", "carrefour bio", "carrefour selection", "carrefour sensation", "carrefour extra", "reflets de france", "simpl"]
}


def norm(value: object) -> str:
    text = str(value or "").lower().replace("ł", "l").replace("đ", "d")
    replacements = {"ą":"a", "ć":"c", "ę":"e", "ń":"n", "ó":"o", "ś":"s", "ź":"z", "ż":"z"}
    for a, b in replacements.items():
        text = text.replace(a, b)
    return re.sub(r"[^a-z0-9]+", " ", text).strip()


def as_text(value: object) -> str:
    if isinstance(value, list):
        return ", ".join(str(x) for x in value if x)
    return str(value or "")


def is_polish(product: dict) -> bool:
    tags = product.get("countries_tags") or product.get("countries_tags_hierarchy") or []
    joined = norm(as_text(tags) + " " + as_text(product.get("countries")))
    return "poland" in joined or "polska" in joined


def matched_retailers(product: dict, allowed: set[str]) -> list[str]:
    stores_text = norm(" ".join([
        as_text(product.get("stores")), as_text(product.get("stores_tags")),
        as_text(product.get("stores_tags_hierarchy"))
    ]))
    brands_text = norm(as_text(product.get("brands")))
    result = []
    for retailer, aliases in RETAILER_ALIASES.items():
        if retailer not in allowed:
            continue
        # Store name is preferred. Brand aliases are used as a practical fallback,
        # not as proof of a current listing in a particular shop.
        store_match = retailer.lower() in stores_text
        brand_match = any(norm(alias) and norm(alias) in brands_text for alias in aliases)
        if store_match or brand_match:
            result.append(retailer)
    return result


def number(value: object) -> float | None:
    try:
        x = float(str(value).replace(",", "."))
        if x < 0:
            return None
        return x
    except (TypeError, ValueError):
        return None


def project(product: dict, retailers: list[str]) -> dict | None:
    code = str(product.get("code") or product.get("_id") or "").strip()
    name = str(product.get("product_name_pl") or product.get("product_name") or product.get("product_name_en") or product.get("generic_name") or "").strip()
    if not code or not name:
        return None
    nutriments = product.get("nutriments") or {}
    kcal = number(nutriments.get("energy-kcal_100g"))
    if kcal is None:
        kj = number(nutriments.get("energy-kj_100g"))
        kcal = kj / 4.184 if kj is not None else None
    if kcal is None or kcal > 950:
        return None
    return {
        "id": f"off:{code}",
        "code": code,
        "name": name,
        "brand": as_text(product.get("brands")),
        "stores": retailers,
        "quantity": str(product.get("quantity") or ""),
        "kcal100": round(kcal, 1),
        "protein100": number(nutriments.get("proteins_100g")),
        "fat100": number(nutriments.get("fat_100g")),
        "carbs100": number(nutriments.get("carbohydrates_100g")),
        "fiber100": number(nutriments.get("fiber_100g")),
        "image_url": str(product.get("image_front_small_url") or product.get("image_front_url") or ""),
        "category": as_text(product.get("categories"))[:160],
        "source": "Open Food Facts"
    }


def open_source(args) -> tuple[TextIO, object]:
    """Return UTF-8 text stream and an owner that must be closed."""
    if args.input:
        raw = open(args.input, "rb")
        if str(args.input).lower().endswith(".gz"):
            gz = gzip.GzipFile(fileobj=raw, mode="rb")
            return io.TextIOWrapper(gz, encoding="utf-8", errors="replace"), (gz, raw)
        return io.TextIOWrapper(raw, encoding="utf-8", errors="replace"), (raw,)
    request = urllib.request.Request(SOURCE_URL, headers={"User-Agent": USER_AGENT, "Accept": "application/gzip"})
    last_error = None
    for attempt in range(4):
        try:
            raw = urllib.request.urlopen(request, timeout=120)
            gz = gzip.GzipFile(fileobj=raw, mode="rb")
            return io.TextIOWrapper(gz, encoding="utf-8", errors="replace"), (gz, raw)
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            last_error = exc
            if attempt < 3:
                delay = 2 ** attempt
                print(f"Pobieranie nie powiodło się ({exc}); ponawiam za {delay}s…", file=sys.stderr)
                time.sleep(delay)
    raise RuntimeError(f"Nie udało się pobrać eksportu OFF: {last_error}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Aktualizuje lokalny katalog produktów sklepów z eksportu Open Food Facts.")
    parser.add_argument("--input", type=Path, help="Opcjonalny lokalny plik .jsonl lub .jsonl.gz; domyślnie pobierany jest pełny eksport OFF.")
    parser.add_argument("--output", type=Path, default=Path("data/openfoodfacts-retailers-pl.jsonl.gz"))
    parser.add_argument("--retailers", nargs="+", choices=list(RETAILER_ALIASES), default=list(RETAILER_ALIASES), help="Sieci uwzględniane w katalogu.")
    parser.add_argument("--max-records", type=int, default=0, help="Limit rekordów źródłowych wyłącznie do testu (0 = bez limitu).")
    parser.add_argument("--keep-all-polish", action="store_true", help="Do testów: zapisuj wszystkie polskie produkty z kcal, nie tylko dopasowane sieci.")
    args = parser.parse_args()

    args.output.parent.mkdir(parents=True, exist_ok=True)
    allowed = set(args.retailers)
    text_stream, owners = open_source(args)
    temp_path = None
    scanned = included = skipped = 0
    stores = Counter()
    try:
        fd, temp_name = tempfile.mkstemp(prefix=args.output.name + ".", suffix=".tmp", dir=args.output.parent)
        os.close(fd)
        temp_path = Path(temp_name)
        with open(temp_path, "wb") as raw_out:
            with gzip.GzipFile(fileobj=raw_out, mode="wb", mtime=0, compresslevel=6) as gz_out:
                for line in text_stream:
                    scanned += 1
                    if args.max_records and scanned > args.max_records:
                        break
                    if not line.strip():
                        continue
                    try:
                        product = json.loads(line)
                    except json.JSONDecodeError:
                        skipped += 1
                        continue
                    if not isinstance(product, dict) or not is_polish(product):
                        skipped += 1
                        continue
                    retailers = matched_retailers(product, allowed)
                    if not retailers and not args.keep_all_polish:
                        skipped += 1
                        continue
                    projected = project(product, retailers or ["Nieustalony sklep"])
                    if not projected:
                        skipped += 1
                        continue
                    payload = (json.dumps(projected, ensure_ascii=False, separators=(",", ":")) + "\n").encode("utf-8")
                    gz_out.write(payload)
                    included += 1
                    for retailer in retailers:
                        stores[retailer] += 1
                    if scanned % 250_000 == 0:
                        print(f"Przetworzono {scanned:,}; zapisano {included:,} produktów…")
        os.replace(temp_path, args.output)
        print("\nZakończono.")
        print(f"Rekordy źródłowe: {scanned:,}")
        print(f"Produkty w katalogu: {included:,}")
        print(f"Pominięte rekordy: {skipped:,}")
        print(f"Plik: {args.output.resolve()} ({args.output.stat().st_size / (1024*1024):.1f} MiB)")
        for retailer, count in stores.most_common():
            print(f"  {retailer}: {count:,}")
        if args.max_records:
            print("UWAGA: użyto --max-records; to nie jest pełny katalog.")
        print("Uwaga: dopasowanie sklepów/brandów jest heurystyczne i nie gwarantuje pełnej listy SKU.")
        return 0
    except Exception:
        if temp_path and temp_path.exists():
            temp_path.unlink(missing_ok=True)
        raise
    finally:
        try:
            text_stream.close()
        except Exception:
            pass
        for owner in owners:
            try:
                owner.close()
            except Exception:
                pass


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        print("Przerwano przez użytkownika; plik wynikowy nie został podmieniony.", file=sys.stderr)
        raise SystemExit(130)
    except Exception as exc:
        print(f"BŁĄD: {exc}", file=sys.stderr)
        raise SystemExit(1)
