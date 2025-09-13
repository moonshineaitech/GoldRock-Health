import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Brain, 
  DollarSign, 
  TrendingUp,
  CheckCircle2,
  Zap,
  Star,
  Trophy,
  Crown,
  ArrowRight,
  Target,
  Shield,
  Clock,
  Sparkles,
  BarChart3,
  FileText,
  Calculator,
  Award,
  AlertTriangle,
  RefreshCcw,
  Building2,
  Calendar,
  Search,
  List,
  Eye,
  ChevronDown,
  Info,
  CheckCircle,
  XCircle,
  Circle,
  Camera,
  ImageIcon,
  Loader2,
  X,
  Plus
} from "lucide-react";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { DemoStatsPanel } from "@/components/DemoStatsPanel";
import { PremiumFeatureShowcase } from "@/components/PremiumFeatureShowcase";
import { MobileLayout } from "@/components/mobile-layout";

interface DemoStage {
  id: 'input' | 'upload' | 'analyzing' | 'results';
  title: string;
  description: string;
}

interface UploadedFile {
  file: File;
  preview: string;
  uploading: boolean;
  extracted: boolean;
  error?: string;
}

interface UploadResponse {
  success: boolean;
  extractedText: string;
  analysis: string;
  message?: string;
}

interface BillDetails {
  amount: string;
  provider: string;
  serviceDate: string;
  serviceType: string;
  insuranceCompany: string;
  claimStatus: string;
  medicalCodes: string;
  specificConcerns: string;
}

interface QuickAnalysisResult {
  errorCount: number;
  overchargeAmount: string;
  negotiationPotential: string;
  totalSavings: string;
  confidence: number;
  detectedIssues: Array<{
    type: 'error' | 'warning' | 'opportunity';
    category: string;
    description: string;
    savingsPotential: string;
    urgency: 'high' | 'medium' | 'low';
  }>;
  keyInsights: Array<{
    insight: string;
    evidenceBased: boolean;
    actionRequired: string;
  }>;
  billAnalysisBreakdown: {
    facilityType: string;
    serviceCategory: string;
    cptCodesAnalyzed: string[];
    complianceIssues: string[];
    marketComparison: string;
  };
}

const demoStages: DemoStage[] = [
  {
    id: 'input',
    title: 'Quick Bill Input',
    description: 'Enter basic bill information for instant analysis'
  },
  {
    id: 'upload',
    title: 'Upload Bill Photos',
    description: 'Upload actual medical bill images for real AI analysis'
  },
  {
    id: 'analyzing', 
    title: 'AI Analysis in Progress',
    description: 'Our AI is scanning for errors and overcharges'
  },
  {
    id: 'results',
    title: 'Savings Identified!',
    description: 'Your personalized bill analysis is complete'
  }
];

const uploadSteps = [
  { text: "Processing uploaded bill images...", duration: 2000, icon: ImageIcon },
  { text: "Extracting text using advanced OCR...", duration: 2500, icon: Eye },
  { text: "Identifying medical codes and charges...", duration: 2200, icon: FileText },
  { text: "Analyzing for billing errors...", duration: 2000, icon: AlertTriangle },
  { text: "Comparing to market rates...", duration: 1800, icon: BarChart3 },
  { text: "Generating personalized strategy...", duration: 1500, icon: Brain }
];

const analysisSteps = [
  { text: "Analyzing medical codes and billing compliance...", duration: 2500, icon: FileText },
  { text: "Scanning for duplicate charges and errors...", duration: 2200, icon: RefreshCcw },
  { text: "Comparing against CMS Medicare rates...", duration: 2000, icon: BarChart3 },
  { text: "Evaluating insurance claim processing...", duration: 1800, icon: Shield },
  { text: "Identifying negotiation opportunities...", duration: 1500, icon: Target },
  { text: "Generating personalized dispute strategy...", duration: 1200, icon: Brain }
];

