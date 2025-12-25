import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip, PieChart, Pie } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Layers, 
  Download, 
  FileText, 
  Share2, 
  ChevronDown,
  ChevronUp,
  Activity,
  Dna,
  Shield,
  Zap,
  Target,
  Info,
  ExternalLink
} from "lucide-react";
import type { Prediction } from "@shared/schema";

interface InsightColumnProps {
  prediction: Prediction | null;
  selectedResidue?: { index: number; aa: string; plddt: number } | null;
  onResidueSelect?: (index: number) => void;
}

const CONFIDENCE_TIERS = [
  { min: 90, max: 100, label: "Very High", color: "#0053d6", description: "Highly reliable backbone position" },
  { min: 70, max: 89, label: "Confident", color: "#65cbf3", description: "Good confidence, minor uncertainty" },
  { min: 50, max: 69, label: "Low", color: "#ffdb13", description: "May have positional errors" },
  { min: 0, max: 49, label: "Very Low", color: "#ff7d45", description: "Likely disordered or flexible" },
];

function getConfidenceTier(score: number) {
  return CONFIDENCE_TIERS.find(t => score >= t.min && score <= t.max) || CONFIDENCE_TIERS[3];
}

function ConfidenceGauge({ score }: { score: number }) {
  const tier = getConfidenceTier(score);
  const percentage = Math.min(100, Math.max(0, score));
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75;
  
  return (
    <div className="relative w-32 h-24 mx-auto">
      <svg viewBox="0 0 100 70" className="w-full h-full">
        <path
          d="M 10 60 A 45 45 0 0 1 90 60"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <motion.path
          d="M 10 60 A 45 45 0 0 1 90 60"
          fill="none"
          stroke={tier.color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference * 0.75}
          initial={{ strokeDashoffset: circumference * 0.75 }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <text x="50" y="55" textAnchor="middle" className="fill-white font-display text-xl font-bold">
          {score.toFixed(0)}
        </text>
        <text x="50" y="68" textAnchor="middle" className="fill-white/50 text-[8px] font-mono uppercase">
          {tier.label}
        </text>
      </svg>
    </div>
  );
}

function KPICard({ 
  label, 
  value, 
  subValue, 
  icon: Icon, 
  color = "primary",
  tooltip 
}: { 
  label: string; 
  value: string | number; 
  subValue?: string; 
  icon: any; 
  color?: string;
  tooltip?: string;
}) {
  const colorClasses: Record<string, string> = {
    primary: "text-primary bg-primary/10 border-primary/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };
  
  return (
    <div className="glass-card p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors group relative">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-[10px] text-white/40 font-mono uppercase tracking-wide">{label}</span>
        {tooltip && (
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            <Info className="w-3 h-3 text-white/30" />
          </div>
        )}
      </div>
      <div className="text-xl font-display font-bold text-white">{value}</div>
      {subValue && <div className="text-[10px] text-white/40 mt-0.5">{subValue}</div>}
    </div>
  );
}

function DistributionChart({ plddtScores }: { plddtScores: number[] }) {
  const distribution = CONFIDENCE_TIERS.map(tier => {
    const count = plddtScores.filter(s => s >= tier.min && s <= tier.max).length;
    const percentage = plddtScores.length > 0 ? (count / plddtScores.length) * 100 : 0;
    return {
      name: tier.label,
      count,
      percentage,
      color: tier.color,
      range: `${tier.min}-${tier.max}`,
    };
  }).reverse();

  return (
    <div className="space-y-2">
      {distribution.map((tier, i) => (
        <div key={tier.name} className="group">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: tier.color }}
              />
              <span className="text-xs text-white/60">{tier.name}</span>
              <span className="text-[10px] text-white/30 font-mono">({tier.range})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/80 font-mono">{tier.count}</span>
              <span className="text-[10px] text-white/40">({tier.percentage.toFixed(1)}%)</span>
            </div>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: tier.color }}
              initial={{ width: 0 }}
              animate={{ width: `${tier.percentage}%` }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DomainBreakdown({ plddtScores }: { plddtScores: number[] }) {
  if (plddtScores.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="text-xs text-white/40">No confidence data available</div>
      </div>
    );
  }
  
  const numSegments = Math.min(5, Math.max(1, plddtScores.length));
  const segmentSize = Math.ceil(plddtScores.length / numSegments);
  const segments = [];
  
  for (let i = 0; i < numSegments; i++) {
    const start = i * segmentSize;
    const end = Math.min(start + segmentSize, plddtScores.length);
    if (start >= plddtScores.length) break;
    
    const segmentScores = plddtScores.slice(start, end);
    if (segmentScores.length === 0) continue;
    
    const avgScore = segmentScores.reduce((a, b) => a + b, 0) / segmentScores.length;
    const tier = getConfidenceTier(avgScore);
    
    segments.push({
      region: `${start + 1}-${end}`,
      avgScore,
      tier,
      length: end - start,
    });
  }
  
  if (segments.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="text-xs text-white/40">Insufficient data for domain map</div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-0.5 h-6 rounded-lg overflow-hidden">
        {segments.map((seg, i) => (
          <motion.div
            key={i}
            className="h-full relative group cursor-pointer"
            style={{ 
              backgroundColor: seg.tier.color,
              width: `${(seg.length / plddtScores.length) * 100}%`,
              minWidth: '20px'
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            whileHover={{ opacity: 0.8 }}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <div className="bg-gray-900 border border-white/10 rounded-lg p-2 text-[10px] whitespace-nowrap">
                <div className="font-mono text-white">Region {seg.region}</div>
                <div className="text-white/60">Avg: {seg.avgScore.toFixed(1)} pLDDT</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-white/30 font-mono">
        <span>N-term</span>
        <span>C-term</span>
      </div>
    </div>
  );
}

export default function InsightColumn({ prediction, selectedResidue, onResidueSelect }: InsightColumnProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("distribution");
  
  if (!prediction) return null;

  const plddtScores = prediction.plddtScores || [];
  const avgConfidence = prediction.confidenceScore || (plddtScores.length > 0 
    ? plddtScores.reduce((a, b) => a + b, 0) / plddtScores.length 
    : 0);
  const sequenceLength = prediction.sequence?.length || plddtScores.length || 0;
  const pTM = prediction.pTM || null;
  const ipTM = prediction.ipTM || null;
  
  const disorderedResidues = plddtScores.filter(s => s < 50).length;
  const highConfidenceResidues = plddtScores.filter(s => s >= 90).length;
  const hasScoreData = plddtScores.length > 0;
  
  const estimatedPTM = pTM || (avgConfidence > 0 ? Math.min(0.95, avgConfidence / 100 * 1.1) : null);
  const estimatedRMSD = avgConfidence > 0 ? Math.max(0.5, (100 - avgConfidence) / 20) : null;
  
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleDownloadPDB = () => {
    if (!prediction.pdbData) return;
    const blob = new Blob([prediction.pdbData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lunafold_${prediction.id || "structure"}.pdb`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadFASTA = () => {
    if (!prediction.sequence) return;
    const header = `>LunaFold_${prediction.id || "sequence"}|${prediction.proteinName || "Unknown"}|${prediction.organism || ""}`;
    const wrappedSeq = prediction.sequence.match(/.{1,60}/g)?.join("\n") || prediction.sequence;
    const fasta = `${header}\n${wrappedSeq}`;
    const blob = new Blob([fasta], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lunafold_${prediction.id || "sequence"}.fasta`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4" data-testid="insight-column">
      {prediction.proteinName && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-3 rounded-xl border border-primary/20"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-display font-semibold text-white leading-tight">
                {prediction.proteinName}
              </h3>
              {prediction.organism && (
                <p className="text-[10px] text-white/50 mt-0.5 italic">{prediction.organism}</p>
              )}
            </div>
            {prediction.uniprotId && (
              <a
                href={`https://www.uniprot.org/uniprotkb/${prediction.uniprotId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-primary/70 hover:text-primary flex items-center gap-1"
              >
                {prediction.uniprotId}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </motion.div>
      )}

      {selectedResidue && (
        <motion.div
          key={`residue-${selectedResidue.index}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-3 rounded-xl border border-purple-500/30 bg-purple-500/5"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="text-[10px] text-white/40 font-mono uppercase">Selected Residue</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="text-[10px] text-white/40">Position</div>
              <div className="text-lg font-display font-bold text-white">{selectedResidue.index + 1}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/40">Amino Acid</div>
              <div className="text-lg font-display font-bold text-purple-400">{selectedResidue.aa}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/40">pLDDT</div>
              <div className={`text-lg font-display font-bold ${
                selectedResidue.plddt >= 90 ? 'text-blue-400' :
                selectedResidue.plddt >= 70 ? 'text-cyan-400' :
                selectedResidue.plddt >= 50 ? 'text-yellow-400' : 'text-orange-400'
              }`}>
                {selectedResidue.plddt.toFixed(1)}
              </div>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-white/50">
            {getConfidenceTier(selectedResidue.plddt).description}
          </div>
        </motion.div>
      )}

      {hasScoreData ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 rounded-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono text-white/60 uppercase tracking-wider">Overall Confidence</h3>
            <div className="text-[10px] text-white/40 font-mono">pLDDT Score</div>
          </div>
          <ConfidenceGauge score={avgConfidence} />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 rounded-xl text-center"
        >
          <div className="text-xs text-white/40 mb-2">Structure Loaded</div>
          <div className="text-lg font-display font-bold text-primary">Ready</div>
          <div className="text-[10px] text-white/30 mt-1">No pLDDT scores available</div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3"
      >
        <KPICard
          label="Residues"
          value={sequenceLength || "—"}
          subValue={hasScoreData ? `${highConfidenceResidues} high conf.` : "No score data"}
          icon={Dna}
          color="primary"
        />
        <KPICard
          label="Disordered"
          value={hasScoreData ? disorderedResidues : "—"}
          subValue={sequenceLength > 0 && hasScoreData 
            ? `${((disorderedResidues / sequenceLength) * 100).toFixed(1)}% of total` 
            : "No data available"}
          icon={Activity}
          color="amber"
        />
        {pTM && (
          <KPICard
            label="pTM Score"
            value={pTM.toFixed(2)}
            subValue="Fold confidence"
            icon={Target}
            color="green"
          />
        )}
        {ipTM && (
          <KPICard
            label="ipTM Score"
            value={ipTM.toFixed(2)}
            subValue="Interface quality"
            icon={Layers}
            color="purple"
          />
        )}
        {!pTM && !ipTM && estimatedPTM && (
          <KPICard
            label="Est. pTM"
            value={estimatedPTM.toFixed(2)}
            subValue="Derived from pLDDT"
            icon={Target}
            color="green"
          />
        )}
        {estimatedRMSD && (
          <KPICard
            label="Est. RMSD"
            value={`${estimatedRMSD.toFixed(1)}Å`}
            subValue="Backbone accuracy"
            icon={Zap}
            color="purple"
          />
        )}
      </motion.div>

      {hasScoreData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-white/10 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => toggleSection("distribution")}
            className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
            data-testid="btn-toggle-distribution"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/80">Confidence Distribution</span>
            </div>
            {expandedSection === "distribution" ? (
              <ChevronUp className="w-4 h-4 text-white/40" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/40" />
            )}
          </button>
          <AnimatePresence>
            {expandedSection === "distribution" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  <DistributionChart plddtScores={plddtScores} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {hasScoreData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border border-white/10 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => toggleSection("domains")}
            className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
            data-testid="btn-toggle-domains"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white/80">Domain Map</span>
            </div>
            {expandedSection === "domains" ? (
              <ChevronUp className="w-4 h-4 text-white/40" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/40" />
            )}
          </button>
          <AnimatePresence>
            {expandedSection === "domains" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4">
                  <DomainBreakdown plddtScores={plddtScores} />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {CONFIDENCE_TIERS.map(tier => (
                      <div key={tier.label} className="flex items-center gap-1.5">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: tier.color }}
                        />
                        <span className="text-[10px] text-white/50">{tier.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-3 rounded-xl"
      >
        <div className="text-[10px] text-white/40 font-mono uppercase mb-3">Export Data</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownloadPDB}
            disabled={!prediction.pdbData}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs text-white/70 hover:text-white"
            data-testid="btn-download-pdb"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDB</span>
          </button>
          <button
            onClick={handleDownloadFASTA}
            disabled={!prediction.sequence}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs text-white/70 hover:text-white"
            data-testid="btn-download-fasta"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>FASTA</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-[10px] text-white/20 text-center font-mono"
      >
        Structure data from AlphaFold Database
      </motion.div>
    </div>
  );
}
