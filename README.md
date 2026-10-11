# Family Kinship Calculator (Terms of Kinship)

An interactive web application inspired by the Chinese kinship calculator (亲戚关系计算器), designed to compute complex family relationship terms through an intuitive calculator keypad.

## Features
- **Calculator Keypad**: Mobile-optimized layout with dark mode ergonomics.
- **Reduction Rules Engine**: Automatic simplification of compound relationships (e.g. *Brother ➔ Son ➔ Mother* reduces to *Sister-in-law*).
- **Modifier Keys**:
  - **`⇧ Step` (Nevlastní)**: Step-parents (*Otčím*, *Macecha*), step-children (*Pastorek*), half-siblings (*jednobřišní* / *jednokrevní*), and step-siblings.
  - **`✝ Godparent` (Křestní)**: Spiritual kinship (*Kmotr*, *Kmotra*, *Kmotřenec*, *Kmotřenka*).
- **Mutual Relationship Mode (互查)**: Determine reciprocal terms ("What does this relative call me?").
- **Visual Family Tree Modal (`#treeModal`)**: Interactive graphical chain with avatars, step connectors, and target node highlighting.
- **Kinship Quiz Mode (`#quizModal`)**: Educational game mode with dynamic question generation, instant feedback, streaks, and score tracking.
- **Voice Text-to-Speech (🔊 TTS)**: Natural speech synthesis in all 25 languages with animated sound waves.
- **Share & Copy Result (↗ Share)**: Formatted rich card with emojis for social sharing or instant clipboard copy.
- **PNG Card Generator (🖼️ HTML5 Canvas)**: Generate and download an AMOLED-themed social card image.
- **Degrees of Consanguinity & DNA Sharing (🧬)**: Civil law relationship degree calculation and estimated shared DNA percentage.
- **Inheritance Class Calculator (⚖️)**: Czech civil code (NOZ) statutory succession classes (1st to 6th class).
- **Marriage Impediment Detector (💍 § 675 NOZ)**: Legal assessment of marriage validity between relatives.
- **Voice Speech Recognition / Dictation (🎙️)**: Speak relationship chains naturally via Web Speech API.
- **Two Persons Kinship Comparison (👥)**: Determine relationship between any two relatives from common proband.
- **GEDCOM Family Tree Import & Pathfinder (📜 .ged)**: Load standard genealogies from Ancestry, MyHeritage, or Gramps, explore sample 4-generation tree, calculate graph path and transfer to calculator.
- **Desktop Keyboard Hotkeys (⌨️)**: Full physical typing support with dedicated shortcuts cheat sheet modal (`?`).
- **Web Audio Click Feedback (🔊)**: Zero-latency synthesized haptic audio click with header toggle.
- **Calculation History (🕒)**: Auto-save previous calculations with one-click reload.
- **Dictionary Explorer & Reverse Search (📖)**: Full-text search of all relationship terms with direct loading into the calculator.
- **Hamburger Drawer Menu (☰)**: Clean mobile menu organizing all 10 tools and calculators.
- **Scalable Language Selector Dialog**: Modern modal dialog with instant search (e.g. *pol*, *jap*, *viet*, *deutsch*, *ukr*, *tur*), categorized language families, and recent languages quick chips with local storage persistence.
- **25 Fully Localized Languages**:
  - Czech 🇨🇿, Slovak 🇸🇰, Polish 🇵🇱, German 🇩🇪, English 🇬🇧, French 🇫🇷, Italian 🇮🇹, Spanish 🇪🇸, Russian 🇷🇺, Chinese 🇨🇳, Japanese 🇯🇵, Korean 🇰🇷, Vietnamese 🇻🇳,
  - Ukrainian 🇺🇦, Portuguese 🇵🇹, Dutch 🇳🇱, Hungarian 🇭🇺, Turkish 🇹🇷, Greek 🇬🇷, Swedish 🇸🇪, Hindi 🇮🇳, Indonesian 🇮🇩, Arabic 🇸🇦, Croatian 🇭🇷, Romanian 🇷🇴.
- **Mobile Native Ready**: PWA compliant with Network-First Service Worker, ready for Android/iOS packaging via Capacitor.

