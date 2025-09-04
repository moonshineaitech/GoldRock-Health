import { ArrowLeft, Menu, User, Settings, Crown, LogOut, Palette, Volume2, ChevronDown } from "lucide-react";
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
      className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left Section */}
        <div className="flex items-center min-w-0">
          {showBackButton ? (
            <motion.button
              onClick={handleBackClick}
              className="flex items-center justify-center w-7 h-7 mr-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              data-testid="button-back"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-gray-600" />
            </motion.button>
          ) : (
            <div className="w-7 h-7 mr-3" />
          )}
        </div>

        {/* Center Section - Title */}
        <motion.h1 
          className="flex-1 text-base font-semibold text-gray-900 text-center truncate px-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {title}
        </motion.h1>

        {/* Right Section */}
        <div className="flex items-center min-w-0">
          {rightAction || <div className="w-7 h-7" />}
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
        className="flex items-center justify-center w-7 h-7 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => window.location.href = "/api/login"}
        data-testid="button-login"
      >
        <User className="h-3.5 w-3.5 text-gray-600" />
      </motion.button>
    );
  }

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="relative">
      <motion.button
        className="flex items-center space-x-1 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 p-1"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsOpen(!isOpen)}
        data-testid="user-avatar-dropdown"
      >
        {/* Avatar */}
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          {user?.profileImageUrl ? (
            <img 
              src={user.profileImageUrl} 
              alt="Profile" 
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            <span className="text-xs font-medium text-white">{userInitials}</span>
          )}
        </div>
        
        {/* Dropdown indicator */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3 w-3 text-gray-500" />
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
              className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl z-50 overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* User Info */}
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-white">{userInitials}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user?.email?.split('@')[0] || 'User'
                      }
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    {isSubscribed && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                {menuItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.button
                      key={item.label}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-sm transition-colors ${
                        item.danger 
                          ? 'text-red-600 hover:bg-red-50' 
                          : item.highlight
                            ? 'text-orange-600 hover:bg-orange-50'
                            : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={item.action}
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.1 }}
                      data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <IconComponent className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.highlight && (
                        <motion.div
                          className="w-2 h-2 bg-orange-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
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