# Kompletní průvodce vydáním aplikace v Google Play (Release Guide)

Tento manuál popisuje krok za krokem celý proces od vygenerování podpisového klíče, přes sestavení Android App Bundle (`.aab`) až po vyplnění dotazníků a schválení v Google Play Console.

---

## FÁZE 1: Příprava vývojářského účtu Google Play
1. Přejděte na [Google Play Console](https://play.google.com/console/signup).
2. Přihlaste se svým Google účtem a zaplaťte jednorázový registrační poplatek **$25 USD**.
3. Zvolte typ účtu (Osobní / Firemní) a ověřte svou totožnost (vyžaduje platný doklad totožnosti dle požadavků Google).
4. Klikněte na **„Vytvořit aplikaci“**:
   * **Název aplikace**: `Rodinná kalkulačka vztahů`
   * **Výchozí jazyk**: `Čeština (cs-CZ)`
   * **Aplikace nebo hra**: `Aplikace`
   * **Bezplatná nebo placená**: `Bezplatná`
   * Odsouhlaste prohlášení o zásadách pro vývojáře a exportních zákonech USA.

---

## FÁZE 2: Vygenerování produkčního podpisového klíče (Keystore)
Google vyžaduje, aby každá aplikace byla podepsána kryptografickým klíčem. Díky nainstalovanému **JDK 17** na vašem počítači máte k dispozici nástroj `keytool`.

V terminálu spusťte následující příkaz (zadejte vlastní bezpečné heslo):

```powershell
keytool -genkey -v -keystore familycalc-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias familycalc
```

* **DŮLEŽITÉ**: Soubor `familycalc-release-key.jks` a zadané heslo si bezpečně zazálohujte! Bez něj nelze v budoucnu vydávat aktualizace aplikace.
* Soubor uložte např. do `c:\Users\filip\AntigravityProjects\family-calc\android\familycalc-release-key.jks` (tento soubor nikdy necommitujte veřejně na GitHub).

---

## FÁZE 3: Sestavení Android projektu přes Capacitor
Pro vytvoření nativního Android projektu s Capacitorem:

1. **Instalace závislostí Capacitoru**:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/haptics @capacitor/status-bar
   ```

2. **Inicializace konfigurace**:
   ```bash
   npx cap init "Rodinná kalkulačka" "cz.fila73.familycalc" --web-dir "www"
   ```

3. **Vytvoření nativní Android složky**:
   ```bash
   npx cap add android
   npx cap sync android
   ```

4. **Kompilace Release balíčku (.aab)**:
   Ve složce `android/`:
   ```bash
   ./gradlew bundleRelease
   ```
   Výsledný soubor `app-release.aab` se nachází v:
   `android/app/build/outputs/bundle/release/app-release.aab`.

---

## FÁZE 4: Vyplnění povinných dotazníků v Google Play Console

### 1. Zásady ochrany osobních údajů (Privacy Policy):
* Do pole vložte veřejnou URL: `https://storytold.github.io/family-calc/privacy.html` (nebo vaši doménu).
* Text zásad je připraven v souboru `google-play/PRIVACY_POLICY.md`.

### 2. Přístup k aplikaci (App Access):
* Zvolte: **„Všechny funkce jsou dostupné bez zvláštních omezení přístupu“** (aplikace nemá přihlašovací obrazovku ani heslo).

### 3. Reklamy (Ads):
* Zvolte: **„Ne, moje aplikace neobsahuje reklamy“**.
* Díky tomu Google Play u vaší aplikace zobrazí odznak **Bez reklam**, což výrazně zvyšuje důvěryhodnost a počet stažení.

### 4. Zabezpečení údajů (Data Safety):
V dotazníku Data Safety zaškrtněte:
* Sbírá nebo sdílí vaše aplikace nějaké uživatelské údaje? ➔ **NE**.
* Všechny výpočty a importy rodokmenů GEDCOM probíhají výhradně lokálně v zařízení uživatele.
* Žádná data se neodesílají na žádný server.

### 5. Cílová skupina a obsah (Target Audience):
* Zvolte věkovou kategorii: **13–15 let, 16–17 let, 18 a více let**.
* Tím se vyhnete nutnosti zapojovat aplikaci do programu „Pro rodiny“ (Designed for Families), který vyžaduje složité právní revize zaměřené na děti předškolního věku.

### 6. Finanční funkce (Financial Features):
* Zvolte: **„Moje aplikace neposkytuje žádné finanční funkce“** (aplikace není bankovní ani úvěrová služba).

### 7. Vládní aplikace (Government Apps):
* Zvolte: **„Ne, tato aplikace není vytvořena pro žádnou státní správu ani vládu“**.

### 8. Hodnocení obsahu (IARC Content Rating):
* Zadejte svůj kontaktní e-mail.
* Zvolte kategorii: **Nástroje / Referenční materiály / Vzdělávání**.
* Na všechny otázky ohledně násilí, vulgarit, sexuálního obsahu a hazardu odpovězte **NE**.
* Výsledek: **PEGI 3 / Everyone** (zpřístupněno pro všechny věkové skupiny po celém světě).

---

## FÁZE 5: Monetizace a dobrovolný příspěvek (Tip Jar)

Jelikož v aplikaci nechceme žádné reklamní SDK ani sledovací kódy, nabízí se čistý model **Donationware / Tip Jar**:

### Varianta A: Rychlá QR platba (ČR) + Odkaz na Ko-fi / Buy Me a Coffee (Doporučeno pro web i aplikaci)
* V menu aplikace je tlačítko **„Podpořit vývoj ☕“**.
* Otevře čistý dialog s:
  1. **Českým QR kódem (SPAYD standard)** pro okamžitou platbu z libovolného mobilního bankovnictví (ČSOB, KB, Air Bank, Fio, Spořitelna...) přímo na účet bez prostředníků (0 % provize).
  2. Tlačítkem na **Ko-fi** nebo **Buy Me a Coffee** pro zahraniční uživatele s platbou kartou, Apple Pay či Google Pay.
* **Pravidla Google Play**: Odkaz na web autora / sponzorský profil v sekci „O autorovi“ je v pořádku, pokud neodemyká žádné digitální funkce uvnitř aplikace.

### Varianta B: Nativní Google Play In-App Purchase (Tip Jar)
* Pokud chcete umožnit darování jedním kliknutím přímo přes Google Play účet (kartou uloženou v Google Play):
  1. V Google Play Console v sekci **Zpeněžení ➔ Produkty v aplikaci (In-app products)** vytvoříte produkt:
     * ID: `tip_coffee_50`
     * Název: *Koupit vývojáři kávu (50 Kč)*
     * Typ: *Spotřební položka (Consumable)*
  2. V aplikaci se použije plugin `@capacitor/in-app-purchases`.
  3. Google si z platby strhne 15% poplatek.

---

## FÁZE 6: Nahrání balíčku a schválení společností Google
1. V Google Play Console přejděte do **Produkce ➔ Vytvořit nové vydání**.
2. Nahrajte soubor `app-release.aab`.
3. Vložte poznámky k vydání (Release Notes):
   ```text
   První vydání Rodinné kalkulačky pro Android.
   - Kompletní výpočet rodinných vztahů a archaických pojmů.
   - Podpora 25 světových jazyků.
   - Vizuální minirodokmen a import rodokmenů GEDCOM (.ged).
   - 100% bez reklam a bez sledování.
   ```
4. Zkontrolujte a odešlete ke schválení.
5. Standardní kontrola první aplikace u nového vývojářského účtu trvá obvykle **1 až 3 pracovní dny**.
