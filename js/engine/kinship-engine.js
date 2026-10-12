/**
 * Kinship Calculation Engine (Terms of Kinship)
 * Algoritmické jádro pro výpočet příbuzenských vztahů,
 * redukci cest a převrácení perspektivy (互查 - vzájemný vztah).
 */

export const TOKENS = {
  FATHER: 'f',
  MOTHER: 'm',
  SON: 's',
  DAUGHTER: 'd',
  BROTHER: 'b',
  OLDER_BROTHER: 'ob',
  YOUNGER_BROTHER: 'lb',
  SISTER: 'z',
  OLDER_SISTER: 'oz',
  YOUNGER_SISTER: 'lz',
  HUSBAND: 'h',
  WIFE: 'w',
  // Step modifiers
  STEP_FATHER: 'step_f',
  STEP_MOTHER: 'step_m',
  STEP_SON: 'step_s',
  STEP_DAUGHTER: 'step_d',
  STEP_BROTHER: 'step_b',
  STEP_SISTER: 'step_z',
  STEP_HUSBAND: 'step_h',
  STEP_WIFE: 'step_w',
  // Godparent modifiers
  GOD_FATHER: 'god_f',
  GOD_MOTHER: 'god_m',
  GOD_SON: 'god_s',
  GOD_DAUGHTER: 'god_d'
};

/**
 * Vrátí pohlaví osoby reprezentované daným tokenem
 */
export function getTokenGender(token) {
  switch (token) {
    case 'f':
    case 's':
    case 'b':
    case 'ob':
    case 'lb':
    case 'h':
    case 'step_f':
    case 'step_s':
    case 'step_b':
    case 'step_h':
    case 'god_f':
    case 'god_s':
      return 'm'; // male
    case 'm':
    case 'd':
    case 'z':
    case 'oz':
    case 'lz':
    case 'w':
    case 'step_m':
    case 'step_d':
    case 'step_z':
    case 'step_w':
    case 'god_m':
    case 'god_d':
      return 'f'; // female
    default:
      return null;
  }
}

/**
 * Převede specifické tokeny (např. ob/lb na b, oz/lz na z) na standardní kanonický token
 */
export function normalizeToken(token) {
  if (token === 'ob' || token === 'lb') return 'b';
  if (token === 'oz' || token === 'lz') return 'z';
  return token;
}

/**
 * Zjednoduší a normalizuje řetězec vztahů.
 * Odstraňuje okamžité návraty k sobě (např. manžel manželky = já, syn otce = bratr/já apod.)
 */
