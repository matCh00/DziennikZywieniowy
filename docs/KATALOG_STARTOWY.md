# Katalog startowy — co zawiera i skąd pochodzą wartości?

## Zawartość

Aplikacja zawiera **1255 lekkich pozycji startowych** (266 wcześniejszych wpisów oraz 989 dodatkowych pozycji, w tym warianty przygotowania) w plikach `js/seed-products.js` i `js/seed-products-extra.js`. Katalog obejmuje codzienne kategorie: owoce, warzywa, pieczywo, różne rodzaje bułek, produkty zbożowe, nabiał, jaja, mięso, ryby, rośliny strączkowe, konserwy, tłuszcze, sosy, orzechy, słodycze, dania gotowe i napoje. Oba pliki z danymi ważą łącznie kilkadziesiąt kilobajtów, więc nie wymaga pobierania wielogigabajtowego eksportu.

Wyszukiwanie `bułka` powinno pokazywać różne warianty: kajzerkę, bułkę pszenną, grahamkę, wieloziarnistą, z ziarnami, żytnią, orkiszową, proteinową, mleczną, maślaną, słodką, do hot doga, hamburgerową, bajgiel, precel, ciabattę, bagietkę, wariant bezglutenowy i inne produkty piekarnicze.

## Ważne rozróżnienie: produkt ogólny a konkretny produkt sklepowy

Katalog startowy to katalog **produktów ogólnych / referencyjnych**, a nie katalog oficjalnych kodów SKU z Lidla, Biedronki, Kauflandu i Carrefour. Np. „Bułka grahamka” oznacza kategorię produktu, a nie konkretną grahamkę marki własnej Lidla. Jej receptura, masa i kaloryczność mogą różnić się od produktu z innej sieci lub piekarni.

Większość wbudowanych pozycji ma `sourceKind: "generic-reference"` i widoczną w aplikacji notę:

> Wartość orientacyjna dla produktu ogólnego — nie jest etykietą konkretnego SKU sklepowego.

Wartość należy traktować jako przybliżenie do szybkiego dziennika. Przy opakowanym produkcie nadrzędna jest etykieta konkretnego opakowania; rozporządzenie UE 1169/2011 określa deklarację żywieniową w przeliczeniu na 100 g lub 100 ml. Pomocniczo: [GIS — znakowanie żywności](https://www.gov.pl/web/gis/znakowanie-zywnosci).

Jedna pozycja `Bułka słodka drożdżowa` ma jawne źródło DTU Frida (food ID 1334): 296 kcal, białko 9,1 g, tłuszcz 6,6 g, węglowodany 48,7 g / 100 g. Jest to duńska kategoria referencyjna „Rolls, sweet dough type”, nie polski SKU. Link: https://frida.fooddata.dk/index.php/food/1334?lang=en . Zbiór Frida 6.1 jest publikowany na licencji CC BY 4.0 — przy tej pozycji zachowujemy wskazanie źródła i licencji.

**Nie opisujemy wszystkich 1255 rekordów jako oficjalnie potwierdzonych danych sklepowych.** Byłoby to nieprawdziwe. To lekka, praktyczna baza początkowa z wartościami orientacyjnymi, którą można potem zastępować etykietami konkretnych produktów.

## Co jest potrzebne, aby mieć oficjalne wartości dla szerokiej gamy produktów?

1. **Etykiety konkretnych produktów** — najlepsze źródło kcal i makroskładników dla danego opakowania. Open Food Facts agreguje takie dane, ale wpisy są dodawane społecznościowo i nie pokrywają całego asortymentu.
2. **Open Food Facts** — publiczny eksport i API. Import jest opcjonalny; załączony skrypt miesięczny nadal działa. Licencja bazy to ODbL, a obrazy mają odrębne warunki CC BY-SA. Przy publikowaniu bazy pochodnej należy przestrzegać atrybucji i share-alike. Zob. `docs/OPEN_FOOD_FACTS_SETUP.md`.
3. **NIZP PZH — Tabele wartości odżywczej** — polska, oficjalna baza obejmująca ponad 1000 produktów i potraw. Instytut udostępnia ją w pliku XLSX na podstawie umowy licencyjnej, także dla zastosowań komercyjnych. Nie dołączamy tych tabel do tej paczki, bo nie mamy licencji na ich redystrybucję. Kontakt i opis: https://www.pzh.gov.pl/uslugi/tabele-wartosci-odzywczej-produktow/ .
4. **FatSecret** — można używać do wyszukiwania online, gdy konto ma odpowiedni dostęp do rynku PL. API nie jest publicznym eksportem całego katalogu, a reguły przechowywania nie pozwalają na bezterminowe kopiowanie większości rekordów. Nie używamy go do zasilania wbudowanej bazy.

## Dlaczego nie ma w tej paczce 100% asortymentu sklepów?

Nie ma jednego publicznego, darmowego, oficjalnego dumpa całego aktualnego asortymentu tych czterech sieci. Asortyment jest zmienny, część produktów sprzedawana jest luzem, a dane na stronach sieci mogą nie być dostępne jako otwarty eksport. Publiczna baza OFF jest cenna, ale crowdsourcingowa i nie gwarantuje pełnego pokrycia.

Do dokładnych pozycji sklepowych używaj w pierwszej kolejności:
- skanowania EAN / lokalnego importu Open Food Facts;
- online search (FatSecret lub OFF), gdy dostawca zwraca konkretny produkt;
- własnego produktu, jeśli wartość z etykiety nie istnieje w bazie.

## Jak rozbudować bazę bez gigabajtów?

- Wbudowana baza startowa jest już dołączona do ZIP i działa offline.
- Nie importuj dużej bazy, dopóki nie masz miejsca — opcja importu pozostaje w **Ustawienia → Zapisana baza produktów**.
- Jeśli później uzyskasz prawo do PZH lub innego zbioru, dodaj własny importer zgodny z licencją i formatem. Nie nadpisuj ani nie oznaczaj wpisów generycznych jako sklepowych bez weryfikacji.


## Wersja 3.2 — rozszerzenie katalogu

Wbudowany katalog zawiera **1255 wpisów**. Rozszerzenie dodaje owoce egzotyczne i suszone, warzywa i grzyby, dodatkowe rodzaje pieczywa, napoje roślinne, sery, mięso i ryby, kasze, mąki, strączki, przetwory, przekąski i dania gotowe. Dla wielu produktów przygotowano również odmiany technologiczne, np. gotowane, na parze, pieczone, grillowane, opiekane, suszone lub w wersji lekkiej.

**Ważne:** wartości dla odmian technologicznych są estymacjami referencyjnymi. Nie są wynikiem laboratoryjnego badania każdego wariantu ani danymi z etykiety konkretnej marki. Przykładowo „pierś z kurczaka · grillowana” opisuje ogólny wariant przygotowania; faktyczna energia zależy od ubytku wody, dodatku tłuszczu i receptury. Użytkownik powinien traktować te rekordy jako szybkie przybliżenia, a etykiety opakowań jako źródło nadrzędne.

Każdy rekord ma `source`, `sourceKind`, `store` i `dataNote`. Wpisy ogólne są oznaczone jako `store: Ogólne` oraz `sourceKind: generic-reference`. Jedyny rekord wyraźnie oznaczony jako opublikowany i licencjonowany (bułka słodka) zachowuje odwołanie do DTU Frida i CC BY 4.0.

Liczba pozycji jest walidowana testami automatycznymi (minimum 1000), identyfikatory muszą być unikalne, a wartości kalorii i makroskładników mieszczą się w zadanych zakresach.
