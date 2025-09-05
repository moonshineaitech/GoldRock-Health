import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { StatisticsDashboard } from "@/components/statistics-dashboard";
import { AchievementSystem } from "@/components/achievement-system";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { Link } from "wouter";
import { BookOpen, Brain, Trophy, Zap, ArrowRight, DollarSign, AlertTriangle, TrendingDown, FileText } from "lucide-react";
import { motion } from "framer-motion";


export default function Landing() {
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
          className="w-20 h-20 bg-gradient-to-br from-amber-500 via-yellow-500 to-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-500/30 relative"
          initial={{ scale: 0, rotate: -270, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.4,
            type: "spring",
            stiffness: 150,
            damping: 10
          }}
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
            Save $50K-$500K+ on Medical Bills + Learn Medicine
          </h2>
        </motion.div>
        
        <motion.p 
          className="text-base text-gray-700 mb-8 max-w-sm mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          AI-powered medical bill analysis that finds massive overcharges, plus interactive training across 19+ specialties.
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
              <span className="font-bold text-emerald-700 text-base">Average User Saves $127,000</span>
            </div>
            <p className="text-sm text-emerald-600 font-medium">Upload your bill and find overcharges in seconds</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 35, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.7, type: "spring", stiffness: 100 }}
        >
          <Link href="/bill-analyzer">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <MobileButton className="w-full max-w-xs mx-auto shadow-xl shadow-emerald-500/25 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700">
                <DollarSign className="h-4 w-4 mr-2" />
                Find Bill Overcharges
                <ArrowRight className="h-3 w-3 ml-2" />
              </MobileButton>
            </motion.div>
          </Link>
          
          <Link href="/training">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <MobileButton variant="secondary" className="w-full max-w-xs mx-auto shadow-lg border-2 border-indigo-200 hover:border-indigo-300">
                <BookOpen className="h-4 w-4 mr-2" />
                Medical Training
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
            How to Reduce Your Medical Bills
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto" />
          <p className="text-sm text-gray-600 mt-3 max-w-sm mx-auto">
            Follow these simple steps to find and dispute overcharges
          </p>
        </motion.div>
        
        <div className="space-y-3 mb-8">
          {[
            { 
              icon: FileText, 
              title: "1. Upload Your Medical Bill", 
              desc: "Take a photo or upload PDF - AI analyzes in seconds", 
              color: "emerald", 
              delay: 1.4,
              href: "/bill-analyzer"
            },
            { 
              icon: AlertTriangle, 
              title: "2. Review Overcharges Found", 
              desc: "See exactly what you're being overcharged for", 
              color: "red", 
              delay: 1.5,
              href: "/bill-analyzer"
            },
            { 
              icon: DollarSign, 
              title: "3. Get Professional Dispute Letters", 
              desc: "Download proven templates that get results", 
              color: "green", 
              delay: 1.6,
              href: "/bill-analyzer"
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

      {/* Medical Training Overview */}
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
            Plus: Advanced Medical Training
          </h2>
          <div className="h-0.5 w-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto" />
        </motion.div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { 
              icon: BookOpen, 
              title: "60+ Cases", 
              desc: "Interactive scenarios", 
              color: "blue", 
              delay: 2.0,
              href: "/training"
            },
            { 
              icon: Brain, 
              title: "19 Specialties", 
              desc: "All medical fields", 
              color: "purple", 
              delay: 2.1,
              href: "/training"
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

      {/* Advanced Training Modules */}
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
            Advanced Learning
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto" />
        </motion.div>
        
        <div className="space-y-3">
          {[
            { 
              icon: Trophy, 
              title: "Board Exam Prep", 
              desc: "USMLE & specialty board practice exams", 
              color: "green", 
              delay: 2.2,
              href: "/board-exam-prep"
            },
            { 
              icon: Zap, 
              title: "Clinical Decision Trees", 
              desc: "Interactive diagnostic algorithms", 
              color: "orange", 
              delay: 2.3,
              href: "/clinical-decision-trees"
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
                { value: "60+", label: "Medical Cases", gradient: "from-indigo-600 to-blue-600", delay: 2.5 },
                { value: "$500K+", label: "Max Savings", gradient: "from-emerald-600 to-teal-600", delay: 2.6 },
                { value: "19", label: "Specialties", gradient: "from-purple-600 to-pink-600", delay: 2.7 }
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
          className="text-base text-gray-700 mb-8 max-w-sm mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.9, duration: 0.6 }}
        >
          Master medical diagnosis and find massive savings on your medical bills - all in one powerful platform.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 0.7, type: "spring", stiffness: 150 }}
        >
          <Link href="/bill-analyzer">
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
