/**
 * Testy pro kalkulačku rodinných vztahů
 */

import assert from 'node:assert';
import { resolveKinship, invertChain, simplifyChain } from '../js/engine/kinship-engine.js';
import { cs } from '../js/i18n/cs.js';
import { en } from '../js/i18n/en.js';
import { zh } from '../js/i18n/zh.js';
import { ko } from '../js/i18n/ko.js';
import { ru } from '../js/i18n/ru.js';
import { pl } from '../js/i18n/pl.js';
import { de } from '../js/i18n/de.js';

let passed = 0;
let total = 0;

function it(desc, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    console.error(`  ✗ ${desc}`);
    console.error(err);
  }
}

console.log('=== Spouštím testy rodinné kalkulačky ===\n');

console.log('1. Základní vztahy v češtině:');
it('Otec a Matka', () => {
  const rF = resolveKinship(['f'], 'm', cs);
  assert.strictEqual(rF.name, 'Otec');
  const rM = resolveKinship(['m'], 'm', cs);
  assert.strictEqual(rM.name, 'Matka');
});

it('Prarodiče s historickými variantami (stařeček, stařenka)', () => {
  const rFF = resolveKinship(['f', 'f'], 'm', cs);
  assert.strictEqual(rFF.name, 'Dědeček (otcův otec)');
  const rMF = resolveKinship(['m', 'f'], 'm', cs);
  assert.ok(rMF.archaic.includes('stařeček'));
  const rMM = resolveKinship(['m', 'm'], 'm', cs);
  assert.ok(rMM.archaic.includes('stařenka'));
});

it('Předkové ve 4. a vyšší generaci (pra-pra-)', () => {
  const r4 = resolveKinship(['f', 'f', 'f', 'f'], 'm', cs);
  assert.strictEqual(r4.name, 'prapradědeček');
  assert.strictEqual(r4.generation, 4);
});

console.log('\n2. Strýcové, tety a staročeské názvy (ujec, stryna, tetec...):');
it('Bratr otce (strýc) a bratr matky (stč. ujec)', () => {
  const rFB = resolveKinship(['f', 'b'], 'm', cs);
  assert.strictEqual(rFB.name, 'Strýc (otcův bratr)');
  const rMB = resolveKinship(['m', 'b'], 'm', cs);
  assert.strictEqual(rMB.name, 'Strýc (matčin bratr)');
  assert.ok(rMB.archaic.includes('ujec'));
});

it('Manželka otcova bratra (stryna) a manželka matčina bratra (ujčina)', () => {
  const rFBW = resolveKinship(['f', 'b', 'w'], 'm', cs);
  assert.ok(rFBW.archaic.includes('stryna'));
  const rMBW = resolveKinship(['m', 'b', 'w'], 'm', cs);
  assert.ok(rMBW.archaic.includes('ujčina'));
});

it('Manžel otcovy sestry (tetec) a manžel matčiny sestry (posel)', () => {
  const rFZH = resolveKinship(['f', 'z', 'h'], 'm', cs);
  assert.ok(rFZH.archaic.includes('tetec'));
  const rMZH = resolveKinship(['m', 'z', 'h'], 'm', cs);
  assert.ok(rMZH.archaic.includes('posel'));
});

console.log('\n3. Bratranci a sestřenice:');
it('Bratranec od otcova bratra (strýčenec) a od matčina bratra (ujčen)', () => {
  const rFBS = resolveKinship(['f', 'b', 's'], 'm', cs);
  assert.ok(rFBS.archaic.includes('strýčenec'));
  const rMBS = resolveKinship(['m', 'b', 's'], 'm', cs);
  assert.ok(rMBS.archaic.includes('ujčen'));
});

console.log('\n4. Příbuzní na základě sňatku (sešvagření - deveř, šurin, zelva):');
it('Manželčin bratr (šurin) a manželčina sestra (zelva)', () => {
  const rWB = resolveKinship(['w', 'b'], 'm', cs);
  assert.ok(rWB.archaic.includes('šurin'));
  const rWZ = resolveKinship(['w', 'z'], 'm', cs);
  assert.ok(rWZ.archaic.includes('zelva'));
});

