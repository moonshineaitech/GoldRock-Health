import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { useState, useRef, useEffect } from "react";
import {
  Target, CheckCircle, Briefcase, ArrowLeft, Send, ArrowRight,
  TrendingUp, Building2, Users, DollarSign, Shield, Layers,
  Globe, BarChart3, Zap, Code, Mail, Lightbulb, BookOpen,
  Sparkles, FileText, Lock, X, Heart, Cpu, CircleDot
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SEOHead } from "@/components/seo-head";
import { MedicalChatbot } from "@/components/medical-chatbot";
import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useToast } from "@/hooks/use-toast";
import vcHero from "@assets/images/vc-hero.jpg";
import platformDemo from "@assets/images/platform-demo.jpg";

function ContactForm() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", firm: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 800));
    toast({ title: "Request received", description: "We'll send data room access within 24 hours." });
    setForm({ name: "", email: "", firm: "", message: "" });
    setSending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-gray-600 dark:text-gray-400 text-sm">Name</Label>
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" />
        </div>
        <div>
          <Label className="text-gray-600 dark:text-gray-400 text-sm">Email</Label>
          <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" />
        </div>
      </div>
      <div>
        <Label className="text-gray-600 dark:text-gray-400 text-sm">Firm</Label>
        <Input value={form.firm} onChange={e => setForm({ ...form, firm: e.target.value })} className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" />
      </div>
      <div>
        <Label className="text-gray-600 dark:text-gray-400 text-sm">Message</Label>
        <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="I'd like to learn more about the investment opportunity..." rows={3} className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" />
      </div>
      <Button type="submit" disabled={sending} className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-base font-semibold">
        <Send className="w-4 h-4 mr-2" />{sending ? "Sending..." : "Request Data Room Access"}
      </Button>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Or email: CONTACT@GOLDROCK.ai</p>
    </form>
  );
}

const investmentThesis = [
  {
    title: "Massive, Underserved Market",
    description: "Americans pay hundreds of billions out of pocket for healthcare annually. Medical billing errors are widespread, and the vast majority of denied claims are never appealed. This isn't a niche - it's a category waiting to be built.",
    icon: Globe,
  },
  {
    title: "Regulatory Tailwinds",
    description: "CMS price transparency rules, the No Surprises Act, and growing state-level consumer protection laws are all pushing healthcare toward transparency. We're building the tools that make transparency actionable.",
    icon: Shield,
  },
  {
    title: "AI-First Architecture",
    description: "Purpose-built models for medical billing analysis - not generic LLMs with a healthcare wrapper. Our AI grader scores bills, identifies errors, generates dispute letters, and improves with every interaction.",
    icon: Sparkles,
  },
  {
    title: "Multiple Revenue Streams",
    description: "B2C subscriptions for individuals, B2B licensing for employers and insurers, Partner API for technology platforms, and white-label solutions for health systems. Revenue diversification from day one.",
    icon: Layers,
  },
  {
    title: "Defensible Data Moat",
    description: "Every bill analyzed improves our pricing benchmarks. Every dispute outcome refines our recommendation engine. As the dataset grows, the product gets better and the moat deepens.",
    icon: Lock,
  },
  {
    title: "Clear Go-to-Market",
    description: "Direct-to-consumer for brand building and product validation. B2B through benefits brokers, HRIS platforms, and insurance carriers for scalable distribution. Enterprise API for embedded partnerships.",
    icon: Target,
  },
];

