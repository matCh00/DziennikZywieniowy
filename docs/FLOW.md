# Przepływ danych w Dzienniku Żywieniowym

Dokument opisuje, jak aplikacja łączy **produkt → posiłek → dzień → danie → plan**.
Opis dotyczy wersji z jednym plikiem produktów (`js/products.js`), jednym plikiem dań
(`js/dishes.js`) i przykładowym planem tygodniowym (`js/plans.js`).

**Terminologia:** interfejs używa nazwy **„Dania”**. W kodzie i w Firestore nadal
występuje historyczna nazwa `recipes` / `state.recipes` — to techniczna nazwa magazynu
własnych dań, zachowana dla zgodności zapisanych danych.

---

## 1. Model danych

Wszystko trzymane jest w jednym obiekcie stanu (`state` w `js/app.js`), zapisywanym
w `localStorage` pod kluczem `dziennik-zywieniowy-v3:user:{uid}` i synchronizowanym
z Firestore w dokumencie konta (`profile_female`, `profile_male`, `shared`).

```
                 ┌────────────────────────────┐
                 │  PRODUKT (produkt)         │
                 │  products.js (readonly)     │
                 │  state.customProducts      │
                 └─────────────┬──────────────┘
                               │ wybór + gramatura
                               ▼
┌──────────────┐      ┌────────────────────────┐
│  PRZEPIS     │      │  WPIS (entry)          │
│  (danie)     │─────▶│  logs[profil][data]    │
│  ingredients │ gotowanie porcji            │
└──────┬───────┘      └───────────┬────────────┘
       │ przypisanie              │ suma kcal/makro
       ▼                          ▼
┌──────────────┐      ┌────────────────────────┐
│  PLAN        │      │  DZIEŃ (logs[data])    │
│  assignments │      │  entries[] + water     │
└──────────────┘      └────────────────────────┘
```

### 1.1 Produkt

| Pole | Znaczenie |
| --- | --- |
| `id` | stabilny identyfikator ASCII (`banana`, `roll-graham`, `custom:…`) |
| `name`, `category`, `aliases[]` | nazwa, kategoria i słowa do wyszukiwania |
| `kcal100`, `protein100`, `fat100`, `carbs100` | wartości **na 100 g** |
| `unitWeight` | orientacyjna masa 1 sztuki (do skrótów porcji) |
| `store`, `brand` | sklep/marka (dla wpisów własnych) |
| `source`, `sourceKind`, `dataNote`, `sourceUrl` | pochodzenie wartości i zastrzeżenie |

Dwa źródła produktów:

1. **Katalog startowy** — `products` z `js/products.js` (1540 pozycji: 1189 ogólnych i 351 sklepowych).
   Tylko do odczytu. Wartości referencyjne dla kategorii produktu, nie etykiety SKU.
2. **Produkty własne** — `state.customProducts`. Pełny CRUD w zakładce „Produkty”.
   `sourceKind: "custom"`.

Produkt nie zna żadnego dnia ani posiłku — jest czystą definicją wartości odżywczych.

### 1.2 Wpis w dzienniku (`entry`)

Wpis jest **kopią** wartości produktu w momencie dodania:

```js
{ id, name, brand, store, source, sourceKind, sourceId,
  grams, kcal100, kcal, protein, fat, carbs, meal, createdAt }
```

- `kcal = kcal100 * grams / 100`, makroskładniki analogicznie (zaokrąglenie do 0,1).
- Wpis **nie odwołuje się** do produktu przez `id`. Dzięki temu edycja lub usunięcie
  produktu nie zmienia historii dziennika.
- `meal` to jedna z wartości: Śniadanie, II śniadanie, Obiad, Podwieczorek, Kolacja, Przekąski.

### 1.3 Dzień

`logs[profil][data] = { entries: [...], water: number }`, gdzie `data` to `YYYY-MM-DD`.
Profil (`female` / `male`) rozdziela dzienniki, masę ciała i cele; produkty własne,
przepisy i plany są wspólne dla obu profili w ramach jednego konta.

### 1.4 Przepis (danie)

```js
{ id, name, description, instructions, meal, portions,
  ingredients: [{ name, grams, kcal100, kcal }],
  totalKcal, createdAt, updatedAt }
```

- `totalKcal` = suma `kcal` składników (kcal składnika liczone w momencie zapisu).
- `kcal` porcji = `totalKcal / portions`.
- Składnik nie jest powiązany z produktem przez `id` — zapisuje nazwę i kcal/100 g.
  To celowe: etykieta produktu może się zmienić, a przepis ma zostać policzony tak,
  jak go zapisano.
- Przepis nie jest wpisem w dzienniku. Dopiero dodanie go do dnia tworzy wpisy.

### 1.5 Plan tygodniowy

