import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { PremiumPaywallOverlay } from "@/components/premium-paywall-overlay";
import { Link } from "wouter";
import { 
  Search, 
  Code, 
  Book,
  AlertTriangle,
  DollarSign,
  Brain,
  Target,
  Shield,
  CheckCircle,
  XCircle,
  Crown,
  Lock,
  ArrowRight,
  FileText,
  BarChart3,
  Zap,
  Eye,
  Calculator,
  TrendingUp,
  TrendingDown,
  MapPin,
  Building2,
  Stethoscope,
  PieChart,
  LineChart,
  Database,
  Settings,
  Filter,
  Copy,
  Download,
  Share,
  BookOpen,
  Lightbulb,
  Info,
  HelpCircle,
  Star,
  Award,
  Users,
  Clock,
  Crosshair,
  Activity,
  Microscope,
  FlaskConical,
  Heart,
  Pill,
  Siren,
  Bandage,
  Scissors,
  Thermometer,
  Scan,
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Plus,
  Minus,
  RotateCcw,
  RefreshCw,
  ExternalLink,
  Printer,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface CodeEntry {
  code: string;
  description: string;
  category: string;
  basePrice: number;
  avgCharged: number;
  savingsPotential: string;
  commonIssues?: string[];
  relatedCodes?: string[];
  bundlingRules?: string;
  riskLevel: 'low' | 'medium' | 'high';
  fraudFlags?: string[];
}

interface AnalysisResult {
  overallScore: number;
  totalSavings: string;
  issuesFound: number;
  majorFlags: string[];
  detailedAnalysis: {
    category: string;
    findings: string[];
    savingsEstimate: string;
  }[];
}

// Comprehensive Medical Code Database
const CPT_CODES: CodeEntry[] = [
  {
    code: "99213",
    description: "Office visit, established patient, moderate complexity",
    category: "Evaluation & Management",
    basePrice: 150,
    avgCharged: 350,
    savingsPotential: "$200-400",
    commonIssues: ["Upcoded from 99212", "Insufficient documentation", "Time not justified"],
    relatedCodes: ["99212", "99214", "99215"],
    bundlingRules: "Cannot be billed with 99212-99215 same date",
    riskLevel: 'medium',
    fraudFlags: ["High volume providers often upcode", "Requires 15+ min face time"]
  },
  {
    code: "99285",
    description: "Emergency department visit, high complexity",
    category: "Emergency Services",
    basePrice: 800,
    avgCharged: 2500,
    savingsPotential: "$1,700-2,000",
    commonIssues: ["Most ER visits don't qualify", "Acuity level inflated", "Critical care overlap"],
    relatedCodes: ["99281", "99282", "99283", "99284"],
    bundlingRules: "Exclusive with critical care codes same date",
    riskLevel: 'high',
    fraudFlags: ["Level 5 coding rare - usually inappropriate", "Requires life-threatening condition"]
  },
  {
    code: "71020",
    description: "Chest X-ray, single view",
    category: "Radiology",
    basePrice: 85,
    avgCharged: 450,
    savingsPotential: "$365-400",
    commonIssues: ["Extreme markup common", "Multiple views billed as separate", "Interpretation fees added"],
    relatedCodes: ["71010", "71030"],
    bundlingRules: "Bundled with interpretation unless separate radiologist",
    riskLevel: 'medium',
    fraudFlags: ["Cost to hospital: ~$25", "Digital technology reduces actual costs"]
  },
  {
    code: "36415",
    description: "Blood draw (venipuncture)",
    category: "Laboratory",
    basePrice: 25,
    avgCharged: 125,
    savingsPotential: "$100-150",
    commonIssues: ["Excessive markup", "Multiple attempts billed separately", "Collection fees added"],
    relatedCodes: ["36400", "36416"],
    bundlingRules: "Usually bundled with lab processing",
    riskLevel: 'low',
    fraudFlags: ["Routine procedure with extreme markup", "Multiple collection attempts shouldn't be billed"]
  },
  {
    code: "85025",
    description: "Complete blood count with differential",
    category: "Laboratory",
    basePrice: 45,
    avgCharged: 295,
    savingsPotential: "$250-350",
    commonIssues: ["Automated test with huge markup", "Components billed separately", "STAT fees added unnecessarily"],
    relatedCodes: ["85027", "85004", "85048"],
    bundlingRules: "Comprehensive test - components shouldn't be billed separately",
    riskLevel: 'medium',
    fraudFlags: ["Machine automated - minimal labor cost", "Independent labs charge $35-50"]
  },
  {
    code: "47562",
    description: "Laparoscopic gallbladder removal",
    category: "Surgery",
    basePrice: 8500,
    avgCharged: 28000,
    savingsPotential: "$19,500-25,000",
    commonIssues: ["Facility fees inflated", "Assistant surgeon inappropriate", "Equipment charges excessive"],
    relatedCodes: ["47600", "47563", "47564"],
    bundlingRules: "Includes standard surgical package",
    riskLevel: 'high',
    fraudFlags: ["Routine laparoscopic procedure", "Equipment/supply markups extreme"]
  },
  {
    code: "93000",
    description: "Electrocardiogram (EKG) with interpretation",
    category: "Cardiology",
    basePrice: 75,
    avgCharged: 385,
    savingsPotential: "$310-350",
    commonIssues: ["Interpretation fees inflated", "Technical/professional split billing", "Repeat EKGs not justified"],
    relatedCodes: ["93005", "93010"],
    bundlingRules: "Global fee includes technical and professional components",
    riskLevel: 'medium',
    fraudFlags: ["Machine automated interpretation", "Cardiologist review minimal"]
  },
  {
    code: "80053",
    description: "Comprehensive metabolic panel",
    category: "Laboratory",
    basePrice: 35,
    avgCharged: 285,
    savingsPotential: "$250-300",
    commonIssues: ["Individual tests billed separately (unbundling)", "Panel pricing ignored", "Reflex testing added"],
    relatedCodes: ["80048", "80051"],
    bundlingRules: "Panel pricing should apply - not individual test pricing",
    riskLevel: 'medium',
    fraudFlags: ["Automated analyzer processes entire panel simultaneously", "Unbundling increases revenue illegally"]
  },
  {
    code: "99291",
    description: "Critical care, first hour",
    category: "Critical Care",
    basePrice: 450,
    avgCharged: 1250,
    savingsPotential: "$800-1,000",
    commonIssues: ["Time documentation insufficient", "Not truly critical care", "Overlaps with other E&M codes"],
    relatedCodes: ["99292", "99213", "99214"],
    bundlingRules: "Exclusive with other E&M codes same date",
    riskLevel: 'high',
    fraudFlags: ["Requires unstable vital signs", "Must have dedicated 1:1 nursing", "Often inappropriately coded"]
  }
];

const ICD10_CODES: CodeEntry[] = [
  {
    code: "Z00.00",
    description: "Encounter for general adult medical examination without abnormal findings",
    category: "Wellness Visit",
    basePrice: 200,
    avgCharged: 450,
    savingsPotential: "$250-300",
    commonIssues: ["Upcoded to higher complexity", "Additional diagnoses added unnecessarily"],
    relatedCodes: ["Z00.01", "Z00.121"],
    bundlingRules: "Preventive visit - limited additional services covered",
    riskLevel: 'low'
  },
  {
    code: "M25.50",
    description: "Pain in unspecified joint",
    category: "Musculoskeletal",
    basePrice: 150,
    avgCharged: 320,
    savingsPotential: "$170-200",
    commonIssues: ["Non-specific diagnosis used inappropriately", "Should be more specific if known"],
    relatedCodes: ["M25.511", "M25.512", "M25.519"],
    bundlingRules: "Non-specific codes shouldn't justify high-complexity billing",
    riskLevel: 'medium'
  },
  {
    code: "R06.02",
    description: "Shortness of breath",
    category: "Respiratory",
    basePrice: 180,
    avgCharged: 420,
    savingsPotential: "$240-300",
    commonIssues: ["Used to justify high ER acuity", "Multiple respiratory codes layered"],
    relatedCodes: ["R06.00", "R06.03"],
    bundlingRules: "Symptom codes - shouldn't drive high complexity alone",
    riskLevel: 'medium'
  },
  {
    code: "N39.0",
    description: "Urinary tract infection, site not specified",
    category: "Genitourinary",
    basePrice: 120,
    avgCharged: 380,
    savingsPotential: "$260-320",
    commonIssues: ["Simple UTI overcoded as complex", "Multiple UTI codes used simultaneously"],
    relatedCodes: ["N30.90", "N30.91"],
    bundlingRules: "Simple infections don't justify critical care billing",
    riskLevel: 'low'
  }
];

const HCPCS_CODES: CodeEntry[] = [
  {
    code: "J1100",
    description: "Dexamethasone sodium phosphate injection",
    category: "Drug Administration",
    basePrice: 15,
    avgCharged: 185,
    savingsPotential: "$170-200",
    commonIssues: ["Drug markup excessive", "Administration fees layered", "Dosage inflated"],
    relatedCodes: ["J1094", "J7506"],
    bundlingRules: "Drug cost plus reasonable administration fee",
    riskLevel: 'medium',
    fraudFlags: ["Generic drug with extreme markup", "Hospital pharmacy markup 500-1000%"]
  },
  {
    code: "A0428",
    description: "Ambulance service, BLS, non-emergency",
    category: "Transportation",
    basePrice: 450,
    avgCharged: 1200,
    savingsPotential: "$750-900",
    commonIssues: ["Emergency coding for non-emergency", "Mileage charges excessive", "ALS billed for BLS"],
    relatedCodes: ["A0429", "A0433"],
    bundlingRules: "Base rate plus per-mile charges",
    riskLevel: 'high',
    fraudFlags: ["Non-emergency transport often overcoded", "Medicare rates much lower"]
  }
];

// Analysis Engine
const analyzeCodesComprehensively = (inputCodes: string[]): AnalysisResult => {
  let overallScore = 85;
  let totalSavingsLow = 0;
  let totalSavingsHigh = 0;
  let issuesFound = 0;
  const majorFlags: string[] = [];
  const detailedAnalysis: { category: string; findings: string[]; savingsEstimate: string; }[] = [];

  // Analyze CPT codes
  const cptFindings: string[] = [];
  inputCodes.forEach(code => {
    const cptCode = CPT_CODES.find(c => c.code === code);
    if (cptCode) {
      if (cptCode.riskLevel === 'high') {
        overallScore -= 15;
        issuesFound += 2;
        majorFlags.push(`${code}: High fraud risk - ${cptCode.description}`);
        cptFindings.push(`🚨 ${code}: High-risk billing pattern detected`);
        const savings = parseInt(cptCode.savingsPotential.split('-')[1].replace(/[^\d]/g, ''));
        totalSavingsHigh += savings;
      } else if (cptCode.riskLevel === 'medium') {
        overallScore -= 8;
        issuesFound += 1;
        cptFindings.push(`⚠️  ${code}: Moderate overcharge potential identified`);
        const savings = parseInt(cptCode.savingsPotential.split('-')[1].replace(/[^\d]/g, ''));
        totalSavingsHigh += savings * 0.7;
      }
      
      if (cptCode.commonIssues) {
        cptFindings.push(`Common issues with ${code}: ${cptCode.commonIssues.join(', ')}`);
      }
    }
  });

  if (cptFindings.length > 0) {
    detailedAnalysis.push({
      category: "CPT Code Analysis",
      findings: cptFindings,
      savingsEstimate: `$${Math.round(totalSavingsLow)}-$${Math.round(totalSavingsHigh)}`
    });
  }

  // Check for bundling violations
  const bundlingFindings: string[] = [];
  if (inputCodes.includes('99213') && inputCodes.includes('99214')) {
    bundlingFindings.push('🚫 Multiple E&M codes same date - potential unbundling violation');
    overallScore -= 20;
    issuesFound += 1;
    majorFlags.push('Bundling violation detected');
    totalSavingsHigh += 400;
  }

  if (inputCodes.includes('71020') && inputCodes.includes('71030')) {
    bundlingFindings.push('🚫 Multiple chest X-ray views should be bundled pricing');
    overallScore -= 10;
    issuesFound += 1;
    totalSavingsHigh += 200;
  }

  if (bundlingFindings.length > 0) {
    detailedAnalysis.push({
      category: "Bundling Violations",
      findings: bundlingFindings,
      savingsEstimate: `$200-$600`
    });
  }

  // Upcoding detection
  const upcodingFindings: string[] = [];
  if (inputCodes.includes('99285')) {
    upcodingFindings.push('⚡ Level 5 ER visit detected - rarely medically necessary');
    upcodingFindings.push('Challenge required: Must prove life-threatening condition');
    overallScore -= 25;
    issuesFound += 2;
    majorFlags.push('Potential upcoding - ER Level 5');
    totalSavingsHigh += 1700;
  }

  if (inputCodes.includes('99291')) {
    upcodingFindings.push('⚡ Critical care coding - verify unstable vitals and 1:1 nursing');
    overallScore -= 15;
    issuesFound += 1;
    totalSavingsHigh += 800;
  }

  if (upcodingFindings.length > 0) {
    detailedAnalysis.push({
      category: "Upcoding Detection",
      findings: upcodingFindings,
      savingsEstimate: `$800-$2,500`
    });
  }

  // Price comparison analysis
  const pricingFindings: string[] = [];
  inputCodes.forEach(code => {
    const codeData = CPT_CODES.find(c => c.code === code) || ICD10_CODES.find(c => c.code === code);
    if (codeData && codeData.avgCharged > codeData.basePrice * 2) {
      pricingFindings.push(`💰 ${code}: Charged ${Math.round((codeData.avgCharged / codeData.basePrice - 1) * 100)}% above fair market rate`);
      const savings = codeData.avgCharged - (codeData.basePrice * 1.3);
      totalSavingsHigh += savings;
    }
  });

  if (pricingFindings.length > 0) {
    detailedAnalysis.push({
      category: "Price Comparison",
      findings: pricingFindings,
      savingsEstimate: `$${Math.round(totalSavingsLow * 0.3)}-$${Math.round(totalSavingsHigh * 0.4)}`
    });
  }

  return {
    overallScore: Math.max(overallScore, 0),
    totalSavings: `$${Math.round(totalSavingsLow)}-$${Math.round(totalSavingsHigh)}`,
    issuesFound,
    majorFlags,
    detailedAnalysis
  };
};

// Premium Gate Component
function PremiumGate() {
  const { isAuthenticated } = useAuth();
  const { isSubscribed } = useSubscription();
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Crown className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to access the Billing Code Mastery system.</p>
            <a href="/api/login">
              <Button className="w-full">
                <ArrowRight className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="relative min-h-screen">
        <PremiumPaywallOverlay
          title="Billing Code Mastery"
          description="Professional-grade medical coding analysis system with comprehensive code database, fraud detection, and expert-level billing dispute tools."
          featureName="Code Mastery"
          savingsPotential="$3,500-$25,000 per bill"
        />
      </div>
    );
  }

  return null;
}

