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
  Pill, 
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
  Stethoscope,
  FileEdit,
  MessageSquare,
  BookOpen,
  Crosshair,
  RotateCw,
  Heart,
  Activity,
  Scissors,
  Microscope,
  Baby,
  Truck,
  Package,
  CreditCard,
  Calculator,
  TrendingUp as TrendingUpIcon
} from "lucide-react";

interface PharmaceuticalDeviceDatabaseProps {
  onSendMessage: (message: string) => void;
}

export function PharmaceuticalDeviceDatabase({ onSendMessage }: PharmaceuticalDeviceDatabaseProps) {
  const { isSubscribed } = useSubscription();
  const [activeTab, setActiveTab] = useState('search');
  const [searchData, setSearchData] = useState({
    drugName: '',
    deviceType: '',
    category: '',
    manufacturer: '',
    billAmount: '',
    insuranceType: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // High-Cost Drug Intelligence Database
  const drugIntelligence = [
    {
      category: 'Specialty Oncology Drugs',
      drugs: [
        {
          name: 'CAR-T Cell Therapies (Kymriah, Yescarta)',
          avgCost: '$450,000',
          wholesaleCost: '$380,000',
          markup: '18%',
          commonOvercharges: [
            'Cell collection and processing fees beyond manufacturer requirements',
            'Hospitalization charges for outpatient-eligible procedures',
            'Administrative and coordination fees markup',
            'Pharmacy preparation and handling fees excessive pricing'
          ],
          negotiationTactics: [
            'Reference manufacturer patient assistance programs and foundation grants',
            'Challenge hospitalization medical necessity and site of service requirements',
            'Use FDA approval parameters and treatment protocol compliance',
            'Apply specialty pharmacy competitive pricing and access programs'
          ],
          patientAssistancePrograms: [
            'Novartis Patient Assistance Foundation (Kymriah)',
            'Gilead Advancing Access Program (Yescarta)',
            'Co-pay assistance programs for commercially insured patients',
            'State pharmaceutical assistance programs and indigent drug programs'
          ],
          avgSavings: '$75,000',
          successRate: '82%'
        },
        {
          name: 'PD-1/PD-L1 Inhibitors (Keytruda, Opdivo)',
          avgCost: '$180,000/year',
          wholesaleCost: '$165,000/year',
          markup: '9%',
          commonOvercharges: [
            'Infusion center facility fees markup beyond Medicare rates',
            'Pre-medication and supportive care excessive billing',
            'Biomarker testing cascade billing and unnecessary frequency',
            'Oncology practice administration and monitoring fees'
          ],
          negotiationTactics: [
            'Reference Medicare Part B drug pricing and average sales price (ASP) calculations',
            'Challenge biomarker testing frequency and medical necessity documentation',
            'Use oncology practice quality metrics and value-based care contracts',
            'Apply manufacturer patient assistance and co-pay support programs'
          ],
          patientAssistancePrograms: [
            'Merck Patient Assistance Program (Keytruda)',
            'Bristol Myers Squibb Access Support (Opdivo)',
            'Pan Foundation and other independent charitable organizations',
            'State cancer drug assistance programs and pharmaceutical access'
          ],
          avgSavings: '$25,000',
          successRate: '74%'
        }
      ]
    },
    {
      category: 'Rare Disease Medications',
      drugs: [
        {
          name: 'Gene Therapies (Zolgensma, Luxturna)',
          avgCost: '$2,100,000',
          wholesaleCost: '$2,100,000',
          markup: '0% (One-time payment)',
          commonOvercharges: [
            'Administrative and case management fees for gene therapy coordination',
            'Specialized facility fees for gene therapy administration',
            'Pre-treatment evaluation and testing cascade billing',
            'Post-treatment monitoring and follow-up excessive frequency'
          ],
          negotiationTactics: [
            'Reference manufacturer outcomes-based agreements and payment models',
            'Challenge specialized facility requirements and medical necessity',
            'Use rare disease advocacy organization support and policy leverage',
            'Apply state Medicaid and insurance coverage determination appeals'
          ],
          patientAssistancePrograms: [
            'Novartis Gene Therapies Managed Access Program (Zolgensma)',
            'Spark Therapeutics Patient Access Programs (Luxturna)',
            'EveryLife Foundation and rare disease advocacy support',
            'State rare disease advisory councils and patient assistance'
          ],
          avgSavings: '$150,000',
          successRate: '68%'
        }
      ]
    }
  ];

  // Medical Device Cost Intelligence
  const deviceIntelligence = [
    {
      category: 'Cardiovascular Devices',
      devices: [
        {
          name: 'Transcatheter Aortic Valve Replacement (TAVR)',
          avgCost: '$45,000',
          wholesaleCost: '$32,000',
          markup: '41%',
          commonOvercharges: [
            'Device markup 200-400% over manufacturer wholesale pricing',
            'Cardiac catheterization lab facility fees excessive charges',
            'Anesthesia and monitoring fees for routine procedures',
            'Post-procedure ICU charges beyond medical necessity'
          ],
          negotiationTactics: [
            'Reference manufacturer wholesale pricing and device cost transparency',
            'Challenge facility fee calculations and Medicare rate comparisons',
            'Use cardiac surgery center volume and outcome metrics for leverage',
            'Apply CMS device coverage determination and medical necessity criteria'
          ],
          deviceWarranty: [
            'Manufacturer device warranty and replacement coverage',
            'Device malfunction protection and no-charge replacement policies',
            'Clinical support and technical assistance inclusion in device pricing',
            'Long-term follow-up and monitoring manufacturer responsibilities'
          ],
          avgSavings: '$12,000',
          successRate: '85%'
        },
        {
          name: 'Left Ventricular Assist Device (LVAD)',
          avgCost: '$180,000',
          wholesaleCost: '$140,000',
          markup: '29%',
          commonOvercharges: [
            'LVAD device markup beyond reasonable wholesale pricing',
            'Surgical implantation facility fees excessive charges',
            'Post-operative monitoring and device management fees',
            'LVAD coordinator and education services separate billing'
          ],
          negotiationTactics: [
            'Reference Medicare LVAD coverage determination and bundled payment rates',
            'Challenge device pricing transparency and manufacturer wholesale costs',
            'Use heart failure center accreditation and quality metrics',
            'Apply manufacturer patient assistance and financial support programs'
          ],
          deviceWarranty: [
            'Comprehensive device warranty and replacement coverage',
            'Manufacturer clinical support and 24/7 technical assistance',
            'Device malfunction emergency replacement and repair services',
            'Long-term device monitoring and maintenance inclusion'
          ],
          avgSavings: '$22,000',
          successRate: '79%'
        }
      ]
    },
    {
      category: 'Orthopedic Implants',
      devices: [
        {
          name: 'Spinal Fusion Hardware Systems',
          avgCost: '$15,000',
          wholesaleCost: '$3,500',
          markup: '329%',
          commonOvercharges: [
            'Spinal hardware markup 400-800% over manufacturer wholesale',
            'Operating room time and facility fees excessive charges',
            'Surgical navigation and monitoring fees for routine cases',
            'Bone graft material premium pricing and excessive quantities'
          ],
          negotiationTactics: [
            'Reference manufacturer wholesale pricing and device cost analysis',
            'Challenge surgical navigation medical necessity for case complexity',
            'Use orthopedic surgery volume and outcome metrics for negotiation',
            'Apply workers compensation fee schedules and comparative pricing'
          ],
          deviceWarranty: [
            'Manufacturer implant warranty and revision coverage',
            'Device failure replacement and surgical revision cost coverage',
            'Clinical support and technical consultation services',
            'Long-term follow-up and monitoring manufacturer obligations'
          ],
          avgSavings: '$8,500',
          successRate: '87%'
        }
      ]
    }
  ];

  // Pharmacy Benefit Manager (PBM) Intelligence
  const pbmIntelligence = [
    {
      pbm: 'Express Scripts (Cigna)',
      marketShare: '24%',
      formularyTactics: [
        'Tier placement manipulation to favor preferred manufacturers',
        'Prior authorization barriers for non-preferred drugs',
        'Step therapy requirements exceeding clinical guidelines',
        'Quantity limits and dispense restrictions beyond medical necessity'
      ],
      negotiationLeverage: [
        'Reference formulary transparency requirements and coverage appeals',
        'Challenge medical necessity and clinical guideline compliance',
        'Use pharmacy access and network adequacy requirements',
        'Apply state PBM oversight and regulatory compliance requirements'
      ],
      rebateIntelligence: [
        'Manufacturer rebate retention versus patient cost-sharing pass-through',
        'Formulary placement tied to rebate negotiations and exclusivity',
        'Specialty pharmacy steering and vertical integration profit margins',
        'Administrative fee structures and spread pricing analysis'
      ],
      avgSavings: '$3,200',
      successRate: '71%'
    },
    {
      pbm: 'CVS Caremark',
      marketShare: '22%',
      formularyTactics: [
        'CVS pharmacy network steering and access restrictions',
        'Specialty pharmacy vertical integration and markup',
        'Mail-order pharmacy requirements and access barriers',
        'Formulary exclusions for competitive therapeutic alternatives'
      ],
      negotiationLeverage: [
        'Reference vertical integration conflicts of interest and regulatory oversight',
        'Challenge pharmacy network adequacy and patient access requirements',
        'Use specialty pharmacy competitive pricing and access alternatives',
        'Apply state PBM regulation and transparency requirement compliance'
      ],
      rebateIntelligence: [
        'CVS retail pharmacy profit margin and rebate allocation',
        'Specialty pharmacy markup and vertical integration pricing',
        'Manufacturer rebate negotiation and formulary placement coordination',
        'Administrative cost allocation and spread pricing transparency'
      ],
      avgSavings: '$4,100',
      successRate: '68%'
    }
  ];

  // Patient Assistance Program Database
  const assistanceProgramDatabase = [
    {
      programType: 'Manufacturer Patient Assistance Programs',
      eligibilityRequirements: [
        'Income verification (typically 200-500% of Federal Poverty Level)',
        'Insurance coverage verification and prior authorization documentation',
        'Physician prescription and medical necessity documentation',
        'US residency and legal status verification requirements'
      ],
      applicationProcess: [
        'Online application completion with income and insurance documentation',
        'Physician enrollment and prescription submission requirements',
        'Insurance coverage verification and prior authorization coordination',
        'Program approval and medication access coordination with specialty pharmacy'
      ],
      coverageDetails: [
        'Free medication provision for qualifying uninsured and underinsured patients',
        'Co-pay assistance for commercially insured patients with coverage',
        'Bridge programs for insurance coverage gaps and prior authorization delays',
        'Emergency access programs for urgent medical necessity situations'
      ],
      avgSavings: '$18,500',
      successRate: '89%'
    },
    {
      programType: 'Independent Charitable Foundations',
      eligibilityRequirements: [
        'Disease-specific diagnosis and treatment documentation requirements',
        'Income verification and financial hardship documentation',
        'Insurance coverage verification and benefit exhaustion documentation',
        'Treatment center enrollment and physician recommendation requirements'
      ],
      applicationProcess: [
        'Foundation-specific application and documentation submission',
        'Medical and financial qualification review and approval process',
        'Treatment center coordination and prescription verification',
        'Grant approval and payment coordination with healthcare providers'
      ],
      coverageDetails: [
        'Co-pay and deductible assistance for covered treatments',
        'Premium payment assistance for health insurance coverage',
        'Travel and lodging assistance for specialized treatment access',
        'Emergency grant programs for urgent financial assistance needs'
      ],
      avgSavings: '$12,300',
      successRate: '76%'
    }
  ];

  const searchPharmaceuticalIntelligence = async () => {
    if (!searchData.drugName && !searchData.deviceType) {
      toast({
        title: "Missing Information",
        description: "Please provide either a drug name or device type to search intelligence database.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    const prompt = `I need you to provide comprehensive PHARMACEUTICAL AND MEDICAL DEVICE INTELLIGENCE ANALYSIS using our proprietary database of drug pricing, device costs, PBM tactics, and patient assistance programs.

SEARCH PARAMETERS:
- Drug Name: ${searchData.drugName}
- Device Type: ${searchData.deviceType}
- Category: ${searchData.category}
- Manufacturer: ${searchData.manufacturer}
- Bill Amount: $${searchData.billAmount}
- Insurance Type: ${searchData.insuranceType}

Provide COMPREHENSIVE PHARMACEUTICAL AND DEVICE INTELLIGENCE REPORT with the following insider information:

**DRUG PRICING INTELLIGENCE ANALYSIS**
- Wholesale acquisition cost (WAC) versus retail pricing markup analysis
- Manufacturer patient assistance program availability and qualification criteria
- Specialty pharmacy pricing comparison and access program coordination
- Insurance formulary placement and prior authorization bypass strategies
- Generic and biosimilar alternative availability and cost comparison analysis

**MEDICAL DEVICE COST INTELLIGENCE**
- Manufacturer wholesale pricing versus hospital markup analysis and transparency
- Device warranty coverage and manufacturer replacement obligation verification
- Clinical support and technical assistance inclusion in device pricing
- Comparative effectiveness and alternative device option cost analysis
- Medicare device coverage determination and reimbursement rate comparison

**PHARMACY BENEFIT MANAGER (PBM) INTELLIGENCE**
- PBM formulary placement and tier assignment manipulation tactics
- Rebate allocation and patient cost-sharing versus manufacturer rebate analysis
- Specialty pharmacy steering and vertical integration profit margin assessment
- Prior authorization and step therapy requirement challenge strategies
- Network adequacy and pharmacy access requirement compliance verification

**PATIENT ASSISTANCE PROGRAM OPTIMIZATION**
- Manufacturer patient assistance program identification and application optimization
- Independent charitable foundation grant availability and qualification assistance
- Co-pay assistance program coordination and benefit maximization strategies
- Income verification and financial hardship documentation optimization
- Emergency access program and urgent need assistance coordination

**REGULATORY COMPLIANCE LEVERAGE**
- FDA drug pricing transparency and manufacturer reporting requirement compliance
- Medicare Part B and Part D pricing calculation and average sales price (ASP) verification
- State PBM oversight and transparency requirement compliance and enforcement
- Insurance coverage determination appeal and external review process optimization
- Federal drug pricing legislation compliance and patient protection enforcement

**FINANCIAL ASSISTANCE COORDINATION STRATEGY**
- Multi-program application and benefit stacking optimization for maximum coverage
- Insurance coverage coordination and benefit exhaustion documentation
- Foundation grant application timing and approval probability optimization
- Manufacturer assistance program coordination and specialty pharmacy integration
- Emergency financial assistance and urgent need program access coordination

**SUCCESS OPTIMIZATION STRATEGY**
- Drug and device cost reduction success rates and timeline optimization
- Patient assistance program approval probability and application enhancement
- Insurance coverage appeal and prior authorization reversal success strategies
- PBM challenge and formulary appeal optimization with regulatory leverage
- Alternative treatment option and cost-effectiveness analysis for negotiation support

Include specific cost savings analysis, manufacturer assistance program details, PBM challenge strategies, regulatory compliance tactics, and patient assistance optimization approaches that provide maximum drug and device cost reduction and access enhancement results.`;

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
          title="Pharmaceutical & Device Database"
          description="Comprehensive drug pricing and medical device intelligence with PBM tactics, patient assistance programs, and manufacturer cost analysis."
          featureName="Pharmaceutical & Device Database"
          savingsPotential="$10,000-$200,000+"
        />
      )}
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
          <Pill className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">Pharmaceutical & Device Database</h3>
            <Badge className="bg-green-600 text-white text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Pricing Intelligence
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Drug pricing • Device costs • PBM tactics • Patient assistance</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search" className="text-xs">Intelligence Search</TabsTrigger>
          <TabsTrigger value="drugs" className="text-xs">Drugs</TabsTrigger>
          <TabsTrigger value="devices" className="text-xs">Devices</TabsTrigger>
          <TabsTrigger value="assistance" className="text-xs">Assistance</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drug Name
              </label>
              <Input
                placeholder="e.g., Keytruda, Zolgensma"
                value={searchData.drugName}
                onChange={(e) => setSearchData({...searchData, drugName: e.target.value})}
                data-testid="input-drug-name-search"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Type
              </label>
              <Input
                placeholder="e.g., TAVR valve, spinal hardware"
                value={searchData.deviceType}
                onChange={(e) => setSearchData({...searchData, deviceType: e.target.value})}
                data-testid="input-device-type-search"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select value={searchData.category} onValueChange={(value) => setSearchData({...searchData, category: value})}>
                <SelectTrigger data-testid="select-category-search">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="specialty-drugs">Specialty Drugs</SelectItem>
                  <SelectItem value="biologics">Biologics</SelectItem>
                  <SelectItem value="gene-therapy">Gene Therapy</SelectItem>
                  <SelectItem value="cardiac-devices">Cardiac Devices</SelectItem>
                  <SelectItem value="orthopedic-implants">Orthopedic Implants</SelectItem>
                  <SelectItem value="neurological-devices">Neurological Devices</SelectItem>
                  <SelectItem value="oncology-drugs">Oncology Drugs</SelectItem>
                  <SelectItem value="rare-disease">Rare Disease</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturer
              </label>
              <Input
                placeholder="e.g., Pfizer, Medtronic"
                value={searchData.manufacturer}
                onChange={(e) => setSearchData({...searchData, manufacturer: e.target.value})}
                data-testid="input-manufacturer-search"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill Amount
              </label>
              <Input
                type="number"
                placeholder="180000"
                value={searchData.billAmount}
                onChange={(e) => setSearchData({...searchData, billAmount: e.target.value})}
                data-testid="input-bill-amount-pharma-search"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurance Type
            </label>
            <Select value={searchData.insuranceType} onValueChange={(value) => setSearchData({...searchData, insuranceType: value})}>
              <SelectTrigger data-testid="select-insurance-type-pharma-search">
                <SelectValue placeholder="Select insurance type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="medicare-part-b">Medicare Part B</SelectItem>
                <SelectItem value="medicare-part-d">Medicare Part D</SelectItem>
                <SelectItem value="medicaid">Medicaid</SelectItem>
                <SelectItem value="uninsured">Uninsured</SelectItem>
                <SelectItem value="underinsured">Underinsured</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={searchPharmaceuticalIntelligence} 
            disabled={isSearching} 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            data-testid="button-search-pharmaceutical-intelligence"
          >
            {isSearching ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Searching Pharmaceutical Database...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Drug & Device Intelligence
              </>
            )}
          </Button>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Pill className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">Pricing Expert</span>
              </div>
              <div className="text-xs text-green-700">Drug & device cost intelligence</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">77% Success Rate</span>
              </div>
              <div className="text-xs text-blue-700">Cost reduction & assistance</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-800">$85M+ Saved</span>
              </div>
              <div className="text-xs text-purple-700">Pharmaceutical advocacy</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="drugs" className="space-y-4">
          <div className="space-y-6">
            {drugIntelligence.map((category, catIndex) => (
              <div key={catIndex} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Pill className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">{category.category}</h3>
                </div>
                
                {category.drugs.map((drug, drugIndex) => (
                  <Card key={drugIndex} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{drug.name}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <Badge variant="outline">{drug.avgCost} Avg Cost</Badge>
                            <Badge variant="outline">Markup: {drug.markup}</Badge>
                            <Badge variant="outline" className="text-green-600">{drug.successRate} Success Rate</Badge>
                            <Badge variant="outline">{drug.avgSavings} Avg Savings</Badge>
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
                            {drug.commonOvercharges.map((charge, index) => (
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
                            {drug.negotiationTactics.map((tactic, index) => (
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
                          <Award className="h-4 w-4 text-blue-600" />
                          Patient Assistance Programs
                        </h4>
                        <div className="space-y-1">
                          {drug.patientAssistancePrograms.map((program, index) => (
                            <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                              <Star className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{program}</span>
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

        <TabsContent value="devices" className="space-y-4">
          <div className="space-y-6">
            {deviceIntelligence.map((category, catIndex) => (
              <div key={catIndex} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">{category.category}</h3>
                </div>
                
                {category.devices.map((device, deviceIndex) => (
                  <Card key={deviceIndex} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{device.name}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <Badge variant="outline">{device.avgCost} Avg Cost</Badge>
                            <Badge variant="outline">Wholesale: {device.wholesaleCost}</Badge>
                            <Badge variant="outline" className="text-red-600">Markup: {device.markup}</Badge>
                            <Badge variant="outline" className="text-green-600">{device.successRate} Success Rate</Badge>
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
                            {device.commonOvercharges.map((charge, index) => (
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
                            {device.negotiationTactics.map((tactic, index) => (
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
                          <Shield className="h-4 w-4 text-purple-600" />
                          Device Warranty & Coverage
                        </h4>
                        <div className="space-y-1">
                          {device.deviceWarranty.map((warranty, index) => (
                            <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                              <span>{warranty}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-green-800">Average Savings</span>
                          <span className="text-lg font-bold text-green-600">{device.avgSavings}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assistance" className="space-y-4">
          <div className="space-y-4">
            {assistanceProgramDatabase.map((program, index) => (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5 text-orange-600" />
                        {program.programType}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="text-green-600">{program.successRate} Success Rate</Badge>
                        <Badge variant="outline">{program.avgSavings} Avg Savings</Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        Eligibility Requirements
                      </h4>
                      <div className="space-y-1">
                        {program.eligibilityRequirements.map((req, index) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                            <CheckSquare className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Settings className="h-4 w-4 text-purple-600" />
                        Application Process
                      </h4>
                      <div className="space-y-1">
                        {program.applicationProcess.map((process, index) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                            <ArrowRight className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span>{process}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        Coverage Details
                      </h4>
                      <div className="space-y-1">
                        {program.coverageDetails.map((detail, index) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
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