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
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-foreground">
          <Calculator className="w-5 h-5 text-muted-foreground" />
          Cost Estimator
        </CardTitle>
        <p className="text-sm text-muted-foreground">See what GoldRock would cost for your organization.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground text-sm">Number of Employees</Label>
            <Input
              type="number"
              value={employees}
              onChange={(e) => setEmployees(Math.max(10, parseInt(e.target.value) || 10))}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-foreground text-sm">Plan Tier</Label>
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
          <div className="bg-secondary rounded-xl p-4 text-center border border-border">
            <p className="text-2xl font-bold text-foreground">${discountedAnnual.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Annual investment</p>
            {discount > 0 && <Badge className="mt-1.5 bg-card text-foreground border border-border text-[10px]">{discount}% volume discount</Badge>}
          </div>
          <div className="bg-secondary rounded-xl p-4 text-center border border-border">
            <p className="text-2xl font-bold text-foreground">${costPerEmployeePerYear}</p>
            <p className="text-xs text-muted-foreground mt-1">Per employee / year</p>
          </div>
          <div className="bg-secondary rounded-xl p-4 text-center border border-border">
            <p className="text-2xl font-bold text-foreground">{breakEvenBills}</p>
            <p className="text-xs text-muted-foreground mt-1">Bills to break even*</p>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground">
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
          <Label className="text-muted-foreground text-sm">Your Name</Label>
          <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <Label className="text-muted-foreground text-sm">Work Email</Label>
          <Input type="email" placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-muted-foreground text-sm">Company</Label>
          <Input placeholder="Company name" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </div>
        <div>
          <Label className="text-muted-foreground text-sm">Company Size</Label>
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
        <Label className="text-muted-foreground text-sm">What challenges are you trying to solve?</Label>
        <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} />
      </div>
      <Button className="w-full bg-primary text-primary-foreground hover:opacity-90" onClick={handleSubmit}>
        <Send className="w-4 h-4 mr-2" /> Get a Custom Proposal
      </Button>
      <p className="text-xs text-center text-muted-foreground">Or email directly: CONTACT@GOLDROCK.ai</p>
    </div>
  );
}

function ExpandableItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 hover:bg-secondary transition-colors text-left">
        <span className="text-sm font-medium text-foreground">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{children}</div>
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

      <div className="min-h-screen bg-background">
        {/* Hero Section - Split Layout */}
        <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--background), var(--card))' }}>
          <div className="max-w-6xl mx-auto px-4 pt-16 pb-20 relative z-10">
            <Link href="/enterprise" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Enterprise Solutions
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4">For Employers</p>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-foreground mb-6 leading-[1.08] tracking-tight">
                  Your employees are paying<br className="hidden md:block" /> medical bills they don't owe.
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                  Medical billing errors are far more common than most people realize. And most employees don't know how to find them, let alone fight them.
                  GoldRock gives your workforce AI-powered tools to analyze bills, dispute overcharges, and defend against collections.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <a href="mailto:CONTACT@GOLDROCK.ai">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 h-12 px-8 text-base shadow-sm">
                      <Mail className="mr-2 h-4 w-4" /> Talk to Us
                    </Button>
                  </a>
                  <Button size="lg" variant="outline" className="border-border h-12 px-8 text-base hover:bg-secondary" onClick={() => {
                    setActiveTab("pricing");
                    document.getElementById("tabs-section")?.scrollIntoView({ behavior: "smooth" });
                  }}>
                    See Pricing <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {floatingPills.map((pill) => (
                    <motion.div
                      key={pill.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + pill.delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Badge className="bg-card text-foreground border border-border shadow-sm px-3 py-1.5 text-sm font-medium">
                        {pill.label}
                      </Badge>
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
                  <img
                    src={employersHero}
                    alt="HR professional presenting employee benefits"
                    className="relative rounded-2xl shadow-md w-full object-cover aspect-[4/3] border border-border"
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
              { icon: FileText, label: "AI Bill Analysis", desc: "Finds errors humans miss", featured: true },
              { icon: Shield, label: "34+ Defense Scenarios", desc: "Collections defense covered", featured: false },
              { icon: Heart, label: "Employee Retention", desc: "Less financial stress", featured: false },
              { icon: Clock, label: "Days, Not Months", desc: "Rapid implementation", featured: false },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                <Card className="h-full bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.featured ? '' : 'bg-secondary'}`}
                      style={item.featured ? { background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' } : undefined}
                    >
                      <item.icon className={`w-6 h-6 ${item.featured ? 'text-white' : 'text-muted-foreground'}`} />
                    </div>
                    <h3 className="font-semibold text-foreground text-base mb-1">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
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
              <Badge className="bg-secondary text-muted-foreground border border-border mb-4 px-3 py-1">How It Works</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground tracking-tight">Four steps. Immediate impact.</h2>
              <p className="text-muted-foreground mt-3 max-w-lg mx-auto">From deployment to employee action, the entire process is designed to be effortless.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-border" />
              {howItWorksSteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative text-center"
                >
                  <div className="relative z-10 mx-auto w-24 h-24 rounded-2xl bg-secondary border border-border flex items-center justify-center shadow-sm mb-5">
                    <step.icon className="w-10 h-10 text-muted-foreground" />
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center text-xs font-bold text-gold shadow-sm">
                      {step.step}
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px] mx-auto">{step.desc}</p>
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
              <Badge className="bg-secondary text-muted-foreground border border-border mb-4 px-3 py-1">The Difference</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground tracking-tight">See the impact on your employees</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Without GoldRock */}
              <Card className="bg-card border border-border shadow-sm overflow-hidden">
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
                          <p className="text-sm text-foreground font-medium">{step.text}</p>
                        </div>
                        {i < 4 && <div className="hidden" />}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* With GoldRock */}
              <Card className="bg-card border border-border shadow-sm overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">With GoldRock</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: Upload, text: "Employee uploads bill in seconds", color: "text-emerald-600 dark:text-emerald-400" },
                      { icon: Brain, text: "AI instantly analyzes charges, codes, and patterns", color: "text-emerald-600 dark:text-emerald-400" },
                      { icon: FileText, text: "Receives specific dispute letters and negotiation scripts", color: "text-emerald-600 dark:text-emerald-400" },
                      { icon: Shield, text: "34+ collections defense scenarios at their fingertips", color: "text-emerald-600 dark:text-emerald-400" },
                      { icon: CheckCircle, text: "Takes action with confidence — guided every step", color: "text-emerald-600 dark:text-emerald-400" },
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
                          <p className="text-sm text-foreground font-medium">{step.text}</p>
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
                <img
                  src={familyRelief}
                  alt="Family experiencing relief from medical bill stress"
                  className="relative rounded-2xl shadow-md w-full object-cover aspect-[4/3] border border-border"
                />
              </div>

              <div>
                <Badge className="bg-secondary text-muted-foreground border border-border mb-4 px-3 py-1">Employee Impact</Badge>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
                  Reducing financial stress where it matters most
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Medical bills are one of the top sources of financial anxiety for working families. When employees have the tools to fight back, the ripple effects are felt across your organization.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: Heart, text: "Employees feel genuinely supported during stressful medical events" },
                    { icon: TrendingUp, text: "Reduced financial stress is linked to lower absenteeism" },
                    { icon: UserCheck, text: "A benefit that differentiates you in competitive hiring markets" },
                    { icon: Shield, text: "Collections defense and dispute tools available 24/7" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4.5 h-4.5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-foreground leading-relaxed pt-1.5">{item.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Tabs Section */}
          <div id="tabs-section">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full bg-secondary p-1 rounded-xl">
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
                          <Card className={`relative h-full ${plan.popular ? 'border-2 shadow-md' : 'border border-border shadow-sm'} bg-card hover:shadow-md transition-shadow duration-300`} style={plan.popular ? { borderColor: 'var(--gold)' } : undefined}>
                            {plan.popular && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <Badge className="text-white px-4 py-1 text-xs shadow-sm border-0" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>Recommended</Badge>
                              </div>
                            )}
                            <CardContent className="p-6">
                              <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                                <p className="text-xs text-muted-foreground">{plan.tagline}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">{plan.employees}</p>
                                <div className="mt-4">
                                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                                  {plan.per && <span className="text-muted-foreground text-sm ml-1">/{plan.per}</span>}
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-1">{plan.annual}</p>
                              </div>
                              <div className="space-y-2.5 mb-6">
                                {plan.features.map((f, j) => (
                                  <div key={j} className="flex items-start gap-2 text-sm text-foreground">
                                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                    <span>{f}</span>
                                  </div>
                                ))}
                              </div>
                              <Button className="w-full h-11 bg-primary text-primary-foreground hover:opacity-90">
                                {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-secondary rounded-2xl p-6 border border-border">
                      <h4 className="font-semibold text-foreground mb-4 text-sm">Volume Discounts</h4>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {volumeDiscounts.map((vd) => (
                          <div key={vd.range} className="text-center p-3 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                            <p className="font-semibold text-xs text-foreground">{vd.range}</p>
                            <p className="text-[11px] text-gold font-medium mt-0.5">{vd.discount}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-4">
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

                    <Card className="bg-card border-border shadow-lg">
                      <CardContent className="p-6 md:p-8">
                        <h3 className="font-bold text-xl text-foreground mb-6">Why Employers Invest in This</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-emerald-600" /> Financial Impact
                            </h4>
                            {[
                              "Employees identify savings on bills they'd otherwise pay in full",
                              "Reduced financial stress correlates with fewer sick days",
                              "Lower emergency financial requests to HR",
                              "Healthcare cost awareness leads to better benefits utilization",
                            ].map((item, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                              <Heart className="w-4 h-4 text-muted-foreground" /> Talent & Culture
                            </h4>
                            {[
                              "Differentiator in competitive hiring markets",
                              "Demonstrates the company invests in total wellbeing",
                              "Employees feel supported during stressful medical events",
                              "Builds trust and loyalty that generic benefits can't match",
                            ].map((item, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
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
                    <Card className="bg-card border-border shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                          <BookOpen className="w-5 h-5 text-muted-foreground" />
                          How to Sell Medical Bill Advocacy to Employers
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        {salesPlaybook.map((phase, i) => (
                          <div key={i}>
                            <h4 className="font-semibold text-foreground mb-3 text-sm">{phase.phase}</h4>
                            <div className="space-y-2 pl-4 border-l-2 border-border">
                              {phase.tactics.map((tactic, j) => (
                                <div key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <Lightbulb className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                  <span>{tactic}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg text-foreground">Common Objections</CardTitle>
                        <p className="text-sm text-muted-foreground">Honest answers to the pushbacks you'll hear</p>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {objectionHandlers.map((oh, i) => (
                          <ExpandableItem key={i} title={oh.objection}>
                            {oh.response}
                          </ExpandableItem>
                        ))}
                      </CardContent>
                    </Card>

                    <div className="bg-secondary rounded-2xl p-6 border border-border">
                      <h4 className="font-semibold text-foreground mb-4 text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" /> Sales Collateral Needed
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
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
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
                      <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Go-to-Market Channels</h3>
                      <p className="text-sm text-muted-foreground">Multiple paths to reach employers at scale</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      {salesChannels.map((ch, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                          <Card className="h-full bg-card border-border shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center border border-border">
                                  <ch.icon className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <h4 className="font-semibold text-foreground text-sm">{ch.title}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{ch.description}</p>
                              <div className="bg-secondary rounded-xl p-3 border border-border">
                                <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Approach:</span> {ch.strategy}</p>
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
            <div className="relative overflow-hidden rounded-3xl bg-primary p-10 md:p-16 text-center shadow-sm">
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4 tracking-tight">
                    Your employees deserve better<br className="hidden md:block" /> than confusing medical bills
                  </h2>
                  <p className="text-primary-foreground text-lg mb-8 max-w-2xl mx-auto leading-relaxed" style={{ opacity: 0.85 }}>
                    Give them the tools to understand, dispute, and resolve their medical bills — all powered by AI, all at their fingertips.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <a href="mailto:CONTACT@GOLDROCK.ai">
                      <Button size="lg" className="bg-background text-foreground hover:bg-secondary h-12 px-8 text-base font-semibold shadow-sm">
                        <Mail className="mr-2 h-4 w-4" /> Get in Touch
                      </Button>
                    </a>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border border-primary-foreground text-primary-foreground hover:bg-white/10 h-12 px-8 text-base bg-transparent"
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
            <Card className="bg-card border-border shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-3">Ready to explore this?</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
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
              { href: "/employer", icon: UserCheck, title: "Employer Portal", desc: "Already a client? Manage your org" },
              { href: "/partner-api", icon: Zap, title: "Partner API", desc: "Embed our engine in your platform" },
              { href: "/enterprise", icon: Globe, title: "All Enterprise Solutions", desc: "Solutions for every stakeholder" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="bg-card border border-border hover:shadow-md transition-all duration-300 cursor-pointer h-full hover:-translate-y-1">
                  <CardContent className="py-6 text-center">
                    <link.icon className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground text-sm">{link.title}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{link.desc}</p>
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
