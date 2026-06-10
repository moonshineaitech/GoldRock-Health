import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowRight, Shield, DollarSign, FileText, Brain, MessageSquare, 
  Clock, Scale, Heart, Users, Sparkles, CheckCircle, Phone, 
  Calculator, Gavel, BookOpen, AlertTriangle, Zap, Target,
  FileCheck, TrendingDown, Award, Lock, Mail, Lightbulb, Eye, 
  HandHeart, Rocket, Star, Quote, Upload, Search, ChevronDown,
  ChevronRight, HelpCircle, ArrowDown, Minus, Check, X,
  type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/patient_advocacy_team_empowerment.png";
import missionImage from "@assets/generated_images/shield_protecting_from_medical_debt.png";
import teamImage from "@assets/generated_images/diverse_tech_startup_team_collaboration.png";
import appImage from "@assets/generated_images/mobile_app_showing_savings.png";

const EASE = [0.22, 1, 0.36, 1] as const;

const Kicker = ({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-muted-foreground text-xs font-semibold uppercase tracking-[0.15em] mb-6">
    <Icon className="h-4 w-4 text-gold" />
    <span>{children}</span>
  </div>
);

const ValueCard = ({ icon: Icon, title, description, delay }: { icon: LucideIcon; title: string; description: string; delay: number }) => (
  <motion.div 
    className="relative group h-full"
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5, ease: EASE }}
    whileHover={{ y: -2, transition: { duration: 0.3, ease: EASE } }}
  >
    <div className="luxury-card p-8 h-full">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary border border-border mb-6">
        <Icon className="h-7 w-7 text-foreground" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const StatCard = ({ number, label, suffix = "", delay }: { number: string; label: string; suffix?: string; delay: number }) => (
  <motion.div 
    className="text-center"
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5, ease: EASE }}
  >
    <div className="text-5xl md:text-6xl font-bold luxury-text-gradient font-serif mb-2">
      {number}{suffix}
    </div>
    <p className="text-muted-foreground text-lg">{label}</p>
  </motion.div>
);

const ProcessStep = ({ step, icon: Icon, title, description, delay, isLast }: { step: number; icon: LucideIcon; title: string; description: string; delay: number; isLast?: boolean }) => (
  <motion.div 
    className="relative"
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5, ease: EASE }}
  >
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-secondary border border-border flex items-center justify-center">
          <Icon className="h-10 w-10 text-foreground" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card border border-border shadow-sm flex items-center justify-center">
          <span className="text-sm font-bold text-gold">{step}</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed max-w-xs">{description}</p>
    </div>
    
    {!isLast && (
      <div className="hidden md:block absolute top-10 left-[60%] w-[80%]">
        <div className="h-px bg-border" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    )}
  </motion.div>
);

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) => (
  <div className="border-b border-border last:border-b-0">
    <button
      onClick={onClick}
      className="w-full py-6 flex items-center justify-between text-left hover:text-gold transition-colors"
    >
      <span className="text-lg font-semibold text-foreground pr-8">{question}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="flex-shrink-0"
      >
        <ChevronDown className={`h-5 w-5 ${isOpen ? 'text-gold' : 'text-muted-foreground'}`} />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="overflow-hidden"
        >
          <p className="pb-6 text-muted-foreground leading-relaxed">{answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const ComparisonRow = ({ feature, without, withGoldrock, delay }: { feature: string; without: string; withGoldrock: string; delay: number }) => (
  <motion.div 
    className="grid grid-cols-3 gap-4 py-4 border-b border-border last:border-b-0"
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.4, ease: EASE }}
  >
    <div className="font-medium text-foreground">{feature}</div>
    <div className="flex items-center gap-2 text-muted-foreground">
      <X className="h-4 w-4 flex-shrink-0" />
      <span className="text-sm">{without}</span>
    </div>
    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
      <Check className="h-4 w-4 flex-shrink-0" />
      <span className="text-sm font-medium">{withGoldrock}</span>
    </div>
  </motion.div>
);

