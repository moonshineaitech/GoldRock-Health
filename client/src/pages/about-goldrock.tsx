import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowRight, Shield, DollarSign, FileText, Brain, MessageSquare, 
  Clock, Scale, Heart, Users, Sparkles, CheckCircle, Phone, 
  Calculator, Gavel, BookOpen, AlertTriangle, Zap, Target,
  FileCheck, TrendingDown, Award, Lock, Mail, Lightbulb, Eye, 
  HandHeart, Rocket, Star, Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/patient_advocacy_team_empowerment.png";
import missionImage from "@assets/generated_images/shield_protecting_from_medical_debt.png";
import teamImage from "@assets/generated_images/diverse_tech_startup_team_collaboration.png";
import appImage from "@assets/generated_images/mobile_app_showing_savings.png";

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

const ValueCard = ({ icon: Icon, title, description, color, delay }: { icon: any; title: string; description: string; color: string; delay: number }) => (
  <motion.div 
    className="relative group"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
    <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 h-full">
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${color} mb-6 shadow-lg`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const StatCard = ({ number, label, suffix = "", delay }: { number: string; label: string; suffix?: string; delay: number }) => (
  <motion.div 
    className="text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
  >
    <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
      {number}{suffix}
    </div>
    <p className="text-white/80 text-lg">{label}</p>
  </motion.div>
);

export default function AboutGoldRock() {
  const values = [
    {
      icon: Heart,
      title: "Compassion First",
      description: "We understand the stress and anxiety of medical debt. Every feature we build starts with empathy for your situation.",
      color: "from-rose-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "Your Champion",
      description: "We're in your corner. Our tools give you the same insider knowledge that billing professionals use—leveling the playing field.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Eye,
      title: "Radical Transparency",
      description: "No hidden fees, no surprise charges, no selling your data. What you see is what you get—unlike the bills we help you fight.",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Lightbulb,
      title: "Empowerment Through Knowledge",
      description: "We don't just solve problems—we teach you how the system works so you can advocate for yourself and your family.",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: Lock,
      title: "Privacy Sacred",
      description: "Your medical information is deeply personal. We use bank-level encryption and never share or sell your data. Period.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Rocket,
      title: "Relentless Innovation",
      description: "Healthcare billing is complex, but our AI gets smarter every day, finding new ways to identify savings and protect your rights.",
      color: "from-cyan-500 to-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Healthcare advocacy team" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent" />
        </div>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 1.2} duration={18 + Math.random() * 8} size={2 + Math.random() * 4} />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>AI-Powered Healthcare Advocacy</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Medical Debt Keeps You Up at Night.
              <span className="block mt-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                We Help You Sleep Again.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed max-w-2xl">
              GoldRock Health combines AI intelligence with insider billing expertise to help you understand, challenge, and reduce unfair medical bills.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/api/login">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full px-8 py-6 text-lg shadow-xl shadow-emerald-500/25">
                  Start Saving Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/hospital-bill-playbook">
                <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg border-2 border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/60">
                  Explore Free Guides
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingOrb 
            className="-top-32 -right-32" 
            color1="rgba(16, 185, 129, 0.15)" 
            color2="rgba(6, 182, 212, 0.05)" 
            size={600}
            blur={150}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
                <Target className="h-4 w-4" />
                <span>Our Mission</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Fighting for fair healthcare billing—
                <span className="text-emerald-600"> one patient at a time</span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Every year, Americans pay billions in medical bills that contain errors, overcharges, and fees they shouldn't owe. 
                The healthcare billing system is complex, opaque, and often unfair. Most people don't know their rights—or how to fight back.
              </p>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                <strong className="text-gray-900">GoldRock Health exists to change that.</strong> We combine cutting-edge AI with insider knowledge from billing industry professionals to give you the tools, strategies, and confidence to take control of your medical finances.
              </p>

              <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Questions? Reach us at</p>
                  <a href="mailto:CONTACT@GOLDROCK.ai" className="text-lg font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                    CONTACT@GOLDROCK.ai
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={missionImage} 
                  alt="Protection from medical debt" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
              </div>
              
              {/* Floating stat cards */}
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-3xl font-bold text-emerald-600 mb-1">80%</div>
                <p className="text-gray-600 text-sm">of medical bills contain errors</p>
              </motion.div>
              
              <motion.div 
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-3xl font-bold text-purple-600 mb-1">$400B+</div>
                <p className="text-gray-600 text-sm">medical debt in America</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
                <BookOpen className="h-4 w-4" />
                <span>Our Story</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Born from frustration. Built with purpose.
              </h2>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-purple-500 to-blue-500 hidden md:block" />
              
              <div className="space-y-12">
                <motion.div 
                  className="md:pl-20 relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute left-6 top-0 w-4 h-4 rounded-full bg-emerald-500 hidden md:block" />
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <Quote className="h-10 w-10 text-emerald-300 mb-4" />
                    <p className="text-xl text-gray-700 leading-relaxed mb-4">
                      It started with a $47,000 emergency room bill—for a 3-hour visit. The charges made no sense. 
                      The "itemized bill" was incomprehensible. And every phone call led to a different answer.
                    </p>
                    <p className="text-gray-600">
                      After weeks of research, we discovered hidden billing codes, duplicate charges, and rates far above 
                      Medicare benchmarks. That one bill sparked a mission to help others navigate this broken system.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="md:pl-20 relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="absolute left-6 top-0 w-4 h-4 rounded-full bg-purple-500 hidden md:block" />
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <p className="text-xl text-gray-700 leading-relaxed mb-4">
                      We partnered with billing industry insiders, patient advocates, and healthcare policy experts. 
                      We learned how hospitals price services, how insurance companies negotiate, and where the leverage points really are.
                    </p>
                    <p className="text-gray-600">
                      Then we built AI to make that knowledge accessible to everyone—not just those who can afford 
                      expensive patient advocates or healthcare attorneys.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="md:pl-20 relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="absolute left-6 top-0 w-4 h-4 rounded-full bg-blue-500 hidden md:block" />
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-lg border border-emerald-100">
                    <p className="text-xl text-gray-700 leading-relaxed mb-4">
                      <strong className="text-emerald-700">Today, GoldRock Health helps thousands of people</strong> understand 
                      their medical bills, identify errors, and fight for fair prices. We're not done until the healthcare 
                      billing system works for patients—not against them.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingOrb 
            className="-bottom-32 -left-32" 
            color1="rgba(16, 185, 129, 0.3)" 
            color2="rgba(6, 182, 212, 0.1)" 
            size={500}
            blur={120}
          />
          <GlowingOrb 
            className="-top-32 -right-32" 
            color1="rgba(139, 92, 246, 0.2)" 
            color2="rgba(59, 130, 246, 0.08)" 
            size={400}
            blur={100}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The medical billing crisis in numbers
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              These aren't just statistics—they represent real people struggling with a broken system.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            <StatCard number="80" suffix="%" label="of bills have errors" delay={0} />
            <StatCard number="$400" suffix="B+" label="in medical debt" delay={0.1} />
            <StatCard number="66" suffix="%" label="bankruptcies tied to medical bills" delay={0.2} />
            <StatCard number="30-60" suffix="" label="days to act before collections" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingOrb 
            className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
            color1="rgba(16, 185, 129, 0.08)" 
            color2="rgba(6, 182, 212, 0.03)" 
            size={800}
            blur={200}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              <span>Our Values</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What we stand for
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every decision we make is guided by these core principles.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <ValueCard key={value.title} {...value} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={teamImage} 
                  alt="GoldRock Health team" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />
              </div>
            </motion.div>

            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6">
                <Users className="h-4 w-4" />
                <span>Our Team</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Built by people who've been there
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                Our team brings together healthcare billing experts, patient advocates, technology innovators, 
                and—most importantly—people who have personally experienced the frustration of unfair medical bills.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Healthcare Billing Experts</h4>
                    <p className="text-gray-600">Former billing department professionals who know where savings hide.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                    <HandHeart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Patient Advocates</h4>
                    <p className="text-gray-600">Professionals who have helped thousands navigate the healthcare system.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">AI & Technology Innovators</h4>
                    <p className="text-gray-600">Engineers building intelligent tools to automate bill analysis and advocacy.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                <span>Powerful Tools</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Everything you need to fight back—in one platform
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                From AI bill analysis to letter templates, negotiation scripts to government program enrollment—GoldRock Health 
                puts the power of healthcare advocacy in your hands.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md">
                  <FileText className="h-6 w-6 text-emerald-600" />
                  <span className="font-medium text-gray-900">Bill Analysis</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                  <span className="font-medium text-gray-900">AI Coaching</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md">
                  <Gavel className="h-6 w-6 text-blue-600" />
                  <span className="font-medium text-gray-900">Letter Templates</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md">
                  <Calculator className="h-6 w-6 text-amber-600" />
                  <span className="font-medium text-gray-900">Savings Calculator</span>
                </div>
              </div>

              <Link href="/api/login">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full px-8 shadow-xl">
                  Start For Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={appImage} 
                  alt="GoldRock Health app showing savings" 
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 md:p-16 text-center shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <GlowingOrb 
                className="-top-20 -right-20" 
                color1="rgba(16, 185, 129, 0.3)" 
                color2="rgba(6, 182, 212, 0.1)" 
                size={300}
                blur={80}
              />
              <GlowingOrb 
                className="-bottom-20 -left-20" 
                color1="rgba(139, 92, 246, 0.2)" 
                color2="rgba(59, 130, 246, 0.08)" 
                size={250}
                blur={70}
              />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-8 mx-auto shadow-xl">
                <Lock className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Your privacy is sacred to us
              </h2>
              
              <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
                Your medical information is deeply personal. We protect it with the same level of security 
                used by major financial institutions—and we <strong className="text-white">never</strong> sell or share your data.
              </p>
              
              <div className="flex flex-wrap justify-center gap-8">
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Shield className="h-5 w-5" />
                  </div>
                  <span>256-bit encryption</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Lock className="h-5 w-5" />
                  </div>
                  <span>HIPAA-conscious design</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span>No data selling—ever</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to stop losing sleep over medical bills?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Join thousands of people who are taking control of their healthcare finances with GoldRock Health.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/api/login">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full px-12 py-6 text-lg shadow-xl shadow-emerald-500/25">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/collections-defense-guide">
                <Button variant="outline" size="lg" className="rounded-full px-12 py-6 text-lg border-2">
                  View Collections Guide
                </Button>
              </Link>
            </div>
            
            <p className="mt-8 text-gray-500">
              Questions? Email us at <a href="mailto:CONTACT@GOLDROCK.ai" className="text-emerald-600 hover:text-emerald-700 font-medium">CONTACT@GOLDROCK.ai</a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold">GoldRock Health</span>
                <p className="text-gray-400 text-sm">AI-Powered Healthcare Advocacy</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-gray-400">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
              <a href="mailto:CONTACT@GOLDROCK.ai" className="hover:text-emerald-400 transition-colors font-medium">CONTACT@GOLDROCK.ai</a>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p className="mb-4">
              GoldRock Health provides educational information and tools. Always consult with qualified professionals for medical and legal advice.
            </p>
            <p>© {new Date().getFullYear()} GoldRock Health. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
