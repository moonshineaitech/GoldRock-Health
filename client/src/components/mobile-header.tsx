import { ArrowLeft, Menu, User, Settings, Crown, LogOut, Palette, Volume2, ChevronDown, Home, BookOpen, FileText, Crown as PremiumIcon, Gamepad2, TrendingDown, Download, Shield, Heart, Search, Phone, Receipt } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
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
      icon: Shield,
      label: "Collections Defense",
      href: "/collections-defense-guide",
      description: "Fight Back Against Collections",
      featured: true
    },
    {
      icon: Receipt,
      label: "Hospital Bill Playbook",
      href: "/hospital-bill-playbook",
      description: "Reduce Bills Before Collections",
      featured: true
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
        className="flex items-center justify-center w-9 h-9 rounded-xl bg-secondary border border-border shadow-sm hover:bg-accent transition-all duration-300"
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.04 }}
        onClick={() => setIsOpen(!isOpen)}
        data-testid="navigation-menu"
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
              className="absolute left-0 top-full mt-3 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-popover text-popover-foreground backdrop-blur-xl rounded-2xl border border-border shadow-xl z-50 overflow-hidden"
              style={{
                left: 'max(-1rem, calc(-100vw + 100% + 2rem))',
                right: 'auto',
                maxHeight: 'calc(100vh - 180px)'
              }}
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header */}
              <div className="p-4 border-b border-border flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
                  >
                    <Menu className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">Navigation</p>
                    <p className="text-xs text-muted-foreground">Choose your destination</p>
                  </div>
                </div>
              </div>

              {/* Menu Items - Scrollable */}
              <div className="py-2 overflow-y-auto medical-scrollbar" style={{ maxHeight: 'calc(100vh - 260px)' }}>
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const accent = item.special || item.premium || item.featured;
                  return (
                    <motion.button
                      key={item.label}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl mx-2 my-0.5 text-foreground hover:bg-accent"
                      onClick={() => {
                        navigate(item.href);
                        setIsOpen(false);
                      }}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.15 }}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ? 'bg-accent' : 'bg-secondary'}`}>
                        <IconComponent className={`h-4 w-4 ${accent ? 'text-gold' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-foreground">{item.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                      </div>
                      {accent && (
                        <div className="w-1.5 h-1.5 rounded-full bg-gold" />
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
  subtitle,
  showBackButton = false, 
  onBackClick,
  rightAction 
}: MobileHeaderProps) {
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-40 frosted-glass border-b border-border"
      style={{
        paddingTop: 'env(safe-area-inset-top)'
      }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between h-16 px-5 relative">
        {/* Left Section */}
        <div className="flex items-center min-w-0">
          {showBackButton ? (
            <motion.button
              onClick={handleBackClick}
              className="flex items-center justify-center w-9 h-9 mr-4 rounded-xl bg-secondary border border-border shadow-sm hover:bg-accent transition-all duration-300"
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.04 }}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 text-foreground" />
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
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
        >
          <h1 className="font-serif text-lg font-semibold text-foreground truncate leading-none tracking-tight">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-[0.6875rem] text-muted-foreground truncate mt-1 leading-none">{subtitle}</p>
          ) : (
            <div className="h-px w-8 rounded-full mx-auto mt-1.5 bg-gold opacity-70" />
          )}
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
        setIsOpen(false);
      }
    },
    {
      icon: Volume2,
      label: "Audio Settings",
      action: () => {
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
        className="flex items-center justify-center w-9 h-9 rounded-xl bg-secondary border border-border shadow-sm hover:bg-accent transition-all duration-300"
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.04 }}
        onClick={() => window.location.href = "/api/login"}
        data-testid="button-login"
      >
        <User className="h-4 w-4 text-foreground" />
      </motion.button>
    );
  }

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="relative">
      <motion.button
        className="flex items-center space-x-1.5 rounded-xl bg-secondary border border-border shadow-sm hover:bg-accent transition-all duration-300 p-1.5"
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.04 }}
        onClick={() => setIsOpen(!isOpen)}
        data-testid="user-avatar-dropdown"
      >
        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
          style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
        >
          {user?.profileImageUrl ? (
            <img 
              src={user.profileImageUrl} 
              alt="Profile" 
              className="w-full h-full rounded-lg object-cover"
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
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
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
              className="absolute right-0 top-full mt-3 w-56 sm:w-64 max-w-[calc(100vw-2rem)] bg-popover text-popover-foreground backdrop-blur-xl rounded-2xl border border-border shadow-xl z-50 overflow-hidden"
              style={{
                right: 'max(-1rem, calc(-100vw + 100% + 2rem))',
                left: 'auto'
              }}
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* User Info */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
                  >
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-white tracking-tight">{userInitials}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate leading-tight">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user?.email?.split('@')[0] || 'User'
                      }
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email}</p>
                    {isSubscribed && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-accent text-accent-foreground mt-2">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.button
                      key={item.label}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl mx-2 my-0.5 ${
                        item.danger 
                          ? 'text-destructive hover:bg-destructive/10' 
                          : item.highlight
                            ? 'text-gold hover:bg-accent'
                            : 'text-foreground hover:bg-accent'
                      }`}
                      onClick={item.action}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.15 }}
                      data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <IconComponent className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.highlight && (
                        <div className="w-1.5 h-1.5 rounded-full bg-gold" />
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
