# Family Kinship Calculator (Terms of Kinship)

An interactive web application inspired by the Chinese kinship calculator (亲戚关系计算器), designed to compute complex family relationship terms through an intuitive calculator keypad.

## Features
- **Calculator Keypad**: Mobile-optimized layout with dark mode ergonomics.
- **Reduction Rules Engine**: Automatic simplification of compound relationships (e.g. *Brother ➔ Son ➔ Mother* reduces to *Sister-in-law*).
- **Modifier Keys**:
  - **`⇧ Step` (Nevlastní)**: Step-parents (*Otčím*, *Macecha*), step-children (*Pastorek*), half-siblings (*jednobřišní* / *jednokrevní*), and step-siblings.
  - **`✝ Godparent` (Křestní)**: Spiritual kinship (*Kmotr*, *Kmotra*, *Kmotřenec*, *Kmotřenka*).
- **Mutual Relationship Mode (互查)**: Determine reciprocal terms ("What does this relative call me?").
- **Scalable Language Selector Dialog**: Modern modal dialog with instant search (e.g. *pol*, *jap*, *viet*, *deutsch*), categorized language families, and recent languages quick chips with local storage persistence.
- **13 Fully Localized Languages**: Czech 🇨🇿, Slovak 🇸🇰, Polish 🇵🇱, German 🇩🇪, English 🇬🇧, French 🇫🇷, Italian 🇮🇹, Spanish 🇪🇸, Russian 🇷🇺, Chinese 🇨🇳, Japanese 🇯🇵, Korean 🇰🇷, and Vietnamese 🇻🇳.
- **Mobile Native Ready**: PWA compliant with Network-First Service Worker, ready for Android/iOS packaging via Capacitor.
