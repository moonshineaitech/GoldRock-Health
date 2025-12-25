import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MolstarViewer from "@/components/luna/MolstarViewer";
import BindingSitePanel from "@/components/luna/lab/BindingSitePanel";
import MutationScanner from "@/components/luna/lab/MutationScanner";
import DockingWorkbench from "@/components/luna/lab/DockingWorkbench";
import DrugScreening from "@/components/luna/lab/DrugScreening";
import ResearchNotebook from "@/components/luna/lab/ResearchNotebook";
import SynthesisPanel from "@/components/luna/lab/SynthesisPanel";
import ParticleBackground, { FloatingOrbs } from "@/components/effects/ParticleBackground";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FlaskConical, 
  Target, 
  Dna, 
  Pill, 
  FileText, 
  ArrowLeft,
  Beaker,
  Activity,
  Layers,
  Factory
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Prediction } from "@shared/schema";
import { usePrediction } from "@/hooks/use-predictions";

type LabTab = "binding" | "mutations" | "docking" | "screening" | "synthesis" | "notebook";

interface SelectedBindingSite {
  volume: number;
  hydrophobicity: number;
  residues: number[];
}

interface DemoProtein {
  name: string;
  uniprotId: string;
  description: string;
  category: string;
}

const DEMO_PROTEINS: DemoProtein[] = [
  // ═══════════════════════════════════════════════════════════════════
  // BIODEFENSE - THREAT AGENT TARGETS (Category A Priority Pathogens)
  // ═══════════════════════════════════════════════════════════════════
  { name: "ACE2 Receptor", uniprotId: "Q9BYF1", description: "SARS-CoV-2/coronavirus entry. Critical pandemic countermeasure target.", category: "Biodefense" },
  { name: "TMPRSS2 Protease", uniprotId: "O15393", description: "Viral spike activation. Broad-spectrum antiviral target.", category: "Biodefense" },
  { name: "Furin Protease", uniprotId: "P09958", description: "Pathogen activation enzyme. Anthrax/Ebola processing.", category: "Biodefense" },
  { name: "Cathepsin L", uniprotId: "P07711", description: "Viral entry protease. SARS/Ebola membrane fusion.", category: "Biodefense" },
  { name: "Cathepsin B", uniprotId: "P07858", description: "Lysosomal protease. Pathogen escape mechanism.", category: "Biodefense" },
  { name: "TLR4 Receptor", uniprotId: "O00206", description: "Bacterial endotoxin sensor. Sepsis countermeasure.", category: "Biodefense" },
  { name: "TLR7 Receptor", uniprotId: "Q9NYK1", description: "Viral RNA sensor. Innate immune activation.", category: "Biodefense" },
  { name: "TLR9 Receptor", uniprotId: "Q9NR96", description: "Bacterial DNA sensor. Adjuvant target for vaccines.", category: "Biodefense" },
  { name: "NLRP3 Inflammasome", uniprotId: "Q96P20", description: "Cytokine storm driver. Sepsis/pathogen response.", category: "Biodefense" },
  { name: "Caspase-1", uniprotId: "P29466", description: "IL-1β activation. Inflammation cascade control.", category: "Biodefense" },
  { name: "IL-1 Beta", uniprotId: "P01584", description: "Fever/inflammation mediator. Cytokine storm target.", category: "Biodefense" },
  { name: "Interferon Alpha", uniprotId: "P01562", description: "Antiviral cytokine. Broad-spectrum defense activation.", category: "Biodefense" },
  { name: "Interferon Gamma", uniprotId: "P01579", description: "Macrophage activation. Intracellular pathogen defense.", category: "Biodefense" },
  { name: "CD14 Receptor", uniprotId: "P08571", description: "LPS co-receptor. Gram-negative sepsis target.", category: "Biodefense" },
  { name: "MD-2 (LY96)", uniprotId: "Q9Y6Y9", description: "TLR4 co-receptor. Endotoxin recognition.", category: "Biodefense" },
  
  // ═══════════════════════════════════════════════════════════════════
  // BIODEFENSE - HOST INVASION FACTORS
  // ═══════════════════════════════════════════════════════════════════
  { name: "CD4 Receptor", uniprotId: "P01730", description: "HIV entry receptor. T-cell targeting countermeasure.", category: "Biodefense" },
  { name: "CCR5 Co-receptor", uniprotId: "P51681", description: "HIV co-receptor. Maraviroc binding site.", category: "Biodefense" },
  { name: "CXCR4 Co-receptor", uniprotId: "P61073", description: "HIV X4-tropic entry. Dual-tropic virus target.", category: "Biodefense" },
  { name: "DC-SIGN (CD209)", uniprotId: "Q9NNX6", description: "Pathogen capture receptor. Dengue/Ebola attachment.", category: "Biodefense" },
  { name: "Integrin Alpha-V", uniprotId: "P06756", description: "Viral attachment factor. Multiple pathogen entry.", category: "Biodefense" },
  { name: "Sialic Acid Receptor", uniprotId: "Q9BZZ2", description: "Influenza attachment. Pandemic flu countermeasure.", category: "Biodefense" },
  { name: "Neuropilin-1", uniprotId: "O14786", description: "SARS-CoV-2 co-factor. Enhanced viral entry.", category: "Biodefense" },
  { name: "LAMP1", uniprotId: "P11279", description: "Lysosomal escape factor. Intracellular pathogen survival.", category: "Biodefense" },
  
  // ═══════════════════════════════════════════════════════════════════
  // CHEMICAL DEFENSE - NERVE AGENT COUNTERMEASURES
  // ═══════════════════════════════════════════════════════════════════
  { name: "Acetylcholinesterase", uniprotId: "P22303", description: "Nerve agent target. Sarin/VX binding site analysis.", category: "Chemical Defense" },
  { name: "Butyrylcholinesterase", uniprotId: "P06276", description: "Nerve agent bioscavenger. Prophylactic countermeasure.", category: "Chemical Defense" },
  { name: "Paraoxonase-1", uniprotId: "P27169", description: "Organophosphate hydrolysis. Detoxification enzyme.", category: "Chemical Defense" },
  { name: "Muscarinic M1 Receptor", uniprotId: "P11229", description: "Cholinergic signaling. Atropine target site.", category: "Chemical Defense" },
  { name: "Muscarinic M2 Receptor", uniprotId: "P08172", description: "Cardiac cholinergic. Nerve agent cardiac effects.", category: "Chemical Defense" },
  { name: "Nicotinic AChR Alpha", uniprotId: "P02708", description: "Neuromuscular junction. Paralytic agent target.", category: "Chemical Defense" },
  { name: "GABA-A Receptor", uniprotId: "P14867", description: "CNS inhibition. Seizure control in nerve agent exposure.", category: "Chemical Defense" },
  { name: "Glutamate Receptor", uniprotId: "Q05586", description: "Excitotoxicity mediator. Neuroprotection target.", category: "Chemical Defense" },
  
  // ═══════════════════════════════════════════════════════════════════
  // TOXIN NEUTRALIZATION
  // ═══════════════════════════════════════════════════════════════════
  { name: "Ricin A Chain Receptor", uniprotId: "P02879", description: "Plant toxin entry. Bioterrorism countermeasure.", category: "Toxin Defense" },
  { name: "Shiga Toxin Receptor", uniprotId: "Q14126", description: "Bacterial toxin binding. Food safety defense.", category: "Toxin Defense" },
  { name: "Anthrax Receptor TEM8", uniprotId: "Q9H6X2", description: "Anthrax toxin entry. Category A threat neutralization.", category: "Toxin Defense" },
  { name: "Anthrax Receptor CMG2", uniprotId: "P59509", description: "Primary anthrax receptor. Therapeutic antibody target.", category: "Toxin Defense" },
  { name: "Diphtheria Toxin Receptor", uniprotId: "P21589", description: "HB-EGF precursor. Toxin entry mechanism.", category: "Toxin Defense" },
  { name: "Clostridium Toxin Receptor", uniprotId: "O15427", description: "Botulinum/tetanus binding. Neurotoxin defense.", category: "Toxin Defense" },
  
  // ═══════════════════════════════════════════════════════════════════
  // RADIATION COUNTERMEASURES
  // ═══════════════════════════════════════════════════════════════════
  { name: "p53 Tumor Suppressor", uniprotId: "P04637", description: "DNA damage response. Radiation injury control.", category: "Radiation Defense" },
  { name: "ATM Kinase", uniprotId: "Q13315", description: "DNA double-strand break sensor. Radioprotection.", category: "Radiation Defense" },
  { name: "DNA-PK Catalytic", uniprotId: "P78527", description: "Non-homologous end joining. DNA repair enhancement.", category: "Radiation Defense" },
  { name: "PARP-1", uniprotId: "P09874", description: "DNA repair enzyme. Radiation injury treatment.", category: "Radiation Defense" },
  { name: "Ku70 Protein", uniprotId: "P12956", description: "DNA repair complex. Radiation resistance.", category: "Radiation Defense" },
  { name: "Ku80 Protein", uniprotId: "P13010", description: "DNA-PK regulatory. Double-strand break repair.", category: "Radiation Defense" },
  { name: "Thrombopoietin", uniprotId: "P40225", description: "Platelet production. Radiation-induced thrombocytopenia.", category: "Radiation Defense" },
  { name: "G-CSF", uniprotId: "P09919", description: "Neutrophil production. Radiation injury treatment.", category: "Radiation Defense" },
  { name: "EPO (Erythropoietin)", uniprotId: "P01588", description: "Red blood cell production. Radiation anemia treatment.", category: "Radiation Defense" },
  
  // ═══════════════════════════════════════════════════════════════════
  // PERFORMANCE ENHANCEMENT - WARFIGHTER OPTIMIZATION
  // ═══════════════════════════════════════════════════════════════════
  { name: "HIF-1 Alpha", uniprotId: "Q16665", description: "Hypoxia adaptation. High-altitude performance.", category: "Performance" },
  { name: "VEGF-A", uniprotId: "P15692", description: "Angiogenesis factor. Wound healing acceleration.", category: "Performance" },
  { name: "Myostatin", uniprotId: "O14793", description: "Muscle growth inhibitor. Strength enhancement target.", category: "Performance" },
  { name: "Follistatin", uniprotId: "P19883", description: "Myostatin antagonist. Muscle preservation.", category: "Performance" },
  { name: "IGF-1", uniprotId: "P05019", description: "Growth factor. Tissue regeneration and recovery.", category: "Performance" },
  { name: "Orexin Receptor 1", uniprotId: "O43613", description: "Wakefulness regulation. Fatigue countermeasure.", category: "Performance" },
  { name: "Orexin Receptor 2", uniprotId: "O43614", description: "Sleep-wake control. Extended operations support.", category: "Performance" },
  { name: "Adenosine A2A Receptor", uniprotId: "P29274", description: "Caffeine target. Alertness enhancement.", category: "Performance" },
  { name: "Dopamine D2 Receptor", uniprotId: "P14416", description: "Motivation/reward. Cognitive performance.", category: "Performance" },
  { name: "BDNF", uniprotId: "P23560", description: "Neuroplasticity factor. Learning enhancement.", category: "Performance" },
  { name: "NGF", uniprotId: "P01138", description: "Nerve growth factor. Peripheral nerve regeneration.", category: "Performance" },
  { name: "TrkB Receptor", uniprotId: "Q16620", description: "BDNF receptor. Cognitive enhancement target.", category: "Performance" },
  
  // ═══════════════════════════════════════════════════════════════════
  // TRAUMA & WOUND HEALING
  // ═══════════════════════════════════════════════════════════════════
  { name: "Thrombin", uniprotId: "P00734", description: "Blood clotting cascade. Hemorrhage control.", category: "Trauma Medicine" },
  { name: "Fibrinogen Alpha", uniprotId: "P02671", description: "Clot formation. Traumatic bleeding control.", category: "Trauma Medicine" },
  { name: "Factor VII", uniprotId: "P08709", description: "Coagulation initiator. Battlefield hemostasis.", category: "Trauma Medicine" },
  { name: "Factor VIII", uniprotId: "P00451", description: "Clotting factor. Severe hemorrhage treatment.", category: "Trauma Medicine" },
  { name: "TGF-Beta 1", uniprotId: "P01137", description: "Wound healing regulator. Scar prevention.", category: "Trauma Medicine" },
  { name: "PDGF-BB", uniprotId: "P01127", description: "Tissue repair factor. Accelerated healing.", category: "Trauma Medicine" },
  { name: "EGF", uniprotId: "P01133", description: "Epithelial growth. Burn wound treatment.", category: "Trauma Medicine" },
  { name: "FGF-2 Basic", uniprotId: "P09038", description: "Angiogenesis/repair. Chronic wound healing.", category: "Trauma Medicine" },
  
  // ═══════════════════════════════════════════════════════════════════
  // IMMUNE MODULATION - VACCINE ENHANCEMENT
  // ═══════════════════════════════════════════════════════════════════
  { name: "TNF-alpha", uniprotId: "P01375", description: "Inflammation mediator. Cytokine storm control.", category: "Immunology" },
  { name: "Interleukin-6", uniprotId: "P05231", description: "Acute phase response. Sepsis/cytokine storm.", category: "Immunology" },
  { name: "Interleukin-2", uniprotId: "P60568", description: "T-cell proliferation. Vaccine adjuvant target.", category: "Immunology" },
  { name: "Interleukin-12 p35", uniprotId: "P29459", description: "Th1 immunity driver. Vaccine enhancement.", category: "Immunology" },
  { name: "Interleukin-15", uniprotId: "P40933", description: "NK cell activation. Antiviral immunity.", category: "Immunology" },
  { name: "CD80 (B7-1)", uniprotId: "P33681", description: "T-cell costimulation. Vaccine potentiation.", category: "Immunology" },
  { name: "CD86 (B7-2)", uniprotId: "P42081", description: "Immune checkpoint. Adjuvant mechanism.", category: "Immunology" },
  { name: "PD-1", uniprotId: "Q15116", description: "Immune checkpoint. Exhaustion reversal.", category: "Immunology" },
  { name: "PD-L1", uniprotId: "Q9NZQ7", description: "Immune evasion ligand. Checkpoint blockade.", category: "Immunology" },
  { name: "CTLA-4", uniprotId: "P16410", description: "T-cell inhibition. Immune activation control.", category: "Immunology" },
  { name: "CD40 Ligand", uniprotId: "P29965", description: "B-cell activation. Vaccine response enhancement.", category: "Immunology" },
  { name: "STING Protein", uniprotId: "Q86WV6", description: "DNA sensing pathway. Vaccine adjuvant target.", category: "Immunology" },
  
  // ═══════════════════════════════════════════════════════════════════
  // BIOSURVEILLANCE MARKERS
  // ═══════════════════════════════════════════════════════════════════
  { name: "Procalcitonin", uniprotId: "P01258", description: "Bacterial infection marker. Rapid diagnostics.", category: "Biosurveillance" },
  { name: "C-Reactive Protein", uniprotId: "P02741", description: "Inflammation marker. Infection detection.", category: "Biosurveillance" },
  { name: "Ferritin Heavy Chain", uniprotId: "P02794", description: "Iron storage/inflammation. Severe infection marker.", category: "Biosurveillance" },
  { name: "LDH-A", uniprotId: "P00338", description: "Tissue damage marker. Injury severity assessment.", category: "Biosurveillance" },
  { name: "D-Dimer Fragment", uniprotId: "P02751", description: "Coagulation marker. Sepsis/DIC detection.", category: "Biosurveillance" },
  { name: "Troponin I Cardiac", uniprotId: "P19429", description: "Cardiac injury marker. Toxic exposure detection.", category: "Biosurveillance" },
  { name: "S100B Protein", uniprotId: "P04271", description: "Brain injury marker. TBI assessment.", category: "Biosurveillance" },
  { name: "NSE (Enolase 2)", uniprotId: "P09104", description: "Neuronal damage marker. Nerve agent exposure.", category: "Biosurveillance" },
  
  // ═══════════════════════════════════════════════════════════════════
  // STANDARD DRUG TARGETS (Original categories maintained)
  // ═══════════════════════════════════════════════════════════════════
  { name: "Insulin Receptor", uniprotId: "P06213", description: "Diabetes target. Metabolic performance optimization.", category: "Metabolic" },
  { name: "EGFR Kinase", uniprotId: "P00533", description: "Oncology target. Radiation sensitizer research.", category: "Oncology" },
  { name: "BRCA1 DNA Repair", uniprotId: "P38398", description: "DNA repair. Radiation sensitivity assessment.", category: "Oncology" },
  { name: "Tau Protein", uniprotId: "P10636", description: "Neurodegeneration. TBI-related pathology.", category: "Neurology" },
  { name: "HER2/ERBB2", uniprotId: "P04626", description: "Cancer marker. Radiation therapy enhancement.", category: "Oncology" },
  { name: "BCR-ABL Kinase", uniprotId: "P00519", description: "Leukemia target. Radiation-induced cancer.", category: "Oncology" },
  { name: "KRAS", uniprotId: "P01116", description: "Oncogene. Radiation resistance mechanisms.", category: "Oncology" },
  { name: "CD20", uniprotId: "P11836", description: "B-cell marker. Radioimmunotherapy target.", category: "Oncology" },
  { name: "Beta-Amyloid (APP)", uniprotId: "P05067", description: "Neurodegeneration. Blast-induced TBI research.", category: "Neurology" },
  { name: "Alpha-Synuclein", uniprotId: "P37840", description: "Neurodegeneration. Environmental toxin exposure.", category: "Neurology" },
  { name: "Huntingtin", uniprotId: "P42858", description: "Neurodegeneration. Genetic vulnerability.", category: "Neurology" },
  { name: "ACE (Angiotensin)", uniprotId: "P12821", description: "Blood pressure. Altitude adaptation.", category: "Cardiovascular" },
  { name: "Beta-2 Adrenergic", uniprotId: "P07550", description: "Bronchodilation. Respiratory performance.", category: "Respiratory" },
  { name: "BRAF Kinase", uniprotId: "P15056", description: "Melanoma target. UV radiation exposure.", category: "Oncology" },
  { name: "JAK2 Kinase", uniprotId: "O60674", description: "Immune signaling. Inflammatory response.", category: "Immunology" },
  { name: "COX-2", uniprotId: "P35354", description: "Inflammation. Field analgesia target.", category: "Immunology" },
  { name: "VEGF Receptor 2", uniprotId: "P35968", description: "Angiogenesis. Wound healing acceleration.", category: "Oncology" },
  { name: "DPP-4", uniprotId: "P27487", description: "Glucose regulation. Metabolic endurance.", category: "Metabolic" },
];

