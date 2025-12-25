import { motion } from "framer-motion";
import { useMemo } from "react";
import type { PredictionWithAnalysis, SequenceAnalysis } from "@/hooks/use-predictions";

interface ProteinViewerProps {
  folding: boolean;
  prediction?: PredictionWithAnalysis | null;
  analysis?: SequenceAnalysis | null;
}

function getConfidenceColor(score: number): string {
  if (score >= 90) return "#00ff88";
  if (score >= 70) return "#00f0ff";
  if (score >= 50) return "#ffcc00";
  return "#ff4444";
}

function getSecondaryStructureColor(type: string): string {
  switch (type) {
    case "helix": return "#ff6b9d";
    case "sheet": return "#00f0ff";
    case "turn": return "#a855f7";
    default: return "#666666";
  }
}

function assignSecondaryStructure(index: number, length: number, analysis: SequenceAnalysis | null): string {
  if (!analysis) return "coil";
  const pos = index / length;
  const { alphaHelix, betaSheet, turn } = analysis.secondaryStructure;
  if (pos < alphaHelix * 0.7) return "helix";
  if (pos < alphaHelix * 0.7 + betaSheet) return "sheet";
  if (pos < alphaHelix * 0.7 + betaSheet + turn) return "turn";
  if (pos > 0.85) return "helix";
  return "coil";
}

