# Jobs Done - Záznam dokončených kroků

## [2026-10-11]
- [x] Prozkoumání referenčního snímku `1791674306641.jpg` (čínská kalkulačka rodinných vztahů / Terms of Kinship).
- [x] Analýza českého názvosloví rodinných vztahů z české Wikipedie (`cs.wikipedia.org/wiki/Seznam_členů_rodiny`), včetně archaických termínů (ujec, stryna, tetec, deveř, šurin, zelva, snacha, zeť, svat, pastorek...).
- [x] Inicializace lokálního git repozitáře a správa verzí.
- [x] Vytvoření řídicí dokumentace (`implementation_plan.md`, `README.md`, `README_CZ.md`, `PLUGIN_DEV.md`, `nice_to_have.md`, `jobs_done.md`).
- [x] Implementace výpočetního enginu (`js/engine/kinship-engine.js`):
  - Normalizace a zjednodušení řetězců (eliminace cyklů).
  - Výpočet generačního odstupu a určení typu příbuzenské linie.
  - Implementace recipročního výpočtu / inverze perspektivy (互查 - "Kdo jsem já pro něj?").
  - Dynamický generátor pro N-té generace předků a potomků (pra-pra-...).
- [x] Tvorba jazykových balíčků (`js/i18n/`):
  - `cs.js`: Kompletní české vztahy a staročeské výrazy z Wikipedie.
  - `en.js`: Anglické vztahy.
  - `zh.js`: Čínské vztahy a znaky odpovídající vzoru.
  - `sk.js`: Slovenský ekvivalent.
- [x] Vytvoření a úspěšné spuštění sady 16 automatizovaných testů (`tests/kinship.test.js`).
- [x] Návrh moderního ergonomického mobilního UI (`css/style.css` a `index.html`):
  - AMOLED dark mode s jemným gradientem a skleněnými kartami.
  - Hmatová kalkulačková klávesnice s animacemi stisku.
  - Klikací interaktivní breadcrumbs řetězce vztahu.
  - Interaktivní slovník pojmů s fulltextovým vyhledáváním a přenosem výrazu do kalkulačky.
  - Přepínač pohlaví EGO (probanda) a výběr jazyků.
- [x] Připravenost pro PWA a mobilní platformy:
  - `manifest.json` a `sw.js` pro offline režim.
  - `capacitor.config.json` a návod v `PLUGIN_DEV.md` pro build do Android a iOS.
- [x] Lokální testovací server (`server.js`) a ověření funkčnosti v reálném prohlížeči pomocí `browser_subagent`.
