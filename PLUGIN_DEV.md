# Plugin & Platform Development Guide (Android & iOS)

Tento dokument popisuje architekturu a postup rozšíření a převodu webové aplikace do nativních mobilních platforem pro Android a iOS.

## 1. Architektura webového jádra
- Aplikace je postavena na moderním čistém JavaScriptu (ES6+ moduly), HTML5 a Vanilla CSS3.
- Žádné těžkopádné frameworky zabraňující přenositelnosti.
- Podpora offline režimu přes Service Worker a Web App Manifest.

## 2. Příprava pro mobilní platformy (Capacitor)
Pro export do mobilních aplikací:
1. `npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios`
2. `npx cap init "FamilyCalc" "cz.familycalc.app" --web-dir "."`
3. Pro Android:
   - `npx cap add android`
   - `npx cap sync android`
   - `npx cap open android` (nebo sestavení přes Gradle v Android Studio či CLI)
4. Pro iOS:
   - `npx cap add ios`
   - `npx cap sync ios`
   - `npx cap open ios` (vyžaduje macOS a Xcode)

## 3. Vývoj jazykových pluginů / balíčků
Každý jazykový balíček implementuje standardní rozhraní v adresáři `js/i18n/`:
- `code`: ISO kód jazyka (v současnosti 25 jazyků: `cs`, `sk`, `pl`, `de`, `en`, `fr`, `it`, `es`, `ru`, `zh`, `ja`, `ko`, `vi`, `uk`, `pt`, `nl`, `hu`, `tr`, `el`, `sv`, `hi`, `id`, `ar`, `hr`, `ro`)
- `name`: Nativní název jazyka
- `labels`: Překlady prvků uživatelského rozhraní
- `relations`: Mapování normalizovaných relačních kódů na názvy, synonyma a vysvětlení

### Přidání nového jazyka do škálovatelného výběru
Pro zařazení jazyka do vyhledávače a dialogu:
1. Vytvořte modul `js/i18n/<kod>.js`.
2. Zaregistrujte jej v `js/i18n/languages.js` v poli `languagesRegistry` (specifikujte `code`, `czechName`, `englishName`, `localName`, `flag` a `group`).
3. V případě nové rodiny jazyků doplňte novou kategorii do `languageCategories`.
4. Exportujte slovník v `js/i18n/index.js` v objektu `dictionaries`.
5. Přidejte soubor do `ASSETS_TO_CACHE` v `sw.js`.
6. Přidejte ověřovací testy do `tests/kinship.test.js` nebo `tests/reductions_mutual.test.js`.

## 4. Přidání nového nástroje do Hamburger Drawer Menu
Postup pro integraci nového nástroje (např. GEDCOM import, audio efekty apod.):
1. Přidejte tlačítko do `#menuModal` v `index.html`.
2. Přidejte modalové okno pro zobrazení výstupu/dialogu s třídou `modal-overlay`.
3. V `js/app.js` namapujte obslužnou funkci otevření modalu a jeho logiku.
4. Přidejte styl v `css/style.css` v souladu s AMOLED motivem a designovým systémem.

## 5. Headless testování bez nutnosti prohlížeče
Pro rychlé a úsporné ověření správnosti všech vztahů a redukčních pravidel:
- Spusťte `npm test`, který sekvenčně spustí `tests/kinship.test.js` i `tests/reductions_mutual.test.js`.
- Pro audit inverze všech vztahů spusťte `node tests/audit_all.js`.
- Tyto testy zaručují, že žádný vztah nekončí jako "Vzdálený příbuzný".

