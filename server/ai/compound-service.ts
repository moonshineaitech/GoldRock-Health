interface CompoundSearchParams {
  query?: string;
  smiles?: string;
  targetName?: string;
  minMW?: number;
  maxMW?: number;
  minLogP?: number;
  maxLogP?: number;
  maxHBD?: number;
  maxHBA?: number;
  limit?: number;
}

interface CompoundResult {
  id: string;
  name: string;
  smiles: string;
  inchiKey?: string;
  molecularWeight: number;
  logP: number;
  hbdCount: number;
  hbaCount: number;
  rotBonds: number;
  tpsa: number;
  source: string;
  sourceId: string;
  bioactivity?: {
    targetName?: string;
    activityType?: string;
    value?: number;
    unit?: string;
  }[];
}

interface SimilaritySearchParams {
  smiles: string;
  threshold?: number;
  limit?: number;
}

interface TargetSearchParams {
  targetName: string;
  organism?: string;
  activityThreshold?: number;
  limit?: number;
}

const queryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000;

function getCacheKey(params: any): string {
  return JSON.stringify(params);
}

function getFromCache(key: string): any | null {
  const cached = queryCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  queryCache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  queryCache.set(key, { data, timestamp: Date.now() });
  if (queryCache.size > 1000) {
    const oldestKey = queryCache.keys().next().value;
    if (oldestKey) queryCache.delete(oldestKey);
  }
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'LunaFold/1.0 (Drug Discovery Platform)'
        }
      });
      if (response.ok) return response;
      if (response.status === 429) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        continue;
      }
      throw new Error(`HTTP ${response.status}`);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}

