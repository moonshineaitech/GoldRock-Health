import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import {
  Building2, Users, DollarSign, TrendingUp, CheckCircle, ArrowRight,
  ArrowLeft, Shield, Zap, Heart, Target, Calculator, Send, Mail,
  Clock, Briefcase, FileText, ChevronDown, ChevronUp, Lightbulb,
  BookOpen, UserCheck, Globe
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
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${discountedAnnual.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Annual investment</p>
            {discount > 0 && <Badge className="mt-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-[10px]">{discount}% volume discount</Badge>}
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${costPerEmployeePerYear}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Per employee / year</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
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
      <p className="text-xs text-center text-gray-500">Or email directly: CONTACT@GOLDROCK.ai</p>
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
      {open && <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{children}</div>}
    </div>
  );
}

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
        <div className="max-w-5xl mx-auto px-4 pt-14 pb-24 space-y-10">
          <div>
            <Link href="/enterprise" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6">
              <ArrowLeft className="w-4 h-4 mr-1" /> Enterprise Solutions
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">For Employers</p>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-[1.1] tracking-tight">
                Your employees are paying<br />medical bills they don't owe.
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-2xl">
                Medical billing errors are far more common than most people realize. And most employees don't know how to find them, let alone fight them.
                GoldRock gives your workforce AI-powered tools to analyze bills, dispute overcharges, and defend against collections.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="mailto:CONTACT@GOLDROCK.ai">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-6">
                    <Mail className="mr-2 h-4 w-4" /> Talk to Us
                  </Button>
                </a>
                <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-700 h-11 px-6" onClick={() => setActiveTab("pricing")}>
                  See Pricing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FileText, label: "AI bill analysis that finds errors humans miss", color: "text-blue-600 dark:text-blue-400" },
              { icon: Shield, label: "34+ collections defense scenarios covered", color: "text-emerald-600 dark:text-emerald-400" },
              { icon: Heart, label: "Less financial stress means better retention", color: "text-rose-600 dark:text-rose-400" },
              { icon: Clock, label: "Set up in days, not months", color: "text-amber-600 dark:text-amber-400" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <item.icon className={`w-6 h-6 ${item.color} mb-2`} />
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="pricing" className="text-xs md:text-sm">Pricing</TabsTrigger>
              <TabsTrigger value="roi" className="text-xs md:text-sm">Cost Estimator</TabsTrigger>
              <TabsTrigger value="playbook" className="text-xs md:text-sm">Sales Playbook</TabsTrigger>
              <TabsTrigger value="channels" className="text-xs md:text-sm">Go-to-Market</TabsTrigger>
            </TabsList>

            <TabsContent value="pricing" className="space-y-8 mt-8">
              <div className="grid md:grid-cols-3 gap-5">
                {pricingTiers.map((plan, i) => (
                  <motion.div key={plan.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <Card className={`relative h-full ${plan.popular ? 'border-2 border-blue-500 dark:border-blue-400 shadow-md' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800`}>
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-blue-600 text-white px-3 py-0.5 text-xs">Recommended</Badge>
                        </div>
                      )}
                      <CardContent className="p-5">
                        <div className="text-center mb-5">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{plan.tagline}</p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{plan.employees}</p>
                          <div className="mt-3">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                            {plan.per && <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/{plan.per}</span>}
                          </div>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{plan.annual}</p>
                        </div>
                        <div className="space-y-2 mb-5">
                          {plan.features.map((f, j) => (
                            <div key={j} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                        <Button className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'} text-white`}>
                          {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm">Volume Discounts</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {volumeDiscounts.map((vd) => (
                    <div key={vd.range} className="text-center p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <p className="font-medium text-xs text-gray-900 dark:text-white">{vd.range}</p>
                      <p className="text-[11px] text-blue-600 dark:text-blue-400">{vd.discount}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-3">
                  All plans include a free 30-day pilot. Annual contracts receive additional savings.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="roi" className="space-y-8 mt-8">
              <ROICalculator />

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Why Employers Invest in This</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Financial Impact</h4>
                      {[
                        "Employees identify savings on bills they'd otherwise pay in full",
                        "Reduced financial stress correlates with fewer sick days",
                        "Lower emergency financial requests to HR",
                        "Healthcare cost awareness leads to better benefits utilization",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Talent & Culture</h4>
                      {[
                        "Differentiator in competitive hiring markets",
                        "Demonstrates the company invests in total wellbeing",
                        "Employees feel supported during stressful medical events",
                        "Builds trust and loyalty that generic benefits can't match",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Heart className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="playbook" className="space-y-8 mt-8">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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
                      <div className="space-y-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
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

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm flex items-center gap-2">
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
            </TabsContent>

            <TabsContent value="channels" className="space-y-8 mt-8">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Go-to-Market Channels</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Multiple paths to reach employers at scale</p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {salesChannels.map((ch, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <ch.icon className="w-4.5 h-4.5 text-gray-700 dark:text-gray-300" />
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{ch.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{ch.description}</p>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 dark:text-gray-400"><span className="font-medium text-gray-700 dark:text-gray-300">Approach:</span> {ch.strategy}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to explore this?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
                  Tell us about your organization. We'll put together a proposal specific to your size and needs. Free 30-day pilot available.
                </p>
              </div>
              <div className="max-w-xl mx-auto">
                <ContactForm />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            {[
              { href: "/employer", icon: UserCheck, title: "Employer Portal", desc: "Already a client? Manage your org", color: "blue" },
              { href: "/partner-api", icon: Zap, title: "Partner API", desc: "Embed our engine in your platform", color: "purple" },
              { href: "/enterprise", icon: Globe, title: "All Enterprise Solutions", desc: "Solutions for every stakeholder", color: "emerald" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="py-5 text-center">
                    <link.icon className={`w-6 h-6 text-${link.color}-600 dark:text-${link.color}-400 mx-auto mb-2`} />
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{link.title}</h4>
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
