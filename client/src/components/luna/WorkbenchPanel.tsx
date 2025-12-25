import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, 
  Dna, 
  Beaker, 
  Pill, 
  Factory, 
  Lightbulb,
  TrendingUp,
  ArrowRightLeft,
  FlaskConical,
  Loader2,
  Sparkles,
  Zap
} from "lucide-react";
import type { Prediction } from "@shared/schema";
import BindingSitePanel from "./lab/BindingSitePanel";
import MutationScanner from "./lab/MutationScanner";
import DockingWorkbench from "./lab/DockingWorkbench";
import DrugScreening from "./lab/DrugScreening";
import SynthesisPanel from "./lab/SynthesisPanel";
import { useAIHypothesis, useCompareStructure } from "../../hooks/use-workbench";

interface WorkbenchPanelProps {
  prediction: Prediction | null;
  onResidueHighlight?: (residues: number[]) => void;
}

type WorkflowTab = "binding" | "mutations" | "docking" | "screening" | "synthesis" | "compare" | "hypothesis" | "priority";

interface SelectedBindingSite {
  volume: number;
  hydrophobicity: number;
  residues: number[];
}

const WORKFLOW_TABS: { id: WorkflowTab; label: string; icon: any; color: string }[] = [
  { id: "binding", label: "Binding Sites", icon: Target, color: "cyan" },
  { id: "mutations", label: "Mutations", icon: Dna, color: "purple" },
  { id: "docking", label: "Docking", icon: Beaker, color: "green" },
  { id: "screening", label: "ADMET", icon: Pill, color: "orange" },
  { id: "synthesis", label: "Synthesis", icon: Factory, color: "pink" },
  { id: "compare", label: "Compare", icon: ArrowRightLeft, color: "blue" },
  { id: "hypothesis", label: "AI Insights", icon: Lightbulb, color: "yellow" },
  { id: "priority", label: "Priority", icon: TrendingUp, color: "red" },
];

