# FatSecret — założenie konta i konfiguracja API

## Najpierw ważne ograniczenie rynków

Aktualna oficjalna tabela FatSecret Platform API wskazuje:

| Edycja | Cena | Limit | Dostępne dane |
|---|---:|---:|---|
| Basic | Bezpłatna, samoobsługowa rejestracja | 5 000 wywołań/dzień | USA; zakres podstawowy |
| Premier Free | Bezpłatna po weryfikacji kwalifikowalności | Bez limitu dziennego wg tabeli planów | USA; dostęp do rynku spoza USA może być osobno uzgodniony / objęty rabatem |
| Premier Business | Wycena po kontakcie | Bez limitu dziennego wg tabeli planów | Ponad 62 rynki; cena zależy od wybranych państw |

Premier Free jest opisany dla startupów spełniających warunki (m.in. przychód i finansowanie poniżej progów), organizacji non-profit oraz studentów/grup badawczych. Sam fakt stworzenia konta nie daje dostępu do polskiego katalogu.

**Ważne dla tej konkretnej aplikacji:** dołączony Worker wywołuje Food Search v6, a oficjalna dokumentacja tego endpointu wymaga OAuth scope `premier`. Nie jest to więc integracja obsługująca samo konto Basic ze scope `basic`. Premier Free jest bezpłatny po weryfikacji, ale standardowo obejmuje dataset USA. Nie ma podstaw, by zakładać bezpłatny katalog polski. Dostęp do PL trzeba uzgodnić bezpośrednio z FatSecret; może być oferowany odpłatnie lub na indywidualnych warunkach.

Basic nadal istnieje jako darmowa edycja z limitem 5 000 wywołań/dzień, ale nie wystarcza do endpointu v6 użytego przez tę paczkę. W praktyce, jeśli nie masz przyznanego `premier` i prawa do regionu PL, wybór FatSecret nie zadziała dla polskich produktów. To ograniczenie licencji i uprawnień dostawcy, a nie błąd aplikacji. Aktualna tabela Premier Business osobno wymienia custom caching i data storage permissions; standardowe warunki nie pozwalają przechowywać większości pól odpowiedzi dłużej niż 24 godziny.

## Rejestracja i klucze

