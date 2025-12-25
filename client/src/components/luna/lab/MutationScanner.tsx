import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Dna, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown,
  Minus,
  AlertTriangle,
  Loader2,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Prediction } from "@shared/schema";

interface MutationScannerProps {
  prediction: Prediction;
  onResidueHighlight?: (residues: number[]) => void;
}

interface MutationResult {
  position: number;
  wildType: string;
  mutant: string;
  ddG: number;
  stabilityImpact: "stabilizing" | "neutral" | "destabilizing" | "highly_destabilizing";
  functionalImpact: "benign" | "possibly_damaging" | "probably_damaging";
  confidence: number;
}

const AMINO_ACIDS = ['A', 'R', 'N', 'D', 'C', 'E', 'Q', 'G', 'H', 'I', 'L', 'K', 'M', 'F', 'P', 'S', 'T', 'W', 'Y', 'V'];

const AA_NAMES: Record<string, string> = {
  'A': 'Ala', 'R': 'Arg', 'N': 'Asn', 'D': 'Asp', 'C': 'Cys',
  'E': 'Glu', 'Q': 'Gln', 'G': 'Gly', 'H': 'His', 'I': 'Ile',
  'L': 'Leu', 'K': 'Lys', 'M': 'Met', 'F': 'Phe', 'P': 'Pro',
  'S': 'Ser', 'T': 'Thr', 'W': 'Trp', 'Y': 'Tyr', 'V': 'Val'
};

function getImpactColor(impact: MutationResult["stabilityImpact"]) {
  switch (impact) {
    case "stabilizing": return "text-green-400";
    case "neutral": return "text-white/60";
    case "destabilizing": return "text-orange-400";
    case "highly_destabilizing": return "text-red-400";
  }
}

function getImpactIcon(impact: MutationResult["stabilityImpact"]) {
  switch (impact) {
    case "stabilizing": return TrendingUp;
    case "neutral": return Minus;
    case "destabilizing": return TrendingDown;
    case "highly_destabilizing": return AlertTriangle;
  }
}

