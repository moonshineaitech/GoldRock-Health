import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { StatisticsDashboard } from "@/components/statistics-dashboard";
import { AchievementSystem } from "@/components/achievement-system";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { Link } from "wouter";
import { BookOpen, Brain, Trophy, Zap, ArrowRight, DollarSign, AlertTriangle, TrendingDown, FileText, Stethoscope, Target } from "lucide-react";
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
    <MobileLayout title="GoldRock Health" showBottomNav={true}>
      {/* Enhanced Mobile Hero Section */}
      <motion.div 
        className="text-center py-8 px-4 relative overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Hero background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-32 h-32 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-24 h-24 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <motion.div 
          className="w-24 h-24 luxury-card bg-gradient-to-br from-amber-500 via-yellow-500 to-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-amber-500/30 relative overflow-hidden"
          initial={{ scale: 0, rotate: -270, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ 
            duration: 1, 
            delay: 0.4,
            type: "spring",
            stiffness: 150,
            damping: 10
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {/* Glass overlay on icon */}
          <div className="absolute inset-0 bg-white/20 rounded-[2rem] backdrop-blur-sm" />
          <i className="fas fa-stethoscope text-white text-2xl relative z-10"></i>
          
          {/* Floating particles */}
          <motion.div 
            className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"
            animate={{ 
              y: [-8, 8, -8],
              x: [-4, 4, -4],
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full shadow-lg"
            animate={{ 
              y: [6, -6, 6],
              x: [3, -3, 3],
              scale: [0.8, 1.1, 0.8],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <h1 className="text-3xl font-black mb-4 leading-none tracking-tight">
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Gold</span><span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">Rock</span> <span className="text-gray-900">Health</span>
          </h1>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-6 leading-tight">
            AI-Powered Medical Bill Protection
          </h2>
        </motion.div>
        
        <motion.p 
          className="text-base text-gray-700 mb-8 max-w-sm mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          Professional AI technology that identifies overcharges, detects billing errors, and generates dispute letters to save thousands on medical bills.
        </motion.p>
        
        <motion.div 
          className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 mb-8 max-w-sm mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              <span className="font-bold text-emerald-700 text-base">Save Thousands in Minutes</span>
            </div>
            <p className="text-sm text-emerald-600 font-medium">Upload your bill & get professional dispute templates</p>
          </div>
        </motion.div>
        
        {/* Trust Indicators */}
        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 mb-8 max-w-sm mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.05, duration: 0.6 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Trophy className="h-4 w-4 text-blue-600" />
              <span className="font-bold text-blue-700 text-base">Proven Results</span>
            </div>
            <p className="text-sm text-blue-600 font-medium">Advanced AI detects billing errors & overcharges</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 35, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.7, type: "spring", stiffness: 100 }}
        >
          <Link href="/bill-ai">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <MobileButton className="w-full max-w-xs mx-auto shadow-xl shadow-emerald-500/25 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700">
                <DollarSign className="h-4 w-4 mr-2" />
                Analyze My Bill
                <ArrowRight className="h-3 w-3 ml-2" />
              </MobileButton>
            </motion.div>
          </Link>
          
          <Link href="/bill-reduction-guide">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <MobileButton variant="secondary" className="w-full max-w-xs mx-auto shadow-lg border-2 border-blue-200 hover:border-blue-300">
                <TrendingDown className="h-4 w-4 mr-2" />
                Bill Reduction Guide
                <ArrowRight className="h-3 w-3 ml-2" />
              </MobileButton>
            </motion.div>
          </Link>
          
          <Link href="/portal-access-guide">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <MobileButton variant="secondary" className="w-full max-w-xs mx-auto shadow-lg border-2 border-purple-200 hover:border-purple-300">
                <FileText className="h-4 w-4 mr-2" />
                Portal Access Guide
                <ArrowRight className="h-3 w-3 ml-2" />
              </MobileButton>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Medical Bill AI Step-by-Step Guide */}
      <motion.div 
        className="space-y-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <h2 className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-2">
            Advanced Bill AI Features
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto" />
          <p className="text-sm text-gray-600 mt-3 max-w-sm mx-auto">
            Professional-grade AI technology identifies errors & creates winning strategies
          </p>
          
          {/* Success Rate Badge */}
          <motion.div 
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 mt-4 max-w-sm mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 0.5 }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Zap className="h-4 w-4 text-amber-600" />
                <span className="font-bold text-amber-700 text-sm">Instant Dispute Letters</span>
              </div>
              <p className="text-xs text-amber-600 font-medium">Professional templates proven to reduce bills significantly</p>
            </div>
          </motion.div>
        </motion.div>
        
        <div className="space-y-3 mb-8">
          {[
            { 
              icon: FileText, 
              title: "Smart Bill Analysis", 
              desc: "Upload any medical bill - AI instantly identifies overcharges & errors", 
              color: "emerald", 
              delay: 1.4,
              href: "/bill-ai"
            },
            { 
              icon: AlertTriangle, 
              title: "Error Detection Engine", 
              desc: "Advanced algorithms find billing mistakes that cost you thousands", 
              color: "red", 
              delay: 1.5,
              href: "/bill-ai"
            },
            { 
              icon: DollarSign, 
              title: "Professional Dispute System", 
              desc: "Generate winning dispute letters & negotiation scripts instantly", 
              color: "green", 
              delay: 1.6,
              href: "/bill-ai"
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
              >
                <Link href={feature.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MobileCard className="h-full backdrop-blur-xl border border-white/30 shadow-xl shadow-black/5 cursor-pointer overflow-hidden group" 
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
                      }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      
                      <div className="flex items-center space-x-5 relative z-10">
                        <motion.div 
                          className={`w-12 h-12 bg-gradient-to-br ${
                            feature.color === 'emerald' ? 'from-emerald-500 to-teal-600' :
                            feature.color === 'red' ? 'from-red-500 to-orange-600' :
                            feature.color === 'green' ? 'from-emerald-500 to-teal-600' :
                            'from-gray-500 to-gray-600'
                          } rounded-2xl flex items-center justify-center shadow-lg relative`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                        >
                          <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm" />
                          <IconComponent className={`h-6 w-6 text-white relative z-10`} />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1 text-base leading-tight">{feature.title}</h3>
                          <p className="text-sm text-gray-700 leading-relaxed font-medium">{feature.desc}</p>
                        </div>
                        <motion.div
                          className="p-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 shadow-sm"
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

      {/* Bill AI Advanced Features */}
      <motion.div 
        className="space-y-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.6 }}
        >
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Comprehensive Bill Protection
          </h2>
          <div className="h-0.5 w-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto" />
        </motion.div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { 
              icon: Target, 
              title: "Negotiation Scripts", 
              desc: "AI-generated phone scripts", 
              color: "blue", 
              delay: 2.0,
              href: "/bill-ai"
            },
            { 
              icon: Brain, 
              title: "Error Patterns", 
              desc: "Learns common billing mistakes", 
              color: "purple", 
              delay: 2.1,
              href: "/bill-ai"
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
              >
                <Link href={feature.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MobileCard className="h-full backdrop-blur-xl border border-white/30 shadow-lg cursor-pointer overflow-hidden group" 
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
                      }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      
                      <div className="flex items-center space-x-5 relative z-10">
                        <motion.div 
                          className={`w-12 h-12 bg-gradient-to-br ${
                            feature.color === 'red' ? 'from-red-500 to-orange-600' :
                            feature.color === 'blue' ? 'from-blue-500 to-indigo-600' :
                            feature.color === 'green' ? 'from-emerald-500 to-teal-600' :
                            feature.color === 'purple' ? 'from-purple-500 to-indigo-600' :
                            'from-gray-500 to-gray-600'
                          } rounded-2xl flex items-center justify-center shadow-lg relative`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                        >
                          <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm" />
                          <IconComponent className={`h-6 w-6 text-white relative z-10`} />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1 text-base leading-tight">{feature.title}</h3>
                          <p className="text-sm text-gray-700 leading-relaxed font-medium">{feature.desc}</p>
                        </div>
                        <motion.div
                          className="p-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 shadow-sm"
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

      {/* Industry-Grade Bill AI */}
      <motion.div 
        className="space-y-4 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.6 }}
      >
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.6 }}
        >
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Industry-Grade AI Technology
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto" />
        </motion.div>
        
        <div className="space-y-3">
          {[
            { 
              icon: Zap, 
              title: "Enterprise AI Engine", 
              desc: "Professional-grade technology that finds billing errors hospitals hope you'll miss", 
              color: "purple", 
              delay: 2.2,
              href: "/bill-ai"
            }
          ].map((module, index) => {
            const IconComponent = module.icon;
            return (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: module.delay, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200
                }}
              >
                <Link href={module.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MobileCard className="h-full backdrop-blur-xl border border-white/30 shadow-xl shadow-black/5 cursor-pointer overflow-hidden group" 
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
                      }}>
                      {/* Card background gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      
                      <div className="flex items-center space-x-5 relative z-10">
                        <motion.div 
                          className={`w-14 h-14 bg-gradient-to-br ${
                            module.color === 'blue' ? 'from-blue-500 to-indigo-600' :
                            module.color === 'purple' ? 'from-purple-500 to-indigo-600' :
                            module.color === 'green' ? 'from-emerald-500 to-teal-600' :
                            module.color === 'orange' ? 'from-orange-500 to-red-600' :
                            'from-gray-500 to-gray-600'
                          } rounded-2xl flex items-center justify-center shadow-lg relative`}
                          whileHover={{ scale: 1.15, rotate: 10 }}
                          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                        >
                          <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm" />
                          <IconComponent className={`h-7 w-7 text-white relative z-10`} />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2 text-base leading-tight">{module.title}</h3>
                          <p className="text-sm text-gray-700 leading-relaxed font-medium">{module.desc}</p>
                        </div>
                        <motion.div
                          className="p-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 shadow-sm"
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

      {/* Mobile Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.3, duration: 0.6 }}
        className="mt-6"
      >
        <MobileCard className="backdrop-blur-xl border border-white/30 shadow-xl shadow-black/5 overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(59, 130, 246, 0.05) 100%)'
          }}>
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-2 right-4 w-16 h-16 bg-gradient-to-r from-indigo-200/10 to-purple-200/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-2 left-4 w-12 h-12 bg-gradient-to-r from-blue-200/10 to-cyan-200/10 rounded-full blur-xl animate-float" style={{animationDelay: '1.5s'}}></div>
          </div>
          
          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.3, duration: 0.5 }}
            >
              <h3 className="font-black text-gray-900 mb-6 text-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">Platform Statistics</h3>
              <div className="h-0.5 w-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-6" />
            </motion.div>
            
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "Bill AI", label: "Error Detection", gradient: "from-indigo-600 to-blue-600", delay: 2.5 },
                { value: "$500K+", label: "Potential Savings", gradient: "from-emerald-600 to-teal-600", delay: 2.6 },
                { value: "Premium", label: "Dispute Engine", gradient: "from-purple-600 to-pink-600", delay: 2.7 }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: stat.delay, 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200
                  }}
                  className="relative"
                >
                  <motion.div 
                    className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotateY: [0, 5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: stat.delay }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xs text-gray-700 mt-2 font-semibold tracking-wide">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </MobileCard>
      </motion.div>

      {/* Enhanced Mobile Call to Action */}
      <motion.div 
        className="text-center py-8 mt-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-20 h-20 bg-gradient-to-r from-emerald-200/15 to-teal-200/15 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-16 h-16 bg-gradient-to-r from-indigo-200/15 to-purple-200/15 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.9, duration: 0.6 }}
        >
          <h2 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
            Ready to Get Started?
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full mx-auto mb-6" />
        </motion.div>
        
        <motion.p 
          className="text-base text-gray-700 mb-4 max-w-sm mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.9, duration: 0.6 }}
        >
          Master medical diagnosis and find massive savings on your medical bills - all in one powerful platform.
        </motion.p>
        
        {/* Risk-Free Guarantee */}
        <motion.div 
          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 mb-8 max-w-sm mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.95, duration: 0.5 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Trophy className="h-4 w-4 text-green-600" />
              <span className="font-bold text-green-700 text-sm">100% Risk-Free Analysis</span>
            </div>
            <p className="text-xs text-green-600 font-medium">No upfront cost • Pay only when you save</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 0.7, type: "spring", stiffness: 150 }}
        >
          <Link href="/bill-ai">
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <MobileButton className="w-full max-w-sm shadow-2xl shadow-emerald-500/25 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700" size="lg">
                <DollarSign className="h-5 w-5 mr-3" />
                Find Your Savings Now
                <ArrowRight className="h-4 w-4 ml-3" />
              </MobileButton>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </MobileLayout>
  );
}
