import { motion } from "framer-motion";
import { Beaker, Zap, Dna, AlertTriangle, Target, Activity, Microscope } from "lucide-react";
import type { SequenceAnalysis, PredictionWithAnalysis } from "@/hooks/use-predictions";

interface BindingSite {
  position: number;
  type: string;
  ligand: string;
}

interface AnalysisPanelProps {
  analysis: SequenceAnalysis | null;
  explanation: string | null;
  prediction?: (PredictionWithAnalysis & { bindingSites?: BindingSite[] }) | null;
}

export default function AnalysisPanel({ analysis, explanation, prediction }: AnalysisPanelProps) {
  if (!analysis) return null;

  const avgPlddt = prediction?.plddtScores?.length 
    ? prediction.plddtScores.reduce((a, b) => a + b, 0) / prediction.plddtScores.length 
    : 0;

  const highConfidence = prediction?.plddtScores?.filter(s => s >= 90).length || 0;
  const goodConfidence = prediction?.plddtScores?.filter(s => s >= 70 && s < 90).length || 0;
  const lowConfidence = prediction?.plddtScores?.filter(s => s >= 50 && s < 70).length || 0;
  const veryLow = prediction?.plddtScores?.filter(s => s < 50).length || 0;
  const totalResidues = prediction?.plddtScores?.length || 1;

  return (
    <div className="space-y-4">
      {prediction?.plddtScores && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="luna-card p-5 rounded-xl"
        >
          <h3 className="text-sm font-mono text-green-400 flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4" />
            Structure Quality Metrics
          </h3>
          
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div className="bg-black/20 p-3 rounded-lg">
              <div className="text-[10px] text-gray-300 font-mono uppercase">Avg. pLDDT</div>
              <div className="text-white font-bold text-xl" style={{ color: avgPlddt >= 90 ? '#0053d6' : avgPlddt >= 70 ? '#65cbf3' : avgPlddt >= 50 ? '#ffdb13' : '#ff7d45' }}>
                {avgPlddt.toFixed(1)}%
              </div>
            </div>
            <div className="bg-black/20 p-3 rounded-lg">
              <div className="text-[10px] text-gray-300 font-mono uppercase">Quality</div>
              <div className={`font-bold ${avgPlddt >= 85 ? 'text-green-400' : avgPlddt >= 70 ? 'text-blue-400' : avgPlddt >= 50 ? 'text-yellow-400' : 'text-orange-400'}`}>
                {avgPlddt >= 85 ? 'Excellent' : avgPlddt >= 70 ? 'Good' : avgPlddt >= 50 ? 'Fair' : 'Low'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] text-gray-300 font-mono uppercase mb-2">Confidence Distribution</div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-300 w-24">Very High (≥90)</span>
              <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full"
                  style={{ backgroundColor: '#0053d6' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(highConfidence / totalResidues) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-xs text-white w-12 text-right">{((highConfidence / totalResidues) * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-300 w-24">Confident (70-90)</span>
              <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full"
                  style={{ backgroundColor: '#65cbf3' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(goodConfidence / totalResidues) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              </div>
              <span className="text-xs text-white w-12 text-right">{((goodConfidence / totalResidues) * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-300 w-24">Low (50-70)</span>
              <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full"
                  style={{ backgroundColor: '#ffdb13' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(lowConfidence / totalResidues) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
              <span className="text-xs text-white w-12 text-right">{((lowConfidence / totalResidues) * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-300 w-24">Very Low (&lt;50)</span>
              <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full"
                  style={{ backgroundColor: '#ff7d45' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(veryLow / totalResidues) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </div>
              <span className="text-xs text-white w-12 text-right">{((veryLow / totalResidues) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="luna-card p-5 rounded-xl"
      >
        <h3 className="text-sm font-mono text-primary flex items-center gap-2 mb-4">
          <Beaker className="w-4 h-4" />
          Biochemical Properties
        </h3>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-black/20 p-3 rounded-lg">
            <div className="text-[10px] text-gray-300 font-mono uppercase">Molecular Weight</div>
            <div className="text-white font-bold">{analysis.predictedProperties.molecularWeight.toFixed(0)} Da</div>
          </div>
          <div className="bg-black/20 p-3 rounded-lg">
            <div className="text-[10px] text-gray-300 font-mono uppercase">Isoelectric Point</div>
            <div className="text-white font-bold">pH {analysis.predictedProperties.isoelectricPoint.toFixed(1)}</div>
          </div>
          <div className="bg-black/20 p-3 rounded-lg">
            <div className="text-[10px] text-gray-300 font-mono uppercase">Hydrophobicity</div>
            <div className={`font-bold ${analysis.predictedProperties.hydrophobicity > 0 ? 'text-orange-400' : 'text-blue-400'}`}>
              {analysis.predictedProperties.hydrophobicity.toFixed(2)}
            </div>
          </div>
          <div className="bg-black/20 p-3 rounded-lg">
            <div className="text-[10px] text-gray-300 font-mono uppercase">Instability</div>
            <div className={`font-bold ${analysis.predictedProperties.instabilityIndex > 40 ? 'text-red-400' : 'text-green-400'}`}>
              {analysis.predictedProperties.instabilityIndex.toFixed(1)}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="luna-card p-5 rounded-xl"
      >
        <h3 className="text-sm font-mono text-purple-400 flex items-center gap-2 mb-4">
          <Dna className="w-4 h-4" />
          Secondary Structure Prediction
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-300 w-20">α-Helix</span>
            <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${analysis.secondaryStructure.alphaHelix * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs text-white/70 w-12 text-right">{(analysis.secondaryStructure.alphaHelix * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50 w-20">β-Sheet</span>
            <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${analysis.secondaryStructure.betaSheet * 100}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
            </div>
            <span className="text-xs text-white/70 w-12 text-right">{(analysis.secondaryStructure.betaSheet * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50 w-20">Coil</span>
            <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${analysis.secondaryStructure.coil * 100}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
            <span className="text-xs text-white/70 w-12 text-right">{(analysis.secondaryStructure.coil * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50 w-20">Turn</span>
            <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-400"
                initial={{ width: 0 }}
                animate={{ width: `${analysis.secondaryStructure.turn * 100}%` }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </div>
            <span className="text-xs text-white/70 w-12 text-right">{(analysis.secondaryStructure.turn * 100).toFixed(0)}%</span>
          </div>
        </div>
      </motion.div>

      {analysis.motifs.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="luna-card p-5 rounded-xl"
        >
          <h3 className="text-sm font-mono text-yellow-400 flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4" />
            Detected Motifs
          </h3>
          
          <div className="space-y-2">
            {analysis.motifs.map((motif, i) => (
              <div key={i} className="bg-black/20 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-mono text-sm">{motif.name}</span>
                  <span className="text-[10px] text-white/40">
                    {motif.position[0]}-{motif.position[1]} ({(motif.confidence * 100).toFixed(0)}%)
                  </span>
                </div>
                <p className="text-xs text-white/50">{motif.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {prediction?.bindingSites && prediction.bindingSites.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="luna-card p-5 rounded-xl bg-blue-500/5 border-blue-500/20"
        >
          <h3 className="text-sm font-mono text-blue-400 flex items-center gap-2 mb-4">
            <Target className="w-4 h-4" />
            Predicted Binding Sites
          </h3>
          
          <div className="space-y-2">
            {prediction.bindingSites.map((site, i) => (
              <div key={i} className="bg-black/20 p-3 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-white font-mono text-sm">Position {site.position}</span>
                  <span className="text-xs text-white/50 ml-2">{site.type}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded">
                  {site.ligand}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/40 mt-3">
            Binding sites are AI-predicted and should be validated experimentally for drug discovery applications.
          </p>
        </motion.div>
      )}

      {analysis.disorderedRegions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="luna-card p-4 rounded-xl bg-yellow-500/5 border-yellow-500/20"
        >
          <h3 className="text-sm font-mono text-yellow-400 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" />
            Intrinsically Disordered Regions
          </h3>
          <p className="text-xs text-white/60">
            Regions {analysis.disorderedRegions.map(r => `${r[0]}-${r[1]}`).join(', ')} show high flexibility and may lack stable structure. These regions often mediate protein-protein interactions or undergo disorder-to-order transitions upon binding.
          </p>
        </motion.div>
      )}

      {explanation && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="luna-card p-5 rounded-xl"
        >
          <h3 className="text-sm font-mono text-white/80 flex items-center gap-2 mb-3">
            <Microscope className="w-4 h-4" />
            AI Analysis Summary
          </h3>
          <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{explanation}</p>
        </motion.div>
      )}
    </div>
  );
}
