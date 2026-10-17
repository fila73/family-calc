# Rodinná kalkulačka (Kalkulačka příbuzenských vztahů)

Interaktivní webová aplikace inspirovaná čínskou kalkulačkou příbuzenství (*Terms of Kinship* / 亲戚关系计算器). Umožňuje zadávat postupné řetězce rodinných vazeb pomocí kalkulačkových tlačítek a okamžitě zjišťovat přesné pojmenování příbuzného v češtině, včetně historických/archaických variant a detailního vysvětlení.

## Klíčové vlastnosti
- **Kalkulačkové rozhraní**: ergonomické mobilní rozložení klávesnice s AMOLED tmavým motivem.
- **Kompletní české názvosloví**: podpora vztahů podle české Wikipedie, včetně přímých předků/potomků, pobočných linií (strýcové, tety, bratranci a sestřenice z více kolen, synovci a neteře) i sešvagření (tchán, tchyně, švagr, švagrová, zeť, snacha, svat, svatka).
- **Historické & archaické názvy**: *ujec*, *stryna*, *tetec*, *posel*, *deveř*, *šurin*, *zelva*, *svak*, *starosvat* a další.
- **Inteligentní redukční pravidla**: automatické zjednodušování složených řetězců (např. *Bratr ➔ Syn ➔ Matka* = **Švagrová** / *bratřina*, *Sestra ➔ Syn ➔ Otec* = **Švagr**, *Macecha ➔ jiný manžel ➔ syn* = **Nevlastní bratr**, *Otčím ➔ jiná manželka ➔ syn* = **Nevlastní bratr**, *Manželka ➔ Bratr ➔ Syn* = **Synovec**).
- **Modifikátory klávesnice a přepínač preference**:
  - **`⇧ Nevlastní`**: zadávání nevlastních rodičů (*Otčím*, *Macecha*), nevlastních dětí (*Nevlastní syn / Pastorek*, *Nevlastní dcera / Pastorkyně*) i polorodých a nevlastních sourozenců (*jednobřišní* i *jednokrevní* bratr/sestra, nepokrevní nevlastní bratr ze svazku rodičů).
  - **`✝ Křestní`**: duchovní příbuzenství (*Kmotr*, *Kmotra*, *Kmotřenec*, *Kmotřenka*).
  - **Přepínač `🏠 Vlastní (zkracovat)` / `🔀 Preferovat nevlastní`**: určuje, jak vyhodnocovat nepřímé okliky zadané bez modifikátoru `⇧ Nevlastní` (dostupný přímo nad klávesnicí i v Nastavení aplikace).
