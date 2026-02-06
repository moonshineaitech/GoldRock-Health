import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import {
  Building2, Users, DollarSign, TrendingUp, CheckCircle, ArrowRight,
  ArrowLeft, Shield, Zap, BarChart3, Heart, Target, Award,
  Briefcase, Calculator, Send, Phone, Mail, Globe, Clock,
  PieChart, Rocket, Star, HandshakeIcon, FileText, UserCheck,
  ChevronDown, ChevronUp, Lightbulb, BookOpen, Megaphone
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const pricingTiers = [
  {
    name: "Starter",
    tagline: "For growing companies",
    employees: "10-100 employees",
    price: "$3",
    per: "employee/mo",
    annual: "$2.50/employee/mo billed annually",
    minMonthly: "$99/mo minimum",
    color: "blue",
    popular: false,
    features: [
      "AI bill analysis (5 per employee/mo)",
      "Dispute letter templates",
      "Collections defense playbook",
      "Hospital bill negotiation guides",
      "State-specific legal rights",
      "Email support (48hr response)",
      "Basic usage reporting",
      "Employee self-service portal",
    ],
    notIncluded: [
      "Custom branding",
      "API access",
      "Dedicated success manager",
    ]
  },
  {
    name: "Professional",
    tagline: "Most popular for mid-market",
    employees: "100-2,000 employees",
    price: "$6",
    per: "employee/mo",
    annual: "$5/employee/mo billed annually",
    minMonthly: "$499/mo minimum",
    color: "emerald",
    popular: true,
    features: [
      "Everything in Starter",
      "Unlimited AI bill analyses",
      "Document Vault (secure file storage)",
      "Insurance denial appeal builder",
      "Real-time savings tracker dashboard",
      "Employer admin dashboard & analytics",
      "Priority support (24hr response)",
      "Custom company branding",
      "Quarterly ROI reports",
      "Employee onboarding materials",
      "Bulk employee CSV import",
      "SSO integration (SAML/OIDC)",
    ],
    notIncluded: [
      "API access",
      "Dedicated success manager",
    ]
  },
  {
    name: "Enterprise",
    tagline: "For large organizations",
    employees: "2,000+ employees",
    price: "Custom",
    per: "",
    annual: "Volume discounts available",
    minMonthly: "Contact for pricing",
    color: "purple",
    popular: false,
    features: [
      "Everything in Professional",
      "Unlimited everything",
      "Partner API access",
      "HRIS/benefits platform integration",
      "Dedicated customer success manager",
      "Custom implementation & training",
      "Executive business reviews",
      "Multi-location support",
      "Advanced analytics & benchmarking",
      "Co-branded mobile app option",
      "SLA guarantee (99.9% uptime)",
      "HIPAA BAA available",
    ],
    notIncluded: []
  }
];

const volumeDiscounts = [
  { range: "10-99", discount: "Standard pricing" },
  { range: "100-499", discount: "10% discount" },
  { range: "500-999", discount: "15% discount" },
  { range: "1,000-2,499", discount: "20% discount" },
  { range: "2,500-4,999", discount: "25% discount" },
  { range: "5,000-9,999", discount: "30% discount" },
  { range: "10,000+", discount: "35%+ custom pricing" },
];

const salesChannels = [
  {
    channel: "Benefits Brokers & Consultants",
    description: "Partner with the 50,000+ benefits brokers who advise employers on benefit selections. They influence 80% of employer benefit decisions.",
    strategy: "Offer 15-20% recurring referral commissions, provide co-branded sales materials, attend broker conferences (NAHU, BenefitsPRO), create broker certification program.",
    revenue: "High - brokers bring 10-50+ employer clients each",
    icon: HandshakeIcon,
    color: "blue"
  },
  {
    channel: "HR Technology Platforms",
    description: "Integrate with platforms where HR teams already manage benefits - Gusto, Rippling, ADP, Paychex, BambooHR, Workday.",
    strategy: "Build marketplace listings, offer API integrations, revenue-share partnerships. Employers discover you through platforms they already trust.",
    revenue: "Very High - platform distribution to millions of employers",
    icon: Globe,
    color: "purple"
  },
  {
    channel: "Insurance Carriers & TPAs",
    description: "White-label GoldRock as a member benefit within insurance plans. Carriers want to reduce claims costs and improve member satisfaction.",
    strategy: "Position as a cost-containment tool. Insurance carriers can embed analysis in member portals. TPAs add it to self-funded plan offerings.",
    revenue: "Massive - access to entire insured populations",
    icon: Shield,
    color: "emerald"
  },
  {
    channel: "Direct Enterprise Sales",
    description: "Outbound to large employers (1,000+ employees) through HR/Benefits decision makers. Target companies with high healthcare spend.",
    strategy: "Account-based marketing, LinkedIn outreach to CHROs/VP Benefits, conference sponsorships (SHRM, HLTH), case studies from early adopters.",
    revenue: "High - large ACV deals ($50K-$500K+/year)",
    icon: Target,
    color: "amber"
  },
  {
    channel: "Self-Service PLG for SMBs",
    description: "Small and mid-size businesses (10-500 employees) sign up directly through website, free trial, and credit card checkout.",
    strategy: "Content marketing (SEO for 'employee benefits medical bills'), Google Ads targeting HR managers, free pilot for 30 days, no sales team needed.",
    revenue: "Volume - thousands of small deals at low CAC",
    icon: Rocket,
    color: "cyan"
  },
  {
    channel: "Channel Partners & Resellers",
    description: "Benefits administration firms, PEOs (Professional Employer Organizations), and healthcare consultancies resell to their clients.",
    strategy: "White-label option, partner portal, tiered commission structure, co-marketing funds. PEOs alone serve 4M+ worksite employees.",
    revenue: "High - leverage existing relationships",
    icon: Users,
    color: "pink"
  }
];

const salesPlaybook = [
  {
    phase: "Phase 1: Hook",
    title: "Lead with the Problem",
    tactics: [
      "Open with: 'Your employees are losing $3,000-$5,000/year to medical billing errors they don't know about.'",
      "Share that 80% of medical bills contain errors (per AARP/Medical Billing Advocates of America).",
      "Medical debt is the #1 cause of personal bankruptcy - it affects productivity and retention.",
      "Healthcare costs rose 7% last year. Employees are absorbing more of those costs through higher deductibles.",
    ]
  },
  {
    phase: "Phase 2: Quantify",
    title: "Show the ROI",
    tactics: [
      "Average employee saves $2,400-$4,800/year using GoldRock tools.",
      "At $6/employee/mo ($72/year), that's a 33-67x ROI for the employer.",
      "Reduced financial stress = 23% less absenteeism (Financial Health Network study).",
      "Employees rate medical bill help as a top-5 desired benefit - it's a retention differentiator.",
      "Run the ROI calculator live during the pitch: enter their employee count and watch the numbers.",
    ]
  },
  {
    phase: "Phase 3: Differentiate",
    title: "Why GoldRock Beats Alternatives",
    tactics: [
      "EAPs offer generic financial counseling - we provide specific, AI-powered medical bill action plans.",
      "Traditional advocacy services cost $15-$30/employee/mo and require phone calls. We're 1/5 the price with 24/7 AI.",
      "Our collections defense playbook covers 34+ real-world scenarios - nothing else on the market does this.",
      "White-label option means it feels like YOUR company's benefit, not a third-party tool.",
      "Real-time analytics dashboard shows HR exactly how much employees are saving.",
    ]
  },
  {
    phase: "Phase 4: Close",
    title: "Make It Easy to Say Yes",
    tactics: [
      "Offer a free 30-day pilot for up to 100 employees - no credit card, no commitment.",
      "Month-to-month contracts available (annual gets 15-20% discount).",
      "Implementation takes less than 1 week - just send employee invite emails.",
      "No IT integration required for Starter/Professional tiers.",
      "Provide the CFO one-pager: cost vs. savings projection specific to their company size.",
    ]
  }
];

const objectionHandlers = [
  {
    objection: "We already have an EAP that covers financial wellness.",
    response: "EAPs provide general financial counseling. GoldRock provides specific, AI-powered analysis of each employee's actual medical bills with dispute templates, negotiation scripts, and collections defense strategies. Think of it as the difference between a general doctor and a specialist - both valuable, but the specialist solves the specific problem."
  },
  {
    objection: "Our employees can negotiate bills themselves.",
    response: "Most people don't know where to start, what's negotiable, or what their rights are. 70% of Americans don't dispute medical bills because it feels too complicated. GoldRock makes it as easy as uploading a photo of the bill - the AI does the analysis and tells them exactly what to say."
  },
  {
    objection: "We don't have the budget for another benefit.",
    response: "GoldRock pays for itself many times over. At $6/employee/month, if even 20% of employees use it and save an average of $2,400/year, the ROI is 13:1. Plus, reduced financial stress means fewer sick days, higher productivity, and better retention - which saves you recruiting costs."
  },
  {
    objection: "How do we know employees will actually use it?",
    response: "Medical bills are one of the few benefits with built-in urgency - when someone gets a $5,000 bill, they'll use any tool available. We see 40-60% adoption rates within 6 months, compared to 5-8% for most wellness programs. We also provide onboarding kits, email templates, and posters to drive awareness."
  },
  {
    objection: "We need to protect employee privacy / HIPAA concerns.",
    response: "GoldRock is built privacy-first. All documents are encrypted at rest and in transit. We don't store medical records - we analyze bills. The employer admin dashboard only shows aggregate savings data, never individual employee information. We offer HIPAA BAAs for Enterprise tier."
  },
  {
    objection: "Can we try it before committing?",
    response: "Absolutely. We offer a free 30-day pilot for up to 100 employees. No credit card required. At the end of the pilot, we'll show you exactly how much your employees saved. Most companies convert after seeing real savings numbers from their own workforce."
  }
];

const massScaleStrategies = [
  {
    title: "Benefits Broker Blitz",
    description: "The highest-leverage channel. One broker relationship = 10-50+ employer clients.",
    steps: [
      "Build a broker partner program with tiered commissions (15% Year 1, 10% ongoing)",
      "Create a turnkey 'Broker Toolkit' with pitch decks, one-pagers, ROI calculators",
      "Attend top 5 broker conferences annually (NAHU, BenefitsPRO, SHRM, HLTH, HR Tech)",
      "Hire 2-3 Channel Account Managers dedicated to broker relationships",
      "Offer broker co-branded webinars and CE credits for insurance continuing education",
      "Target top 200 benefits brokerages by revenue (Lockton, Marsh McLennan, Gallagher, etc.)"
    ],
    metric: "Target: 500 broker partners, 5,000 employer clients by Year 2"
  },
  {
    title: "HR Tech Marketplace Domination",
    description: "Get listed where HR teams already shop for benefits.",
    steps: [
      "Build integrations for Gusto, Rippling, ADP, Paychex, BambooHR marketplaces",
      "Optimize marketplace listings with screenshots, ROI data, and reviews",
      "Offer 'one-click activation' from within HR platforms",
      "Run co-marketing campaigns with platform partners",
      "Create an open API for any HRIS to integrate GoldRock as a benefit"
    ],
    metric: "Target: Listed on 10+ HR platforms, 10,000 SMB signups by Year 2"
  },
  {
    title: "Content-Led Inbound Engine",
    description: "Become the authority on employee medical bill advocacy. HR managers will find YOU.",
    steps: [
      "Publish weekly content: 'Medical Bill Reduction for HR Leaders' blog series",
      "Create downloadable assets: 'The CFO's Guide to Healthcare Cost Reduction'",
      "Launch a monthly webinar: 'How Companies Are Cutting Employee Healthcare Costs'",
      "Build an SEO moat around terms like 'employee medical bill benefit', 'workplace financial wellness'",
      "Produce the annual 'State of Medical Debt in the Workplace' report with original data"
    ],
    metric: "Target: 50,000 monthly organic visitors, 2,000 qualified leads/month by Year 2"
  },
  {
    title: "Enterprise Account-Based Marketing",
    description: "For Fortune 5000 companies, run targeted ABM campaigns to specific decision makers.",
    steps: [
      "Identify top 500 target accounts by employee count and healthcare spend",
      "Run LinkedIn ABM ads targeting CHROs, VP Benefits, and Benefits Directors",
      "Send personalized direct mail with custom ROI projections per company",
      "Offer executive briefings and on-site presentations",
      "Leverage case studies from similar-sized companies in same industry"
    ],
    metric: "Target: 50 enterprise deals ($100K+ ACV), $5M ARR from enterprise by Year 2"
  }
];

function ROICalculator() {
  const [employees, setEmployees] = useState(500);
  const [avgSalary, setAvgSalary] = useState(65000);
  const [tier, setTier] = useState("professional");

  const perEmployee = tier === "starter" ? 3 : tier === "professional" ? 6 : 8;
  const annualCost = employees * perEmployee * 12;
  const adoptionRate = 0.45;
  const avgSavings = 3200;
  const employeeSavings = Math.round(employees * adoptionRate * avgSavings);
  const roi = Math.round((employeeSavings / annualCost) * 100) / 100;
  const retentionValue = Math.round(employees * 0.02 * avgSalary * 0.33);
  const productivityGain = Math.round(employees * 0.15 * avgSalary * 0.03);
  const totalValue = employeeSavings + retentionValue + productivityGain;

  let discount = 0;
  if (employees >= 10000) discount = 35;
  else if (employees >= 5000) discount = 30;
  else if (employees >= 2500) discount = 25;
  else if (employees >= 1000) discount = 20;
  else if (employees >= 500) discount = 15;
  else if (employees >= 100) discount = 10;

  const discountedAnnual = Math.round(annualCost * (1 - discount / 100));

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
          <Calculator className="w-5 h-5 text-blue-600" />
          ROI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-gray-700 dark:text-gray-300">Number of Employees</Label>
            <Input
              type="number"
              value={employees}
              onChange={(e) => setEmployees(Math.max(10, parseInt(e.target.value) || 10))}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300">Average Salary</Label>
            <Input
              type="number"
              value={avgSalary}
              onChange={(e) => setAvgSalary(parseInt(e.target.value) || 50000)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300">Plan Tier</Label>
            <Select value={tier} onValueChange={setTier}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="starter">Starter ($3/emp/mo)</SelectItem>
                <SelectItem value="professional">Professional ($6/emp/mo)</SelectItem>
                <SelectItem value="enterprise">Enterprise (Custom)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">${discountedAnnual.toLocaleString()}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Annual Cost</p>
            {discount > 0 && <Badge className="mt-1 bg-blue-100 text-blue-700 text-[10px]">{discount}% volume discount</Badge>}
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">${employeeSavings.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Employee Savings</p>
            <p className="text-[10px] text-emerald-500 mt-1">45% adoption rate</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">${totalValue.toLocaleString()}</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Total Annual Value</p>
            <p className="text-[10px] text-purple-500 mt-1">Savings + retention + productivity</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{roi}x</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Direct ROI</p>
            <p className="text-[10px] text-amber-500 mt-1">On bill savings alone</p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p><strong>Assumptions:</strong> 45% employee adoption (industry avg for financial wellness with built-in urgency), $3,200 avg annual savings per active user, 2% turnover reduction, 3% productivity gain from reduced financial stress.</p>
          <p>Retention value = employees x 2% reduced turnover x salary x 33% replacement cost. Productivity = employees x 15% financially stressed x salary x 3% gain.</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ContactForm() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", company: "", size: "", message: "" });

  const handleSubmit = () => {
    if (!form.email || !form.company) {
      toast({ title: "Please fill in your email and company name", variant: "destructive" });
      return;
    }
    toast({ title: "Request received! We'll be in touch within 24 hours.", description: "Check your email for next steps." });
    setForm({ name: "", email: "", company: "", size: "", message: "" });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Your Name</Label>
          <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Work Email</Label>
          <Input type="email" placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Company</Label>
          <Input placeholder="Company name" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </div>
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Company Size</Label>
          <Select value={form.size} onValueChange={(v) => setForm({ ...form, size: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10-99">10-99 employees</SelectItem>
              <SelectItem value="100-499">100-499 employees</SelectItem>
              <SelectItem value="500-999">500-999 employees</SelectItem>
              <SelectItem value="1000-4999">1,000-4,999 employees</SelectItem>
              <SelectItem value="5000+">5,000+ employees</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-gray-700 dark:text-gray-300">Tell us about your needs</Label>
        <Textarea
          placeholder="What challenges are your employees facing with medical bills? What does your current benefits stack look like?"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={3}
        />
      </div>
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit}>
        <Send className="w-4 h-4 mr-2" />
        Get Your Custom Proposal
      </Button>
      <p className="text-xs text-center text-gray-500">Or email us directly: CONTACT@GOLDROCK.ai</p>
    </div>
  );
}

function ExpandableSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <span className="font-semibold text-gray-900 dark:text-white text-left">{title}</span>
        {open ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      {open && <div className="p-4 bg-white dark:bg-gray-800">{children}</div>}
    </div>
  );
}

export default function ForEmployers() {
  const [activeTab, setActiveTab] = useState("pricing");

  return (
    <>
      <SEOHead
        title="GoldRock Health for Employers | Medical Bill Reduction as an Employee Benefit"
        description="Offer AI-powered medical bill analysis as an employee benefit. Average $3,200/year savings per employee. 33-67x ROI. Free 30-day pilot. Pricing from $3/employee/month."
        keywords={["employee benefits medical bills", "workplace financial wellness", "employer medical bill reduction", "HR benefits platform", "employee healthcare costs", "medical debt employee benefit"]}
        canonicalPath="/for-employers"
      />

      <MobileHeader title="For Employers" />

      <div className="min-h-screen bg-gray-50 dark:bg-[#0a1628]">
        <div className="max-w-6xl mx-auto px-4 py-8 pb-24 space-y-8">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 md:p-12 text-white text-center"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 text-sm px-4 py-1">
              Employee Benefits Platform
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Medical Bills Are Crushing<br />Your Employees' Finances
            </h1>
            <p className="text-xl text-blue-100 mb-2 max-w-3xl mx-auto">
              100 million Americans carry medical debt. Your employees are among them.
            </p>
            <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
              GoldRock Health gives your workforce AI-powered tools to fight back -
              reducing bills by 40-80% and building loyalty that money can't buy.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8">
                <Rocket className="mr-2 h-5 w-5" /> Start Free 30-Day Pilot
              </Button>
              <a href="mailto:CONTACT@GOLDROCK.ai">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Mail className="mr-2 h-5 w-5" /> CONTACT@GOLDROCK.ai
                </Button>
              </a>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: DollarSign, value: "$3,200", label: "Avg savings per employee/year", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
              { icon: TrendingUp, value: "33-67x", label: "Employer ROI on investment", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
              { icon: Users, value: "45%", label: "Average employee adoption", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/30" },
              { icon: Clock, value: "<1 week", label: "Implementation time", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                <Card className={`${stat.bg} border-none text-center`}>
                  <CardContent className="py-5">
                    <stat.icon className={`w-6 h-6 mx-auto ${stat.color} mb-2`} />
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">The Problem You're Solving</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { stat: "100M", label: "Americans with medical debt", detail: "Many are your employees, silently struggling" },
                  { stat: "80%", label: "of medical bills have errors", detail: "Overcharges, duplicate charges, wrong codes" },
                  { stat: "$4,600", label: "average unexpected medical bill", detail: "Leading cause of employee financial stress" },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">{item.stat}</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="pricing" className="text-xs md:text-sm">Pricing</TabsTrigger>
              <TabsTrigger value="roi" className="text-xs md:text-sm">ROI Calculator</TabsTrigger>
              <TabsTrigger value="playbook" className="text-xs md:text-sm">Sales Playbook</TabsTrigger>
              <TabsTrigger value="channels" className="text-xs md:text-sm">Channels</TabsTrigger>
              <TabsTrigger value="scale" className="text-xs md:text-sm">Scale Strategy</TabsTrigger>
            </TabsList>

            <TabsContent value="pricing" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-3 gap-6">
                {pricingTiers.map((plan, i) => (
                  <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className={`relative h-full ${plan.popular ? 'border-2 border-emerald-500 dark:border-emerald-400 shadow-lg' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800`}>
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-emerald-500 text-white px-4 py-1">Most Popular</Badge>
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{plan.tagline}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{plan.employees}</p>
                        </div>
                        <div className="text-center py-4">
                          <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                          {plan.per && <span className="text-gray-500 dark:text-gray-400 ml-1">/{plan.per}</span>}
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{plan.annual}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{plan.minMonthly}</p>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {plan.features.map((f, j) => (
                          <div key={j} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                        {plan.notIncluded.map((f, j) => (
                          <div key={j} className="flex items-start gap-2 text-sm text-gray-400 dark:text-gray-500">
                            <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-center">-</span>
                            <span>{f}</span>
                          </div>
                        ))}
                        <Button className={`w-full mt-4 ${plan.popular ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                          {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-base text-gray-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    Volume Discounts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {volumeDiscounts.map((vd) => (
                      <div key={vd.range} className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{vd.range}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{vd.discount}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                    All plans include a free 30-day pilot. Annual contracts receive an additional 15-20% discount. Multi-year deals negotiable.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="py-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 text-center">What's Included in Every Plan</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      "AI-powered bill analysis",
                      "Collections defense (34+ scenarios)",
                      "Hospital bill playbook",
                      "Negotiation scripts & templates",
                      "State-specific legal rights",
                      "Insurance denial help",
                      "Financial assistance finder",
                      "Secure Document Vault",
                    ].map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roi" className="space-y-6 mt-6">
              <ROICalculator />

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-base text-gray-900 dark:text-white">The Business Case for CFOs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">Direct Financial Impact</h4>
                      {[
                        "Employees save $2,400-$4,800/year on medical bills",
                        "Reduced healthcare utilization from financial stress",
                        "Lower absenteeism (23% reduction per Financial Health Network)",
                        "Decreased emergency financial requests to HR",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <DollarSign className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">Indirect Business Value</h4>
                      {[
                        "Competitive differentiator in talent market",
                        "Improved employee retention (2-5% reduction in turnover)",
                        "Higher employee satisfaction scores (NPS +15 avg)",
                        "Demonstrates company cares about total wellbeing",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Heart className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                <CardContent className="py-6 text-center">
                  <Award className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">The Bottom Line</h3>
                  <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                    For a 500-person company on the Professional plan, GoldRock costs about <strong>$36,000/year</strong>.
                    With 45% adoption and $3,200 avg savings, employees collectively save <strong>$720,000/year</strong>.
                    That's a <strong>20x return</strong> - before counting retention, productivity, and satisfaction gains.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="playbook" className="space-y-6 mt-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    The GoldRock Sales Playbook
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Step-by-step guide for selling to employers at scale</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {salesPlaybook.map((phase, i) => (
                    <div key={i} className="border-l-4 border-blue-500 pl-4">
                      <Badge className="mb-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">{phase.phase}</Badge>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-3">{phase.title}</h4>
                      <div className="space-y-2">
                        {phase.tactics.map((tactic, j) => (
                          <div key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span>{tactic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                    <Shield className="w-5 h-5 text-red-500" />
                    Objection Handling Guide
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Responses to the most common pushbacks from HR & CFOs</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {objectionHandlers.map((oh, i) => (
                    <ExpandableSection key={i} title={`"${oh.objection}"`}>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{oh.response}</p>
                    </ExpandableSection>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="py-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    Sales Collateral Checklist
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "One-page CFO summary with ROI projections",
                      "Employee-facing benefits overview flyer",
                      "Pilot program proposal template",
                      "Case study deck (by industry & company size)",
                      "ROI calculator spreadsheet (customizable)",
                      "Implementation timeline & onboarding guide",
                      "Compliance & security whitepaper (HIPAA, SOC 2)",
                      "Co-branded presentation for broker partners",
                      "Employee onboarding email templates (5-email drip)",
                      "Desk tent cards & break room posters for awareness",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="channels" className="space-y-6 mt-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">6 Channels to Sell in Mass</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Multi-channel approach for maximum employer reach</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {salesChannels.map((ch, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-${ch.color}-100 dark:bg-${ch.color}-900/30 flex items-center justify-center`}>
                            <ch.icon className={`w-5 h-5 text-${ch.color}-600 dark:text-${ch.color}-400`} />
                          </div>
                          <div>
                            <CardTitle className="text-base text-gray-900 dark:text-white">{ch.channel}</CardTitle>
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-[10px] mt-1">Revenue: {ch.revenue}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{ch.description}</p>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Strategy:</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{ch.strategy}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scale" className="space-y-6 mt-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mass-Market Scale Strategies</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">How to go from 0 to 10,000+ employer clients</p>
              </div>

              {massScaleStrategies.map((strategy, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base text-gray-900 dark:text-white">{strategy.title}</CardTitle>
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs">Strategy {i + 1}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{strategy.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        {strategy.steps.map((step, j) => (
                          <div key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 mt-3">
                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                          <Target className="w-3 h-3" /> {strategy.metric}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-none text-white">
                <CardContent className="py-8 text-center">
                  <Megaphone className="w-10 h-10 mx-auto mb-3 text-blue-200" />
                  <h3 className="text-xl font-bold mb-2">Revenue Model at Scale</h3>
                  <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-4 mb-6">
                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-2xl font-bold">Year 1</p>
                      <p className="text-sm text-blue-200">500 employers</p>
                      <p className="text-sm text-blue-200">~50K employees</p>
                      <p className="text-xl font-bold text-emerald-300 mt-2">$2.4M ARR</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-2xl font-bold">Year 2</p>
                      <p className="text-sm text-blue-200">5,000 employers</p>
                      <p className="text-sm text-blue-200">~500K employees</p>
                      <p className="text-xl font-bold text-emerald-300 mt-2">$18M ARR</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-2xl font-bold">Year 3</p>
                      <p className="text-sm text-blue-200">20,000 employers</p>
                      <p className="text-sm text-blue-200">~2M employees</p>
                      <p className="text-xl font-bold text-emerald-300 mt-2">$72M ARR</p>
                    </div>
                  </div>
                  <p className="text-sm text-blue-200 max-w-xl mx-auto">
                    Based on avg 100 employees/employer, $4.50 blended ARPU, 
                    85% gross margin, 120% net dollar retention from employer seat expansion.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-base text-gray-900 dark:text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                    Key Metrics to Track
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { metric: "CAC", target: "<$500 for SMB, <$5K for Enterprise", desc: "Customer Acquisition Cost" },
                      { metric: "LTV:CAC", target: ">5:1", desc: "Lifetime Value to Acquisition Cost" },
                      { metric: "Payback", target: "<6 months", desc: "CAC Payback Period" },
                      { metric: "NDR", target: ">120%", desc: "Net Dollar Retention (seat expansion)" },
                      { metric: "Logo Churn", target: "<5% annual", desc: "Employer customer churn rate" },
                      { metric: "Adoption", target: ">40%", desc: "Employee activation rate within 90 days" },
                    ].map((m) => (
                      <div key={m.metric} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{m.metric}</p>
                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{m.target}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="py-8">
              <div className="text-center mb-6">
                <Building2 className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Ready to Help Your Employees Save?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Get a custom proposal based on your company size, industry, and needs. Free 30-day pilot available.
                </p>
              </div>
              <div className="max-w-xl mx-auto">
                <ContactForm />
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/employer" className="block">
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="py-5 text-center">
                  <UserCheck className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Employer Portal</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Already a client? Manage your organization</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/partner-api" className="block">
              <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="py-5 text-center">
                  <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Partner API</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Embed our analysis engine in your platform</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/enterprise" className="block">
              <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="py-5 text-center">
                  <Globe className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Enterprise Solutions</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">For insurers, TPAs, and healthcare providers</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
}
