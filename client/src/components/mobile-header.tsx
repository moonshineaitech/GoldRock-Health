import { ArrowLeft, Menu, User, Settings, Crown, LogOut, Palette, Volume2, ChevronDown, Home, BookOpen, FileText, Crown as PremiumIcon, Gamepad2, TrendingDown, Download, Shield, Heart, Search, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

interface MobileHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightAction?: React.ReactNode;
}

// Navigation dropdown component
export function NavigationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [, navigate] = useLocation();

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
      description: "Know Your Patient Rights"
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
                right: 'auto'
              }}
              initial={{ opacity: 0, scale: 0.9, y: -15, rotateX: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -15, rotateX: -10 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 via-yellow-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Menu className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">Navigation</p>
                    <p className="text-xs text-gray-600">Choose your destination</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
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
                            : 'text-gray-700 hover:bg-white/60 hover:shadow-sm'
                      }`}
                      onClick={() => {
                        navigate(item.href);
                        setIsOpen(false);
                      }}
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
                            : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`h-4 w-4 ${
                          item.special 
                            ? 'text-purple-600' 
                            : item.premium 
                              ? 'text-orange-600' 
                              : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{item.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                      </div>
                      {(item.special || item.premium) && (
                        <motion.div
                          className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                            item.special 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                              : 'bg-gradient-to-r from-orange-500 to-amber-500'
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

export function MobileHeader({ 
  title, 
  showBackButton = false, 
  onBackClick,
  rightAction 
}: MobileHeaderProps) {
  const [, navigate] = useLocation();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-2xl border-b border-white/20 shadow-xl shadow-black/5"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
        paddingTop: 'env(safe-area-inset-top)'
      }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Premium glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 pointer-events-none" />
      
      <div className="flex items-center justify-between h-16 px-5 relative">
        {/* Left Section */}
        <div className="flex items-center min-w-0">
          {showBackButton ? (
            <motion.button
              onClick={handleBackClick}
              className="flex items-center justify-center w-9 h-9 mr-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-lg shadow-black/10 hover:bg-white/80 active:bg-white/90 transition-all duration-300"
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.08, rotateZ: -2 }}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 text-gray-700" />
            </motion.button>
          ) : (
            <div className="mr-4">
              <NavigationDropdown />
            </div>
          )}
        </div>

        {/* Center Section - Title */}
        <motion.div 
          className="flex-1 text-center px-3"
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent truncate leading-none">
            {title}
          </h1>
          <div className="h-0.5 w-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mt-1 opacity-60" />
        </motion.div>

        {/* Right Section */}
        <div className="flex items-center min-w-0">
          {rightAction || <div className="w-9 h-9" />}
        </div>
      </div>
    </motion.header>
  );
}

// User avatar dropdown component for header
export function UserAvatarDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { isSubscribed } = useSubscription();

  const menuItems = [
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
      action: () => {
        window.location.href = "/settings";
        setIsOpen(false);
      }
    },
    {
      icon: Crown,
      label: isSubscribed ? "Manage Plan" : "Go Premium",
      href: "/premium",
      action: () => {
        window.location.href = "/premium";
        setIsOpen(false);
      },
      highlight: !isSubscribed
    },
    {
      icon: Palette,
      label: "Appearance",
      action: () => {
        // Theme toggle functionality could go here
        setIsOpen(false);
      }
    },
    {
      icon: Volume2,
      label: "Audio Settings",
      action: () => {
        // Audio settings could go here
        setIsOpen(false);
      }
    },
    {
      icon: LogOut,
      label: "Log Out",
      action: () => {
        window.location.href = "/api/logout";
        setIsOpen(false);
      },
      danger: true
    }
  ];

  if (!isAuthenticated) {
    return (
      <motion.button
        className="flex items-center justify-center w-9 h-9 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-lg shadow-black/10 hover:bg-white/80 active:bg-white/90 transition-all duration-300"
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08, rotateZ: -2 }}
        onClick={() => window.location.href = "/api/login"}
        data-testid="button-login"
      >
        <User className="h-4 w-4 text-gray-700" />
      </motion.button>
    );
  }

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="relative">
      <motion.button
        className="flex items-center space-x-1.5 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-lg shadow-black/10 hover:bg-white/80 active:bg-white/90 transition-all duration-300 p-1.5"
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08, rotateZ: 2 }}
        onClick={() => setIsOpen(!isOpen)}
        data-testid="user-avatar-dropdown"
      >
        {/* Avatar */}
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          {user?.profileImageUrl ? (
            <img 
              src={user.profileImageUrl} 
              alt="Profile" 
              className="w-full h-full rounded-xl object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-white tracking-tight">{userInitials}</span>
          )}
        </div>
        
        {/* Dropdown indicator */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown className="h-3.5 w-3.5 text-gray-600" />
        </motion.div>
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
              className="absolute right-0 top-full mt-3 w-56 sm:w-64 max-w-[calc(100vw-2rem)] backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl shadow-black/20 z-50 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                right: 'max(-1rem, calc(-100vw + 100% + 2rem))',
                left: 'auto'
              }}
              initial={{ opacity: 0, scale: 0.9, y: -15, rotateX: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -15, rotateX: -10 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* User Info */}
              <div className="p-4 border-b border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-white tracking-tight">{userInitials}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate leading-tight">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user?.email?.split('@')[0] || 'User'
                      }
                    </p>
                    <p className="text-xs text-gray-600 truncate mt-0.5">{user?.email}</p>
                    {isSubscribed && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 mt-2 shadow-sm">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {menuItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.button
                      key={item.label}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-2xl mx-2 my-1 ${
                        item.danger 
                          ? 'text-red-600 hover:bg-red-50/80 hover:shadow-sm' 
                          : item.highlight
                            ? 'text-orange-600 hover:bg-orange-50/80 hover:shadow-sm'
                            : 'text-gray-700 hover:bg-white/60 hover:shadow-sm'
                      }`}
                      onClick={item.action}
                      whileHover={{ x: 4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <IconComponent className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.highlight && (
                        <motion.div
                          className="w-2.5 h-2.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-sm"
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