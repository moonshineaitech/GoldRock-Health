import fetch from 'node-fetch';
import * as crypto from 'crypto';

export interface AlphaFoldStructure {
  source: 'alphafold_db' | 'alphafold3_upload' | 'pending_af3';
  uniprotId?: string;
  pdbData: string;
  cifData?: string;
  plddtScores: number[];
  paeMatrix: number[][];
  pTM?: number;
  ipTM?: number;
  confidenceScore: number;
  modelVersion?: string;
  sequenceMatch: number;
  proteinName?: string;
  organism?: string;
}

interface UniProtSearchResult {
  primaryAccession: string;
  uniProtkbId: string;
  organism?: { scientificName: string };
  proteinDescription?: { recommendedName?: { fullName: { value: string } } };
  sequence?: { value: string };
}

interface AlphaFoldAPIResponse {
  pdbUrl?: string;
  cifUrl?: string;
  paeDocUrl?: string;
  plddtDocUrl?: string;
  modelVersion?: string;
  latestVersion?: number;
  globalMetricValue?: number;
}

const STRUCTURE_CACHE = new Map<string, AlphaFoldStructure>();
const UNIPROT_CACHE = new Map<string, AlphaFoldStructure>();

function hashSequence(sequence: string): string {
  const normalized = sequence.toUpperCase().replace(/[^A-Z]/g, '');
  return crypto.createHash('sha256').update(normalized).digest('hex').substring(0, 16);
}

function calculateSequenceSimilarity(seq1: string, seq2: string): number {
  if (!seq1 || !seq2) return 0;
  const s1 = seq1.toUpperCase().replace(/[^A-Z]/g, '');
  const s2 = seq2.toUpperCase().replace(/[^A-Z]/g, '');
  if (s1 === s2) return 1.0;
  
  const minLen = Math.min(s1.length, s2.length);
  const maxLen = Math.max(s1.length, s2.length);
  let matches = 0;
  
  for (let i = 0; i < minLen; i++) {
    if (s1[i] === s2[i]) matches++;
  }
  
  return matches / maxLen;
}

