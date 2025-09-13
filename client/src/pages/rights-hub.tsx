import { useState } from "react";
import { motion } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { useAuth } from "@/hooks/useAuth";
import { 
  Shield, 
  Scale, 
  Heart, 
  AlertCircle,
  CheckCircle, 
  Download,
  ArrowRight,
  Copy,
  Search,
  FileText,
  Phone,
  Mail,
  Calendar,
  Target,
  ShieldCheck,
  BookOpen,
  Award,
  Zap,
  Users,
  Star,
  Calculator,
  Eye,
  CreditCard,
  PhoneCall,
  ClipboardList,
  FileX,
  Receipt,
  Building,
  Gavel,
  HandCoins,
  UserCheck,
  Timer,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  Lightbulb,
  FileEdit,
  Banknote,
  Percent,
  LineChart,
  Code,
  MessageCircle,
  DollarSign,
  Clock,
  TrendingDown,
  FileCheck,
  Crown,
  Lock,
  HelpCircle,
  BadgeCheck,
  Briefcase,
  Database,
  PieChart,
  Activity,
  Clipboard,
  FileBarChart,
  TrendingDownIcon,
  AlertTriangle,
  Crosshair,
  Handshake,
  MapPin,
  Building2,
  CreditCard as CreditCardIcon,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Helper function for copying text to clipboard
async function copyToClipboard(text: string, toast: any) {
  try {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard",
    });
  } catch (e) {
    console.error('Failed to copy to clipboard:', e);
    toast({
      title: "Copy failed",
      description: "Failed to copy text to clipboard",
      variant: "destructive",
    });
  }
}

