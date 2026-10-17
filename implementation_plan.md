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
- `tests/`: Automatizované testy správnosti výpočtu příbuzenských vztahů, redukčních pravidel, NOZ atributů a GEDCOM parseru v Node.js (90 / 90 unit testů + 184 vztahů / 368 obousměrných auditních běhů)

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
21. Příprava grafických podkladů Google Play v `google-play/assets/` (ikona 512×512 px PNG, feature graphic 1024×500 px PNG).
22. Testování a optimalizace na reálném zařízení Xiaomi Redmi Note 11 Pro 5G přes ADB, nasnímání 5 oficiálních screenshotů (1080×2400 px) pro obchod Google Play.
23. Příprava GitHub Pages pro servírování `privacy.html` (`https://fila73.github.io/family-calc/privacy.html`) se souborem `.nojekyll` a konfigurací vzdáleného repozitáře.
24. Oprava a zjednodušení vyhledávání příbuzenské cesty v GEDCOMu (`js/engine/gedcom-parser.js`): doplnění přímých sourozeneckých hran přes `famc` (např. *manžel ➔ sestra* namísto oklikové cesty *manžel ➔ otec ➔ dcera*).
25. Vizuální zobrazení generačních šipek v GEDCOM cestě (`↗` nahoru k rodičům/předkům, `↘` dolů k dětem/potomkům, `→` sourozenci, `↔` manželé) a přesné rozlišení jmenných shod (Ladislav Červinka st. vs ml.) pomocí roků života a odznaků.
26. Zpřesnění biologického výpočtu DNA a právních vazeb u sešvagření (afinity): odstraněna chybná redukce odstraňující token manžela/manželky u synovců/prasynovců; řetězec *manžel ➔ sestra ➔ syn ➔ syn* nyní striktně zachovává afinitní vztah, **0 % sdílené DNA**, neexistenci překážky sňatku dle § 675 NOZ a zařazení mimo zákonné dědické třídy.
27. Zavedení oficiální nové ikony aplikace ze souboru `google-play/assets/icon-512.png` do Android `mipmap-*` hustot (klasická i kulatá ikona, adaptivní popředí a pozadí `#09090b`) a generování PWA ikon.
28. Sestavení nové verze aplikace (`scripts/build.js`, `cap sync`, Gradle `assembleDebug` a `bundleRelease`): `build-android/Rodinna-Kalkulacka-debug.apk` (4,76 MB) a `build-android/Rodinna-Kalkulacka-release.aab` (3,41 MB).
29. Nahrání rodokmenových GEDCOM souborů do úložiště telefonu (`/sdcard/Download/`) a instalace aktualizovaného APK balíčku do připojeného mobilu Xiaomi Redmi Note 11 Pro 5G přes ADB s ověřením spuštění.
30. Implementace nativního Immersive Sticky Fullscreenu v Androidu (`MainActivity.java`, `styles.xml`, `css/style.css`, `manifest.json`) a trvalého uzamčení orientace do portrait režimu (`android:screenOrientation="portrait"` v `AndroidManifest.xml` a `screen.orientation.lock('portrait')` v JS) s ověřením na reálném zařízení.
31. Zřízení veřejného repozitáře `fila73/family-calc` na GitHubu a aktivace GitHub Pages pro hosting aplikace a Privacy Policy (`https://fila73.github.io/family-calc/privacy.html`).
32. Zjednodušení vztahů v `cs.js` na čisté přirozené názvy bez nadbytečných duplicitních závorek v poli `name` (ponechání detailů pouze v `description`).
33. Sjednocení displeje do jedné stabilní karty `.result-unified-card` obsahující cestu i výsledek a vyřešení ořezu horní části na mobilních displejích.
34. Integrace barevných neonových generačních směrových šipek (`↗`, `↘`, `↔`, `→`) do kalkulačkové cesty (breadcrumbs).
35. Přesun akčních tlačítek (repro, share, strom) do svislého overlay sloupce vpravo (`.result-actions-vertical`) pro maximální šířku textu a odznaků.
36. Sestavení finálních instalačních balíčků APK i AAB a jejich ověření na reálném telefonu Xiaomi Redmi Note 11 Pro 5G.
37. Implementace redukčních pravidel pro sourozence dětí v `simplifyChain` (`s/d + b ➔ s`, `s/d + z ➔ d`) zajišťující správné zjednodušení řetězců typu `h, z, s, s, b` na **Prasynovec** a **Prateta**.
38. Vývoj nativního `AndroidTTS` bridge v `MainActivity.java` pro offline hlasovou syntézu v Android WebView.
39. Doladění responzivního rozložení karty výsledku (`min-height: 100%`, `flex-shrink: 0`, odstranění ořezu cesty).
40. Integrace skutečných jmen a životních dat (`*YYYY – †YYYY`) do vizuálního rodokmenu `#treeModal` při přenosu z GEDCOM souboru a obousměrná inverze stromu pro vzájemné vztahy.
41. Komplexní hloubkový audit celé aplikace a oprava zjištěných nálezů (sjednocení rozhraní `allowed`/`hasImpediment` a `class`/`classNumber` mezi enginem a UI, oprava DNA ~25 %, 3. dědické třídy, překážky sňatku a inverze u polorodých sourozenců `step_f,s`/`step_m,s`, oprava pohlaví mluvčího v porovnávači dvou osob a ve vzájemném pohledu, doplnění chybějících 3. generací a sešvagřených prastrýců/pratet z matčiny strany v `cs.js` na 184 vztahů, doplnění `modStep`/`modGod` v 5 slovnících, bilaterální synchronizace GEDCOMu, deduplikace CSS selektorů a zahrnutí `icons/` do `www/` a `sw.js` v19; rozšířeno na 90 / 90 unit testů a 368 / 368 auditních běhů).
42. Refaktoring hlavičky do striktně dvou řádků (Řádek 1: Název vlevo, přepínač jazyka a hamburger menu vpravo; Řádek 2: Podnadpis) a vytvoření dedikované obrazovky / modálu Nastavení aplikace (`#settingsModal`) s přepínači zvuků, haptiky, volbou jazyka a výchozího pohlaví probanda.
43. Pořízení a optimalizace kompletní sady 6 screenshotů pro Google Play Store ve striktním poměru stran 9:16 (1080×1920 px standard a 1350×2400 px high-res) z reálného zařízení Xiaomi Redmi Note 11 Pro 5G přes ADB:
    - `screenshot_1_calculator.png`: Hlavní kalkulačka s novou 2řádkovou hlavičkou, probandem, výpočtem Strýc, DNA ~25 %, 6. dědickou třídou, NOZ statusem a klávesnicí.
    - `screenshot_2_tree.png`: Vizuální minirodokmen (`#treeModal`) s grafickými avatary a zlatým zvýrazněním cíle výpočtu.
    - `screenshot_3_languages.png`: Výběr z 25 světových jazyků s rychlým vyhledáváním a jazykovými rodinami.
    - `screenshot_4_gedcom.png`: Import rodokmenu GEDCOM (.ged), genealogická cesta a detekce překážky sňatku dle § 675 NOZ.
    - `screenshot_5_quiz.png`: Kvíz a procvičování rodinných vztahů se skóre, sérií, možnostmi A-D a oslavou správné odpovědi.
    - `screenshot_6_settings.png`: Nová dedikovaná obrazovka Nastavení aplikace (zvuky, haptika, jazyk, výchozí pohlaví probanda).
