import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import {
  Building2, CheckCircle, Zap, ArrowRight, ArrowLeft, Send, Mail,
  HeartPulse, Shield, Users, DollarSign, FileText, BarChart3,
  Eye, TrendingDown, AlertTriangle, Layers, Lock, Globe
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
          <Label className="text-gray-600 dark:text-gray-400 text-sm">Name</Label>
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="bg-white dark:bg-gray-800" />
        </div>
        <div>
          <Label className="text-gray-600 dark:text-gray-400 text-sm">Work Email</Label>
          <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="bg-white dark:bg-gray-800" />
        </div>
      </div>
      <div>
        <Label className="text-gray-600 dark:text-gray-400 text-sm">Organization</Label>
        <Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="bg-white dark:bg-gray-800" />
      </div>
      <div>
        <Label className="text-gray-600 dark:text-gray-400 text-sm">Message</Label>
        <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder={`I'm interested in ${context}...`} rows={3} className="bg-white dark:bg-gray-800" />
      </div>
      <Button type="submit" disabled={sending} className="w-full bg-rose-600 hover:bg-rose-700 text-white">
        <Send className="w-4 h-4 mr-2" />{sending ? "Sending..." : "Start the Conversation"}
      </Button>
      <p className="text-xs text-gray-500 text-center">Or email us directly: CONTACT@GOLDROCK.ai</p>
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

      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 pt-14 pb-24 space-y-10">
          <div>
            <Link href="/enterprise" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6">
              <ArrowLeft className="w-4 h-4 mr-1" /> Enterprise Solutions
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <p className="text-sm font-medium text-rose-600 dark:text-rose-400 tracking-wide uppercase mb-3">For Healthcare Companies</p>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-[1.1] tracking-tight">
                Patients who understand<br />their bills actually pay them.
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-2xl">
                Complex billing drives confusion, disputes, and bad debt. GoldRock gives health systems tools to make billing
                transparent, help patients find assistance, and build the kind of trust that keeps them coming back.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="mailto:CONTACT@GOLDROCK.ai">
                  <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white h-11 px-6">
                    <Mail className="mr-2 h-4 w-4" /> Let's Talk Partnership
                  </Button>
                </a>
                <Link href="/partner-api">
                  <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-700 h-11 px-6">
                    Technical Integration <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">The Reality of Patient Billing</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">These problems are getting worse, not better</p>
            <div className="grid md:grid-cols-2 gap-5">
              {providerPainPoints.map((pp, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{pp.problem}</h3>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">{pp.impact}</p>
                      <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 border border-rose-200 dark:border-rose-800">
                        <p className="text-sm text-rose-800 dark:text-rose-300"><span className="font-medium">How we help:</span> {pp.solution}</p>
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
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Embed patient financial tools into your existing systems. Reduce billing confusion, improve collections, and build patient trust.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {licenseFeatures.map((feat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
                            <feat.icon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{feat.title}</h4>
                            <p className="text-[11px] text-rose-600 dark:text-rose-400">{feat.value}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feat.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm">Integration Options</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    "EHR/EMR via FHIR APIs",
                    "Patient portal embedding",
                    "Revenue cycle system plugins",
                    "Custom enterprise API",
                    "Mobile app SDK",
                    "Dedicated implementation support"
                  ].map((opt, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <CheckCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="acquire" className="space-y-8 mt-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Strategic Acquisition</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Own the patient financial experience. Build vs. buy is a real strategic question in health system innovation.
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
                  "Production AI models trained on medical billing patterns",
                  "Fair-price benchmark database covering procedures nationwide",
                  "Consumer-grade UX designed for non-technical patients",
                  "Collections defense library with 34+ scenario playbooks",
                  "FHIR-compatible API architecture",
                  "Secure document vault infrastructure",
                  "Growing user base with real engagement data",
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
                  Shape the future of patient financial experience from the inside.
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

              <div className="bg-rose-50 dark:bg-rose-950/30 rounded-xl p-5 border border-rose-200 dark:border-rose-800">
                <h4 className="font-medium text-rose-900 dark:text-rose-300 mb-2 text-sm">Why Health Systems Are Uniquely Positioned</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  You see the patient billing journey from the other side. You know where the friction points are.
                  A strategic investment lets you shape technology that addresses those friction points while
                  creating a new patient engagement channel. Investors get preferred partnership terms,
                  board participation, and first access to new capabilities.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center mx-auto mb-4">
                  <HeartPulse className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Let's Explore Partnership</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Our team is ready to discuss how GoldRock Health can support your organization's goals - whether that's licensing, acquisition, or investment.
                </p>
              </div>
              <div className="max-w-lg mx-auto">
                <ContactForm context="healthcare partnership" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MedicalChatbot />
      <MobileBottomNav />
    </>
  );
}