- **Pravidlo prosté cesty a prevence slepých uliček**: cesta v rodokmenu nikdy nevede zpět do již navštíveného uzlu. Tlačítka, která by vedla výhradně zpět na tutéž osobu (např. *Manžel* ihned po *Manželka*, nebo *Otec* po *Já [muž] ➔ Syn*), jsou v běžném režimu automaticky **zablokována (disabled)** a zpřístupní se po stisku `⇧ Nevlastní`.
- **Oboustranný výpočet (互查 / Vzájemný vztah)**: přepnutí perspektivy s vizuálním neonovým zvýrazněním tlačítka a breadcrumbs – okamžité zjištění, jak daný příbuzný oslovuje vás ("Kdo jsem já pro něj?"), s automatickým určením mluvčího dle cílové osoby.
- **Rychlé headless testování**: sada unit testů pokrývající **113 scénářů** (`npm test`) a 188 vztahů (376 obousměrných auditních běhů) bez nutnosti spouštět prohlížeč.
- **Volba pohlaví EGO / probanda**: muž / žena (výrazně ovlivňuje partnerské a vzájemné vztahy).
- **Vizuální minirodokmen (`#treeModal`)**: grafické schéma genealogické cesty s avatary, vztahovými štítky, generačními šipkami a zvýrazněním cíle. Při přenosu z GEDCOMu navíc zobrazuje skutečná jména předků i potomků, data narození a úmrtí (`*1928 – †2005`) a obousměrnou perspektivu při vzájemném vztahu.
- **Kvíz rodinných vztahů (`#quizModal`)**: interaktivní procvičování a trénink genealogických i archaických pojmů se skóre a sériemi. Kvíz je striktně izolován a obsahuje výhradně tradiční/konzervativní rodinné vazby (fond 164 prověřených otázek). Kalkulačka naopak plně a přirozeně podporuje i stejnopohlavní afinity (např. *Bratr ➔ Manžel = Švagr*, *Matka ➔ Bratr ➔ Manžel = Strýc*, *Sestra ➔ Manželka = Švagrová*, *Syn ➔ Manžel = Zeť*, *Dcera ➔ Manželka = Snacha*).
- **Hlasové předčítání výsledku (🔊 TTS)**: syntéza řeči ve všech 25 jazycích pro usnadnění přístupnosti a výslovnosti.
- **Sdílení výsledku (↗ Share)**: generování formátované vizitky vztahu s emoji pro rychlé sdílení na sociálních sítích či zkopírování do schránky.
- **Generátor PNG kartiček (HTML5 Canvas)**: vytvoření a stažení reprezentativní vizitky s tmavým motivem přímo do obrázkového souboru PNG.
- **Genetická shoda a stupeň příbuzenství (🧬 DNA %)**: výpočet kanonického stupně příbuzenství dle počtu porodů v linii a odhadu sdílené DNA (včetně striktního odlišení afinitního sešvagření s 0 % DNA od pokrevního příbuzenství).
- **Kalkulačka dědických tříd ČR (⚖️ NOZ)**: automatické právní zařazení příbuzného do 1.–6. dědické třídy podle nového občanského zákoníku s výkladem dědických podílů.
- **Detektor překážek manželství (💍 § 675 NOZ)**: vyhodnocení zákonné přípustnosti sňatku (přísný zákaz v přímé linii a mezi sourozenci).
- **Hlasové zadávání / Diktování (🎙️ Speech Recognition)**: nadiktování rodinného řetězce hlasem s automatickým rozpoznáváním klíčových slov.
- **Porovnání dvou osob v rodokmenu (👥)**: stanovení vzájemného vztahu dvou libovolných členů rodiny.
- **Import a analýza GEDCOM souborů (📜 .ged)**: načtení reálných rodokmenů z Ancestry, MyHeritage či Gramps, vestavěný ukázkový 4-generační strom, přímé propojování sourozenců, vizualizace cesty s generačními šipkami (`↗` nahoru, `↘` dolů, `→` sourozenec, `↔` partner), rozlišením shodných jmen, přímým tlačítkem pro zobrazení vizuálního rodokmenu se jmény a životními daty a přenosem vztahu do kalkulačky.
- **Klávesové zkratky pro desktop (⌨️ Hotkeys)**: plnohodnotné ovládání z fyzické klávesnice s nápovědním modálem (`?`).
- **Zvukové efekty klávesnice & haptika (🔊📳)**: diskrétní syntetizované kliknutí při stisku klávesy a jemná haptická odezva s možností zapnutí/vypnutí v Nastavení.
- **Historie výpočtů (🕒)**: automatický záznam provedených kalkulací s možností návratu k libovolnému předchozímu vztahu.
- **Slovník rodinných vztahů (📖)**: fulltextový reverzní vyhledávač termínů s přenosem vzorce přímo do kalkulačky.
- **Hamburger vysouvací menu (☰) & Nastavení aplikace (⚙️)**: přehledné mobilní drawer menu pro rychlý přístup ke všem pokročilým nástrojům a dedikované obrazovce Nastavení aplikace (přepínače zvuků kláves, vibrací/haptiky, režimu vyhodnocení nejednoznačných vazeb, upozornění na zkrácení řetězce, výběr jazyka rozhraní, volba výchozího probanda a informace o soukromí).
- **Dvouřádková hlavička & rychlá volba jazyka**: čisté záhlaví rozdělené do 2 řádků (Řádek 1: Hlavní název + tlačítko jazyka s vlajkou `🇨🇿 CS ▾` + hamburger `☰`; Řádek 2: podnadpis bez nechtěného zalamování).
- **Škálovatelný výběr jazyků s vyhledáváním**: moderní dialogové okno s okamžitým fulltextovým vyhledáváním (např. *pol*, *jap*, *deutsch*, *viet*, *ukr*, *tur*), rychlými čipy pro nedávno použité jazyky a seskupením do jazykových rodin/regionů.
- **25 plně lokalizovaných světových jazyků**:
  - Čeština 🇨🇿, Slovenčina 🇸🇰, Polski 🇵🇱, Deutsch 🇩🇪, English 🇬🇧, Français 🇫🇷, Italiano 🇮🇹, Español 🇪🇸, Русский 🇷🇺, 中文 🇨🇳, 日本語 🇯🇵, 한국어 🇰🇷, Tiếng Việt 🇻🇳,
  - Українська 🇺🇦, Português 🇵🇹, Nederlands 🇳🇱, Magyar 🇭🇺, Türkçe 🇹🇷, Ελληνικά 🇬🇷, Svenska 🇸🇪, हिन्दी 🇮🇳, Bahasa Indonesia 🇮🇩, العربية 🇸🇦, Hrvatski 🇭🇷, Română 🇷🇴.
