# Testy

Uruchom w katalogu głównym projektu:

```bash
node --test tests/*.test.mjs
python -m unittest discover -s tests -v
for f in js/*.js cloudflare-worker/*.js sw.js; do node --check "$f"; done
python -m json.tool manifest.webmanifest
```

Testy routingu FatSecret/Open Food Facts używają zamockowanych odpowiedzi HTTP. Sprawdzają, że wybranie `source=fatsecret` wywołuje wyłącznie endpointy FatSecret, a `source=off` wywołuje wyłącznie Search-a-licious. Nie wymagają sekretów API. Nie dowodzą, że rzeczywiste konto FatSecret ma prawo do rynku PL.
