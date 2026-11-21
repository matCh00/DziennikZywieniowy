/**
 * Walidator katalogu produktów ogólnych (sekcja „Ogólne” w js/products.js).
 *
 * Sprawdza to, co da się sprawdzić automatycznie i co realnie wskazuje na błąd
 * danych: komplet pól, unikalność identyfikatorów i nazw, zakresy makroskładników,
 * sumę makroskładników, zgodność energii z białkiem, tłuszem i węglowodanami
 * (4/9/4 kcal na gram) oraz sensowność wartości w obrębie kategorii produktu.
 *
 * Uruchomienie: node tools/validate_seed_products.mjs [--verbose]
 */
import { products, productCatalogInfo } from '../js/products.js';

// Katalog sklepowy ma własne kategorie i identyfikatory, więc walidator obejmuje
// produkty ogólne — dokładnie tę część, dla której zdefiniowano zakresy poniżej.
const seedProducts = products.filter((p) => p.store === 'Ogólne');

const verbose = process.argv.includes('--verbose');
const issues = [];
const warnings = [];
const sourceExceptions = [];

// Pozycje, dla których energia pochodzi wprost z tabeli źródłowej i jest niższa
// niż 4/9/4 z makroskładników, bo węglowodany w tych tabelach zawierają błonnik
// (otręby). Wartości źródłowe: USDA FDC — oat bran 246 kcal, wheat bran 216 kcal.
const SOURCE_ENERGY_EXCEPTIONS = new Set(['oats-bran', 'otreby-pszenne']);

// Zakresy wiarygodności dla kategorii (na 100 g). Nie zastępują źródła danych —
// wychwytują literówki i przecinki (np. tłuszcz 0,5 g zamiast 15,3 g w oliwkach).
const CATEGORY_RANGES = {
  'Owoce': { kcal: [20, 400], protein: [0, 8], fat: [0, 35], carbs: [0, 90], unit: [2, 400] },
  'Warzywa': { kcal: [5, 180], protein: [0, 10], fat: [0, 20], carbs: [0, 40], unit: [2, 400] },
  'Pieczywo': { kcal: [180, 460], protein: [2, 25], fat: [0, 27], carbs: [15, 82], unit: [5, 150] },
  'Produkty zbożowe': { kcal: [35, 600], protein: [0, 25], fat: [0, 55], carbs: [5, 90], unit: [5, 200] },
  'Nabiał i jaja': { kcal: [5, 800], protein: [0, 40], fat: [0, 85], carbs: [0, 25], unit: [5, 350] },
  'Mięso i ryby': { kcal: [40, 700], protein: [5, 40], fat: [0, 70], carbs: [0, 25], unit: [10, 350] },
  'Rośliny strączkowe': { kcal: [25, 400], protein: [0, 55], fat: [0, 25], carbs: [0, 72], unit: [20, 300] },
  'Konserwy': { kcal: [5, 260], protein: [0, 30], fat: [0, 25], carbs: [0, 30], unit: [3, 300] },
  'Tłuszcze i dodatki': { kcal: [0, 950], protein: [0, 26], fat: [0, 100], carbs: [0, 100], unit: [3, 60] },
  'Orzechy i przekąski': { kcal: [250, 800], protein: [0, 35], fat: [0, 80], carbs: [0, 90], unit: [5, 60] },
  'Słodycze': { kcal: [50, 620], protein: [0, 35], fat: [0, 45], carbs: [0, 75], unit: [5, 200] },
  'Dania gotowe': { kcal: [20, 350], protein: [0, 25], fat: [0, 25], carbs: [0, 40], unit: [20, 400] },
  'Napoje': { kcal: [0, 120], protein: [0, 6], fat: [0, 5], carbs: [0, 15], unit: [100, 600] },
};

const ID_RE = /^[a-z0-9][a-z0-9-]*$/;
const seenIds = new Map();
const seenNames = new Map();
const seenCanonical = new Map();
const CATEGORIES = new Set(Object.keys(CATEGORY_RANGES));

const normName = (value) => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ł/g, 'l')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

// „Wiśnie” i „Wiśnie świeże” to ta sama pozycja — świeżość/surowizna nie tworzy
// osobnego produktu, więc tytuł bez tych słów musi być unikalny.
const FRESHNESS_WORDS = new Set(['swiezy', 'swieza', 'swieze', 'surowy', 'surowa', 'surowe']);
const canonicalName = (value) => normName(value).split(' ').filter(w => w && !FRESHNESS_WORDS.has(w)).join(' ');

