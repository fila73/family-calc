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

## Nové nápady a budoucí rozšíření
1. **Export rodokmenu do vektorového SVG / PDF**:
   - Stažení minirodokmenu jako škálovatelné vektorové grafiky nebo tiskového PDF dokumentu.
2. **Výběr grafických motivů (AMOLED Dark, Light Parchment, Cyberpunk)**:
   - Volba mezi současným AMOLED motivem, historickým papírovým stylem (pergamen) a světlým režimem.
3. **Generování rodinných certifikátů a diplomů**:
   - Tiskový formát formálního rodinného diplomu s ozdobným rámečkem osvědčujícím přesný genealogický vztah.

