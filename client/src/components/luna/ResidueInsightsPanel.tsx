import { useState } from "react";
import { 
  Atom, 
  Zap, 
  Target, 
  Beaker, 
  ArrowRight,
  Droplets,
  Plus,
  Minus,
  Circle,
  ChevronDown,
  ChevronUp,
  Scissors,
  FlaskConical,
  Microscope,
  Download
} from "lucide-react";

interface ResidueData {
  index: number;
  aa: string;
  plddt: number;
}

interface ResidueInsightsPanelProps {
  residue: ResidueData | null;
  sequence?: string;
  plddtScores?: number[];
  onClose?: () => void;
}

const AMINO_ACID_PROPERTIES: Record<string, {
  name: string;
  threeLetterCode: string;
  hydrophobicity: 'hydrophobic' | 'hydrophilic' | 'neutral';
  charge: 'positive' | 'negative' | 'neutral';
  polarity: 'polar' | 'nonpolar';
  size: 'small' | 'medium' | 'large';
  role: string;
  mutationSuggestions: string[];
}> = {
  'A': { name: 'Alanine', threeLetterCode: 'Ala', hydrophobicity: 'hydrophobic', charge: 'neutral', polarity: 'nonpolar', size: 'small', role: 'Structural, often in alpha-helices', mutationSuggestions: ['G', 'V', 'S'] },
  'R': { name: 'Arginine', threeLetterCode: 'Arg', hydrophobicity: 'hydrophilic', charge: 'positive', polarity: 'polar', size: 'large', role: 'Salt bridges, binding interfaces', mutationSuggestions: ['K', 'H', 'Q'] },
  'N': { name: 'Asparagine', threeLetterCode: 'Asn', hydrophobicity: 'hydrophilic', charge: 'neutral', polarity: 'polar', size: 'medium', role: 'Glycosylation sites, hydrogen bonding', mutationSuggestions: ['D', 'Q', 'S'] },
  'D': { name: 'Aspartic Acid', threeLetterCode: 'Asp', hydrophobicity: 'hydrophilic', charge: 'negative', polarity: 'polar', size: 'medium', role: 'Catalytic sites, metal binding', mutationSuggestions: ['E', 'N', 'S'] },
  'C': { name: 'Cysteine', threeLetterCode: 'Cys', hydrophobicity: 'hydrophobic', charge: 'neutral', polarity: 'polar', size: 'small', role: 'Disulfide bonds, redox activity', mutationSuggestions: ['S', 'A', 'V'] },
  'E': { name: 'Glutamic Acid', threeLetterCode: 'Glu', hydrophobicity: 'hydrophilic', charge: 'negative', polarity: 'polar', size: 'medium', role: 'Catalysis, salt bridges', mutationSuggestions: ['D', 'Q', 'K'] },
  'Q': { name: 'Glutamine', threeLetterCode: 'Gln', hydrophobicity: 'hydrophilic', charge: 'neutral', polarity: 'polar', size: 'medium', role: 'Hydrogen bonding, amide donor', mutationSuggestions: ['N', 'E', 'K'] },
  'G': { name: 'Glycine', threeLetterCode: 'Gly', hydrophobicity: 'neutral', charge: 'neutral', polarity: 'nonpolar', size: 'small', role: 'Flexibility, tight turns', mutationSuggestions: ['A', 'S'] },
  'H': { name: 'Histidine', threeLetterCode: 'His', hydrophobicity: 'hydrophilic', charge: 'positive', polarity: 'polar', size: 'medium', role: 'Catalysis, pH sensing, metal coordination', mutationSuggestions: ['R', 'K', 'N'] },
  'I': { name: 'Isoleucine', threeLetterCode: 'Ile', hydrophobicity: 'hydrophobic', charge: 'neutral', polarity: 'nonpolar', size: 'medium', role: 'Hydrophobic core, beta-sheets', mutationSuggestions: ['L', 'V', 'M'] },
  'L': { name: 'Leucine', threeLetterCode: 'Leu', hydrophobicity: 'hydrophobic', charge: 'neutral', polarity: 'nonpolar', size: 'medium', role: 'Leucine zippers, hydrophobic packing', mutationSuggestions: ['I', 'V', 'M'] },
  'K': { name: 'Lysine', threeLetterCode: 'Lys', hydrophobicity: 'hydrophilic', charge: 'positive', polarity: 'polar', size: 'large', role: 'PTM sites (acetylation, ubiquitination)', mutationSuggestions: ['R', 'H', 'Q'] },
  'M': { name: 'Methionine', threeLetterCode: 'Met', hydrophobicity: 'hydrophobic', charge: 'neutral', polarity: 'nonpolar', size: 'large', role: 'Start codon, oxidation-sensitive', mutationSuggestions: ['L', 'I', 'V'] },
  'F': { name: 'Phenylalanine', threeLetterCode: 'Phe', hydrophobicity: 'hydrophobic', charge: 'neutral', polarity: 'nonpolar', size: 'large', role: 'Aromatic stacking, hydrophobic core', mutationSuggestions: ['Y', 'W', 'L'] },
  'P': { name: 'Proline', threeLetterCode: 'Pro', hydrophobicity: 'hydrophobic', charge: 'neutral', polarity: 'nonpolar', size: 'small', role: 'Structural kinks, helix breaker', mutationSuggestions: ['A', 'G'] },
  'S': { name: 'Serine', threeLetterCode: 'Ser', hydrophobicity: 'hydrophilic', charge: 'neutral', polarity: 'polar', size: 'small', role: 'Phosphorylation sites, catalysis', mutationSuggestions: ['T', 'A', 'N'] },
  'T': { name: 'Threonine', threeLetterCode: 'Thr', hydrophobicity: 'hydrophilic', charge: 'neutral', polarity: 'polar', size: 'small', role: 'Glycosylation, phosphorylation', mutationSuggestions: ['S', 'V', 'A'] },
  'W': { name: 'Tryptophan', threeLetterCode: 'Trp', hydrophobicity: 'hydrophobic', charge: 'neutral', polarity: 'nonpolar', size: 'large', role: 'Membrane anchoring, fluorescence', mutationSuggestions: ['F', 'Y'] },
  'Y': { name: 'Tyrosine', threeLetterCode: 'Tyr', hydrophobicity: 'hydrophobic', charge: 'neutral', polarity: 'polar', size: 'large', role: 'Phosphorylation, aromatic interactions', mutationSuggestions: ['F', 'W', 'H'] },
  'V': { name: 'Valine', threeLetterCode: 'Val', hydrophobicity: 'hydrophobic', charge: 'neutral', polarity: 'nonpolar', size: 'small', role: 'Beta-sheets, hydrophobic packing', mutationSuggestions: ['I', 'L', 'A'] },
};

