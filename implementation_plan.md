# Implementation Plan - Rodinná kalkulačka (Terms of Kinship)

Vytvoření webové kalkulačky rodinných vztahů inspirované čínskou kalkulačkou příbuzenství (podle poskytnutého vzoru `1791674306641.jpg`) s plnou podporou českého názvosloví podle české Wikipedie (včetně historických/archaických tvarů) a architekturou připravenou pro vícejazyčnost (i18n) a budoucí export do Android a iOS (Capacitor/Cordova ready).

## 1. Uživatelské požadavky & Vzor
- **Vzor (`1791674306641.jpg`)**:
  - Mobilní rozhraní kalkulačky s tmavým AMOLED motivem.
  - Horní panel: "Terms of kinship" / "Rodinná kalkulačka" + nastavení pohlaví probanda (JÁ) + volba jazyka.
  - Displej: interaktivní řetězec vztahů (např. *Můj otec → matka → bratr...*) s možností krokování / zpětného mazání.
  - Výsledek: velký zvýrazněný název vztahu (např. *Prastrýc*), alternativní/staročeské názvy (*ujec*, *deveř*, *zelva*, *svak*...), vysvětlení cesty a generačního odstupu.
  - Klávesnice (4 sloupce):
    - Řádek 1: Manžel | Manželka | C (Clear) | ⌫ (Backspace)
    - Řádek 2: Otec | Matka | Syn | Dcera
    - Řádek 3: Bratr (st./ml.) | Bratr / Sestra (st./ml.) | Sestra
    - Řádek 4: Vzájemný vztah (互查) | = (Spočítat)
- **Podpora jazyků (25 plně integrovaných světových jazyků)**:
  - Čeština (výchozí, detailní pojmy dle Wikipedie cs.wikipedia.org/wiki/Seznam_členů_rodiny)
  - Slovenčina, Polski, Deutsch, English, Français, Italiano, Español, Русский, 中文, 한국어, 日本語, Tiếng Việt, Українська, Português, Nederlands, Magyar, Türkçe, Ελληνικά, Svenska, हिन्दी, Bahasa Indonesia, العربية, Hrvatski, Română.
  - Moderní modální dialog pro výběr jazyků s živým vyhledáváním (live search), rychlými čipy pro nedávno použité jazyky a seskupením do jazykových rodin (`js/i18n/languages.js`).
- **Nástroje a doplňkové funkce (Hamburger Drawer Menu ☰)**:
  - Slovník rodinných vztahů a reverzní vyhledávač
  - Interaktivní genealogický kvíz se skóre a sériemi
  - Historie výpočtů s okamžitým obnovením
  - Generátor a export vizitky do PNG obrázku (HTML5 Canvas)
  - Kalkulačka dědických tříd ČR dle NOZ (1.–6. třída)
  - Detektor překážek manželství dle § 675 NOZ
  - Hlasové zadávání (diktování) přes Web Speech API
  - Porovnání dvou osob v rodokmenu
  - Import a analýza GEDCOM souborů (`.ged`) s ukázkovým stromem a grafovým vyhledávačem
  - Klávesové zkratky pro fyzickou klávesnici desktopu a dialog nápovědy (`#shortcutsModal`)
  - Web Audio syntetizátor zvuku stisku kláves s přepínačem v záhlaví
  - Hlasové předčítání (TTS) ve všech 25 jazycích
  - Vizuální minirodokmen (`#treeModal`) s grafickými spojnicemi
  - Výpočet stupně příbuzenství a genetické shody (DNA %)
- **Mobilní platformy (Android & iOS)**:
  - Responzivní webová aplikace (Vanilla JS/ES6+, CSS3, moderní layout)
  - PWA připravenost (manifest, offline worker, touch UX, haptic feedback)
  - Capacitor / Cordova kompatibilní struktura (snadný build do APK/AAB a iOS Xcode projektu)

