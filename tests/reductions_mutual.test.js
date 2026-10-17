import { resolveKinship, simplifyChain, invertChain, getTokenGender, getDeadEndTokens } from '../js/engine/kinship-engine.js';
import { cs } from '../js/i18n/cs.js';
import { en } from '../js/i18n/en.js';
import { sk } from '../js/i18n/sk.js';
import { de } from '../js/i18n/de.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

function assertEquals(actual, expected, message) {
  if (actual === expected) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message} (Očekáváno: "${expected}", Obdrženo: "${actual}")`);
  }
}

console.log('=== TEST SUITE: REDUKČNÍ PRAVIDLA A VZÁJEMNÉ VZTAHY (HEADLESS) ===\n');

// 1. Uživatelský scénář: Já - Macecha - jiný manžel - syn / dcera
console.log('1. Stepparent other marriage children (Macecha -> jiný manžel -> syn):');
{
  // step_m, h, s -> Nevlastní bratr
  const res1 = resolveKinship(['step_m', 'h', 's'], 'm', cs);
  assertEquals(res1.name, 'Nevlastní bratr', 'step_m, h, s = Nevlastní bratr');
  assertEquals(res1.key, 'step_b', 'Klíč je step_b');

  // step_m, step_h, s -> Nevlastní bratr
  const res2 = resolveKinship(['step_m', 'step_h', 's'], 'm', cs);
  assertEquals(res2.name, 'Nevlastní bratr', 'step_m, step_h, s = Nevlastní bratr');

  // step_m, step_h, step_s -> Nevlastní bratr
  const res3 = resolveKinship(['step_m', 'step_h', 'step_s'], 'm', cs);
  assertEquals(res3.name, 'Nevlastní bratr', 'step_m, step_h, step_s = Nevlastní bratr');

  // step_m, h, step_s -> Nevlastní bratr
  const res4 = resolveKinship(['step_m', 'h', 'step_s'], 'm', cs);
  assertEquals(res4.name, 'Nevlastní bratr', 'step_m, h, step_s = Nevlastní bratr');

  // Dcery: step_m, h, d -> Nevlastní sestra
  const res5 = resolveKinship(['step_m', 'h', 'd'], 'm', cs);
  assertEquals(res5.name, 'Nevlastní sestra', 'step_m, h, d = Nevlastní sestra');

  const res6 = resolveKinship(['step_m', 'step_h', 'step_d'], 'm', cs);
  assertEquals(res6.name, 'Nevlastní sestra', 'step_m, step_h, step_d = Nevlastní sestra');
}

// 2. Otčím -> jiná manželka -> syn / dcera
console.log('\n2. Stepfather other marriage children (Otčím -> jiná manželka -> syn/dcera):');
{
  const res1 = resolveKinship(['step_f', 'w', 's'], 'm', cs);
  assertEquals(res1.name, 'Nevlastní bratr', 'step_f, w, s = Nevlastní bratr');

  const res2 = resolveKinship(['step_f', 'step_w', 's'], 'm', cs);
  assertEquals(res2.name, 'Nevlastní bratr', 'step_f, step_w, s = Nevlastní bratr');

  const res3 = resolveKinship(['step_f', 'step_w', 'step_s'], 'm', cs);
  assertEquals(res3.name, 'Nevlastní bratr', 'step_f, step_w, step_s = Nevlastní bratr');

  const res4 = resolveKinship(['step_f', 'w', 'd'], 'm', cs);
  assertEquals(res4.name, 'Nevlastní sestra', 'step_f, w, d = Nevlastní sestra');

  const res5 = resolveKinship(['step_f', 'step_w', 'step_d'], 'm', cs);
  assertEquals(res5.name, 'Nevlastní sestra', 'step_f, step_w, step_d = Nevlastní sestra');
}

// 3. Delší řetězce: Otec -> macecha -> jiný manžel -> syn
console.log('\n3. Compound step chains (f, step_w, h, s):');
{
  const res1 = resolveKinship(['f', 'step_w', 'h', 's'], 'm', cs);
  assertEquals(res1.name, 'Nevlastní bratr', 'f, step_w, h, s = Nevlastní bratr');

  const res2 = resolveKinship(['f', 'step_w', 'step_h', 's'], 'm', cs);
  assertEquals(res2.name, 'Nevlastní bratr', 'f, step_w, step_h, s = Nevlastní bratr');

  const res3 = resolveKinship(['m', 'step_h', 'w', 's'], 'm', cs);
  assertEquals(res3.name, 'Nevlastní bratr', 'm, step_h, w, s = Nevlastní bratr');
}

// 4. In-law synovci a neteře (Spouse brother/sister son/daughter - 0% DNA)
console.log('\n4. In-law nephews/nieces & grand-nephews (0% DNA affinity):');
{
  // w, b, s = Synovec z manželčiny strany
  const res1 = resolveKinship(['w', 'b', 's'], 'm', cs);
  assert(res1.name.includes('Synovec'), 'w, b, s = Synovec');
  assertEquals(res1.consanguinity.dnaPercent, 0, 'w, b, s má 0% DNA (afinitní vztah)');

  // h, b, s = Synovec z manželovy strany
  const res2 = resolveKinship(['h', 'b', 's'], 'f', cs);
  assert(res2.name.includes('Synovec'), 'h, b, s = Synovec');
  assertEquals(res2.consanguinity.dnaPercent, 0, 'h, b, s má 0% DNA (afinitní vztah)');

  // w, z, d = Neteř z manželčiny strany
  const res3 = resolveKinship(['w', 'z', 'd'], 'm', cs);
  assert(res3.name.includes('Neteř'), 'w, z, d = Neteř');
  assertEquals(res3.consanguinity.dnaPercent, 0, 'w, z, d má 0% DNA (afinitní vztah)');

  // Uživatelský scénář: Alena Krejčíková -> manžel -> sestra -> syn -> syn (h, z, s, s)
  const res4 = resolveKinship(['h', 'z', 's', 's'], 'f', cs);
  assert(res4.name.includes('Prasynovec'), 'h, z, s, s = Prasynovec');
  assertEquals(res4.consanguinity.dnaPercent, 0, 'h, z, s, s má 0% DNA (žádná pokrevní příbuznost)');
  assert(res4.inheritance.classNumber === null, 'h, z, s, s je mimo zákonné dědické třídy');
  assert(res4.marriageImpediment.hasImpediment === false, 'h, z, s, s nemá překážku sňatku');

  // Uživatelský dotaz: ja-manžel-sestra-syn-syn-bratr (h, z, s, s, b) -> bratr syna je také syn -> Prasynovec
  const res5 = resolveKinship(['h', 'z', 's', 's', 'b'], 'f', cs);
  assert(res5.name.includes('Prasynovec'), 'h, z, s, s, b redukuje na Prasynovec');
  assertEquals(res5.consanguinity.dnaPercent, 0, 'h, z, s, s, b má 0% DNA');
  const invRes5 = resolveKinship(invertChain(['h', 'z', 's', 's', 'b'], 'f'), 'm', cs);
  assert(invRes5.name.includes('Prateta'), 'Vzájemný vztah k h, z, s, s, b je Prateta');
}

// 5. InvertChain tests for step relations
console.log('\n5. InvertChain correctness for step relations:');
{
  // step_m, h, s inverts back to step_b
  const inv1 = invertChain(['step_m', 'h', 's'], 'm');
  const resInv1 = resolveKinship(inv1, 'm', cs);
  assertEquals(resInv1.name, 'Nevlastní bratr', 'Invert(step_m, h, s) = Nevlastní bratr');

  // step_f, w, s inverts back to step_b
  const inv2 = invertChain(['step_f', 'w', 's'], 'm');
  const resInv2 = resolveKinship(inv2, 'm', cs);
  assertEquals(resInv2.name, 'Nevlastní bratr', 'Invert(step_f, w, s) = Nevlastní bratr');

  // Teta (f, b, w) inverts to Synovec
  const inv3 = invertChain(['f', 'b', 'w'], 'm');
  const resInv3 = resolveKinship(inv3, 'f', cs);
  assert(resInv3.name.includes('Synovec'), 'Invert(f, b, w) s mluvčím ženou = Synovec');

  // Strýc (f, z, h) inverts to Synovec
  const inv4 = invertChain(['f', 'z', 'h'], 'm');
  const resInv4 = resolveKinship(inv4, 'm', cs);
  assert(resInv4.name.includes('Synovec'), 'Invert(f, z, h) s mluvčím mužem = Synovec');
}

// 6. Multilingual stepbrother resolution
console.log('\n6. Multilingual stepbrother resolution:');
{
  const resEn = resolveKinship(['step_m', 'h', 's'], 'm', en);
  assertEquals(resEn.name, 'Stepbrother', 'English: Stepbrother');

  const resSk = resolveKinship(['step_m', 'h', 's'], 'm', sk);
  assertEquals(resSk.name, 'Nevlastný brat', 'Slovak: Nevlastný brat');

  const resDe = resolveKinship(['step_m', 'h', 's'], 'm', de);
  assertEquals(resDe.name, 'Stiefbruder', 'German: Stiefbruder');
}

// 7. Full inventory audit: every relation in cs.js must invert to a known relation
console.log('\n7. Exhaustive audit of cs.js (conservative perspective per ego gender):');
{
  let unhandled = 0;
  for (const [key, val] of Object.entries(cs.relations)) {
    const chain = key.split(',');
    for (const ego of ['m', 'f']) {
      // V konzervativní rodinné genealogii má muž (m) manželku (w), žena (f) manžela (h)
      if (chain[0] === 'w' && ego === 'f') continue;
      if (chain[0] === 'h' && ego === 'm') continue;

      const targetGender = getTokenGender(chain[chain.length - 1]) || 'm';
      const inv = invertChain(chain, ego);
      const resInv = resolveKinship(inv, targetGender, cs);
      if (resInv.name === 'Vzdálený příbuzný') {
        unhandled++;
        console.error(`  FAIL INVERSION: [${key}] "${val.name}" (ego: ${ego}) -> inv: [${inv.join(',')}] -> Vzdálený příbuzný`);
      }
    }
  }
  assertEquals(unhandled, 0, '100 % všech vztahů se invertuje na platný rodinný termín bez selhání');
}

// 8. Stejnopohlavní afinitní vazby v kalkulačce (bratr -> manžel = švagr, matka -> bratr -> manžel = strýc...)
console.log('\n8. Stejnopohlavní afinitní vazby v kalkulačce:');
{
  const res1 = resolveKinship(['b', 'h'], 'm', cs);
  assertEquals(res1.name, 'Švagr', 'b, h (bratr -> manžel) = Švagr');

  const res2 = resolveKinship(['m', 'b', 'h'], 'm', cs);
  assertEquals(res2.name, 'Strýc', 'm, b, h (matka -> bratr -> manžel) = Strýc');

  const res3 = resolveKinship(['f', 'b', 'h'], 'm', cs);
  assertEquals(res3.name, 'Strýc', 'f, b, h (otec -> bratr -> manžel) = Strýc');

  const res4 = resolveKinship(['z', 'w'], 'f', cs);
  assertEquals(res4.name, 'Švagrová', 'z, w (sestra -> manželka) = Švagrová');

  const res5 = resolveKinship(['s', 'h'], 'm', cs);
  assertEquals(res5.name, 'Zeť', 's, h (syn -> manžel) = Zeť');

  const res6 = resolveKinship(['d', 'w'], 'f', cs);
  assertEquals(res6.name, 'Snacha', 'd, w (dcera -> manželka) = Snacha');
}

// 9. Režimy vyhodnocení nejednoznačných vazeb (preferMode: 'own' vs 'step')
console.log('\n9. Režimy vyhodnocení nejednoznačných vazeb (preferMode: own vs step):');
{
  // A) Já -> Manželka -> Syn (w, s)
  assertEquals(simplifyChain(['w', 's'], 'm', 'own').join(','), 's', 'own: w,s zkrátí na s (Syn)');
  assertEquals(resolveKinship(['w', 's'], 'm', cs, 'own').name, 'Syn', 'own: Já -> Manželka -> Syn = Syn');
  assertEquals(simplifyChain(['w', 's'], 'm', 'step').join(','), 'step_s', 'step: w,s vyhodnotí jako step_s');
  assertEquals(resolveKinship(['w', 's'], 'm', cs, 'step').name, 'Nevlastní syn', 'step: Já -> Manželka -> Syn = Nevlastní syn');

  // B) Já -> Otec -> Manželka (f, w)
  assertEquals(resolveKinship(['f', 'w'], 'm', cs, 'own').name, 'Matka', 'own: Já -> Otec -> Manželka = Matka');
  assertEquals(resolveKinship(['f', 'w'], 'm', cs, 'step').name, 'Macecha', 'step: Já -> Otec -> Manželka = Macecha');

  // C) Já -> Otec -> Syn (f, s)
  assertEquals(resolveKinship(['f', 's'], 'm', cs, 'own').name, 'Bratr', 'own: Já -> Otec -> Syn = Bratr');
  assertEquals(resolveKinship(['f', 's'], 'm', cs, 'step').name, 'Polobratr jednokrevní', 'step: Já -> Otec -> Syn = Polobratr jednokrevní');

  // D) Já -> Bratr -> Sestra (b, z)
  assertEquals(resolveKinship(['b', 'z'], 'm', cs, 'own').name, 'Sestra', 'own: Já -> Bratr -> Sestra = Sestra');
  assertEquals(resolveKinship(['b', 'z'], 'm', cs, 'step').name, 'Nevlastní sestra', 'step: Já -> Bratr -> Sestra = Nevlastní sestra');

  // E) Já -> Bratr -> Otec (b, f)
  assertEquals(resolveKinship(['b', 'f'], 'm', cs, 'own').name, 'Otec', 'own: Já -> Bratr -> Otec = Otec');
  assertEquals(resolveKinship(['b', 'f'], 'm', cs, 'step').name, 'Otčím', 'step: Já -> Bratr -> Otec = Otčím');
}

// 10. Pravidlo prosté cesty a prevence slepých uliček (getDeadEndTokens)
console.log('\n10. Pravidlo prosté cesty a detekce slepých uliček (getDeadEndTokens):');
{
  const deWife = getDeadEndTokens(['w'], 'm');
  assert(deWife.has('h') && deWife.has('w'), 'Po Manželce jsou Manžel i Manželka slepá ulička');
  assert(!deWife.has('s') && !deWife.has('f'), 'Po Manželce jsou Syn a Otec povoleni');

  const deSonMale = getDeadEndTokens(['s'], 'm');
  assert(deSonMale.has('f') && !deSonMale.has('m'), 'Pro muže po Synovi je Otec slepá ulička (návrat na Já), ale Matka je povolena');

  const deSonFemale = getDeadEndTokens(['s'], 'f');
  assert(deSonFemale.has('m') && !deSonFemale.has('f'), 'Pro ženu po Synovi je Matka slepá ulička (návrat na Já), ale Otec je povolen');

  const deFatherSon = getDeadEndTokens(['f', 's'], 'm');
  assert(deFatherSon.has('f') && !deFatherSon.has('m'), 'Po Otec -> Syn je Otec slepá ulička (návrat na Otce)');
}

console.log('\n========================================');
console.log(`Výsledky testů: ${passed} / ${passed + failed} prošlo.`);
if (failed > 0) {
  console.error(`SELHALO ${failed} testů!`);
  process.exit(1);
} else {
  console.log('VŠECHNY TESTY PROŠLY NA VÝBORNOU!');
}

