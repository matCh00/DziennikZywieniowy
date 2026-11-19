# Open Food Facts — konto, API i bezpłatny eksport

## Czy to jest bezpłatne?

Tak. Publiczne odczyty Open Food Facts nie wymagają klucza API ani opłaty. Projekt prosi jednak o zarejestrowanie aplikacji / wypełnienie formularza użycia API oraz ustawienie własnego User-Agent, aby rozpoznawać legalne i uzasadnione wykorzystanie danych.

- Oficjalna dokumentacja API: https://openfoodfacts.github.io/openfoodfacts-server/api/
- Strona projektu: https://world.openfoodfacts.org/
- Formularz wykorzystania API i reuse: https://openfoodfacts.github.io/openfoodfacts-server/api/
- Zasady licencji: https://openfoodfacts.github.io/openfoodfacts-server/api/tutorials/license-be-on-the-legal-side/

## Konto — krok po kroku

1. Otwórz https://world.openfoodfacts.org/ i zarejestruj bezpłatne konto.
2. Uzupełnij profil użytkownika. Konto jest przydatne do zgłaszania poprawek i dodawania produktów.
3. Wypełnij formularz API usage / reuse z dokumentacji i opisz projekt: osobisty dziennik żywieniowy, aplikacja webowa na GitHub Pages, użycie wyłącznie odczytu i lokalnego katalogu.
4. W kodzie backendu (Cloudflare Worker) ustaw własny User-Agent. W tej paczce Worker używa `DziennikZywieniowy/1.0` z `CONTACT_EMAIL`.
5. Nie wykonuj zapytań search-as-you-type. Oficjalne limity wyszukiwania są restrykcyjne (10 żądań na minutę na IP); aplikacja uruchamia wyszukiwanie online ręcznie po kliknięciu/Enter.

Do publicznych zapytań GET nie jest potrzebny klucz. Uwierzytelnianie jest potrzebne do zapisu/edycji danych w OFF, czego ta aplikacja nie robi.

## Online search

Dziennik Żywieniowy używa Search-a-licious:

- Endpoint: `POST https://search.openfoodfacts.org/search`
- treść JSON zawiera `q`, `langs: ["pl", "en"]`, `page_size`, `page` i listę żądanych `fields`.
- Worker normalizuje wyniki do kalorii i makroskładników na 100 g.

Nie korzystamy już z `cgi/search.pl` jako głównego źródła. Ten starszy endpoint miał ograniczenia i mógł zwracać 503. Oficjalna dokumentacja Search-a-licious: https://openfoodfacts.github.io/search-a-licious/users/ref-openapi/.

## Pełny eksport produktów

Dla dużego katalogu nie należy odpytwać API po jednym produkcie. OFF zaleca pobranie pliku eksportu CSV/JSONL. W tej paczce skrypt używa strumieniowego pliku:

`https://static.openfoodfacts.org/data/openfoodfacts-products.jsonl.gz`

Eksport jest wielogigabajtowy i regularnie odświeżany. Wielkość oraz czas ostatniej aktualizacji mogą się zmieniać. Skrypt czyta gzip w strumieniu, nie tworzy pełnej rozpakowanej kopii i filtruje tylko produkty polskie z wartościami energii oraz rozpoznanym sklepem/marką własną.

Zobacz `docs/BAZA_LOKALNA_OFF.md`.

## Licencje — koniecznie przeczytaj przed publikacją

Open Food Facts rozdziela licencje:

- baza danych: Open Database License (ODbL);
- zawartość poszczególnych rekordów: Database Contents License (DBCL);
- zdjęcia produktów: Creative Commons Attribution-ShareAlike (CC BY-SA).

Przy rozpowszechnianiu bazy pochodnej (np. wyeksportowanego katalogu polskich produktów sklepów) mogą powstać obowiązki atrybucji i udostępniania bazy na warunkach ODbL. Nie mieszaj tej bazy z danymi, których licencja zabrania dalszego udostępniania. Wyniki FatSecret są w aplikacji odseparowane od katalogu OFF i nie są eksportowane do lokalnego dumpu.

W UI aplikacji i w regulaminie wskazano źródło OFF. Jeśli udostępniasz publicznie zmodyfikowany katalog lub korzystasz ze zdjęć, zweryfikuj wymagania ODbL/CC BY-SA z oficjalną dokumentacją lub doradcą prawnym.

## Ograniczenia jakości danych

Open Food Facts to baza społecznościowa. Rekordy mogą być niekompletne, nieaktualne lub błędne. Produkt może nie mieć wpisanego sklepu, kraju, gramatury lub kalorii. Pieczywo luzem i produkty z lady często nie mają identyfikatora EAN. Nie istnieje mechanizm gwarantujący pełne SKU czterech sieci.

Wartości z etykiety konkretnego opakowania są nadrzędne wobec danych społecznościowych.
