# Dziennik Żywieniowy

Responsywna aplikacja do dziennego monitorowania kalorii, produktów, gramatur, masy ciała, nawodnienia, jadłospisu tygodniowego i własnych przepisów. Zbudowana w czystym HTML, CSS i JavaScript (ES modules), bez frameworka i bez procesu build. Gotowa do hostowania na GitHub Pages.

## Co zawiera paczka

- `index.html`, `css/`, `js/` — aplikacja.
- `assets/logo.png`, `assets/icon.svg` — logo i ikona aplikacji.
- `cloudflare-worker/worker.js` — backend proxy dla FatSecret i Open Food Facts; nie zawiera kluczy API.
- `tools/update_openfoodfacts_catalog.py` — miesięczny skrypt do stworzenia lokalnego katalogu z eksportu OFF.
- `docs/FATSECRET_SETUP.md` — rejestracja, bezpłatne plany, limity i konfiguracja FatSecret.
- `docs/OPEN_FOOD_FACTS_SETUP.md` — konto, API, eksporty, limity i licencje OFF.
- `docs/BAZA_LOKALNA_OFF.md` — pełna instrukcja aktualizacji katalogu i importu w aplikacji.
- `docs/KATALOG_STARTOWY.md` — opis katalogu startowego (1189 pozycji), pochodzenia i ograniczeń dokładności.
- `js/firebase-config.js`, `js/firebase-sync.js`, `firestore.rules` — logowanie e-mail/hasło i synchronizacja danych per konto.
- `tests/` — testy bez prawdziwych kluczy API.

## 1. Jak działa katalog produktów?

W aplikacji wybierasz jedną z dwóch ścieżek:

### Zapisana baza

Aplikacja szuka w:

1. 1189 wbudowanych pozycji referencyjnych (produkty bazowe, warianty przygotowania i codzienne produkty sklepowe, w tym wiele rodzajów pieczywa);
2. produktach własnych, które dodasz w aplikacji;
3. lokalnym katalogu Open Food Facts zaimportowanym do IndexedDB.

Zapisany katalog działa offline po zaimportowaniu. Jest związany z daną przeglądarką i urządzeniem — GitHub Pages nie hostuje ani nie synchronizuje automatycznie jego zawartości.

### Katalog startowy bez pobierania dużych plików

Wbudowany katalog w jednym pliku `js/seed-products.js` zawiera 1189 pozycji: bazowe produkty codzienne oraz orientacyjne warianty przygotowania (np. gotowane, pieczone, grillowane, opiekane). Działa offline i nie wymaga importu dużego pliku. To wartości referencyjne dla produktów ogólnych, nie oficjalne karty SKU czterech sieci. Wyszukiwanie „bułka” zwraca szeroki wybór pieczywa. Wartości wariantów technologicznych są szacunkowe i zależą od receptury oraz utraty/przyrostu wody i tłuszczu. Przy produktach pakowanych nadrzędne są wartości z etykiety konkretnego opakowania. Pełny opis źródeł i ograniczeń znajdziesz w [`docs/KATALOG_STARTOWY.md`](docs/KATALOG_STARTOWY.md).

Aplikacja ma cztery zakładki: **Dziennik**, **Plan tygodnia**, **Moje przepisy** i **Produkty**. Wszystkie ikony to jeden wbudowany sprite SVG (`index.html`), a dziennik pokazuje przy każdym wpisie i w podsumowaniu posiłku białko, tłuszcze i węglowodany wraz z udziałem energii (4/9/4 kcal na gram). Posiłki dodajesz do dnia wyłącznie w zakładce „Dziennik” — kartą „Dodaj produkt/danie/dzień”, która obsługuje pojedynczy produkt, zapisane danie z przepisów oraz wybrany dzień z własnego planu. Zakładka „Produkty” zawiera cały katalog startowy (tylko odczyt) oraz dodawanie, edycję i usuwanie własnych produktów. Pełny opis zależności między produktem, posiłkiem, daniem i planem: [`docs/FLOW.md`](docs/FLOW.md).

Pierwsze uruchomienie wymaga uzupełnienia **obu profili jednocześnie** — kobiety i mężczyzny. Jeżeli aktualizacja zastanie zapisany tylko jeden profil, kreator poprosi o brakujące parametry i pokaże istniejący profil do weryfikacji.

### Wyszukiwanie online

Źródło wybierasz ręcznie:

- **FatSecret · PL (wymaga aktywacji)** — wywołuje wyłącznie FatSecret przez Cloudflare Worker;
- **Open Food Facts · Polska** — wywołuje wyłącznie Search-a-licious OFF przez Worker;
- **FatSecret + Open Food Facts** — wywołuje obydwa źródła niezależnie i łączy wyniki.

Nie ma cichego fallbacku z FatSecret do OFF. Jeżeli FatSecret zwróci błąd lub nie ma dostępu do regionu PL, aplikacja pokaże jego błąd zamiast odpytania innego dostawcy. Standardowo wyniki FatSecret są tylko do podglądu; dodawanie ich do trwałego dziennika wymaga osobnych praw data-storage i opt-in w Worker. W statusie wyszukiwania pokazane jest, jakie źródło rzeczywiście odpowiedziało.

### Czy da się pobrać pełną bazę wszystkich czterech sieci?

Nie znalazłem oficjalnego, publicznego eksportu pełnego asortymentu SKU Lidla, Biedronki, Kauflandu i Carrefour. FatSecret nie dokumentuje publicznego eksportu całej bazy i ogranicza bezterminowe przechowywanie danych z API. Bezpłatne Basic i Premier Free standardowo udostępniają dataset USA; rynek PL należy uzgodnić osobno (szczegóły: `docs/FATSECRET_SETUP.md`).

Open Food Facts umożliwia pobranie dużego eksportu produktów. Dołączony skrypt filtruje polskie rekordy, dla których rozpoznano jedną z sieci (pole sklepu lub rozpoznawana marka własna) i które mają wartość kcal / 100 g. To najlepsza dostępna ścieżka do własnej, zapisanej bazy, ale nie może zagwarantować pełnej listy SKU: dane OFF są społecznościowe, etykiety sklepów bywają niepełne, a asortyment się zmienia.

**Nie traktuj liczby rekordów jako kompletności asortymentu.** Skrypt raportuje przybliżone przypisanie sklepów i nie dopisuje niepotwierdzonych produktów.

## 2. Comiesięczna aktualizacja zapisanej bazy

Wymagania: Python 3.10+ i kilka–kilkanaście GB wolnego miejsca na pobranie/obróbkę pełnego eksportu (rozmiar zmienia się; sprawdź aktualny plik przed pobraniem).

W katalogu głównym projektu uruchom:

```bash
python tools/update_openfoodfacts_catalog.py
```

Na Windows:

```powershell
py -3 tools/update_openfoodfacts_catalog.py
```

Skrypt pobiera eksport `https://static.openfoodfacts.org/data/openfoodfacts-products.jsonl.gz`, przetwarza go strumieniowo i zapisuje:

```text
data/openfoodfacts-retailers-pl.jsonl.gz
```

Nie rozpakowuje pełnego pliku na dysk i nie ładuje go w całości do RAM. Stary plik wynikowy jest podmieniany dopiero po udanym zakończeniu nowej aktualizacji.

Opcje:

```bash
# Tylko wybrane sieci
python tools/update_openfoodfacts_catalog.py --retailers Lidl Biedronka

# Użyj wcześniej pobranego pliku zamiast pobierania sieciowego
python tools/update_openfoodfacts_catalog.py --input openfoodfacts-products.jsonl.gz

# Szybki test na pierwszych 50 tys. rekordów (nie jest to pełna baza)
python tools/update_openfoodfacts_catalog.py --max-records 50000
```

Następnie w aplikacji: **Ustawienia → Zapisana baza produktów → Wybierz i importuj katalog**. Wybierz wygenerowany `.jsonl.gz`. Import odbywa się strumieniowo do IndexedDB; nowy katalog staje się aktywny dopiero po poprawnym zakończeniu importu. Poprzednia baza pozostaje aktywna w razie błędu.

Szczegółowa instrukcja: [`docs/BAZA_LOKALNA_OFF.md`](docs/BAZA_LOKALNA_OFF.md).

## 3. FatSecret — ważna informacja przed rejestracją

FatSecret udostępnia wyszukiwarkę produktów przez API, ale **nie znalazłem publicznego endpointu eksportu całej bazy**. Food Search ma paginację i maksymalnie 50 wyników na stronę — jest to API wyszukiwarki, nie bulk download.

Aktualne warunki planów pokazują:

- Basic: bezpłatny, samodzielna rejestracja, 5 000 wywołań dziennie i dataset USA. **Nie wystarcza do endpointu Food Search v6 używanego przez ten Worker**, który wymaga scope `premier`.
- Premier Free: bezpłatny po weryfikacji kwalifikujących się startupów, organizacji non-profit i studentów; dataset USA. Inne rynki mogą być udostępnione na indywidualnych / rabatowych warunkach.
- Premier Business: wycena zależna od rynków; oferta obejmuje ponad 62 lokalne datasety. Dostęp do Polski trzeba uzgodnić z FatSecret.

Dodatkowo FatSecret wymaga pobierania tokenów OAuth przez serwer proxy z dozwolonych adresów IP. Zwykły Cloudflare Worker nie gwarantuje dedykowanego stałego IP wyjściowego. Zanim uznasz integrację za gotową, potwierdź z FatSecret, czy akceptują egress Cloudflare Workers. W razie wymagania stałego IP użyj hostingu z dedykowanym adresem wyjściowym. Pełne wyjaśnienie: `docs/FATSECRET_SETUP.md`.

Samo ustawienie `region=PL` w żądaniu nie nadaje uprawnień do polskiego katalogu. Jeśli konto nie ma praw do PL, API może zwrócić błąd albo nieodpowiedni zestaw.

Konfiguracja i bezpłatne możliwości: [`docs/FATSECRET_SETUP.md`](docs/FATSECRET_SETUP.md).

## 4. Open Food Facts — rejestracja i API

Odczyt publicznego API nie wymaga klucza. Zalecane jest utworzenie konta Open Food Facts dla projektu, wypełnienie formularza użycia API i podanie własnego User-Agent / kontaktu. Limity wyszukiwania są ograniczone; oficjalna dokumentacja zaleca pobierać eksporty do pracy z dużą liczbą produktów zamiast wykonywać masowe zapytania.

Dla online search Worker używa Search-a-licious: `POST https://search.openfoodfacts.org/search` — nie legacy CGI `cgi/search.pl`, które może zwracać 503 przy ograniczeniach serwera.

Warunki licencji: baza ODbL, rekordy DBCL, zdjęcia CC BY-SA. Przed publicznym rozpowszechnieniem katalogu pochodnego zapoznaj się z warunkami ODbL i atrybucji. Dokumentacja: [`docs/OPEN_FOOD_FACTS_SETUP.md`](docs/OPEN_FOOD_FACTS_SETUP.md).

## 5. Cloudflare Worker — włączenie wyszukiwania online

Cloudflare Worker chroni klucze FatSecret poza kodem przeglądarki.

1. Utwórz bezpłatne konto na https://dash.cloudflare.com/. Aktualna dokumentacja Cloudflare podaje dla Workers Free limit 100 000 żądań dziennie i 10 ms CPU na wywołanie; limity mogą się zmieniać: https://developers.cloudflare.com/workers/platform/limits/.
2. Wejdź w **Workers & Pages → Create → Worker**.
3. Wklej cały kod z `cloudflare-worker/worker.js` i wdroż Worker.
4. Worker → Settings → Variables and Secrets dodaj sekrety:
   - `FATSECRET_CLIENT_ID`
   - `FATSECRET_CLIENT_SECRET`
5. Dodaj zwykłą zmienną `ALLOWED_ORIGIN`, np. `https://twoj-login.github.io` (opcjonalnie, ale zalecane). Opcjonalnie dodaj `CONTACT_EMAIL`. **Nie ustawiaj `FATSECRET_STORAGE_ALLOWED=true`, dopóki FatSecret nie przyzna Ci pisemnie praw do trwałego przechowywania danych.**
6. Zapisz i ponownie wdroż Worker.
7. Otwórz `https://NAZWA.workers.dev/health`. Oczekiwana wersja: `dziennik-zywieniowy-api-v6`.
8. W aplikacji: **Ustawienia → Wyszukiwanie online**, wklej adres Worker i wybierz **Testuj połączenie**.

Jeśli FatSecret nie jest skonfigurowany, health pokaże `fatsecret: false`. Wartość `true` oznacza jedynie obecność sekretów — nie potwierdza uprawnienia `premier`, aktywacji PL ani akceptacji adresu IP proxy. Osobne `fatsecretStorageAllowed` wskazuje, czy ustawiono opt-in trwałego zapisu po uzyskaniu zgody FatSecret. OFF nie wymaga sekretu. Jeśli chcesz korzystać tylko z zapisanej bazy, Worker nie jest potrzebny.

