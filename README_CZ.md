# Rodinná kalkulačka (Kalkulačka příbuzenských vztahů)

Interaktivní webová aplikace inspirovaná čínskou kalkulačkou příbuzenství (*Terms of Kinship* / 亲戚关系计算器). Umožňuje zadávat postupné řetězce rodinných vazeb pomocí kalkulačkových tlačítek a okamžitě zjišťovat přesné pojmenování příbuzného v češtině, včetně historických/archaických variant a detailního vysvětlení.

## Klíčové vlastnosti
- **Kalkulačkové rozhraní**: ergonomické mobilní rozložení klávesnice s AMOLED tmavým motivem.
- **Kompletní české názvosloví**: podpora vztahů podle české Wikipedie, včetně přímých předků/potomků, pobočných linií (strýcové, tety, bratranci a sestřenice z více kolen, synovci a neteře) i sešvagření (tchán, tchyně, švagr, švagrová, zeť, snacha, svat, svatka).
- **Historické & archaické názvy**: *ujec*, *stryna*, *tetec*, *posel*, *deveř*, *šurin*, *zelva*, *svak*, *starosvat* a další.
- **Inteligentní redukční pravidla**: automatické zjednodušování složených řetězců (např. *Bratr ➔ Syn ➔ Matka* = **Švagrová** / *bratřina*, *Sestra ➔ Syn ➔ Otec* = **Švagr**, *Macecha ➔ jiný manžel ➔ syn* = **Nevlastní bratr**, *Otčím ➔ jiná manželka ➔ syn* = **Nevlastní bratr**, *Manželka ➔ Bratr ➔ Syn* = **Synovec**).
- **Modifikátory klávesnice**:
  - **`⇧ Nevlastní`**: zadávání nevlastních rodičů (*Otčím*, *Macecha*), pastorků i polorodých a nevlastních sourozenců (*jednobřišní* i *jednokrevní* bratr/sestra, nepokrevní nevlastní bratr ze svazku rodičů).
  - **`✝ Křestní`**: duchovní příbuzenství (*Kmotr*, *Kmotra*, *Kmotřenec*, *Kmotřenka*).
- **Oboustranný výpočet (互查 / Vzájemný vztah)**: přepnutí perspektivy s vizuálním neonovým zvýrazněním tlačítka a breadcrumbs – okamžité zjištění, jak daný příbuzný oslovuje vás ("Kdo jsem já pro něj?"), s automatickým určením mluvčího dle cílové osoby.
- **Rychlé headless testování**: sada unit testů pokrývající 82 scénářů (`npm test`) a 160 vztahů (320 obousměrných auditních běhů) bez nutnosti spouštět prohlížeč.
- **Volba pohlaví EGO / probanda**: muž / žena (výrazně ovlivňuje partnerské a vzájemné vztahy).
- **Vizuální minirodokmen (`#treeModal`)**: grafické schéma genealogické cesty s avatary, vztahovými štítky a zvýrazněním cíle.
- **Kvíz rodinných vztahů (`#quizModal`)**: interaktivní procvičování a trénink genealogických i archaických pojmů se skóre a sériemi.
- **Hlasové předčítání výsledku (🔊 TTS)**: syntéza řeči ve všech 25 jazycích pro usnadnění přístupnosti a výslovnosti.
- **Sdílení výsledku (↗ Share)**: generování formátované vizitky vztahu s emoji pro rychlé sdílení na sociálních sítích či zkopírování do schránky.
- **Generátor PNG kartiček (HTML5 Canvas)**: vytvoření a stažení reprezentativní vizitky s tmavým motivem přímo do obrázkového souboru PNG.
- **Genetická shoda a stupeň příbuzenství (🧬 DNA %)**: výpočet kanonického stupně příbuzenství dle počtu porodů v linii a odhadu sdílené DNA (včetně striktního odlišení afinitního sešvagření s 0 % DNA od pokrevního příbuzenství).
- **Kalkulačka dědických tříd ČR (⚖️ NOZ)**: automatické právní zařazení příbuzného do 1.–6. dědické třídy podle nového občanského zákoníku s výkladem dědických podílů.
- **Detektor překážek manželství (💍 § 675 NOZ)**: vyhodnocení zákonné přípustnosti sňatku (přísný zákaz v přímé linii a mezi sourozenci).
- **Hlasové zadávání / Diktování (🎙️ Speech Recognition)**: nadiktování rodinného řetězce hlasem s automatickým rozpoznáváním klíčových slov.
- **Porovnání dvou osob v rodokmenu (👥)**: stanovení vzájemného vztahu dvou libovolných členů rodiny.
- **Import a analýza GEDCOM souborů (📜 .ged)**: načtení reálných rodokmenů z Ancestry, MyHeritage či Gramps, vestavěný ukázkový 4-generační strom, přímé propojování sourozenců, vizualizace cesty s generačními šipkami (`↗` nahoru, `↘` dolů, `→` sourozenec, `↔` partner), rozlišením shodných jmen a přenosem vztahu do kalkulačky.
- **Klávesové zkratky pro desktop (⌨️ Hotkeys)**: plnohodnotné ovládání z fyzické klávesnice s nápovědním modálem (`?`).
- **Zvukové efekty klávesnice (🔊 Web Audio)**: diskrétní syntetizované kliknutí při stisku klávesy s přepínačem v záhlaví.
- **Historie výpočtů (🕒)**: automatický záznam provedených kalkulací s možností návratu k libovolnému předchozímu vztahu.
- **Slovník rodinných vztahů (📖)**: fulltextový reverzní vyhledávač termínů s přenosem vzorce přímo do kalkulačky.
- **Hamburger vysouvací menu (☰)**: přehledné mobilní drawer menu pro rychlý přístup ke všem 10 pokročilým nástrojům.
- **Škálovatelný výběr jazyků s vyhledáváním**: moderní dialogové okno s okamžitým fulltextovým vyhledáváním (např. *pol*, *jap*, *deutsch*, *viet*, *ukr*, *tur*), rychlými čipy pro nedávno použité jazyky a seskupením do jazykových rodin/regionů.
- **25 plně lokalizovaných světových jazyků**:
  - Čeština 🇨🇿, Slovenčina 🇸🇰, Polski 🇵🇱, Deutsch 🇩🇪, English 🇬🇧, Français 🇫🇷, Italiano 🇮🇹, Español 🇪🇸, Русский 🇷🇺, 中文 🇨🇳, 日本語 🇯🇵, 한국어 🇰🇷, Tiếng Việt 🇻🇳,
  - Українська 🇺🇦, Português 🇵🇹, Nederlands 🇳🇱, Magyar 🇭🇺, Türkçe 🇹🇷, Ελληνικά 🇬🇷, Svenska 🇸🇪, हिन्दी 🇮🇳, Bahasa Indonesia 🇮🇩, العربية 🇸🇦, Hrvatski 🇭🇷, Română 🇷🇴.
