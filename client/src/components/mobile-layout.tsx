import { MobileHeader, NotificationButton } from "./mobile-header";
import { MobileBottomNav, SafeAreaProvider } from "./mobile-bottom-nav";
import { TrainingQuickAccess } from "./training-quick-access";
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Nostalgic Fruitger Aero Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-200/12 to-emerald-200/12 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/12 to-teal-200/12 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-200/12 to-cyan-200/12 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-3/4 left-1/4 w-72 h-72 bg-gradient-to-r from-sky-200/8 to-blue-200/8 rounded-full blur-3xl animate-float" style={{animationDelay: '4.5s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-teal-200/10 to-cyan-200/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <MobileHeader 
        title={title}
        showBackButton={showBackButton}
        onBackClick={onBackClick}
        rightAction={<NotificationButton />}
      />
      
      <motion.main 
        className={`px-4 relative z-10 ${className}`}
        style={{ 
          paddingTop: 'calc(3.75rem + env(safe-area-inset-top))',
          paddingBottom: showBottomNav ? 'calc(5rem + env(safe-area-inset-bottom))' : '1rem'
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: 0.2,
          ease: "easeOut"
        }}
      >
        <SafeAreaProvider>
          <div className="max-w-md mx-auto space-y-4">
            {children}
          </div>
        </SafeAreaProvider>
      </motion.main>
      
      {showBottomNav && <MobileBottomNav />}
      {showBottomNav && <TrainingQuickAccess />}
      
      {/* Soft Floating Gradient Accent */}
      <div className="fixed bottom-4 left-4 right-4 h-16 bg-gradient-to-r from-cyan-300/8 to-emerald-300/8 rounded-2xl blur-xl pointer-events-none"></div>
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
      className={`luxury-card backdrop-blur-xl p-6 border border-white/30 shadow-2xl animate-float ${className}`}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5,
        scale: { duration: 0.2, type: "spring", stiffness: 300 },
        y: { type: "spring", stiffness: 400, damping: 25 }
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
    primary: "bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white shadow-xl shadow-cyan-500/25",
    secondary: "luxury-card text-gray-800 border border-white/30 shadow-2xl",
    ghost: "frosted-glass text-gray-700 hover:bg-white/30"
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