export async function searchPubChem(params: CompoundSearchParams): Promise<CompoundResult[]> {
  const cacheKey = getCacheKey({ source: 'pubchem', ...params });
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const results: CompoundResult[] = [];
  const limit = params.limit || 20;

  try {
    let searchUrl = '';
    
    if (params.query) {
      searchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(params.query)}/cids/JSON`;
    } else if (params.smiles) {
      searchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(params.smiles)}/cids/JSON`;
    } else {
      return [];
    }

    const cidResponse = await fetchWithRetry(searchUrl);
    const cidData = await cidResponse.json();
    
    const cids = cidData.IdentifierList?.CID?.slice(0, limit) || [];
    if (cids.length === 0) return [];

    const propsUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cids.join(',')}/property/MolecularFormula,MolecularWeight,XLogP,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,TPSA,CanonicalSMILES,IUPACName,InChIKey/JSON`;
    
    const propsResponse = await fetchWithRetry(propsUrl);
    const propsData = await propsResponse.json();
    
    const properties = propsData.PropertyTable?.Properties || [];
    
    for (const prop of properties) {
      const mw = prop.MolecularWeight || 0;
      const logP = prop.XLogP || 0;
      const hbd = prop.HBondDonorCount || 0;
      const hba = prop.HBondAcceptorCount || 0;

      if (params.minMW && mw < params.minMW) continue;
      if (params.maxMW && mw > params.maxMW) continue;
      if (params.minLogP && logP < params.minLogP) continue;
      if (params.maxLogP && logP > params.maxLogP) continue;
      if (params.maxHBD && hbd > params.maxHBD) continue;
      if (params.maxHBA && hba > params.maxHBA) continue;

      results.push({
        id: `pubchem_${prop.CID}`,
        name: prop.IUPACName || `CID ${prop.CID}`,
        smiles: prop.CanonicalSMILES || '',
        inchiKey: prop.InChIKey,
        molecularWeight: mw,
        logP: logP,
        hbdCount: hbd,
        hbaCount: hba,
        rotBonds: prop.RotatableBondCount || 0,
        tpsa: prop.TPSA || 0,
        source: 'PubChem',
        sourceId: String(prop.CID),
      });
    }

    setCache(cacheKey, results);
    return results;
  } catch (err) {
    console.error('[CompoundService] PubChem search error:', err);
    return [];
  }
}

export async function searchChEMBL(params: CompoundSearchParams): Promise<CompoundResult[]> {
  const cacheKey = getCacheKey({ source: 'chembl', ...params });
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const results: CompoundResult[] = [];
  const limit = params.limit || 20;

  try {
    let searchUrl = 'https://www.ebi.ac.uk/chembl/api/data/molecule.json?limit=' + limit;
    
    if (params.query) {
      searchUrl += `&pref_name__icontains=${encodeURIComponent(params.query)}`;
    }
    if (params.minMW) {
      searchUrl += `&molecule_properties__mw_freebase__gte=${params.minMW}`;
    }
    if (params.maxMW) {
      searchUrl += `&molecule_properties__mw_freebase__lte=${params.maxMW}`;
    }
    if (params.minLogP) {
      searchUrl += `&molecule_properties__alogp__gte=${params.minLogP}`;
    }
    if (params.maxLogP) {
      searchUrl += `&molecule_properties__alogp__lte=${params.maxLogP}`;
    }

    const response = await fetchWithRetry(searchUrl);
    const data = await response.json();
    
    const molecules = data.molecules || [];
    
    for (const mol of molecules) {
      const props = mol.molecule_properties || {};
      const structs = mol.molecule_structures || {};
      
      const hbd = props.hbd || 0;
      const hba = props.hba || 0;
      
      if (params.maxHBD && hbd > params.maxHBD) continue;
      if (params.maxHBA && hba > params.maxHBA) continue;

      results.push({
        id: `chembl_${mol.molecule_chembl_id}`,
        name: mol.pref_name || mol.molecule_chembl_id,
        smiles: structs.canonical_smiles || '',
        inchiKey: structs.standard_inchi_key,
        molecularWeight: props.mw_freebase || props.full_mwt || 0,
        logP: props.alogp || 0,
        hbdCount: hbd,
        hbaCount: hba,
        rotBonds: props.rtb || 0,
        tpsa: props.psa || 0,
        source: 'ChEMBL',
        sourceId: mol.molecule_chembl_id,
      });
    }

    setCache(cacheKey, results);
    return results;
  } catch (err) {
    console.error('[CompoundService] ChEMBL search error:', err);
    return [];
  }
}

export async function searchByTarget(params: TargetSearchParams): Promise<CompoundResult[]> {
  const cacheKey = getCacheKey({ type: 'target', ...params });
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const results: CompoundResult[] = [];
  const limit = params.limit || 20;

  try {
    const targetUrl = `https://www.ebi.ac.uk/chembl/api/data/target.json?pref_name__icontains=${encodeURIComponent(params.targetName)}&limit=5`;
    const targetResponse = await fetchWithRetry(targetUrl);
    const targetData = await targetResponse.json();
    
    const targets = targetData.targets || [];
    if (targets.length === 0) return [];

    const targetChemblId = targets[0].target_chembl_id;

    let activityUrl = `https://www.ebi.ac.uk/chembl/api/data/activity.json?target_chembl_id=${targetChemblId}&limit=${limit * 2}`;
    
    if (params.activityThreshold) {
      activityUrl += `&standard_value__lte=${params.activityThreshold * 1000}`;
    }

    const activityResponse = await fetchWithRetry(activityUrl);
    const activityData = await activityResponse.json();
    
    const activities = activityData.activities || [];
    const moleculeIds = Array.from(new Set(activities.map((a: any) => a.molecule_chembl_id))).slice(0, limit);

    if (moleculeIds.length === 0) return [];

    for (const molId of moleculeIds) {
      const molUrl = `https://www.ebi.ac.uk/chembl/api/data/molecule/${molId}.json`;
      try {
        const molResponse = await fetchWithRetry(molUrl);
        const mol = await molResponse.json();
        
        const props = mol.molecule_properties || {};
        const structs = mol.molecule_structures || {};
        
        const molActivities = activities
          .filter((a: any) => a.molecule_chembl_id === molId)
          .map((a: any) => ({
            targetName: params.targetName,
            activityType: a.standard_type,
            value: a.standard_value ? parseFloat(a.standard_value) / 1000 : undefined,
            unit: a.standard_units === 'nM' ? 'µM' : a.standard_units,
          }));

        results.push({
          id: `chembl_${mol.molecule_chembl_id}`,
          name: mol.pref_name || mol.molecule_chembl_id,
          smiles: structs.canonical_smiles || '',
          inchiKey: structs.standard_inchi_key,
          molecularWeight: props.mw_freebase || 0,
          logP: props.alogp || 0,
          hbdCount: props.hbd || 0,
          hbaCount: props.hba || 0,
          rotBonds: props.rtb || 0,
          tpsa: props.psa || 0,
          source: 'ChEMBL',
          sourceId: mol.molecule_chembl_id,
          bioactivity: molActivities,
        });
      } catch (e) {
        console.log('[CompoundService] Could not fetch molecule:', molId);
      }
    }

    setCache(cacheKey, results);
    return results;
  } catch (err) {
    console.error('[CompoundService] Target search error:', err);
    return [];
  }
}