export async function searchUniProt(sequence: string): Promise<UniProtSearchResult | null> {
  try {
    const cleanSeq = sequence.toUpperCase().replace(/[^A-Z]/g, '');
    
    const searchQueries = [
      cleanSeq.substring(0, 50),
      cleanSeq.substring(0, 30),
      cleanSeq.length > 100 ? cleanSeq.substring(50, 100) : cleanSeq.substring(0, 30)
    ];
    
    for (const query of searchQueries) {
      const searchUrl = `https://rest.uniprot.org/uniprotkb/search?query=sequence:${encodeURIComponent(query)}&format=json&size=10`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'LunaStack/4.2 (Protein Structure Prediction Platform)'
        },
        timeout: 15000
      } as any);
      
      if (!response.ok) continue;
      
      const data = await response.json() as { results: UniProtSearchResult[] };
      
      if (data.results && data.results.length > 0) {
        for (const result of data.results) {
          if (result.sequence?.value) {
            const similarity = calculateSequenceSimilarity(cleanSeq, result.sequence.value);
            if (similarity > 0.90) {
              console.log(`[UniProt] Found match: ${result.primaryAccession} (${(similarity * 100).toFixed(1)}% similarity)`);
              return result;
            }
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('[UniProt] Search error:', error);
    return null;
  }
}

export async function fetchAlphaFoldDBStructure(uniprotId: string): Promise<AlphaFoldStructure | null> {
  if (UNIPROT_CACHE.has(uniprotId)) {
    console.log(`[AlphaFold DB] UniProt cache hit for ${uniprotId}`);
    return UNIPROT_CACHE.get(uniprotId)!;
  }
  
  try {
    console.log(`[AlphaFold DB] Fetching structure for ${uniprotId}...`);
    
    const apiUrl = `https://alphafold.ebi.ac.uk/api/prediction/${uniprotId}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LunaStack/4.2'
      },
      timeout: 20000
    } as any);
    
    if (!response.ok) {
      console.log(`[AlphaFold DB] No structure for ${uniprotId} (status: ${response.status})`);
      return null;
    }
    
    const predictions = await response.json() as AlphaFoldAPIResponse[];
    if (!predictions || predictions.length === 0) return null;
    
    const prediction = predictions[0];
    const modelVersion = `AlphaFold v${prediction.latestVersion || 2}`;
    console.log(`[AlphaFold DB] Found structure (${modelVersion})`);
    
    let pdbData = '';
    let cifData = '';
    
    if (prediction.cifUrl) {
      try {
        const cifResponse = await fetch(prediction.cifUrl, { timeout: 60000 } as any);
        if (cifResponse.ok) {
          cifData = await cifResponse.text();
          console.log(`[AlphaFold DB] Downloaded mmCIF: ${(cifData.length / 1024).toFixed(1)} KB`);
        }
      } catch (e) {
        console.log('[AlphaFold DB] CIF download failed, trying PDB...');
      }
    }
    
    if (prediction.pdbUrl) {
      try {
        const pdbResponse = await fetch(prediction.pdbUrl, { timeout: 60000 } as any);
        if (pdbResponse.ok) {
          pdbData = await pdbResponse.text();
          console.log(`[AlphaFold DB] Downloaded PDB: ${(pdbData.length / 1024).toFixed(1)} KB`);
        }
      } catch (e) {
        console.log('[AlphaFold DB] PDB download failed');
      }
    }
    
    if (!pdbData && !cifData) {
      console.log('[AlphaFold DB] Failed to download structure files');
      return null;
    }
    
    let plddtScores = extractPlddtScores(pdbData);
    if (plddtScores.length === 0 && cifData) {
      plddtScores = extractPlddtFromCIF(cifData);
    }
    
    const paeMatrix = await fetchPAEMatrix(uniprotId, prediction.paeDocUrl);
    
    const avgPlddt = plddtScores.length > 0 
      ? plddtScores.reduce((a, b) => a + b, 0) / plddtScores.length 
      : (prediction.globalMetricValue || 80);
    
    const result: AlphaFoldStructure = {
      source: 'alphafold_db',
      uniprotId,
      pdbData: pdbData,
      cifData: cifData || undefined,
      plddtScores,
      paeMatrix,
      confidenceScore: avgPlddt,
      modelVersion,
      sequenceMatch: 1.0,
    };
    
    UNIPROT_CACHE.set(uniprotId, result);
    return result;
    
  } catch (error) {
    console.error('[AlphaFold DB] Fetch error:', error);
    return null;
  }
}

function extractPlddtScores(pdbData: string): number[] {
  if (!pdbData || !pdbData.includes('ATOM')) return [];
  
  const plddtScores: number[] = [];
  const residueScores = new Map<number, number[]>();
  
  const lines = pdbData.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('ATOM')) {
      try {
        const resSeqStr = line.substring(22, 26).trim();
        const bFactorStr = line.substring(60, 66).trim();
        
        const resSeq = parseInt(resSeqStr);
        const bFactor = parseFloat(bFactorStr);
        
        if (!isNaN(resSeq) && !isNaN(bFactor) && bFactor >= 0 && bFactor <= 100) {
          if (!residueScores.has(resSeq)) {
            residueScores.set(resSeq, []);
          }
          residueScores.get(resSeq)!.push(bFactor);
        }
      } catch (e) {
      }
    }
  }
  
  const sortedResidues = Array.from(residueScores.keys()).sort((a, b) => a - b);
  for (const resSeq of sortedResidues) {
    const scores = residueScores.get(resSeq)!;
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    plddtScores.push(Math.round(avgScore * 10) / 10);
  }
  
  if (plddtScores.length > 0) {
    console.log(`[AlphaFold DB] Extracted ${plddtScores.length} pLDDT scores from PDB`);
  }
  return plddtScores;
}

function extractPlddtFromCIF(cifData: string): number[] {
  const residueScores = new Map<number, number[]>();
  const lines = cifData.split('\n');
  
  let inAtomSiteLoop = false;
  let readingHeaders = false;
  const columnMap = new Map<string, number>();
  let columnCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed === 'loop_') {
      inAtomSiteLoop = false;
      readingHeaders = false;
      columnMap.clear();
      columnCount = 0;
      continue;
    }
    
    if (trimmed.startsWith('_atom_site.')) {
      inAtomSiteLoop = true;
      readingHeaders = true;
      const field = trimmed.replace('_atom_site.', '').trim();
      columnMap.set(field, columnCount);
      columnCount++;
      continue;
    }
    
    if (inAtomSiteLoop && readingHeaders && !trimmed.startsWith('_')) {
      readingHeaders = false;
    }
    
    if (inAtomSiteLoop && !readingHeaders && trimmed.length > 0) {
      if (trimmed.startsWith('#') || trimmed.startsWith('loop_') || trimmed.startsWith('_')) {
        if (residueScores.size > 0) break;
        inAtomSiteLoop = false;
        columnMap.clear();
        columnCount = 0;
        continue;
      }
      
      if (trimmed.startsWith('ATOM') || trimmed.startsWith('HETATM')) {
        const bFactorIndex = columnMap.get('B_iso_or_equiv');
        const resSeqIndex = columnMap.get('label_seq_id');
        
        if (bFactorIndex !== undefined && resSeqIndex !== undefined) {
          const parts = trimmed.split(/\s+/);
          if (parts.length > Math.max(bFactorIndex, resSeqIndex)) {
            const resSeq = parseInt(parts[resSeqIndex]);
            const bFactor = parseFloat(parts[bFactorIndex]);
            
            if (!isNaN(resSeq) && !isNaN(bFactor) && bFactor >= 0 && bFactor <= 100) {
              if (!residueScores.has(resSeq)) {
                residueScores.set(resSeq, []);
              }
              residueScores.get(resSeq)!.push(bFactor);
            }
          }
        }
      }
    }
  }
  
  const plddtScores: number[] = [];
  const sortedResidues = Array.from(residueScores.keys()).sort((a, b) => a - b);
  for (const resSeq of sortedResidues) {
    const scores = residueScores.get(resSeq)!;
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    plddtScores.push(Math.round(avgScore * 10) / 10);
  }
  
  if (plddtScores.length > 0) {
    console.log(`[AlphaFold DB] Extracted ${plddtScores.length} pLDDT scores from mmCIF`);
  }
  return plddtScores;
}

async function fetchPAEMatrix(uniprotId: string, paeDocUrl?: string): Promise<number[][]> {
  if (paeDocUrl) {
    try {
      console.log(`[AlphaFold DB] Fetching PAE from API URL: ${paeDocUrl}`);
      const response = await fetch(paeDocUrl, { timeout: 30000 } as any);
      
      if (response.ok) {
        const data = await response.json() as any;
        const matrix = data[0]?.predicted_aligned_error || data.predicted_aligned_error;
        
        if (matrix && Array.isArray(matrix) && matrix.length > 0) {
          console.log(`[AlphaFold DB] Downloaded PAE matrix (${matrix.length}x${matrix[0]?.length || 0})`);
          return matrix;
        }
      }
    } catch (e) {
      console.log(`[AlphaFold DB] PAE fetch from API URL failed: ${e}`);
    }
  }
  
  const versions = ['v6', 'v5', 'v4', 'v3', 'v2'];
  
  for (const version of versions) {
    try {
      const paeUrl = `https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-predicted_aligned_error_${version}.json`;
      const response = await fetch(paeUrl, { timeout: 20000 } as any);
      
      if (response.ok) {
        const data = await response.json() as any;
        const matrix = data[0]?.predicted_aligned_error || data.predicted_aligned_error;
        
        if (matrix && Array.isArray(matrix) && matrix.length > 0) {
          console.log(`[AlphaFold DB] Downloaded PAE matrix ${version} (${matrix.length}x${matrix[0]?.length || 0})`);
          return matrix;
        }
      }
    } catch (e) {
    }
  }
  
  console.log('[AlphaFold DB] PAE matrix not available');
  return [];
}

async function searchAlphaFoldBySequence(sequence: string): Promise<AlphaFoldStructure | null> {
  try {
    console.log('[AlphaFold] Searching by sequence in AlphaFold DB...');
    
    const searchUrl = `https://www.ebi.ac.uk/proteins/api/proteins?offset=0&size=10&seqLength=${sequence.length}-${sequence.length}&sequence=${encodeURIComponent(sequence.substring(0, 100))}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LunaStack/4.2'
      },
      timeout: 15000
    } as any);
    
    if (response.ok) {
      const results = await response.json() as any[];
      for (const result of results) {
        if (result.sequence?.sequence === sequence) {
          const accession = result.accession;
          console.log(`[AlphaFold] Found exact match via EBI Proteins API: ${accession}`);
          return await fetchAlphaFoldDBStructure(accession);
        }
      }
    }
  } catch (e) {
    console.log('[AlphaFold] EBI Proteins API search failed, trying alternative...');
  }
  
  return null;
}

