import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import {
  Building2, Users, DollarSign, Shield, Zap, Code, CheckCircle,
  ArrowRight, Globe, Lock, HeartPulse, Mail, Briefcase, Send,
  Layers, BarChart3, FileText, Cpu, Target, Sparkles, Upload,
  Brain, ClipboardCheck, Network, Handshake, UserCheck, Building, Landmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SEOHead } from "@/components/seo-head";
import { MedicalChatbot } from "@/components/medical-chatbot";
import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useToast } from "@/hooks/use-toast";
import enterpriseHero from "@assets/images/enterprise-hero.jpg";
import medicalBill from "@assets/images/medical-bill.jpg";
import platformDemo from "@assets/images/platform-demo.jpg";

function ContactForm() {
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
        <Label className="text-muted-foreground text-sm">How can we help?</Label>
        <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} className="bg-background border-border" />
      </div>
      <Button type="submit" disabled={sending} className="w-full bg-primary text-primary-foreground hover:opacity-90">
        <Send className="w-4 h-4 mr-2" />{sending ? "Sending..." : "Start the Conversation"}
      </Button>
      <p className="text-xs text-muted-foreground text-center">Or reach us directly at CONTACT@GOLDROCK.ai</p>
    </form>
  );
}

function AnimatedCounter({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

const audiences = [
  {
    title: "Employers",
    subtitle: "Offer medical bill advocacy as an employee benefit",
    description: "Help your workforce navigate complex medical bills with AI-powered analysis, negotiation scripts, and collections defense. Employees who feel financially supported stay longer and perform better.",
    icon: Building2,
    href: "/for-employers",
    color: "blue",
    points: ["AI bill analysis for every employee", "Collections defense playbook (34+ scenarios)", "Measurable ROI through employee savings"],
  },
  {
    title: "Insurance Companies",
    subtitle: "Reduce claims costs and improve member satisfaction",
    description: "License our AI to help members understand bills, identify errors, and navigate appeals. Lower dispute volume. Higher NPS. Technology that pays for itself through reduced claim costs.",
    icon: Shield,
    href: "/for-insurance",
    color: "emerald",
    points: ["White-label member billing tools", "Claims accuracy improvement", "Proactive dispute prevention"],
  },
  {
    title: "Healthcare Providers",
    subtitle: "Improve patient financial experience and reduce bad debt",
    description: "Patients who understand their bills pay faster and dispute less. Our tools help you meet price transparency requirements while building trust with patients navigating complex charges.",
    icon: HeartPulse,
    href: "/for-healthcare",
    color: "rose",
    points: ["Patient-facing billing clarity tools", "Price transparency compliance support", "Reduced billing disputes and write-offs"],
  },
  {
    title: "Venture Capital",
    subtitle: "Investment opportunity in healthcare cost intelligence",
    description: "Healthcare billing is a $4.5 trillion market with enormous inefficiency. GoldRock is building the intelligence layer that helps every stakeholder - patients, employers, insurers, and providers.",
    icon: Target,
    href: "/for-vcs",
    color: "purple",
    points: ["Large addressable market with strong tailwinds", "AI-first platform with growing data moat", "Multiple revenue streams (B2C, B2B, API)"],
  },
];

const capabilities = [
  {
    icon: Sparkles,
    title: "AI Bill Analysis",
    description: "Our models identify billing errors, coding issues, and overcharges by comparing against fair-price benchmarks across procedures and geographies."
  },
  {
    icon: FileText,
    title: "Dispute & Negotiation Engine",
    description: "Generates customized dispute letters, negotiation scripts, and appeal documents based on specific bill details and applicable regulations."
  },
  {
    icon: Shield,
    title: "Collections Defense",
    description: "34+ real-world scenario playbooks covering debt validation, statute of limitations, FDCPA violations, pay-for-delete strategies, and more."
  },
  {
    icon: Layers,
    title: "Partner API",
    description: "RESTful API lets you embed bill analysis, grading, and savings estimates directly into your own applications. HMAC-authenticated, rate-limited, production-ready."
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Track usage, savings identified, and engagement across your organization. Aggregate dashboards for administrators, privacy-preserving for individuals."
  },
  {
    icon: Lock,
    title: "Security & Compliance",
    description: "All data encrypted in transit and at rest. Role-based access controls. Designed with HIPAA considerations in mind. BAAs available for enterprise customers."
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; lightBg: string; glow: string }> = {
  blue: { bg: "bg-card", text: "text-muted-foreground", border: "border-border", lightBg: "bg-secondary", glow: "" },
  emerald: { bg: "bg-card", text: "text-muted-foreground", border: "border-border", lightBg: "bg-secondary", glow: "" },
  rose: { bg: "bg-card", text: "text-muted-foreground", border: "border-border", lightBg: "bg-secondary", glow: "" },
  purple: { bg: "bg-card", text: "text-muted-foreground", border: "border-border", lightBg: "bg-secondary", glow: "" },
};

const stats = [
  { value: 34, suffix: "+", label: "Defense Scenarios", description: "Collections playbooks" },
  { value: 50, suffix: "", label: "States Covered", description: "Nationwide compliance" },
  { value: 6, suffix: "", label: "Product Modules", description: "Integrated platform" },
  { value: 3, suffix: "", label: "Pricing Tiers", description: "Flexible plans" },
];

const howItWorks = [
  { step: 1, icon: Upload, title: "Upload Your Bill", description: "Snap a photo or upload a PDF of any medical bill. Our system accepts all standard billing formats." },
  { step: 2, icon: Brain, title: "AI Analyzes & Scores", description: "Our AI compares charges against fair-price benchmarks, flags errors, and scores your bill across multiple dimensions." },
  { step: 3, icon: ClipboardCheck, title: "Get Action Plan", description: "Receive a personalized action plan with dispute letters, negotiation scripts, and step-by-step guidance." },
];

const industryBadges = [
  { icon: Building2, label: "Employers" },
  { icon: Shield, label: "Health Plans" },
  { icon: HeartPulse, label: "Health Systems" },
  { icon: Handshake, label: "Benefits Brokers" },
  { icon: Network, label: "HR Platforms" },
  { icon: Landmark, label: "TPAs" },
];

export default function Enterprise() {
  return (
    <>
      <SEOHead
        title="Enterprise Solutions | GoldRock Health"
        description="AI-powered medical bill analysis for employers, insurers, healthcare providers, and investors. Reduce costs, improve outcomes, and build trust through billing transparency."
        keywords={["enterprise healthcare AI", "medical bill analysis platform", "employer healthcare benefit", "insurance claims technology"]}
        canonicalPath="/enterprise"
      />

      <MobileHeader title="Enterprise" />

      <div className="min-h-screen bg-background">

        <section className="relative overflow-hidden min-h-[600px] md:min-h-[700px] flex items-center">
          <div className="absolute inset-0">
            <img src={enterpriseHero} alt="Enterprise team collaborating on healthcare solutions" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-gray-900/30" />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32">
            <div className="max-w-3xl">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <div className="flex flex-wrap gap-3 mb-8">
                  {["34+ Scenarios", "50-State Coverage", "Partner API Ready"].map((badge, i) => (
                    <motion.div
                      key={badge}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Badge className="bg-white/10 border border-white/20 text-white px-4 py-1.5 text-sm font-medium">
                        {badge}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
                <p className="text-blue-300 text-sm font-semibold tracking-[0.2em] uppercase mb-4">Enterprise Solutions</p>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
                  Healthcare billing<br />is broken.{" "}
                  <span className="text-gold">
                    We're fixing it.
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
                  Medical billing errors are widespread. Millions of Americans carry debt they may not legitimately owe.
                  GoldRock Health gives organizations the tools to change that — for their people, their members, and their patients.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="mailto:CONTACT@GOLDROCK.ai">
                    <Button size="lg" className="text-white font-semibold px-8 h-14 text-base shadow-sm transition-all hover:scale-[1.01]" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
                      <Mail className="mr-2 h-5 w-5" /> Talk to Our Team
                    </Button>
                  </a>
                  <Link href="/partner-api">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-14 px-8 text-base transition-all hover:scale-[1.01]">
                      <Code className="mr-2 h-5 w-5" /> Explore the API
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="relative bg-background border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center"
                >
                  <div className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gold mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm font-semibold text-foreground mb-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-card">
          <div className="max-w-6xl mx-auto px-4 py-20 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-secondary text-muted-foreground border-border px-4 py-1">How It Works</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Three steps to billing clarity</h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                From bill upload to action plan in minutes, not weeks.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-border" />
              {howItWorks.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative group"
                >
                  <div className="luxury-card rounded-2xl p-8 border border-border text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    <div className="relative mx-auto w-16 h-16 mb-6">
                      <div className="relative w-full h-full rounded-2xl bg-secondary flex items-center justify-center">
                        <step.icon className="w-7 h-7 text-muted-foreground" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
                        {step.step}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-20 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <Badge className="mb-4 bg-secondary text-muted-foreground border-border px-4 py-1">Solutions</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Built for Your Organization</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Whether you employ 50 people or insure 5 million, we have a path to work together.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {audiences.map((a, i) => {
              const colors = colorMap[a.color];
              return (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={a.href}>
                    <Card className={`h-full border ${colors.border} ${colors.bg} hover:shadow-md ${colors.glow} transition-all duration-300 cursor-pointer group hover:-translate-y-1`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl ${colors.lightBg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                            <a.icon className={`w-6 h-6 ${colors.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-foreground">{a.title}</h3>
                              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1.5 transition-transform duration-300" />
                            </div>
                            <p className="text-sm text-muted-foreground">{a.subtitle}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{a.description}</p>
                        <div className="space-y-2">
                          {a.points.map((p, j) => (
                            <div key={j} className="flex items-center gap-2 text-sm text-foreground">
                              <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="bg-background">
          <div className="max-w-6xl mx-auto px-4 py-20 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-14"
            >
              <Badge className="mb-4 bg-secondary text-muted-foreground border-border px-4 py-1">Platform</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">What We Actually Build</h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Production-ready tools that work today, not vaporware roadmap slides.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {capabilities.map((cap, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card className="h-full luxury-card border border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                    <CardContent className="p-6">
                      <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                        <cap.icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{cap.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-20 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <Badge className="mb-4 bg-secondary text-muted-foreground border-border px-4 py-1">Preview</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">See the Platform in Action</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Powerful analytics and intelligent bill scoring, all in one dashboard.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="rounded-2xl overflow-hidden border border-border shadow-lg bg-card">
              <div className="bg-secondary px-4 py-3 border-b border-border flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-muted rounded-lg px-4 py-1.5 text-xs text-muted-foreground font-mono text-center max-w-sm mx-auto">
                    app.goldrock.ai/dashboard
                  </div>
                </div>
              </div>
              <div className="relative">
                <img src={platformDemo} alt="GoldRock Platform Dashboard" className="w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-6 left-6 md:top-8 md:left-8"
                >
                  <div className="bg-card rounded-xl p-4 border border-border shadow-md max-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-gold" />
                      <span className="text-xs font-semibold text-foreground">AI Bill Score</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Multi-dimensional scoring across fairness, coding accuracy, and more</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.45, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-6 right-6 md:bottom-8 md:right-8"
                >
                  <div className="bg-card rounded-xl p-4 border border-border shadow-md max-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-semibold text-foreground">Smart Analytics</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Track patterns and insights across all analyzed bills</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-6 right-6 md:top-8 md:right-8"
                >
                  <div className="bg-card rounded-xl p-4 border border-border shadow-md max-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-semibold text-foreground">Defense Engine</span>
                    </div>
                    <p className="text-xs text-muted-foreground">34+ scenario playbooks for collections defense</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="bg-card">
          <div className="max-w-6xl mx-auto px-4 py-20 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-14"
            >
              <Badge className="mb-4 bg-secondary text-muted-foreground border-border px-4 py-1">Trust</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Trusted by Organizations Across Healthcare</h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Built for every stakeholder in the healthcare billing ecosystem.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {industryBadges.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="bg-background rounded-xl border border-border p-6 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <badge.icon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{badge.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge className="mb-4 bg-secondary text-muted-foreground border-border px-4 py-1">API</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">API Preview</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Embed medical bill analysis into your application with a single API call.
            </p>
          </motion.div>

          <Card className="overflow-hidden border-border max-w-3xl mx-auto shadow-lg">
            <div className="bg-secondary px-4 py-2.5 border-b border-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-muted-foreground ml-2 font-mono">POST /api/partner/bill-analysis</span>
            </div>
            <pre className="p-5 text-sm overflow-x-auto bg-muted">
              <code className="text-muted-foreground font-mono text-xs leading-relaxed">
{`// Request
{
  "billData": {
    "amount": 15000,
    "procedure": "Appendectomy",
    "facilityType": "Hospital",
    "state": "CA"
  }
}

// Response
{
  "score": { "overall": 72, "fairness": 65, "coding": 80 },
  "issues": [
    { "type": "overcharge", "description": "Facility fee 40% above regional median" },
    { "type": "unbundling", "description": "Lab panel billed as separate tests" }
  ],
  "estimatedSavings": { "low": 2250, "high": 6000 },
  "recommendations": [ ... ]
}`}
              </code>
            </pre>
          </Card>

          <div className="flex justify-center mt-8">
            <Link href="/partner-api">
              <Button variant="outline" className="border-border hover:bg-secondary transition-colors">
                <Code className="w-4 h-4 mr-2" /> Full API Documentation <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="bg-card">
          <div className="max-w-6xl mx-auto px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-secondary text-muted-foreground border-border px-4 py-1">Security</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Enterprise-Grade Security</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Lock, title: "Privacy by Design", description: "All data encrypted in transit and at rest. We analyze bills - we don't store medical records. Role-based access ensures individual privacy." },
                { icon: Shield, title: "Compliance-Ready", description: "Built with HIPAA considerations in mind. BAAs available for enterprise customers. SOC 2 compliance roadmap in progress." },
                { icon: Cpu, title: "Enterprise Infrastructure", description: "Hosted on secure cloud infrastructure with automated backups, monitoring, and incident response. Designed for reliability at scale." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card className="bg-background border-border h-full hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-7 h-7 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }} />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Medical Debt Keeps You Up at Night.{" "}
                <span className="text-white/90">
                  We Help You Sleep Again.
                </span>
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
                Join the organizations using AI-powered tools to bring transparency, fairness, and relief to medical billing.
              </p>
              <a href="mailto:CONTACT@GOLDROCK.ai">
                <Button size="lg" className="bg-white text-neutral-900 hover:bg-white/90 font-semibold px-10 h-14 text-base shadow-lg transition-all hover:scale-[1.01]">
                  <Mail className="mr-2 h-5 w-5" /> Get in Touch Today
                </Button>
              </a>
            </motion.div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-20 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="luxury-card border border-border shadow-lg">
              <CardContent className="p-8 md:p-10">
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">Let's Talk</h2>
                  <p className="text-muted-foreground text-lg">
                    Tell us about your organization and what you're looking to solve. No pitch decks, no pressure — just a conversation about whether we can help.
                  </p>
                </div>
                <ContactForm />
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <footer className="border-t border-border">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <HeartPulse className="h-5 w-5 text-gold" />
                <span className="text-foreground font-semibold">GoldRock Health</span>
              </div>
              <div className="flex gap-6">
                <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link>
                <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Terms</Link>
                <Link href="/support" className="hover:text-foreground transition-colors">Support</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <MedicalChatbot />
      <MobileBottomNav />
    </>
  );
}
