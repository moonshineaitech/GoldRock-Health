interface AtomCoord {
  x: number;
  y: number;
  z: number;
  residueIndex: number;
  residueName: string;
  atomName: string;
  bFactor: number;
}

interface DetectedPocket {
  id: string;
  residues: number[];
  residueNames: string[];
  volume: number;
  druggabilityScore: number;
  hydrophobicity: number;
  enclosure: number;
  polarity: number;
  chargedRatio: number;
  aromaticRatio: number;
  center: { x: number; y: number; z: number };
  boundingBox: { min: { x: number; y: number; z: number }; max: { x: number; y: number; z: number } };
  confidence: number;
}

const HYDROPHOBIC_AA = new Set(['A', 'V', 'L', 'I', 'M', 'F', 'W', 'P', 'G']);
const POLAR_AA = new Set(['S', 'T', 'N', 'Q', 'Y', 'C']);
const CHARGED_AA = new Set(['D', 'E', 'K', 'R', 'H']);
const AROMATIC_AA = new Set(['F', 'Y', 'W', 'H']);
const AA_3_TO_1: Record<string, string> = {
  'ALA': 'A', 'ARG': 'R', 'ASN': 'N', 'ASP': 'D', 'CYS': 'C',
  'GLN': 'Q', 'GLU': 'E', 'GLY': 'G', 'HIS': 'H', 'ILE': 'I',
  'LEU': 'L', 'LYS': 'K', 'MET': 'M', 'PHE': 'F', 'PRO': 'P',
  'SER': 'S', 'THR': 'T', 'TRP': 'W', 'TYR': 'Y', 'VAL': 'V'
};

export function parseCoordinatesFromCIF(cifData: string): AtomCoord[] {
  const atoms: AtomCoord[] = [];
  const lines = cifData.split('\n');
  let inAtomSite = false;
  let columnOrder: string[] = [];
  let columnIndex: Record<string, number> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === 'loop_') {
      if (inAtomSite && columnOrder.length > 0) {
        break;
      }
      inAtomSite = false;
      columnOrder = [];
      columnIndex = {};
      continue;
    }
    
    if (line.startsWith('_atom_site.')) {
      inAtomSite = true;
      const colName = line.replace('_atom_site.', '').split(/\s/)[0];
      if (colName) {
        columnIndex[colName] = columnOrder.length;
        columnOrder.push(colName);
      }
      continue;
    }
    
    if (inAtomSite && line.length > 0 && !line.startsWith('_') && !line.startsWith('#')) {
      const parts = line.split(/\s+/).filter(p => p.length > 0);
      if (parts.length >= columnOrder.length - 2) {
        const groupPdbIdx = columnIndex['group_PDB'] ?? 0;
        const groupPdb = parts[groupPdbIdx];
        if (groupPdb !== 'ATOM') continue;
        
        const xIdx = columnIndex['Cartn_x'] ?? 10;
        const yIdx = columnIndex['Cartn_y'] ?? 11;
        const zIdx = columnIndex['Cartn_z'] ?? 12;
        const seqIdx = columnIndex['label_seq_id'] ?? 8;
        const compIdx = columnIndex['label_comp_id'] ?? 5;
        const atomIdx = columnIndex['label_atom_id'] ?? 3;
        const bFactorIdx = columnIndex['B_iso_or_equiv'] ?? 14;
        
        const x = parseFloat(parts[xIdx]);
        const y = parseFloat(parts[yIdx]);
        const z = parseFloat(parts[zIdx]);
        const residueIndex = parseInt(parts[seqIdx]) - 1;
        const residueName = parts[compIdx];
        const atomName = parts[atomIdx];
        const bFactor = parseFloat(parts[bFactorIdx]) || 0;
        
        if (!isNaN(x) && !isNaN(y) && !isNaN(z) && !isNaN(residueIndex)) {
          atoms.push({ x, y, z, residueIndex, residueName, atomName, bFactor });
        }
      }
    }
  }
  
  return atoms;
}

