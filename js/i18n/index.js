import { cs } from './cs.js';
import { sk } from './sk.js';
import { pl } from './pl.js';
import { de } from './de.js';
import { en } from './en.js';
import { fr } from './fr.js';
import { it } from './it.js';
import { es } from './es.js';
import { ru } from './ru.js';
import { zh } from './zh.js';
import { ko } from './ko.js';

export const dictionaries = {
  cs,
  sk,
  pl,
  de,
  en,
  fr,
  it,
  es,
  ru,
  zh,
  ko
};

export const availableLanguages = [
  { code: 'cs', label: 'Čeština 🇨🇿' },
  { code: 'sk', label: 'Slovenčina 🇸🇰' },
  { code: 'pl', label: 'Polski 🇵🇱' },
  { code: 'de', label: 'Deutsch 🇩🇪' },
  { code: 'en', label: 'English 🇬🇧' },
  { code: 'fr', label: 'Français 🇫🇷' },
  { code: 'it', label: 'Italiano 🇮🇹' },
  { code: 'es', label: 'Español 🇪🇸' },
  { code: 'ru', label: 'Русский 🇷🇺' },
  { code: 'zh', label: '中文 🇨🇳' },
  { code: 'ko', label: '한국어 🇰🇷' }
];

export function getDictionary(langCode = 'cs') {
  return dictionaries[langCode] || dictionaries.cs;
}
