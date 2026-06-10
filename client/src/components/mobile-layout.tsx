import { MobileHeader, UserAvatarDropdown } from "./mobile-header";
import { MobileBottomNav, SafeAreaProvider } from "./mobile-bottom-nav";
import { MedicalChatbot } from "./medical-chatbot";
import { motion } from "framer-motion";

interface MobileLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showBottomNav?: boolean;
  className?: string;
  "data-testid"?: string;
}

export function MobileLayout({ 
  children, 
  title, 
  subtitle,
  showBackButton = false,
  onBackClick,
  showBottomNav = true,
  className = "",
  ...rest
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen relative" style={{ 
      WebkitOverflowScrolling: 'touch',
      touchAction: 'manipulation'
    }} {...rest}>
      <MobileHeader 
        title={title}
        subtitle={subtitle}
        showBackButton={showBackButton}
        onBackClick={onBackClick}
        rightAction={<UserAvatarDropdown />}
      />
      
      <motion.main 
        className={`px-4 lg:px-8 xl:px-12 2xl:px-16 relative z-10 ${className}`}
        style={{ 
          paddingTop: 'calc(3.75rem + env(safe-area-inset-top, 0px))',
          paddingBottom: showBottomNav ? 'calc(4rem + env(safe-area-inset-bottom, 0px))' : '1rem',
          WebkitOverflowScrolling: 'touch'
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 0.05,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <SafeAreaProvider>
          <div className="max-w-md mx-auto lg:max-w-none lg:mx-0 space-y-4">
            {children}
          </div>
        </SafeAreaProvider>
      </motion.main>
      
      {showBottomNav && <MobileBottomNav />}
      {showBottomNav && !['/bill-ai', '/bill-analyzer'].includes(window.location.pathname) && <MedicalChatbot />}
    </div>
  );
}

// Editorial paper card
export function MobileCard({ 
  children, 
  className = "",
  onClick,
  ...props 
}: React.ComponentProps<"div">) {
  return (
    <motion.div 
      className={`luxury-card p-6 ${className}`}
      whileTap={{ scale: 0.995 }}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }}
      onClick={onClick}
      style={{ 
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent'
      }}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}

// Editorial button
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
    primary: "bg-primary text-primary-foreground shadow-sm hover:shadow-md",
    secondary: "luxury-card text-foreground hover:shadow-md",
    ghost: "text-foreground hover:bg-secondary"
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
        rounded-xl font-medium transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        touch-target
        ${className}
      `}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      whileHover={{ scale: disabled ? 1 : 1.005 }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1]
      }}
      style={{
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        minHeight: '44px', // iOS minimum touch target size
        minWidth: '44px'
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
