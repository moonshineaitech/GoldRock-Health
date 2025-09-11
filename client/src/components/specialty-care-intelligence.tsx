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
  Stethoscope, 
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
  Flame,
  Building2,
  FileEdit,
  MessageSquare,
  BookOpen,
  Crosshair,
  RotateCw,
  Heart,
  Activity,
  Scissors,
  Microscope,
  Pill,
  Baby,
  Zap as ZapIcon
} from "lucide-react";

interface SpecialtyCareIntelligenceProps {
  onSendMessage: (message: string) => void;
}

export function SpecialtyCareIntelligence({ onSendMessage }: SpecialtyCareIntelligenceProps) {
  const { isSubscribed } = useSubscription();
  const [activeTab, setActiveTab] = useState('search');
  const [searchData, setSearchData] = useState({
    specialty: '',
    procedure: '',
    costCategory: '',
    insuranceType: '',
    billAmount: '',
    providerType: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // High-Cost Specialty Procedures Intelligence
  const specialtyProcedures = [
    {
      specialty: 'Cardiac Surgery',
      procedures: [
        {
          name: 'Coronary Artery Bypass Grafting (CABG)',
          avgCost: '$123,000',
          commonOvercharges: [
            'Heart-lung machine perfusion time padding (200-400% markup)',
            'Surgical assist fees for routine procedures',
            'ICU daily charges exceeding Medicare rates by 600%',
            'Cardiac catheterization lab fees separate from procedure'
          ],
          negotiationTactics: [
            'Reference CMS cardiac surgery bundle payments and quality metrics',
            'Challenge perfusion time documentation and medical necessity',
            'Use cardiac surgery center of excellence requirements for quality leverage',
            'Apply cardiac surgery volume and outcome metrics for provider negotiation'
          ],
          clinicalLeverage: [
            'STS (Society of Thoracic Surgeons) risk calculator and outcome predictions',
            'ACC/AHA cardiac surgery guidelines and appropriateness criteria',
            'Cardiac surgery quality metrics and public reporting requirements',
            'Heart team approach documentation and multidisciplinary decision making'
          ],
          avgSavings: '$35,000',
          successRate: '82%'
        },
        {
          name: 'Heart Transplant',
          avgCost: '$1,382,000',
          commonOvercharges: [
            'Organ acquisition costs markup beyond Medicare allowable',
            'Pre-transplant evaluation cascade billing',
            'Post-transplant immunosuppression protocol overcharges',
            'Heart transplant coordinator fees and case management'
          ],
          negotiationTactics: [
            'Reference Medicare heart transplant DRG payments and bundled rates',
            'Challenge organ acquisition cost calculations and UNOS fee structures',
            'Use transplant center quality metrics and SRTR outcomes data',
            'Apply CMS transplant center certification requirements for leverage'
          ],
          clinicalLeverage: [
            'ISHLT (International Society for Heart and Lung Transplantation) guidelines',
            'Transplant center volume requirements and outcome metrics',
            'UNOS allocation policy compliance and organ acquisition procedures',
            'Transplant recipient selection criteria and medical necessity documentation'
          ],
          avgSavings: '$180,000',
          successRate: '76%'
        }
      ]
    },
    {
      specialty: 'Oncology',
      procedures: [
        {
          name: 'CAR-T Cell Therapy',
          avgCost: '$450,000',
          commonOvercharges: [
            'Cell collection and processing fees beyond manufacturer costs',
            'Hospitalization for observation beyond medical necessity',
            'Cytokine release syndrome management cascade billing',
            'Specialized nursing and monitoring fees markup'
          ],
          negotiationTactics: [
            'Reference FDA approval parameters and treatment protocol requirements',
            'Challenge hospitalization medical necessity and observation level billing',
            'Use NCCN guidelines and CAR-T treatment center requirements',
            'Apply manufacturer patient assistance programs and foundation grants'
          ],
          clinicalLeverage: [
            'NCCN CAR-T therapy guidelines and treatment protocols',
            'FDA approval criteria and patient selection requirements',
            'CAR-T center certification and quality requirements',
            'Outcomes research and clinical trial data supporting medical necessity'
          ],
          avgSavings: '$85,000',
          successRate: '79%'
        },
        {
          name: 'Proton Beam Radiation Therapy',
          avgCost: '$180,000',
          commonOvercharges: [
            'Daily treatment delivery fees exceeding conventional radiation',
            'Treatment planning and dosimetry charges markup',
            'Proton facility premium fees beyond medical necessity justification',
            'Quality assurance and physics support separate billing'
          ],
          negotiationTactics: [
            'Challenge medical necessity versus conventional radiation therapy',
            'Reference Medicare proton therapy coverage criteria and limitations',
            'Use radiation oncology professional society guidelines for appropriateness',
            'Apply clinical trial enrollment and research protocol requirements'
          ],
          clinicalLeverage: [
            'ASTRO (American Society for Radiation Oncology) proton therapy guidelines',
            'Medicare proton therapy coverage determination criteria',
            'Clinical trial evidence supporting proton therapy over conventional radiation',
            'Pediatric cancer treatment protocols and long-term toxicity considerations'
          ],
          avgSavings: '$45,000',
          successRate: '74%'
        }
      ]
    },
    {
      specialty: 'Neurosurgery',
      procedures: [
        {
          name: 'Deep Brain Stimulation (DBS)',
          avgCost: '$125,000',
          commonOvercharges: [
            'DBS device markup 300-500% over manufacturer wholesale',
            'Intraoperative monitoring fees for routine procedures',
            'Programming and adjustment fees excessive frequency',
            'Neurostimulator replacement premature scheduling'
          ],
          negotiationTactics: [
            'Reference device manufacturer wholesale costs and markup analysis',
            'Challenge programming frequency and medical necessity documentation',
            'Use neurology professional society guidelines for DBS candidacy',
            'Apply movement disorder center accreditation requirements'
          ],
          clinicalLeverage: [
            'Movement Disorder Society DBS guidelines and patient selection criteria',
            'FDA device approval parameters and clinical trial requirements',
            'Neurology and neurosurgery professional society treatment protocols',
            'Movement disorder center accreditation and quality requirements'
          ],
          avgSavings: '$28,000',
          successRate: '81%'
        }
      ]
    },
    {
      specialty: 'Orthopedic Surgery',
      procedures: [
        {
          name: 'Spinal Fusion with Instrumentation',
          avgCost: '$110,000',
          commonOvercharges: [
            'Spinal hardware markup 400-800% over manufacturer costs',
            'Intraoperative neuromonitoring for routine cases',
            'Bone graft material excessive quantities and premium pricing',
            'Surgical navigation system fees for standard procedures'
          ],
          negotiationTactics: [
            'Reference implant manufacturer wholesale pricing and markup analysis',
            'Challenge neuromonitoring medical necessity for procedure complexity',
            'Use spine surgery professional society guidelines for hardware selection',
            'Apply workers compensation fee schedules and comparative pricing'
          ],
          clinicalLeverage: [
            'North American Spine Society guidelines and treatment protocols',
            'FDA device approval criteria and clinical indication requirements',
            'Spine surgery center accreditation and quality metrics',
            'Workers compensation medical treatment guidelines and fee schedules'
          ],
          avgSavings: '$32,000',
          successRate: '85%'
        }
      ]
    }
  ];

  // Prior Authorization Bypass Intelligence
  const priorAuthBypass = [
    {
      category: 'Experimental Treatment Designation',
      commonDenialReasons: [
        'FDA approval status misinterpretation',
        'Clinical trial availability arguments',
        'Investigational device exemption confusion',
        'Off-label use classification as experimental'
      ],
      bypassStrategies: [
        'FDA approval documentation with specific indication compliance',
        'Clinical trial unavailability or exclusion criteria documentation',
        'Off-label use medical literature and professional society support',
        'Compassionate use or expanded access program authorization'
      ],
      legalFramework: [
        'FDA approval process and indication-specific authorization',
        'Clinical trial informed consent and patient autonomy principles',
        'Medical practice standard of care and physician clinical judgment',
        'Insurance contract interpretation and coverage determination appeals'
      ],
      successRate: '73%',
      avgTimeToApproval: '28 days'
    },
    {
      category: 'Medical Necessity Documentation',
      commonDenialReasons: [
        'Insufficient clinical documentation supporting necessity',
        'Alternative treatment options not exhausted',
        'Severity of condition not adequately demonstrated',
        'Provider specialty and expertise not established'
      ],
      bypassStrategies: [
        'Comprehensive medical record documentation with severity markers',
        'Alternative treatment contraindication or failure documentation',
        'Provider credentials and specialty expertise documentation',
        'Second opinion consultation and independent medical review'
      ],
      legalFramework: [
        'Medical necessity legal definition and insurance contract interpretation',
        'Provider clinical judgment and standard of care requirements',
        'Patient autonomy and informed consent principles',
        'Insurance regulatory compliance and coverage determination standards'
      ],
      successRate: '81%',
      avgTimeToApproval: '21 days'
    },
    {
      category: 'Provider Network Authorization',
      commonDenialReasons: [
        'Out-of-network provider when in-network available',
        'Geographic accessibility not adequately demonstrated',
        'Provider expertise not sufficiently specialized',
        'Facility certification or accreditation requirements'
      ],
      bypassStrategies: [
        'Network adequacy mapping and provider availability analysis',
        'Provider specialty certification and expertise documentation',
        'Geographic access barriers and travel burden analysis',
        'Facility accreditation and quality metrics documentation'
      ],
      legalFramework: [
        'Insurance network adequacy regulatory requirements',
        'Provider credentialing and specialty certification standards',
        'Patient access to care and geographic accessibility principles',
        'Quality of care and provider expertise requirements'
      ],
      successRate: '78%',
      avgTimeToApproval: '14 days'
    }
  ];

  // Clinical Trial Billing Protection
  const clinicalTrialProtection = [
    {
      trialType: 'FDA Phase III Oncology Trials',
      commonBillingIssues: [
        'Standard of care services billed to patient despite trial participation',
        'Research-related procedures charged separately from trial coverage',
        'Hospitalization and monitoring fees beyond trial protocol requirements',
        'Drug administration and infusion fees for investigational treatments'
      ],
      protectionStrategies: [
        'Clinical trial informed consent review and billing responsibility clarification',
        'Sponsor billing guidelines and coverage determination documentation',
        'Standard of care versus research procedure classification',
        'Clinical trial insurance and indemnification coverage verification'
      ],
      regulatoryFramework: [
        'FDA clinical trial regulations and sponsor responsibilities',
        'Good Clinical Practice (GCP) guidelines and billing requirements',
        'Institutional Review Board (IRB) approval and oversight requirements',
        'Clinical trial agreement terms and billing responsibility allocation'
      ],
      avgSavings: '$15,000',
      successRate: '89%'
    },
    {
      trialType: 'Medical Device Clinical Trials',
      commonBillingIssues: [
        'Device costs billed to patient when provided by trial sponsor',
        'Implantation and surgical fees exceeding standard procedure costs',
        'Follow-up monitoring and imaging beyond standard of care',
        'Research coordinator and study visit fees charged to patient'
      ],
      protectionStrategies: [
        'Trial sponsor device provision documentation and billing exclusion',
        'Surgical procedure standard of care billing versus research enhancement',
        'Study protocol review and standard of care procedure identification',
        'Research cost separation and sponsor billing responsibility verification'
      ],
      regulatoryFramework: [
        'FDA investigational device exemption (IDE) regulations and sponsor duties',
        'Clinical trial agreement device provision and billing terms',
        'Medical device clinical trial protocol and standard of care definitions',
        'Institutional clinical trial billing compliance and oversight requirements'
      ],
      avgSavings: '$22,000',
      successRate: '85%'
    }
  ];

  const searchSpecialtyIntelligence = async () => {
    if (!searchData.specialty && !searchData.procedure) {
      toast({
        title: "Missing Information",
        description: "Please provide either a specialty or procedure to search intelligence database.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    const prompt = `I need you to provide comprehensive SPECIALTY CARE BILLING INTELLIGENCE ANALYSIS using our proprietary database of high-cost procedures, prior authorization tactics, and clinical trial protections.

SEARCH PARAMETERS:
- Medical Specialty: ${searchData.specialty}
- Procedure: ${searchData.procedure}
- Cost Category: ${searchData.costCategory}
- Insurance Type: ${searchData.insuranceType}
- Bill Amount: $${searchData.billAmount}
- Provider Type: ${searchData.providerType}

Provide COMPREHENSIVE SPECIALTY CARE INTELLIGENCE REPORT with the following insider information:

**HIGH-COST PROCEDURE ANALYSIS**
- Specialty-specific billing patterns and markup analysis for high-value procedures
- Device and implant cost structures with manufacturer wholesale versus hospital markup
- Surgical facility fees and professional component billing optimization
- Outcome-based payment model leverage and value-based care negotiation opportunities
- Specialty center accreditation requirements and quality metric leverage for billing disputes

**PRIOR AUTHORIZATION BYPASS STRATEGY**
- Medical necessity documentation enhancement with specialty-specific clinical criteria
- Experimental treatment designation challenges and FDA approval status verification
- Provider network authorization optimization and specialty expertise documentation
- Alternative treatment exhaustion documentation and contraindication analysis
- Appeal escalation pathway optimization with specialty-specific reviewer engagement

**CLINICAL TRIAL BILLING PROTECTION**
- Research versus standard of care service classification and billing responsibility
- Clinical trial sponsor coverage obligations and patient billing protection rights
- Investigational treatment billing compliance and regulatory framework application
- Research protocol analysis and standard of care service identification
- Clinical trial insurance coordination and coverage gap protection strategies

**SPECIALTY-SPECIFIC NEGOTIATION INTELLIGENCE**
- Professional society guideline leverage and clinical appropriateness criteria
- Specialty center accreditation requirements and quality metric negotiation advantages
- Provider credentials and expertise documentation for medical necessity support
- Outcome data and clinical evidence optimization for coverage determination appeals
- Specialty-specific regulatory compliance and oversight leverage opportunities

**DEVICE AND PHARMACEUTICAL INTELLIGENCE**
- Medical device manufacturer pricing analysis and markup identification
- Specialty pharmaceutical pricing negotiation and patient assistance program coordination
- Implant and device medical necessity documentation and alternative analysis
- Pharmacy benefit coordination and specialty medication coverage optimization
- Device manufacturer warranty and replacement coverage verification

**REGULATORY COMPLIANCE STRATEGY**
- FDA approval criteria and indication-specific coverage determination leverage
- Medicare coverage determination and local coverage determination (LCD) application
- Professional society treatment guideline compliance and coverage support
- Quality metric and outcome reporting compliance for provider negotiation leverage
- Specialty care access requirements and insurance network adequacy compliance

**SUCCESS OPTIMIZATION STRATEGY**
- Specialty-specific appeal success rates and timeline optimization
- Provider relationship leverage and referral pattern negotiation advantages
- Outcome improvement documentation and value-based care negotiation support
- Quality metric compliance and public reporting leverage for billing disputes
- Alternative payment model coordination and value-based contract negotiation

Include specific success rates, cost savings analysis, clinical evidence requirements, regulatory compliance strategies, and specialty-specific tactics that leverage professional society guidelines and quality requirements for maximum billing dispute resolution success.`;

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
          title="Specialty Care Intelligence"
          description="Comprehensive high-cost procedure intelligence with prior authorization bypass tactics, clinical trial protections, and specialty-specific negotiation strategies."
          featureName="Specialty Care Intelligence"
          savingsPotential="$25,000-$500,000+"
        />
      )}
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
          <Stethoscope className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">Specialty Care Intelligence</h3>
            <Badge className="bg-purple-600 text-white text-xs">
              <Crown className="h-3 w-3 mr-1" />
              High-Cost Expertise
            </Badge>
          </div>
          <p className="text-sm text-gray-600">High-cost procedures • Prior auth bypass • Clinical trials</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search" className="text-xs">Intelligence Search</TabsTrigger>
          <TabsTrigger value="procedures" className="text-xs">Procedures</TabsTrigger>
          <TabsTrigger value="prior-auth" className="text-xs">Prior Auth</TabsTrigger>
          <TabsTrigger value="clinical-trials" className="text-xs">Clinical Trials</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Specialty
              </label>
              <Select value={searchData.specialty} onValueChange={(value) => setSearchData({...searchData, specialty: value})}>
                <SelectTrigger data-testid="select-specialty-care-search">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiac-surgery">Cardiac Surgery</SelectItem>
                  <SelectItem value="oncology">Oncology</SelectItem>
                  <SelectItem value="neurosurgery">Neurosurgery</SelectItem>
                  <SelectItem value="orthopedic">Orthopedic Surgery</SelectItem>
                  <SelectItem value="transplant">Transplant Surgery</SelectItem>
                  <SelectItem value="radiation-oncology">Radiation Oncology</SelectItem>
                  <SelectItem value="interventional-cardiology">Interventional Cardiology</SelectItem>
                  <SelectItem value="plastic-surgery">Plastic Surgery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Procedure
              </label>
              <Input
                placeholder="e.g., Heart transplant, CAR-T therapy"
                value={searchData.procedure}
                onChange={(e) => setSearchData({...searchData, procedure: e.target.value})}
                data-testid="input-procedure-specialty-search"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Category
              </label>
              <Select value={searchData.costCategory} onValueChange={(value) => setSearchData({...searchData, costCategory: value})}>
                <SelectTrigger data-testid="select-cost-category-search">
                  <SelectValue placeholder="Cost range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-cost">High-Cost ($100K+)</SelectItem>
                  <SelectItem value="ultra-high">Ultra High-Cost ($500K+)</SelectItem>
                  <SelectItem value="experimental">Experimental/Investigational</SelectItem>
                  <SelectItem value="device-intensive">Device-Intensive</SelectItem>
                  <SelectItem value="pharmaceutical">Pharmaceutical-Heavy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Type
              </label>
              <Select value={searchData.insuranceType} onValueChange={(value) => setSearchData({...searchData, insuranceType: value})}>
                <SelectTrigger data-testid="select-insurance-type-specialty-search">
                  <SelectValue placeholder="Insurance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="medicare">Medicare</SelectItem>
                  <SelectItem value="medicaid">Medicaid</SelectItem>
                  <SelectItem value="medicare-advantage">Medicare Advantage</SelectItem>
                  <SelectItem value="self-pay">Self-Pay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill Amount
              </label>
              <Input
                type="number"
                placeholder="125000"
                value={searchData.billAmount}
                onChange={(e) => setSearchData({...searchData, billAmount: e.target.value})}
                data-testid="input-bill-amount-specialty-search"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider Type
            </label>
            <Select value={searchData.providerType} onValueChange={(value) => setSearchData({...searchData, providerType: value})}>
              <SelectTrigger data-testid="select-provider-type-search">
                <SelectValue placeholder="Select provider type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic-medical-center">Academic Medical Center</SelectItem>
                <SelectItem value="specialty-hospital">Specialty Hospital</SelectItem>
                <SelectItem value="community-hospital">Community Hospital</SelectItem>
                <SelectItem value="cancer-center">Cancer Center</SelectItem>
                <SelectItem value="cardiac-center">Cardiac Center</SelectItem>
                <SelectItem value="transplant-center">Transplant Center</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={searchSpecialtyIntelligence} 
            disabled={isSearching} 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            data-testid="button-search-specialty-intelligence"
          >
            {isSearching ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Searching Specialty Database...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Specialty Intelligence
              </>
            )}
          </Button>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-800">High-Cost Expert</span>
              </div>
              <div className="text-xs text-purple-700">$100K+ procedure intelligence</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">79% Success Rate</span>
              </div>
              <div className="text-xs text-green-700">Specialty care disputes</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">$125M+ Saved</span>
              </div>
              <div className="text-xs text-blue-700">High-cost procedure advocacy</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="procedures" className="space-y-4">
          <div className="space-y-6">
            {specialtyProcedures.map((specialty, specIndex) => (
              <div key={specIndex} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">{specialty.specialty}</h3>
                </div>
                
                {specialty.procedures.map((procedure, procIndex) => (
                  <Card key={procIndex} className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{procedure.name}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <Badge variant="outline">{procedure.avgCost} Avg Cost</Badge>
                            <Badge variant="outline" className="text-green-600">{procedure.successRate} Success Rate</Badge>
                            <Badge variant="outline">{procedure.avgSavings} Avg Savings</Badge>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            Common Overcharges
                          </h4>
                          <div className="space-y-1">
                            {procedure.commonOvercharges.map((charge, index) => (
                              <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                                <DollarSign className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                <span>{charge}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Target className="h-4 w-4 text-green-600" />
                            Negotiation Tactics
                          </h4>
                          <div className="space-y-1">
                            {procedure.negotiationTactics.map((tactic, index) => (
                              <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{tactic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          Clinical Leverage Points
                        </h4>
                        <div className="space-y-1">
                          {procedure.clinicalLeverage.map((leverage, index) => (
                            <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                              <Lightbulb className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{leverage}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prior-auth" className="space-y-4">
          <div className="space-y-4">
            {priorAuthBypass.map((auth, index) => (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-orange-600" />
                        {auth.category}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="text-green-600">{auth.successRate} Success Rate</Badge>
                        <Badge variant="outline">{auth.avgTimeToApproval}</Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        Common Denials
                      </h4>
                      <div className="space-y-1">
                        {auth.commonDenialReasons.map((reason, index) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                            <AlertTriangle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-600" />
                        Bypass Strategies
                      </h4>
                      <div className="space-y-1">
                        {auth.bypassStrategies.map((strategy, index) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{strategy}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Scale className="h-4 w-4 text-blue-600" />
                        Legal Framework
                      </h4>
                      <div className="space-y-1">
                        {auth.legalFramework.map((framework, index) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                            <FileText className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{framework}</span>
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

        <TabsContent value="clinical-trials" className="space-y-4">
          <div className="space-y-4">
            {clinicalTrialProtection.map((trial, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Microscope className="h-5 w-5 text-blue-600" />
                        {trial.trialType}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="text-green-600">{trial.successRate} Success Rate</Badge>
                        <Badge variant="outline">{trial.avgSavings} Avg Savings</Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        Billing Issues
                      </h4>
                      <div className="space-y-1">
                        {trial.commonBillingIssues.map((issue, index) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                            <DollarSign className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                            <span>{issue}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        Protection Strategies
                      </h4>
                      <div className="space-y-1">
                        {trial.protectionStrategies.map((strategy, index) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{strategy}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        Regulatory Framework
                      </h4>
                      <div className="space-y-1">
                        {trial.regulatoryFramework.map((framework, index) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                            <BookOpen className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{framework}</span>
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
      </Tabs>
    </motion.div>
  );
}