// Patient Rights Categories Data
const patientRightsCategories = [
  {
    id: "no-surprises-act",
    title: "No Surprises Act Protections",
    icon: ShieldCheck,
    description: "Comprehensive protections against surprise medical bills from out-of-network providers",
    effectiveDate: "January 1, 2022",
    keyProtections: [
      "Emergency services must be billed at in-network rates regardless of provider network status",
      "Advance notice required for out-of-network services at in-network facilities",
      "Good faith estimate required for uninsured/self-pay patients within 3 business days",
      "Independent dispute resolution process for billing disputes",
      "Balance billing protections for emergency and non-emergency services"
    ],
    commonViolations: [
      "Emergency room bills at out-of-network rates",
      "Surprise bills from anesthesiologists, radiologists, or pathologists",
      "No advance notice of out-of-network providers",
      "Billing above good faith estimates by $400+ without justification"
    ],
    actionSteps: [
      "Request immediate correction if billed out-of-network rates for emergency services",
      "File complaints with CMS if advance notice wasn't provided",
      "Dispute bills exceeding good faith estimates through IDR process",
      "Contact state insurance commissioner for additional protections"
    ],
    complaintProcess: {
      federal: "Submit complaints to CMS at cms.gov/nosurprises",
      phone: "1-800-985-3059",
      timeline: "Response within 60 days",
      documentation: ["Bills showing surprise charges", "Insurance EOBs", "Provider network directories"]
    }
  },
  {
    id: "good-faith-estimate",
    title: "Good Faith Estimate Requirements",
    icon: Calculator,
    description: "Federal requirements for healthcare cost estimates and patient protections when estimates are exceeded",
    effectiveDate: "January 1, 2022",
    keyProtections: [
      "Estimate required within 3 business days of scheduling or patient request",
      "Must include all expected charges from all providers for the service",
      "Final bill cannot exceed estimate by $400+ without justification",
      "Patient-provider dispute resolution available for estimate violations",
      "Applies to uninsured patients and out-of-network services"
    ],
    commonViolations: [
      "No estimate provided within required timeframe",
      "Incomplete estimates missing ancillary provider charges",
      "Bills exceeding estimates by more than $400 without explanation",
      "Verbal estimates not followed up with written documentation"
    ],
    actionSteps: [
      "Always request written estimates for any scheduled services",
      "Save all estimate documentation and compare with final bills",
      "File disputes within 120 days if bills exceed estimates significantly",
      "Use estimate violations as leverage in billing negotiations"
    ],
    disputeProcess: {
      timeline: "File within 120 days of receiving bill",
      process: "Submit to convener for patient-provider dispute resolution",
      cost: "No cost to patients for dispute process",
      resolution: "Binding decision within 30 days"
    }
  },
  {
    id: "emtala-rights",
    title: "Emergency Medical Treatment Rights (EMTALA)",
    icon: Heart,
    description: "Federal law guaranteeing emergency medical treatment regardless of ability to pay",
    effectiveDate: "1986 (ongoing)",
    keyProtections: [
      "Right to medical screening examination for emergency conditions",
      "Stabilization of emergency medical conditions before transfer or discharge",
      "No discrimination based on ability to pay or insurance status",
      "Prohibition against patient 'dumping' to other facilities",
      "Informed consent required for transfers"
    ],
    commonViolations: [
      "Refusing treatment due to inability to pay",
      "Inadequate medical screening in emergency departments",
      "Premature discharge of unstable patients",
      "Inappropriate transfers without stabilization",
      "Demanding payment before providing emergency screening"
    ],
    actionSteps: [
      "Know your right to emergency screening regardless of insurance",
      "Request medical screening if you believe you have an emergency condition",
      "Document any refusal of treatment or pressure to leave before stabilization",
      "Report violations to CMS and state health departments immediately"
    ],
    reporting: {
      federal: "CMS Regional Office and Department of Health & Human Services",
      state: "State health department and hospital licensing board",
      documentation: ["Medical records", "Witness statements", "Communication records"],
      timeline: "Report within 72 hours when possible"
    }
  },
  {
    id: "insurance-network",
    title: "Insurance Network Adequacy Requirements",
    icon: Users,
    description: "State and federal standards ensuring adequate access to in-network healthcare providers",
    effectiveDate: "Varies by state",
    keyProtections: [
      "Adequate network of providers within reasonable distance",
      "Appointment availability standards for different types of care",
      "Provider directory accuracy and timeliness requirements",
      "Prior authorization limitations and expedited review processes",
      "Continuity of care protections during network changes"
    ],
    commonViolations: [
      "Inaccurate provider directories showing unavailable providers",
      "Excessive wait times for specialty appointments",
      "Inadequate geographic access to providers",
      "Sudden network terminations without continuity protections"
    ],
    actionSteps: [
      "Document network adequacy issues with specific provider search attempts",
      "Request expedited prior authorizations when medically necessary",
      "File complaints with state insurance commissioner for network gaps",
      "Appeal denials based on network adequacy failures"
    ],
    standards: {
      primaryCare: "Within 15 miles or 30 minutes in urban areas",
      specialty: "Within 25 miles or 45 minutes in urban areas",
      appointments: "Primary care within 10 business days, specialists within 15 business days",
      rural: "Different standards apply for rural and frontier areas"
    }
  },
  {
    id: "billing-transparency",
    title: "Billing Transparency & Price Disclosure Rights",
    icon: Eye,
    description: "Federal and state requirements for healthcare price transparency and patient access to cost information",
    effectiveDate: "Various dates 2021-2023",
    keyProtections: [
      "Hospital price transparency requirements for all services",
      "Machine-readable files and consumer-friendly displays",
      "Good faith estimate requirements for scheduled services",
      "Right to itemized bills with detailed service descriptions",
      "Advanced notice of out-of-network provider involvement"
    ],
    commonViolations: [
      "Refusing to provide price estimates before service",
      "Non-compliance with price transparency posting requirements",
      "Unclear or incomplete itemized billing statements",
      "Lack of advance notice about out-of-network providers"
    ],
    actionSteps: [
      "Request price estimates in writing before any scheduled services",
      "Demand itemized bills within 30 days of service",
      "Compare hospital published prices with your bills",
      "Report non-compliance with transparency requirements to CMS"
    ],
    transparency: {
      requirements: "All hospitals must post machine-readable price files",
      consumerTools: "Consumer-friendly price displays for common services",
      compliance: "CMS enforcement through civil monetary penalties",
      penalties: "Up to $2 million annually for non-compliance"
    }
  },
  {
    id: "appeals-external-review",
    title: "Appeals & External Review Processes",
    icon: Scale,
    description: "Patient rights to appeal insurance denials and access independent external review",
    effectiveDate: "Ongoing",
    keyProtections: [
      "Internal appeals process with insurance companies",
      "External independent review for continued denials",
      "Expedited review processes for urgent medical needs",
      "No cost external review for most services",
      "Right to continued coverage during appeals"
    ],
    commonViolations: [
      "Improper denial of medically necessary services",
      "Failure to provide clear appeal instructions",
      "Delays in processing urgent appeals",
      "Terminating coverage during pending appeals"
    ],
    actionSteps: [
      "File internal appeals within required timeframes (usually 60-180 days)",
      "Request expedited appeals for urgent medical needs",
      "Proceed to external review if internal appeal is denied",
      "Maintain coverage during appeal processes"
    ],
    timeline: {
      internalAppeal: "30 days for standard, 72 hours for urgent",
      externalReview: "45 days for standard, 72 hours for urgent",
      coverage: "Must continue during appeal period",
      documentation: "Medical records, provider letters, clinical guidelines"
    }
  },
  {
    id: "charity-care",
    title: "Charity Care & Financial Assistance Rights",
    icon: Heart,
    description: "Federal requirements for nonprofit hospital charity care and financial assistance programs",
    effectiveDate: "2014 (ACA requirements)",
    keyProtections: [
      "Charity care programs required at all nonprofit hospitals",
      "Written financial assistance policies must be publicly available",
      "Application processes in multiple languages",
      "Prohibition on extraordinary collection actions before eligibility determination",
      "Plain language billing and collection notices"
    ],
    commonViolations: [
      "Failure to inform patients about charity care programs",
      "Pursuing collections before evaluating eligibility",
      "Excessive documentation requirements for applications",
      "Language barriers preventing access to assistance"
    ],
    actionSteps: [
      "Request charity care information at registration and billing",
      "Apply within 240 days of first billing statement",
      "Demand suspension of collections during application review",
      "Appeal denials with additional documentation"
    ],
    eligibility: {
      fullDiscount: "Income below 200% Federal Poverty Level",
      partialDiscount: "Income 200-400% Federal Poverty Level",
      documentation: "Pay stubs, tax returns, bank statements",
      timeline: "Decision within 30 days of complete application"
    }
  },
  {
    id: "prior-authorization",
    title: "Medical Necessity & Prior Authorization Protections",
    icon: FileCheck,
    description: "Patient protections against improper prior authorization denials and medical necessity determinations",
    effectiveDate: "Ongoing with 2023 enhancements",
    keyProtections: [
      "Prior authorization decisions by qualified medical professionals",
      "Expedited review for urgent medical needs",
      "Clear criteria for medical necessity determinations",
      "Right to appeals and external review of denials",
      "Continuity of care protections for ongoing treatments"
    ],
    commonViolations: [
      "Denials by non-medical personnel",
      "Excessive delays in authorization decisions",
      "Retroactive denials of previously authorized services",
      "Failure to provide clear denial reasons"
    ],
    actionSteps: [
      "Request expedited review for urgent medical needs",
      "Ensure decisions are made by qualified medical professionals",
      "Appeal denials with supporting medical documentation",
      "Report inappropriate delays to state insurance commissioners"
    ],
    standards: {
      standard: "Decision within 7-14 days",
      urgent: "Decision within 72 hours",
      qualifications: "Licensed medical professionals in relevant specialty",
      appeals: "Available for all denials with external review option"
    }
  }
];

