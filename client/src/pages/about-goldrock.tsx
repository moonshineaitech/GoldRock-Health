import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowRight, Shield, DollarSign, FileText, Brain, MessageSquare, 
  Clock, Scale, Heart, Users, Sparkles, CheckCircle, Phone, 
  Calculator, Gavel, BookOpen, AlertTriangle, Zap, Target,
  FileCheck, TrendingDown, Award, Lock, Stethoscope, Dna
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingParticle = ({ delay = 0, duration = 20, size = 4 }: { delay?: number; duration?: number; size?: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, rgba(6, 182, 212, 0.2) 50%, transparent 100%)`,
      boxShadow: `0 0 ${size * 2}px rgba(16, 185, 129, 0.3)`,
    }}
    initial={{ 
      x: `${Math.random() * 100}%`, 
      y: '110%',
      opacity: 0,
      scale: 0 
    }}
    animate={{ 
      y: '-10%',
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1, 0],
      x: `${Math.random() * 100}%`
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

const GlowingOrb = ({ className, color1, color2, size = 400, blur = 100 }: { className?: string; color1: string; color2: string; size?: number; blur?: number }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${className}`}
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color1} 0%, ${color2} 50%, transparent 70%)`,
      filter: `blur(${blur}px)`,
    }}
    animate={{
      scale: [1, 1.15, 1],
      opacity: [0.25, 0.4, 0.25],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const FeatureSection = ({ 
  icon: Icon, 
  title, 
  description, 
  features, 
  color,
  reversed = false 
}: {
  icon: any;
  title: string;
  description: string;
  features: string[];
  color: string;
  reversed?: boolean;
}) => (
  <motion.div 
    className={`grid md:grid-cols-2 gap-12 items-center py-16 ${reversed ? 'md:flex-row-reverse' : ''}`}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <div className={reversed ? 'md:order-2' : ''}>
      <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r ${color} mb-6`}>
        <Icon className="h-5 w-5 text-white" />
        <span className="text-white font-semibold text-sm">{title}</span>
      </div>
      <p className="text-xl text-gray-700 leading-relaxed mb-6">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className={`relative ${reversed ? 'md:order-1' : ''}`}>
      <div className={`aspect-video rounded-2xl bg-gradient-to-br ${color} p-8 flex items-center justify-center shadow-2xl`}>
        <Icon className="h-24 w-24 text-white/90" strokeWidth={1.5} />
      </div>
    </div>
  </motion.div>
);

