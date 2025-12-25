import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Step {
  id: string;
  label: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  { id: 'msa', label: 'MSA Search', description: 'Searching genetic databases...', icon: '🧬' },
  { id: 'template', label: 'Template Pairing', description: 'Finding structural homologs...', icon: '🔍' },
  { id: 'evoformer', label: 'Evoformer Stack', description: 'Extracting evolutionary couplings...', icon: '🧠' },
  { id: 'structure', label: 'Structure Module', description: '3D coordinate generation...', icon: '🏗️' },
  { id: 'refinement', label: 'Amber Relaxation', description: 'Minimizing energy state...', icon: '⚡' },
];

function DNAHelixMini() {
  const strands = 8;
  return (
    <div className="relative w-5 h-6 flex items-center justify-center">
      {Array.from({ length: strands }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4,
            height: 4,
            top: (i / strands) * 20,
            background: i % 2 === 0 
              ? "linear-gradient(135deg, #00f0ff, #0080ff)" 
              : "linear-gradient(135deg, #8b5cf6, #ec4899)",
            boxShadow: i % 2 === 0
              ? "0 0 6px #00f0ff"
              : "0 0 6px #8b5cf6",
          }}
          animate={{
            x: [
              Math.sin((i / strands) * Math.PI * 2) * 6,
              Math.sin((i / strands) * Math.PI * 2 + Math.PI) * 6,
              Math.sin((i / strands) * Math.PI * 2) * 6,
            ],
            scale: [
              0.8 + Math.cos((i / strands) * Math.PI * 2) * 0.3,
              0.8 + Math.cos((i / strands) * Math.PI * 2 + Math.PI) * 0.3,
              0.8 + Math.cos((i / strands) * Math.PI * 2) * 0.3,
            ],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function ProcessExplainer({ isFolding, onComplete }: { isFolding: boolean, onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    if (isFolding) {
      setCurrentStep(0);
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            clearInterval(interval);
            setTimeout(onComplete, 500);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
      return () => clearInterval(interval);
    } else {
      setCurrentStep(-1);
    }
  }, [isFolding, onComplete]);

  if (!isFolding && currentStep === -1) return null;

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="glass-card-elite p-6 rounded-xl space-y-6 relative overflow-hidden"
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5"
        animate={{ 
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        }}
        transition={{ duration: 5, repeat: Infinity }}
        style={{ backgroundSize: "200% 100%" }}
      />
      
      <div className="relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <DNAHelixMini />
            <h3 className="text-sm font-mono text-white/80 uppercase tracking-widest">
              Folding Pipeline
            </h3>
          </div>
          <motion.span 
            className="text-xs font-mono text-primary"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
        
        <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full rounded-full"
            style={{ 
              background: "linear-gradient(90deg, #00f0ff, #8b5cf6, #ec4899)",
              boxShadow: "0 0 20px rgba(0,240,255,0.5)"
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
      
      <div className="space-y-3 relative">
        <motion.div 
          className="absolute left-[11px] top-3 bottom-3 w-[2px] rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <motion.div 
            className="w-full bg-gradient-to-b from-primary via-purple-500 to-transparent"
            style={{ height: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {steps.map((step, index) => {
          const status = index < currentStep ? 'completed' : index === currentStep ? 'active' : 'pending';
          
          return (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              className={`relative z-10 flex items-start gap-4 p-2 rounded-lg transition-all duration-300 ${
                status === 'active' ? 'bg-primary/10' : 
                status === 'completed' ? 'bg-green-500/5' : 'opacity-40'
              }`}
            >
              <div className="mt-0.5 relative">
                <AnimatePresence mode="wait">
                  {status === 'completed' && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle2 className="w-6 h-6 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    </motion.div>
                  )}
                  {status === 'active' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative"
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/30"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <Loader2 className="w-6 h-6 text-primary animate-spin drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
                    </motion.div>
                  )}
                  {status === 'pending' && (
                    <Circle className="w-6 h-6 text-white/20" />
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <motion.span
                    animate={status === 'active' ? { rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5, repeat: status === 'active' ? Infinity : 0 }}
                  >
                    {step.icon}
                  </motion.span>
                  <span className={`font-mono text-sm font-bold ${
                    status === 'active' ? 'text-primary text-glow-subtle' : 
                    status === 'completed' ? 'text-green-400' : 'text-white/50'
                  }`}>
                    {step.label}
                  </span>
                </div>
                <div className="text-xs text-white/50 ml-6">
                  {status === 'active' ? (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {step.description}
                    </motion.span>
                  ) : status === 'completed' ? (
                    <span className="text-green-400/70">Complete</span>
                  ) : (
                    'Waiting...'
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
