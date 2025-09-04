import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { StatisticsDashboard } from "@/components/statistics-dashboard";
import { AchievementSystem } from "@/components/achievement-system";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { Link } from "wouter";
import { BookOpen, Brain, Trophy, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";


export default function Landing() {
  return (
    <MobileLayout title="MedTrainer AI" showBottomNav={true}>
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
          className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-700 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/30 relative"
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
          <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4 leading-none tracking-tight">
            Master Medical Diagnosis
          </h1>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight">
            with AI-Powered Training
          </h2>
        </motion.div>
        
        <motion.p 
          className="text-base text-gray-700 mb-10 max-w-xs mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          Interactive patient simulations powered by advanced AI. Train with realistic cases across 19+ medical specialties.
        </motion.p>
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 35, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.7, type: "spring", stiffness: 100 }}
        >
          <Link href="/training">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <MobileButton className="w-full shadow-xl shadow-indigo-500/25 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700" size="lg">
                <BookOpen className="h-5 w-5 mr-3" />
                Start Training
                <ArrowRight className="h-4 w-4 ml-3" />
              </MobileButton>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Training Modules Grid */}
      <motion.div 
        className="space-y-4 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <h2 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
            Training Modules
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto" />
        </motion.div>
        
        <div className="space-y-3">
          {[
            { 
              icon: BookOpen, 
              title: "Patient Simulations", 
              desc: "60+ interactive medical cases across 19 specialties", 
              color: "blue", 
              delay: 1.3,
              href: "/training"
            },
            { 
              icon: Brain, 
              title: "Medical Image Analysis", 
              desc: "X-ray, CT, MRI interpretation training", 
              color: "purple", 
              delay: 1.4,
              href: "/image-analysis"
            },
            { 
              icon: Trophy, 
              title: "Board Exam Prep", 
              desc: "USMLE & specialty board practice exams", 
              color: "green", 
              delay: 1.5,
              href: "/board-exam-prep"
            },
            { 
              icon: Zap, 
              title: "Clinical Decision Trees", 
              desc: "Interactive diagnostic algorithms", 
              color: "orange", 
              delay: 1.6,
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
        transition={{ delay: 1.8, duration: 0.6 }}
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
              transition={{ delay: 1.8, duration: 0.5 }}
            >
              <h3 className="font-black text-gray-900 mb-6 text-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">Platform Statistics</h3>
              <div className="h-0.5 w-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-6" />
            </motion.div>
            
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "60+", label: "Medical Cases", gradient: "from-indigo-600 to-blue-600", delay: 1.9 },
                { value: "19", label: "Specialties", gradient: "from-purple-600 to-pink-600", delay: 2.0 },
                { value: "95%", label: "Accuracy Rate", gradient: "from-emerald-600 to-teal-600", delay: 2.1 }
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
        transition={{ delay: 2.2, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-20 h-20 bg-gradient-to-r from-emerald-200/15 to-teal-200/15 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-16 h-16 bg-gradient-to-r from-indigo-200/15 to-purple-200/15 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.6 }}
        >
          <h2 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
            Ready to Begin?
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full mx-auto mb-6" />
        </motion.div>
        
        <motion.p 
          className="text-base text-gray-700 mb-8 max-w-xs mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.6 }}
        >
          Join thousands of medical students and professionals advancing their diagnostic skills.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.7, type: "spring", stiffness: 150 }}
        >
          <Link href="/training">
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <MobileButton className="w-full max-w-sm shadow-2xl shadow-emerald-500/25 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700" size="lg">
                <BookOpen className="h-5 w-5 mr-3" />
                Start Your First Case
                <ArrowRight className="h-4 w-4 ml-3" />
              </MobileButton>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </MobileLayout>
  );
}
