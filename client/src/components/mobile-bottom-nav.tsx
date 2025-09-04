import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home,
  BookOpen,
  Brain,
  Trophy,
  User,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

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
    id: "ai",
    label: "AI Gen",
    icon: Brain,
    path: "/ai-generator",
    color: "text-purple-600"
  },
  {
    id: "game",
    label: "Practice",
    icon: Zap,
    path: "/game",
    color: "text-orange-600"
  },
  {
    id: "achievements",
    label: "Progress",
    icon: Trophy,
    path: "/achievements",
    color: "text-yellow-600"
  }
];

export function MobileBottomNav() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link key={item.id} href={item.path}>
              <motion.div
                className="flex flex-col items-center justify-center min-w-0 flex-1 p-2 rounded-xl transition-all duration-200"
                whileTap={{ scale: 0.95 }}
                animate={{
                  backgroundColor: active ? "rgba(99, 102, 241, 0.1)" : "transparent"
                }}
                data-testid={`nav-${item.id}`}
              >
                <motion.div
                  animate={{
                    scale: active ? 1.1 : 1,
                    color: active ? item.color : "#6B7280"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className="h-5 w-5 mb-1" />
                </motion.div>
                <motion.span 
                  className="text-xs font-medium leading-none truncate"
                  animate={{
                    color: active ? item.color : "#6B7280",
                    fontWeight: active ? 600 : 500
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Add safe area padding utility
export function SafeAreaProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-20 safe-area-pb">
      {children}
    </div>
  );
}