import { resolveKinship, simplifyChain, invertChain, getTokenGender } from '../js/engine/kinship-engine.js';
import { cs } from '../js/i18n/cs.js';

console.log('=== INVESTIGATION SCRIPT ===\n');

const testCases = [
  { name: 'Otec (f)', chain: ['f'], ego: 'm' },
  { name: 'Matka (m)', chain: ['m'], ego: 'm' },
  { name: 'Syn (s)', chain: ['s'], ego: 'm' },
  { name: 'Dcera (d)', chain: ['d'], ego: 'm' },
  { name: 'Manželka (w)', chain: ['w'], ego: 'm' },
  { name: 'Manžel (h)', chain: ['h'], ego: 'f' },
  { name: 'Strýc (f, b)', chain: ['f', 'b'], ego: 'm' },
  { name: 'Teta (f, z)', chain: ['f', 'z'], ego: 'm' },
  { name: 'Bratranec (f, b, s)', chain: ['f', 'b', 's'], ego: 'm' },
  { name: 'Tchán (w, f)', chain: ['w', 'f'], ego: 'm' },
  { name: 'Tchyně (w, m)', chain: ['w', 'm'], ego: 'm' },
  { name: 'Snacha (s, w)', chain: ['s', 'w'], ego: 'm' },
  { name: 'Zeť (d, h)', chain: ['d', 'h'], ego: 'm' },
  { name: 'Macecha (step_m)', chain: ['step_m'], ego: 'm' },
  { name: 'Otčím (step_f)', chain: ['step_f'], ego: 'm' },
  { name: 'Nevlastní bratr (step_b)', chain: ['step_b'], ego: 'm' },
  { name: 'Nevlastní sestra (step_z)', chain: ['step_z'], ego: 'm' },
  { name: 'Kmotr (god_f)', chain: ['god_f'], ego: 'm' },
  { name: 'Kmotra (god_m)', chain: ['god_m'], ego: 'm' },

  // User's specific cases:
  { name: 'Macecha -> jiný manžel -> syn (step_m, h, s)', chain: ['step_m', 'h', 's'], ego: 'm' },
  { name: 'Macecha -> jiný manžel -> syn (step_m, step_h, s)', chain: ['step_m', 'step_h', 's'], ego: 'm' },
  { name: 'Macecha -> jiný manžel -> syn (step_m, step_h, step_s)', chain: ['step_m', 'step_h', 'step_s'], ego: 'm' },
  { name: 'Macecha -> syn (step_m, s)', chain: ['step_m', 's'], ego: 'm' },
  { name: 'Otec -> macecha -> jiný manžel -> syn (f, step_w, h, s)', chain: ['f', 'step_w', 'h', 's'], ego: 'm' },
  { name: 'Otec -> macecha -> jiný manžel -> syn (f, step_w, step_h, s)', chain: ['f', 'step_w', 'step_h', 's'], ego: 'm' },
  { name: 'Matka -> otčím -> syn (m, step_h, s)', chain: ['m', 'step_h', 's'], ego: 'm' },
  { name: 'Otčím -> jiná manželka -> syn (step_f, w, s)', chain: ['step_f', 'w', 's'], ego: 'm' },
  { name: 'Otčím -> jiná manželka -> syn (step_f, step_w, s)', chain: ['step_f', 'step_w', 's'], ego: 'm' },
];

for (const tc of testCases) {
  const simplified = simplifyChain(tc.chain, tc.ego);
  const orig = resolveKinship(tc.chain, tc.ego, cs);

  // Notice: when invertChain is called, what should be the perspective?
  const targetGender = getTokenGender(tc.chain[tc.chain.length - 1]) || 'm';
  const inv = invertChain(tc.chain, tc.ego);
  // How does resolveKinship resolve inv when passed tc.ego vs targetGender?
  const invWithEgo = resolveKinship(inv, tc.ego, cs);
  const invWithTarget = resolveKinship(inv, targetGender, cs);

  console.log(`[${tc.name}] (ego: ${tc.ego})`);
  console.log(`  Raw: [${tc.chain.join(',')}] -> Simplified: [${simplified.join(',')}]`);
  console.log(`  Direct: "${orig.name}" (${orig.key})`);
  console.log(`  Inverted chain: [${inv.join(',')}]`);
  console.log(`  Inv resolved (speaker=ego): "${invWithEgo.name}" (${invWithEgo.key})`);
  console.log(`  Inv resolved (speaker=target): "${invWithTarget.name}" (${invWithTarget.key})`);
  console.log('');
}
