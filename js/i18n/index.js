import { cs } from './cs.js';
import { sk } from './sk.js';
import { pl } from './pl.js';
import { de } from './de.js';
import { en } from './en.js';
import { fr } from './fr.js';
import { it } from './it.js';
import { es } from './es.js';
import { ru } from './ru.js';
import { uk } from './uk.js';
import { hr } from './hr.js';
import { pt } from './pt.js';
import { nl } from './nl.js';
import { sv } from './sv.js';
import { ro } from './ro.js';
import { hu } from './hu.js';
import { el } from './el.js';
import { tr } from './tr.js';
import { hi } from './hi.js';
import { ar } from './ar.js';
import { zh } from './zh.js';
import { ko } from './ko.js';
import { ja } from './ja.js';
import { vi } from './vi.js';
import { id } from './id.js';

export const dictionaries = {
  cs,
  sk,
  pl,
  uk,
  hr,
  ru,
  en,
  de,
  nl,
  sv,
  fr,
  it,
  es,
  pt,
  ro,
  hu,
  el,
  tr,
  hi,
  ar,
  zh,
  ja,
  ko,
  vi,
  id
};

export { languagesRegistry, languageCategories, getLanguageMeta } from './languages.js';

export function getDictionary(langCode = 'cs') {
  return dictionaries[langCode] || dictionaries.cs;
}
