import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import {
  Shield, CheckCircle, ArrowRight, ArrowLeft, Send, Mail,
  TrendingDown, Users, BarChart3, Zap, Lock, Eye, FileText,
  Layers, Building2, Globe, Target, Briefcase, AlertTriangle,
  ChevronDown, ChevronUp, Phone, Upload, Brain, ClipboardCheck,
  Server, Database, Cpu, Activity, HeartHandshake, Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SEOHead } from "@/components/seo-head";
import { MedicalChatbot } from "@/components/medical-chatbot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useToast } from "@/hooks/use-toast";
import insuranceHero from "@assets/images/insurance-hero.jpg";

function ContactForm({ context }: { context: string }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 800));
    toast({ title: "Received", description: "We'll respond within one business day." });
    setForm({ name: "", email: "", company: "", role: "", message: "" });
    setSending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-muted-foreground text-sm">Name</Label>
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="bg-card border-border" />
        </div>
        <div>
          <Label className="text-muted-foreground text-sm">Work Email</Label>
          <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="bg-card border-border" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-muted-foreground text-sm">Organization</Label>
          <Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="bg-card border-border" />
        </div>
        <div>
          <Label className="text-muted-foreground text-sm">Your Role</Label>
          <Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g., VP of Product" className="bg-card border-border" />
        </div>
      </div>
      <div>
        <Label className="text-muted-foreground text-sm">Message</Label>
        <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder={`I'm interested in ${context}...`} rows={3} className="bg-card border-border" />
      </div>
      <Button type="submit" disabled={sending} className="w-full bg-primary text-primary-foreground">
        <Send className="w-4 h-4 mr-2" />{sending ? "Sending..." : "Start Confidential Discussion"}
      </Button>
      <p className="text-xs text-muted-foreground text-center">Or email: CONTACT@GOLDROCK.ai — NDA available on request</p>
    </form>
  );
}

function ExpandSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 hover:bg-secondary transition-colors text-left">
        <span className="text-sm font-medium text-foreground">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{children}</div>}
    </div>
  );
}

const licenseCapabilities = [
  {
    icon: Eye,
    title: "Bill Transparency Engine",
    description: "White-label AI tool that helps members understand every line item on their medical bills. Plain-language explanations, fair-price comparisons, and actionable next steps.",
    value: "Fewer confused calls to your service center"
  },
  {
    icon: FileText,
    title: "Dispute & Appeal Automation",
    description: "Generate member-ready dispute letters, appeal documents, and negotiation scripts based on specific billing details and applicable regulations.",
    value: "Members resolve issues without escalation"
  },
  {
    icon: BarChart3,
    title: "Claims Accuracy Monitoring",
    description: "Identify billing errors, coding discrepancies, and overcharges before they become costly disputes. Catches issues in the pre-payment window.",
    value: "Reduced claims spend"
  },
  {
    icon: Shield,
    title: "Collections Defense Library",
    description: "34+ scenario playbooks covering debt validation, FDCPA rights, statute of limitations, and pay-for-delete strategies. Keep members out of financial crisis.",
    value: "Member financial protection"
  },
  {
    icon: Layers,
    title: "API Integration",
    description: "RESTful API lets you embed bill analysis directly in your member portal, mobile app, or care management platform. HMAC-authenticated and rate-limited.",
    value: "Seamless member experience"
  },
  {
    icon: Lock,
    title: "Privacy Architecture",
    description: "All data encrypted in transit and at rest. Member information stays within your ecosystem. Designed with HIPAA considerations. BAAs available.",
    value: "Compliance-ready deployment"
  }
];

const acquisitionReasons = [
  {
    title: "Defensive Positioning",
    description: "Medical bill transparency tools are becoming table stakes. Acquiring purpose-built technology is faster than building from scratch, and prevents competitors from getting there first.",
  },
  {
    title: "Technology & Data Assets",
    description: "Production AI models for billing analysis, pricing benchmarks across procedures and geographies, dispute outcome patterns. Years of development compressed into an acquisition.",
  },
  {
    title: "Built-In Distribution",
    description: "Existing user base with engagement data and feedback loops. Integration into your member base creates immediate value from day one.",
  },
  {
    title: "Team & Domain Expertise",
    description: "Engineers and product people who understand both healthcare billing complexity and consumer experience design. Hard to recruit, expensive to train.",
  },
];

const investmentBenefits = [
  {
    title: "Strategic Co-Development",
    description: "Influence the product roadmap to prioritize features that serve your specific member needs. Build what your competitors can't buy.",
  },
  {
    title: "Distribution Partnership",
    description: "Offer GoldRock as a differentiated member benefit. Employers see it as added value in your plan offerings. Creates stickier relationships.",
  },
  {
    title: "Market Intelligence",
    description: "Gain visibility into billing patterns, dispute trends, and member financial behavior across your portfolio. Data-driven decisions for plan design.",
  },
  {
    title: "Financial Returns",
    description: "Healthcare transparency is a growing regulatory mandate. Investing now captures the tailwind of CMS transparency rules and consumer demand.",
  },
];

