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
        className="text-center py-8 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-stethoscope text-white text-2xl"></i>
        </div>
        <h1 className="text-responsive-xl font-bold text-gray-900 mb-4">
          Master Medical Diagnosis with AI
        </h1>
        <p className="text-responsive text-gray-600 mb-8 max-w-md mx-auto">
          Interactive patient simulations powered by advanced AI. Train with realistic cases across 19+ medical specialties.
        </p>
        
        <div className="space-y-3">
          <Link href="/training">
            <MobileButton className="w-full" size="lg">
              <BookOpen className="h-5 w-5 mr-2" />
              Start Training
              <ArrowRight className="h-4 w-4 ml-2" />
            </MobileButton>
          </Link>
          
          <Link href="/game">
            <MobileButton variant="secondary" className="w-full" size="lg">
              <Zap className="h-5 w-5 mr-2" />
              Quick Practice
            </MobileButton>
          </Link>
        </div>
      </motion.div>

      {/* Mobile Features Grid */}
      <div className="space-y-4 mt-8">
        <h2 className="text-responsive-lg font-semibold text-gray-900 text-center mb-6">
          What You'll Learn
        </h2>
        
        <div className="mobile-grid">
          <MobileCard>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">60+ Medical Cases</h3>
              <p className="text-sm text-gray-600">Comprehensive cases across 19 specialties</p>
            </div>
          </MobileCard>
          
          <MobileCard>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-600">Unlimited case generation with GPT-4</p>
            </div>
          </MobileCard>
          
          <MobileCard>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-sm text-gray-600">Real-time feedback and achievements</p>
            </div>
          </MobileCard>
          
          <MobileCard>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Voice Enabled</h3>
              <p className="text-sm text-gray-600">Natural conversation with AI patients</p>
            </div>
          </MobileCard>
        </div>
      </div>

      {/* Mobile Statistics */}
      <MobileCard className="mt-8">
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 mb-4">Platform Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-indigo-600">60+</div>
              <div className="text-xs text-gray-600">Medical Cases</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">19</div>
              <div className="text-xs text-gray-600">Specialties</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-xs text-gray-600">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </MobileCard>

      {/* Mobile Call to Action */}
      <motion.div 
        className="text-center py-8 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h2 className="text-responsive-lg font-semibold text-gray-900 mb-4">
          Ready to Begin?
        </h2>
        <p className="text-responsive text-gray-600 mb-6 max-w-sm mx-auto">
          Join thousands of medical students and professionals advancing their diagnostic skills.
        </p>
        <Link href="/training">
          <MobileButton className="w-full max-w-sm" size="lg">
            <BookOpen className="h-5 w-5 mr-2" />
            Start Your First Case
            <ArrowRight className="h-4 w-4 ml-2" />
          </MobileButton>
        </Link>
      </motion.div>
    </MobileLayout>
  );
}
