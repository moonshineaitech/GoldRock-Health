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
  tag?: string;
  premium?: boolean;
  savings?: string;
  featured?: boolean;
}

const resources: Resource[] = [
  {
    title: "Bill Reduction Guide",
    description: "Complete step-by-step guide to reducing medical bills by 40-90%",
    icon: Target,
    path: "/bill-reduction-guide",
    tag: "Most Popular",
    savings: "$2K-$35K+",
    featured: true
  },
  {
    title: "Premium Templates Library",
    description: "Professional dispute letters, charity care applications, legal templates",
    icon: FileText,
    path: "/templates",
    premium: true,
    tag: "Premium"
  },
  {
    title: "Industry Insider Secrets",
    description: "Hospital revenue cycles, chargemaster markups, overcharge schemes",
    icon: Brain,
    path: "/industry-insights",
    tag: "Expert",
    savings: "$5K-$15K"
  },
  {
    title: "Insurance Denial Intelligence",
    description: "Denial codes, reversal strategies, company-specific tactics",
    icon: Shield,
    path: "/insurance-denials",
    premium: true,
    savings: "$3K-$20K"
  },
  {
    title: "Best Practices & Case Studies",
    description: "Real success stories: $23K, $15.4K, $8.7K savings with exact strategies",
    icon: Award,
    path: "/bill-best-practices",
    tag: "Real Results"
  },
  {
    title: "Portal Access Guide",
    description: "How to get bills from insurance & provider portals before they arrive",
    icon: Eye,
    path: "/portal-access-guide"
  },
  {
    title: "Timing & Strategy Guide",
    description: "When to negotiate, when to wait, optimal timing for best results",
    icon: Clock,
    path: "/timing-guide"
  }
];

const quickActions: Resource[] = [
  {
    title: "Quick Bill Analyzer",
    description: "AI-powered analysis with insights from 'Never Pay the First Bill'",
    icon: Zap,
    path: "/quick-analyzer",
    tag: "AI Powered"
  },
  {
    title: "Full Bill Analysis",
    description: "Upload your bill and get comprehensive AI analysis",
    icon: FileText,
    path: "/bill-ai"
  },
  {
    title: "Chat with AI Coach",
    description: "Ask questions about your medical bill situation",
    icon: MessageCircle,
    path: "/bill-ai"
  },
  {
    title: "Download Templates",
    description: "Get professional dispute letter templates",
    icon: Download,
    path: "/templates",
    premium: true
  }
];

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function ResourcesHub() {
  const { isSubscribed } = useSubscription();

  return (
    <MobileLayout title="Resources" showBottomNav={true}>
      {/* Hero Section */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOut }}
      >
        <motion.div 
          className="relative mx-auto mb-5"
          style={{ width: 'fit-content' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
        >
          <div
            className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
          >
            <Lightbulb className="h-10 w-10 text-white" strokeWidth={2.5} />
          </div>
        </motion.div>

        <motion.h1 
          className="text-3xl font-serif font-bold mb-3 text-foreground"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: easeOut }}
        >
          Bill Reduction
          <br />
          Resource Library
        </motion.h1>

        <motion.p 
          className="text-muted-foreground font-medium mb-6 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: easeOut }}
        >
          Everything you need to reduce medical bills like a professional
        </motion.p>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: easeOut }}
          className="inline-flex items-center gap-3 bg-card border border-border rounded-full px-6 py-3 shadow-sm"
        >
          <CheckCircle className="h-5 w-5 text-gold" />
          <span className="text-sm font-semibold text-foreground">
            Users Save $2K-$35K+ With These Guides
          </span>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5, ease: easeOut }}
      >
        <h2 className="text-xl font-serif font-bold text-foreground mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-gold" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.path}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.06, duration: 0.45, ease: easeOut }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="luxury-card rounded-2xl p-4 relative h-full">
                    {action.premium && !isSubscribed && (
                      <div className="absolute top-2 right-2 bg-secondary text-muted-foreground text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 z-10">
                        <Crown className="h-3 w-3 text-gold" />
                        Premium
                      </div>
                    )}
                    
                    {action.tag && (
                      <div className="absolute top-2 right-2 bg-secondary text-muted-foreground text-xs px-2 py-1 rounded-full font-semibold z-10">
                        {action.tag}
                      </div>
                    )}
                    
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-3">
                        <Icon className="h-6 w-6 text-muted-foreground" strokeWidth={2.5} />
                      </div>
                      <h3 className="font-bold text-foreground text-sm mb-1">{action.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">{action.description}</p>
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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5, ease: easeOut }}
      >
        <h2 className="text-xl font-serif font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-gold" />
          Complete Resource Library
        </h2>

        <div className="space-y-3">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <Link key={resource.title} href={resource.path}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05, duration: 0.45, ease: easeOut }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="luxury-card rounded-2xl p-4 relative">
                    <div className="flex items-start gap-4 relative z-10">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          resource.featured ? 'shadow-sm' : 'bg-secondary'
                        }`}
                        style={resource.featured ? { background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' } : undefined}
                      >
                        <Icon
                          className={`h-7 w-7 ${resource.featured ? 'text-white' : 'text-muted-foreground'}`}
                          strokeWidth={2.5}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground text-base">{resource.title}</h3>
                          {resource.tag && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                              {resource.tag}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed mb-2 font-medium">
                          {resource.description}
                        </p>

                        {resource.savings && (
                          <div className="inline-flex items-center gap-1.5 bg-secondary px-3 py-1 rounded-full">
                            <DollarSign className="h-3.5 w-3.5 text-gold" />
                            <span className="text-xs font-bold text-gold">
                              Potential: {resource.savings}
                            </span>
                          </div>
                        )}

                        {resource.premium && !isSubscribed && (
                          <div className="inline-flex items-center gap-1.5 bg-secondary border border-border px-3 py-1 rounded-full">
                            <Crown className="h-3.5 w-3.5 text-gold" />
                            <span className="text-xs font-bold text-foreground">
                              Premium Required
                            </span>
                          </div>
                        )}
                      </div>

                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5, ease: easeOut }}
        >
          <div className="luxury-card rounded-2xl p-6 text-center relative">
            <div className="relative z-10">
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
                style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3, ease: easeOut }}
              >
                <Crown className="h-8 w-8 text-white" strokeWidth={2.5} />
              </motion.div>
              
              <h3 className="text-xl font-serif font-bold mb-2 text-foreground">
                Unlock All Premium Resources
              </h3>
              <p className="text-muted-foreground mb-4 text-sm font-medium">
                Get unlimited access to all templates, guides, and AI-powered tools
              </p>
              <Link href="/premium">
                <MobileButton className="w-full bg-primary text-primary-foreground hover:opacity-90 font-bold shadow-sm">
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
