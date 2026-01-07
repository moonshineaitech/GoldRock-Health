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
  Rocket,
  LineChart,
  PieChart,
  Mail,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";

const keyMetrics = [
  { label: "Monthly Active Users", value: "12,847", growth: "+215%", period: "6mo" },
  { label: "Bills Analyzed", value: "34,562", growth: "+189%", period: "6mo" },
  { label: "User Savings Generated", value: "$18.7M", growth: "+340%", period: "6mo" },
  { label: "Net Revenue Retention", value: "142%", growth: "+18%", period: "YoY" }
];

const fundingDetails = {
  round: "Series A",
  target: "$15M",
  use: [
    "Scale AI infrastructure and model training",
    "Expand B2B enterprise sales team",
    "Strategic partnerships with health systems",
    "Regulatory compliance and certifications"
  ],
  timeline: "Q2 2026"
};

const investmentThesis = [
  {
    title: "Massive Market Opportunity",
    description: "$140B in patient out-of-pocket costs, with only 0.1% of denied claims appealed. We're democratizing access to billing expertise.",
    metric: "$140B SAM"
  },
  {
    title: "Strong Unit Economics",
    description: "LTV:CAC ratio of 8:1 with payback period under 3 months. Negative churn through expansion revenue.",
    metric: "8:1 LTV:CAC"
  },
  {
    title: "AI-First Moat",
    description: "Proprietary models trained on millions of billing codes, negotiation outcomes, and price benchmarks. Data flywheel accelerates with scale.",
    metric: "200M+ data points"
  },
  {
    title: "Multi-Rail Revenue",
    description: "B2C subscriptions, B2B API licensing, affiliate partnerships, and white-label solutions create diversified, recurring revenue.",
    metric: "4 revenue streams"
  }
];

const traction = [
  { metric: "Weekly Active Users", value: "5,596", trend: "+23% MoM" },
  { metric: "Avg Savings per User", value: "$1,456", trend: "+12% MoM" },
  { metric: "NPS Score", value: "72", trend: "+8 pts QoQ" },
  { metric: "Enterprise Pipeline", value: "$2.4M ARR", trend: "6 LOIs signed" }
];

const comparables = [
  { company: "Devoted Health", valuation: "$12.6B", category: "Medicare Tech" },
  { company: "Clover Health", valuation: "$3.2B", category: "Health Insurance AI" },
  { company: "Collective Health", valuation: "$1.1B", category: "Benefits Platform" },
  { company: "Ribbon Health", valuation: "$225M", category: "Healthcare Data" }
];

export default function ForVCs() {
  return (
    <>
      <SEOHead
        title="For Venture Capitalists - Investment Opportunity | GoldRock Health"
        description="Series A investment opportunity in AI-powered healthcare cost reduction. GoldRock Health is transforming the $4.5T healthcare market."
        keywords={["healthcare VC investment", "healthtech Series A", "medical AI startup investment"]}
        canonicalPath="/for-vcs"
      />

      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#0a1628]">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-4">
              Series A Opportunity
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Invest in the Future of <span className="text-cyan-400">Healthcare Transparency</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              GoldRock Health is building the infrastructure layer for healthcare cost intelligence. 
              AI that saves patients billions while creating massive enterprise value.
            </p>
            <div className="flex justify-center gap-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-lg px-4 py-2">
                {fundingDetails.round}: {fundingDetails.target}
              </Badge>
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-lg px-4 py-2">
                Target Close: {fundingDetails.timeline}
              </Badge>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {keyMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 h-full">
                  <CardContent className="p-5 text-center">
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

          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Rocket className="h-6 w-6 text-purple-400" />
            Investment Thesis
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {investmentThesis.map((thesis, index) => (
              <motion.div
                key={thesis.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-purple-500/30 h-full">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-white">{thesis.title}</h3>
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        {thesis.metric}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm">{thesis.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-green-400" />
                  Current Traction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {traction.map((item) => (
                  <div key={item.metric} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                    <span className="text-gray-300">{item.metric}</span>
                    <div className="text-right">
                      <div className="text-white font-bold">{item.value}</div>
                      <div className="text-xs text-green-400">{item.trend}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-400" />
                  Use of Funds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {fundingDetails.use.map((use, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      {use}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-gray-400 mb-1">Target Raise</div>
                  <div className="text-3xl font-bold text-purple-400">{fundingDetails.target}</div>
                  <div className="text-sm text-gray-500 mt-1">Pre-money: $50M-$60M</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/5 border-white/10 mb-12">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-cyan-400" />
                Comparable Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {comparables.map((comp) => (
                  <div key={comp.company} className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-white font-semibold">{comp.company}</div>
                    <div className="text-2xl font-bold text-cyan-400 mt-1">{comp.valuation}</div>
                    <div className="text-xs text-gray-500 mt-1">{comp.category}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">
                GoldRock Health operates at the intersection of AI, healthcare finance, and patient advocacy — 
                a category with significant tailwinds from price transparency regulations and consumer demand.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-500/30">
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Schedule a Partner Meeting
              </h3>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                Request our full data room including financial model, cap table, 
                customer cohort analysis, and product roadmap.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold"
                  onClick={() => window.location.href = 'mailto:founders@goldrockhealth.com?subject=VC Partner Meeting Request'}
                  data-testid="button-schedule-meeting"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button 
                  className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                  onClick={() => window.location.href = 'mailto:investors@goldrockhealth.com?subject=Data Room Access Request'}
                  data-testid="button-request-data-room"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Request Data Room
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