## 2. Architektura projektu
- `index.html`: Hlavní aplikace a rozvržení kalkulačky (včetně dialogů pro slovník, menu, jazyky, kvíz, historii, dědictví, sňatky, diktování, porovnání, GEDCOM a zkratky)
- `css/style.css`: Prémiový moderní UI design (AMOLED dark theme, skleněné efekty, kalkulačkový grid, plynulé animace a responzivita)
- `js/engine/`:
  - `kinship-engine.js`: Algoritmický model vztahů (normalizace řetězce, redukce cyklů, inverze perspektivy 互查, dědické třídy, překážky manželství, DNA %)
  - `gedcom-parser.js`: Parsování standardu GEDCOM 5.5 / 5.5.1, extrakce osob/rodin a BFS vyhledávání nejkratší cesty
- `js/i18n/`:
  - `languages.js`: Centrální registr 25 jazykových metadat a kategorií pro vyhledávač
  - `index.js`: Správce slovníků a exporty pro všech 25 jazyků
  - Jednotlivé jazykové balíčky (`cs.js` až `ro.js`)
- `js/app.js`: Řízení stavu, reakce na stisk kláves, haptika a zvuk, rendering displeje, dialogy, export PNG, hlasové vstupy/výstupy, GEDCOM analyzátor
- `tests/`: Automatizované testy správnosti výpočtu příbuzenských vztahů a GEDCOM parseru v Node.js (49 / 49 testů)

## 3. Postup implementace
1. Inicializace dokumentace (`implementation_plan.md`, `README.md`, `README_CZ.md`, `PLUGIN_DEV.md`, `jobs_done.md`, `nice_to_have.md`).
2. Vytvoření testovací sady kinship enginu (TDD přístup pro ověření všech větví rodokmenu z Wikipedia).
3. Implementace výpočetního enginu rodinných vztahů a invertoru perspektivy (互查).
4. Implementace jazykových slovníků (rozšířeno na 25 jazyků).
5. Vytvoření moderního HTML/CSS uživatelského rozhraní s věrnou kalkulačkovou ergonomií.
6. Doplnění interaktivních funkcí (nastavení pohlaví EGO, režim "jak říká on mně", modifikátory Shift/Křestní).
7. Implementace škálovatelného výběru jazyků s live search vyhledávačem a recent čipy.
8. Hamburger drawer menu s 8 nástroji (dědictví, sňatky, PNG export, hlas, porovnání...).
9. Konfigurace pro Android/iOS (PWA manifest, ikony, viewport meta tagy, Capacitor konfigurace).
10. Otestování v prohlížeči a Node testech (47 / 47 testů).
11. Oprava a zpřesnění redukčních pravidel (Macecha/Otčím ➔ jiný manžel/manželka ➔ syn/dcera = Nevlastní bratr/sestra).
12. Oprava inverze `step_h` a `step_w` v `invertChain` a korekce mluvčího z pohledu cílové osoby při vzájemném vztahu.
13. Zdokonalení UI vzájemného vztahu (aktivní stav tlačítka `#keyMutual`, indikátor v breadcrumbs a odznak).
14. Vytvoření headless testovací sady (`tests/reductions_mutual.test.js`) s rychlým ověřením bez nutnosti browseru (celkem 75 testů).
15. Oprava kontrastu rozbalovacích comboboxů v GEDCOM dialogu (`color-scheme: dark;` a explicitní tmavé pozadí `option`).
16. Příprava kompletního balíčku pro registraci do Google Play Store (`google-play/PRIVACY_POLICY.md`, `privacy.html`, `google-play/STORE_LISTING.md`, `google-play/RELEASE_GUIDE.md`).
17. Implementace etické monetizace bez sledování a reklam (dialog `#donateModal` s českou QR platbou SPAYD, Ko-fi, Buy Me a Coffee a hodnocením na Google Play).
18. Inicializace a plná konfigurace nativního Android projektu přes Capacitor (`cz.fila73.familycalc`).
19. Úspěšné sestavení testovacího instalačního balíčku `Rodinna-Kalkulacka-debug.apk` (4,25 MB) a produkčního `Rodinna-Kalkulacka-release.aab` (3,11 MB) v Gradle s Java 17 a Android SDK 36.
20. Průběžné commitování do lokálního gitu a aktualizace stavu.