for (const p of seedProducts) {
  const where = p?.id || '(brak id)';
  for (const field of ['id', 'name', 'category', 'source', 'sourceKind', 'store', 'dataNote']) {
    if (typeof p?.[field] !== 'string' || !p[field].trim()) issues.push(`${where}: brak pola ${field}`);
  }
  if (!ID_RE.test(String(p?.id || ''))) issues.push(`${where}: id musi być małymi literami, cyframi i myślnikami`);
  if (String(p?.id || '').includes('--')) issues.push(`${where}: id zawiera podwójny myślnik`);
  if (/(^|-)[a-df-hj-np-vxy](-|$)/.test(String(p?.id || ''))) issues.push(`${where}: id ma jednoliterowy człon — prawdopodobnie zgubiono „ł”`);
  if (seenIds.has(p.id)) issues.push(`${where}: powtórzony identyfikator (drugi raz: ${p.name})`);
  seenIds.set(p.id, p.name);

  const key = normName(p.name);
  if (seenNames.has(key)) issues.push(`${where}: powtórzona nazwa „${p.name}” (wcześniej ${seenNames.get(key)})`);
  seenNames.set(key, p.id);

  const canonical = canonicalName(p.name);
  if (seenCanonical.has(canonical)) issues.push(`${where}: „${p.name}” powtarza produkt ${seenCanonical.get(canonical)} (ta sama nazwa bez określenia świeżości)`);
  seenCanonical.set(canonical, p.id);

  if (!CATEGORIES.has(p.category)) issues.push(`${where}: nieznana kategoria „${p.category}”`);

  for (const field of ['kcal100', 'protein100', 'fat100', 'carbs100']) {
    const v = p[field];
    if (typeof v !== 'number' || !Number.isFinite(v)) issues.push(`${where}: ${field} nie jest liczbą (${JSON.stringify(v)})`);
  }
  if (p.kcal100 < 0 || p.kcal100 > 950) issues.push(`${where}: kcal100=${p.kcal100} poza zakresem 0–950`);
  for (const field of ['protein100', 'fat100', 'carbs100']) {
    if (p[field] < 0 || p[field] > 100) issues.push(`${where}: ${field}=${p[field]} poza zakresem 0–100`);
  }
  const macroSum = p.protein100 + p.fat100 + p.carbs100;
  if (macroSum > 100.5) issues.push(`${where}: suma makroskładników ${macroSum.toFixed(1)} g > 100 g`);

  const range = CATEGORY_RANGES[p.category];
  if (range) {
    const checks = [
      ['kcal100', range.kcal],
      ['protein100', range.protein],
      ['fat100', range.fat],
      ['carbs100', range.carbs],
    ];
    for (const [field, [min, max]] of checks) {
      const v = Number(p[field]);
      if (Number.isFinite(v) && (v < min || v > max)) {
        issues.push(`${where}: ${field}=${v} poza zakresem kategorii „${p.category}” (${min}–${max})`);
      }
    }
  }

  if (p.unitWeight !== null && p.unitWeight !== undefined) {
    if (typeof p.unitWeight !== 'number' || !Number.isFinite(p.unitWeight) || p.unitWeight <= 0 || p.unitWeight > 10000) {
      issues.push(`${where}: unitWeight=${JSON.stringify(p.unitWeight)} nieprawidłowy`);
    } else if (range && (p.unitWeight < range.unit[0] || p.unitWeight > range.unit[1])) {
      issues.push(`${where}: unitWeight=${p.unitWeight} g poza zakresem kategorii „${p.category}” (${range.unit[0]}–${range.unit[1]} g)`);
    }
  }
  if (!Array.isArray(p.aliases)) issues.push(`${where}: aliases nie jest tablicą`);

  // Kontrola energetyczna Atwatera. Tolerancja uwzględnia błonnik, poliole
  // i zaokrąglenia etykiet (maks. 25% lub 30 kcal różnicy).
  const atwater = 4 * p.protein100 + 9 * p.fat100 + 4 * p.carbs100;
  const diff = Math.abs(atwater - p.kcal100);
  const tolerance = Math.max(30, p.kcal100 * 0.25);
  if (diff > tolerance && SOURCE_ENERGY_EXCEPTIONS.has(p.id)) {
    sourceExceptions.push(`${where} „${p.name}”: energia ${p.kcal100} kcal z tabeli źródłowej (błonnik w węglowodanach)`);
  } else if (diff > tolerance) {
    issues.push(`${where} „${p.name}”: energia ${p.kcal100} kcal, z makroskładników ${Math.round(atwater)} kcal (różnica ${Math.round(diff)})`);
  } else if (diff > Math.max(18, p.kcal100 * 0.12)) {
    warnings.push(`${where} „${p.name}”: energia ${p.kcal100} kcal vs ${Math.round(atwater)} kcal z makroskładników (do przejrzenia)`);
  }
}

if (productCatalogInfo.generic !== seedProducts.length) {
  issues.push(`productCatalogInfo.generic=${productCatalogInfo.generic}, a rekordów ogólnych jest ${seedProducts.length}`);
}
if (productCatalogInfo.count !== products.length) {
  issues.push(`productCatalogInfo.count=${productCatalogInfo.count}, a wszystkich rekordów jest ${products.length}`);
}
if (!/^\d{4}-\d{2}-\d{2}\.\d+$/.test(String(productCatalogInfo.version))) {
  issues.push(`productCatalogInfo.version=${productCatalogInfo.version} nie ma formatu RRRR-MM-DD.n`);
}

console.log(`Sprawdzono ${seedProducts.length} rekordów ogólnych (wersja ${productCatalogInfo.version}, cały katalog: ${products.length}).`);
if (verbose) warnings.forEach((w) => console.log(`OSTRZEŻENIE  ${w}`));
sourceExceptions.forEach((e) => console.log(`WYJĄTEK ŹRÓDŁOWY  ${e}`));
issues.forEach((i) => console.log(`BŁĄD  ${i}`));
console.log(`Błędy: ${issues.length} · ostrzeżenia: ${warnings.length}`);
process.exitCode = issues.length ? 1 : 0;
