import { motion } from "framer-motion";
import { 
  FlaskConical, 
  Target, 
  Dna, 
  Pill, 
  FileText, 
  ExternalLink, 
  ChevronRight,
  Microscope,
  Layers,
  Zap,
  Download,
  Share2
} from "lucide-react";
import type { PredictionWithAnalysis, SequenceAnalysis } from "@/hooks/use-predictions";

interface NextStepsPanelProps {
  prediction: PredictionWithAnalysis | null;
  analysis: SequenceAnalysis | null;
}

export default function NextStepsPanel({ prediction, analysis }: NextStepsPanelProps) {
  if (!prediction) return null;

  const avgPlddt = prediction.plddtScores?.length 
    ? prediction.plddtScores.reduce((a, b) => a + b, 0) / prediction.plddtScores.length 
    : 0;

  const isHighConfidence = avgPlddt >= 70;
  const hasDisorderedRegions = (analysis?.disorderedRegions?.length || 0) > 0;
  const hasBindingSites = analysis?.motifs?.some(m => 
    m.name.toLowerCase().includes('binding') || 
    m.name.toLowerCase().includes('active') ||
    m.name.toLowerCase().includes('catalytic')
  );

  const nextSteps = [
    {
      icon: Target,
      title: "Binding Site Analysis",
      description: "Identify druggable pockets and potential ligand binding sites for drug discovery",
      action: "Use molecular docking tools like AutoDock Vina or GNINA",
      link: "https://vina.scripps.edu/",
      color: "text-blue-400",
      relevant: isHighConfidence
    },
    {
      icon: Pill,
      title: "Virtual Screening",
      description: "Screen compound libraries against predicted binding pockets",
      action: "Upload structure to SwissDock or perform local docking",
      link: "https://www.swissdock.ch/",
      color: "text-green-400",
      relevant: isHighConfidence && hasBindingSites
    },
    {
      icon: Dna,
      title: "Mutation Analysis",
      description: "Model point mutations to predict effects on protein stability and function",
      action: "Use FoldX or Rosetta for stability predictions",
      link: "https://foldxsuite.crg.eu/",
      color: "text-purple-400",
      relevant: true
    },
    {
      icon: Layers,
      title: "Protein-Protein Docking",
      description: "Predict how this protein interacts with binding partners",
      action: "Use HDOCK or ClusPro for complex modeling",
      link: "http://hdock.phys.hust.edu.cn/",
      color: "text-orange-400",
      relevant: isHighConfidence
    },
    {
      icon: FlaskConical,
      title: "Experimental Validation",
      description: hasDisorderedRegions 
        ? "Disordered regions may need NMR or SAXS for validation"
        : "Validate structure with X-ray crystallography or Cryo-EM",
      action: hasDisorderedRegions 
        ? "Consider flexibility in experimental design"
        : "Compare with experimental structures when available",
      color: "text-yellow-400",
      relevant: true
    },
    {
      icon: Microscope,
      title: "AlphaFold 3 Multimer",
      description: "Model protein complexes with DNA, RNA, or small molecules",
      action: "Use AlphaFold Server for multimer predictions",
      link: "https://alphafoldserver.com/",
      color: "text-cyan-400",
      relevant: true
    }
  ];

  const useCases = [
    {
      icon: Pill,
      title: "Drug Discovery",
      steps: [
        "Identify binding pockets in high-confidence regions (pLDDT > 70)",
        "Perform virtual screening with compound libraries",
        "Analyze binding poses and optimize lead compounds",
        "Validate hits with biochemical assays"
      ],
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: Dna,
      title: "Protein Engineering",
      steps: [
        "Identify flexible regions for modification (low pLDDT)",
        "Design mutations in stable scaffolds (high pLDDT)",
        "Model variants to predict stability changes",
        "Validate engineered proteins experimentally"
      ],
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: Zap,
      title: "Functional Annotation",
      steps: [
        "Compare structure to known protein families",
        "Identify conserved functional motifs",
        "Predict enzyme active sites and catalytic residues",
        "Annotate novel proteins by structural similarity"
      ],
      color: "from-green-500/20 to-emerald-500/20"
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="luna-card p-5 rounded-xl"
      >
        <h3 className="text-sm font-mono text-primary flex items-center gap-2 mb-4">
          <ChevronRight className="w-4 h-4" />
          Recommended Next Steps
        </h3>
        
        <div className="space-y-3">
          {nextSteps.filter(step => step.relevant).slice(0, 4).map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-black/30 p-3 rounded-lg hover:bg-black/40 transition-colors border border-cyan-500/10"
            >
              <div className="flex items-start gap-3">
                <step.icon className={`w-4 h-4 ${step.color} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{step.title}</div>
                  <p className="text-xs text-gray-300 mt-0.5">{step.description}</p>
                  <p className="text-[10px] text-cyan-400/70 mt-1">{step.action}</p>
                  {step.link && (
                    <a 
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline mt-1"
                    >
                      Learn more <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="luna-card p-5 rounded-xl"
      >
        <h3 className="text-sm font-mono text-purple-400 flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4" />
          Research Workflows
        </h3>
        
        <div className="space-y-4">
          {useCases.map((useCase, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-black/40 p-4 rounded-lg border border-cyan-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <useCase.icon className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-white">{useCase.title}</span>
              </div>
              <ol className="space-y-1 ml-6">
                {useCase.steps.map((step, j) => (
                  <li key={j} className="text-[10px] text-gray-300 list-decimal">
                    {step}
                  </li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="luna-card p-5 rounded-xl"
      >
        <h3 className="text-sm font-mono text-green-400 flex items-center gap-2 mb-4">
          <Download className="w-4 h-4" />
          Export & Share
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            className="flex items-center justify-center gap-2 text-xs bg-black/20 hover:bg-black/30 p-3 rounded-lg transition-colors"
            onClick={() => {
              if (prediction?.pdbData) {
                const blob = new Blob([prediction.pdbData], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${prediction.proteinName || 'protein'}.pdb`;
                a.click();
                URL.revokeObjectURL(url);
              }
            }}
          >
            <Download className="w-3 h-3" />
            Download PDB
          </button>
          <button 
            className="flex items-center justify-center gap-2 text-xs bg-black/20 hover:bg-black/30 p-3 rounded-lg transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            <Share2 className="w-3 h-3" />
            Share Link
          </button>
        </div>
        
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-[10px] text-white/40">
            Export structures for use in molecular visualization software (PyMOL, ChimeraX) or computational chemistry tools.
          </p>
        </div>
      </motion.div>

      {avgPlddt < 70 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4"
        >
          <h4 className="text-sm font-medium text-amber-300 mb-2">Low Confidence Warning</h4>
          <p className="text-xs text-white/60">
            This structure has regions with lower confidence (average pLDDT: {avgPlddt.toFixed(1)}%). 
            Consider these limitations when making scientific conclusions:
          </p>
          <ul className="text-[10px] text-white/50 mt-2 space-y-1 ml-4 list-disc">
            <li>Flexible loops may adopt different conformations in solution</li>
            <li>Binding site predictions in low-confidence regions need experimental validation</li>
            <li>Consider using ensemble methods or molecular dynamics for flexibility</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
}