interface DemoProteinCardProps {
  name: string;
  uniprotId: string;
  description: string;
  category: string;
  onSelect: (uniprotId: string) => void;
}

function DemoProteinCard({ name, uniprotId, description, category, onSelect }: DemoProteinCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = async () => {
    setIsLoading(true);
    await onSelect(uniprotId);
    setIsLoading(false);
  };
  
  const categoryColors: Record<string, string> = {
    // Standard Medical Categories
    "Metabolic": "bg-blue-500/20 text-blue-400",
    "Oncology": "bg-red-500/20 text-red-400",
    "Infectious Disease": "bg-green-500/20 text-green-400",
    "Neurology": "bg-purple-500/20 text-purple-400",
    "Immunology": "bg-orange-500/20 text-orange-400",
    "Cardiovascular": "bg-pink-500/20 text-pink-400",
    "Respiratory": "bg-cyan-500/20 text-cyan-400",
    // Defense Categories
    "Biodefense": "bg-amber-500/20 text-amber-400",
    "Chemical Defense": "bg-yellow-500/20 text-yellow-300",
    "Toxin Defense": "bg-rose-500/20 text-rose-400",
    "Radiation Defense": "bg-violet-500/20 text-violet-400",
    "Performance": "bg-emerald-500/20 text-emerald-400",
    "Trauma Medicine": "bg-red-600/20 text-red-300",
    "Biosurveillance": "bg-sky-500/20 text-sky-400",
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      disabled={isLoading}
      className="glass-card p-5 rounded-xl text-left hover:border-purple-500/40 transition-all border border-transparent disabled:opacity-50"
      data-testid={`demo-protein-${uniprotId}`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${categoryColors[category] || 'bg-white/10 text-white/60'}`}>
          {category}
        </span>
        <span className="text-xs font-mono text-primary">{uniprotId}</span>
      </div>
      <h4 className="font-display font-semibold text-white mb-1">{name}</h4>
      <p className="text-xs text-white/50 mb-3">{description}</p>
      {isLoading ? (
        <div className="flex items-center gap-2 text-xs text-purple-400">
          <div className="w-3 h-3 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
          Loading structure...
        </div>
      ) : (
        <div className="text-xs text-purple-400 flex items-center gap-1">
          <Target className="w-3 h-3" />
          Click to analyze
        </div>
      )}
    </motion.button>
  );
}

const TAB_CONFIG: { id: LabTab; label: string; icon: any; description: string }[] = [
  { id: "binding", label: "Binding Sites", icon: Target, description: "Detect and analyze druggable pockets" },
  { id: "mutations", label: "Mutations", icon: Dna, description: "Predict mutation effects on stability" },
  { id: "docking", label: "Docking", icon: Beaker, description: "Screen compounds against binding sites" },
  { id: "screening", label: "Drug Screening", icon: Pill, description: "Evaluate drug-likeness and ADMET" },
  { id: "synthesis", label: "Synthesis", icon: Factory, description: "Drug manufacturing & wet lab testing" },
  { id: "notebook", label: "Notebook", icon: FileText, description: "Document experiments and findings" },
];

export default function Lab() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<LabTab>("binding");
  const [predictionId, setPredictionId] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [selectedResidues, setSelectedResidues] = useState<number[]>([]);
  const [selectedBindingSite, setSelectedBindingSite] = useState<SelectedBindingSite | null>(null);
  const [ligandPose, setLigandPose] = useState<{
    pdb: string;
    name: string;
    affinity: number;
    interactions: {
      hBonds: { donor: string; acceptor: string; distance: number }[];
      hydrophobic: { residue: string; atom: string; distance: number }[];
      piStacking: { residue: string; type: string; distance: number }[];
      saltBridges: { residue: string; atom: string; distance: number }[];
    };
  } | null>(null);
  
  const { data: fetchedPrediction, isLoading, isError } = usePrediction(predictionId);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      setPredictionId(parseInt(id, 10));
    }
  }, []);

  useEffect(() => {
    if (fetchedPrediction) {
      setPrediction(fetchedPrediction);
    }
  }, [fetchedPrediction]);

  const loadDemoProtein = async (uniprotId: string) => {
    try {
      const response = await fetch("/api/predictions/fold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequence: uniprotId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setPrediction(data);
        setPredictionId(data.id);
        window.history.replaceState({}, '', `/lab?id=${data.id}`);
      } else {
        const error = await response.json();
        console.error("Failed to load demo protein:", error);
      }
    } catch (error) {
      console.error("Error loading demo protein:", error);
    }
  };

  const handleResidueHighlight = (residues: number[]) => {
    setSelectedResidues(residues);
  };

  const handleBindingSiteSelect = (site: { volume: number; hydrophobicity: number; residues: number[] } | null) => {
    setSelectedBindingSite(site);
  };
  
  const handleShowLigandPose = (poseData: typeof ligandPose) => {
    setLigandPose(poseData);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col overflow-hidden">
      <ParticleBackground intensity={15} />
      <FloatingOrbs />
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-500/8 to-transparent" />
        <div className="absolute -top-[200px] -left-[200px] w-[800px] h-[800px] bg-purple-500/12 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[100px]" />
      </div>

      <Header />

      <main className="relative z-10 flex-1 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="text-white/50 hover:text-white"
              data-testid="btn-back-home"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Structure
            </Button>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-purple-400" />
              <h1 className="text-xl font-display font-bold">LunaFold Lab</h1>
            </div>
          </div>
          
          {prediction && (
            <div className="flex items-center gap-3 text-sm">
              <div className="text-white/50">Working on:</div>
              <div className="font-mono text-primary">
                {prediction.proteinName || prediction.uniprotId || `Prediction #${prediction.id}`}
              </div>
            </div>
          )}
        </div>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 rounded-2xl text-center max-w-2xl mx-auto mt-20"
          >
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <h2 className="text-xl font-display font-bold mb-2">Loading Structure...</h2>
            <p className="text-white/50">Preparing your research workspace</p>
          </motion.div>
        )}

        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 rounded-2xl text-center max-w-2xl mx-auto mt-20 border border-red-500/30"
          >
            <FlaskConical className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-2xl font-display font-bold mb-4">Could Not Load Structure</h2>
            <p className="text-white/60 mb-8">
              The requested protein structure could not be found. Please try loading a different structure.
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-purple-500 hover:bg-purple-600"
              data-testid="btn-retry-load"
            >
              Back to Home
            </Button>
          </motion.div>
        )}

        {!prediction && !isLoading && !isError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-4xl mx-auto mt-10"
          >
            <div className="glass-card p-8 rounded-2xl text-center">
              <FlaskConical className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <h2 className="text-2xl font-display font-bold mb-4">Welcome to LunaFold Lab</h2>
              <p className="text-white/60 mb-6">
                Start with a demo protein below or load your own structure.
              </p>
              <Button
                onClick={() => setLocation("/")}
                variant="outline"
                className="border-white/20"
                data-testid="btn-load-structure"
              >
                Load Custom Structure
              </Button>
            </div>
            
            <div>
              <h3 className="text-lg font-display font-semibold mb-4 text-center">Try Demo Proteins</h3>
              <p className="text-sm text-white/50 text-center mb-6">{DEMO_PROTEINS.length} verified drug targets from AlphaFold Database</p>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                {DEMO_PROTEINS.map((protein) => (
                  <DemoProteinCard
                    key={protein.uniprotId}
                    name={protein.name}
                    uniprotId={protein.uniprotId}
                    description={protein.description}
                    category={protein.category}
                    onSelect={loadDemoProtein}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {prediction && (
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
            <div className="col-span-3 space-y-4">
              <div className="glass-card p-4 rounded-xl">
                <div className="text-[10px] text-white/40 font-mono uppercase mb-3">Lab Workflows</div>
                <div className="space-y-1">
                  {TAB_CONFIG.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? "bg-purple-500/20 border border-purple-500/40 text-white"
                          : "bg-white/5 border border-transparent hover:bg-white/10 text-white/70"
                      }`}
                      data-testid={`tab-${tab.id}`}
                    >
                      <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-purple-400" : ""}`} />
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium">{tab.label}</div>
                        <div className="text-[10px] text-white/40">{tab.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl">
                <div className="text-[10px] text-white/40 font-mono uppercase mb-3">Structure Info</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Residues</span>
                    <span className="font-mono text-white">{prediction.sequence?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Confidence</span>
                    <span className="font-mono text-primary">{prediction.confidenceScore?.toFixed(1) || "—"}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Source</span>
                    <span className="font-mono text-white/70">{prediction.source || "Unknown"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-5 glass-card rounded-xl overflow-hidden">
              <MolstarViewer
                folding={false}
                prediction={prediction}
                analysis={null}
                highlightedResidues={selectedResidues}
                ligandPose={ligandPose}
              />
              
              {ligandPose && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm border border-primary/30 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Beaker className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm font-medium text-white">
                          Docked: {ligandPose.name}
                        </div>
                        <div className="text-xs text-primary font-mono">
                          Affinity: {ligandPose.affinity.toFixed(1)} kcal/mol
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setLigandPose(null)}
                      className="text-white/50 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors"
                    >
                      Clear Ligand
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="col-span-4 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "binding" && (
                    <BindingSitePanel 
                      prediction={prediction} 
                      onResidueHighlight={handleResidueHighlight}
                      onBindingSiteSelect={handleBindingSiteSelect}
                    />
                  )}
                  {activeTab === "mutations" && (
                    <MutationScanner 
                      prediction={prediction}
                      onResidueHighlight={handleResidueHighlight}
                    />
                  )}
                  {activeTab === "docking" && (
                    <DockingWorkbench 
                      prediction={prediction}
                      bindingSite={selectedBindingSite ? {
                        ...selectedBindingSite,
                        centerX: 0,
                        centerY: 0,
                        centerZ: 0,
                      } : undefined}
                      onShowLigandPose={handleShowLigandPose}
                    />
                  )}
                  {activeTab === "screening" && (
                    <DrugScreening />
                  )}
                  {activeTab === "synthesis" && (
                    <SynthesisPanel 
                      targetProtein={prediction.proteinName || prediction.uniprotId || undefined}
                    />
                  )}
                  {activeTab === "notebook" && (
                    <ResearchNotebook 
                      predictionId={prediction.id}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