function getPlddtColor(score: number): string {
  if (score >= 90) return '#0053d6';
  if (score >= 70) return '#65cbf3';
  if (score >= 50) return '#ffdb13';
  return '#ff7d45';
}

function getPlddtLabel(score: number): string {
  if (score >= 90) return 'Very High';
  if (score >= 70) return 'Confident';
  if (score >= 50) return 'Low';
  return 'Very Low';
}

export default function ResidueInsightsPanel({ 
  residue, 
  sequence,
  plddtScores,
  onClose 
}: ResidueInsightsPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('properties');
  
  if (!residue) return null;

  const props = AMINO_ACID_PROPERTIES[residue.aa] || {
    name: 'Unknown',
    threeLetterCode: '???',
    hydrophobicity: 'neutral' as const,
    charge: 'neutral' as const,
    polarity: 'nonpolar' as const,
    size: 'medium' as const,
    role: 'Unknown residue',
    mutationSuggestions: []
  };

  // Get neighboring residues
  const neighbors: { pos: number; aa: string; plddt: number }[] = [];
  if (sequence && plddtScores) {
    for (let i = -3; i <= 3; i++) {
      const idx = residue.index + i;
      if (idx >= 0 && idx < sequence.length) {
        neighbors.push({
          pos: idx + 1,
          aa: sequence[idx],
          plddt: plddtScores[idx] || 0
        });
      }
    }
  }

  // Calculate local disorder
  const localPlddtScores = plddtScores?.slice(
    Math.max(0, residue.index - 5),
    Math.min(plddtScores.length, residue.index + 6)
  ) || [];
  const avgLocalPlddt = localPlddtScores.length > 0 
    ? localPlddtScores.reduce((a, b) => a + b, 0) / localPlddtScores.length 
    : 0;
  const isInDisorderedRegion = avgLocalPlddt < 70;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="glass-card p-4 space-y-4" data-testid="residue-insights-panel">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
            style={{ backgroundColor: getPlddtColor(residue.plddt), color: residue.plddt < 70 ? '#000' : '#fff' }}
          >
            {residue.aa}
          </div>
          <div>
            <div className="font-display text-white text-lg">
              {props.name}
            </div>
            <div className="text-xs text-white/50 font-mono">
              Position {residue.index + 1} ({props.threeLetterCode})
            </div>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="text-white/40 hover:text-white p-1"
            data-testid="btn-close-residue-insights"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* pLDDT Confidence Bar */}
      <div className="bg-white/5 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/50 font-mono">Confidence (pLDDT)</span>
          <span className="text-sm font-mono" style={{ color: getPlddtColor(residue.plddt) }}>
            {residue.plddt.toFixed(1)} - {getPlddtLabel(residue.plddt)}
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all"
            style={{ 
              width: `${residue.plddt}%`, 
              backgroundColor: getPlddtColor(residue.plddt) 
            }}
          />
        </div>
      </div>

      {/* Physicochemical Properties */}
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <button 
          onClick={() => toggleSection('properties')}
          className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
          data-testid="btn-toggle-properties"
        >
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-primary" />
            <span className="text-sm text-white/80">Physicochemical Properties</span>
          </div>
          {expandedSection === 'properties' ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
        </button>
        {expandedSection === 'properties' && (
          <div className="p-3 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Droplets className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-white/60">
                {props.hydrophobicity === 'hydrophobic' ? 'Hydrophobic' : 
                 props.hydrophobicity === 'hydrophilic' ? 'Hydrophilic' : 'Neutral'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {props.charge === 'positive' ? <Plus className="w-3 h-3 text-green-400" /> :
               props.charge === 'negative' ? <Minus className="w-3 h-3 text-red-400" /> :
               <Circle className="w-3 h-3 text-white/40" />}
              <span className="text-xs text-white/60">
                {props.charge === 'positive' ? 'Positive (+)' : 
                 props.charge === 'negative' ? 'Negative (-)' : 'Neutral'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-white/60">
                {props.polarity === 'polar' ? 'Polar' : 'Non-polar'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-white/60">
                Size: {props.size}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Structural Role */}
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <button 
          onClick={() => toggleSection('role')}
          className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
          data-testid="btn-toggle-role"
        >
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-white/80">Structural Role</span>
          </div>
          {expandedSection === 'role' ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
        </button>
        {expandedSection === 'role' && (
          <div className="p-3 space-y-3">
            <p className="text-xs text-white/60">{props.role}</p>
            {isInDisorderedRegion && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-2">
                <div className="text-xs text-orange-400 font-mono">In Disordered Region</div>
                <div className="text-[10px] text-white/50 mt-1">
                  Local pLDDT avg: {avgLocalPlddt.toFixed(1)} - may be flexible or unstructured
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sequence Context */}
      {neighbors.length > 0 && (
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <button 
            onClick={() => toggleSection('context')}
            className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
            data-testid="btn-toggle-context"
          >
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-white/80">Sequence Context</span>
            </div>
            {expandedSection === 'context' ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </button>
          {expandedSection === 'context' && (
            <div className="p-3">
              <div className="flex justify-center gap-0.5 font-mono text-sm">
                {neighbors.map((n, i) => (
                  <div 
                    key={i}
                    className={`w-7 h-7 flex items-center justify-center rounded ${
                      n.pos === residue.index + 1 
                        ? 'ring-2 ring-primary' 
                        : ''
                    }`}
                    style={{ 
                      backgroundColor: getPlddtColor(n.plddt),
                      color: n.plddt < 70 ? '#000' : '#fff'
                    }}
                    title={`${n.aa}${n.pos} - pLDDT: ${n.plddt.toFixed(1)}`}
                  >
                    {n.aa}
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-white/40 text-center mt-2">
                Positions {neighbors[0]?.pos} - {neighbors[neighbors.length - 1]?.pos}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Research Actions */}
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <button 
          onClick={() => toggleSection('actions')}
          className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
          data-testid="btn-toggle-actions"
        >
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-green-400" />
            <span className="text-sm text-white/80">Research Actions</span>
          </div>
          {expandedSection === 'actions' ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
        </button>
        {expandedSection === 'actions' && (
          <div className="p-3 space-y-2">
            {/* Mutation Suggestions */}
            {props.mutationSuggestions.length > 0 && (
              <div className="bg-white/5 rounded-lg p-2">
                <div className="text-[10px] text-white/50 font-mono mb-1">Conservative Mutations</div>
                <div className="flex gap-1">
                  {props.mutationSuggestions.map((mut, i) => (
                    <span 
                      key={i}
                      className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded font-mono"
                    >
                      {residue.aa}{residue.index + 1}{mut}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-1.5">
              <button 
                className="w-full flex items-center gap-2 text-xs text-white/60 hover:text-white p-2 rounded hover:bg-white/5 transition-colors"
                data-testid="btn-analyze-binding"
              >
                <Target className="w-3 h-3" />
                <span>Analyze binding pocket proximity</span>
                <ArrowRight className="w-3 h-3 ml-auto" />
              </button>
              <button 
                className="w-full flex items-center gap-2 text-xs text-white/60 hover:text-white p-2 rounded hover:bg-white/5 transition-colors"
                data-testid="btn-predict-mutation"
              >
                <Beaker className="w-3 h-3" />
                <span>Predict mutation effects</span>
                <ArrowRight className="w-3 h-3 ml-auto" />
              </button>
              <button 
                className="w-full flex items-center gap-2 text-xs text-white/60 hover:text-white p-2 rounded hover:bg-white/5 transition-colors"
                data-testid="btn-find-homologs"
              >
                <Microscope className="w-3 h-3" />
                <span>Find conserved homologs</span>
                <ArrowRight className="w-3 h-3 ml-auto" />
              </button>
              <button 
                className="w-full flex items-center gap-2 text-xs text-white/60 hover:text-white p-2 rounded hover:bg-white/5 transition-colors"
                data-testid="btn-export-region"
              >
                <Download className="w-3 h-3" />
                <span>Export local region (FASTA)</span>
                <ArrowRight className="w-3 h-3 ml-auto" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
