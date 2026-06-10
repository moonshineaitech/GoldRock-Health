import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import {
  Building2, CheckCircle, Zap, ArrowRight, ArrowLeft, Send, Mail,
  HeartPulse, Shield, Users, DollarSign, FileText, BarChart3,
  Eye, TrendingDown, AlertTriangle, Layers, Lock, Globe,
  Activity, Workflow, Server, MonitorSmartphone, Receipt,
  HelpCircle, Sparkles, ThumbsUp, CreditCard, Scale, ChevronRight
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
import healthcareHero from "@assets/images/healthcare-hero.jpg";
import medicalBill from "@assets/images/medical-bill.jpg";

const EASE = [0.22, 1, 0.36, 1] as const;

function ContactForm({ context }: { context: string }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 800));
    toast({ title: "Message received", description: "We'll respond within one business day." });
    setForm({ name: "", email: "", company: "", message: "" });
    setSending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-muted-foreground text-sm">Name</Label>
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="bg-background border-border" />
        </div>
        <div>
          <Label className="text-muted-foreground text-sm">Work Email</Label>
          <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="bg-background border-border" />
        </div>
      </div>
      <div>
        <Label className="text-muted-foreground text-sm">Organization</Label>
        <Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="bg-background border-border" />
      </div>
      <div>
        <Label className="text-muted-foreground text-sm">Message</Label>
        <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder={`I'm interested in ${context}...`} rows={3} className="bg-background border-border" />
      </div>
      <Button type="submit" disabled={sending} className="w-full bg-primary text-primary-foreground hover:opacity-90">
        <Send className="w-4 h-4 mr-2" />{sending ? "Sending..." : "Start the Conversation"}
      </Button>
      <p className="text-xs text-muted-foreground text-center">Or email us directly: CONTACT@GOLDROCK.ai</p>
    </form>
  );
}

const providerPainPoints = [
  {
    problem: "Patients don't pay bills they don't understand",
    impact: "Complex billing statements with CPT codes and facility fees lead to confusion. Confused patients delay payment or don't pay at all, increasing bad debt.",
    solution: "AI-powered bill clarity tools translate medical billing into plain language. Patients who understand their bills are far more likely to pay."
  },
  {
    problem: "Billing disputes consume staff time",
    impact: "Your revenue cycle team spends hours explaining charges, handling complaints, and processing disputes. Each dispute costs administrative overhead.",
    solution: "Self-service bill analysis reduces the volume of calls and disputes. Patients get answers before they get frustrated enough to call."
  },
  {
    problem: "Price transparency compliance is getting harder",
    impact: "CMS rules keep expanding. Machine-readable files are required but don't help patients. Consumer-friendly price estimates are the next frontier.",
    solution: "Our pricing benchmarks and analysis tools help you provide meaningful transparency that meets both regulatory requirements and patient expectations."
  },
  {
    problem: "Bad debt is growing",
    impact: "As deductibles rise, more patients carry larger balances. Collections erode patient relationships and yield diminishing returns.",
    solution: "GoldRock tools help patients find financial assistance programs, negotiate payment plans, and resolve billing issues before they become write-offs."
  },
];

const licenseFeatures = [
  {
    icon: Eye,
    title: "Patient Bill Clarity",
    description: "White-label tool that translates EOBs and hospital bills into plain language. Explains every line item, identifies potential errors, and provides fair-price context.",
    value: "Patients understand what they owe and why"
  },
  {
    icon: DollarSign,
    title: "Financial Assistance Matching",
    description: "Automatically checks patient eligibility for charity care programs, sliding-scale fees, state assistance programs, and hospital financial aid policies.",
    value: "Connect patients to help before they default"
  },
  {
    icon: BarChart3,
    title: "Price Transparency Tools",
    description: "Consumer-friendly pricing estimates that go beyond machine-readable files. Help patients understand expected costs before procedures.",
    value: "Meet the spirit of transparency regulations"
  },
  {
    icon: FileText,
    title: "Payment Plan Optimization",
    description: "Smart payment plan suggestions based on balance, patient situation, and your organization's policies. Increases collections on high-deductible balances.",
    value: "More patients on plans, fewer in collections"
  },
  {
    icon: Layers,
    title: "Revenue Cycle Integration",
    description: "API integration with your EHR, patient portal, and revenue cycle management system. FHIR-compatible. Works within your existing workflow.",
    value: "No workflow disruption"
  },
  {
    icon: Lock,
    title: "Privacy & Compliance",
    description: "All data encrypted in transit and at rest. Designed with HIPAA considerations. BAAs available. PHI never leaves your security perimeter when API-integrated.",
    value: "Healthcare-grade security"
  },
];

