import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { DonationButton } from "@/components/donation-button";
import { Link } from "wouter";
import { 
  DollarSign, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  Crown, 
  Zap, 
  CheckCircle, 
  TrendingDown,
  Users,
  Star,
  Brain,
  Target,
  Clock,
  MessageCircle,
  ShieldCheck,
  Receipt,
  Search,
  Calculator,
  Award,
  Sparkles,
  ChevronRight,
  ThumbsUp,
  Heart,
  Timer,
  Code,
  UserCheck,
  Building,
  Eye,
  BarChart3,
  Trophy
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Landing() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);
  
  return (
    <MobileLayout title="GoldRock AI" showBottomNav={true}>
      {/* Hero Section - Pain Point & Massive Savings */}
      <motion.div 
        className="text-center py-8 px-4 relative overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-32 h-32 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-28 h-28 bg-gradient-to-r from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Premium App Icon */}
        <motion.div 
          className="w-20 h-20 bg-gradient-to-br from-amber-500 via-yellow-500 to-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-500/25 relative overflow-hidden"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.3,
            type: "spring",
            stiffness: 180,
            damping: 12
          }}
          whileHover={{ scale: 1.05, rotate: 3 }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-[1.75rem] backdrop-blur-sm" />
          <DollarSign className="text-white text-2xl relative z-10" />
          
          {/* Premium Sparkle Effects */}
          <motion.div 
            className="absolute -top-2 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"
            animate={{ 
              y: [-6, 6, -6],
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full shadow-lg"
            animate={{ 
              y: [4, -4, 4],
              scale: [0.9, 1.2, 0.9],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </motion.div>
        
        {/* Pain Point Hook */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <h1 className="text-3xl font-black mb-3 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Reduce</span>{" "}
            <span className="text-gray-900">Your Medical Bill</span>
          </h1>
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-6 leading-tight">
            Example Potential: $2,000 - $35,000+
          </h2>
        </motion.div>
        
        {/* Value Proposition */}
        <motion.p 
          className="text-base text-gray-700 mb-6 max-w-sm mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Professional AI technology analyzes your medical bills, identifies overcharges, and generates dispute letters that hospitals legally must respond to.
        </motion.p>
        
        {/* Massive Savings Highlight */}
        <motion.div 
          className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl p-5 mb-6 max-w-sm mx-auto shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Crown className="h-5 w-5 text-emerald-600" />
              <span className="font-black text-emerald-700 text-lg">Example Potential: $8,500 Savings</span>
            </div>
            <p className="text-sm text-emerald-600 font-semibold">AI identifies potential billing errors</p>
          </div>
        </motion.div>
        
        {/* Primary CTA */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 35, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.6, type: "spring", stiffness: 120 }}
        >
          <Link href="/bill-ai">
            <motion.div
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              data-testid="button-analyze-bill"
            >
              <MobileButton className="w-full max-w-xs mx-auto shadow-2xl shadow-emerald-500/30 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-lg py-4">
                <Receipt className="h-5 w-5 mr-2" />
                Analyze My Bill Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </MobileButton>
            </motion.div>
          </Link>
          
          <Link href="/blitz-demo">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              data-testid="button-try-demo"
            >
              <MobileButton variant="secondary" className="w-full max-w-xs mx-auto shadow-lg border-2 border-emerald-200 hover:border-emerald-300 text-emerald-700 hover:text-emerald-800">
                <Eye className="h-4 w-4 mr-2" />
                Try Free Demo First
                <ChevronRight className="h-3 w-3 ml-2" />
              </MobileButton>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Real Case Studies Section */}
      <motion.div 
        className="space-y-4 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <h2 className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-3">
            Example Case Study Scenarios
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto" />
          <p className="text-sm text-gray-600 mt-3 max-w-sm mx-auto font-medium">
            Common medical billing scenarios showing potential outcomes
          </p>
        </motion.div>
        
        <div className="space-y-4">
          {[
            { 
              title: "Emergency Room Bill", 
              savings: "$23,000", 
              strategy: "AI found overcharges + charity care", 
              time: "6 weeks",
              percentage: "78% reduction",
              color: "emerald", 
              delay: 1.5,
              icon: AlertTriangle
            },
            { 
              title: "Surgical Procedure", 
              savings: "$15,400", 
              strategy: "Good faith estimate violation", 
              time: "4 weeks",
              percentage: "65% reduction",
              color: "blue", 
              delay: 1.6,
              icon: FileText
            }
          ].map((story, index) => {
            const IconComponent = story.icon;
            return (
              <motion.div
                key={story.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: story.delay, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 150
                }}
                data-testid={`case-study-${story.title.toLowerCase().replace(/ /g, '-')}`}
              >
                <MobileCard className="backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <motion.div 
                          className={`w-12 h-12 bg-gradient-to-br ${
                            story.color === 'emerald' ? 'from-emerald-500 to-teal-600' :
                            'from-blue-500 to-indigo-600'
                          } rounded-2xl flex items-center justify-center shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base">{story.title}</h3>
                          <p className="text-sm text-gray-600 font-medium">{story.strategy}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-emerald-700">{story.savings}</div>
                        <div className="text-xs text-emerald-600 font-semibold">{story.percentage}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{story.time}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-semibold">Success</span>
                      </div>
                    </div>
                  </div>
                </MobileCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* AI Technology Features */}
      <motion.div 
        className="space-y-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 0.6 }}
      >
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Professional AI Technology
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto" />
          <p className="text-sm text-gray-600 mt-3 max-w-sm mx-auto font-medium">
            Advanced algorithms detect billing errors hospitals hope you'll miss
          </p>
        </motion.div>
        
        <div className="space-y-3">
          {[
            { 
              icon: Brain, 
              title: "AI Bill Analysis", 
              desc: "Example outcomes show potential savings of $2,000-$35,000+ through AI-powered overcharge detection", 
              highlight: "Results vary by individual case",
              color: "purple", 
              delay: 1.9
            },
            { 
              icon: Search, 
              title: "Error Detection Engine", 
              desc: "Scans for duplicate charges, billing code errors, and phantom procedures", 
              highlight: "95% accuracy",
              color: "red", 
              delay: 2.0
            },
            { 
              icon: FileText, 
              title: "Professional Dispute Letters", 
              desc: "Generates legal-grade dispute templates that hospitals must respond to", 
              highlight: "95% success rate",
              color: "emerald", 
              delay: 2.1
            }
          ].map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: feature.delay, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 180
                }}
                data-testid={`feature-${feature.title.toLowerCase().replace(/ /g, '-')}`}
              >
                <Link href="/bill-ai">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MobileCard className="backdrop-blur-xl border border-white/40 shadow-xl cursor-pointer overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/15 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      
                      <div className="flex items-center space-x-4 relative z-10">
                        <motion.div 
                          className={`w-14 h-14 bg-gradient-to-br ${
                            feature.color === 'purple' ? 'from-purple-500 to-indigo-600' :
                            feature.color === 'red' ? 'from-red-500 to-orange-600' :
                            feature.color === 'emerald' ? 'from-emerald-500 to-teal-600' :
                            'from-gray-500 to-gray-600'
                          } rounded-2xl flex items-center justify-center shadow-lg relative`}
                          whileHover={{ scale: 1.15, rotate: 8 }}
                          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                        >
                          <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm" />
                          <IconComponent className="h-7 w-7 text-white relative z-10" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-base leading-tight">{feature.title}</h3>
                            <span className="px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                              {feature.highlight}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed font-medium">{feature.desc}</p>
                        </div>
                        <motion.div
                          className="p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm"
                          whileHover={{ x: 4, scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="h-4 w-4 text-gray-600" />
                        </motion.div>
                      </div>
                    </MobileCard>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Premium Value Proposition */}
      <motion.div 
        className="space-y-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      >
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.6 }}
        >
          <h2 className="text-2xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
            Professional Features
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mx-auto" />
        </motion.div>
        
        <div className="grid grid-cols-2 gap-3">
          {[
            { 
              icon: MessageCircle, 
              title: "Expert Coaching", 
              desc: "Hospital negotiation tactics", 
              color: "blue",
              delay: 2.4
            },
            { 
              icon: Clock, 
              title: "Strategic Timing", 
              desc: "Perfect dispute timing", 
              color: "green",
              delay: 2.45
            },
            { 
              icon: Code, 
              title: "Billing Mastery", 
              desc: "CPT code expertise", 
              color: "purple",
              delay: 2.5
            },
            { 
              icon: UserCheck, 
              title: "Personal Coach", 
              desc: "1-on-1 guidance", 
              color: "orange",
              delay: 2.55
            }
          ].map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: feature.delay, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200
                }}
                data-testid={`premium-feature-${feature.title.toLowerCase().replace(/ /g, '-')}`}
              >
                <Link href="/premium">
                  <motion.div
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MobileCard className="h-32 backdrop-blur-xl border border-white/40 shadow-lg cursor-pointer overflow-hidden group text-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="flex flex-col items-center justify-center h-full space-y-2 relative z-10">
                        <motion.div 
                          className={`w-10 h-10 bg-gradient-to-br ${
                            feature.color === 'blue' ? 'from-blue-500 to-indigo-600' :
                            feature.color === 'green' ? 'from-emerald-500 to-teal-600' :
                            feature.color === 'purple' ? 'from-purple-500 to-indigo-600' :
                            feature.color === 'orange' ? 'from-orange-500 to-red-600' :
                            'from-gray-500 to-gray-600'
                          } rounded-xl flex items-center justify-center shadow-lg`}
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <IconComponent className="h-5 w-5 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm leading-tight">{feature.title}</h3>
                          <p className="text-xs text-gray-600 font-medium">{feature.desc}</p>
                        </div>
                      </div>
                    </MobileCard>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Social Proof & Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6, duration: 0.6 }}
        className="mt-8"
      >
        <MobileCard className="backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(59, 130, 246, 0.08) 100%)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/30" />
          
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Trophy className="h-6 w-6 text-amber-600" />
              </motion.div>
              <h3 className="text-lg font-bold text-gray-900">Example Outcomes</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center" data-testid="stat-users">
                <div className="text-2xl font-black text-emerald-700">Sample</div>
                <div className="text-xs text-gray-600 font-semibold">Case Studies</div>
              </div>
              <div className="text-center" data-testid="stat-savings">
                <div className="text-2xl font-black text-blue-700">High</div>
                <div className="text-xs text-gray-600 font-semibold">Potential Rate</div>
              </div>
              <div className="text-center" data-testid="stat-success">
                <div className="text-2xl font-black text-purple-700">$8.5K+</div>
                <div className="text-xs text-gray-600 font-semibold">Avg Example</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span className="font-medium">AI-powered medical billing analysis platform</span>
            </div>
          </div>
        </MobileCard>
      </motion.div>

      {/* Donation Section */}
      <motion.div 
        className="px-4 mt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6, duration: 0.6 }}
      >
        <DonationButton variant="default" />
      </motion.div>

      {/* Final Premium CTA */}
      <motion.div 
        className="mt-8 pb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8, duration: 0.6 }}
      >
        <div className="space-y-4">
          <motion.div 
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-6 shadow-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Crown className="h-6 w-6 text-amber-600" />
                <span className="font-black text-amber-700 text-lg">Premium Access</span>
              </div>
              <p className="text-sm text-amber-700 font-semibold mb-4">
                Get expert coaching, advanced AI analysis, and professional dispute templates
              </p>
              
              <div className="space-y-3">
                <Link href="/premium">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid="button-upgrade-premium"
                  >
                    <MobileButton className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 shadow-xl shadow-amber-500/25 text-lg py-4">
                      <Crown className="h-5 w-5 mr-2" />
                      Upgrade to Premium
                      <Sparkles className="h-4 w-4 ml-2" />
                    </MobileButton>
                  </motion.div>
                </Link>
                
                <Link href="/bill-best-practices">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid="button-view-strategies"
                  >
                    <MobileButton variant="secondary" className="w-full border-2 border-amber-200 hover:border-amber-300 text-amber-700 hover:text-amber-800">
                      <Target className="h-4 w-4 mr-2" />
                      View Advanced Strategies
                      <ChevronRight className="h-3 w-3 ml-2" />
                    </MobileButton>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </MobileLayout>
  );
}