export async function searchSimilar(params: SimilaritySearchParams): Promise<CompoundResult[]> {
  const cacheKey = getCacheKey({ type: 'similarity', ...params });
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const threshold = Math.round((params.threshold || 0.8) * 100);
  const limit = params.limit || 20;

  try {
    const searchUrl = `https://www.ebi.ac.uk/chembl/api/data/similarity/${encodeURIComponent(params.smiles)}/${threshold}.json?limit=${limit}`;
    
    const response = await fetchWithRetry(searchUrl);
    const data = await response.json();
    
    const molecules = data.molecules || [];
    const results: CompoundResult[] = [];
    
    for (const mol of molecules) {
      const props = mol.molecule_properties || {};
      const structs = mol.molecule_structures || {};

      results.push({
        id: `chembl_${mol.molecule_chembl_id}`,
        name: mol.pref_name || mol.molecule_chembl_id,
        smiles: structs.canonical_smiles || '',
        inchiKey: structs.standard_inchi_key,
        molecularWeight: props.mw_freebase || 0,
        logP: props.alogp || 0,
        hbdCount: props.hbd || 0,
        hbaCount: props.hba || 0,
        rotBonds: props.rtb || 0,
        tpsa: props.psa || 0,
        source: 'ChEMBL',
        sourceId: mol.molecule_chembl_id,
      });
    }

    setCache(cacheKey, results);
    return results;
  } catch (err) {
    console.error('[CompoundService] Similarity search error:', err);
    return [];
  }
}

export async function searchCompounds(params: CompoundSearchParams): Promise<CompoundResult[]> {
  const [pubchemResults, chemblResults] = await Promise.all([
    searchPubChem(params),
    searchChEMBL(params),
  ]);

  const combined = [...chemblResults, ...pubchemResults];
  
  const unique = new Map<string, CompoundResult>();
  for (const compound of combined) {
    const key = compound.inchiKey || compound.smiles || compound.id;
    if (!unique.has(key)) {
      unique.set(key, compound);
    }
  }

  return Array.from(unique.values()).slice(0, params.limit || 40);
}

export function generateBindingSiteQuery(bindingSite: {
  volume: number;
  hydrophobicity: number;
  residues: number[];
  chargedRatio?: number;
}): CompoundSearchParams {
  const params: CompoundSearchParams = {
    limit: 30,
  };

  if (bindingSite.volume < 200) {
    params.maxMW = 350;
    params.query = "fragment";
  } else if (bindingSite.volume < 400) {
    params.maxMW = 500;
    params.query = "drug";
  } else {
    params.maxMW = 700;
    params.query = "inhibitor";
  }

  if (bindingSite.hydrophobicity > 0.6) {
    params.minLogP = 2;
    params.maxLogP = 5;
    params.query = "lipophilic";
  } else if (bindingSite.hydrophobicity > 0.3) {
    params.minLogP = 0;
    params.maxLogP = 4;
  } else {
    params.minLogP = -2;
    params.maxLogP = 2;
    params.maxHBD = 5;
    params.maxHBA = 10;
    params.query = "polar";
  }

  return params;
}
