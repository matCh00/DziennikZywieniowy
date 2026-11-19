# Raport testów — Dziennik Żywieniowy

Raport dotyczy dokładnie plików w tym archiwum. Testy uruchomiono ponownie po dodaniu Firebase Authentication, izolacji danych per konto i poprawkach kreatora przepisów.

## Wyniki automatycznych testów

| Zakres | Wynik |
|---|---|
| Klient API | routing FatSecret/OFF, walidacja, normalizacja odpowiedzi, kontrola źródeł i zapamiętywanie wyboru katalogu — zaliczone |
| FatSecret data-retention gate | domyślna blokada trwałego zapisu oraz jawny, serwerowy opt-in — zaliczone |
| Liczba testów | 32 testy Node.js i 6 testów Python — wszystkie zaliczone |
| Firebase Auth | Email/Password, rejestracja, logowanie, reset hasła, sesja `browserLocalPersistence`, blokada aplikacji bez sesji — testy statyczne zaliczone |
| Izolacja kont | Klucz lokalny per UID; osobne dokumenty profilu kobiety i mężczyzny; wspólny dokument produktów/przepisów/planów w obrębie konta — testy statyczne zaliczone |
| Kreator dań | Wyszukiwarka produktów w każdym wierszu składnika, mobilny układ i stylowane pola textarea — testy statyczne zaliczone |
| Cloudflare Worker | OAuth FatSecret + Food Search v6, region `PL`, normalizacja porcji, routing do jednego dostawcy i izolacja awarii — zaliczone na zamockowanych odpowiedziach |
| Indeks katalogu | budowanie tokenów i prefiksów wyszukiwania — zaliczone |
| Normalizacja OFF | nazwa, kod, sklepy, kcal, makroskładniki i odrzucanie niekompletnych rekordów — zaliczone |
| Skrypt miesięczny | test detekcji kraju, rozpoznawania sklepów, konwersji kJ → kcal oraz test CLI na małym pliku wejściowym — zaliczone |
| Składnia | wszystkie pliki JS przechodzą `node --check`; manifest przechodzi walidację JSON — zaliczone |
| HTML | brak zduplikowanych identyfikatorów i brak odwołań `$()` do nieistniejących elementów — zaliczone |
| ZIP | archiwum przechodzi `unzip -t` — zaliczone |

Polecenia:

```bash
node --test tests/*.test.mjs
python -m unittest discover -s tests -v
for f in js/*.js cloudflare-worker/*.js sw.js; do node --check "$f"; done
python -m json.tool manifest.webmanifest
```

## Katalog startowy i pierwsza konfiguracja profili

Katalog ma 1255 rekordów, unikalne identyfikatory i sprawdzane zakresy kcal/makroskładników. Wyszukiwanie „bułka” zwraca co najmniej 30 wariantów. Testy potwierdzają zachowanie identyfikatorów szybkiego dodawania oraz jawne oznaczenie rekordu Frida. Pierwszy kreator wymaga obu profili, waliduje granice wieku, wzrostu, masy, PAL i celu oraz odczytuje pola kobiety i mężczyzny niezależnie.

## Test FatSecret — co dokładnie zostało potwierdzone?

Test Worker przechwytuje `fetch` i sprawdza, że przy `source=fatsecret` wykonywane są dokładnie dwa żądania do domen FatSecret: OAuth token i Food Search v6 z `region=PL` oraz `language=pl`. Test potwierdza, że w tej ścieżce nie jest wywoływany Open Food Facts. Test nie korzysta z prawdziwych kluczy ani prawdziwego konta, więc nie potwierdza, że konto wdrożeniowe ma nadane uprawnienie `premier` i dostęp do Polski.

## Testy przeglądarkowe i ograniczenia

Nie udało się ponownie przeprowadzić pełnego testu E2E w Chromium dla tej wersji; uruchomienie przeglądarki z lokalnym serwerem zostało zablokowane przez środowisko testowe. Test overlayu jest statyczny — sprawdza przenoszenie listy do `document.body`, `position: fixed`, `z-index` i obsługę zdarzeń scroll/resize, ale nie zastępuje testu wizualnego na telefonie.