const acquisitionReasons = [
  {
    title: "Patient Experience Differentiator",
    description: "Health systems compete on experience as much as outcomes. Financial experience is the most underserved aspect of the patient journey. Owning this technology creates lasting differentiation."
  },
  {
    title: "Revenue Cycle Intelligence",
    description: "Our AI models identify billing patterns, error rates, and pricing outliers. This intelligence improves your own billing accuracy and helps optimize revenue capture."
  },
  {
    title: "Community Trust",
    description: "Health systems that help patients navigate bills - even when it means acknowledging errors - build trust that translates to loyalty, referrals, and community reputation."
  },
  {
    title: "Technology Fast-Track",
    description: "Building consumer-facing AI tools in-house requires specific expertise in both healthcare billing and consumer UX. Acquisition compresses years of development into weeks of integration."
  },
];

const investmentBenefits = [
  {
    title: "Co-Development Rights",
    description: "Shape the product to address the specific financial navigation challenges your patients face. Build features no competitor can offer."
  },
  {
    title: "Clinical Integration",
    description: "Explore how financial navigation can be incorporated into care coordination. Financial barriers affect treatment adherence and outcomes."
  },
  {
    title: "Data-Driven Insights",
    description: "Understand billing patterns, patient financial behavior, and price sensitivity across procedures. Inform pricing strategy and charity care policy."
  },
  {
    title: "Network Expansion",
    description: "Offer GoldRock as a benefit to employed physician groups, partner facilities, and affiliated clinics. Creates value across your health system network."
  },
];

const journeySteps = [
  { label: "Patient Receives Bill", icon: Receipt },
  { label: "Confused by Charges", icon: HelpCircle },
  { label: "Uses GoldRock", icon: Sparkles, featured: true },
  { label: "Understands & Pays", icon: ThumbsUp },
];

const revenueImpactCards = [
  { title: "Fewer Disputes", description: "Patients who understand their bills have fewer reasons to dispute charges", icon: Shield },
  { title: "Faster Payment", description: "Clarity accelerates the path from bill delivery to payment", icon: Zap },
  { title: "Lower Bad Debt", description: "Financial assistance matching connects patients to help before default", icon: TrendingDown },
  { title: "Better Compliance", description: "Meaningful transparency that exceeds regulatory requirements", icon: Scale },
];

const integrationSteps = [
  { label: "EHR/EMR", icon: Server, desc: "Your existing systems" },
  { label: "GoldRock API", icon: Workflow, desc: "FHIR-compatible layer" },
  { label: "Patient Portal", icon: MonitorSmartphone, desc: "Consumer-facing tools" },
  { label: "Revenue Cycle", icon: Activity, desc: "Optimized collections" },
];

const floatingPills = [
  { text: "FHIR Compatible", delay: 0 },
  { text: "Revenue Cycle Integration", delay: 1.5 },
  { text: "Patient-First Design", delay: 3 },
];

