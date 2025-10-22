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
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { PremiumPaywallOverlay } from "./premium-paywall-overlay";
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Calculator, 
  Scale, 
  Crown, 
  Download, 
  Eye, 
  Target, 
  Brain, 
  Database, 
  Network, 
  Radar, 
  Zap, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  Building2, 
  Gavel, 
  PieChart, 
  LineChart, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Award, 
  Briefcase, 
  BookOpen, 
  Sparkles,
  CreditCard,
  TrendingDown,
  Percent,
  RefreshCw,
  Filter,
  Settings
} from "lucide-react";

interface SuperiorAnalysisToolsProps {
  onSendMessage: (message: string) => void;
}

// Professional-Grade Executive Bill Analysis Report
export function ExecutiveBillAnalysisReport({ onSendMessage }: SuperiorAnalysisToolsProps) {
  const { isSubscribed } = useSubscription();
  const [analysisData, setAnalysisData] = useState({
    billAmount: '',
    hospitalSystem: '',
    serviceType: '',
    patientAge: '',
    incomeLevel: '',
    regionCode: '',
    insuranceType: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateExecutiveReport = async () => {
    if (!analysisData.billAmount || !analysisData.hospitalSystem) {
      toast({
        title: "Missing Information",
        description: "Please provide bill amount and hospital system for executive analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    const prompt = `I need you to create a comprehensive EXECUTIVE BILL ANALYSIS REPORT suitable for presentation to hospital boards, legal teams, and C-suite executives. This must be professional-grade analysis that demonstrates sophisticated understanding of healthcare finance and regulatory compliance.

BILL ANALYSIS DATA:
- Total Bill Amount: $${analysisData.billAmount}
- Hospital System: ${analysisData.hospitalSystem}
- Service Type: ${analysisData.serviceType}
- Patient Demographics: Age ${analysisData.patientAge}, Income Level: ${analysisData.incomeLevel}
- Geographic Region: ${analysisData.regionCode}
- Insurance Coverage: ${analysisData.insuranceType}

Create a PROFESSIONAL EXECUTIVE ANALYSIS REPORT with the following structure:

**EXECUTIVE SUMMARY**
- Comprehensive financial impact assessment with projected savings potential
- Key findings summary with specific regulatory compliance concerns
- Strategic recommendations for immediate action by hospital administration
- Risk assessment for continued pursuit of current billing practices

**DETAILED FINANCIAL ANALYSIS**
- Charge master markup analysis using Medicare Cost Report data and regional benchmarking
- Cost-to-charge ratio calculations specific to this hospital system
- Regional price comparison analysis using Medicare Provider Data and market benchmarks
- Revenue cycle impact assessment and collection probability analysis

**REGULATORY COMPLIANCE ASSESSMENT**
- Federal billing regulation compliance review (EMTALA, Stark, Anti-Kickback)
- State hospital billing law compliance analysis
- CMS billing guidelines adherence review
- Joint Commission accreditation standards compliance check

**INDUSTRY BENCHMARKING ANALYSIS**
- Peer hospital pricing comparison for identical services
- Regional market rate analysis and competitive positioning
- Medicare/Medicaid reimbursement rate comparison
- Commercial payer rate comparison and contract performance analysis

**RISK MITIGATION STRATEGY**
- Potential regulatory investigation exposure assessment
- Patient satisfaction score impact analysis
- Media exposure risk evaluation and reputation management considerations
- Legal liability assessment for billing practices

**RECOMMENDED RESOLUTION STRATEGY**
- Phased bill reduction recommendation with financial justification
- Alternative payment plan structuring with NPV analysis
- Charity care program optimization recommendations
- Long-term patient retention and referral impact analysis

**IMPLEMENTATION TIMELINE**
- 30-60-90 day action plan for resolution
- Key performance indicators for tracking resolution success
- Executive accountability measures and progress reporting structure

Format this as a professional business report with clear section headers, specific dollar amounts, percentage calculations, and executive-level language that would be appropriate for presentation to hospital boards and C-suite executives. Include specific regulatory citations and industry benchmarks where applicable.`;

    onSendMessage(prompt);
    setIsGenerating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 relative"
    >
      {!isSubscribed && (
        <PremiumPaywallOverlay
          title="Executive Bill Analysis Report"
          description="Professional-grade financial analysis reports suitable for C-suite executives and hospital boards. Includes regulatory compliance assessment and strategic recommendations."
          featureName="Executive Reporting"
          savingsPotential="$25,000-$500,000+"
        />
      )}
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
          <Crown className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">Executive Bill Analysis Report</h3>
            <Badge className="bg-purple-600 text-white text-xs">
              C-Suite Grade
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Professional analysis for executives • Board-ready documentation</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Bill Amount *
            </label>
            <Input
              type="number"
              placeholder="150000"
              value={analysisData.billAmount}
              onChange={(e) => setAnalysisData({...analysisData, billAmount: e.target.value})}
              data-testid="input-bill-amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hospital System *
            </label>
            <Input
              placeholder="e.g., HCA Healthcare, Kaiser Permanente"
              value={analysisData.hospitalSystem}
              onChange={(e) => setAnalysisData({...analysisData, hospitalSystem: e.target.value})}
              data-testid="input-hospital-system"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Service Type
            </label>
            <Select value={analysisData.serviceType} onValueChange={(value) => setAnalysisData({...analysisData, serviceType: value})}>
              <SelectTrigger data-testid="select-service-type">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emergency">Emergency Care</SelectItem>
                <SelectItem value="surgery">Surgical Procedures</SelectItem>
                <SelectItem value="diagnostic">Diagnostic/Testing</SelectItem>
                <SelectItem value="cardiology">Cardiac Procedures</SelectItem>
                <SelectItem value="oncology">Cancer Treatment</SelectItem>
                <SelectItem value="maternity">Maternity Care</SelectItem>
                <SelectItem value="intensive">ICU/Critical Care</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurance Type
            </label>
            <Select value={analysisData.insuranceType} onValueChange={(value) => setAnalysisData({...analysisData, insuranceType: value})}>
              <SelectTrigger data-testid="select-insurance-type">
                <SelectValue placeholder="Select insurance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="commercial">Commercial Insurance</SelectItem>
                <SelectItem value="medicare">Medicare</SelectItem>
                <SelectItem value="medicaid">Medicaid</SelectItem>
                <SelectItem value="uninsured">Uninsured/Self-Pay</SelectItem>
                <SelectItem value="workers-comp">Workers' Compensation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Age
            </label>
            <Input
              type="number"
              placeholder="45"
              value={analysisData.patientAge}
              onChange={(e) => setAnalysisData({...analysisData, patientAge: e.target.value})}
              data-testid="input-patient-age"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Income Level
            </label>
            <Select value={analysisData.incomeLevel} onValueChange={(value) => setAnalysisData({...analysisData, incomeLevel: value})}>
              <SelectTrigger data-testid="select-income-level">
                <SelectValue placeholder="Income range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Below $35,000</SelectItem>
                <SelectItem value="middle-low">$35,000-$60,000</SelectItem>
                <SelectItem value="middle">$60,000-$100,000</SelectItem>
                <SelectItem value="upper-middle">$100,000-$200,000</SelectItem>
                <SelectItem value="high">Above $200,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Region Code
            </label>
            <Input
              placeholder="e.g., CA-SF, TX-HOU"
              value={analysisData.regionCode}
              onChange={(e) => setAnalysisData({...analysisData, regionCode: e.target.value})}
              data-testid="input-region-code"
            />
          </div>
        </div>

        <Button 
          onClick={generateExecutiveReport} 
          disabled={isGenerating} 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          data-testid="button-generate-executive-report"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating Executive Report...
            </>
          ) : (
            <>
              <Crown className="h-4 w-4 mr-2" />
              Generate Executive Analysis Report
            </>
          )}
        </Button>
      </div>

      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-semibold text-purple-800">Executive Report Features</span>
        </div>
        <div className="text-xs text-purple-700 space-y-1">
          <div>• Regulatory compliance assessment with specific citations</div>
          <div>• Financial impact analysis with industry benchmarking</div>
          <div>• Strategic recommendations for C-suite decision makers</div>
          <div>• Risk mitigation strategy with timeline and KPIs</div>
        </div>
      </div>
    </motion.div>
  );
}

// Advanced Financial Modeling Dashboard
export function AdvancedFinancialModeling({ onSendMessage }: SuperiorAnalysisToolsProps) {
  const { isSubscribed } = useSubscription();
  const [modelingData, setModelingData] = useState({
    currentBill: '',
    monthlyIncome: '',
    creditScore: '',
    existingDebt: '',
    liquidAssets: '',
    timeHorizon: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const runFinancialModeling = async () => {
    if (!modelingData.currentBill || !modelingData.monthlyIncome) {
      toast({
        title: "Missing Information",
        description: "Please provide bill amount and monthly income for financial modeling.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    const prompt = `I need you to create a COMPREHENSIVE FINANCIAL MODELING ANALYSIS for medical bill dispute strategy optimization. This should be a sophisticated financial analysis that includes predictive modeling, ROI calculations, and strategic decision-making support.

FINANCIAL MODELING INPUTS:
- Current Medical Bill: $${modelingData.currentBill}
- Monthly Income: $${modelingData.monthlyIncome}
- Credit Score: ${modelingData.creditScore}
- Existing Debt: $${modelingData.existingDebt}
- Liquid Assets: $${modelingData.liquidAssets}
- Planning Time Horizon: ${modelingData.timeHorizon}

Create a COMPREHENSIVE FINANCIAL MODELING REPORT with the following analysis:

**ROI ANALYSIS FOR BILL DISPUTE STRATEGIES**
- Cost-benefit analysis for each dispute approach (DIY vs. Professional vs. Legal)
- Time investment vs. potential savings calculations
- Probability-weighted expected value analysis for different strategies
- Break-even analysis for professional services vs. self-advocacy

**PAYMENT STRATEGY OPTIMIZATION**
- Mathematical optimization of payment plan structures
- Net present value (NPV) analysis of different payment options
- Cash flow impact modeling over various time horizons
- Opportunity cost analysis of different payment strategies

**CREDIT IMPACT MODELING**
- Credit score impact simulation for different resolution scenarios
- Long-term credit score recovery projections
- Cost of credit impact (higher interest rates, insurance premiums)
- Credit utilization optimization strategies during dispute process

**FINANCIAL STRESS TESTING**
- Worst-case scenario financial impact analysis
- Emergency fund adequacy assessment
- Income disruption scenario modeling
- Medical expense recurrence probability analysis

**TAX OPTIMIZATION STRATEGY**
- Medical expense deduction maximization calculations
- State and federal tax benefit optimization
- Charitable deduction strategies for settled amounts
- Business expense deductions if applicable

**SAVINGS PROJECTION MODELING**
- Monte Carlo simulation of dispute outcome probabilities
- Expected value calculations for different negotiation strategies
- Confidence intervals for savings projections
- Sensitivity analysis for key variables

**CASH FLOW OPTIMIZATION**
- Monthly cash flow impact analysis
- Liquidity preservation strategies
- Asset protection recommendations
- Emergency fund maintenance calculations

**STRATEGIC DECISION MATRIX**
- Multi-criteria decision analysis weighing all factors
- Risk-adjusted return calculations for each option
- Probability-weighted outcome scenarios
- Recommended strategy with financial justification

Include specific calculations, percentage returns, probability assessments, and detailed financial projections. Format as a professional financial analysis with charts, graphs, and quantitative models that would meet institutional investment committee standards.`;

    onSendMessage(prompt);
    setIsAnalyzing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 relative"
    >
      {!isSubscribed && (
        <PremiumPaywallOverlay
          title="Advanced Financial Modeling"
          description="Sophisticated financial analysis with ROI calculations, payment optimization, and predictive modeling. Institutional-grade financial analysis tools."
          featureName="Financial Modeling"
          savingsPotential="$15,000-$300,000+"
        />
      )}
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">Advanced Financial Modeling</h3>
            <Badge className="bg-emerald-600 text-white text-xs">
              Wall Street Grade
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Institutional-grade financial analysis • ROI optimization • Predictive modeling</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Medical Bill *
            </label>
            <Input
              type="number"
              placeholder="85000"
              value={modelingData.currentBill}
              onChange={(e) => setModelingData({...modelingData, currentBill: e.target.value})}
              data-testid="input-current-bill"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Income *
            </label>
            <Input
              type="number"
              placeholder="8500"
              value={modelingData.monthlyIncome}
              onChange={(e) => setModelingData({...modelingData, monthlyIncome: e.target.value})}
              data-testid="input-monthly-income"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credit Score
            </label>
            <Select value={modelingData.creditScore} onValueChange={(value) => setModelingData({...modelingData, creditScore: value})}>
              <SelectTrigger data-testid="select-credit-score">
                <SelectValue placeholder="Credit range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="800+">Excellent (800+)</SelectItem>
                <SelectItem value="740-799">Very Good (740-799)</SelectItem>
                <SelectItem value="670-739">Good (670-739)</SelectItem>
                <SelectItem value="580-669">Fair (580-669)</SelectItem>
                <SelectItem value="300-579">Poor (300-579)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Existing Debt
            </label>
            <Input
              type="number"
              placeholder="25000"
              value={modelingData.existingDebt}
              onChange={(e) => setModelingData({...modelingData, existingDebt: e.target.value})}
              data-testid="input-existing-debt"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Liquid Assets
            </label>
            <Input
              type="number"
              placeholder="15000"
              value={modelingData.liquidAssets}
              onChange={(e) => setModelingData({...modelingData, liquidAssets: e.target.value})}
              data-testid="input-liquid-assets"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Planning Time Horizon
          </label>
          <Select value={modelingData.timeHorizon} onValueChange={(value) => setModelingData({...modelingData, timeHorizon: value})}>
            <SelectTrigger data-testid="select-time-horizon">
              <SelectValue placeholder="Select time horizon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3-months">3 Months (Quick Resolution)</SelectItem>
              <SelectItem value="6-months">6 Months (Standard Process)</SelectItem>
              <SelectItem value="12-months">12 Months (Complex Negotiation)</SelectItem>
              <SelectItem value="24-months">24 Months (Legal Action)</SelectItem>
              <SelectItem value="long-term">Long-term (3+ Years)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={runFinancialModeling} 
          disabled={isAnalyzing} 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          data-testid="button-run-financial-modeling"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Financial Models...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-2" />
              Run Advanced Financial Analysis
            </>
          )}
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-3 bg-emerald-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-800">ROI Analysis</span>
          </div>
          <div className="text-xs text-emerald-700">Monte Carlo simulations with probability-weighted outcomes</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">Credit Impact</span>
          </div>
          <div className="text-xs text-blue-700">Credit score modeling and recovery projections</div>
        </div>
      </div>
    </motion.div>
  );
}

// Industry Data Intelligence Dashboard
export function IndustryDataIntelligence({ onSendMessage }: SuperiorAnalysisToolsProps) {
  const { isSubscribed } = useSubscription();
  const [intelligenceData, setIntelligenceData] = useState({
    hospitalSystem: '',
    providerNPI: '',
    serviceArea: '',
    insurancePlan: '',
    procedureCodes: '',
    benchmarkType: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const runIntelligenceAnalysis = async () => {
    if (!intelligenceData.hospitalSystem || !intelligenceData.serviceArea) {
      toast({
        title: "Missing Information",
        description: "Please provide hospital system and service area for intelligence analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    const prompt = `I need you to create a COMPREHENSIVE INDUSTRY DATA INTELLIGENCE REPORT that provides insider market intelligence, competitive analysis, and strategic insights for medical bill negotiation. This should leverage proprietary industry data and insider knowledge.

INTELLIGENCE ANALYSIS INPUTS:
- Hospital System: ${intelligenceData.hospitalSystem}
- Provider NPI: ${intelligenceData.providerNPI}
- Service Area: ${intelligenceData.serviceArea}
- Insurance Plan: ${intelligenceData.insurancePlan}
- Procedure Codes: ${intelligenceData.procedureCodes}
- Benchmark Type: ${intelligenceData.benchmarkType}

Create a COMPREHENSIVE INDUSTRY INTELLIGENCE REPORT with the following analysis:

**HOSPITAL SYSTEM INTELLIGENCE PROFILE**
- Financial performance analysis and revenue pressures
- Executive compensation structures and performance incentives
- Recent merger & acquisition activity and integration status
- Regulatory compliance history and ongoing investigations
- Patient satisfaction scores and quality ratings trends
- Market share analysis and competitive positioning

**REGIONAL MARKET INTELLIGENCE**
- Competitive landscape analysis for this service area
- Regional pricing patterns and market rate benchmarks
- Insurance contract negotiation outcomes and rate trends
- Provider network adequacy issues and gaps
- Regulatory environment and state-specific billing laws
- Economic conditions affecting healthcare pricing

**PROVIDER PERFORMANCE PROFILING**
- Individual provider billing patterns and behavior analysis
- Success rates for different dispute strategies against this provider
- Known vulnerabilities and effective negotiation approaches
- Historical settlement patterns and typical reduction percentages
- Internal policies and procedures that can be leveraged
- Key decision makers and escalation pathways

**INSURANCE COMPANY BEHAVIOR ANALYSIS**
- Claims processing patterns and approval/denial rates
- Appeals success rates for different argument types
- Contract provisions and coverage interpretation patterns
- Recent policy changes and coverage modifications
- Regulatory compliance issues and enforcement actions
- Negotiation leverage points and pressure tactics

**PROCEDURAL PRICING INTELLIGENCE**
- Medicare reimbursement rates for these specific procedures
- Commercial payer rate ranges and contract variations
- Regional pricing variations and market factors
- Cost-to-charge ratio analysis for this hospital system
- Bundling patterns and package pricing opportunities
- Alternative treatment cost comparisons

**LEGAL & REGULATORY INTELLIGENCE**
- Recent court cases and precedents relevant to this situation
- Regulatory enforcement actions against this hospital/insurance
- State attorney general investigations and settlements
- Consumer protection law violations and enforcement patterns
- Class action lawsuits and settlement opportunities
- Regulatory compliance deadlines and pressure points

**STRATEGIC NEGOTIATION INTELLIGENCE**
- Optimal timing for negotiations based on hospital financial cycles
- Key personnel changes and organizational vulnerabilities
- Media attention opportunities and public relations pressure
- Community benefit obligations and charity care requirements
- Board meeting schedules and governance pressure points
- Industry trend analysis affecting negotiation leverage

**COMPETITIVE INTELLIGENCE SUMMARY**
- Benchmarking against similar cases and outcomes
- Success probability analysis for different strategies
- Recommended approach based on industry intelligence
- Risk assessment and mitigation strategies
- Timeline optimization for maximum effectiveness

Include specific data points, success rates, financial metrics, and insider intelligence that would not be available through public sources. Format as a professional intelligence briefing with actionable insights and strategic recommendations.`;

    onSendMessage(prompt);
    setIsAnalyzing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 relative"
    >
      {!isSubscribed && (
        <PremiumPaywallOverlay
          title="Industry Data Intelligence"
          description="Proprietary market intelligence and competitive analysis. Access insider data on hospital systems, provider behavior, and industry trends."
          featureName="Data Intelligence"
          savingsPotential="$20,000-$400,000+"
        />
      )}
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
          <Database className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">Industry Data Intelligence</h3>
            <Badge className="bg-blue-600 text-white text-xs">
              Proprietary Data
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Market intelligence • Competitive analysis • Insider insights</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hospital System *
            </label>
            <Input
              placeholder="e.g., HCA Healthcare, Kaiser Permanente"
              value={intelligenceData.hospitalSystem}
              onChange={(e) => setIntelligenceData({...intelligenceData, hospitalSystem: e.target.value})}
              data-testid="input-hospital-system-intel"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider NPI (Optional)
            </label>
            <Input
              placeholder="1234567890"
              value={intelligenceData.providerNPI}
              onChange={(e) => setIntelligenceData({...intelligenceData, providerNPI: e.target.value})}
              data-testid="input-provider-npi"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Area *
            </label>
            <Input
              placeholder="e.g., Dallas-Fort Worth, Bay Area"
              value={intelligenceData.serviceArea}
              onChange={(e) => setIntelligenceData({...intelligenceData, serviceArea: e.target.value})}
              data-testid="input-service-area"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurance Plan
            </label>
            <Input
              placeholder="e.g., Aetna PPO, BCBS Choice"
              value={intelligenceData.insurancePlan}
              onChange={(e) => setIntelligenceData({...intelligenceData, insurancePlan: e.target.value})}
              data-testid="input-insurance-plan"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Procedure Codes (CPT)
          </label>
          <Textarea
            placeholder="e.g., 99285, 36415, 85025"
            value={intelligenceData.procedureCodes}
            onChange={(e) => setIntelligenceData({...intelligenceData, procedureCodes: e.target.value})}
            data-testid="textarea-procedure-codes"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Benchmark Analysis Type
          </label>
          <Select value={intelligenceData.benchmarkType} onValueChange={(value) => setIntelligenceData({...intelligenceData, benchmarkType: value})}>
            <SelectTrigger data-testid="select-benchmark-type">
              <SelectValue placeholder="Select analysis type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pricing">Pricing Benchmarking</SelectItem>
              <SelectItem value="negotiation">Negotiation Success Analysis</SelectItem>
              <SelectItem value="compliance">Regulatory Compliance Review</SelectItem>
              <SelectItem value="competitive">Competitive Intelligence</SelectItem>
              <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={runIntelligenceAnalysis} 
          disabled={isAnalyzing} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          data-testid="button-run-intelligence-analysis"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Analyzing Industry Data...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Generate Intelligence Report
            </>
          )}
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-3 w-3 text-blue-600" />
            <span className="text-xs font-semibold text-blue-800">Hospital Intel</span>
          </div>
          <div className="text-xs text-blue-700">Financial performance & vulnerabilities</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Network className="h-3 w-3 text-green-600" />
            <span className="text-xs font-semibold text-green-800">Market Data</span>
          </div>
          <div className="text-xs text-green-700">Regional pricing & competition</div>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Gavel className="h-3 w-3 text-orange-600" />
            <span className="text-xs font-semibold text-orange-800">Legal Intel</span>
          </div>
          <div className="text-xs text-orange-700">Precedents & enforcement</div>
        </div>
      </div>
    </motion.div>
  );
}

// Tax Deduction Maximizer
export function TaxDeductionMaximizer({ onSendMessage }: SuperiorAnalysisToolsProps) {
  const { isSubscribed } = useSubscription();
  const [taxData, setTaxData] = useState({
    totalMedicalExpenses: '',
    adjustedGrossIncome: '',
    filingStatus: '',
    stateResidence: '',
    businessExpenses: '',
    travelExpenses: ''
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const calculateTaxOptimization = async () => {
    if (!taxData.totalMedicalExpenses || !taxData.adjustedGrossIncome) {
      toast({
        title: "Missing Information",
        description: "Please provide medical expenses and AGI for tax optimization.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    const prompt = `I need you to create a COMPREHENSIVE TAX DEDUCTION MAXIMIZATION REPORT that optimizes medical expense deductions and identifies all possible tax benefits related to medical bills and healthcare expenses.

TAX OPTIMIZATION INPUTS:
- Total Medical Expenses: $${taxData.totalMedicalExpenses}
- Adjusted Gross Income: $${taxData.adjustedGrossIncome}
- Filing Status: ${taxData.filingStatus}
- State of Residence: ${taxData.stateResidence}
- Business-Related Medical: $${taxData.businessExpenses}
- Medical Travel Expenses: $${taxData.travelExpenses}

Create a COMPREHENSIVE TAX DEDUCTION MAXIMIZATION REPORT with the following analysis:

**FEDERAL TAX DEDUCTION ANALYSIS**
- Medical expense deduction threshold calculation (7.5% of AGI for 2023)
- Itemized vs. standard deduction comparison and recommendation
- Deductible medical expense categorization and optimization
- Multi-year medical expense timing strategies for maximum benefit
- Medical savings account (HSA/FSA) optimization opportunities

**STATE TAX OPTIMIZATION**
- State-specific medical expense deduction rules and thresholds
- State tax credit opportunities for medical expenses
- Property tax deductions for medical equipment or home modifications
- State disability tax benefits and medical expense provisions
- Multi-state tax considerations if applicable

**BUSINESS EXPENSE OPTIMIZATION**
- Medical expenses as business deductions (if self-employed)
- Health insurance premium deductions for business owners
- Medical travel expense optimization and documentation requirements
- Home office medical equipment deduction strategies
- Employee business expense medical deductions (if applicable)

**ADVANCED TAX STRATEGIES**
- Medical expense bunching strategies to exceed AGI thresholds
- Charitable deduction optimization for medical bill settlements
- Dependent medical expense inclusion and family planning
- Medical equipment depreciation and business use calculations
- Long-term care insurance premium deduction optimization

**DOCUMENTATION & COMPLIANCE**
- Required documentation for each deduction category
- IRS audit protection strategies and record keeping requirements
- Professional tax preparation recommendations and cost-benefit analysis
- Amended return opportunities for prior years
- State and federal compliance requirements and deadlines

**FINANCIAL PLANNING INTEGRATION**
- HSA contribution optimization and triple tax advantage utilization
- Flexible Spending Account planning and use-it-or-lose-it strategies
- Medical expense budgeting for future tax years
- Retirement account medical expense distributions (401k hardship, IRA)
- Estate planning considerations for medical expenses

**SAVINGS CALCULATION & PROJECTIONS**
- Exact tax savings calculations for current and future years
- Marginal tax rate impact analysis
- Alternative minimum tax considerations and planning
- Multi-year tax planning strategies for chronic medical conditions
- State and federal tax savings summary with specific dollar amounts

**IMPLEMENTATION TIMELINE**
- Immediate action items for current tax year
- Strategic planning for future tax years
- Professional service recommendations (CPA, tax attorney)
- Cost-benefit analysis of professional tax services
- Calendar deadlines and important tax dates

Include specific dollar amounts for tax savings, detailed calculations showing before/after tax impacts, and professional-grade tax strategy recommendations that would meet CPA standards for client advice.`;

    onSendMessage(prompt);
    setIsCalculating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 relative"
    >
      {!isSubscribed && (
        <PremiumPaywallOverlay
          title="Tax Deduction Maximizer"
          description="Professional tax optimization for medical expenses. Maximize deductions and identify potential tax strategies. Example outcomes: $5,000-$50,000+ annually."
          featureName="Tax Optimization"
          savingsPotential="$5,000-$50,000+"
        />
      )}
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
          <Percent className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">Tax Deduction Maximizer</h3>
            <Badge className="bg-green-600 text-white text-xs">
              CPA Grade
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Professional tax optimization • Medical expense strategies • Multi-year planning</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Medical Expenses *
            </label>
            <Input
              type="number"
              placeholder="45000"
              value={taxData.totalMedicalExpenses}
              onChange={(e) => setTaxData({...taxData, totalMedicalExpenses: e.target.value})}
              data-testid="input-medical-expenses"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adjusted Gross Income *
            </label>
            <Input
              type="number"
              placeholder="125000"
              value={taxData.adjustedGrossIncome}
              onChange={(e) => setTaxData({...taxData, adjustedGrossIncome: e.target.value})}
              data-testid="input-agi"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filing Status
            </label>
            <Select value={taxData.filingStatus} onValueChange={(value) => setTaxData({...taxData, filingStatus: value})}>
              <SelectTrigger data-testid="select-filing-status">
                <SelectValue placeholder="Select filing status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married-joint">Married Filing Jointly</SelectItem>
                <SelectItem value="married-separate">Married Filing Separately</SelectItem>
                <SelectItem value="head-of-household">Head of Household</SelectItem>
                <SelectItem value="qualifying-widow">Qualifying Widow(er)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State of Residence
            </label>
            <Input
              placeholder="e.g., California, Texas, New York"
              value={taxData.stateResidence}
              onChange={(e) => setTaxData({...taxData, stateResidence: e.target.value})}
              data-testid="input-state-residence"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Medical Expenses
            </label>
            <Input
              type="number"
              placeholder="5000"
              value={taxData.businessExpenses}
              onChange={(e) => setTaxData({...taxData, businessExpenses: e.target.value})}
              data-testid="input-business-expenses"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical Travel Expenses
            </label>
            <Input
              type="number"
              placeholder="2500"
              value={taxData.travelExpenses}
              onChange={(e) => setTaxData({...taxData, travelExpenses: e.target.value})}
              data-testid="input-travel-expenses"
            />
          </div>
        </div>

        <Button 
          onClick={calculateTaxOptimization} 
          disabled={isCalculating} 
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          data-testid="button-calculate-tax-optimization"
        >
          {isCalculating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Calculating Tax Optimization...
            </>
          ) : (
            <>
              <Percent className="h-4 w-4 mr-2" />
              Calculate Maximum Tax Benefits
            </>
          )}
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-800">Federal Savings</span>
          </div>
          <div className="text-xs text-green-700">Itemized deduction optimization & AGI threshold analysis</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">Multi-Year Strategy</span>
          </div>
          <div className="text-xs text-blue-700">Medical expense timing & bunching strategies</div>
        </div>
      </div>
    </motion.div>
  );
}

// Main Superior Analysis Tools Container
export function SuperiorAnalysisTools({ onSendMessage }: SuperiorAnalysisToolsProps) {
  const [activeTab, setActiveTab] = useState('executive');

  const analysisTools = [
    { 
      id: 'executive', 
      name: 'Executive Reports', 
      icon: Crown, 
      component: ExecutiveBillAnalysisReport,
      description: 'C-suite grade analysis reports'
    },
    { 
      id: 'financial', 
      name: 'Financial Modeling', 
      icon: TrendingUp, 
      component: AdvancedFinancialModeling,
      description: 'Wall Street grade financial analysis'
    },
    { 
      id: 'intelligence', 
      name: 'Data Intelligence', 
      icon: Database, 
      component: IndustryDataIntelligence,
      description: 'Proprietary market intelligence'
    },
    { 
      id: 'tax', 
      name: 'Tax Optimization', 
      icon: Percent, 
      component: TaxDeductionMaximizer,
      description: 'CPA grade tax strategies'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Superior Analysis Tools</h2>
            <Badge className="bg-gradient-to-r from-purple-600 to-emerald-600 text-white text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Professional Grade
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto">
          Institutional-grade analysis tools that rival expensive consulting firms. Professional reporting, advanced modeling, and proprietary intelligence.
        </p>
      </div>

      {/* Tool Selection Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {analysisTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTab(tool.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tool.id
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            data-testid={`tab-${tool.id}`}
          >
            <tool.icon className="h-4 w-4" />
            <span>{tool.name}</span>
          </button>
        ))}
      </div>

      {/* Active Tool Component */}
      <AnimatePresence mode="wait">
        {analysisTools.map((tool) => {
          if (activeTab === tool.id) {
            const ToolComponent = tool.component;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ToolComponent onSendMessage={onSendMessage} />
              </motion.div>
            );
          }
          return null;
        })}
      </AnimatePresence>
    </div>
  );
}