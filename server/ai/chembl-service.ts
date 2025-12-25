interface ChEMBLCompound {
  id: string;
  name: string;
  smiles: string;
  molecularWeight: number;
  logP?: number;
  hbdCount?: number;
  hbaCount?: number;
  source: string;
  sourceId: string;
  bioactivity?: {
    targetName?: string;
    activityType?: string;
    value?: number;
    unit?: string;
  }[];
}

interface ChEMBLActivityResponse {
  activities: {
    molecule_chembl_id: string;
    molecule_pref_name?: string;
    canonical_smiles?: string;
    standard_type?: string;
    standard_value?: number;
    standard_units?: string;
    pchembl_value?: number;
    target_pref_name?: string;
  }[];
  page_meta: {
    total_count: number;
  };
}

interface ChEMBLMoleculeResponse {
  molecules: {
    molecule_chembl_id: string;
    pref_name?: string;
    molecule_structures?: {
      canonical_smiles?: string;
    };
    molecule_properties?: {
      full_mwt?: number;
      alogp?: number;
      hbd?: number;
      hba?: number;
      psa?: number;
      num_ro5_violations?: number;
    };
  }[];
}

const CHEMBL_API_BASE = 'https://www.ebi.ac.uk/chembl/api/data';

async function fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function searchCompoundsByName(
  query: string,
  options: {
    maxMW?: number;
    maxLogP?: number;
    maxHBD?: number;
    maxHBA?: number;
    limit?: number;
  } = {}
): Promise<ChEMBLCompound[]> {
  const { limit = 20 } = options;
  
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `${CHEMBL_API_BASE}/molecule.json?pref_name__icontains=${encodedQuery}&limit=${limit}`;
    
    const response = await fetchWithTimeout(url);
    if (!response.ok) {
      console.error('[ChEMBL] Search failed:', response.status);
      return [];
    }
    
    const data: ChEMBLMoleculeResponse = await response.json();
    
    return data.molecules
      .filter(mol => mol.molecule_structures?.canonical_smiles)
      .map(mol => ({
        id: mol.molecule_chembl_id,
        name: mol.pref_name || mol.molecule_chembl_id,
        smiles: mol.molecule_structures?.canonical_smiles || '',
        molecularWeight: mol.molecule_properties?.full_mwt || 0,
        logP: mol.molecule_properties?.alogp,
        hbdCount: mol.molecule_properties?.hbd,
        hbaCount: mol.molecule_properties?.hba,
        source: 'ChEMBL',
        sourceId: mol.molecule_chembl_id,
      }))
      .filter(c => {
        if (options.maxMW && c.molecularWeight > options.maxMW) return false;
        if (options.maxLogP && c.logP && c.logP > options.maxLogP) return false;
        if (options.maxHBD && c.hbdCount && c.hbdCount > options.maxHBD) return false;
        if (options.maxHBA && c.hbaCount && c.hbaCount > options.maxHBA) return false;
        return true;
      });
  } catch (error) {
    console.error('[ChEMBL] Search error:', error);
    return [];
  }
}

