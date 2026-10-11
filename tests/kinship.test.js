/**
 * Testy pro kalkulačku rodinných vztahů
 */

import assert from 'node:assert';
import { resolveKinship, invertChain, simplifyChain } from '../js/engine/kinship-engine.js';
import { parseGedcom } from '../js/engine/gedcom-parser.js';
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
import { uk } from '../js/i18n/uk.js';
import { pt } from '../js/i18n/pt.js';
import { nl } from '../js/i18n/nl.js';
import { hu } from '../js/i18n/hu.js';
import { tr } from '../js/i18n/tr.js';
import { el } from '../js/i18n/el.js';
import { sv } from '../js/i18n/sv.js';
import { hi } from '../js/i18n/hi.js';
import { id as idLang } from '../js/i18n/id.js';
import { ar } from '../js/i18n/ar.js';
import { hr } from '../js/i18n/hr.js';
import { ro } from '../js/i18n/ro.js';

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

console.log('\n12. Dědické třídy (NOZ ČR) a překážky manželství (§ 675 NOZ):');
it('Dědické třídy: potomci (1. třída), rodiče (2. třída), sourozenci (3. třída), prarodiče (4. třída)', () => {
  const rSon = resolveKinship(['s'], 'm', cs);
  assert.strictEqual(rSon.inheritance.classNumber, 1);

  const rMother = resolveKinship(['m'], 'm', cs);
  assert.strictEqual(rMother.inheritance.classNumber, 2);

  const rBro = resolveKinship(['b'], 'm', cs);
  assert.strictEqual(rBro.inheritance.classNumber, 3);

  const rGrand = resolveKinship(['f', 'f'], 'm', cs);
  assert.strictEqual(rGrand.inheritance.classNumber, 4);

  const rCousin = resolveKinship(['f', 'b', 's'], 'm', cs);
  assert.strictEqual(rCousin.inheritance.classNumber, null); // Bratranci jsou mimo zákonné třídy
});

it('Překážky manželství: zákaz v přímé linii a mezi sourozenci, povoleno u bratranců', () => {
  const rFather = resolveKinship(['f'], 'm', cs);
  assert.strictEqual(rFather.marriageImpediment.hasImpediment, true);

  const rSister = resolveKinship(['z'], 'm', cs);
  assert.strictEqual(rSister.marriageImpediment.hasImpediment, true);

  const rCousin = resolveKinship(['f', 'b', 'd'], 'm', cs);
  assert.strictEqual(rCousin.marriageImpediment.hasImpediment, false);
});

console.log('\n13. Nově přidané jazyky (Ukrajinština, Portugalština, Nizozemština, Maďarština, Turečtina, Řečtina, Švédština, Hindština, Indonéština, Arabština, Chorvatština, Rumunština):');
it('Ukrajinský překlad (Дід, Дядько, Невістка, Вітчим)', () => {
  assert.strictEqual(resolveKinship(['f', 'f'], 'm', uk).name, 'Дід (по батькові)');
  assert.strictEqual(resolveKinship(['f', 'b'], 'm', uk).name, 'Дядько (по батькові)');
  assert.strictEqual(resolveKinship(['s', 'w'], 'm', uk).name, 'Невістка');
  assert.strictEqual(resolveKinship(['step_f'], 'm', uk).name, 'Вітчим');
});

it('Portugalský překlad (Avô, Tio, Nora, Padrasto)', () => {
  assert.strictEqual(resolveKinship(['f', 'f'], 'm', pt).name, 'Avô paterno');
  assert.strictEqual(resolveKinship(['f', 'b'], 'm', pt).name, 'Tio paterno');
  assert.strictEqual(resolveKinship(['s', 'w'], 'm', pt).name, 'Nora');
  assert.strictEqual(resolveKinship(['step_f'], 'm', pt).name, 'Padrasto');
});

it('Nizozemský překlad (Grootvader, Oom, Schoondochter, Stiefvader)', () => {
  assert.strictEqual(resolveKinship(['f', 'f'], 'm', nl).name, 'Grootvader (vaderszijde)');
  assert.strictEqual(resolveKinship(['f', 'b'], 'm', nl).name, 'Oom (vaderszijde)');
  assert.strictEqual(resolveKinship(['s', 'w'], 'm', nl).name, 'Schoondochter');
  assert.strictEqual(resolveKinship(['step_f'], 'm', nl).name, 'Stiefvader');
});

