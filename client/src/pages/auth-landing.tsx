import { LandingNavigation } from "@/components/landing-navigation";
import { 
  Apple, Mail, Sparkles, Shield, DollarSign, Zap, Brain, Heart, Lock, ArrowRight, Upload, FileCheck, 
  TrendingDown, Users, Star, CheckCircle, Clock, Award, BadgeCheck, ChevronRight, Eye, 
  MessageCircle, FileText, Target, Calculator, Code, UserCheck, Scale, Gavel, HandCoins,
  Receipt, Phone, Building, Network, AlertTriangle, TrendingUp, BarChart3, Percent,
  Briefcase, Database, Radar, ShieldCheck, Search, Book, Play, Crown, X, Check,
  ExternalLink, Timer, Calendar, Stethoscope, Pill, Crosshair, FileX, CreditCard,
  Wrench, Puzzle, ThumbsUp, Heart as HeartIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";

export default function AuthLanding() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <LandingNavigation />
      
      {/* HERO SECTION - GrantedHealth Style */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-24 pb-16">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/10 via-teal-400/10 to-cyan-400/10 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-gradient-to-br from-blue-400/10 via-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* App Icon */}
          <motion.div 
            className="relative mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-500 rounded-[2.75rem] flex items-center justify-center shadow-2xl"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          >
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-[2.75rem]" />
            <DollarSign className="w-12 h-12 text-white relative z-10" strokeWidth={2.5} />
          </motion.div>

          {/* Headline */}
          <motion.h1 
            className="text-5xl md:text-6xl font-black mb-6 leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-gray-900">Cut through the</span>
            <br />
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              medical bill chaos
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            AI analysis, expert coaching, and legal templates help you save thousands. Join 12,000+ users who've reduced their bills by 40-90%
          </motion.p>

          {/* Social Proof */}
          <motion.div
            className="flex items-center justify-center gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-bold text-gray-900">12,000+ Users</span>
            </div>
            <div className="w-px h-5 bg-gray-300" />
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm font-bold text-gray-900 ml-1.5">4.9 Rating</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <a
              href="/api/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              data-testid="button-get-started-hero"
            >
              <Sparkles className="h-5 w-5" />
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-900 font-bold rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-105"
              data-testid="button-learn-more-hero"
            >
              <Play className="h-5 w-5" />
              See How It Works
            </a>
          </motion.div>

          <motion.p
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            No credit card required • Free to analyze • 30-day money-back guarantee
          </motion.p>
        </div>
      </section>

      {/* QUICK PROCESS - 3 Steps */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50" data-testid="section-quick-process">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              3 simple steps to massive savings
            </h2>
            <p className="text-lg text-gray-700 font-medium">
              Start reducing your medical bills in under 5 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                icon: Upload,
                title: "Upload Your Bill",
                desc: "Take a photo or upload a PDF of your medical bill. Works with any provider, any state.",
                color: "from-blue-600 to-indigo-600"
              },
              {
                step: "2",
                icon: Brain,
                title: "AI Analyzes Everything",
                desc: "Our AI scans for billing errors, overcharges, and negotiation opportunities in seconds.",
                color: "from-purple-600 to-pink-600"
              },
              {
                step: "3",
                icon: FileCheck,
                title: "Get Professional Help",
                desc: "Receive dispute letters, negotiation scripts, and expert coaching to reduce your bill.",
                color: "from-emerald-600 to-teal-600"
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative"
                data-testid={`card-process-step-${step.step}`}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-4 shadow-md`}>
                  <step.icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-sm font-black text-white">{step.step}</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-700 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRY IT NOW - BLITZ DEMO */}
      <section className="py-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white" data-testid="section-blitz-demo">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4"
            >
              <Zap className="h-5 w-5 text-amber-300" />
              <span className="text-sm font-bold">Try Before You Commit</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Experience the power in 60 seconds
            </h2>
            <p className="text-xl text-blue-100 font-medium max-w-2xl mx-auto">
              Try our interactive Blitz Demo to see how AI finds billing errors instantly
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              data-testid="card-blitz-demo-info"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-900" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black">Blitz Demo</h3>
              </div>
              <p className="text-blue-100 mb-3">
                Interactive walkthrough with a sample $23,400 hospital bill. See AI analysis in action - no signup required.
              </p>
              <ul className="space-y-2 text-sm text-blue-100">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-300" strokeWidth={3} />
                  4-step guided demo
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-300" strokeWidth={3} />
                  Sample AI analysis results
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-300" strokeWidth={3} />
                  See potential $14K+ savings
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              data-testid="card-full-billai-info"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-400 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-emerald-900" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black">Full Bill-AI Analysis</h3>
              </div>
              <p className="text-blue-100 mb-3">
                Deep-dive AI analysis of YOUR actual medical bills with legal citations, dispute letters, and negotiation strategies.
              </p>
              <ul className="space-y-2 text-sm text-blue-100">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300" strokeWidth={3} />
                  Upload your real bills
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300" strokeWidth={3} />
                  Comprehensive error analysis
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300" strokeWidth={3} />
                  Legal dispute templates
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="text-center">
            <a
              href="/api/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              data-testid="button-try-blitz-demo"
            >
              <Play className="h-5 w-5" />
              Try Blitz Demo (Free)
              <ArrowRight className="h-5 w-5" />
            </a>
            <p className="text-blue-100 text-sm mt-3">
              No credit card • See results instantly • Then analyze your real bills
            </p>
          </div>
        </div>
      </section>

      {/* EASILY LOWER YOUR MEDICAL BILLS - GrantedHealth Style */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white" data-testid="section-how-we-help">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Easily lower your medical bills
            </h2>
            <p className="text-lg text-gray-700 font-medium max-w-2xl mx-auto">
              AI analyzes your bills, finds savings opportunities, and provides expert strategies to negotiate with hospitals
            </p>
          </div>

          {/* Checkmarked Benefits */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { label: "Billing errors", desc: "Catch duplicate charges, wrong CPT codes, and upcoding" },
              { label: "Early-pay discounts", desc: "Negotiate upfront payment reductions of 20-40%" },
              { label: "Insurance denials", desc: "Get professional appeal templates with 87-94% success rates" },
              { label: "Income-based discounts", desc: "Qualify for charity care and financial assistance programs" }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 bg-white rounded-xl p-5 border border-emerald-100 shadow-sm"
                data-testid={`card-benefit-${benefit.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{benefit.label}</h3>
                  <p className="text-gray-700">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="/api/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              data-testid="button-find-savings"
            >
              Find Savings
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE FEATURES SHOWCASE */}
      <section className="py-16 bg-white" id="how-it-works" data-testid="section-features">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Complete bill reduction toolkit
            </h2>
            <p className="text-lg text-gray-700 font-medium max-w-2xl mx-auto">
              Everything you need to fight medical bills and save thousands
            </p>
          </div>

          {/* Feature Categories */}
          <div className="space-y-12">
            {/* Core Features */}
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-6">Core Features</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: Brain, title: "AI Bill Analysis (Bill-AI)", desc: "Full deep-dive analysis with error detection and legal citations", savings: "$2K-$35K+", color: "from-purple-600 to-indigo-600" },
                  { icon: Zap, title: "Quick Analyzer", desc: "5-minute AI scan for instant overcharge detection", savings: "$500-$10K", color: "from-cyan-600 to-blue-600" },
                  { icon: UserCheck, title: "1-on-1 Reduction Coach", desc: "Personal expert guidance for complex cases", savings: "$5K-$50K+", color: "from-emerald-600 to-teal-600" },
                  { icon: FileText, title: "Dispute Arsenal (50+ Templates)", desc: "Legal letters with 87-94% success rates", savings: "$3K-$20K", color: "from-blue-600 to-cyan-600" },
                  { icon: BarChart3, title: "Analytics Dashboard", desc: "Track all bills, savings, and dispute progress", savings: "N/A", color: "from-indigo-600 to-purple-600" },
                  { icon: Database, title: "Resources Hub", desc: "Guides, best practices, and case studies", savings: "N/A", color: "from-teal-600 to-emerald-600" }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all"
                    data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-md`}>
                      <feature.icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-700 mb-3">{feature.desc}</p>
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full">
                      <DollarSign className="h-4 w-4 text-emerald-700" />
                      <span className="text-sm font-bold text-emerald-700">Avg: {feature.savings}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Intelligence & Strategy Tools */}
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-6">Intelligence & Strategy</h3>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { icon: Shield, title: "Insurance Denials Intel", desc: "Denial codes, reversal strategies", badge: "Premium" },
                  { icon: Building, title: "Industry Insights", desc: "Hospital billing vulnerabilities", badge: "Premium" },
                  { icon: Clock, title: "Timing & Strategy Guide", desc: "Best times to negotiate", badge: null },
                  { icon: Code, title: "Code Mastery", desc: "Decode CPT, ICD-10 billing", badge: null },
                  { icon: Scale, title: "Rights Hub", desc: "No Surprises Act, EMTALA", badge: null },
                  { icon: Target, title: "Negotiation Coaching", desc: "Proven scripts & tactics", badge: null },
                  { icon: FileText, title: "Templates Library", desc: "All dispute letter templates", badge: null },
                  { icon: Eye, title: "Portal Access Guide", desc: "Get bills before arrival", badge: null },
                  { icon: AlertTriangle, title: "Emergency Help", desc: "ER bill reduction tactics", badge: null },
                  { icon: Book, title: "Best Practices", desc: "Case studies & success stories", badge: null },
                  { icon: Receipt, title: "Bill Reduction Guide", desc: "Step-by-step strategies", badge: null },
                  { icon: Phone, title: "Provider Contacts", desc: "Direct billing department info", badge: null }
                ].map((tool, index) => (
                  <motion.div
                    key={tool.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all relative"
                    data-testid={`card-tool-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {tool.badge && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        {tool.badge}
                      </div>
                    )}
                    <tool.icon className="h-8 w-8 text-gray-700 mb-3" strokeWidth={2} />
                    <h5 className="font-bold text-gray-900 text-sm mb-1">{tool.title}</h5>
                    <p className="text-xs text-gray-600">{tool.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Advanced Premium Tools */}
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Crown className="h-7 w-7 text-amber-600" />
                Advanced Premium Tools
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: Crosshair, title: "Insurance Weakness Exploiter", desc: "Use their policies against them", savings: "$10K-$200K+" },
                  { icon: Gavel, title: "Board Pressure Tactics", desc: "Escalate to hospital executives", savings: "$15K-$100K+" },
                  { icon: Lock, title: "HIPAA Violation Challenger", desc: "Leverage privacy law violations", savings: "$15K-$250K+" },
                  { icon: Puzzle, title: "Policy Loophole Finder", desc: "Exploit coverage gaps", savings: "$25K-$500K+" },
                  { icon: Network, title: "Revenue Cycle Exploiter", desc: "Attack billing vulnerabilities", savings: "$20K-$150K+" },
                  { icon: HandCoins, title: "Charity Care Optimizer", desc: "Maximize financial assistance", savings: "$10K-$100K+" }
                ].map((tool, index) => (
                  <motion.div
                    key={tool.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200 shadow-md relative"
                    data-testid={`card-premium-tool-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      Premium
                    </div>
                    <tool.icon className="h-10 w-10 text-amber-700 mb-3" strokeWidth={2} />
                    <h4 className="text-lg font-black text-gray-900 mb-2">{tool.title}</h4>
                    <p className="text-gray-700 mb-3 text-sm">{tool.desc}</p>
                    <div className="inline-flex items-center gap-1.5 bg-emerald-100 px-3 py-1.5 rounded-full">
                      <DollarSign className="h-4 w-4 text-emerald-800" />
                      <span className="text-sm font-bold text-emerald-800">{tool.savings}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50" data-testid="section-testimonials">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Trusted by thousands
            </h2>
            <p className="text-lg text-gray-700 font-medium">
              Real stories from people who saved thousands on medical bills
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { quote: "I was so distraught when I got a surprise $65K bill. Your support relieved so much of my anxiety and stress. It felt reassuring knowing an expert had it under control.", name: "Jennifer", location: "PA", rating: 5 },
              { quote: "Someone really took over the situation and navigated it hassle free for me. I couldn't be happier", name: "Luke", location: "NY", rating: 5 },
              { quote: "I got reimbursed on the things that was initially rejected. Extremely helpful!", name: "Yuko", location: "MA", rating: 5 },
              { quote: "So helpful! Saved me money and hours on the phone. Absolutely fantastic resource.", name: "Melissa", location: "NY", rating: 5 }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md"
                data-testid={`card-testimonial-${testimonial.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed font-medium">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                  <ThumbsUp className="h-5 w-5 text-emerald-600" />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-full border border-emerald-200 shadow-md">
              <div className="flex items-center gap-1">
                <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
                <span className="text-2xl font-black text-gray-900">4.9</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">Rated Excellent</p>
                <p className="text-xs text-gray-600">Based on 1,000+ reviews</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* EXPERT CREDENTIALS */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white" data-testid="section-expert-credentials">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Powered by AI & Medical Billing Experts
          </h2>
          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto font-medium">
            Our platform combines cutting-edge AI technology with proven medical billing strategies from "Never Pay the First Bill" by Marshall Allen
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Brain, label: "AI-Powered Analysis", desc: "GPT-4 medical bill scanner", color: "from-purple-600 to-indigo-600" },
              { icon: Award, label: "Expert Strategies", desc: "Marshall Allen's proven tactics", color: "from-emerald-600 to-teal-600" },
              { icon: ShieldCheck, label: "Legal Templates", desc: "87-94% success rates", color: "from-blue-600 to-cyan-600" }
            ].map((credential, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md"
                data-testid={`card-credential-${credential.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${credential.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md`}>
                  <credential.icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-gray-900 mb-2">{credential.label}</h3>
                <p className="text-sm text-gray-600">{credential.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-full border border-blue-200 shadow-sm" data-testid="badge-encryption">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-bold text-gray-800">Bank-Level Encryption</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-full border border-emerald-200 shadow-sm" data-testid="badge-privacy">
              <Lock className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-bold text-gray-800">Private & Secure</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-full border border-purple-200 shadow-sm" data-testid="badge-data-ownership">
              <Eye className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-bold text-gray-800">You Own Your Data</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 bg-white" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-700 font-medium">
              Everything you need to know about GoldRock Health
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does GoldRock Health work?",
                a: "Upload your medical bill and our AI analyzes it for billing errors, overcharges, and negotiation opportunities. You'll receive a detailed analysis, legal dispute templates, and expert negotiation strategies to reduce your bill by 40-90%."
              },
              {
                q: "How much can I save on my medical bills?",
                a: "Users typically report savings between $2,000-$35,000+ depending on their bill size. Our AI identifies billing errors, coding mistakes, and negotiation opportunities that most people miss."
              },
              {
                q: "Is my health information private and secure?",
                a: "Yes. We use bank-level encryption to protect your data. You own your data completely and can delete it at any time. We never share or sell your information."
              },
              {
                q: "Do I need insurance to use GoldRock Health?",
                a: "No! GoldRock Health works for everyone - with or without insurance. We help reduce bills from hospitals, urgent care, labs, and more. Our strategies work for both insured and uninsured patients."
              },
              {
                q: "What's included in the Premium plan?",
                a: "Premium includes unlimited bill analyses, AI error detection, 50+ legal dispute letter templates with citations, industry insider tactics, expert negotiation coaching, and Medicare rate comparisons. Most users save 10-100x the subscription cost on a single bill."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes! Cancel your Premium subscription anytime with no penalties. We also offer a full refund within 30 days if you're not satisfied with the platform."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                data-testid={`card-faq-${index + 1}`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left p-6 flex items-center justify-between"
                  data-testid={`button-faq-toggle-${index + 1}`}
                >
                  <h3 className="font-black text-gray-900 pr-4">{faq.q}</h3>
                  <ChevronRight className={`h-5 w-5 text-gray-500 transition-transform ${activeFaq === index ? 'rotate-90' : ''}`} />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING CTA */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50" data-testid="section-pricing">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 border-2 border-amber-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Crown className="h-8 w-8 text-white" strokeWidth={3} />
                </div>
              </div>

              <h3 className="text-3xl md:text-4xl font-black text-center bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent mb-4">
                Premium Access
              </h3>
              
              <p className="text-center text-gray-700 font-semibold mb-6 text-lg max-w-2xl mx-auto">
                Full AI analysis, 50+ dispute templates, expert coaching & insider tactics
              </p>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-amber-200">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl font-black text-gray-900">$29.99</span>
                  <span className="text-xl text-gray-600 font-semibold">/month</span>
                </div>
                <div className="text-center text-emerald-700 font-bold flex items-center justify-center gap-1">
                  <BadgeCheck className="h-5 w-5" />
                  Save $2,000-$35,000+ on bills
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mb-8">
                {[
                  "Unlimited bill analyses",
                  "AI error detection scanner",
                  "50+ legal dispute templates",
                  "Industry insider tactics",
                  "Expert negotiation coaching",
                  "Medicare rate comparisons"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <a
                  href="/api/login"
                  className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  data-testid="button-upgrade-premium"
                >
                  <Crown className="h-6 w-6" />
                  Upgrade to Premium
                  <Sparkles className="h-6 w-6" />
                </a>
                <p className="text-sm text-gray-600 mt-4 font-medium">
                  Cancel anytime • Full refund within 30 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white" data-testid="section-final-cta">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Ready to Save Thousands?
          </h2>
          <p className="text-xl text-gray-700 font-semibold mb-8 max-w-2xl mx-auto">
            Join 12,000+ users who've reduced their medical bills by 40-90%
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/api/login"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              data-testid="button-start-analysis-final"
            >
              <Zap className="h-6 w-6" />
              Start Free Bill Analysis
              <ArrowRight className="h-6 w-6" />
            </a>
          </div>

          <p className="text-gray-500 mt-6 font-medium">
            🔒 Private & Secure • ⚡ AI-Powered • ⚖️ Legal Templates
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <span className="font-black text-xl">GoldRock Health</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered medical bill reduction platform helping thousands save on healthcare costs.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#how-it-works" className="hover:text-white transition" data-testid="link-footer-how-it-works">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition" data-testid="link-footer-features">Features</a></li>
                <li><a href="#" className="hover:text-white transition" data-testid="link-footer-pricing">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/support" className="hover:text-white transition" data-testid="link-footer-support">Support</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition" data-testid="link-footer-privacy">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white transition" data-testid="link-footer-terms">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/important-disclaimer" className="hover:text-white transition" data-testid="link-footer-disclaimer">Disclaimer</Link></li>
                <li><a href="#" className="hover:text-white transition" data-testid="link-footer-compliance">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 GoldRock Health (Eldest AI LLC dba GoldRock AI). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
