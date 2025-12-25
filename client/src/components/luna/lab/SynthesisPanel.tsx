import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FlaskConical, 
  Factory, 
  TestTube2, 
  Microscope, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Beaker,
  Truck,
  ClipboardList,
  TrendingUp,
  DollarSign,
  Calendar,
  ChevronRight,
  Download,
  Send,
  Loader2
} from "lucide-react";

interface SynthesisPanelProps {
  selectedCompound?: {
    id: string;
    name: string;
    smiles?: string;
    formula?: string;
  } | null;
  targetProtein?: string;
}

interface SynthesisStep {
  id: string;
  name: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "warning";
  estimatedDays: number;
  cost: string;
  details?: string[];
}

interface CROPartner {
  id: string;
  name: string;
  specialty: string;
  location: string;
  turnaround: string;
  priceRange: string;
  rating: number;
  certifications: string[];
}

const CRO_PARTNERS: CROPartner[] = [
  {
    id: "wuxi",
    name: "WuXi AppTec",
    specialty: "Full-service drug discovery & development",
    location: "Shanghai, China",
    turnaround: "4-8 weeks",
    priceRange: "$5K-50K",
    rating: 4.8,
    certifications: ["GMP", "GLP", "ISO 9001"]
  },
  {
    id: "charles-river",
    name: "Charles River Laboratories",
    specialty: "Preclinical & clinical laboratory services",
    location: "Boston, USA",
    turnaround: "6-12 weeks",
    priceRange: "$10K-100K",
    rating: 4.9,
    certifications: ["GMP", "GLP", "AAALAC"]
  },
  {
    id: "evotec",
    name: "Evotec",
    specialty: "Integrated drug discovery platform",
    location: "Hamburg, Germany",
    turnaround: "8-16 weeks",
    priceRange: "$15K-150K",
    rating: 4.7,
    certifications: ["GMP", "ISO 17025"]
  },
  {
    id: "pharmaron",
    name: "Pharmaron",
    specialty: "Chemistry & biology services",
    location: "Beijing, China",
    turnaround: "3-6 weeks",
    priceRange: "$3K-30K",
    rating: 4.6,
    certifications: ["GMP", "GLP"]
  }
];