export default function AboutGoldRock() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const values = [
    {
      icon: Heart,
      title: "Compassion First",
      description: "We understand the stress and anxiety of medical debt. Every feature we build starts with empathy for your situation.",
    },
    {
      icon: Shield,
      title: "Your Champion",
      description: "We're in your corner. Our tools give you the same insider knowledge that billing professionals use—leveling the playing field.",
    },
    {
      icon: Eye,
      title: "Radical Transparency",
      description: "No hidden fees, no surprise charges, no selling your data. What you see is what you get—unlike the bills we help you fight.",
    },
    {
      icon: Lightbulb,
      title: "Empowerment Through Knowledge",
      description: "We don't just solve problems—we teach you how the system works so you can advocate for yourself and your family.",
    },
    {
      icon: Lock,
      title: "Privacy Sacred",
      description: "Your medical information is deeply personal. We use bank-level encryption and never share or sell your data. Period.",
    },
    {
      icon: Rocket,
      title: "Relentless Innovation",
      description: "Healthcare billing is complex, but our AI gets smarter every day, finding new ways to identify savings and protect your rights.",
    }
  ];

  const faqs = [
    {
      question: "How does GoldRock Health help me save money on medical bills?",
      answer: "Our AI analyzes your medical bills to identify errors, overcharges, and opportunities for negotiation. We provide personalized scripts, letter templates, and step-by-step guidance to help you challenge unfair charges and negotiate lower payments. Many users save 30-50% on their bills."
    },
    {
      question: "Is my medical information secure?",
      answer: "Absolutely. We use 256-bit encryption (the same level used by major banks) to protect your data. We never sell or share your personal information with third parties. Your privacy is our top priority, and we follow HIPAA-conscious design principles."
    },
    {
      question: "What if my bill is already in collections?",
      answer: "We have a dedicated Collections Defense Guide with specific strategies for bills in collections. This includes debt validation letters, FDCPA rights information, statute of limitations guidance, and credit report dispute strategies to help minimize damage and maximize your options."
    },
    {
      question: "How quickly should I act on a medical bill?",
      answer: "The critical window is 30-60 days after receiving a bill. Acting quickly gives you more negotiating power and prevents the bill from going to collections. Our Hospital Bill Playbook provides specific timelines and strategies for each type of bill."
    },
    {
      question: "Do I need to be tech-savvy to use GoldRock Health?",
      answer: "Not at all! Our platform is designed to be simple and intuitive. Just upload your bill or describe your situation, and we'll guide you through every step with plain-English explanations and ready-to-use templates."
    },
    {
      question: "What makes GoldRock Health different from other services?",
      answer: "We combine AI-powered analysis with insider knowledge from billing industry professionals. Unlike expensive patient advocates, our tools are accessible and affordable. We don't just identify problems—we give you the exact words to say and letters to send."
    }
  ];

  const comparisonData = [
    { feature: "Understanding your bill", without: "Confusing jargon", withGoldrock: "Plain English explanations" },
    { feature: "Finding errors", without: "Hope for the best", withGoldrock: "AI-powered error detection" },
    { feature: "Knowing your rights", without: "Uninformed", withGoldrock: "State-specific legal protections" },
    { feature: "Negotiation support", without: "On your own", withGoldrock: "Expert scripts & templates" },
    { feature: "Time to resolution", without: "Months of stress", withGoldrock: "Days with clear steps" },
  ];

  const processSteps = [
    {
      icon: Upload,
      title: "Upload Your Bill",
      description: "Simply upload a photo or PDF of your medical bill. Our AI gets to work immediately."
    },
    {
      icon: Search,
      title: "AI Analysis",
      description: "We scan for errors, compare against fair prices, and identify negotiation opportunities."
    },
    {
      icon: MessageSquare,
      title: "Get Your Playbook",
      description: "Receive personalized scripts, letter templates, and step-by-step guidance to save money."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Healthcare advocacy team" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-[0.15em] mb-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
            >
              <Sparkles className="h-4 w-4 text-gold" />
              <span>AI-Powered Healthcare Advocacy</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-semibold text-white mb-6 leading-tight">
              Medical Debt Keeps You Up at Night.
              <motion.span 
                className="block mt-2 luxury-text-gradient"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
              >
                We Help You Sleep Again.
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
            >
              GoldRock Health combines AI intelligence with insider billing expertise to help you understand, challenge, and reduce unfair medical bills.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
            >
              <Link href="/api/login">
                <Button size="lg" className="text-white rounded-full px-8 py-6 text-lg shadow-sm hover:shadow-md transition-shadow group" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
                  Start Saving Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/hospital-bill-playbook">
                <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg border border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white/60">
                  Explore Free Guides
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-6 w-6 text-white/50" />
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--background), var(--card))' }}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Kicker icon={Zap}>Simple Process</Kicker>
            
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-6">
              How it works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start saving on your medical bills
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {processSteps.map((step, index) => (
              <ProcessStep 
                key={step.title}
                step={index + 1}
                icon={step.icon}
                title={step.title}
                description={step.description}
                delay={index * 0.12}
                isLast={index === processSteps.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Kicker icon={Target}>Our Mission</Kicker>
              
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-6 leading-tight">
                Fighting for fair healthcare billing—
                <span className="text-gold"> one patient at a time</span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Every year, Americans pay billions in medical bills that contain errors, overcharges, and fees they shouldn't owe. 
                The healthcare billing system is complex, opaque, and often unfair. Most people don't know their rights—or how to fight back.
              </p>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                <strong className="text-foreground">GoldRock Health exists to change that.</strong> We combine cutting-edge AI with insider knowledge from billing industry professionals to give you the tools, strategies, and confidence to take control of your medical finances.
              </p>

              <div className="flex items-center gap-4 p-6 luxury-card">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Questions? Reach us at</p>
                  <a href="mailto:CONTACT@GOLDROCK.ai" className="text-lg font-semibold text-gold hover:text-gold transition-colors">
                    CONTACT@GOLDROCK.ai
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-sm border border-border">
                <img 
                  src={missionImage} 
                  alt="Protection from medical debt" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              
              <motion.div 
                className="absolute -bottom-6 -left-6 luxury-card p-6"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
              >
                <div className="text-3xl font-bold text-gold mb-1">80%</div>
                <p className="text-muted-foreground text-sm">of medical bills contain errors</p>
              </motion.div>
              
              <motion.div 
                className="absolute -top-6 -right-6 luxury-card p-6"
                initial={{ opacity: 0, y: -12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
              >
                <div className="text-3xl font-bold text-foreground mb-1">$400B+</div>
                <p className="text-muted-foreground text-sm">medical debt in America</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Before/After Comparison Section */}
      <section className="py-24" style={{ background: 'linear-gradient(180deg, var(--card), var(--background))' }}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Kicker icon={Scale}>The Difference</Kicker>
            
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-6">
              Fighting medical bills alone vs. with GoldRock
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="luxury-card overflow-hidden"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="grid grid-cols-3 gap-4 p-6 bg-secondary border-b border-border">
                <div className="font-bold text-foreground">Challenge</div>
                <div className="font-bold text-muted-foreground flex items-center gap-2">
                  <X className="h-4 w-4" /> Without Help
                </div>
                <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <Check className="h-4 w-4" /> With GoldRock
                </div>
              </div>
              
              <div className="p-6">
                {comparisonData.map((row, index) => (
                  <ComparisonRow key={row.feature} {...row} delay={index * 0.08} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="text-center mb-16">
              <Kicker icon={BookOpen}>Our Story</Kicker>
              
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-6">
                Born from frustration. Built with purpose.
              </h2>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" />
              
              <div className="space-y-12">
                <motion.div 
                  className="md:pl-20 relative"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <div className="absolute left-6 top-0 w-4 h-4 rounded-full bg-gold hidden md:block" />
                  <div className="luxury-card p-8">
                    <Quote className="h-10 w-10 text-gold mb-4" />
                    <p className="text-xl text-muted-foreground leading-relaxed mb-4">
                      It started with a $47,000 emergency room bill—for a 3-hour visit. The charges made no sense. 
                      The "itemized bill" was incomprehensible. And every phone call led to a different answer.
                    </p>
                    <p className="text-muted-foreground">
                      After weeks of research, we discovered hidden billing codes, duplicate charges, and rates far above 
                      Medicare benchmarks. That one bill sparked a mission to help others navigate this broken system.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="md:pl-20 relative"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
                >
                  <div className="absolute left-6 top-0 w-4 h-4 rounded-full bg-gold hidden md:block" />
                  <div className="luxury-card p-8">
                    <p className="text-xl text-muted-foreground leading-relaxed mb-4">
                      We partnered with billing industry insiders, patient advocates, and healthcare policy experts. 
                      We learned how hospitals price services, how insurance companies negotiate, and where the leverage points really are.
                    </p>
                    <p className="text-muted-foreground">
                      Then we built AI to make that knowledge accessible to everyone—not just those who can afford 
                      expensive patient advocates or healthcare attorneys.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="md:pl-20 relative"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
                >
                  <div className="absolute left-6 top-0 w-4 h-4 rounded-full bg-gold hidden md:block" />
                  <div className="luxury-card p-8" style={{ borderLeft: '3px solid var(--gold)' }}>
                    <p className="text-xl text-muted-foreground leading-relaxed mb-4">
                      <strong className="text-gold">Today, GoldRock Health helps thousands of people</strong> understand 
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
      <section className="py-20 bg-card border-y border-border relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              The medical billing crisis in numbers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--background), var(--card))' }}>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Kicker icon={Star}>Our Values</Kicker>
            
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-6">
              What we stand for
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every decision we make is guided by these core principles.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <ValueCard key={value.title} {...value} delay={index * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-sm border border-border">
                <img 
                  src={teamImage} 
                  alt="GoldRock Health team" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
              </div>
            </motion.div>

            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Kicker icon={Users}>Our Team</Kicker>
              
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-6 leading-tight">
                Built by people who've been there
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                Our team brings together healthcare billing experts, patient advocates, technology innovators, 
                and—most importantly—people who have personally experienced the frustration of unfair medical bills.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: Brain, title: "Healthcare Billing Experts", desc: "Former billing department professionals who know where savings hide." },
                  { icon: HandHeart, title: "Patient Advocates", desc: "Professionals who have helped thousands navigate the healthcare system." },
                  { icon: Zap, title: "AI & Technology Innovators", desc: "Engineers building intelligent tools to automate bill analysis and advocacy." }
                ].map((item, index) => (
                  <motion.div 
                    key={item.title}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: EASE }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-secondary border border-border rounded-xl flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24" style={{ background: 'linear-gradient(180deg, var(--card), var(--background))' }}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Kicker icon={HelpCircle}>FAQ</Kicker>
            
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-6">
              Common questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about GoldRock Health
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="luxury-card p-8">
              {faqs.map((faq, index) => (
                <FAQItem 
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === index}
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--background), var(--card))' }}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Kicker icon={Sparkles}>Powerful Tools</Kicker>
              
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-6 leading-tight">
                Everything you need to fight back—in one platform
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                From AI bill analysis to letter templates, negotiation scripts to government program enrollment—GoldRock Health 
                puts the power of healthcare advocacy in your hands.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: FileText, title: "Bill Analysis" },
                  { icon: MessageSquare, title: "AI Coaching" },
                  { icon: Gavel, title: "Letter Templates" },
                  { icon: Calculator, title: "Savings Calculator" }
                ].map((item, index) => (
                  <motion.div 
                    key={item.title}
                    className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl shadow-sm"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <item.icon className="h-6 w-6 text-gold" />
                    <span className="font-medium text-foreground">{item.title}</span>
                  </motion.div>
                ))}
              </div>

              <Link href="/api/login">
                <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 rounded-full px-8 shadow-sm group">
                  Start For Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-sm border border-border">
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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto luxury-card p-12 md:p-16 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 mx-auto shadow-sm" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
                <Lock className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-6">
                Your privacy is sacred to us
              </h2>
              
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-10">
                Your medical information is deeply personal. We protect it with the same level of security 
                used by major financial institutions—and we <strong className="text-foreground">never</strong> sell or share your data.
              </p>
              
              <div className="flex flex-wrap justify-center gap-8">
                {[
                  { icon: Shield, label: "256-bit encryption" },
                  { icon: Lock, label: "HIPAA-conscious design" },
                  { icon: CheckCircle, label: "No data selling—ever" }
                ].map((item, index) => (
                  <motion.div 
                    key={item.label}
                    className="flex items-center gap-3 text-foreground"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: EASE }}
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-gold" />
                    </div>
                    <span>{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24" style={{ background: 'linear-gradient(180deg, var(--background), var(--card))' }}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-6">
              Ready to stop losing sleep over medical bills?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Join thousands of people who are taking control of their healthcare finances with GoldRock Health.
            </p>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
            >
              <Link href="/api/login">
                <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 rounded-full px-12 py-6 text-lg shadow-sm group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/collections-defense-guide">
                <Button variant="outline" size="lg" className="rounded-full px-12 py-6 text-lg border border-border hover:bg-secondary">
                  View Collections Guide
                </Button>
              </Link>
            </motion.div>
            
            <p className="mt-8 text-muted-foreground">
              Questions? Email us at <a href="mailto:CONTACT@GOLDROCK.ai" className="text-gold hover:text-gold font-medium">CONTACT@GOLDROCK.ai</a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border text-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold font-serif">GoldRock Health</span>
                <p className="text-muted-foreground text-sm">AI-Powered Healthcare Advocacy</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
              <Link href="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-gold transition-colors">Terms of Service</Link>
              <Link href="/support" className="hover:text-gold transition-colors">Support</Link>
              <a href="mailto:CONTACT@GOLDROCK.ai" className="hover:text-gold transition-colors font-medium">CONTACT@GOLDROCK.ai</a>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border text-center text-muted-foreground text-sm">
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
