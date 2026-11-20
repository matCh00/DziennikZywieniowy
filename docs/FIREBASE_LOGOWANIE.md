# Logowanie i synchronizacja kont — Firebase Email/Password

Aplikacja wymaga zalogowania. Logowanie i rejestracja odbywają się przez Firebase Authentication (e-mail/hasło). Firebase utrzymuje sesję przez `browserLocalPersistence`, więc po ponownym otwarciu strony użytkownik pozostaje zalogowany na tym urządzeniu. Aplikacja **nie zapisuje hasła** w localStorage, IndexedDB ani Firestore.

## 1. Utwórz / wybierz projekt Firebase

1. Otwórz https://console.firebase.google.com/ i utwórz projekt (albo wybierz istniejący).
2. W projekcie wybierz **Add app → Web** i zarejestruj aplikację.
3. Skopiuj publiczne wartości konfiguracji Web SDK.
4. Otwórz `js/firebase-config.js` i uzupełnij `apiKey`, `authDomain`, `projectId`, `appId`.

Konfiguracja Web SDK jest publiczna i może znajdować się w repozytorium GitHub Pages. Nie umieszczaj w niej klucza service account ani innych sekretów administracyjnych.

## 2. Włącz e-mail/hasło

1. Firebase Console → **Build → Authentication → Get started**.
2. Zakładka **Sign-in method**.
3. Włącz **Email/Password** (pierwsza opcja Email/Password; nie trzeba włączać Email link).
4. Zapisz.
5. W **Authentication → Settings → Authorized domains** dodaj domenę GitHub Pages, np. `twoj-login.github.io`. Jeśli używasz własnej domeny, dodaj również ją.

Rejestracja konta jest dostępna z modala logowania. Link „Nie pamiętasz hasła?” wysyła wiadomość resetującą przez Firebase.

## 3. Włącz Firestore i opublikuj reguły

1. Firebase Console → **Build → Firestore Database → Create database**.
2. Wybierz lokalizację odpowiednią dla użytkowników (lokalizacji bazy nie można później łatwo zmienić).
3. Otwórz zakładkę **Rules** i wklej zawartość pliku `firestore.rules` z tego repozytorium.
4. Kliknij **Publish**.

Reguły zezwalają zalogowanemu użytkownikowi na dostęp wyłącznie do dokumentów pod `users/{jego-uid}/...`. Nie publikuj reguł zezwalających na ogólny odczyt/zapis.

## 4. Jak dane są rozdzielane

Każde konto ma własną przestrzeń `users/{uid}/appData/`:

- `profile_female` — parametry kobiety, jej dzienniki i historia masy ciała;
- `profile_male` — parametry mężczyzny, jego dzienniki i historia masy ciała;
- `shared` — własne produkty, dania i plany tygodniowe, wspólne dla obu zakładek płci w ramach jednego konta;
- `preferences` — aktywny profil, ustawienia katalogu i adres Cloudflare Worker.

Dane różnych kont są od siebie odseparowane. Własne produkty, dania i plany są współdzielone między profilem kobiety i mężczyzny **na tym samym koncie**, nie między różnymi kontami.

Dla kompatybilności przy pierwszym logowaniu aplikacja wykrywa poprzedni, anonimowy zapis `dziennik-zywieniowy-v3` w przeglądarce i pyta, czy przenieść go na pierwsze zalogowane konto. Migracja jest opcjonalna. Po niej lokalny cache jest zapisywany pod kluczem zawierającym UID konta.

## 5. Cache logowania i bezpieczeństwo

- Firebase Auth `browserLocalPersistence` zapamiętuje sesję w pamięci przeglądarki.
- Hasło nie jest przechowywane przez aplikację.
- Wylogowanie usuwa aktywną sesję Firebase z bieżącej przeglądarki.
- Dane aplikacji są buforowane lokalnie per UID i synchronizowane z Firestore.
- Nie używaj wspólnego konta na niezaufanych urządzeniach. Na urządzeniu publicznym po pracy kliknij **Wyloguj**.
- Klucz Firebase Web API nie jest sekretem; bezpieczeństwo danych zapewniają reguły Firestore i uwierzytelnienie.

## 6. Ważne ograniczenia

Aplikacja działa jako statyczna strona GitHub Pages; Firebase Auth i Firestore są usługami zewnętrznymi. Bez poprawnej konfiguracji Firebase ekran logowania pozostanie blokadą i aplikacja nie pokaże dziennika. Wymagane jest połączenie internetowe do logowania i synchronizacji. Lokalne dane per konto pozostają w przeglądarce jako cache, ale nie zastępują kopii zapasowej.
