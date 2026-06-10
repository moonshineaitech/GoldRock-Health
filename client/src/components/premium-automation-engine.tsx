import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { PremiumPaywallOverlay } from "./premium-paywall-overlay";
import { 
  Bot,
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle,
  Bell,
  Zap,
  Target,
  BarChart3,
  FileText,
  Users,
  DollarSign,
  Brain,
  Radar,
  Shield,
  TrendingUp,
  Settings,
  Play,
  Pause,
  RotateCw,
  ArrowRight,
  Sparkles,
  Crown,
  Database,
  Network,
  Eye,
  Filter,
  Search,
  Download,
  Share,
  MessageSquare,
  Phone,
  Mail,
  Building2,
  Scale,
  Gavel,
  Flame,
  Award,
  Star,
  BookOpen,
  Clipboard,
  CreditCard,
  PlusCircle
} from "lucide-react";

interface AutomationRule {
  id: string;
  name: string;
  type: 'monitoring' | 'follow-up' | 'reporting' | 'communication';
  status: 'active' | 'paused' | 'completed';
  trigger: string;
  action: string;
  schedule: string;
  nextRun: Date;
  lastRun?: Date;
  successRate: string;
  totalRuns: number;
  savingsGenerated: string;
}

interface AutomationEngineProps {
  onSendMessage: (message: string) => void;
}