async function tryCommonProteins(sequence: string): Promise<{ accession: string; name: string; organism: string } | null> {
  const knownProteins = [
    { prefix: 'MENFQKVEKIGEGTYGVVYKA', accession: 'P24941', name: 'Cyclin-dependent kinase 2', organism: 'Homo sapiens' },
    { prefix: 'MVLSPADKTNVKAAWGKVGAH', accession: 'P69905', name: 'Hemoglobin subunit alpha', organism: 'Homo sapiens' },
    { prefix: 'MHSSIVLATVLFVAIASASKC', accession: 'P01308', name: 'Insulin', organism: 'Homo sapiens' },
    { prefix: 'MTEYKLVVVGAGGVGKSALTI', accession: 'P01116', name: 'GTPase KRas', organism: 'Homo sapiens' },
    { prefix: 'MVHLTPEEKSAVTALWGKVNV', accession: 'P68871', name: 'Hemoglobin subunit beta', organism: 'Homo sapiens' },
    { prefix: 'MEEPQSDPSVEPPLSQETFSD', accession: 'P04637', name: 'Cellular tumor antigen p53', organism: 'Homo sapiens' },
    { prefix: 'MGLSDGEWQLVLNVWGKVEAD', accession: 'P02144', name: 'Myoglobin', organism: 'Homo sapiens' },
  ];
  
  for (const protein of knownProteins) {
    if (sequence.startsWith(protein.prefix)) {
      console.log(`[AlphaFold] Matched known protein: ${protein.name} (${protein.accession})`);
      return protein;
    }
  }
  
  return null;
}

