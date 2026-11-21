# Katalog startowy — co zawiera i skąd pochodzą wartości?

## Zawartość

Aplikacja ma **1540 produktów w jednym pliku `js/products.js`**: **1189 produktów ogólnych** i **351 produktów sklepowych**. Katalog ogólny obejmuje codzienne kategorie: owoce, warzywa, pieczywo, bułki, produkty zbożowe, nabiał, jaja, mięso, ryby, strączki, konserwy, tłuszcze, sosy, orzechy, słodycze, dania gotowe i napoje. Katalog sklepowy zawiera 169 pozycji Biedronki z oficjalnych kart produktów (z linkiem i wartościami na 100 g/ml) oraz 182 pozycje Lidla i Kauflandu z oficjalnych stron asortymentu: 123 produkty Lidla (63 pieczywo, 16 mięso, 15 wędlin, 29 nabiał) i 59 Kauflandu (14 pieczywo, 20 mięso, 8 wędlin, 17 nabiał). Lidl i Kaufland nie udostępniają tam pełnych tabel, więc ich wartości są orientacyjne i oznaczone `retailer-assortment-reference`.

Mięso i nabiał Lidla pochodzą z oficjalnych stron marki Rzeźnik, Pikok i Pilos. Kaufland korzysta z oficjalnego leksykonu mięsa, wędlin oraz produktów mlecznych i jajek. Nazwy są zgodne z tymi stronami; wartości odżywcze są referencyjne dla danego typu produktu, bo sklepy nie publikują tabel na kartach asortymentu.

Baza dań w `js/dishes.js` zawiera **157 pozycji**: 89 dań domowych oraz 68 dań fast food z McDonald’s, KFC, Popeyes i Burger King. Pięć wariantów Burgera Drwala ma wartości z oficjalnej tabeli McDonald’s: Klasyczny 923 kcal, z kurczakiem 863, z żurawiną 940, Serowy 974 i Na ostro 900 kcal na porcję. Dania domowe są szacunkami dla typowych porcji.

Wyszukiwanie `bułka` powinno pokazywać różne warianty: kajzerkę, bułkę pszenną, grahamkę, wieloziarnistą, z ziarnami, żytnią, orkiszową, proteinową, mleczną, maślaną, słodką, do hot doga, hamburgerową, bajgiel, precel, ciabattę, bagietkę, wariant bezglutenowy i inne produkty piekarnicze.

## Ważne rozróżnienie: produkt ogólny a konkretny produkt sklepowy

`js/products.js` łączy **produkty ogólne / referencyjne** i potwierdzone pozycje sklepowe, ale nadal są to dwa rodzaje danych. Np. „Bułka grahamka” z `store: "Ogólne"` oznacza kategorię produktu, a nie konkretną grahamkę marki własnej Lidla; pozycje z `store: "Biedronka"`, `"Lidl"` lub `"Kaufland"` to konkretny asortyment. Nie mieszaj tych oznaczeń: `sourceKind` przy każdym produkcie mówi, czy dane pochodzą z karty sklepu, czy są referencyjne.

Większość wbudowanych pozycji ma `sourceKind: "generic-reference"` i widoczną w aplikacji notę:

> Wartość orientacyjna dla produktu.

