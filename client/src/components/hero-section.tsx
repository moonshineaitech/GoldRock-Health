import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Mic, Brain, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-emerald-600/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight"
          >
            Master Medical Diagnosis with
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent block mt-2">
              AI-Powered Training
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Experience realistic patient interactions with voice-enabled AI simulations. 
            Train across 60+ medical cases spanning 19 specialties with real-time feedback and progress tracking.
          </motion.p>
          
          {/* Feature Highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Mic className="text-white h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Voice Interactions</h3>
              <p className="text-slate-600 text-sm">Natural voice conversations with AI patients using ElevenLabs synthesis</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Brain className="text-white h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">AI-Powered Cases</h3>
              <p className="text-slate-600 text-sm">Adaptive difficulty and intelligent case recommendations</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="text-white h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Progress Tracking</h3>
              <p className="text-slate-600 text-sm">Comprehensive analytics and competency mapping</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <Link href="/training">Start Training Now</Link>
            </Button>
            <Button variant="outline" className="bg-white/80 backdrop-blur-sm text-slate-700 px-8 py-4 rounded-2xl font-semibold text-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              View Demo
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