export function simplifyChain(rawChain, egoGender = 'm') {
  if (!rawChain || rawChain.length === 0) return [];

  let chain = [...rawChain];
  let changed = true;

  while (changed) {
    changed = false;
    const newChain = [];
    let i = 0;

    while (i < chain.length) {
      const cur = chain[i];
      const next = chain[i + 1];
      const third = chain[i + 2];

      const curNorm = normalizeToken(cur);
      const nextNorm = next ? normalizeToken(next) : null;
      const thirdNorm = third ? normalizeToken(third) : null;

      // 1. Tříprvkové redukce:
      // A) [muž] ➔ syn/dcera ➔ matka = [muž] ➔ manželka (švagrová / matka / snacha...)
      if (nextNorm && thirdNorm && (nextNorm === 's' || nextNorm === 'd') && thirdNorm === 'm') {
        const curGender = getTokenGender(curNorm);
        if (curGender === 'm') {
          // např. bratr ➔ syn ➔ matka = bratr ➔ manželka
          newChain.push(cur);
          newChain.push('w');
          i += 3;
          changed = true;
          continue;
        }
      }

      // B) [žena] ➔ syn/dcera ➔ otec = [žena] ➔ manžel (švagr / otec / zeť...)
      if (nextNorm && thirdNorm && (nextNorm === 's' || nextNorm === 'd') && thirdNorm === 'f') {
        const curGender = getTokenGender(curNorm);
        if (curGender === 'f') {
          // např. sestra ➔ syn ➔ otec = sestra ➔ manžel
          newChain.push(cur);
          newChain.push('h');
          i += 3;
          changed = true;
          continue;
        }
      }

      // C) Macecha ➔ jiný manžel (h nebo step_h) ➔ dítě (s, d, step_s, step_d) = nevlastní bratr / sestra
      if (curNorm === 'step_m' && (nextNorm === 'h' || nextNorm === 'step_h')) {
        if (thirdNorm === 's' || thirdNorm === 'step_s') {
          newChain.push('step_b');
          i += 3;
          changed = true;
          continue;
        }
        if (thirdNorm === 'd' || thirdNorm === 'step_d') {
          newChain.push('step_z');
          i += 3;
          changed = true;
          continue;
        }
      }

      // D) Otčím ➔ jiná manželka (w nebo step_w) ➔ dítě (s, d, step_s, step_d) = nevlastní bratr / sestra
      if (curNorm === 'step_f' && (nextNorm === 'w' || nextNorm === 'step_w')) {
        if (thirdNorm === 's' || thirdNorm === 'step_s') {
          newChain.push('step_b');
          i += 3;
          changed = true;
          continue;
        }
        if (thirdNorm === 'd' || thirdNorm === 'step_d') {
          newChain.push('step_z');
          i += 3;
          changed = true;
          continue;
        }
      }

      // E) Matka ➔ [nový manžel / step_h] ➔ [nevlastní dítě / step_s nebo step_d] = nevlastní bratr / sestra
      if (curNorm === 'm' && (nextNorm === 'h' || nextNorm === 'step_h') && (thirdNorm === 'step_s' || thirdNorm === 'step_d')) {
        newChain.push(thirdNorm === 'step_s' ? 'step_b' : 'step_z');
        i += 3;
        changed = true;
        continue;
      }
      // Otec ➔ [nová manželka / step_w] ➔ [nevlastní dítě / step_s nebo step_d] = nevlastní bratr / sestra
      if (curNorm === 'f' && (nextNorm === 'w' || nextNorm === 'step_w') && (thirdNorm === 'step_s' || thirdNorm === 'step_d')) {
        newChain.push(thirdNorm === 'step_s' ? 'step_b' : 'step_z');
        i += 3;
        changed = true;
        continue;
      }

      // G) Rodič ➔ Nevlastní choť ➔ Dítě v invertovaných řetězcích (m, step_w, s/d nebo f, step_h, s/d)
      if (curNorm === 'm' && nextNorm === 'step_w') {
        if (thirdNorm === 's' || thirdNorm === 'step_s') {
          newChain.push('step_b');
          i += 3;
          changed = true;
          continue;
        }
        if (thirdNorm === 'd' || thirdNorm === 'step_d') {
          newChain.push('step_z');
          i += 3;
          changed = true;
          continue;
        }
      }
      if (curNorm === 'f' && nextNorm === 'step_h') {
        if (thirdNorm === 's' || thirdNorm === 'step_s') {
          newChain.push('step_b');
          i += 3;
          changed = true;
          continue;
        }
        if (thirdNorm === 'd' || thirdNorm === 'step_d') {
          newChain.push('step_z');
          i += 3;
          changed = true;
          continue;
        }
      }

      // 2. Dvouprvkové redukce z pohledu Ega na začátku řetězce:
      if (i === 0 && nextNorm) {
        // JÁ (muž) ➔ syn/dcera ➔ matka = moje manželka
        if ((curNorm === 's' || curNorm === 'd') && nextNorm === 'm' && egoGender === 'm') {
          newChain.push('w');
          i += 2;
          changed = true;
          continue;
        }
        // JÁ (žena) ➔ syn/dcera ➔ otec = můj manžel
        if ((curNorm === 's' || curNorm === 'd') && nextNorm === 'f' && egoGender === 'f') {
          newChain.push('h');
          i += 2;
          changed = true;
          continue;
        }
        // JÁ (muž) ➔ syn/dcera ➔ otec = JÁ (zrušení)
        if ((curNorm === 's' || curNorm === 'd') && nextNorm === 'f' && egoGender === 'm') {
          i += 2;
          changed = true;
          continue;
        }
        // JÁ (žena) ➔ syn/dcera ➔ matka = JÁ (zrušení)
        if ((curNorm === 's' || curNorm === 'd') && nextNorm === 'm' && egoGender === 'f') {
          i += 2;
          changed = true;
          continue;
        }
      }

      if (nextNorm) {
        // Manžel manželky / manželka manžela -> Ego (zrušení páru)
        if ((curNorm === 'h' && nextNorm === 'w') || (curNorm === 'w' && nextNorm === 'h')) {
          i += 2;
          changed = true;
          continue;
        }

        // Řetězení sourozenců (bratr bratra = bratr)
        if ((curNorm === 'b' || curNorm === 'z') && nextNorm === 'b') {
          newChain.push('b');
          i += 2;
          changed = true;
          continue;
        }
        if ((curNorm === 'b' || curNorm === 'z') && nextNorm === 'z') {
          newChain.push('z');
          i += 2;
          changed = true;
          continue;
        }

        // Dítě a jeho sourozenec (synův/dceřin bratr je syn téhož rodiče, synova/dceřina sestra je dcera téhož rodiče)
        if ((curNorm === 's' || curNorm === 'd') && nextNorm === 'b') {
          newChain.push('s');
          i += 2;
          changed = true;
          continue;
        }
        if ((curNorm === 's' || curNorm === 'd') && nextNorm === 'z') {
          newChain.push('d');
          i += 2;
          changed = true;
          continue;
        }

        // Rodič -> Choť (vlastní rodina)
        if (curNorm === 'f' && nextNorm === 'w') {
          newChain.push('m');
          i += 2;
          changed = true;
          continue;
        }
        if (curNorm === 'm' && nextNorm === 'h') {
          newChain.push('f');
          i += 2;
          changed = true;
          continue;
        }

        // Rodič -> [Nevlastní partner] = Macecha / Otčím
        if (curNorm === 'f' && nextNorm === 'step_w') {
          newChain.push('step_m');
          i += 2;
          changed = true;
          continue;
        }
        if (curNorm === 'm' && nextNorm === 'step_h') {
          newChain.push('step_f');
          i += 2;
          changed = true;
          continue;
        }

        // Macecha / Otčím ➔ jejich nevlastní dítě z dřívějška = nevlastní bratr / sestra
        if ((curNorm === 'step_m' || curNorm === 'step_f') && nextNorm === 'step_s') {
          newChain.push('step_b');
          i += 2;
          changed = true;
          continue;
        }
        if ((curNorm === 'step_m' || curNorm === 'step_f') && nextNorm === 'step_d') {
          newChain.push('step_z');
          i += 2;
          changed = true;
          continue;
        }

        // Rodič (matka / otec) ➔ nevlastní dítě z jiného svazku partnera = nevlastní bratr / sestra
        if ((curNorm === 'm' || curNorm === 'f') && nextNorm === 'step_s') {
          newChain.push('step_b');
          i += 2;
          changed = true;
          continue;
        }
        if ((curNorm === 'm' || curNorm === 'f') && nextNorm === 'step_d') {
          newChain.push('step_z');
          i += 2;
          changed = true;
          continue;
        }

        // Manžel / Manželka ➔ nevlastní dítě z předchozího svazku = pastorek / pastorkyně
        if ((curNorm === 'w' || curNorm === 'h') && nextNorm === 'step_s') {
          newChain.push('step_s');
          i += 2;
          changed = true;
          continue;
        }
        if ((curNorm === 'w' || curNorm === 'h') && nextNorm === 'step_d') {
          newChain.push('step_d');
          i += 2;
          changed = true;
          continue;
        }

        // Sourozenec -> Otec / Matka = můj Otec / Matka
        if ((curNorm === 'b' || curNorm === 'z') && nextNorm === 'f') {
          newChain.push('f');
          i += 2;
          changed = true;
          continue;
        }
        if ((curNorm === 'b' || curNorm === 'z') && nextNorm === 'm') {
          newChain.push('m');
          i += 2;
          changed = true;
          continue;
        }

        // Dítě -> Otec/Matka
        // Syn/dcera mého otce/matky = bratr/sestra (pokud ne já)
        if ((curNorm === 'f' || curNorm === 'm') && nextNorm === 's') {
          newChain.push('b');
          i += 2;
          changed = true;
          continue;
        }
        if ((curNorm === 'f' || curNorm === 'm') && nextNorm === 'd') {
          newChain.push('z');
          i += 2;
          changed = true;
          continue;
        }
      }

      newChain.push(cur);
      i += 1;
    }

    if (newChain.length !== chain.length) {
      chain = newChain;
      changed = true;
    }
  }

  return chain;
}