it('Maďarský překlad (Nagyapa, Nagybátya, Meny, Mostohaapa)', () => {
  assert.strictEqual(resolveKinship(['f', 'f'], 'm', hu).name, 'Apai nagyapa');
  assert.strictEqual(resolveKinship(['f', 'b'], 'm', hu).name, 'Nagybátya (apai)');
  assert.strictEqual(resolveKinship(['s', 'w'], 'm', hu).name, 'Meny');
  assert.strictEqual(resolveKinship(['step_f'], 'm', hu).name, 'Mostohaapa');
});

it('Turecký překlad (Dede, Amca, Gelin, Üvey baba)', () => {
  assert.strictEqual(resolveKinship(['f', 'f'], 'm', tr).name, 'Dede (baba tarafı)');
  assert.strictEqual(resolveKinship(['f', 'b'], 'm', tr).name, 'Amca');
  assert.strictEqual(resolveKinship(['s', 'w'], 'm', tr).name, 'Gelin');
  assert.strictEqual(resolveKinship(['step_f'], 'm', tr).name, 'Üvey baba');
});

it('Řecký překlad (Παππούς, Θείος, Νύφη, Πατριός)', () => {
  assert.strictEqual(resolveKinship(['f', 'f'], 'm', el).name, 'Παππούς (πατρικός)');
  assert.strictEqual(resolveKinship(['f', 'b'], 'm', el).name, 'Θείος (πατρικός)');
  assert.strictEqual(resolveKinship(['s', 'w'], 'm', el).name, 'Νύφη');
  assert.strictEqual(resolveKinship(['step_f'], 'm', el).name, 'Πατριός');
});

it('Švédský překlad (Farfar, Farbror, Svärdotter, Styvfar)', () => {
  assert.strictEqual(resolveKinship(['f', 'f'], 'm', sv).name, 'Farfar');
  assert.strictEqual(resolveKinship(['f', 'b'], 'm', sv).name, 'Farbror');
  assert.strictEqual(resolveKinship(['s', 'w'], 'm', sv).name, 'Svärdotter');
  assert.strictEqual(resolveKinship(['step_f'], 'm', sv).name, 'Styvfar');
});

it('Hindský překlad (दादा, चाचा, बहू, सौतेले पिता)', () => {
  assert.strictEqual(resolveKinship(['f', 'f'], 'm', hi).name, 'दादा');
  assert.strictEqual(resolveKinship(['f', 'b'], 'm', hi).name, 'चाचा');
  assert.strictEqual(resolveKinship(['s', 'w'], 'm', hi).name, 'बहू');
  assert.strictEqual(resolveKinship(['step_f'], 'm', hi).name, 'सौतेले पिता');
});

it('Indonéský překlad (Kakek, Paman, Menantu perempuan, Ayah tiri)', () => {
  assert.strictEqual(resolveKinship(['f', 'f'], 'm', idLang).name, 'Kakek (dari pihak ayah)');
  assert.strictEqual(resolveKinship(['f', 'b'], 'm', idLang).name, 'Paman (dari pihak ayah)');
  assert.strictEqual(resolveKinship(['s', 'w'], 'm', idLang).name, 'Menantu perempuan');
  assert.strictEqual(resolveKinship(['step_f'], 'm', idLang).name, 'Ayah tiri');
});

it('Arabský překlad (الجد لأب, العم, زوجة الابن, زوج الأم)', () => {
  assert.strictEqual(resolveKinship(['f', 'f'], 'm', ar).name, 'الجد لأب');
  assert.strictEqual(resolveKinship(['f', 'b'], 'm', ar).name, 'العم');
  assert.strictEqual(resolveKinship(['s', 'w'], 'm', ar).name, 'زوجة الابن');
  assert.strictEqual(resolveKinship(['step_f'], 'm', ar).name, 'زوج الأم');
});

it('Chorvatský překlad (Djed, Stric, Snaha, Očuh)', () => {
  assert.strictEqual(resolveKinship(['f', 'f'], 'm', hr).name, 'Djed (po ocu)');
  assert.strictEqual(resolveKinship(['f', 'b'], 'm', hr).name, 'Stric');
  assert.strictEqual(resolveKinship(['s', 'w'], 'm', hr).name, 'Snaha');
  assert.strictEqual(resolveKinship(['step_f'], 'm', hr).name, 'Očuh');
});

