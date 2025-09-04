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
      className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 safe-area-pt"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left Section */}
        <div className="flex items-center min-w-0">
          {showBackButton ? (
            <motion.button
              onClick={handleBackClick}
              className="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-gray-100 active:bg-gray-200 transition-colors"
              whileTap={{ scale: 0.95 }}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 text-gray-700" />
            </motion.button>
          ) : (
            <div className="w-8 h-8 mr-2" /> // Placeholder for consistent spacing
          )}
        </div>

        {/* Center Section - Title */}
        <motion.h1 
          className="flex-1 text-lg font-semibold text-gray-900 text-center truncate px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h1>

        {/* Right Section */}
        <div className="flex items-center min-w-0">
          {rightAction || <div className="w-8 h-8" />} {/* Placeholder for consistent spacing */}
        </div>
      </div>
    </motion.header>
  );
}

// Notification button component for header
export function NotificationButton() {
  return (
    <motion.button
      className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 active:bg-gray-200 transition-colors relative"
      whileTap={{ scale: 0.95 }}
      data-testid="button-notifications"
    >
      <Bell className="h-4 w-4 text-gray-700" />
      {/* Notification badge */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
    </motion.button>
  );
}