export function PremiumAutomationEngine({ onSendMessage }: AutomationEngineProps) {
  const { isSubscribed } = useSubscription();
  const [activeTab, setActiveTab] = useState('monitoring');
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const { toast } = useToast();

  // Initialize with demo automation rules
  useEffect(() => {
    setAutomationRules([
      {
        id: 'recurring-auditor',
        name: 'Recurring Patient Bill Auditor',
        type: 'monitoring',
        status: 'active',
        trigger: 'New bill received for chronic conditions',
        action: 'Automatically scan for recurring billing errors',
        schedule: 'Real-time + Weekly review',
        nextRun: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        lastRun: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        successRate: '94%',
        totalRuns: 47,
        savingsGenerated: '$23,400'
      },
      {
        id: 'insurance-optimizer',
        name: 'Proactive Insurance Change Optimizer',
        type: 'monitoring',
        status: 'active',
        trigger: 'Annual enrollment period or major life changes',
        action: 'Analyze optimal insurance plan changes',
        schedule: 'Monthly + Life event triggers',
        nextRun: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        lastRun: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        successRate: '89%',
        totalRuns: 12,
        savingsGenerated: '$8,900'
      },
      {
        id: 'appeal-automation',
        name: '30-60-90 Day Appeal Automation',
        type: 'follow-up',
        status: 'active',
        trigger: 'Insurance denial or billing dispute filed',
        action: 'Automated deadline tracking and escalation',
        schedule: 'Multi-stage automated sequence',
        nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        lastRun: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        successRate: '86%',
        totalRuns: 23,
        savingsGenerated: '$34,600'
      },
      {
        id: 'monthly-report',
        name: 'Monthly Savings Report Generator',
        type: 'reporting',
        status: 'active',
        trigger: 'First day of each month',
        action: 'Generate comprehensive ROI and savings report',
        schedule: 'Monthly automated',
        nextRun: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        lastRun: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        successRate: '100%',
        totalRuns: 8,
        savingsGenerated: 'Analytics only'
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-700 bg-emerald-50';
      case 'paused': return 'text-amber-700 bg-amber-50';
      case 'completed': return 'text-muted-foreground bg-secondary';
      default: return 'text-muted-foreground bg-secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'monitoring': return Radar;
      case 'follow-up': return RotateCw;
      case 'reporting': return BarChart3;
      case 'communication': return MessageSquare;
      default: return Bot;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-sm border border-border relative overflow-hidden"
    >
      {!isSubscribed && (
        <PremiumPaywallOverlay
          title="Premium Automation Engine"
          description="Automated bill monitoring, follow-up sequences, and reporting that saves 20-40 hours per month"
          featureName="Automation Engine"
          savingsPotential="$5,000-$100,000+ annually"
        />
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-foreground font-serif">Premium Automation Engine</h3>
              <Badge className="bg-secondary text-foreground text-xs">
                <Crown className="h-3 w-3 mr-1" />
                Enterprise
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">24/7 automated bill monitoring • Save 20-40 hours/month</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <Card className="p-3">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{automationRules.filter(r => r.status === 'active').length}</div>
              <div className="text-xs text-muted-foreground">Active Rules</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-xl font-bold text-gold">${automationRules.reduce((sum, r) => sum + parseFloat(r.savingsGenerated.replace(/[$,]/g, '') || '0'), 0).toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Saved</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{automationRules.reduce((sum, r) => sum + r.totalRuns, 0)}</div>
              <div className="text-xs text-muted-foreground">Total Runs</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">89%</div>
              <div className="text-xs text-muted-foreground">Avg Success</div>
            </div>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="monitoring" className="text-xs">
              <Radar className="h-4 w-4 mr-1" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="follow-up" className="text-xs">
              <RotateCw className="h-4 w-4 mr-1" />
              Follow-Up
            </TabsTrigger>
            <TabsTrigger value="reporting" className="text-xs">
              <BarChart3 className="h-4 w-4 mr-1" />
              Reporting
            </TabsTrigger>
            <TabsTrigger value="management" className="text-xs">
              <Settings className="h-4 w-4 mr-1" />
              Manage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="space-y-4">
            <BillMonitoringSystem onSendMessage={onSendMessage} />
          </TabsContent>

          <TabsContent value="follow-up" className="space-y-4">
            <FollowUpSequences onSendMessage={onSendMessage} />
          </TabsContent>

          <TabsContent value="reporting" className="space-y-4">
            <ReportingAutomation onSendMessage={onSendMessage} />
          </TabsContent>

          <TabsContent value="management" className="space-y-4">
            <AutomationManagement rules={automationRules} onRuleUpdate={setAutomationRules} />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}

// Bill Monitoring System Component
function BillMonitoringSystem({ onSendMessage }: { onSendMessage: (message: string) => void }) {
  const [selectedMonitor, setSelectedMonitor] = useState<string>('');
  const [monitoringData, setMonitoringData] = useState({
    patientId: '',
    conditionType: '',
    familyMembers: '',
    currentPlan: '',
    monitoringFrequency: 'weekly'
  });

  const monitoringTypes = [
    {
      id: 'recurring-auditor',
      name: 'Recurring Patient Bill Auditor',
      description: 'Ongoing monitoring for patients with chronic conditions',
      icon: Target,
      features: ['Pattern recognition for recurring errors', 'Chronic condition billing optimization', 'Provider consistency tracking'],
      savings: '$5,000-$25,000 annually',
      automation: 'Real-time + Weekly deep scan'
    },
    {
      id: 'family-portfolio',
      name: 'Multi-Family Member Portfolio Manager',
      description: 'Coordinate strategies across family members',
      icon: Users,
      features: ['Family deductible optimization', 'Cross-member bill coordination', 'Dependent coverage maximization'],
      savings: '$3,000-$15,000 annually',
      automation: 'Daily monitoring + Monthly optimization'
    },
    {
      id: 'insurance-optimizer',
      name: 'Proactive Insurance Change Optimizer',
      description: 'Alert when to change plans for maximum benefit',
      icon: Shield,
      features: ['Annual enrollment optimization', 'Life event triggered analysis', 'Plan switching recommendations'],
      savings: '$2,000-$20,000 annually',
      automation: 'Quarterly analysis + Event triggers'
    },
    {
      id: 'pattern-recognition',
      name: 'Bill Pattern Recognition Engine',
      description: 'Identify recurring billing errors automatically',
      icon: Brain,
      features: ['AI pattern detection', 'Provider error profiling', 'Predictive billing alerts'],
      savings: '$1,500-$30,000 annually',
      automation: 'Continuous learning + Real-time alerts'
    }
  ];

  const setupMonitoring = () => {
    const monitor = monitoringTypes.find(m => m.id === selectedMonitor);
    if (!monitor) return;

    const prompt = `I want to set up the ${monitor.name} automation system. This premium automation feature provides ${monitor.automation} and can save ${monitor.savings}.

SETUP DETAILS:
- Patient ID: ${monitoringData.patientId}
- Condition Type: ${monitoringData.conditionType}
- Family Members: ${monitoringData.familyMembers}
- Current Insurance Plan: ${monitoringData.currentPlan}
- Monitoring Frequency: ${monitoringData.monitoringFrequency}

KEY FEATURES TO ACTIVATE:
${monitor.features.map(f => `• ${f}`).join('\n')}

Please create a comprehensive automation setup that will:
1. Establish baseline patterns for this specific patient/family situation
2. Set up real-time monitoring triggers and alerts
3. Create automated workflows for detected issues
4. Generate proactive recommendations and interventions
5. Track performance metrics and savings optimization

This should be a professional-grade automation system that continuously monitors and optimizes medical billing for maximum savings and error prevention.`;

    onSendMessage(prompt);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {monitoringTypes.map((monitor) => {
          const Icon = monitor.icon;
          return (
            <Card 
              key={monitor.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedMonitor === monitor.id ? 'ring-2 ring-[color:var(--gold)] bg-secondary' : ''
              }`}
              onClick={() => setSelectedMonitor(monitor.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{monitor.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{monitor.description}</p>
                    <Badge className="bg-secondary text-foreground text-xs">
                      {monitor.savings}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedMonitor && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border border-border rounded-xl p-4 bg-secondary"
        >
          <h4 className="font-semibold mb-3 text-foreground">Setup Monitoring Parameters</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Patient ID or Name"
              value={monitoringData.patientId}
              onChange={(e) => setMonitoringData({...monitoringData, patientId: e.target.value})}
            />
            <Input
              placeholder="Condition Type (e.g., Diabetes, Heart Disease)"
              value={monitoringData.conditionType}
              onChange={(e) => setMonitoringData({...monitoringData, conditionType: e.target.value})}
            />
            <Input
              placeholder="Family Members Count"
              value={monitoringData.familyMembers}
              onChange={(e) => setMonitoringData({...monitoringData, familyMembers: e.target.value})}
            />
            <Select value={monitoringData.currentPlan} onValueChange={(value) => setMonitoringData({...monitoringData, currentPlan: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Current Insurance Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hmo">HMO</SelectItem>
                <SelectItem value="ppo">PPO</SelectItem>
                <SelectItem value="epo">EPO</SelectItem>
                <SelectItem value="hdhp">High Deductible Health Plan</SelectItem>
                <SelectItem value="medicare">Medicare</SelectItem>
                <SelectItem value="medicaid">Medicaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={setupMonitoring}
            className="mt-4 bg-primary text-primary-foreground"
            data-testid="button-setup-monitoring"
          >
            <Play className="h-4 w-4 mr-2" />
            Activate Automated Monitoring
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// Follow-Up Sequences Component
function FollowUpSequences({ onSendMessage }: { onSendMessage: (message: string) => void }) {
  const [selectedSequence, setSelectedSequence] = useState<string>('');
  const [sequenceData, setSequenceData] = useState({
    caseType: '',
    urgencyLevel: 'standard',
    contactPreference: 'email',
    escalationTrigger: '30days'
  });

  const sequenceTypes = [
    {
      id: 'appeal-automation',
      name: '30-60-90 Day Appeal Automation',
      description: 'Automated deadlines and reminder sequences',
      icon: Calendar,
      stages: ['Initial submission tracking', '30-day follow-up automation', '60-day escalation trigger', '90-day final appeal'],
      successRate: '86%',
      timeframe: '90 days automated'
    },
    {
      id: 'pressure-campaign',
      name: 'Insurance Company Pressure Campaign',
      description: 'Systematic escalation automation',
      icon: TrendingUp,
      stages: ['Professional inquiry', 'Regulatory reference', 'Legal precedent citing', 'Complaint filing threat'],
      successRate: '79%',
      timeframe: '45 days automated'
    },
    {
      id: 'payment-negotiation',
      name: 'Provider Payment Plan Negotiation Bot',
      description: 'Automated payment arrangement workflows',
      icon: CreditCard,
      stages: ['Hardship documentation', 'Plan proposal generation', 'Counter-offer automation', 'Agreement finalization'],
      successRate: '91%',
      timeframe: '21 days automated'
    },
    {
      id: 'collections-response',
      name: 'Collections Agency Response Automation',
      description: 'Systematic debt validation responses',
      icon: Scale,
      stages: ['Debt validation request', 'Documentation challenge', 'Compliance monitoring', 'Legal protection activation'],
      successRate: '83%',
      timeframe: '60 days automated'
    }
  ];

  const launchSequence = () => {
    const sequence = sequenceTypes.find(s => s.id === selectedSequence);
    if (!sequence) return;

    const prompt = `I want to launch the ${sequence.name} automated follow-up sequence. This premium automation has a ${sequence.successRate} success rate and runs for ${sequence.timeframe}.

SEQUENCE PARAMETERS:
- Case Type: ${sequenceData.caseType}
- Urgency Level: ${sequenceData.urgencyLevel}
- Contact Preference: ${sequenceData.contactPreference}
- Escalation Trigger: ${sequenceData.escalationTrigger}

AUTOMATED STAGES TO EXECUTE:
${sequence.stages.map((stage, index) => `${index + 1}. ${stage}`).join('\n')}

Please create a comprehensive automated sequence that will:
1. Set up all automated triggers and deadlines
2. Generate professional communications for each stage
3. Monitor responses and adjust tactics automatically
4. Escalate appropriately when thresholds are met
5. Track progress and success metrics throughout

This should be a fully automated system that handles the entire follow-up process with minimal manual intervention while maximizing success rates.`;

    onSendMessage(prompt);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sequenceTypes.map((sequence) => {
          const Icon = sequence.icon;
          return (
            <Card 
              key={sequence.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedSequence === sequence.id ? 'ring-2 ring-[color:var(--gold)] bg-secondary' : ''
              }`}
              onClick={() => setSelectedSequence(sequence.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{sequence.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{sequence.description}</p>
                    <div className="flex space-x-2">
                      <Badge className="bg-emerald-50 text-emerald-700 text-xs">
                        {sequence.successRate} Success
                      </Badge>
                      <Badge className="bg-secondary text-muted-foreground text-xs">
                        {sequence.timeframe}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedSequence && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border border-border rounded-xl p-4 bg-secondary"
        >
          <h4 className="font-semibold mb-3 text-foreground">Configure Automation Sequence</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Case Type (e.g., Insurance Denial, Hospital Bill)"
              value={sequenceData.caseType}
              onChange={(e) => setSequenceData({...sequenceData, caseType: e.target.value})}
            />
            <Select value={sequenceData.urgencyLevel} onValueChange={(value) => setSequenceData({...sequenceData, urgencyLevel: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Urgency Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sequenceData.contactPreference} onValueChange={(value) => setSequenceData({...sequenceData, contactPreference: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Contact Preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email Only</SelectItem>
                <SelectItem value="phone">Phone Calls</SelectItem>
                <SelectItem value="mail">Postal Mail</SelectItem>
                <SelectItem value="mixed">Mixed Methods</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sequenceData.escalationTrigger} onValueChange={(value) => setSequenceData({...sequenceData, escalationTrigger: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Escalation Trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15days">15 Days No Response</SelectItem>
                <SelectItem value="30days">30 Days No Response</SelectItem>
                <SelectItem value="45days">45 Days No Response</SelectItem>
                <SelectItem value="immediate">Immediate Escalation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={launchSequence}
            className="mt-4 bg-primary text-primary-foreground"
            data-testid="button-launch-sequence"
          >
            <Zap className="h-4 w-4 mr-2" />
            Launch Automated Sequence
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// Reporting Automation Component
function ReportingAutomation({ onSendMessage }: { onSendMessage: (message: string) => void }) {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [reportData, setReportData] = useState({
    reportPeriod: 'monthly',
    includeFamily: true,
    detailLevel: 'comprehensive',
    deliveryMethod: 'email'
  });

  const reportTypes = [
    {
      id: 'monthly-savings',
      name: 'Monthly Savings Report Generator',
      description: 'Automated ROI reporting for premium users',
      icon: BarChart3,
      includes: ['Total savings achieved', 'ROI on premium subscription', 'Time saved through automation', 'Success rate analytics'],
      frequency: 'Monthly automated delivery',
      value: 'Track your financial wins'
    },
    {
      id: 'tax-compiler',
      name: 'Tax Season Medical Deduction Compiler',
      description: 'Automated tax documentation',
      icon: FileText,
      includes: ['Deductible medical expenses', 'Mileage for medical trips', 'Insurance premium documentation', 'HSA/FSA optimization'],
      frequency: 'Annual + Quarterly updates',
      value: 'Maximize tax savings'
    },
    {
      id: 'insurance-optimization',
      name: 'Annual Insurance Plan Optimization Report',
      description: 'Yearly strategy recommendations',
      icon: Shield,
      includes: ['Plan comparison analysis', 'Network optimization opportunities', 'Benefit utilization review', 'Cost projection modeling'],
      frequency: 'Annual + Life event triggers',
      value: 'Optimize coverage strategy'
    },
    {
      id: 'portfolio-analytics',
      name: 'Portfolio Performance Analytics',
      description: 'Track success across multiple bills/family',
      icon: TrendingUp,
      includes: ['Multi-bill success tracking', 'Family member coordination', 'Provider performance analysis', 'Trend identification'],
      frequency: 'Real-time + Monthly summaries',
      value: 'Comprehensive oversight'
    }
  ];

  const generateReport = () => {
    const report = reportTypes.find(r => r.id === selectedReport);
    if (!report) return;

    const prompt = `I want to generate a ${report.name} using the premium automation system. This ${report.frequency} provides ${report.value}.

REPORT CONFIGURATION:
- Report Period: ${reportData.reportPeriod}
- Include Family Members: ${reportData.includeFamily ? 'Yes' : 'No'}
- Detail Level: ${reportData.detailLevel}
- Delivery Method: ${reportData.deliveryMethod}

REPORT SECTIONS TO INCLUDE:
${report.includes.map(section => `• ${section}`).join('\n')}

Please generate a comprehensive automated report that includes:
1. Executive summary with key metrics and achievements
2. Detailed financial analysis with savings breakdown
3. Performance trending and comparative analytics
4. Actionable recommendations for continued optimization
5. Automated insights and pattern recognition findings

This should be a professional-grade report suitable for personal financial planning and demonstrating the value of premium automation services.`;

    onSendMessage(prompt);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card 
              key={report.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedReport === report.id ? 'ring-2 ring-[color:var(--gold)] bg-secondary' : ''
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{report.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                    <Badge className="bg-secondary text-muted-foreground text-xs">
                      {report.value}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedReport && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border border-border rounded-xl p-4 bg-secondary"
        >
          <h4 className="font-semibold mb-3 text-foreground">Configure Report Generation</h4>
          <div className="grid grid-cols-2 gap-4">
            <Select value={reportData.reportPeriod} onValueChange={(value) => setReportData({...reportData, reportPeriod: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Report Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
            <Select value={reportData.detailLevel} onValueChange={(value) => setReportData({...reportData, detailLevel: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Detail Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Executive Summary</SelectItem>
                <SelectItem value="standard">Standard Detail</SelectItem>
                <SelectItem value="comprehensive">Comprehensive</SelectItem>
                <SelectItem value="expert">Expert Analysis</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2 col-span-2">
              <Switch 
                checked={reportData.includeFamily} 
                onCheckedChange={(checked) => setReportData({...reportData, includeFamily: checked})}
              />
              <label className="text-sm text-foreground">Include family member data</label>
            </div>
          </div>
          <Button 
            onClick={generateReport}
            className="mt-4 bg-primary text-primary-foreground"
            data-testid="button-generate-report"
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Automated Report
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// Automation Management Component
function AutomationManagement({ rules, onRuleUpdate }: { rules: AutomationRule[], onRuleUpdate: (rules: AutomationRule[]) => void }) {
  const toggleRuleStatus = (ruleId: string) => {
    const updatedRules = rules.map(rule => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          status: rule.status === 'active' ? 'paused' : 'active' as any
        };
      }
      return rule;
    });
    onRuleUpdate(updatedRules);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-foreground">Active Automation Rules</h4>
        <Button size="sm" variant="outline">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      {rules.map((rule) => {
        const TypeIcon = rule.type === 'monitoring' ? Radar :
                        rule.type === 'follow-up' ? RotateCw :
                        rule.type === 'reporting' ? BarChart3 : MessageSquare;
        
        return (
          <Card key={rule.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                  <TypeIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-semibold text-foreground">{rule.name}</h5>
                    <Badge className={getStatusColor(rule.status)}>
                      {rule.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{rule.action}</p>
                  <div className="text-xs text-muted-foreground">
                    Runs: {rule.totalRuns} • Success: {rule.successRate} • Saved: {rule.savingsGenerated}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleRuleStatus(rule.id)}
                  data-testid={`button-toggle-${rule.id}`}
                >
                  {rule.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'text-emerald-700 bg-emerald-50';
    case 'paused': return 'text-amber-700 bg-amber-50';
    case 'completed': return 'text-muted-foreground bg-secondary';
    default: return 'text-muted-foreground bg-secondary';
  }
}