- **Připraveno pro mobilní aplikace**: čistý kód bez zbytečných závislostí, podpora PWA a plná integrace s nativním Android projektem přes Capacitor (`cz.fila73.familycalc`).
- **Sestavené, R8-optimalizované a podepsané Android balíčky s novou ikonou**: v adresáři `build-android/` jsou k dispozici sestavené balíčky `Rodinna-Kalkulacka-debug.apk` (5,24 MB pro přímou instalaci do mobilu/tabletu) a plně R8-optimalizovaný, kryptograficky podepsaný `Rodinna-Kalkulacka-release.aab` (2,18 MB, `versionCode 4`, cílící na API 36 se zpětnou kompatibilitou od Androidu 7.0 / `minSdkVersion 24`) s plně integrovanou oficiální AMOLED ikonou (všechny hustoty mipmap a adaptivní vrstva s tmavým pozadím `#09090b`).
- **Registrace do Google Play Store**: kompletní podklady v adresáři `google-play/` (Zásady ochrany soukromí `privacy.html`, texty zápisu `STORE_LISTING.md`, příručka pro podpis a vydání `RELEASE_GUIDE.md`).
- **Grafické podklady pro Google Play v `google-play/assets/`**:
  - Ikona aplikace 512 × 512 px PNG (`icon-512.png`).
  - 6 oficiálních screenshotů ve standardním formátu Google Play 9:16 (1080 × 1920 px standard i 1350 × 2400 px high-res) nasnímaných přímo na reálném telefonu Xiaomi Redmi Note 11 Pro 5G přes ADB (`screenshot_1_calculator.png` až `screenshot_6_settings.png` pokrývající kalkulačku s 2řádkovou hlavičkou, vizuální rodokmen, výběr z 25 jazyků, GEDCOM analyzátor, genealogický kvíz a samostatné Nastavení).
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

---

## Pravidla výpočtu, prostá cesta a řešení nejednoznačných vazeb

V genealogickém stromu mohou některé naklikané posloupnosti bez použití tlačítka `⇧ Nevlastní` znamenat buď zbytečnou okliku k vlastnímu příbuznému, nebo úmyslné vyjádření nevlastního/polorodého vztahu. Kalkulačka se proto řídí dvěma jasnými pravidly:

### 1. Pravidlo prosté cesty (zákaz návratu do použitého uzlu)
Cesta v rodokmenu **nikdy nevede zpět do již navštívené osoby**.
- **Příklad**: `Já ➔ Otec ➔ Syn` nikdy neznamená návrat zpět na `Já`, ale vždy označuje jiného syna mého otce (mého bratra či polobratra).
- **Slepá ulička (automatické zablokování tlačítka)**: Pokud by stisk klávesy vedl *výhradně* zpět na předchozí uzel (např. stisk `Manžel` ihned po `Manželka`, nebo stisk `Otec` po `Já [muž] ➔ Syn`), tlačítko se na klávesnici automaticky znepřístupní (`disabled`). Pokud chcete zadat dalšího manžela své manželky nebo otčíma svého syna, stačí stisknout modifikátor **`⇧ Nevlastní`**, který tlačítka odemkne (*Nový manžel*, *Otčím*).

### 2. Režimy vyhodnocení nejednoznačných vazeb (`🏠 Vlastní` vs. `🔀 Nevlastní`)
Pomocí přepínače v liště modifikátorů nad klávesnicí (nebo v **⚙️ Nastavení aplikace**) si můžete zvolit preferovaný předpoklad:
- **Režim `🏠 Vlastní (zkracovat)` *(výchozí)***: Předpokládá společnou rodinu a případnou okliku ihned **zkrátí přímo v naklikaném řetězci** na nejkratší cestu. Při zkrácení se zobrazí informační lišta s tlačítkem **„Chtěl(a) jsem nevlastní“** (které řetězec jedním klikem obnoví a přepne režim) a možností **„Už nezobrazovat“** (upozornění lze kdykoliv znovu zapnout v Nastavení).
- **Režim `🔀 Preferovat nevlastní (nezkracovat)`**: Naklikaný řetězec **nezkracuje** a vychází z logiky, že pokud jste nezvolili přímou klávesu (např. rovnou *Syn* nebo *Sestra*), zadáváte okliku právě proto, že jde o nevlastní či polorodou vazbu.

| Zadaná cesta | Režim `🏠 Vlastní (zkracovat)` | Režim `🔀 Preferovat nevlastní` |
| :--- | :--- | :--- |
| **Já ➔ Manželka ➔ Syn** | Zkrátí řetězec na **Já ➔ Syn** (*Syn*) | Nezkracuje ➔ **Nevlastní syn** (*Pastorek*) |
| **Já ➔ Otec ➔ Manželka** | Zkrátí řetězec na **Já ➔ Matka** (*Matka*) | Nezkracuje ➔ **Macecha** (*Nevlastní matka*) |
| **Já ➔ Otec ➔ Syn** | Zkrátí řetězec na **Já ➔ Bratr** (*Bratr*) | Nezkracuje ➔ **Polobratr jednokrevní** |
| **Já ➔ Bratr ➔ Sestra** | Zkrátí řetězec na **Já ➔ Sestra** (*Sestra*) | Nezkracuje ➔ **Nevlastní sestra** |
| **Já ➔ Bratr ➔ Otec** | Zkrátí řetězec na **Já ➔ Otec** (*Otec*) | Nezkracuje ➔ **Otčím** (*Nevlastní otec*) |


