import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Play, RefreshCw, Sparkles, AlertCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SequenceInputProps {
  onFold: (sequence: string) => void;
  isFolding: boolean;
  error?: string;
}

const exampleSequences = [
  {
    name: "CDK2",
    description: "Cyclin-dependent kinase 2 (Human) - 298 residues",
    uniprotId: "P24941",
    sequence: "MENFQKVEKIGEGTYGVVYKARNKLTGEVVALKKIRLDTETEGVPSTAIREISLLKELNHPNIVKLLDVIHTENKLYLVFEFLHQDLKKFMDASALTGIPLPLIKSYLFQLLQGLAFCHSHRVLHRDLKPQNLLINTEGAIKLADFGLARAFGVPVRTYTHEVVTLWYRAPEILLGCKYYSTAVDIWSLGCIFAEMVTRRALFPGDSEIDQLFRIFRTLGTPDEVVWPGVTSMPDYKPSFPKWARQDFSKVVPPLDEDGRSLLSQMLHYDPNKRISAKAALAHPFFQDVTKPVPHLRL"
  },
  {
    name: "Hemoglobin α",
    description: "Hemoglobin subunit alpha (Human) - 142 residues",
    uniprotId: "P69905",
    sequence: "MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR"
  },
  {
    name: "Hemoglobin β",
    description: "Hemoglobin subunit beta (Human) - 147 residues",
    uniprotId: "P68871",
    sequence: "MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVMGNPKVKAHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNVLVCVLAHHFGKEFTPPVQAAYQKVVAGVANALAHKYH"
  },
  {
    name: "Myoglobin",
    description: "Myoglobin oxygen carrier (Human) - 154 residues",
    uniprotId: "P02144",
    sequence: "MGLSDGEWQLVLNVWGKVEADIPGHGQEVLIRLFKGHPETLEKFDKFKHLKSEDEMKASEDLKKHGATVLTALGGILKKKGHHEAEIKPLAQSHATKHKIPVKYLEFISECIIQVLQSKHPGDFGADAQGAMNKALELFRKDMASNYKELGFQG"
  },
  {
    name: "Ubiquitin",
    description: "Ubiquitin protein tag (Human) - 76 residues",
    uniprotId: "P0CG48",
    sequence: "MQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEGIPPDQQRLIFAGKQLEDGRTLSDYNIQKESTLHLVLRLRGG"
  },
  {
    name: "Lysozyme C",
    description: "Lysozyme C (Human) - 148 residues",
    uniprotId: "P61626",
    sequence: "MKALIVLGLVLLSVTVQGKVFERCELARTLKRLGMDGYRGISLANWMCLAKWESGYNTRATNYNAGDRSTDYGIFQINSRYWCNDGKTPGAVNACHLSCSALLQDNIADAVACAKRVVRDPQGIRAWVAWRNRCQNRDVRQYVQGCGV"
  }
];

export default function SequenceInput({ onFold, isFolding, error }: SequenceInputProps) {
  const [sequence, setSequence] = useState("");
  const [showExamples, setShowExamples] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sequence.trim()) onFold(sequence);
  };

  const loadExample = (seq: string) => {
    setSequence(seq);
    setShowExamples(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl space-y-4 overflow-visible border border-cyan-500/20"
      style={{ backgroundColor: 'rgba(15, 30, 50, 0.8)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          Input Sequence
        </h2>
        <div className="relative z-[200]">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-gray-400 hover:text-cyan-400"
            onClick={() => setShowExamples(!showExamples)}
            data-testid="button-load-example"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Load Example
            <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showExamples ? 'rotate-180' : ''}`} />
          </Button>
          
          <AnimatePresence>
            {showExamples && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-64 max-h-[60vh] overflow-y-auto border border-cyan-500/20 rounded-lg shadow-xl z-[200]"
                style={{ backgroundColor: 'rgba(10, 22, 40, 0.95)' }}
              >
                {exampleSequences.map((ex) => (
                  <button
                    key={ex.name}
                    onClick={() => loadExample(ex.sequence)}
                    className="w-full text-left px-4 py-3 hover:bg-cyan-500/10 border-b border-gray-700/50 last:border-0 transition-colors"
                    data-testid={`example-${ex.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <div className="font-medium text-sm text-white">{ex.name}</div>
                    <div className="text-xs text-gray-400">{ex.description}</div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg opacity-20 group-hover:opacity-50 transition duration-500 blur" />
          <Textarea
            value={sequence}
            onChange={(e) => setSequence(e.target.value)}
            placeholder="PASTE AMINO ACID SEQUENCE (SINGLE-LETTER CODES)..."
            className="relative min-h-[120px] resize-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 font-mono text-sm leading-relaxed tracking-widest uppercase text-cyan-100 placeholder:text-gray-500"
            style={{ backgroundColor: 'rgba(0, 10, 25, 0.6)', borderColor: 'rgba(100, 120, 150, 0.3)' }}
            disabled={isFolding}
            data-testid="textarea-sequence"
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 font-mono">
            {sequence.length > 0 ? `${sequence.replace(/[^A-Za-z]/g, '').length} residues` : 'Enter sequence'}
          </span>
          <Button 
            type="submit" 
            disabled={!sequence.trim() || isFolding}
            className="bg-cyan-500 text-slate-900 hover:bg-cyan-400 font-bold px-8 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,246,255,0.5)]"
            data-testid="button-fold"
          >
            {isFolding ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Predicting...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Predict Structure
              </>
            )}
          </Button>
        </div>
      </form>
      
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="flex gap-4 text-[10px] text-gray-500 font-mono uppercase">
        <span>Max: 2,700 residues</span>
        <span>Format: Single-letter codes</span>
      </div>
    </motion.div>
  );
}