/**
 * Obrátí perspektivu vztahu (Mutual Query / 互查).
 * Pokud X je příbuzný Ega přes chain, jaký je vztah Ega k X?
 */
export function invertChain(chain, egoGender = 'm') {
  if (!chain || chain.length === 0) return [];

  // Vypočteme pohlaví každé osoby na cestě od Ega
  const genders = [egoGender];
  for (let i = 0; i < chain.length; i++) {
    const token = chain[i];
    genders.push(getTokenGender(token) || 'm');
  }

  const inverted = [];
  // Procházíme od konce řetězce k začátku
  for (let i = chain.length - 1; i >= 0; i--) {
    const step = chain[i];
    const prevPersonGender = genders[i]; // Pohlaví osoby, ke které se vracíme
    const stepNorm = normalizeToken(step);

    switch (stepNorm) {
      case 'f':
      case 'm':
        // Předchozí osoba byla rodičem cíle, tedy cíl k ní je dítě (syn / dcera)
        inverted.push(prevPersonGender === 'm' ? 's' : 'd');
        break;

      case 's':
      case 'd':
        // Předchozí osoba byla dítětem cíle, tedy cíl k ní je rodič (otec / matka)
        inverted.push(prevPersonGender === 'm' ? 'f' : 'm');
        break;

      case 'b':
      case 'z':
        // Předchozí osoba byla sourozencem cíle
        inverted.push(prevPersonGender === 'm' ? 'b' : 'z');
        break;

      case 'h':
      case 'w':
      case 'step_h':
      case 'step_w':
        // Předchozí osoba byla partnerem cíle (i novým/jiným partnerem)
        inverted.push(prevPersonGender === 'm' ? 'h' : 'w');
        break;

      // === Step relace ===
      case 'step_f':
      case 'step_m':
        // Pro otčíma / macechu jsem pastorek / pastorkyně
        inverted.push(prevPersonGender === 'm' ? 'step_s' : 'step_d');
        break;

      case 'step_s':
      case 'step_d':
        // Pro pastorka / pastorkyni jsem otčím / macecha
        inverted.push(prevPersonGender === 'm' ? 'step_f' : 'step_m');
        break;

      case 'step_b':
      case 'step_z':
        // Pro nevlastního bratra / sestru jsem nevlastní bratr / sestra
        inverted.push(prevPersonGender === 'm' ? 'step_b' : 'step_z');
        break;

      // === Křestní relace ===
      case 'god_f':
      case 'god_m':
        // Pro kmotra / kmotru jsem kmotřenec / kmotřenka
        inverted.push(prevPersonGender === 'm' ? 'god_s' : 'god_d');
        break;

      case 'god_s':
      case 'god_d':
        // Pro kmotřence / kmotřenku jsem kmotr / kmotra
        inverted.push(prevPersonGender === 'm' ? 'god_f' : 'god_m');
        break;

      default:
        inverted.push(step);
    }
  }

  return simplifyChain(inverted, genders[genders.length - 1]);
}

