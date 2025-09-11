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
  Vault, 
  Target, 
  Crown, 
  Stethoscope, 
  Eye, 
  Brain, 
  Zap, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  Building2, 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  Download, 
  Copy, 
  ExternalLink, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Star, 
  Lock, 
  Key, 
  Flame, 
  Sparkles,
  ArrowRight,
  CheckSquare,
  Circle,
  PlayCircle,
  PauseCircle,
  RotateCw,
  Info,
  HelpCircle,
  MessageSquare,
  Briefcase,
  Scale,
  Gavel,
  Network,
  Database,
  BarChart3,
  Settings,
  Award
} from "lucide-react";

interface InsiderStrategyProps {
  onSendMessage: (message: string) => void;
}

// Charge Master Secrets Decoder Strategy
export function ChargeMasterDecoder({ onSendMessage }: InsiderStrategyProps) {
  const { isSubscribed } = useSubscription();
  const [currentStep, setCurrentStep] = useState(1);
  const [strategyData, setStrategyData] = useState({
    hospitalSystem: '',
    billAmount: '',
    serviceType: '',
    specificCharges: '',
    facilityType: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const chargeMasterSteps = [
    {
      id: 1,
      title: "Hospital Intelligence Gathering",
      description: "Identify hospital system and gather insider intelligence",
      icon: Database,
      actions: ["Research hospital ownership", "Identify revenue pressures", "Map executive structure"]
    },
    {
      id: 2,
      title: "Charge Master Analysis",
      description: "Decode pricing algorithms and markup patterns",
      icon: Vault,
      actions: ["Calculate markup ratios", "Identify pricing vulnerabilities", "Compare to cost data"]
    },
    {
      id: 3,
      title: "Vulnerability Assessment", 
      description: "Find exploitable weaknesses in billing systems",
      icon: Target,
      actions: ["Map billing department structure", "Identify KPI pressure points", "Find audit vulnerabilities"]
    },
    {
      id: 4,
      title: "Insider Pressure Application",
      description: "Apply insider knowledge for maximum bill reduction",
      icon: Zap,
      actions: ["Target revenue cycle weaknesses", "Escalate to decision makers", "Apply compliance pressure"]
    }
  ];

  const executeChargeMasterStrategy = async () => {
    if (!strategyData.hospitalSystem || !strategyData.billAmount) {
      toast({
        title: "Missing Information",
        description: "Please provide hospital system and bill amount to execute charge master strategy.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    const prompt = `I need you to execute a comprehensive CHARGE MASTER SECRETS DECODING STRATEGY using insider hospital revenue cycle knowledge. This should be a step-by-step tactical approach that leverages insider secrets to force massive bill reductions.

CHARGE MASTER INTELLIGENCE INPUTS:
- Hospital System: ${strategyData.hospitalSystem}
- Bill Amount: $${strategyData.billAmount}
- Service Type: ${strategyData.serviceType}
- Specific Charges: ${strategyData.specificCharges}
- Facility Type: ${strategyData.facilityType}
- Current Strategy Step: ${currentStep}/4

Execute CHARGE MASTER DECODING STRATEGY with the following insider tactics:

**STEP 1: HOSPITAL INTELLIGENCE GATHERING**
- Revenue cycle vulnerabilities specific to this hospital system
- Executive compensation structures and performance pressure points
- Recent financial performance and cash flow pressures
- Regulatory compliance issues and audit vulnerabilities
- Insider knowledge of billing department KPIs and metrics

**STEP 2: CHARGE MASTER PRICING ALGORITHM DECODING**
- Calculate actual markup percentages using insider cost-to-charge ratios
- Identify pricing manipulation patterns used by this hospital system
- Reveal hidden pricing rules and algorithmic overcharging methods
- Compare charges to Medicare cost reports and insider cost data
- Expose charity care qualification secrets and hidden criteria

**STEP 3: REVENUE CYCLE VULNERABILITY EXPLOITATION**
- Target specific billing department pressure points and weaknesses
- Identify collection cost thresholds and break-even analysis
- Map decision-making authority and escalation bypass methods
- Exploit patient satisfaction score impacts on executive compensation
- Apply regulatory compliance pressure at vulnerable points

**STEP 4: INSIDER PRESSURE APPLICATION & BILL REDUCTION**
- Execute insider negotiation triggers that force immediate reductions
- Apply executive escalation tactics using insider authority maps
- Leverage charity care budget allocations and internal quotas
- Use compliance violation threats and regulatory pressure points
- Implement board-level escalation strategies for maximum impact

**INSIDER SECRETS TO REVEAL:**
- Exact markup percentages and pricing manipulation methods
- Internal cost accounting that proves overcharging
- Executive compensation metrics tied to billing revenue
- Hidden charity care qualifications and approval criteria
- Revenue department KPIs that can be exploited for bill reduction

**TACTICAL IMPLEMENTATION:**
- Specific language and pressure points that trigger immediate action
- Direct contact information and escalation pathways to decision makers
- Timing strategies that exploit hospital financial and audit cycles
- Documentation requirements that force compliance department attention
- Media pressure tactics that protect hospital reputation concerns

Provide step-by-step tactical instructions with specific dollar amounts, contact strategies, and insider pressure tactics that would not be available to the general public. Include insider secrets, executive pressure points, and hospital-specific vulnerabilities.`;

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
          title="Charge Master Secrets Decoder"
          description="Insider secrets that reveal hospital pricing manipulation tactics and force massive bill reductions using charge master vulnerabilities."
          featureName="Charge Master Intelligence"
          savingsPotential="$25,000-$500,000+"
        />
      )}
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
          <Vault className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">Charge Master Secrets Decoder</h3>
            <Badge className="bg-purple-600 text-white text-xs">
              <Lock className="h-3 w-3 mr-1" />
              Insider Secrets
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Decode hospital pricing algorithms • Expose markup manipulation • Force reductions</p>
        </div>
      </div>

      {/* Strategy Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Strategy Progress</span>
          <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
        </div>
        <Progress value={(currentStep / 4) * 100} className="h-2" />
      </div>

      {/* Strategy Steps */}
      <div className="space-y-3 mb-6">
        {chargeMasterSteps.map((step) => (
          <div
            key={step.id}
            className={`p-3 rounded-lg border-2 transition-all ${
              currentStep === step.id 
                ? 'border-purple-300 bg-purple-50' 
                : currentStep > step.id 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step.id 
                  ? 'bg-purple-600 text-white' 
                  : currentStep > step.id 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
                {currentStep === step.id && (
                  <div className="mt-2">
                    <div className="text-xs text-purple-700 font-medium">Current Actions:</div>
                    <div className="space-y-1">
                      {step.actions.map((action, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-purple-600">
                          <ArrowRight className="h-3 w-3" />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Strategy Input Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hospital System *
            </label>
            <Input
              placeholder="e.g., HCA Healthcare, Kaiser"
              value={strategyData.hospitalSystem}
              onChange={(e) => setStrategyData({...strategyData, hospitalSystem: e.target.value})}
              data-testid="input-hospital-system-decoder"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Bill Amount *
            </label>
            <Input
              type="number"
              placeholder="150000"
              value={strategyData.billAmount}
              onChange={(e) => setStrategyData({...strategyData, billAmount: e.target.value})}
              data-testid="input-bill-amount-decoder"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <Select value={strategyData.serviceType} onValueChange={(value) => setStrategyData({...strategyData, serviceType: value})}>
              <SelectTrigger data-testid="select-service-type-decoder">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emergency">Emergency Room</SelectItem>
                <SelectItem value="surgery">Inpatient Surgery</SelectItem>
                <SelectItem value="outpatient">Outpatient Surgery</SelectItem>
                <SelectItem value="diagnostic">Diagnostic Testing</SelectItem>
                <SelectItem value="imaging">Imaging/Radiology</SelectItem>
                <SelectItem value="laboratory">Laboratory Services</SelectItem>
                <SelectItem value="cardiology">Cardiac Procedures</SelectItem>
                <SelectItem value="oncology">Cancer Treatment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facility Type
            </label>
            <Select value={strategyData.facilityType} onValueChange={(value) => setStrategyData({...strategyData, facilityType: value})}>
              <SelectTrigger data-testid="select-facility-type-decoder">
                <SelectValue placeholder="Select facility type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="for-profit">For-profit Hospital</SelectItem>
                <SelectItem value="non-profit">Non-profit Hospital</SelectItem>
                <SelectItem value="academic">Academic Medical Center</SelectItem>
                <SelectItem value="specialty">Specialty Hospital</SelectItem>
                <SelectItem value="government">Government Hospital</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Most Suspicious Charges
          </label>
          <Textarea
            placeholder="List the line items that seem extremely high or questionable..."
            value={strategyData.specificCharges}
            onChange={(e) => setStrategyData({...strategyData, specificCharges: e.target.value})}
            data-testid="textarea-suspicious-charges"
          />
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={executeChargeMasterStrategy} 
            disabled={isAnalyzing} 
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            data-testid="button-execute-chargemaster-strategy"
          >
            {isAnalyzing ? (
              <>
                <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                Decoding Charge Master...
              </>
            ) : (
              <>
                <Vault className="h-4 w-4 mr-2" />
                Execute Insider Strategy
              </>
            )}
          </Button>
          {currentStep < 4 && (
            <Button 
              onClick={() => setCurrentStep(currentStep + 1)} 
              variant="outline"
              data-testid="button-next-step"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Key className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-semibold text-purple-800">Insider Secrets Revealed</span>
        </div>
        <div className="text-xs text-purple-700 space-y-1">
          <div>• Hospital charge master markup algorithms (400-1000%)</div>
          <div>• Revenue cycle vulnerability pressure points</div>
          <div>• Executive compensation tied to billing revenue</div>
          <div>• Hidden charity care qualification criteria</div>
        </div>
      </div>
    </motion.div>
  );
}

// Revenue Cycle Vulnerability Exploiter
export function RevenueCycleExploiter({ onSendMessage }: InsiderStrategyProps) {
  const { isSubscribed } = useSubscription();
  const [currentPhase, setCurrentPhase] = useState(1);
  const [exploitData, setExploitData] = useState({
    hospitalName: '',
    billAmount: '',
    accountAge: '',
    collectionStatus: '',
    hospitalType: '',
    paymentHistory: ''
  });
  const [isExploiting, setIsExploiting] = useState(false);
  const { toast } = useToast();

  const exploitPhases = [
    {
      id: 1,
      title: "Vulnerability Mapping",
      description: "Identify exploitable weaknesses in revenue cycle",
      icon: Target,
      targets: ["KPI pressure points", "Audit vulnerabilities", "Cash flow disruption"]
    },
    {
      id: 2,
      title: "Pressure Point Targeting",
      description: "Target specific organizational vulnerabilities",
      icon: Zap,
      targets: ["Executive performance metrics", "Collection cost analysis", "Patient satisfaction impact"]
    },
    {
      id: 3,
      title: "Strategic Exploitation",
      description: "Apply maximum pressure for bill reduction",
      icon: Flame,
      targets: ["Regulatory compliance threats", "Budget impact analysis", "Settlement thresholds"]
    }
  ];

  const executeRevenueCycleExploit = async () => {
    if (!exploitData.hospitalName || !exploitData.billAmount) {
      toast({
        title: "Missing Information",
        description: "Please provide hospital name and bill amount to execute exploitation strategy.",
        variant: "destructive",
      });
      return;
    }

    setIsExploiting(true);
    const prompt = `I need you to execute a comprehensive REVENUE CYCLE VULNERABILITY EXPLOITATION STRATEGY that targets specific organizational weaknesses to force maximum bill reductions. This should leverage insider knowledge of hospital operations and financial pressures.

REVENUE CYCLE EXPLOITATION INPUTS:
- Hospital: ${exploitData.hospitalName}
- Bill Amount: $${exploitData.billAmount}
- Account Age: ${exploitData.accountAge}
- Collection Status: ${exploitData.collectionStatus}
- Hospital Type: ${exploitData.hospitalType}
- Payment History: ${exploitData.paymentHistory}
- Current Phase: ${currentPhase}/3

Execute REVENUE CYCLE EXPLOITATION STRATEGY with the following insider tactics:

**PHASE 1: VULNERABILITY MAPPING & ASSESSMENT**
- Identify this hospital's specific revenue cycle vulnerabilities and pressure points
- Map billing department KPIs and performance metrics that affect staff compensation
- Analyze collection cost structures and break-even thresholds for debt pursuit
- Assess executive compensation structures tied to patient satisfaction and financial performance
- Identify audit schedules and compliance vulnerability windows for maximum leverage

**PHASE 2: PRESSURE POINT TARGETING & EXPLOITATION**
- Target specific KPI vulnerabilities that create immediate pressure for resolution
- Calculate and leverage collection cost analysis to force settlement decisions
- Apply patient satisfaction score pressure that affects executive performance reviews
- Exploit cash flow disruption tactics through strategic payment timing and processes
- Use regulatory compliance threats to trigger compliance department intervention

**PHASE 3: STRATEGIC MAXIMUM PRESSURE APPLICATION**
- Execute department budget impact analysis to target collection cost centers
- Apply settlement threshold calculations based on collection costs and break-even analysis
- Implement escalation pathway exploitation to bypass billing department restrictions
- Use media pressure and reputation management concerns to force executive attention
- Apply board-level escalation tactics for maximum bill reduction authorization

**INSIDER EXPLOITATION TACTICS:**
- Specific revenue department pressure points that force immediate action
- Executive compensation vulnerabilities that can be leveraged for bill reduction
- Collection agency cost thresholds that make settlement more profitable than pursuit
- Patient satisfaction score impacts that affect hospital ratings and executive reviews
- Regulatory compliance requirements that create urgency and executive attention

**ORGANIZATIONAL VULNERABILITY LEVERAGE:**
- Internal audit schedules and compliance review timing for maximum pressure application
- Cash flow management pressures and working capital requirements during specific periods
- Hospital financial performance metrics and quarterly reporting pressure periods
- Medical staff politics and physician relationship leverage for additional pressure
- Community benefit obligations and public relations concerns for reputation protection

**IMPLEMENTATION STRATEGY:**
- Precise timing for maximum organizational vulnerability exploitation
- Specific language and pressure tactics that trigger immediate escalation to decision makers
- Documentation requirements that force compliance department involvement and attention
- Strategic escalation pathways that bypass billing department limitations and restrictions
- Settlement negotiation tactics that leverage organizational vulnerabilities for maximum reduction

Provide step-by-step exploitation tactics with specific organizational pressure points, timing strategies, and vulnerability leverage techniques that would not be available through standard bill dispute approaches.`;

    onSendMessage(prompt);
    setIsExploiting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 relative"
    >
      {!isSubscribed && (
        <PremiumPaywallOverlay
          title="Revenue Cycle Vulnerability Exploiter"
          description="Target specific weaknesses in hospital billing departments using insider knowledge of organizational vulnerabilities and pressure points."
          featureName="Revenue Cycle Exploitation"
          savingsPotential="$15,000-$300,000+"
        />
      )}
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
          <Target className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">Revenue Cycle Vulnerability Exploiter</h3>
            <Badge className="bg-red-600 text-white text-xs">
              <Flame className="h-3 w-3 mr-1" />
              High Impact
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Target billing weaknesses • Exploit pressure points • Force reductions</p>
        </div>
      </div>

      {/* Exploitation Phase Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Exploitation Phase</span>
          <span className="text-sm text-gray-500">Phase {currentPhase} of 3</span>
        </div>
        <Progress value={(currentPhase / 3) * 100} className="h-2" />
      </div>

      {/* Exploitation Phases */}
      <div className="space-y-3 mb-6">
        {exploitPhases.map((phase) => (
          <div
            key={phase.id}
            className={`p-3 rounded-lg border-2 transition-all ${
              currentPhase === phase.id 
                ? 'border-red-300 bg-red-50' 
                : currentPhase > phase.id 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentPhase === phase.id 
                  ? 'bg-red-600 text-white' 
                  : currentPhase > phase.id 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
              }`}>
                {currentPhase > phase.id ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <phase.icon className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{phase.title}</h4>
                <p className="text-sm text-gray-600">{phase.description}</p>
                {currentPhase === phase.id && (
                  <div className="mt-2">
                    <div className="text-xs text-red-700 font-medium">Target Areas:</div>
                    <div className="space-y-1">
                      {phase.targets.map((target, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-red-600">
                          <Target className="h-3 w-3" />
                          <span>{target}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Exploitation Input Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hospital/Health System *
            </label>
            <Input
              placeholder="e.g., Memorial Healthcare, Ascension"
              value={exploitData.hospitalName}
              onChange={(e) => setExploitData({...exploitData, hospitalName: e.target.value})}
              data-testid="input-hospital-name-exploiter"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Bill Amount *
            </label>
            <Input
              type="number"
              placeholder="85000"
              value={exploitData.billAmount}
              onChange={(e) => setExploitData({...exploitData, billAmount: e.target.value})}
              data-testid="input-bill-amount-exploiter"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bill Age
            </label>
            <Select value={exploitData.accountAge} onValueChange={(value) => setExploitData({...exploitData, accountAge: value})}>
              <SelectTrigger data-testid="select-account-age">
                <SelectValue placeholder="Select age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-30">0-30 days old</SelectItem>
                <SelectItem value="31-60">31-60 days old</SelectItem>
                <SelectItem value="61-90">61-90 days old</SelectItem>
                <SelectItem value="91-120">91-120 days old</SelectItem>
                <SelectItem value="120+">Over 120 days old</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collection Status
            </label>
            <Select value={exploitData.collectionStatus} onValueChange={(value) => setExploitData({...exploitData, collectionStatus: value})}>
              <SelectTrigger data-testid="select-collection-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internal">Internal collections</SelectItem>
                <SelectItem value="external">External agency</SelectItem>
                <SelectItem value="legal">Legal action threatened</SelectItem>
                <SelectItem value="none">Not in collections</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hospital Type
            </label>
            <Select value={exploitData.hospitalType} onValueChange={(value) => setExploitData({...exploitData, hospitalType: value})}>
              <SelectTrigger data-testid="select-hospital-type-exploiter">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="for-profit-chain">For-profit chain</SelectItem>
                <SelectItem value="non-profit">Non-profit system</SelectItem>
                <SelectItem value="academic">Academic center</SelectItem>
                <SelectItem value="community">Community hospital</SelectItem>
                <SelectItem value="government">Government hospital</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={executeRevenueCycleExploit} 
            disabled={isExploiting} 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            data-testid="button-execute-revenue-exploit"
          >
            {isExploiting ? (
              <>
                <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                Exploiting Vulnerabilities...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Execute Exploitation Strategy
              </>
            )}
          </Button>
          {currentPhase < 3 && (
            <Button 
              onClick={() => setCurrentPhase(currentPhase + 1)} 
              variant="outline"
              data-testid="button-next-phase"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-3 w-3 text-red-600" />
            <span className="text-xs font-semibold text-red-800">KPI Targeting</span>
          </div>
          <div className="text-xs text-red-700">Revenue dept. performance pressure</div>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-3 w-3 text-orange-600" />
            <span className="text-xs font-semibold text-orange-800">Cost Analysis</span>
          </div>
          <div className="text-xs text-orange-700">Collection break-even thresholds</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="h-3 w-3 text-purple-600" />
            <span className="text-xs font-semibold text-purple-800">Executive Impact</span>
          </div>
          <div className="text-xs text-purple-700">Compensation & performance metrics</div>
        </div>
      </div>
    </motion.div>
  );
}

// Hospital Board Pressure Tactics
export function HospitalBoardPressure({ onSendMessage }: InsiderStrategyProps) {
  const { isSubscribed } = useSubscription();
  const [escalationLevel, setEscalationLevel] = useState(1);
  const [boardData, setBoardData] = useState({
    hospitalSystem: '',
    billAmount: '',
    hospitalOwnership: '',
    communityStanding: '',
    mediaValue: '',
    qualityConcerns: '',
    executiveConnections: ''
  });
  const [isEscalating, setIsEscalating] = useState(false);
  const { toast } = useToast();

  const escalationLevels = [
    {
      id: 1,
      title: "Governance Intelligence",
      description: "Map hospital board structure and decision makers",
      icon: Building2,
      tactics: ["Board member research", "Governance structure analysis", "Executive compensation review"]
    },
    {
      id: 2,
      title: "Stakeholder Pressure",
      description: "Build coalition and community pressure",
      icon: Users,
      tactics: ["Community leader recruitment", "Media strategy development", "Public relations pressure"]
    },
    {
      id: 3,
      title: "Board-Level Escalation",
      description: "Direct escalation to hospital board and executives",
      icon: Crown,
      tactics: ["Executive communication", "Board meeting agenda", "Fiduciary responsibility pressure"]
    }
  ];

  const executeHospitalBoardPressure = async () => {
    if (!boardData.hospitalSystem || !boardData.billAmount) {
      toast({
        title: "Missing Information",
        description: "Please provide hospital system and bill amount to execute board pressure strategy.",
        variant: "destructive",
      });
      return;
    }

    setIsEscalating(true);
    const prompt = `I need you to execute a comprehensive HOSPITAL BOARD PRESSURE STRATEGY that escalates to the highest levels of hospital governance for maximum bill reductions. This should leverage board fiduciary responsibilities and executive accountability.

HOSPITAL BOARD PRESSURE INPUTS:
- Hospital System: ${boardData.hospitalSystem}
- Bill Amount: $${boardData.billAmount}
- Hospital Ownership: ${boardData.hospitalOwnership}
- Community Standing: ${boardData.communityStanding}
- Media Story Potential: ${boardData.mediaValue}
- Quality Concerns: ${boardData.qualityConcerns}
- Executive Connections: ${boardData.executiveConnections}
- Current Escalation Level: ${escalationLevel}/3

Execute HOSPITAL BOARD PRESSURE STRATEGY with the following governance tactics:

**LEVEL 1: HOSPITAL GOVERNANCE INTELLIGENCE & MAPPING**
- Research hospital board composition, member backgrounds, and governance structure
- Identify board committee responsibilities and decision-making authority for billing disputes
- Map executive compensation structures and performance review criteria tied to patient outcomes
- Analyze hospital mission statements and community benefit obligations for leverage
- Research recent board meeting minutes and governance decisions related to billing practices

**LEVEL 2: STAKEHOLDER COALITION & COMMUNITY PRESSURE BUILDING**
- Recruit community leaders and stakeholders to amplify pressure on hospital executives
- Develop media strategy and public relations pressure affecting hospital reputation and rankings
- Coordinate with patient advocacy groups and community organizations for collective pressure
- Document community benefit obligations and charitable mission violations for board accountability
- Create public relations narrative that threatens hospital reputation and community standing

**LEVEL 3: DIRECT BOARD-LEVEL ESCALATION & EXECUTIVE PRESSURE**
- Execute direct communication strategy to reach hospital CEOs, CFOs, and board members
- Apply board fiduciary duty pressure for patient welfare and reasonable billing practices
- Use governance accountability mechanisms to force board discussion and executive action
- Leverage executive compensation and performance review criteria to create personal accountability
- Implement settlement authorization strategy targeting executives with authority for massive reductions

**BOARD GOVERNANCE PRESSURE TACTICS:**
- Fiduciary responsibility arguments that board members cannot ignore without liability
- Community benefit obligation enforcement that threatens non-profit hospital status
- Public relations pressure that affects hospital rankings, accreditation, and community reputation
- Regulatory compliance leverage that triggers executive attention and governance intervention
- Executive compensation impact that ties bill resolution to personal financial consequences

**EXECUTIVE ACCOUNTABILITY MECHANISMS:**
- Performance review criteria that link patient satisfaction and billing practices to compensation
- Board reporting requirements that force executive explanation of billing dispute policies
- Community stakeholder pressure that affects hospital's community benefit compliance
- Media attention that threatens hospital reputation and regulatory oversight attention
- Settlement authority identification that targets executives empowered to approve massive reductions

**IMPLEMENTATION STRATEGY:**
- Precise timing that aligns with board meetings, performance reviews, and governance cycles
- Strategic communication channels that reach board members and executives directly
- Professional documentation that demonstrates governance accountability and fiduciary concerns
- Community coalition building that amplifies pressure through multiple stakeholder channels
- Media strategy that protects patient privacy while creating maximum pressure for resolution

**MAXIMUM PRESSURE APPLICATION:**
- Board meeting agenda placement strategy to force executive discussion and action
- Regulatory agency coordination that creates compliance pressure and oversight attention
- Community benefit obligation enforcement that threatens hospital tax-exempt status
- Executive compensation leverage that creates personal financial consequences for non-resolution
- Settlement negotiation strategy that leverages governance pressure for unprecedented reductions

Provide step-by-step board-level pressure tactics with specific governance leverage points, executive accountability mechanisms, and settlement strategies that compel hospital boards to personally intervene and authorize maximum possible bill reductions.`;

    onSendMessage(prompt);
    setIsEscalating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 relative"
    >
      {!isSubscribed && (
        <PremiumPaywallOverlay
          title="Hospital Board Pressure Tactics"
          description="Strategic escalation to hospital boards and executives using governance pressure points for maximum bill reductions."
          featureName="Board-Level Pressure"
          savingsPotential="$50,000-$1,000,000+"
        />
      )}
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-700 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg">
          <Crown className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">Hospital Board Pressure Tactics</h3>
            <Badge className="bg-purple-700 text-white text-xs">
              <Award className="h-3 w-3 mr-1" />
              Maximum Impact
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Board-level escalation • Executive pressure • Governance accountability</p>
        </div>
      </div>

      {/* Escalation Level Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Escalation Level</span>
          <span className="text-sm text-gray-500">Level {escalationLevel} of 3</span>
        </div>
        <Progress value={(escalationLevel / 3) * 100} className="h-2" />
      </div>

      {/* Escalation Levels */}
      <div className="space-y-3 mb-6">
        {escalationLevels.map((level) => (
          <div
            key={level.id}
            className={`p-3 rounded-lg border-2 transition-all ${
              escalationLevel === level.id 
                ? 'border-purple-300 bg-purple-50' 
                : escalationLevel > level.id 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                escalationLevel === level.id 
                  ? 'bg-purple-700 text-white' 
                  : escalationLevel > level.id 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
              }`}>
                {escalationLevel > level.id ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <level.icon className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{level.title}</h4>
                <p className="text-sm text-gray-600">{level.description}</p>
                {escalationLevel === level.id && (
                  <div className="mt-2">
                    <div className="text-xs text-purple-700 font-medium">Pressure Tactics:</div>
                    <div className="space-y-1">
                      {level.tactics.map((tactic, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-purple-600">
                          <Crown className="h-3 w-3" />
                          <span>{tactic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Board Pressure Input Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hospital System *
            </label>
            <Input
              placeholder="e.g., Johns Hopkins, Mayo Clinic"
              value={boardData.hospitalSystem}
              onChange={(e) => setBoardData({...boardData, hospitalSystem: e.target.value})}
              data-testid="input-hospital-system-board"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Bill Amount *
            </label>
            <Input
              type="number"
              placeholder="250000"
              value={boardData.billAmount}
              onChange={(e) => setBoardData({...boardData, billAmount: e.target.value})}
              data-testid="input-bill-amount-board"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hospital Ownership Type
            </label>
            <Select value={boardData.hospitalOwnership} onValueChange={(value) => setBoardData({...boardData, hospitalOwnership: value})}>
              <SelectTrigger data-testid="select-hospital-ownership">
                <SelectValue placeholder="Select ownership" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="non-profit">Non-profit hospital</SelectItem>
                <SelectItem value="for-profit">For-profit hospital chain</SelectItem>
                <SelectItem value="academic">Academic medical center</SelectItem>
                <SelectItem value="government">Government/public hospital</SelectItem>
                <SelectItem value="religious">Religious/faith-based hospital</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Community Standing
            </label>
            <Select value={boardData.communityStanding} onValueChange={(value) => setBoardData({...boardData, communityStanding: value})}>
              <SelectTrigger data-testid="select-community-standing">
                <SelectValue placeholder="Select standing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prominent">Prominent community member</SelectItem>
                <SelectItem value="business">Local business owner</SelectItem>
                <SelectItem value="healthcare">Healthcare worker</SelectItem>
                <SelectItem value="public-servant">Educator/public servant</SelectItem>
                <SelectItem value="resident">Longtime community resident</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Media Story Potential
          </label>
          <Select value={boardData.mediaValue} onValueChange={(value) => setBoardData({...boardData, mediaValue: value})}>
            <SelectTrigger data-testid="select-media-value">
              <SelectValue placeholder="Select media potential" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High - dramatic story with media appeal</SelectItem>
              <SelectItem value="medium">Medium - concerning but not unique</SelectItem>
              <SelectItem value="low">Low - routine billing dispute</SelectItem>
              <SelectItem value="sensitive">Sensitive - prefer privacy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quality of Care Issues
          </label>
          <Textarea
            placeholder="Any care quality issues, errors, or complications that strengthen your case..."
            value={boardData.qualityConcerns}
            onChange={(e) => setBoardData({...boardData, qualityConcerns: e.target.value})}
            data-testid="textarea-quality-concerns"
          />
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={executeHospitalBoardPressure} 
            disabled={isEscalating} 
            className="flex-1 bg-purple-700 hover:bg-purple-800 text-white"
            data-testid="button-execute-board-pressure"
          >
            {isEscalating ? (
              <>
                <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                Escalating to Board...
              </>
            ) : (
              <>
                <Crown className="h-4 w-4 mr-2" />
                Execute Board Pressure Strategy
              </>
            )}
          </Button>
          {escalationLevel < 3 && (
            <Button 
              onClick={() => setEscalationLevel(escalationLevel + 1)} 
              variant="outline"
              data-testid="button-next-escalation"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Scale className="h-3 w-3 text-purple-600" />
            <span className="text-xs font-semibold text-purple-800">Fiduciary Duty</span>
          </div>
          <div className="text-xs text-purple-700">Board accountability & governance</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3 w-3 text-blue-600" />
            <span className="text-xs font-semibold text-blue-800">Community Pressure</span>
          </div>
          <div className="text-xs text-blue-700">Stakeholder coalition building</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="h-3 w-3 text-green-600" />
            <span className="text-xs font-semibold text-green-800">Executive Impact</span>
          </div>
          <div className="text-xs text-green-700">Performance & compensation leverage</div>
        </div>
      </div>
    </motion.div>
  );
}

// Main Industry Insider Strategies Container
export function IndustryInsiderStrategies({ onSendMessage }: InsiderStrategyProps) {
  const [activeStrategy, setActiveStrategy] = useState('chargemaster');

  const insiderStrategies = [
    { 
      id: 'chargemaster', 
      name: 'Charge Master Decoder', 
      icon: Vault, 
      component: ChargeMasterDecoder,
      description: 'Decode hospital pricing algorithms',
      savingsPotential: '$25K-$500K+'
    },
    { 
      id: 'revenue-cycle', 
      name: 'Revenue Cycle Exploiter', 
      icon: Target, 
      component: RevenueCycleExploiter,
      description: 'Exploit billing department weaknesses',
      savingsPotential: '$15K-$300K+'
    },
    { 
      id: 'board-pressure', 
      name: 'Hospital Board Pressure', 
      icon: Crown, 
      component: HospitalBoardPressure,
      description: 'Escalate to executives and boards',
      savingsPotential: '$50K-$1M+'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-red-600 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg">
            <Key className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Industry Insider Strategies</h2>
            <Badge className="bg-gradient-to-r from-purple-600 to-red-600 text-white text-xs">
              <Lock className="h-3 w-3 mr-1" />
              Insider Secrets
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto">
          Hospital industry insider secrets that reveal internal vulnerabilities and force massive bill reductions using professional exploitation strategies.
        </p>
      </div>

      {/* Strategy Selection Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {insiderStrategies.map((strategy) => (
          <button
            key={strategy.id}
            onClick={() => setActiveStrategy(strategy.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeStrategy === strategy.id
                ? 'bg-gradient-to-r from-purple-600 to-red-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            data-testid={`tab-${strategy.id}`}
          >
            <strategy.icon className="h-4 w-4" />
            <div className="text-left">
              <div>{strategy.name}</div>
              <div className="text-xs opacity-75">{strategy.savingsPotential}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Active Strategy Component */}
      <AnimatePresence mode="wait">
        {insiderStrategies.map((strategy) => {
          if (activeStrategy === strategy.id) {
            const StrategyComponent = strategy.component;
            return (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StrategyComponent onSendMessage={onSendMessage} />
              </motion.div>
            );
          }
          return null;
        })}
      </AnimatePresence>
    </div>
  );
}