# Family Kinship Calculator (Terms of Kinship)

An interactive web application inspired by the Chinese kinship calculator (亲戚关系计算器), designed to compute complex family relationship terms through an intuitive calculator keypad.

## Features
- **Calculator Keypad**: Mobile-optimized layout with dark mode ergonomics.
- **Reduction Rules Engine**: Automatic simplification of compound relationships (e.g. *Brother ➔ Son ➔ Mother* reduces to *Sister-in-law*, *Stepmother ➔ other husband ➔ son* reduces to *Stepbrother*, *Wife ➔ Brother ➔ Son* reduces to *Nephew*).
- **Modifier Keys**:
  - **`⇧ Step` (Nevlastní)**: Step-parents (*Otčím*, *Macecha*), step-children (*Pastorek*), half-siblings (*jednobřišní* / *jednokrevní*), and step-siblings.
  - **`✝ Godparent` (Křestní)**: Spiritual kinship (*Kmotr*, *Kmotra*, *Kmotřenec*, *Kmotřenka*).
- **Mutual Relationship Mode (互查)**: Determine reciprocal terms ("What does this relative call me?") with active neon button highlighting, breadcrumb reciprocal indicators, and target-speaker perspective.
- **Fast Headless Test Suite**: Full suite of 96 unit tests (`npm test`) and 188 relationships audit (368+ bidirectional runs) validating 100% of relationships, half-sibling consanguinity/NOZ succession, and mutual query inversions without browser overhead.
- **Visual Family Tree Modal (`#treeModal`)**: Interactive graphical chain with avatars, step connectors, directional arrows, and target node highlighting. When loaded from GEDCOM, displays real ancestor/descendant names, birth and death dates (`*1928 – †2005`), and automatic bidirectional path reversal for mutual relationships.
- **Kinship Quiz Mode (`#quizModal`)**: Educational game mode with dynamic question generation strictly adhering to conservative/traditional family ties (164 verified items pool), while the calculator itself fully supports natural same-sex affinity combinations (*brother ➔ husband = brother-in-law*, *mother ➔ brother ➔ husband = uncle*, etc.).
- **Voice Text-to-Speech (🔊 TTS)**: Natural speech synthesis in all 25 languages with animated sound waves.
- **Share & Copy Result (↗ Share)**: Formatted rich card with emojis for social sharing or instant clipboard copy.
- **PNG Card Generator (🖼️ HTML5 Canvas)**: Generate and download an AMOLED-themed social card image.
- **Degrees of Consanguinity & DNA Sharing (🧬)**: Civil law relationship degree calculation and estimated shared DNA percentage (with strict distinction between blood relatives and in-law affinity with 0% DNA).
- **Inheritance Class Calculator (⚖️)**: Czech civil code (NOZ) statutory succession classes (1st to 6th class).
- **Marriage Impediment Detector (💍 § 675 NOZ)**: Legal assessment of marriage validity between relatives.
- **Voice Speech Recognition / Dictation (🎙️)**: Speak relationship chains naturally via Web Speech API.
- **Two Persons Kinship Comparison (👥)**: Determine relationship between any two relatives from common proband.
- **GEDCOM Family Tree Import & Pathfinder (📜 .ged)**: Load standard genealogies from Ancestry, MyHeritage, or Gramps, direct sibling link resolving, path visualization with directional arrows (`↗` up, `↘` down, `→` sibling, `↔` spouse), disambiguation of identical names, one-click visual tree view with names/dates, and transfer to calculator.
- **Desktop Keyboard Hotkeys (⌨️)**: Full physical typing support with dedicated shortcuts cheat sheet modal (`?`).
- **Web Audio Click Feedback & Haptics (🔊📳)**: Zero-latency synthesized audio click and gentle haptic vibration feedback with dedicated toggles in the new Settings screen.
- **Calculation History (🕒)**: Auto-save previous calculations with one-click reload.
- **Dictionary Explorer & Reverse Search (📖)**: Full-text search of all relationship terms with direct loading into the calculator.
- **Hamburger Drawer Menu (☰) & Dedicated Settings Screen (⚙️)**: Clean mobile menu organizing all tools and featuring a dedicated Settings modal (`#settingsModal`) for sound toggles, haptics, language selection, default proband gender, and privacy info.
- **2-Row Header Layout & Quick Language Selector**: Structured 2-row header (Row 1: App Title + Quick Language Trigger `🇨🇿 CS ▾` + Hamburger `☰`; Row 2: Subtitle) preventing multi-line clutter on narrower screens.
- **Scalable Language Selector Dialog**: Modern modal dialog with instant search (e.g. *pol*, *jap*, *viet*, *deutsch*, *ukr*, *tur*), categorized language families, and recent languages quick chips with local storage persistence.
- **25 Fully Localized Languages**:
  - Czech 🇨🇿, Slovak 🇸🇰, Polish 🇵🇱, German 🇩🇪, English 🇬🇧, French 🇫🇷, Italian 🇮🇹, Spanish 🇪🇸, Russian 🇷🇺, Chinese 🇨🇳, Japanese 🇯🇵, Korean 🇰🇷, Vietnamese 🇻🇳,
  - Ukrainian 🇺🇦, Portuguese 🇵🇹, Dutch 🇳🇱, Hungarian 🇭🇺, Turkish 🇹🇷, Greek 🇬🇷, Swedish 🇸🇪, Hindi 🇮🇳, Indonesian 🇮🇩, Arabic 🇸🇦, Croatian 🇭🇷, Romanian 🇷🇴.