- **Připraveno pro mobilní aplikace**: čistý kód bez zbytečných závislostí, podpora PWA a plná integrace s nativním Android projektem přes Capacitor (`cz.fila73.familycalc`).
- **Sestavené Android balíčky s novou ikonou**: v adresáři `build-android/` jsou k dispozici sestavené balíčky `Rodinna-Kalkulacka-debug.apk` (4,76 MB pro přímou instalaci do mobilu) a `Rodinna-Kalkulacka-release.aab` (3,41 MB pro Google Play Console) s plně integrovanou oficiální AMOLED ikonou (všechny hustoty mipmap a adaptivní vrstva s tmavým pozadím `#09090b`).
- **Registrace do Google Play Store**: kompletní podklady v adresáři `google-play/` (Zásady ochrany soukromí `privacy.html`, texty zápisu `STORE_LISTING.md`, příručka pro podpis a vydání `RELEASE_GUIDE.md`).
- **Grafické podklady pro Google Play v `google-play/assets/`**:
  - Ikona aplikace 512 × 512 px PNG (`icon-512.png`).
  - Hlavní banner 1024 × 500 px PNG (`feature-graphic-1024x500.png`).
  - 5 oficiálních screenshotů 1080 × 2400 px nasnímaných přímo na reálném telefonu Xiaomi Redmi Note 11 Pro 5G přes ADB (`screenshot_1_calculator.png` až `screenshot_5_quiz.png`).
- **Webová prezentace a zásady soukromí na GitHub Pages**:
  - `https://fila73.github.io/family-calc/`
  - `https://fila73.github.io/family-calc/privacy.html`
- **Celoobrazovkový režim (Fullscreen) & Portrait Lock**: nativní Immersive Sticky režim skrývající stavovou i navigační lištu na Androidu pro nerušený zážitek a pevné uzamčení orientace na výšku (portrait), zabraňující nežádoucímu přetáčení displeje.
- **Sjednocená karta výsledku & vertikální overlay akcí**:
  - Genealogická cesta, název vztahu, odznaky a vysvětlení tvoří jeden stabilní blok `.result-unified-card` – karta plynule navazuje na panel pohlaví a cesta se již na mobilech neořezává.
  - Akční ikony (🔊 repro, ↗ sdílení, 🌳 minirodokmen) jsou uspořádány vertikálně nad sebou jako overlay v pravém rohu, což ponechává plnou šířku displeje pro název vztahu a odznaky.
  - Generační šipky v cestě kalkulačky (`↗` modrá pro předka, `↘` zelená pro potomka, `↔` růžová pro partnera, `→` oranžová pro sourozence).
  - Čisté a přirozené názvosloví v češtině bez matoucích duplicitních závorek (např. čisté **Dědeček**, **Strýc**, **Synovec**).
  - Pokročilá redukční pravidla pro sourozence potomků (např. *syn ➔ bratr* = **syn**, *manžel ➔ sestra ➔ syn ➔ syn ➔ bratr* = **Prasynovec** / vzájemně **Prateta**).
- **Nativní Android TextToSpeech offline**: přímý bridge na `android.speech.tts.TextToSpeech` v `MainActivity.java` zaručuje spolehlivé hlasové předčítání přímo v mobilní aplikaci bez závislosti na browser Web Speech API.
- **Čistá etická monetizace (Zero-ads & Zero-tracking)**: žádné reklamy, žádné analytické ani sledovací skripty. Aplikace funguje 100% offline. Možnost dobrovolného příspěvku v menu (dialog `#donateModal`) přes českou QR platbu SPAYD (0 % poplatků), Ko-fi / Buy Me a Coffee nebo 5hvězdičkové hodnocení na Google Play.


