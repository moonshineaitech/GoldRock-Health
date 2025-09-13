import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { 
  Upload, 
  Camera, 
  FileText, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  TrendingDown, 
  Sparkles,
  Shield,
  Brain,
  Target,
  ArrowRight,
  Info,
  Download,
  Copy,
  Phone,
  Mail,
  Calculator,
  BarChart3,
  PieChart,
  Eye,
  Search,
  Zap,
  Crown,
  Lock,
  Star,
  Clock,
  FileCheck,
  Lightbulb,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Percent,
  Receipt,
  Building2,
  ClipboardList,
  Heart,
  Award,
  LineChart,
  Wallet,
  ShieldCheck,
  Radar
} from "lucide-react";
import { MobileLayout } from "@/components/mobile-layout";
import { Link } from "wouter";

// Types for bill analysis
interface BillLineItem {
  id: string;
  description: string;
  amount: number;
  code?: string;
  date?: string;
  quantity?: number;
  unitPrice?: number;
  category: 'room' | 'surgery' | 'pharmacy' | 'lab' | 'imaging' | 'supplies' | 'other';
  riskLevel: 'low' | 'medium' | 'high';
  issuePotential: string[];
}

interface AnalysisResult {
  id: string;
  title: string;
  description: string;
  category: 'duplicate' | 'overcharge' | 'unbundling' | 'coding_error' | 'phantom' | 'timing';
  riskLevel: 'low' | 'medium' | 'high';
  potentialSavings: number;
  confidence: number;
  priority: number;
  actionRequired: string;
  evidence: string[];
  nextSteps: string[];
}

interface BillAnalysisData {
  totalAmount: number;
  patientResponsibility: number;
  lineItems: BillLineItem[];
  issues: AnalysisResult[];
  potentialSavings: number;
  riskScore: number;
  analysisConfidence: number;
  categoryBreakdown: { [key: string]: number };
  recommendations: string[];
}

