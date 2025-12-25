import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import type { Prediction } from "@shared/schema";

interface MetricsPanelProps {
  visible: boolean;
  prediction: Prediction | null;
}

export default function MetricsPanel({ visible, prediction }: MetricsPanelProps) {
  if (!visible || !prediction) return null;

  const plddtData = (prediction.plddtScores || []).map((score, i) => ({
    residue: i,
    score,
  }));

  const paeData = (prediction.paeMatrix?.[0] || []).map((error, i) => ({
    residue: i,
    error,
  }));

  const avgConfidence = prediction.confidenceScore || 0;
  const confidenceLevel = avgConfidence >= 90 ? 'VERY HIGH' : avgConfidence >= 80 ? 'HIGH' : avgConfidence >= 70 ? 'MEDIUM' : 'LOW';
  const confidenceColor = avgConfidence >= 90 ? 'text-green-400' : avgConfidence >= 80 ? 'text-green-400' : avgConfidence >= 70 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="space-y-4">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-xl border border-cyan-500/20"
        style={{ backgroundColor: 'rgba(15, 30, 50, 0.8)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-mono text-cyan-400 flex items-center gap-2">
            pLDDT Confidence
            <Info className="w-3 h-3 text-cyan-400/50" />
          </h3>
          <span className={`text-xs font-bold ${confidenceColor}`}>{avgConfidence.toFixed(1)}% {confidenceLevel}</span>
        </div>
        <div className="h-[120px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={plddtData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="residue" hide />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#050510', border: '1px solid rgba(255,255,255,0.1)' }}
                itemStyle={{ color: '#00f0ff' }}
              />
              <Area type="monotone" dataKey="score" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="p-5 rounded-xl border border-purple-500/20"
        style={{ backgroundColor: 'rgba(15, 30, 50, 0.8)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-mono text-purple-400 flex items-center gap-2">
            Predicted Aligned Error
            <Info className="w-3 h-3 text-purple-400/50" />
          </h3>
          <span className="text-xs font-bold text-gray-300">{(prediction.rmsd || 0).toFixed(1)}Å AVG</span>
        </div>
        <div className="h-[120px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={paeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="residue" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#050510', border: '1px solid rgba(255,255,255,0.1)' }}
                itemStyle={{ color: '#a855f7' }}
              />
              <Line type="step" dataKey="error" stroke="#a855f7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl text-center border border-cyan-500/20" style={{ backgroundColor: 'rgba(15, 30, 50, 0.8)' }}>
          <div className="text-[10px] text-cyan-400/70 font-mono uppercase mb-1">Tm-Score</div>
          <div className="text-xl font-display font-bold text-white">{(prediction.tmScore || 0).toFixed(2)}</div>
        </div>
        <div className="p-4 rounded-xl text-center border border-cyan-500/20" style={{ backgroundColor: 'rgba(15, 30, 50, 0.8)' }}>
          <div className="text-[10px] text-cyan-400/70 font-mono uppercase mb-1">RMSD</div>
          <div className="text-xl font-display font-bold text-white">{(prediction.rmsd || 0).toFixed(1)}Å</div>
        </div>
      </div>
    </div>
  );
}
