import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Beaker, 
  Search, 
  Plus, 
  Play, 
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Trash2,
  ChevronDown,
  Database,
  Target,
  Filter,
  Globe,
  Sparkles,
  Eye,
  Atom,
  Zap,
  Link2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Prediction } from "@shared/schema";

interface DockingPose {
  rank: number;
  affinity: number;
  rmsdLB: number;
  rmsdUB: number;
  ligandPdb: string;
  interactions: {
    hBonds: { donor: string; acceptor: string; distance: number }[];
    hydrophobic: { residue: string; atom: string; distance: number }[];
    piStacking: { residue: string; type: string; distance: number }[];
    saltBridges: { residue: string; atom: string; distance: number }[];
  };
}

interface DockingResult {
  compound: { id: string; name: string; smiles: string };
  bestAffinity: number;
  poseCount: number;
  poses: DockingPose[];
  disclaimer: string;
}

interface DockingWorkbenchProps {
  prediction: Prediction;
  bindingSite?: {
    id?: string;
    pocketId?: string;
    volume: number;
    hydrophobicity: number;
    druggabilityScore?: number;
    residues: number[];
    centerX?: number;
    centerY?: number;
    centerZ?: number;
  };
  onShowLigandPose?: (poseData: { pdb: string; name: string; affinity: number; interactions: DockingPose['interactions'] }) => void;
}

interface Compound {
  id: string;
  name: string;
  smiles: string;
  mw: number;
  logP?: number;
  hbdCount?: number;
  hbaCount?: number;
  source?: string;
  sourceId?: string;
  category?: string;
  bioactivity?: {
    targetName?: string;
    activityType?: string;
    value?: number;
    unit?: string;
  }[];
}

interface DockingJob {
  id: string;
  compound: Compound;
  status: "pending" | "running" | "completed" | "failed";
  affinity?: number;
  poses?: number;
  startedAt?: Date;
  completedAt?: Date;
  dockingResult?: DockingResult;
}

type SearchMode = "name" | "target" | "similarity" | "binding-site";

async function runDockingSimulation(
  compound: Compound, 
  bindingSite: DockingWorkbenchProps['bindingSite']
): Promise<DockingResult> {
  const response = await fetch('/api/docking/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      compound: {
        id: compound.id,
        name: compound.name,
        smiles: compound.smiles,
        mw: compound.mw,
        logP: compound.logP,
      },
      bindingSite: bindingSite ? {
        id: bindingSite.id || bindingSite.pocketId,
        centerX: bindingSite.centerX,
        centerY: bindingSite.centerY,
        centerZ: bindingSite.centerZ,
        volume: bindingSite.volume,
        hydrophobicity: bindingSite.hydrophobicity,
        druggabilityScore: bindingSite.druggabilityScore,
        residues: bindingSite.residues,
      } : { centerX: 0, centerY: 0, centerZ: 0, volume: 300, residues: [] },
    }),
  });
  
  if (!response.ok) {
    throw new Error('Docking simulation failed');
  }
  
  return response.json();
}