/**
 * Vypočte generační posun řetězce vzhledem k Egu
 */
export function calculateGeneration(chain) {
  let gen = 0;
  for (const token of chain) {
    const t = normalizeToken(token);
    if (t === 'f' || t === 'm') gen += 1;
    else if (t === 's' || t === 'd') gen -= 1;
  }
  return gen;
}

/**
 * Vypočte biologický / právní stupeň příbuzenství a odhad sdílené DNA
 */
export function calculateConsanguinity(chain) {
  if (!chain || chain.length === 0) {
    return {
      degree: 0,
      dnaPercent: 100,
      type: 'self',
      badge: '🧬 100% DNA (shodná osoba)'
    };
  }

  const norm = chain.map(normalizeToken);

  // Křestní / duchovní svazek
  if (norm.some((t) => t.startsWith('god_'))) {
    return {
      degree: null,
      dnaPercent: 0,
      type: 'spiritual',
      badge: '✝ Kmotrovství (duchovní svazek)'
    };
  }

  // Afinitní / sešvagření / nevlastní
  if (norm.some((t) => t === 'h' || t === 'w' || t.startsWith('step_'))) {
    const key = chainToKey(chain);
    if (key === 'm,step_h,s' || key === 'm,step_h,d' || key === 'f,step_w,s' || key === 'f,step_w,d') {
      return {
        degree: 2,
        dnaPercent: 25,
        type: 'half_blood',
        badge: '🧬 ~25% DNA · 2. stupeň (polorodý sourozenec)'
      };
    }
    return {
      degree: null,
      dnaPercent: 0,
      type: 'affinity',
      badge: '💍 Sešvagření (afinitní vztah)'
    };
  }

  // Přímá linie předků nebo potomků
  const allAncestors = norm.every((t) => t === 'f' || t === 'm');
  const allDescendants = norm.every((t) => t === 's' || t === 'd');

  if (allAncestors || allDescendants) {
    const degree = norm.length;
    const dna = Math.round(Math.pow(0.5, degree) * 100 * 1000) / 1000;
    return {
      degree,
      dnaPercent: dna,
      type: 'direct',
      badge: `🧬 ~${dna}% DNA · ${degree}. stupeň (přímá linie)`
    };
  }

  // Vlastní sourozenci
  if (norm.length === 1 && (norm[0] === 'b' || norm[0] === 'z')) {
    return {
      degree: 2,
      dnaPercent: 50,
      type: 'sibling',
      badge: '🧬 ~50% DNA · 2. stupeň (plnorodý sourozenec)'
    };
  }

  // Strýc / teta: f,b / m,z
  if (norm.length === 2 && (norm[0] === 'f' || norm[0] === 'm') && (norm[1] === 'b' || norm[1] === 'z')) {
    return {
      degree: 3,
      dnaPercent: 25,
      type: 'collateral',
      badge: '🧬 ~25% DNA · 3. stupeň (strýc / teta)'
    };
  }

  // Synovec / neteř: b,s / z,d
  if (norm.length === 2 && (norm[0] === 'b' || norm[0] === 'z') && (norm[1] === 's' || norm[1] === 'd')) {
    return {
      degree: 3,
      dnaPercent: 25,
      type: 'collateral',
      badge: '🧬 ~25% DNA · 3. stupeň (synovec / neteř)'
    };
  }

  // Bratranec / sestřenice: f,b,s apod.
  if (
    norm.length === 3 &&
    (norm[0] === 'f' || norm[0] === 'm') &&
    (norm[1] === 'b' || norm[1] === 'z') &&
    (norm[2] === 's' || norm[2] === 'd')
  ) {
    return {
      degree: 4,
      dnaPercent: 12.5,
      type: 'collateral',
      badge: '🧬 ~12.5% DNA · 4. stupeň (bratranec / sestřenice)'
    };
  }

  // Prastrýc / prateta: f,f,b apod.
  if (
    norm.length === 3 &&
    (norm[0] === 'f' || norm[0] === 'm') &&
    (norm[1] === 'f' || norm[1] === 'm') &&
    (norm[2] === 'b' || norm[2] === 'z')
  ) {
    return {
      degree: 4,
      dnaPercent: 12.5,
      type: 'collateral',
      badge: '🧬 ~12.5% DNA · 4. stupeň (prastrýc / prateta)'
    };
  }

  // Prasynovec / praneteř: b,s,s apod.
  if (
    norm.length === 3 &&
    (norm[0] === 'b' || norm[0] === 'z') &&
    (norm[1] === 's' || norm[1] === 'd') &&
    (norm[2] === 's' || norm[2] === 'd')
  ) {
    return {
      degree: 4,
      dnaPercent: 12.5,
      type: 'collateral',
      badge: '🧬 ~12.5% DNA · 4. stupeň (prasynovec / praneteř)'
    };
  }

  // Obecná pobočná linie
  const births = norm.reduce((acc, t) => {
    if (t === 'b' || t === 'z') return acc + 2;
    return acc + 1;
  }, 0);
  const approxDna = Math.max(0.1, Math.round(Math.pow(0.5, births) * 100 * 100) / 100);

  return {
    degree: births,
    dnaPercent: approxDna,
    type: 'collateral',
    badge: `🧬 ~${approxDna}% DNA · ${births}. stupeň`
  };
}

