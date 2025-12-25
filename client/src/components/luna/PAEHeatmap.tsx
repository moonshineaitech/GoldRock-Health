import { useEffect, useRef, useMemo, useState } from "react";

interface PAEHeatmapProps {
  paeMatrix: number[][] | null;
  sequenceLength: number;
  onHover?: (row: number | null, col: number | null) => void;
  highlightedResidue?: number | null;
}

function getPAEColor(value: number, maxValue: number = 30): string {
  const normalized = Math.min(value / maxValue, 1);
  const r = Math.round(0 + normalized * 50);
  const g = Math.round(100 - normalized * 80);
  const b = Math.round(80 - normalized * 60);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function PAEHeatmap({ paeMatrix, sequenceLength, onHover, highlightedResidue }: PAEHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const matrixStats = useMemo(() => {
    if (!paeMatrix || paeMatrix.length === 0) return { avg: 0, max: 0, min: 0 };
    
    let sum = 0;
    let count = 0;
    let max = 0;
    let min = Infinity;
    
    for (const row of paeMatrix) {
      for (const val of row) {
        sum += val;
        count++;
        max = Math.max(max, val);
        min = Math.min(min, val);
      }
    }
    
    return {
      avg: count > 0 ? sum / count : 0,
      max,
      min: min === Infinity ? 0 : min
    };
  }, [paeMatrix]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !paeMatrix || paeMatrix.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = Math.min(canvas.width, canvas.height);
    const cellSize = size / paeMatrix.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < paeMatrix.length; i++) {
      for (let j = 0; j < paeMatrix[i].length; j++) {
        const value = paeMatrix[i][j];
        ctx.fillStyle = getPAEColor(value, 30);
        ctx.fillRect(j * cellSize, i * cellSize, cellSize + 0.5, cellSize + 0.5);
      }
    }

  }, [paeMatrix]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || !paeMatrix || paeMatrix.length === 0) return;

    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    const size = Math.min(overlay.width, overlay.height);
    const cellSize = size / paeMatrix.length;

    ctx.clearRect(0, 0, overlay.width, overlay.height);

    if (highlightedResidue !== null && highlightedResidue !== undefined) {
      ctx.fillStyle = "rgba(255, 0, 255, 0.3)";
      ctx.fillRect(highlightedResidue * cellSize, 0, cellSize, size);
      ctx.fillRect(0, highlightedResidue * cellSize, size, cellSize);
      
      ctx.strokeStyle = "rgba(255, 0, 255, 0.8)";
      ctx.lineWidth = 2;
      ctx.strokeRect(highlightedResidue * cellSize, 0, cellSize, size);
      ctx.strokeRect(0, highlightedResidue * cellSize, size, cellSize);
    }

    if (hoveredCell) {
      ctx.strokeStyle = "rgba(0, 255, 255, 0.8)";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        hoveredCell.col * cellSize - 1, 
        hoveredCell.row * cellSize - 1, 
        cellSize + 2, 
        cellSize + 2
      );
    }

  }, [paeMatrix, highlightedResidue, hoveredCell]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!paeMatrix || !overlayRef.current) return;
    
    const rect = overlayRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const cellSize = rect.width / paeMatrix.length;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    if (row >= 0 && row < paeMatrix.length && col >= 0 && col < paeMatrix[0].length) {
      setHoveredCell({ row, col });
      onHover?.(row, col);
    }
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
    onHover?.(null, null);
  };

  if (!paeMatrix || paeMatrix.length === 0) {
    return (
      <div className="bg-black/20 rounded-lg border border-white/10 p-4 h-full">
        <div className="text-[10px] text-white/50 font-mono mb-2">PREDICTED ALIGNED ERROR (PAE)</div>
        <div className="aspect-square bg-black/30 rounded flex items-center justify-center">
          <div className="text-white/30 text-xs font-mono text-center px-4">
            Fold a protein sequence to see the PAE matrix
          </div>
        </div>
      </div>
    );
  }

  const paeValue = hoveredCell && paeMatrix[hoveredCell.row]?.[hoveredCell.col];

  return (
    <div ref={containerRef} className="bg-black/20 rounded-lg border border-white/10 p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] text-white/50 font-mono">PREDICTED ALIGNED ERROR</div>
        <div className="text-[10px] text-white/40 font-mono">
          Avg: {matrixStats.avg.toFixed(1)}Å
        </div>
      </div>
      
      <div className="relative flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="absolute inset-0 w-full h-full rounded"
        />
        <canvas
          ref={overlayRef}
          width={300}
          height={300}
          className="absolute inset-0 w-full h-full rounded cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        
        <div className="absolute -left-1 top-0 bottom-0 flex flex-col justify-between text-[8px] text-white/40 font-mono pointer-events-none">
          <span>1</span>
          <span>{Math.round(sequenceLength / 2)}</span>
          <span>{sequenceLength}</span>
        </div>
        
        <div className="absolute left-0 right-0 -bottom-4 flex justify-between text-[8px] text-white/40 font-mono px-2 pointer-events-none">
          <span>1</span>
          <span>Aligned Residue</span>
          <span>{sequenceLength}</span>
        </div>
      </div>

      {hoveredCell && paeValue !== undefined && (
        <div className="mt-6 p-2 bg-black/40 rounded border border-cyan-500/30">
          <div className="text-[9px] text-white/50 font-mono">HOVERED POSITION</div>
          <div className="text-xs text-white font-mono">
            Residue {hoveredCell.row + 1} vs {hoveredCell.col + 1}
          </div>
          <div className="text-xs text-cyan-400 font-mono">
            Error: {paeValue.toFixed(2)}Å
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <span className="text-[8px] text-white/40 font-mono">0</span>
        <div 
          className="flex-1 h-3 rounded"
          style={{
            background: "linear-gradient(to right, rgb(0, 100, 80), rgb(25, 60, 40), rgb(50, 20, 20))"
          }}
        />
        <span className="text-[8px] text-white/40 font-mono">30</span>
      </div>
      <div className="text-center text-[8px] text-white/30 font-mono mt-1">
        Expected Position Error (Ångströms)
      </div>

      {highlightedResidue !== null && highlightedResidue !== undefined && (
        <div className="mt-2 text-center text-[9px] text-purple-400 font-mono">
          Residue {highlightedResidue + 1} selected in 3D viewer
        </div>
      )}
    </div>
  );
}
