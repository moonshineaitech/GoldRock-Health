import { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { PredictionWithAnalysis } from "@/hooks/use-predictions";

interface SequenceDisplayProps {
  prediction: PredictionWithAnalysis;
  onResidueClick?: (residue: { index: number; aa: string; plddt: number } | null) => void;
  selectedResidue?: { index: number; aa: string; plddt: number } | null;
  highlightedResidue?: { row: number; col: number } | null;
}

const PLDDT_COLORS = {
  veryHigh: { bg: '#0053d6', text: '#fff' },
  high: { bg: '#65cbf3', text: '#000' },
  low: { bg: '#ffdb13', text: '#000' },
  veryLow: { bg: '#ff7d45', text: '#000' }
};

function getPlddtStyle(score: number): { bg: string; text: string } {
  if (score >= 90) return PLDDT_COLORS.veryHigh;
  if (score >= 70) return PLDDT_COLORS.high;
  if (score >= 50) return PLDDT_COLORS.low;
  return PLDDT_COLORS.veryLow;
}

function getPlddtLabel(score: number): string {
  if (score >= 90) return 'Very High';
  if (score >= 70) return 'High';
  if (score >= 50) return 'Low';
  return 'Very Low';
}

export default function SequenceDisplay({ 
  prediction, 
  onResidueClick,
  selectedResidue,
  highlightedResidue
}: SequenceDisplayProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const sequence = prediction.sequence || '';
  const plddtScores = prediction.plddtScores || [];
  
  const residues = useMemo(() => {
    return sequence.split('').map((aa, index) => ({
      aa,
      index,
      plddt: plddtScores[index] ?? 50
    }));
  }, [sequence, plddtScores]);

  const avgPlddt = useMemo(() => {
    if (plddtScores.length === 0) return 0;
    return plddtScores.reduce((a, b) => a + b, 0) / plddtScores.length;
  }, [plddtScores]);

  const highlightedIndices = useMemo(() => {
    if (!highlightedResidue) return new Set<number>();
    return new Set([highlightedResidue.row, highlightedResidue.col]);
  }, [highlightedResidue]);

  useEffect(() => {
    if (selectedResidue && scrollRef.current) {
      const residueEl = scrollRef.current.querySelector(`[data-residue-index="${selectedResidue.index}"]`);
      if (residueEl) {
        residueEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedResidue]);

  const displayedResidue = hoveredIndex !== null ? residues[hoveredIndex] : selectedResidue;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="luna-card rounded-xl overflow-hidden"
    >
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-display font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full" />
            Sequence pLDDT Coloring
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-white/50">
              {sequence.length} residues
            </span>
            <span className="text-xs font-mono" style={{ color: getPlddtStyle(avgPlddt).bg }}>
              Avg: {avgPlddt.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-[10px]">
          {[
            { label: 'Very High (90+)', ...PLDDT_COLORS.veryHigh },
            { label: 'High (70-90)', ...PLDDT_COLORS.high },
            { label: 'Low (50-70)', ...PLDDT_COLORS.low },
            { label: 'Very Low (<50)', ...PLDDT_COLORS.veryLow }
          ].map(({ label, bg, text }) => (
            <div key={label} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: bg }} />
              <span className="text-white/50 font-mono">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {displayedResidue && (
        <div className="px-4 py-2 bg-black/30 border-b border-white/5 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span 
              className="w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-sm"
              style={{ 
                backgroundColor: getPlddtStyle(displayedResidue.plddt).bg,
                color: getPlddtStyle(displayedResidue.plddt).text
              }}
            >
              {displayedResidue.aa}
            </span>
            <span className="text-white/70 text-sm font-mono">
              Position {displayedResidue.index + 1}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">pLDDT:</span>
            <span 
              className="text-sm font-mono font-bold"
              style={{ color: getPlddtStyle(displayedResidue.plddt).bg }}
            >
              {displayedResidue.plddt.toFixed(1)}
            </span>
            <span 
              className="text-[10px] px-1.5 py-0.5 rounded font-mono"
              style={{ 
                backgroundColor: getPlddtStyle(displayedResidue.plddt).bg + '30',
                color: getPlddtStyle(displayedResidue.plddt).bg
              }}
            >
              {getPlddtLabel(displayedResidue.plddt)}
            </span>
          </div>
        </div>
      )}

      <div 
        ref={scrollRef}
        className="p-4 overflow-x-auto max-h-[200px] overflow-y-auto"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="flex flex-wrap gap-[2px] font-mono text-xs leading-none">
          {residues.map(({ aa, index, plddt }) => {
            const style = getPlddtStyle(plddt);
            const isSelected = selectedResidue?.index === index;
            const isHighlighted = highlightedIndices.has(index);
            const isHovered = hoveredIndex === index;
            
            return (
              <button
                key={index}
                data-residue-index={index}
                data-testid={`residue-${index}`}
                onClick={() => onResidueClick?.({ index, aa, plddt })}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="w-5 h-5 flex items-center justify-center rounded-sm transition-all duration-150 cursor-pointer relative"
                style={{ 
                  backgroundColor: style.bg,
                  color: style.text,
                  transform: isHovered || isSelected ? 'scale(1.3)' : 'scale(1)',
                  zIndex: isHovered || isSelected ? 10 : 1,
                  boxShadow: isSelected 
                    ? `0 0 0 2px #fff, 0 0 10px ${style.bg}` 
                    : isHighlighted 
                      ? `0 0 0 2px #22c55e, 0 0 8px #22c55e` 
                      : 'none'
                }}
                title={`${aa}${index + 1}: pLDDT ${plddt.toFixed(1)}`}
              >
                {aa}
              </button>
            );
          })}
        </div>
      </div>

      {prediction.proteinName && (
        <div className="px-4 py-2 bg-black/20 border-t border-white/5">
          <div className="text-xs text-white/40 font-mono truncate">
            {prediction.proteinName}
            {prediction.organism && <span className="italic"> ({prediction.organism})</span>}
          </div>
        </div>
      )}
    </motion.div>
  );
}