const productHighlights = [
  {
    title: "AI Bill Grader",
    description: "Scores medical bills on fairness, coding accuracy, and overcharge risk. Gives patients a clear picture of whether they're being billed fairly.",
  },
  {
    title: "Collections Defense Playbook",
    description: "34+ real-world scenario playbooks covering debt validation, FDCPA violations, statute of limitations, pay-for-delete strategies, and more. Most comprehensive resource in the market.",
  },
  {
    title: "Dispute & Negotiation Engine",
    description: "Generates customized dispute letters and negotiation scripts based on specific bill details, state regulations, and applicable consumer protection laws.",
  },
  {
    title: "Document Vault",
    description: "Encrypted document storage for medical bills, EOBs, insurance letters, and dispute correspondence. End-to-end encryption with authenticated-only access.",
  },
  {
    title: "Partner API",
    description: "Production-ready API for embedding bill analysis into third-party applications. HMAC authentication, rate limiting, quota management. Multiple B2B customers live.",
  },
  {
    title: "Employer Dashboard",
    description: "Aggregate analytics for employer clients. Usage metrics, engagement rates, and savings data. Privacy-preserving - no individual employee data exposed.",
  },
];

const useOfFunds = [
  { category: "Product & Engineering", allocation: "40%", description: "AI model improvement, mobile apps, enterprise features, API expansion" },
  { category: "Go-to-Market", allocation: "30%", description: "B2B sales team, broker channel partnerships, content marketing, conference presence" },
  { category: "Operations & Compliance", allocation: "15%", description: "HIPAA/SOC2 compliance, legal, customer success infrastructure" },
  { category: "General & Administrative", allocation: "15%", description: "Team growth, office, insurance, working capital" },
];

const whyNow = [
  {
    title: "Post-Pandemic Financial Pressure",
    description: "COVID created unprecedented medical debt. Tens of millions of Americans now carry medical debt. The need for billing advocacy has never been higher."
  },
  {
    title: "AI Maturity for Healthcare",
    description: "Large language models have reached the capability threshold needed for reliable medical billing analysis. Two years ago, this wasn't possible at production quality."
  },
  {
    title: "Employer Demand",
    description: "Financial wellness is the fastest-growing benefit category. Employers are actively seeking specific, actionable tools - not generic wellness programs."
  },
  {
    title: "Regulatory Momentum",
    description: "Federal and state regulations are expanding consumer rights in healthcare billing. Each new rule creates demand for tools that help people exercise those rights."
  },
];

const milestones = [
  { label: "AI Bill Grader Launched", icon: Sparkles },
  { label: "Collections Defense (34+ Scenarios)", icon: Shield },
  { label: "Partner API Live", icon: Code },
  { label: "Document Vault", icon: Lock },
  { label: "Employer Dashboard", icon: BarChart3 },
  { label: "Mobile App", icon: Zap },
];

const marketSegments = [
  { label: "Patients", desc: "B2C subscriptions, bill analysis, dispute tools", icon: Heart, color: "from-purple-500 to-purple-600" },
  { label: "Employers", desc: "Employee benefit, $3-$6/emp/mo tiers", icon: Building2, color: "from-violet-500 to-violet-600" },
  { label: "Insurers", desc: "White-label member services, reduces disputes", icon: Shield, color: "from-indigo-500 to-indigo-600" },
  { label: "Providers", desc: "Patient financial clarity, reduces bad debt", icon: Users, color: "from-fuchsia-500 to-fuchsia-600" },
];

