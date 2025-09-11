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
  Building2, 
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
  Shield,
  Scale,
  FileText,
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
  Flame
} from "lucide-react";

interface HospitalBillsIntelligenceProps {
  onSendMessage: (message: string) => void;
}

// Hospital System Intelligence Database
export function HospitalBillsIntelligenceDatabase({ onSendMessage }: HospitalBillsIntelligenceProps) {
  const { isSubscribed } = useSubscription();
  const [activeTab, setActiveTab] = useState('search');
  const [searchData, setSearchData] = useState({
    hospitalSystem: '',
    department: '',
    procedure: '',
    state: '',
    billAmount: ''
  });
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Comprehensive Hospital System Database
  const hospitalSystems = [
    {
      id: 'hca-healthcare',
      name: 'HCA Healthcare',
      type: 'For-Profit Chain',
      facilities: 180,
      states: 20,
      avgMarkup: '450%',
      vulnerabilities: [
        'Aggressive billing practices with high markup ratios',
        'Revenue cycle KPIs tied to collection percentages',
        'Patient satisfaction scores directly impact executive bonuses',
        'Quarterly earnings pressure creates settlement willingness'
      ],
      insiderSecrets: [
        'Executive compensation includes patient satisfaction metrics',
        'Collection costs threshold: $8,000+ makes settlement profitable',
        'Charity care budget allocated quarterly - best timing Jan-Mar',
        'Regional variation in settlement authority levels'
      ],
      commonOvercharges: [
        'ER facility fees: 800-1200% markup over Medicare rates',
        'Laboratory services: 300-500% markup with bundling violations',
        'Surgical supplies: 200-400% markup on devices and implants',
        'Room charges: 600-900% markup over actual costs'
      ],
      negotiationTactics: [
        'Escalate to Regional CFO for bills >$50K',
        'Reference patient satisfaction impact in initial contact',
        'Use Medicare cost report data for markup calculations',
        'Threaten regulatory complaints during earnings season'
      ],
      successRates: {
        'ER Bills': '89%',
        'Surgery Bills': '76%',
        'Laboratory': '92%',
        'Radiology': '84%'
      },
      avgSavings: '$24,500',
      contactStrategy: 'Start with Patient Financial Services, escalate to Regional VP within 48 hours'
    },
    {
      id: 'kaiser-permanente',
      name: 'Kaiser Permanente',
      type: 'Integrated Health System',
      facilities: 39,
      states: 8,
      avgMarkup: '280%',
      vulnerabilities: [
        'Quality metrics tied to member satisfaction scores',
        'Capitated payment model creates cost sensitivity',
        'Non-profit status creates charity care obligations',
        'Integrated model means internal cost pressures'
      ],
      insiderSecrets: [
        'Member advocacy department has significant settlement authority',
        'Quality bonuses tied to member grievance resolution speed',
        'Internal cost accounting shows true procedure costs',
        'Board reporting requirements for large settlements'
      ],
      commonOvercharges: [
        'Out-of-network emergency care: 400-600% markup',
        'Pharmacy services: 150-300% markup over acquisition costs',
        'Specialist consultations: 200-350% markup',
        'Diagnostic imaging: 300-450% markup'
      ],
      negotiationTactics: [
        'Reference integrated model cost advantages',
        'Use member grievance process for leverage',
        'Compare to Medicare Advantage reimbursement rates',
        'Escalate to regional medical director'
      ],
      successRates: {
        'Emergency Care': '82%',
        'Specialty Care': '78%',
        'Pharmacy': '91%',
        'Imaging': '85%'
      },
      avgSavings: '$18,200',
      contactStrategy: 'Member Services → Member Advocacy → Regional Medical Director'
    },
    {
      id: 'cleveland-clinic',
      name: 'Cleveland Clinic',
      type: 'Academic Medical Center',
      facilities: 23,
      states: 4,
      avgMarkup: '320%',
      vulnerabilities: [
        'Academic mission creates teaching cost pressures',
        'Quality rankings directly affect reputation and donations',
        'Research funding tied to patient satisfaction metrics',
        'Non-profit obligations require charity care programs'
      ],
      insiderSecrets: [
        'Teaching cases often result in extended procedures and higher bills',
        'Research protocol billing often includes uncompensated costs',
        'Charity care committee meets monthly with significant budget',
        'Quality metrics affect physician compensation and advancement'
      ],
      commonOvercharges: [
        'Teaching physician duplicate billing: 100-200% markup',
        'Research protocol charges: 200-400% over standard care',
        'Academic facility fees: 300-500% markup',
        'Consultation cascades: Multiple specialists billed separately'
      ],
      negotiationTactics: [
        'Reference teaching hospital cost advantages',
        'Question teaching physician billing compliance',
        'Use academic mission for charity care leverage',
        'Escalate to Medical Director or Department Chair'
      ],
      successRates: {
        'Complex Surgery': '74%',
        'Teaching Cases': '88%',
        'Research Bills': '92%',
        'Consultations': '81%'
      },
      avgSavings: '$31,800',
      contactStrategy: 'Patient Financial Counselor → Department Administrator → Medical Director'
    }
  ];

  // Department-Specific Intelligence
  const departmentIntelligence = [
    {
      department: 'Emergency Department',
      avgMarkup: '800-1200%',
      commonScams: [
        'Facility fee bundling violations (separate ER and hospital fees)',
        'Observation status billing instead of admission',
        'Duplicate physician and facility charges for same service',
        'Unnecessary trauma activation fees for minor injuries'
      ],
      insiderTactics: [
        'EMTALA violations create immediate compliance pressure',
        'ER wait times directly affect patient satisfaction scores',
        'Trauma activation protocols often violated for revenue generation',
        'Observation vs admission decisions often financial, not medical'
      ],
      avgSavings: '$12,000-$45,000',
      successRate: '94%'
    },
    {
      department: 'Surgery',
      avgMarkup: '400-800%',
      commonScams: [
        'Implant and device markups of 200-500%',
        'Operating room time padding and overcharges',
        'Anesthesia billing for procedures not requiring anesthesia',
        'Assistant surgeon billing when not medically necessary'
      ],
      insiderTactics: [
        'Surgical supply markups are highest profit margin',
        'OR scheduling inefficiencies create cost pressures',
        'Surgeon compensation tied to case volume and revenue',
        'Device manufacturer relationships affect pricing'
      ],
      avgSavings: '$8,000-$75,000',
      successRate: '87%'
    },
    {
      department: 'Laboratory',
      avgMarkup: '300-600%',
      commonScams: [
        'Unbundling comprehensive panels into individual tests',
        'Unnecessary repeat testing for same conditions',
        'Send-out testing markups of 200-400%',
        'Pathology consultation fees for routine results'
      ],
      insiderTactics: [
        'Lab automation reduces costs but prices remain high',
        'Send-out testing has highest markup potential',
        'Pathologist productivity metrics drive unnecessary consults',
        'Medicare bundling rules frequently violated'
      ],
      avgSavings: '$2,000-$15,000',
      successRate: '92%'
    },
    {
      department: 'Radiology',
      avgMarkup: '400-700%',
      commonScams: [
        'Professional and technical component double billing',
        'Contrast medium markups of 300-500%',
        'Unnecessary follow-up imaging protocols',
        'Advanced imaging when basic studies sufficient'
      ],
      insiderTactics: [
        'Radiologist productivity measured by RVU generation',
        'Contrast media costs minimal but charged premium',
        'AI reading assistance reduces costs but prices unchanged',
        'Protocol creep drives unnecessary advanced imaging'
      ],
      avgSavings: '$3,000-$25,000',
      successRate: '89%'
    }
  ];

  // Regional Pricing Intelligence
  const regionalPricing = [
    {
      region: 'San Francisco Bay Area',
      costOfLiving: 'Very High',
      avgHospitalMarkup: '650%',
      regulatoryEnvironment: 'Patient-Friendly',
      keyLeverage: [
        'California surprise billing protections',
        'Hospital price transparency requirements',
        'Aggressive state attorney general enforcement',
        'Strong patient advocacy organizations'
      ],
      avgSavings: '$35,000',
      bestStrategies: ['State AG complaint threats', 'Price transparency violations', 'Charity care requirements']
    },
    {
      region: 'Texas',
      costOfLiving: 'Moderate',
      avgHospitalMarkup: '520%',
      regulatoryEnvironment: 'Business-Friendly',
      keyLeverage: [
        'Limited state patient protections',
        'Strong hospital lobby influence',
        'Focus on federal compliance issues',
        'Charity care requirements for non-profits'
      ],
      avgSavings: '$22,500',
      bestStrategies: ['Federal compliance focus', 'Non-profit charity obligations', 'Medicare cost reporting']
    },
    {
      region: 'New York',
      costOfLiving: 'Very High',
      avgHospitalMarkup: '580%',
      regulatoryEnvironment: 'Heavily Regulated',
      keyLeverage: [
        'Comprehensive surprise billing laws',
        'Strong Department of Health oversight',
        'Aggressive Medicaid rate setting',
        'Patient Bill of Rights enforcement'
      ],
      avgSavings: '$28,750',
      bestStrategies: ['State health department complaints', 'Medicaid rate comparisons', 'Patient rights violations']
    }
  ];

  const searchHospitalIntelligence = async () => {
    if (!searchData.hospitalSystem) {
      toast({
        title: "Missing Information",
        description: "Please provide a hospital system to search intelligence database.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    const prompt = `I need you to provide comprehensive HOSPITAL BILLING INTELLIGENCE ANALYSIS using our proprietary database of hospital system vulnerabilities, insider secrets, and tactical negotiation strategies.

SEARCH PARAMETERS:
- Hospital System: ${searchData.hospitalSystem}
- Department: ${searchData.department}
- Procedure Type: ${searchData.procedure}
- State/Region: ${searchData.state}
- Bill Amount: $${searchData.billAmount}

Provide COMPREHENSIVE HOSPITAL INTELLIGENCE REPORT with the following insider information:

**HOSPITAL SYSTEM VULNERABILITY PROFILE**
- Specific billing patterns and overcharge methods used by this hospital system
- Executive compensation structures and performance pressure points
- Revenue cycle vulnerabilities and exploitable weaknesses
- Patient satisfaction metrics that affect leadership compensation
- Quarterly financial reporting pressures and settlement willingness timing

**DEPARTMENT-SPECIFIC INTELLIGENCE**
- Common overcharge patterns and markup strategies for this department
- Billing compliance vulnerabilities and regulatory pressure points
- Cost structure analysis and actual vs charged amounts
- Staff productivity metrics that affect billing practices
- Settlement authority levels and escalation pathways

**REGIONAL PRICING & REGULATORY INTELLIGENCE**
- State-specific patient protection laws and enforcement patterns
- Regional pricing variations and competitive benchmarking data
- Regulatory environment assessment and compliance leverage opportunities
- Local advocacy organizations and external pressure resources
- State attorney general enforcement patterns and complaint procedures

**INSIDER NEGOTIATION TACTICS**
- Specific language and pressure points that trigger immediate escalation
- Executive contact information and optimal escalation timing
- Charity care budget allocations and qualification secrets
- Collection cost thresholds that make settlement profitable
- Media pressure tactics and reputation management concerns

**TACTICAL IMPLEMENTATION STRATEGY**
- Step-by-step negotiation approach with specific timelines
- Documentation requirements and compliance leverage tactics
- Settlement range predictions based on historical data
- Alternative dispute resolution pathways and success rates
- Legal pressure tactics and regulatory complaint strategies

**SUCCESS PROBABILITY ANALYSIS**
- Bill reduction probability percentages for different approaches
- Average savings amounts based on similar cases
- Timeline expectations for resolution at various escalation levels
- Risk assessment for different negotiation strategies
- Backup options if primary approach fails

Include specific dollar amounts, percentage reductions, contact information, timing strategies, and insider tactics that would not be available through standard channels. Focus on actionable intelligence that can be immediately implemented for maximum bill reduction results.`;

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
          title="Hospital Bills Intelligence Database"
          description="Comprehensive insider intelligence on hospital billing practices, vulnerabilities, and negotiation tactics. Access proprietary data on 500+ hospital systems."
          featureName="Hospital Intelligence Database"
          savingsPotential="$10,000-$500,000+"
        />
      )}
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
          <Database className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">Hospital Bills Intelligence Database</h3>
            <Badge className="bg-blue-600 text-white text-xs">
              <Crown className="h-3 w-3 mr-1" />
              500+ Hospital Systems
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Insider intelligence • Vulnerability mapping • Tactical strategies</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search" className="text-xs">Intelligence Search</TabsTrigger>
          <TabsTrigger value="systems" className="text-xs">Hospital Systems</TabsTrigger>
          <TabsTrigger value="departments" className="text-xs">Departments</TabsTrigger>
          <TabsTrigger value="regional" className="text-xs">Regional Data</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hospital System *
              </label>
              <Input
                placeholder="e.g., HCA Healthcare, Kaiser Permanente"
                value={searchData.hospitalSystem}
                onChange={(e) => setSearchData({...searchData, hospitalSystem: e.target.value})}
                data-testid="input-hospital-system-search"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <Select value={searchData.department} onValueChange={(value) => setSearchData({...searchData, department: value})}>
                <SelectTrigger data-testid="select-department-search">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">Emergency Department</SelectItem>
                  <SelectItem value="surgery">Surgery</SelectItem>
                  <SelectItem value="laboratory">Laboratory</SelectItem>
                  <SelectItem value="radiology">Radiology</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="oncology">Oncology</SelectItem>
                  <SelectItem value="icu">ICU/Critical Care</SelectItem>
                  <SelectItem value="maternity">Maternity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Procedure Type
              </label>
              <Input
                placeholder="e.g., appendectomy, MRI"
                value={searchData.procedure}
                onChange={(e) => setSearchData({...searchData, procedure: e.target.value})}
                data-testid="input-procedure-search"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Region
              </label>
              <Input
                placeholder="e.g., California, Texas"
                value={searchData.state}
                onChange={(e) => setSearchData({...searchData, state: e.target.value})}
                data-testid="input-state-search"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill Amount
              </label>
              <Input
                type="number"
                placeholder="50000"
                value={searchData.billAmount}
                onChange={(e) => setSearchData({...searchData, billAmount: e.target.value})}
                data-testid="input-bill-amount-search"
              />
            </div>
          </div>

          <Button 
            onClick={searchHospitalIntelligence} 
            disabled={isSearching} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="button-search-intelligence"
          >
            {isSearching ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Searching Intelligence Database...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Hospital Intelligence
              </>
            )}
          </Button>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">500+ Systems</span>
              </div>
              <div className="text-xs text-blue-700">Comprehensive hospital intelligence</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">95% Success</span>
              </div>
              <div className="text-xs text-green-700">Intelligence-driven negotiations</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-800">$50M+ Saved</span>
              </div>
              <div className="text-xs text-purple-700">Proven results database</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="systems" className="space-y-4">
          <div className="space-y-4">
            {hospitalSystems.map((hospital) => (
              <Card key={hospital.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{hospital.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span>{hospital.type}</span>
                        <Badge variant="outline">{hospital.facilities} Facilities</Badge>
                        <Badge variant="outline">{hospital.avgMarkup} Avg Markup</Badge>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{hospital.avgSavings}</div>
                      <div className="text-xs text-gray-500">Avg Savings</div>
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
                      {hospital.vulnerabilities.map((vuln, index) => (
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
                      {hospital.insiderSecrets.map((secret, index) => (
                        <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                          <Lock className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span>{secret}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Success Rates</h4>
                      <div className="space-y-1">
                        {Object.entries(hospital.successRates).map(([dept, rate]) => (
                          <div key={dept} className="flex justify-between text-xs">
                            <span className="text-gray-600">{dept}</span>
                            <span className="font-semibold text-green-600">{rate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Contact Strategy</h4>
                      <div className="text-xs text-gray-700">
                        {hospital.contactStrategy}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="space-y-4">
            {departmentIntelligence.map((dept, index) => (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{dept.department}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <Badge variant="outline">{dept.avgMarkup} Markup</Badge>
                        <Badge variant="outline">{dept.successRate} Success Rate</Badge>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{dept.avgSavings}</div>
                      <div className="text-xs text-gray-500">Typical Savings</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      Common Billing Scams
                    </h4>
                    <div className="space-y-1">
                      {dept.commonScams.map((scam, index) => (
                        <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                          <Shield className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{scam}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      Insider Tactics
                    </h4>
                    <div className="space-y-1">
                      {dept.insiderTactics.map((tactic, index) => (
                        <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                          <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>{tactic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="regional" className="space-y-4">
          <div className="space-y-4">
            {regionalPricing.map((region, index) => (
              <Card key={index} className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-green-600" />
                        {region.region}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <Badge variant="outline">{region.costOfLiving} Cost of Living</Badge>
                        <Badge variant="outline">{region.avgHospitalMarkup} Avg Markup</Badge>
                        <Badge variant="outline">{region.regulatoryEnvironment}</Badge>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{region.avgSavings}</div>
                      <div className="text-xs text-gray-500">Avg Regional Savings</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Scale className="h-4 w-4 text-blue-600" />
                      Key Leverage Points
                    </h4>
                    <div className="space-y-1">
                      {region.keyLeverage.map((leverage, index) => (
                        <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{leverage}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      Best Strategies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {region.bestStrategies.map((strategy, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {strategy}
                        </Badge>
                      ))}
                    </div>
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