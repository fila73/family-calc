# Rodinná kalkulačka (Kalkulačka příbuzenských vztahů)

Interaktivní webová aplikace inspirovaná čínskou kalkulačkou příbuzenství (*Terms of Kinship* / 亲戚关系计算器). Umožňuje zadávat postupné řetězce rodinných vazeb pomocí kalkulačkových tlačítek a okamžitě zjišťovat přesné pojmenování příbuzného v češtině, včetně historických/archaických variant a detailního vysvětlení.

## Klíčové vlastnosti
- **Kalkulačkové rozhraní**: ergonomické mobilní rozložení klávesnice s AMOLED tmavým motivem.
- **Kompletní české názvosloví**: podpora vztahů podle české Wikipedie, včetně přímých předků/potomků, pobočných linií (strýcové, tety, bratranci a sestřenice z více kolen, synovci a neteře) i sešvagření (tchán, tchyně, švagr, švagrová, zeť, snacha, svat, svatka).
- **Historické & archaické názvy**: *ujec*, *stryna*, *tetec*, *posel*, *deveř*, *šurin*, *zelva*, *svak*, *starosvat* a další.
- **Inteligentní redukční pravidla**: automatické zjednodušování složených řetězců (např. *Bratr ➔ Syn ➔ Matka* = **Švagrová** / *bratřina*, *Sestra ➔ Syn ➔ Otec* = **Švagr**).
- **Modifikátory klávesnice**:
  - **`⇧ Nevlastní`**: zadávání nevlastních rodičů (*Otčím*, *Macecha*), pastorků i polorodých a nevlastních sourozenců (*jednobřišní* i *jednokrevní* bratr/sestra).
  - **`✝ Křestní`**: duchovní příbuzenství (*Kmotr*, *Kmotra*, *Kmotřenec*, *Kmotřenka*).
- **Oboustranný výpočet (互查)**: přepnutí perspektivy – okamžité zjištění, jak daný příbuzný oslovuje vás ("Kdo jsem já pro něj?").
- **Volba pohlaví EGO / probanda**: muž / žena (výrazně ovlivňuje partnerské a vzájemné vztahy).
- **Vizuální minirodokmen (`#treeModal`)**: grafické schéma genealogické cesty s avatary, vztahovými štítky a zvýrazněním cíle.
- **Kvíz rodinných vztahů (`#quizModal`)**: interaktivní procvičování a trénink genealogických i archaických pojmů se skóre a sériemi.
- **Hlasové předčítání výsledku (🔊 TTS)**: syntéza řeči ve všech 25 jazycích pro usnadnění přístupnosti a výslovnosti.
- **Sdílení výsledku (↗ Share)**: generování formátované vizitky vztahu s emoji pro rychlé sdílení na sociálních sítích či zkopírování do schránky.
- **Generátor PNG kartiček (HTML5 Canvas)**: vytvoření a stažení reprezentativní vizitky s tmavým motivem přímo do obrázkového souboru PNG.
- **Genetická shoda a stupeň příbuzenství (🧬 DNA %)**: výpočet kanonického stupně příbuzenství dle počtu porodů v linii a odhadu sdílené DNA.
- **Kalkulačka dědických tříd ČR (⚖️ NOZ)**: automatické právní zařazení příbuzného do 1.–6. dědické třídy podle nového občanského zákoníku s výkladem dědických podílů.
- **Detektor překážek manželství (💍 § 675 NOZ)**: vyhodnocení zákonné přípustnosti sňatku (přísný zákaz v přímé linii a mezi sourozenci).
- **Hlasové zadávání / Diktování (🎙️ Speech Recognition)**: nadiktování rodinného řetězce hlasem s automatickým rozpoznáváním klíčových slov.
- **Porovnání dvou osob v rodokmenu (👥)**: stanovení vzájemného vztahu dvou libovolných členů rodiny.
- **Import a analýza GEDCOM souborů (📜 .ged)**: načtení reálných rodokmenů z Ancestry, MyHeritage či Gramps, vestavěný ukázkový 4-generační strom, grafové vyhledání cesty a přenos vztahu do kalkulačky.
- **Klávesové zkratky pro desktop (⌨️ Hotkeys)**: plnohodnotné ovládání z fyzické klávesnice s nápovědním modálem (`?`).
- **Zvukové efekty klávesnice (🔊 Web Audio)**: diskrétní syntetizované kliknutí při stisku klávesy s přepínačem v záhlaví.
- **Historie výpočtů (🕒)**: automatický záznam provedených kalkulací s možností návratu k libovolnému předchozímu vztahu.
- **Slovník rodinných vztahů (📖)**: fulltextový reverzní vyhledávač termínů s přenosem vzorce přímo do kalkulačky.
- **Hamburger vysouvací menu (☰)**: přehledné mobilní drawer menu pro rychlý přístup ke všem 10 pokročilým nástrojům.
- **Škálovatelný výběr jazyků s vyhledáváním**: moderní dialogové okno s okamžitým fulltextovým vyhledáváním (např. *pol*, *jap*, *deutsch*, *viet*, *ukr*, *tur*), rychlými čipy pro nedávno použité jazyky a seskupením do jazykových rodin/regionů.
- **25 plně lokalizovaných světových jazyků**:
  - Čeština 🇨🇿, Slovenčina 🇸🇰, Polski 🇵🇱, Deutsch 🇩🇪, English 🇬🇧, Français 🇫🇷, Italiano 🇮🇹, Español 🇪🇸, Русский 🇷🇺, 中文 🇨🇳, 日本語 🇯🇵, 한국어 🇰🇷, Tiếng Việt 🇻🇳,
  - Українська 🇺🇦, Português 🇵🇹, Nederlands 🇳🇱, Magyar 🇭🇺, Türkçe 🇹🇷, Ελληνικά 🇬🇷, Svenska 🇸🇪, हिन्दी 🇮🇳, Bahasa Indonesia 🇮🇩, العربية 🇸🇦, Hrvatski 🇭🇷, Română 🇷🇴.
- **Připraveno pro mobilní aplikace**: čistý kód bez zbytečných závislostí, podpora PWA a připravenost pro zabalení do Android (APK/AAB) a iOS pomocí Capacitoru.

