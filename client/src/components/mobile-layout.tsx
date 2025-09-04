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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <MobileHeader 
        title={title}
        showBackButton={showBackButton}
        onBackClick={onBackClick}
        rightAction={<NotificationButton />}
      />
      
      <motion.main 
        className={`pt-14 ${showBottomNav ? 'pb-20' : 'pb-4'} px-4 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
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
      className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm ${className}`}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
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
    primary: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg",
    secondary: "bg-white/80 text-gray-900 border border-gray-200",
    ghost: "bg-transparent text-gray-700"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base", 
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        rounded-xl font-medium transition-all duration-200 
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}