- **Mobile Native Ready**: PWA compliant with Network-First Service Worker, full Capacitor native Android project (`cz.fila73.familycalc`).
- **Pre-Built, R8-Optimized & Signed Android Packages with New AMOLED Icon**: Ready-to-use binaries in `build-android/` — `Rodinna-Kalkulacka-debug.apk` (5.24 MB) for instant phone/tablet sideloading and R8-optimized, cryptographically signed `Rodinna-Kalkulacka-release.aab` (2.20 MB, `versionCode 2`) for Google Play Console with full AMOLED mipmap densities and dark adaptive background `#09090b`.
- **Google Play Store Assets & Guide**: Complete store registration package in `google-play/` (Privacy Policy `privacy.html`, Store listing texts `STORE_LISTING.md`, Keystore and release instructions `RELEASE_GUIDE.md`).
- **Store Graphics & Screenshots in `google-play/assets/`**:
  - High-res App Icon 512 × 512 px PNG (`icon-512.png`).
  - Feature Graphic 1024 × 500 px PNG (`feature-graphic-1024x500.png`).
  - 6 Official Store Screenshots in strict 9:16 aspect ratio (1080 × 1920 px standard and 1350 × 2400 px high-res) captured directly on physical Xiaomi Redmi Note 11 Pro 5G via ADB (`screenshot_1_calculator.png` to `screenshot_6_settings.png` covering 2-row header calculator, visual tree, 25 languages, GEDCOM analyzer, quiz game, and dedicated settings).
- **GitHub Pages Web Presentation & Privacy Policy**:
  - `https://fila73.github.io/family-calc/`
  - `https://fila73.github.io/family-calc/privacy.html`
- **Immersive Fullscreen & Portrait Lock**: Native Android Immersive Sticky mode hiding system status and navigation bars for an uninterrupted AMOLED experience, paired with rigid portrait orientation locking.
- **Unified Result Card & Vertical Overlay Actions**:
  - The relationship breadcrumbs, term name, badges, and explanation are merged into a single stable card `.result-unified-card` — preventing top clipping on mobile displays even with lengthy descriptions.
  - Action buttons (🔊 TTS, ↗ Share, 🌳 Family tree) are vertically arranged as an overlay in the upper-right corner, freeing full horizontal width for title text and metadata badges.
  - Directional generation arrows (`↗` blue ancestor, `↘` green descendant, `↔` pink partner, `→` orange sibling).
  - Streamlined and natural Czech kinship terminology free of redundant brackets (e.g., pure **Dědeček**, **Strýc**, **Synovec**).
- **Native Android Offline Text-To-Speech (🔊 TTS)**: Direct Android bridge (`android.speech.tts.TextToSpeech` via `MainActivity.java` and `window.AndroidTTS`) providing seamless native voice synthesis on Android without relying on Chromium WebView's disabled Web Speech API, with universal fallback for standard desktop and iOS browsers across all 25 languages.
- **Advanced Child-Sibling Reduction Rules**: Intelligently reduces sibling extensions of children (e.g. *child's brother is child's sibling / son*), resolving complex chains such as *husband ➔ sister ➔ son ➔ son ➔ brother* accurately to **Grandnephew** (and mutual reciprocal **Greataunt**).
- **Mobile Result Card Polish & Zero Dead Space**: Result card `.result-unified-card` seamlessly anchors directly beneath the gender bar (`min-height: 100%`) without empty voids, breadcrumb overflow constraints removed, and non-shrinking flex sections preventing badges from overlapping explanations.
- **Ethical Zero-Ad & Zero-Tracking Monetization**: Strictly no ads, no trackers, and no third-party telemetry. 100% offline functionality. Voluntary donation tip jar modal (`#donateModal`) supporting Czech QR SPAYD payments, Ko-fi, Buy Me a Coffee, and Google Play ratings.