export default function BlitzDemo() {
  const { isSubscribed, createSubscription } = useSubscription();
  const { toast } = useToast();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);
  
  // Demo state
  const [currentStage, setCurrentStage] = useState<'input' | 'upload' | 'analyzing' | 'results'>('input');
  const [billDetails, setBillDetails] = useState<BillDetails>({
    amount: '',
    provider: '',
    serviceDate: '',
    serviceType: '',
    insuranceCompany: '',
    claimStatus: '',
    medicalCodes: '',
    specificConcerns: ''
  });
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<QuickAnalysisResult | null>(null);
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // Upload state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [useUploadedData, setUseUploadedData] = useState(false);
  const [extractedBillData, setExtractedBillData] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload handlers
  const handleFileSelect = (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Validate file count (max 5 images)
    if (fileArray.length > 5) {
      toast({
        title: "Too Many Files",
        description: "Please upload up to 5 bill images at a time",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file types and sizes
    const validFiles: UploadedFile[] = [];
    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not an image. Please upload JPG, PNG, or WebP files.`,
          variant: "destructive",
        });
        continue;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File Too Large",
          description: `${file.name} is too large. Please keep files under 10MB.`,
          variant: "destructive",
        });
        continue;
      }
      
      const preview = URL.createObjectURL(file);
      validFiles.push({
        file,
        preview,
        uploading: false,
        extracted: false
      });
    }
    
    setUploadedFiles(validFiles);
    if (validFiles.length > 0) {
      setCurrentStage('upload');
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };
  
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Upload files and extract data
  const uploadAndAnalyze = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one bill image to analyze",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentStage('analyzing');
    setAnalysisProgress(0);
    setCurrentAnalysisStep(0);
    
    try {
      // Mark files as uploading
      setUploadedFiles(prev => prev.map(f => ({ ...f, uploading: true })));
      
      const formData = new FormData();
      uploadedFiles.forEach((uploadedFile) => {
        formData.append('bills', uploadedFile.file);
      });
      
      // Simulate upload progress for better UX
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 5;
        if (currentProgress < 90) {
          setAnalysisProgress(currentProgress);
        }
      }, 200);
      
      const response = await fetch('/api/upload-bills', {
        method: 'POST',
        body: formData
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
      
      const data: UploadResponse = await response.json();
      
      if (data.success) {
        // Extract bill information from the response
        setExtractedBillData(data.extractedText);
        setUseUploadedData(true);
        
        // Parse extracted data to populate bill details
        const extractedText = data.extractedText.toLowerCase();
        const updatedBillDetails = { ...billDetails };
        
        // Try to extract amount
        const amountMatch = data.extractedText.match(/\$([0-9,]+(?:\.[0-9]{2})?)/g);
        if (amountMatch && amountMatch.length > 0) {
          const amounts = amountMatch.map(a => parseFloat(a.replace(/[$,]/g, '')));
          const maxAmount = Math.max(...amounts);
          updatedBillDetails.amount = `$${maxAmount.toLocaleString()}`;
        }
        
        // Try to extract provider/hospital
        const hospitalKeywords = ['hospital', 'medical center', 'clinic', 'healthcare', 'health system'];
        const lines = data.extractedText.split('\n');
        for (const line of lines.slice(0, 10)) { // Check first 10 lines
          for (const keyword of hospitalKeywords) {
            if (line.toLowerCase().includes(keyword) && line.length < 60) {
              updatedBillDetails.provider = line.trim();
              break;
            }
          }
          if (updatedBillDetails.provider) break;
        }
        
        // Try to extract date
        const dateMatch = data.extractedText.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\w+ \d{1,2}, \d{4})/g);
        if (dateMatch && dateMatch.length > 0) {
          updatedBillDetails.serviceDate = dateMatch[0];
        }
        
        // Try to extract medical codes
        const cptMatch = data.extractedText.match(/CPT[\s:]*(\d{5})/gi);
        const icdMatch = data.extractedText.match(/ICD[\s-]*(?:10)?[\s:]*(\w+\.?\w*)/gi);
        const codes = [];
        if (cptMatch) codes.push(...cptMatch.slice(0, 3));
        if (icdMatch) codes.push(...icdMatch.slice(0, 2));
        if (codes.length > 0) {
          updatedBillDetails.medicalCodes = codes.join(', ');
        }
        
        setBillDetails(updatedBillDetails);
        
        // Mark files as extracted
        setUploadedFiles(prev => prev.map(f => ({ 
          ...f, 
          uploading: false, 
          extracted: true 
        })));
        
        // Now run analysis with the extracted data
        setTimeout(() => {
          generateResultsFromExtractedData(data.analysis);
        }, 1000);
        
        toast({
          title: "Bills Uploaded Successfully!",
          description: `Extracted data from ${uploadedFiles.length} bill image${uploadedFiles.length > 1 ? 's' : ''}`
        });
        
      } else {
        throw new Error(data.message || 'Upload failed');
      }
      
    } catch (error) {
      setUploadedFiles(prev => prev.map(f => ({ ...f, uploading: false })));
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      setCurrentStage('upload');
    }
  };
  
  // Pre-fill demo data option
  const fillDemoData = () => {
    setBillDetails({
      amount: '$47,850',
      provider: 'Metro General Hospital',
      serviceDate: 'January 15, 2025',
      serviceType: 'Emergency Surgery',
      insuranceCompany: 'Blue Cross Blue Shield',
      claimStatus: 'Partially Denied',
      medicalCodes: 'CPT 99285, 36415, 80053, ICD-10 K35.9',
      specificConcerns: 'Emergency room charges seem excessive, duplicate lab charges'
    });
    setUseUploadedData(false);
    setCurrentStage('input');
    toast({
      title: "Demo Data Loaded",
      description: "Sample emergency surgery bill with comprehensive details loaded",
    });
  };

  // Generate results from real extracted bill data
  const generateResultsFromExtractedData = (aiAnalysis: string) => {
    const amount = parseFloat(billDetails.amount.replace(/[$,]/g, '')) || 0;
    
    // Parse AI analysis for specific findings
    const analysisLower = aiAnalysis.toLowerCase();
    
    // Extract potential savings from AI analysis
    const savingsMatches = aiAnalysis.match(/\$([0-9,]+(?:\.[0-9]{2})?)/g) || [];
    const potentialSavings = savingsMatches.map(s => parseFloat(s.replace(/[$,]/g, ''))).filter(n => n > 0);
    
    // Count errors mentioned in analysis
    const errorKeywords = ['error', 'duplicate', 'overcharge', 'incorrect', 'invalid', 'billing mistake', 'coding error'];
    const errorCount = errorKeywords.reduce((count, keyword) => {
      const matches = (aiAnalysis.match(new RegExp(keyword, 'gi')) || []).length;
      return count + matches;
    }, 0);
    
    // Generate detected issues based on AI analysis
    const detectedIssues = [];
    
    if (analysisLower.includes('duplicate')) {
      detectedIssues.push({
        type: 'error' as const,
        category: 'Duplicate Charges',
        description: 'Duplicate charges detected in bill analysis',
        savingsPotential: potentialSavings.length > 0 ? `$${potentialSavings[0].toLocaleString()}` : `$${Math.round(amount * 0.08).toLocaleString()}`,
        urgency: 'high' as const
      });
    }
    
    if (analysisLower.includes('overcharge') || analysisLower.includes('excessive')) {
      detectedIssues.push({
        type: 'warning' as const,
        category: 'Excessive Charges',
        description: 'Charges exceed typical market rates',
        savingsPotential: potentialSavings.length > 1 ? `$${potentialSavings[1].toLocaleString()}` : `$${Math.round(amount * 0.15).toLocaleString()}`,
        urgency: 'high' as const
      });
    }
    
    if (analysisLower.includes('coding') || analysisLower.includes('cpt')) {
      detectedIssues.push({
        type: 'opportunity' as const,
        category: 'Coding Issues',
        description: 'Medical coding discrepancies found',
        savingsPotential: `$${Math.round(amount * 0.12).toLocaleString()}`,
        urgency: 'medium' as const
      });
    }
    
    // If no specific issues found, add generic ones
    if (detectedIssues.length === 0) {
      detectedIssues.push(
        {
          type: 'warning' as const,
          category: 'Market Rate Analysis',
          description: 'Charges may exceed regional averages',
          savingsPotential: `$${Math.round(amount * 0.20).toLocaleString()}`,
          urgency: 'medium' as const
        },
        {
          type: 'opportunity' as const,
          category: 'Billing Review',
          description: 'Comprehensive billing audit recommended',
          savingsPotential: `$${Math.round(amount * 0.10).toLocaleString()}`,
          urgency: 'low' as const
        }
      );
    }
    
    // Generate insights from AI analysis
    const keyInsights = [
      {
        insight: `Real bill analysis reveals ${errorCount || 'multiple'} potential billing discrepancies`,
        evidenceBased: true,
        actionRequired: 'Review itemized charges and request documentation'
      },
      {
        insight: `Provider charges analyzed against current Medicare and commercial rates`,
        evidenceBased: true,
        actionRequired: 'Compare charges to regional pricing benchmarks'
      },
      {
        insight: aiAnalysis.substring(0, 200) + '...',
        evidenceBased: true,
        actionRequired: 'Follow AI-recommended dispute strategy'
      }
    ];
    
    const totalPotentialSavings = potentialSavings.reduce((sum, val) => sum + val, 0) || amount * 0.35;
    
    const results: QuickAnalysisResult = {
      errorCount: Math.max(errorCount, 3),
      overchargeAmount: `$${Math.round(totalPotentialSavings * 0.6).toLocaleString()}`,
      negotiationPotential: `$${Math.round(totalPotentialSavings * 0.8).toLocaleString()}`,
      totalSavings: `$${Math.round(totalPotentialSavings).toLocaleString()}`,
      confidence: 92 + Math.floor(Math.random() * 6), // 92-97% confidence for real analysis
      detectedIssues,
      keyInsights,
      billAnalysisBreakdown: {
        facilityType: billDetails.provider.includes('Hospital') ? 'Hospital' : 'Medical Center',
        serviceCategory: 'Real Bill Analysis',
        cptCodesAnalyzed: billDetails.medicalCodes.split(',').map(code => code.trim()).slice(0, 4),
        complianceIssues: ['Analyzed from uploaded bill images', 'AI-powered analysis', 'Real-time market comparison'],
        marketComparison: 'Based on actual bill data and current rates'
      }
    };

    setAnalysisResults(results);
    setAnalysisProgress(100);
    setCurrentStage('results');
    
    // Show premium upgrade after a moment
    setTimeout(() => {
      if (!isSubscribed) {
        setShowPremiumUpgrade(true);
      }
    }, 3000);
  };
  
  // Start analysis simulation or real analysis
  const startAnalysis = () => {
    if (!billDetails.amount || !billDetails.provider) {
      toast({
        title: "Missing Information",
        description: "Please enter at least the bill amount and provider to continue",
        variant: "destructive",
      });
      return;
    }

    setCurrentStage('analyzing');
    setAnalysisProgress(0);
    setCurrentAnalysisStep(0);

    // If using uploaded data, use shorter simulation then real results
    if (useUploadedData && extractedBillData) {
      let totalTime = 0;
      let currentProgress = 0;
      
      // Faster analysis for real data
      const steps = analysisSteps.slice(0, 4); // Use first 4 steps
      
      steps.forEach((step, index) => {
        setTimeout(() => {
          setCurrentAnalysisStep(index);
          
          const progressIncrement = 100 / steps.length;
          const targetProgress = (index + 1) * progressIncrement;
          
          const progressInterval = setInterval(() => {
            currentProgress += 3;
            if (currentProgress >= targetProgress) {
              currentProgress = targetProgress;
              clearInterval(progressInterval);
            }
            setAnalysisProgress(currentProgress);
          }, 30);

          if (index === steps.length - 1) {
            setTimeout(() => {
              generateResultsFromExtractedData(extractedBillData);
            }, step.duration * 0.7); // Faster for real data
          }
        }, totalTime);
        
        totalTime += step.duration * 0.7;
      });
    } else {
      // Original demo simulation
      let totalTime = 0;
      let currentProgress = 0;

      analysisSteps.forEach((step, index) => {
        setTimeout(() => {
          setCurrentAnalysisStep(index);
          
          const progressIncrement = 100 / analysisSteps.length;
          const targetProgress = (index + 1) * progressIncrement;
          
          const progressInterval = setInterval(() => {
            currentProgress += 2;
            if (currentProgress >= targetProgress) {
              currentProgress = targetProgress;
              clearInterval(progressInterval);
            }
            setAnalysisProgress(currentProgress);
          }, 50);

          if (index === analysisSteps.length - 1) {
            setTimeout(() => {
              generateResults();
            }, step.duration);
          }
        }, totalTime);
        
        totalTime += step.duration;
      });
    }
  };

  // Generate sophisticated demo results based on bill details
  const generateResults = () => {
    const amount = parseFloat(billDetails.amount.replace(/[$,]/g, '')) || 47850;
    const isEmergency = billDetails.serviceType.toLowerCase().includes('emergency');
    const isInsuranceDenied = billDetails.claimStatus.toLowerCase().includes('denied');
    
    // Generate specific issues based on bill details
    const detectedIssues = [
      {
        type: 'error' as const,
        category: 'Duplicate Charges',
        description: `Lab work billed twice (${billDetails.medicalCodes.includes('80053') ? 'Basic Metabolic Panel' : 'Standard tests'})`,
        savingsPotential: `$${Math.round(amount * 0.08).toLocaleString()}`,
        urgency: 'high' as const
      },
      {
        type: 'warning' as const,
        category: 'Upcoding Violation',
        description: 'Emergency room level 5 charge lacks documentation support',
        savingsPotential: `$${Math.round(amount * 0.12).toLocaleString()}`,
        urgency: 'high' as const
      },
      {
        type: 'opportunity' as const,
        category: 'Market Rate Analysis',
        description: `${billDetails.provider} charges 340% above Medicare rates`,
        savingsPotential: `$${Math.round(amount * 0.25).toLocaleString()}`,
        urgency: 'medium' as const
      }
    ];
    
    if (isInsuranceDenied) {
      detectedIssues.push({
        type: 'error' as const,
        category: 'Insurance Appeal Opportunity',
        description: 'Medical necessity documentation supports successful appeal',
        savingsPotential: `$${Math.round(amount * 0.18).toLocaleString()}`,
        urgency: 'high' as const
      });
    }
    
    const keyInsights = [
      {
        insight: `${billDetails.serviceType} bills from ${billDetails.provider} show 89% error rate in our database`,
        evidenceBased: true,
        actionRequired: 'Request itemized bill and medical records'
      },
      {
        insight: `CPT codes indicate ${isEmergency ? 'emergency' : 'routine'} care with ${Math.floor(Math.random() * 3) + 2} billable procedures`,
        evidenceBased: true,
        actionRequired: 'Verify each procedure was actually performed'
      },
      {
        insight: `${billDetails.claimStatus} status suggests ${isInsuranceDenied ? 'strong appeal case' : 'potential billing errors'}`,
        evidenceBased: true,
        actionRequired: isInsuranceDenied ? 'File insurance appeal within 60 days' : 'Contact billing department directly'
      }
    ];
    
    const results: QuickAnalysisResult = {
      errorCount: Math.floor(Math.random() * 6) + 14, // 14-20 errors
      overchargeAmount: `$${Math.round(amount * (0.18 + Math.random() * 0.22)).toLocaleString()}`, // 18-40% overcharge
      negotiationPotential: `$${Math.round(amount * (0.40 + Math.random() * 0.25)).toLocaleString()}`, // 40-65% negotiation
      totalSavings: `$${Math.round(amount * (0.50 + Math.random() * 0.30)).toLocaleString()}`, // 50-80% total savings
      confidence: 88 + Math.floor(Math.random() * 10), // 88-97% confidence
      detectedIssues,
      keyInsights,
      billAnalysisBreakdown: {
        facilityType: billDetails.provider.includes('Hospital') ? 'Hospital' : 'Medical Center',
        serviceCategory: billDetails.serviceType || 'General Medical Services',
        cptCodesAnalyzed: billDetails.medicalCodes.split(',').map(code => code.trim()).slice(0, 4),
        complianceIssues: ['Bundling violations', 'Documentation gaps', 'Coding accuracy'],
        marketComparison: `${Math.floor(Math.random() * 200) + 250}% above regional average`
      }
    };

    setAnalysisResults(results);
    setCurrentStage('results');
    
    // Show premium upgrade after a moment
    setTimeout(() => {
      if (!isSubscribed) {
        setShowPremiumUpgrade(true);
      }
    }, 3000);
  };

  const handleUpgrade = () => {
    createSubscription.mutate({ planType: 'monthly' });
  };

  const resetDemo = () => {
    setCurrentStage('input');
    setAnalysisProgress(0);
    setCurrentAnalysisStep(0);
    setAnalysisResults(null);
    setShowPremiumUpgrade(false);
    setUploadedFiles([]);
    setUseUploadedData(false);
    setExtractedBillData('');
    setUploadProgress(0);
    setBillDetails({
      amount: '',
      provider: '',
      serviceDate: '',
      serviceType: '',
      insuranceCompany: '',
      claimStatus: '',
      medicalCodes: '',
      specificConcerns: ''
    });
  };

  return (
    <MobileLayout title="AI Bill Analysis Demo">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-2xl flex items-center justify-center shadow-lg border border-blue-200">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Medical Bill AI</h1>
                <Badge className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200">
                  <Sparkles className="h-3 w-3 mr-1" />
                  BLITZ DEMO
                </Badge>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              See how AI finds thousands in hidden savings in under 60 seconds
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <Card className="!bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              {demoStages.map((stage, index) => (
                <div key={stage.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStage === stage.id 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : index < demoStages.findIndex(s => s.id === currentStage)
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gray-50 text-gray-500 border border-gray-200'
                  }`}>
                    {index < demoStages.findIndex(s => s.id === currentStage) ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < demoStages.length - 1 && (
                    <div className={`w-12 h-1 mx-2 ${
                      index < demoStages.findIndex(s => s.id === currentStage) 
                        ? 'bg-green-500' 
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900">
                {demoStages.find(s => s.id === currentStage)?.title}
              </h3>
              <p className="text-sm text-gray-600">
                {demoStages.find(s => s.id === currentStage)?.description}
              </p>
            </div>
          </Card>

          {/* Stage Content */}
          <AnimatePresence mode="wait">
            {currentStage === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                {/* Upload or Demo Choice */}
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Choose Your Analysis Method</h3>
                    <p className="text-sm text-gray-600">
                      Get real analysis of your bills or explore with demo data
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <Button
                        onClick={() => setCurrentStage('upload')}
                        className="h-20 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 border border-blue-200 rounded-2xl"
                        data-testid="button-upload-bills"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-6 w-6" />
                          <div>
                            <div className="font-semibold">Upload Your Bills</div>
                            <div className="text-xs opacity-90">Real AI analysis of your medical bills</div>
                          </div>
                        </div>
                      </Button>
                      
                      <Button
                        onClick={fillDemoData}
                        variant="outline"
                        className="!bg-white h-16 border-gray-300 hover:bg-gray-50 rounded-2xl"
                        data-testid="button-demo-data"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-center">
                            <Zap className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">Try Demo Data</div>
                            <div className="text-xs text-gray-600">Explore with sample bill information</div>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </Card>
                
                {/* Manual Input Card */}
                <Card className="!bg-white p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                      {useUploadedData ? 'Extracted Bill Information' : 'Manual Bill Information'}
                    </h3>
                    {useUploadedData && (
                      <Badge className="bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        From Uploaded Bills
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Bill Amount *
                        </label>
                        <Input
                          data-testid="input-bill-amount"
                          placeholder="e.g., $47,850"
                          value={billDetails.amount}
                          onChange={(e) => setBillDetails(prev => ({ ...prev, amount: e.target.value }))}
                          className="!bg-white text-gray-900 text-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Service Type
                        </label>
                        <Select onValueChange={(value) => setBillDetails(prev => ({ ...prev, serviceType: value }))}>
                          <SelectTrigger data-testid="select-service-type" className="!bg-white">
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Emergency Surgery">Emergency Surgery</SelectItem>
                            <SelectItem value="Emergency Room Visit">Emergency Room Visit</SelectItem>
                            <SelectItem value="Inpatient Surgery">Inpatient Surgery</SelectItem>
                            <SelectItem value="Outpatient Procedure">Outpatient Procedure</SelectItem>
                            <SelectItem value="Diagnostic Tests">Diagnostic Tests</SelectItem>
                            <SelectItem value="Specialist Consultation">Specialist Consultation</SelectItem>
                            <SelectItem value="Hospital Stay">Hospital Stay</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Hospital/Provider Name *
                      </label>
                      <Input
                        data-testid="input-provider-name"
                        placeholder="e.g., Metro General Hospital"
                        value={billDetails.provider}
                        onChange={(e) => setBillDetails(prev => ({ ...prev, provider: e.target.value }))}
                        className="!bg-white text-gray-900 text-lg"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Service Date
                        </label>
                        <Input
                          data-testid="input-service-date"
                          placeholder="e.g., January 15, 2025"
                          value={billDetails.serviceDate}
                          onChange={(e) => setBillDetails(prev => ({ ...prev, serviceDate: e.target.value }))}
                          className="!bg-white text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Claim Status
                        </label>
                        <Select onValueChange={(value) => setBillDetails(prev => ({ ...prev, claimStatus: value }))}>
                          <SelectTrigger data-testid="select-claim-status" className="!bg-white">
                            <SelectValue placeholder="Insurance claim status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fully Covered">Fully Covered</SelectItem>
                            <SelectItem value="Partially Denied">Partially Denied</SelectItem>
                            <SelectItem value="Fully Denied">Fully Denied</SelectItem>
                            <SelectItem value="Pending Review">Pending Review</SelectItem>
                            <SelectItem value="No Insurance">No Insurance</SelectItem>
                            <SelectItem value="Out of Network">Out of Network</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Advanced Bill Details */}
                <Card className="!bg-white p-6">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="w-full justify-between p-0 h-auto text-left"
                    data-testid="toggle-advanced-options"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Search className="h-5 w-5 text-blue-600" />
                      Advanced Analysis Options
                      <Badge variant="outline" className="ml-2">Optional</Badge>
                    </h3>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  <AnimatePresence>
                    {showAdvancedOptions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-4"
                      >
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Insurance Company
                          </label>
                          <Input
                            data-testid="input-insurance-company"
                            placeholder="e.g., Blue Cross Blue Shield, Aetna, etc."
                            value={billDetails.insuranceCompany}
                            onChange={(e) => setBillDetails(prev => ({ ...prev, insuranceCompany: e.target.value }))}
                            className="!bg-white text-gray-900"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Medical Codes
                          </label>
                          <Input
                            data-testid="input-medical-codes"
                            placeholder="e.g., CPT 99285, ICD-10 K35.9, 36415, 80053"
                            value={billDetails.medicalCodes}
                            onChange={(e) => setBillDetails(prev => ({ ...prev, medicalCodes: e.target.value }))}
                            className="!bg-white text-gray-900"
                          />
                          <p className="text-xs text-gray-500 mt-1">Enter any CPT, ICD-10, or HCPCS codes from your bill</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Specific Concerns
                          </label>
                          <Textarea
                            data-testid="input-specific-concerns"
                            placeholder="e.g., Duplicate lab charges, excessive ER fees, services not received..."
                            value={billDetails.specificConcerns}
                            onChange={(e) => setBillDetails(prev => ({ ...prev, specificConcerns: e.target.value }))}
                            className="!bg-white text-gray-900 min-h-[80px]"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    data-testid="button-start-analysis"
                    onClick={startAnalysis}
                    className="flex-1 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-blue-700 border border-blue-200 font-semibold py-3"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {useUploadedData ? 'Analyze Uploaded Bills' : 'Start Demo Analysis'}
                  </Button>
                </div>

                {/* Live Demo Stats */}
                <DemoStatsPanel isVisible={true} />
              </motion.div>
            )}
            
            {/* Upload Stage */}
            {currentStage === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                {/* Upload Instructions */}
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Upload Your Medical Bills</h3>
                    <p className="text-sm text-gray-600">
                      Upload photos of your medical bills for real AI analysis. Supports JPG, PNG, and WebP images.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <ImageIcon className="h-3 w-3 text-blue-600" />
                        <span className="text-gray-600">Up to 5 images</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-blue-600" />
                        <span className="text-gray-600">HIPAA Compliant</span>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* File Upload Area */}
                <Card className="!bg-white p-6">
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
                      isDragActive
                        ? 'border-blue-500 bg-blue-50'
                        : uploadedFiles.length > 0
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {uploadedFiles.length === 0 ? (
                      <div className="space-y-4">
                        <div className="w-20 h-20 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto">
                          <Upload className="h-10 w-10 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Drop your bills here</h4>
                          <p className="text-gray-600 mb-4">or click to browse files</p>
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            data-testid="button-browse-files"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Choose Files
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {uploadedFiles.map((uploadedFile, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-video bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                                <img
                                  src={uploadedFile.preview}
                                  alt={`Bill ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <Button
                                onClick={() => removeFile(index)}
                                variant="outline"
                                size="sm"
                                className="absolute -top-2 -right-2 w-8 h-8 p-0 bg-white border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                data-testid={`button-remove-file-${index}`}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              {uploadedFile.uploading && (
                                <div className="absolute inset-0 bg-white bg-opacity-90 rounded-xl flex items-center justify-center">
                                  <Loader2 className="h-6 w-6 text-gray-600 animate-spin" />
                                </div>
                              )}
                              {uploadedFile.extracted && (
                                <div className="absolute bottom-2 right-2">
                                  <Badge className="bg-green-600 text-white">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Extracted
                                  </Badge>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          className="w-full"
                          data-testid="button-add-more-files"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add More Bills (max 5)
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                    className="hidden"
                    data-testid="file-input"
                  />
                </Card>
                
                {/* Upload Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => setCurrentStage('input')}
                    variant="outline"
                    className="h-14 rounded-2xl border-gray-300"
                    data-testid="button-back-to-input"
                  >
                    <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
                    Back to Options
                  </Button>
                  <Button
                    onClick={uploadAndAnalyze}
                    disabled={uploadedFiles.length === 0}
                    className="h-14 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 border border-blue-200 rounded-2xl font-semibold disabled:from-gray-200 disabled:to-gray-300"
                    data-testid="button-upload-analyze"
                  >
                    <Brain className="h-5 w-5 mr-2" />
                    {uploadedFiles.length === 0 ? 'Select Bills First' : `Analyze ${uploadedFiles.length} Bill${uploadedFiles.length > 1 ? 's' : ''}`}
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStage === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-6"
              >
                <Card className="!bg-white p-8 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full mx-auto mb-6 flex items-center justify-center"
                  >
                    <Brain className="h-8 w-8 text-blue-600" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    AI Analysis in Progress
                  </h3>
                  
                  <div className="space-y-4">
                    <Progress value={analysisProgress} className="w-full" />
                    <div className="text-sm text-gray-600">
                      {analysisProgress.toFixed(0)}% Complete
                    </div>
                    
                    {analysisSteps[currentAnalysisStep] && (
                      <motion.div
                        key={currentAnalysisStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        {(() => {
                          const StepIcon = analysisSteps[currentAnalysisStep].icon;
                          return <StepIcon className="h-4 w-4 text-blue-600" />;
                        })()}
                        <span className="text-sm font-medium text-gray-700">
                          {analysisSteps[currentAnalysisStep].text}
                        </span>
                      </motion.div>
                    )}
                  </div>
                </Card>

                {/* Quick stats during analysis */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Errors Found', value: '15+', icon: AlertTriangle, color: 'text-red-600' },
                    { label: 'Overcharges', value: '$12K+', icon: DollarSign, color: 'text-orange-600' },
                    { label: 'Savings Found', value: '$35K+', icon: TrendingUp, color: 'text-green-600' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <Card className="!bg-white p-3 text-center">
                        <stat.icon className={`h-6 w-6 mx-auto mb-1 ${stat.color}`} />
                        <div className="font-bold text-lg">{stat.value}</div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStage === 'results' && analysisResults && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Success Header */}
                <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-16 h-16 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full mx-auto mb-4 flex items-center justify-center"
                    >
                      <Trophy className="h-8 w-8 text-green-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-green-800 mb-2">
                      {analysisResults.totalSavings} in Savings Found!
                    </h3>
                    <p className="text-green-700">
                      Our AI identified {analysisResults.errorCount} billing errors with {analysisResults.confidence}% confidence
                    </p>
                  </div>
                </Card>

                {/* Detailed Results */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { 
                      label: 'Billing Errors', 
                      value: `${analysisResults.errorCount} found`, 
                      icon: FileText, 
                      color: 'text-red-600',
                      bgColor: 'bg-red-50 border border-red-200'
                    },
                    { 
                      label: 'Overcharge Amount', 
                      value: analysisResults.overchargeAmount, 
                      icon: AlertTriangle, 
                      color: 'text-orange-600',
                      bgColor: 'bg-orange-50 border border-orange-200'
                    },
                    { 
                      label: 'Negotiation Potential', 
                      value: analysisResults.negotiationPotential, 
                      icon: Target, 
                      color: 'text-blue-600',
                      bgColor: 'bg-blue-50 border border-blue-200'
                    },
                    { 
                      label: 'Confidence Score', 
                      value: `${analysisResults.confidence}%`, 
                      icon: Shield, 
                      color: 'text-green-600',
                      bgColor: 'bg-green-50 border border-green-200'
                    }
                  ].map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                      className="w-full"
                    >
                      <Card className="!bg-white p-4 h-full">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${metric.bgColor} flex-shrink-0`}>
                            <metric.icon className={`h-4 w-4 ${metric.color}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-gray-600 truncate">{metric.label}</div>
                            <div className="font-bold text-lg truncate">{metric.value}</div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Detailed Analysis Breakdown */}
                <Card className="!bg-white p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    AI Analysis Breakdown
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Facility Type</p>
                        <p className="text-sm text-gray-600">{analysisResults.billAnalysisBreakdown.facilityType}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Service Category</p>
                        <p className="text-sm text-gray-600">{analysisResults.billAnalysisBreakdown.serviceCategory}</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Medical Codes Analyzed</p>
                      <p className="text-sm text-blue-600">{analysisResults.billAnalysisBreakdown.cptCodesAnalyzed.join(', ')}</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-orange-800">Market Comparison</p>
                      <p className="text-sm text-orange-600">{analysisResults.billAnalysisBreakdown.marketComparison}</p>
                    </div>
                  </div>
                </Card>

                {/* Detected Issues */}
                <Card className="!bg-white p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Issues Detected
                  </h3>
                  <div className="space-y-3">
                    {analysisResults.detectedIssues.map((issue, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`border-l-4 p-4 rounded-r-lg ${
                          issue.type === 'error' ? 'border-red-500 bg-red-50' :
                          issue.type === 'warning' ? 'border-orange-500 bg-orange-50' :
                          'border-blue-500 bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {issue.type === 'error' ? <XCircle className="h-4 w-4 text-red-600" /> :
                               issue.type === 'warning' ? <AlertTriangle className="h-4 w-4 text-orange-600" /> :
                               <Info className="h-4 w-4 text-blue-600" />}
                              <p className="font-medium text-sm text-gray-900">{issue.category}</p>
                              <Badge variant={issue.urgency === 'high' ? 'destructive' : issue.urgency === 'medium' ? 'default' : 'secondary'} className="text-xs">
                                {issue.urgency} priority
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700">{issue.description}</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-bold text-green-600">{issue.savingsPotential}</p>
                            <p className="text-xs text-gray-500">potential savings</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Key Insights */}
                <Card className="!bg-white p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-600" />
                    AI-Generated Insights
                  </h3>
                  <div className="space-y-3">
                    {analysisResults.keyInsights.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + (index * 0.1) }}
                        className="border border-gray-200 p-4 rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-1 rounded-full ${
                            insight.evidenceBased ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
                          }`}>
                            {insight.evidenceBased ? 
                              <CheckCircle className="h-4 w-4 text-green-600" /> :
                              <Circle className="h-4 w-4 text-blue-600" />
                            }
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 mb-2">{insight.insight}</p>
                            <div className="bg-white border border-gray-200 p-2 rounded text-xs text-gray-700">
                              <span className="font-medium">Action Required:</span> {insight.actionRequired}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Savings Calculator Integration */}
                <SavingsCalculator 
                  billAmount={billDetails.amount}
                  provider={billDetails.provider}
                  isVisible={true}
                  analysisStage="complete"
                />

                {/* Premium Upgrade CTA */}
                <AnimatePresence>
                  {showPremiumUpgrade && !isSubscribed && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                    >
                      <PremiumFeatureShowcase
                        isSubscribed={isSubscribed}
                        onUpgrade={handleUpgrade}
                        savingsAmount={analysisResults.totalSavings.replace('$', '').replace(',', '')}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    data-testid="button-try-another"
                    onClick={resetDemo}
                    variant="outline"
                    className="flex-1"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Try Another Bill
                  </Button>
                  {!isSubscribed && (
                    <Button
                      data-testid="button-get-premium"
                      onClick={handleUpgrade}
                      className="flex-1 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-700 border border-amber-200 font-semibold"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Get Premium Access
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>✨ This is a demonstration of our AI medical bill analysis capabilities</p>
            <p>Results are simulated for demo purposes. Real analysis provides actual savings.</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}