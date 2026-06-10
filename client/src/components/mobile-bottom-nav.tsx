import { Link, useLocation } from "wouter";
import { 
  FileText,
  Crown,
  Brain,
  Stethoscope,
  Dna,
  LayoutGrid
} from "lucide-react";
import { motion } from "framer-motion";
import { useSubscription } from "@/hooks/useSubscription";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: LayoutGrid, path: "/command-center" },
  { id: "billai", label: "Bill AI", icon: FileText, path: "/bill-ai" },
  { id: "learn", label: "Learn", icon: Brain, path: "/patient-diagnostics" },
  { id: "tools", label: "Tools", icon: Stethoscope, path: "/clinical-command-center" },
  { id: "lunafold", label: "LunaFold", icon: Dna, path: "/lunafold" },
  { id: "premium", label: "Premium", icon: Crown, path: "/premium" },
];

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
      className="fixed bottom-0 left-0 right-0 z-50 frosted-glass border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-stretch justify-around px-1 py-2 gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link key={item.id} href={item.path}>
              <motion.div
                className="relative flex flex-col items-center justify-center min-w-0 flex-1 py-1.5 px-1 rounded-xl transition-colors duration-200"
                whileTap={{ scale: 0.94 }}
                data-testid={`nav-${item.id}`}
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="bottomNavActive"
                    className="absolute top-0 h-0.5 w-6 rounded-full bg-gold"
                    transition={{ type: "spring", stiffness: 500, damping: 34 }}
                  />
                )}

                <div className="relative mb-1">
                  <Icon 
                    className={`h-5 w-5 transition-colors duration-200 ${active ? 'text-foreground' : 'text-muted-foreground'}`} 
                    strokeWidth={active ? 2.25 : 1.9} 
                  />
                  {item.id === 'premium' && !isSubscribed && (
                    <span className="absolute -top-1 -right-1.5 w-1.5 h-1.5 rounded-full bg-gold" />
                  )}
                </div>

                <span 
                  className={`text-[0.6875rem] font-medium leading-none truncate transition-colors duration-200 ${active ? 'text-foreground' : 'text-muted-foreground'}`}
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