function isUniProtId(input: string): boolean {
  const uniprotPattern = /^[OPQ][0-9][A-Z0-9]{3}[0-9]$|^[A-NR-Z][0-9][A-Z][A-Z0-9]{2}[0-9]$|^[A-NR-Z][0-9][A-Z][A-Z0-9]{2}[0-9][A-Z][A-Z0-9]{2}[0-9]$/;
  return uniprotPattern.test(input.toUpperCase().trim());
}

async function fetchUniProtInfo(uniprotId: string): Promise<{ name: string; organism: string } | null> {
  try {
    const response = await fetch(`https://rest.uniprot.org/uniprotkb/${uniprotId}?format=json`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LunaFold/1.0'
      },
      timeout: 10000
    } as any);
    
    if (!response.ok) return null;
    
    const data = await response.json() as any;
    const name = data.proteinDescription?.recommendedName?.fullName?.value || 
                 data.proteinDescription?.submittedName?.[0]?.fullName?.value ||
                 data.uniProtkbId || uniprotId;
    const organism = data.organism?.scientificName || 'Unknown';
    
    return { name, organism };
  } catch (error) {
    console.error('[UniProt] Failed to fetch protein info:', error);
    return null;
  }
}

export async function getStructureForSequence(sequence: string): Promise<AlphaFoldStructure | { requiresAF3Upload: true; message: string }> {
  const trimmedInput = sequence.trim();
  
  if (isUniProtId(trimmedInput)) {
    console.log(`[LunaStack] Detected UniProt ID: ${trimmedInput}`);
    const structure = await fetchAlphaFoldDBStructure(trimmedInput.toUpperCase());
    if (structure) {
      const uniprotInfo = await fetchUniProtInfo(trimmedInput.toUpperCase());
      if (uniprotInfo) {
        structure.proteinName = uniprotInfo.name;
        structure.organism = uniprotInfo.organism;
      }
      return structure;
    }
    return {
      requiresAF3Upload: true,
      message: `No structure found for UniProt ID ${trimmedInput}. This protein may not be in the AlphaFold Database.`
    };
  }
  
  const cleanSequence = sequence.toUpperCase().replace(/[^ACDEFGHIKLMNPQRSTVWY]/g, '');
  
  if (cleanSequence.length < 10) {
    throw new Error('Sequence too short (minimum 10 residues)');
  }
  
  if (cleanSequence.length > 2700) {
    throw new Error('Sequence too long (maximum 2700 residues for AlphaFold DB)');
  }
  
  const seqHash = hashSequence(cleanSequence);
  
  if (STRUCTURE_CACHE.has(seqHash)) {
    console.log('[LunaStack] Cache hit - returning cached structure');
    return STRUCTURE_CACHE.get(seqHash)!;
  }
  
  console.log(`[LunaStack] Searching for structure (${cleanSequence.length} residues)...`);
  
  const knownProtein = await tryCommonProteins(cleanSequence);
  if (knownProtein) {
    const structure = await fetchAlphaFoldDBStructure(knownProtein.accession);
    if (structure) {
      structure.proteinName = knownProtein.name;
      structure.organism = knownProtein.organism;
      STRUCTURE_CACHE.set(seqHash, structure);
      return structure;
    }
  }
  
  const uniprotResult = await searchUniProt(cleanSequence);
  
  if (uniprotResult?.primaryAccession) {
    const proteinName = uniprotResult.proteinDescription?.recommendedName?.fullName?.value;
    const organism = uniprotResult.organism?.scientificName;
    
    console.log(`[LunaStack] Found UniProt match: ${uniprotResult.primaryAccession}`);
    if (proteinName) console.log(`[LunaStack] Protein: ${proteinName}`);
    if (organism) console.log(`[LunaStack] Organism: ${organism}`);
    
    const structure = await fetchAlphaFoldDBStructure(uniprotResult.primaryAccession);
    
    if (structure) {
      structure.proteinName = proteinName;
      structure.organism = organism;
      STRUCTURE_CACHE.set(seqHash, structure);
      return structure;
    }
  }
  
  const directSearch = await searchAlphaFoldBySequence(cleanSequence);
  if (directSearch) {
    STRUCTURE_CACHE.set(seqHash, directSearch);
    return directSearch;
  }
  
  return {
    requiresAF3Upload: true,
    message: `No pre-computed structure found in AlphaFold Database. For novel sequences, please use AlphaFold Server (alphafoldserver.com) to generate a prediction, then upload the results here.`
  };
}