```js
{ id, title, startDate, assignments: [{ dayIndex, meal, recipeId, servings }],
  createdAt, updatedAt }
```

- `dayIndex` 0–6 liczony od `startDate`.
- Plan nie przechowuje kcal — liczy je na bieżąco z aktualnych przepisów.
- Plan nie zawiera produktów, tylko dania. To jedyne źródło pozycji planu.

---

## 2. Przepływy

### 2.1 Dodanie pojedynczego produktu do dnia

**Dziennik → „Dodaj produkt/danie/dzień” → tryb „Produkt”.**

1. Wyszukiwanie w katalogu startowym + produktach własnych (+ opcjonalny import OFF).
2. Wybór pozycji → panel porcji (posiłek, gramatura, kcal w porcji, skróty „1 szt.”).
3. „＋ Dodaj do dziennika” → `addEntry(product, grams, meal, entryDate)`.
4. Wpis trafia do `logs[profil][data].entries`; przeliczany jest bilans dnia,
   makroskładniki i paski postępu.

Walidacja: gramatura 0,1–10 000 g; produkty FatSecret bez prawa `data-storage`
mają zablokowany przycisk zapisu.

### 2.2 Dodanie dania (przepisu) do dnia

**Dziennik → tryb „Danie”.**

1. Lista pochodzi z `state.recipes` („Moje przepisy”).
2. Użytkownik wybiera danie, liczbę porcji i posiłek.
3. `addRecipeToDiary(recipe, servings, date, meal)` przelicza każdy składnik:
   `grams_składnika * servings / portions` i tworzy **osobny wpis na składnik**
   (nazwa składnika, kcal/100 g).
4. Suma wpisów jest równa `totalKcal * servings / portions`.

### 2.3 Dodanie wybranego dnia z planu

**Dziennik → tryb „Dzień z planu”.**

1. Lista planów z `state.plans`; po wyborze planu lista dni, które mają przypisania.
2. Podsumowanie pokazuje liczbę posiłków i kcal wybranego dnia.
3. `addPlanDayToDiary(planId, dayIndex)` dla każdego przypisania wywołuje
   `addRecipeToDiary(recipe, servings, entryDate, meal)`.
4. Wszystkie dania z dnia planu lądują w **dniu wybranym w dzienniku**, nie w dniu planu.

To jedyna droga dodania planu do dziennika. Nie ma już przycisku „Dodaj cały plan”.

### 2.4 Utworzenie dania

**Moje przepisy → „＋ Dodaj przepis”** (KREATOR DAŃ):

1. Nazwa, liczba porcji, typ posiłku.
2. Składniki: wyszukiwarka produktów z katalogu (autouzupełnianie nazwy i kcal/100 g)
   albo ręczne wpisanie wartości.
3. Podgląd „Całe danie / Na porcję” aktualizuje się po każdej zmianie.
4. Zapis wymaga: nazwy, co najmniej jednego składnika, gramatury 0,1–10 000 g,
   kcal/100 g 0–950, liczby porcji 1–30.

### 2.5 Utworzenie i edycja planu

**Plan tygodnia → „＋ Stwórz własny plan”** (KREATOR PLANU):

1. Nazwa i data rozpoczęcia.
2. Wiersze przypisań: dzień (0–6), posiłek, przepis, liczba porcji.
3. Zapis wymaga poprawnej daty, co najmniej jednego przypisania, istniejącego
   przepisu i porcji 0,25–20.

Edycja planu podmienia dokument o tym samym `id` i zachowuje `createdAt`.
Edycja planu **nie zmienia** wpisów już dodanych do dziennika.

### 2.6 Usunięcie przepisu — kaskada

Usunięcie dania usuwa je także ze wszystkich planów:

```
state.recipes = recipes.filter(...)
state.plans = plans.map(p => ({...p, assignments: p.assignments.filter(a => a.recipeId !== id)}))
```

Jeśli przepis jest użyty w planie, użytkownik dostaje ostrzeżenie w `confirm()`.
Wpisy w dzienniku pozostają nietknięte (są kopiami).

### 2.7 Profil, cel i wskaźniki

1. Oba profile (kobieta i mężczyzna) są wymagane przy pierwszym uruchomieniu.
2. REE liczone wzorem Henry’ego zależnym od płci i wieku, TDEE = REE × PAL,
   cel = TDEE × (1 − deficyt%), ale nie mniej niż REE.
3. Bilans dnia = cel − suma `kcal` wpisów; wartość ujemna oznacza przekroczenie.
4. Zmiana profilu przełącza cały dziennik (`logs`, `weights`) na drugi zestaw danych.

### 2.8 Nawodnienie i masa ciała

- Woda: `logs[profil][data].water`, przyciski +150/+250/+500 ml, cel orientacyjny 2000 ml.
- Masa: `weights[profil] = [{date, weight}]`; ostatni pomiar jest pokazywany w kafelku
  „Masa ciała”, a pomiar nie zmienia automatycznie `profile.weight`.