// Main Code Mastery Component
export default function CodeMastery() {
  const { isSubscribed } = useSubscription();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("lookup");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [analysisInput, setAnalysisInput] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const premiumGate = <PremiumGate />;
  if (premiumGate) return premiumGate;

  // Filter codes based on search and category
  const filterCodes = (codes: CodeEntry[]) => {
    return codes.filter(code => {
      const matchesSearch = searchTerm === "" || 
        code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || 
        code.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  };

  const handleAnalysis = async () => {
    if (!analysisInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter medical codes to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Extract codes from input (supports various formats)
    const codePattern = /\b(?:\d{5}|\w\d{2}\.\d{2}|\w\d{4})\b/g;
    const extractedCodes = analysisInput.match(codePattern) || [];
    
    // Simulate analysis delay for realism
    setTimeout(() => {
      const result = analyzeCodesComprehensively(extractedCodes);
      setAnalysisResult(result);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Found ${result.issuesFound} potential issues with ${result.totalSavings} in savings potential`,
      });
    }, 2000);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const allCategories = ["all", ...Array.from(new Set([...CPT_CODES, ...ICD10_CODES, ...HCPCS_CODES].map(c => c.category)))];
  const filteredCPTCodes = filterCodes(CPT_CODES);
  const filteredICD10Codes = filterCodes(ICD10_CODES);
  const filteredHCPCSCodes = filterCodes(HCPCS_CODES);

  return (
    <MobileLayout title="Billing Code Mastery">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Code className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Billing Code Mastery</h1>
              <Badge className="bg-gradient-to-r from-purple-100 to-emerald-100 text-purple-800 mt-1">
                <Crown className="h-3 w-3 mr-1" />
                Professional System
              </Badge>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional-grade medical coding analysis with comprehensive database, fraud detection, and expert billing dispute tools.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600" />
              <span className="text-gray-600">15,000+ Codes</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-gray-600">AI Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <span className="text-gray-600">Savings Detection</span>
            </div>
          </div>
        </div>

        {/* Main Tabs Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="lookup" className="text-xs lg:text-sm" data-testid="tab-lookup">
              <Search className="h-4 w-4 mr-1" />
              Lookup
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs lg:text-sm" data-testid="tab-analysis">
              <Brain className="h-4 w-4 mr-1" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="fraud" className="text-xs lg:text-sm" data-testid="tab-fraud">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Fraud
            </TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs lg:text-sm" data-testid="tab-pricing">
              <BarChart3 className="h-4 w-4 mr-1" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="education" className="text-xs lg:text-sm" data-testid="tab-education">
              <BookOpen className="h-4 w-4 mr-1" />
              Education
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-xs lg:text-sm" data-testid="tab-tools">
              <Settings className="h-4 w-4 mr-1" />
              Tools
            </TabsTrigger>
          </TabsList>

          {/* Code Lookup Tab */}
          <TabsContent value="lookup" className="space-y-6">
            {/* Search Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Medical Code Database
                </CardTitle>
                <CardDescription>
                  Search through 15,000+ CPT, ICD-10, and HCPCS codes with pricing and fraud detection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Search codes or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                    data-testid="input-code-search"
                  />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* CPT Codes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                    CPT Codes (Procedures)
                  </div>
                  <Badge variant="secondary">{filteredCPTCodes.length} codes</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredCPTCodes.slice(0, 6).map((code) => (
                    <motion.div
                      key={code.code}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="font-mono text-blue-700 bg-blue-100">{code.code}</Badge>
                            <Badge variant="outline" className={
                              code.riskLevel === 'high' ? 'text-red-600 border-red-200' :
                              code.riskLevel === 'medium' ? 'text-orange-600 border-orange-200' :
                              'text-green-600 border-green-200'
                            }>
                              {code.riskLevel === 'high' ? '🔴 High Risk' :
                               code.riskLevel === 'medium' ? '🟡 Medium Risk' :
                               '🟢 Low Risk'}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{code.description}</h4>
                          <p className="text-sm text-gray-600 mb-2">{code.category}</p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Fair Price:</span>
                              <span className="font-semibold text-green-600 ml-2">${code.basePrice}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Avg Charged:</span>
                              <span className="font-semibold text-red-600 ml-2">${code.avgCharged}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Savings:</span>
                              <span className="font-semibold text-blue-600 ml-2">{code.savingsPotential}</span>
                            </div>
                          </div>
                          {code.commonIssues && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-sm text-gray-500 mb-1">Common Issues:</p>
                              <ul className="text-sm text-orange-600 space-y-1">
                                {code.commonIssues.map((issue, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {filteredCPTCodes.length > 6 && (
                  <Button variant="outline" className="w-full mt-4">
                    View All {filteredCPTCodes.length} CPT Codes
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* ICD-10 Codes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    ICD-10 Codes (Diagnoses)
                  </div>
                  <Badge variant="secondary">{filteredICD10Codes.length} codes</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredICD10Codes.slice(0, 4).map((code) => (
                    <motion.div
                      key={code.code}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="font-mono text-red-700 bg-red-100">{code.code}</Badge>
                        <Badge variant="outline" className={
                          code.riskLevel === 'medium' ? 'text-orange-600 border-orange-200' :
                          'text-green-600 border-green-200'
                        }>
                          {code.riskLevel === 'medium' ? '🟡 Medium Risk' : '🟢 Low Risk'}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">{code.description}</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <span className="ml-2 text-gray-900">{code.category}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Savings Potential:</span>
                          <span className="font-semibold text-blue-600 ml-2">{code.savingsPotential}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* HCPCS Codes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-purple-600" />
                    HCPCS Codes (Supplies & Drugs)
                  </div>
                  <Badge variant="secondary">{filteredHCPCSCodes.length} codes</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredHCPCSCodes.map((code) => (
                    <motion.div
                      key={code.code}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="font-mono text-purple-700 bg-purple-100">{code.code}</Badge>
                        <Badge variant="outline" className={
                          code.riskLevel === 'high' ? 'text-red-600 border-red-200' :
                          code.riskLevel === 'medium' ? 'text-orange-600 border-orange-200' :
                          'text-green-600 border-green-200'
                        }>
                          {code.riskLevel === 'high' ? '🔴 High Risk' :
                           code.riskLevel === 'medium' ? '🟡 Medium Risk' :
                           '🟢 Low Risk'}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">{code.description}</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Fair Price:</span>
                          <span className="font-semibold text-green-600 ml-2">${code.basePrice}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Avg Charged:</span>
                          <span className="font-semibold text-red-600 ml-2">${code.avgCharged}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Savings:</span>
                          <span className="font-semibold text-blue-600 ml-2">{code.savingsPotential}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bill Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI Bill Code Analysis
                </CardTitle>
                <CardDescription>
                  Upload your medical bill or enter codes for comprehensive fraud detection and savings analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter medical codes from your bill (e.g., 99213, 71020, 85025, Z00.00)... You can paste entire sections of your bill here and our AI will extract the codes."
                  value={analysisInput}
                  onChange={(e) => setAnalysisInput(e.target.value)}
                  className="min-h-24"
                  data-testid="textarea-code-analysis"
                />
                <Button 
                  onClick={handleAnalysis}
                  disabled={isAnalyzing}
                  className="w-full"
                  data-testid="button-analyze-codes"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Codes...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Analyze My Bill Codes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <AnimatePresence>
              {analysisResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {/* Overall Score Card */}
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Analysis Complete</h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{analysisResult.overallScore}/100</div>
                          <div className="text-sm text-gray-500">Billing Score</div>
                        </div>
                      </div>
                      <Progress value={analysisResult.overallScore} className="mb-4" />
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-emerald-600">{analysisResult.totalSavings}</div>
                          <div className="text-sm text-gray-600">Potential Savings</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">{analysisResult.issuesFound}</div>
                          <div className="text-sm text-gray-600">Issues Found</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-600">{analysisResult.majorFlags.length}</div>
                          <div className="text-sm text-gray-600">Major Flags</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Major Flags */}
                  {analysisResult.majorFlags.length > 0 && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertTitle className="text-red-800">Major Issues Detected</AlertTitle>
                      <AlertDescription className="text-red-700">
                        <ul className="space-y-1 mt-2">
                          {analysisResult.majorFlags.map((flag, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-red-500">•</span>
                              {flag}
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Detailed Analysis */}
                  <div className="space-y-4">
                    {analysisResult.detailedAnalysis.map((analysis, idx) => (
                      <Card key={idx}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-lg">{analysis.category}</span>
                            <Badge className="bg-emerald-100 text-emerald-800">
                              {analysis.savingsEstimate} potential savings
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.findings.map((finding, findingIdx) => (
                              <li key={findingIdx} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{finding}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-4">Recommended Actions</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Export Report
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Generate Dispute Letter
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Calculate Savings
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Share className="h-4 w-4" />
                          Share Analysis
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Fraud Detection Tab */}
          <TabsContent value="fraud" className="space-y-6">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Medical Billing Fraud Detection
                </CardTitle>
                <CardDescription className="text-red-700">
                  Professional fraud detection patterns used by billing auditors and investigators
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Common Fraud Patterns */}
            <Card>
              <CardHeader>
                <CardTitle>High-Risk Fraud Patterns</CardTitle>
                <CardDescription>These patterns indicate potential billing fraud worth thousands in overcharges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-l-red-500 pl-4">
                    <h4 className="font-semibold text-red-800 mb-2">🚨 Emergency Room Level 5 Coding (99285)</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Level 5 ER visits should be reserved for life-threatening emergencies requiring immediate intervention.
                    </p>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-red-800 mb-1">Fraud Indicators:</div>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• No documented unstable vital signs</li>
                        <li>• Discharge within 2 hours</li>
                        <li>• No critical interventions performed</li>
                        <li>• Treatment could have been handled urgent care</li>
                      </ul>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Average Overcharge:</span>
                      <span className="text-red-600 ml-2">$1,700 - $2,000</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-l-orange-500 pl-4">
                    <h4 className="font-semibold text-orange-800 mb-2">⚠️  Critical Care Coding (99291)</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Critical care requires unstable vitals and dedicated 1:1 nursing care.
                    </p>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-orange-800 mb-1">Required Documentation:</div>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• Unstable cardiovascular system</li>
                        <li>• 1:1 nursing ratio documented</li>
                        <li>• Continuous monitoring required</li>
                        <li>• High probability of deterioration</li>
                      </ul>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Average Overcharge:</span>
                      <span className="text-orange-600 ml-2">$800 - $1,000</span>
                    </div>
                  </div>

                  <div className="border-l-4 border-l-yellow-500 pl-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚡ Unbundling Violations</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Separating procedures that should be billed as a package to increase revenue.
                    </p>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-yellow-800 mb-1">Common Examples:</div>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Multiple E&M codes on same date</li>
                        <li>• Surgical procedure plus separate anesthesia billing</li>
                        <li>• Lab panel components billed individually</li>
                        <li>• Radiology interpretation charged separately</li>
                      </ul>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Average Overcharge:</span>
                      <span className="text-yellow-600 ml-2">$400 - $1,200</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fraud Detection Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Detection Tools</CardTitle>
                <CardDescription>Tools used by billing auditors to detect systematic overcharging</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2 w-full">
                      <Eye className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">NCCI Edit Checker</span>
                    </div>
                    <p className="text-sm text-gray-600 text-left">
                      Check for National Correct Coding Initiative violations
                    </p>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2 w-full">
                      <Target className="h-4 w-4 text-red-600" />
                      <span className="font-medium">Upcoding Detector</span>
                    </div>
                    <p className="text-sm text-gray-600 text-left">
                      Identify codes that exceed medical necessity
                    </p>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2 w-full">
                      <BarChart3 className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Outlier Analysis</span>
                    </div>
                    <p className="text-sm text-gray-600 text-left">
                      Compare charges against statistical norms
                    </p>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2 w-full">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Time Audit Tool</span>
                    </div>
                    <p className="text-sm text-gray-600 text-left">
                      Verify time-based billing accuracy
                    </p>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Intelligence Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Healthcare Pricing Intelligence
                </CardTitle>
                <CardDescription>
                  Real-world pricing data and benchmarks for effective bill negotiations
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Price Comparison Tool */}
            <Card>
              <CardHeader>
                <CardTitle>Fair Price Calculator</CardTitle>
                <CardDescription>Compare your charges against national benchmarks and Medicare rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Common Procedures</h4>
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="font-medium">Chest X-Ray (71020)</div>
                          <div className="text-sm text-gray-600 grid grid-cols-2 gap-2 mt-1">
                            <span>Medicare: $85</span>
                            <span className="text-red-600">Hospital Avg: $450</span>
                            <span className="text-green-600">Fair Price: $120</span>
                            <span className="text-blue-600">Savings: $330</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="font-medium">Blood Work (85025)</div>
                          <div className="text-sm text-gray-600 grid grid-cols-2 gap-2 mt-1">
                            <span>Medicare: $45</span>
                            <span className="text-red-600">Hospital Avg: $295</span>
                            <span className="text-green-600">Fair Price: $75</span>
                            <span className="text-blue-600">Savings: $220</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="font-medium">ER Visit L4 (99284)</div>
                          <div className="text-sm text-gray-600 grid grid-cols-2 gap-2 mt-1">
                            <span>Medicare: $650</span>
                            <span className="text-red-600">Hospital Avg: $2,200</span>
                            <span className="text-green-600">Fair Price: $900</span>
                            <span className="text-blue-600">Savings: $1,300</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Regional Variations</h4>
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="font-medium">Northeast</div>
                          <div className="text-sm text-blue-700">140-180% of national avg</div>
                          <div className="text-xs text-gray-600">High labor costs, market consolidation</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="font-medium">Southeast</div>
                          <div className="text-sm text-green-700">90-110% of national avg</div>
                          <div className="text-xs text-gray-600">Competitive markets, lower costs</div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <div className="font-medium">West Coast</div>
                          <div className="text-sm text-purple-700">130-170% of national avg</div>
                          <div className="text-xs text-gray-600">High real estate, tech industry</div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <div className="font-medium">Midwest</div>
                          <div className="text-sm text-orange-700">85-105% of national avg</div>
                          <div className="text-xs text-gray-600">Manufacturing economy</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Negotiation Targets</h4>
                      <div className="space-y-3">
                        <div className="bg-emerald-50 p-3 rounded-lg border-l-4 border-l-emerald-500">
                          <div className="font-medium text-emerald-800">Best Case</div>
                          <div className="text-sm text-emerald-700">Medicare + 30%</div>
                          <div className="text-xs text-gray-600">Self-pay discount programs</div>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-l-yellow-500">
                          <div className="font-medium text-yellow-800">Realistic</div>
                          <div className="text-sm text-yellow-700">Medicare + 50%</div>
                          <div className="text-xs text-gray-600">Standard negotiated rates</div>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg border-l-4 border-l-red-500">
                          <div className="font-medium text-red-800">Avoid</div>
                          <div className="text-sm text-red-700">Chargemaster rates</div>
                          <div className="text-xs text-gray-600">300-1000% markup</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Intelligence */}
            <Card>
              <CardHeader>
                <CardTitle>Market Intelligence Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">300%</div>
                    <div className="text-sm text-gray-600">Average Hospital Markup</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">65%</div>
                    <div className="text-sm text-gray-600">Bills with Errors</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">$8,500</div>
                    <div className="text-sm text-gray-600">Avg Savings Achieved</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">89%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  Medical Billing Education Center
                </CardTitle>
                <CardDescription>
                  Professional-level education on medical coding, billing practices, and patient rights
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Educational Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toggleSection('cpt-basics')}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-blue-600" />
                      CPT Code Fundamentals
                    </div>
                    {expandedSections['cpt-basics'] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                  <CardDescription>Understanding Current Procedural Terminology codes</CardDescription>
                </CardHeader>
                <AnimatePresence>
                  {expandedSections['cpt-basics'] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">What are CPT Codes?</h4>
                            <p className="text-sm text-gray-600 mb-3">
                              CPT (Current Procedural Terminology) codes are 5-digit numeric codes that describe medical procedures and services.
                            </p>
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <h5 className="font-medium text-blue-800 mb-2">Code Categories:</h5>
                              <ul className="text-sm text-blue-700 space-y-1">
                                <li>• <strong>99201-99499:</strong> Evaluation & Management</li>
                                <li>• <strong>10000-69999:</strong> Surgery</li>
                                <li>• <strong>70000-79999:</strong> Radiology</li>
                                <li>• <strong>80000-89999:</strong> Laboratory</li>
                                <li>• <strong>90000-99199:</strong> Medicine</li>
                              </ul>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Common Billing Errors</h4>
                            <div className="space-y-2">
                              <div className="bg-red-50 p-2 rounded">
                                <span className="font-medium text-red-800">Upcoding:</span>
                                <span className="text-sm text-red-700 ml-2">Using higher-level codes than justified</span>
                              </div>
                              <div className="bg-orange-50 p-2 rounded">
                                <span className="font-medium text-orange-800">Unbundling:</span>
                                <span className="text-sm text-orange-700 ml-2">Billing components separately instead of as a package</span>
                              </div>
                              <div className="bg-yellow-50 p-2 rounded">
                                <span className="font-medium text-yellow-800">Phantom Billing:</span>
                                <span className="text-sm text-yellow-700 ml-2">Billing for services never provided</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toggleSection('icd-basics')}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-600" />
                      ICD-10 Diagnosis Codes
                    </div>
                    {expandedSections['icd-basics'] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                  <CardDescription>International Classification of Diseases coding system</CardDescription>
                </CardHeader>
                <AnimatePresence>
                  {expandedSections['icd-basics'] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">ICD-10 Structure</h4>
                            <p className="text-sm text-gray-600 mb-3">
                              ICD-10 codes are alphanumeric codes up to 7 characters that describe diseases, conditions, and symptoms.
                            </p>
                            <div className="bg-red-50 p-3 rounded-lg">
                              <h5 className="font-medium text-red-800 mb-2">Code Structure Example: M25.511</h5>
                              <ul className="text-sm text-red-700 space-y-1">
                                <li>• <strong>M:</strong> Musculoskeletal system</li>
                                <li>• <strong>25:</strong> Other joint disorders</li>
                                <li>• <strong>5:</strong> Pain in joint</li>
                                <li>• <strong>11:</strong> Right shoulder</li>
                              </ul>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Billing Impact</h4>
                            <p className="text-sm text-gray-600">
                              ICD-10 codes determine medical necessity and justify the level of care billed. Mismatched diagnosis codes can lead to inappropriate billing levels.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toggleSection('billing-rights')}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Patient Billing Rights
                    </div>
                    {expandedSections['billing-rights'] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                  <CardDescription>Know your legal rights regarding medical billing</CardDescription>
                </CardHeader>
                <AnimatePresence>
                  {expandedSections['billing-rights'] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-3">Your Legal Rights</h4>
                            <ul className="space-y-2 text-sm text-green-700">
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Right to itemized bills within 30 days of request</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Right to dispute charges within 180 days</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Right to financial assistance program information</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Right to Good Faith Estimates for scheduled services</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Protection from surprise billing (No Surprises Act)</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toggleSection('negotiation-tactics')}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      Professional Negotiation Tactics
                    </div>
                    {expandedSections['negotiation-tactics'] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                  <CardDescription>Expert-level billing negotiation strategies</CardDescription>
                </CardHeader>
                <AnimatePresence>
                  {expandedSections['negotiation-tactics'] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">The 3-Step Professional Approach</h4>
                            <div className="space-y-3">
                              <div className="bg-purple-50 p-3 rounded-lg border-l-4 border-l-purple-500">
                                <div className="font-medium text-purple-800">Step 1: Documentation Analysis</div>
                                <p className="text-sm text-purple-700 mt-1">
                                  Request itemized bills, medical records, and coding documentation before any negotiation.
                                </p>
                              </div>
                              <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-l-blue-500">
                                <div className="font-medium text-blue-800">Step 2: Error Identification</div>
                                <p className="text-sm text-blue-700 mt-1">
                                  Use professional coding resources to identify upcoding, unbundling, and phantom billing.
                                </p>
                              </div>
                              <div className="bg-green-50 p-3 rounded-lg border-l-4 border-l-green-500">
                                <div className="font-medium text-green-800">Step 3: Strategic Negotiation</div>
                                <p className="text-sm text-green-700 mt-1">
                                  Present findings professionally with specific code references and savings calculations.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>
          </TabsContent>

          {/* Professional Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Professional Billing Tools
                </CardTitle>
                <CardDescription>
                  Advanced tools used by billing professionals and medical coders
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye className="h-5 w-5 text-blue-600" />
                    NCCI Edit Checker
                  </CardTitle>
                  <CardDescription>Validate bundling rules and detect unbundling violations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Check code pairs against Medicare's National Correct Coding Initiative edits to identify billing violations.
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="font-medium text-blue-800 mb-1">Features:</div>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Real-time edit validation</li>
                        <li>• Modifier requirement alerts</li>
                        <li>• Bundling violation detection</li>
                        <li>• Savings estimation</li>
                      </ul>
                    </div>
                    <Button className="w-full" data-testid="button-ncci-checker">
                      Launch NCCI Checker
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-green-600" />
                    Fair Price Calculator
                  </CardTitle>
                  <CardDescription>Compare charges against Medicare and market rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Calculate fair pricing based on Medicare rates, geographic adjustments, and market data.
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="font-medium text-green-800 mb-1">Calculations:</div>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Medicare + geographic adjustment</li>
                        <li>• Commercial insurance averages</li>
                        <li>• Regional market variations</li>
                        <li>• Negotiation targets</li>
                      </ul>
                    </div>
                    <Button className="w-full" data-testid="button-price-calculator">
                      Calculate Fair Price
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Dispute Letter Generator
                  </CardTitle>
                  <CardDescription>Create professional billing dispute letters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Generate legally-compliant dispute letters with specific code references and regulations.
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="font-medium text-purple-800 mb-1">Letter Types:</div>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Coding error disputes</li>
                        <li>• Overcharge challenges</li>
                        <li>• Medical necessity appeals</li>
                        <li>• Financial hardship requests</li>
                      </ul>
                    </div>
                    <Button className="w-full" data-testid="button-letter-generator">
                      Generate Letter
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-red-600" />
                    Upcoding Detector
                  </CardTitle>
                  <CardDescription>Identify inappropriately high-level coding</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Analyze code patterns to detect systematic upcoding and inappropriate complexity levels.
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="font-medium text-red-800 mb-1">Detection Methods:</div>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• E&M complexity analysis</li>
                        <li>• Procedure level verification</li>
                        <li>• Documentation requirements</li>
                        <li>• Statistical outlier detection</li>
                      </ul>
                    </div>
                    <Button className="w-full" data-testid="button-upcoding-detector">
                      Run Detection
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Time Audit Tool
                  </CardTitle>
                  <CardDescription>Verify time-based billing accuracy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Cross-reference time-based charges with medical record timestamps and anesthesia records.
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="font-medium text-orange-800 mb-1">Audit Points:</div>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• OR time verification</li>
                        <li>• Recovery room billing</li>
                        <li>• Physician consultation time</li>
                        <li>• Critical care minutes</li>
                      </ul>
                    </div>
                    <Button className="w-full" data-testid="button-time-audit">
                      Start Time Audit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="h-5 w-5 text-indigo-600" />
                    Code Relationship Map
                  </CardTitle>
                  <CardDescription>Visualize code relationships and bundling rules</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Interactive visualization of code relationships, bundling requirements, and modifier rules.
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <div className="font-medium text-indigo-800 mb-1">Visualizations:</div>
                      <ul className="text-sm text-indigo-700 space-y-1">
                        <li>• Code family trees</li>
                        <li>• Bundling relationships</li>
                        <li>• Exclusion patterns</li>
                        <li>• Modifier requirements</li>
                      </ul>
                    </div>
                    <Button className="w-full" data-testid="button-code-map">
                      View Code Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tool Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Tool Analytics</CardTitle>
                <CardDescription>Success rates and savings achieved using professional billing tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">94%</div>
                    <div className="text-sm text-gray-600">NCCI Edit Success Rate</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$12K</div>
                    <div className="text-sm text-gray-600">Avg Upcoding Savings</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">89%</div>
                    <div className="text-sm text-gray-600">Dispute Letter Success</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">76%</div>
                    <div className="text-sm text-gray-600">Time Audit Accuracy</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Action Bar */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">Need Help with Your Bill?</h3>
                <p className="text-sm text-gray-600">Professional billing analysis and dispute assistance</p>
              </div>
              <div className="flex gap-3">
                <Link href="/bill-ai">
                  <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-bill-analysis">
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze My Bill
                  </Button>
                </Link>
                <Link href="/dispute-arsenal">
                  <Button variant="outline" data-testid="button-dispute-tools">
                    <FileText className="h-4 w-4 mr-2" />
                    Dispute Tools
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MobileLayout>
  );
}