// Mock analysis function for demonstration
const analyzeBill = (billData: any): BillAnalysisData => {
  const totalAmount = parseFloat(billData.totalAmount) || 0;
  const patientResponsibility = parseFloat(billData.patientResponsibility) || totalAmount;
  
  // Generate realistic line items based on bill type
  const generateLineItems = (): BillLineItem[] => {
    const items: BillLineItem[] = [];
    const billType = billData.serviceType || 'emergency';
    
    if (billType === 'emergency') {
      items.push(
        {
          id: '1',
          description: 'Emergency Department Visit - Level 5',
          amount: 2500,
          code: '99285',
          category: 'surgery',
          riskLevel: 'high',
          issuePotential: ['Level 5 coding without critical condition documentation']
        },
        {
          id: '2', 
          description: 'Room and Board - 2 days',
          amount: 1800,
          category: 'room',
          quantity: 2,
          unitPrice: 900,
          riskLevel: 'medium',
          issuePotential: ['Room charges during surgical procedure time']
        },
        {
          id: '3',
          description: 'IV Fluid Administration - 1000mL Normal Saline',
          amount: 150,
          category: 'supplies',
          riskLevel: 'high',
          issuePotential: ['500% markup over wholesale cost']
        }
      );
    } else if (billType === 'surgery') {
      items.push(
        {
          id: '1',
          description: 'Operating Room Time - 4 hours',
          amount: 8000,
          category: 'surgery',
          quantity: 4,
          unitPrice: 2000,
          riskLevel: 'medium',
          issuePotential: ['OR time may include setup/cleanup periods']
        },
        {
          id: '2',
          description: 'Surgical Supplies Package',
          amount: 2500,
          category: 'supplies',
          riskLevel: 'high',
          issuePotential: ['Bundled supplies often include unused items']
        }
      );
    }
    
    return items;
  };

  const lineItems = generateLineItems();
  
  // Generate analysis issues based on line items
  const generateIssues = (): AnalysisResult[] => {
    const issues: AnalysisResult[] = [];
    
    // Check for high-risk line items
    lineItems.forEach(item => {
      if (item.riskLevel === 'high') {
        if (item.category === 'supplies' && item.amount > 100) {
          issues.push({
            id: `supply-overcharge-${item.id}`,
            title: 'Medical Supply Overcharge',
            description: `${item.description} appears significantly overpriced`,
            category: 'overcharge',
            riskLevel: 'high',
            potentialSavings: item.amount * 0.6, // 60% potential reduction
            confidence: 85,
            priority: 1,
            actionRequired: 'Request itemized supply breakdown and wholesale pricing',
            evidence: [
              'Price exceeds typical hospital markup of 200-300%',
              'Similar supplies available at 40% lower cost',
              'No quantity justification provided'
            ],
            nextSteps: [
              'Contact billing department for detailed supply breakdown',
              'Request wholesale cost documentation',
              'Compare with Medicare reimbursement rates'
            ]
          });
        }
        
        if (item.category === 'surgery' && item.description.includes('Level 5')) {
          issues.push({
            id: `coding-error-${item.id}`,
            title: 'Potential Upcoding - Level 5 ED Visit',
            description: 'Highest level emergency coding may not be justified',
            category: 'coding_error',
            riskLevel: 'high',
            potentialSavings: 800,
            confidence: 75,
            priority: 1,
            actionRequired: 'Verify medical documentation supports Level 5 coding',
            evidence: [
              'Level 5 requires life-threatening condition',
              'Must have comprehensive exam documentation',
              'High complexity medical decision making required'
            ],
            nextSteps: [
              'Request complete medical records',
              'Compare documentation against Level 5 criteria',
              'Challenge if criteria not met'
            ]
          });
        }
      }
      
      if (item.category === 'room' && item.quantity && item.quantity > 1) {
        issues.push({
          id: `room-overlap-${item.id}`,
          title: 'Room Billing During Surgery',
          description: 'Room charges may overlap with operating room time',
          category: 'duplicate',
          riskLevel: 'medium',
          potentialSavings: (item.unitPrice || 0) * 0.5,
          confidence: 70,
          priority: 2,
          actionRequired: 'Verify room charges don\'t overlap with OR time',
          evidence: [
              'Room charges during surgical procedure periods',
              'Duplicate facility fees possible',
              'Timeline analysis needed'
            ],
            nextSteps: [
              'Request detailed timeline of all charges',
              'Identify overlapping facility fees',
              'Challenge duplicate room charges'
            ]
        });
      }
    });

    // Add general bill analysis issues
    if (totalAmount > 10000) {
      issues.push({
        id: 'large-bill-review',
        title: 'Large Bill Comprehensive Review',
        description: 'Bills over $10,000 typically contain 3-8 billing errors',
        category: 'overcharge',
        riskLevel: 'high',
        potentialSavings: totalAmount * 0.25, // 25% potential reduction
        confidence: 90,
        priority: 1,
        actionRequired: 'Comprehensive line-by-line analysis required',
        evidence: [
          '80% of large bills contain correctable errors',
          'Average error value: $2,000-$35,000',
          'Professional review recommended'
        ],
        nextSteps: [
          'Request complete itemized bill',
          'Cross-reference with medical records',
          'Consider professional bill review'
        ]
      });
    }

    return issues;
  };

  const issues = generateIssues();
  const potentialSavings = issues.reduce((total, issue) => total + issue.potentialSavings, 0);
  
  // Calculate category breakdown
  const categoryBreakdown: { [key: string]: number } = {};
  lineItems.forEach(item => {
    categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + item.amount;
  });

  const riskScore = Math.min(100, Math.round((issues.filter(i => i.riskLevel === 'high').length * 40) + 
    (issues.filter(i => i.riskLevel === 'medium').length * 20)));

  return {
    totalAmount,
    patientResponsibility,
    lineItems,
    issues,
    potentialSavings,
    riskScore,
    analysisConfidence: 85,
    categoryBreakdown,
    recommendations: [
      'Request complete itemized bill with CPT codes',
      'Compare charges against regional pricing averages',
      'Apply for charity care if eligible',
      'Negotiate payment plan with identified errors'
    ]
  };
};

