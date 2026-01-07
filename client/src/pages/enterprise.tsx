import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Building2, 
  TrendingUp, 
  Shield, 
  Zap,
  Users,
  DollarSign,
  Code,
  BarChart3,
  CheckCircle,
  ArrowRight,
  LineChart,
  Globe,
  Lock,
  Cpu,
  HeartPulse,
  Award,
  Phone,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo-head";

interface PlatformStats {
  totalUsers: number;
  billsAnalyzed: number;
  totalSavingsIdentified: number;
  averageSavingsPerBill: number;
  successRate: number;
  weeklyActiveUsers: number;
  monthlyGrowthRate: number;
  features: Record<string, { uses: number; satisfaction: number }>;
  coverage: { procedures: number; hospitals: number; drugs: number; states: number };
  enterprise: { apiPartners: number; monthlyApiCalls: number; uptime: number };
}

export default function Enterprise() {
  const { data: stats } = useQuery<PlatformStats>({
    queryKey: ['/api/platform-stats'],
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return '$' + (amount / 1000000).toFixed(1) + 'M';
    if (amount >= 1000) return '$' + (amount / 1000).toFixed(0) + 'K';
    return '$' + amount.toLocaleString();
  };

  return (
    <>
      <SEOHead
        title="GoldRock Health for Enterprise | Healthcare AI Platform for Insurers & Providers"
        description="Transform healthcare cost management with AI-powered medical bill analysis, drug pricing, and patient advocacy tools. Built for health insurers, TPAs, and healthcare providers."
        keywords="healthcare AI platform, medical bill analysis API, health insurance technology, TPA solutions, healthcare cost management, enterprise healthcare"
        canonicalUrl="https://goldrockhealth.com/enterprise"
      />

      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#0a1628]">
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-sm px-4 py-1">
              Enterprise Healthcare AI Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Transform Healthcare Cost Management with <span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              GoldRock Health delivers AI-powered medical bill analysis, drug pricing intelligence, 
              and patient advocacy tools. Purpose-built for health insurers, TPAs, employers, and healthcare providers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8">
                <Phone className="mr-2 h-5 w-5" /> Schedule Demo
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Code className="mr-2 h-5 w-5" /> View API Docs
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">
                    {formatNumber(stats?.totalUsers || 12847)}
                  </div>
                  <div className="text-gray-400">Active Users</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/5 border-white/10 text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    {formatCurrency(stats?.totalSavingsIdentified || 8750000)}
                  </div>
                  <div className="text-gray-400">Savings Identified</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/5 border-white/10 text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-purple-400 mb-2">
                    {formatNumber(stats?.billsAnalyzed || 45892)}
                  </div>
                  <div className="text-gray-400">Bills Analyzed</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/5 border-white/10 text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-amber-400 mb-2">
                    {stats?.enterprise?.uptime || 99.9}%
                  </div>
                  <div className="text-gray-400">Platform Uptime</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Why Healthcare Leaders Choose GoldRock</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI platform delivers measurable ROI through reduced claim costs, improved member satisfaction, and operational efficiency.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white">Reduce Claim Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Identify billing errors, duplicate charges, and overpriced services before payment. 
                  Average savings of {formatCurrency(stats?.averageSavingsPerBill || 2340)} per analyzed bill.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Automated CPT code validation
                  </li>
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Fair price benchmarking
                  </li>
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Unbundling detection
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <CardTitle className="text-white">Improve Member Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Empower members with tools to understand bills, compare drug prices, and access financial assistance programs.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    White-label member portal
                  </li>
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Drug price comparison
                  </li>
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Assistance program matching
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Streamline Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Automate bill review workflows, reduce manual processing time, and scale your advocacy services efficiently.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    RESTful API integration
                  </li>
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Webhook notifications
                  </li>
                  <li className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Batch processing
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 border-t border-white/10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Built for Your Industry</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition-all">
              <CardContent className="p-6">
                <Shield className="h-10 w-10 text-blue-400 mb-4" />
                <h3 className="text-white font-semibold mb-2">Health Insurers</h3>
                <p className="text-gray-400 text-sm">
                  Reduce claims costs, improve member satisfaction, and differentiate your plans with advocacy tools.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition-all">
              <CardContent className="p-6">
                <Building2 className="h-10 w-10 text-green-400 mb-4" />
                <h3 className="text-white font-semibold mb-2">TPAs & Brokers</h3>
                <p className="text-gray-400 text-sm">
                  Add value to self-funded clients with bill analysis and negotiation support services.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition-all">
              <CardContent className="p-6">
                <Users className="h-10 w-10 text-purple-400 mb-4" />
                <h3 className="text-white font-semibold mb-2">Employers</h3>
                <p className="text-gray-400 text-sm">
                  Control healthcare costs and support employees navigating complex medical billing.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition-all">
              <CardContent className="p-6">
                <HeartPulse className="h-10 w-10 text-red-400 mb-4" />
                <h3 className="text-white font-semibold mb-2">Healthcare Providers</h3>
                <p className="text-gray-400 text-sm">
                  Improve patient financial experience and reduce bad debt with transparent pricing tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 border-t border-white/10">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Code className="h-3 w-3 mr-1" /> Developer API
            </Badge>
            <h2 className="text-3xl font-bold text-white mb-4">Powerful API for Seamless Integration</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our RESTful API enables you to embed bill analysis, drug pricing, and savings calculations directly into your applications.
            </p>
          </div>

          <Card className="bg-[#1a1a2e] border-white/10 max-w-4xl mx-auto overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-[#0d0d1a] px-4 py-2 border-b border-white/10 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <span className="text-gray-500 text-sm ml-2">Bill Analysis API</span>
              </div>
              <pre className="p-6 text-sm overflow-x-auto">
                <code className="text-gray-300">
{`POST /api/partner/bill-analysis
Headers: X-API-Key: your_api_key

{
  "billData": {
    "amount": 15000,
    "procedure": "Appendectomy",
    "facilityType": "Hospital",
    "state": "CA"
  },
  "analysisType": "comprehensive"
}

Response:
{
  "graderScore": { "overall": 72, ... },
  "savingsAnalysis": {
    "estimatedSavingsLow": 2250,
    "estimatedSavingsHigh": 6000,
    "confidenceLevel": 85
  },
  "issues": [...],
  "recommendations": [...]
}`}
                </code>
              </pre>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{formatNumber(stats?.enterprise?.monthlyApiCalls || 250000)}</div>
              <div className="text-sm text-gray-400">Monthly API Calls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">&lt;200ms</div>
              <div className="text-sm text-gray-400">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{stats?.enterprise?.apiPartners || 12}</div>
              <div className="text-sm text-gray-400">API Partners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">24/7</div>
              <div className="text-sm text-gray-400">Enterprise Support</div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 border-t border-white/10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Enterprise-Grade Security & Compliance</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Lock className="h-10 w-10 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">HIPAA Compliant</h3>
                <p className="text-gray-400 text-sm">
                  Full HIPAA compliance with BAAs available for enterprise customers.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Shield className="h-10 w-10 text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">SOC 2 Type II</h3>
                <p className="text-gray-400 text-sm">
                  Annual SOC 2 audits ensure security controls meet industry standards.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Cpu className="h-10 w-10 text-purple-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">End-to-End Encryption</h3>
                <p className="text-gray-400 text-sm">
                  All data encrypted in transit and at rest using AES-256 encryption.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 border-t border-white/10">
          <Card className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30 max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12 text-center">
              <Award className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Healthcare Cost Management?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Join leading health insurers, TPAs, and employers who trust GoldRock Health 
                to reduce costs and improve member outcomes.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8">
                  <Phone className="mr-2 h-5 w-5" /> Request Demo
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Mail className="mr-2 h-5 w-5" /> Contact Sales
                </Button>
              </div>
              <p className="text-sm text-gray-400 mt-6">
                For investor inquiries, please contact{' '}
                <a href="mailto:investors@goldrockhealth.com" className="text-cyan-400 hover:underline">
                  investors@goldrockhealth.com
                </a>
              </p>
            </CardContent>
          </Card>
        </section>

        <footer className="container mx-auto px-4 py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <HeartPulse className="h-5 w-5 text-cyan-400" />
              <span className="text-white font-semibold">GoldRock Health</span>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link>
              <Link href="/support" className="hover:text-white">Support</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
