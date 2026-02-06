import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import {
  Shield, CheckCircle, ArrowRight, ArrowLeft, Send, Mail,
  TrendingDown, Users, BarChart3, Zap, Lock, Eye, FileText,
  Layers, Building2, Globe, Target, Briefcase, AlertTriangle,
  ChevronDown, ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SEOHead } from "@/components/seo-head";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useToast } from "@/hooks/use-toast";

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
          <Label className="text-gray-600 dark:text-gray-400 text-sm">Name</Label>
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
        </div>
        <div>
          <Label className="text-gray-600 dark:text-gray-400 text-sm">Work Email</Label>
          <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-gray-600 dark:text-gray-400 text-sm">Organization</Label>
          <Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
        </div>
        <div>
          <Label className="text-gray-600 dark:text-gray-400 text-sm">Your Role</Label>
          <Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g., VP of Product" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
        </div>
      </div>
      <div>
        <Label className="text-gray-600 dark:text-gray-400 text-sm">Message</Label>
        <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder={`I'm interested in ${context}...`} rows={3} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
      </div>
      <Button type="submit" disabled={sending} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
        <Send className="w-4 h-4 mr-2" />{sending ? "Sending..." : "Start Confidential Discussion"}
      </Button>
      <p className="text-xs text-gray-500 text-center">Or email: CONTACT@GOLDROCK.ai — NDA available on request</p>
    </form>
  );
}

function ExpandSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{children}</div>}
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

      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 py-8 pb-24 space-y-16">
          <div>
            <Link href="/enterprise" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6">
              <ArrowLeft className="w-4 h-4 mr-1" /> Enterprise Solutions
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 tracking-wide uppercase mb-3">For Insurance Companies</p>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-[1.1] tracking-tight">
                Your members are drowning<br />in confusing medical bills.
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-2xl">
                They call your service center. They file disputes. They blame you for billing errors that aren't even yours.
                What if you could give them tools that actually help - and reduce your costs in the process?
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="mailto:CONTACT@GOLDROCK.ai">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-6">
                    <Mail className="mr-2 h-4 w-4" /> Confidential Discussion
                  </Button>
                </a>
                <Link href="/partner-api">
                  <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-700 h-11 px-6">
                    Explore API <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">The Problems You're Dealing With</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Sound familiar?</p>
            <div className="grid md:grid-cols-2 gap-5">
              {insurerPainPoints.map((pp, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{pp.problem}</h3>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">{pp.impact}</p>
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                        <p className="text-sm text-emerald-800 dark:text-emerald-300"><span className="font-medium">How we help:</span> {pp.solution}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <Tabs defaultValue="license">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="license" className="text-sm">License & Use</TabsTrigger>
              <TabsTrigger value="acquire" className="text-sm">Acquire</TabsTrigger>
              <TabsTrigger value="invest" className="text-sm">Invest</TabsTrigger>
            </TabsList>

            <TabsContent value="license" className="space-y-8 mt-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">License Our Technology</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Embed AI bill analysis into your member experience. Your brand, our engine.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {licenseCapabilities.map((cap, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                            <cap.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{cap.title}</h4>
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400">{cap.value}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{cap.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm">Deployment Options</h4>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { title: "White-Label Portal", desc: "Fully branded member experience hosted by GoldRock" },
                    { title: "API Integration", desc: "Embed analysis in your existing member portal or app" },
                    { title: "Co-Branded Solution", desc: "Joint branding combining GoldRock AI with your plan identity" },
                  ].map((opt, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">{opt.title}</h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="acquire" className="space-y-8 mt-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Strategic Acquisition</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Healthcare transparency technology is becoming essential infrastructure. Building vs. buying is a real strategic question.
                </p>
              </div>

              <div className="space-y-4">
                {acquisitionReasons.map((reason, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{i + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{reason.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{reason.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-3">What You'd Be Acquiring</h4>
                {[
                  "Production AI models for medical bill analysis and grading",
                  "Pricing benchmark database covering procedures across all 50 states",
                  "Collections defense playbook (34+ scenarios, 60+ document templates)",
                  "Partner API with HMAC authentication and quota management",
                  "Secure document vault with encrypted object storage",
                  "Consumer-grade UX designed for non-technical users",
                  "Growing user base with engagement data and feedback loops",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="invest" className="space-y-8 mt-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Strategic Investment</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Align with the shift toward healthcare transparency before your competitors do.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {investmentBenefits.map((benefit, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardContent className="p-5">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">{benefit.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-medium text-emerald-900 dark:text-emerald-300 mb-2 text-sm">Why Insurance Companies Are Uniquely Positioned</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  You already have the member relationships, the claims data, and the distribution channels.
                  GoldRock provides the technology layer that turns billing transparency from a cost center into a competitive advantage.
                  Strategic investors get preferred partnership terms and roadmap influence.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Confidential Discussion</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  We understand the sensitive nature of these conversations. Our team is prepared for confidential discussions under NDA.
                </p>
              </div>
              <div className="max-w-lg mx-auto">
                <ContactForm context="exploring a partnership" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
}