### 2.9 Zapis i synchronizacja

1. Każda zmiana woła `save()`: natychmiastowy zapis do `localStorage`.
2. Jeśli konto jest zalogowane, po 700 ms debounce wykonywany jest zapis do Firestore.
3. Przy logowaniu: najpierw odczyt chmury, potem migracja ewentualnych danych
   lokalnych z poprzedniej wersji (jednorazowe potwierdzenie).
4. Bez zalogowania aplikacja jest zablokowana bramką logowania — `state` nie jest
   zapisywany (brak `userStoreKey`).

### 2.10 Katalog i wyszukiwanie

- Tryb „Zapisana baza”: katalog startowy + produkty własne + opcjonalny import
  Open Food Facts z IndexedDB.
- Tryb „Wyszukiwanie online”: FatSecret / Open Food Facts / oba przez Cloudflare Worker.
- Wyniki FatSecret bez zgody `data-storage` są tylko do podglądu.
- Zakładka „Produkty” pokazuje katalog startowy i produkty własne w jednej liście
  (paginacja); filtr „Źródło” zawęża ją do własnych pozycji lub wybranej sieci.
  „＋ Dodaj do dziennika” przenosi do „Dziennika” z wybranym produktem, ale **nie dodaje**
  wpisu — dodanie zawsze wymaga akcji w karcie dziennika.

---

## 3. Niezmienniki i reguły

1. Wpis w dzienniku zawsze ma `grams > 0`, `kcal100` w zakresie 0–950 i `meal`
   z zamkniętej listy.
2. `kcal` wpisu jest zawsze proporcjonalne do `grams` i `kcal100`.
3. Plan może wskazywać wyłącznie istniejący przepis; usunięcie przepisu czyści plan.
4. Dzień planu dodaje wyłącznie przypisania z wybranego `dayIndex`.
5. Katalog startowy jest tylko do odczytu — jedyne mutowalne produkty to
   `state.customProducts`.
6. Wszystkie identyfikatory katalogu startowego są unikalne i w ASCII;
   waliduje to `tests/seed-products.test.mjs` oraz `tools/validate_seed_products.mjs`.
7. Energia wariantów przygotowania jest liczona z ich własnych makroskładników
   (4/9/4 kcal na gram), więc kcal i makro nie mogą się rozjechać.
8. Sumy dnia dodają wyłącznie zapisane w wpisach wartości (B, T, W); wpis bez
   pełnych makroskładników jest zgłaszany w `#macroNote` i nie wchodzi do sumy jako 0.
9. Udziały energii liczone są z 4/9/4 kcal na gram i zawsze sumują się do 100%;
   różnica względem kcal etykiety wynika z błonnika i zaokrągleń — dlatego dziennik
   pokazuje oba odczyty obok siebie.
10. Wartości wpisu zaokrąglane są do 0,1 (pół w górę, z tolerancją 1e-9), więc
   150 g banana (0,3 g tłuszczu / 100 g) daje 0,5 g, a nie 0,4 g.

---

## 4. Świadome uproszczenia

- Składnik przepisu zapisuje kcal/100 g z momentu tworzenia; późniejsza zmiana
  produktu w katalogu nie przelicza istniejących przepisów.
- Edycja lub usunięcie produktu własnego nie zmienia historycznych wpisów.
- Wartości katalogu startowego są referencyjne dla kategorii produktu; dla
  opakowania nadrzędna jest etykieta (rozporządzenie UE 1169/2011, deklaracja na 100 g).
- Katalog nie jest listą SKU czterech sieci — zawiera produkty codzienne i ich warianty
  spotykane w Lidlu, Biedronce, Kauflandzie i Carrefourze, opisane jako kategorie.

## 5. Źródła danych

- USDA FoodData Central — dane w domenie publicznej (CC0 1.0), https://fdc.nal.usda.gov/
- NIZP PZH — „Tabele wartości odżywczej produktów spożywczych i potraw” (licencja,
  wartości cytowane metodycznie), https://www.pzh.gov.pl/uslugi/tabele-wartosci-odzywczej-produktow/
- Rozporządzenie (UE) 1169/2011 — obowiązkowa deklaracja na 100 g / 100 ml,
  https://eur-lex.europa.eu/eli/reg/2011/1169/oj/pol
- DTU Frida 6.1 (CC BY 4.0) — pojedyncza pozycja „Bułka słodka drożdżowa”,
  https://frida.fooddata.dk/index.php/food/1334?lang=en

Kontrola jakości: `node tools/validate_seed_products.mjs` sprawdza komplet pól,
unikalność identyfikatorów i nazw, zakresy, sumę makroskładników oraz zgodność
energii z białkiem, tłuszczem i węglowodanami.
