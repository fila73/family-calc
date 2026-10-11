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
- **Hlasové předčítání výsledku (🔊 TTS)**: syntéza řeči ve všech 13 jazycích pro usnadnění přístupnosti a výslovnosti.
- **Sdílení výsledku (↗ Share)**: generování formátované vizitky vztahu s emoji pro rychlé sdílení na sociálních sítích či zkopírování do schránky.
- **Genetická shoda a stupeň příbuzenství (🧬 DNA %)**: výpočet kanonického stupně příbuzenství dle počtu porodů v linii a odhadu sdílené DNA.
- **Historie výpočtů (🕒)**: automatický záznam provedených kalkulací s možností návratu k libovolnému předchozímu vztahu.
- **Slovník rodinných vztahů (📖)**: fulltextový reverzní vyhledávač termínů s přenosem vzorce přímo do kalkulačky.
- **Škálovatelný výběr jazyků s vyhledáváním**: moderní dialogové okno s okamžitým fulltextovým vyhledáváním (např. *pol*, *jap*, *deutsch*, *viet*), rychlými čipy pro nedávno použité jazyky a seskupením do jazykových rodin/regionů.
- **13 plně lokalizovaných jazyků**: Čeština 🇨🇿, Slovenčina 🇸🇰, Polski 🇵🇱, Deutsch 🇩🇪, English 🇬🇧, Français 🇫🇷, Italiano 🇮🇹, Español 🇪🇸, Русский 🇷🇺, 中文 🇨🇳, 日本語 🇯🇵, 한국어 🇰🇷, Tiếng Việt 🇻🇳.
- **Připraveno pro mobilní aplikace**: čistý kód bez zbytečných závislostí, podpora PWA a připravenost pro zabalení do Android (APK/AAB) a iOS pomocí Capacitoru.
