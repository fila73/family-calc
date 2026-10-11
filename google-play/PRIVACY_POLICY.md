# Zásady ochrany osobních údajů (Privacy Policy)
**Aplikace: Rodinná kalkulačka (Family Kinship Calculator / Terms of Kinship)**
**Poslední aktualizace: 11. října 2026**

Tento dokument stanovuje zásady ochrany osobních údajů pro mobilní a webovou aplikaci **Rodinná kalkulačka** (dále jen „Aplikace“).

---

## 1. Základní princip: 100% ochrana soukromí a Zero Data Collection
Naší nejvyšší prioritou je naprosté soukromí uživatele. Aplikace byla navržena tak, aby fungovala jako samostatný offline nástroj bez jakéhokoliv sledování, reklam či telemetrie.

* **Neshromažďujeme ŽÁDNÉ osobní údaje.**
* **Nesbíráme identifikační údaje zařízení, polohu, kontakty ani historii prohlížení.**
* **Aplikace neobsahuje žádné reklamní systémy (např. Google AdMob, Unity Ads, Facebook Audience Network).**
* **Aplikace neobsahuje žádné analytické ani sledovací skripty třetích stran (např. Google Analytics, Firebase Analytics, Crashlytics, Adjust).**

---

## 2. Lokální zpracování rodokmenů a výpočtů (GEDCOM)
Veškeré genealogické výpočty, definice příbuzenství i importované rodokmeny ve formátu GEDCOM (`.ged` soubory):
* Jsou zpracovávány **výhradně lokálně v operační paměti vašeho zařízení**.
* **Žádná jména osob, data narození, rodinné vazby ani soubory rodokmenů se nikdy neodesílají na žádný vzdálený server ani do cloudu.**
* Po zavření aplikace nebo vymazání historie zůstávají veškeré údaje pouze ve vašem zařízení.

---

## 3. Lokální úložiště zařízení (Local Storage)
Aplikace využívá standardní lokální úložiště zařízení (`localStorage`) výhradně pro uživatelská nastavení:
* Zvolený jazyk rozhraní (např. čeština, angličtina).
* Zvolené výchozí pohlaví probanda (muž / žena).
* Předvolba zapnutí/vypnutí zvuku kláves.
* Poslední lokální historie vyhledaných vztahů pro pohodlí uživatele.
Tato data nikdy neopouštějí vaše zařízení a lze je kdykoliv smazat vymazáním mezipaměti aplikace nebo odinstalováním.

---

## 4. Oprávnění zařízení (Permissions)
Aplikace vyžaduje naprosté minimum systémových oprávnění:
* **Přístup k úložišti / čtení souborů**: Pouze pokud uživatel explicitně klikne na „Nahrát .ged soubor“ nebo „Uložit PNG vizitku“.
* **Mikrofon (Web Speech API)**: Pouze a výhradně při aktivním stisku tlačítka hlasového diktování rodinného řetězce (zpracovává se standardní systémovou službou rozpoznávání řeči).
* **Vibrace (Haptika)**: Pro zpětnou vazbu stisku tlačítek klávesnice.
* **Aplikace nevyžaduje přístup k poloze, kontaktům, kameře, SMS ani telefonním hovorům.**

---

## 5. Zabezpečení a sdílení dat třetím stranám
Jelikož žádná data neshromažďujeme, **žádné informace neprodáváme, nepronajímáme, nesdílíme ani nepřevádíme žádným třetím stranám**.

---

## 6. Ochrana soukromí dětí (COPPA / GDPR-K)
Aplikace neshromažďuje žádné údaje od nikoho, včetně dětí jakéhokoliv věku. Aplikace je plně bezpečná pro uživatele všech věkových kategorií.

---

## 7. Kontakt na vývojáře
V případě jakýchkoliv dotazů ohledně těchto zásad nebo fungování aplikace můžete vývojáře kontaktovat prostřednictvím:
* E-mail: `support@familycalc.app` (nebo kontaktní e-mail vývojářského účtu Google Play)
* GitHub: `https://github.com/storytold/family-calc`