/**
 * Vypočte zákonnou dědickou třídu dle českého Občanského zákoníku (NOZ č. 89/2012 Sb., §§ 1635-1640)
 */
export function calculateInheritanceClass(chain) {
  if (!chain || chain.length === 0) {
    return {
      classNumber: 0,
      title: 'Zůstavitel (EGO)',
      description: 'Výchozí osoba, jejíž pozůstalost je předmětem dědického práva.',
      badge: '🏛️ Zůstavitel'
    };
  }

  const norm = chain.map(normalizeToken);
  const len = norm.length;

  // 1. třída: Děti zůstavitele a jejich potomci (§ 1635)
  const allDescendants = norm.every((t) => t === 's' || t === 'd');
  if (allDescendants) {
    return {
      classNumber: 1,
      title: '1. dědická třída (§ 1635 NOZ)',
      description: 'Zůstavitelovy děti a jejich potomci dědí rovným dílem (spolu s manželem).',
      badge: '🏛️ 1. dědická třída'
    };
  }

  if (len === 1 && (norm[0] === 'h' || norm[0] === 'w')) {
    return {
      classNumber: 1,
      title: '1. a 2. dědická třída (§ 1635 & § 1636 NOZ)',
      description: 'Manžel dědí v 1. třídě společně s dětmi, nedědí-li děti, dědí ve 2. třídě nejméně polovinu pozůstalosti.',
      badge: '🏛️ 1. / 2. dědická třída'
    };
  }

  // 2. třída: Rodiče zůstavitele (§ 1636)
  if (len === 1 && (norm[0] === 'f' || norm[0] === 'm')) {
    return {
      classNumber: 2,
      title: '2. dědická třída (§ 1636 NOZ)',
      description: 'Rodiče zůstavitele dědí ve 2. třídě rovným dílem (spolu s manželem a spolužijícími osobami).',
      badge: '🏛️ 2. dědická třída'
    };
  }

  // 3. třída: Sourozenci a jejich děti (§ 1637)
  const firstIsSibling = norm[0] === 'b' || norm[0] === 'z';
  const restAreChildren = norm.slice(1).every((t) => t === 's' || t === 'd');
  if (firstIsSibling && (len === 1 || (len === 2 && restAreChildren))) {
    return {
      classNumber: 3,
      title: '3. dědická třída (§ 1637 NOZ)',
      description: 'Sourozenci zůstavitele (a nedědí-li některý z nich, jeho děti – synovci a neteře).',
      badge: '🏛️ 3. dědická třída'
    };
  }

  // 4. třída: Prarodiče zůstavitele (§ 1638)
  if (len === 2 && (norm[0] === 'f' || norm[0] === 'm') && (norm[1] === 'f' || norm[1] === 'm')) {
    return {
      classNumber: 4,
      title: '4. dědická třída (§ 1638 NOZ)',
      description: 'Prarodiče zůstavitele (z otcovy i matčiny strany rovným dílem).',
      badge: '🏛️ 4. dědická třída'
    };
  }

  // 5. třída: Prarodiče rodičů zůstavitele (praprarodiče, § 1639)
  if (len === 3 && norm.every((t) => t === 'f' || t === 'm')) {
    return {
      classNumber: 5,
      title: '5. dědická třída (§ 1639 NOZ)',
      description: 'Prarodiče rodičů zůstavitele (praprarodiče – celkem až 8 osob).',
      badge: '🏛️ 5. dědická třída'
    };
  }

  // 6. třída: Děti dětí sourozenců (prasynovci/praneteře) a děti prarodičů (strýcové a tety, § 1640)
  if (firstIsSibling && len === 3 && restAreChildren) {
    return {
      classNumber: 6,
      title: '6. dědická třída (§ 1640 NOZ)',
      description: 'Děti dětí sourozenců zůstavitele (prasynovci a praneteře).',
      badge: '🏛️ 6. dědická třída'
    };
  }
  if (len === 2 && (norm[0] === 'f' || norm[0] === 'm') && (norm[1] === 'b' || norm[1] === 'z')) {
    return {
      classNumber: 6,
      title: '6. dědická třída (§ 1640 NOZ)',
      description: 'Děti prarodičů zůstavitele (strýcové a tety).',
      badge: '🏛️ 6. dědická třída'
    };
  }

  return {
    classNumber: null,
    title: 'Mimo zákonné dědické třídy',
    description: 'Vzdálenější příbuzní (např. bratranci) nebo nepokrevní osoby ze zákona nedědí, ledaže by byli uvedeni v závěti.',
    badge: '🏛️ Mimo dědické třídy'
  };
}

