/**
 * GEDCOM 5.5 / 5.5.1 Parser a analyzátor rodinných vztahů
 * Zpracovává standardní genealogické soubory (.ged) z Ancestry, MyHeritage, Gramps
 */

import { TOKENS } from './kinship-engine.js';

/**
 * Odstraní lomítka z příjmení v GEDCOMu (např. "Jan /Novák/" -> "Jan Novák")
 */
export function cleanGedcomName(nameStr) {
  if (!nameStr) return 'Neznámé jméno';
  return nameStr.replace(/\//g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Parsuje GEDCOM text na datový model
 */
export function parseGedcom(gedcomText) {
  const lines = gedcomText.split(/\r?\n/);
  const individuals = new Map();
  const families = new Map();

  let currentRecord = null;
  let currentSubTag = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    // GEDCOM linka má formát: <level> [<xref_id>] <tag> [<line_value>]
    const match = rawLine.match(/^(\d+)\s+(?:(@[^@]+@)\s+)?([A-Za-z0-9_]+)(?:\s+(.*))?$/);
    if (!match) continue;

    const level = parseInt(match[1], 10);
    const xref = match[2];
    const tag = match[3].toUpperCase();
    const value = match[4] ? match[4].trim() : '';

    if (level === 0) {
      if (xref) {
        if (tag === 'INDI') {
          currentRecord = {
            id: xref,
            type: 'INDI',
            name: '',
            sex: 'U', // M, F, U
            birthYear: null,
            deathYear: null,
            famc: null, // rodina, kde je dítětem
            fams: []   // rodiny, kde je partnerem
          };
          individuals.set(xref, currentRecord);
        } else if (tag === 'FAM') {
          currentRecord = {
            id: xref,
            type: 'FAM',
            husb: null,
            wife: null,
            children: []
          };
          families.set(xref, currentRecord);
        } else {
          currentRecord = null;
        }
      } else {
        currentRecord = null;
      }
      currentSubTag = null;
      continue;
    }

    if (!currentRecord) continue;

    if (currentRecord.type === 'INDI') {
      if (level === 1) {
        currentSubTag = tag;
        if (tag === 'NAME') {
          currentRecord.name = cleanGedcomName(value);
        } else if (tag === 'SEX') {
          currentRecord.sex = value.toUpperCase().startsWith('M') ? 'M' :
                              value.toUpperCase().startsWith('F') ? 'F' : 'U';
        } else if (tag === 'FAMC') {
          currentRecord.famc = value;
        } else if (tag === 'FAMS') {
          currentRecord.fams.push(value);
        }
      } else if (level === 2 && currentSubTag === 'BIRT' && tag === 'DATE') {
        const yearMatch = value.match(/\b(\d{4})\b/);
        if (yearMatch) currentRecord.birthYear = parseInt(yearMatch[1], 10);
      } else if (level === 2 && currentSubTag === 'DEAT' && tag === 'DATE') {
        const yearMatch = value.match(/\b(\d{4})\b/);
        if (yearMatch) currentRecord.deathYear = parseInt(yearMatch[1], 10);
      }
    } else if (currentRecord.type === 'FAM') {
      if (level === 1) {
        if (tag === 'HUSB') currentRecord.husb = value;
        else if (tag === 'WIFE') currentRecord.wife = value;
        else if (tag === 'CHIL') currentRecord.children.push(value);
      }
    }
  }

  return {
    individuals,
    families,
    getIndividualList() {
      return Array.from(individuals.values()).map((p) => {
        let years = '';
        if (p.birthYear || p.deathYear) {
          years = ` (${p.birthYear || '?'}–${p.deathYear || ''})`;
        }
        return {
          id: p.id,
          name: p.name || 'Bezejmenná osoba',
          sex: p.sex,
          label: `${p.name || 'Osoba'}${years} [${p.sex === 'M' ? '♂' : p.sex === 'F' ? '♀' : '?'}]`
        };
      }).sort((a, b) => a.name.localeCompare(b.name, 'cs'));
    },
    findKinshipChain(personAId, personBId) {
      if (!personAId || !personBId || personAId === personBId) {
        return { chain: [], pathPersons: [personAId] };
      }
      return findShortestKinshipPath(individuals, families, personAId, personBId);
    }
  };
}

/**
 * BFS pro nalezení nejkratší příbuzenské cesty mezi dvěma osobami v rodokmenu
 */
export function findShortestKinshipPath(individuals, families, startId, targetId) {
  if (!individuals.has(startId) || !individuals.has(targetId)) {
    return { error: 'Osoba nebyla nalezena v rodokmenu', chain: null };
  }

  // Sestavení sousedství z pohledu každé osoby
  const getNeighbors = (personId) => {
    const person = individuals.get(personId);
    if (!person) return [];
    const neighbors = [];

    // 1. Rodiče (přes FAMC)
    if (person.famc && families.has(person.famc)) {
      const fam = families.get(person.famc);
      if (fam.husb && individuals.has(fam.husb)) {
        neighbors.push({ targetId: fam.husb, token: TOKENS.FATHER, type: 'parent' });
      }
      if (fam.wife && individuals.has(fam.wife)) {
        neighbors.push({ targetId: fam.wife, token: TOKENS.MOTHER, type: 'parent' });
      }
    }

    // 2. Děti a partneři (přes FAMS)
    for (const famId of person.fams) {
      if (!families.has(famId)) continue;
      const fam = families.get(famId);

      // Partner
      const spouseId = fam.husb === personId ? fam.wife : fam.husb;
      if (spouseId && individuals.has(spouseId)) {
        const spouse = individuals.get(spouseId);
        const spouseToken = spouse.sex === 'F' ? TOKENS.WIFE : TOKENS.HUSBAND;
        neighbors.push({ targetId: spouseId, token: spouseToken, type: 'spouse' });
      }

      // Děti
      for (const childId of fam.children) {
        if (!individuals.has(childId)) continue;
        const child = individuals.get(childId);
        const childToken = child.sex === 'F' ? TOKENS.DAUGHTER : TOKENS.SON;
        neighbors.push({ targetId: childId, token: childToken, type: 'child' });
      }
    }

    return neighbors;
  };

  // BFS fronta: { currentId, chain: [tokens], pathPersons: [ids] }
  const queue = [{ currentId: startId, chain: [], pathPersons: [startId] }];
  const visited = new Set([startId]);

  while (queue.length > 0) {
    const { currentId, chain, pathPersons } = queue.shift();

    if (currentId === targetId) {
      return { chain, pathPersons, error: null };
    }

    for (const edge of getNeighbors(currentId)) {
      if (!visited.has(edge.targetId)) {
        visited.add(edge.targetId);
        queue.push({
          currentId: edge.targetId,
          chain: [...chain, edge.token],
          pathPersons: [...pathPersons, edge.targetId]
        });
      }
    }
  }

  return { chain: null, pathPersons: [], error: 'Tyto dvě osoby nejsou v nahraném rodokmenu genealogicky propojeny.' };
}