// Upload component
const BillUploadZone = ({ onBillAnalyzed }: { onBillAnalyzed: (data: BillAnalysisData) => void }) => {
  const [uploading, setUploading] = useState(false);
  const [billData, setBillData] = useState({
    totalAmount: '',
    patientResponsibility: '',
    providerName: '',
    serviceDate: '',
    serviceType: 'emergency'
  });
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    
    // Simulate file processing
    setTimeout(() => {
      const mockExtractedData = {
        totalAmount: '15750.00',
        patientResponsibility: '3150.00',
        providerName: 'Central City Hospital',
        serviceDate: '2024-01-15',
        serviceType: 'emergency'
      };
      
      setBillData(mockExtractedData);
      const analysis = analyzeBill(mockExtractedData);
      onBillAnalyzed(analysis);
      setUploading(false);
      
      toast({
        title: "Bill Analysis Complete",
        description: `Found ${analysis.issues.length} potential issues worth $${analysis.potentialSavings.toFixed(0)} in savings.`
      });
    }, 2000);
  };

  const handleManualAnalysis = () => {
    const analysis = analyzeBill(billData);
    onBillAnalyzed(analysis);
    
    toast({
      title: "Analysis Complete",
      description: `Found ${analysis.issues.length} potential issues to review.`
    });
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-600" />
            Upload Your Medical Bill
          </CardTitle>
          <CardDescription>
            Take a photo or upload a PDF of your medical bill for instant analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="h-6 w-6 text-blue-600" />
                  </motion.div>
                </div>
                <div>
                  <div className="text-lg font-medium text-gray-900">Analyzing Your Bill...</div>
                  <div className="text-sm text-gray-600">Checking for overcharges and billing errors</div>
                  <Progress value={65} className="mt-3" />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <div className="text-lg font-medium text-gray-900">Upload Medical Bill</div>
                  <div className="text-sm text-gray-600 mt-1">PDF, JPG, PNG up to 10MB</div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  data-testid="upload-bill-button"
                >
                  Choose File
                </Button>
              </motion.div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-sm text-gray-500">OR</span>
        <Separator className="flex-1" />
      </div>

      {/* Manual Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Manual Bill Entry
          </CardTitle>
          <CardDescription>
            Enter your bill details manually for quick analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Bill Amount</Label>
              <Input
                id="totalAmount"
                type="number"
                placeholder="15,750.00"
                value={billData.totalAmount}
                onChange={(e) => setBillData(prev => ({ ...prev, totalAmount: e.target.value }))}
                data-testid="input-total-amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientAmount">Your Responsibility</Label>
              <Input
                id="patientAmount"
                type="number"
                placeholder="3,150.00"
                value={billData.patientResponsibility}
                onChange={(e) => setBillData(prev => ({ ...prev, patientResponsibility: e.target.value }))}
                data-testid="input-patient-responsibility"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="provider">Healthcare Provider</Label>
            <Input
              id="provider"
              placeholder="Hospital or Clinic Name"
              value={billData.providerName}
              onChange={(e) => setBillData(prev => ({ ...prev, providerName: e.target.value }))}
              data-testid="input-provider-name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceDate">Service Date</Label>
              <Input
                id="serviceDate"
                type="date"
                value={billData.serviceDate}
                onChange={(e) => setBillData(prev => ({ ...prev, serviceDate: e.target.value }))}
                data-testid="input-service-date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceType">Type of Care</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-gray-300 text-sm"
                value={billData.serviceType}
                onChange={(e) => setBillData(prev => ({ ...prev, serviceType: e.target.value }))}
                data-testid="select-service-type"
              >
                <option value="emergency">Emergency Care</option>
                <option value="surgery">Surgery</option>
                <option value="imaging">Imaging/Tests</option>
                <option value="outpatient">Outpatient Visit</option>
                <option value="inpatient">Hospital Stay</option>
              </select>
            </div>
          </div>

          <Button 
            onClick={handleManualAnalysis}
            className="w-full bg-green-600 hover:bg-green-700"
            data-testid="button-analyze-manual"
          >
            <Brain className="h-4 w-4 mr-2" />
            Analyze Bill for Free
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Analysis Results Component
const AnalysisResults = ({ analysis }: { analysis: BillAnalysisData }) => {
  const { isSubscribed } = useSubscription();
  const [selectedIssue, setSelectedIssue] = useState<AnalysisResult | null>(null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'duplicate': return <Copy className="h-4 w-4" />;
      case 'overcharge': return <TrendingDown className="h-4 w-4" />;
      case 'coding_error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Analysis Summary */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-6 w-6 text-blue-600" />
            Analysis Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(analysis.potentialSavings)}
                </div>
                <div className="text-sm text-gray-600">Potential Savings</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {analysis.issues.length}
                </div>
                <div className="text-sm text-gray-600">Issues Found</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-center">
                <div className={`text-2xl font-bold ${analysis.riskScore > 70 ? 'text-red-600' : analysis.riskScore > 40 ? 'text-orange-600' : 'text-green-600'}`}>
                  {analysis.riskScore}/100
                </div>
                <div className="text-sm text-gray-600">Risk Score</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {analysis.analysisConfidence}%
                </div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues Found */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Issues Detected ({analysis.issues.length})
          </CardTitle>
          <CardDescription>
            Click on any issue to see detailed analysis and next steps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {analysis.issues.map((issue, index) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${getRiskColor(issue.riskLevel)}`}
              onClick={() => setSelectedIssue(issue)}
              data-testid={`issue-card-${index}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(issue.category)}
                    <span className="font-medium">{issue.title}</span>
                    <Badge variant="outline" className="text-xs">
                      Priority {issue.priority}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{issue.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">
                      {formatCurrency(issue.potentialSavings)} savings
                    </span>
                    <span className="text-sm opacity-75">
                      {issue.confidence}% confidence
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 opacity-50" />
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Bill Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-indigo-600" />
            Bill Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analysis.categoryBreakdown).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="capitalize">{category.replace('_', ' ')}</span>
                <span className="font-medium">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-600" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-medium text-emerald-600">{index + 1}</span>
                </div>
                <span className="text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Premium Upgrade CTA */}
      {!isSubscribed && (
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-600" />
              Unlock Advanced Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                Get professional-level bill analysis with detailed dispute letters, 
                medical code verification, and 24/7 expert support.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Professional dispute letters</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Medical code verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Insurance appeal assistance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>24/7 expert support</span>
                </div>
              </div>
              <Link href="/premium">
                <Button className="w-full bg-purple-600 hover:bg-purple-700" data-testid="button-upgrade-premium">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issue Detail Modal */}
      <AnimatePresence>
        {selectedIssue && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIssue(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{selectedIssue.title}</h3>
                    <Badge className={getRiskColor(selectedIssue.riskLevel)}>
                      {selectedIssue.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                  <button 
                    onClick={() => setSelectedIssue(null)}
                    className="text-gray-400 hover:text-gray-600"
                    data-testid="button-close-issue-detail"
                  >
                    ×
                  </button>
                </div>
                
                <p className="text-gray-700">{selectedIssue.description}</p>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedIssue.potentialSavings)}
                  </div>
                  <div className="text-sm text-green-700">Potential Savings</div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Evidence:</h4>
                  <ul className="space-y-1 text-sm">
                    {selectedIssue.evidence.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Next Steps:</h4>
                  <ol className="space-y-2 text-sm">
                    {selectedIssue.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <Button 
                  onClick={() => setSelectedIssue(null)}
                  className="w-full"
                  data-testid="button-got-it"
                >
                  Got It
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Main Component
export default function QuickAnalyzer() {
  const { user } = useAuth();
  const [analysisData, setAnalysisData] = useState<BillAnalysisData | null>(null);
  const [showEducation, setShowEducation] = useState(false);

  const handleBillAnalyzed = (data: BillAnalysisData) => {
    setAnalysisData(data);
  };

  const resetAnalysis = () => {
    setAnalysisData(null);
  };

  return (
    <MobileLayout 
      title="Quick Bill Analyzer" 
      showBackButton={true}
      showBottomNav={true}
    >
      <div className="min-h-full">
        {!analysisData ? (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="text-center space-y-4 py-6">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Radar className="h-8 w-8 text-blue-600" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quick Bill Analyzer</h1>
                <p className="text-gray-600 mt-1">
                  Free analysis to find overcharges and billing errors
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">80%</div>
                  <div className="text-xs text-gray-500">Bills Have Errors</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">$2K+</div>
                  <div className="text-xs text-gray-500">Avg Savings</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">Free</div>
                  <div className="text-xs text-gray-500">Analysis</div>
                </div>
              </div>
            </div>

            {/* Education Toggle */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEducation(!showEducation)}
                className="gap-2"
                data-testid="button-toggle-education"
              >
                <Lightbulb className="h-4 w-4" />
                {showEducation ? 'Hide' : 'Show'} Bill Analysis Guide
              </Button>
            </div>

            {/* Educational Content */}
            <AnimatePresence>
              {showEducation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Brain className="h-5 w-5 text-blue-600" />
                        How Bill Analysis Works
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Common Billing Errors We Find:</h4>
                        <ul className="space-y-1 text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-red-500">•</span>
                            <span><strong>Duplicate Charges:</strong> Same service billed multiple times</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            <span><strong>Upcoding:</strong> Billing for more expensive procedures than provided</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            <span><strong>Supply Overcharges:</strong> 300-800% markups on basic supplies</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-500">•</span>
                            <span><strong>Unbundling:</strong> Separate charges for bundled procedures</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">What You'll Get:</h4>
                        <ul className="space-y-1 text-gray-700">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Line-by-line error detection</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Potential savings estimates</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Actionable next steps</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Contact scripts for providers</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <BillUploadZone onBillAnalyzed={handleBillAnalyzed} />
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Analysis Results</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetAnalysis}
                data-testid="button-analyze-another"
              >
                Analyze Another Bill
              </Button>
            </div>
            <AnalysisResults analysis={analysisData} />
          </div>
        )}
      </div>
    </MobileLayout>
  );
}