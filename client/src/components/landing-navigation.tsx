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

const EASE = [0.22, 1, 0.36, 1] as const;

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
        className="flex items-center justify-center w-9 h-9 rounded-2xl bg-secondary border border-border shadow-sm hover:bg-muted transition-all duration-300"
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(!isOpen)}
        data-testid="navigation-menu-prelogin"
      >
        <Menu className="h-4 w-4 text-foreground" />
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
              className="absolute left-0 top-full mt-3 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-popover rounded-3xl border border-border shadow-xl z-50 overflow-hidden"
              style={{
                left: 'max(-1rem, calc(-100vw + 100% + 2rem))',
                right: 'auto',
                maxHeight: 'calc(100vh - 100px)'
              }}
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {/* Header */}
              <div className="p-4 border-b border-border flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ background: "linear-gradient(135deg, var(--gold-soft), var(--gold-deep))" }}
                  >
                    <Menu className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground leading-tight">Navigation</p>
                    <p className="text-xs text-muted-foreground">Sign in to access features</p>
                  </div>
                </div>
              </div>

              {/* Menu Items - Scrollable */}
              <div className="py-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const accent = item.special || item.premium || item.featured;
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-2xl mx-2 my-1 text-foreground hover:bg-secondary hover:shadow-sm"
                      onClick={() => setIsOpen(false)}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent ? '' : 'bg-secondary'}`}
                        style={accent ? { background: "linear-gradient(135deg, var(--gold-soft), var(--gold-deep))" } : undefined}
                      >
                        <IconComponent className={`h-4 w-4 ${accent ? 'text-white' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{item.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                      </div>
                      {accent && (
                        <span className="w-2 h-2 rounded-full bg-gold" />
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
        className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left Section - Hamburger Menu + Logo */}
          <div className="flex items-center gap-3">
            <PreLoginNavigationDropdown />
            <motion.h1 
              className="font-serif text-lg font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-foreground">GoldRock</span>
              <span className="text-gold"> Health</span>
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
              <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-semibold transition-colors">
                Features
                <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'features' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'features' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-popover rounded-2xl shadow-xl border border-border overflow-hidden"
                  >
                    <div className="p-2">
                      <a 
                        href="/api/login?redirect=/bill-ai" 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-all group"
                        data-testid="nav-bill-ai"
                      >
                        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Brain className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-foreground">AI Bill Analysis</div>
                          <div className="text-xs text-muted-foreground">Find errors & savings</div>
                        </div>
                      </a>
                      
                      <a 
                        href="/api/login?redirect=/resources-hub" 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-all group"
                        data-testid="nav-resources"
                      >
                        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Database className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-foreground">Resources Hub</div>
                          <div className="text-xs text-muted-foreground">Guides & templates</div>
                        </div>
                      </a>

                      <a 
                        href="/api/login?redirect=/quick-analyzer" 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-all group"
                        data-testid="nav-quick-analyzer"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
                          style={{ background: "linear-gradient(135deg, var(--gold-soft), var(--gold-deep))" }}
                        >
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-foreground">Quick Analyzer</div>
                          <div className="text-xs text-muted-foreground">Instant bill scan</div>
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
              <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-semibold transition-colors">
                Resources
                <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'resources' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-popover rounded-2xl shadow-xl border border-border overflow-hidden"
                  >
                    <div className="p-2">
                      <a 
                        href="/api/login?redirect=/bill-reduction-guide" 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-all group"
                        data-testid="nav-reduction-guide"
                      >
                        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Target className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-foreground">Reduction Guide</div>
                          <div className="text-xs text-muted-foreground">Step-by-step tactics</div>
                        </div>
                      </a>

                      <a 
                        href="/api/login?redirect=/templates" 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-all group"
                        data-testid="nav-templates"
                      >
                        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-foreground">Dispute Templates</div>
                          <div className="text-xs text-muted-foreground">Professional letters</div>
                        </div>
                      </a>

                      <a 
                        href="/api/login?redirect=/industry-insights" 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-all group"
                        data-testid="nav-insights"
                      >
                        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Sparkles className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-foreground">Industry Secrets</div>
                          <div className="text-xs text-muted-foreground">Insider tactics</div>
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
              className="flex items-center gap-1.5 text-muted-foreground hover:text-gold font-semibold transition-colors"
              data-testid="nav-premium"
            >
              <Crown className="h-4 w-4" />
              Premium
            </a>
          </div>

          {/* Sign Up & Sign In Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <motion.a
              href="/api/login"
              className="flex items-center space-x-1 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, var(--gold-soft), var(--gold-deep))" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              data-testid="button-header-signup"
            >
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Sign Up</span>
            </motion.a>
            <motion.a
              href="/api/login"
              className="flex items-center space-x-1 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all whitespace-nowrap"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              data-testid="button-header-signin"
            >
              <LogIn className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Sign In</span>
            </motion.a>
          </div>
        </div>
      </motion.header>
    </>
  );
}
