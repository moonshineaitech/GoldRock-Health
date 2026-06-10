import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Mic, Brain, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-background">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, var(--background), var(--card))" }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="text-xs uppercase tracking-[0.2em] text-gold mb-5"
          >
            AI-Powered Training
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-serif text-5xl lg:text-7xl font-semibold text-foreground mb-8 leading-tight"
          >
            Master Medical Diagnosis with
            <span className="block mt-2 luxury-text-gradient">
              AI-Powered Training
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Experience realistic patient interactions with voice-enabled AI simulations. 
            Train across 60+ medical cases spanning 19 specialties with real-time feedback and progress tracking.
          </motion.p>
          
          {/* Feature Highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="luxury-card p-6 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Mic className="text-muted-foreground h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Voice Interactions</h3>
              <p className="text-muted-foreground text-sm">Natural voice conversations with AI patients using ElevenLabs synthesis</p>
            </div>
            
            <div className="luxury-card p-6 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Brain className="text-muted-foreground h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">AI-Powered Cases</h3>
              <p className="text-muted-foreground text-sm">Adaptive difficulty and intelligent case recommendations</p>
            </div>
            
            <div className="luxury-card p-6 hover:shadow-md transition-all duration-300">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto"
                style={{ background: "linear-gradient(135deg, var(--gold-soft), var(--gold-deep))" }}
              >
                <TrendingUp className="text-white h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground text-sm">Comprehensive analytics and competency mapping</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button asChild className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-md transition-all duration-300">
              <Link href="/training">Start Training Now</Link>
            </Button>
            <Button variant="outline" className="luxury-card text-foreground px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-md transition-all duration-300">
              View Demo
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