it('Rumunský překlad (Bunic, Unchi, Noră, Tată vitreg)', () => {
  assert.strictEqual(resolveKinship(['f', 'f'], 'm', ro).name, 'Bunic (pe linie paternă)');
  assert.strictEqual(resolveKinship(['f', 'b'], 'm', ro).name, 'Unchi (fratele tatălui)');
  assert.strictEqual(resolveKinship(['s', 'w'], 'm', ro).name, 'Noră');
  assert.strictEqual(resolveKinship(['step_f'], 'm', ro).name, 'Tată vitreg');
});

console.log('\n14. Genealogický import a analýza GEDCOM souborů (.ged):');
it('Parsování GEDCOM struktury a extrakce osob a rodin', () => {
  const sampleGed = `
0 HEAD
1 SOUR TestTree
0 @I1@ INDI
1 NAME Jan /Novák/
1 SEX M
1 BIRT
2 DATE 1920
1 FAMS @F1@
0 @I2@ INDI
1 NAME Marie /Svobodová/
1 SEX F
1 BIRT
2 DATE 1925
1 FAMS @F1@
0 @I3@ INDI
1 NAME Josef /Novák/
1 SEX M
1 BIRT
2 DATE 1950
1 FAMC @F1@
1 FAMS @F2@
0 @I4@ INDI
1 NAME Anna /Nováková/
1 SEX F
1 BIRT
2 DATE 1953
1 FAMC @F1@
0 @I5@ INDI
1 NAME Tomáš /Novák/
1 SEX M
1 BIRT
2 DATE 1980
1 FAMC @F2@
0 @F1@ FAM
1 HUSB @I1@
1 WIFE @I2@
1 CHIL @I3@
1 CHIL @I4@
0 @F2@ FAM
1 HUSB @I3@
1 CHIL @I5@
0 TRLR
  `;

  const parsed = parseGedcom(sampleGed);
  assert.strictEqual(parsed.individuals.size, 5);
  assert.strictEqual(parsed.families.size, 2);

  const list = parsed.getIndividualList();
  assert.strictEqual(list.length, 5);
  assert.strictEqual(list.find(p => p.id === '@I1@').name, 'Jan Novák');

  // Test 1: Tomáš (@I5@) -> Jan (@I1@) = Dědeček (f -> f)
  const pathGrandfather = parsed.findKinshipChain('@I5@', '@I1@');
  assert.deepStrictEqual(pathGrandfather.chain, ['f', 'f']);
  const resGF = resolveKinship(pathGrandfather.chain, 'm', cs);
  assert.strictEqual(resGF.name, 'Dědeček (otcův otec)');

  // Test 2: Josef (@I3@) -> Anna (@I4@) = Sestra (přímý sourozenec přes FAMC = 1 krok 'z')
  const pathSister = parsed.findKinshipChain('@I3@', '@I4@');
  assert.deepStrictEqual(pathSister.chain, ['z']);
  const resSister = resolveKinship(pathSister.chain, 'm', cs);
  assert.strictEqual(resSister.name, 'Sestra');

  // Test 3: Tomáš (@I5@) -> Anna (@I4@) = Teta (f -> z = otcova sestra)
  const pathAunt = parsed.findKinshipChain('@I5@', '@I4@');
  assert.deepStrictEqual(pathAunt.chain, ['f', 'z']);
  const resAunt = resolveKinship(pathAunt.chain, 'm', cs);
  assert.strictEqual(resAunt.name, 'Teta (otcova sestra)');
});

it('Detekce nepropojených větví rodokmenu', () => {
  const disconnectedGed = `
0 @I1@ INDI
1 NAME Karel /Dvořák/
1 SEX M
0 @I2@ INDI
1 NAME Eva /Černá/
1 SEX F
0 TRLR
  `;
  const parsed = parseGedcom(disconnectedGed);
  const result = parsed.findKinshipChain('@I1@', '@I2@');
  assert.strictEqual(result.chain, null);
  assert.ok(result.error);
});

console.log(`\n========================================`);
console.log(`Výsledky testů: ${passed} / ${total} prošlo.`);
if (passed !== total) {
  process.exit(1);
}



