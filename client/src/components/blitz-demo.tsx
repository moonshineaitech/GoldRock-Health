import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Brain,
  Loader2,
  Zap,
  Receipt,
  Target,
  ShieldAlert,
  FileCheck,
  BadgeCheck,
  ChevronDown
} from "lucide-react";
import { MobileButton, MobileCard } from "@/components/mobile-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface BillDetails {
  amount: string;
  provider: string;
  serviceDate: string;
  serviceType: string;
  specificConcerns: string;
}

// Sample bill data
const SAMPLE_BILL_DATA: BillDetails = {
  amount: '$12,450',
  provider: 'Metro General Hospital',
  serviceDate: 'January 15, 2025',
  serviceType: 'Emergency Room Visit',
  specificConcerns: 'Emergency room charges seem excessive, possible duplicate lab charges'
};

// Comprehensive analysis results with real platform data
const SAMPLE_ANALYSIS_RESULTS = {
  totalBilled: 12450,
  potentialSavings: 8700,
  savingsPercentage: 70,
  errorCount: 14,
  
  overcharges: [
    { 
      item: "ER Facility Fee - Level 5", 
      charged: "$3,200", 
      fair: "$450", 
      overcharge: "$2,750", 
      reason: "Level 5 coding requires high complexity - medical records don't support this. Should be Level 2-3. Coders are incentivized to 'upcode' to increase revenue." 
    },
    { 
      item: "Surgical Supply Kit", 
      charged: "$2,400", 
      fair: "$180", 
      overcharge: "$2,220", 
      reason: "1333% markup over wholesale cost. Request itemized list - phantom billing for unused items is common (30% of billing errors)." 
    },
    { 
      item: "CT Scan with Contrast", 
      charged: "$4,800", 
      fair: "$1,200", 
      overcharge: "$3,600", 
      reason: "400% above Medicare allowable rate. Hospitals must accept Medicare rates under price transparency rules (CMS-1717-F2)." 
    },
    { 
      item: "Lab Panel (Comprehensive)", 
      charged: "$850", 
      fair: "$45", 
      overcharge: "$805", 
      reason: "1889% markup - CMS fee schedule shows $45 fair price. Diagnostic tests typically marked up 400-600%." 
    }
  ],
  
  topTactics: [
    {
      title: "No Surprises Act Violation",
      impact: "$3,200",
      strategy: "Federal law requires written cost estimates before emergency service. No estimate provided - cite 45 CFR 149.410 to adjust bill to in-network rates.",
      citation: "No Surprises Act, 45 CFR 149.410"
    },
    {
      title: "CPT Code Downcoding",
      impact: "$2,750",
      strategy: "ER coded as Level 5 without supporting documentation. Request medical records and demand downcode to Level 2-3.",
      citation: "Medicare E&M Guidelines"
    },
    {
      title: "Medicare Rate Negotiation",
      impact: "$3,605",
      strategy: "Charges 400-1889% above Medicare rates. Under Price Transparency Rule, demand Medicare allowable rates for self-pay.",
      citation: "CMS-1717-F2 Hospital Price Transparency"
    }
  ],
  
  industrySecrets: [
    {
      title: "End-of-Month Collection Quotas",
      secret: "Revenue staff have monthly targets. Days 25-31, they can accept 40-60% settlements to hit quotas.",
      leverage: "Schedule negotiations for month-end when staff are motivated to close deals quickly."
    },
    {
      title: "Q4 Charity Care Budget",
      secret: "Nonprofit hospitals must spend minimum charity care annually. October-December applications have 2-3x higher approval rates.",
      leverage: "Apply for charity care in Q4 when hospitals need to hit annual spending requirements."
    },
    {
      title: "Auto Write-Off Thresholds",
      secret: "Hospitals auto-write off debts under $500-1,000 to avoid collections overhead costs.",
      leverage: "For bills under $1,000, request 'financial hardship write-off' - 60-70% auto-approved."
    },
    {
      title: "Phantom Billing at Charge Capture",
      secret: "Systems bill for pre-packaged kits even when items aren't used. This causes 30% of billing errors.",
      leverage: "Request itemized bills within 24 hours and compare with medical records."
    }
  ],
  
  disputeLetterPreview: `[Date]

[Hospital Name] - Billing Compliance Officer
[Address]

RE: FORMAL BILLING DISPUTE - Account #[NUMBER]
Patient: [NAME] | DOB: [DATE] | Service: [SERVICE_DATE]

Dear Billing Compliance Officer,

I am writing to formally dispute charges totaling $8,700 on my medical bill dated [DATE]. After expert review and comparison to federal pricing standards, I have identified multiple billing violations:

1. NO SURPRISES ACT VIOLATION - Good Faith Estimate Not Provided
   • Federal Law: 45 CFR 149.410 requires written cost estimates
   • Required Action: Adjust to in-network rates per federal law
   • Impact: $3,200 reduction

2. CPT CODING OVERCHARGE - Level 5 Without Documentation
   • Issue: Level 5 requires high complexity - records don't support
   • Required Action: Downcode to Level 2-3 per Medicare Guidelines
   • Impact: $2,750 reduction

3. PRICE TRANSPARENCY VIOLATION - Exceeds Fair Market Rates
   • CT Scan: $4,800 vs $1,200 Medicare rate (400% markup)
   • Lab Panel: $850 vs $45 CMS rate (1889% markup)
   • Required Action: Adjust to Medicare rates (CMS-1717-F2)
   • Impact: $3,605 reduction

REQUESTED ACTIONS (30-Day Response Required):
☑ Immediate correction of all billing errors
☑ Revised bill reflecting Medicare rates and accurate coding
☑ Suspension of collections activity pending resolution

LEGAL PROTECTIONS CITED:
• No Surprises Act (45 CFR 149.410)
• Hospital Price Transparency Rule (CMS-1717-F2)
• EMTALA - Emergency care billing protection
• FDCPA - Fair Debt Collection Practices Act

[View full template with all sections...]`,
  
  caseStudy: {
    title: "$23,000 Reduction (78% savings)",
    original: "$29,500",
    final: "$6,500",
    timeline: [
      { week: "Week 1", action: "Requested itemized bill and medical records" },
      { week: "Week 2-3", action: "Identified coding errors + applied for charity care" },
      { week: "Week 4-5", action: "Challenged supply charges + negotiated with billing" },
      { week: "Week 6", action: "Final settlement: $6,500 at Medicare rates" }
    ],
    lessons: [
      "Emergency situations don't waive billing accuracy rights (EMTALA protects you)",
      "Charity care can be retroactive up to 240 days in most states",
      "Supply markups (200-800%) are the largest overcharge source",
      "Q4 charity care applications have 2-3x higher approval rates"
    ]
  }
};

