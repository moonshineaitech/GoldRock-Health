interface MolecularProperties {
  molecularWeight: number;
  logP: number;
  hbd: number;
  hba: number;
  rotBonds: number;
  tpsa: number;
  rings: number;
  aromaticRings: number;
  heavyAtoms: number;
}

const ATOM_WEIGHTS: Record<string, number> = {
  'C': 12.011,
  'N': 14.007,
  'O': 15.999,
  'S': 32.065,
  'P': 30.974,
  'F': 18.998,
  'Cl': 35.453,
  'Br': 79.904,
  'I': 126.904,
  'H': 1.008,
  'B': 10.811,
  'Si': 28.086,
};

const HYDROPHOBICITY: Record<string, number> = {
  'C': 0.5,
  'N': -0.3,
  'O': -0.4,
  'S': 0.3,
  'P': -0.2,
  'F': 0.1,
  'Cl': 0.6,
  'Br': 0.7,
  'I': 0.8,
  'H': 0.0,
};

export function parseSMILES(smiles: string): MolecularProperties | null {
  if (!smiles || typeof smiles !== 'string') {
    return null;
  }

  const cleanSmiles = smiles.trim();
  if (cleanSmiles.length === 0) {
    return null;
  }

  try {
    let heavyAtoms = 0;
    let hydrogens = 0;
    let carbons = 0;
    let nitrogens = 0;
    let oxygens = 0;
    let sulfurs = 0;
    let halogens = 0;
    let phosphorus = 0;
    let hbd = 0;
    let hba = 0;
    let rotBonds = 0;
    let rings = 0;
    let aromaticRings = 0;
    let tpsa = 0;

    const ringStack: number[] = [];
    const ringMarkers = new Map<string, number>();
    let i = 0;
    let branchDepth = 0;
    let inBracket = false;
    let bracketContent = '';
    let prevAtom = '';
    let bondType = '-';
    let isAromatic = false;

    while (i < cleanSmiles.length) {
      const char = cleanSmiles[i];

      if (char === '[') {
        inBracket = true;
        bracketContent = '';
        i++;
        continue;
      }

      if (char === ']') {
        inBracket = false;
        const atom = parseBracketAtom(bracketContent);
        if (atom) {
          heavyAtoms++;
          if (atom.element === 'N' || atom.element === 'O') {
            if (atom.hasH) hbd++;
            hba++;
          }
          if (atom.element === 'O') {
            tpsa += 20.23;
            oxygens++;
          }
          if (atom.element === 'N') {
            tpsa += 26.03;
            nitrogens++;
          }
          if (atom.element === 'S') {
            tpsa += 25.30;
            sulfurs++;
          }
          if (atom.element === 'C') carbons++;
          if (['F', 'Cl', 'Br', 'I'].includes(atom.element)) halogens++;
          if (atom.element === 'P') phosphorus++;
          prevAtom = atom.element;
        }
        i++;
        continue;
      }

      if (inBracket) {
        bracketContent += char;
        i++;
        continue;
      }

      if (char === '(') {
        branchDepth++;
        i++;
        continue;
      }

      if (char === ')') {
        branchDepth--;
        i++;
        continue;
      }

      if (char === '-' || char === '=' || char === '#' || char === ':') {
        bondType = char;
        if (char === '-' && prevAtom && !isAromatic) {
          rotBonds++;
        }
        i++;
        continue;
      }

      if (/[0-9%]/.test(char)) {
        let ringNum = char;
        if (char === '%') {
          ringNum = cleanSmiles.substring(i + 1, i + 3);
          i += 2;
        }
        if (ringMarkers.has(ringNum)) {
          rings++;
          if (isAromatic) aromaticRings++;
          ringMarkers.delete(ringNum);
        } else {
          ringMarkers.set(ringNum, i);
        }
        i++;
        continue;
      }

      if ('CNOS'.includes(char.toUpperCase())) {
        isAromatic = char === char.toLowerCase();
        const upper = char.toUpperCase();
        heavyAtoms++;

        if (upper === 'C') {
          carbons++;
          const implicitH = getImplicitHydrogens(cleanSmiles, i);
          hydrogens += implicitH;
        } else if (upper === 'N') {
          nitrogens++;
          tpsa += 26.03;
          hba++;
          const implicitH = getImplicitHydrogens(cleanSmiles, i);
          if (implicitH > 0) hbd += implicitH;
          hydrogens += implicitH;
        } else if (upper === 'O') {
          oxygens++;
          tpsa += 20.23;
          hba++;
          const implicitH = getImplicitHydrogens(cleanSmiles, i);
          if (implicitH > 0) hbd++;
          hydrogens += implicitH;
        } else if (upper === 'S') {
          sulfurs++;
          tpsa += 25.30;
          hba++;
        }

        if (prevAtom && bondType === '-' && !isAromatic) {
          if (!['C', 'N', 'O', 'S'].includes(prevAtom) || branchDepth === 0) {
            rotBonds++;
          }
        }

        prevAtom = upper;
        bondType = '-';
        i++;
        continue;
      }

      if (char === 'F' || char === 'I') {
        heavyAtoms++;
        halogens++;
        i++;
        continue;
      }

      if (char === 'C' && cleanSmiles[i + 1] === 'l') {
        heavyAtoms++;
        halogens++;
        i += 2;
        continue;
      }

      if (char === 'B' && cleanSmiles[i + 1] === 'r') {
        heavyAtoms++;
        halogens++;
        i += 2;
        continue;
      }

      if (char === 'P') {
        heavyAtoms++;
        phosphorus++;
        hba++;
        i++;
        continue;
      }

      i++;
    }

    if (carbons < 1) {
      carbons = Math.max(1, Math.floor(cleanSmiles.replace(/[^a-zA-Z]/g, '').length / 2));
    }

    const molecularWeight =
      carbons * ATOM_WEIGHTS['C'] +
      nitrogens * ATOM_WEIGHTS['N'] +
      oxygens * ATOM_WEIGHTS['O'] +
      sulfurs * ATOM_WEIGHTS['S'] +
      halogens * 35.5 +
      phosphorus * ATOM_WEIGHTS['P'] +
      hydrogens * ATOM_WEIGHTS['H'];

    const logP = 
      carbons * 0.5 -
      nitrogens * 0.3 -
      oxygens * 0.4 +
      sulfurs * 0.3 +
      halogens * 0.6 -
      hbd * 0.5 -
      hba * 0.2 +
      aromaticRings * 0.4;

    rotBonds = Math.max(0, Math.min(rotBonds, heavyAtoms - 1));

    return {
      molecularWeight: Math.max(50, molecularWeight),
      logP: Math.min(Math.max(-2, logP), 8),
      hbd: Math.max(0, hbd),
      hba: Math.max(1, hba),
      rotBonds: Math.max(0, rotBonds),
      tpsa: Math.max(0, tpsa),
      rings: Math.max(0, rings),
      aromaticRings: Math.max(0, aromaticRings),
      heavyAtoms: Math.max(3, heavyAtoms),
    };
  } catch (error) {
    console.error('SMILES parsing error:', error);
    return null;
  }
}

