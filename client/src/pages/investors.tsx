import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import { 
  Building2,
  Target,
  Zap,
  Shield,
  Globe,
  CheckCircle,
  BarChart3,
  ArrowRight,
  Briefcase,
  Award,
  ArrowLeft,
  Send
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SEOHead } from "@/components/seo-head";
import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useToast } from "@/hooks/use-toast";

const marketOpportunity = {
  tam: 4500,
  sam: 140,
  som: 2.1,
  description: "Medical billing errors cost Americans $200B+ annually. Only 0.1% of denied claims are appealed. GoldRock Health democratizes access to billing expertise."
};

const competitiveAdvantages = [
  {
    title: "AI-First Platform",
    description: "Purpose-built AI that analyzes bills in seconds, not hours. Trained on millions of billing codes and negotiation outcomes.",
    icon: Zap
  },
  {
    title: "Comprehensive Suite",
    description: "Beyond bill analysis: clinical diagnostics, drug interactions, lab interpretation, insurance benefits, and Medicare enrollment.",
    icon: Target
  },
  {
    title: "B2B + B2C Model",
    description: "Consumer platform drives acquisition; enterprise API enables partnerships with employers, insurers, and healthcare systems.",
    icon: Building2
  },
  {
    title: "Data Moat",
    description: "Every analysis improves our models. Price database spans 50 states, 200+ CPT codes, and grows daily.",
    icon: Shield
  }
];

const revenueStreams = [
  { stream: "Consumer Subscriptions", percentage: 45, description: "Premium features for individuals and families" },
  { stream: "Enterprise API", percentage: 30, description: "B2B integrations with employers and insurers" },
  { stream: "Affiliate Partnerships", percentage: 15, description: "Financial assistance referrals, legal partners" },
  { stream: "Healthcare System Licensing", percentage: 10, description: "White-label solutions for health systems" }
];

const teamHighlights = [
  "Team with healthcare, AI, and fintech expertise",
  "Previous exits to major healthcare companies",
  "Advisors from leading health systems and insurers",
  "Engineers from Google, Meta, and top health tech startups"
];

const milestones = [
  { date: "Q2 2025", milestone: "Platform launch" },
  { date: "Q3 2025", milestone: "AI bill analysis release" },
  { date: "Q4 2025", milestone: "Enterprise API launch" },
  { date: "Q1 2026", milestone: "National expansion" },
  { date: "Q2 2026", milestone: "Series A fundraise" }
];

function ContactForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Message Sent",
      description: "We'll get back to you within 1-2 business days.",
    });
    setFormData({ name: '', email: '', company: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-foreground">Name</Label>
          <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-background" data-testid="input-contact-name" />
        </div>
        <div>
          <Label htmlFor="email" className="text-foreground">Email</Label>
          <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="bg-background" data-testid="input-contact-email" />
        </div>
      </div>
      <div>
        <Label htmlFor="company" className="text-foreground">Firm/Company</Label>
        <Input id="company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="bg-background" data-testid="input-contact-company" />
      </div>
      <div>
        <Label htmlFor="message" className="text-foreground">Message</Label>
        <Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="I'm interested in learning more about investment opportunities..." required className="bg-background min-h-[100px]" data-testid="input-contact-message" />
      </div>
      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:opacity-90" disabled={isSubmitting} data-testid="button-submit-contact">
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
      <p className="text-xs text-muted-foreground text-center">Or email us directly at CONTACT@GOLDROCK.ai</p>
    </form>
  );
}

export default function Investors() {
  return (
    <>
      <SEOHead
        title="Investor Information - GoldRock Health"
        description="Investment opportunity in AI-powered healthcare cost reduction. GoldRock Health is transforming how patients understand and reduce medical bills."
        keywords={["healthcare investment", "healthtech startup", "medical bill AI", "health tech venture"]}
        canonicalPath="/investors"
      />

      <MobileHeader title="Investors" />

      <div className="min-h-screen bg-background pb-24">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground" data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 mb-4">
              Investment Opportunity
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4">
              Partner With GoldRock Health
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're building the infrastructure for healthcare cost transparency and reduction. 
              AI that saves patients money and transforms how America pays for healthcare.
            </p>
          </motion.div>

          <Card className="bg-card border-border mb-10">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                Market Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{marketOpportunity.description}</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center bg-secondary rounded-lg p-5">
                  <div className="text-3xl font-bold text-gold">${marketOpportunity.tam}B</div>
                  <div className="text-sm text-muted-foreground mt-1">Total Addressable Market</div>
                  <div className="text-xs text-muted-foreground">US Healthcare Spending</div>
                </div>
                <div className="text-center bg-secondary rounded-lg p-5">
                  <div className="text-3xl font-bold text-foreground">${marketOpportunity.sam}B</div>
                  <div className="text-sm text-muted-foreground mt-1">Serviceable Market</div>
                  <div className="text-xs text-muted-foreground">Patient Out-of-Pocket Costs</div>
                </div>
                <div className="text-center bg-secondary rounded-lg p-5">
                  <div className="text-3xl font-bold text-foreground">${marketOpportunity.som}B</div>
                  <div className="text-sm text-muted-foreground mt-1">Obtainable Market (5yr)</div>
                  <div className="text-xs text-muted-foreground">Our Target Segment</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-bold text-foreground mb-4">Competitive Advantages</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {competitiveAdvantages.map((advantage, index) => (
              <motion.div key={advantage.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="bg-card border-border h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                        <advantage.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground mb-1">{advantage.title}</h3>
                        <p className="text-muted-foreground text-sm">{advantage.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-foreground mb-4">Revenue Model</h2>
          <Card className="bg-card border-border mb-10">
            <CardContent className="p-5">
              <div className="space-y-5">
                {revenueStreams.map((stream) => (
                  <div key={stream.stream}>
                    <div className="flex justify-between mb-2">
                      <div>
                        <span className="text-foreground font-medium">{stream.stream}</span>
                        <span className="text-muted-foreground text-sm ml-2">({stream.description})</span>
                      </div>
                      <span className="text-gold font-bold">{stream.percentage}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div className="h-full bg-gold" initial={{ width: 0 }} animate={{ width: `${stream.percentage}%` }} transition={{ delay: 0.5, duration: 0.8 }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {teamHighlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-foreground">
                      <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {milestones.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-20 flex-shrink-0">
                        <Badge className={`${i === milestones.length - 1 ? 'bg-secondary text-gold' : 'bg-secondary text-muted-foreground'}`}>
                          {item.date}
                        </Badge>
                      </div>
                      <div className="text-foreground text-sm">{item.milestone}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="py-10">
              <div className="text-center mb-6">
                <Briefcase className="h-10 w-10 text-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold font-serif text-foreground mb-2">
                  Interested in Learning More?
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We're currently raising our Series A round. Request our full investor deck and financial projections.
                </p>
              </div>
              <div className="max-w-md mx-auto">
                <ContactForm />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
}