export default function SynthesisPanel({ selectedCompound, targetProtein }: SynthesisPanelProps) {
  const [activeTab, setActiveTab] = useState<"synthesis" | "testing" | "cro" | "protocols">("synthesis");
  const [selectedCRO, setSelectedCRO] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [synthesisSteps, setSynthesisSteps] = useState<SynthesisStep[]>([
    {
      id: "route-design",
      name: "Retrosynthetic Route Design",
      description: "AI-assisted synthesis pathway planning",
      status: "completed",
      estimatedDays: 1,
      cost: "$500",
      details: ["Multi-step convergent synthesis", "3 key intermediates identified", "95% theoretical yield"]
    },
    {
      id: "starting-materials",
      name: "Starting Material Procurement",
      description: "Source commercially available precursors",
      status: "completed",
      estimatedDays: 5,
      cost: "$2,000",
      details: ["Sigma-Aldrich", "TCI Chemicals", "Enamine building blocks"]
    },
    {
      id: "scale-up",
      name: "Milligram Scale Synthesis",
      description: "Initial compound synthesis (10-100 mg)",
      status: "in_progress",
      estimatedDays: 10,
      cost: "$5,000",
      details: ["Current yield: 65%", "Purity: 92%", "Optimization ongoing"]
    },
    {
      id: "purification",
      name: "Purification & Characterization",
      description: "HPLC purification, NMR, MS analysis",
      status: "pending",
      estimatedDays: 5,
      cost: "$3,000",
      details: ["Target purity: >98%", "Full characterization package"]
    },
    {
      id: "gram-scale",
      name: "Gram Scale Production",
      description: "Scale-up for testing (1-10 g)",
      status: "pending",
      estimatedDays: 14,
      cost: "$15,000",
      details: ["Process optimization", "Quality control batch"]
    }
  ]);

  const [testingPipeline, setTestingPipeline] = useState([
    {
      id: "biochemical",
      name: "Biochemical Assays",
      tests: [
        { name: "Target binding (IC50)", status: "pending", result: null },
        { name: "Selectivity panel (50 kinases)", status: "pending", result: null },
        { name: "Enzyme inhibition kinetics", status: "pending", result: null }
      ]
    },
    {
      id: "cellular",
      name: "Cell-Based Assays",
      tests: [
        { name: "Cytotoxicity (MTT)", status: "pending", result: null },
        { name: "Target engagement (CETSA)", status: "pending", result: null },
        { name: "Cellular potency (EC50)", status: "pending", result: null }
      ]
    },
    {
      id: "admet",
      name: "ADMET Studies",
      tests: [
        { name: "Microsomal stability", status: "pending", result: null },
        { name: "Plasma protein binding", status: "pending", result: null },
        { name: "hERG inhibition", status: "pending", result: null },
        { name: "CYP450 inhibition", status: "pending", result: null }
      ]
    },
    {
      id: "invivo",
      name: "In Vivo Studies",
      tests: [
        { name: "PK in mice (IV/PO)", status: "pending", result: null },
        { name: "Efficacy in xenograft model", status: "pending", result: null },
        { name: "Maximum tolerated dose", status: "pending", result: null }
      ]
    }
  ]);

  const handleSubmitToCRO = async () => {
    if (!selectedCRO) return;
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSubmitting(false);
    alert(`Request submitted to ${CRO_PARTNERS.find(c => c.id === selectedCRO)?.name}. They will contact you within 24-48 hours.`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "in_progress": return <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-white/30" />;
    }
  };

  const totalCost = synthesisSteps.reduce((sum, step) => {
    const cost = parseInt(step.cost.replace(/[$,]/g, ''));
    return sum + cost;
  }, 0);

  const totalDays = synthesisSteps.reduce((sum, step) => sum + step.estimatedDays, 0);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#0a1628]/95 to-[#0d1d35]/95 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <Factory className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Synthesis & Testing</h2>
            <p className="text-xs text-white/50">Drug manufacturing pipeline & wet lab integration</p>
          </div>
        </div>

        {selectedCompound && (
          <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-1">
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">{selectedCompound.name}</span>
            </div>
            {selectedCompound.formula && (
              <p className="text-xs text-white/60 font-mono">{selectedCompound.formula}</p>
            )}
          </div>
        )}

        <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
          {[
            { id: "synthesis", label: "Synthesis", icon: FlaskConical },
            { id: "testing", label: "Testing", icon: TestTube2 },
            { id: "cro", label: "CRO Partners", icon: Factory },
            { id: "protocols", label: "Protocols", icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-500/30"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {activeTab === "synthesis" && (
            <motion.div
              key="synthesis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-white/60">Timeline</span>
                  </div>
                  <p className="text-lg font-bold text-white">{totalDays} days</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-white/60">Est. Cost</span>
                  </div>
                  <p className="text-lg font-bold text-white">${totalCost.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white/80 flex items-center gap-2">
                  <Beaker className="w-4 h-4" />
                  Synthesis Pipeline
                </h3>
                
                {synthesisSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg border transition-all ${
                      step.status === "in_progress"
                        ? "bg-cyan-500/10 border-cyan-500/30"
                        : step.status === "completed"
                        ? "bg-green-500/10 border-green-500/20"
                        : "bg-white/5 border-white/10"
                    }`}
                    data-testid={`synthesis-step-${step.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getStatusIcon(step.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-white">{step.name}</h4>
                          <span className="text-xs text-white/50">{step.estimatedDays}d</span>
                        </div>
                        <p className="text-xs text-white/60 mb-2">{step.description}</p>
                        {step.details && step.details.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {step.details.map((detail, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                                {detail}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-cyan-300">{step.cost}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "testing" && (
            <motion.div
              key="testing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Microscope className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">Wet Lab Testing Pipeline</span>
                </div>
                <p className="text-xs text-white/60">
                  Comprehensive preclinical testing from biochemical assays to in vivo studies
                </p>
              </div>

              {testingPipeline.map((category, catIndex) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.1 }}
                  className="space-y-2"
                >
                  <h4 className="text-sm font-medium text-white/80">{category.name}</h4>
                  <div className="space-y-1">
                    {category.tests.map((test, testIndex) => (
                      <div
                        key={testIndex}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                        data-testid={`test-${category.id}-${testIndex}`}
                      >
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.status)}
                          <span className="text-sm text-white/80">{test.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          test.status === "completed" ? "bg-green-500/20 text-green-300" :
                          test.status === "in_progress" ? "bg-cyan-500/20 text-cyan-300" :
                          "bg-white/10 text-white/50"
                        }`}>
                          {test.result || (test.status === "pending" ? "Scheduled" : "Running")}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              <button 
                className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 text-green-300 font-medium hover:from-green-500/30 hover:to-cyan-500/30 transition-all flex items-center justify-center gap-2"
                data-testid="btn-initiate-testing"
              >
                <TestTube2 className="w-4 h-4" />
                Initiate Testing Protocol
              </button>
            </motion.div>
          )}

          {activeTab === "cro" && (
            <motion.div
              key="cro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Factory className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-white">Contract Research Organizations</span>
                </div>
                <p className="text-xs text-white/60">
                  Partner with certified labs for synthesis, testing, and regulatory compliance
                </p>
              </div>

              <div className="space-y-3">
                {CRO_PARTNERS.map((cro) => (
                  <motion.div
                    key={cro.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedCRO(selectedCRO === cro.id ? null : cro.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedCRO === cro.id
                        ? "bg-purple-500/15 border-purple-500/40"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                    data-testid={`cro-${cro.id}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-medium text-white">{cro.name}</h4>
                        <p className="text-xs text-white/50">{cro.location}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-yellow-400">★</span>
                        <span className="text-xs text-white/70">{cro.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-white/60 mb-2">{cro.specialty}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {cro.certifications.map(cert => (
                        <span key={cert} className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-300 border border-green-500/20">
                          {cert}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {cro.turnaround}
                      </span>
                      <span className="text-cyan-300 font-medium">{cro.priceRange}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {selectedCRO && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <button
                    onClick={handleSubmitToCRO}
                    disabled={submitting}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    data-testid="btn-submit-cro"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {submitting ? "Submitting..." : "Request Quote from CRO"}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === "protocols" && (
            <motion.div
              key="protocols"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardList className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-white">Standard Operating Procedures</span>
                </div>
                <p className="text-xs text-white/60">
                  Download validated protocols for synthesis and testing workflows
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { name: "Chemical Synthesis Protocol", type: "SOP", pages: 24 },
                  { name: "HPLC Purification Method", type: "Method", pages: 8 },
                  { name: "NMR Characterization Guide", type: "Guide", pages: 12 },
                  { name: "Cell Viability Assay Protocol", type: "SOP", pages: 16 },
                  { name: "Binding Affinity Determination", type: "Method", pages: 10 },
                  { name: "Microsomal Stability Protocol", type: "SOP", pages: 14 },
                  { name: "In Vivo PK Study Design", type: "Template", pages: 20 },
                  { name: "Batch Record Template", type: "Form", pages: 6 }
                ].map((protocol, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all cursor-pointer"
                    data-testid={`protocol-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-orange-400" />
                      <div>
                        <p className="text-sm text-white">{protocol.name}</p>
                        <p className="text-xs text-white/50">{protocol.type} • {protocol.pages} pages</p>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                      <Download className="w-4 h-4 text-white/60" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
