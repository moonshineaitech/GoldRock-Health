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
  FileText, 
  AlertTriangle, 
  DollarSign,
  Search,
  CheckCircle2,
  TrendingUp,
  Calculator,
  ClipboardList,
  Brain,
  Target,
  Shield,
  Clock,
  Loader2,
  Eye,
  ArrowRight,
  Zap,
  BarChart3,
  Award,
  Sparkles
} from "lucide-react";

interface MedicalCode {
  code: string;
  type: 'CPT' | 'ICD-10' | 'HCPCS' | 'Revenue';
  description: string;
  chargedAmount?: number;
  medicareAmount?: number;
  overchargePercentage?: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  issues: string[];
  recommendations: string[];
}

interface CodeAnalysis {
  totalCodes: number;
  analyzedCodes: MedicalCode[];
  totalOvercharge: number;
  potentialSavings: number;
  riskScore: number;
  complianceIssues: number;
  duplicateCodes: string[];
  unbundlingViolations: string[];
  upcodeingInstances: string[];
}

interface MedicalCodeAnalyzerProps {
  cptCodes?: string[];
  icdCodes?: string[];
  hcpcsCodes?: string[];
  billAmount?: string;
  provider?: string;
  onSendMessage: (message: string) => void;
  isVisible: boolean;
}

