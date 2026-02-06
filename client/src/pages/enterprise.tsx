import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import {
  Building2, Users, DollarSign, Shield, Zap, Code, CheckCircle,
  ArrowRight, Globe, Lock, HeartPulse, Mail, Briefcase, Send,
  Layers, BarChart3, FileText, Cpu, Target, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SEOHead } from "@/components/seo-head";
import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useToast } from "@/hooks/use-toast";

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
          <Label className="text-gray-600 dark:text-gray-400 text-sm">Name</Label>
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
        </div>
        <div>
          <Label className="text-gray-600 dark:text-gray-400 text-sm">Work Email</Label>
          <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
        </div>
      </div>
      <div>
        <Label className="text-gray-600 dark:text-gray-400 text-sm">Organization</Label>
        <Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
      </div>
      <div>
        <Label className="text-gray-600 dark:text-gray-400 text-sm">How can we help?</Label>
        <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
      </div>
      <Button type="submit" disabled={sending} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        <Send className="w-4 h-4 mr-2" />{sending ? "Sending..." : "Start the Conversation"}
      </Button>
      <p className="text-xs text-gray-500 text-center">Or reach us directly at CONTACT@GOLDROCK.ai</p>
    </form>
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

const colorMap: Record<string, { bg: string; text: string; border: string; lightBg: string }> = {
  blue: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800", lightBg: "bg-blue-100 dark:bg-blue-900/40" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800", lightBg: "bg-emerald-100 dark:bg-emerald-900/40" },
  rose: { bg: "bg-rose-50 dark:bg-rose-950/30", text: "text-rose-600 dark:text-rose-400", border: "border-rose-200 dark:border-rose-800", lightBg: "bg-rose-100 dark:bg-rose-900/40" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800", lightBg: "bg-purple-100 dark:bg-purple-900/40" },
};

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

      <div className="min-h-screen bg-white dark:bg-gray-950">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/50 to-gray-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-gray-950" />
          <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-20 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-4">Enterprise Solutions</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
                Healthcare billing is broken.<br />
                <span className="text-blue-600 dark:text-blue-400">We're fixing it with AI.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Medical billing errors are widespread. Millions of Americans carry debt they may not legitimately owe.
                GoldRock Health gives organizations the tools to change that - for their people, their members, and their patients.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="mailto:CONTACT@GOLDROCK.ai">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 h-12">
                    <Mail className="mr-2 h-5 w-5" /> Talk to Our Team
                  </Button>
                </a>
                <Link href="/partner-api">
                  <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 h-12 px-8">
                    <Code className="mr-2 h-5 w-5" /> Explore the API
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Built for Your Organization</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Whether you employ 50 people or insure 5 million, we have a path to work together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {audiences.map((a, i) => {
              const colors = colorMap[a.color];
              return (
                <motion.div key={a.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link href={a.href}>
                    <Card className={`h-full border ${colors.border} ${colors.bg} hover:shadow-lg transition-all cursor-pointer group`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-11 h-11 rounded-xl ${colors.lightBg} flex items-center justify-center flex-shrink-0`}>
                            <a.icon className={`w-5 h-5 ${colors.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{a.title}</h3>
                              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{a.subtitle}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{a.description}</p>
                        <div className="space-y-1.5">
                          {a.points.map((p, j) => (
                            <div key={j} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <CheckCircle className={`w-3.5 h-3.5 ${colors.text} flex-shrink-0`} />
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

        <section className="bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-5xl mx-auto px-4 py-20">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What We Actually Build</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                Production-ready tools that work today, not vaporware roadmap slides.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {capabilities.map((cap, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-5">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                        <cap.icon className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5">{cap.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{cap.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">API Preview</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Embed medical bill analysis into your application with a single API call.
            </p>
          </div>

          <Card className="overflow-hidden border-gray-200 dark:border-gray-700 max-w-3xl mx-auto">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 font-mono">POST /api/partner/bill-analysis</span>
            </div>
            <pre className="p-5 text-sm overflow-x-auto bg-gray-50 dark:bg-gray-900">
              <code className="text-gray-700 dark:text-gray-300 font-mono text-xs leading-relaxed">
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

          <div className="flex justify-center mt-6">
            <Link href="/partner-api">
              <Button variant="outline" className="border-gray-300 dark:border-gray-700">
                <Code className="w-4 h-4 mr-2" /> Full API Documentation <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-5xl mx-auto px-4 py-20">
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: Lock, title: "Privacy by Design", description: "All data encrypted in transit and at rest. We analyze bills - we don't store medical records. Role-based access ensures individual privacy." },
                { icon: Shield, title: "Compliance-Ready", description: "Built with HIPAA considerations in mind. BAAs available for enterprise customers. SOC 2 compliance roadmap in progress." },
                { icon: Cpu, title: "Enterprise Infrastructure", description: "Hosted on secure cloud infrastructure with automated backups, monitoring, and incident response. Designed for reliability at scale." },
              ].map((item, i) => (
                <Card key={i} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-20">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Let's Talk</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Tell us about your organization and what you're looking to solve. No pitch decks, no pressure - just a conversation about whether we can help.
                </p>
              </div>
              <ContactForm />
            </CardContent>
          </Card>
        </section>

        <footer className="border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <HeartPulse className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-900 dark:text-white font-semibold">GoldRock Health</span>
              </div>
              <div className="flex gap-6">
                <Link href="/privacy-policy" className="hover:text-gray-700 dark:hover:text-gray-200">Privacy</Link>
                <Link href="/terms-of-service" className="hover:text-gray-700 dark:hover:text-gray-200">Terms</Link>
                <Link href="/support" className="hover:text-gray-700 dark:hover:text-gray-200">Support</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <MobileBottomNav />
    </>
  );
}
