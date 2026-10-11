# Family Kinship Calculator (Terms of Kinship)

An interactive web application inspired by the Chinese kinship calculator (亲戚关系计算器), designed to compute complex family relationship terms through an intuitive calculator keypad.

## Features
- **Calculator Keypad**: Mobile-optimized layout with dark mode ergonomics.
- **Reduction Rules Engine**: Automatic simplification of compound relationships (e.g. *Brother ➔ Son ➔ Mother* reduces to *Sister-in-law*, *Stepmother ➔ other husband ➔ son* reduces to *Stepbrother*, *Wife ➔ Brother ➔ Son* reduces to *Nephew*).
- **Modifier Keys**:
  - **`⇧ Step` (Nevlastní)**: Step-parents (*Otčím*, *Macecha*), step-children (*Pastorek*), half-siblings (*jednobřišní* / *jednokrevní*), and step-siblings.
  - **`✝ Godparent` (Křestní)**: Spiritual kinship (*Kmotr*, *Kmotra*, *Kmotřenec*, *Kmotřenka*).
- **Mutual Relationship Mode (互查)**: Determine reciprocal terms ("What does this relative call me?") with active neon button highlighting, breadcrumb reciprocal indicators, and target-speaker perspective.
- **Fast Headless Test Suite**: Full suite of 82 unit tests (`npm test`) and 160 relationships audit (320 bidirectional runs) validating 100% of relationships and mutual query inversions without browser overhead.
- **Visual Family Tree Modal (`#treeModal`)**: Interactive graphical chain with avatars, step connectors, and target node highlighting.
- **Kinship Quiz Mode (`#quizModal`)**: Educational game mode with dynamic question generation, instant feedback, streaks, and score tracking.
- **Voice Text-to-Speech (🔊 TTS)**: Natural speech synthesis in all 25 languages with animated sound waves.
- **Share & Copy Result (↗ Share)**: Formatted rich card with emojis for social sharing or instant clipboard copy.
- **PNG Card Generator (🖼️ HTML5 Canvas)**: Generate and download an AMOLED-themed social card image.
- **Degrees of Consanguinity & DNA Sharing (🧬)**: Civil law relationship degree calculation and estimated shared DNA percentage (with strict distinction between blood relatives and in-law affinity with 0% DNA).
- **Inheritance Class Calculator (⚖️)**: Czech civil code (NOZ) statutory succession classes (1st to 6th class).
- **Marriage Impediment Detector (💍 § 675 NOZ)**: Legal assessment of marriage validity between relatives.
- **Voice Speech Recognition / Dictation (🎙️)**: Speak relationship chains naturally via Web Speech API.
- **Two Persons Kinship Comparison (👥)**: Determine relationship between any two relatives from common proband.
- **GEDCOM Family Tree Import & Pathfinder (📜 .ged)**: Load standard genealogies from Ancestry, MyHeritage, or Gramps, direct sibling link resolving, path visualization with directional arrows (`↗` up, `↘` down, `→` sibling, `↔` spouse), disambiguation of identical names, and transfer to calculator.
- **Desktop Keyboard Hotkeys (⌨️)**: Full physical typing support with dedicated shortcuts cheat sheet modal (`?`).
- **Web Audio Click Feedback (🔊)**: Zero-latency synthesized haptic audio click with header toggle.
- **Calculation History (🕒)**: Auto-save previous calculations with one-click reload.
- **Dictionary Explorer & Reverse Search (📖)**: Full-text search of all relationship terms with direct loading into the calculator.
- **Hamburger Drawer Menu (☰)**: Clean mobile menu organizing all 10 tools and calculators.
- **Scalable Language Selector Dialog**: Modern modal dialog with instant search (e.g. *pol*, *jap*, *viet*, *deutsch*, *ukr*, *tur*), categorized language families, and recent languages quick chips with local storage persistence.
- **25 Fully Localized Languages**:
  - Czech 🇨🇿, Slovak 🇸🇰, Polish 🇵🇱, German 🇩🇪, English 🇬🇧, French 🇫🇷, Italian 🇮🇹, Spanish 🇪🇸, Russian 🇷🇺, Chinese 🇨🇳, Japanese 🇯🇵, Korean 🇰🇷, Vietnamese 🇻🇳,
  - Ukrainian 🇺🇦, Portuguese 🇵🇹, Dutch 🇳🇱, Hungarian 🇭🇺, Turkish 🇹🇷, Greek 🇬🇷, Swedish 🇸🇪, Hindi 🇮🇳, Indonesian 🇮🇩, Arabic 🇸🇦, Croatian 🇭🇷, Romanian 🇷🇴.
- **Mobile Native Ready**: PWA compliant with Network-First Service Worker, full Capacitor native Android project (`cz.fila73.familycalc`).
- **Pre-Built Android Packages with New AMOLED Icon**: Ready-to-use binaries in `build-android/` — `Rodinna-Kalkulacka-debug.apk` (4.76 MB) for instant phone sideloading and `Rodinna-Kalkulacka-release.aab` (3.41 MB) for Google Play Console with full AMOLED mipmap densities and dark adaptive background `#09090b`.
- **Google Play Store Assets & Guide**: Complete store registration package in `google-play/` (Privacy Policy `privacy.html`, Store listing texts `STORE_LISTING.md`, Keystore and release instructions `RELEASE_GUIDE.md`).
- **Store Graphics & Screenshots in `google-play/assets/`**:
  - High-res App Icon 512 × 512 px PNG (`icon-512.png`).
  - Feature Graphic 1024 × 500 px PNG (`feature-graphic-1024x500.png`).
  - 5 Full HD Phone Screenshots 1080 × 2400 px captured directly on real Xiaomi Redmi Note 11 Pro 5G via ADB (`screenshot_1_calculator.png` to `screenshot_5_quiz.png`).
- **GitHub Pages Web Presentation & Privacy Policy**:
  - `https://fila73.github.io/family-calc/`
  - `https://fila73.github.io/family-calc/privacy.html`
- **Ethical Zero-Ad & Zero-Tracking Monetization**: Strictly no ads, no trackers, and no third-party telemetry. 100% offline functionality. Voluntary donation tip jar modal (`#donateModal`) supporting Czech QR SPAYD payments, Ko-fi, Buy Me a Coffee, and Google Play ratings.


