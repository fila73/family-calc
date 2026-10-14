# Nice to Have (Nápady a budoucí rozšíření)

## Dokončené položky
- [x] 1. **Vizuální minirodokmen na displeji (`#treeModal`)**:
  - Interaktivní rodokmenový strom zobrazený po kliknutí na tlačítko 🌳 u výsledku kalkulačky. Zobrazuje jednotlivé osoby v posloupnosti (Já ➔ Otec ➔ Bratr...), avatary, vztahové spojnice a zvýrazněný cílový uzel.
- [x] 2. **Režim "Kvíz / Procvičování" (`#quizModal`)**:
  - Výukový minikvíz s náhodným generováním otázek z aktuálního slovníku, okamžitou vizuální odezvou (správně/špatně), počítadlem skóre a sérií (streak), vysvětlením a tlačítkem pro další otázku.
- [x] 3. **Reverzní vyhledávač ("Kdo je to...") (`#dictModal`)**:
  - Plnohodnotný slovník rodinných vztahů s fulltextovým vyhledáváním (např. *ujec*, *deveř*, *zelva*, *šurin*) a možností přenést definovaný vzorec přímo do kalkulačky.
- [x] 4. **Hlasové čtení výsledku (TTS - Text-to-Speech)**:
  - Tlačítko 🔊 s využitím Web Speech API předčítající název a definici příbuzného v odpovídajícím jazyce (`cs-CZ`, `sk-SK`, `en-US`, `de-DE`, `ja-JP`, `vi-VN` atd.) s animací zvukových vln.
- [x] 5. **Sdílení výsledku (Share & Copy Card)**:
  - Tlačítko ↗ generující reprezentativní textovou kartičku pro nativní sdílení přes Web Share API nebo zkopírování do schránky.
- [x] 6. **Genetická shoda a stupeň příbuzenství (Consanguinity & DNA %)**:
  - Algoritmický výpočet stupně příbuzenství (počet porodů dle občanského práva) a odhadu sdílené DNA (např. *🧬 ~12.5% DNA · 4. stupeň* pro bratrance, *~50% DNA* pro rodiče/sourozence, *0% DNA* pro afinitní a kmotrovské vazby).
- [x] 7. **Historie výpočtů (`#historyModal`)**:
  - Automatické ukládání posledních výpočtů do `localStorage` s možností obnovení libovolného dřívějšího vztahu zpět na klávesnici.

- [x] 8. **Export vizuální kartičky do PNG obrázku (Social Card Generator)**:
  - Generování grafické kartičky pro sociální sítě na HTML5 Canvas s tmavým AMOLED motivem, avatarem, názvem vztahu, popisem a DNA shodou s možností stažení přímo do souboru PNG.
- [x] 9. **Kalkulačka dědických tříd (Zákonná dědická posloupnost ČR dle NOZ)**:
  - Právní zařazení do 1. až 6. dědické třídy podle nového občanského zákoníku s detailním komentářem dědických podílů.
- [x] 10. **Detektor překážek manželství (Právní přípustnost sňatku dle § 675 NOZ)**:
  - Automatické právní posouzení možnosti uzavření manželství (přísný zákaz v přímé linii a mezi sourozenci, přípustnost u bratranců a afinit).
- [x] 11. **Hlasové zadávání (Speech Recognition / Web Speech API)**:
  - Možnost nadiktovat rodinný řetězec hlasem (česky i anglicky) a nechat kalkulačku automaticky rozpoznat klíčová slova a vyťukat vztah.
- [x] 12. **Režim porovnání dvou osob v rodokmenu ("Jak jsou tito dva příbuzní?")**:
  - Zadání dvou různých větví z jednoho výchozího probanda a okamžité určení jejich vzájemného vztahu.
- [x] 13. **Hamburger vysouvací menu (`#menuModal`)**:
  - Přehledná postranní nabídka seskupující všech 8 pokročilých nástrojů pro čisté mobilní rozhraní.

