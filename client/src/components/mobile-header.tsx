import { ArrowLeft, Menu, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

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
      className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 safe-area-pt"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between h-12 px-4">
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

// Notification button component for header
export function NotificationButton() {
  return (
    <motion.button
      className="flex items-center justify-center w-7 h-7 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 relative"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      data-testid="button-notifications"
    >
      <Bell className="h-3.5 w-3.5 text-gray-600" />
      {/* Animated notification badge */}
      <motion.div 
        className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.button>
  );
}