const insurerPainPoints = [
  {
    problem: "Rising claims disputes and appeals",
    impact: "Each formal appeal carries significant administrative cost to process. Volume is growing as members become more aware of billing errors.",
    solution: "Pre-payment bill analysis catches errors before they become disputes. Members resolve issues through self-service tools."
  },
  {
    problem: "Member satisfaction & retention",
    impact: "Healthcare billing confusion is the #1 driver of NPS detractors for health plans. Members blame insurers even for provider billing errors.",
    solution: "Give members tools that actually help them. Bill clarity reduces frustration and builds trust in the plan."
  },
  {
    problem: "Price transparency compliance",
    impact: "CMS transparency regulations are expanding. Members expect pricing information before, during, and after care.",
    solution: "Our pricing benchmarks and bill analysis tools help you meet both the letter and spirit of transparency requirements."
  },
  {
    problem: "Employer client retention",
    impact: "Employers shop health plans every renewal cycle. You need differentiation beyond network size and premiums.",
    solution: "GoldRock as a member benefit gives employers a tangible reason to stay. Their employees are getting concrete financial help."
  },
];

const journeySteps = [
  { icon: FileText, label: "Member Receives Bill", desc: "Complex billing statement arrives" },
  { icon: Upload, label: "Uploads to Portal", desc: "Simple photo or PDF upload" },
  { icon: Brain, label: "AI Analysis", desc: "Instant line-item breakdown" },
  { icon: ClipboardCheck, label: "Clear Explanation + Action Steps", desc: "Plain-language results & next steps" },
];

const architectureNodes = [
  { icon: Globe, label: "Your Member Portal", position: "left" },
  { icon: Server, label: "GoldRock API", position: "center-left" },
  { icon: Cpu, label: "AI Engine", position: "center-right" },
  { icon: Database, label: "Pricing Database", position: "right" },
];

const impactCards = [
  { icon: Phone, label: "Fewer Service Calls", desc: "Members self-serve billing questions" },
  { icon: TrendingDown, label: "Lower Dispute Volume", desc: "Errors caught before escalation" },
  { icon: Star, label: "Higher Member NPS", desc: "Billing clarity builds trust" },
  { icon: HeartHandshake, label: "Employer Retention", desc: "Tangible benefit for employer clients" },
];

const deploymentTimeline = [
  { week: "Week 1", label: "API Setup", desc: "Connect endpoints & authentication" },
  { week: "Week 2", label: "Brand Customization", desc: "Your brand, your colors, your voice" },
  { week: "Week 3", label: "Testing", desc: "QA, load testing & compliance review" },
  { week: "Week 4", label: "Member Launch", desc: "Go live with full member access" },
];