Wartość należy traktować jako przybliżenie do szybkiego dziennika. Przy opakowanym produkcie nadrzędna jest etykieta konkretnego opakowania; rozporządzenie UE 1169/2011 określa deklarację żywieniową w przeliczeniu na 100 g lub 100 ml. Pomocniczo: [GIS — znakowanie żywności](https://www.gov.pl/web/gis/znakowanie-zywnosci).

Jedna pozycja `Bułka słodka drożdżowa` ma jawne źródło DTU Frida (food ID 1334): 296 kcal, białko 9,1 g, tłuszcz 6,6 g, węglowodany 48,7 g / 100 g. Jest to duńska kategoria referencyjna „Rolls, sweet dough type”, nie polski SKU. Link: https://frida.fooddata.dk/index.php/food/1334?lang=en . Zbiór Frida 6.1 jest publikowany na licencji CC BY 4.0 — przy tej pozycji zachowujemy wskazanie źródła i licencji.

**Nie opisujemy wszystkich 1540 rekordów produktowych jako oficjalnie potwierdzonych danych sklepowych.** Byłoby to nieprawdziwe. 1189 produktów ogólnych to lekka baza referencyjna; 169 pozycji Biedronki ma oficjalne karty, a 182 pozycje Lidla/Kauflanda to asortyment z orientacyjnymi wartościami. Przy pakowanym produkcie nadrzędna jest etykieta.

## Co jest potrzebne, aby mieć oficjalne wartości dla szerokiej gamy produktów?

1. **Etykiety konkretnych produktów** — najlepsze źródło kcal i makroskładników dla danego opakowania. Open Food Facts agreguje takie dane, ale wpisy są dodawane społecznościowo i nie pokrywają całego asortymentu.
2. **Open Food Facts** — publiczny eksport i API. Import jest opcjonalny; załączony skrypt miesięczny nadal działa. Licencja bazy to ODbL, a obrazy mają odrębne warunki CC BY-SA. Przy publikowaniu bazy pochodnej należy przestrzegać atrybucji i share-alike. Zob. `docs/OPEN_FOOD_FACTS_SETUP.md`.
3. **NIZP PZH — Tabele wartości odżywczej** — polska, oficjalna baza obejmująca ponad 1000 produktów i potraw. Instytut udostępnia ją w pliku XLSX na podstawie umowy licencyjnej, także dla zastosowań komercyjnych. Nie dołączamy tych tabel do tej paczki, bo nie mamy licencji na ich redystrybucję. Kontakt i opis: https://www.pzh.gov.pl/uslugi/tabele-wartosci-odzywczej-produktow/ .
4. **FatSecret** — można używać do wyszukiwania online, gdy konto ma odpowiedni dostęp do rynku PL. API nie jest publicznym eksportem całego katalogu, a reguły przechowywania nie pozwalają na bezterminowe kopiowanie większości rekordów. Nie używamy go do zasilania wbudowanej bazy.

## Dlaczego nie ma w tej paczce 100% asortymentu sklepów?

Nie ma jednego publicznego, darmowego, oficjalnego dumpa całego aktualnego asortymentu tych sieci. Asortyment jest zmienny, część produktów sprzedawana jest luzem, a dane na stronach sieci mogą nie być dostępne jako otwarty eksport. Publiczna baza OFF jest cenna, ale crowdsourcingowa i nie gwarantuje pełnego pokrycia.

Do dokładnych pozycji sklepowych używaj w pierwszej kolejności:
- skanowania EAN / lokalnego importu Open Food Facts;
- online search (FatSecret lub OFF), gdy dostawca zwraca konkretny produkt;
- własnego produktu, jeśli wartość z etykiety nie istnieje w bazie.

## Jak rozbudować bazę bez gigabajtów?

- Wbudowana baza startowa jest już dołączona do ZIP i działa offline.
- Nie importuj dużej bazy, dopóki nie masz miejsca — opcja importu pozostaje w **Ustawienia → Zapisana baza produktów**.
- Jeśli później uzyskasz prawo do PZH lub innego zbioru, dodaj własny importer zgodny z licencją i formatem. Nie nadpisuj ani nie oznaczaj wpisów generycznych jako sklepowych bez weryfikacji.


## Wersja 3.2 — rozszerzenie katalogu

Wbudowany katalog zawiera **1189 wpisów**. Rozszerzenie dodaje owoce egzotyczne i suszone, warzywa i grzyby, dodatkowe rodzaje pieczywa, napoje roślinne, sery, mięso i ryby, kasze, mąki, strączki, przetwory, przekąski i dania gotowe. Dla wielu produktów przygotowano również odmiany technologiczne, np. gotowane, na parze, pieczone, grillowane, opiekane lub w wersji lekkiej. Wariant „suszone” dla owoców został wycofany, bo mnożniki dawały wartości niemożliwe fizycznie.

**Ważne:** wartości dla odmian technologicznych są estymacjami referencyjnymi. Nie są wynikiem laboratoryjnego badania każdego wariantu ani danymi z etykiety konkretnej marki. Przykładowo „pierś z kurczaka · grillowana” opisuje ogólny wariant przygotowania; faktyczna energia zależy od ubytku wody, dodatku tłuszczu i receptury. Użytkownik powinien traktować te rekordy jako szybkie przybliżenia, a etykiety opakowań jako źródło nadrzędne.

Każdy rekord ma `source`, `sourceKind`, `store` i `dataNote`. Wpisy ogólne są oznaczone jako `store: Ogólne` oraz `sourceKind: generic-reference`. Jedyny rekord wyraźnie oznaczony jako opublikowany i licencjonowany (bułka słodka) zachowuje odwołanie do DTU Frida i CC BY 4.0.

Liczba pozycji jest walidowana testami automatycznymi (minimum 1000), identyfikatory muszą być unikalne, a wartości kalorii i makroskładników mieszczą się w zadanych zakresach.

## Walidacja i źródła (wersja 2026-11-20.1)

Katalog jest kontrolowany automatycznie:

```bash
node tools/validate_seed_products.mjs        # pełny raport
node tools/validate_seed_products.mjs --verbose
```

Walidator sprawdza komplet pól, unikalność identyfikatorów i nazw, zakresy
kalorii i makroskładników, sumę makroskładników (≤ 100 g) oraz zgodność energii
z białkiem, tłuszczem i węglowodanami (4/9/4 kcal na gram, tolerancja na błonnik).
Dwa rekordy otrębów mają energię wprost z tabeli źródłowej i są raportowane jako
„wyjątek źródłowy”, a nie błąd.

Wersja 2026-11-20.1 poprawia wykryte błędy:

- oliwki zielone miały tłuszcz 0,5 g zamiast 15,3 g (USDA FDC: 145 kcal / 100 g);
- usunięto zduplikowaną „Kapustę kiszoną”;
- usunięto wariant „suszone” dla owoców, który dawał fizycznie niemożliwe wartości
  (np. 764 kcal i 405 kcal z makroskładników);
- energia wariantów przygotowania jest liczona z ich własnych makroskładników,
  więc kcal i makro nie rozjeżdżają się;
- identyfikatory są w ASCII (bez polskich znaków).

Dodano kilkadziesiąt codziennych produktów sklepowych (pieczywo, nabiał, wędliny,
mąki i kasze, warzywa, przekąski, dania gotowe), oznaczonych źródłem
„Wartość referencyjna · USDA FoodData Central / NIZP PZH (kategoria ogólna)”.

Źródła:

- USDA FoodData Central — dane w domenie publicznej (CC0 1.0): https://fdc.nal.usda.gov/
- NIZP PZH — Tabele wartości odżywczej (licencja): https://www.pzh.gov.pl/uslugi/tabele-wartosci-odzywczej-produktow/
- Rozporządzenie (UE) 1169/2011 — deklaracja na 100 g: https://eur-lex.europa.eu/eli/reg/2011/1169/oj/pol
