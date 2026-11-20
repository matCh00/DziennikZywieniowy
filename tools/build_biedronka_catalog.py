#!/usr/bin/env python3
"""Build a read-only Biedronka product catalog from official product pages.

Source: https://zakupy.biedronka.pl/ (official Biedronka online shop).
The generated file contains only values shown on the official product page
(nutrition per 100 g/ml). It intentionally does not invent missing values.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

BASE = "https://zakupy.biedronka.pl"
CATEGORIES = {
    "piekarnia/": "Pieczywo",
    "nabial/": "Nabiał i jaja",
    "mieso/": "Mięso i wędliny",
    "dania-gotowe/": "Dania gotowe",
    "mrozone/": "Mrożone",
}
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36",
    "Accept-Language": "pl-PL,pl;q=0.9",
}


def fetch(url: str, tries: int = 3) -> str:
    last = None
    for attempt in range(tries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=30) as response:
                return response.read().decode("utf-8", "replace")
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            last = exc
            time.sleep(0.8 * (attempt + 1))
    raise RuntimeError(f"Nie udało się pobrać {url}: {last}")


def plain(html: str) -> str:
    import html as html_module

    text = re.sub(r"<script\b.*?</script>", " ", html, flags=re.S | re.I)
    text = re.sub(r"<style\b.*?</style>", " ", text, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html_module.unescape(text)
    return re.sub(r"\s+", " ", text)


def number(value: str | None):
    if value is None:
        return None
    value = value.replace(" ", "").replace(",", ".")
    try:
        return round(float(value), 2)
    except ValueError:
        return None


def nutrition(html: str):
    text = plain(html)
    # Official Biedronka product cards always show "Wartość odżywcza (w 100 g produktu)".
    block = text
    marker = text.find("Wartość odżywcza")
    if marker >= 0:
        block = text[marker: marker + 2500]

    kcal = re.search(r"Wartość odżywcza\s*\(w 100\s*(?:g|ml)\s*produktu\)\s*([\d.,]+)\s*kcal", block, re.I)
    if not kcal:
        kcal = re.search(r"([\d.,]+)\s*kcal", block, re.I)
    fat = re.search(r"Tłuszcz\s*([\d.,]+)\s*g", block, re.I)
    carbs = re.search(r"węglowodany\s*([\d.,]+)\s*g", block, re.I)
    protein = re.search(r"Białko\s*([\d.,]+)\s*g", block, re.I)
    fiber = re.search(r"błonnik\s*([\d.,]+)\s*g", block, re.I)
    values = {
        "kcal100": number(kcal.group(1) if kcal else None),
        "fat100": number(fat.group(1) if fat else None),
        "carbs100": number(carbs.group(1) if carbs else None),
        "protein100": number(protein.group(1) if protein else None),
        "fiber100": number(fiber.group(1) if fiber else None),
    }
    if values["kcal100"] is None or not (0 <= values["kcal100"] <= 950):
        return None
    return values


def title_of(html: str) -> str:
    match = re.search(r"<title>(.*?)</title>", html, re.S | re.I)
    if not match:
        return ""
    import html as html_module

    return re.sub(r"\s+-\s+sklep biedronka\.pl\s*$", "", html_module.unescape(match.group(1)), flags=re.I).strip()


def brand_of(html: str) -> str:
    for match in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', html, re.S | re.I):
        try:
            data = json.loads(match.group(1))
        except json.JSONDecodeError:
            continue
        if isinstance(data, dict) and data.get("@type") == "Product":
            brand = data.get("brand")
            if isinstance(brand, dict):
                return str(brand.get("name") or "")
            if brand:
                return str(brand)
    return ""


def unit_weight(name: str):
    name = name.lower().replace(",", ".")
    multi = re.search(r"(\d+)\s*[x×]\s*(\d+(?:\.\d+)?)\s*(g|kg|ml|l)\b", name)
    if multi:
        count, amount, unit = int(multi.group(1)), float(multi.group(2)), multi.group(3)
        total = count * amount * (1000 if unit in ("kg", "l") else 1)
        return round(total, 1)
    single = re.search(r"(\d+(?:\.\d+)?)\s*(g|kg|ml|l)\b", name)
    if single:
        amount = float(single.group(1))
        return round(amount * (1000 if single.group(2) in ("kg", "l") else 1), 1)
    return None


def discover(category: str):
    html = fetch(f"{BASE}/{category}")
    links = sorted(set(re.findall(r'href="(/[^"]+-\d{10}\.html)"', html)))
    return [BASE + link for link in links]


def parse_product(url: str, category: str):
    html = fetch(url)
    values = nutrition(html)
    if not values:
        return None
    name = title_of(html)
    if not name or len(name) < 3:
        return None
    sku_match = re.search(r"(\d{10})\.html", url)
    sku = sku_match.group(1) if sku_match else re.sub(r"\W+", "", url)[-20:]
    return {
        "id": f"biedronka:{sku}",
        "name": name,
        "brand": brand_of(html) or "Biedronka",
        "category": category,
        "store": "Biedronka",
        "unitWeight": unit_weight(name),
        **values,
        "source": "Biedronka · oficjalna karta produktu",
        "sourceKind": "retailer-official",
        "sourceUrl": url,
        "dataNote": "Wartości z oficjalnej karty produktu Biedronka, na 100 g/ml. Skład i wartości mogą się zmieniać — nadrzędna jest etykieta opakowania.",
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=0, help="limit produktów na kategorię (test)")
    parser.add_argument("--out", default="js/store-products-biedronka.js")
    args = parser.parse_args()

    all_links = []
    for category, label in CATEGORIES.items():
        links = discover(category)
        if args.limit:
            links = links[: args.limit]
        all_links.extend((url, label) for url in links)
        print(f"{category}: {len(links)} produktów", file=sys.stderr)

    rows = []
    seen = set()
    with ThreadPoolExecutor(max_workers=5) as pool:
        futures = {pool.submit(parse_product, url, label): (url, label) for url, label in all_links}
        for index, future in enumerate(as_completed(futures), 1):
            url, label = futures[future]
            try:
                row = future.result()
            except Exception as exc:  # network/parsing single item should not stop build
                print(f"POMINIĘTO {url}: {exc}", file=sys.stderr)
                continue
            if row and row["id"] not in seen:
                seen.add(row["id"])
                rows.append(row)
            if index % 50 == 0:
                print(f"przetworzono {index}/{len(futures)}", file=sys.stderr)

    rows.sort(key=lambda row: (row["category"], row["name"].lower()))
    payload = json.dumps(rows, ensure_ascii=False, separators=(",", ":"))
    out = Path(args.out)
    out.write_text(
        "/**\n"
        " * Oficjalne produkty Biedronki — wygenerowane z kart produktów\n"
        " * https://zakupy.biedronka.pl/ (wartości na 100 g/ml).\n"
        " * Nie zawiera wartości wymyślonych; brak danych oznacza null.\n"
        " * Plik generowany przez tools/build_biedronka_catalog.py.\n"
        " */\n"
        f"export const biedronkaProducts = {payload};\n"
        f"export const biedronkaCatalogInfo = {{ count: {len(rows)}, source: 'https://zakupy.biedronka.pl/' }};\n",
        encoding="utf-8",
    )
    print(f"Zapisano {len(rows)} produktów do {out}", file=sys.stderr)


if __name__ == "__main__":
    main()
