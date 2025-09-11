import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { PremiumPaywallOverlay } from "./premium-paywall-overlay";
import { 
  Shield, 
  Database, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Crown, 
  Search, 
  Filter, 
  Download, 
  Share,
  AlertTriangle,
  CheckCircle,
  FileText,
  Scale,
  BarChart3,
  MapPin,
  Clock,
  Users,
  Award,
  Lightbulb,
  Zap,
  Brain,
  Radar,
  Network,
  Lock,
  Key,
  Vault,
  RefreshCw,
  Star,
  TrendingDown,
  Calendar,
  Phone,
  Mail,
  Settings,
  Info,
  HelpCircle,
  Sparkles,
  Flame,
  Building2,
  CreditCard,
  Gavel,
  BookOpen,
  PieChart,
  LineChart
} from "lucide-react";

interface InsuranceClaimsDatabaseProps {
  onSendMessage: (message: string) => void;
}

export function InsuranceClaimsDatabase({ onSendMessage }: InsuranceClaimsDatabaseProps) {
  const { isSubscribed } = useSubscription();
  const [activeTab, setActiveTab] = useState('search');
  const [searchData, setSearchData] = useState({
    insuranceCompany: '',
    claimType: '',
    denialReason: '',
    billAmount: '',
    policyType: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Comprehensive Insurance Company Database
  const insuranceCompanies = [
    {
      id: 'united-healthcare',
      name: 'UnitedHealthcare',
      marketShare: '14.7%',
      avgDenialRate: '32%',
      appealSuccessRate: '67%',
      vulnerabilities: [
        'Overrides denial algorithms for customer retention cases',
        'Medical director review triggers above $10K in disputes',
        'State insurance commissioner complaints create immediate escalation',
        'Provider network disruption threats effective for large claims'
      ],
      insiderSecrets: [
        'Denial quotas tied to claims examiner performance bonuses',
        'Auto-approval triggers for claims under $500 with clean histories',
        'Medical director override authority for customer satisfaction scores',
        'Quarterly appeals budget allows higher approval rates in Q4'
      ],
      commonDenialTactics: [
        'Experimental/investigational labeling for FDA-approved treatments',
        'Prior authorization retroactive denials despite pre-approval',
        'Network adequacy denials forcing out-of-network costs',
        'Medical necessity challenges using outdated clinical guidelines'
      ],
      appealStrategies: [
        'Cite specific policy language with regulatory compliance emphasis',
        'Request peer-to-peer review with treating physician participation',
        'Escalate to state insurance commissioner with pattern documentation',
        'Use provider network adequacy arguments for coverage requirements'
      ],
      contactIntelligence: {
        'Medical Director': 'Available 2-4 PM EST, most receptive Tuesdays',
        'Appeals Department': 'Best response rates before 10 AM',
        'Customer Advocacy': 'Escalation authority up to $25K without additional approval',
        'State Relations': 'Direct line for regulatory compliance concerns'
      },
      avgSavings: '$18,500',
      bestApproach: 'Regulatory compliance emphasis with medical director escalation'
    },
    {
      id: 'anthem-bcbs',
      name: 'Anthem Blue Cross Blue Shield',
      marketShare: '11.8%',
      avgDenialRate: '29%',
      appealSuccessRate: '72%',
      vulnerabilities: [
        'State Blue Cross regulations create additional compliance requirements',
        'Provider network stability directly affects settlement willingness',
        'Quality metrics tied to member satisfaction and regulatory standing',
        'Local market dominance creates reputation sensitivity concerns'
      ],
      insiderSecrets: [
        'Blue distinction programs require specific appeal approval rates',
        'Provider contract negotiations use appeals data for rate setting',
        'State regulatory reporting includes appeals outcomes and timing',
        'Medical advisory committee meetings monthly influence policy changes'
      ],
      commonDenialTactics: [
        'Step therapy requirements despite physician override requests',
        'Formulary restrictions for newer medications with generic alternatives',
        'Facility level-of-care downgrades for reimbursement reduction',
        'Documentation timing requirements exceeding reasonable standards'
      ],
      appealStrategies: [
        'Reference Blue Cross state regulations and compliance requirements',
        'Use provider network adequacy and access-to-care arguments',
        'Escalate through state Blue Cross regulatory oversight channels',
        'Leverage member satisfaction and quality metric impacts'
      ],
      contactIntelligence: {
        'Medical Director': 'Responds best to provider network stability concerns',
        'Appeals Committee': 'Meets Wednesdays, decisions announced Fridays',
        'State Regulatory Liaison': 'Direct escalation for compliance issues',
        'Provider Relations': 'Settlement authority for network stability issues'
      },
      avgSavings: '$22,750',
      bestApproach: 'State Blue Cross regulatory framework with network stability emphasis'
    },
    {
      id: 'aetna-cvs',
      name: 'Aetna (CVS Health)',
      marketShare: '9.4%',
      avgDenialRate: '35%',
      appealSuccessRate: '64%',
      vulnerabilities: [
        'CVS pharmacy integration creates conflict of interest vulnerabilities',
        'Corporate reputation management prioritizes quick resolution',
        'Vertical integration regulatory scrutiny creates settlement pressure',
        'PBM pricing transparency requirements affect coverage decisions'
      ],
      insiderSecrets: [
        'CVS retail pharmacy steering affects coverage policy decisions',
        'Specialty pharmacy profits influence prior authorization policies',
        'Corporate compliance department has override authority for reputation issues',
        'Vertical integration regulatory reviews create conservative settlement approaches'
      ],
      commonDenialTactics: [
        'CVS pharmacy network steering for specialty medications',
        'Prior authorization barriers for non-CVS specialty pharmacy fills',
        'PBM formulary restrictions favoring CVS-negotiated drugs',
        'Site-of-care management favoring CVS-owned facilities'
      ],
      appealStrategies: [
        'Challenge vertical integration conflicts of interest in coverage decisions',
        'Use PBM transparency requirements and regulatory oversight for leverage',
        'Escalate to corporate compliance for reputation management concerns',
        'Reference specialty pharmacy access and patient choice requirements'
      ],
      contactIntelligence: {
        'Corporate Compliance': 'Reputation-sensitive with quick resolution authority',
        'PBM Appeals': 'Separate process with higher approval rates',
        'Medical Affairs': 'Clinical oversight independent of pharmacy operations',
        'Regulatory Affairs': 'Direct line for vertical integration concerns'
      },
      avgSavings: '$16,200',
      bestApproach: 'Vertical integration compliance challenges with corporate escalation'
    },
    {
      id: 'humana',
      name: 'Humana',
      marketShare: '8.1%',
      avgDenialRate: '31%',
      appealSuccessRate: '69%',
      vulnerabilities: [
        'Medicare Advantage focus creates CMS oversight vulnerability',
        'Provider network narrow design creates access-to-care liability',
        'Star ratings directly affect government contract renewals',
        'Geographic concentration creates regulatory scrutiny in key markets'
      ],
      insiderSecrets: [
        'CMS Star ratings include appeals resolution speed and outcomes',
        'Medicare Advantage margins pressure requires careful appeals management',
        'Provider network adequacy complaints trigger CMS investigation risk',
        'Geographic market concentration creates heightened regulatory attention'
      ],
      commonDenialTactics: [
        'Prior authorization requirements exceeding CMS guidelines',
        'Network adequacy challenges for specialty care access',
        'Medical necessity reviews using restrictive criteria',
        'Administrative denials for documentation technicalities'
      ],
      appealStrategies: [
        'Reference CMS oversight and Medicare Advantage compliance requirements',
        'Use Star ratings impact and member satisfaction for leverage',
        'Challenge network adequacy and access-to-care restrictions',
        'Escalate to CMS compliance for regulatory oversight'
      ],
      contactIntelligence: {
        'CMS Compliance Officer': 'Direct authority for regulatory compliance issues',
        'Medicare Advantage Appeals': 'Expedited process for CMS reporting requirements',
        'Star Ratings Manager': 'Member satisfaction and outcome metrics focus',
        'Provider Network Relations': 'Access-to-care and adequacy concern resolution'
      },
      avgSavings: '$19,800',
      bestApproach: 'CMS compliance and Star ratings impact with regulatory escalation'
    }
  ];

  // Claim Type Intelligence
  const claimTypeIntelligence = [
    {
      type: 'Prior Authorization Denials',
      commonReasons: [
        'Medical necessity not established',
        'Alternative treatments not attempted',
        'Experimental/investigational classification',
        'Network provider requirements not met'
      ],
      reversalTactics: [
        'Peer-to-peer calls with treating physician present',
        'Literature reviews supporting medical necessity',
        'Emergency/urgent need documentation with timeline pressure',
        'Provider network adequacy challenges and access-to-care arguments'
      ],
      successRate: '78%',
      avgTimeline: '14-21 days',
      keyLeverage: 'Medical director review with clinical necessity emphasis'
    },
    {
      type: 'Experimental Treatment Denials',
      commonReasons: [
        'FDA approval status interpretation',
        'Clinical trial availability arguments',
        'Standard of care alternatives cited',
        'Cost-effectiveness analysis rejection'
      ],
      reversalTactics: [
        'FDA approval documentation and regulatory compliance citations',
        'Clinical trial unavailability or exclusion criteria documentation',
        'Peer-reviewed literature supporting efficacy and safety',
        'Independent medical examiner reviews and second opinions'
      ],
      successRate: '65%',
      avgTimeline: '21-35 days',
      keyLeverage: 'Independent review organization (IRO) external review process'
    },
    {
      type: 'Network Provider Denials',
      commonReasons: [
        'Out-of-network provider billing',
        'Network adequacy claims by insurer',
        'Emergency care network exemptions',
        'Specialist availability requirements'
      ],
      reversalTactics: [
        'Network adequacy mapping and provider availability analysis',
        'Emergency care federal and state protection law citations',
        'Geographic access standards and regulatory compliance requirements',
        'Provider credentialing delays and network management issues'
      ],
      successRate: '85%',
      avgTimeline: '7-14 days',
      keyLeverage: 'State insurance commissioner complaints with network adequacy violations'
    },
    {
      type: 'Billing Code Denials',
      commonReasons: [
        'CPT code bundling and unbundling disputes',
        'ICD-10 diagnosis code matching requirements',
        'Modifier usage and documentation requirements',
        'Medical coding compliance and accuracy standards'
      ],
      reversalTactics: [
        'Medical coding expert reviews and documentation support',
        'CMS guidelines citations and regulatory compliance emphasis',
        'Provider credentialing and coding certification documentation',
        'Medical record documentation supporting code assignment accuracy'
      ],
      successRate: '82%',
      avgTimeline: '10-18 days',
      keyLeverage: 'Medical coding compliance and provider certification standards'
    }
  ];

  // State Regulatory Intelligence
  const stateRegulations = [
    {
      state: 'California',
      regulatoryStrength: 'Very Strong',
      keyProtections: [
        'Comprehensive surprise billing protections',
        'External review process with binding decisions',
        'Prompt payment laws with penalty provisions',
        'Provider network adequacy strict enforcement'
      ],
      appealAdvantages: [
        'State insurance commissioner aggressive enforcement',
        'Consumer advocacy organization support available',
        'External review organization independent oversight',
        'Surprise billing law federal and state coordination'
      ],
      avgAppealSuccess: '81%',
      avgSavings: '$28,500',
      bestStrategy: 'State regulatory compliance emphasis with external review process'
    },
    {
      state: 'Texas',
      regulatoryStrength: 'Moderate',
      keyProtections: [
        'Limited surprise billing protections',
        'Basic external review requirements',
        'Standard prompt payment provisions',
        'Network adequacy minimum standards'
      ],
      appealAdvantages: [
        'Federal law preemption opportunities',
        'Large market leverage with insurers',
        'Provider network stability concerns',
        'Economic impact arguments effectiveness'
      ],
      avgAppealSuccess: '68%',
      avgSavings: '$19,200',
      bestStrategy: 'Federal compliance and economic impact with large market leverage'
    },
    {
      state: 'New York',
      regulatoryStrength: 'Very Strong',
      keyProtections: [
        'Comprehensive patient protection laws',
        'Aggressive state oversight and enforcement',
        'Strong external review process requirements',
        'Provider network adequacy strict standards'
      ],
      appealAdvantages: [
        'Department of Financial Services strong enforcement',
        'Consumer protection emphasis in state policy',
        'External review binding decision authority',
        'Provider and patient advocacy organization coordination'
      ],
      avgAppealSuccess: '84%',
      avgSavings: '$31,750',
      bestStrategy: 'DFS oversight and consumer protection law enforcement'
    }
  ];

  const searchInsuranceIntelligence = async () => {
    if (!searchData.insuranceCompany) {
      toast({
        title: "Missing Information",
        description: "Please provide an insurance company to search intelligence database.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    const prompt = `I need you to provide comprehensive INSURANCE CLAIMS INTELLIGENCE ANALYSIS using our proprietary database of insurance company tactics, denial patterns, and appeal strategies.

SEARCH PARAMETERS:
- Insurance Company: ${searchData.insuranceCompany}
- Claim Type: ${searchData.claimType}
- Denial Reason: ${searchData.denialReason}
- Bill Amount: $${searchData.billAmount}
- Policy Type: ${searchData.policyType}

Provide COMPREHENSIVE INSURANCE INTELLIGENCE REPORT with the following insider information:

**INSURANCE COMPANY VULNERABILITY PROFILE**
- Company-specific denial algorithms and decision-making patterns
- Executive compensation structures tied to loss ratios and member satisfaction
- Regulatory oversight vulnerabilities and state compliance requirements
- Financial performance pressures affecting claims approval decisions
- Corporate reputation management priorities and escalation triggers

**CLAIMS PROCESSING INTELLIGENCE**
- Automated decision-making criteria and override opportunities
- Claims examiner performance metrics and approval authority levels
- Medical director review triggers and peer-to-peer call optimization
- Appeals committee composition and decision-making patterns
- Settlement authority levels and escalation pathway mapping

**REGULATORY COMPLIANCE LEVERAGE**
- State insurance commissioner complaint procedures and effectiveness
- Federal oversight requirements (ACA, ERISA, etc.) and enforcement patterns
- External review organization coordination and binding decision processes
- Network adequacy requirements and provider access compliance obligations
- Prompt payment law enforcement and penalty calculation methods

**DENIAL PATTERN ANALYSIS**
- Company-specific denial reasons and algorithmic patterns
- Medical necessity criteria interpretation and challenge opportunities
- Prior authorization gaming tactics and bypass strategies
- Experimental treatment classification challenges and reversal methods
- Billing code manipulation detection and correction procedures

**APPEAL STRATEGY OPTIMIZATION**
- Company-specific appeal procedures and success rate optimization
- Medical director engagement tactics and peer-to-peer call preparation
- Independent review organization selection and presentation strategies
- Regulatory escalation timing and complaint filing optimization
- Legal pressure application and settlement negotiation tactics

**SUCCESS PROBABILITY ANALYSIS**
- Appeal success rates by company, claim type, and amount ranges
- Timeline expectations for resolution at various escalation levels
- Settlement range predictions based on company patterns and precedents
- Alternative dispute resolution pathways and success probabilities
- Legal action thresholds and cost-benefit analysis recommendations

**TACTICAL IMPLEMENTATION STRATEGY**
- Step-by-step appeal approach with company-specific customization
- Documentation requirements and medical evidence optimization
- Regulatory complaint coordination and multi-front pressure application
- Settlement negotiation tactics leveraging company vulnerabilities
- Backup strategies and alternative resolution pathway development

Include specific success rates, settlement ranges, contact information, timing strategies, and company-specific tactics that would not be available through standard appeals processes. Focus on actionable intelligence that can be immediately implemented for maximum claim approval and settlement results.`;

    onSendMessage(prompt);
    setIsSearching(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 relative"
    >
      {!isSubscribed && (
        <PremiumPaywallOverlay
          title="Insurance Claims Intelligence Database"
          description="Comprehensive insider intelligence on insurance company denial patterns, appeal strategies, and regulatory leverage tactics. Access proprietary data on major insurers."
          featureName="Insurance Claims Database"
          savingsPotential="$15,000-$250,000+"
        />
      )}
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">Insurance Claims Intelligence Database</h3>
            <Badge className="bg-indigo-600 text-white text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Major Insurers Covered
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Denial patterns • Appeal strategies • Regulatory leverage</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search" className="text-xs">Intelligence Search</TabsTrigger>
          <TabsTrigger value="companies" className="text-xs">Insurers</TabsTrigger>
          <TabsTrigger value="claims" className="text-xs">Claim Types</TabsTrigger>
          <TabsTrigger value="regulations" className="text-xs">State Regs</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Company *
              </label>
              <Input
                placeholder="e.g., UnitedHealthcare, Anthem"
                value={searchData.insuranceCompany}
                onChange={(e) => setSearchData({...searchData, insuranceCompany: e.target.value})}
                data-testid="input-insurance-company-search"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Claim Type
              </label>
              <Select value={searchData.claimType} onValueChange={(value) => setSearchData({...searchData, claimType: value})}>
                <SelectTrigger data-testid="select-claim-type-search">
                  <SelectValue placeholder="Select claim type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prior-auth">Prior Authorization</SelectItem>
                  <SelectItem value="experimental">Experimental Treatment</SelectItem>
                  <SelectItem value="network">Network Provider</SelectItem>
                  <SelectItem value="billing-code">Billing Code</SelectItem>
                  <SelectItem value="emergency">Emergency Care</SelectItem>
                  <SelectItem value="specialty">Specialty Care</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy Benefits</SelectItem>
                  <SelectItem value="durable-equipment">Durable Medical Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Denial Reason
              </label>
              <Input
                placeholder="e.g., Medical necessity"
                value={searchData.denialReason}
                onChange={(e) => setSearchData({...searchData, denialReason: e.target.value})}
                data-testid="input-denial-reason-search"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill Amount
              </label>
              <Input
                type="number"
                placeholder="25000"
                value={searchData.billAmount}
                onChange={(e) => setSearchData({...searchData, billAmount: e.target.value})}
                data-testid="input-bill-amount-insurance-search"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy Type
              </label>
              <Select value={searchData.policyType} onValueChange={(value) => setSearchData({...searchData, policyType: value})}>
                <SelectTrigger data-testid="select-policy-type-search">
                  <SelectValue placeholder="Policy type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual/ACA</SelectItem>
                  <SelectItem value="employer">Employer Group</SelectItem>
                  <SelectItem value="medicare-advantage">Medicare Advantage</SelectItem>
                  <SelectItem value="medicaid">Medicaid Managed Care</SelectItem>
                  <SelectItem value="short-term">Short-term</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={searchInsuranceIntelligence} 
            disabled={isSearching} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            data-testid="button-search-insurance-intelligence"
          >
            {isSearching ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Searching Insurance Database...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Insurance Intelligence
              </>
            )}
          </Button>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-800">Major Insurers</span>
              </div>
              <div className="text-xs text-indigo-700">Comprehensive company intelligence</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">73% Appeal Success</span>
              </div>
              <div className="text-xs text-green-700">Intelligence-driven appeals</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-800">$25M+ Recovered</span>
              </div>
              <div className="text-xs text-purple-700">Proven appeal strategies</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          <div className="space-y-4">
            {insuranceCompanies.map((company) => (
              <Card key={company.id} className="border-l-4 border-l-indigo-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <Badge variant="outline">{company.marketShare} Market Share</Badge>
                        <Badge variant="outline" className="text-red-600">{company.avgDenialRate} Denial Rate</Badge>
                        <Badge variant="outline" className="text-green-600">{company.appealSuccessRate} Appeal Success</Badge>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{company.avgSavings}</div>
                      <div className="text-xs text-gray-500">Avg Recovery</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-red-600" />
                      Key Vulnerabilities
                    </h4>
                    <div className="space-y-1">
                      {company.vulnerabilities.map((vuln, index) => (
                        <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>{vuln}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Key className="h-4 w-4 text-purple-600" />
                      Insider Secrets
                    </h4>
                    <div className="space-y-1">
                      {company.insiderSecrets.map((secret, index) => (
                        <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                          <Lock className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span>{secret}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Contact Intelligence</h4>
                      <div className="space-y-1">
                        {Object.entries(company.contactIntelligence).map(([role, info]) => (
                          <div key={role} className="text-xs">
                            <span className="font-medium text-gray-700">{role}:</span>
                            <br />
                            <span className="text-gray-600">{info}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Best Approach</h4>
                      <div className="text-xs text-gray-700">
                        {company.bestApproach}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="claims" className="space-y-4">
          <div className="space-y-4">
            {claimTypeIntelligence.map((claim, index) => (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{claim.type}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <Badge variant="outline" className="text-green-600">{claim.successRate} Success Rate</Badge>
                        <Badge variant="outline">{claim.avgTimeline}</Badge>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-blue-600">{claim.keyLeverage}</div>
                      <div className="text-xs text-gray-500">Primary Leverage</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        Common Denial Reasons
                      </h4>
                      <div className="space-y-1">
                        {claim.commonReasons.map((reason, index) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                            <Shield className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-600" />
                        Reversal Tactics
                      </h4>
                      <div className="space-y-1">
                        {claim.reversalTactics.map((tactic, index) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                            <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{tactic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="regulations" className="space-y-4">
          <div className="space-y-4">
            {stateRegulations.map((state, index) => (
              <Card key={index} className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-green-600" />
                        {state.state}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <Badge variant="outline">{state.regulatoryStrength} Protection</Badge>
                        <Badge variant="outline" className="text-green-600">{state.avgAppealSuccess} Success Rate</Badge>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{state.avgSavings}</div>
                      <div className="text-xs text-gray-500">Avg State Recovery</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Scale className="h-4 w-4 text-blue-600" />
                        Key Protections
                      </h4>
                      <div className="space-y-1">
                        {state.keyProtections.map((protection, index) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{protection}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-600" />
                        Appeal Advantages
                      </h4>
                      <div className="space-y-1">
                        {state.appealAdvantages.map((advantage, index) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                            <Award className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{advantage}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-800 mb-1">Best Strategy</h4>
                    <div className="text-xs text-blue-700">{state.bestStrategy}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}