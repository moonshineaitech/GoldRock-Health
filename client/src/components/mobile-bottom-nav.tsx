import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home,
  BookOpen,
  FileText,
  Trophy,
  User,
  Crown,
  Sparkles,
  Shield,
  Lightbulb,
  Brain,
  Stethoscope,
  Dna
} from "lucide-react";
import { motion } from "framer-motion";
import { useSubscription } from "@/hooks/useSubscription";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  color: string;
  bgGradient: string;
}

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    path: "/",
    color: "#3B82F6",
    bgGradient: "blue"
  },
  {
    id: "billai",
    label: "Bill AI",
    icon: FileText,
    path: "/bill-ai",
    color: "#8B5CF6",
    bgGradient: "purple"
  },
  {
    id: "diagnostics",
    label: "Diagnose",
    icon: Brain,
    path: "/patient-diagnostics",
    color: "#14B8A6",
    bgGradient: "teal"
  },
  {
    id: "clinical",
    label: "Clinical",
    icon: Stethoscope,
    path: "/clinical-command-center",
    color: "#6366F1",
    bgGradient: "indigo"
  },
  {
    id: "lunafold",
    label: "LunaFold",
    icon: Dna,
    path: "/lunafold",
    color: "#06B6D4",
    bgGradient: "cyan"
  },
  {
    id: "premium",
    label: "Premium",
    icon: Crown,
    path: "/premium",
    color: "#F59E0B",
    bgGradient: "amber"
  }
];

const bgColors: Record<string, string> = {
  blue: 'rgba(239,246,255,0.9), rgba(224,231,255,0.8)',
  purple: 'rgba(245,243,255,0.9), rgba(237,233,254,0.8)',
  teal: 'rgba(240,253,250,0.9), rgba(204,251,241,0.8)',
  indigo: 'rgba(238,242,255,0.9), rgba(224,231,255,0.8)',
  cyan: 'rgba(236,254,255,0.9), rgba(207,250,254,0.8)',
  amber: 'rgba(255,251,235,0.9), rgba(254,243,199,0.8)',
};

export function MobileBottomNav() {
  const [location] = useLocation();
  const { isSubscribed } = useSubscription();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-2xl border-t border-white/20"
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.08)'
      }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center justify-around px-1 py-2 gap-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link key={item.id} href={item.path}>
              <motion.div
                className="relative flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 rounded-2xl transition-all duration-300 overflow-hidden group"
                style={{
                  background: `linear-gradient(135deg, ${bgColors[item.bgGradient]})`,
                  boxShadow: active 
                    ? `0 4px 12px ${item.color}30, inset 0 1px 0 rgba(255,255,255,0.8)` 
                    : '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)'
                }}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05, y: -2 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                data-testid={`nav-${item.id}`}
              >
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${item.color}15, ${item.color}08)`
                  }}
                />
                <motion.div className="relative z-10">
                  <motion.div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-1 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                      boxShadow: `0 4px 12px ${item.color}40`
                    }}
                    animate={{
                      scale: active ? 1.1 : 1,
                    }}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
                  </motion.div>
                  
                  {item.id === 'premium' && !isSubscribed && (
                    <motion.div
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full p-1 shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
                    >
                      <Sparkles className="h-2.5 w-2.5" />
                    </motion.div>
                  )}
                  
                  {item.id === 'premium' && isSubscribed && (
                    <motion.div
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.div>
                <span 
                  className="text-xs font-bold leading-none truncate relative z-10"
                  style={{ color: item.color }}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

// Add safe area padding utility
export function SafeAreaProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-16" style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))' }}>
      {children}
    </div>
  );
}