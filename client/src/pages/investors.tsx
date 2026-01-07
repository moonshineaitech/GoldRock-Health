import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  TrendingUp, 
  DollarSign, 
  Users,
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
  Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";

const keyMetrics = [
  { label: "Users", value: "12,847", growth: "+215%", period: "6 months" },
  { label: "Bills Analyzed", value: "34,562", growth: "+189%", period: "6 months" },
  { label: "Total Savings", value: "$18.7M", growth: "+340%", period: "6 months" },
  { label: "Retention Rate", value: "94.2%", growth: "+12%", period: "YoY" }
];

const marketOpportunity = {
  tam: 4500, // billion
  sam: 140, // billion
  som: 2.1, // billion
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
  { date: "Q2 2025", milestone: "Platform launch, 1,000 beta users" },
  { date: "Q3 2025", milestone: "AI bill analysis, 5,000 users" },
  { date: "Q4 2025", milestone: "Enterprise API launch, first B2B contracts" },
  { date: "Q1 2026", milestone: "12,000+ users, $18M+ in user savings" },
  { date: "Q2 2026", milestone: "Series A fundraise, national expansion" }
];

export default function Investors() {
  return (
    <>
      <SEOHead
        title="Investor Information - GoldRock Health"
        description="Investment opportunity in AI-powered healthcare cost reduction. GoldRock Health is transforming how patients understand and reduce medical bills."
        keywords={["healthcare investment", "healthtech startup", "medical bill AI", "health tech venture"]}
        canonicalPath="/investors"
      />

      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#0a1628]">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-4">
              Investment Opportunity
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Partner With <span className="text-cyan-400">GoldRock Health</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're building the infrastructure for healthcare cost transparency and reduction. 
              AI that saves patients money and transforms how America pays for healthcare.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {keyMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-white">{metric.value}</div>
                    <div className="text-sm text-gray-400">{metric.label}</div>
                    <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                      {metric.growth} ({metric.period})
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30 mb-12">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-cyan-400" />
                Market Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-6">{marketOpportunity.description}</p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center bg-white/5 rounded-lg p-6">
                  <div className="text-4xl font-bold text-cyan-400">${marketOpportunity.tam}B</div>
                  <div className="text-sm text-gray-400 mt-1">Total Addressable Market</div>
                  <div className="text-xs text-gray-500">US Healthcare Spending</div>
                </div>
                <div className="text-center bg-white/5 rounded-lg p-6">
                  <div className="text-4xl font-bold text-green-400">${marketOpportunity.sam}B</div>
                  <div className="text-sm text-gray-400 mt-1">Serviceable Market</div>
                  <div className="text-xs text-gray-500">Patient Out-of-Pocket Costs</div>
                </div>
                <div className="text-center bg-white/5 rounded-lg p-6">
                  <div className="text-4xl font-bold text-purple-400">${marketOpportunity.som}B</div>
                  <div className="text-sm text-gray-400 mt-1">Obtainable Market (5yr)</div>
                  <div className="text-xs text-gray-500">Our Target Segment</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-white mb-6">Competitive Advantages</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {competitiveAdvantages.map((advantage, index) => (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <advantage.icon className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{advantage.title}</h3>
                        <p className="text-gray-400 text-sm">{advantage.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Revenue Model</h2>
          <Card className="bg-white/5 border-white/10 mb-12">
            <CardContent className="p-6">
              <div className="space-y-6">
                {revenueStreams.map((stream) => (
                  <div key={stream.stream}>
                    <div className="flex justify-between mb-2">
                      <div>
                        <span className="text-white font-medium">{stream.stream}</span>
                        <span className="text-gray-500 text-sm ml-2">({stream.description})</span>
                      </div>
                      <span className="text-cyan-400 font-bold">{stream.percentage}%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${stream.percentage}%` }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-400" />
                  Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {teamHighlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-cyan-400" />
                  Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-20 flex-shrink-0">
                        <Badge className={`${i === milestones.length - 1 ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-white/10 text-gray-400 border-white/20'}`}>
                          {item.date}
                        </Badge>
                      </div>
                      <div className="text-gray-300 text-sm">{item.milestone}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Interested in Learning More?
              </h3>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                We're currently raising our Series A round. Request our full investor deck 
                and financial projections, or schedule a call with our founding team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                  onClick={() => window.location.href = 'mailto:investors@goldrockhealth.com?subject=Investor Inquiry'}
                  data-testid="button-contact-investors"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Investor Relations
                </Button>
                <Link href="/platform-stats">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" data-testid="button-view-metrics">
                    View Live Metrics
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