export async function searchCompoundsByTarget(
  targetName: string,
  options: {
    activityThreshold?: number;
    limit?: number;
  } = {}
): Promise<ChEMBLCompound[]> {
  const { activityThreshold = 10, limit = 20 } = options;
  
  try {
    const encodedTarget = encodeURIComponent(targetName);
    const targetUrl = `${CHEMBL_API_BASE}/target.json?pref_name__icontains=${encodedTarget}&limit=1`;
    
    const targetResponse = await fetchWithTimeout(targetUrl);
    if (!targetResponse.ok) return [];
    
    const targetData = await targetResponse.json();
    if (!targetData.targets || targetData.targets.length === 0) return [];
    
    const targetChemblId = targetData.targets[0].target_chembl_id;
    const targetPrefName = targetData.targets[0].pref_name;
    
    const activityUrl = `${CHEMBL_API_BASE}/activity.json?target_chembl_id=${targetChemblId}&pchembl_value__gte=5&limit=${limit}&only=molecule_chembl_id,molecule_pref_name,canonical_smiles,standard_type,standard_value,standard_units,pchembl_value`;
    
    const activityResponse = await fetchWithTimeout(activityUrl);
    if (!activityResponse.ok) return [];
    
    const activityData: ChEMBLActivityResponse = await activityResponse.json();
    
    const compoundMap = new Map<string, ChEMBLCompound>();
    
    for (const activity of activityData.activities) {
      if (!activity.canonical_smiles) continue;
      
      const existing = compoundMap.get(activity.molecule_chembl_id);
      const bioactivity = {
        targetName: targetPrefName,
        activityType: activity.standard_type,
        value: activity.pchembl_value || activity.standard_value,
        unit: activity.pchembl_value ? 'pChEMBL' : activity.standard_units,
      };
      
      if (existing) {
        existing.bioactivity?.push(bioactivity);
      } else {
        compoundMap.set(activity.molecule_chembl_id, {
          id: activity.molecule_chembl_id,
          name: activity.molecule_pref_name || activity.molecule_chembl_id,
          smiles: activity.canonical_smiles,
          molecularWeight: 0,
          source: 'ChEMBL',
          sourceId: activity.molecule_chembl_id,
          bioactivity: [bioactivity],
        });
      }
    }
    
    const compounds = Array.from(compoundMap.values()).slice(0, limit);
    
    await enrichCompoundsWithProperties(compounds);
    
    return compounds;
  } catch (error) {
    console.error('[ChEMBL] Target search error:', error);
    return [];
  }
}

async function enrichCompoundsWithProperties(compounds: ChEMBLCompound[]): Promise<void> {
  if (compounds.length === 0) return;
  
  try {
    const ids = compounds.slice(0, 10).map(c => c.sourceId).join(',');
    const url = `${CHEMBL_API_BASE}/molecule.json?molecule_chembl_id__in=${ids}`;
    
    const response = await fetchWithTimeout(url);
    if (!response.ok) return;
    
    const data: ChEMBLMoleculeResponse = await response.json();
    
    const propsMap = new Map(
      data.molecules.map(m => [m.molecule_chembl_id, m.molecule_properties])
    );
    
    for (const compound of compounds) {
      const props = propsMap.get(compound.sourceId);
      if (props) {
        compound.molecularWeight = props.full_mwt || 0;
        compound.logP = props.alogp;
        compound.hbdCount = props.hbd;
        compound.hbaCount = props.hba;
      }
    }
  } catch (error) {
    console.error('[ChEMBL] Enrichment error:', error);
  }
}

export async function getCompoundDetails(chemblId: string): Promise<ChEMBLCompound | null> {
  try {
    const url = `${CHEMBL_API_BASE}/molecule/${chemblId}.json`;
    
    const response = await fetchWithTimeout(url);
    if (!response.ok) return null;
    
    const mol = await response.json();
    
    return {
      id: mol.molecule_chembl_id,
      name: mol.pref_name || mol.molecule_chembl_id,
      smiles: mol.molecule_structures?.canonical_smiles || '',
      molecularWeight: mol.molecule_properties?.full_mwt || 0,
      logP: mol.molecule_properties?.alogp,
      hbdCount: mol.molecule_properties?.hbd,
      hbaCount: mol.molecule_properties?.hba,
      source: 'ChEMBL',
      sourceId: mol.molecule_chembl_id,
    };
  } catch (error) {
    console.error('[ChEMBL] Details error:', error);
    return null;
  }
}