it('Manželův bratr (deveř)', () => {
  const rHB = resolveKinship(['h', 'b'], 'f', cs);
  assert.ok(rHB.archaic.includes('deveř'));
});

it('Tchán, tchyně, snacha, zeť, svat, svatka', () => {
  const rWF = resolveKinship(['w', 'f'], 'm', cs);
  assert.ok(rWF.name.includes('Tchán'));
  const rSW = resolveKinship(['s', 'w'], 'm', cs);
  assert.strictEqual(rSW.name, 'Snacha');
  const rDH = resolveKinship(['d', 'h'], 'm', cs);
  assert.strictEqual(rDH.name, 'Zeť');
  const rSWF = resolveKinship(['s', 'w', 'f'], 'm', cs);
  assert.ok(rSWF.name.includes('Svat'));
});

console.log('\n5. Vzájemný vztah (互查 - Mutual query / Invert perspective):');
it('Muž: Strýc -> já jsem jeho synovec', () => {
  const inv = invertChain(['f', 'b'], 'm');
  const rInv = resolveKinship(inv, 'm', cs);
  assert.strictEqual(rInv.name, 'Synovec (bratrův syn)');
});

it('Žena: Strýc -> já jsem jeho neteř', () => {
  const inv = invertChain(['f', 'b'], 'f');
  const rInv = resolveKinship(inv, 'm', cs);
  assert.strictEqual(rInv.name, 'Neteř (bratrova dcera)');
});

it('Muž: Manželčin otec (tchán) -> já jsem jeho zeť', () => {
  const inv = invertChain(['w', 'f'], 'm');
  const rInv = resolveKinship(inv, 'm', cs);
  assert.strictEqual(rInv.name, 'Zeť');
});

it('Žena: Manželův otec (tchán) -> já jsem jeho snacha', () => {
  const inv = invertChain(['h', 'f'], 'f');
  const rInv = resolveKinship(inv, 'm', cs);
  assert.strictEqual(rInv.name, 'Snacha');
});

console.log('\n6. Cizí jazyky (Angličtina a Čínština):');
it('Anglický překlad pro strýce a synovce', () => {
  const rEN = resolveKinship(['f', 'b'], 'm', en);
  assert.strictEqual(rEN.name, 'Paternal Uncle');
});

it('Čínský překlad (podle předlohy)', () => {
  const rZH = resolveKinship(['f', 'f'], 'm', zh);
  assert.strictEqual(rZH.name, '爷爷');
});

console.log('\n7. Nové jazyky (Korejština, Ruština, Polština, Němčina):');
it('Korejský překlad (할아버지, 큰아버지, 며느리)', () => {
  const rKO1 = resolveKinship(['f', 'f'], 'm', ko);
  assert.ok(rKO1.name.includes('할아버지'));
  const rKO2 = resolveKinship(['s', 'w'], 'm', ko);
  assert.strictEqual(rKO2.name, '며느리');
});

it('Ruský překlad (Дядя, Шурин, Невестка)', () => {
  const rRU1 = resolveKinship(['f', 'b'], 'm', ru);
  assert.strictEqual(rRU1.name, 'Дядя (брат отца)');
  const rRU2 = resolveKinship(['w', 'b'], 'm', ru);
  assert.strictEqual(rRU2.name, 'Шурин');
});

it('Polský překlad (Stryj, Szwagier, Bratanek)', () => {
  const rPL1 = resolveKinship(['f', 'b'], 'm', pl);
  assert.strictEqual(rPL1.name, 'Stryj (brat ojca)');
  const rPL2 = resolveKinship(['b', 's'], 'm', pl);
  assert.strictEqual(rPL2.name, 'Bratanek (syn brata)');
});

it('Německý překlad (Großvater, Onkel, Schwiegervater)', () => {
  const rDE1 = resolveKinship(['f', 'f'], 'm', de);
  assert.strictEqual(rDE1.name, 'Großvater (väterlicherseits)');
  const rDE2 = resolveKinship(['w', 'f'], 'm', de);
  assert.strictEqual(rDE2.name, 'Schwiegervater');
});

console.log(`\n========================================`);
console.log(`Výsledky testů: ${passed} / ${total} prošlo.`);
if (passed !== total) {
  process.exit(1);
}
