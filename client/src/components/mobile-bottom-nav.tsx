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
  Shield
} from "lucide-react";
import { motion } from "framer-motion";
import { useSubscription } from "@/hooks/useSubscription";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  color: string;
}

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    path: "/",
    color: "text-blue-600"
  },
  {
    id: "training",
    label: "Cases",
    icon: BookOpen,
    path: "/training",
    color: "text-green-600"
  },
  {
    id: "billai",
    label: "Bill AI",
    icon: FileText,
    path: "/bill-ai",
    color: "text-purple-600"
  },
  {
    id: "rights",
    label: "Rights",
    icon: Shield,
    path: "/rights-hub",
    color: "text-red-600"
  },
  {
    id: "premium",
    label: "Premium",
    icon: Crown,
    path: "/premium",
    color: "text-orange-600"
  }
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
      className="fixed bottom-0 left-0 right-0 z-50 bg-gray-100/95 backdrop-blur-xl border-t border-gray-200/50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link key={item.id} href={item.path}>
              <motion.div
                className="flex flex-col items-center justify-center min-w-0 flex-1 p-2 rounded-3xl transition-all duration-300"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  backgroundColor: active ? "rgba(99, 102, 241, 0.15)" : "rgba(255, 255, 255, 0.8)"
                }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.4,
                  backgroundColor: { duration: 0.3 }
                }}
                data-testid={`nav-${item.id}`}
              >
                <motion.div
                  className="relative"
                  animate={{
                    scale: active ? 1.15 : 1,
                    y: active ? -2 : 0
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                  }}
                >
                  <Icon 
                    className="h-6 w-6 mb-1"
                    style={{
                      color: active ? (
                        item.color === 'text-blue-600' ? '#3B82F6' :
                        item.color === 'text-purple-600' ? '#8B5CF6' :
                        item.color === 'text-green-600' ? '#10B981' :
                        item.color === 'text-red-600' ? '#DC2626' :
                        item.color === 'text-orange-600' ? '#F59E0B' :
                        item.color === 'text-indigo-600' ? '#6366F1' :
                        '#6366F1'
                      ) : '#6B7280'
                    }}
                  />
                  
                  {/* Premium Badge for Premium Tab */}
                  {item.id === 'premium' && !isSubscribed && (
                    <motion.div
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
                    >
                      <Sparkles className="h-3 w-3" />
                    </motion.div>
                  )}
                  
                  {/* Premium Member Badge */}
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
                  
                  {active && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 w-1 h-1 bg-current rounded-full"
                      layoutId="activeTab"
                      style={{ x: '-50%' }}
                    />
                  )}
                </motion.div>
                <motion.span 
                  className="text-sm font-medium leading-none truncate"
                  animate={{
                    color: active ? (
                      item.color === 'text-blue-600' ? '#3B82F6' :
                      item.color === 'text-purple-600' ? '#8B5CF6' :
                      item.color === 'text-green-600' ? '#10B981' :
                      item.color === 'text-red-600' ? '#DC2626' :
                      item.color === 'text-orange-600' ? '#F59E0B' :
                      item.color === 'text-indigo-600' ? '#6366F1' :
                      '#6366F1'
                    ) : '#374151',
                    fontWeight: active ? 600 : 500,
                    scale: active ? 1.05 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {item.label}
                </motion.span>
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