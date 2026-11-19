# Miesięczna aktualizacja zapisanej bazy produktów

Ten proces buduje lokalny katalog z publicznego eksportu Open Food Facts. Nie pobiera produktów FatSecret — ich API nie ma udokumentowanego publicznego pełnego eksportu, a warunki przechowywania danych ograniczają trwałe cache'owanie.

## Wymagania

- Python 3.10 lub nowszy.
- Kilkanaście GB wolnego miejsca jest zalecane, bo pełny eksport OFF ma wiele GB po kompresji; aktualna wielkość pliku zmienia się.
- Stabilne łącze internetowe, jeśli pobierasz eksport bezpośrednio.
- Do importu w aplikacji: współczesna przeglądarka z IndexedDB, Streams API i `DecompressionStream('gzip')` (aktualne Chrome, Edge, Firefox, Safari).

## Krok 1 — uruchom skrypt

W terminalu, w głównym katalogu projektu:

```bash
python tools/update_openfoodfacts_catalog.py
```

Windows:

```powershell
py -3 tools/update_openfoodfacts_catalog.py
```

Skrypt pobierze `openfoodfacts-products.jsonl.gz`, przetworzy każdy rekord strumieniowo i utworzy:

`data/openfoodfacts-retailers-pl.jsonl.gz`

Nie trzeba rozpakowywać całego źródła. Skrypt:

1. filtruje produkty powiązane z Polską;
2. próbuje przypisać produkt do Lidl, Biedronka, Kaufland lub Carrefour na podstawie pól sklepu albo listy znanych marek własnych;
3. wybiera rekordy z poprawną nazwą, kodem i kcal / 100 g (albo energią kJ przeliczaną na kcal);
4. zachowuje białko, tłuszcz, węglowodany, błonnik, ilość, kategorię i mały adres zdjęcia, jeśli są dostępne;
5. zapisuje własny, skompresowany JSONL.

Wynik terminala pokazuje liczbę sprawdzonych rekordów oraz przybliżoną liczbę przypisań dla poszczególnych sklepów.

## Krok 2 — opcje skryptu

```bash
# Użyj wybranych sieci
python tools/update_openfoodfacts_catalog.py --retailers Lidl Biedronka

# Użyj wcześniej pobranego dumpu
python tools/update_openfoodfacts_catalog.py --input C:/dane/openfoodfacts-products.jsonl.gz

# Szybki smoke test (tylko początek pliku, niepełny wynik)
python tools/update_openfoodfacts_catalog.py --max-records 50000
```

`--keep-all-polish` jest opcją testową i zapisuje wszystkie polskie rekordy z kcal, nawet jeśli sieci nie udało się przypisać. Nie używaj jej, jeśli katalog ma być ograniczony do czterech wymienionych sieci.

## Krok 3 — import w aplikacji

1. Otwórz Dziennik Żywieniowy na urządzeniu, na którym chcesz mieć bazę.
2. Kliknij Ustawienia (ikona koła zębatego).
3. W sekcji **Zapisana baza produktów** kliknij **Wybierz i importuj katalog**.
4. Wskaż `data/openfoodfacts-retailers-pl.jsonl.gz`.
5. Poczekaj na 100% i komunikat o liczbie produktów.
6. Wróć do dziennika. Wybierz tryb **Zapisana baza**.

W trakcie importu nowy katalog trafia do nieaktywnego magazynu IndexedDB. Dopiero po poprawnym zakończeniu aplikacja przełącza aktywną bazę. Wersja 3 używa indeksu prefiksów w IndexedDB: wyszukiwanie nie musi iterować po całym katalogu przy każdym zapytaniu. Przerwany import nie powinien wyłączyć poprzedniego katalogu.

## Krok 4 — miesięczny proces

Raz w miesiącu:

1. Uruchom ponownie skrypt.
2. Zachowaj kopię poprzedniego pliku wynikowego, jeśli chcesz mieć możliwość powrotu.
3. Zaimportuj nowy plik na każde urządzenie, na którym używasz aplikacji.
4. Upewnij się, że w aplikacji wyświetla się aktualny licznik produktów.

Możesz też uruchamiać skrypt ręcznie tylko wówczas, gdy potrzebujesz odświeżenia katalogu. Nie jest potrzebna automatyzacja ani płatny serwer.

## Ważne ograniczenia

- OFF nie jest katalogiem asortymentowym sieci handlowych. Zawiera tylko rekordy dodane przez społeczność.
- Pola `stores` i `brands` mogą być brakujące lub niepoprawne. Lista aliasów marek jest heurystyczna, może przypisać część produktów nieprawidłowo albo pominąć markę, której nie rozpoznaje.
- Nie wszystkie warianty bułek, pieczywa z piekarni, produktów sprzedawanych na wagę ani sezonowych promocji mają wpis w bazie.
- „Sklep” przypisany na podstawie marki własnej oznacza rozpoznanie marki, nie potwierdzenie, że produkt jest aktualnie dostępny w każdym sklepie tej sieci.
- Wartości żywieniowe mogą być niekompletne lub błędne. Etykieta produktu jest źródłem nadrzędnym.
- Baza jest objęta ODbL/DBCL. Przed publicznym rozpowszechnieniem katalogu pochodnego przeczytaj: https://openfoodfacts.github.io/openfoodfacts-server/api/tutorials/license-be-on-the-legal-side/.

## Dlaczego nie FatSecret?

FatSecret Food Search to wyszukiwanie stronicowane, nie eksport bazy. Oficjalna dokumentacja wskazuje również, że poza wymienionymi identyfikatorami wartości z API są przechowywalne maksymalnie przez 24 godziny. Nie wolno więc używać tego skryptu do miesięcznego, trwałego dumpu FatSecret bez odrębnej umowy / zgody.