export function parseUploadedAF3Results(
  pdbContent: string,
  confidenceJsonContent?: string
): AlphaFoldStructure {
  const plddtScores = extractPlddtScores(pdbContent);
  let paeMatrix: number[][] = [];
  let pTM: number | undefined;
  let ipTM: number | undefined;
  
  if (confidenceJsonContent) {
    try {
      const data = JSON.parse(confidenceJsonContent);
      
      paeMatrix = data.pae || 
                  data.predicted_aligned_error || 
                  data[0]?.predicted_aligned_error || 
                  [];
      
      pTM = data.ptm ?? data.pTM ?? data[0]?.ptm;
      ipTM = data.iptm ?? data.ipTM ?? data[0]?.iptm;
      
      console.log(`[AF3 Upload] Parsed confidence: pTM=${pTM?.toFixed(3)}, ipTM=${ipTM?.toFixed(3)}`);
    } catch (e) {
      console.log('[AF3 Upload] Could not parse confidence JSON, continuing with structure only');
    }
  }
  
  const avgPlddt = plddtScores.length > 0 
    ? plddtScores.reduce((a, b) => a + b, 0) / plddtScores.length 
    : 70;
  
  console.log(`[AF3 Upload] Processed structure: ${plddtScores.length} residues, avg pLDDT: ${avgPlddt.toFixed(1)}`);
  
  return {
    source: 'alphafold3_upload',
    pdbData: pdbContent,
    plddtScores,
    paeMatrix,
    pTM,
    ipTM,
    confidenceScore: avgPlddt,
    modelVersion: 'AlphaFold 3',
    sequenceMatch: 1.0
  };
}

export function extractSequenceFromPDB(pdbContent: string): string {
  const aa3to1: { [key: string]: string } = {
    'ALA': 'A', 'ARG': 'R', 'ASN': 'N', 'ASP': 'D', 'CYS': 'C',
    'GLN': 'Q', 'GLU': 'E', 'GLY': 'G', 'HIS': 'H', 'ILE': 'I',
    'LEU': 'L', 'LYS': 'K', 'MET': 'M', 'PHE': 'F', 'PRO': 'P',
    'SER': 'S', 'THR': 'T', 'TRP': 'W', 'TYR': 'Y', 'VAL': 'V'
  };
  
  const residues = new Map<number, string>();
  
  const lines = pdbContent.split('\n');
  for (const line of lines) {
    if (line.startsWith('ATOM') && line.substring(12, 16).trim() === 'CA') {
      const resName = line.substring(17, 20).trim();
      const resSeq = parseInt(line.substring(22, 26).trim());
      
      if (!isNaN(resSeq) && aa3to1[resName]) {
        residues.set(resSeq, aa3to1[resName]);
      }
    }
  }
  
  const sortedKeys = Array.from(residues.keys()).sort((a, b) => a - b);
  return sortedKeys.map(k => residues.get(k)!).join('');
}
