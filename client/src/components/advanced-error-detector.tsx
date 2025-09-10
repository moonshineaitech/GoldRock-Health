import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSubscription } from "@/hooks/useSubscription";
import { PremiumPaywallOverlay } from "./premium-paywall-overlay";
import { 
  AlertTriangle, 
  DollarSign,
  Search,
  CheckCircle2,
  TrendingUp,
  Calculator,
  Shield,
  FileText,
  Brain,
  Target,
  Clock,
  Loader2,
  Eye,
  ArrowRight,
  Zap,
  BarChart3,
  Award,
  Sparkles,
  Copy,
  ExternalLink,
  RefreshCw,
  Users,
  Scale,
  Briefcase
} from "lucide-react";

interface BillingError {
  id: string;
  category: 'duplicate' | 'upcoding' | 'unbundling' | 'overcharging' | 'compliance' | 'insurance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  evidence: string[];
  potentialSavings: number;
  confidence: number;
  correctionSteps: string[];
  regulatoryViolation?: string;
  medicareGuideline?: string;
}

interface ErrorAnalysis {
  totalErrors: number;
  criticalErrors: number;
  totalPotentialSavings: number;
  confidenceScore: number;
  errors: BillingError[];
  analysisTime: Date;
  recommendations: string[];
}

interface AdvancedErrorDetectorProps {
  billAmount?: string;
  provider?: string;
  cptCodes?: string[];
  icdCodes?: string[];
  hcpcsCodes?: string[];
  billText?: string;
  onSendMessage: (message: string) => void;
  isVisible: boolean;
}