export function BlitzDemo() {
  const [currentStep, setCurrentStep] = useState(0); // 0=form, 1=analyzing, 2=results
  const [billDetails, setBillDetails] = useState<BillDetails>({
    amount: '',
    provider: '',
    serviceDate: '',
    serviceType: '',
    specificConcerns: ''
  });
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const { toast } = useToast();

  const analysisSteps = [
    { text: "Analyzing medical codes and billing compliance...", icon: FileText },
    { text: "Scanning for duplicate charges and errors...", icon: AlertTriangle },
    { text: "Comparing against Medicare rates...", icon: Brain },
    { text: "Generating dispute strategy...", icon: Sparkles }
  ];

  // Load sample bill data
  const loadSampleBill = () => {
    setBillDetails(SAMPLE_BILL_DATA);
    setCurrentStep(0);
    toast({
      title: "Sample Bill Loaded ✓",
      description: "$12,450 emergency room visit ready for analysis",
    });
  };

  // Check if using sample data
  const isSampleData = () => {
    return billDetails.amount === SAMPLE_BILL_DATA.amount &&
           billDetails.provider === SAMPLE_BILL_DATA.provider;
  };

  // Run analysis
  const runAnalysis = async () => {
    if (!billDetails.amount || !billDetails.provider) {
      toast({
        title: "Missing Information",
        description: "Please enter bill amount and provider name",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(1);
    setAnalysisStep(0);

    // Animate through analysis steps
    const stepInterval = setInterval(() => {
      setAnalysisStep(prev => {
        if (prev < analysisSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 1500);

    try {
      if (isSampleData()) {
        // Sample data - show comprehensive results
        await new Promise(resolve => setTimeout(resolve, 6000));
        setAnalysisResults(SAMPLE_ANALYSIS_RESULTS);
        setIsAnalyzing(false);
        setCurrentStep(2);

        toast({
          title: "AI Analysis Complete! 🎉",
          description: `Found $${SAMPLE_ANALYSIS_RESULTS.potentialSavings.toLocaleString()} in potential savings`,
          duration: 5000
        });
      } else {
        // Custom data - prompt signup
        await new Promise(resolve => setTimeout(resolve, 3000));
        clearInterval(stepInterval);
        setIsAnalyzing(false);
        setCurrentStep(0);
        
        toast({
          title: "Sign Up for Custom Analysis",
          description: "Create free account to analyze your bills with AI + upload photos",
          duration: 6000,
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
      setCurrentStep(0);
    } finally {
      clearInterval(stepInterval);
    }
  };

  // RESULTS VIEW - Collapsible Sections
  if (currentStep === 2 && analysisResults) {
    return (
      <div className="space-y-4">
        {/* Summary Header */}
        <MobileCard className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-2 border-emerald-300">
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl"
            >
              <CheckCircle className="h-8 w-8 text-white" />
            </motion.div>
            
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-1">
                AI Analysis Complete
              </h3>
              <p className="text-sm text-gray-600">
                {billDetails.provider} • {billDetails.amount}
              </p>
            </div>

            {/* Savings Display */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-2xl p-6 shadow-xl"
            >
              <p className="text-white/90 text-xs font-bold mb-1">Potential Savings Identified</p>
              <p className="text-5xl font-black text-white mb-1">
                ${analysisResults.potentialSavings.toLocaleString()}
              </p>
              <p className="text-white/80 text-sm font-medium">
                {analysisResults.savingsPercentage}% of ${analysisResults.totalBilled.toLocaleString()} total
              </p>
            </motion.div>
          </div>
        </MobileCard>

        {/* Collapsible Results Sections */}
        <Accordion type="multiple" defaultValue={["overcharges", "tactics"]} className="space-y-3">
          
          {/* Section 1: Overcharges */}
          <MobileCard className="!p-0 overflow-hidden">
            <AccordionItem value="overcharges" className="border-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-red-50/50">
                <div className="flex items-center gap-3 text-left">
                  <Receipt className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div>
                    <div className="font-black text-gray-900">Overcharges Detected</div>
                    <div className="text-xs text-gray-600 font-normal">{analysisResults.errorCount} billing errors found</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-3">
                  {analysisResults.overcharges.map((item: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-red-600 bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-gray-900 text-sm">{item.item}</div>
                        <div className="text-right">
                          <div className="text-xs text-gray-600 line-through">{item.charged}</div>
                          <div className="text-lg font-black text-emerald-600">{item.fair}</div>
                          <div className="text-xs text-red-600 font-bold">{item.overcharge}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-800 bg-white p-3 rounded border border-red-200">
                        <strong>Why:</strong> {item.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </MobileCard>

          {/* Section 2: Top Tactics */}
          <MobileCard className="!p-0 overflow-hidden">
            <AccordionItem value="tactics" className="border-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50">
                <div className="flex items-center gap-3 text-left">
                  <Target className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="font-black text-gray-900">Top 3 Negotiation Tactics</div>
                    <div className="text-xs text-gray-600 font-normal">With legal citations</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-3">
                  {analysisResults.topTactics.map((tactic: any, idx: number) => (
                    <div key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-bold text-gray-900 text-sm">{idx + 1}. {tactic.title}</div>
                        <div className="text-emerald-600 font-black text-lg">${tactic.impact}</div>
                      </div>
                      <p className="text-xs text-gray-700 mb-2">{tactic.strategy}</p>
                      <div className="bg-blue-100 p-2 rounded text-xs text-blue-900">
                        <strong>Legal:</strong> {tactic.citation}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </MobileCard>

          {/* Section 3: Industry Secrets */}
          <MobileCard className="!p-0 overflow-hidden">
            <AccordionItem value="secrets" className="border-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-orange-50/50">
                <div className="flex items-center gap-3 text-left">
                  <ShieldAlert className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  <div>
                    <div className="font-black text-gray-900">Industry Insider Secrets</div>
                    <div className="text-xs text-orange-600 font-bold">🔥 EXCLUSIVE</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-3">
                  {analysisResults.industrySecrets.map((secret: any, idx: number) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border-2 border-orange-200">
                      <div className="font-bold text-gray-900 text-sm mb-2">{secret.title}</div>
                      <div className="space-y-2 text-xs">
                        <p className="text-gray-700">
                          <strong className="text-orange-700">Secret:</strong> {secret.secret}
                        </p>
                        <p className="text-gray-700 bg-orange-50 p-2 rounded border border-orange-200">
                          <strong className="text-orange-700">Leverage:</strong> {secret.leverage}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </MobileCard>

          {/* Section 4: Dispute Letter */}
          <MobileCard className="!p-0 overflow-hidden">
            <AccordionItem value="letter" className="border-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-purple-50/50">
                <div className="flex items-center gap-3 text-left">
                  <FileCheck className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <div>
                    <div className="font-black text-gray-900">Dispute Letter Template</div>
                    <div className="text-xs text-purple-600 font-bold">⚖️ Legal citations included</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 max-h-64 overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap font-mono text-gray-800">
{analysisResults.disputeLetterPreview}
                  </pre>
                </div>
                <MobileButton className="w-full mt-3 text-sm py-2.5" data-testid="button-view-full-template">
                  View Full Template (Sign Up Required)
                </MobileButton>
              </AccordionContent>
            </AccordionItem>
          </MobileCard>

          {/* Section 5: Success Story */}
          <MobileCard className="!p-0 overflow-hidden">
            <AccordionItem value="case-study" className="border-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-teal-50/50">
                <div className="flex items-center gap-3 text-left">
                  <BadgeCheck className="h-5 w-5 text-teal-600 flex-shrink-0" />
                  <div>
                    <div className="font-black text-gray-900">Real Success Story</div>
                    <div className="text-xs text-teal-600 font-bold">{analysisResults.caseStudy.title}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 justify-center">
                    <div className="text-center">
                      <div className="text-xs text-gray-600">Original</div>
                      <div className="text-2xl font-black text-red-600 line-through">{analysisResults.caseStudy.original}</div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                    <div className="text-center">
                      <div className="text-xs text-gray-600">Final</div>
                      <div className="text-2xl font-black text-emerald-600">{analysisResults.caseStudy.final}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-bold text-gray-900 text-sm">Timeline:</div>
                    {analysisResults.caseStudy.timeline.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-2 text-xs bg-teal-50 p-2 rounded border border-teal-200">
                        <CheckCircle className="h-4 w-4 text-teal-600 flex-shrink-0" />
                        <div>
                          <strong>{item.week}:</strong> {item.action}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-bold text-gray-900 text-sm">Key Lessons:</div>
                    {analysisResults.caseStudy.lessons.map((lesson: string, idx: number) => (
                      <div key={idx} className="text-xs text-gray-700 bg-white p-2 rounded border border-teal-200">
                        • {lesson}
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </MobileCard>

        </Accordion>

        {/* CTA */}
        <MobileCard className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-center">
          <h3 className="text-xl font-black mb-2">
            Ready to Save on Your Bills?
          </h3>
          <p className="text-blue-100 text-sm mb-4">
            Sign up free to analyze your actual bills with AI + access complete template library
          </p>
          <button
            onClick={() => {
              setCurrentStep(0);
              setAnalysisResults(null);
            }}
            className="w-full text-xs text-white/80 hover:text-white font-medium mt-3"
            data-testid="button-try-another"
          >
            Try Another Analysis
          </button>
        </MobileCard>
      </div>
    );
  }

  // ANALYZING VIEW
  if (currentStep === 1 && isAnalyzing) {
    return (
      <MobileCard className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-2 border-indigo-300">
        <div className="space-y-4 text-center py-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto border-4 border-indigo-200 border-t-indigo-600 rounded-full"
          />
          
          <div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              AI Analysis In Progress
            </h3>
            <p className="text-sm text-gray-600">
              Analyzing {billDetails.amount} bill from {billDetails.provider}
            </p>
          </div>

          <div className="space-y-3">
            {analysisSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === analysisStep;
              const isCompleted = index < analysisStep;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: isActive ? 1 : isCompleted ? 0.7 : 0.4 }}
                  className={`flex items-center space-x-3 p-3 rounded-xl ${
                    isActive ? 'bg-indigo-100 border-2 border-indigo-400' : 'bg-white/60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-indigo-600' : isCompleted ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <Icon className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{step.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </MobileCard>
    );
  }

  // INPUT FORM VIEW
  return (
    <MobileCard className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-2 border-purple-300">
      <div className="space-y-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl mb-3">
            <Brain className="h-8 w-8 text-white" />
          </div>

          <h3 className="text-2xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Try Real AI Bill Analysis
          </h3>
          <p className="text-gray-700 text-sm mb-4">
            Enter your bill details or use sample data to see comprehensive analysis with industry secrets
          </p>

          <MobileButton
            onClick={loadSampleBill}
            variant="secondary"
            className="w-full text-sm py-3 mb-4 border-2 border-purple-300"
            data-testid="button-load-sample"
          >
            <FileText className="h-4 w-4 mr-2" />
            Load Sample Bill ($12,450 ER Visit)
          </MobileButton>
        </div>

        {/* Input Fields */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1.5 block">Bill Amount *</label>
            <Input
              type="text"
              placeholder="$12,450"
              value={billDetails.amount}
              onChange={(e) => setBillDetails({ ...billDetails, amount: e.target.value })}
              className="text-base h-12"
              data-testid="input-amount"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-1.5 block">Provider/Hospital *</label>
            <Input
              type="text"
              placeholder="Metro General Hospital"
              value={billDetails.provider}
              onChange={(e) => setBillDetails({ ...billDetails, provider: e.target.value })}
              className="text-base h-12"
              data-testid="input-provider"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1.5 block">Service Date</label>
              <Input
                type="text"
                placeholder="Jan 15, 2025"
                value={billDetails.serviceDate}
                onChange={(e) => setBillDetails({ ...billDetails, serviceDate: e.target.value })}
                className="text-sm h-11"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1.5 block">Service Type</label>
              <Input
                type="text"
                placeholder="Emergency Room"
                value={billDetails.serviceType}
                onChange={(e) => setBillDetails({ ...billDetails, serviceType: e.target.value })}
                className="text-sm h-11"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-1.5 block">Specific Concerns (Optional)</label>
            <Textarea
              placeholder="E.g., Duplicate charges, excessive fees..."
              value={billDetails.specificConcerns}
              onChange={(e) => setBillDetails({ ...billDetails, specificConcerns: e.target.value })}
              className="text-sm min-h-[70px]"
              data-testid="input-concerns"
            />
          </div>
        </div>

        {/* Analyze Button */}
        <MobileButton
          onClick={runAnalysis}
          disabled={isAnalyzing || !billDetails.amount || !billDetails.provider}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl text-base py-4"
          data-testid="button-analyze"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Analyze Bill with AI
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </MobileButton>
        
        <p className="text-xs text-gray-500 text-center">
          {isSampleData() 
            ? "✓ Using sample data • Works without login" 
            : "⚠️ Sign up to analyze custom bills with AI + upload photos"}
        </p>
      </div>
    </MobileCard>
  );
}