export default function WorkbenchPanel({ prediction, onResidueHighlight }: WorkbenchPanelProps) {
  const [activeTab, setActiveTab] = useState<WorkflowTab>("binding");
  const [selectedBindingSite, setSelectedBindingSite] = useState<SelectedBindingSite | null>(null);
  const [compareId, setCompareId] = useState("");
  
  const [priorityCompounds, setPriorityCompounds] = useState<any[]>([]);
  
  const { hypotheses, isLoading: hypothesisLoading, generate: generateHypothesis } = useAIHypothesis(prediction);
  const { comparison, isLoading: compareLoading, error: compareError, compare } = useCompareStructure(prediction?.uniprotId || "");

  const handleResidueHighlight = (residues: number[]) => {
    onResidueHighlight?.(residues);
  };

  const handleBindingSiteSelect = (site: { volume: number; hydrophobicity: number; residues: number[] } | null) => {
    setSelectedBindingSite(site);
  };

  if (!prediction) {
    return (
      <div className="p-6 rounded-xl text-center border border-cyan-500/20" style={{ backgroundColor: 'rgba(15, 30, 50, 0.8)' }}>
        <FlaskConical className="w-8 h-8 text-cyan-400/50 mx-auto mb-3" />
        <div className="text-gray-400 text-sm">
          Load a protein structure to access the research workbench
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-cyan-500/20" style={{ backgroundColor: 'rgba(15, 30, 50, 0.8)' }}>
      <div className="p-4 border-b border-cyan-500/20 bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-400" />
            <span className="font-display font-bold text-white">Research Workbench</span>
          </div>
          <span className="text-[10px] text-cyan-400/80 font-mono">
            {prediction.proteinName || prediction.uniprotId}
          </span>
        </div>
        
        <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar">
          {WORKFLOW_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-purple-500/20 border border-purple-500/40 text-white"
                  : "bg-white/5 border border-transparent text-white/60 hover:bg-white/10 hover:text-white"
              }`}
              data-testid={`workbench-tab-${tab.id}`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[500px] overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "binding" && (
            <motion.div
              key="binding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <BindingSitePanel 
                prediction={prediction} 
                onResidueHighlight={handleResidueHighlight}
                onBindingSiteSelect={handleBindingSiteSelect}
              />
            </motion.div>
          )}

          {activeTab === "mutations" && (
            <motion.div
              key="mutations"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <MutationScanner 
                prediction={prediction}
                onResidueHighlight={handleResidueHighlight}
              />
            </motion.div>
          )}

          {activeTab === "docking" && (
            <motion.div
              key="docking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <DockingWorkbench 
                prediction={prediction}
                bindingSite={selectedBindingSite || undefined}
              />
            </motion.div>
          )}

          {activeTab === "screening" && (
            <motion.div
              key="screening"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <DrugScreening />
            </motion.div>
          )}

          {activeTab === "synthesis" && (
            <motion.div
              key="synthesis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <SynthesisPanel 
                targetProtein={prediction.proteinName || prediction.uniprotId || undefined}
              />
            </motion.div>
          )}

          {activeTab === "compare" && (
            <motion.div
              key="compare"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 space-y-4"
            >
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">Structure Comparison</span>
                </div>
                <p className="text-xs text-white/60">
                  Compare with reference structures from AlphaFold DB
                </p>
              </div>
              
              <div className="space-y-2">
                <input
                  type="text"
                  value={compareId}
                  onChange={(e) => setCompareId(e.target.value)}
                  placeholder="Enter UniProt ID to compare (e.g., P00533)"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:border-blue-500/50 focus:outline-none"
                  data-testid="compare-input"
                />
                <button 
                  onClick={() => compare(compareId)}
                  disabled={!compareId || compareLoading}
                  className="w-full py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm hover:bg-blue-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {compareLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRightLeft className="w-4 h-4" />
                  )}
                  {compareLoading ? "Comparing..." : "Load & Compare"}
                </button>
              </div>
              
              {compareError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-xs text-red-400">{compareError}</p>
                </div>
              )}
              
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-white/50 mb-2">Comparison Metrics</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/60">RMSD</span>
                    <span className="text-white/80">{comparison?.rmsd ? `${comparison.rmsd.toFixed(2)} Å` : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">TM-score</span>
                    <span className="text-white/80">{comparison?.tmScore?.toFixed(3) || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Seq Identity</span>
                    <span className="text-white/80">{comparison?.seqIdentity ? `${(comparison.seqIdentity * 100).toFixed(1)}%` : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Coverage</span>
                    <span className="text-white/80">{comparison?.coverage ? `${(comparison.coverage * 100).toFixed(1)}%` : "—"}</span>
                  </div>
                </div>
              </div>
              
              {comparison?.differences && comparison.differences.length > 0 && (
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-white/50 mb-2">Key Differences</div>
                  <div className="space-y-1 text-xs text-white/70">
                    {comparison.differences.map((diff: string, i: number) => (
                      <div key={i}>• {diff}</div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "hypothesis" && (
            <motion.div
              key="hypothesis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 space-y-4"
            >
              <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">AI-Powered Research Insights</span>
                </div>
                <p className="text-xs text-white/60">
                  Generate research hypotheses based on structural analysis
                </p>
              </div>
              
              {hypotheses.length > 0 ? (
                <div className="space-y-2">
                  {hypotheses.map((hypothesis: string, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-white/80 leading-relaxed">{hypothesis}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-white/40">
                  Click below to generate AI-powered research insights
                </div>
              )}
              
              <button 
                onClick={() => generateHypothesis()}
                disabled={hypothesisLoading}
                className="w-full py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm hover:bg-yellow-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {hypothesisLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                {hypothesisLoading ? "Generating..." : hypotheses.length > 0 ? "Generate More Insights" : "Generate Insights"}
              </button>
            </motion.div>
          )}

          {activeTab === "priority" && (
            <motion.div
              key="priority"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar"
            >
              <div className="p-3 rounded-lg bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-white">Screening Priority Queue</span>
                </div>
                <p className="text-xs text-white/60">
                  Compounds are automatically ranked by combined binding affinity, ADMET profile, and novelty scores
                </p>
              </div>
              
              {priorityCompounds.length === 0 ? (
                <div className="text-center py-6 text-xs text-white/40">
                  <TrendingUp className="w-8 h-8 mx-auto mb-3 text-white/20" />
                  <p>Run docking simulations to populate the priority queue</p>
                  <p className="mt-1 text-white/30">Compounds will be ranked automatically</p>
                  <button 
                    onClick={() => {
                      setPriorityCompounds([
                        { rank: 1, name: "Ibuprofen", affinity: -8.2, drugLikeness: "excellent", score: 92 },
                        { rank: 2, name: "Caffeine", affinity: -7.5, drugLikeness: "good", score: 85 },
                        { rank: 3, name: "Aspirin", affinity: -6.8, drugLikeness: "excellent", score: 78 },
                        { rank: 4, name: "Salicylic Acid", affinity: -5.9, drugLikeness: "good", score: 72 },
                        { rank: 5, name: "Indole", affinity: -5.2, drugLikeness: "moderate", score: 65 },
                      ]);
                    }}
                    className="mt-4 py-2 px-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-xs hover:bg-red-500/30 transition-all"
                    data-testid="btn-demo-priority"
                  >
                    Load Demo Priority Queue
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-white/50 px-2">
                    <span>Rank</span>
                    <span>Compound</span>
                    <span>Affinity</span>
                    <span>Drug-likeness</span>
                    <span>Score</span>
                  </div>
                  {priorityCompounds.map((compound, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        compound.rank === 1 
                          ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30" 
                          : compound.rank <= 3 
                          ? "bg-green-500/10 border-green-500/20"
                          : "bg-white/5 border-white/10"
                      }`}
                      data-testid={`priority-compound-${i}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        compound.rank === 1 ? "bg-yellow-500 text-black" :
                        compound.rank === 2 ? "bg-gray-300 text-black" :
                        compound.rank === 3 ? "bg-orange-700 text-white" :
                        "bg-white/10 text-white/60"
                      }`}>
                        {compound.rank}
                      </div>
                      <div className="flex-1 px-3">
                        <span className="text-sm text-white font-medium">{compound.name}</span>
                      </div>
                      <div className="text-xs text-cyan-400 font-mono w-16 text-center">
                        {compound.affinity.toFixed(1)}
                      </div>
                      <div className={`text-xs w-20 text-center ${
                        compound.drugLikeness === "excellent" ? "text-green-400" :
                        compound.drugLikeness === "good" ? "text-cyan-400" :
                        compound.drugLikeness === "moderate" ? "text-yellow-400" :
                        "text-red-400"
                      }`}>
                        {compound.drugLikeness}
                      </div>
                      <div className="w-12 text-right">
                        <span className={`text-sm font-bold ${
                          compound.score >= 90 ? "text-green-400" :
                          compound.score >= 75 ? "text-cyan-400" :
                          compound.score >= 60 ? "text-yellow-400" :
                          "text-red-400"
                        }`}>
                          {compound.score}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  <button 
                    onClick={() => setPriorityCompounds([])}
                    className="w-full mt-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs hover:bg-white/10 transition-all"
                  >
                    Clear Queue
                  </button>
                </div>
              )}
              
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-xs font-mono text-white/40 uppercase mb-2">Scoring Formula</h4>
                <p className="text-[10px] text-white/50">
                  Priority Score = (Binding Affinity × 10) + (Drug-likeness × 25) + (Selectivity × 15) + Novelty Bonus
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