function parseBracketAtom(content: string): { element: string; hasH: boolean } | null {
  const match = content.match(/^(\d*)([A-Z][a-z]?)/);
  if (!match) return null;

  const element = match[2];
  const hasH = content.includes('H') || content.includes('+') || content.includes('-');

  return { element, hasH };
}

function getImplicitHydrogens(smiles: string, pos: number): number {
  const char = smiles[pos];
  const upper = char.toUpperCase();

  let bondCount = 0;
  if (pos > 0) {
    const prev = smiles[pos - 1];
    if (prev !== '(' && prev !== ')' && !/[0-9%]/.test(prev)) {
      bondCount++;
      if (prev === '=') bondCount++;
      if (prev === '#') bondCount += 2;
    }
  }
  if (pos < smiles.length - 1) {
    const next = smiles[pos + 1];
    if (next !== '(' && next !== ')' && !/[0-9%]/.test(next) && next !== '[') {
      bondCount++;
      if (next === '=') bondCount++;
      if (next === '#') bondCount += 2;
    }
  }

  const valences: Record<string, number> = {
    'C': 4,
    'N': 3,
    'O': 2,
    'S': 2,
    'P': 3,
  };

  const valence = valences[upper] || 4;
  const isAromatic = char === char.toLowerCase();
  const aromaticAdjust = isAromatic ? 1 : 0;

  return Math.max(0, valence - bondCount - aromaticAdjust);
}

