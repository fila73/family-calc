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
  WIFE: 'w'
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
      return 'm'; // male
    case 'm':
    case 'd':
    case 'z':
    case 'oz':
    case 'lz':
    case 'w':
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

      if (next) {
        const curNorm = normalizeToken(cur);
        const nextNorm = normalizeToken(next);

        // Manžel manželky / manželka manžela -> Ego (prázdno / zrušení páru)
        if ((curNorm === 'h' && nextNorm === 'w') || (curNorm === 'w' && nextNorm === 'h')) {
          i += 2;
          changed = true;
          continue;
        }

        // Rodič -> Choť = druhý rodič (pokud otec + manželka = matka, matka + manžel = otec)
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
        if ((curNorm === 'f' || curNorm === 'm') && (nextNorm === 's')) {
          newChain.push('b');
          i += 2;
          changed = true;
          continue;
        }
        if ((curNorm === 'f' || curNorm === 'm') && (nextNorm === 'd')) {
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