export default function ProteinViewer({ folding, prediction, analysis }: ProteinViewerProps) {
  const sequence = prediction?.sequence || "";
  const plddtScores = prediction?.plddtScores || [];
  
  const residues = useMemo(() => {
    if (!sequence) return [];
    return sequence.split("").map((aa, i) => ({
      aa,
      index: i,
      plddt: plddtScores[i] || 70,
      structure: assignSecondaryStructure(i, sequence.length, analysis || null)
    }));
  }, [sequence, plddtScores, analysis]);

  const helixPath = useMemo(() => {
    if (residues.length === 0) return "";
    const width = 700;
    const height = 400;
    const centerY = height / 2;
    const amplitude = 80;
    const wavelength = 40;
    
    let path = "";
    residues.forEach((res, i) => {
      const x = 50 + (i / residues.length) * (width - 100);
      const phase = res.structure === "helix" ? Math.sin(i * 0.5) * amplitude : 
                    res.structure === "sheet" ? (i % 2 === 0 ? 20 : -20) : 
                    Math.sin(i * 0.2) * 30;
      const y = centerY + phase;
      
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        const prevX = 50 + ((i - 1) / residues.length) * (width - 100);
        const prevPhase = residues[i-1].structure === "helix" ? Math.sin((i-1) * 0.5) * amplitude : 
                          residues[i-1].structure === "sheet" ? ((i-1) % 2 === 0 ? 20 : -20) : 
                          Math.sin((i-1) * 0.2) * 30;
        const prevY = centerY + prevPhase;
        const cpX = (prevX + x) / 2;
        path += ` Q ${cpX} ${(prevY + y) / 2 + (Math.random() - 0.5) * 10} ${x} ${y}`;
      }
    });
    return path;
  }, [residues]);

  if (folding) {
    return (
      <div className="w-full h-full min-h-[500px] bg-black/20 rounded-xl overflow-hidden relative border border-white/10 shadow-inner">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-primary">
            VIEWER_MODE: PROCESSING
          </div>
        </div>
        
        <div className="w-full h-full flex items-center justify-center relative">
          <motion.div 
            className="text-center space-y-6"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div 
              className="text-primary text-8xl"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              🧬
            </motion.div>
            <div className="space-y-2">
              <div className="text-white/70 text-lg font-display">Analyzing Sequence</div>
              <div className="text-white/40 text-xs font-mono">
                Computing structure predictions...
              </div>
            </div>
            
            <div className="flex gap-2 justify-center">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full bg-primary"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </div>
    );
  }

  if (!prediction || residues.length === 0) {
    return (
      <div className="w-full h-full min-h-[500px] bg-black/20 rounded-xl overflow-hidden relative border border-white/10 shadow-inner">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-white/50">
            VIEWER_MODE: STANDBY
          </div>
        </div>
        
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl opacity-30">🔬</div>
            <div className="text-white/40 text-sm font-mono">
              Enter a sequence to visualize structure
            </div>
          </div>
        </div>
      </div>
    );
  }

  const avgPlddt = plddtScores.length > 0 
    ? plddtScores.reduce((a, b) => a + b, 0) / plddtScores.length 
    : 0;

  return (
    <div className="w-full h-full min-h-[500px] bg-black/20 rounded-xl overflow-hidden relative border border-white/10 shadow-inner" data-testid="protein-viewer">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-primary">
          VIEWER_MODE: STRUCTURE
        </div>
        <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-white/50">
          {residues.length} RESIDUES
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
        <div className="text-[10px] text-white/50 font-mono mb-2">CONFIDENCE LEGEND</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#00ff88" }} />
            <span className="text-[10px] text-white/60 font-mono">Very High (90+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#00f0ff" }} />
            <span className="text-[10px] text-white/60 font-mono">High (70-90)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ffcc00" }} />
            <span className="text-[10px] text-white/60 font-mono">Medium (50-70)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ff4444" }} />
            <span className="text-[10px] text-white/60 font-mono">Low (&lt;50)</span>
          </div>
        </div>
      </div>
      
      <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="helixGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff6b9d" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <motion.path
          d={helixPath}
          fill="none"
          stroke="url(#helixGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {residues.filter((_, i) => i % Math.max(1, Math.floor(residues.length / 50)) === 0).map((res, displayIndex) => {
          const i = res.index;
          const width = 700;
          const height = 400;
          const centerY = height / 2 + 50;
          const x = 50 + (i / residues.length) * (width - 100);
          const phase = res.structure === "helix" ? Math.sin(i * 0.5) * 80 : 
                        res.structure === "sheet" ? (i % 2 === 0 ? 20 : -20) : 
                        Math.sin(i * 0.2) * 30;
          const y = centerY + phase;
          
          return (
            <motion.g 
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: displayIndex * 0.02, duration: 0.3 }}
            >
              <circle
                cx={x}
                cy={y}
                r={6}
                fill={getConfidenceColor(res.plddt)}
                opacity={0.9}
                filter="url(#glow)"
              />
              <circle
                cx={x}
                cy={y}
                r={3}
                fill="white"
                opacity={0.6}
              />
              {displayIndex % 5 === 0 && (
                <text
                  x={x}
                  y={y + 20}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.4)"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {res.aa}
                </text>
              )}
            </motion.g>
          );
        })}
        
        {analysis?.motifs?.map((motif, i) => {
          const startX = 50 + (motif.position[0] / residues.length) * 600;
          const endX = 50 + (motif.position[1] / residues.length) * 600;
          return (
            <motion.g 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 + i * 0.2 }}
            >
              <rect
                x={startX}
                y={420}
                width={endX - startX}
                height={8}
                rx={4}
                fill="#a855f7"
                opacity={0.6}
              />
              <text
                x={(startX + endX) / 2}
                y={450}
                textAnchor="middle"
                fill="rgba(168,85,247,0.8)"
                fontSize="9"
                fontFamily="monospace"
              >
                {motif.name}
              </text>
            </motion.g>
          );
        })}

        <g transform="translate(50, 470)">
          <text x="0" y="0" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="monospace">
            N-term
          </text>
          <text x="650" y="0" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="monospace" textAnchor="end">
            C-term
          </text>
          <line x1="40" y1="-5" x2="610" y2="-5" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        </g>
      </svg>

      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
          <div className="text-[10px] text-white/50 font-mono mb-1">STRUCTURE COMPOSITION</div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ff6b9d" }} />
              <span className="text-[10px] text-white/60 font-mono">
                α-Helix {Math.round((analysis?.secondaryStructure?.alphaHelix || 0) * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#00f0ff" }} />
              <span className="text-[10px] text-white/60 font-mono">
                β-Sheet {Math.round((analysis?.secondaryStructure?.betaSheet || 0) * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#666666" }} />
              <span className="text-[10px] text-white/60 font-mono">
                Coil {Math.round((analysis?.secondaryStructure?.coil || 0) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 text-right">
          <div className="text-[10px] text-white/50 font-mono mb-1">AVERAGE CONFIDENCE</div>
          <div className="text-lg font-mono font-bold" style={{ color: getConfidenceColor(avgPlddt) }}>
            {avgPlddt.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