function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 30% 50%, rgba(168,85,247,0.3) 0%, transparent 60%)",
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 70% 30%, rgba(139,92,246,0.2) 0%, transparent 50%)",
        }}
        animate={{ opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function FloatingBadge({ text, delay, x, y }: { text: string; delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute hidden md:block"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale: { delay, duration: 0.5 },
        y: { delay: delay + 0.5, duration: 3, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white text-sm font-medium shadow-lg">
        {text}
      </div>
    </motion.div>
  );
}

function DonutChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const segments = [
    { percent: 40, color: "#9333ea", label: "Product & Engineering" },
    { percent: 30, color: "#7c3aed", label: "Go-to-Market" },
    { percent: 15, color: "#a855f7", label: "Operations & Compliance" },
    { percent: 15, color: "#c084fc", label: "General & Administrative" },
  ];

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative w-56 h-56">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          {segments.map((seg, i) => {
            const offset = (cumulativePercent / 100) * circumference;
            const length = (seg.percent / 100) * circumference;
            cumulativePercent += seg.percent;
            return (
              <motion.circle
                key={i}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="24"
                strokeLinecap="round"
                strokeDasharray={`${length - 4} ${circumference - length + 4}`}
                strokeDashoffset={-offset}
                initial={{ opacity: 0, strokeDasharray: `0 ${circumference}` }}
                animate={isInView ? { opacity: 1, strokeDasharray: `${length - 4} ${circumference - length + 4}` } : {}}
                transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Allocation</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">100%</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-sm">
        {segments.map((seg, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <div>
              <p className="text-xs font-medium text-gray-900 dark:text-white">{seg.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{seg.percent}%</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      className="mb-10"
    >
      <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 tracking-widest uppercase mb-2">{eyebrow}</p>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h2>
      {subtitle && <p className="text-base text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">{subtitle}</p>}
    </motion.div>
  );
}

export default function ForVCs() {
  return (
    <>
      <SEOHead
        title="For Investors | GoldRock Health"
        description="Investment opportunity in AI-powered healthcare cost intelligence. Building the transparency layer for the $4.5T healthcare market."
        keywords={["healthtech investment", "healthcare AI startup", "medical billing technology investment"]}
        canonicalPath="/for-vcs"
      />

      <MobileHeader title="For Investors" />

      <div className="min-h-screen bg-white dark:bg-gray-950">

        {/* Hero Section */}
        <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={vcHero} alt="Investors discussing healthcare technology opportunities" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-950/90 via-purple-900/85 to-indigo-950/90" />
          </div>
          <AnimatedGrid />

          <FloatingBadge text="AI-First Platform" delay={0.8} x="65%" y="15%" />
          <FloatingBadge text="Multi-Revenue Model" delay={1.2} x="70%" y="55%" />
          <FloatingBadge text="Production-Ready" delay={1.6} x="60%" y="75%" />

          <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-20 pt-28 md:pt-20">
            <Link href="/enterprise" className="inline-flex items-center text-sm text-white/60 hover:text-white/90 mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Enterprise Solutions
            </Link>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30 mb-6 text-xs px-3 py-1">
                For Investors
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.05] tracking-tight max-w-4xl">
                Healthcare billing is a{" "}
                <span className="bg-gradient-to-r from-purple-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                  multi-trillion-dollar market
                </span>
                <br />with no intelligence layer.
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-4 max-w-2xl">
                We're building it. AI-powered tools that help patients, employers, and insurers understand,
                negotiate, and resolve medical bills. Real product, real users, real revenue opportunity.
              </p>
              <p className="text-sm text-white/50 mb-10 max-w-2xl">
                We're raising to accelerate go-to-market and expand our B2B distribution.
                We're looking for partners who understand healthcare and can open doors.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="mailto:CONTACT@GOLDROCK.ai">
                  <Button size="lg" className="bg-white text-purple-900 hover:bg-white/90 h-13 px-8 text-base font-semibold shadow-xl shadow-purple-950/30">
                    <Mail className="mr-2 h-5 w-5" /> Request Data Room
                  </Button>
                </a>
                <Link href="/enterprise">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-13 px-8 text-base">
                    See the Platform <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
        </section>

        {/* Investment Thesis */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-20">
          <SectionHeading eyebrow="Investment Thesis" title="Six reasons this is the right bet" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentThesis.map((thesis, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="h-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100 dark:hover:shadow-purple-950/30 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <thesis.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2">{thesis.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{thesis.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Market Opportunity */}
        <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950 py-20">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <SectionHeading
              eyebrow="Market Opportunity"
              title="The $4.5T healthcare market — four entry points"
              subtitle="GoldRock addresses every stakeholder in the healthcare billing ecosystem"
            />
            <div className="relative">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {marketSegments.map((seg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.12 }}
                  >
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                      <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 h-full">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${seg.color} flex items-center justify-center mb-4 shadow-lg`}>
                          <seg.icon className="w-7 h-7 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{seg.label}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{seg.desc}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Active channel</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-10 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="inline-flex items-center gap-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-full px-6 py-3">
                  <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                    Coverage across all 50 states — state-specific regulations built in
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Now */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-20">
          <SectionHeading
            eyebrow="Timing"
            title="Why now"
            subtitle="Four forces converging to create this opportunity"
          />
          <div className="grid md:grid-cols-2 gap-5">
            {whyNow.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start gap-5 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 transition-colors h-full">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-200 dark:shadow-purple-950/50">
                    <span className="text-sm font-bold text-white">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1.5">{item.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Product Screenshot */}
        <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950 py-20 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <SectionHeading
              eyebrow="Product"
              title="What we've built"
              subtitle="Production features, not mockups"
            />
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="relative mx-auto max-w-4xl"
              >
                <div className="rounded-xl overflow-hidden shadow-2xl shadow-purple-200/50 dark:shadow-purple-950/50 border border-gray-200 dark:border-gray-700">
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-white dark:bg-gray-700 rounded-md px-3 py-1 text-xs text-gray-400 dark:text-gray-500 font-mono">
                        goldrock.ai/dashboard
                      </div>
                    </div>
                  </div>
                  <img src={platformDemo} alt="GoldRock Platform" className="w-full" />
                </div>

                <motion.div
                  className="absolute -right-4 md:right-4 top-20 md:top-16"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-xl p-4 shadow-xl max-w-[200px]">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
                    <p className="text-xs font-bold text-gray-900 dark:text-white">AI Bill Grader</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Fairness scoring, coding accuracy, overcharge detection</p>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -left-4 md:left-4 bottom-16 md:bottom-20"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-xl p-4 shadow-xl max-w-[200px]">
                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
                    <p className="text-xs font-bold text-gray-900 dark:text-white">34+ Defense Scenarios</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Collections defense playbooks covering every situation</p>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute right-8 md:right-20 bottom-4 md:bottom-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-xl p-4 shadow-xl max-w-[200px]">
                    <Code className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
                    <p className="text-xs font-bold text-gray-900 dark:text-white">Partner API</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">HMAC auth, rate limiting, production-ready</p>
                  </div>
                </motion.div>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
                {productHighlights.map((product, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 h-full hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1.5">{product.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link href="/">
                  <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-400 dark:hover:border-purple-600">
                    Try the Product <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Milestones Timeline */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-20">
          <SectionHeading
            eyebrow="Milestones"
            title="Product development timeline"
            subtitle="Shipped features — not vanity metrics"
          />
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200 dark:from-purple-800 dark:via-purple-600 dark:to-purple-800" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center text-center relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.12 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-3 shadow-lg shadow-purple-200 dark:shadow-purple-950/50 relative z-10">
                    <m.icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">{m.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use of Funds with Donut Chart */}
        <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950 py-20">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <SectionHeading eyebrow="Capital Allocation" title="Use of funds" />
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <DonutChart />
              <div className="space-y-5">
                {useOfFunds.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">{item.allocation}</span>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.category}</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Competitive Positioning */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-20">
          <SectionHeading
            eyebrow="Positioning"
            title="Why existing solutions fall short"
            subtitle="GoldRock occupies a unique position in the market"
          />
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { label: "Generic EAPs", tag: "Not an EAP", problem: "Broad, unfocused wellness programs with low engagement and no billing expertise", icon: X, accent: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900" },
              { label: "Billing Services", tag: "Not a billing service", problem: "Expensive professional advocates charging percentage fees with slow turnaround", icon: X, accent: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900" },
              { label: "Simple Chatbots", tag: "Not a chatbot", problem: "Shallow AI wrappers without domain depth, state-specific knowledge, or action capabilities", icon: X, accent: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900" },
              { label: "GoldRock", tag: "The intelligence layer", problem: "AI-powered, state-specific, comprehensive platform. Analyzes bills, generates disputes, defends against collections, and serves every stakeholder.", icon: CheckCircle, accent: "bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`rounded-2xl p-5 border h-full ${item.accent} ${i === 3 ? "ring-2 ring-purple-400 dark:ring-purple-600" : ""}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${i === 3 ? "bg-purple-600" : "bg-red-100 dark:bg-red-900/30"}`}>
                    <item.icon className={`w-5 h-5 ${i === 3 ? "text-white" : "text-red-500 dark:text-red-400"}`} />
                  </div>
                  <Badge className={`mb-2 text-[10px] ${i === 3 ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"}`}>
                    {item.tag}
                  </Badge>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mt-2 mb-1.5">{item.label}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{item.problem}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* B2B Distribution */}
        <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950 py-20">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <SectionHeading
              eyebrow="Distribution"
              title="B2B distribution strategy"
              subtitle="Multiple paths to enterprise revenue"
            />
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Employers",
                  desc: "Offer as employee benefit via HR/benefits platforms and broker channel. Starter at $3/emp/mo, Pro at $6/emp/mo.",
                  icon: Building2,
                  href: "/for-employers"
                },
                {
                  title: "Insurance Companies",
                  desc: "White-label for member services. Reduces claims disputes and improves satisfaction. License or strategic investment.",
                  icon: Shield,
                  href: "/for-insurance"
                },
                {
                  title: "Healthcare Providers",
                  desc: "Patient financial clarity tools. Reduces bad debt and billing disputes. Improves transparency compliance.",
                  icon: Users,
                  href: "/for-healthcare"
                },
              ].map((ch, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={ch.href}>
                    <Card className="h-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-xl hover:shadow-purple-100 dark:hover:shadow-purple-950/30 transition-all duration-300 cursor-pointer group hover:border-purple-300 dark:hover:border-purple-700">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-200 dark:shadow-purple-950/50">
                          <ch.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-gray-900 dark:text-white">{ch.title}</h4>
                          <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-auto group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{ch.desc}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What We're Looking For */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-20">
          <SectionHeading
            eyebrow="Partnership"
            title="What we're looking for in partners"
            subtitle="Beyond capital"
          />
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: "Healthcare Domain Expertise", desc: "Investors who understand the complexities of healthcare billing, insurance dynamics, and regulatory landscape.", icon: BookOpen },
              { title: "Distribution Relationships", desc: "Connections to employers, benefits brokers, insurance carriers, and health systems who could become customers or partners.", icon: Globe },
              { title: "Enterprise Sales Experience", desc: "Experience helping portfolio companies build B2B sales motions, navigate procurement processes, and close enterprise deals.", icon: Briefcase },
              { title: "Patient-First Values", desc: "Alignment with our mission to make healthcare billing fair and transparent. This is a company that does well by doing good.", icon: Heart },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 transition-colors h-full">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Banner + Contact Form */}
        <section className="relative overflow-hidden">
          <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-16 px-4 md:px-8">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="ctaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ctaGrid)" />
              </svg>
            </div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-purple-300 text-sm font-semibold tracking-widest uppercase mb-4">The Opportunity</p>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
                  The intelligence layer healthcare billing has been waiting for.
                </h2>
                <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto">
                  Let's build the future of healthcare cost transparency together.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-4 md:px-8 -mt-0 pb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-2xl shadow-purple-200/30 dark:shadow-purple-950/50 -mt-10 relative z-10">
                <CardContent className="p-8 md:p-10">
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200 dark:shadow-purple-950/50">
                      <Briefcase className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Request Data Room Access</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Get access to our financial model, product roadmap, and customer data. We'll set up a founder meeting within 48 hours.
                    </p>
                  </div>
                  <ContactForm />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

      </div>

      <MedicalChatbot />
      <MobileBottomNav />
    </>
  );
}