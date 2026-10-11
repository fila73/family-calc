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
import { fr } from '../js/i18n/fr.js';
import { it as itLang } from '../js/i18n/it.js';
import { es } from '../js/i18n/es.js';
import { ja } from '../js/i18n/ja.js';
import { vi } from '../js/i18n/vi.js';

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

console.log('\n8. Redukční pravidla a modifikátory (Shift / Nevlastní, Křestní):');
it('Redukce bratr -> syn -> matka = švagrová', () => {
  const rBSM = resolveKinship(['b', 's', 'm'], 'm', cs);
  assert.ok(rBSM.name.includes('Švagrová'), `Expected Švagrová but got ${rBSM.name}`);
});

it('Redukce sestra -> syn -> otec = švagr', () => {
  const rZSF = resolveKinship(['z', 's', 'f'], 'm', cs);
  assert.ok(rZSF.name.includes('Švagr'), `Expected Švagr but got ${rZSF.name}`);
});

it('Shift modifikátor: Macecha (step_m) a Otčím (step_f)', () => {
  const rStepM = resolveKinship(['step_m'], 'm', cs);
  assert.strictEqual(rStepM.name, 'Macecha');
  const rStepF = resolveKinship(['step_f'], 'm', cs);
  assert.strictEqual(rStepF.name, 'Otčím');
  
  // otec -> nevlastní manželka = macecha
  const rFW = resolveKinship(['f', 'step_w'], 'm', cs);
  assert.strictEqual(rFW.name, 'Macecha');
});

it('Polobratři (jednobřišní a jednokrevní)', () => {
  // matka -> nevlastní manžel -> syn = polobratr jednobřišní
  const rUterine = resolveKinship(['m', 'step_h', 's'], 'm', cs);
  assert.ok(rUterine.name.includes('Polobratr (jednobřišní)'), `Expected Polobratr (jednobřišní) but got ${rUterine.name}`);

  // otec -> nevlastní manželka -> syn = polobratr jednokrevní
  const rConsanguine = resolveKinship(['f', 'step_w', 's'], 'm', cs);
  assert.ok(rConsanguine.name.includes('Polobratr (jednokrevní)'), `Expected Polobratr (jednokrevní) but got ${rConsanguine.name}`);
});

it('Nevlastní sourozenci (nepokrevní svazek rodičů)', () => {
  // matka -> nevlastní manžel -> nevlastní syn = nevlastní bratr
  const rStepB = resolveKinship(['m', 'step_h', 'step_s'], 'm', cs);
  assert.strictEqual(rStepB.name, 'Nevlastní bratr');

  // přímý Shift + bratr
  const rDirectStepB = resolveKinship(['step_b'], 'm', cs);
  assert.strictEqual(rDirectStepB.name, 'Nevlastní bratr');
});

it('Křestní modifikátor a vzájemný vztah (kmotr / kmotřenec)', () => {
  const rGodF = resolveKinship(['god_f'], 'm', cs);
  assert.strictEqual(rGodF.name, 'Kmotr');
  const rGodM = resolveKinship(['god_m'], 'm', cs);
  assert.strictEqual(rGodM.name, 'Kmotra');

  // Invert perspektivy pro muže: pro mého kmotra jsem já kmotřenec
  const invM = invertChain(['god_f'], 'm');
  const rInvM = resolveKinship(invM, 'm', cs);
  assert.strictEqual(rInvM.name, 'Kmotřenec');

  // Invert pro ženu: kmotřenka
  const invF = invertChain(['god_f'], 'f');
  const rInvF = resolveKinship(invF, 'm', cs);
  assert.strictEqual(rInvF.name, 'Kmotřenka');
});

console.log('\n9. Románské jazyky (Francouzština, Italština, Španělština):');
it('Francouzský překlad (Grand-père, Oncle, Belle-fille, Belle-mère, Parrain)', () => {
  const rFR1 = resolveKinship(['f', 'f'], 'm', fr);
  assert.strictEqual(rFR1.name, 'Grand-père (paternel)');
  const rFR2 = resolveKinship(['f', 'b'], 'm', fr);
  assert.strictEqual(rFR2.name, 'Oncle (paternel)');
  const rFR3 = resolveKinship(['s', 'w'], 'm', fr);
  assert.strictEqual(rFR3.name, 'Belle-fille (bru)');
  const rFR4 = resolveKinship(['step_m'], 'm', fr);
  assert.strictEqual(rFR4.name, 'Belle-mère');
  const rFR5 = resolveKinship(['god_f'], 'm', fr);
  assert.strictEqual(rFR5.name, 'Parrain');
});

it('Italský překlad (Nonno, Zio, Nuora, Matrigna, Padrino)', () => {
  const rIT1 = resolveKinship(['f', 'f'], 'm', itLang);
  assert.strictEqual(rIT1.name, 'Nonno paterno');
  const rIT2 = resolveKinship(['f', 'b'], 'm', itLang);
  assert.strictEqual(rIT2.name, 'Zio (paterno)');
  const rIT3 = resolveKinship(['s', 'w'], 'm', itLang);
  assert.strictEqual(rIT3.name, 'Nuora');
  const rIT4 = resolveKinship(['step_m'], 'm', itLang);
  assert.strictEqual(rIT4.name, 'Matrigna');
  const rIT5 = resolveKinship(['god_f'], 'm', itLang);
  assert.strictEqual(rIT5.name, 'Padrino');
});

