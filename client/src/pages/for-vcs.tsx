import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import {
  Target, CheckCircle, Briefcase, ArrowLeft, Send, ArrowRight,
  TrendingUp, Building2, Users, DollarSign, Shield, Layers,
  Globe, BarChart3, Zap, Code, Mail, Lightbulb, BookOpen,
  Sparkles, FileText, Lock
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
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="bg-white dark:bg-gray-800" />
        </div>
        <div>
          <Label className="text-gray-600 dark:text-gray-400 text-sm">Email</Label>
          <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="bg-white dark:bg-gray-800" />
        </div>
      </div>
      <div>
        <Label className="text-gray-600 dark:text-gray-400 text-sm">Firm</Label>
        <Input value={form.firm} onChange={e => setForm({ ...form, firm: e.target.value })} className="bg-white dark:bg-gray-800" />
      </div>
      <div>
        <Label className="text-gray-600 dark:text-gray-400 text-sm">Message</Label>
        <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="I'd like to learn more about the investment opportunity..." rows={3} className="bg-white dark:bg-gray-800" />
      </div>
      <Button type="submit" disabled={sending} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
        <Send className="w-4 h-4 mr-2" />{sending ? "Sending..." : "Request Data Room Access"}
      </Button>
      <p className="text-xs text-gray-500 text-center">Or email: CONTACT@GOLDROCK.ai</p>
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
        <div className="max-w-5xl mx-auto px-4 pt-14 pb-24 space-y-10">
          <div>
            <Link href="/enterprise" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6">
              <ArrowLeft className="w-4 h-4 mr-1" /> Enterprise Solutions
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400 tracking-wide uppercase mb-3">For Investors</p>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-[1.1] tracking-tight">
                Healthcare billing is a multi-trillion-dollar market<br />
                <span className="text-purple-600 dark:text-purple-400">with no intelligence layer.</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-5 max-w-2xl">
                We're building it. AI-powered tools that help patients, employers, and insurers understand,
                negotiate, and resolve medical bills. Real product, real users, real revenue opportunity.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-8 max-w-2xl">
                We're raising to accelerate go-to-market and expand our B2B distribution.
                We're looking for partners who understand healthcare and can open doors.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="mailto:CONTACT@GOLDROCK.ai">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white h-11 px-6">
                    <Mail className="mr-2 h-4 w-4" /> Request Data Room
                  </Button>
                </a>
                <Link href="/enterprise">
                  <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-700 h-11 px-6">
                    See the Platform <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Investment Thesis</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {investmentThesis.map((thesis, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-5">
                      <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                        <thesis.icon className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1.5">{thesis.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{thesis.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Why Now</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Four forces converging to create this opportunity</p>
            <div className="grid md:grid-cols-2 gap-4">
              {whyNow.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{i + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="bg-gray-50 dark:bg-gray-900/50 -mx-4 px-4 py-12 rounded-xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">What We've Built</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Production features, not mockups</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productHighlights.map((product, i) => (
                <Card key={i} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1.5">{product.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/">
                <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-sm">
                  Try the Product <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Use of Funds</h2>
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-5">
                <div className="space-y-4">
                  {useOfFunds.map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-20 text-right flex-shrink-0">
                        <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{item.allocation}</span>
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-3 mb-0.5">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{item.category}</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 dark:bg-purple-400 rounded-full" style={{ width: item.allocation }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">B2B Distribution Strategy</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Multiple paths to enterprise revenue</p>
            <div className="grid md:grid-cols-3 gap-4">
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
                <Link key={i} href={ch.href}>
                  <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <ch.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{ch.title}</h4>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{ch.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">What We're Looking For in Partners</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Beyond capital</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Healthcare Domain Expertise", desc: "Investors who understand the complexities of healthcare billing, insurance dynamics, and regulatory landscape." },
                { title: "Distribution Relationships", desc: "Connections to employers, benefits brokers, insurance carriers, and health systems who could become customers or partners." },
                { title: "Enterprise Sales Experience", desc: "Experience helping portfolio companies build B2B sales motions, navigate procurement processes, and close enterprise deals." },
                { title: "Patient-First Values", desc: "Alignment with our mission to make healthcare billing fair and transparent. This is a company that does well by doing good." },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Request Data Room Access</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Get access to our financial model, product roadmap, and customer data. We'll set up a founder meeting within 48 hours.
                </p>
              </div>
              <div className="max-w-lg mx-auto">
                <ContactForm />
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
