import { MobileHeader, NotificationButton } from "./mobile-header";
import { MobileBottomNav, SafeAreaProvider } from "./mobile-bottom-nav";
import { motion } from "framer-motion";

interface MobileLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showBottomNav?: boolean;
  className?: string;
}

export function MobileLayout({ 
  children, 
  title, 
  showBackButton = false,
  onBackClick,
  showBottomNav = true,
  className = ""
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50">
      <MobileHeader 
        title={title}
        showBackButton={showBackButton}
        onBackClick={onBackClick}
        rightAction={<NotificationButton />}
      />
      
      <motion.main 
        className={`pt-12 ${showBottomNav ? 'pb-16' : 'pb-4'} px-4 ${className}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: 0.2,
          ease: "easeOut"
        }}
      >
        <SafeAreaProvider>
          {children}
        </SafeAreaProvider>
      </motion.main>
      
      {showBottomNav && <MobileBottomNav />}
    </div>
  );
}

// Mobile-optimized card component
export function MobileCard({ 
  children, 
  className = "",
  onClick,
  ...props 
}: React.ComponentProps<"div">) {
  return (
    <motion.div 
      className={`bg-white/90 backdrop-blur-lg rounded-3xl p-5 border border-white/30 shadow-lg shadow-black/5 ${className}`}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        scale: { duration: 0.15 }
      }}
      onClick={onClick}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}

// Mobile-optimized button component
export function MobileButton({ 
  children, 
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  type,
  ...props 
}: React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}) {
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-xl shadow-indigo-500/25",
    secondary: "bg-white/90 text-gray-800 border border-gray-200/50 shadow-lg shadow-black/5",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-50"
  };

  const sizes = {
    sm: "px-4 py-2.5 text-sm",
    md: "px-6 py-3.5 text-base", 
    lg: "px-8 py-4 text-base"
  };

  return (
    <motion.button
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        rounded-2xl font-semibold transition-all duration-300 
        disabled:opacity-50 disabled:cursor-not-allowed
        touch-target
        ${className}
      `}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        scale: { duration: 0.2, type: "spring", stiffness: 300 },
        opacity: { duration: 0.3 }
      }}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}