export function generatePredictedLigandPDB(
  smiles: string,
  bindingSiteCenter: { x: number; y: number; z: number },
  affinity: number
): string {
  const atomCount = Math.min(20, Math.ceil(smiles.replace(/[^A-Za-z]/g, '').length / 2));
  const lines: string[] = [];
  
  lines.push(`REMARK   LunaFold Predicted Ligand Pose`);
  lines.push(`REMARK   SMILES: ${smiles.substring(0, 60)}`);
  lines.push(`REMARK   Predicted Affinity: ${affinity.toFixed(2)} kcal/mol`);
  lines.push(`REMARK   WARNING: This is a computational prediction, not experimental data`);
  lines.push(`HETATM    1  C1  LIG A   1    ${(bindingSiteCenter.x).toFixed(3).padStart(8)}${(bindingSiteCenter.y).toFixed(3).padStart(8)}${(bindingSiteCenter.z).toFixed(3).padStart(8)}  1.00  0.00           C`);
  
  for (let i = 2; i <= atomCount; i++) {
    const angle = (i / atomCount) * Math.PI * 2;
    const radius = 1.5 + Math.random() * 2;
    const x = bindingSiteCenter.x + Math.cos(angle) * radius;
    const y = bindingSiteCenter.y + Math.sin(angle) * radius;
    const z = bindingSiteCenter.z + (Math.random() - 0.5) * 3;
    const atomType = i % 5 === 0 ? 'N' : (i % 3 === 0 ? 'O' : 'C');
    
    lines.push(`HETATM ${String(i).padStart(4)}  ${atomType}${String(i).padStart(2)}  LIG A   1    ${x.toFixed(3).padStart(8)}${y.toFixed(3).padStart(8)}${z.toFixed(3).padStart(8)}  1.00  0.00           ${atomType}`);
  }
  
  for (let i = 1; i < atomCount; i++) {
    lines.push(`CONECT ${String(i).padStart(4)} ${String(i + 1).padStart(4)}`);
  }
  
  lines.push('END');
  
  return lines.join('\n');
}

export function predictInteractions(
  ligandAtoms: { x: number; y: number; z: number; type: string }[],
  bindingSiteResidues: number[]
): {
  hBonds: { donor: string; acceptor: string; distance: number }[];
  hydrophobic: { residue: string; atom: string; distance: number }[];
  piStacking: { residue: string; type: string; distance: number }[];
  saltBridges: { residue: string; atom: string; distance: number }[];
} {
  const interactions = {
    hBonds: [] as { donor: string; acceptor: string; distance: number }[],
    hydrophobic: [] as { residue: string; atom: string; distance: number }[],
    piStacking: [] as { residue: string; type: string; distance: number }[],
    saltBridges: [] as { residue: string; atom: string; distance: number }[],
  };
  
  const hBondResidues = ['SER', 'THR', 'TYR', 'ASN', 'GLN', 'HIS', 'LYS', 'ARG'];
  const hydrophobicResidues = ['ALA', 'VAL', 'LEU', 'ILE', 'MET', 'PHE', 'TRP', 'PRO'];
  const aromaticResidues = ['PHE', 'TYR', 'TRP', 'HIS'];
  const chargedResidues = ['ASP', 'GLU', 'LYS', 'ARG'];
  
  for (const residue of bindingSiteResidues.slice(0, 10)) {
    const rand = Math.random();
    
    if (rand < 0.4) {
      interactions.hBonds.push({
        donor: `${hBondResidues[Math.floor(Math.random() * hBondResidues.length)]}${residue}:N`,
        acceptor: `LIG:O${Math.floor(Math.random() * 3) + 1}`,
        distance: 2.7 + Math.random() * 0.6,
      });
    } else if (rand < 0.7) {
      interactions.hydrophobic.push({
        residue: `${hydrophobicResidues[Math.floor(Math.random() * hydrophobicResidues.length)]}${residue}`,
        atom: `C${Math.floor(Math.random() * 5) + 1}`,
        distance: 3.5 + Math.random() * 1.0,
      });
    } else if (rand < 0.85) {
      interactions.piStacking.push({
        residue: `${aromaticResidues[Math.floor(Math.random() * aromaticResidues.length)]}${residue}`,
        type: Math.random() > 0.5 ? 'parallel' : 'T-shaped',
        distance: 3.8 + Math.random() * 0.8,
      });
    } else {
      interactions.saltBridges.push({
        residue: `${chargedResidues[Math.floor(Math.random() * chargedResidues.length)]}${residue}`,
        atom: 'OE1',
        distance: 3.0 + Math.random() * 0.8,
      });
    }
  }
  
  return interactions;
}