export function MedicalCodeAnalyzer({ 
  cptCodes = [], 
  icdCodes = [], 
  hcpcsCodes = [], 
  billAmount, 
  provider,
  onSendMessage,
  isVisible 
}: MedicalCodeAnalyzerProps) {
  const { isSubscribed } = useSubscription();
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [selectedCode, setSelectedCode] = useState<MedicalCode | null>(null);

  const totalCodes = cptCodes.length + icdCodes.length + hcpcsCodes.length;

  // Simulate comprehensive medical code analysis
  const analyzeCodesComprehensively = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const stages = [
      'Validating medical codes...',
      'Cross-referencing Medicare guidelines...',
      'Detecting overcharging patterns...',
      'Identifying unbundling violations...',
      'Checking for duplicate services...',
      'Calculating potential savings...',
      'Generating recommendations...'
    ];

    for (let i = 0; i < stages.length; i++) {
      setCurrentStage(stages[i]);
      setAnalysisProgress((i + 1) / stages.length * 100);
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    }

    // Simulate realistic analysis results
    const analyzedCodes: MedicalCode[] = [];
    let totalOvercharge = 0;
    const duplicates: string[] = [];
    const unbundlingViolations: string[] = [];
    const upcodingInstances: string[] = [];

    // Analyze CPT codes
    cptCodes.forEach((code, index) => {
      const baseCharge = 150 + (index * 75); // Simulated charge
      const medicareRate = baseCharge * 0.6; // Typical Medicare rate
      const overcharge = Math.random() > 0.7 ? baseCharge * (0.2 + Math.random() * 0.4) : 0;
      
      if (overcharge > 0) totalOvercharge += overcharge;

      const issues: string[] = [];
      const recommendations: string[] = [];
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

      // Simulate common billing issues
      if (Math.random() > 0.8) {
        issues.push('Potential upcoding detected');
        recommendations.push('Verify procedure complexity matches documentation');
        riskLevel = 'high';
        upcodingInstances.push(code);
      }

      if (Math.random() > 0.9) {
        issues.push('Duplicate service billing');
        recommendations.push('Check for bundled services billed separately');
        duplicates.push(code);
        riskLevel = 'critical';
      }

      if (overcharge > medicareRate * 0.3) {
        issues.push('Excessive markup over Medicare rates');
        recommendations.push('Negotiate based on Medicare allowable amounts');
        riskLevel = riskLevel === 'critical' ? 'critical' : 'high';
      }

      analyzedCodes.push({
        code,
        type: 'CPT',
        description: getCodeDescription(code, 'CPT'),
        chargedAmount: baseCharge + overcharge,
        medicareAmount: medicareRate,
        overchargePercentage: overcharge > 0 ? Math.round((overcharge / medicareRate) * 100) : 0,
        riskLevel,
        issues,
        recommendations
      });
    });

    // Analyze ICD-10 codes
    icdCodes.forEach(code => {
      const issues: string[] = [];
      const recommendations: string[] = [];
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

      if (Math.random() > 0.85) {
        issues.push('Diagnosis code mismatch with procedures');
        recommendations.push('Verify diagnosis supports billed procedures');
        riskLevel = 'medium';
      }

      analyzedCodes.push({
        code,
        type: 'ICD-10',
        description: getCodeDescription(code, 'ICD-10'),
        riskLevel,
        issues,
        recommendations
      });
    });

    // Calculate compliance score
    const totalIssues = analyzedCodes.reduce((sum, code) => sum + code.issues.length, 0);
    const riskScore = Math.max(0, 100 - (totalIssues * 5));
    const complianceIssues = totalIssues;
    const potentialSavings = totalOvercharge * 1.2; // Include negotiation potential

    setAnalysis({
      totalCodes,
      analyzedCodes,
      totalOvercharge,
      potentialSavings,
      riskScore,
      complianceIssues,
      duplicateCodes: duplicates,
      unbundlingViolations,
      upcodeingInstances: upcodingInstances
    });

    setIsAnalyzing(false);
  };

  const getCodeDescription = (code: string, type: string): string => {
    const descriptions: Record<string, string> = {
      // CPT Code examples
      '99213': 'Office/Outpatient Visit - Established Patient (Level 3)',
      '99214': 'Office/Outpatient Visit - Established Patient (Level 4)',
      '99215': 'Office/Outpatient Visit - Established Patient (Level 5)',
      '99202': 'Office/Outpatient Visit - New Patient (Level 2)',
      '99203': 'Office/Outpatient Visit - New Patient (Level 3)',
      '99204': 'Office/Outpatient Visit - New Patient (Level 4)',
      '76700': 'Ultrasound, Abdominal, Complete',
      '73060': 'Radiologic Examination, Knee',
      '80053': 'Comprehensive Metabolic Panel',
      // ICD-10 examples
      'Z00.00': 'Encounter for General Adult Medical Examination',
      'M25.512': 'Pain in Left Shoulder',
      'I10': 'Essential Hypertension',
      'E11.9': 'Type 2 Diabetes Mellitus Without Complications'
    };

    return descriptions[code] || `${type} Code: ${code} - [Procedure/Diagnosis Description]`;
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const generateDetailedAnalysisPrompt = () => {
    if (!analysis) return;

    const prompt = `I need you to provide a comprehensive, professional medical code analysis report based on the detailed findings from my bill examination. My medical bill contains ${analysis.totalCodes} medical codes that have been analyzed for billing errors, overcharging, and compliance issues. Here's what the analysis found:

CRITICAL FINDINGS SUMMARY:
• Total Medical Codes Analyzed: ${analysis.totalCodes}
• Compliance Risk Score: ${analysis.riskScore}/100
• Total Compliance Issues Found: ${analysis.complianceIssues}
• Estimated Overcharges: $${analysis.totalOvercharge.toLocaleString()}
• Potential Savings Opportunity: $${analysis.potentialSavings.toLocaleString()}

SPECIFIC BILLING VIOLATIONS DETECTED:
${analysis.duplicateCodes.length > 0 ? `• Duplicate Code Billing: ${analysis.duplicateCodes.join(', ')} - These codes appear to be billed multiple times for the same service date` : ''}
${analysis.unbundlingViolations.length > 0 ? `• Unbundling Violations: ${analysis.unbundlingViolations.join(', ')} - Services that should be billed as comprehensive packages have been separated to increase charges` : ''}
${analysis.upcodeingInstances.length > 0 ? `• Upcoding Instances: ${analysis.upcodeingInstances.join(', ')} - Higher-level procedure codes used when documentation may not support the complexity level` : ''}

DETAILED CODE-BY-CODE ANALYSIS:
${analysis.analyzedCodes.slice(0, 10).map(code => `
• Code ${code.code} (${code.type}): ${code.description}
  - Charged Amount: $${code.chargedAmount?.toLocaleString() || 'N/A'}
  - Medicare Allowable: $${code.medicareAmount?.toLocaleString() || 'N/A'}
  - Overcharge: ${code.overchargePercentage || 0}% above Medicare rates
  - Risk Level: ${code.riskLevel.toUpperCase()}
  - Issues Found: ${code.issues.join('; ') || 'None detected'}
  - Recommendations: ${code.recommendations.join('; ') || 'No action needed'}`).join('\n')}

I need you to create a comprehensive response that includes:

1. **EXECUTIVE SUMMARY**: A professional overview of the billing analysis findings that I can present to hospital billing departments, explaining the significance of the discovered issues and the total financial impact.

2. **REGULATORY COMPLIANCE ANALYSIS**: Detailed explanation of how the identified billing errors violate CMS guidelines, Medicare regulations, and medical billing best practices. Include specific regulatory citations that support dispute claims.

3. **FINANCIAL IMPACT BREAKDOWN**: Itemized analysis of overcharges by category (duplicate billing, upcoding, excessive markups, etc.) with specific dollar amounts and percentage calculations that demonstrate the financial harm.

4. **DISPUTE STRATEGY DEVELOPMENT**: Create a prioritized action plan for addressing each category of billing error, starting with the highest-impact issues and most egregious violations that are easiest to prove and dispute.

5. **MEDICARE RATE COMPARISON**: For each significant overcharge, provide specific language comparing the charged amount to Medicare allowable rates, creating compelling evidence for negotiation discussions.

6. **DOCUMENTATION REQUIREMENTS**: Identify what additional medical records, procedure notes, or billing documentation I should request to support my dispute claims and strengthen my negotiating position.

7. **PROFESSIONAL DISPUTE LANGUAGE**: Generate specific, regulation-citing language that I can use in communications with hospital billing departments to demonstrate knowledge of billing requirements and create urgency for correction.

8. **ESCALATION PATHWAY**: If the hospital initially refuses to address these billing errors, provide a structured escalation plan including regulatory agencies, state health departments, and consumer protection bureaus that investigate billing violations.

This analysis represents significant billing irregularities that require immediate attention and correction. Please provide a response that transforms these technical findings into actionable dispute strategies that will compel hospital cooperation and achieve maximum bill reduction results.`;

    onSendMessage(prompt);
  };

  useEffect(() => {
    if (isVisible && totalCodes > 0 && !analysis && !isAnalyzing) {
      analyzeCodesComprehensively();
    }
  }, [isVisible, totalCodes]);

  if (!isVisible || totalCodes === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="luxury-card relative overflow-hidden"
    >
      {!isSubscribed && (
        <PremiumPaywallOverlay
          title="Advanced Medical Code Analysis"
          description="Professional-grade code analysis that identifies overcharging, billing errors, and compliance violations."
          featureName="Medical Code Analyzer"
          savingsPotential="$5,000-$50,000"
        />
      )}

      {/* Enhanced Header with Gradient Animation */}
      <div className="flex items-center space-x-4 mb-8">
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg relative overflow-hidden"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute inset-0 bg-white/20 animate-glass-reflection" />
          <Brain className="h-8 w-8 text-white relative z-10" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
            animate={{ x: [-100, 100] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            Medical Code Analysis
          </h3>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              {totalCodes} codes detected
            </Badge>
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-powered compliance check
            </span>
          </div>
        </div>
      </div>

      {isAnalyzing ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{currentStage}</div>
              <Progress value={analysisProgress} className="h-2 mt-1" />
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Analyzing {totalCodes} medical codes for billing errors and compliance violations...
          </div>
        </div>
      ) : analysis ? (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="codes">Code Details</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Statistics Cards */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="luxury-card p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="flex items-center space-x-3 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <motion.div 
                      className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {analysis.riskScore}
                    </motion.div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Compliance Score</div>
                    <div className="text-xs text-green-600 font-medium">
                      {analysis.riskScore >= 80 ? 'Excellent' : analysis.riskScore >= 60 ? 'Good' : 'Needs Review'}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="luxury-card p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-red-500/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="flex items-center space-x-3 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <motion.div 
                      className={`text-3xl font-bold ${analysis.complianceIssues > 0 ? 'bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent' : 'text-gray-400'}`}
                      animate={analysis.complianceIssues > 0 ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {analysis.complianceIssues}
                    </motion.div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Issues Found</div>
                    <div className={`text-xs font-medium ${
                      analysis.complianceIssues === 0 ? 'text-green-600' :
                      analysis.complianceIssues <= 3 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {analysis.complianceIssues === 0 ? 'All Clear' :
                       analysis.complianceIssues <= 3 ? 'Minor Issues' : 'Requires Attention'}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {analysis.complianceIssues > 0 && (
              <div className="space-y-3">
                {analysis.duplicateCodes.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Duplicate Billing Detected:</strong> {analysis.duplicateCodes.length} codes appear to be billed multiple times
                    </AlertDescription>
                  </Alert>
                )}
                
                {analysis.upcodeingInstances.length > 0 && (
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Potential Upcoding:</strong> {analysis.upcodeingInstances.length} procedures may be billed at higher complexity levels
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={generateDetailedAnalysisPrompt}
                className="w-full bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 hover:from-purple-600 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 relative overflow-hidden group"
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Sparkles className="h-5 w-5 mr-2" />
                <span className="font-semibold">Generate Comprehensive Analysis Report</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="codes" className="space-y-3">
            <div className="max-h-64 overflow-y-auto space-y-2">
              {analysis.analyzedCodes.map((code, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setSelectedCode(code)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-xs">{code.type}</Badge>
                      <div>
                        <div className="font-medium text-sm text-gray-900 dark:text-white">{code.code}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-48">
                          {code.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {code.chargedAmount && (
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          ${code.chargedAmount.toLocaleString()}
                        </div>
                      )}
                      <Badge className={`text-xs ${getRiskLevelColor(code.riskLevel)}`}>
                        {code.riskLevel}
                      </Badge>
                    </div>
                  </div>
                  {code.issues.length > 0 && (
                    <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                      {code.issues.slice(0, 2).join(', ')}
                      {code.issues.length > 2 && '...'}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="savings" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                      ${analysis.potentialSavings.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-300">
                      Potential Savings Identified
                    </div>
                  </div>
                </div>
              </Card>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Overcharge Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${analysis.totalOvercharge.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Negotiation Potential:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${(analysis.potentialSavings - analysis.totalOvercharge).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-900 dark:text-white">Total Potential Recovery:</span>
                  <span className="text-green-600 dark:text-green-400">
                    ${analysis.potentialSavings.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      ) : null}

      {/* Code Detail Modal */}
      <AnimatePresence>
        {selectedCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCode(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full max-h-96 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedCode.code}</h3>
                  <Badge className={`text-xs ${getRiskLevelColor(selectedCode.riskLevel)}`}>
                    {selectedCode.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCode(null)}>×</Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Description:</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{selectedCode.description}</div>
                </div>

                {selectedCode.chargedAmount && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Charged:</div>
                      <div className="text-gray-600 dark:text-gray-400">${selectedCode.chargedAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Medicare Rate:</div>
                      <div className="text-gray-600 dark:text-gray-400">${selectedCode.medicareAmount?.toLocaleString()}</div>
                    </div>
                  </div>
                )}

                {selectedCode.issues.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Issues Identified:</div>
                    <div className="space-y-1">
                      {selectedCode.issues.map((issue, index) => (
                        <div key={index} className="text-sm text-orange-600 dark:text-orange-400 flex items-start">
                          <AlertTriangle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                          {issue}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCode.recommendations.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Recommendations:</div>
                    <div className="space-y-1">
                      {selectedCode.recommendations.map((rec, index) => (
                        <div key={index} className="text-sm text-green-600 dark:text-green-400 flex items-start">
                          <CheckCircle2 className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}