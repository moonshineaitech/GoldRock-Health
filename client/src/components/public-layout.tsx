import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface PublicLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
}

export function PublicLayout({ 
  children, 
  title,
  showBackButton = true 
}: PublicLayoutProps) {
  return (
    <div className="min-h-screen relative bg-background" style={{ 
      WebkitOverflowScrolling: 'touch',
      touchAction: 'manipulation'
    }}>
      {/* Simple Header */}
      <header className="relative z-20 bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Link href="/" data-testid="link-back-home">
                <button className="flex items-center text-muted-foreground hover:text-foreground transition-colors" data-testid="button-back">
                  <ArrowLeft className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Back</span>
                </button>
              </Link>
            )}
            <h1 className="font-serif text-xl font-semibold text-foreground">
              {title}
            </h1>
          </div>
          
          {/* GoldRock AI Logo/Brand */}
          <div className="text-sm font-semibold text-muted-foreground">
            GoldRock AI
          </div>
        </div>
      </header>
      
      <motion.main 
        className="px-4 py-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 0.05,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