1. Otwórz [FatSecret Platform](https://platform.fatsecret.com/).
2. Załóż konto developerskie i potwierdź adres e-mail.
3. W panelu developerskim zarejestruj aplikację (nazwę, opis i stronę projektu).
4. Odczytaj `Client ID` i `Client Secret`.
5. Sprawdź w panelu, jaka edycja API i jakie regiony zostały aktywowane.
6. Jeżeli interesuje Cię rynek polski, skontaktuj się z FatSecret przed użyciem produkcyjnym i poproś o jednoznaczne potwierdzenie dostępu do `region=PL`, języka `pl` oraz scope `premier`. Poproś też o aktualne wymagania dotyczące stałego adresu IP serwera proxy, z którego pobierany jest token OAuth.

Dokumentacja:

- [Edycje i ceny](https://platform.fatsecret.com/api-editions)
- [Food Search v6](https://platform.fatsecret.com/docs/v6/foods.search)
- [Lokalizacja i kody regionów](https://platform.fatsecret.com/docs/guides/localization)
- [Dane, które można przechowywać](https://platform.fatsecret.com/docs/guides/storable-data)
- [Warunki planów i osobne uprawnienia przechowywania danych](https://platform.fatsecret.com/api-editions)

## Konfiguracja w Dzienniku Żywieniowym

Klucze FatSecret nie mogą być wpisane do `index.html`, `js/*.js` ani do repozytorium GitHub. Muszą być sekretami po stronie serwera.

1. Utwórz [Cloudflare account](https://dash.cloudflare.com/) — bezpłatny plan Workers wystarcza do małego projektu testowego w aktualnych limitach.
2. Utwórz Worker i wklej zawartość `cloudflare-worker/worker.js`.
3. W Worker → Settings → Variables and Secrets dodaj **Secrets**:
   - `FATSECRET_CLIENT_ID`
   - `FATSECRET_CLIENT_SECRET`
4. Dodaj opcjonalną zwykłą zmienną `ALLOWED_ORIGIN` z pełnym originem GitHub Pages (np. `https://konto.github.io`).
5. Nie dodawaj `FATSECRET_STORAGE_ALLOWED` przy standardowym dostępie. Ustaw ją na `true` dopiero po uzyskaniu od FatSecret pisemnego uprawnienia do trwałego cache'owania / przechowywania danych produktów.
6. Wdróż Worker.
7. Otwórz `https://NAZWA.workers.dev/health` i sprawdź `sources.fatsecret`. Powinno być `true`. `sources.fatsecretStorageAllowed` powinno pozostać `false`, o ile nie masz oddzielnej zgody na trwałe przechowywanie.
8. W aplikacji otwórz Ustawienia, wpisz adres Worker i kliknij Testuj połączenie.
9. W dzienniku wybierz katalog online i źródło FatSecret.

## Jak działa wywołanie

Worker uzyskuje token OAuth 2.0 metodą client credentials ze scope `premier`, a następnie wywołuje Food Search v6 z parametrami:

- `search_expression` — fraza użytkownika;
- `region=PL`;
- `language=pl`;
- `max_results` — maksymalnie 50;
- `page_number=0`.

Jeżeli FatSecret nie udostępnia PL dla Twojego konta, wybór FatSecret pokaże błąd. Aplikacja nie przełączy wtedy automatycznie zapytania na Open Food Facts. To celowe zachowanie, aby nie maskować problemu z uprawnieniami ani nie wysyłać danych do innego dostawcy bez zgody użytkownika.

## Czy pobrać całą bazę FatSecret raz na miesiąc?

Nie. Nie znalazłem w publicznej dokumentacji endpointu do masowego eksportu pełnej bazy produktów. Food Search v6 jest wyszukiwarką stronicowaną (do 50 wyników na stronę), a nie metodą bulk download.

Ponadto dokumentacja `Storable Data` wymienia jedynie określone identyfikatory (np. `food_id` i `serving_id`) jako wartości możliwe do przechowywania bezterminowo. Pozostałe dane zwrócone przez API nie powinny być cache'owane dłużej niż 24 godziny. Dlatego skrypt miesięczny w tej paczce nie pobiera FatSecret i nie zapisuje jego rekordów w lokalnej bazie. Przed utrwalaniem wartości odżywczych FatSecret w dzienniku/historycznych danych uzyskaj zgodę lub odpowiednią licencję od dostawcy.

## Cache i optymalizacja zapytań

- Wyniki w przeglądarce są trzymane w pamięci bieżącej karty maksymalnie 10 minut.
- Worker przechowuje wyniki w pamięci izolatu do 10 minut i współdzieli równoległe identyczne zapytania.
- Token OAuth jest trzymany do czasu bliskiego wygaśnięcia i odświeżany w razie potrzeby.
- Wyszukiwanie online jest ręczne (przycisk / Enter), a nie automatyczne przy każdym wpisanym znaku.
- Cache nie jest trwałym dumpem ani substytutem uprawnień licencyjnych. Produkty FatSecret są domyślnie tylko do podglądu i aplikacja blokuje ich dodanie do dziennika. Trwały zapis można włączyć wyłącznie po uzyskaniu odpowiedniej zgody: `FATSECRET_STORAGE_ALLOWED=true`.

## Typowe problemy

- **401 / invalid_client** — sprawdź Client ID i Client Secret w Worker Secrets.
- **403 / scope / region** — aplikacja FatSecret nie ma odpowiedniej edycji, scope `premier` lub aktywnego rynku PL. Skontaktuj się z FatSecret.
- **OAuth nie przyjmuje żądania / IP not allowed** — sprawdź wymóg allowlisty IP dla proxy. Standardowy Cloudflare Worker nie daje gwarancji dedykowanego stałego IP wyjściowego; może być konieczny backend z przypisanym stałym egress IP.
- **Brak wyników po polsku** — konto może zwracać jedynie dataset USA albo rekordy PL nie są dostępne dla tego planu.
- **Health pokazuje `fatsecret: false`** — jeden z sekretów Worker nie istnieje albo jest pusty.
- **Worker działa, ale nie ma wyników** — sprawdź logi Worker i odpowiedź FatSecret; wybór FatSecret nie odpytuje OFF jako fallback.