export function parseCoordinatesFromPDB(pdbData: string): AtomCoord[] {
  const atoms: AtomCoord[] = [];
  const lines = pdbData.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('ATOM') || line.startsWith('HETATM')) {
      const x = parseFloat(line.substring(30, 38).trim());
      const y = parseFloat(line.substring(38, 46).trim());
      const z = parseFloat(line.substring(46, 54).trim());
      const residueIndex = parseInt(line.substring(22, 26).trim()) - 1;
      const residueName = line.substring(17, 20).trim();
      const atomName = line.substring(12, 16).trim();
      const bFactor = parseFloat(line.substring(60, 66).trim()) || 0;
      
      if (!isNaN(x) && !isNaN(y) && !isNaN(z) && !isNaN(residueIndex)) {
        atoms.push({ x, y, z, residueIndex, residueName, atomName, bFactor });
      }
    }
  }
  
  return atoms;
}

function getCAlphaAtoms(atoms: AtomCoord[]): AtomCoord[] {
  return atoms.filter(a => a.atomName === 'CA');
}

function distance(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

function getCenter(atoms: AtomCoord[]): { x: number; y: number; z: number } {
  const sum = atoms.reduce((acc, a) => ({ x: acc.x + a.x, y: acc.y + a.y, z: acc.z + a.z }), { x: 0, y: 0, z: 0 });
  return { x: sum.x / atoms.length, y: sum.y / atoms.length, z: sum.z / atoms.length };
}

function getBoundingBox(atoms: AtomCoord[]) {
  const min = { x: Infinity, y: Infinity, z: Infinity };
  const max = { x: -Infinity, y: -Infinity, z: -Infinity };
  
  for (const a of atoms) {
    min.x = Math.min(min.x, a.x);
    min.y = Math.min(min.y, a.y);
    min.z = Math.min(min.z, a.z);
    max.x = Math.max(max.x, a.x);
    max.y = Math.max(max.y, a.y);
    max.z = Math.max(max.z, a.z);
  }
  
  return { min, max };
}

function estimateVolume(boundingBox: { min: { x: number; y: number; z: number }; max: { x: number; y: number; z: number } }): number {
  const dx = boundingBox.max.x - boundingBox.min.x;
  const dy = boundingBox.max.y - boundingBox.min.y;
  const dz = boundingBox.max.z - boundingBox.min.z;
  return dx * dy * dz * 0.6;
}

export function findPotentialPockets(
  atoms: AtomCoord[],
  plddtScores: number[] | null,
  sequence: string
): DetectedPocket[] {
  const cAlphas = getCAlphaAtoms(atoms);
  if (cAlphas.length < 10) return [];
  
  const residueMap = new Map<number, AtomCoord[]>();
  for (const atom of atoms) {
    if (!residueMap.has(atom.residueIndex)) {
      residueMap.set(atom.residueIndex, []);
    }
    residueMap.get(atom.residueIndex)!.push(atom);
  }
  
  const pockets: DetectedPocket[] = [];
  const CONTACT_DISTANCE = 8.0;
  const MIN_POCKET_SIZE = 5;
  const MAX_POCKET_SIZE = 30;
  
  const residueContacts = new Map<number, Set<number>>();
  
  for (let i = 0; i < cAlphas.length; i++) {
    for (let j = i + 3; j < cAlphas.length; j++) {
      const dist = distance(cAlphas[i], cAlphas[j]);
      if (dist < CONTACT_DISTANCE && dist > 3.8) {
        if (!residueContacts.has(i)) residueContacts.set(i, new Set());
        if (!residueContacts.has(j)) residueContacts.set(j, new Set());
        residueContacts.get(i)!.add(j);
        residueContacts.get(j)!.add(i);
      }
    }
  }
  
  const visited = new Set<number>();
  let pocketId = 1;
  
  const residueContactEntries = Array.from(residueContacts.entries());
  for (const [residue, contacts] of residueContactEntries) {
    if (visited.has(residue)) continue;
    if (contacts.size < 3) continue;
    
    const cluster = new Set<number>([residue]);
    const queue = [residue];
    visited.add(residue);
    
    while (queue.length > 0 && cluster.size < MAX_POCKET_SIZE) {
      const current = queue.shift()!;
      const currentContacts = residueContacts.get(current) || new Set();
      const neighbors = Array.from(currentContacts);
      
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          const neighborContacts = residueContacts.get(neighbor) || new Set();
          if (neighborContacts.size >= 2) {
            cluster.add(neighbor);
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
    }
    
    if (cluster.size >= MIN_POCKET_SIZE) {
      const pocketResidues = Array.from(cluster).sort((a, b) => a - b);
      const pocketAtoms = pocketResidues.flatMap(r => residueMap.get(r) || []);
      
      if (pocketAtoms.length === 0) continue;
      
      const center = getCenter(pocketAtoms);
      const boundingBox = getBoundingBox(pocketAtoms);
      const volume = estimateVolume(boundingBox);
      
      const residueNames: string[] = [];
      let hydrophobicCount = 0;
      let polarCount = 0;
      let chargedCount = 0;
      let aromaticCount = 0;
      let totalPlddt = 0;
      let plddtCount = 0;
      
      for (const resIdx of pocketResidues) {
        const resAtoms = residueMap.get(resIdx);
        if (resAtoms && resAtoms.length > 0) {
          const resName3 = resAtoms[0].residueName;
          const resName1 = AA_3_TO_1[resName3] || sequence[resIdx] || 'X';
          residueNames.push(resName1);
          
          if (HYDROPHOBIC_AA.has(resName1)) hydrophobicCount++;
          if (POLAR_AA.has(resName1)) polarCount++;
          if (CHARGED_AA.has(resName1)) chargedCount++;
          if (AROMATIC_AA.has(resName1)) aromaticCount++;
          
          if (plddtScores && plddtScores[resIdx] !== undefined) {
            totalPlddt += plddtScores[resIdx];
            plddtCount++;
          }
        }
      }
      
      const n = pocketResidues.length;
      const hydrophobicity = hydrophobicCount / n;
      const polarity = polarCount / n;
      const chargedRatio = chargedCount / n;
      const aromaticRatio = aromaticCount / n;
      const avgPlddt = plddtCount > 0 ? totalPlddt / plddtCount : 70;
      
      const enclosure = Math.min(1, n / 20);
      
      const druggabilityScore = (
        (avgPlddt / 100) * 0.25 +
        hydrophobicity * 0.25 +
        enclosure * 0.15 +
        (chargedRatio > 0.1 && chargedRatio < 0.5 ? 0.15 : 0.05) +
        (aromaticRatio > 0.1 ? 0.1 : 0.05) +
        (volume > 100 && volume < 1000 ? 0.1 : 0.05)
      ) * 100;
      
      pockets.push({
        id: `pocket_${pocketId}`,
        residues: pocketResidues,
        residueNames,
        volume: Math.round(volume),
        druggabilityScore: Math.min(95, Math.max(15, druggabilityScore)),
        hydrophobicity,
        polarity,
        chargedRatio,
        aromaticRatio,
        enclosure,
        center,
        boundingBox,
        confidence: Math.min(95, avgPlddt),
      });
      pocketId++;
    }
  }
  
  return pockets
    .sort((a, b) => b.druggabilityScore - a.druggabilityScore)
    .slice(0, 8);
}

export function analyzeBindingSites(
  cifData: string | null,
  pdbData: string | null,
  plddtScores: number[] | null,
  sequence: string
): DetectedPocket[] {
  let atoms: AtomCoord[] = [];
  
  if (cifData) {
    atoms = parseCoordinatesFromCIF(cifData);
  }
  
  if (atoms.length === 0 && pdbData) {
    atoms = parseCoordinatesFromPDB(pdbData);
  }
  
  if (atoms.length === 0) {
    console.log('[BindingSiteAnalyzer] No atoms parsed from structure');
    return [];
  }
  
  console.log(`[BindingSiteAnalyzer] Parsed ${atoms.length} atoms from structure`);
  
  return findPotentialPockets(atoms, plddtScores, sequence);
}

export function calculateMutationDDG(
  wildType: string,
  mutant: string,
  position: number,
  plddtScore: number,
  neighboringResidues: string[],
  isInPocket: boolean,
  isBuried: boolean
): { ddG: number; confidence: number; stabilityImpact: string; functionalImpact: string } {
  const BLOSUM62: Record<string, Record<string, number>> = {
    'A': {'A':4,'R':-1,'N':-2,'D':-2,'C':0,'Q':-1,'E':-1,'G':0,'H':-2,'I':-1,'L':-1,'K':-1,'M':-1,'F':-2,'P':-1,'S':1,'T':0,'W':-3,'Y':-2,'V':0},
    'R': {'A':-1,'R':5,'N':0,'D':-2,'C':-3,'Q':1,'E':0,'G':-2,'H':0,'I':-3,'L':-2,'K':2,'M':-1,'F':-3,'P':-2,'S':-1,'T':-1,'W':-3,'Y':-2,'V':-3},
    'N': {'A':-2,'R':0,'N':6,'D':1,'C':-3,'Q':0,'E':0,'G':0,'H':1,'I':-3,'L':-3,'K':0,'M':-2,'F':-3,'P':-2,'S':1,'T':0,'W':-4,'Y':-2,'V':-3},
    'D': {'A':-2,'R':-2,'N':1,'D':6,'C':-3,'Q':0,'E':2,'G':-1,'H':-1,'I':-3,'L':-4,'K':-1,'M':-3,'F':-3,'P':-1,'S':0,'T':-1,'W':-4,'Y':-3,'V':-3},
    'C': {'A':0,'R':-3,'N':-3,'D':-3,'C':9,'Q':-3,'E':-4,'G':-3,'H':-3,'I':-1,'L':-1,'K':-3,'M':-1,'F':-2,'P':-3,'S':-1,'T':-1,'W':-2,'Y':-2,'V':-1},
    'Q': {'A':-1,'R':1,'N':0,'D':0,'C':-3,'Q':5,'E':2,'G':-2,'H':0,'I':-3,'L':-2,'K':1,'M':0,'F':-3,'P':-1,'S':0,'T':-1,'W':-2,'Y':-1,'V':-2},
    'E': {'A':-1,'R':0,'N':0,'D':2,'C':-4,'Q':2,'E':5,'G':-2,'H':0,'I':-3,'L':-3,'K':1,'M':-2,'F':-3,'P':-1,'S':0,'T':-1,'W':-3,'Y':-2,'V':-2},
    'G': {'A':0,'R':-2,'N':0,'D':-1,'C':-3,'Q':-2,'E':-2,'G':6,'H':-2,'I':-4,'L':-4,'K':-2,'M':-3,'F':-3,'P':-2,'S':0,'T':-2,'W':-2,'Y':-3,'V':-3},
    'H': {'A':-2,'R':0,'N':1,'D':-1,'C':-3,'Q':0,'E':0,'G':-2,'H':8,'I':-3,'L':-3,'K':-1,'M':-2,'F':-1,'P':-2,'S':-1,'T':-2,'W':-2,'Y':2,'V':-3},
    'I': {'A':-1,'R':-3,'N':-3,'D':-3,'C':-1,'Q':-3,'E':-3,'G':-4,'H':-3,'I':4,'L':2,'K':-3,'M':1,'F':0,'P':-3,'S':-2,'T':-1,'W':-3,'Y':-1,'V':3},
    'L': {'A':-1,'R':-2,'N':-3,'D':-4,'C':-1,'Q':-2,'E':-3,'G':-4,'H':-3,'I':2,'L':4,'K':-2,'M':2,'F':0,'P':-3,'S':-2,'T':-1,'W':-2,'Y':-1,'V':1},
    'K': {'A':-1,'R':2,'N':0,'D':-1,'C':-3,'Q':1,'E':1,'G':-2,'H':-1,'I':-3,'L':-2,'K':5,'M':-1,'F':-3,'P':-1,'S':0,'T':-1,'W':-3,'Y':-2,'V':-2},
    'M': {'A':-1,'R':-1,'N':-2,'D':-3,'C':-1,'Q':0,'E':-2,'G':-3,'H':-2,'I':1,'L':2,'K':-1,'M':5,'F':0,'P':-2,'S':-1,'T':-1,'W':-1,'Y':-1,'V':1},
    'F': {'A':-2,'R':-3,'N':-3,'D':-3,'C':-2,'Q':-3,'E':-3,'G':-3,'H':-1,'I':0,'L':0,'K':-3,'M':0,'F':6,'P':-4,'S':-2,'T':-2,'W':1,'Y':3,'V':-1},
    'P': {'A':-1,'R':-2,'N':-2,'D':-1,'C':-3,'Q':-1,'E':-1,'G':-2,'H':-2,'I':-3,'L':-3,'K':-1,'M':-2,'F':-4,'P':7,'S':-1,'T':-1,'W':-4,'Y':-3,'V':-2},
    'S': {'A':1,'R':-1,'N':1,'D':0,'C':-1,'Q':0,'E':0,'G':0,'H':-1,'I':-2,'L':-2,'K':0,'M':-1,'F':-2,'P':-1,'S':4,'T':1,'W':-3,'Y':-2,'V':-2},
    'T': {'A':0,'R':-1,'N':0,'D':-1,'C':-1,'Q':-1,'E':-1,'G':-2,'H':-2,'I':-1,'L':-1,'K':-1,'M':-1,'F':-2,'P':-1,'S':1,'T':5,'W':-2,'Y':-2,'V':0},
    'W': {'A':-3,'R':-3,'N':-4,'D':-4,'C':-2,'Q':-2,'E':-3,'G':-2,'H':-2,'I':-3,'L':-2,'K':-3,'M':-1,'F':1,'P':-4,'S':-3,'T':-2,'W':11,'Y':2,'V':-3},
    'Y': {'A':-2,'R':-2,'N':-2,'D':-3,'C':-2,'Q':-1,'E':-2,'G':-3,'H':2,'I':-1,'L':-1,'K':-2,'M':-1,'F':3,'P':-3,'S':-2,'T':-2,'W':2,'Y':7,'V':-1},
    'V': {'A':0,'R':-3,'N':-3,'D':-3,'C':-1,'Q':-2,'E':-2,'G':-3,'H':-3,'I':3,'L':1,'K':-2,'M':1,'F':-1,'P':-2,'S':-2,'T':0,'W':-3,'Y':-1,'V':4}
  };
  
  const blosumScore = BLOSUM62[wildType]?.[mutant] ?? 0;
  const selfScore = BLOSUM62[wildType]?.[wildType] ?? 4;
  const blosumPenalty = (selfScore - blosumScore) * 0.3;
  
  let ddG = blosumPenalty;
  
  const wtHydrophobic = HYDROPHOBIC_AA.has(wildType);
  const mutHydrophobic = HYDROPHOBIC_AA.has(mutant);
  const wtCharged = CHARGED_AA.has(wildType);
  const mutCharged = CHARGED_AA.has(mutant);
  const wtPolar = POLAR_AA.has(wildType);
  const mutPolar = POLAR_AA.has(mutant);
  
  if (wtHydrophobic !== mutHydrophobic) {
    ddG += isBuried ? 2.0 : 0.8;
  }
  
  if (wtCharged !== mutCharged) {
    ddG += 1.5;
  }
  
  if (wtCharged && mutCharged) {
    const wtPositive = ['K', 'R', 'H'].includes(wildType);
    const mutPositive = ['K', 'R', 'H'].includes(mutant);
    if (wtPositive !== mutPositive) {
      ddG += 2.5;
    }
  }
  
  if (wildType === 'P' || mutant === 'P') {
    ddG += 1.2;
  }
  if (wildType === 'G' && mutant !== 'A') {
    ddG += 0.8;
  }
  if (wildType === 'C') {
    ddG += 1.8;
  }
  
  if (plddtScore >= 90) {
    ddG *= 1.3;
  } else if (plddtScore < 50) {
    ddG *= 0.4;
  }
  
  if (isInPocket) {
    ddG *= 1.2;
  }
  
  if (isBuried) {
    ddG *= 1.15;
  }
  
  ddG = Math.round(ddG * 100) / 100;
  
  let stabilityImpact: string;
  if (ddG < -0.5) stabilityImpact = "stabilizing";
  else if (ddG < 0.5) stabilityImpact = "neutral";
  else if (ddG < 2.0) stabilityImpact = "destabilizing";
  else stabilityImpact = "highly_destabilizing";
  
  let functionalImpact: string;
  if (plddtScore >= 85 && Math.abs(ddG) > 1.5 && isInPocket) {
    functionalImpact = "probably_damaging";
  } else if (plddtScore >= 75 && Math.abs(ddG) > 1.0) {
    functionalImpact = "possibly_damaging";
  } else {
    functionalImpact = "benign";
  }
  
  const confidence = Math.min(95, 40 + (plddtScore * 0.5) + (blosumScore > 0 ? 5 : 0));
  
  return {
    ddG,
    confidence: Math.round(confidence),
    stabilityImpact,
    functionalImpact
  };
}
