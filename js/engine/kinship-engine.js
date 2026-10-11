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

      // C) Matka ➔ [nový manžel / step_h] ➔ [nevlastní syn / step_s] = nevlastní bratr
      if (curNorm === 'm' && nextNorm === 'step_h' && thirdNorm === 'step_s') {
        newChain.push('step_b');
        i += 3;
        changed = true;
        continue;
      }
      if (curNorm === 'm' && nextNorm === 'step_h' && thirdNorm === 'step_d') {
        newChain.push('step_z');
        i += 3;
        changed = true;
        continue;
      }
      // Otec ➔ [nová manželka / step_w] ➔ [nevlastní syn / step_s] = nevlastní bratr
      if (curNorm === 'f' && nextNorm === 'step_w' && thirdNorm === 'step_s') {
        newChain.push('step_b');
        i += 3;
        changed = true;
        continue;
      }
      if (curNorm === 'f' && nextNorm === 'step_w' && thirdNorm === 'step_d') {
        newChain.push('step_z');
        i += 3;
        changed = true;
        continue;
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
        // Předchozí osoba byla partnerem cíle
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
      chain: simplified,
      rawChain: chain,
      key
    };
  }

  return {
    ...entry,
    generation: calculateGeneration(simplified),
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

  return null;
}
