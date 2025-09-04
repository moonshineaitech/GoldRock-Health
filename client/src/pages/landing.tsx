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
      {/* Mobile Hero Section */}
      <motion.div 
        className="text-center py-6 px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="w-14 h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/25"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.3,
            type: "spring",
            stiffness: 200
          }}
        >
          <i className="fas fa-stethoscope text-white text-xl"></i>
        </motion.div>
        
        <motion.h1 
          className="text-2xl font-bold text-gray-900 mb-4 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Master Medical Diagnosis with AI
        </motion.h1>
        
        <motion.p 
          className="text-base text-gray-600 mb-8 max-w-sm mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Interactive patient simulations powered by advanced AI. Train with realistic cases across 19+ medical specialties.
        </motion.p>
        
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <Link href="/training">
            <MobileButton className="w-full" size="lg">
              <BookOpen className="h-5 w-5 mr-2" />
              Start Training
              <ArrowRight className="h-4 w-4 ml-2" />
            </MobileButton>
          </Link>
        </motion.div>
      </motion.div>

      {/* Mobile Features Grid */}
      <motion.div 
        className="space-y-4 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <motion.h2 
          className="text-xl font-semibold text-gray-900 text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          What You'll Learn
        </motion.h2>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: BookOpen, title: "60+ Medical Cases", desc: "Comprehensive cases across 19 specialties", color: "blue", delay: 1.3 },
            { icon: Brain, title: "AI-Powered", desc: "Unlimited case generation with GPT-4", color: "purple", delay: 1.4 },
            { icon: Trophy, title: "Progress Tracking", desc: "Real-time feedback and achievements", color: "green", delay: 1.5 },
            { icon: Zap, title: "Voice Enabled", desc: "Natural conversation with AI patients", color: "orange", delay: 1.6 }
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
                <MobileCard className="h-full">
                  <div className="text-center">
                    <motion.div 
                      className={`w-10 h-10 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-3`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IconComponent className={`h-5 w-5 text-${feature.color}-600`} />
                    </motion.div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{feature.desc}</p>
                  </div>
                </MobileCard>
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
        <MobileCard className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-4 text-base">Platform Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "60+", label: "Medical Cases", color: "text-indigo-600", delay: 1.9 },
                { value: "19", label: "Specialties", color: "text-purple-600", delay: 2.0 },
                { value: "95%", label: "Accuracy Rate", color: "text-green-600", delay: 2.1 }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: stat.delay, 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 300
                  }}
                >
                  <motion.div 
                    className={`text-2xl font-bold ${stat.color}`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: stat.delay }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </MobileCard>
      </motion.div>

      {/* Mobile Call to Action */}
      <motion.div 
        className="text-center py-6 mt-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.8, ease: "easeOut" }}
      >
        <motion.h2 
          className="text-xl font-semibold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.5 }}
        >
          Ready to Begin?
        </motion.h2>
        
        <motion.p 
          className="text-base text-gray-600 mb-6 max-w-sm mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.5 }}
        >
          Join thousands of medical students and professionals advancing their diagnostic skills.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 0.5, type: "spring", stiffness: 200 }}
        >
          <Link href="/training">
            <MobileButton className="w-full max-w-sm" size="lg">
              <BookOpen className="h-5 w-5 mr-2" />
              Start Your First Case
              <ArrowRight className="h-4 w-4 ml-2" />
            </MobileButton>
          </Link>
        </motion.div>
      </motion.div>
    </MobileLayout>
  );
}