// Interactive Violation Checker Data
const violationScenarios = [
  {
    id: "surprise-er-bill",
    title: "Surprise Emergency Room Bill",
    description: "Received out-of-network charges for emergency services",
    category: "No Surprises Act",
    questions: [
      "Was this an emergency medical condition?",
      "Were you billed at out-of-network rates?",
      "Did you receive advance notice of out-of-network providers?",
      "Was the hospital in-network with your insurance?"
    ],
    potentialViolation: "No Surprises Act violation - emergency services must be billed at in-network rates",
    actionItems: [
      "Contact insurance company to demand in-network rate application",
      "File complaint with CMS No Surprises Help Desk",
      "Request immediate billing correction from provider",
      "Consider independent dispute resolution if needed"
    ]
  },
  {
    id: "estimate-exceeded",
    title: "Bill Exceeds Good Faith Estimate",
    description: "Final bill significantly higher than estimate provided",
    category: "Good Faith Estimate",
    questions: [
      "Did you receive a written estimate before service?",
      "Does the final bill exceed the estimate by $400 or more?",
      "Were you self-pay or using out-of-network services?",
      "Has it been less than 120 days since you received the bill?"
    ],
    potentialViolation: "Good Faith Estimate violation - bills cannot exceed estimates by $400+ without justification",
    actionItems: [
      "Compare final bill to original estimate documentation",
      "Request written justification for additional charges",
      "File patient-provider dispute resolution within 120 days",
      "Use violation as leverage in payment negotiations"
    ]
  },
  {
    id: "charity-care-denied",
    title: "Denied Charity Care Eligibility",
    description: "Financial assistance application was denied improperly",
    category: "Charity Care Rights",
    questions: [
      "Is your income below 400% of Federal Poverty Level?",
      "Did you provide all requested documentation?",
      "Did the hospital provide clear denial reasons?",
      "Are you being pursued for collections during application review?"
    ],
    potentialViolation: "Improper charity care denial or collection actions during review",
    actionItems: [
      "Request detailed denial explanation and appeal rights",
      "Provide additional financial hardship documentation", 
      "Demand suspension of all collection activities",
      "File complaint with state attorney general if needed"
    ]
  }
];

