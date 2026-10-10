import { cs } from './cs.js';
import { en } from './en.js';
import { zh } from './zh.js';
import { sk } from './sk.js';

export const dictionaries = {
  cs,
  en,
  zh,
  sk
};

export const availableLanguages = [
  { code: 'cs', label: 'Čeština 🇨🇿' },
  { code: 'en', label: 'English 🇬🇧' },
  { code: 'zh', label: '中文 🇨🇳' },
  { code: 'sk', label: 'Slovenčina 🇸🇰' }
];

export function getDictionary(langCode = 'cs') {
  return dictionaries[langCode] || dictionaries.cs;
}
