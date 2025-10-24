import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Lightbulb,
  FileText,
  Scale,
  Shield,
  TrendingDown,
  Building,
  AlertTriangle,
  Calculator,
  Eye,
  Clock,
  Gavel,
  DollarSign,
  Brain,
  Award,
  Sparkles,
  ChevronRight,
  BookOpen,
  Target,
  Zap,
  MessageCircle,
  Send,
  Download,
  CheckCircle,
  Star,
  Crown,
  ArrowRight
} from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

interface Resource {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
  bgColor: string;
  tag?: string;
  premium?: boolean;
  savings?: string;
}

const resources: Resource[] = [
  {
    title: "Bill Reduction Guide",
    description: "Complete step-by-step guide to reducing medical bills by 40-90%",
    icon: Target,
    path: "/bill-reduction-guide",
    color: "from-emerald-600 to-teal-600",
    bgColor: "from-emerald-50 to-teal-50",
    tag: "Most Popular",
    savings: "$2K-$35K+"
  },
  {
    title: "Premium Templates Library",
    description: "Professional dispute letters, charity care applications, legal templates",
    icon: FileText,
    path: "/templates",
    color: "from-purple-600 to-indigo-600",
    bgColor: "from-purple-50 to-indigo-50",
    premium: true,
    tag: "Premium"
  },
  {
    title: "Industry Insider Secrets",
    description: "Hospital revenue cycles, chargemaster markups, overcharge schemes",
    icon: Brain,
    path: "/industry-insights",
    color: "from-amber-600 to-orange-600",
    bgColor: "from-amber-50 to-orange-50",
    tag: "Expert",
    savings: "$5K-$15K"
  },
  {
    title: "Insurance Denial Intelligence",
    description: "Denial codes, reversal strategies, company-specific tactics",
    icon: Shield,
    path: "/insurance-denials",
    color: "from-red-600 to-pink-600",
    bgColor: "from-red-50 to-pink-50",
    premium: true,
    savings: "$3K-$20K"
  },
  {
    title: "Best Practices & Case Studies",
    description: "Real success stories: $23K, $15.4K, $8.7K savings with exact strategies",
    icon: Award,
    path: "/bill-best-practices",
    color: "from-blue-600 to-cyan-600",
    bgColor: "from-blue-50 to-cyan-50",
    tag: "Real Results"
  },
  {
    title: "Portal Access Guide",
    description: "How to get bills from insurance & provider portals before they arrive",
    icon: Eye,
    path: "/portal-access-guide",
    color: "from-indigo-600 to-purple-600",
    bgColor: "from-indigo-50 to-purple-50"
  },
  {
    title: "Timing & Strategy Guide",
    description: "When to negotiate, when to wait, optimal timing for best results",
    icon: Clock,
    path: "/timing-guide",
    color: "from-teal-600 to-emerald-600",
    bgColor: "from-teal-50 to-emerald-50"
  }
];

const quickActions: Resource[] = [
  {
    title: "Quick Bill Analyzer",
    description: "AI-powered analysis with insights from 'Never Pay the First Bill'",
    icon: Zap,
    path: "/quick-analyzer",
    color: "from-blue-600 to-indigo-600",
    bgColor: "from-blue-50 to-indigo-50",
    tag: "AI Powered"
  },
  {
    title: "Full Bill Analysis",
    description: "Upload your bill and get comprehensive AI analysis",
    icon: FileText,
    path: "/bill-ai",
    color: "from-purple-600 to-indigo-600",
    bgColor: "from-purple-50 to-indigo-50"
  },
  {
    title: "Chat with AI Coach",
    description: "Ask questions about your medical bill situation",
    icon: MessageCircle,
    path: "/bill-ai",
    color: "from-blue-600 to-cyan-600",
    bgColor: "from-blue-50 to-cyan-50"
  },
  {
    title: "Download Templates",
    description: "Get professional dispute letter templates",
    icon: Download,
    path: "/templates",
    color: "from-emerald-600 to-teal-600",
    bgColor: "from-emerald-50 to-teal-50",
    premium: true
  }
];