export interface ADMETProfile {
  absorption: 'high' | 'moderate' | 'low';
  distribution: 'good' | 'moderate' | 'poor';
  metabolism: 'stable' | 'moderate' | 'rapid';
  excretion: 'normal' | 'slow' | 'fast';
  toxicity: 'low' | 'moderate' | 'high';
  bbb_penetration: boolean;
  pgp_substrate: boolean;
  cyp_inhibitor: boolean;
  herg_risk: 'low' | 'moderate' | 'high';
}

export function predictADMET(props: MolecularProperties): ADMETProfile {
  const absorption: 'high' | 'moderate' | 'low' =
    props.tpsa < 60 && props.molecularWeight < 500 ? 'high' :
    props.tpsa < 120 && props.molecularWeight < 600 ? 'moderate' : 'low';

  const distribution: 'good' | 'moderate' | 'poor' =
    props.logP >= 1 && props.logP <= 3 && props.molecularWeight < 400 ? 'good' :
    props.logP >= -1 && props.logP <= 5 && props.molecularWeight < 500 ? 'moderate' : 'poor';

  const metabolism: 'stable' | 'moderate' | 'rapid' =
    props.rotBonds < 5 && props.rings > 0 ? 'stable' :
    props.rotBonds < 10 ? 'moderate' : 'rapid';

  const excretion: 'normal' | 'slow' | 'fast' =
    props.molecularWeight > 500 || props.logP > 5 ? 'slow' :
    props.molecularWeight < 200 ? 'fast' : 'normal';

  const toxicity: 'low' | 'moderate' | 'high' =
    props.logP < 3 && props.molecularWeight < 400 && props.hbd <= 3 ? 'low' :
    props.logP < 5 && props.molecularWeight < 500 ? 'moderate' : 'high';

  const bbb_penetration = props.tpsa < 90 && props.molecularWeight < 400 && props.hbd <= 3;
  const pgp_substrate = props.molecularWeight > 400 || props.hba > 8;
  const cyp_inhibitor = props.logP > 3 && props.aromaticRings >= 2;

  const herg_risk: 'low' | 'moderate' | 'high' =
    props.logP > 3.5 && props.molecularWeight > 350 ? 'high' :
    props.logP > 2.5 || props.molecularWeight > 500 ? 'moderate' : 'low';

  return {
    absorption,
    distribution,
    metabolism,
    excretion,
    toxicity,
    bbb_penetration,
    pgp_substrate,
    cyp_inhibitor,
    herg_risk,
  };
}

export function evaluateDrugLikeness(props: MolecularProperties): {
  lipinskiViolations: number;
  drugLikeness: 'excellent' | 'good' | 'moderate' | 'poor';
  veberCompliant: boolean;
  leadLike: boolean;
} {
  let violations = 0;

  if (props.molecularWeight > 500) violations++;
  if (props.logP > 5) violations++;
  if (props.hbd > 5) violations++;
  if (props.hba > 10) violations++;

  const drugLikeness: 'excellent' | 'good' | 'moderate' | 'poor' =
    violations === 0 ? 'excellent' :
    violations === 1 ? 'good' :
    violations === 2 ? 'moderate' : 'poor';

  const veberCompliant = props.rotBonds <= 10 && props.tpsa <= 140;

  const leadLike = 
    props.molecularWeight >= 250 && 
    props.molecularWeight <= 350 &&
    props.logP >= -1 && 
    props.logP <= 3 &&
    props.rotBonds <= 7;

  return {
    lipinskiViolations: violations,
    drugLikeness,
    veberCompliant,
    leadLike,
  };
}