Cache: aplikacja przechowuje wyniki wyszukiwania online w pamięci bieżącej karty do 10 minut; Worker używa pamięci izolatu do krótkiego cache (10 minut) oraz pamięci tokena OAuth. To ogranicza powtórne zapytania, ale nie tworzy trwałego katalogu FatSecret. Cache FatSecret jest krótszy niż maksymalne 24h wskazywane w dokumentacji i nie może być rozszerzany bez zgody dostawcy.

## 6. Firebase — wymagane logowanie i synchronizacja per konto

Aplikacja wymaga zalogowania przez e-mail i hasło. Firebase Auth zapamiętuje sesję w przeglądarce (`browserLocalPersistence`); aplikacja nie zapisuje hasła. Każde konto ma oddzielne dzienniki i wspólną w ramach konta bazę własnych produktów, przepisów oraz planów tygodniowych.

Wykonaj instrukcję krok po kroku w [`docs/FIREBASE_LOGOWANIE.md`](docs/FIREBASE_LOGOWANIE.md): utwórz projekt, zarejestruj Web App, uzupełnij `js/firebase-config.js`, włącz Email/Password, dodaj domenę GitHub Pages do Authorized domains, utwórz Firestore i opublikuj `firestore.rules`.

Bez poprawnej konfiguracji Firebase aplikacja pozostaje zablokowana na ekranie logowania — to celowe, ponieważ dane mają być przypisane do konta. Nie umieszczaj w repozytorium klucza service account ani haseł. Publiczny Firebase Web config może być opublikowany; dostęp do danych ograniczają reguły Firestore.

Struktura Firestore: `users/{uid}/appData/profile_female`, `profile_male`, `shared`, `preferences`. Stare dane z poprzedniej wersji zapisane lokalnie mogą zostać jednorazowo przeniesione na pierwsze konto po potwierdzeniu w aplikacji.

## 7. GitHub Pages

1. Utwórz repozytorium GitHub.
2. Wgraj zawartość folderu aplikacji (a nie sam folder nadrzędny) do repozytorium tak, by `index.html` znajdował się w root.
3. Repozytorium → Settings → Pages → Deploy from a branch → `main` → `/(root)`.
4. Zapisz i otwórz opublikowany adres.

Aplikacja nie wymaga npm, bundlera ani backendu do działania z lokalną bazą. Wyszukiwanie FatSecret/OFF wymaga Cloudflare Worker; Firebase Authentication i Firestore są wymagane do zalogowania oraz synchronizacji kont.

## 8. Znane ograniczenia

- 100% kompletności SKU czterech sieci nie da się zagwarantować na podstawie publicznych danych OFF. Produkty piekarni, lady mięsnej, krótkie oferty i produkty bez danych sklepów/brandów mogą nie zostać rozpoznane.
- Katalog może zawierać błędne lub niekompletne dane żywieniowe; porównuj je z etykietą konkretnego opakowania.
- Online search wymaga dostępności zewnętrznego dostawcy i skonfigurowanego Worker. Status FatSecret nie potwierdza prawa do regionu PL — to określa umowa/uprawnienia konta.
- Dane FatSecret nie są importowane do zapisanej bazy. Domyślnie aplikacja blokuje dodanie produktu FatSecret do trwałego dziennika. Można odblokować zapis przez `FATSECRET_STORAGE_ALLOWED=true` dopiero po uzyskaniu zgody/licencji na trwałe przechowywanie danych od FatSecret.

## Oficjalne źródła

- FatSecret API Editions: https://platform.fatsecret.com/api-editions
- FatSecret OAuth 2.0 i lista dozwolonych adresów IP proxy: https://platform.fatsecret.com/docs/guides/authentication/oauth2
- FatSecret Food Search v6: https://platform.fatsecret.com/docs/v6/foods.search
- FatSecret Localization: https://platform.fatsecret.com/docs/guides/localization
- FatSecret Storable Data: https://platform.fatsecret.com/docs/guides/storable-data
- FatSecret Terms: https://platform.fatsecret.com/terms
- Open Food Facts API: https://openfoodfacts.github.io/openfoodfacts-server/api/
- Search-a-licious API: https://openfoodfacts.github.io/search-a-licious/users/ref-openapi/
- Open Food Facts export: https://static.openfoodfacts.org/data/openfoodfacts-products.jsonl.gz
- Open Food Facts licensing: https://openfoodfacts.github.io/openfoodfacts-server/api/tutorials/license-be-on-the-legal-side/
- NIZP PZH, Normy żywienia 2024: https://ncez.pzh.gov.pl/abc-zywienia/zasady-zdrowego-zywienia/normy-zywieniowe-2024/
- WHO BMI: https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight
