import { MobileButton } from "@/components/mobile-layout";
import { Apple, Mail, ArrowRight, Shield, DollarSign, Users, CheckCircle, Star, Award, Zap, Heart, TrendingDown, Target, AlertTriangle, FileText, MessageSquare, LogIn, Menu, Home, BookOpen, Crown as PremiumIcon, Gamepad2, Download, Phone, Search, User, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";

// Pre-login Navigation Dropdown - redirects to login with return URL
function PreLoginNavigationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    {
      icon: Home,
      label: "Home",
      href: "/",
      description: "Medical Bill AI & Overview"
    },
    {
      icon: BookOpen,
      label: "Cases",
      href: "/training",
      description: "Interactive Medical Training"
    },
    {
      icon: FileText,
      label: "Bill AI",
      href: "/bill-ai",
      description: "Find Medical Overcharges"
    },
    {
      icon: Shield,
      label: "Know Your Rights Hub",
      href: "/rights-hub",
      description: "Know Your Patient Rights",
      featured: true
    },
    {
      icon: Heart,
      label: "Emergency Financial Help",
      href: "/emergency-help",
      description: "Crisis Financial Assistance"
    },
    {
      icon: Search,
      label: "Quick Bill Analyzer",
      href: "/quick-analyzer",
      description: "Free Bill Analysis"
    },
    {
      icon: Phone,
      label: "Provider Contact Database",
      href: "/provider-contacts",
      description: "Hospital Contact Database"
    },
    {
      icon: PremiumIcon,
      label: "Premium",
      href: "/premium",
      description: "Upgrade Your Account"
    },
    {
      icon: Gamepad2,
      label: "Pixel Doctor Game",
      href: "/pixel-game",
      description: "Fun Pixelated Diagnostics",
      special: true
    },
    {
      icon: TrendingDown,
      label: "Bill Reduction Guide",
      href: "/bill-reduction-guide",
      description: "Expert Bill Reduction Strategies",
      premium: true
    },
    {
      icon: Download,
      label: "Get Bills from Portal",
      href: "/portal-access-guide",
      description: "Access Insurance & Provider Portals"
    }
  ];

  const handleNavigation = (href: string) => {
    // Redirect to login with return URL
    window.location.href = `/api/login?returnTo=${encodeURIComponent(href)}`;
  };

  return (
    <div className="relative">
      <motion.button
        className="flex items-center justify-center w-9 h-9 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-lg shadow-black/10 hover:bg-white/80 active:bg-white/90 transition-all duration-300"
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08, rotateZ: 2 }}
        onClick={() => setIsOpen(!isOpen)}
        data-testid="navigation-menu"
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
                    <motion.button
                      key={item.label}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-2xl mx-2 my-1 ${
                        item.special
                          ? 'text-purple-600 hover:bg-purple-50/80 hover:shadow-sm'
                          : item.premium
                            ? 'text-orange-600 hover:bg-orange-50/80 hover:shadow-sm'
                            : item.featured
                              ? 'text-blue-600 hover:bg-blue-50/80 hover:shadow-sm'
                              : 'text-gray-700 hover:bg-white/60 hover:shadow-sm'
                      }`}
                      onClick={() => handleNavigation(item.href)}
                      whileHover={{ x: 4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15 }}
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
                    </motion.button>
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

// Bottom Navigation Bar - requires login for all links
function BottomNavBar() {
  const navItems = [
    { 
      icon: Home, 
      label: "Home", 
      href: "/",
      testId: "nav-bottom-home"
    },
    { 
      icon: BookOpen, 
      label: "Cases", 
      href: "/training",
      testId: "nav-bottom-cases"
    },
    { 
      icon: FileText, 
      label: "Bill AI", 
      href: "/bill-ai",
      testId: "nav-bottom-bill-ai"
    },
    { 
      icon: PremiumIcon, 
      label: "Premium", 
      href: "/premium",
      testId: "nav-bottom-premium"
    }
  ];

  const handleNavClick = (href: string) => {
    // Redirect to login with return URL
    window.location.href = `/api/login?returnTo=${encodeURIComponent(href)}`;
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-2xl border-t border-white/20 shadow-2xl shadow-black/10"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
      }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto px-4 py-3 safe-area-inset-bottom">
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className="flex flex-col items-center justify-center space-y-1 min-w-[60px] group"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.05, duration: 0.3 }}
              data-testid={item.testId}
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icon container */}
                <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 group-hover:from-indigo-100 group-hover:to-purple-100 transition-all duration-300 shadow-sm group-hover:shadow-md">
                  <IconComponent className="h-5 w-5 text-gray-600 group-hover:text-indigo-600 transition-colors duration-300" />
                </div>

                {/* Login indicator badge */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <LogIn className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              
              <span className="text-xs font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors duration-300">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Login required indicator */}
      <motion.div 
        className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg opacity-0 pointer-events-none"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 3, delay: 1.5, repeat: 2 }}
      >
        <div className="flex items-center space-x-1">
          <LogIn className="h-3 w-3" />
          <span>Sign in to access features</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AuthLanding() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-${i % 3 === 0 ? '3' : i % 2 === 0 ? '2' : '1'} h-${i % 3 === 0 ? '3' : i % 2 === 0 ? '2' : '1'} bg-gradient-to-r ${
              i % 4 === 0 ? 'from-blue-400/40 to-indigo-400/40' :
              i % 4 === 1 ? 'from-emerald-400/40 to-teal-400/40' :
              i % 4 === 2 ? 'from-amber-400/40 to-orange-400/40' :
              'from-purple-400/40 to-pink-400/40'
            } rounded-full blur-sm`}
            style={{
              left: `${(i * 13) % 100}%`,
              top: `${(i * 17) % 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, (i % 2 === 0 ? 40 : -40), 0],
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.15, 1]
            }}
            transition={{
              duration: 8 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b border-white/20 shadow-xl shadow-black/5"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 pointer-events-none" />
        
        <div className="grid grid-cols-3 items-center h-16 px-5 max-w-7xl mx-auto gap-4">
          {/* Left - Menu */}
          <div className="flex justify-start">
            <PreLoginNavigationDropdown />
          </div>

          {/* Center - Logo */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-base sm:text-lg font-black whitespace-nowrap">
              <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Gold</span><span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">Rock</span> <span className="text-gray-900">Health</span>
            </h1>
          </motion.div>

          {/* Right - Sign In */}
          <div className="flex justify-end">
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
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 px-6 pt-24 pb-8 max-w-6xl mx-auto">
        
        {/* Hero Section - Condensed */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="relative w-20 h-20 mx-auto mb-5"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-emerald-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-amber-500 via-yellow-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/50">
              <div className="absolute inset-0 bg-white/20 rounded-3xl backdrop-blur-sm"></div>
              <Shield className="h-10 w-10 text-white relative z-10" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-2xl font-black text-gray-900 leading-tight mb-3">
              We Help You Reduce<br />Medical Bills
            </h2>
            <p className="text-base text-gray-700 leading-relaxed font-medium max-w-xl mx-auto">
              AI-powered analysis helps you identify potential medical billing errors and find opportunities to reduce your bills. <span className="text-sm text-gray-600">Users report average savings of $2,000 - $35,000+*</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Value Props + Auth - Side by Side */}
        <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
          {/* Quick Value Props */}
          <motion.div 
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {[
              { icon: Shield, text: "Identify billing errors", color: "from-blue-500 to-indigo-600" },
              { icon: DollarSign, text: "Find potential savings", color: "from-emerald-500 to-teal-600" },
              { icon: Zap, text: "Fast AI analysis", color: "from-amber-500 to-orange-600" },
              { icon: Heart, text: "Secure & private", color: "from-rose-500 to-pink-600" }
            ].map((item, index) => (
              <motion.div
                key={item.text}
                className="relative group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -3 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity`}></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-4 border border-white/50 shadow-xl">
                  <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-2 mx-auto shadow-lg`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-xs font-bold text-gray-900 text-center leading-tight">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Authentication Options - Condensed */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="text-center mb-3">
              <p className="text-base font-black text-gray-900">Start Fighting Your Bills Now</p>
            </div>

            {[
              { href: "/api/login", icon: Apple, text: "Continue with Apple", bg: "bg-black", textColor: "text-white", testId: "button-login-apple" },
              { href: "/api/login", icon: null, text: "Continue with Google", bg: "bg-white border-2 border-gray-200", textColor: "text-gray-800", testId: "button-login-google", isGoogle: true },
              { href: "/api/login", icon: Mail, text: "Continue with Email", bg: "bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200", textColor: "text-gray-800", testId: "button-login-email" }
            ].map((btn, index) => (
              <motion.a
                key={btn.text}
                href={btn.href}
                className={`block group ${btn.bg} ${btn.textColor} rounded-xl px-5 py-3 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all text-sm font-semibold`}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                data-testid={btn.testId}
              >
                {btn.isGoogle ? (
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                ) : btn.icon && <btn.icon className="h-5 w-5" />}
                <span>{btn.text}</span>
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* How We Fight + Stats - Combined */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
          {/* How We Fight - Condensed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <h3 className="text-lg font-black text-gray-900 mb-3 text-center">How It Works</h3>
            <div className="space-y-3">
              {[
                { icon: FileText, title: "1. Upload Your Bill", desc: "Upload your medical bill. Our AI analyzes every charge to identify potential errors and overcharges.", color: "from-blue-500 to-indigo-600" },
                { icon: AlertTriangle, title: "2. AI Identifies Issues", desc: "AI detects duplicate charges, billing errors, and pricing inconsistencies you should review.", color: "from-red-500 to-orange-600" },
                { icon: MessageSquare, title: "3. Get Guidance", desc: "Receive professional dispute letter templates and step-by-step guidance for bill negotiations.", color: "from-emerald-500 to-teal-600" }
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  className="relative bg-white/90 backdrop-blur-xl rounded-xl p-4 border border-white/50 shadow-lg group hover:shadow-xl transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${step.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <step.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{step.title}</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats + Why You Need This */}
          <div className="space-y-4">
            {/* Real Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <div className="relative group">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-green-500/30 rounded-2xl blur-xl"
                  animate={{ opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                ></motion.div>
                <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 rounded-2xl p-5 border-2 border-emerald-200/50 shadow-xl">
                  <h3 className="text-base font-black text-emerald-900 mb-3 text-center">Real People, Real Savings</h3>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
                    <div data-testid="stat-average-savings" className="text-center">
                      <div className="text-lg sm:text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">$8,500*</div>
                      <div className="text-xs text-emerald-700 font-bold mt-1">Users Report</div>
                    </div>
                    <div data-testid="stat-bills-reduced" className="text-center">
                      <div className="text-lg sm:text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">2,800+</div>
                      <div className="text-xs text-blue-700 font-bold mt-1">Bills Analyzed</div>
                    </div>
                    <div data-testid="stat-success-rate" className="text-center">
                      <div className="text-lg sm:text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">High</div>
                      <div className="text-xs text-purple-700 font-bold mt-1">Success Rate</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                    <span className="text-xs text-gray-700 ml-1 font-bold">Trusted by thousands</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Why You Need This */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <div className="relative bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-2xl p-5 border-2 border-red-200/50 shadow-xl">
                <h3 className="text-base font-black text-red-900 mb-3 text-center">Why Review Your Bills</h3>
                <div className="space-y-2">
                  {[
                    { text: "Medical bills frequently contain errors*", subtext: "billing mistakes happen more often than you think" },
                    { text: "Healthcare costs vary significantly", subtext: "understanding your charges helps you make informed decisions" },
                    { text: "Review before you pay", subtext: "you have the right to question charges" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-2 bg-white/60 rounded-lg p-3">
                      <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-700 font-medium leading-relaxed">
                        <span className="font-black text-gray-900">{item.text}</span> - {item.subtext}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer - Condensed */}
        <motion.div
          className="text-center space-y-4 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-4 flex-wrap gap-2">
            {[
              { icon: Shield, text: "Data Protected", color: "emerald" },
              { icon: CheckCircle, text: "Free to Start", color: "blue" },
              { icon: Award, text: "AI-Powered", color: "purple" }
            ].map((item, index) => (
              <div 
                key={item.text}
                className="flex items-center space-x-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-white/50"
              >
                <item.icon className={`h-4 w-4 text-${item.color}-600`} />
                <span className="text-xs font-bold text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Disclaimers */}
          <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 max-w-2xl mx-auto">
            <p className="text-xs text-gray-600 leading-relaxed space-y-1">
              <span className="block font-bold text-gray-700">*Important Disclaimers:</span>
              <span className="block">• <strong>Savings reported by users:</strong> Average savings of $8,500 and range of $2,000-$35,000+ are based on self-reported user outcomes. Individual results vary significantly based on bill complexity, provider response, and negotiation factors. No guarantee of specific savings amount.</span>
              <span className="block">• <strong>Medical billing errors:</strong> Studies suggest medical bills frequently contain errors, though exact percentages vary by source and methodology. We recommend all patients review their bills carefully.</span>
              <span className="block">• <strong>Educational platform:</strong> GoldRock Health provides educational information and AI-powered analysis tools. We are not a medical provider, law firm, or financial advisor. Results depend on individual circumstances.</span>
            </p>
          </div>

          {/* Legal */}
          <p className="text-xs text-gray-600 leading-relaxed">
            By continuing, you agree to our{" "}
            <Link href="/terms-of-service" className="text-indigo-600 font-bold underline hover:text-indigo-700">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy-policy" className="text-indigo-600 font-bold underline hover:text-indigo-700">Privacy Policy</Link>
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 font-medium">
            <span>© 2025 GoldRock Health</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span>We Help You Save</span>
          </div>

          <motion.p 
            className="text-base font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Ready to stop overpaying? Sign in now.
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
}