export default function ResourcesHub() {
  const { isSubscribed } = useSubscription();

  return (
    <MobileLayout title="Resources" showBottomNav={true}>
      {/* Hero Section */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="relative mx-auto mb-5"
          style={{ width: 'fit-content' }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2,
            type: "spring",
            stiffness: 200
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/40 via-teal-400/40 to-cyan-400/40 rounded-3xl blur-xl" />
          <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <Lightbulb className="h-10 w-10 text-white" strokeWidth={2.5} />
          </div>
        </motion.div>

        <motion.h1 
          className="text-3xl font-black mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Bill Reduction
          </span>
          <br />
          <span className="text-gray-900">Resource Library</span>
        </motion.h1>

        <motion.p 
          className="text-gray-600 font-medium mb-6 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Everything you need to reduce medical bills like a professional
        </motion.p>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: 0.8, 
            duration: 0.5,
            type: "spring",
            stiffness: 350,
            damping: 25
          }}
          className="inline-flex items-center gap-3 backdrop-blur-xl bg-white/90 border border-white/40 rounded-full px-6 py-3 shadow-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10" />
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20 pointer-events-none" />
          <CheckCircle className="h-5 w-5 text-emerald-600 relative z-10" />
          <span className="text-sm font-black bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent relative z-10">
            Users Save $2K-$35K+ With These Guides
          </span>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-600" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.path}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 1.1 + index * 0.1, 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 350,
                    damping: 25
                  }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="backdrop-blur-xl bg-white/95 border border-white/40 rounded-2xl p-4 relative overflow-hidden shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 hover:opacity-5 transition-opacity duration-300`} />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
                    
                    {action.premium && !isSubscribed && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 z-10">
                        <Crown className="h-3 w-3" />
                        Premium
                      </div>
                    )}
                    
                    {action.tag && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs px-2 py-1 rounded-full font-bold z-10">
                        {action.tag}
                      </div>
                    )}
                    
                    <div className="relative z-10">
                      <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-3 shadow-lg relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                        <Icon className="h-6 w-6 text-white relative z-10" strokeWidth={2.5} />
                      </div>
                      <h3 className="font-black text-gray-900 text-sm mb-1">{action.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">{action.description}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* All Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-600" />
          Complete Resource Library
        </h2>

        <div className="space-y-3">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <Link key={resource.title} href={resource.path}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 1.4 + index * 0.08, 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 350,
                    damping: 25
                  }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="backdrop-blur-xl bg-white/95 border border-white/40 rounded-2xl p-4 relative overflow-hidden shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${resource.color} opacity-0 hover:opacity-5 transition-opacity duration-300`} />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
                    
                    <div className="flex items-start gap-4 relative z-10">
                      <div className={`w-14 h-14 bg-gradient-to-br ${resource.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                        <Icon className="h-7 w-7 text-white relative z-10" strokeWidth={2.5} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-black text-gray-900 text-base">{resource.title}</h3>
                          {resource.tag && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              resource.tag === 'Premium' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' :
                              resource.tag === 'Most Popular' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' :
                              resource.tag === 'Expert' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' :
                              'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            }`}>
                              {resource.tag}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-700 leading-relaxed mb-2 font-medium">
                          {resource.description}
                        </p>

                        {resource.savings && (
                          <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                            <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-xs font-black text-emerald-700">
                              Potential: {resource.savings}
                            </span>
                          </div>
                        )}

                        {resource.premium && !isSubscribed && (
                          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-100 to-red-100 border border-orange-300 px-3 py-1 rounded-full">
                            <Crown className="h-3.5 w-3.5 text-orange-600" />
                            <span className="text-xs font-black text-orange-700">
                              Premium Required
                            </span>
                          </div>
                        )}
                      </div>

                      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* CTA */}
      {!isSubscribed && (
        <motion.div
          className="mt-8 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 2, 
            duration: 0.6,
            type: "spring",
            stiffness: 350,
            damping: 25
          }}
        >
          <div className="backdrop-blur-xl bg-white/95 border border-white/40 rounded-2xl p-6 text-center relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
            
            <div className="relative z-10">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg relative overflow-hidden"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                <Crown className="h-8 w-8 text-white relative z-10" strokeWidth={2.5} />
              </motion.div>
              
              <h3 className="text-xl font-black mb-2 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 bg-clip-text text-transparent">
                Unlock All Premium Resources
              </h3>
              <p className="text-gray-700 mb-4 text-sm font-medium">
                Get unlimited access to all templates, guides, and AI-powered tools
              </p>
              <Link href="/premium">
                <MobileButton className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 font-bold shadow-lg">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                  <ArrowRight className="h-4 w-4 ml-2" />
                </MobileButton>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </MobileLayout>
  );
}