// Complaint Letter Templates
const complaintTemplates = [
  {
    id: "no-surprises-complaint",
    title: "No Surprises Act Violation Complaint",
    category: "Surprise Billing",
    recipient: "Healthcare Provider & CMS",
    template: `[Date]

[Provider Name]
[Provider Address]

RE: No Surprises Act Violation - Account #[ACCOUNT NUMBER]
Patient: [YOUR NAME]
Date of Service: [SERVICE DATE]

Dear Provider Representative,

I am writing to formally complaint about violations of the No Surprises Act (H.R.133) regarding my emergency medical treatment on [SERVICE DATE].

VIOLATION DETAILS:
• Emergency services billed at out-of-network rates despite federal protections
• No advance notice provided regarding out-of-network provider involvement
• Balance billing attempted in violation of federal law
• [Additional specific violations]

REQUIRED IMMEDIATE ACTIONS:
1. Apply in-network rates to all emergency services immediately
2. Cease all balance billing and collection activities
3. Provide corrected billing statement within 30 days
4. Confirm compliance with federal protections going forward

This matter is being reported simultaneously to:
• CMS No Surprises Help Desk (1-800-985-3059)
• State Insurance Commissioner
• Hospital Administration and Compliance Department

I expect immediate correction of these violations and compliance with federal law. Please confirm receipt of this complaint and provide a timeline for resolution within 10 business days.

Sincerely,
[YOUR NAME]
[CONTACT INFORMATION]

CC: CMS No Surprises Help Desk, State Insurance Commissioner`
  },
  {
    id: "good-faith-dispute",
    title: "Good Faith Estimate Violation Dispute",
    category: "Billing Transparency",
    recipient: "Healthcare Provider",
    template: `[Date]

[Provider Name]
Patient Financial Services
[Provider Address]

RE: Good Faith Estimate Violation - Patient-Provider Dispute Resolution
Account #[ACCOUNT NUMBER]
Patient: [YOUR NAME]
Date of Service: [SERVICE DATE]

Dear Financial Services Team,

I am initiating a patient-provider dispute resolution under federal Good Faith Estimate requirements regarding services provided on [SERVICE DATE].

ESTIMATE VIOLATION:
• Original estimate dated [ESTIMATE DATE]: $[ESTIMATE AMOUNT]
• Final bill dated [BILL DATE]: $[FINAL AMOUNT]
• Variance: $[DIFFERENCE] ([PERCENTAGE]% increase)
• Exceeds $400 threshold without adequate justification

DOCUMENTATION ATTACHED:
☐ Original good faith estimate
☐ Final itemized bill
☐ Insurance explanation of benefits
☐ Communication records

REQUESTED RESOLUTION:
I request binding arbitration through the federal patient-provider dispute resolution process. The final bill should be adjusted to reflect the original estimate plus only documented, justifiable additional services.

Per federal requirements, I am requesting:
1. Immediate suspension of all collection activities
2. Assignment to qualified dispute resolution entity
3. Review by independent medical and billing experts
4. Binding decision within 30 days of process initiation

This dispute is filed within the required 120-day timeframe and meets all federal criteria for patient-provider dispute resolution.

Please confirm receipt and provide dispute resolution process information within 5 business days.

Sincerely,
[YOUR NAME]
[CONTACT INFORMATION]

Enclosures: [LIST ATTACHED DOCUMENTS]`
  },
  {
    id: "charity-care-appeal",
    title: "Charity Care Denial Appeal",
    category: "Financial Assistance",
    recipient: "Hospital Financial Assistance",
    template: `[Date]

[Hospital Name]
Financial Assistance Appeals Department
[Hospital Address]

RE: Charity Care Denial Appeal - Account #[ACCOUNT NUMBER]
Patient: [YOUR NAME]
Original Application Date: [APPLICATION DATE]
Denial Date: [DENIAL DATE]

Dear Appeals Committee,

I am formally appealing the denial of my charity care application dated [DENIAL DATE]. Based on your published financial assistance policy and my documented financial circumstances, I believe the denial was made in error.

FINANCIAL CIRCUMSTANCES:
• Annual household income: $[AMOUNT] ([XX]% of Federal Poverty Level)
• Household size: [NUMBER] people
• Monthly essential expenses: $[AMOUNT]
• Liquid assets: $[AMOUNT] (less than 6 months living expenses)
• [Additional hardship factors]

POLICY COMPLIANCE:
According to your published charity care policy:
• Income below [XX]% FPL qualifies for [XX]% discount
• Documentation provided meets all stated requirements
• Application submitted within 240-day eligibility window
• No extraordinary collection actions should occur during review

ADDITIONAL DOCUMENTATION PROVIDED:
☐ Updated income verification
☐ Medical expense documentation
☐ Hardship explanation letter
☐ Asset verification
☐ [Other supporting documents]

REQUESTED ACTIONS:
1. Immediate reversal of charity care denial
2. Application of appropriate discount percentage
3. Suspension of all collection activities during appeal
4. Written confirmation of approved financial assistance

I respectfully request expedited review of this appeal given my documented financial hardship. Please provide a written decision within 30 days as required by your policy.

If this appeal is not resolved favorably, I will escalate to:
• State Attorney General's Office
• IRS Exempt Organizations Division
• Hospital licensing authorities

Thank you for your prompt attention to this matter.

Sincerely,
[YOUR NAME]
[CONTACT INFORMATION]

Enclosures: [LIST ATTACHED DOCUMENTS]`
  }
];

