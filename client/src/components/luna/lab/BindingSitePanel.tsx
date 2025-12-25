import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Target, 
  Crosshair, 
  AlertCircle,
  Sparkles,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Prediction } from "@shared/schema";

interface BindingSitePanelProps {
  prediction: Prediction;
  onResidueHighlight?: (residues: number[]) => void;
  onBindingSiteSelect?: (site: { volume: number; hydrophobicity: number; residues: number[] } | null) => void;
}

interface DetectedPocket {
  id: string;
  residues: number[];
  residueNames?: string[];
  volume: number;
  druggabilityScore: number;
  hydrophobicity: number;
  polarity?: number;
  chargedRatio?: number;
  aromaticRatio?: number;
  enclosure: number;
  center: { x: number; y: number; z: number };
  confidence?: number;
}

function getDruggabilityLabel(score: number): { label: string; color: string } {
  if (score >= 70) return { label: "Highly Druggable", color: "text-green-400" };
  if (score >= 50) return { label: "Moderately Druggable", color: "text-yellow-400" };
  if (score >= 30) return { label: "Challenging", color: "text-orange-400" };
  return { label: "Difficult", color: "text-red-400" };
}

export default function BindingSitePanel({ prediction, onResidueHighlight, onBindingSiteSelect }: BindingSitePanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pockets, setPockets] = useState<DetectedPocket[]>([]);
  const [selectedPocket, setSelectedPocket] = useState<string | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch("/api/lab/binding-sites/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          predictionId: prediction.id,
          cifData: prediction.cifData,
          pdbData: prediction.pdbData,
          plddtScores: prediction.plddtScores,
          sequence: prediction.sequence,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Analysis failed");
      }
      
      const data = await response.json();
      setPockets(data.pockets || []);
      setHasAnalyzed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPocket = (pocket: DetectedPocket) => {
    setSelectedPocket(pocket.id);
    onResidueHighlight?.(pocket.residues);
    onBindingSiteSelect?.({
      volume: pocket.volume,
      hydrophobicity: pocket.hydrophobicity,
      residues: pocket.residues,
    });
  };

  return (
    <div className="space-y-4 p-4" data-testid="binding-site-panel">
      <div className="p-4 rounded-xl border border-purple-500/20" style={{ backgroundColor: 'rgba(15, 30, 50, 0.8)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white">Binding Site Detection</h3>
            <p className="text-xs text-cyan-400/80">Identify druggable pockets using 3D coordinate analysis</p>
          </div>
        </div>

        {!hasAnalyzed ? (
          <div className="space-y-4">
            <div className="rounded-lg p-4 border border-cyan-500/10" style={{ backgroundColor: 'rgba(0, 200, 255, 0.05)' }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-cyan-400 mt-0.5" />
                <div className="text-sm text-gray-200">
                  <p className="mb-2">This algorithm analyzes 3D atomic coordinates to detect surface cavities and pockets suitable for small molecule binding.</p>
                  <p className="text-gray-400 text-xs">Uses geometric clustering of C-alpha atoms with distance-based contact analysis.</p>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
                {error}
              </div>
            )}
            
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!prediction.cifData && !prediction.pdbData)}
              className="w-full bg-purple-500 hover:bg-purple-600"
              data-testid="btn-analyze-pockets"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing 3D Structure...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Detect Binding Sites
                </>
              )}
            </Button>
            
            {!prediction.cifData && !prediction.pdbData && (
              <p className="text-xs text-yellow-400 text-center">
                No structure data available. Load a protein structure first.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-200">
                {pockets.length} pocket{pockets.length !== 1 ? "s" : ""} detected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAnalyze}
                className="text-xs"
                data-testid="btn-reanalyze"
              >
                Re-analyze
              </Button>
            </div>
            
            {pockets.length === 0 ? (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-yellow-400">No significant binding pockets detected</p>
                <p className="text-xs text-gray-400 mt-1">The structure may lack defined cavities or be highly disordered</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pockets.map((pocket, index) => {
                  const druggability = getDruggabilityLabel(pocket.druggabilityScore);
                  const isSelected = selectedPocket === pocket.id;
                  
                  return (
                    <motion.div
                      key={pocket.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                        isSelected 
                          ? "border-purple-500/50 bg-purple-500/10" 
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                      onClick={() => handleSelectPocket(pocket)}
                      data-testid={`pocket-${pocket.id}`}
                    >
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Crosshair className="w-4 h-4 text-purple-400" />
                            <span className="font-mono text-sm text-white">Pocket {index + 1}</span>
                          </div>
                          <span className={`text-xs font-medium ${druggability.color}`}>
                            {pocket.druggabilityScore.toFixed(0)}%
                          </span>
                        </div>
                        
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-primary"
                            style={{ width: `${pocket.druggabilityScore}%` }}
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 text-[10px]">
                          <div>
                            <div className="text-gray-400">Residues</div>
                            <div className="text-white font-mono">{pocket.residues.length}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Volume</div>
                            <div className="text-white font-mono">{pocket.volume.toFixed(0)}Å³</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Hydrophobic</div>
                            <div className="text-white font-mono">{(pocket.hydrophobicity * 100).toFixed(0)}%</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Confidence</div>
                            <div className="text-white font-mono">{(pocket.confidence || 70).toFixed(0)}%</div>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            className="mt-3 pt-3 border-t border-white/10"
                          >
                            <div className="grid grid-cols-3 gap-2 text-[10px] mb-3">
                              <div>
                                <div className="text-gray-400">Polarity</div>
                                <div className="text-white font-mono">{((pocket.polarity || 0) * 100).toFixed(0)}%</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Charged</div>
                                <div className="text-white font-mono">{((pocket.chargedRatio || 0) * 100).toFixed(0)}%</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Aromatic</div>
                                <div className="text-white font-mono">{((pocket.aromaticRatio || 0) * 100).toFixed(0)}%</div>
                              </div>
                            </div>
                            <div className="text-[10px] text-white/40 mb-1">Residue positions (click to highlight):</div>
                            <div className="flex flex-wrap gap-1">
                              {pocket.residues.slice(0, 15).map((r, i) => (
                                <button 
                                  key={r} 
                                  className="bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded text-[10px] font-mono hover:bg-purple-500/40 hover:text-purple-200 transition-colors cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onResidueHighlight?.([r]);
                                  }}
                                  data-testid={`residue-${r}`}
                                >
                                  {pocket.residueNames?.[i] || '?'}{r + 1}
                                </button>
                              ))}
                              {pocket.residues.length > 15 && (
                                <span className="text-white/40 text-[10px]">
                                  +{pocket.residues.length - 15} more
                                </span>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="luna-card p-4 rounded-xl">
        <h4 className="text-xs font-mono text-white/40 uppercase mb-3">Druggability Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-white/70">70-100%: Highly Druggable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="text-white/70">50-70%: Moderately Druggable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-400" />
            <span className="text-white/70">30-50%: Challenging Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-white/70">0-30%: Difficult Target</span>
          </div>
        </div>
      </div>
    </div>
  );
}