it('Španělský překlad (Abuelo, Tío, Nuera, Madrastra, Padrino)', () => {
  const rES1 = resolveKinship(['f', 'f'], 'm', es);
  assert.strictEqual(rES1.name, 'Abuelo paterno');
  const rES2 = resolveKinship(['f', 'b'], 'm', es);
  assert.strictEqual(rES2.name, 'Tío (paterno)');
  const rES3 = resolveKinship(['s', 'w'], 'm', es);
  assert.strictEqual(rES3.name, 'Nuera');
  const rES4 = resolveKinship(['step_m'], 'm', es);
  assert.strictEqual(rES4.name, 'Madrastra');
  const rES5 = resolveKinship(['god_f'], 'm', es);
  assert.strictEqual(rES5.name, 'Padrino');
});

console.log('\n10. Asijské jazyky - Japonština a Vietnamština:');
it('Japonský překlad (祖父, 伯父/叔父, 嫁, 継母, 代父)', () => {
  const rJA1 = resolveKinship(['f', 'f'], 'm', ja);
  assert.ok(rJA1.name.includes('祖父'), `Expected 祖父 but got ${rJA1.name}`);
  const rJA2 = resolveKinship(['f', 'b'], 'm', ja);
  assert.ok(rJA2.name.includes('伯父') || rJA2.name.includes('叔父'), `Expected 伯父/叔父 but got ${rJA2.name}`);
  const rJA3 = resolveKinship(['s', 'w'], 'm', ja);
  assert.ok(rJA3.name.includes('嫁'), `Expected 嫁 but got ${rJA3.name}`);
  const rJA4 = resolveKinship(['step_m'], 'm', ja);
  assert.ok(rJA4.name.includes('継母'), `Expected 継母 but got ${rJA4.name}`);
  const rJA5 = resolveKinship(['god_f'], 'm', ja);
  assert.ok(rJA5.name.includes('代父'), `Expected 代父 but got ${rJA5.name}`);
});

it('Vietnamský překlad (Ông nội, Bác/Chú, Con dâu, Mẹ kế, Cha đỡ đầu)', () => {
  const rVI1 = resolveKinship(['f', 'f'], 'm', vi);
  assert.strictEqual(rVI1.name, 'Ông nội');
  const rVI2 = resolveKinship(['f', 'b'], 'm', vi);
  assert.ok(rVI2.name.includes('Bác') || rVI2.name.includes('Chú'), `Expected Bác/Chú but got ${rVI2.name}`);
  const rVI3 = resolveKinship(['s', 'w'], 'm', vi);
  assert.strictEqual(rVI3.name, 'Con dâu');
  const rVI4 = resolveKinship(['step_m'], 'm', vi);
  assert.ok(rVI4.name.includes('Mẹ kế'), `Expected Mẹ kế but got ${rVI4.name}`);
  const rVI5 = resolveKinship(['god_f'], 'm', vi);
  assert.strictEqual(rVI5.name, 'Cha đỡ đầu');
});

console.log('\n11. Výpočet stupně příbuzenství a genetické shody:');
it('Pokrevní přímá linie a sourozenci', () => {
  const rF = resolveKinship(['f'], 'm', cs);
  assert.strictEqual(rF.consanguinity.degree, 1);
  assert.strictEqual(rF.consanguinity.dnaPercent, 50);

  const rFF = resolveKinship(['f', 'f'], 'm', cs);
  assert.strictEqual(rFF.consanguinity.degree, 2);
  assert.strictEqual(rFF.consanguinity.dnaPercent, 25);

  const rB = resolveKinship(['b'], 'm', cs);
  assert.strictEqual(rB.consanguinity.degree, 2);
  assert.strictEqual(rB.consanguinity.dnaPercent, 50);

  const rCousin = resolveKinship(['f', 'b', 's'], 'm', cs);
  assert.strictEqual(rCousin.consanguinity.degree, 4);
  assert.strictEqual(rCousin.consanguinity.dnaPercent, 12.5);
});

it('Afinitní a duchovní vztahy (0% biologická DNA)', () => {
  const rWife = resolveKinship(['w'], 'm', cs);
  assert.strictEqual(rWife.consanguinity.type, 'affinity');
  assert.strictEqual(rWife.consanguinity.dnaPercent, 0);

  const rGod = resolveKinship(['god_f'], 'm', cs);
  assert.strictEqual(rGod.consanguinity.type, 'spiritual');
  assert.strictEqual(rGod.consanguinity.dnaPercent, 0);
});

console.log(`\n========================================`);
console.log(`Výsledky testů: ${passed} / ${total} prošlo.`);
if (passed !== total) {
  process.exit(1);
}



