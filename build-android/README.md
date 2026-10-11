# Android Build Výstupy

V této složce jsou připraveny sestavené instalační balíčky aplikace **Rodinná kalkulačka** (`cz.fila73.familycalc`):

1. **`Rodinna-Kalkulacka-debug.apk`** (~4 MB)
   - Instalační balíček pro přímé testování na Android telefonu nebo emulátoru bez nutnosti publikace na Google Play.
   - Lze nainstalovat přes USB příkazem:
     ```bash
     adb install build-android/Rodinna-Kalkulacka-debug.apk
     ```
   - Nebo stačí soubor poslat do mobilu (přes Disk, kabel, zprávu) a v mobilu otevřít (povolit instalaci z neznámých zdrojů).

2. **`Rodinna-Kalkulacka-release.aab`** (~3 MB)
   - Produkční formát **Android App Bundle** určený pro nahrání do Google Play Console.
   - Zajišťuje minimální velikost při stahování uživateli (Google Play vygeneruje optimalizované APK na míru danému zařízení).

## Znovusestavení (Rebuild)

Pro opětovné sestavení po úpravě kódu webu:
```bash
# 1. Sestavení webových zdrojů do www/
npm run build

# 2. Synchronizace do Android projektu
npx cap sync android

# 3. Sestavení APK / AAB
cd android
.\gradlew.bat assembleDebug   # pro debug APK
.\gradlew.bat bundleRelease   # pro Google Play AAB
```
