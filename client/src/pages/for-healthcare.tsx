import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import { 
  Building2,
  CheckCircle,
  Zap,
  ArrowRight,
  Handshake,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useToast } from "@/hooks/use-toast";

const partnershipBenefits = {
  use: [
    {
      title: "Patient Financial Navigation",
      description: "White-label our AI to help patients understand bills, reducing call center volume",
      metric: "Reduce billing calls"
    },
    {
      title: "Revenue Cycle Optimization",
      description: "Identify billing errors before they become disputes, improving patient satisfaction",
      metric: "Fewer disputes"
    },
    {
      title: "Price Transparency Compliance",
      description: "Meet CMS price transparency requirements with our comprehensive pricing database",
      metric: "Compliance ready"
    },
    {
      title: "Patient Retention",
      description: "Improve patient loyalty by demonstrating commitment to fair, transparent billing",
      metric: "Higher retention"
    }
  ],
  acquire: [
    {
      title: "Proprietary AI Technology",
      description: "Purpose-built models for medical billing analysis, trained on millions of claims and outcomes",
      value: "Development head start"
    },
    {
      title: "Growing User Base",
      description: "Active users with strong net revenue retention and organic growth",
      value: "Built-in distribution"
    },
    {
      title: "Comprehensive Data Assets",
      description: "Price database spanning 50 states, 200+ procedure codes, updated continuously",
      value: "Unique data moat"
    },
    {
      title: "Experienced Team",
      description: "Engineers and product leaders from top health tech companies with domain expertise",
      value: "Ready to integrate"
    }
  ],
  invest: [
    {
      title: "Strategic Alignment",
      description: "Invest in technology that enhances your core business and patient relationships",
      benefit: "First-mover advantage"
    },
    {
      title: "Market Intelligence",
      description: "Gain insights into patient billing concerns, pricing trends, and competitive dynamics",
      benefit: "Real-time market data"
    },
    {
      title: "Board Participation",
      description: "Shape product direction to serve health system needs and capture enterprise value",
      benefit: "Governance rights"
    },
    {
      title: "Preferred Partnership",
      description: "Priority access to new features, custom integrations, and co-development opportunities",
      benefit: "Exclusive access"
    }
  ]
};

const integrationOptions = [
  "EHR/EMR integration via FHIR APIs",
  "Patient portal white-label embedding",
  "Revenue cycle management system plugins",
  "Custom enterprise API access",
  "Dedicated implementation support"
];

function ContactForm({ type }: { type: string }) {
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
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name</Label>
          <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-white dark:bg-gray-700" data-testid="input-contact-name" />
        </div>
        <div>
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
          <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="bg-white dark:bg-gray-700" data-testid="input-contact-email" />
        </div>
      </div>
      <div>
        <Label htmlFor="company" className="text-gray-700 dark:text-gray-300">Organization</Label>
        <Input id="company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="bg-white dark:bg-gray-700" data-testid="input-contact-company" />
      </div>
      <div>
        <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">Message</Label>
        <Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder={`I'm interested in ${type}...`} required className="bg-white dark:bg-gray-700 min-h-[100px]" data-testid="input-contact-message" />
      </div>
      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting} data-testid="button-submit-contact">
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Or email us directly at CONTACT@GOLDROCK.ai</p>
    </form>
  );
}

export default function ForHealthcare() {
  return (
    <>
      <SEOHead
        title="For Healthcare Companies - Partnership Opportunities | GoldRock Health"
        description="Partner with GoldRock Health to improve patient financial experience. Options for licensing, acquisition, or strategic investment in AI-powered billing technology."
        keywords={["healthcare partnership", "hospital billing technology", "patient financial experience", "health system acquisition"]}
        canonicalPath="/for-healthcare"
      />

      <MobileHeader title="For Healthcare" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300" data-testid="button-back">
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
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 mb-4">
              Healthcare Partners
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Transform Patient Financial Experience
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Whether you want to license our technology, explore acquisition, or make a strategic investment, 
              GoldRock Health offers flexible partnership models for health systems and healthcare companies.
            </p>
          </motion.div>

          <Tabs defaultValue="use" className="mb-10">
            <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto mb-6 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="use" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700" data-testid="tab-healthcare-license">License & Use</TabsTrigger>
              <TabsTrigger value="acquire" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700" data-testid="tab-healthcare-acquire">Acquire</TabsTrigger>
              <TabsTrigger value="invest" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700" data-testid="tab-healthcare-invest">Invest</TabsTrigger>
            </TabsList>

            <TabsContent value="use">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {partnershipBenefits.use.map((benefit, index) => (
                  <motion.div key={benefit.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-full">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{benefit.title}</h3>
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs">{benefit.metric}</Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Integration Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {integrationOptions.map((option, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        {option}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="acquire">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {partnershipBenefits.acquire.map((item, index) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-full">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-xs">{item.value}</Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="invest">
              <div className="grid md:grid-cols-2 gap-4">
                {partnershipBenefits.invest.map((item, index) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-full">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs">{item.benefit}</Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="py-10">
              <div className="text-center mb-6">
                <Building2 className="h-10 w-10 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Let's Explore Partnership
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Our team is ready to discuss how GoldRock Health can support your organization's goals.
                </p>
              </div>
              <div className="max-w-md mx-auto">
                <ContactForm type="healthcare partnership" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
}
