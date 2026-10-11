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

## Nové nápady a budoucí rozšíření
1. **Export vizuální kartičky do PNG obrázku (Social Card Generator)**:
   - Možnost vygenerovat líbivý obrázek (např. pro Instagram Stories, WhatsApp nebo rodinnou skupinu) s grafickým minirodokmenem, jménem vztahu a DNA shodou přímo přes HTML5 Canvas.
2. **Kalkulačka dědických tříd (Zákonná dědická posloupnost ČR dle NOZ)**:
   - Zobrazení, do které dědické třídy (1. až 6. třída podle nového občanského zákoníku) daný příbuzný spadá, a jaká by byla jeho pozice při dědění ze zákona.
3. **Detektor překážek manželství (Právní přípustnost sňatku)**:
   - Právní indikátor, zda mezi EGO a vybraným příbuzným existuje zákonná překážka pro uzavření manželství (v ČR zákaz sňatku mezi předky a potomky a mezi sourozenci).
4. **Hlasové zadávání (Speech Recognition / Web Speech API)**:
   - Možnost nadiktovat rodinný řetězec hlasem (např. „otec matka bratr syn“) a nechat kalkulačku automaticky vyťukat klávesy.
5. **Import & Export GEDCOM souborů**:
   - Možnost nahrát genealogický soubor `.ged` ze softwaru MyHeritage, Gramps nebo Ancestry a vyhledat přesná pojmenování reálných předků v rodokmenu.
6. **Režim porovnání dvou osob v rodokmenu ("Jak jsou tito dva příbuzní?")**:
   - Zadání dvou různých větví z jednoho společného předka a určení jejich vzájemného vztahu.