- [x] 14. **Klávesové zkratky pro desktop (Keyboard Hotkeys & Modal)**:
  - Kompletní podpora ovládání z fyzické klávesnice (`F`, `M`, `S`, `D`, `B`, `Shift+B`, `X`, `Shift+X`, `H`, `W`, `C`, `⌫`, `Enter`, `R`, `Tab`, `G`, `Space`, `?`) a přehledný modální dialog nápovědy.
- [x] 15. **Zvuková odezva klávesnice (Web Audio Click Feedback)**:
  - Syntetizovaný zvuk kliku klávesy s nulovou latencí a přepínačem v záhlaví (`🔊` / `🔇`) s perzistencí v `localStorage`.
- [x] 16. **Import & analýza GEDCOM souborů (`.ged`)**:
  - Parsování standardních genealogických exportů z MyHeritage, Gramps, Ancestry, vestavěný ukázkový 4-generační rodokmen, grafové hledání nejkratší příbuzenské cesty a přenos zjištěného vztahu do kalkulačky.
- [x] 17. **Kompletní audit a oprava redukčních pravidel a vzájemného vztahu**:
  - Vyřešen případ Macecha ➔ jiný manžel ➔ syn/dcera = Nevlastní bratr/sestra (`step_b` / `step_z`).
  - Zpřesněna redukce sešvagřených synovců a neteří (`w/h ➔ b/z ➔ s/d = b ➔ s/d`).
  - Opravena reciproční perspektiva ve vzájemném vztahu, přidán vizuální neonový indikátor aktivního tlačítka, odznak a breadcrumbs.
  - Headless testovací suite (`npm test`) s nulovým dopadem na browser kredity a 100% úspěšností (75 testů).
- [x] 18. **Příprava pro Google Play Store a mobilní sestavení**:
  - Kompletní balíček v `google-play/` obsahující zásady ochrany soukromí (`privacy.html`), texty zápisu (`STORE_LISTING.md`) a příručku pro Keystore a release (`RELEASE_GUIDE.md`).
- [x] 19. **Čistá etická monetizace (Zero-ads, Zero-tracking Tip Jar)**:
  - Modální okno `#donateModal` s českou QR platbou (SPAYD standard) a přímým číslem účtu (0 % poplatků), mezinárodními odkazy (Ko-fi, Buy Me a Coffee) a tlačítkem pro hodnocení na Google Play.
- [x] 20. **Oprava kontrastu rozbalovacích comboboxů v GEDCOM porovnávači**:
  - Doplnění `color-scheme: dark;` a explicitního tmavého pozadí pro `option` prvky v dialogu výběru osob pro zabránění bílého písma na bílém podkladu.
- [x] 21. **Sestavení nativní Android aplikace (APK a AAB)**:
  - Úspěšné sestavení instalačního debug APK balíčku `Rodinna-Kalkulacka-debug.apk` (4,25 MB) pro okamžité otestování v mobilu.
  - Úspěšné sestavení produkčního bundle balíčku `Rodinna-Kalkulacka-release.aab` (3,11 MB) připraveného pro nahrání do Google Play Console.
- [x] 22. **Grafické podklady pro Google Play (Store Assets v `google-play/assets/`)**:
  - Ikona aplikace 512 × 512 px PNG (32-bit RGB bez průhlednosti, tmavé pozadí `#09090b`).
  - Feature Graphic 1024 × 500 px PNG s AMOLED vizuálem a nápisem Rodinná kalkulačka.
- [x] 23. **Reálné screenshoty pro Google Play (1080 × 2400 px přes ADB)**:
  - 5 oficiálních snímků obrazovky nasnímaných přímo na připojeném telefonu Xiaomi Redmi Note 11 Pro 5G: kalkulačka, minirodokmen, 25 jazyků, GEDCOM analyzátor a kvíz.
- [x] 24. **GitHub Pages nasazení a Privacy Policy URL**:
  - Soubor `.nojekyll`, stránka `privacy.html` a nastavený remote pro `https://fila73.github.io/family-calc/privacy.html`.
- [x] 25. **Přímé sourozenecké vazby a generační směrové šipky v GEDCOMu**:
  - Přímé spojení dětí stejného `FAMC` (1kroková sestra namísto okliky otec ➔ dcera), směrové šipky `↗` nahoru, `↘` dolů, `→` sourozenci, `↔` manželé a disambiguace jmen podle roků života.
