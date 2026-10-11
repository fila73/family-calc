# Plugin & Platform Development Guide (Android & iOS)

Tento dokument popisuje architekturu a postup rozšíření a převodu webové aplikace do nativních mobilních platforem pro Android a iOS.

## 1. Architektura webového jádra
- Aplikace je postavena na moderním čistém JavaScriptu (ES6+ moduly), HTML5 a Vanilla CSS3.
- Žádné těžkopádné frameworky zabraňující přenositelnosti.
- Podpora offline režimu přes Service Worker a Web App Manifest.

## 2. Příprava pro mobilní platformy (Capacitor)
Nativní Android projekt je plně inicializován v adresáři `android/` (`cz.fila73.familycalc`):
1. `npm run build` – sestaví webové runtime soubory do složky `www/`.
2. `npx cap sync android` – synchronizuje webové assety a pluginy do `android/`.
3. Správa ikon: zdrojová grafika `google-play/assets/icon-512.png` se exportuje do všech hustot `android/app/src/main/res/mipmap-*/` a do webových `icons/icon-512.png` a `icons/icon-192.png`. Barva pozadí adaptivní ikony je definována v `res/values/ic_launcher_background.xml` (`#09090b`).
4. Celoobrazovkový režim a orientace: `AndroidManifest.xml` uzamyká orientaci na výšku (`android:screenOrientation="portrait"`) a `MainActivity.java` s `styles.xml` aktivují Immersive Sticky Fullscreen (skrytí stavové i navigační lišty pro nerušené ovládání kalkulačky).
5. Sestavení APK / AAB přes Gradle:
   - `cd android && .\gradlew.bat assembleDebug` – vytvoří testovací balíček `build-android/Rodinna-Kalkulacka-debug.apk` (4,76 MB).
   - `cd android && .\gradlew.bat bundleRelease` – vytvoří produkční balíček pro Google Play `build-android/Rodinna-Kalkulacka-release.aab` (3,41 MB).
6. Pro iOS (na macOS s Xcode):
   - `npx cap add ios`
   - `npx cap sync ios`
   - `npx cap open ios`

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
- Spusťte `npm test`, který sekvenčně spustí `tests/kinship.test.js` i `tests/reductions_mutual.test.js` (celkem 82 unit testů).
- Pro audit inverze všech 160 vztahů (320 obousměrných běhů) spusťte `node tests/audit_all.js`.
- Tyto testy zaručují 100% obousměrnou invertibilitu a správnost výpočtu DNA (včetně 0 % DNA pro afinitní vztahy).

## 6. Publikace do Google Play, GitHub Pages & Etická monetizace
Podrobné návody a podklady pro nahrání do Google Play Console jsou v adresáři `google-play/`:
- `google-play/RELEASE_GUIDE.md`: podrobný návod pro Keystore, AAB build, Data Safety deklaraci a IARC věkové hodnocení.
- `google-play/STORE_LISTING.md`: texty pro obchod v CZ i EN včetně grafických rozměrů.
- `google-play/PRIVACY_POLICY.md` & `privacy.html`: zásady nulového sběru dat (hostováno na GitHub Pages: `https://fila73.github.io/family-calc/privacy.html`).
- `google-play/assets/`: vygenerované grafické podklady pro Google Play (ikona 512×512, feature graphic 1024×500 a oficiální screenshoty 1080×2400).
- **GitHub Pages Hosting**: repozitář `fila73/family-calc` s automatickým hostingem na `https://fila73.github.io/family-calc/` a zásadami soukromí pro Google Play review.
- **Monetizace**: Aplikace dodržuje přísný model bez reklam a sledování. V menu (`#donateModal`) je integrována česká QR platba SPAYD, mezinárodní Ko-fi / Buy Me a Coffee a podpora formou hodnocení.


