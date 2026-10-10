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
- **Podpora jazyků**:
  - Čeština (výchozí, detailní pojmy dle Wikipedie cs.wikipedia.org/wiki/Seznam_členů_rodiny)
  - Angličtina (English)
  - Čínština (中文 - původní vzor 亲戚关系计算器)
  - Slovenčina (Slovenčina)
- **Mobilní platformy (Android & iOS)**:
  - Responzivní webová aplikace (Vanilla JS/ES6+, CSS3, moderní layout)
  - PWA připravenost (manifest, offline worker, touch UX, haptic feedback)
  - Capacitor / Cordova kompatibilní struktura (snadný build do APK/AAB a iOS Xcode projektu)

## 2. Architektura projektu
- `index.html`: Hlavní aplikace a rozvržení kalkulačky
- `css/style.css`: Prémiový moderní UI design (AMOLED dark theme, skleněné efekty, kalkulačkový grid, plynulé animace a responzivita)
- `js/engine/`:
  - `kinship-graph.js`: Algoritmický model vztahů (normalizace řetězce, redukce cyklů a inverze pro vzájemný vztah)
  - `kinship-data-cs.js`: Databáze českých vztahů (moderní, archaické, domácké, popis, generace)
  - `kinship-data-en.js`: Anglická databáze
  - `kinship-data-zh.js`: Čínská databáze (přesně odpovídající originálu)
  - `kinship-data-sk.js`: Slovenská databáze
  - `i18n.js`: Přepínání jazyků a lokalizace UI
- `js/app.js`: Řízení stavu, reakce na stisk kláves, haptika, rendering displeje
- `tests/`: Automatizované testy správnosti výpočtu příbuzenských vztahů v Node.js

## 3. Postup implementace
1. Inicializace dokumentace (`implementation_plan.md`, `README.md`, `README_CZ.md`, `PLUGIN_DEV.md`, `jobs_done.md`, `nice_to_have.md`).
2. Vytvoření testovací sady kinship enginu (TDD přístup pro ověření všech větví rodokmenu z Wikipedia).
3. Implementace výpočetního enginu rodinných vztahů a invertoru perspektivy (互查).
4. Implementace jazykových slovníků (čeština s archaickými výrazy, angličtina, čínština, slovenština).
5. Vytvoření moderního HTML/CSS uživatelského rozhraní s věrnou kalkulačkovou ergonomií.
6. Doplnění interaktivních funkcí (nastavení pohlaví EGO, režim "jak říká on mně", stromový přehled / hledání, historie).
7. Konfigurace pro Android/iOS (PWA manifest, ikony, viewport meta tagy, Capacitor konfigurace).
8. Otestování v prohlížeči a Node testech.
9. Průběžné commitování do lokálního gitu a aktualizace stavu.