// Regulatory Contact Database
const regulatoryContacts = [
  {
    category: "Federal Agencies",
    contacts: [
      {
        agency: "Centers for Medicare & Medicaid Services (CMS)",
        purpose: "No Surprises Act violations, hospital billing issues",
        phone: "1-800-985-3059",
        website: "cms.gov/nosurprises",
        email: "NoSurprises@cms.hhs.gov"
      },
      {
        agency: "Department of Health & Human Services",
        purpose: "EMTALA violations, patient dumping",
        phone: "1-800-368-1019",
        website: "hhs.gov/ocr",
        email: "ocrmail@hhs.gov"
      },
      {
        agency: "Consumer Financial Protection Bureau",
        purpose: "Medical debt collection violations",
        phone: "1-855-411-2372",
        website: "consumerfinance.gov",
        email: "info@consumerfinance.gov"
      }
    ]
  },
  {
    category: "State Resources",
    contacts: [
      {
        agency: "State Insurance Commissioner",
        purpose: "Insurance coverage disputes, network adequacy",
        phone: "Varies by state",
        website: "naic.org/state_web_map.htm",
        email: "Contact through state website"
      },
      {
        agency: "State Attorney General",
        purpose: "Healthcare fraud, charity care violations",
        phone: "Varies by state",
        website: "naag.org/find-my-ag",
        email: "Contact through state website"
      },
      {
        agency: "State Health Department",
        purpose: "Hospital licensing, EMTALA violations",
        phone: "Varies by state",
        website: "astho.org/StateHealthDepts",
        email: "Contact through state website"
      }
    ]
  }
];