Nie wykonano testów na prawdziwym koncie FatSecret, prawdziwym projekcie Firebase ani w repozytorium GitHub Pages. Żywotność i dostępność zewnętrznych API zależą od usług dostawców i konfiguracji kluczy.

## Znane ograniczenia danych i wdrożenia

- 100% kompletności asortymentu SKU Lidla, Biedronki, Kauflandu i Carrefour nie jest możliwe do zagwarantowania z publicznego eksportu Open Food Facts. Przypisanie sieci w skrypcie jest heurystyczne (sklep / marka własna).
- FatSecret nie ma udokumentowanego publicznego eksportu bulk w tej integracji; poza wyjątkami z listy `Storable Data` dane z API są ograniczone warunkami przechowywania. Skrypt miesięczny nie pobiera i nie archiwizuje danych FatSecret.
- Dla polskiego rynku FatSecret wymaga odpowiednich uprawnień/edycji; samo ustawienie `region=PL` nie przyznaje dostępu. Basic i bezpłatny Premier Free standardowo wskazują dataset USA.
- Katalog OFF jest społecznościowy. Wartości odżywcze, kraj i sklep mogą być niekompletne lub nieaktualne; etykieta konkretnego produktu jest źródłem nadrzędnym.
- Import zapisanej bazy do IndexedDB jest lokalny dla przeglądarki i urządzenia. Każde urządzenie wymaga osobnego importu.
- Firebase Authentication i Firestore są wymagane. Rzeczywiste logowanie, reset hasła i synchronizację trzeba sprawdzić po skonfigurowaniu projektu; testy w tym środowisku nie korzystały z prawdziwego projektu Firebase.
- Firebase Auth używa `browserLocalPersistence`; aplikacja nie przechowuje haseł. Na urządzeniach współdzielonych należy się wylogować.
- Dane lokalne są rozdzielone kluczem zawierającym UID, a dane Firestore są rozdzielone ścieżką `users/{uid}`. W ramach konta produkty własne, plany i przepisy są wspólne dla obu profili.


## Wersja 3.2 — przebudowa panelu, plany i katalog

- `node --test tests/*.test.mjs`: 27 testów zaliczonych.
- `python tests/test_off_catalog.py`: 6 testów zaliczonych.
- Katalog: 1255 pozycji, unikalne ID, zakresy kcal/makroskładników sprawdzone.
- „Bułka”: minimum 30 dopasowań w katalogu startowym.
- Statyczne testy potwierdzają kolejność czterech kart głównych, usunięcie etykiety dnia, ułożenie analityki, umieszczenie POSTĘPÓW pod USTAWIENIAMI PROFILU oraz 2-kolumnową siatkę wskaźników.
- Testy kodu potwierdzają dostępność CRUD planów i przepisów oraz przesyłanie całego stanu (w tym `recipes` i `plans`) do Firestore.
- Przykładowy jadłospis jest generowany ze stałej danych i nie jest zapisywany w stanie Firebase.

Testy jednostkowe i statyczne nie zastępują testu na prawdziwym koncie Firebase ani wszystkich przeglądarkach/urządzeniach. Dane wariantów przygotowania w katalogu startowym pozostają wartościami szacunkowymi, co jest oznaczone w rekordach.

## Logowanie i synchronizacja kont

Dodano modal blokujący aplikację do czasu zalogowania, rejestrację e-mail/hasło, reset hasła i wylogowanie. Firebase utrzymuje sesję w przeglądarce przez `browserLocalPersistence`; nie zapisujemy haseł. Zapis Firestore jest dzielony na dokumenty `profile_female`, `profile_male`, `shared` i `preferences`. Reguły ograniczają dostęp do UID zalogowanego użytkownika. Nie wykonano testu na prawdziwym koncie/projekcie Firebase ani wizualnego testu E2E w przeglądarce.