export default function DockingWorkbench({ prediction, bindingSite, onShowLigandPose }: DockingWorkbenchProps) {
  const [searchMode, setSearchMode] = useState<SearchMode>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [targetName, setTargetName] = useState("");
  const [smilesQuery, setSmilesQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Compound[]>([]);
  const [selectedCompounds, setSelectedCompounds] = useState<Compound[]>([]);
  const [jobs, setJobs] = useState<DockingJob[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPose, setSelectedPose] = useState<{ jobId: string; poseRank: number } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    maxMW: 600,
    maxLogP: 5,
    maxHBD: 5,
    maxHBA: 10,
  });

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);
    setSearchError(null);

    try {
      let endpoint = "";
      let body: any = { limit: 30 };

      if (searchMode === "name" && searchQuery) {
        endpoint = "/api/compounds/search";
        body = { 
          query: searchQuery, 
          maxMW: filters.maxMW,
          maxLogP: filters.maxLogP,
          maxHBD: filters.maxHBD,
          maxHBA: filters.maxHBA,
          limit: 30 
        };
      } else if (searchMode === "target" && targetName) {
        endpoint = "/api/compounds/target-search";
        body = { 
          targetName, 
          activityThreshold: 10,
          limit: 25 
        };
      } else if (searchMode === "similarity" && smilesQuery) {
        endpoint = "/api/compounds/similarity-search";
        body = { 
          smiles: smilesQuery, 
          threshold: 0.7,
          limit: 25 
        };
      } else if (searchMode === "binding-site" && bindingSite) {
        endpoint = "/api/compounds/binding-site-query";
        body = {
          volume: bindingSite.volume,
          hydrophobicity: bindingSite.hydrophobicity,
          residues: bindingSite.residues,
        };
      } else {
        setIsSearching(false);
        return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        const compounds = data.compounds || data;
        if (compounds.length === 0) {
          setSearchError("No compounds found matching your criteria. Try adjusting the filters or search terms.");
        } else {
          setSearchResults(compounds.map((c: any) => ({
            id: c.id,
            name: c.name,
            smiles: c.smiles,
            mw: c.molecularWeight || c.mw || 0,
            logP: c.logP,
            hbdCount: c.hbdCount,
            hbaCount: c.hbaCount,
            source: c.source,
            sourceId: c.sourceId,
            bioactivity: c.bioactivity,
          })));
        }
      } else {
        setSearchError("Search failed. Please try again.");
      }
    } catch (err) {
      console.error("Search failed:", err);
      setSearchError("Network error. Please check your connection and try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddCompound = (compound: Compound) => {
    if (!selectedCompounds.find(c => c.id === compound.id)) {
      setSelectedCompounds(prev => [...prev, compound]);
    }
  };

  const handleRemoveCompound = (id: string) => {
    setSelectedCompounds(prev => prev.filter(c => c.id !== id));
  };

  const handleRunDocking = async () => {
    if (selectedCompounds.length === 0) return;
    
    setIsRunning(true);
    
    const newJobs: DockingJob[] = selectedCompounds.map(compound => ({
      id: `job_${compound.id}_${Date.now()}`,
      compound,
      status: "pending" as const,
    }));
    
    setJobs(prev => [...newJobs, ...prev]);
    
    for (const job of newJobs) {
      setJobs(prev => prev.map(j => 
        j.id === job.id ? { ...j, status: "running" as const, startedAt: new Date() } : j
      ));
      
      try {
        const result = await runDockingSimulation(job.compound, bindingSite);
        
        setJobs(prev => prev.map(j => 
          j.id === job.id ? { 
            ...j, 
            status: "completed" as const, 
            affinity: result.bestAffinity,
            poses: result.poseCount,
            completedAt: new Date(),
            dockingResult: result,
          } : j
        ));
      } catch (error) {
        setJobs(prev => prev.map(j => 
          j.id === job.id ? { ...j, status: "failed" as const } : j
        ));
      }
    }
    
    setSelectedCompounds([]);
    setIsRunning(false);
  };

  const getAffinityColor = (affinity: number) => {
    if (affinity <= -10) return "text-green-400";
    if (affinity <= -7) return "text-primary";
    if (affinity <= -5) return "text-yellow-400";
    return "text-orange-400";
  };

  const completedJobs = jobs.filter(j => j.status === "completed");
  const runningJobs = jobs.filter(j => j.status === "running");

  return (
    <div className="space-y-4" data-testid="docking-workbench">
      <div className="luna-card p-4 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Beaker className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white">Drug Discovery Workbench</h3>
            <p className="text-xs text-white/50">Search ChEMBL & PubChem for potential drug candidates</p>
          </div>
        </div>

        <div className="flex gap-1 mb-4 p-1 bg-white/5 rounded-lg">
          {[
            { id: "name", label: "By Name", icon: Search },
            { id: "target", label: "By Target", icon: Target },
            { id: "similarity", label: "Similar", icon: Database },
            { id: "binding-site", label: "For Pocket", icon: Sparkles },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSearchMode(mode.id as SearchMode)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded text-xs transition-all ${
                searchMode === mode.id
                  ? "bg-blue-500 text-white"
                  : "text-white/60 hover:bg-white/10"
              }`}
              data-testid={`btn-mode-${mode.id}`}
            >
              <mode.icon className="w-3 h-3" />
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          ))}
        </div>

        {searchMode === "name" && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search compounds by name (e.g., aspirin, ibuprofen)..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-blue-500 focus:outline-none"
                data-testid="input-compound-name"
              />
            </div>
          </div>
        )}

        {searchMode === "target" && (
          <div className="space-y-3">
            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter protein target (e.g., EGFR, BCR-ABL, BRAF)..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-blue-500 focus:outline-none"
                data-testid="input-target-name"
              />
            </div>
            <p className="text-[10px] text-white/40">
              Finds compounds with known bioactivity against the specified target from ChEMBL
            </p>
          </div>
        )}

        {searchMode === "similarity" && (
          <div className="space-y-3">
            <textarea
              value={smilesQuery}
              onChange={(e) => setSmilesQuery(e.target.value)}
              placeholder="Enter SMILES string to find similar compounds..."
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder:text-white/30 focus:border-blue-500 focus:outline-none resize-none"
              data-testid="input-smiles"
            />
            <p className="text-[10px] text-white/40">
              Performs Tanimoto similarity search (threshold: 70%) against ChEMBL
            </p>
          </div>
        )}

        {searchMode === "binding-site" && (
          <div className="space-y-3">
            {bindingSite ? (
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-white">Using selected binding pocket</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <div className="text-white/40">Volume</div>
                    <div className="text-white font-mono">{bindingSite.volume.toFixed(0)}Å³</div>
                  </div>
                  <div>
                    <div className="text-white/40">Hydrophobic</div>
                    <div className="text-white font-mono">{(bindingSite.hydrophobicity * 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-white/40">Residues</div>
                    <div className="text-white font-mono">{bindingSite.residues.length}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                <AlertCircle className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-xs text-yellow-400">Select a binding site first from the Binding Sites panel</p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
            className="border-white/10 text-white/60"
          >
            <Filter className="w-3 h-3 mr-1" />
            Filters
          </Button>
          <Button
            onClick={handleSearch}
            disabled={isSearching || (searchMode === "binding-site" && !bindingSite)}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
            data-testid="btn-search-compounds"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching databases...
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2" />
                Search ChEMBL & PubChem
              </>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/10">
                <div>
                  <label className="text-[10px] text-white/40 block mb-1">Max MW</label>
                  <input
                    type="number"
                    value={filters.maxMW}
                    onChange={(e) => setFilters(f => ({ ...f, maxMW: parseInt(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 block mb-1">Max LogP</label>
                  <input
                    type="number"
                    value={filters.maxLogP}
                    onChange={(e) => setFilters(f => ({ ...f, maxLogP: parseFloat(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 block mb-1">Max HBD</label>
                  <input
                    type="number"
                    value={filters.maxHBD}
                    onChange={(e) => setFilters(f => ({ ...f, maxHBD: parseInt(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 block mb-1">Max HBA</label>
                  <input
                    type="number"
                    value={filters.maxHBA}
                    onChange={(e) => setFilters(f => ({ ...f, maxHBA: parseInt(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-sm text-white"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {searchError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <p className="text-sm text-red-400">{searchError}</p>
          </div>
        </motion.div>
      )}

      {searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="luna-card p-4 rounded-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-white">
              Found {searchResults.length} compounds
            </h4>
            <span className="text-[10px] text-white/40 flex items-center gap-1">
              <Database className="w-3 h-3" />
              ChEMBL + PubChem
            </span>
          </div>

          <div className="max-h-[250px] overflow-y-auto custom-scrollbar space-y-2">
            {searchResults.map((compound) => (
              <div
                key={compound.id}
                className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white truncate">{compound.name}</span>
                    {compound.source && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        {compound.source}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-white/40 mt-0.5">
                    <span>MW: {compound.mw.toFixed(1)}</span>
                    {compound.logP !== undefined && <span>LogP: {compound.logP.toFixed(1)}</span>}
                    {compound.bioactivity && compound.bioactivity.length > 0 && (
                      <span className="text-green-400">
                        {compound.bioactivity[0].activityType}: {compound.bioactivity[0].value?.toFixed(2)} {compound.bioactivity[0].unit}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddCompound(compound)}
                  disabled={selectedCompounds.some(c => c.id === compound.id)}
                  className="h-8 w-8 p-0"
                  data-testid={`btn-add-${compound.id}`}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {selectedCompounds.length > 0 && (
        <div className="luna-card p-4 rounded-xl">
          <div className="text-xs text-white/50 mb-2">Selected for docking ({selectedCompounds.length})</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedCompounds.map(compound => (
              <div
                key={compound.id}
                className="flex items-center gap-1.5 bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg text-xs"
              >
                <span>{compound.name}</span>
                <button
                  onClick={() => handleRemoveCompound(compound.id)}
                  className="hover:text-white"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <Button
            onClick={handleRunDocking}
            disabled={isRunning || selectedCompounds.length === 0}
            className="w-full bg-green-500 hover:bg-green-600"
            data-testid="btn-run-docking"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Docking ({runningJobs.length} active)...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Docking Simulation
              </>
            )}
          </Button>
        </div>
      )}

      {jobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="luna-card p-4 rounded-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-white">
              Docking Results ({completedJobs.length}/{jobs.length})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setJobs([])}
              className="text-xs text-white/50"
            >
              Clear All
            </Button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`p-3 rounded-lg border ${
                  job.status === "completed" ? "bg-white/5 border-white/10" :
                  job.status === "running" ? "bg-blue-500/10 border-blue-500/30" :
                  job.status === "failed" ? "bg-red-500/10 border-red-500/30" :
                  "bg-white/5 border-white/5"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {job.status === "completed" && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {job.status === "running" && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
                    {job.status === "pending" && <Clock className="w-4 h-4 text-white/40" />}
                    {job.status === "failed" && <AlertCircle className="w-4 h-4 text-red-400" />}
                    <span className="text-sm text-white">{job.compound.name}</span>
                  </div>
                  {job.compound.source && (
                    <span className="text-[9px] text-white/40">{job.compound.source}</span>
                  )}
                </div>

                {job.status === "completed" && job.affinity !== undefined && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div>
                        <div className="text-white/40">Best Affinity</div>
                        <div className={`font-mono font-bold ${getAffinityColor(job.affinity)}`}>
                          {job.affinity} kcal/mol
                        </div>
                      </div>
                      <div>
                        <div className="text-white/40">Poses</div>
                        <div className="text-white font-mono">{job.poses}</div>
                      </div>
                      <div>
                        <div className="text-white/40">Quality</div>
                        <div className={`${job.affinity <= -8 ? "text-green-400" : job.affinity <= -6 ? "text-yellow-400" : "text-orange-400"}`}>
                          {job.affinity <= -8 ? "Excellent" : job.affinity <= -6 ? "Good" : "Moderate"}
                        </div>
                      </div>
                    </div>
                    
                    {job.dockingResult && (
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-white/50">Top Poses</span>
                          {onShowLigandPose && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-[10px] border-primary/30 text-primary hover:bg-primary/10"
                              onClick={() => {
                                const pose = job.dockingResult!.poses[0];
                                onShowLigandPose({
                                  pdb: pose.ligandPdb,
                                  name: job.compound.name,
                                  affinity: pose.affinity,
                                  interactions: pose.interactions,
                                });
                                setSelectedPose({ jobId: job.id, poseRank: 1 });
                              }}
                              data-testid={`btn-view-pose-${job.id}`}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View Best Pose
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {job.dockingResult.poses.slice(0, 5).map((pose) => (
                            <button
                              key={pose.rank}
                              onClick={() => {
                                if (onShowLigandPose) {
                                  onShowLigandPose({
                                    pdb: pose.ligandPdb,
                                    name: job.compound.name,
                                    affinity: pose.affinity,
                                    interactions: pose.interactions,
                                  });
                                  setSelectedPose({ jobId: job.id, poseRank: pose.rank });
                                }
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-mono transition-all ${
                                selectedPose?.jobId === job.id && selectedPose?.poseRank === pose.rank
                                  ? "bg-primary text-black"
                                  : "bg-white/10 text-white/70 hover:bg-white/20"
                              }`}
                            >
                              #{pose.rank}: {pose.affinity.toFixed(1)}
                            </button>
                          ))}
                        </div>
                        
                        {selectedPose?.jobId === job.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-black/30 rounded-lg p-3 space-y-2"
                          >
                            {(() => {
                              const pose = job.dockingResult!.poses.find(p => p.rank === selectedPose.poseRank);
                              if (!pose) return null;
                              
                              const { hBonds, hydrophobic, piStacking, saltBridges } = pose.interactions;
                              const totalInteractions = hBonds.length + hydrophobic.length + piStacking.length + saltBridges.length;
                              
                              return (
                                <>
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-white/50">Pose #{pose.rank} Interactions</span>
                                    <span className="text-primary font-mono">{totalInteractions} contacts</span>
                                  </div>
                                  
                                  {hBonds.length > 0 && (
                                    <div className="flex items-start gap-2">
                                      <Link2 className="w-3 h-3 text-blue-400 mt-0.5" />
                                      <div className="text-[10px]">
                                        <div className="text-blue-400 font-medium">H-Bonds ({hBonds.length})</div>
                                        <div className="text-white/50 font-mono">
                                          {hBonds.slice(0, 3).map((h, i) => (
                                            <span key={i}>{h.donor}→{h.acceptor} ({h.distance.toFixed(1)}Å){i < 2 && hBonds.length > 1 ? ', ' : ''}</span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {hydrophobic.length > 0 && (
                                    <div className="flex items-start gap-2">
                                      <Atom className="w-3 h-3 text-yellow-400 mt-0.5" />
                                      <div className="text-[10px]">
                                        <div className="text-yellow-400 font-medium">Hydrophobic ({hydrophobic.length})</div>
                                        <div className="text-white/50 font-mono">
                                          {hydrophobic.slice(0, 3).map((h, i) => (
                                            <span key={i}>{h.residue}:{h.atom} ({h.distance.toFixed(1)}Å){i < 2 && hydrophobic.length > 1 ? ', ' : ''}</span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {piStacking.length > 0 && (
                                    <div className="flex items-start gap-2">
                                      <Zap className="w-3 h-3 text-purple-400 mt-0.5" />
                                      <div className="text-[10px]">
                                        <div className="text-purple-400 font-medium">π-Stacking ({piStacking.length})</div>
                                        <div className="text-white/50 font-mono">
                                          {piStacking.slice(0, 3).map((p, i) => (
                                            <span key={i}>{p.residue} {p.type} ({p.distance.toFixed(1)}Å){i < 2 && piStacking.length > 1 ? ', ' : ''}</span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {saltBridges.length > 0 && (
                                    <div className="flex items-start gap-2">
                                      <Zap className="w-3 h-3 text-red-400 mt-0.5" />
                                      <div className="text-[10px]">
                                        <div className="text-red-400 font-medium">Salt Bridges ({saltBridges.length})</div>
                                        <div className="text-white/50 font-mono">
                                          {saltBridges.slice(0, 3).map((s, i) => (
                                            <span key={i}>{s.residue}:{s.atom} ({s.distance.toFixed(1)}Å){i < 2 && saltBridges.length > 1 ? ', ' : ''}</span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-yellow-400/80">
              <span className="font-semibold">Computational prediction only.</span> These results require experimental validation. Predicted binding affinities have ~2 kcal/mol uncertainty.
            </p>
          </div>
        </motion.div>
      )}

      <div className="luna-card p-4 rounded-xl">
        <h4 className="text-xs font-mono text-white/40 uppercase mb-3">Data Sources & Methodology</h4>
        <div className="space-y-2 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span>ChEMBL: Curated bioactivity data for drug-like molecules</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>PubChem: Comprehensive chemical compound database</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Docking: Physics-based scoring with AutoDock Vina-style force fields</span>
          </div>
        </div>
      </div>
    </div>
  );
}