export default function AboutGoldRock() {
  const coreFeatures = [
    {
      icon: Brain,
      title: "AI Bill Analysis",
      description: "Upload any medical bill and our AI instantly scans for errors, overcharges, and savings opportunities. Get personalized negotiation strategies based on your specific situation.",
      features: [
        "Automatic CPT code verification and error detection",
        "Comparison against fair market rates and Medicare benchmarks",
        "Personalized negotiation scripts and talking points",
        "Financial assistance program recommendations"
      ],
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: FileText,
      title: "Hospital Bill Playbook",
      description: "A comprehensive guide with 22+ scenarios covering every type of hospital bill. Take action within the critical 30-60 day window BEFORE bills go to collections.",
      features: [
        "Step-by-step playbooks for ER, surgery, imaging, and more",
        "Insider knowledge from billing industry experts",
        "Ready-to-use letter templates and dispute scripts",
        "Federal and state legal protections explained"
      ],
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Shield,
      title: "Collections Defense Guide",
      description: "Already have bills in collections? Our defense guide helps you understand your rights and navigate the collections process to minimize damage and maximize savings.",
      features: [
        "Debt validation letter templates",
        "FDCPA rights and violation identification",
        "Statute of limitations lookup by state",
        "Credit report dispute strategies"
      ],
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Phone,
      title: "Medicare & Medicaid Enrollment",
      description: "Voice-enabled enrollment wizard with AI-powered eligibility analysis. Understand your options and get help applying for government healthcare programs.",
      features: [
        "AI eligibility screening for Medicare and Medicaid",
        "Step-by-step enrollment guidance",
        "Deadline tracking and reminders",
        "Plan comparison and benefit explanations"
      ],
      color: "from-amber-500 to-orange-600"
    }
  ];

  const additionalTools = [
    { icon: Calculator, title: "Bill Calculators", description: "Estimate fair prices and potential savings" },
    { icon: Gavel, title: "Dispute Arsenal", description: "Templates, scripts, and escalation strategies" },
    { icon: BookOpen, title: "Rights Hub", description: "Know your patient rights in every state" },
    { icon: MessageSquare, title: "AI Coaching", description: "Practice negotiations with AI role-play" },
    { icon: AlertTriangle, title: "Emergency Help", description: "Quick guidance for urgent billing crises" },
    { icon: TrendingDown, title: "Industry Insights", description: "Insider tactics from billing professionals" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden pt-8 pb-16">
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(255,255,255,1) 30%, rgba(240,253,244,0.5) 70%, rgba(236,253,245,0.8) 100%)",
          }}
        />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingOrb 
            className="top-0 -left-32" 
            color1="rgba(16, 185, 129, 0.2)" 
            color2="rgba(6, 182, 212, 0.08)" 
            size={500}
            blur={120}
          />
          <GlowingOrb 
            className="-bottom-32 -right-32" 
            color1="rgba(139, 92, 246, 0.15)" 
            color2="rgba(59, 130, 246, 0.06)" 
            size={450}
            blur={100}
          />
          
          {[...Array(10)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 1.5} duration={20 + Math.random() * 8} size={3 + Math.random() * 4} />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-gray-500 mb-6">
            <span className="text-sm">About Us</span>
          </div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-center text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Introducing GoldRock Health
          </motion.h1>
          
          <motion.p 
            className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            An AI-powered platform designed to help you understand, challenge, and reduce your medical bills.
          </motion.p>

          <motion.div 
            className="flex justify-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/api/login">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full px-8 shadow-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/hospital-bill-playbook">
              <Button variant="outline" size="lg" className="rounded-full px-8 border-2">
                Explore Bill Playbook
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-gray-50/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Medical billing is broken. We're here to help.
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Every year, Americans pay billions in medical bills that contain errors, overcharges, and fees they shouldn't owe. 
              Most people don't know their rights or how to fight back. GoldRock Health gives you the knowledge, tools, and AI-powered 
              guidance to take control of your medical finances.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div 
              className="text-center p-8 rounded-3xl bg-white shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <div className="text-5xl font-bold text-emerald-600 mb-3">80%</div>
              <p className="text-gray-600">of medical bills contain errors according to industry studies</p>
            </motion.div>
            <motion.div 
              className="text-center p-8 rounded-3xl bg-white shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-5xl font-bold text-purple-600 mb-3">$400B+</div>
              <p className="text-gray-600">in medical debt currently held by Americans</p>
            </motion.div>
            <motion.div 
              className="text-center p-8 rounded-3xl bg-white shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-5xl font-bold text-blue-600 mb-3">30-60</div>
              <p className="text-gray-600">days is your critical window to act before collections</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to fight unfair medical bills
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From AI-powered analysis to step-by-step playbooks, we provide the tools and knowledge to help you save.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            {coreFeatures.map((feature, index) => (
              <FeatureSection 
                key={feature.title}
                {...feature}
                reversed={index % 2 === 1}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Plus many more tools
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to navigate the complex world of medical billing.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {additionalTools.map((tool, index) => (
              <motion.div
                key={tool.title}
                className="p-6 rounded-2xl bg-white shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <tool.icon className="h-8 w-8 text-emerald-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">{tool.title}</h3>
                <p className="text-gray-600 text-sm">{tool.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-12 text-center shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Lock className="h-12 w-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Your privacy is our priority
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
              GoldRock Health is built with privacy at its core. Your medical information is encrypted and never shared. 
              We use industry-standard security practices to keep your data safe.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>End-to-end encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <span>HIPAA-conscious design</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>No data selling</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Designed with care
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              GoldRock Health was created with input from healthcare billing experts, patient advocates, 
              and people who have navigated the medical billing system themselves.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <motion.div 
              className="p-8 rounded-2xl bg-white shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Heart className="h-10 w-10 text-rose-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Built for patients, not profits</h3>
              <p className="text-gray-600">
                We believe everyone deserves access to fair medical billing. Our tools are designed to level 
                the playing field between patients and the complex healthcare billing system.
              </p>
            </motion.div>
            <motion.div 
              className="p-8 rounded-2xl bg-white shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Users className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-world expertise</h3>
              <p className="text-gray-600">
                Our playbooks and strategies come from billing industry insiders, patient advocates, 
                and healthcare professionals who understand how the system really works.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to take control of your medical bills?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Join thousands of patients who are fighting back against unfair medical billing.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/api/login">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full px-12 py-6 text-lg shadow-xl">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">GoldRock Health</span>
            </div>
            <div className="flex flex-wrap gap-6 text-gray-400 text-sm">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
              <a href="mailto:CONTACT@GOLDROCK.ai" className="hover:text-white transition-colors">CONTACT@GOLDROCK.ai</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>GoldRock Health provides educational information and tools. Always consult with qualified professionals for medical and legal advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