/**
 * Zjišťuje zákonnou překážku manželství dle § 675 Občanského zákoníku (NOZ)
 */
export function calculateMarriageImpediment(chain) {
  if (!chain || chain.length === 0) {
    return {
      hasImpediment: false,
      reason: 'Sama se sebou nelze uzavřít manželství',
      badge: '—'
    };
  }

  const norm = chain.map(normalizeToken);
  const len = norm.length;

  // Manžel / manželka: překážka trvajícího manželství (§ 672 NOZ)
  if (len === 1 && (norm[0] === 'h' || norm[0] === 'w')) {
    return {
      hasImpediment: true,
      reason: 'Překážka trvajícího manželství / bigamie (§ 672 NOZ)',
      badge: '⛔ Trvající manželství (§ 672 NOZ)'
    };
  }

  // Přímá linie předků nebo potomků (§ 675 NOZ)
  const allAncestors = norm.every((t) => t === 'f' || t === 'm');
  const allDescendants = norm.every((t) => t === 's' || t === 'd');
  if (allAncestors || allDescendants) {
    return {
      hasImpediment: true,
      reason: 'Zákonný zákaz sňatku mezi předky a potomky (§ 675 NOZ)',
      badge: '⛔ Zákaz sňatku (přímá linie, § 675 NOZ)'
    };
  }

  // Sourozenci plnorodí i polorodí (§ 675 NOZ)
  if (len === 1 && (norm[0] === 'b' || norm[0] === 'z')) {
    return {
      hasImpediment: true,
      reason: 'Zákonný zákaz sňatku mezi sourozenci (§ 675 NOZ)',
      badge: '⛔ Zákaz sňatku (sourozenci, § 675 NOZ)'
    };
  }

  const key = chainToKey(chain);
  if (key === 'm,step_h,s' || key === 'm,step_h,d' || key === 'f,step_w,s' || key === 'f,step_w,d' || key === 'step_b' || key === 'step_z') {
    return {
      hasImpediment: true,
      reason: 'Zákonný zákaz sňatku mezi polorodými sourozenci (§ 675 NOZ)',
      badge: '⛔ Zákaz sňatku (polorodí sourozenci, § 675 NOZ)'
    };
  }

  return {
    hasImpediment: false,
    reason: 'Podle českého práva (§ 675 NOZ) nevzniká zákonná překážka sňatku (příbuzenství v pobočné linii od 3. stupně je přípustné).',
    badge: '🟢 Sňatek právně možný (§ 675 NOZ)'
  };
}

