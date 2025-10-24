import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  DollarSign, 
  LogIn, 
  ChevronDown, 
  Sparkles,
  FileText,
  Brain,
  Crown,
  Shield,
  Database,
  Zap,
  Target,
  BookOpen,
  Home,
  FileCheck
} from "lucide-react";

export function LandingNavigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownEnter = (dropdown: string) => {
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b border-white/20 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <motion.h1 
            className="text-lg font-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Gold</span>
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">Rock</span>
            <span className="text-gray-900"> Health</span>
          </motion.h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Features Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownEnter('features')}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 font-semibold transition-colors">
                Features
                <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'features' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'features' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    <div className="p-2">
                      <a 
                        href="/api/login?redirect=/bill-ai" 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all group"
                        data-testid="nav-bill-ai"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Brain className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">AI Bill Analysis</div>
                          <div className="text-xs text-gray-500">Find errors & savings</div>
                        </div>
                      </a>
                      
                      <a 
                        href="/api/login?redirect=/resources-hub" 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all group"
                        data-testid="nav-resources"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Database className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">Resources Hub</div>
                          <div className="text-xs text-gray-500">Guides & templates</div>
                        </div>
                      </a>

                      <a 
                        href="/api/login?redirect=/quick-analyzer" 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all group"
                        data-testid="nav-quick-analyzer"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">Quick Analyzer</div>
                          <div className="text-xs text-gray-500">Instant bill scan</div>
                        </div>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownEnter('resources')}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 font-semibold transition-colors">
                Resources
                <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'resources' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    <div className="p-2">
                      <a 
                        href="/api/login?redirect=/bill-reduction-guide" 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all group"
                        data-testid="nav-reduction-guide"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">Reduction Guide</div>
                          <div className="text-xs text-gray-500">Step-by-step tactics</div>
                        </div>
                      </a>

                      <a 
                        href="/api/login?redirect=/templates" 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 transition-all group"
                        data-testid="nav-templates"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">Dispute Templates</div>
                          <div className="text-xs text-gray-500">Professional letters</div>
                        </div>
                      </a>

                      <a 
                        href="/api/login?redirect=/industry-insights" 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all group"
                        data-testid="nav-insights"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">Industry Secrets</div>
                          <div className="text-xs text-gray-500">Insider tactics</div>
                        </div>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Premium Link */}
            <a 
              href="/api/login?redirect=/premium" 
              className="flex items-center gap-1.5 text-gray-700 hover:text-purple-600 font-semibold transition-colors"
              data-testid="nav-premium"
            >
              <Crown className="h-4 w-4" />
              Premium
            </a>
          </div>

          {/* Sign In Button */}
          <motion.a
            href="/api/login"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-testid="button-header-signin"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </motion.a>
        </div>
      </motion.header>

      {/* Bottom Navigation - Fixed to bottom */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-1 py-2">
            {[
              { href: "/api/login", icon: Home, label: "Home", color: "text-gray-600", testId: "bottom-nav-home" },
              { href: "/api/login?redirect=/bill-ai", icon: Brain, label: "Bill AI", color: "text-blue-600", testId: "bottom-nav-bill-ai" },
              { href: "/api/login?redirect=/resources-hub", icon: BookOpen, label: "Guides", color: "text-emerald-600", testId: "bottom-nav-guides" },
              { href: "/api/login?redirect=/premium", icon: Crown, label: "Premium", color: "text-purple-600", testId: "bottom-nav-premium" }
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center py-2 px-3 rounded-xl hover:bg-gray-50 transition-all group"
                data-testid={item.testId}
              >
                <item.icon className={`h-6 w-6 ${item.color} group-hover:scale-110 transition-transform mb-1`} />
                <span className="text-xs font-bold text-gray-700 group-hover:text-gray-900">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </motion.nav>
    </>
  );
}