export default function RightsHub() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [violationCheckerStep, setViolationCheckerStep] = useState(0);
  const [violationAnswers, setViolationAnswers] = useState<Record<string, boolean>>({});
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const filteredRights = patientRightsCategories.filter(right =>
    right.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    right.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (selectedCategory && right.title.includes(selectedCategory))
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const resetViolationChecker = () => {
    setViolationCheckerStep(0);
    setViolationAnswers({});
    setSelectedScenario("");
  };

  return (
    <MobileLayout title="Know Your Rights Hub" showBackButton>
      <div className="space-y-6">
        {/* Header Section */}
        <MobileCard className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Know Your Rights Hub
            </h1>
            <p className="text-gray-600 text-sm">
              Comprehensive guide to patient rights and medical billing protections. 
              Free educational resources to help you navigate healthcare billing.
            </p>
          </div>
          
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            100% Free Resource
          </Badge>
        </MobileCard>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="rights" data-testid="tab-rights">Your Rights</TabsTrigger>
            <TabsTrigger value="tools" data-testid="tab-tools">Tools</TabsTrigger>
            <TabsTrigger value="resources" data-testid="tab-resources">Resources</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <MobileCard>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-600" />
                What Are Your Patient Rights?
              </h2>
              <p className="text-gray-700 mb-4">
                As a patient, you have comprehensive legal protections when receiving medical care. 
                These rights are established by federal and state laws to protect you from surprise billing, 
                ensure access to care, and provide financial protections.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <ShieldCheck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">8</div>
                  <div className="text-sm text-gray-600">Key Rights Categories</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <Scale className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">15+</div>
                  <div className="text-sm text-gray-600">Federal Protections</div>
                </div>
              </div>
            </MobileCard>

            {/* Quick Rights Summary */}
            <MobileCard>
              <h3 className="text-lg font-semibold mb-4">Quick Rights Summary</h3>
              <div className="space-y-3">
                {patientRightsCategories.slice(0, 4).map((right, index) => {
                  const IconComponent = right.icon;
                  return (
                    <div key={right.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <IconComponent className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">{right.title}</div>
                        <div className="text-xs text-gray-600 mt-1">{right.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <MobileButton 
                variant="ghost" 
                className="w-full mt-4" 
                onClick={() => setActiveTab("rights")}
                data-testid="button-view-all-rights"
              >
                View All Rights Categories
                <ArrowRight className="h-4 w-4 ml-2" />
              </MobileButton>
            </MobileCard>

            {/* When to Use This Guide */}
            <MobileCard>
              <h3 className="text-lg font-semibold mb-4">When to Use This Guide</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <span className="text-sm">Received a surprise medical bill</span>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Need help with charity care applications</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileX className="h-5 w-5 text-red-500" />
                  <span className="text-sm">Insurance claim was denied</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Preparing for medical procedures</span>
                </div>
              </div>
            </MobileCard>
          </TabsContent>

          {/* Your Rights Tab */}
          <TabsContent value="rights" className="space-y-6">
            {/* Search and Filter */}
            <MobileCard>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search rights categories..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    data-testid="input-search-rights"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="No Surprises">No Surprises Act</SelectItem>
                    <SelectItem value="Emergency">Emergency Rights</SelectItem>
                    <SelectItem value="Insurance">Insurance Rights</SelectItem>
                    <SelectItem value="Billing">Billing Rights</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </MobileCard>

            {/* Rights Categories */}
            <div className="space-y-4">
              {filteredRights.map((right, index) => {
                const IconComponent = right.icon;
                const isExpanded = expandedSections[right.id];
                
                return (
                  <motion.div
                    key={right.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MobileCard>
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <IconComponent className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{right.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{right.description}</p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                Effective {right.effectiveDate}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSection(right.id)}
                            data-testid={`button-toggle-${right.id}`}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                          >
                            <Separator />
                            
                            {/* Key Protections */}
                            <div>
                              <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center">
                                <ShieldCheck className="h-4 w-4 text-green-600 mr-2" />
                                Key Protections
                              </h4>
                              <ul className="space-y-1">
                                {right.keyProtections.map((protection, idx) => (
                                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                                    <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                    {protection}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Common Violations */}
                            <div>
                              <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center">
                                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                                Common Violations
                              </h4>
                              <ul className="space-y-1">
                                {right.commonViolations.map((violation, idx) => (
                                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                                    <X className="h-3 w-3 text-red-500 mr-2 mt-1 flex-shrink-0" />
                                    {violation}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Action Steps */}
                            <div>
                              <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center">
                                <Target className="h-4 w-4 text-blue-600 mr-2" />
                                What You Can Do
                              </h4>
                              <ol className="space-y-1">
                                {right.actionSteps.map((step, idx) => (
                                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                                    <span className="bg-blue-100 text-blue-800 text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                      {idx + 1}
                                    </span>
                                    {step}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </MobileCard>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            {/* Violation Checker Tool */}
            <MobileCard>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Crosshair className="h-5 w-5 mr-2 text-red-600" />
                Rights Violation Checker
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Answer a few questions to identify potential violations of your patient rights.
              </p>
              
              {violationCheckerStep === 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Select your situation:</p>
                  {violationScenarios.map((scenario) => (
                    <Button
                      key={scenario.id}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4"
                      onClick={() => {
                        setSelectedScenario(scenario.id);
                        setViolationCheckerStep(1);
                      }}
                      data-testid={`button-scenario-${scenario.id}`}
                    >
                      <div>
                        <div className="font-medium">{scenario.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{scenario.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}

              {violationCheckerStep === 1 && selectedScenario && (
                <div className="space-y-4">
                  {(() => {
                    const scenario = violationScenarios.find(s => s.id === selectedScenario);
                    if (!scenario) return null;
                    
                    return (
                      <>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900">{scenario.title}</h4>
                          <p className="text-sm text-blue-700 mt-1">{scenario.description}</p>
                        </div>
                        
                        <div className="space-y-3">
                          <p className="text-sm font-medium">Answer these questions:</p>
                          {scenario.questions.map((question, idx) => (
                            <div key={idx} className="space-y-2">
                              <p className="text-sm">{question}</p>
                              <div className="flex space-x-2">
                                <Button
                                  variant={violationAnswers[`${selectedScenario}-${idx}`] === true ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setViolationAnswers(prev => ({ ...prev, [`${selectedScenario}-${idx}`]: true }))}
                                  data-testid={`button-yes-${idx}`}
                                >
                                  Yes
                                </Button>
                                <Button
                                  variant={violationAnswers[`${selectedScenario}-${idx}`] === false ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setViolationAnswers(prev => ({ ...prev, [`${selectedScenario}-${idx}`]: false }))}
                                  data-testid={`button-no-${idx}`}
                                >
                                  No
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex space-x-2">
                          <MobileButton
                            variant="primary"
                            onClick={() => setViolationCheckerStep(2)}
                            data-testid="button-check-results"
                          >
                            Check Results
                          </MobileButton>
                          <MobileButton
                            variant="ghost"
                            onClick={resetViolationChecker}
                            data-testid="button-start-over"
                          >
                            Start Over
                          </MobileButton>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {violationCheckerStep === 2 && selectedScenario && (
                <div className="space-y-4">
                  {(() => {
                    const scenario = violationScenarios.find(s => s.id === selectedScenario);
                    if (!scenario) return null;
                    
                    return (
                      <>
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                          <h4 className="font-medium text-red-900 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Potential Violation Detected
                          </h4>
                          <p className="text-sm text-red-700 mt-2">{scenario.potentialViolation}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm mb-2">Recommended Actions:</h4>
                          <ol className="space-y-2">
                            {scenario.actionItems.map((action, idx) => (
                              <li key={idx} className="text-sm flex items-start">
                                <span className="bg-blue-100 text-blue-800 text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                  {idx + 1}
                                </span>
                                {action}
                              </li>
                            ))}
                          </ol>
                        </div>
                        
                        <MobileButton
                          variant="primary"
                          onClick={() => setActiveTab("resources")}
                          data-testid="button-get-help"
                        >
                          Get Contact Information & Templates
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </MobileButton>
                        
                        <MobileButton
                          variant="ghost"
                          onClick={resetViolationChecker}
                          data-testid="button-check-another"
                        >
                          Check Another Situation
                        </MobileButton>
                      </>
                    );
                  })()}
                </div>
              )}
            </MobileCard>

            {/* Letter Templates Tool */}
            <MobileCard>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileEdit className="h-5 w-5 mr-2 text-blue-600" />
                Complaint Letter Templates
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Professional templates for asserting your rights and filing complaints.
              </p>
              
              <div className="space-y-3">
                {complaintTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{template.title}</h4>
                        <p className="text-xs text-gray-600">For: {template.recipient}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(template.template, toast)}
                        data-testid={`button-copy-${template.id}`}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="max-h-32 overflow-y-auto text-xs text-gray-700 bg-gray-50 p-2 rounded mt-2">
                      <pre className="whitespace-pre-wrap font-mono">{template.template.slice(0, 200)}...</pre>
                    </div>
                  </div>
                ))}
              </div>
            </MobileCard>

            {/* Documentation Checklist */}
            <MobileCard>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-green-600" />
                Documentation Checklist
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Essential documents to gather when asserting your rights.
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2">Billing Documents</h4>
                  <div className="space-y-1">
                    {[
                      "Original itemized bills",
                      "Insurance Explanation of Benefits (EOB)",
                      "Good faith estimates (if provided)",
                      "Payment records and receipts"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" data-testid={`checkbox-billing-${idx}`} />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Medical Records</h4>
                  <div className="space-y-1">
                    {[
                      "Hospital admission/discharge records",
                      "Emergency department records",
                      "Physician notes and treatment plans",
                      "Surgical and procedure notes"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" data-testid={`checkbox-medical-${idx}`} />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Communication Records</h4>
                  <div className="space-y-1">
                    {[
                      "Written correspondence with providers",
                      "Insurance claim documentation",
                      "Phone call logs and notes",
                      "Email communications"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" data-testid={`checkbox-communication-${idx}`} />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </MobileCard>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            {/* Regulatory Contacts */}
            <MobileCard>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-600" />
                Regulatory Contact Database
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Key agencies and organizations that can help enforce your rights.
              </p>
              
              <div className="space-y-4">
                {regulatoryContacts.map((category) => (
                  <div key={category.category}>
                    <h4 className="font-medium text-sm mb-3 text-gray-900">{category.category}</h4>
                    <div className="space-y-3">
                      {category.contacts.map((contact, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-sm text-gray-900">{contact.agency}</h5>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(`${contact.agency}\nPhone: ${contact.phone}\nWebsite: ${contact.website}\nEmail: ${contact.email}`, toast)}
                              data-testid={`button-copy-contact-${idx}`}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{contact.purpose}</p>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span>{contact.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <ExternalLink className="h-3 w-3 text-gray-400" />
                              <span>{contact.website}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span>{contact.email}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </MobileCard>

            {/* Additional Resources */}
            <MobileCard>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                Additional Resources
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Federal Price Transparency Tools</h4>
                    <p className="text-xs text-gray-600 mt-1">CMS hospital price comparison tools and databases</p>
                    <p className="text-xs text-blue-600 mt-1">cms.gov/hospital-price-transparency</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <Heart className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Charity Care Database</h4>
                    <p className="text-xs text-gray-600 mt-1">Hospital financial assistance program directory</p>
                    <p className="text-xs text-green-600 mt-1">dollarfor.org</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Scale className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Legal Aid Resources</h4>
                    <p className="text-xs text-gray-600 mt-1">Free legal assistance for healthcare billing issues</p>
                    <p className="text-xs text-purple-600 mt-1">lawhelp.org</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">State Insurance Departments</h4>
                    <p className="text-xs text-gray-600 mt-1">Your state's insurance regulatory authority</p>
                    <p className="text-xs text-amber-600 mt-1">naic.org/state_web_map.htm</p>
                  </div>
                </div>
              </div>
            </MobileCard>

            {/* Know Your Rights Summary Card */}
            <MobileCard className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Remember Your Rights</h3>
                <p className="text-sm text-gray-700 mb-4">
                  You have strong legal protections as a patient. Don't let providers ignore these rights. 
                  Use the tools and information in this hub to advocate for yourself effectively.
                </p>
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free educational resource</span>
                  <span>•</span>
                  <span>Always up-to-date</span>
                  <span>•</span>
                  <span>Legally backed information</span>
                </div>
              </div>
            </MobileCard>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}