/**
 * Převede řetězec na normalizovaný klíč (např. ['f', 'b'] -> "f,b")
 */
export function chainToKey(chain) {
  return chain.map(normalizeToken).join(',');
}

/**
 * Vyřeší vztah pomocí jazykového slovníku
 */
export function resolveKinship(chain, egoGender = 'm', dictionary) {
  if (!chain || chain.length === 0) {
    return {
      id: 'self',
      name: dictionary.labels.self || (egoGender === 'm' ? 'Já (proband)' : 'Já (probandka)'),
      archaic: dictionary.labels.selfArchaic || 'EGO / střen',
      description: dictionary.labels.selfDesc || 'Výchozí osoba genealogického výzkumu',
      generation: 0,
      consanguinity: calculateConsanguinity([]),
      inheritance: calculateInheritanceClass([]),
      marriageImpediment: calculateMarriageImpediment([]),
      chain: [],
      rawChain: [],
      key: ''
    };
  }

  const simplified = simplifyChain(chain, egoGender);
  const key = chainToKey(simplified);

  // Přímé vyhledání ve slovníku
  let entry = dictionary.relations[key];

  // Pokud není přímý záznam, zkusíme generátor pro N-té generace předků a potomků
  if (!entry) {
    entry = generateDeepKinshipEntry(simplified, dictionary);
  }

  if (!entry) {
    return {
      id: 'unknown',
      name: dictionary.labels.unknownRelation || 'Vzdálený příbuzný',
      archaic: null,
      description: dictionary.labels.unknownDesc || 'Složený vztah přesahuje běžné jednoslovné pojmenování',
      generation: calculateGeneration(simplified),
      consanguinity: calculateConsanguinity(simplified),
      inheritance: calculateInheritanceClass(simplified),
      marriageImpediment: calculateMarriageImpediment(simplified),
      chain: simplified,
      rawChain: chain,
      key
    };
  }

  return {
    ...entry,
    generation: calculateGeneration(simplified),
    consanguinity: calculateConsanguinity(simplified),
    inheritance: calculateInheritanceClass(simplified),
    marriageImpediment: calculateMarriageImpediment(simplified),
    chain: simplified,
    rawChain: chain,
    key
  };
}

/**
 * Generátor pro hluboké generace předků, potomků a strýců (pra-pra-...)
 */
