import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  FileText, 
  Database,
  Search,
  Dna,
  FlaskConical,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PredictionWithAnalysis, SequenceAnalysis } from "@/hooks/use-predictions";

interface ResearchToolsPanelProps {
  prediction: PredictionWithAnalysis;
  analysis?: SequenceAnalysis | null;
}

export default function ResearchToolsPanel({ prediction, analysis }: ResearchToolsPanelProps) {
  const [copiedFasta, setCopiedFasta] = useState(false);
  const [copiedSequence, setCopiedSequence] = useState(false);

  const sequence = prediction.sequence || '';
  const uniprotId = prediction.uniprotId || '';
  const proteinName = prediction.proteinName || 'Unknown Protein';
  const organism = prediction.organism || '';

  const fastaSequence = useMemo(() => {
    const header = `>${proteinName}${organism ? ` [${organism}]` : ''}${uniprotId ? ` | UniProt: ${uniprotId}` : ''}`;
    const formattedSeq = sequence.match(/.{1,60}/g)?.join('\n') || sequence;
    return `${header}\n${formattedSeq}`;
  }, [sequence, proteinName, organism, uniprotId]);

  const qualityMetrics = useMemo(() => {
    const plddtScores = prediction.plddtScores || [];
    if (plddtScores.length === 0) return null;

    const avgPlddt = plddtScores.reduce((a, b) => a + b, 0) / plddtScores.length;
    const veryHigh = plddtScores.filter(s => s >= 90).length;
    const high = plddtScores.filter(s => s >= 70 && s < 90).length;
    const low = plddtScores.filter(s => s >= 50 && s < 70).length;
    const veryLow = plddtScores.filter(s => s < 50).length;
    const minPlddt = Math.min(...plddtScores);
    const maxPlddt = Math.max(...plddtScores);

    return {
      avgPlddt,
      veryHigh,
      high,
      low,
      veryLow,
      minPlddt,
      maxPlddt,
      total: plddtScores.length
    };
  }, [prediction.plddtScores]);

  const handleCopyFasta = async () => {
    await navigator.clipboard.writeText(fastaSequence);
    setCopiedFasta(true);
    setTimeout(() => setCopiedFasta(false), 2000);
  };

  const handleCopySequence = async () => {
    await navigator.clipboard.writeText(sequence);
    setCopiedSequence(true);
    setTimeout(() => setCopiedSequence(false), 2000);
  };

  const handleDownloadFasta = () => {
    const blob = new Blob([fastaSequence], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${uniprotId || 'protein'}_sequence.fasta`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openBlast = () => {
    const blastUrl = `https://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins&PROGRAM=blastp&BLAST_PROGRAMS=blastp&QUERY=${encodeURIComponent(sequence)}&LINK_LOC=blasttab&PAGE_TYPE=BlastSearch`;
    window.open(blastUrl, '_blank');
  };

  const openUniProt = () => {
    if (uniprotId) {
      window.open(`https://www.uniprot.org/uniprotkb/${uniprotId}`, '_blank');
    }
  };

  const openAlphaFoldDB = () => {
    if (uniprotId) {
      window.open(`https://alphafold.ebi.ac.uk/entry/${uniprotId}`, '_blank');
    }
  };

  const openPDBSearch = () => {
    const searchQuery = uniprotId || proteinName;
    window.open(`https://www.rcsb.org/search?request=%7B%22query%22%3A%7B%22type%22%3A%22terminal%22%2C%22service%22%3A%22full_text%22%2C%22parameters%22%3A%7B%22value%22%3A%22${encodeURIComponent(searchQuery)}%22%7D%7D%2C%22return_type%22%3A%22entry%22%7D`, '_blank');
  };

  const openInterPro = () => {
    if (uniprotId) {
      window.open(`https://www.ebi.ac.uk/interpro/protein/UniProt/${uniprotId}/`, '_blank');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="p-4 border-b border-white/10">
        <h3 className="text-sm font-display font-semibold text-white flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-primary" />
          Research Tools
        </h3>
        <p className="text-xs text-white/50 mt-1">Export, search, and analyze</p>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-white/70 mb-2 flex items-center gap-1.5">
            <Dna className="w-3.5 h-3.5" />
            Sequence Export
          </h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySequence}
              className="text-xs gap-1.5 bg-white/5 border-white/10 hover:bg-white/10"
              data-testid="btn-copy-sequence"
            >
              {copiedSequence ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Sequence
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyFasta}
              className="text-xs gap-1.5 bg-white/5 border-white/10 hover:bg-white/10"
              data-testid="btn-copy-fasta"
            >
              {copiedFasta ? <Check className="w-3.5 h-3.5 text-green-400" /> : <FileText className="w-3.5 h-3.5" />}
              Copy FASTA
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadFasta}
              className="text-xs gap-1.5 bg-white/5 border-white/10 hover:bg-white/10"
              data-testid="btn-download-fasta"
            >
              <Download className="w-3.5 h-3.5" />
              Download FASTA
            </Button>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white/70 mb-2 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" />
            Sequence Search
          </h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={openBlast}
              className="text-xs gap-1.5 bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary"
              data-testid="btn-blast-search"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              NCBI BLAST
            </Button>
          </div>
          <p className="text-[10px] text-white/40 mt-1.5">
            Search for similar sequences in NCBI's protein database
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white/70 mb-2 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" />
            External Databases
          </h4>
          <div className="flex flex-wrap gap-2">
            {uniprotId && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openUniProt}
                  className="text-xs gap-1.5 bg-white/5 border-white/10 hover:bg-white/10"
                  data-testid="btn-uniprot"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  UniProt
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openAlphaFoldDB}
                  className="text-xs gap-1.5 bg-white/5 border-white/10 hover:bg-white/10"
                  data-testid="btn-alphafold-db"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  AlphaFold DB
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openInterPro}
                  className="text-xs gap-1.5 bg-white/5 border-white/10 hover:bg-white/10"
                  data-testid="btn-interpro"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  InterPro
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={openPDBSearch}
              className="text-xs gap-1.5 bg-white/5 border-white/10 hover:bg-white/10"
              data-testid="btn-pdb-search"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              PDB Search
            </Button>
          </div>
        </div>

        {qualityMetrics && (
          <div>
            <h4 className="text-xs font-semibold text-white/70 mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Structure Quality Summary
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-black/20 rounded-lg p-2">
                <div className="text-white/50">Average pLDDT</div>
                <div className="text-lg font-mono font-bold text-primary">
                  {qualityMetrics.avgPlddt.toFixed(1)}
                </div>
              </div>
              <div className="bg-black/20 rounded-lg p-2">
                <div className="text-white/50">Range</div>
                <div className="text-lg font-mono font-bold text-white/80">
                  {qualityMetrics.minPlddt.toFixed(0)} - {qualityMetrics.maxPlddt.toFixed(0)}
                </div>
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-[10px]">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#0053d6' }} />
                <span className="text-white/60">Very High (≥90):</span>
                <span className="font-mono text-white">{qualityMetrics.veryHigh} ({((qualityMetrics.veryHigh / qualityMetrics.total) * 100).toFixed(0)}%)</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#65cbf3' }} />
                <span className="text-white/60">High (70-90):</span>
                <span className="font-mono text-white">{qualityMetrics.high} ({((qualityMetrics.high / qualityMetrics.total) * 100).toFixed(0)}%)</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ffdb13' }} />
                <span className="text-white/60">Low (50-70):</span>
                <span className="font-mono text-white">{qualityMetrics.low} ({((qualityMetrics.low / qualityMetrics.total) * 100).toFixed(0)}%)</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ff7d45' }} />
                <span className="text-white/60">Very Low (&lt;50):</span>
                <span className="font-mono text-white">{qualityMetrics.veryLow} ({((qualityMetrics.veryLow / qualityMetrics.total) * 100).toFixed(0)}%)</span>
              </div>
            </div>
          </div>
        )}

        {analysis?.predictedProperties && (
          <div>
            <h4 className="text-xs font-semibold text-white/70 mb-2 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5" />
              Biochemical Properties
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-black/20 rounded p-2">
                <div className="text-white/50">Molecular Weight</div>
                <div className="font-mono text-white">
                  {(analysis.predictedProperties.molecularWeight / 1000).toFixed(2)} kDa
                </div>
              </div>
              <div className="bg-black/20 rounded p-2">
                <div className="text-white/50">Isoelectric Point</div>
                <div className="font-mono text-white">
                  pH {analysis.predictedProperties.isoelectricPoint.toFixed(1)}
                </div>
              </div>
              <div className="bg-black/20 rounded p-2">
                <div className="text-white/50">GRAVY (Hydropathy)</div>
                <div className="font-mono text-white">
                  {analysis.predictedProperties.hydrophobicity.toFixed(3)}
                </div>
              </div>
              <div className="bg-black/20 rounded p-2">
                <div className="text-white/50">Instability Index</div>
                <div className="font-mono text-white">
                  {analysis.predictedProperties.instabilityIndex.toFixed(1)}
                  <span className="ml-1 text-white/40">
                    ({analysis.predictedProperties.instabilityIndex < 40 ? 'Stable' : 'Unstable'})
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[9px] text-white/30 mt-2">
              MW formula: Σ(AA weights) - (n-1)×18.015 Da | Instability: DIWV matrix (Guruprasad 1990) | Hydrophobicity: Kyte-Doolittle scale
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
