import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Pill, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Calculator,
  Plus,
  Trash2,
  Download,
  Loader2,
  Activity,
  Brain,
  Droplets,
  Zap,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ADMETProfile {
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

interface DrugCandidate {
  id: string;
  name: string;
  smiles: string;
  properties: {
    mw: number;
    logP: number;
    hbd: number;
    hba: number;
    rotBonds: number;
    tpsa: number;
    rings: number;
    aromaticRings: number;
    heavyAtoms: number;
  };
  admet: ADMETProfile;
  drugLikeness: "excellent" | "good" | "moderate" | "poor";
  lipinskiViolations: number;
  veberCompliant: boolean;
  leadLike: boolean;
}

const SAMPLE_COMPOUNDS = [
  { id: "1", name: "Ibuprofen", smiles: "CC(C)Cc1ccc(C(C)C(=O)O)cc1" },
  { id: "2", name: "Caffeine", smiles: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C" },
  { id: "3", name: "Aspirin", smiles: "CC(=O)Oc1ccccc1C(=O)O" },
  { id: "4", name: "Salicylic Acid", smiles: "OC(=O)c1ccccc1O" },
  { id: "5", name: "Indole", smiles: "c1ccc2[nH]ccc2c1" },
];

export default function DrugScreening() {
  const [candidates, setCandidates] = useState<DrugCandidate[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customSmiles, setCustomSmiles] = useState("");
  const [customName, setCustomName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"overview" | "admet">("overview");

  const analyzeCompound = async (smiles: string, name: string, id: string): Promise<DrugCandidate | null> => {
    try {
      const response = await fetch("/api/lab/admet/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smiles, name }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Analysis failed");
      }
      
      const data = await response.json();
      return { ...data, id };
    } catch (err) {
      console.error("Failed to analyze compound:", err);
      return null;
    }
  };

  const handleAnalyzeSamples = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const results: DrugCandidate[] = [];
      
      for (const compound of SAMPLE_COMPOUNDS) {
        const result = await analyzeCompound(compound.smiles, compound.name, compound.id);
        if (result) {
          results.push(result);
        }
      }
      
      if (results.length === 0) {
        throw new Error("Failed to analyze any compounds");
      }
      
      setCandidates(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddCustom = async () => {
    if (!customSmiles.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzeCompound(
        customSmiles, 
        customName || `Custom ${candidates.length + 1}`,
        `custom_${Date.now()}`
      );
      
      if (!result) {
        throw new Error("Could not analyze compound - check SMILES notation");
      }
      
      setCandidates(prev => [...prev, result]);
      setCustomSmiles("");
      setCustomName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemove = (id: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
  };

  const getDrugLikenessColor = (dl: DrugCandidate["drugLikeness"]) => {
    switch (dl) {
      case "excellent": return "text-green-400";
      case "good": return "text-primary";
      case "moderate": return "text-yellow-400";
      case "poor": return "text-red-400";
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "high" || status === "stable" || status === "good" || status === "normal" || status === "low") {
      return <CheckCircle className="w-3 h-3 text-green-400" />;
    }
    if (status === "moderate") {
      return <AlertTriangle className="w-3 h-3 text-yellow-400" />;
    }
    return <XCircle className="w-3 h-3 text-red-400" />;
  };

  const excellentCount = candidates.filter(c => c.drugLikeness === "excellent").length;
  const goodCount = candidates.filter(c => c.drugLikeness === "good").length;

  return (
    <div className="space-y-4 p-4" data-testid="drug-screening">
      <div className="p-4 rounded-xl border border-pink-500/20" style={{ backgroundColor: 'rgba(15, 30, 50, 0.8)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
            <Pill className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white">ADMET & Drug-Likeness Screening</h3>
            <p className="text-xs text-cyan-400/80">Evaluate pharmacokinetics and Lipinski's Rule of Five</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs text-gray-300 block mb-1">Compound Name (optional)</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Enter compound name"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
              data-testid="input-compound-name"
            />
          </div>
          <div>
            <label className="text-xs text-gray-300 block mb-1">SMILES String</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSmiles}
                onChange={(e) => setCustomSmiles(e.target.value)}
                placeholder="Enter SMILES notation (e.g., CC(=O)Oc1ccccc1C(=O)O)"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder:text-white/30 focus:border-primary focus:outline-none"
                data-testid="input-smiles"
              />
              <Button
                onClick={handleAddCustom}
                disabled={!customSmiles.trim() || isAnalyzing}
                size="sm"
                className="bg-pink-500 hover:bg-pink-600"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400 mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleAnalyzeSamples}
            disabled={isAnalyzing}
            variant="outline"
            className="flex-1 border-white/10"
            data-testid="btn-load-samples"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Load Sample Compounds
              </>
            )}
          </Button>
        </div>
      </div>

      {candidates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-medium text-white">Screening Results</h4>
              <p className="text-xs text-white/50">
                {excellentCount} excellent, {goodCount} good candidates
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 p-0.5 bg-white/5 rounded-lg">
                <button
                  onClick={() => setActiveView("overview")}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    activeView === "overview" 
                      ? "bg-pink-500/20 text-pink-300" 
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveView("admet")}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    activeView === "admet" 
                      ? "bg-pink-500/20 text-pink-300" 
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  ADMET
                </button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                data-testid="btn-export-results"
              >
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
            {candidates.map((candidate, i) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm text-white font-medium">{candidate.name}</span>
                    <span className={`ml-2 text-xs ${getDrugLikenessColor(candidate.drugLikeness)}`}>
                      {candidate.drugLikeness}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {candidate.veberCompliant && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-300">Veber</span>
                      )}
                      {candidate.leadLike && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">Lead-like</span>
                      )}
                    </div>
                    <span className="text-[10px] text-white/40">
                      {candidate.lipinskiViolations} violation{candidate.lipinskiViolations !== 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={() => handleRemove(candidate.id)}
                      className="text-white/30 hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {activeView === "overview" ? (
                  <>
                    <div className="grid grid-cols-4 gap-2 mb-3 text-[10px]">
                      <div className={candidate.properties.mw > 500 ? "text-red-400" : "text-white/60"}>
                        <div className="text-white/40">MW</div>
                        <div className="font-mono">{candidate.properties.mw.toFixed(1)}</div>
                      </div>
                      <div className={candidate.properties.logP > 5 ? "text-red-400" : "text-white/60"}>
                        <div className="text-white/40">LogP</div>
                        <div className="font-mono">{candidate.properties.logP.toFixed(2)}</div>
                      </div>
                      <div className={candidate.properties.hbd > 5 ? "text-red-400" : "text-white/60"}>
                        <div className="text-white/40">HBD</div>
                        <div className="font-mono">{candidate.properties.hbd}</div>
                      </div>
                      <div className={candidate.properties.hba > 10 ? "text-red-400" : "text-white/60"}>
                        <div className="text-white/40">HBA</div>
                        <div className="font-mono">{candidate.properties.hba}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-[10px]">
                      <div className={candidate.properties.rotBonds > 10 ? "text-red-400" : "text-white/60"}>
                        <div className="text-white/40">RotBonds</div>
                        <div className="font-mono">{candidate.properties.rotBonds}</div>
                      </div>
                      <div className={candidate.properties.tpsa > 140 ? "text-red-400" : "text-white/60"}>
                        <div className="text-white/40">TPSA</div>
                        <div className="font-mono">{candidate.properties.tpsa.toFixed(1)}</div>
                      </div>
                      <div className="text-white/60">
                        <div className="text-white/40">Rings</div>
                        <div className="font-mono">{candidate.properties.rings}</div>
                      </div>
                      <div className="text-white/60">
                        <div className="text-white/40">Aromatic</div>
                        <div className="font-mono">{candidate.properties.aromaticRings}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="flex items-center gap-2 p-1.5 rounded bg-white/5">
                        <Droplets className="w-3 h-3 text-blue-400" />
                        <div className="flex-1">
                          <div className="text-white/40">Absorption</div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(candidate.admet.absorption)}
                            <span className="text-white/80">{candidate.admet.absorption}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-1.5 rounded bg-white/5">
                        <Activity className="w-3 h-3 text-purple-400" />
                        <div className="flex-1">
                          <div className="text-white/40">Distribution</div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(candidate.admet.distribution)}
                            <span className="text-white/80">{candidate.admet.distribution}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-1.5 rounded bg-white/5">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        <div className="flex-1">
                          <div className="text-white/40">Metabolism</div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(candidate.admet.metabolism)}
                            <span className="text-white/80">{candidate.admet.metabolism}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-1.5 rounded bg-white/5">
                        <ShieldAlert className="w-3 h-3 text-red-400" />
                        <div className="flex-1">
                          <div className="text-white/40">Toxicity</div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(candidate.admet.toxicity)}
                            <span className="text-white/80">{candidate.admet.toxicity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                        candidate.admet.bbb_penetration 
                          ? "bg-green-500/20 text-green-300" 
                          : "bg-white/10 text-white/40"
                      }`}>
                        <Brain className="w-2.5 h-2.5 inline mr-0.5" />
                        BBB {candidate.admet.bbb_penetration ? "+" : "-"}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                        candidate.admet.pgp_substrate 
                          ? "bg-yellow-500/20 text-yellow-300" 
                          : "bg-white/10 text-white/40"
                      }`}>
                        P-gp {candidate.admet.pgp_substrate ? "Substrate" : "-"}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                        candidate.admet.cyp_inhibitor 
                          ? "bg-red-500/20 text-red-300" 
                          : "bg-white/10 text-white/40"
                      }`}>
                        CYP {candidate.admet.cyp_inhibitor ? "Inhibitor" : "-"}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                        candidate.admet.herg_risk === 'high' ? "bg-red-500/20 text-red-300" :
                        candidate.admet.herg_risk === 'moderate' ? "bg-yellow-500/20 text-yellow-300" :
                        "bg-green-500/20 text-green-300"
                      }`}>
                        hERG {candidate.admet.herg_risk}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="glass-card p-4 rounded-xl">
        <h4 className="text-xs font-mono text-white/40 uppercase mb-3">Lipinski's Rule of Five</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span className="text-white/70">MW ≤ 500 Da</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span className="text-white/70">LogP ≤ 5</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span className="text-white/70">HBD ≤ 5</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span className="text-white/70">HBA ≤ 10</span>
          </div>
        </div>
        <p className="text-[10px] text-white/30 mt-3">
          Compounds with 0-1 violations are generally considered drug-like. ADMET predictions use rule-based models for pharmacokinetic profiling.
        </p>
      </div>
    </div>
  );
}
