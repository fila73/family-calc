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
- `code`: ISO kód jazyka (např. `cs`, `en`, `zh`, `sk`)
- `name`: Nativní název jazyka
- `labels`: Překlady prvků uživatelského rozhraní
- `relations`: Mapování normalizovaných relačních kódů na názvy, synonyma a vysvětlení
