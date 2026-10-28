/**
 * Escapování textu pro bezpečné vložení do innerHTML šablon.
 * Použít pro veškerá data z GEDCOM souborů, názvů souborů a localStorage.
 */

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

export function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}
