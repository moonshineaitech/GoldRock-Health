import { useRef, useEffect, useState, useCallback } from "react";
import type { PredictionWithAnalysis, SequenceAnalysis } from "@/hooks/use-predictions";
import { Download, Camera, Sun, Moon, Lightbulb, Share2, Copy, Check, RotateCcw, Settings, X } from "lucide-react";

interface LigandPose {
  pdb: string;
  name: string;
  affinity: number;
  interactions: {
    hBonds: { donor: string; acceptor: string; distance: number }[];
    hydrophobic: { residue: string; atom: string; distance: number }[];
    piStacking: { residue: string; type: string; distance: number }[];
    saltBridges: { residue: string; atom: string; distance: number }[];
  };
}

interface MolstarViewerProps {
  folding: boolean;
  prediction?: PredictionWithAnalysis | null;
  analysis?: SequenceAnalysis | null;
  onResidueSelect?: (residue: { index: number; aa: string; plddt: number } | null) => void;
  highlightedResidue?: { row: number; col: number } | null;
  highlightedResidues?: number[];
  selectedResidueIndex?: number | null;
  ligandPose?: LigandPose | null;
}

type RepresentationType = 'cartoon' | 'ball-and-stick' | 'surface' | 'cartoon+sidechains';
type LightingMode = 'default' | 'ambient' | 'dramatic';
type ColorMode = 'plddt' | 'secondary-structure' | 'hydrophobicity' | 'chain' | 'element';

const COLOR_MODE_OPTIONS: { value: ColorMode; label: string; description: string }[] = [
  { value: 'plddt', label: 'pLDDT Confidence', description: 'AlphaFold confidence coloring' },
  { value: 'secondary-structure', label: 'Secondary Structure', description: 'Helices, sheets, loops' },
  { value: 'hydrophobicity', label: 'Hydrophobicity', description: 'Hydrophobic vs hydrophilic' },
  { value: 'chain', label: 'Chain', description: 'Color by chain ID' },
  { value: 'element', label: 'Element', description: 'CPK coloring by atom type' }
];

const PLDDT_COLORS = {
  veryHigh: '#0053d6',
  high: '#65cbf3',
  low: '#ffdb13',
  veryLow: '#ff7d45'
};

function getPlddtColor(score: number): string {
  if (score >= 90) return PLDDT_COLORS.veryHigh;
  if (score >= 70) return PLDDT_COLORS.high;
  if (score >= 50) return PLDDT_COLORS.low;
  return PLDDT_COLORS.veryLow;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  
  return isMobile;
}