export default function MutationScanner({ prediction, onResidueHighlight }: MutationScannerProps) {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [selectedMutant, setSelectedMutant] = useState<string | null>(null);
  const [results, setResults] = useState<MutationResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanMode, setScanMode] = useState<"single" | "hotspot">("single");
  const [error, setError] = useState<string | null>(null);
  
  const sequence = prediction.sequence || "";
  const plddtScores = prediction.plddtScores || [];

  const analyzeMutation = async (position: number, wildType: string, mutant: string, plddt: number): Promise<MutationResult> => {
    const response = await fetch("/api/lab/mutations/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        predictionId: prediction.id,
        position,
        wildType,
        mutant,
        plddtScore: plddt,
        sequence,
        isInPocket: false,
        isBuried: plddt >= 80,
      }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Analysis failed");
    }
    
    const data = await response.json();
    return {
      position,
      wildType,
      mutant,
      ddG: data.ddG,
      stabilityImpact: data.stabilityImpact,
      functionalImpact: data.functionalImpact,
      confidence: data.confidence,
    };
  };

  const handleSingleMutation = async () => {
    if (selectedPosition === null || !selectedMutant) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const wildType = sequence[selectedPosition];
      const plddt = plddtScores[selectedPosition] || 70;
      
      const result = await analyzeMutation(selectedPosition, wildType, selectedMutant, plddt);
      setResults(prev => [...prev, result]);
      onResidueHighlight?.([selectedPosition]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHotspotScan = async () => {
    setIsAnalyzing(true);
    setResults([]);
    setError(null);
    
    try {
      const keyPositions = plddtScores
        .map((score, i) => ({ score, index: i }))
        .filter(p => p.score >= 80)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      
      const hotspots: MutationResult[] = [];
      
      for (const pos of keyPositions) {
        const wildType = sequence[pos.index];
        const conservativeMutants = getConservativeMutations(wildType);
        
        if (conservativeMutants.length > 0) {
          const mutant = conservativeMutants[0];
          try {
            const result = await analyzeMutation(pos.index, wildType, mutant, pos.score);
            hotspots.push(result);
          } catch (e) {
            console.error(`Failed to analyze position ${pos.index}:`, e);
          }
        }
      }
      
      setResults(hotspots.sort((a, b) => Math.abs(b.ddG) - Math.abs(a.ddG)));
      onResidueHighlight?.(hotspots.map(h => h.position));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hotspot scan failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConservativeMutations = (aa: string): string[] => {
    const groups: Record<string, string[]> = {
      'A': ['G', 'V', 'S'],
      'R': ['K', 'H', 'Q'],
      'N': ['D', 'Q', 'S'],
      'D': ['E', 'N'],
      'C': ['S', 'A'],
      'E': ['D', 'Q'],
      'Q': ['N', 'E', 'K'],
      'G': ['A', 'S'],
      'H': ['R', 'K', 'N'],
      'I': ['L', 'V', 'M'],
      'L': ['I', 'V', 'M'],
      'K': ['R', 'Q'],
      'M': ['L', 'I', 'V'],
      'F': ['Y', 'W', 'L'],
      'P': ['A'],
      'S': ['T', 'A', 'N'],
      'T': ['S', 'V', 'A'],
      'W': ['F', 'Y'],
      'Y': ['F', 'W', 'H'],
      'V': ['I', 'L', 'A'],
    };
    return groups[aa] || [];
  };

  return (
    <div className="space-y-4 p-4" data-testid="mutation-scanner">
      <div className="p-4 rounded-xl border border-green-500/20" style={{ backgroundColor: 'rgba(15, 30, 50, 0.8)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Dna className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white">Mutation Scanner</h3>
            <p className="text-xs text-cyan-400/80">BLOSUM62-based ΔΔG stability predictions</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setScanMode("single")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all ${
              scanMode === "single"
                ? "bg-green-500/20 border border-green-500/40 text-green-400"
                : "bg-white/5 border border-transparent text-white/60 hover:bg-white/10"
            }`}
            data-testid="btn-single-mode"
          >
            Single Mutation
          </button>
          <button
            onClick={() => setScanMode("hotspot")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all ${
              scanMode === "hotspot"
                ? "bg-green-500/20 border border-green-500/40 text-green-400"
                : "bg-white/5 border border-transparent text-white/60 hover:bg-white/10"
            }`}
            data-testid="btn-hotspot-mode"
          >
            Hotspot Scan
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400 mb-4">
            {error}
          </div>
        )}

        {scanMode === "single" ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-300 block mb-2">Position (1-{sequence.length})</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={sequence.length}
                  value={selectedPosition !== null ? selectedPosition + 1 : ""}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) - 1;
                    if (val >= 0 && val < sequence.length) {
                      setSelectedPosition(val);
                    }
                  }}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-primary focus:outline-none"
                  placeholder="Enter position"
                  data-testid="input-position"
                />
                {selectedPosition !== null && (
                  <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 font-mono text-primary">
                    {sequence[selectedPosition]} ({AA_NAMES[sequence[selectedPosition]]})
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-2">Mutate to</label>
              <div className="grid grid-cols-5 gap-1">
                {AMINO_ACIDS.filter(aa => selectedPosition === null || aa !== sequence[selectedPosition]).map(aa => (
                  <button
                    key={aa}
                    onClick={() => setSelectedMutant(aa)}
                    className={`py-2 rounded text-sm font-mono transition-all ${
                      selectedMutant === aa
                        ? "bg-green-500 text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                    data-testid={`btn-aa-${aa}`}
                  >
                    {aa}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSingleMutation}
              disabled={isAnalyzing || selectedPosition === null || !selectedMutant}
              className="w-full bg-green-500 hover:bg-green-600"
              data-testid="btn-predict-mutation"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Computing ΔΔG...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Predict Effect
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-sm text-white/70">
                Hotspot scan identifies key high-confidence positions and predicts the impact of conservative mutations using BLOSUM62 matrix scoring.
              </p>
              <p className="text-xs text-white/40 mt-2">
                Analyzes top 10 high-confidence residues (pLDDT ≥ 80)
              </p>
            </div>
            
            <Button
              onClick={handleHotspotScan}
              disabled={isAnalyzing}
              className="w-full bg-green-500 hover:bg-green-600"
              data-testid="btn-hotspot-scan"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scanning Hotspots...
                </>
              ) : (
                <>
                  <Dna className="w-4 h-4 mr-2" />
                  Run Hotspot Scan
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-white">Results ({results.length})</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setResults([])}
              className="text-xs text-white/50"
            >
              Clear
            </Button>
          </div>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {results.map((result, i) => {
              const ImpactIcon = getImpactIcon(result.stabilityImpact);
              
              return (
                <motion.div
                  key={`${result.position}-${result.mutant}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-primary">
                        {result.wildType}{result.position + 1}{result.mutant}
                      </span>
                      <ArrowRight className="w-3 h-3 text-white/30" />
                      <span className={`text-sm ${getImpactColor(result.stabilityImpact)}`}>
                        {result.stabilityImpact.replace("_", " ")}
                      </span>
                    </div>
                    <ImpactIcon className={`w-4 h-4 ${getImpactColor(result.stabilityImpact)}`} />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div>
                      <div className="text-white/40">ΔΔG</div>
                      <div className={`font-mono ${result.ddG > 0 ? 'text-red-400' : result.ddG < 0 ? 'text-green-400' : 'text-white/60'}`}>
                        {result.ddG > 0 ? '+' : ''}{result.ddG.toFixed(2)} kcal/mol
                      </div>
                    </div>
                    <div>
                      <div className="text-white/40">Function</div>
                      <div className={`${
                        result.functionalImpact === 'benign' ? 'text-green-400' :
                        result.functionalImpact === 'possibly_damaging' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {result.functionalImpact.replace("_", " ")}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/40">Confidence</div>
                      <div className="text-white font-mono">{result.confidence.toFixed(0)}%</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      <div className="glass-card p-4 rounded-xl">
        <h4 className="text-xs font-mono text-white/40 uppercase mb-3">About ΔΔG Predictions</h4>
        <p className="text-xs text-white/60">
          Predictions use BLOSUM62 substitution matrix scores combined with structural context (pLDDT confidence, residue burial). 
          Positive ΔΔG values indicate destabilization; negative values indicate stabilization.
        </p>
      </div>
    </div>
  );
}
