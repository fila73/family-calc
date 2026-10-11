import { resolveKinship, simplifyChain, invertChain, getTokenGender } from '../js/engine/kinship-engine.js';
import { cs } from '../js/i18n/cs.js';

console.log('=== FULL INVENTORY & INVERSION AUDIT OF CS.JS ===\n');

const relations = cs.relations;
let total = 0;
let invertedUnknown = 0;
const issues = [];

for (const [key, val] of Object.entries(relations)) {
  total++;
  const chain = key.split(',');
  
  // Test with both ego m and f
  for (const ego of ['m', 'f']) {
    const targetGender = getTokenGender(chain[chain.length - 1]) || 'm';
    const inv = invertChain(chain, ego);
    const invSimplified = simplifyChain(inv, targetGender);
    
    // Test resolving with speaker = targetGender
    const resolvedInv = resolveKinship(invSimplified, targetGender, cs);
    
    if (resolvedInv.name === 'Vzdálený příbuzný') {
      invertedUnknown++;
      issues.push({
        origKey: key,
        origName: val.name,
        ego,
        targetGender,
        invertedChain: inv.join(','),
        invSimplified: invSimplified.join(','),
        resolvedName: resolvedInv.name
      });
    }
  }
}

console.log(`Total relations tested: ${total} (x 2 genders = ${total * 2} runs)`);
console.log(`Inverted resulting in 'Vzdálený příbuzný': ${invertedUnknown}\n`);

console.log('--- ISSUES FOUND ---');
for (const issue of issues) {
  console.log(`Key: [${issue.origKey}] "${issue.origName}" (ego: ${issue.ego}, target: ${issue.targetGender})`);
  console.log(`  -> Inverted chain: [${issue.invertedChain}] (simplified: [${issue.invSimplified}])`);
  console.log(`  -> Resolved: "${issue.resolvedName}"\n`);
}