export default function ForHealthcare() {
  return (
    <>
      <SEOHead
        title="For Healthcare Companies | GoldRock Health"
        description="Partner with GoldRock Health to improve patient financial experience. AI-powered bill clarity, financial assistance matching, and price transparency tools for health systems."
        keywords={["healthcare billing technology", "patient financial experience", "health system billing tools", "price transparency compliance"]}
        canonicalPath="/for-healthcare"
      />

      <MobileHeader title="For Healthcare" />

      <div className="min-h-screen bg-background">

        {/* Hero Section */}
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--background), var(--card))' }}>
          <div className="max-w-7xl mx-auto px-4 pt-14 pb-16 md:pb-24">
            <Link href="/enterprise" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="w-4 h-4 mr-1" /> Enterprise Solutions
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE }}>
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 tracking-widest uppercase mb-4">For Healthcare Companies</p>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-[1.08] tracking-tight">
                  Patients who understand<br className="hidden sm:block" />
                  <span className="luxury-text-gradient">their bills actually pay them.</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
                  Complex billing drives confusion, disputes, and bad debt. GoldRock gives health systems tools to make billing
                  transparent, help patients find assistance, and build the kind of trust that keeps them coming back.
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  <a href="mailto:CONTACT@GOLDROCK.ai">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 h-12 px-8 text-base shadow-sm">
                      <Mail className="mr-2 h-5 w-5" /> Let's Talk Partnership
                    </Button>
                  </a>
                  <Link href="/partner-api">
                    <Button size="lg" variant="outline" className="border-border h-12 px-8 text-base text-foreground hover:bg-secondary">
                      Technical Integration <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2">
                  {floatingPills.map((pill, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.2, duration: 0.5, ease: EASE }}
                    >
                      <Badge className="bg-card text-foreground border border-border shadow-sm px-3 py-1.5 text-xs font-medium">
                        {pill.text}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden border border-border shadow-xl">
                  <img
                    src={healthcareHero}
                    alt="Healthcare facility"
                    className="w-full h-[340px] md:h-[420px] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
                    <p className="text-white/90 text-sm font-medium">Trusted by health systems focused on patient experience</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 pb-24 space-y-20">

          {/* Patient Billing Journey */}
          <section>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }} className="text-center mb-12">
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 tracking-widest uppercase mb-3">The Patient Billing Journey</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">From Confusion to Clarity</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">See how GoldRock transforms the patient financial experience at every step</p>
            </motion.div>

            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2 mx-16" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
                {journeySteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                    className="relative"
                  >
                    <div className="relative z-10 p-6 rounded-2xl border border-border bg-card text-center transition-all duration-300 hover:shadow-md">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${step.featured ? '' : 'bg-secondary'}`}
                        style={step.featured ? { background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' } : undefined}
                      >
                        <step.icon className={`w-7 h-7 ${step.featured ? 'text-white' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center mx-auto mb-3">
                        <span className="text-sm font-bold text-foreground">{i + 1}</span>
                      </div>
                      <p className="font-semibold text-foreground text-sm">{step.label}</p>
                    </div>
                    {i < 3 && (
                      <div className="hidden md:flex absolute top-1/2 -right-4 z-20 -translate-y-1/2">
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Revenue Impact Section */}
          <section>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }} className="text-center mb-12">
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 tracking-widest uppercase mb-3">Revenue Impact</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">How GoldRock Strengthens Your Revenue Cycle</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Clarity drives compliance and collections. Here's the impact across your revenue cycle.</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {revenueImpactCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
                >
                  <div className="luxury-card rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                      <card.icon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* The Reality of Patient Billing */}
          <section>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }} className="text-center mb-12">
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 tracking-widest uppercase mb-3">The Problem</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">The Reality of Patient Billing</h2>
              <p className="text-muted-foreground">These problems are getting worse, not better</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-5">
              {providerPainPoints.map((pp, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}>
                  <Card className="h-full bg-card border-border transition-all duration-300 hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        </div>
                        <h3 className="font-semibold text-foreground">{pp.problem}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{pp.impact}</p>
                      <div className="bg-secondary rounded-xl p-4 border border-border">
                        <p className="text-sm text-foreground"><span className="font-semibold text-gold">How we help:</span> {pp.solution}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Before/After Section */}
          <section>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }} className="text-center mb-12">
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 tracking-widest uppercase mb-3">The Transformation</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Before & After GoldRock</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">From opaque billing statements to clear, understandable explanations</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}>
                <div className="relative rounded-2xl overflow-hidden border border-border bg-card h-full">
                  <div className="bg-secondary border-b border-border px-5 py-3">
                    <p className="text-foreground font-bold text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-muted-foreground" /> BEFORE — Traditional Medical Bill
                    </p>
                  </div>
                  <div className="p-5">
                    <img src={medicalBill} alt="Confusing medical bill" className="w-full h-48 object-cover rounded-lg mb-4 opacity-80" />
                    <div className="space-y-2">
                      <div className="bg-secondary rounded-lg p-3">
                        <p className="text-xs font-mono text-muted-foreground">CPT 99213 - Office Visit Level 3 .............. $285.00</p>
                      </div>
                      <div className="bg-secondary rounded-lg p-3">
                        <p className="text-xs font-mono text-muted-foreground">HCPCS J3301 - Triamcinolone Inj .............. $142.00</p>
                      </div>
                      <div className="bg-secondary rounded-lg p-3">
                        <p className="text-xs font-mono text-muted-foreground">REV 0300 - Laboratory ............................. $89.00</p>
                      </div>
                      <p className="text-xs text-destructive mt-3 italic">Patients see codes, not explanations. Confusion leads to non-payment.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.5, ease: EASE }}>
                <div className="relative rounded-2xl overflow-hidden border border-border bg-card h-full">
                  <div className="px-5 py-3" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
                    <p className="text-white font-bold text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> AFTER — GoldRock Plain-Language
                    </p>
                  </div>
                  <div className="p-5">
                    <div className="bg-secondary rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-foreground mb-1">Your Office Visit Summary</p>
                      <p className="text-xs text-muted-foreground">Translated by GoldRock AI</p>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-900">
                        <p className="text-xs text-foreground"><span className="font-semibold text-emerald-700 dark:text-emerald-400">Doctor Visit (30 min):</span> Standard office appointment — $285.00</p>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-900">
                        <p className="text-xs text-foreground"><span className="font-semibold text-emerald-700 dark:text-emerald-400">Steroid Injection:</span> Anti-inflammatory shot — $142.00</p>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-900">
                        <p className="text-xs text-foreground"><span className="font-semibold text-emerald-700 dark:text-emerald-400">Lab Work:</span> Blood panel tests — $89.00</p>
                      </div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-3 italic">Clear explanations. Fair-price context. Actionable next steps.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Integration Preview */}
          <section>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }} className="text-center mb-12">
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 tracking-widest uppercase mb-3">Seamless Integration</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Fits Into Your Existing Tech Stack</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">FHIR-compatible API that works alongside your current systems</p>
            </motion.div>

            <div className="relative max-w-4xl mx-auto">
              <div className="hidden md:block absolute top-1/2 left-[12%] right-[12%] h-px bg-border -translate-y-1/2" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
                {integrationSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                    className="relative"
                  >
                    <div className="relative z-10 p-6 rounded-2xl bg-card border border-border shadow-sm text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                      <div
                        className={`w-14 h-14 rounded-xl ${i === 1 ? '' : 'bg-secondary'} flex items-center justify-center mx-auto mb-3`}
                        style={i === 1 ? { background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' } : undefined}
                      >
                        <step.icon className={`w-6 h-6 ${i === 1 ? 'text-white' : 'text-muted-foreground'}`} />
                      </div>
                      <h4 className="font-bold text-foreground text-sm mb-1">{step.label}</h4>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>
                    {i < 3 && (
                      <div className="hidden md:flex absolute top-1/2 -right-4 z-20 -translate-y-1/2">
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Tabs Section */}
          <section>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }} className="text-center mb-8">
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 tracking-widest uppercase mb-3">Partnership Models</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Multiple Ways to Work Together</h2>
            </motion.div>

            <Tabs defaultValue="license">
              <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-secondary mb-8">
                <TabsTrigger value="license" className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">License & Use</TabsTrigger>
                <TabsTrigger value="acquire" className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Acquire</TabsTrigger>
                <TabsTrigger value="invest" className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Invest</TabsTrigger>
              </TabsList>

              <TabsContent value="license" className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">License Our Technology</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Embed patient financial tools into your existing systems. Reduce billing confusion, improve collections, and build patient trust.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {licenseFeatures.map((feat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.5, ease: EASE }}>
                      <Card className="h-full bg-card border-border transition-all duration-300 hover:shadow-md">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                              <feat.icon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">{feat.title}</h4>
                              <p className="text-xs text-muted-foreground font-medium">{feat.value}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h4 className="font-semibold text-foreground mb-4">Integration Options</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      "EHR/EMR via FHIR APIs",
                      "Patient portal embedding",
                      "Revenue cycle system plugins",
                      "Custom enterprise API",
                      "Mobile app SDK",
                      "Dedicated implementation support"
                    ].map((opt, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-foreground bg-background rounded-xl p-3 border border-border transition-colors">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="acquire" className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">Strategic Acquisition</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Own the patient financial experience. Build vs. buy is a real strategic question in health system innovation.
                  </p>
                </div>

                <div className="space-y-4">
                  {acquisitionReasons.map((reason, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}>
                      <Card className="bg-card border-border transition-all duration-300 hover:shadow-md">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-sm font-bold text-foreground">{i + 1}</span>
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

                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h4 className="font-semibold text-foreground mb-4">What You'd Be Acquiring</h4>
                  <div className="space-y-2.5">
                    {[
                      "Production AI models trained on medical billing patterns",
                      "Fair-price benchmark database covering procedures nationwide",
                      "Consumer-grade UX designed for non-technical patients",
                      "Collections defense library with 34+ scenario playbooks",
                      "FHIR-compatible API architecture",
                      "Secure document vault infrastructure",
                      "Growing user base with real engagement data",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm text-foreground">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="invest" className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">Strategic Investment</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Shape the future of patient financial experience from the inside.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {investmentBenefits.map((benefit, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}>
                      <Card className="h-full bg-card border-border transition-all duration-300 hover:shadow-md">
                        <CardContent className="p-5">
                          <h4 className="font-semibold text-foreground mb-2">{benefit.title}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-secondary rounded-2xl p-6 border border-border">
                  <h4 className="font-semibold text-foreground mb-3">Why Health Systems Are Uniquely Positioned</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You see the patient billing journey from the other side. You know where the friction points are.
                    A strategic investment lets you shape technology that addresses those friction points while
                    creating a new patient engagement channel. Investors get preferred partnership terms,
                    board participation, and first access to new capabilities.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </section>

          {/* CTA Banner */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              className="relative overflow-hidden rounded-3xl bg-card border border-border p-10 md:p-16 text-center shadow-sm"
            >
              <div className="relative">
                <HeartPulse className="w-10 h-10 text-gold mx-auto mb-5" />
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                  Patients who understand their bills<br className="hidden sm:block" /> pay them. It's that simple.
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-6">
                  Let's explore how GoldRock can transform your patients' financial experience.
                </p>
                <a href="mailto:CONTACT@GOLDROCK.ai">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 h-12 px-8 text-base font-semibold shadow-sm">
                    <Mail className="mr-2 h-5 w-5" /> CONTACT@GOLDROCK.ai
                  </Button>
                </a>
              </div>
            </motion.div>
          </section>

          {/* Contact Form */}
          <section>
            <Card className="bg-card border-border shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-5">
                  <div className="lg:col-span-2 bg-primary p-8 md:p-10 flex flex-col justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                      <HeartPulse className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary-foreground mb-3">Let's Explore Partnership</h3>
                    <p className="text-primary-foreground leading-relaxed mb-6" style={{ opacity: 0.85 }}>
                      Our team is ready to discuss how GoldRock Health can support your organization's goals — whether that's licensing, acquisition, or investment.
                    </p>
                    <div className="space-y-3">
                      {["Dedicated implementation team", "Custom integration roadmap", "Healthcare-grade security"].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-primary-foreground text-sm" style={{ opacity: 0.9 }}>
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-3 p-8 md:p-10">
                    <ContactForm context="healthcare partnership" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
      </div>

      <MedicalChatbot />
      <MobileBottomNav />
    </>
  );
}
