/**
 * Registr jazyků a jejich metadat (Language Metadata Registry)
 */

export const languageCategories = {
  slavic: { id: 'slavic', label: 'Slovanské jazyky', icon: '🌍' },
  germanic: { id: 'germanic', label: 'Germánské jazyky', icon: '🌍' },
  romance: { id: 'romance', label: 'Románské jazyky', icon: '🌍' },
  east_asian: { id: 'east_asian', label: 'Východoasijské jazyky', icon: '🌏' },
  southeast_asian: { id: 'southeast_asian', label: 'Jihovýchodní Asie', icon: '🌏' }
};

export const languagesRegistry = [
  // Slovanské jazyky
  { code: 'cs', label: 'Čeština', czechName: 'Čeština', englishName: 'Czech', localName: 'Čeština', flag: '🇨🇿', group: 'slavic' },
  { code: 'sk', label: 'Slovenčina', czechName: 'Slovenština', englishName: 'Slovak', localName: 'Slovenčina', flag: '🇸🇰', group: 'slavic' },
  { code: 'pl', label: 'Polski', czechName: 'Polština', englishName: 'Polish', localName: 'Polski', flag: '🇵🇱', group: 'slavic' },
  { code: 'ru', label: 'Русский', czechName: 'Ruština', englishName: 'Russian', localName: 'Русский', flag: '🇷🇺', group: 'slavic' },

  // Germánské jazyky
  { code: 'en', label: 'English', czechName: 'Angličtina', englishName: 'English', localName: 'English', flag: '🇬🇧', group: 'germanic' },
  { code: 'de', label: 'Deutsch', czechName: 'Němčina', englishName: 'German', localName: 'Deutsch', flag: '🇩🇪', group: 'germanic' },

  // Románské jazyky
  { code: 'fr', label: 'Français', czechName: 'Francouzština', englishName: 'French', localName: 'Français', flag: '🇫🇷', group: 'romance' },
  { code: 'it', label: 'Italiano', czechName: 'Italština', englishName: 'Italian', localName: 'Italiano', flag: '🇮🇹', group: 'romance' },
  { code: 'es', label: 'Español', czechName: 'Španělština', englishName: 'Spanish', localName: 'Español', flag: '🇪🇸', group: 'romance' },

  // Východoasijské jazyky
  { code: 'zh', label: '中文', czechName: 'Čínština', englishName: 'Chinese', localName: '中文 (简体)', flag: '🇨🇳', group: 'east_asian' },
  { code: 'ja', label: '日本語', czechName: 'Japonština', englishName: 'Japanese', localName: '日本語', flag: '🇯🇵', group: 'east_asian' },
  { code: 'ko', label: '한국어', czechName: 'Korejština', englishName: 'Korean', localName: '한국어', flag: '🇰🇷', group: 'east_asian' },

  // Jihovýchodní Asie
  { code: 'vi', label: 'Tiếng Việt', czechName: 'Vietnamština', englishName: 'Vietnamese', localName: 'Tiếng Việt', flag: '🇻🇳', group: 'southeast_asian' }
];

export function getLanguageMeta(code) {
  return languagesRegistry.find((l) => l.code === code) || languagesRegistry[0];
}
