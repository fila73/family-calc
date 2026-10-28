import { escapeHtml } from '../js/utils/html.js';
import { parseGedcom } from '../js/engine/gedcom-parser.js';

let passed = 0;
let failed = 0;

function assertEquals(actual, expected, message) {
  if (actual === expected) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message} (Očekáváno: "${expected}", Obdrženo: "${actual}")`);
  }
}

console.log('=== TEST SUITE: ESCAPOVÁNÍ HTML (XSS) ===\n');

console.log('1. escapeHtml:');
assertEquals(escapeHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;', 'Značky jsou escapovány');
assertEquals(escapeHtml(`a & "b" 'c'`), 'a &amp; &quot;b&quot; &#39;c&#39;', 'Ampersand a uvozovky jsou escapovány');
assertEquals(escapeHtml('Jan Novák (1900–1980)'), 'Jan Novák (1900–1980)', 'Běžný text zůstává beze změny');
assertEquals(escapeHtml(null), '', 'null vrací prázdný řetězec');
assertEquals(escapeHtml(undefined), '', 'undefined vrací prázdný řetězec');
assertEquals(escapeHtml(1984), '1984', 'Čísla jsou převedena na text');

console.log('\n2. Škodlivý GEDCOM:');
{
  const payload = '<img src=x onerror=alert(1)>';
  const ged = [
    '0 HEAD',
    '0 @I1@ INDI',
    `1 NAME ${payload} /Novák/`,
    '1 SEX M',
    '1 BIRT',
    '2 DATE <script>alert(2)</script>',
    '0 TRLR'
  ].join('\n');
  const parsed = parseGedcom(ged);
  const person = parsed.individuals.get('@I1@');
  const escapedName = escapeHtml(person.name);
  assertEquals(escapedName.includes('<'), false, 'Jméno z GEDCOMu po escapování neobsahuje „<“');
  assertEquals(escapeHtml(person.birthDate).includes('<script'), false, 'Datum z GEDCOMu po escapování neobsahuje <script>');
}

console.log('\n========================================');
console.log(`Výsledky testů: ${passed} / ${passed + failed} prošlo.`);
if (failed > 0) {
  console.error(`SELHALO ${failed} testů!`);
  process.exit(1);
} else {
  console.log('VŠECHNY TESTY PROŠLY NA VÝBORNOU!');
}