function generateDeepKinshipEntry(chain, dictionary) {
  const norm = chain.map(normalizeToken);
  const len = norm.length;
  if (len < 3) return null;

  // Samí otcové/matky: předkové
  const allParents = norm.every(t => t === 'f' || t === 'm');
  if (allParents) {
    const lastToken = norm[norm.length - 1];
    const isMale = lastToken === 'f';
    const praCount = len - 2; // např. f,f,f = 3-2 = 1x pra (praděda), 4 = 2x pra (prapraděda)
    const praPrefix = 'pra'.repeat(praCount);
    
    if (dictionary.code === 'cs') {
      const base = isMale ? 'dědeček' : 'babička';
      const alt = isMale ? 'děda' : 'babička';
      return {
        id: `ancestor_${len}_${lastToken}`,
        name: `${praPrefix}${base}`,
        archaic: praCount >= 2 ? (isMale ? `${praPrefix}${alt}` : null) : null,
        description: `Předek v ${len}. generaci přímé linie (${isMale ? 'mužský' : 'ženský'})`,
        lineType: 'direct_ascendant'
      };
    }
  }

  // Samí synové/dcery: potomci
  const allChildren = norm.every(t => t === 's' || t === 'd');
  if (allChildren) {
    const lastToken = norm[norm.length - 1];
    const isMale = lastToken === 's';
    const praCount = len - 2;
    const praPrefix = 'pra'.repeat(praCount);

    if (dictionary.code === 'cs') {
      const base = isMale ? 'vnuk' : 'vnučka';
      return {
        id: `descendant_${len}_${lastToken}`,
        name: `${praPrefix}${base}`,
        archaic: null,
        description: `Potomek v ${len}. generaci přímé linie (${isMale ? 'mužský' : 'ženský'})`,
        lineType: 'direct_descendant'
      };
    }
  }

  // Předek + bratr / sestra: prastrýc / prateta
  const leadingParents = norm.slice(0, len - 1).every(t => t === 'f' || t === 'm');
  const last = norm[len - 1];
  if (leadingParents && (last === 'b' || last === 'z')) {
    const isMale = last === 'b';
    const praCount = (len - 1) - 1; // f,b -> strýc (0 pra), f,f,b -> prastrýc (1 pra), f,f,f,b -> praprastrýc (2 pra)
    const praPrefix = 'pra'.repeat(praCount);

    if (dictionary.code === 'cs') {
      const base = isMale ? 'strýc' : 'teta';
      return {
        id: `uncle_${len}_${last}`,
        name: `${praPrefix}${base}`,
        archaic: null,
        description: `Sourozenec tvého předka v ${len - 1}. generaci`,
        lineType: 'collateral'
      };
    }
  }

  // Sourozenec + samí potomci: prasynovec / praneteř
  const firstIsSibling = norm[0] === 'b' || norm[0] === 'z';
  const restChildren = norm.slice(1).every(t => t === 's' || t === 'd');
  if (firstIsSibling && restChildren) {
    const lastToken = norm[len - 1];
    const isMale = lastToken === 's';
    const childGen = len - 1; // b,s = synovec (0 pra), b,s,s = prasynovec (1 pra)
    const praCount = childGen - 1;
    const praPrefix = 'pra'.repeat(praCount);

    if (dictionary.code === 'cs') {
      const base = isMale ? 'synovec' : 'neteř';
      return {
        id: `nephew_${len}_${lastToken}`,
        name: `${praPrefix}${base}`,
        archaic: null,
        description: `Potomek tvého sourozence (${childGen}. generace potomků)`,
        lineType: 'collateral'
      };
    }
  }

  // Partner + sourozenec + samí potomci: sešvagřený synovec / prasynovec (0% DNA, afinitní vztah)
  const firstIsSpouse = norm[0] === 'h' || norm[0] === 'w';
  const secondIsSibling = norm[1] === 'b' || norm[1] === 'z';
  const restAreChildren = norm.length >= 3 && norm.slice(2).every(t => t === 's' || t === 'd');
  if (firstIsSpouse && secondIsSibling && restAreChildren) {
    const isWifeSide = norm[0] === 'w';
    const lastToken = norm[len - 1];
    const isMale = lastToken === 's';
    const childGen = len - 2; // h,b,s = 1 (synovec), h,b,s,s = 2 (prasynovec)
    const praCount = childGen - 1;
    const praPrefix = 'pra'.repeat(praCount);

    if (dictionary.code === 'cs') {
      const base = isMale ? 'synovec' : 'neteř';
      const term = praCount > 0 ? `${praPrefix}${base}` : base;
      const termCap = term.charAt(0).toUpperCase() + term.slice(1);
      const side = isWifeSide ? 'manželčin' : 'manželův';
      return {
        id: `inlaw_nephew_${len}_${lastToken}`,
        name: `${termCap} (${side} ${term})`,
        archaic: `Sešvagřený ${term}`,
        description: `Potomek sourozence tvé/tvého ${isWifeSide ? 'manželky' : 'manžela'} (sešvagření, biologicky nepříbuzný)`,
        lineType: 'affinity'
      };
    }
    if (dictionary.code === 'sk') {
      const base = isMale ? 'synovec' : 'neter';
      const term = praCount > 0 ? `${praPrefix}${base}` : base;
      const termCap = term.charAt(0).toUpperCase() + term.slice(1);
      const side = isWifeSide ? 'manželkin' : 'manželov';
      return {
        id: `inlaw_nephew_${len}_${lastToken}`,
        name: `${termCap} (${side} ${term})`,
        archaic: `Zošvagrený ${term}`,
        description: `Potomok súrodenca tvojho/tvojej ${isWifeSide ? 'manželky' : 'manžela'} (zošvagrenie, biologicky nepríbuzný)`,
        lineType: 'affinity'
      };
    }
    if (dictionary.code === 'en') {
      const base = isMale ? 'nephew' : 'niece';
      const greatPrefix = 'great-'.repeat(praCount);
      const term = `${greatPrefix}${base}-in-law`;
      const termCap = term.charAt(0).toUpperCase() + term.slice(1);
      return {
        id: `inlaw_nephew_${len}_${lastToken}`,
        name: termCap,
        archaic: null,
        description: `Child of your spouse's sibling (affinity, no blood relation)`,
        lineType: 'affinity'
      };
    }

    const base = isMale ? 'synovec' : 'neteř';
    return {
      id: `inlaw_nephew_${len}_${lastToken}`,
      name: `${base.charAt(0).toUpperCase() + base.slice(1)} (in-law)`,
      archaic: null,
      description: `Affinity relative via spouse's sibling`,
      lineType: 'affinity'
    };
  }

  return null;
}