- [x] 26. **Oprava biologického DNA a právního výpočtu pro afinitní sešvagření**:
  - Sešvagření synovci a prasynovci (např. *manžel ➔ sestra ➔ syn ➔ syn*) mají striktně **0 % sdílené DNA**, nulovou překážku sňatku a statut mimo zákonné dědické třídy.
- [x] 27. **Oficiální nová AMOLED ikona aplikace v Androidu i PWA**:
  - Vygenerovány ikony z `google-play/assets/icon-512.png` do všech rozlišení `mipmap-*` (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi) pro standardní i adaptivní ikonu s tmavým AMOLED pozadím `#09090b` a PWA `icons/icon-512.png` a `icons/icon-192.png`.
- [x] 28. **Aktualizované sestavení (APK/AAB), instalace na mobil a nahrání GEDCOM souborů**:
  - Sestaven nový debug APK (4,76 MB) a release AAB (3,41 MB). Debug balíček nainstalován do připojeného mobilu Xiaomi Redmi Note 11 Pro 5G přes ADB a do `/sdcard/Download/` nahrány GEDCOM stromy `9i7efa_248548bkfd5396b740a9bl_A.ged` i `bb2769_70868886mn5a77f2196bb9_A.ged`.
- [x] 29. **Nativní Immersive Fullscreen a uzamčení Portrait orientace**:
  - Odstraněn status bar a navigation bar přes `WindowInsetsControllerCompat` v `MainActivity.java` a `styles.xml`.
  - Pevně uzamčena orientace na výšku přes `android:screenOrientation="portrait"` v `AndroidManifest.xml` a `screen.orientation.lock('portrait')` v JS.
- [x] 30. **Sjednocení displeje do jediné kompaktní karty (`.result-unified-card`)**:
  - Genealogická cesta, název vztahu, odznaky a vysvětlení sloučeny do jednoho bloku. Odstraněno vytlačování cesty mimo displej na mobilech.
- [x] 31. **Vertikální overlay akčních tlačítek (repro, share, strom)**:
  - Přesunuto 3 tlačítek do svislého sloupce v pravém horním rohu karty, uvolněna plná horizontální šířka pro texty.
- [x] 32. **Generační směrové šipky v kalkulačce**:
  - Dynamické šipky `↗` (modrá, předek), `↘` (zelená, potomek), `↔` (růžová, partner), `→` (oranžová, sourozenec) v řetězci breadcrumbs.
- [x] 33. **Zjednodušení českého názvosloví v `cs.js`**:
  - Odstranění zbytečných závorek z primárního názvu vztahu (*Dědeček*, *Strýc*, *Synovec*...), přesný genealogický popis ponechán v detailním vysvětlení.
- [x] 34. **Oficiální hosting na GitHub Pages**:
  - Zřízen repozitář `fila73/family-calc` s funkčními GitHub Pages na `https://fila73.github.io/family-calc/` a `https://fila73.github.io/family-calc/privacy.html`.
- [x] 35. **Nativní offline Android TextToSpeech (TTS Bridge)**:
  - Implementován přímý bridge `android.speech.tts.TextToSpeech` v `MainActivity.java` propojený přes `@JavascriptInterface` do `window.AndroidTTS`. Vyřešena nepodpora Web Speech API v Chromium WebView bez nutnosti externích knihoven.
- [x] 36. **Redukční pravidlo pro sourozence dětí (`s/d + b ➔ s`, `s/d + z ➔ d`)**:
  - Vyřešen řetězec *já ➔ manžel ➔ sestra ➔ syn ➔ syn ➔ bratr* redukcí na `h, z, s, s` (**Prasynovec** / vzájemně **Prateta**).
- [x] 37. **Odstranění prázdného prostoru nad displejem a zalamování cesty**:
  - Vyměněn `margin-top: auto` za `min-height: 100%`, karta plynule navazuje na panel volby pohlaví. Odstraněn výškový strop `max-height: 64px` na cesty a duplicitní čip vzájemného vztahu.
