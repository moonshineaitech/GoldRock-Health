import { Card } from "@/components/ui/card";
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-white" style={{ 
      WebkitOverflowScrolling: 'touch',
      touchAction: 'manipulation'
    }}>
      {/* Nostalgic Fruitger Aero Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-200/8 to-emerald-200/8 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/8 to-teal-200/8 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-200/6 to-cyan-200/6 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* Simple Header */}
      <header className="relative z-20 backdrop-blur-lg bg-white/80 border-b border-white/40 shadow-xl shadow-black/5">
        <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Link href="/" data-testid="link-back-home">
                <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors" data-testid="button-back">
                  <ArrowLeft className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Back</span>
                </button>
              </Link>
            )}
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
          
          {/* GoldRock AI Logo/Brand */}
          <div className="text-sm font-semibold text-gray-600">
            GoldRock AI
          </div>
        </div>
      </header>
      
      <motion.main 
        className="px-4 py-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: 0.2,
          ease: "easeOut"
        }}
      >
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </motion.main>
      
      {/* Soft Floating Gradient Accent */}
      <div className="fixed bottom-4 left-4 right-4 h-16 bg-gradient-to-r from-cyan-300/8 to-emerald-300/8 rounded-2xl blur-xl pointer-events-none"></div>
    </div>
  );
}