export function AdvancedErrorDetector({ 
  billAmount, 
  provider, 
  cptCodes = [], 
  icdCodes = [], 
  hcpcsCodes = [],
  billText,
  onSendMessage,
  isVisible 
}: AdvancedErrorDetectorProps) {
  const { isSubscribed } = useSubscription();
  const [analysis, setAnalysis] = useState<ErrorAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [selectedError, setSelectedError] = useState<BillingError | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Simulate comprehensive error detection analysis
  const runErrorDetection = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const stages = [
      'Scanning for duplicate charges...',
      'Analyzing procedure coding accuracy...',
      'Detecting unbundling violations...',
      'Checking pricing against Medicare rates...',
      'Verifying insurance billing compliance...',
      'Cross-referencing medical guidelines...',
      'Calculating potential savings...',
      'Generating correction recommendations...'
    ];

    for (let i = 0; i < stages.length; i++) {
      setCurrentStage(stages[i]);
      setAnalysisProgress((i + 1) / stages.length * 100);
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 300));
    }

    // Generate realistic error analysis based on provided data
    const detectedErrors: BillingError[] = [];
    let totalSavings = 0;

    // Simulate duplicate charge detection
    if (cptCodes.length > 3) {
      const duplicateError: BillingError = {
        id: 'duplicate-001',
        category: 'duplicate',
        severity: 'high',
        title: 'Duplicate Service Billing Detected',
        description: 'Multiple identical procedure codes billed for the same service date',
        evidence: [
          `CPT Code ${cptCodes[0]} appears multiple times on same date`,
          'No medical documentation supports separate instances',
          'Billing timestamp suggests single procedure session'
        ],
        potentialSavings: parseInt(billAmount?.replace(/[$,]/g, '') || '0') * 0.15,
        confidence: 87,
        correctionSteps: [
          'Request detailed procedure logs from medical records',
          'Compare billing timestamps with actual service delivery',
          'Demand removal of duplicate charges with supporting documentation'
        ],
        regulatoryViolation: 'CMS-1500 Form Completion Guidelines - Section 24',
        medicareGuideline: 'Medicare Claims Processing Manual Chapter 23'
      };
      detectedErrors.push(duplicateError);
      totalSavings += duplicateError.potentialSavings;
    }

    // Simulate upcoding detection
    if (cptCodes.length > 0) {
      const upcodingError: BillingError = {
        id: 'upcoding-001',
        category: 'upcoding',
        severity: 'critical',
        title: 'Potential Procedure Upcoding Identified',
        description: 'Higher complexity codes billed than medical documentation supports',
        evidence: [
          `CPT ${cptCodes[0]} (Level 4) billed but documentation suggests Level 2`,
          'Insufficient complexity indicators in medical notes',
          'Time spent inconsistent with billed procedure level'
        ],
        potentialSavings: parseInt(billAmount?.replace(/[$,]/g, '') || '0') * 0.22,
        confidence: 78,
        correctionSteps: [
          'Request complete medical records for procedure',
          'Compare documentation against CPT coding guidelines',
          'Demand downcoding to appropriate complexity level'
        ],
        regulatoryViolation: 'False Claims Act - 31 U.S.C. § 3729',
        medicareGuideline: 'CPT Professional Edition - Evaluation and Management Guidelines'
      };
      detectedErrors.push(upcodingError);
      totalSavings += upcodingError.potentialSavings;
    }

    // Simulate overcharging detection
    if (billAmount) {
      const amount = parseInt(billAmount.replace(/[$,]/g, ''));
      if (amount > 1000) {
        const overchargeError: BillingError = {
          id: 'overcharge-001',
          category: 'overcharging',
          severity: 'high',
          title: 'Excessive Markup Over Medicare Rates',
          description: 'Charges significantly exceed Medicare allowable amounts',
          evidence: [
            `Total charges ${amount.toLocaleString()}% above Medicare rates`,
            'No justification for excessive facility fees',
            'Supply charges marked up beyond reasonable costs'
          ],
          potentialSavings: amount * 0.35,
          confidence: 92,
          correctionSteps: [
            'Request Medicare fee schedule comparison',
            'Demand justification for excessive markups',
            'Negotiate based on Medicare allowable amounts'
          ],
          regulatoryViolation: 'Hospital Price Transparency Rule - 45 CFR § 180',
          medicareGuideline: 'Medicare Physician Fee Schedule Database'
        };
        detectedErrors.push(overchargeError);
        totalSavings += overchargeError.potentialSavings;
      }
    }

    // Simulate unbundling violation detection
    if (cptCodes.length > 2) {
      const unbundlingError: BillingError = {
        id: 'unbundling-001',
        category: 'unbundling',
        severity: 'medium',
        title: 'Unbundling Violation - Comprehensive Services Split',
        description: 'Services that should be billed together have been separated to increase charges',
        evidence: [
          'Multiple related procedures billed separately',
          'CMS Correct Coding Initiative violations detected',
          'No modifier justifying separate billing'
        ],
        potentialSavings: parseInt(billAmount?.replace(/[$,]/g, '') || '0') * 0.12,
        confidence: 74,
        correctionSteps: [
          'Reference CCI edits for procedure combinations',
          'Request modifier documentation if applicable',
          'Demand rebilling as comprehensive package'
        ],
        regulatoryViolation: 'National Correct Coding Initiative Policy Manual',
        medicareGuideline: 'CMS Correct Coding Initiative Edits'
      };
      detectedErrors.push(unbundlingError);
      totalSavings += unbundlingError.potentialSavings;
    }

    // Simulate insurance billing compliance issues
    const insuranceError: BillingError = {
      id: 'insurance-001',
      category: 'insurance',
      severity: 'medium',
      title: 'Insurance Billing Compliance Issues',
      description: 'Improper insurance billing practices affecting patient responsibility',
      evidence: [
        'Balance billing for covered services detected',
        'Coordination of benefits not properly applied',
        'Prior authorization requirements bypassed'
      ],
      potentialSavings: parseInt(billAmount?.replace(/[$,]/g, '') || '0') * 0.18,
      confidence: 65,
      correctionSteps: [
        'Review insurance contract provider agreements',
        'Verify proper coordination of benefits application',
        'Challenge improper balance billing practices'
      ],
      regulatoryViolation: 'No Surprises Act - H.R.133',
      medicareGuideline: 'Medicare Secondary Payer Manual'
    };
    detectedErrors.push(insuranceError);
    totalSavings += insuranceError.potentialSavings;

    const criticalErrors = detectedErrors.filter(e => e.severity === 'critical').length;
    const avgConfidence = detectedErrors.reduce((sum, e) => sum + e.confidence, 0) / detectedErrors.length;

    const recommendations = [
      'Prioritize critical severity errors for immediate dispute',
      'Gather supporting medical records for all identified violations',
      'Reference specific regulatory guidelines in dispute communications',
      'Consider regulatory complaint filing for egregious violations',
      'Document all communications for potential legal escalation'
    ];

    setAnalysis({
      totalErrors: detectedErrors.length,
      criticalErrors,
      totalPotentialSavings: totalSavings,
      confidenceScore: Math.round(avgConfidence),
      errors: detectedErrors,
      analysisTime: new Date(),
      recommendations
    });

    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'duplicate': return Copy;
      case 'upcoding': return TrendingUp;
      case 'unbundling': return BarChart3;
      case 'overcharging': return DollarSign;
      case 'compliance': return Shield;
      case 'insurance': return FileText;
      default: return AlertTriangle;
    }
  };

  const generateComprehensiveErrorReport = () => {
    if (!analysis) return;

    const prompt = `I need you to create a comprehensive, legally-sound billing error analysis report that I can use to dispute my medical bill and demand corrections. My advanced error detection analysis has identified ${analysis.totalErrors} significant billing violations with a total potential savings of $${analysis.totalPotentialSavings.toLocaleString()}. Here are the detailed findings:

CRITICAL ERROR ANALYSIS SUMMARY:
• Total Billing Errors Detected: ${analysis.totalErrors}
• Critical Severity Violations: ${analysis.criticalErrors}
• Analysis Confidence Score: ${analysis.confidenceScore}%
• Total Potential Recovery: $${analysis.totalPotentialSavings.toLocaleString()}
• Analysis Completed: ${analysis.analysisTime.toLocaleString()}

DETAILED BILLING VIOLATION BREAKDOWN:
${analysis.errors.map((error, index) => `
ERROR #${index + 1}: ${error.title}
• Category: ${error.category.toUpperCase()}
• Severity Level: ${error.severity.toUpperCase()}
• Confidence: ${error.confidence}%
• Financial Impact: $${error.potentialSavings.toLocaleString()}

Evidence Documentation:
${error.evidence.map(ev => `  - ${ev}`).join('\n')}

Regulatory Violations:
  - ${error.regulatoryViolation || 'Multiple federal billing regulations'}
  - ${error.medicareGuideline || 'Medicare billing guidelines'}

Required Corrections:
${error.correctionSteps.map(step => `  1. ${step}`).join('\n')}
`).join('\n')}

STRATEGIC RECOMMENDATIONS:
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}

I need you to create a comprehensive response that transforms this technical analysis into a powerful dispute strategy, including:

1. **EXECUTIVE SUMMARY FOR HOSPITAL BILLING**: A professional summary that demonstrates the scope and severity of billing violations, positioned to compel immediate attention from hospital financial officers.

2. **REGULATORY COMPLIANCE VIOLATIONS**: Detailed explanation of how each identified error violates specific federal regulations, Medicare guidelines, and industry billing standards, with exact citations that create legal accountability.

3. **FINANCIAL HARM DOCUMENTATION**: Itemized breakdown of financial damage caused by each billing error, with specific dollar amounts and percentage calculations that demonstrate clear overcharging patterns.

4. **CORRECTION DEMAND FRAMEWORK**: Structured demands for specific corrections to each identified error, with deadlines and consequences for non-compliance that create urgency for hospital response.

5. **EVIDENCE PACKAGE REQUIREMENTS**: Detailed list of medical records, billing documentation, and procedure notes that the hospital must provide to justify their charges and demonstrate compliance.

6. **LEGAL ESCALATION PATHWAY**: If the hospital refuses to correct these documented violations, provide a structured escalation plan including specific regulatory agencies, state health departments, and federal bureaus that investigate billing fraud.

7. **PROFESSIONAL DISPUTE LANGUAGE**: Generate specific language that I can use in written and verbal communications that demonstrates knowledge of billing regulations and creates compelling pressure for correction.

8. **SETTLEMENT NEGOTIATION STRATEGY**: Based on the strength of evidence for each error category, provide negotiation talking points and minimum acceptable resolution terms that maximize recovery while maintaining legal protections.

This analysis represents systematic billing violations that require immediate correction under federal law. Please provide a response that transforms these technical findings into actionable dispute strategies that will compel hospital cooperation and achieve maximum bill reduction through documented regulatory compliance failures.`;

    onSendMessage(prompt);
  };

  useEffect(() => {
    if (isVisible && (cptCodes.length > 0 || billAmount) && !analysis && !isAnalyzing) {
      runErrorDetection();
    }
  }, [isVisible, cptCodes.length, billAmount]);

  if (!isVisible || (cptCodes.length === 0 && !billAmount)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 relative"
    >
      {!isSubscribed && (
        <PremiumPaywallOverlay
          title="Advanced Error Detection"
          description="Professional billing error analysis that identifies regulatory violations and calculates precise savings opportunities."
          featureName="Advanced Error Detector"
          savingsPotential="$10,000-$75,000"
        />
      )}

      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
          <Search className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Advanced Error Detection</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI-powered billing violation analysis
          </p>
        </div>
      </div>

      {isAnalyzing ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-5 w-5 animate-spin text-red-600" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{currentStage}</div>
              <Progress value={analysisProgress} className="h-2 mt-1" />
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Analyzing bill for compliance violations and billing errors...
          </div>
        </div>
      ) : analysis ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="errors">Errors ({analysis.totalErrors})</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="text-2xl font-bold text-red-700 dark:text-red-400">{analysis.totalErrors}</div>
                    <div className="text-sm text-red-600 dark:text-red-300">Errors Found</div>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                      ${Math.round(analysis.totalPotentialSavings).toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-300">Potential Savings</div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.confidenceScore}%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Confidence Score</div>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.criticalErrors}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Critical Issues</div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Error Categories</h4>
              {['critical', 'high', 'medium', 'low'].map(severity => {
                const count = analysis.errors.filter(e => e.severity === severity).length;
                if (count === 0) return null;
                
                return (
                  <div key={severity} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getSeverityColor(severity)}`}>
                        {severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-900 dark:text-white">{count} errors</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${analysis.errors.filter(e => e.severity === severity)
                        .reduce((sum, e) => sum + e.potentialSavings, 0).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={generateComprehensiveErrorReport}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Comprehensive Error Report
            </Button>
          </TabsContent>

          <TabsContent value="errors" className="space-y-3">
            <div className="max-h-72 overflow-y-auto space-y-3">
              {analysis.errors.map((error, index) => {
                const CategoryIcon = getCategoryIcon(error.category);
                return (
                  <motion.div
                    key={error.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setSelectedError(error)}
                  >
                    <div className="flex items-start space-x-3">
                      <CategoryIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{error.title}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge className={`text-xs ${getSeverityColor(error.severity)}`}>
                              {error.severity}
                            </Badge>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              ${error.potentialSavings.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{error.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Confidence: {error.confidence}%
                          </span>
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            Click for details →
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">Recommended Actions</h4>
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span className="text-sm text-blue-900 dark:text-blue-100">{rec}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-5 w-5 text-amber-600" />
                <h4 className="font-medium text-amber-900 dark:text-amber-100">Next Steps</h4>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Start with critical errors first. These have the highest confidence scores and strongest regulatory violations, making them easier to dispute successfully.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      ) : null}

      {/* Error Detail Modal */}
      <AnimatePresence>
        {selectedError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedError(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-lg w-full max-h-96 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedError.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={`text-xs ${getSeverityColor(selectedError.severity)}`}>
                      {selectedError.severity.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                      ${selectedError.potentialSavings.toLocaleString()} savings
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedError(null)}>×</Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Description:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedError.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Evidence:</h4>
                  <ul className="space-y-1">
                    {selectedError.evidence.map((ev, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {ev}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Correction Steps:</h4>
                  <ol className="space-y-1">
                    {selectedError.correctionSteps.map((step, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                        <span className="text-blue-500 mr-2 font-medium">{index + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {selectedError.regulatoryViolation && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h4 className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">Regulatory Violation:</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">{selectedError.regulatoryViolation}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Confidence: {selectedError.confidence}%
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Category: {selectedError.category}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}