export default function ForInsurance() {
  return (
    <>
      <SEOHead
        title="For Insurance Companies | GoldRock Health"
        description="License AI-powered medical bill analysis for your members. Reduce claims disputes, improve satisfaction, and differentiate your plans through transparent billing tools."
        keywords={["insurance technology partnership", "claims management AI", "member experience tools", "health plan innovation"]}
        canonicalPath="/for-insurance"
      />

      <MobileHeader title="For Insurance Companies" />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--background), var(--card))' }}>
          <div className="max-w-6xl mx-auto px-4 pt-14 pb-16 md:pb-20 relative z-10">
            <Link href="/enterprise" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="w-4 h-4 mr-1" /> Enterprise Solutions
            </Link>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase mb-4">For Insurance Companies</p>
                <h1 className="text-3xl md:text-5xl lg:text-[3.25rem] font-serif font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
                  Your members are drowning<br className="hidden md:block" /> in confusing medical bills.
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                  They call your service center. They file disputes. They blame you for billing errors that aren't even yours.
                  What if you could give them tools that actually help — and reduce your costs in the process?
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  <a href="mailto:CONTACT@GOLDROCK.ai">
                    <Button size="lg" className="bg-primary text-primary-foreground h-12 px-7 text-base shadow-sm">
                      <Mail className="mr-2 h-4 w-4" /> Confidential Discussion
                    </Button>
                  </a>
                  <Link href="/partner-api">
                    <Button size="lg" variant="outline" className="border-border h-12 px-7 text-base hover:bg-secondary">
                      Explore API <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["White-Label Ready", "API Integration", "HIPAA-Ready"].map((badge, i) => (
                    <motion.div
                      key={badge}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Badge className="bg-card text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700 shadow-sm px-3 py-1.5 text-xs font-medium">
                        <CheckCircle className="w-3 h-3 mr-1.5" />
                        {badge}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative hidden lg:block"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
                  <img
                    src={insuranceHero}
                    alt="Healthcare coverage and member support"
                    className="w-full h-[420px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white/90 text-sm font-medium">Empowering members with billing clarity</p>
                    <p className="text-white/70 text-xs mt-1">AI-powered transparency for modern health plans</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 pb-24 space-y-20">

          {/* Impact Visualization */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="pt-16"
          >
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase mb-3">Member Impact</p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">Measurable outcomes for your organization</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">Give your members the tools they need, and see the results across your entire operation.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {impactCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="relative group rounded-2xl p-6 bg-card border border-border text-foreground shadow-sm hover:shadow-md transition-all duration-300 h-full">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
                      <card.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-base mb-1 text-foreground">{card.label}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Pain Points Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 tracking-widest uppercase mb-3">Challenges</p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">The Problems You're Dealing With</h2>
              <p className="text-sm text-muted-foreground">Sound familiar?</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {insurerPainPoints.map((pp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="h-full bg-card border-border hover:shadow-lg hover:shadow-amber-500/5 dark:hover:shadow-amber-500/5 transition-all duration-300 group hover:border-amber-200 dark:hover:border-amber-700/50">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 transition-colors">
                          <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        </div>
                        <h3 className="font-semibold text-foreground text-sm mt-1">{pp.problem}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{pp.impact}</p>
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200/60 dark:border-emerald-800/50 group-hover:shadow-sm group-hover:shadow-emerald-500/10 transition-shadow">
                        <p className="text-sm text-emerald-800 dark:text-emerald-300"><span className="font-semibold">How we help:</span> {pp.solution}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Member Journey Visualization */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase mb-3">How It Works</p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">The Member Billing Journey</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">From confusion to clarity in four seamless steps — all within your branded experience.</p>
            </div>

            <div className="relative">
              <div className="hidden md:block absolute top-[52px] left-[12%] right-[12%] h-0.5">
                <div className="w-full h-full bg-emerald-200 dark:bg-emerald-800 rounded-full" />
                <motion.div
                  className="absolute top-0 left-0 h-full bg-emerald-500 dark:bg-emerald-400 rounded-full"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative z-10">
                {journeySteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="relative mb-4">
                      <div className="w-[68px] h-[68px] rounded-2xl bg-card border-2 border-emerald-200 dark:border-emerald-700 shadow-lg shadow-emerald-500/10 dark:shadow-emerald-500/5 flex items-center justify-center">
                        <step.icon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                        {i + 1}
                      </div>
                    </div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">{step.label}</h4>
                    <p className="text-xs text-muted-foreground max-w-[180px]">{step.desc}</p>
                    {i < journeySteps.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-emerald-400 dark:text-emerald-600 mt-3 md:hidden" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Integration Architecture Preview */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase mb-3">Architecture</p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">Seamless Integration</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">Our API connects directly into your existing member ecosystem. No rip-and-replace required.</p>
            </div>

            <div className="relative bg-card rounded-2xl border border-border p-8 md:p-10 overflow-hidden">
              <div className="hidden md:block absolute top-1/2 left-[18%] right-[18%] h-0.5 -translate-y-1/2 z-0">
                <svg className="w-full h-4 -translate-y-1.5" preserveAspectRatio="none">
                  <motion.line
                    x1="0" y1="8" x2="100%" y2="8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="8 6"
                    className="text-emerald-300 dark:text-emerald-700"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                </svg>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
                {architectureNodes.map((node, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
                  >
                    <div className="bg-card rounded-xl border border-border p-5 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3 border border-border">
                        <node.icon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="font-semibold text-foreground text-sm">{node.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex md:hidden flex-col items-center gap-1 mt-2">
                {[0, 1, 2].map(i => (
                  <ArrowRight key={i} className="w-4 h-4 text-emerald-400 dark:text-emerald-600 rotate-90" />
                ))}
              </div>
            </div>
          </motion.section>

          {/* Tabs Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase mb-3">Partnership Models</p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Choose Your Engagement Path</h2>
            </div>

            <Tabs defaultValue="license">
              <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-secondary rounded-xl p-1">
                <TabsTrigger value="license" className="text-sm rounded-lg">License & Use</TabsTrigger>
                <TabsTrigger value="acquire" className="text-sm rounded-lg">Acquire</TabsTrigger>
                <TabsTrigger value="invest" className="text-sm rounded-lg">Invest</TabsTrigger>
              </TabsList>

              <TabsContent value="license" className="space-y-8 mt-8">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">License Our Technology</h3>
                  <p className="text-sm text-muted-foreground mb-6">Embed AI bill analysis into your member experience. Your brand, our engine.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {licenseCapabilities.map((cap, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                      <Card className="h-full bg-card border-border hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 border border-emerald-100 dark:border-emerald-800/50">
                              <cap.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground text-sm">{cap.title}</h4>
                              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{cap.value}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-secondary rounded-2xl p-6 border border-border">
                  <h4 className="font-semibold text-foreground mb-4 text-sm">Deployment Options</h4>
                  <div className="grid md:grid-cols-3 gap-3">
                    {[
                      { title: "White-Label Portal", desc: "Fully branded member experience hosted by GoldRock" },
                      { title: "API Integration", desc: "Embed analysis in your existing member portal or app" },
                      { title: "Co-Branded Solution", desc: "Joint branding combining GoldRock AI with your plan identity" },
                    ].map((opt, i) => (
                      <div key={i} className="bg-card rounded-xl p-4 border border-border hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                        <h5 className="font-medium text-foreground text-sm mb-1">{opt.title}</h5>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="acquire" className="space-y-8 mt-8">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">Strategic Acquisition</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Healthcare transparency technology is becoming essential infrastructure. Building vs. buying is a real strategic question.
                  </p>
                </div>

                <div className="space-y-4">
                  {acquisitionReasons.map((reason, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                      <Card className="bg-card border-border hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100 dark:border-emerald-800/50">
                              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{i + 1}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground mb-1">{reason.title}</h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-secondary rounded-2xl p-6 space-y-2.5 border border-border">
                  <h4 className="font-semibold text-foreground text-sm mb-3">What You'd Be Acquiring</h4>
                  {[
                    "Production AI models for medical bill analysis and grading",
                    "Pricing benchmark database covering procedures across all 50 states",
                    "Collections defense playbook (34+ scenarios, 60+ document templates)",
                    "Partner API with HMAC authentication and quota management",
                    "Secure document vault with encrypted object storage",
                    "Consumer-grade UX designed for non-technical users",
                    "Growing user base with engagement data and feedback loops",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="invest" className="space-y-8 mt-8">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">Strategic Investment</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Align with the shift toward healthcare transparency before your competitors do.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {investmentBenefits.map((benefit, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                      <Card className="h-full bg-card border-border hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300">
                        <CardContent className="p-5">
                          <h4 className="font-semibold text-foreground mb-2 text-sm">{benefit.title}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-300 mb-2 text-sm">Why Insurance Companies Are Uniquely Positioned</h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    You already have the member relationships, the claims data, and the distribution channels.
                    GoldRock provides the technology layer that turns billing transparency from a cost center into a competitive advantage.
                    Strategic investors get preferred partnership terms and roadmap influence.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.section>

          {/* Deployment Timeline */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase mb-3">Go-To-Market</p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">From Kickoff to Launch in 4 Weeks</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">A proven deployment path that gets your members value fast.</p>
            </div>

            <div className="relative">
              <div className="hidden md:block absolute top-6 left-[12%] right-[12%] h-0.5 bg-emerald-200 dark:bg-emerald-800 rounded-full" />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative z-10">
                {deploymentTimeline.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-sm border-4 border-background">
                      <span className="text-sm font-bold">{i + 1}</span>
                    </div>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">{step.week}</p>
                    <h4 className="font-semibold text-foreground text-sm mb-1">{step.label}</h4>
                    <p className="text-xs text-muted-foreground max-w-[180px]">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* CTA Banner + Contact Form */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-2xl p-8 md:p-12 text-center mb-10 shadow-sm relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                  Give your members the billing clarity they deserve
                </h2>
                <p className="text-white/90 max-w-xl mx-auto mb-6">
                  The best health plans will be the ones that help members navigate the financial side of healthcare, not just the clinical side.
                </p>
                <a href="mailto:CONTACT@GOLDROCK.ai">
                  <Button size="lg" className="bg-white hover:bg-white/90 text-foreground h-12 px-8 text-base font-semibold shadow-sm">
                    <Mail className="mr-2 h-4 w-4" /> CONTACT@GOLDROCK.ai
                  </Button>
                </a>
              </div>
            </div>

            <Card className="bg-card border-border shadow-lg">
              <CardContent className="p-8 md:p-10">
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4 border border-emerald-100 dark:border-emerald-800">
                    <Shield className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Confidential Discussion</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    We understand the sensitive nature of these conversations. Our team is prepared for confidential discussions under NDA.
                  </p>
                </div>
                <div className="max-w-lg mx-auto">
                  <ContactForm context="exploring a partnership" />
                </div>
              </CardContent>
            </Card>
          </motion.section>

        </div>
      </div>

      <MedicalChatbot />
      <MobileBottomNav />
    </>
  );
}