- [x] 38. **Ochrana proti překrývání odznaků s vysvětlením (`flex-shrink: 0`)**:
  - Nastaven flex-shrink na všech vnitřních sekcích karty výsledku pro stoprocentní čitelnost i při velkém množství odznaků a dlouhých popisech.
- [x] 39. **Integrace skutečných jmen a životních dat do vizuálního rodokmenu z GEDCOMu**:
  - `#treeModal` při přenosu cesty ze souboru `.ged` zobrazuje skutečná jména předků i potomků, data narození a úmrtí (`*1928 – †2005`), generační šipky a podporuje obousměrnou perspektivu při vzájemném vztahu.
- [x] 40. **Komplexní technický, genealogický a právní audit aplikace (90 unit testů, 184 vztahů / 368 auditních běhů)**:
  - Sjednoceno rozhraní právních kalkulátorů (`allowed`/`hasImpediment` u sňatků a `class`/`classNumber` u dědických tříd), opraven výpočet DNA (~25 %), 3. dědické třídy (§ 1637 NOZ), překážky manželství (§ 675 NOZ) a obousměrné inverze u polorodých sourozenců (`step_f,s`, `step_m,s`), opraveno pohlaví mluvčího v porovnávači dvou osob a ve vzájemném pohledu, doplněny kombinace 3. generace a sešvagřených prastrýců/pratet v `cs.js`, doplněny štítky `modStep`/`modGod` ve všech 25 jazycích, bilaterální synchronizace GEDCOMu, vyčištěny duplicitní CSS selektory a doplněna složka `icons/` do buildu `www/` a cache `sw.js` (`family-calc-v19`).
- [x] 41. **Dvouřádková hlavička & samostatná obrazovka Nastavení aplikace (`#settingsModal`)**:
  - Restrukturalizace záhlaví do čistého 2řádkového rozložení (Řádek 1: Hlavní název `Rodinná kalkulačka` + rychlý přepínač jazyka `🇨🇿 CS ▾` + hamburger `☰`; Řádek 2: podnadpis `Kalkulačka příbuzenských vztahů`). Samostatné tlačítko zvuku přesunuto do nového Nastavení. Vytvořena dedikovaná sekce v menu `⚙️ Nastavení aplikace` a komplexní AMOLED modální okno s přepínači zvukových efektů, haptiky/vibrací, volbou jazyka a výchozího pohlaví probanda.
- [x] 42. **Sada 6 oficiálních screenshotů pro Google Play v poměru stran 9:16**:
  - Příprava skriptu `scripts/generate_store_screenshots.ps1` pro konverzi a vygenerování 6 oficiálních snímků ve formátu 9:16 (1080×1920 px i 1350×2400 px) z reálného telefonu Xiaomi Redmi Note 11 Pro 5G přes ADB, zahrnujících kalkulačku s 2řádkovou hlavičkou, vizuální minirodokmen, výběr z 25 jazyků, GEDCOM analyzátor, kvíz a obrazovku Nastavení.
- [x] 43. **Vyčištění slovníku a striktní konzervativní rodinné vazby v kvízu**:
  - Odstranění 23 nestandardních stejnojmenných/stejnopohlavních svazků z `cs.js` (např. `h,b,h`), implementace přísného konzervativního filtru `isConservative(key)` v generátoru kvízových otázek a distractorů, 100% průchodnost testovací sady (90/90 unit testů) a přefocení screenshotu kvízu č. 5 pro Google Play v poměru 9:16 s tradiční genealogickou otázkou.


## Nové nápady a budoucí rozšíření
1. **Export rodokmenu do vektorového SVG / PDF**:
   - Stažení minirodokmenu jako škálovatelné vektorové grafiky nebo tiskového PDF dokumentu.
2. **Výběr grafických motivů (AMOLED Dark, Light Parchment, Cyberpunk)**:
   - Volba mezi současným AMOLED motivem, historickým papírovým stylem (pergamen) a světlým režimem.
3. **Generování rodinných certifikátů a diplomů**:
   - Tiskový formát formálního rodinného diplomu s ozdobným rámečkem osvědčujícím přesný genealogický vztah.

