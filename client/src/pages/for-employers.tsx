import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import {
  Building2, Users, DollarSign, TrendingUp, CheckCircle, ArrowRight,
  ArrowLeft, Shield, Zap, Heart, Target, Calculator, Send, Mail,
  Clock, Briefcase, FileText, ChevronDown, ChevronUp, Lightbulb,
  BookOpen, UserCheck, Globe, Upload, Brain, AlertTriangle, X,
  Phone, HelpCircle, Sparkles, Play
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import employersHero from "@assets/images/employers-hero.jpg";
import familyRelief from "@assets/images/family-relief.jpg";

const pricingTiers = [
  {
    name: "Starter",
    tagline: "For growing companies",
    employees: "10 - 100 employees",
    price: "$3",
    per: "employee/mo",
    annual: "$2.50/employee/mo billed annually",
    popular: false,
    features: [
      "AI bill analysis (5 per employee/mo)",
      "Dispute letter templates",
      "Collections defense playbook",
      "Hospital bill negotiation guides",
      "State-specific legal rights",
      "Email support",
      "Basic usage reporting",
    ],
  },
  {
    name: "Professional",
    tagline: "Best value for mid-market",
    employees: "100 - 2,000 employees",
    price: "$6",
    per: "employee/mo",
    annual: "$5/employee/mo billed annually",
    popular: true,
    features: [
      "Everything in Starter",
      "Unlimited AI bill analyses",
      "Document Vault (secure file storage)",
      "Insurance denial appeal builder",
      "Savings tracker dashboard",
      "Employer admin dashboard & analytics",
      "Priority support",
      "Custom company branding",
      "Quarterly ROI reports",
      "Bulk employee CSV import",
      "SSO integration (SAML/OIDC)",
    ],
  },
  {
    name: "Enterprise",
    tagline: "For large organizations",
    employees: "2,000+ employees",
    price: "Custom",
    per: "",
    annual: "Volume discounts available",
    popular: false,
    features: [
      "Everything in Professional",
      "Partner API access",
      "HRIS / benefits platform integration",
      "Dedicated customer success manager",
      "Custom implementation & training",
      "Multi-location support",
      "Advanced analytics & benchmarking",
      "SLA guarantee",
      "HIPAA BAA available",
    ],
  }
];

const volumeDiscounts = [
  { range: "10 - 99", discount: "Standard pricing" },
  { range: "100 - 499", discount: "10% off" },
  { range: "500 - 999", discount: "15% off" },
  { range: "1,000 - 2,499", discount: "20% off" },
  { range: "2,500 - 4,999", discount: "25% off" },
  { range: "5,000+", discount: "30%+ custom" },
];

const salesChannels = [
  {
    title: "Benefits Brokers & Consultants",
    description: "Partner with the brokers who advise employers on benefit selections. They influence most employer benefit decisions and can introduce GoldRock to their entire book of business.",
    strategy: "Referral commissions, co-branded sales materials, broker conferences (NAHU, BenefitsPRO), certification program.",
    icon: Users,
  },
  {
    title: "HR Technology Platforms",
    description: "Integrate with platforms where HR teams already manage benefits - Gusto, Rippling, ADP, Paychex, BambooHR. Employers discover you through platforms they already trust.",
    strategy: "Marketplace listings, API integrations, revenue-share partnerships.",
    icon: Globe,
  },
  {
    title: "Insurance Carriers & TPAs",
    description: "White-label GoldRock as a member benefit within insurance plans. Carriers reduce claims costs; TPAs add it to self-funded plan offerings.",
    strategy: "Position as cost-containment tool. Embed analysis in member portals.",
    icon: Shield,
  },
  {
    title: "Direct Enterprise Sales",
    description: "Outbound to large employers through HR and Benefits decision makers. Target companies with high healthcare spend per employee.",
    strategy: "Account-based marketing, LinkedIn outreach to CHROs, conference sponsorships (SHRM, HLTH).",
    icon: Target,
  },
  {
    title: "Self-Service for SMBs",
    description: "Small and mid-size businesses sign up directly through the website with a free trial and credit card checkout. No sales team needed.",
    strategy: "Content marketing, Google Ads targeting HR managers, 30-day free pilot.",
    icon: Zap,
  },
  {
    title: "Channel Partners & PEOs",
    description: "Benefits administration firms and PEOs (Professional Employer Organizations) resell to their clients, leveraging existing relationships.",
    strategy: "White-label option, partner portal, tiered commission structure.",
    icon: Briefcase,
  }
];

const salesPlaybook = [
  {
    phase: "1. Lead with the Problem",
    tactics: [
      "Medical billing errors are far more common than most patients realize - industry studies consistently find significant error rates.",
      "Medical debt is a leading contributor to personal bankruptcy in the United States.",
      "Healthcare costs continue to rise faster than wages, with employees absorbing more through higher deductibles each year.",
      "Most employees don't know they can negotiate or dispute medical bills.",
    ]
  },
  {
    phase: "2. Show the Value",
    tactics: [
      "Employees using bill analysis tools frequently identify savings opportunities they would have otherwise missed.",
      "Reduced financial stress has been linked to lower absenteeism and higher retention in workplace studies.",
      "Medical bill assistance is increasingly one of the most-requested employee benefits.",
      "Run the ROI calculator during the pitch with their actual employee count.",
    ]
  },
  {
    phase: "3. Differentiate",
    tactics: [
      "EAPs offer generic financial counseling. GoldRock provides specific, AI-powered action plans for actual medical bills.",
      "Traditional advocacy services are significantly more expensive per employee and require phone calls. GoldRock offers 24/7 AI availability at a fraction of the cost.",
      "Our collections defense playbook covers 34+ real-world scenarios - a level of coverage that's hard to find elsewhere.",
      "Analytics dashboard shows HR exactly what's happening - engagement, usage patterns, and aggregate data.",
    ]
  },
  {
    phase: "4. Make It Easy to Say Yes",
    tactics: [
      "Free 30-day pilot for up to 100 employees. No credit card, no commitment.",
      "Month-to-month contracts available. Annual billing gets additional discount.",
      "Implementation takes days, not months. Just send employee invite emails.",
      "No IT integration required for Starter and Professional tiers.",
    ]
  }
];

const objectionHandlers = [
  {
    objection: "We already have an EAP that covers financial wellness.",
    response: "EAPs provide general financial counseling. GoldRock analyzes each employee's actual medical bills with specific dispute templates, negotiation scripts, and collections defense strategies. It's the difference between general advice and a specific action plan for a specific bill."
  },
  {
    objection: "Our employees can negotiate bills themselves.",
    response: "Most people don't know where to start, what's negotiable, or what rights they have. The vast majority of Americans never dispute their medical bills because it feels too complicated. GoldRock makes it as simple as uploading a photo of the bill."
  },
  {
    objection: "We don't have the budget for another benefit.",
    response: "At $3 - $6/employee/month, if even a fraction of employees use it and identify savings on a single bill, the investment pays for itself. Lower financial stress also means fewer sick days and better retention."
  },
  {
    objection: "How do we know employees will actually use it?",
    response: "Medical bills create built-in urgency. When someone gets a $5,000 bill, they'll use any tool available. We also provide onboarding kits, email templates, and awareness materials to drive adoption."
  },
  {
    objection: "What about privacy and HIPAA?",
    response: "GoldRock is built privacy-first. Documents are encrypted at rest and in transit. The employer dashboard only shows aggregate data, never individual employee information. HIPAA BAAs are available for Enterprise tier."
  },
  {
    objection: "Can we try it first?",
    response: "Yes. Free 30-day pilot for up to 100 employees. No credit card required. At the end of the pilot, we'll share a report showing what employees found."
  }
];

function ROICalculator() {
  const [employees, setEmployees] = useState(500);
  const [tier, setTier] = useState("professional");

  const perEmployee = tier === "starter" ? 3 : tier === "professional" ? 6 : 8;
  const annualCost = employees * perEmployee * 12;

  let discount = 0;
  if (employees >= 5000) discount = 30;
  else if (employees >= 2500) discount = 25;
  else if (employees >= 1000) discount = 20;
  else if (employees >= 500) discount = 15;
  else if (employees >= 100) discount = 10;

  const discountedAnnual = Math.round(annualCost * (1 - discount / 100));
  const costPerEmployeePerYear = Math.round(discountedAnnual / employees);
  const breakEvenBills = Math.ceil(discountedAnnual / 800);

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
          <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Cost Estimator
        </CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">See what GoldRock would cost for your organization.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-700 dark:text-gray-300 text-sm">Number of Employees</Label>
            <Input
              type="number"
              value={employees}
              onChange={(e) => setEmployees(Math.max(10, parseInt(e.target.value) || 10))}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300 text-sm">Plan Tier</Label>
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

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl p-4 text-center border border-blue-100 dark:border-blue-800/30">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${discountedAnnual.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Annual investment</p>
            {discount > 0 && <Badge className="mt-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-[10px]">{discount}% volume discount</Badge>}
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-xl p-4 text-center border border-emerald-100 dark:border-emerald-800/30">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${costPerEmployeePerYear}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Per employee / year</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/20 rounded-xl p-4 text-center border border-amber-100 dark:border-amber-800/30">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{breakEvenBills}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bills to break even*</p>
          </div>
        </div>

        <p className="text-[11px] text-gray-400 dark:text-gray-500">
          *Assumes average savings of ~$800 per successfully disputed or negotiated bill. Actual results vary based on bill amounts, procedures, and geography.
        </p>
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
    toast({ title: "Request received", description: "We'll be in touch within one business day." });
    setForm({ name: "", email: "", company: "", size: "", message: "" });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-gray-600 dark:text-gray-400 text-sm">Your Name</Label>
          <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <Label className="text-gray-600 dark:text-gray-400 text-sm">Work Email</Label>
          <Input type="email" placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-gray-600 dark:text-gray-400 text-sm">Company</Label>
          <Input placeholder="Company name" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </div>
        <div>
          <Label className="text-gray-600 dark:text-gray-400 text-sm">Company Size</Label>
          <Select value={form.size} onValueChange={(v) => setForm({ ...form, size: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10-99">10 - 99</SelectItem>
              <SelectItem value="100-499">100 - 499</SelectItem>
              <SelectItem value="500-999">500 - 999</SelectItem>
              <SelectItem value="1000-4999">1,000 - 4,999</SelectItem>
              <SelectItem value="5000+">5,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-gray-600 dark:text-gray-400 text-sm">What challenges are you trying to solve?</Label>
        <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} />
      </div>
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit}>
        <Send className="w-4 h-4 mr-2" /> Get a Custom Proposal
      </Button>
      <p className="text-xs text-center text-gray-500 dark:text-gray-400">Or email directly: CONTACT@GOLDROCK.ai</p>
    </div>
  );
}

function ExpandableItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const floatingPills = [
  { label: "From $3/emp/mo", delay: 0 },
  { label: "34+ Defense Scenarios", delay: 0.15 },
  { label: "Free 30-Day Pilot", delay: 0.3 },
];

const howItWorksSteps = [
  { step: 1, title: "Deploy to Employees", desc: "Send invite emails or integrate with your HRIS. Employees get instant access.", icon: Users },
  { step: 2, title: "Employee Uploads Bill", desc: "Snap a photo or upload a PDF. Takes less than 30 seconds.", icon: Upload },
  { step: 3, title: "AI Analyzes & Grades", desc: "Our AI identifies errors, overcharges, and negotiation opportunities.", icon: Brain },
  { step: 4, title: "Employee Takes Action", desc: "Personalized dispute letters, scripts, and step-by-step action plans.", icon: Sparkles },
];

export default function ForEmployers() {
  const [activeTab, setActiveTab] = useState("pricing");

  return (
    <>
      <SEOHead
        title="For Employers | GoldRock Health"
        description="Offer AI-powered medical bill analysis as an employee benefit. Help your workforce navigate complex medical bills with dispute templates, negotiation scripts, and collections defense."
        keywords={["employee benefits medical bills", "workplace financial wellness", "employer medical bill benefit"]}
        canonicalPath="/for-employers"
      />

      <MobileHeader title="For Employers" />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Hero Section - Split Layout */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20" />
          <div className="max-w-6xl mx-auto px-4 pt-16 pb-20 relative z-10">
            <Link href="/enterprise" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Enterprise Solutions
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4">For Employers</p>
                <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-gray-900 dark:text-white mb-6 leading-[1.08] tracking-tight">
                  Your employees are paying<br className="hidden md:block" /> medical bills they don't owe.
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-xl">
                  Medical billing errors are far more common than most people realize. And most employees don't know how to find them, let alone fight them.
                  GoldRock gives your workforce AI-powered tools to analyze bills, dispute overcharges, and defend against collections.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <a href="mailto:CONTACT@GOLDROCK.ai">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-base shadow-lg shadow-blue-600/20 dark:shadow-blue-600/10">
                      <Mail className="mr-2 h-4 w-4" /> Talk to Us
                    </Button>
                  </a>
                  <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-600 h-12 px-8 text-base hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => {
                    setActiveTab("pricing");
                    document.getElementById("tabs-section")?.scrollIntoView({ behavior: "smooth" });
                  }}>
                    See Pricing <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {floatingPills.map((pill, i) => (
                    <motion.div
                      key={pill.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + pill.delay, duration: 0.4 }}
                    >
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
                      >
                        <Badge className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-md px-3 py-1.5 text-sm font-medium hover:shadow-lg transition-shadow">
                          {pill.label}
                        </Badge>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 dark:from-blue-500/10 dark:to-emerald-500/10 rounded-3xl blur-2xl" />
                  <img
                    src={employersHero}
                    alt="HR professional presenting employee benefits"
                    className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/3] border border-white/50 dark:border-gray-700/50"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-24 space-y-20">
          {/* Feature Highlight Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 -mt-10 relative z-10"
          >
            {[
              { icon: FileText, label: "AI Bill Analysis", desc: "Finds errors humans miss", gradient: "from-blue-500 to-blue-600", lightBg: "from-blue-50 to-blue-100/50 dark:from-blue-900/40 dark:to-blue-800/20", iconColor: "text-blue-600 dark:text-blue-400" },
              { icon: Shield, label: "34+ Defense Scenarios", desc: "Collections defense covered", gradient: "from-emerald-500 to-emerald-600", lightBg: "from-emerald-50 to-emerald-100/50 dark:from-emerald-900/40 dark:to-emerald-800/20", iconColor: "text-emerald-600 dark:text-emerald-400" },
              { icon: Heart, label: "Employee Retention", desc: "Less financial stress", gradient: "from-rose-500 to-rose-600", lightBg: "from-rose-50 to-rose-100/50 dark:from-rose-900/40 dark:to-rose-800/20", iconColor: "text-rose-600 dark:text-rose-400" },
              { icon: Clock, label: "Days, Not Months", desc: "Rapid implementation", gradient: "from-amber-500 to-amber-600", lightBg: "from-amber-50 to-amber-100/50 dark:from-amber-900/40 dark:to-amber-800/20", iconColor: "text-amber-600 dark:text-amber-400" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className={`h-full bg-gradient-to-br ${item.lightBg} border-gray-200/80 dark:border-gray-700/50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden`}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-sm`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">{item.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* How It Works - Timeline */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800 mb-4 px-3 py-1">How It Works</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Four steps. Immediate impact.</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-lg mx-auto">From deployment to employee action, the entire process is designed to be effortless.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 dark:from-blue-800 dark:via-blue-700 dark:to-blue-800" />
              {howItWorksSteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative text-center"
                >
                  <div className="relative z-10 mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10 mb-5">
                    <step.icon className="w-10 h-10 text-white" />
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-gray-900 border-2 border-blue-500 dark:border-blue-400 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 shadow">
                      {step.step}
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[200px] mx-auto">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Before / After Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700 mb-4 px-3 py-1">The Difference</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">See the impact on your employees</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Without GoldRock */}
              <Card className="border-red-200 dark:border-red-900/50 bg-gradient-to-br from-red-50/80 to-white dark:from-red-950/30 dark:to-gray-900 shadow-md overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                      <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Without GoldRock</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: AlertTriangle, text: "Employee receives confusing medical bill", color: "text-red-500 dark:text-red-400" },
                      { icon: HelpCircle, text: "Doesn't understand charges or know their rights", color: "text-red-500 dark:text-red-400" },
                      { icon: Phone, text: "Spends hours on hold with billing departments", color: "text-red-500 dark:text-red-400" },
                      { icon: DollarSign, text: "Pays the full amount — including potential errors", color: "text-red-500 dark:text-red-400" },
                      { icon: AlertTriangle, text: "Unpaid balance goes to collections, credit suffers", color: "text-red-500 dark:text-red-400" },
                    ].map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <step.icon className={`w-4 h-4 ${step.color}`} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{step.text}</p>
                        </div>
                        {i < 4 && <div className="hidden" />}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* With GoldRock */}
              <Card className="border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/80 to-white dark:from-emerald-950/30 dark:to-gray-900 shadow-md overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">With GoldRock</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: Upload, text: "Employee uploads bill in seconds", color: "text-emerald-500 dark:text-emerald-400" },
                      { icon: Brain, text: "AI instantly analyzes charges, codes, and patterns", color: "text-emerald-500 dark:text-emerald-400" },
                      { icon: FileText, text: "Receives specific dispute letters and negotiation scripts", color: "text-emerald-500 dark:text-emerald-400" },
                      { icon: Shield, text: "34+ collections defense scenarios at their fingertips", color: "text-emerald-500 dark:text-emerald-400" },
                      { icon: CheckCircle, text: "Takes action with confidence — guided every step", color: "text-emerald-500 dark:text-emerald-400" },
                    ].map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <step.icon className={`w-4 h-4 ${step.color}`} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{step.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* Employee Impact Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/10 to-amber-500/10 dark:from-rose-500/5 dark:to-amber-500/5 rounded-3xl blur-2xl" />
                <img
                  src={familyRelief}
                  alt="Family experiencing relief from medical bill stress"
                  className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/3] border border-white/50 dark:border-gray-700/50"
                />
              </div>

              <div>
                <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800 mb-4 px-3 py-1">Employee Impact</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
                  Reducing financial stress where it matters most
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  Medical bills are one of the top sources of financial anxiety for working families. When employees have the tools to fight back, the ripple effects are felt across your organization.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: Heart, text: "Employees feel genuinely supported during stressful medical events", color: "text-rose-500" },
                    { icon: TrendingUp, text: "Reduced financial stress is linked to lower absenteeism", color: "text-blue-500" },
                    { icon: UserCheck, text: "A benefit that differentiates you in competitive hiring markets", color: "text-emerald-500" },
                    { icon: Shield, text: "Collections defense and dispute tools available 24/7", color: "text-amber-500" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
                        <item.icon className={`w-4.5 h-4.5 ${item.color}`} />
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-1.5">{item.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Tabs Section */}
          <div id="tabs-section">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                <TabsTrigger value="pricing" className="text-xs md:text-sm rounded-lg data-[state=active]:shadow-md transition-all">Pricing</TabsTrigger>
                <TabsTrigger value="roi" className="text-xs md:text-sm rounded-lg data-[state=active]:shadow-md transition-all">Cost Estimator</TabsTrigger>
                <TabsTrigger value="playbook" className="text-xs md:text-sm rounded-lg data-[state=active]:shadow-md transition-all">Sales Playbook</TabsTrigger>
                <TabsTrigger value="channels" className="text-xs md:text-sm rounded-lg data-[state=active]:shadow-md transition-all">Go-to-Market</TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="pricing" className="space-y-8 mt-8" key="pricing">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid md:grid-cols-3 gap-5">
                      {pricingTiers.map((plan, i) => (
                        <motion.div key={plan.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                          <Card className={`relative h-full ${plan.popular ? 'border-2 border-blue-500 dark:border-blue-400 shadow-xl ring-1 ring-blue-500/10' : 'border-gray-200 dark:border-gray-700 shadow-md'} bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300`}>
                            {plan.popular && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <Badge className="bg-blue-600 text-white px-4 py-1 text-xs shadow-lg shadow-blue-600/20">Recommended</Badge>
                              </div>
                            )}
                            <CardContent className="p-6">
                              <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{plan.tagline}</p>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{plan.employees}</p>
                                <div className="mt-4">
                                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                                  {plan.per && <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/{plan.per}</span>}
                                </div>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{plan.annual}</p>
                              </div>
                              <div className="space-y-2.5 mb-6">
                                {plan.features.map((f, j) => (
                                  <div key={j} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span>{f}</span>
                                  </div>
                                ))}
                              </div>
                              <Button className={`w-full h-11 ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20' : 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'} text-white`}>
                                {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/30 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">Volume Discounts</h4>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {volumeDiscounts.map((vd) => (
                          <div key={vd.range} className="text-center p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                            <p className="font-semibold text-xs text-gray-900 dark:text-white">{vd.range}</p>
                            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">{vd.discount}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-4">
                        All plans include a free 30-day pilot. Annual contracts receive additional savings.
                      </p>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="roi" className="space-y-8 mt-8" key="roi">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <ROICalculator />

                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
                      <CardContent className="p-6 md:p-8">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6">Why Employers Invest in This</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-emerald-500" /> Financial Impact
                            </h4>
                            {[
                              "Employees identify savings on bills they'd otherwise pay in full",
                              "Reduced financial stress correlates with fewer sick days",
                              "Lower emergency financial requests to HR",
                              "Healthcare cost awareness leads to better benefits utilization",
                            ].map((item, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <Heart className="w-4 h-4 text-rose-500" /> Talent & Culture
                            </h4>
                            {[
                              "Differentiator in competitive hiring markets",
                              "Demonstrates the company invests in total wellbeing",
                              "Employees feel supported during stressful medical events",
                              "Builds trust and loyalty that generic benefits can't match",
                            ].map((item, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <CheckCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="playbook" className="space-y-8 mt-8" key="playbook">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          How to Sell Medical Bill Advocacy to Employers
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        {salesPlaybook.map((phase, i) => (
                          <div key={i}>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">{phase.phase}</h4>
                            <div className="space-y-2 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                              {phase.tactics.map((tactic, j) => (
                                <div key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                                  <span>{tactic}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-900 dark:text-white">Common Objections</CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Honest answers to the pushbacks you'll hear</p>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {objectionHandlers.map((oh, i) => (
                          <ExpandableItem key={i} title={oh.objection}>
                            {oh.response}
                          </ExpandableItem>
                        ))}
                      </CardContent>
                    </Card>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/30 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" /> Sales Collateral Needed
                      </h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {[
                          "CFO one-pager with cost projection",
                          "Employee-facing benefits overview flyer",
                          "Pilot program proposal template",
                          "Implementation timeline & onboarding guide",
                          "Employee onboarding email templates",
                          "ROI calculator spreadsheet",
                          "Security & compliance whitepaper",
                          "Desk cards & break room posters",
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="channels" className="space-y-8 mt-8" key="channels">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Go-to-Market Channels</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Multiple paths to reach employers at scale</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      {salesChannels.map((ch, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                          <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center border border-blue-200/50 dark:border-blue-700/30">
                                  <ch.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{ch.title}</h4>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{ch.description}</p>
                              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                                <p className="text-xs text-gray-600 dark:text-gray-400"><span className="font-semibold text-gray-700 dark:text-gray-300">Approach:</span> {ch.strategy}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </div>

          {/* CTA Gradient Banner */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-700 dark:via-blue-800 dark:to-indigo-800 p-10 md:p-16 text-center shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.1),transparent)]" />
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                    Your employees deserve better<br className="hidden md:block" /> than confusing medical bills
                  </h2>
                  <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                    Give them the tools to understand, dispute, and resolve their medical bills — all powered by AI, all at their fingertips.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <a href="mailto:CONTACT@GOLDROCK.ai">
                      <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 h-12 px-8 text-base font-semibold shadow-lg">
                        <Mail className="mr-2 h-4 w-4" /> Get in Touch
                      </Button>
                    </a>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 h-12 px-8 text-base"
                      onClick={() => {
                        setActiveTab("pricing");
                        document.getElementById("tabs-section")?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      View Pricing <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/20">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Ready to explore this?</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                    Tell us about your organization. We'll put together a proposal specific to your size and needs. Free 30-day pilot available.
                  </p>
                </div>
                <div className="max-w-xl mx-auto">
                  <ContactForm />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bottom Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/employer", icon: UserCheck, title: "Employer Portal", desc: "Already a client? Manage your org", color: "blue" },
              { href: "/partner-api", icon: Zap, title: "Partner API", desc: "Embed our engine in your platform", color: "purple" },
              { href: "/enterprise", icon: Globe, title: "All Enterprise Solutions", desc: "Solutions for every stakeholder", color: "emerald" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer h-full hover:-translate-y-1">
                  <CardContent className="py-6 text-center">
                    <link.icon className={`w-6 h-6 text-${link.color}-600 dark:text-${link.color}-400 mx-auto mb-2`} />
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{link.title}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{link.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <MedicalChatbot />
      <MobileBottomNav />
    </>
  );
}