44. Vyčištění nekonservativních vztahů ze slovníku `cs.js` (odstranění 23 netradičních položek vzniklých při plošném generování vazeb), zavedení striktního filtru tradičních/konzervativních rodinných vazeb `isConservative(key)` do genealogického kvízu (`generateQuizQuestion` v `js/app.js`), zachování 100% průchodnosti unit testů a znovupořízení screenshotu kvízu č. 5 pro Google Play v poměru 9:16 s čistou tradiční otázkou.
45. Podpora přirozených stejnopohlavních afinitních vazeb v kalkulačce (`b,h` = Švagr, `m,b,h` = Strýc, `f,b,h` = Strýc, `z,w` = Švagrová, `s,h` = Zeť, `d,w` = Snacha) při striktní izolaci genealogického kvízu (fond 164 konzervativních položek chráněný filtrem `isConservative(key)`). Rozšíření testovací sady o sekci 8 v `tests/reductions_mutual.test.js` na celkových **96 / 96 úspěšných unit testů**, sestavení debug APK a nasazení na telefon Xiaomi Redmi Note 11 Pro 5G i tablet Lenovo TB328XU.
46. Vygenerování produkčního podpisového klíče (`android/familycalc-release-key.jks`, 2048-bit RSA, platnost 10 000 dní), nastavení automatického podepisování přes `android/keystore.properties`, cílového rozhraní `targetSdkVersion = 36` (`minSdkVersion = 24`) a všech 4 položek R8 optimalizace Google Play (`minifyEnabled true`, `shrinkResources true`, `proguard-android-optimize.txt`, `android.enableR8.fullMode=true`, `android.r8.optimizedResourceShrinking=true`, `-repackageclasses` a ochranná pravidla v `proguard-rules.pro`) v `android/app/build.gradle` a kompilace kryptograficky podepsaného balíčku `build-android/Rodinna-Kalkulacka-release.aab` (2,18 MB, `versionCode 4`, `versionName "1.0.3"`) pro Google Play Console.
47. Zavedení pravidla prosté cesty (zákaz návratu do již použitého uzlu a automatické blokování tlačítek tvořících slepou uličku pomocí `getDeadEndTokens`), přepínače režimu vyhodnocení nejednoznačných vazeb (`preferMode`: `'own'` = *Vlastní rodina / Zkracovat* vs. `'step'` = *Preferovat nevlastní / Nezkracovat*) na liště modifikátorů (`#btnPreferMode`) i v Nastavení (`#settingsModal`), okamžitého zkracování řetězce s informační lištou (`#shortenNoticeBanner`) s možností ztlumení („Už nezobrazovat“) a přímého přepnutí na nevlastní vztah, přehledové tabulky pravidel s příklady v Nastavení i dokumentaci a rozšíření testovací sady na **113 unit testů** (`npm test`).
48. Hloubkový strukturní audit všech genderových kombinací ($2^k$) napříč 39 strukturními vzory českého příbuzenství, doplnění 58 chybějících kombinací v `generateDeepKinshipEntry` (`P,P,B,C,C`, `P,P,B,C`, `P,B,C,C`, `C,S,P`, `SP,S`, `P,P,P,B,S`, `S,P,P,P`, `C,C,C,S`) a `step_h`/`step_w` v `cs.js`, oprava 3-tokenových redukcí (`[muž] ➔ s/d ➔ f`) a omezení `preferMode === 'step'` na `i === 0`, zmapování hranice přechodu na *Vzdálený příbuzný* a rozšíření automatizované testovací sady na **143 / 143 unit testů** (včetně 340 kombinací vzorů a 680 inverzí).
49. Vydání verze **1.1.0 (`versionCode 5`)**: přidání přehledu **Novinky / What's New (Changelog)** přímo do aplikace (`#menuWhatsNewBtn` v menu a `#settingsWhatsNewDetails` v Nastavení) s klasickými tagy `feat` a `bug`, příprava textů poznámek k vydání v `google-play/STORE_LISTING.md` (`<cs-CZ>` a `<en-US>`) a sestavení podepsaného Google Play balíčku `build-android/Rodinna-Kalkulacka-release.aab` a `build-android/Rodinna-Kalkulacka-debug.apk`.