export default function MolstarViewer({ 
  folding, 
  prediction, 
  analysis, 
  onResidueSelect, 
  highlightedResidue,
  highlightedResidues,
  selectedResidueIndex,
  ligandPose
}: MolstarViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pluginRef = useRef<any>(null);
  const initRef = useRef(false);
  const trajectoryRef = useRef<any>(null);
  const ligandStructureRef = useRef<any>(null);
  const ligandPoseRef = useRef<LigandPose | null>(null);
  
  // Keep ligandPose in a ref so the loader can access it
  useEffect(() => {
    ligandPoseRef.current = ligandPose || null;
  }, [ligandPose]);
  
  // Shared ligand loader function - can be called after any viewer update
  const loadLigandPoseCallback = useCallback(async () => {
    if (!pluginRef.current) return;
    
    const plugin = pluginRef.current;
    const currentLigandPose = ligandPoseRef.current;
    
    // Always clear existing ligand first to prevent duplicates
    if (ligandStructureRef.current) {
      try {
        const state = plugin.state.data;
        const update = state.build().delete(ligandStructureRef.current);
        await update.commit();
        ligandStructureRef.current = null;
        console.log('[LunaFold] Cleared previous ligand pose');
      } catch (e) {
        console.warn('[LunaFold] Could not clear ligand:', e);
        ligandStructureRef.current = null;
      }
    }
    
    if (!currentLigandPose?.pdb) {
      return;
    }
    
    try {
      console.log('[LunaFold] Loading docked ligand:', currentLigandPose.name);
      
      const data = await plugin.builders.data.rawData({
        data: currentLigandPose.pdb,
        label: `Ligand: ${currentLigandPose.name}`
      });
      
      const trajectory = await plugin.builders.structure.parseTrajectory(data, 'pdb');
      const model = await plugin.builders.structure.createModel(trajectory);
      const structure = await plugin.builders.structure.createStructure(model);
      
      ligandStructureRef.current = structure.ref;
      
      const ligandComponent = await plugin.builders.structure.tryCreateComponentStatic(
        structure, 
        'all'
      );
      
      if (ligandComponent) {
        await plugin.builders.structure.representation.addRepresentation(ligandComponent, {
          type: 'ball-and-stick',
          color: 'element-symbol' as any,
          typeParams: { 
            sizeFactor: 0.4,
            sizeAspectRatio: 0.8
          }
        });
        
        console.log('[LunaFold] Ligand pose loaded with', 
          currentLigandPose.interactions.hBonds.length, 'H-bonds,',
          currentLigandPose.interactions.hydrophobic.length, 'hydrophobic contacts');
      }
    } catch (err) {
      console.error('[LunaFold] Failed to load ligand pose:', err);
    }
  }, []);
  
  const [isLoading, setIsLoading] = useState(false);
  const [representation, setRepresentation] = useState<RepresentationType>('cartoon');
  const [lightingMode, setLightingMode] = useState<LightingMode>('ambient');
  const [colorMode, setColorMode] = useState<ColorMode>('plddt');
  const [selectedResidue, setSelectedResidue] = useState<{ index: number; aa: string; plddt: number } | null>(null);
  const [hoveredResidue, setHoveredResidue] = useState<{ index: number; aa: string; plddt: number } | null>(null);
  const [viewerReady, setViewerReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showToolsPanel, setShowToolsPanel] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const isMobile = useIsMobile();

  const initViewer = useCallback(async () => {
    if (!containerRef.current || initRef.current) {
      return;
    }

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    initRef.current = true;
    console.log('[LunaFold] Starting Mol* initialization...');

    try {
      const { createPluginUI } = await import('molstar/lib/mol-plugin-ui');
      const { renderReact18 } = await import('molstar/lib/mol-plugin-ui/react18');
      const { DefaultPluginUISpec } = await import('molstar/lib/mol-plugin-ui/spec');
      const { PluginConfig } = await import('molstar/lib/mol-plugin/config');

      const spec: any = {
        ...DefaultPluginUISpec(),
        layout: {
          initial: {
            isExpanded: false,
            showControls: false,
            controlsDisplay: 'reactive' as const,
            regionState: {
              left: 'hidden' as const,
              right: 'hidden' as const,
              top: 'hidden' as const,
              bottom: 'hidden' as const
            }
          }
        },
        config: [
          [PluginConfig.VolumeStreaming.Enabled, false],
          [PluginConfig.Viewport.ShowExpand, false],
          [PluginConfig.Viewport.ShowControls, false],
          [PluginConfig.Viewport.ShowSettings, false],
          [PluginConfig.Viewport.ShowSelectionMode, false],
          [PluginConfig.Viewport.ShowAnimation, false],
        ]
      };

      const plugin = await createPluginUI({
        target: container,
        spec,
        render: renderReact18
      });

      if (plugin.canvas3d) {
        plugin.canvas3d.setProps({
          renderer: {
            backgroundColor: 0x0a0a14 as any
          },
          cameraResetDurationMs: 500,
          camera: {
            helper: { axes: { name: 'off', params: {} } }
          }
        });
      }

      pluginRef.current = plugin;
      setViewerReady(true);
      setError(null);
      console.log('[LunaFold] Mol* initialized successfully');

    } catch (err) {
      console.error('[LunaFold] Failed to initialize:', err);
      setError('Failed to initialize viewer: ' + (err as Error).message);
      initRef.current = false;
    }
  }, []);

  const loadStructure = useCallback(async () => {
    const structureData = prediction?.cifData || prediction?.pdbData;
    if (!pluginRef.current || !structureData) {
      console.log('[LunaFold] Skip load: no plugin or structure data');
      return;
    }

    const plugin = pluginRef.current;
    
    if (!plugin.canvas3dInitialized) {
      console.log('[LunaFold] Waiting for canvas3d initialization...');
      await plugin.canvas3dInitialized;
    }
    
    setIsLoading(true);

    try {
      await plugin.clear();

      const format = prediction.cifData ? 'mmcif' : 'pdb';

      console.log('[LunaFold] Loading structure:', format, 'size:', structureData!.length);

      const data = await plugin.builders.data.rawData(
        { data: structureData, label: prediction.proteinName || 'Protein Structure' },
        { state: { isGhost: true } }
      );

      if (!data) {
        throw new Error('Failed to create raw data object');
      }

      const trajectory = await plugin.builders.structure.parseTrajectory(data, format);

      if (!trajectory) {
        throw new Error('Failed to parse trajectory - result is null');
      }
      
      // Store trajectory reference for representation switching
      trajectoryRef.current = trajectory;
      
      // Load structure with default preset then apply pLDDT coloring
      await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default');
      
      // Wait a bit for structure to be ready
      await new Promise(resolve => setTimeout(resolve, 100));

      if (plugin.canvas3d) {
        plugin.canvas3d.handleResize();
        plugin.canvas3d.requestCameraReset();
      }
      
      console.log('[LunaFold] Structure loaded successfully');

    } catch (err) {
      console.error('[LunaFold] Failed to load structure:', err);
      setError('Failed to load structure: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [prediction]);

  const updateRepresentation = useCallback(async () => {
    // Handle both cifData and pdbData
    const structureData = prediction?.cifData || prediction?.pdbData;
    if (!pluginRef.current || !structureData) return;
    
    const plugin = pluginRef.current;
    
    try {
      // Map color mode to Mol* color theme names
      // For pLDDT coloring:
      // - 'plddt-confidence' is the AlphaFold-specific theme (dark blue >90, light blue 70-90, yellow 50-70, orange <50)
      // - 'b-factor' is the fallback for generic structures
      const colorThemeMap: Record<ColorMode, string> = {
        'plddt': 'plddt-confidence',
        'secondary-structure': 'secondary-structure',
        'hydrophobicity': 'hydrophobicity',
        'chain': 'chain-id',
        'element': 'element-symbol'
      };
      
      const selectedColorTheme = colorThemeMap[colorMode] || 'plddt-confidence';
      console.log('[LunaFold] Updating representation:', representation, 'color:', selectedColorTheme);
      
      // Clear existing state and reload structure with new representation
      await plugin.clear();
      
      // Reload structure - prefer cifData for AlphaFold, fall back to pdbData
      const data = await plugin.builders.data.rawData({ 
        data: structureData, 
        label: prediction.proteinName || 'Protein Structure' 
      });
      
      const format = structureData.includes('_atom_site') ? 'mmcif' : 'pdb';
      const trajectory = await plugin.builders.structure.parseTrajectory(data, format);
      
      // Build model and structure
      const model = await plugin.builders.structure.createModel(trajectory);
      const structure = await plugin.builders.structure.createStructure(model);
      
      // Determine representation type for Mol*
      const repType = representation === 'cartoon' ? 'cartoon' :
                      representation === 'ball-and-stick' ? 'ball-and-stick' :
                      representation === 'surface' ? 'molecular-surface' :
                      'cartoon';
      
      // Create component and apply representation with color theme
      const component = await plugin.builders.structure.tryCreateComponentStatic(structure, 'polymer');
      
      if (component) {
        // Try the selected color theme, fall back to b-factor, then uniform
        let appliedTheme = selectedColorTheme;
        try {
          await plugin.builders.structure.representation.addRepresentation(component, {
            type: repType as any,
            color: selectedColorTheme as any
          });
        } catch (colorErr) {
          // plddt-confidence only works for AlphaFold structures with metadata
          // Fall back to b-factor for generic structures
          console.warn('[LunaFold] plddt-confidence not available, trying b-factor:', colorErr);
          appliedTheme = 'b-factor';
          try {
            await plugin.builders.structure.representation.addRepresentation(component, {
              type: repType as any,
              color: 'b-factor' as any
            });
          } catch (bfactorErr) {
            console.warn('[LunaFold] b-factor failed, falling back to uniform:', bfactorErr);
            appliedTheme = 'uniform';
            await plugin.builders.structure.representation.addRepresentation(component, {
              type: repType as any,
              color: 'uniform' as any
            });
          }
        }
        
        // For cartoon+sidechains, add a second representation for side chains
        if (representation === 'cartoon+sidechains') {
          await plugin.builders.structure.representation.addRepresentation(component, {
            type: 'ball-and-stick',
            color: 'element-symbol' as any,
            typeParams: { sizeFactor: 0.15 }
          });
        }
        
        console.log('[LunaFold] Representation updated to:', representation, 'with color:', appliedTheme);
      }
      
      // Also add ligands/ions if present
      const ligand = await plugin.builders.structure.tryCreateComponentStatic(structure, 'ligand');
      if (ligand) {
        await plugin.builders.structure.representation.addRepresentation(ligand, {
          type: 'ball-and-stick',
          color: 'element-symbol' as any
        });
      }
      
      if (plugin.canvas3d) {
        plugin.canvas3d.handleResize();
        plugin.canvas3d.requestCameraReset();
      }
      
      // Reload ligand after protein representation is complete
      await loadLigandPoseCallback();
      
    } catch (err) {
      console.error('[LunaFold] Failed to update representation:', err);
    }
  }, [representation, colorMode, prediction, loadLigandPoseCallback]);

  const updateLighting = useCallback(async () => {
    if (!pluginRef.current?.canvas3d) return;
    
    const plugin = pluginRef.current;
    
    try {
      // Simple lighting adjustments that don't cause multiScale errors
      const backgroundColors: Record<LightingMode, number> = {
        default: 0x0a0a14,
        ambient: 0x151520,
        dramatic: 0x050508
      };
      
      plugin.canvas3d.setProps({
        renderer: {
          backgroundColor: backgroundColors[lightingMode] as any
        }
      });
      
      console.log('[LunaFold] Lighting updated to:', lightingMode);
    } catch (err) {
      console.error('[LunaFold] Failed to update lighting:', err);
    }
  }, [lightingMode]);

  const handleDownloadPDB = useCallback(() => {
    if (!prediction?.pdbData) return;
    
    const blob = new Blob([prediction.pdbData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prediction.proteinName || 'protein'}_structure.pdb`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [prediction]);

  const handleDownloadCIF = useCallback(() => {
    if (!prediction?.cifData) return;
    
    const blob = new Blob([prediction.cifData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prediction.proteinName || 'protein'}_structure.cif`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [prediction]);

  const handleScreenshot = useCallback(async () => {
    if (!pluginRef.current?.canvas3d) return;
    
    try {
      const plugin = pluginRef.current;
      const canvas = plugin.canvas3d.canvas;
      
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${prediction?.proteinName || 'protein'}_screenshot.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('[LunaFold] Screenshot failed:', err);
    }
  }, [prediction]);

  const handleResetView = useCallback(() => {
    if (pluginRef.current?.canvas3d) {
      pluginRef.current.canvas3d.requestCameraReset();
    }
  }, []);

  const handleCopyLink = useCallback(() => {
    const url = new URL(window.location.href);
    if (prediction?.uniprotId) {
      url.searchParams.set('uniprot', prediction.uniprotId);
    }
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [prediction]);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20;
    let timer: ReturnType<typeof setTimeout>;
    
    const tryInit = () => {
      if (attempts >= maxAttempts || initRef.current) return;
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          initViewer();
        } else {
          attempts++;
          timer = setTimeout(tryInit, 100);
        }
      } else {
        attempts++;
        timer = setTimeout(tryInit, 100);
      }
    };
    
    timer = setTimeout(tryInit, 50);
    
    return () => {
      clearTimeout(timer);
      if (pluginRef.current) {
        try {
          pluginRef.current.dispose();
        } catch (e) {
          console.warn('[LunaFold] Error disposing:', e);
        }
        pluginRef.current = null;
        initRef.current = false;
        setViewerReady(false);
      }
    };
  }, [initViewer]);

  useEffect(() => {
    const structureData = prediction?.cifData || prediction?.pdbData;
    if (viewerReady && structureData) {
      updateRepresentation();
    }
  }, [viewerReady, prediction?.cifData, prediction?.pdbData, representation, colorMode, updateRepresentation]);

  useEffect(() => {
    if (viewerReady) {
      updateLighting();
    }
  }, [lightingMode, viewerReady, updateLighting]);

  useEffect(() => {
    const handleResize = () => {
      if (pluginRef.current?.canvas3d) {
        pluginRef.current.canvas3d.handleResize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewerReady]);

  useEffect(() => {
    if (!pluginRef.current || !viewerReady) {
      return;
    }
    
    const plugin = pluginRef.current;
    
    if (selectedResidueIndex === null || selectedResidueIndex === undefined) {
      try {
        plugin.managers.interactivity.lociHighlights.clearHighlights();
      } catch (e) {
        // Ignore clear errors
      }
      return;
    }
    
    const highlightResidue = async () => {
      try {
        const structures = plugin.managers.structure.hierarchy.current.structures;
        if (!structures || structures.length === 0) return;
        
        const structure = structures[0];
        if (!structure.cell?.obj?.data) return;
        
        const structureData = structure.cell.obj.data;
        
        const { StructureSelection } = await import('molstar/lib/mol-model/structure');
        const { Script } = await import('molstar/lib/mol-script/script');
        
        const expression = Script.getStructureSelection(
          Q => Q.struct.generator.atomGroups({
            'residue-test': Q.core.rel.eq([
              Q.struct.atomProperty.macromolecular.label_seq_id(),
              selectedResidueIndex + 1
            ])
          }),
          structureData
        );
        
        const loci = StructureSelection.toLociWithSourceUnits(expression);
        
        plugin.managers.interactivity.lociHighlights.highlightOnly({ loci });
        
        plugin.managers.camera.focusLoci(loci);
        
        console.log('[LunaFold] Highlighted residue:', selectedResidueIndex + 1);
      } catch (err) {
        console.warn('[LunaFold] Could not highlight residue:', err);
      }
    };
    
    highlightResidue();
  }, [selectedResidueIndex, viewerReady]);

  // Highlight multiple residues (for binding sites, mutations, etc.)
  useEffect(() => {
    if (!pluginRef.current || !viewerReady) {
      return;
    }
    
    const plugin = pluginRef.current;
    
    if (!highlightedResidues || highlightedResidues.length === 0) {
      try {
        plugin.managers.interactivity.lociHighlights.clearHighlights();
      } catch (e) {
        // Ignore clear errors
      }
      return;
    }
    
    const highlightMultipleResidues = async () => {
      try {
        const structures = plugin.managers.structure.hierarchy.current.structures;
        if (!structures || structures.length === 0) return;
        
        const structure = structures[0];
        if (!structure.cell?.obj?.data) return;
        
        const structureData = structure.cell.obj.data;
        
        const { StructureSelection } = await import('molstar/lib/mol-model/structure');
        const { Script } = await import('molstar/lib/mol-script/script');
        
        // Convert 0-indexed residues to 1-indexed for PDB/CIF format
        const residueIds = highlightedResidues.map(r => r + 1);
        
        // Create a selection expression for multiple residues using set membership
        const expression = Script.getStructureSelection(
          Q => Q.struct.generator.atomGroups({
            'residue-test': Q.core.set.has([
              Q.core.type.set(residueIds),
              Q.struct.atomProperty.macromolecular.label_seq_id()
            ])
          }),
          structureData
        );
        
        const loci = StructureSelection.toLociWithSourceUnits(expression);
        
        // Highlight the selected residues
        plugin.managers.interactivity.lociHighlights.highlightOnly({ loci });
        
        // Focus camera on the selected region
        plugin.managers.camera.focusLoci(loci);
        
        console.log('[LunaFold] Highlighted binding site residues:', residueIds.length, 'residues');
      } catch (err) {
        console.warn('[LunaFold] Could not highlight residues:', err);
      }
    };
    
    highlightMultipleResidues();
  }, [highlightedResidues, viewerReady]);

  // Load ligand pose when ligandPose changes (not on representation changes - that's handled in updateRepresentation)
  useEffect(() => {
    if (!viewerReady) return;
    
    // Only call on ligandPose changes, updateRepresentation handles its own ligand reloading
    loadLigandPoseCallback();
  }, [ligandPose, viewerReady, loadLigandPoseCallback]);
  
  // Cleanup ligand on component unmount
  useEffect(() => {
    return () => {
      if (ligandStructureRef.current && pluginRef.current) {
        try {
          const state = pluginRef.current.state.data;
          const update = state.build().delete(ligandStructureRef.current);
          update.commit().catch(() => {});
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const displayedResidue = selectedResidue || hoveredResidue;
  const avgPlddt = prediction?.plddtScores?.length 
    ? prediction.plddtScores.reduce((a, b) => a + b, 0) / prediction.plddtScores.length 
    : 0;

  const disorderedCount = prediction?.plddtScores?.filter(s => s < 50).length || 0;
  const disorderedPercent = prediction?.plddtScores?.length 
    ? ((disorderedCount / prediction.plddtScores.length) * 100).toFixed(1)
    : '0';

  const showViewer = !folding && prediction;

  return (
    <div className="w-full h-full min-h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden relative border border-white/10 shadow-inner" data-testid="protein-viewer">
      
      {folding && (
        <div className="absolute inset-0 z-30 bg-black/80 flex items-center justify-center" data-testid="protein-viewer-loading">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="text-8xl animate-spin" style={{ animationDuration: "3s" }}>🧬</div>
            </div>
            <div className="space-y-2">
              <div className="text-white/70 text-lg font-display">Predicting Structure</div>
              <div className="text-white/40 text-xs font-mono">
                Computing 3D coordinates and confidence metrics...
              </div>
            </div>
            <div className="flex gap-1 justify-center">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-8 bg-primary/60 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {!folding && !prediction && (
        <div className="absolute inset-0 z-30 flex items-center justify-center" data-testid="protein-viewer-empty">
          <div className="text-center space-y-4 max-w-md px-6">
            <div className="text-6xl opacity-40">🔬</div>
            <div className="text-white/50 text-lg font-display">
              3D Structure Viewer
            </div>
            <div className="text-white/30 text-sm">
              Enter an amino acid sequence to predict and visualize its 3D protein structure
            </div>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PLDDT_COLORS.veryHigh }} />
                <span className="text-[10px] text-white/40 font-mono">Very High (90+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PLDDT_COLORS.high }} />
                <span className="text-[10px] text-white/40 font-mono">High (70-90)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PLDDT_COLORS.low }} />
                <span className="text-[10px] text-white/40 font-mono">Low (50-70)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PLDDT_COLORS.veryLow }} />
                <span className="text-[10px] text-white/40 font-mono">Very Low (&lt;50)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewer && (
        <>
          {/* Top-left info badges - enhanced for both mobile and desktop */}
          <div className="absolute top-2 md:top-4 left-2 md:left-4 z-20 flex flex-wrap gap-1 md:gap-2 pointer-events-none max-w-[70%] md:max-w-none">
            <div className="bg-black/70 backdrop-blur-md px-2 md:px-3 py-1 rounded-full border border-primary/40 text-[10px] md:text-xs font-mono text-primary flex items-center gap-1">
              <span className="hidden md:inline">3D STRUCTURE</span>
              <span className="md:hidden">3D</span>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            </div>
            <div className="bg-black/70 backdrop-blur-md px-2 md:px-3 py-1 rounded-full border border-white/10 text-[10px] md:text-xs font-mono text-white/60">
              {prediction.sequence?.length || 0} residues
            </div>
            {analysis?.secondaryStructure && (
              <div className="hidden md:flex bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-purple-500/30 text-[10px] font-mono text-purple-400 items-center gap-1.5">
                <span>α</span>
                <span>{Math.round(analysis.secondaryStructure.alphaHelix * 100)}%</span>
                <span className="text-white/30">|</span>
                <span>β</span>
                <span>{Math.round(analysis.secondaryStructure.betaSheet * 100)}%</span>
              </div>
            )}
            {isLoading && (
              <div className="bg-black/70 backdrop-blur-md px-2 py-1 rounded-full border border-yellow-500/30 text-[10px] font-mono text-yellow-400 animate-pulse">
                Processing...
              </div>
            )}
          </div>

          {/* Mobile: Top-right quick stats */}
          {isMobile && (
            <div className="absolute top-2 right-2 z-20 flex flex-col gap-1 pointer-events-none">
              <div className="bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-primary/30 text-right">
                <div className="text-[8px] text-white/40 font-mono">pLDDT</div>
                <div className="text-lg font-mono font-bold" style={{ color: getPlddtColor(avgPlddt) }}>
                  {avgPlddt.toFixed(0)}
                </div>
              </div>
              {analysis?.secondaryStructure && (
                <div className="bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-right">
                  <div className="text-[8px] text-white/40 font-mono">HELIX</div>
                  <div className="text-xs font-mono text-purple-400">
                    {Math.round(analysis.secondaryStructure.alphaHelix * 100)}%
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Desktop controls - hidden on mobile */}
          {!isMobile && (
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
              <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
                <div className="text-[10px] text-white/50 font-mono mb-2">REPRESENTATION</div>
                <div className="flex flex-col gap-1">
                  {(['cartoon', 'cartoon+sidechains', 'ball-and-stick', 'surface'] as RepresentationType[]).map(rep => (
                    <button
                      key={rep}
                      onClick={() => setRepresentation(rep)}
                      className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                        representation === rep 
                          ? 'bg-primary text-white' 
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                      data-testid={`btn-rep-${rep.replace('+', '-')}`}
                    >
                      {rep === 'cartoon+sidechains' ? '+ Side Chains' : 
                       rep === 'ball-and-stick' ? 'Ball & Stick' :
                       rep.charAt(0).toUpperCase() + rep.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
                <div className="text-[10px] text-white/50 font-mono mb-2">LIGHTING</div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setLightingMode('default')}
                    className={`p-1.5 rounded transition-colors ${lightingMode === 'default' ? 'bg-primary text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                    title="Default"
                    data-testid="btn-lighting-default"
                  >
                    <Lightbulb className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setLightingMode('ambient')}
                    className={`p-1.5 rounded transition-colors ${lightingMode === 'ambient' ? 'bg-primary text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                    title="Ambient"
                    data-testid="btn-lighting-ambient"
                  >
                    <Sun className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setLightingMode('dramatic')}
                    className={`p-1.5 rounded transition-colors ${lightingMode === 'dramatic' ? 'bg-primary text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                    title="Dramatic"
                    data-testid="btn-lighting-dramatic"
                  >
                    <Moon className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
                <div className="text-[10px] text-white/50 font-mono mb-2">COLOR BY</div>
                <div className="flex flex-col gap-1">
                  {COLOR_MODE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setColorMode(opt.value)}
                      className={`text-[10px] font-mono px-2 py-1 rounded transition-colors text-left ${
                        colorMode === opt.value 
                          ? 'bg-primary text-white' 
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                      title={opt.description}
                      data-testid={`btn-color-${opt.value}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {colorMode === 'plddt' && (
                <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
                  <div className="text-[10px] text-white/50 font-mono mb-2">pLDDT LEGEND</div>
                  <div className="space-y-1">
                    {[
                      { color: PLDDT_COLORS.veryHigh, label: 'Very High (>90)' },
                      { color: PLDDT_COLORS.high, label: 'Confident (70-90)' },
                      { color: PLDDT_COLORS.low, label: 'Low (50-70)' },
                      { color: PLDDT_COLORS.veryLow, label: 'Very Low (<50)' }
                    ].map(({ color, label }) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-[10px] text-white/60 font-mono">{label}</span>
                      </div>
                    ))}
                  </div>
                  {disorderedCount > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <div className="text-[10px] text-orange-400 font-mono">
                        {disorderedPercent}% disordered
                      </div>
                    </div>
                  )}
                </div>
              )}

              {colorMode === 'secondary-structure' && (
                <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
                  <div className="text-[10px] text-white/50 font-mono mb-2">STRUCTURE LEGEND</div>
                  <div className="space-y-1">
                    {[
                      { color: '#FF0080', label: 'α-Helix' },
                      { color: '#FFC800', label: 'β-Sheet' },
                      { color: '#00FF00', label: 'Turn' },
                      { color: '#FFFFFF', label: 'Coil/Loop' }
                    ].map(({ color, label }) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-[10px] text-white/60 font-mono">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {colorMode === 'hydrophobicity' && (
                <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
                  <div className="text-[10px] text-white/50 font-mono mb-2">HYDROPHOBICITY</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="text-[10px] text-white/60 font-mono">Hydrophobic</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-[10px] text-white/60 font-mono">Hydrophilic</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile settings button */}
          {isMobile && (
            <button
              onClick={() => setShowMobileControls(!showMobileControls)}
              className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white/60"
              data-testid="btn-mobile-settings"
            >
              {showMobileControls ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
            </button>
          )}

          {/* Mobile controls drawer */}
          {isMobile && showMobileControls && (
            <div className="absolute top-12 right-2 z-20 bg-black/90 backdrop-blur-md p-3 rounded-lg border border-white/10 w-52 max-h-80 overflow-y-auto">
              <div className="text-[10px] text-white/50 font-mono mb-2">VIEW</div>
              <div className="grid grid-cols-2 gap-1 mb-3">
                {(['cartoon', 'surface'] as RepresentationType[]).map(rep => (
                  <button
                    key={rep}
                    onClick={() => setRepresentation(rep)}
                    className={`text-[10px] font-mono px-2 py-1.5 rounded ${
                      representation === rep ? 'bg-primary text-white' : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {rep.charAt(0).toUpperCase() + rep.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="text-[10px] text-white/50 font-mono mb-2">COLOR</div>
              <div className="grid grid-cols-2 gap-1 mb-3">
                {(['plddt', 'secondary-structure', 'hydrophobicity', 'chain'] as ColorMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setColorMode(mode)}
                    className={`text-[9px] font-mono px-2 py-1.5 rounded ${
                      colorMode === mode ? 'bg-primary text-white' : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {mode === 'plddt' ? 'pLDDT' : 
                     mode === 'secondary-structure' ? 'Structure' :
                     mode === 'hydrophobicity' ? 'Hydro' : 'Chain'}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-1 mb-3">
                <button onClick={handleResetView} className="flex-1 bg-white/10 p-2 rounded text-white/60">
                  <RotateCcw className="w-3 h-3 mx-auto" />
                </button>
                <button onClick={handleDownloadPDB} className="flex-1 bg-white/10 p-2 rounded text-white/60">
                  <Download className="w-3 h-3 mx-auto" />
                </button>
                <button onClick={handleScreenshot} className="flex-1 bg-white/10 p-2 rounded text-white/60">
                  <Camera className="w-3 h-3 mx-auto" />
                </button>
              </div>
              
              {colorMode === 'plddt' && (
                <>
                  <div className="flex gap-1 justify-center">
                    {[
                      { color: PLDDT_COLORS.veryHigh },
                      { color: PLDDT_COLORS.high },
                      { color: PLDDT_COLORS.low },
                      { color: PLDDT_COLORS.veryLow }
                    ].map(({ color }, i) => (
                      <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <div className="text-[8px] text-white/40 text-center mt-1">High → Low confidence</div>
                </>
              )}
            </div>
          )}

          {/* Center toolbar - simplified on mobile */}
          <div className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 z-20 flex gap-1">
            {!isMobile && (
              <>
                <button
                  onClick={handleResetView}
                  className="bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  title="Reset View"
                  data-testid="btn-reset-view"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleScreenshot}
                  className="bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  title="Screenshot"
                  data-testid="btn-screenshot"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowToolsPanel(!showToolsPanel)}
                    className={`bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors ${showToolsPanel ? 'bg-white/10' : ''}`}
                    title="Download"
                    data-testid="btn-download-menu"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {showToolsPanel && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 p-2 min-w-[140px]">
                      <button
                        onClick={() => { handleDownloadPDB(); setShowToolsPanel(false); }}
                        className="w-full text-left text-xs font-mono px-3 py-2 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                        data-testid="btn-download-pdb"
                      >
                        Download PDB
                      </button>
                      {prediction?.cifData && (
                        <button
                          onClick={() => { handleDownloadCIF(); setShowToolsPanel(false); }}
                          className="w-full text-left text-xs font-mono px-3 py-2 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                          data-testid="btn-download-cif"
                        >
                          Download mmCIF
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowSharePanel(!showSharePanel)}
                    className={`bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors ${showSharePanel ? 'bg-white/10' : ''}`}
                    title="Share"
                    data-testid="btn-share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  {showSharePanel && (
                    <div className="absolute top-full mt-2 right-0 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 p-3 min-w-[200px]">
                      <div className="text-[10px] text-white/50 font-mono mb-2">SHARE VISUALIZATION</div>
                      <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-2 text-xs font-mono px-3 py-2 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                        data-testid="btn-copy-link"
                      >
                        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Residue info - hidden on mobile */}
          {!isMobile && displayedResidue && (
            <div className={`absolute top-20 left-4 z-20 bg-black/80 backdrop-blur-md p-3 rounded-lg border pointer-events-none ${selectedResidue ? 'border-primary/50' : 'border-white/20'}`}>
              <div className="text-[10px] text-white/50 font-mono mb-1">
                {selectedResidue ? 'SELECTED RESIDUE' : 'HOVERED RESIDUE'}
              </div>
              <div className="text-sm font-mono text-white">
                {displayedResidue.aa} {displayedResidue.index + 1}
              </div>
              <div className="text-xs font-mono" style={{ color: getPlddtColor(displayedResidue.plddt) }}>
                pLDDT: {displayedResidue.plddt.toFixed(1)}
              </div>
            </div>
          )}

          {/* PAE highlight - hidden on mobile */}
          {!isMobile && highlightedResidue && (
            <div className="absolute z-20 bg-black/80 backdrop-blur-md p-3 rounded-lg border border-green-500/30 pointer-events-none" style={{ top: '320px', right: '16px' }}>
              <div className="text-[10px] text-green-400 font-mono mb-1">PAE HIGHLIGHT</div>
              <div className="text-sm font-mono text-white">
                Residue {highlightedResidue.row + 1} vs {highlightedResidue.col + 1}
              </div>
            </div>
          )}

          {/* Bottom info - simplified on mobile */}
          <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 flex justify-between items-end z-20 pointer-events-none">
            {!isMobile && (
              <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
                <div className="text-[10px] text-white/50 font-mono mb-1">CONTROLS</div>
                <div className="text-[10px] text-white/40 font-mono space-y-0.5">
                  <div>Left-drag: Rotate</div>
                  <div>Right-drag: Pan</div>
                  <div>Scroll: Zoom</div>
                </div>
              </div>
            )}

            {/* Mobile: enhanced compact info bar */}
            {isMobile && (
              <div className="w-full flex flex-wrap items-center gap-1.5">
                <div className="bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-primary/30">
                  <div className="text-[8px] text-primary/60 font-mono">CONFIDENCE</div>
                  <span className="text-sm font-mono font-bold" style={{ color: getPlddtColor(avgPlddt) }}>
                    {avgPlddt.toFixed(0)}%
                  </span>
                </div>
                <div className="bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10">
                  <div className="text-[8px] text-white/50 font-mono">LENGTH</div>
                  <span className="text-sm font-mono text-white/80">
                    {prediction.sequence?.length || 0} aa
                  </span>
                </div>
                {prediction.proteinName && (
                  <div className="bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 flex-1 min-w-0">
                    <div className="text-[8px] text-white/50 font-mono">PROTEIN</div>
                    <span className="text-[10px] font-mono text-white/80 truncate block">
                      {prediction.proteinName}
                    </span>
                  </div>
                )}
              </div>
            )}

            {prediction.proteinName && !isMobile && (
              <div className="bg-black/60 backdrop-blur-md p-2 md:p-3 rounded-lg border border-white/10 text-center">
                <div className="text-[10px] text-white/50 font-mono mb-1">PROTEIN</div>
                <div className="text-sm font-mono text-white max-w-[200px] truncate">
                  {prediction.proteinName}
                </div>
                {prediction.organism && (
                  <div className="text-[10px] text-white/40 font-mono italic">
                    {prediction.organism}
                  </div>
                )}
              </div>
            )}

            {!isMobile && (
              <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 text-right">
                <div className="text-[10px] text-white/50 font-mono mb-1">AVERAGE pLDDT</div>
                <div 
                  className="text-xl font-mono font-bold"
                  style={{ color: getPlddtColor(avgPlddt) }}
                >
                  {avgPlddt.toFixed(1)}%
                </div>
                {prediction.modelVersion && (
                  <div className="text-[10px] text-white/40 font-mono">
                    {prediction.modelVersion}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {error && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 bg-red-900/80 backdrop-blur-md p-4 rounded-lg border border-red-500/30 max-w-md">
          <div className="text-sm text-red-200 font-mono">{error}</div>
          <button 
            onClick={() => {
              setError(null);
              if (pluginRef.current) {
                try { pluginRef.current.dispose(); } catch (e) {}
                pluginRef.current = null;
              }
              initRef.current = false;
              setViewerReady(false);
              setTimeout(() => initViewer(), 100);
            }}
            className="mt-2 text-xs bg-red-500/20 px-3 py-1 rounded hover:bg-red-500/30"
          >
            Retry
          </button>
        </div>
      )}

      <div 
        ref={containerRef} 
        className="w-full h-full absolute inset-0"
        style={{ 
          minHeight: '500px',
          background: 'linear-gradient(135deg, #0a0a14 0%, #0d1117 100%)'
        }}
        data-testid="molstar-container"
      />
    </div>
  );
}
