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
  FileCheck,
  Menu,
  Heart,
  Search,
  Phone,
  Gamepad2,
  TrendingDown,
  Download
} from "lucide-react";

// 3-Bar Hamburger Navigation Dropdown for Pre-Login
function PreLoginNavigationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    {
      icon: Home,
      label: "Home",
      href: "/api/login",
      description: "Medical Bill AI & Overview"
    },
    {
      icon: Brain,
      label: "Bill AI",
      href: "/api/login?redirect=/bill-ai",
      description: "Find Medical Overcharges"
    },
    {
      icon: Shield,
      label: "Know Your Rights Hub",
      href: "/api/login?redirect=/rights-hub",
      description: "Know Your Patient Rights",
      featured: true
    },
    {
      icon: Heart,
      label: "Emergency Financial Help",
      href: "/api/login?redirect=/emergency-help",
      description: "Crisis Financial Assistance"
    },
    {
      icon: Search,
      label: "Quick Bill Analyzer",
      href: "/api/login?redirect=/quick-analyzer",
      description: "Free Bill Analysis"
    },
    {
      icon: Phone,
      label: "Provider Contact Database",
      href: "/api/login?redirect=/provider-contacts",
      description: "Hospital Contact Database"
    },
    {
      icon: Crown,
      label: "Premium",
      href: "/api/login?redirect=/premium",
      description: "Upgrade Your Account"
    },
    {
      icon: Gamepad2,
      label: "Pixel Doctor Game",
      href: "/api/login?redirect=/pixel-game",
      description: "Fun Pixelated Diagnostics",
      special: true
    },
    {
      icon: TrendingDown,
      label: "Bill Reduction Guide",
      href: "/api/login?redirect=/bill-reduction-guide",
      description: "Expert Bill Reduction Strategies",
      premium: true
    },
    {
      icon: Download,
      label: "Get Bills from Portal",
      href: "/api/login?redirect=/portal-access-guide",
      description: "Access Insurance & Provider Portals"
    }
  ];

  return (
    <div className="relative">
      <motion.button
        className="flex items-center justify-center w-9 h-9 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-lg shadow-black/10 hover:bg-white/80 active:bg-white/90 transition-all duration-300"
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08, rotateZ: 2 }}
        onClick={() => setIsOpen(!isOpen)}
        data-testid="navigation-menu-prelogin"
      >
        <Menu className="h-4 w-4 text-gray-700" />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              className="absolute left-0 top-full mt-3 w-72 sm:w-80 max-w-[calc(100vw-2rem)] backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl shadow-black/20 z-50 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                left: 'max(-1rem, calc(-100vw + 100% + 2rem))',
                right: 'auto',
                maxHeight: 'calc(100vh - 100px)'
              }}
              initial={{ opacity: 0, scale: 0.9, y: -15, rotateX: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -15, rotateX: -10 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/20 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 via-yellow-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Menu className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">Navigation</p>
                    <p className="text-xs text-gray-600">Sign in to access features</p>
                  </div>
                </div>
              </div>

              {/* Menu Items - Scrollable */}
              <div className="py-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                {navigationItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-2xl mx-2 my-1 ${
                        item.special
                          ? 'text-purple-600 hover:bg-purple-50/80 hover:shadow-sm'
                          : item.premium
                            ? 'text-orange-600 hover:bg-orange-50/80 hover:shadow-sm'
                            : item.featured
                              ? 'text-blue-600 hover:bg-blue-50/80 hover:shadow-sm'
                              : 'text-gray-700 hover:bg-white/60 hover:shadow-sm'
                      }`}
                      onClick={() => setIsOpen(false)}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        item.special 
                          ? 'bg-gradient-to-br from-purple-100 to-pink-100'
                          : item.premium
                            ? 'bg-gradient-to-br from-orange-100 to-amber-100'
                            : item.featured
                              ? 'bg-gradient-to-br from-blue-100 to-cyan-100'
                              : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`h-4 w-4 ${
                          item.special 
                            ? 'text-purple-600' 
                            : item.premium 
                              ? 'text-orange-600'
                              : item.featured
                                ? 'text-blue-600'
                                : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{item.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                      </div>
                      {(item.special || item.premium || item.featured) && (
                        <motion.div
                          className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                            item.special 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                              : item.premium
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                          }`}
                          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

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
          {/* Left Section - Hamburger Menu + Logo */}
          <div className="flex items-center gap-3">
            <PreLoginNavigationDropdown />
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
          </div>

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
    </>
  );
}
