import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "wouter";
import MolstarViewer from "@/components/luna/MolstarViewer";
import PAEHeatmap from "@/components/luna/PAEHeatmap";
import SequenceInput from "@/components/luna/SequenceInput";
import SequenceDisplay from "@/components/luna/SequenceDisplay";
import MetricsPanel from "@/components/luna/MetricsPanel";
import ProcessExplainer from "@/components/luna/ProcessExplainer";
import AnalysisPanel from "@/components/luna/AnalysisPanel";
import NextStepsPanel from "@/components/luna/NextStepsPanel";
import ResidueInsightsPanel from "@/components/luna/ResidueInsightsPanel";
import InsightColumn from "@/components/luna/InsightColumn";
import WorkbenchPanel from "@/components/luna/WorkbenchPanel";
import ResearchToolsPanel from "@/components/luna/ResearchToolsPanel";
import { Header, Footer } from "@/components/layout";
import ParticleBackground, { FloatingOrbs } from "@/components/effects/ParticleBackground";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Share2, Download, Brain, Upload, ExternalLink, Sparkles, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFoldSequence, useUploadAF3, useFoldByUniprotId, isNoStructureError, type PredictionWithAnalysis, type SequenceAnalysis } from "@/hooks/use-predictions";
import { useToast } from "@/hooks/use-toast";
import { getTopProteins, getAllProteins, PROTEIN_COLLECTIONS, type SignificantProtein } from "@shared/protein-collections";
import { ChevronDown, Search } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [isFolding, setIsFolding] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<PredictionWithAnalysis | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<SequenceAnalysis | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [highlightedResidue, setHighlightedResidue] = useState<{ row: number; col: number } | null>(null);
  const [selectedResidue, setSelectedResidue] = useState<{ index: number; aa: string; plddt: number } | null>(null);
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const [pendingSequence, setPendingSequence] = useState<string>("");
  
  const pdbInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const [pdbFile, setPdbFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  
  const foldMutation = useFoldSequence();
  const uploadMutation = useUploadAF3();
  const uniprotMutation = useFoldByUniprotId();
  
  const featuredProteins = getTopProteins(8);
  const allProteins = getAllProteins();
  const [showProteinDropdown, setShowProteinDropdown] = useState(false);
  const [proteinSearchQuery, setProteinSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const filteredProteins = proteinSearchQuery.trim() 
    ? allProteins.filter(p => 
        p.name.toLowerCase().includes(proteinSearchQuery.toLowerCase()) ||
        p.gene.toLowerCase().includes(proteinSearchQuery.toLowerCase()) ||
        p.uniprotId.toLowerCase().includes(proteinSearchQuery.toLowerCase())
      )
    : allProteins;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProteinDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uniprotId = urlParams.get('uniprot');
    if (uniprotId && !currentPrediction && !isFolding) {
      handleLoadProtein(uniprotId);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const handleLoadProtein = async (uniprotId: string) => {
    setIsFolding(true);
    setCurrentPrediction(null);
    setCurrentAnalysis(null);
    setExplanation(null);
    setShowUploadPrompt(false);
    
    try {
      const result = await uniprotMutation.mutateAsync(uniprotId);
      
      if (isNoStructureError(result)) {
        setIsFolding(false);
        toast({ title: "Error", description: "Could not load this protein structure", variant: "destructive" });
        return;
      }
      
      setCurrentPrediction(result);
      setCurrentAnalysis(result.analysis || null);
      setExplanation(result.explanation || null);
      setIsFolding(false);
      
      const proteinInfo = result.proteinName ? ` - ${result.proteinName}` : '';
      toast({ title: "Success", description: `Structure loaded${proteinInfo}` });
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to load protein", variant: "destructive" });
      setIsFolding(false);
    }
  };

  const handlePAEHover = (row: number | null, col: number | null) => {
    if (row !== null && col !== null) {
      setHighlightedResidue({ row, col });
    } else {
      setHighlightedResidue(null);
    }
  };

  const handleResidueSelect = (residue: { index: number; aa: string; plddt: number } | null) => {
    setSelectedResidue(residue);
  };

  const handleFold = async (sequence: string) => {
    setIsFolding(true);
    setCurrentPrediction(null);
    setCurrentAnalysis(null);
    setExplanation(null);
    setShowUploadPrompt(false);
    
    try {
      const result = await foldMutation.mutateAsync({ sequence });
      
      if (isNoStructureError(result)) {
        setIsFolding(false);
        setShowUploadPrompt(true);
        setPendingSequence(sequence);
        setCurrentAnalysis(result.analysis || null);
        toast({ title: "Info", description: "Novel sequence detected. Upload prediction for visualization." });
        return;
      }
      
      setCurrentPrediction(result);
      setCurrentAnalysis(result.analysis || null);
      setExplanation(result.explanation || null);
      setIsFolding(false);
      
      const proteinInfo = result.proteinName ? ` - ${result.proteinName}` : '';
      toast({ title: "Success", description: `Structure prediction complete${proteinInfo}` });
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Folding failed", variant: "destructive" });
      setIsFolding(false);
    }
  };

  const handleUploadAF3 = async () => {
    if (!pdbFile) {
      toast({ title: "Error", description: "Please select a PDB file from AlphaFold 3", variant: "destructive" });
      return;
    }
    
    setIsFolding(true);
    setShowUploadPrompt(false);
    
    try {
      const pdbContent = await pdbFile.text();
      let confidenceJson: string | undefined;
      
      if (jsonFile) {
        confidenceJson = await jsonFile.text();
      }
      
      const result = await uploadMutation.mutateAsync({
        pdbContent,
        confidenceJson,
        sequence: pendingSequence
      });
      
      setCurrentPrediction(result);
      setCurrentAnalysis(result.analysis || null);
      setExplanation(result.explanation || null);
      setIsFolding(false);
      setPdbFile(null);
      setJsonFile(null);
      toast({ title: "Success", description: "AlphaFold 3 structure uploaded and processed!" });
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Upload failed", variant: "destructive" });
      setIsFolding(false);
    }
  };

  const handleComplete = () => {
    setIsFolding(false);
  };

  const handleDownloadPDB = () => {
    if (!currentPrediction?.pdbData) return;
    
    const blob = new Blob([currentPrediction.pdbData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lunafold_${currentPrediction.id}.pdb`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="min-h-screen selection:bg-cyan-500/30 font-sans relative overflow-hidden flex flex-col"
      style={{ backgroundColor: '#0a1628', color: '#f0f4f8' }}
    >
      <ParticleBackground intensity={15} />
      <FloatingOrbs />
      
      <div className="absolute inset-0 z-0 pointer-events-none nebula-bg">
         <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent" />
         <div className="absolute -top-[200px] -right-[200px] w-[900px] h-[900px] bg-cyan-500/15 rounded-full blur-[120px]" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
         <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[100px]" />
         
         {[...Array(10)].map((_, i) => (
           <div
             key={i}
             className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
             style={{
               left: `${10 + (i * 8)}%`,
               top: `${15 + (i * 7) % 70}%`,
               boxShadow: '0 0 8px rgba(0, 246, 255, 0.6)'
             }}
           />
         ))}
         
         <div className="absolute top-20 right-1/4 w-32 h-32 border border-cyan-500/20 rounded-full" />
         <div className="absolute bottom-40 left-1/4 w-24 h-24 border border-purple-500/20 rounded-full" />
      </div>

      <Header />

      <main className="relative z-10 container mx-auto px-4 md:px-6 pt-20 md:pt-24 pb-6 md:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-3 animate-slide-up">
               <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight">
                 <span className="inline-block text-white">Genomic Structure</span>
                 <br />
                 <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,246,255,0.5)]">
                   Prediction Engine
                 </span>
               </h2>
               <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                 Professional 3D protein structure visualization powered by the AlphaFold Database. Real-time GPT-5.2 analysis, pLDDT confidence coloring, and PAE heatmaps. Built by GoldRock AI.
               </p>
               <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                 <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30">
                   <Brain className="w-3 h-3 text-cyan-400" />
                   <span className="text-cyan-400">GoldRock AI</span>
                 </div>
                 <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-500/15 border border-purple-500/30">
                   <span className="text-purple-300">AlphaFold DB</span>
                 </div>
                 <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                   <span className="text-emerald-400">3D Viewer</span>
                 </div>
                 <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/15 border border-amber-500/30">
                   <span className="text-amber-400">GPT-5.2 Analysis</span>
                 </div>
               </div>
            </div>

            <SequenceInput 
              onFold={handleFold} 
              isFolding={isFolding} 
              error={foldMutation.error?.message}
            />
            
            {/* Mobile-only 3D Viewer - appears right after input, before Quick Start */}
            <div className="lg:hidden">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-xs text-gray-200">3D Structure Viewer</span>
                <span className="text-[10px] text-cyan-400/70 font-mono">• Pinch to zoom</span>
              </div>
              <div className="h-[550px] md:h-[580px]">
                <MolstarViewer 
                  folding={isFolding} 
                  prediction={currentPrediction} 
                  analysis={currentAnalysis}
                  onResidueSelect={handleResidueSelect}
                  highlightedResidue={highlightedResidue}
                  selectedResidueIndex={selectedResidue?.index ?? null}
                />
              </div>
            </div>
            
            <AnimatePresence>
              {showUploadPrompt && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 space-y-4"
                  style={{ backgroundColor: 'rgba(0, 246, 255, 0.08)' }}
                >
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-cyan-400">Novel Sequence Detected</h4>
                      <p className="text-xs text-gray-300 mt-1">
                        This appears to be a novel or recently discovered sequence. Generate a prediction using AlphaFold 3, then upload for visualization and analysis.
                      </p>
                    </div>
                  </div>
                  
                  <a 
                    href="https://alphafoldserver.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-cyan-400 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Generate Prediction (Free)
                  </a>
                  
                  <div className="space-y-3 pt-2 border-t border-gray-600/30">
                    <div className="text-xs font-medium text-gray-200">Upload Prediction Results</div>
                    
                    <div className="space-y-2">
                      <input 
                        type="file" 
                        ref={pdbInputRef}
                        accept=".pdb,.cif"
                        className="hidden"
                        onChange={(e) => setPdbFile(e.target.files?.[0] || null)}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs h-9 border-gray-500/40 bg-slate-800/50 text-gray-200 hover:bg-slate-700/50"
                        onClick={() => pdbInputRef.current?.click()}
                      >
                        <Upload className="w-3 h-3 mr-2" />
                        {pdbFile ? pdbFile.name : "Select PDB/CIF file (required)"}
                      </Button>
                      
                      <input 
                        type="file" 
                        ref={jsonInputRef}
                        accept=".json"
                        className="hidden"
                        onChange={(e) => setJsonFile(e.target.files?.[0] || null)}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs h-9 border-gray-500/40 bg-slate-800/50 text-gray-200 hover:bg-slate-700/50"
                        onClick={() => jsonInputRef.current?.click()}
                      >
                        <Upload className="w-3 h-3 mr-2" />
                        {jsonFile ? jsonFile.name : "Select confidence JSON (optional)"}
                      </Button>
                    </div>
                    
                    <Button 
                      className="w-full"
                      disabled={!pdbFile || uploadMutation.isPending}
                      onClick={handleUploadAF3}
                    >
                      {uploadMutation.isPending ? "Processing..." : "Upload & Visualize"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Quick Start - always visible when not folding, appears before viewer on mobile */}
            {!isFolding && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-4 rounded-xl space-y-3 border border-cyan-500/20"
                style={{ backgroundColor: 'rgba(15, 30, 50, 0.8)', backdropFilter: 'blur(12px)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </motion.div>
                    <span className="text-sm font-semibold text-white">Quick Start</span>
                    <span className="text-[10px] text-gray-400 font-mono">({allProteins.length} proteins)</span>
                  </div>
                  <Link href="/discovery">
                    <motion.span 
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1"
                      whileHover={{ x: 3 }}
                      data-testid="link-browse-all"
                    >
                      Browse all
                      <span className="text-xs">→</span>
                    </motion.span>
                  </Link>
                </div>
                
                <div ref={dropdownRef} className="relative z-50">
                  <button
                    onClick={() => setShowProteinDropdown(!showProteinDropdown)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-600/40 hover:border-cyan-500/40 transition-all text-left group"
                    style={{ backgroundColor: 'rgba(20, 40, 60, 0.6)' }}
                    data-testid="btn-protein-dropdown"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Search or select a protein...</span>
                    </div>
                    <motion.div
                      animate={{ rotate: showProteinDropdown ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {showProteinDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 border border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden z-[100]"
                        style={{ maxHeight: "400px", backgroundColor: '#0a1628' }}
                      >
                        <div className="sticky top-0 z-10 p-2 border-b border-gray-700/50" style={{ backgroundColor: '#0a1628' }}>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search proteins..."
                              value={proteinSearchQuery}
                              onChange={(e) => setProteinSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-600/40 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50"
                              style={{ backgroundColor: 'rgba(20, 40, 60, 0.6)' }}
                              data-testid="input-protein-search"
                              autoFocus
                            />
                          </div>
                        </div>
                        
                        <div className="overflow-y-auto" style={{ maxHeight: "340px" }}>
                          {PROTEIN_COLLECTIONS.map((collection) => {
                            const matchingProteins = collection.proteins.filter(p =>
                              !proteinSearchQuery.trim() ||
                              p.name.toLowerCase().includes(proteinSearchQuery.toLowerCase()) ||
                              p.gene.toLowerCase().includes(proteinSearchQuery.toLowerCase()) ||
                              p.uniprotId.toLowerCase().includes(proteinSearchQuery.toLowerCase())
                            );
                            
                            if (matchingProteins.length === 0) return null;
                            
                            return (
                              <div key={collection.id} className="border-b border-gray-700/30 last:border-0">
                                <div className="px-3 py-2 text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-2" style={{ backgroundColor: 'rgba(15, 30, 50, 0.5)' }}>
                                  <span>{collection.icon}</span>
                                  {collection.title}
                                  <span className="text-gray-500">({matchingProteins.length})</span>
                                </div>
                                {matchingProteins.map((protein) => (
                                  <button
                                    key={protein.uniprotId}
                                    onClick={() => {
                                      handleLoadProtein(protein.uniprotId);
                                      setShowProteinDropdown(false);
                                      setProteinSearchQuery("");
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-cyan-500/10 transition-colors group flex items-center gap-3"
                                    data-testid={`dropdown-${protein.uniprotId}`}
                                  >
                                    <div className="w-2 h-2 rounded-full bg-cyan-500/40 group-hover:bg-cyan-400 transition-colors" />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs text-cyan-400">{protein.gene}</span>
                                        <span className="text-[10px] text-gray-500 font-mono">{protein.uniprotId}</span>
                                      </div>
                                      <div className="text-xs text-gray-300 truncate">{protein.name}</div>
                                    </div>
                                    <div className="text-[10px] text-gray-500 font-mono">
                                      {protein.organism}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            );
                          })}
                          
                          {filteredProteins.length === 0 && (
                            <div className="p-4 text-center text-white/40 text-sm">
                              No proteins found matching "{proteinSearchQuery}"
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Featured Proteins</div>
                <div className="grid grid-cols-2 gap-2">
                  {featuredProteins.map((protein, i) => (
                    <motion.button
                      key={protein.uniprotId}
                      initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
                      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: 0.3 + i * 0.1,
                        type: "spring",
                        stiffness: 150
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -4,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLoadProtein(protein.uniprotId)}
                      className="text-left p-3 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all group relative overflow-hidden hover-lift"
                      style={{ backgroundColor: 'rgba(15, 40, 60, 0.6)' }}
                      data-testid={`featured-${protein.uniprotId}`}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" 
                        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px rgba(0,246,255,0.15)" }}
                      />
                      <div className="relative">
                        <div className="font-mono text-[10px] text-cyan-400 mb-0.5 flex items-center gap-1.5">
                          <motion.span 
                            className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                            animate={{ 
                              boxShadow: ["0 0 5px rgba(0,246,255,0.3)", "0 0 15px rgba(0,246,255,0.6)", "0 0 5px rgba(0,246,255,0.3)"]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          {protein.gene}
                        </div>
                        <div className="text-xs text-gray-300 group-hover:text-white truncate transition-colors font-medium">{protein.name}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Analytics sections - appear after Quick Start on mobile */}
            <ProcessExplainer isFolding={isFolding} onComplete={handleComplete} />
            
            <MetricsPanel visible={!!currentPrediction} prediction={currentPrediction} />
            
            {currentPrediction?.proteinName && (
              <div className="rounded-lg p-3 border border-cyan-500/30" style={{ backgroundColor: 'rgba(0, 246, 255, 0.08)' }}>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <Brain className="w-3 h-3" />
                  <span>Prediction Complete</span>
                </div>
                <div className="text-sm text-white font-medium mt-1">
                  {currentPrediction.proteinName}
                </div>
                {currentPrediction.organism && (
                  <div className="text-xs text-gray-400">
                    {currentPrediction.organism}
                  </div>
                )}
                {currentPrediction.modelVersion && (
                  <div className="text-[10px] text-gray-500 mt-1">
                    {currentPrediction.modelVersion}
                  </div>
                )}
              </div>
            )}
            
            <AnalysisPanel analysis={currentAnalysis} explanation={explanation} prediction={currentPrediction} />
            
            {currentPrediction && (
              <NextStepsPanel prediction={currentPrediction} analysis={currentAnalysis} />
            )}
            
            {currentPrediction && (
              <ResearchToolsPanel prediction={currentPrediction} analysis={currentAnalysis} />
            )}
          </div>

          <div className="hidden lg:flex lg:col-span-8 flex-col gap-4">
             {/* Enhanced Platform Statistics */}
             <motion.div 
               className="hidden lg:grid grid-cols-2 lg:grid-cols-4 gap-3"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, staggerChildren: 0.1 }}
             >
               {[
                 { 
                   label: "AI Analysis", 
                   value: "GPT-5.2 Powered", 
                   subtext: "Real-time insights",
                   accent: false, 
                   icon: "🧠", 
                   color: "cyan" 
                 },
                 { 
                   label: "Data Source", 
                   value: "AlphaFold DB", 
                   subtext: "200M+ structures available",
                   accent: false, 
                   icon: "🧬", 
                   color: "purple" 
                 },
                 { 
                   label: "Visualization", 
                   value: "3D Viewer", 
                   subtext: "Interactive 3D rendering",
                   accent: false, 
                   icon: "⚡", 
                   color: "yellow" 
                 },
                 { 
                   label: "Built By", 
                   value: "GoldRock AI", 
                   subtext: "goldrock.ai",
                   accent: true, 
                   icon: "🏢", 
                   color: "green" 
                 },
               ].map((stat, i) => (
                 <motion.div
                   key={stat.label}
                   initial={{ opacity: 0, y: 20, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   transition={{ 
                     duration: 0.4, 
                     delay: i * 0.1,
                     type: "spring",
                     stiffness: 200
                   }}
                   whileHover={{ 
                     scale: 1.05, 
                     y: -4,
                     transition: { duration: 0.2 }
                   }}
                   className={`stat-card group cursor-default hover-glow ${stat.accent ? 'border-primary/30' : ''}`}
                 >
                   <motion.div 
                     className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{
                       background: stat.color === "cyan" 
                         ? "linear-gradient(135deg, rgba(0,240,255,0.1), transparent)"
                         : stat.color === "purple"
                         ? "linear-gradient(135deg, rgba(138,43,226,0.1), transparent)"
                         : stat.color === "yellow"
                         ? "linear-gradient(135deg, rgba(250,204,21,0.1), transparent)"
                         : "linear-gradient(135deg, rgba(34,197,94,0.1), transparent)"
                     }}
                   />
                   <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className={`text-[10px] font-mono uppercase flex items-center gap-1.5 ${stat.accent ? 'text-primary/70' : 'text-white/40'}`}>
                     <motion.span
                       animate={{ rotate: [0, 10, -10, 0] }}
                       transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                     >
                       {stat.icon}
                     </motion.span>
                     {stat.label}
                   </div>
                   <div className={`text-sm font-semibold mt-0.5 ${stat.accent ? 'text-primary' : 'text-white'}`}>
                     {stat.value}
                   </div>
                   <div className="text-[9px] text-white/30 mt-0.5 font-mono">{stat.subtext}</div>
                 </motion.div>
               ))}
             </motion.div>
             
             {/* Secondary Stats Row */}
             <motion.div 
               className="hidden lg:grid grid-cols-6 gap-2"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
             >
               {[
                 { label: "Proteins", value: "53+ Curated", icon: "🧬" },
                 { label: "Categories", value: "10 Types", icon: "📊" },
                 { label: "Analysis", value: "AI-Powered", icon: "🤖" },
                 { label: "Formats", value: "PDB • CIF", icon: "📁" },
                 { label: "Confidence", value: "pLDDT • PAE", icon: "📈" },
                 { label: "Open Source", value: "AlphaFold", icon: "🔬" },
               ].map((stat, i) => (
                 <motion.div
                   key={stat.label}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.6 + i * 0.05 }}
                   className="bg-white/[0.02] border border-white/5 rounded-lg p-2 text-center hover:border-primary/20 transition-colors"
                 >
                   <div className="text-sm">{stat.icon}</div>
                   <div className="text-[10px] font-mono text-white/70">{stat.value}</div>
                   <div className="text-[8px] text-white/30 uppercase">{stat.label}</div>
                 </motion.div>
               ))}
             </motion.div>

             <div className="hidden lg:flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  <span className="font-mono text-sm text-white/70">3D Structure Viewer</span>
               </div>
               
               {currentPrediction && (
                 <div className="flex gap-2">
                   <Link href={`/lab?id=${currentPrediction.id}`}>
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="h-8 text-xs border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200"
                       data-testid="btn-open-lab"
                     >
                       <FlaskConical className="w-3 h-3 mr-2" />
                       Open in Lab
                     </Button>
                   </Link>
                   <Button 
                     variant="outline" 
                     size="sm" 
                     className="h-8 text-xs border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200"
                     onClick={() => {
                       navigator.clipboard.writeText(window.location.href);
                       toast({ title: "Success", description: "Link copied to clipboard!" });
                     }}
                   >
                     <Share2 className="w-3 h-3 mr-2" />
                     Share
                   </Button>
                   <Button 
                     variant="outline" 
                     size="sm" 
                     className="h-8 text-xs border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200"
                     onClick={handleDownloadPDB}
                   >
                     <Download className="w-3 h-3 mr-2" />
                     PDB
                   </Button>
                 </div>
               )}
             </div>

             <div className="hidden lg:grid grid-cols-1 xl:grid-cols-12 gap-4">
               <div className="xl:col-span-8 h-[600px]">
                 <MolstarViewer 
                   folding={isFolding} 
                   prediction={currentPrediction} 
                   analysis={currentAnalysis}
                   onResidueSelect={handleResidueSelect}
                   highlightedResidue={highlightedResidue}
                   selectedResidueIndex={selectedResidue?.index ?? null}
                 />
               </div>
               <div className="xl:col-span-4 flex flex-col gap-4 lg:h-[600px] lg:overflow-y-auto lg:custom-scrollbar">
                 {currentPrediction ? (
                   <>
                     <InsightColumn prediction={currentPrediction} selectedResidue={selectedResidue} />
                     
                     <PAEHeatmap 
                       paeMatrix={currentPrediction?.paeMatrix || null} 
                       sequenceLength={currentPrediction?.sequence?.length || 0}
                       onHover={handlePAEHover}
                       highlightedResidue={selectedResidue?.index ?? null}
                     />
                     
                     <AnimatePresence>
                       {selectedResidue && (
                         <motion.div
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: 10 }}
                           transition={{ duration: 0.2 }}
                         >
                           <ResidueInsightsPanel 
                             residue={selectedResidue}
                             sequence={currentPrediction?.sequence}
                             plddtScores={currentPrediction?.plddtScores ?? undefined}
                             onClose={() => setSelectedResidue(null)}
                           />
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </>
                 ) : (
                   <div className="luna-card p-6 rounded-xl text-center">
                     <div className="text-gray-300 text-sm">
                       Enter a protein sequence or select a featured protein to view structure insights
                     </div>
                   </div>
                 )}
               </div>
             </div>
             
             {currentPrediction && (
               <SequenceDisplay 
                 prediction={currentPrediction}
                 onResidueClick={handleResidueSelect}
                 selectedResidue={selectedResidue}
                 highlightedResidue={highlightedResidue}
               />
             )}
             
             {currentPrediction && (
               <WorkbenchPanel 
                 prediction={currentPrediction}
                 onResidueHighlight={(residues) => {
                   if (residues.length > 0 && currentPrediction?.sequence) {
                     const idx = residues[0];
                     const aa = currentPrediction.sequence[idx] || 'X';
                     const plddt = currentPrediction.plddtScores?.[idx] || 0;
                     setSelectedResidue({ index: idx, aa, plddt });
                   }
                 }}
               />
             )}
             
             </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
