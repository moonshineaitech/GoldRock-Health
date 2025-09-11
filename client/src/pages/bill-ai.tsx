import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Brain, 
  Send, 
  Paperclip, 
  Bot,
  AlertTriangle,
  Shield,
  Loader2,
  FileEdit,
  Plus,
  MessageCircle,
  Camera,
  Info,
  BarChart3,
  CheckCircle,
  Circle,
  DollarSign,
  Building2,
  Calendar,
  FileText,
  ClipboardList,
  Crown,
  Lock,
  Copy,
  Download,
  Share,
  ChevronDown,
  Zap,
  Target,
  Sparkles,
  Settings,
  List,
  Filter,
  Star,
  Stethoscope,
  Network,
  Radar,
  HeartHandshake,
  Database,
  Pill,
  Siren,
  XCircle,
  ArrowRight
} from "lucide-react";
import { MobileLayout } from "@/components/mobile-layout";
import type { MedicalBill } from "@shared/schema";
import { BILL_AI_WORKFLOWS, type BillWorkflow, type WorkflowField } from "@shared/bill-ai-workflows";
import { 
  DisputeLetterGenerator, 
  ErrorDetectionChecklist, 
  BillingRightsAdvisor, 
  ClaimAppealGenerator,
  AdvancedAppealGenerator,
  MedicalNecessityBuilder
} from "@/components/bill-ai-features";
import { SuperiorAnalysisTools } from "@/components/superior-analysis-tools";
import { IndustryInsiderStrategies } from "@/components/industry-insider-strategies";
import { BillAnalysisLoader } from "@/components/BillAnalysisLoader";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { PremiumFeatureShowcase } from "@/components/PremiumFeatureShowcase";
import { MedicalCodeAnalyzer } from "@/components/medical-code-analyzer";
import { EnhancedProgressTracker } from "@/components/enhanced-progress-tracker";
import { AdvancedErrorDetector } from "@/components/advanced-error-detector";
import { ProfessionalWorkflowSuite } from "@/components/professional-workflow-suite";
import { PremiumAutomationEngine } from "@/components/premium-automation-engine";
import { PremiumTemplatesLibrary } from "@/components/premium-templates-library";
import { HospitalBillsIntelligenceDatabase } from "@/components/hospital-bills-intelligence-database";
import { InsuranceClaimsDatabase } from "@/components/insurance-claims-database";
import { InsuranceDenialsIntelligence } from "@/components/insurance-denials-intelligence";
import { EmergencyCareBillingDatabase } from "@/components/emergency-care-billing-database";
import { SpecialtyCareIntelligence } from "@/components/specialty-care-intelligence";
import { PharmaceuticalDeviceDatabase } from "@/components/pharmaceutical-device-database";
import { Link } from "wouter";
import { OptionalIntakePopup } from "@/components/OptionalIntakePopup";
import { RunAnotherWorkflow } from "@/components/RunAnotherWorkflow";

interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface IntakeState {
  amount?: string;
  provider?: string;
  dates?: string;
  insurance?: string;
  codes?: string;
  itemizedBill?: boolean;
  cptCodes?: string[];
  hcpcsCodes?: string[];
  icdCodes?: string[];
  lastUpdated?: Date;
}

interface AssessmentIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  savingsPotential?: string;
}

type NextRequiredField = 'amount' | 'provider' | 'dates' | 'insurance' | 'codes' | 'itemized' | 'complete';

// Workflow Selection Panel Component
const WorkflowSelectionPanel = ({ onWorkflowSelect, onStartChat }: {
  onWorkflowSelect: (workflow: BillWorkflow) => void;
  onStartChat: () => void;
}) => {
  const { isSubscribed } = useSubscription();
  
  // Add missing state variables for database visibility
  const [showHospitalBillsDatabase, setShowHospitalBillsDatabase] = useState(false);
  const [showInsuranceClaimsDatabase, setShowInsuranceClaimsDatabase] = useState(false);
  const [showInsuranceDenialsIntelligence, setShowInsuranceDenialsIntelligence] = useState(false);
  const [showEmergencyCareBillingDatabase, setShowEmergencyCareBillingDatabase] = useState(false);
  const [showSpecialtyCareIntelligence, setShowSpecialtyCareIntelligence] = useState(false);
  const [showPharmaceuticalDeviceDatabase, setShowPharmaceuticalDeviceDatabase] = useState(false);
  
  const coreWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'core');
  const beginnerWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'beginner');
  const specialtyWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'specialty');
  const insuranceWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'insurance');
  const emergencyWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'emergency');
  const financialWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'financial');
  const legalWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'legal');
  const appealSystemWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'appeal-system');
  const denialReversalWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'denial-reversal');
  const coverageExpansionWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'coverage-expansion');
  const insuranceIntelligenceWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'insurance-intelligence');
  const automatedToolsWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'automated-tools');
  
  // NEW PREMIUM CATEGORIES
  const hospitalInsiderWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'hospital-insider');
  const codingIntelligenceWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'coding-intelligence');
  const hardshipMasteryWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'hardship-mastery');
  const reportingSuiteWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'reporting-suite');
  const financialModelingWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'financial-modeling');
  const dataIntelligenceWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'data-intelligence');

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 lg:space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl lg:text-3xl font-bold text-gray-900">Medical Bill AI</h1>
            <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Exceeds HIPAA Standards
            </Badge>
          </div>
        </div>
        <p className="text-sm lg:text-lg text-gray-600 max-w-md lg:max-w-2xl mx-auto">
          Professional-grade bill analysis and advocacy. Professional AI-powered dispute templates.
        </p>
        <div className="flex items-center justify-center gap-4 lg:gap-8 text-xs lg:text-sm">
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3 text-emerald-600" />
            <span className="text-gray-600">AI-Powered Analysis</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-emerald-600" />
            <span className="text-gray-600">Advanced Technology</span>
          </div>
        </div>
      </div>

      {/* Core Workflows */}
      <div className="space-y-3 lg:space-y-4">
        <h3 className="text-sm lg:text-base font-semibold text-gray-900 flex items-center gap-2">
          <Sparkles className="h-4 w-4 lg:h-5 lg:w-5 text-emerald-600" />
          Essential Workflows
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
          {coreWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onClick={() => onWorkflowSelect(workflow)}
            />
          ))}
        </div>
      </div>

      {/* Beginner-Friendly Workflows */}
      {beginnerWorkflows.length > 0 && (
        <div className="space-y-3 lg:space-y-4">
          <h3 className="text-sm lg:text-base font-semibold text-gray-900 flex items-center gap-2">
            <Star className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-600" />
            Getting Started (Perfect for First-Time Users)
          </h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 lg:p-6 mb-3">
            <p className="text-xs lg:text-sm text-yellow-800 text-center">
              🎓 New to medical bill analysis? Start here! These beginner-friendly tools help you learn step-by-step.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 lg:gap-3">
            {beginnerWorkflows.slice(0, 4).map((workflow) => (
              <WorkflowListItem
                key={workflow.id}
                workflow={workflow}
                onClick={() => onWorkflowSelect(workflow)}
              />
            ))}
          </div>
          {beginnerWorkflows.length > 4 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-yellow-700 border-yellow-200 hover:bg-yellow-50"
              onClick={() => {}}
            >
              View All {beginnerWorkflows.length} Beginner Tools
            </Button>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={onStartChat}
          variant="outline"
          size="sm"
          className="h-12 flex-col space-y-1 rounded-2xl border-gray-200"
          data-testid="start-chat-button"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">Start Chat</span>
        </Button>
        <Link href="/blitz-demo" className="w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-12 flex-col space-y-1 rounded-2xl border-orange-200 text-orange-600 hover:bg-orange-50"
            data-testid="blitz-demo-button"
          >
            <Zap className="h-4 w-4" />
            <span className="text-xs">Blitz Demo</span>
          </Button>
        </Link>
        <Button
          onClick={() => {}}
          variant="outline"
          size="sm"
          className="h-12 flex-col space-y-1 rounded-2xl border-gray-200"
          data-testid="view-all-workflows"
        >
          <Plus className="h-4 w-4" />
          <span className="text-xs">All Tools</span>
        </Button>
      </div>

      {/* Comprehensive Workflow Categories */}
      <div className="space-y-4">
        {/* Specialty Analysis */}
        {specialtyWorkflows.length > 0 && (
          <WorkflowCategory
            title="Specialty Analysis"
            icon={AlertTriangle}
            iconColor="text-blue-600"
            workflows={specialtyWorkflows}
            onWorkflowSelect={onWorkflowSelect}
            maxVisible={3}
          />
        )}

        {/* Insurance Appeals */}
        {insuranceWorkflows.length > 0 && (
          <WorkflowCategory
            title="Insurance Appeals"
            icon={Shield}
            iconColor="text-indigo-600"
            workflows={insuranceWorkflows}
            onWorkflowSelect={onWorkflowSelect}
            maxVisible={3}
          />
        )}

        {/* Financial Assistance */}
        {financialWorkflows.length > 0 && (
          <WorkflowCategory
            title="Financial Assistance"
            icon={DollarSign}
            iconColor="text-green-600"
            workflows={financialWorkflows}
            onWorkflowSelect={onWorkflowSelect}
            maxVisible={3}
          />
        )}

        {/* Legal & Disputes */}
        {legalWorkflows.length > 0 && (
          <WorkflowCategory
            title="Legal & Disputes"
            icon={FileText}
            iconColor="text-purple-600"
            workflows={legalWorkflows}
            onWorkflowSelect={onWorkflowSelect}
            maxVisible={3}
          />
        )}

        {/* Emergency Bills */}
        {emergencyWorkflows.length > 0 && (
          <WorkflowCategory
            title="Emergency Bills"
            icon={AlertTriangle}
            iconColor="text-red-600"
            workflows={emergencyWorkflows}
            onWorkflowSelect={onWorkflowSelect}
            maxVisible={2}
          />
        )}

        {/* PREMIUM INSURANCE ADVOCACY SUITE */}
        
        {/* Hospital Industry Insider Knowledge */}
        {hospitalInsiderWorkflows.length > 0 && (
          <>
            <div className="bg-gradient-to-r from-purple-50 to-red-50 border border-purple-200 rounded-2xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-bold text-purple-800">Hospital Industry Insider Secrets</span>
                <Badge className="bg-purple-600 text-white text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  Premium Only
                </Badge>
              </div>
              <p className="text-xs text-purple-700 mb-2">
                🏥 Insider knowledge from hospital revenue departments. Secrets they don't want you to know!
              </p>
              <div className="text-xs text-purple-600 space-y-1">
                <div>• Charge master pricing algorithm decoder</div>
                <div>• Revenue cycle vulnerability exploitation</div>
                <div>• Hospital board pressure tactics</div>
              </div>
            </div>
            <WorkflowCategory
              title="🔓 Hospital Insider Secrets (Professional Analysis)"
              icon={Shield}
              iconColor="text-purple-700"
              workflows={hospitalInsiderWorkflows}
              onWorkflowSelect={onWorkflowSelect}
              maxVisible={3}
            />
          </>
        )}

        {/* Medical Coding Intelligence */}
        {codingIntelligenceWorkflows.length > 0 && (
          <>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-800">Medical Coding Intelligence</span>
                <Badge className="bg-emerald-600 text-white text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Expert Level
                </Badge>
              </div>
              <p className="text-xs text-emerald-700 mb-2">
                🧬 Professional coding analysis that catches fraud worth $20-200 billion annually
              </p>
              <div className="text-xs text-emerald-600 space-y-1">
                <div>• Upcoding fraud detection & reversal</div>
                <div>• Bundling error profit recapture</div>
                <div>• Medical necessity challenges</div>
              </div>
            </div>
            <WorkflowCategory
              title="🧬 Medical Coding Intelligence (Advanced Technology)"
              icon={Brain}
              iconColor="text-emerald-700"
              workflows={codingIntelligenceWorkflows}
              onWorkflowSelect={onWorkflowSelect}
              maxVisible={3}
            />
          </>
        )}

        {/* Financial Hardship Mastery */}
        {hardshipMasteryWorkflows.length > 0 && (
          <>
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-2xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <HeartHandshake className="h-4 w-4 text-pink-600" />
                <span className="text-sm font-bold text-pink-800">Financial Hardship Mastery</span>
                <Badge className="bg-pink-600 text-white text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Professional Tools
                </Badge>
              </div>
              <p className="text-xs text-pink-700 mb-2">
                💝 Professional strategies to qualify for maximum charity care and financial assistance
              </p>
              <div className="text-xs text-pink-600 space-y-1">
                <div>• Charity care qualification optimization</div>
                <div>• Asset protection while claiming hardship</div>
                <div>• Income documentation engineering</div>
              </div>
            </div>
            <WorkflowCategory
              title="💝 Financial Hardship Mastery (Professional Methods)"
              icon={HeartHandshake}
              iconColor="text-pink-700"
              workflows={hardshipMasteryWorkflows}
              onWorkflowSelect={onWorkflowSelect}
              maxVisible={3}
            />
          </>
        )}
        
        {/* Advanced Appeal System */}
        {appealSystemWorkflows.length > 0 && (
          <WorkflowCategory
            title="🏆 Advanced Appeal System (Advanced Analysis)"
            icon={CheckCircle}
            iconColor="text-emerald-700"
            workflows={appealSystemWorkflows}
            onWorkflowSelect={onWorkflowSelect}
            maxVisible={2}
          />
        )}

        {/* Denial Reversal Arsenal */}
        {denialReversalWorkflows.length > 0 && (
          <WorkflowCategory
            title="💊 Denial Reversal Arsenal (Professional Methods)"
            icon={Stethoscope}
            iconColor="text-blue-700"
            workflows={denialReversalWorkflows}
            onWorkflowSelect={onWorkflowSelect}
            maxVisible={2}
          />
        )}

        {/* Coverage Expansion Strategies */}
        {coverageExpansionWorkflows.length > 0 && (
          <WorkflowCategory
            title="🌐 Coverage Expansion Strategies (Comprehensive Tools)"
            icon={Network}
            iconColor="text-teal-700"
            workflows={coverageExpansionWorkflows}
            onWorkflowSelect={onWorkflowSelect}
            maxVisible={2}
          />
        )}

        {/* Premium Insurance Intelligence */}
        {insuranceIntelligenceWorkflows.length > 0 && (
          <WorkflowCategory
            title="🕵️ Insurance Intelligence Database (Insider Knowledge)"
            icon={Radar}
            iconColor="text-indigo-700"
            workflows={insuranceIntelligenceWorkflows}
            onWorkflowSelect={onWorkflowSelect}
            maxVisible={2}
          />
        )}

        {/* Automated Insurance Tools */}
        {automatedToolsWorkflows.length > 0 && (
          <WorkflowCategory
            title="⚙️ Automated Insurance Tools (Automation Suite)"
            icon={Settings}
            iconColor="text-purple-700"
            workflows={automatedToolsWorkflows}
            onWorkflowSelect={onWorkflowSelect}
            maxVisible={2}
          />
        )}

        {/* PREMIUM INSIGHT DATABASES */}
        {isSubscribed && (
          <>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-800">Premium Insight Databases</span>
                <Badge className="bg-blue-600 text-white text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Exclusive Intelligence
                </Badge>
              </div>
              <p className="text-xs text-blue-700 mb-2">
                🎯 Comprehensive billing intelligence databases with insider knowledge, proven strategies, and massive savings potential.
              </p>
              <div className="text-xs text-blue-600 space-y-1">
                <div>• Hospital billing patterns & vulnerabilities</div>
                <div>• Insurance company tactics & countermeasures</div>
                <div>• Emergency care billing protections</div>
                <div>• Specialty care & pharmaceutical intelligence</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-600" />
                Premium Intelligence Databases (Exclusive Access)
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setShowHospitalBillsDatabase(!showHospitalBillsDatabase)}
                  variant="outline"
                  className="h-20 p-3 flex-col space-y-2 text-left justify-start rounded-2xl border-blue-200 hover:shadow-lg transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50"
                  data-testid="hospital-bills-database"
                >
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <div className="text-center w-full">
                    <div className="text-xs font-semibold text-gray-900">Hospital Bills Intelligence</div>
                    <div className="text-xs text-gray-600 truncate">Insider billing patterns</div>
                  </div>
                </Button>

                <Button
                  onClick={() => setShowInsuranceClaimsDatabase(!showInsuranceClaimsDatabase)}
                  variant="outline"
                  className="h-20 p-3 flex-col space-y-2 text-left justify-start rounded-2xl border-indigo-200 hover:shadow-lg transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                  data-testid="insurance-claims-database"
                >
                  <Shield className="h-5 w-5 text-indigo-600" />
                  <div className="text-center w-full">
                    <div className="text-xs font-semibold text-gray-900">Insurance Claims Database</div>
                    <div className="text-xs text-gray-600 truncate">Company-specific tactics</div>
                  </div>
                </Button>

                <Button
                  onClick={() => setShowInsuranceDenialsIntelligence(!showInsuranceDenialsIntelligence)}
                  variant="outline"
                  className="h-20 p-3 flex-col space-y-2 text-left justify-start rounded-2xl border-red-200 hover:shadow-lg transition-all duration-200 hover:border-red-300 hover:bg-red-50/50"
                  data-testid="insurance-denials-intelligence"
                >
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div className="text-center w-full">
                    <div className="text-xs font-semibold text-gray-900">Insurance Denials Intelligence</div>
                    <div className="text-xs text-gray-600 truncate">Reversal strategies</div>
                  </div>
                </Button>

                <Button
                  onClick={() => setShowEmergencyCareBillingDatabase(!showEmergencyCareBillingDatabase)}
                  variant="outline"
                  className="h-20 p-3 flex-col space-y-2 text-left justify-start rounded-2xl border-orange-200 hover:shadow-lg transition-all duration-200 hover:border-orange-300 hover:bg-orange-50/50"
                  data-testid="emergency-care-billing-database"
                >
                  <Siren className="h-5 w-5 text-orange-600" />
                  <div className="text-center w-full">
                    <div className="text-xs font-semibold text-gray-900">Emergency Care Database</div>
                    <div className="text-xs text-gray-600 truncate">No Surprises Act tactics</div>
                  </div>
                </Button>

                <Button
                  onClick={() => setShowSpecialtyCareIntelligence(!showSpecialtyCareIntelligence)}
                  variant="outline"
                  className="h-20 p-3 flex-col space-y-2 text-left justify-start rounded-2xl border-purple-200 hover:shadow-lg transition-all duration-200 hover:border-purple-300 hover:bg-purple-50/50"
                  data-testid="specialty-care-intelligence"
                >
                  <Stethoscope className="h-5 w-5 text-purple-600" />
                  <div className="text-center w-full">
                    <div className="text-xs font-semibold text-gray-900">Specialty Care Intelligence</div>
                    <div className="text-xs text-gray-600 truncate">High-cost procedures</div>
                  </div>
                </Button>

                <Button
                  onClick={() => setShowPharmaceuticalDeviceDatabase(!showPharmaceuticalDeviceDatabase)}
                  variant="outline"
                  className="h-20 p-3 flex-col space-y-2 text-left justify-start rounded-2xl border-green-200 hover:shadow-lg transition-all duration-200 hover:border-green-300 hover:bg-green-50/50"
                  data-testid="pharmaceutical-device-database"
                >
                  <Pill className="h-5 w-5 text-green-600" />
                  <div className="text-center w-full">
                    <div className="text-xs font-semibold text-gray-900">Pharmaceutical & Device Database</div>
                    <div className="text-xs text-gray-600 truncate">Drug & device pricing</div>
                  </div>
                </Button>
              </div>
            </div>
            </>
          )}

          {/* Premium Discovery Section for Non-Subscribers */}
          {!isSubscribed && (
            <>
              <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border border-amber-200 rounded-2xl p-4 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-bold text-amber-800">Unlock Premium Intelligence Tools</span>
                  <Badge className="bg-amber-600 text-white text-xs">
                    <Lock className="h-3 w-3 mr-1" />
                    Premium Only
                  </Badge>
                </div>
                <p className="text-xs text-amber-700 mb-3">
                  🚀 Access 6 comprehensive intelligence databases and 100+ professional workflows that have saved users $10K-$500K+ per bill.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-amber-700 mb-3">
                  <div>• Hospital Insider Secrets</div>
                  <div>• Insurance Company Tactics</div>
                  <div>• Emergency Care Protections</div>
                  <div>• Pharmaceutical Intelligence</div>
                  <div>• Professional Dispute Templates</div>
                  <div>• Automated Analysis Tools</div>
                </div>
                <Link href="/premium" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg" size="sm">
                    <Crown className="h-4 w-4 mr-2" />
                    Unlock All Premium Tools - Save $10K+
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Database className="h-4 w-4 text-amber-600" />
                  Premium Intelligence Databases (Preview)
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/premium" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-20 p-3 flex-col space-y-2 text-left justify-start rounded-2xl border-blue-200 hover:shadow-lg transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50 relative"
                      data-testid="preview-hospital-bills-database"
                    >
                      <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                        $50K+ Avg
                      </div>
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <div className="text-center w-full">
                        <div className="text-xs font-semibold text-gray-900">Hospital Bills Intelligence</div>
                        <div className="text-xs text-gray-600 truncate">500+ hospital insider secrets</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/premium" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-20 p-3 flex-col space-y-2 text-left justify-start rounded-2xl border-indigo-200 hover:shadow-lg transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50/50 relative"
                      data-testid="preview-insurance-claims-database"
                    >
                      <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                        $35K+ Avg
                      </div>
                      <Shield className="h-5 w-5 text-indigo-600" />
                      <div className="text-center w-full">
                        <div className="text-xs font-semibold text-gray-900">Insurance Claims Database</div>
                        <div className="text-xs text-gray-600 truncate">Company-specific tactics</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/premium" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-20 p-3 flex-col space-y-2 text-left justify-start rounded-2xl border-red-200 hover:shadow-lg transition-all duration-200 hover:border-red-300 hover:bg-red-50/50 relative"
                      data-testid="preview-insurance-denials-intelligence"
                    >
                      <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                        $75K+ Avg
                      </div>
                      <XCircle className="h-5 w-5 text-red-600" />
                      <div className="text-center w-full">
                        <div className="text-xs font-semibold text-gray-900">Denial Reversal Intelligence</div>
                        <div className="text-xs text-gray-600 truncate">92% success rate</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/premium" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-20 p-3 flex-col space-y-2 text-left justify-start rounded-2xl border-orange-200 hover:shadow-lg transition-all duration-200 hover:border-orange-300 hover:bg-orange-50/50 relative"
                      data-testid="preview-emergency-care-billing-database"
                    >
                      <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                        $85K+ Avg
                      </div>
                      <Siren className="h-5 w-5 text-orange-600" />
                      <div className="text-center w-full">
                        <div className="text-xs font-semibold text-gray-900">Emergency Care Intelligence</div>
                        <div className="text-xs text-gray-600 truncate">EMTALA violations & tactics</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/premium" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-20 p-3 flex-col space-y-2 text-left justify-start rounded-2xl border-teal-200 hover:shadow-lg transition-all duration-200 hover:border-teal-300 hover:bg-teal-50/50 relative"
                      data-testid="preview-specialty-care-intelligence"
                    >
                      <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                        $45K+ Avg
                      </div>
                      <Stethoscope className="h-5 w-5 text-teal-600" />
                      <div className="text-center w-full">
                        <div className="text-xs font-semibold text-gray-900">Specialty Care Intelligence</div>
                        <div className="text-xs text-gray-600 truncate">Cardiology, oncology & more</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/premium" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-20 p-3 flex-col space-y-2 text-left justify-start rounded-2xl border-purple-200 hover:shadow-lg transition-all duration-200 hover:border-purple-300 hover:bg-purple-50/50 relative"
                      data-testid="preview-pharmaceutical-device-database"
                    >
                      <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                        $25K+ Avg
                      </div>
                      <Pill className="h-5 w-5 text-purple-600" />
                      <div className="text-center w-full">
                        <div className="text-xs font-semibold text-gray-900">Pharmaceutical Intelligence</div>
                        <div className="text-xs text-gray-600 truncate">Drug pricing & device markups</div>
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

      {/* View All Workflows Button */}
      <div className="pt-4 border-t border-gray-200">
        <Button
          onClick={() => {}}
          variant="outline"
          className="w-full h-12 rounded-2xl border-gray-200 text-gray-600 hover:text-emerald-600"
          data-testid="view-all-workflows-full"
        >
          <List className="h-4 w-4 mr-2" />
          View All {BILL_AI_WORKFLOWS.length} Workflows
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

// Enhanced Workflow Card Component with interactions
const WorkflowCard = ({ workflow, onClick }: {
  workflow: BillWorkflow;
  onClick: () => void;
}) => {
  const { isSubscribed } = useSubscription();
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const handleClick = () => {
    if (workflow.isPremium && !isSubscribed) {
      setShowPreview(true);
      return;
    }
    onClick();
  };
  
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Button
          onClick={handleClick}
          variant="outline"
          className={`h-20 p-3 flex-col space-y-2 text-left justify-start rounded-2xl border-gray-200 hover:shadow-lg transition-all duration-200 relative overflow-hidden ${
            isHovered ? 'border-emerald-300 bg-emerald-50/50' : ''
          }`}
          data-testid={`workflow-${workflow.id}`}
        >
          {workflow.isPremium && !isSubscribed && (
            <div className="absolute top-1 right-1">
              <Crown className="h-3 w-3 text-orange-500" />
            </div>
          )}
          <workflow.icon className={`h-5 w-5 ${workflow.color} ${isHovered ? 'scale-110' : ''} transition-transform`} />
          <div className="text-center w-full">
            <div className="text-xs font-semibold text-gray-900">{workflow.title}</div>
            <div className="text-xs text-gray-600 truncate">{workflow.subtitle}</div>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-xs text-emerald-600 font-medium mt-1"
              >
                {workflow.savingsPotential}
              </motion.div>
            )}
          </div>
        </Button>
      </motion.div>
      
      {/* Premium Preview Modal */}
      {showPreview && workflow.isPremium && !isSubscribed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 ${workflow.bgColor} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                <workflow.icon className={`h-8 w-8 ${workflow.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{workflow.title}</h3>
                <p className="text-sm text-gray-600">{workflow.description}</p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-800">Premium Feature</span>
                </div>
                <p className="text-xs text-orange-700 mb-3">Unlock advanced analysis with {workflow.savingsPotential} potential savings</p>
                <Button size="sm" className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                Maybe Later
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

// Workflow Category Component
const WorkflowCategory = ({ title, icon: Icon, iconColor, workflows, onWorkflowSelect, maxVisible = 3 }: {
  title: string;
  icon: any;
  iconColor: string;
  workflows: BillWorkflow[];
  onWorkflowSelect: (workflow: BillWorkflow) => void;
  maxVisible?: number;
}) => {
  return (
    <div className="space-y-2">
      <h4 className={`text-sm font-semibold text-gray-900 flex items-center gap-2`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
        {title}
      </h4>
      <div className="grid grid-cols-1 gap-2">
        {workflows.slice(0, maxVisible).map((workflow) => (
          <WorkflowListItem
            key={workflow.id}
            workflow={workflow}
            onClick={() => onWorkflowSelect(workflow)}
          />
        ))}
      </div>
    </div>
  );
};

// Enhanced Workflow List Item Component
const WorkflowListItem = ({ workflow, onClick }: {
  workflow: BillWorkflow;
  onClick: () => void;
}) => {
  const { isSubscribed } = useSubscription();
  const [showQuickPreview, setShowQuickPreview] = useState(false);
  
  const handleClick = () => {
    if (workflow.isPremium && !isSubscribed) {
      setShowQuickPreview(true);
      return;
    }
    onClick();
  };
  
  return (
    <>
      <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={handleClick}
          variant="ghost"
          className="w-full h-auto p-3 justify-start text-left hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-2xl transition-all duration-200 border border-transparent hover:border-emerald-200/50"
          data-testid={`workflow-list-${workflow.id}`}
        >
          <div className="flex items-center gap-3 w-full">
            <motion.div 
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${workflow.bgColor} shadow-sm`}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <workflow.icon className={`h-4 w-4 ${workflow.color}`} />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-sm font-medium text-gray-900">{workflow.title}</div>
                {workflow.isPremium && !isSubscribed && (
                  <Crown className="h-3 w-3 text-orange-500" />
                )}
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  {workflow.successRate}
                </Badge>
              </div>
              <div className="text-xs text-gray-500 mb-1">{workflow.subtitle}</div>
              <div className="flex items-center gap-3 text-xs">
                <div className="text-emerald-600 font-medium">{workflow.savingsPotential}</div>
                <div className="text-gray-400">{workflow.estimatedTime}</div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 rotate-[-90deg] transition-transform group-hover:rotate-[-45deg]" />
          </div>
        </Button>
      </motion.div>
      
      {/* Quick Premium Preview */}
      {showQuickPreview && workflow.isPremium && !isSubscribed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowQuickPreview(false)}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 ${workflow.bgColor} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                <workflow.icon className={`h-8 w-8 ${workflow.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{workflow.title}</h3>
                <p className="text-sm text-gray-600">{workflow.description}</p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-800">Premium Feature</span>
                </div>
                <p className="text-xs text-orange-700 mb-3">Unlock advanced analysis with {workflow.savingsPotential} potential savings</p>
                <Button size="sm" className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowQuickPreview(false)}>
                Maybe Later
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default function BillAI() {
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [localMessages, setLocalMessages] = useState<AIMessage[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number}>({current: 0, total: 0});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showToolsDrawer, setShowToolsDrawer] = useState(false);
  const [showAssessmentPanel, setShowAssessmentPanel] = useState(false);
  const [showSavingsCalculator, setShowSavingsCalculator] = useState(false);
  const [savingsAnalysisStage, setSavingsAnalysisStage] = useState<'scanning' | 'analyzing' | 'calculating' | 'complete'>('scanning');
  const [showPremiumShowcase, setShowPremiumShowcase] = useState(false);
  const [showMedicalCodeAnalyzer, setShowMedicalCodeAnalyzer] = useState(false);
  const [showEnhancedTracker, setShowEnhancedTracker] = useState(false);
  const [showAdvancedErrorDetector, setShowAdvancedErrorDetector] = useState(false);
  const [showProfessionalWorkflows, setShowProfessionalWorkflows] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showOptionalIntakePopup, setShowOptionalIntakePopup] = useState(false);
  
  // Premium Insight Database States
  const [showHospitalBillsDatabase, setShowHospitalBillsDatabase] = useState(false);
  const [showInsuranceClaimsDatabase, setShowInsuranceClaimsDatabase] = useState(false);
  const [showInsuranceDenialsIntelligence, setShowInsuranceDenialsIntelligence] = useState(false);
  const [showEmergencyCareBillingDatabase, setShowEmergencyCareBillingDatabase] = useState(false);
  const [showSpecialtyCareIntelligence, setShowSpecialtyCareIntelligence] = useState(false);
  const [showPharmaceuticalDeviceDatabase, setShowPharmaceuticalDeviceDatabase] = useState(false);
  
  // Premium Tools Modal States (moved from prominent display to optional modals)
  const [showPremiumAutomationModal, setShowPremiumAutomationModal] = useState(false);
  const [showPremiumTemplatesModal, setShowPremiumTemplatesModal] = useState(false);
  
  // Comprehensive Workflow State Management
  const [selectedWorkflow, setSelectedWorkflow] = useState<BillWorkflow | null>(null);
  const [workflowIntakeData, setWorkflowIntakeData] = useState<Record<string, any>>({});
  const [showWorkflowSelection, setShowWorkflowSelection] = useState(true);
  const [showAllWorkflows, setShowAllWorkflows] = useState(false);
  const [workflowFilter, setWorkflowFilter] = useState<string>('all');
  
  // Intake State Management
  const [intakeState, setIntakeState] = useState<IntakeState>({});
  const [assessmentIssues, setAssessmentIssues] = useState<AssessmentIssue[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize workflow-specific conversation
  const initializeWorkflowConversation = (workflow: BillWorkflow, preserveContext: boolean = false) => {
    setSelectedWorkflow(workflow);
    setShowWorkflowSelection(false);
    setConversationStarted(true);
    
    // Create workflow-specific AI message using conversation starter
    const workflowMessage: AIMessage = {
      id: Date.now().toString() + "_workflow_start",
      role: "assistant",
      content: preserveContext 
        ? `**🔄 SWITCHING TO: ${workflow.title.toUpperCase()}**\n\n${workflow.conversationStarter}`
        : workflow.conversationStarter,
      createdAt: new Date()
    };
    
    // Either replace messages (fresh start) or append to existing conversation
    if (preserveContext) {
      setLocalMessages(prev => [...prev, workflowMessage]);
    } else {
      setLocalMessages([workflowMessage]);
    }
    
    // Store the workflow context for future AI interactions
    setWorkflowIntakeData({
      workflowId: workflow.id,
      systemPrompt: workflow.systemPrompt,
      userPromptTemplate: workflow.userPromptTemplate
    });
  };

  // Initialize dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('billai-dark-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'true' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Calculate intake progress
  const getIntakeProgress = (): { completed: number; total: number; nextRequired: NextRequiredField } => {
    const fields = ['amount', 'provider', 'dates', 'insurance', 'codes'] as const;
    const completed = fields.filter(field => intakeState[field]).length;
    
    const nextRequired = fields.find(field => !intakeState[field]) || 
                        (!intakeState.itemizedBill ? 'itemized' : 'complete');
    
    return { completed, total: 6, nextRequired };
  };

  // Check if basic intake is complete
  const isBasicIntakeComplete = () => {
    return intakeState.amount && intakeState.provider && intakeState.dates;
  };

  // Enhanced information extraction parsers
  const extractBillInformation = (content: string): Partial<IntakeState> => {
    const updates: Partial<IntakeState> = {};
    const contentLower = content.toLowerCase();
    
    // Enhanced dollar amount extraction
    if (!intakeState.amount && content && content.includes('$')) {
      const priorityAmountPatterns = [
        /(?:total\s+(?:amount\s+)?due|patient\s+balance|amount\s+due|grand\s+total|total\s+charges?|balance\s+due)\s*[:;]?\s*\$?\s?([\d,]+\.?\d{0,2})/gi,
        /\$\s?([\d,]+\.?\d{0,2})\s*(?:total|due|balance|owed|charged)/gi,
        /\$\s?([\d,]+\.?\d{0,2})/g,
      ];
      
      for (const pattern of priorityAmountPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          const amounts = matches.map(m => {
            const numMatch = m.match(/([\d,]+\.?\d{0,2})/);
            if (numMatch) {
              const cleanAmount = numMatch[1].replace(/,/g, '');
              return parseFloat(cleanAmount);
            }
            return 0;
          }).filter(a => !isNaN(a) && a > 50);
          
          if (amounts.length > 0) {
            const targetAmount = amounts.length === 1 ? amounts[0] : Math.max(...amounts);
            updates.amount = `$${targetAmount.toLocaleString()}`;
            break;
          }
        }
      }
    }

    // Enhanced provider/hospital name extraction
    if (!intakeState.provider) {
      const providerPatterns = [
        /([A-Z][a-zA-Z\s&]{2,50}(?:Hospital|Medical Center|Health System|Clinic|Healthcare|Regional Medical|General Hospital|Memorial Hospital|University Hospital|Children's Hospital))/gi,
        /(?:bill\s+from|provider|facility|hospital)\s*[:;]?\s*([A-Z][a-zA-Z\s&]{5,60})/gi,
        /([A-Z][a-zA-Z\s]{2,30}(?:MD|LLC|PC|INC|Corp|Corporation))\s+(?:medical|health|clinic)/gi,
      ];
      
      for (const pattern of providerPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          for (const match of matches) {
            let provider = pattern.source.includes('(') ? match.replace(pattern, '$1') : match;
            provider = provider.trim().replace(/[":;]/g, '').trim();
            
            if (provider.length >= 8 && provider.length <= 80 && 
                /[A-Z]/.test(provider) && 
                !/^\d+$/.test(provider) && 
                !/(date|time|total|amount|charge|service|phone|address|bill)/i.test(provider)) {
              updates.provider = provider;
              break;
            }
          }
          if (updates.provider) break;
        }
      }
    }

    return updates;
  };

  // Send message function with workflow integration
  const sendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend && !selectedWorkflow) return;

    // Clear input if using typed message
    if (!message) setInputMessage("");
    
    setIsTyping(true);
    
    // Add user message
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageToSend,
      createdAt: new Date()
    };
    
    setLocalMessages(prev => [...prev, userMessage]);
    setConversationStarted(true);

    // Extract information from the message
    updateIntakeFromMessage(messageToSend);

    try {
      // Construct AI prompt based on selected workflow
      let aiPrompt = messageToSend;
      
      if (selectedWorkflow) {
        // Use workflow-specific system prompt and user template
        const workflowTemplate = selectedWorkflow.userPromptTemplate;
        const contextualPrompt = `${selectedWorkflow.systemPrompt}\\n\\n${workflowTemplate.replace(/\\{(\\w+)\\}/g, (match, key) => {
          return workflowIntakeData[key] || intakeState[key as keyof IntakeState] || match;
        })}\\n\\nUser Request: ${messageToSend}`;
        
        aiPrompt = contextualPrompt;
      }

      // Make API call  
      const response = await apiRequest('/api/bill-ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: aiPrompt,
          workflowId: selectedWorkflow?.id,
          intakeData: { ...intakeState, ...workflowIntakeData }
        })
      });

      const responseData = await response.json();

      // Add AI response
      const aiMessage: AIMessage = {
        id: Date.now().toString() + "_ai",
        role: "assistant", 
        content: responseData.response || responseData.message || 'I\'m analyzing your request. Please provide more details about your medical bill.',
        createdAt: new Date()
      };
      
      setLocalMessages(prev => [...prev, aiMessage]);
      
    } catch (error: any) {
      console.error('Chat API error:', error);
      
      // Check if it's a 401 authentication error
      if (error.message?.includes('401')) {
        toast({
          title: "Authentication Required",
          description: "Please log in to use the AI chat feature.",
          variant: "destructive",
        });
        // Redirect to login after a brief delay
        setTimeout(() => {
          window.location.href = '/api/login';
        }, 2000);
        return;
      }
      
      // Check if it's a 402 subscription error  
      if (error.message?.includes('402')) {
        toast({
          title: "Premium Subscription Required",
          description: "AI chat is a premium feature. Please upgrade your subscription to continue.",
          variant: "destructive",
        });
        // Add a subscription upgrade message to chat
        const upgradeMessage: AIMessage = {
          id: Date.now().toString() + "_upgrade",
          role: "assistant",
          content: `🔒 **Premium Feature Required**

AI-powered medical bill analysis is a premium feature that helps you save $1K-$100K+ on medical bills.

**What you get with Premium:**
• Unlimited AI chat sessions for bill analysis
• Advanced error detection and savings calculations  
• Professional dispute letter generation
• Insurance appeal templates and strategies
• 24/7 access to expert bill reduction advice

To continue using the AI chat, please upgrade to our Premium subscription.

[Would you like me to help you with general billing information instead?]`,
          createdAt: new Date()
        };
        setLocalMessages(prev => [...prev, upgradeMessage]);
        return;
      }
      
      // Generic error for other cases
      toast({
        title: "Connection Error",
        description: "Unable to connect to AI service. Please check your internet connection and try again.",
        variant: "destructive",
      });
      
      // Add a helpful error message to chat
      const errorMessage: AIMessage = {
        id: Date.now().toString() + "_error",
        role: "assistant",
        content: `I'm sorry, I'm having trouble connecting right now. This could be due to:

• Network connectivity issues
• Server maintenance  
• High traffic volume

Please try again in a few moments. If the problem persists, try refreshing the page.

In the meantime, I can still help you with general medical billing questions if you'd like to try again.`,
        createdAt: new Date()
      };
      setLocalMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Update intake state from message analysis (disabled automatic UI triggers)
  const updateIntakeFromMessage = (content: string) => {
    const updates = extractBillInformation(content);
    if (Object.keys(updates).length > 0) {
      setIntakeState(prev => {
        const newState = { ...prev, ...updates };
        
        // Keep state updates but disable automatic UI component triggers
        // This allows conversational AI to flow naturally without automatic popups
        
        return newState;
      });
    }
  };

  // Handle optional intake popup submission
  const handleOptionalIntakeSubmit = (data: any, submissionType: 'chat' | 'analysis') => {
    // Update intake state with provided data
    setIntakeState(prev => ({
      ...prev,
      amount: data.billAmount || prev.amount,
      provider: data.providerHospital || prev.provider,
      dates: data.serviceDates || prev.dates,
      insurance: data.insuranceInfo || prev.insurance,
      codes: data.medicalCodes || prev.codes
    }));

    // If user wants to run analysis immediately, send a comprehensive analysis request
    if (submissionType === 'analysis') {
      const analysisMessage = `I've provided the following information about my medical bill:

${data.billAmount ? `• Bill Amount: ${data.billAmount}` : ''}
${data.providerHospital ? `• Provider/Hospital: ${data.providerHospital}` : ''}
${data.serviceDates ? `• Service Dates: ${data.serviceDates}` : ''}
${data.insuranceInfo ? `• Insurance Information: ${data.insuranceInfo}` : ''}
${data.medicalCodes ? `• Medical Codes: ${data.medicalCodes}` : ''}
${data.additionalDetails ? `• Additional Details: ${data.additionalDetails}` : ''}

Please provide a comprehensive medical bill analysis with specific savings opportunities, error detection, and actionable next steps. Focus on identifying billing errors, overcharges, and compliance issues.`;

      setTimeout(() => {
        sendMessage(analysisMessage);
      }, 500);
    }

    setShowOptionalIntakePopup(false);
  };

  // Handle key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle file upload - Updated for medical bill analysis
  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Validate file count (max 5 images)
    if (fileArray.length > 5) {
      toast({
        title: "Too many files",
        description: "Please select up to 5 medical bill images at a time.",
        variant: "destructive",
      });
      return;
    }

    // Validate file types (images only)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = fileArray.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload only JPG, PNG, or WebP image files.",
        variant: "destructive",
      });
      return;
    }

    // Validate file sizes (max 10MB each)
    const oversizedFiles = fileArray.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: "Each image must be under 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingFiles(true);
    setUploadProgress({ current: 0, total: fileArray.length });

    try {
      const formData = new FormData();
      
      // Append all files to FormData for bulk upload
      fileArray.forEach((file) => {
        formData.append('bills', file);
      });

      // Use the correct multiple upload endpoint
      const response = await fetch('/api/upload-bills', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type - let browser set it with boundary for FormData
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const responseData = await response.json();
      
      // Update progress to show completion
      setUploadProgress({ current: fileArray.length, total: fileArray.length });
      
      // Process the uploaded files response
      if (responseData.success && responseData.extractedText) {
        // Update intake with extracted information
        updateIntakeFromMessage(responseData.extractedText);
        
        // Create a comprehensive message about the uploaded bills
        const extractedMessage: AIMessage = {
          id: Date.now().toString() + "_upload",
          role: "user",
          content: `📋 Uploaded ${fileArray.length} medical bill image${fileArray.length > 1 ? 's' : ''}: ${fileArray.map(f => f.name).join(', ')}\n\n🔍 **Extracted Content:**\n${responseData.extractedText}\n\n💡 **AI Analysis:**\n${responseData.analysis || 'Ready for detailed analysis.'}`,
          createdAt: new Date()
        };
        
        setLocalMessages(prev => [...prev, extractedMessage]);
        
        // Start conversation if not already started
        setConversationStarted(true);
        
        // Auto-trigger comprehensive analysis
        setTimeout(() => {
          sendMessage(`I've uploaded ${fileArray.length} medical bill image${fileArray.length > 1 ? 's' : ''} with the following extracted information:\n\n${responseData.extractedText}\n\nPlease provide a comprehensive analysis with specific savings opportunities, error detection, and actionable next steps.`);
        }, 1000);
      }
      
      toast({
        title: "✅ Bills uploaded successfully!",
        description: `${fileArray.length} medical bill${fileArray.length > 1 ? 's' : ''} processed with AI text extraction. ${responseData.message || 'Ready for analysis.'}`,
      });
      
      // Clear file selection
      setSelectedFiles([]);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Please try uploading your medical bill images again.",
        variant: "destructive",
      });
    } finally {
      setUploadingFiles(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleFileUpload(files);
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Add files to selection for preview
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files);
    setSelectedFiles(prev => [...prev, ...fileArray].slice(0, 5)); // Max 5 files
  };

  // Remove file from selection
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };


  return (
    <MobileLayout title="Bill AI" showBottomNav={true}>
      <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-gray-50 lg:max-w-none xl:max-w-6xl xl:mx-auto">
        
        {/* Enhanced Header with Navigation */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200/30">
          <div className="flex items-center justify-between p-4 lg:px-8 lg:py-6">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWorkflowSelection(!showWorkflowSelection)}
                className="w-9 h-9 p-0 rounded-xl"
                data-testid="workflow-menu-button"
              >
                <List className="h-4 w-4" />
              </Button>
              <div className="text-lg lg:text-2xl font-semibold text-gray-900">
                {selectedWorkflow ? selectedWorkflow.title : "Bill AI"}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link href="/blitz-demo">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-9 h-9 p-0 rounded-xl text-orange-600 hover:bg-orange-50"
                  data-testid="header-blitz-demo"
                >
                  <Zap className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowToolsDrawer(true)}
                className="w-9 h-9 p-0 rounded-xl"
                data-testid="tools-menu-button"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Workflow Selection Panel */}
        {showWorkflowSelection && !selectedWorkflow && (
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
            <div className="p-4 lg:px-8 lg:py-6">
              <WorkflowSelectionPanel 
                onWorkflowSelect={(workflow) => {
                  initializeWorkflowConversation(workflow);
                }}
                onStartChat={() => {
                  setShowWorkflowSelection(false);
                  setConversationStarted(true);
                  
                  const welcomeMessage: AIMessage = {
                    id: Date.now().toString() + "_welcome",
                    role: "assistant",
                    content: `Hello! I'm your Medical Bill AI assistant with professional billing expertise. I've helped patients save over $50 million in billing errors and overcharges.

📋 **Best Ways to Get Started:**
• **Upload bill images** - Fastest way! I can instantly extract and analyze all details
• Share your bill amount and provider name
• Tell me about specific charges that seem wrong
• Ask about billing codes you don't understand

📸 **Pro Tip:** Uploading medical bill photos gives me the most accurate data to find errors, overcharges, and savings opportunities. I can analyze up to 5 images at once!

What would you like to do first? I'm here to help you find every possible saving!`,
                    createdAt: new Date()
                  };
                  setLocalMessages([welcomeMessage]);
                }}
              />
            </div>
          </div>
        )}


        {/* Savings Calculator Panel */}
        {showSavingsCalculator && (
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
            <div className="p-3">
              <SavingsCalculator 
                billAmount={intakeState.amount}
                provider={intakeState.provider}
                isVisible={showSavingsCalculator}
                analysisStage={savingsAnalysisStage}
              />
            </div>
          </div>
        )}

        {/* Enhanced Progress Tracker */}
        {showEnhancedTracker && conversationStarted && (
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
            <div className="p-3">
              <EnhancedProgressTracker 
                intakeState={intakeState}
                analysisComplete={analysisComplete}
                onSendMessage={sendMessage}
                onNextStep={(stepId: string) => {
                  if (stepId === 'medical-codes' && (intakeState.cptCodes?.length || 0) > 0) {
                    setShowMedicalCodeAnalyzer(true);
                  }
                  if (stepId === 'error-detection' && intakeState.amount) {
                    setShowAdvancedErrorDetector(true);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* REMOVED: Premium sections moved to modals for cleaner interface */}

        {/* Premium Insight Databases */}
        {showHospitalBillsDatabase && (
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
            <div className="p-3">
              <HospitalBillsIntelligenceDatabase onSendMessage={sendMessage} />
            </div>
          </div>
        )}

        {showInsuranceClaimsDatabase && (
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
            <div className="p-3">
              <InsuranceClaimsDatabase onSendMessage={sendMessage} />
            </div>
          </div>
        )}

        {showInsuranceDenialsIntelligence && (
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
            <div className="p-3">
              <InsuranceDenialsIntelligence onSendMessage={sendMessage} />
            </div>
          </div>
        )}

        {showEmergencyCareBillingDatabase && (
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
            <div className="p-3">
              <EmergencyCareBillingDatabase onSendMessage={sendMessage} />
            </div>
          </div>
        )}

        {showSpecialtyCareIntelligence && (
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
            <div className="p-3">
              <SpecialtyCareIntelligence onSendMessage={sendMessage} />
            </div>
          </div>
        )}

        {showPharmaceuticalDeviceDatabase && (
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
            <div className="p-3">
              <PharmaceuticalDeviceDatabase onSendMessage={sendMessage} />
            </div>
          </div>
        )}

        {/* Chat Messages Area - iOS Style */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30 px-4 pt-4 lg:px-8 lg:py-6">
          <div className="space-y-4 lg:space-y-6 pb-4 lg:pb-8">
            
            {/* Welcome State with Enhanced Call-to-Action */}
            {localMessages.length === 0 && !conversationStarted && showWorkflowSelection && (
              <div className="text-center py-8 lg:py-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                    <Brain className="h-8 w-8 lg:h-12 lg:w-12 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-2 lg:mb-4">Ready to Save on Your Medical Bills?</h3>
                    <p className="text-sm lg:text-lg text-gray-600 mb-4 lg:mb-8 max-w-md lg:max-w-3xl mx-auto">
                      Our AI has helped patients save over $50M in billing errors. Select a workflow above or start chatting!
                    </p>
                    <div className="flex items-center justify-center gap-6 lg:gap-12 text-xs lg:text-sm">
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3 text-emerald-600" />
                        <span className="text-gray-600">94% Success Rate</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-emerald-600" />
                        <span className="text-gray-600">$12K Avg Savings</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-emerald-600" />
                        <span className="text-gray-600">HIPAA Secure</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* iOS-Style Upload Suggestion */}
            {localMessages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center pb-4"
              >
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 rounded-2xl bg-white/80 backdrop-blur-sm border-gray-200/50 text-gray-600 hover:text-emerald-600 hover:border-emerald-200 shadow-sm"
                  data-testid="quick-upload-button"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Upload Bill Images
                </Button>
              </motion.div>
            )}

            {/* iOS-Style Chat Messages */}
            {localMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
              >
                <div className={`max-w-[80%] group ${
                  message.role === "user" 
                    ? "bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white rounded-3xl rounded-br-lg shadow-lg shadow-emerald-500/25 dark:shadow-emerald-600/20" 
                    : "bg-white/95 backdrop-blur-sm border border-gray-200/50 text-gray-900 rounded-3xl rounded-bl-lg shadow-lg shadow-gray-200/30"
                } px-5 py-4 relative`}>
                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-2.5 mb-3">
                      <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tracking-tight">Medical Bill Expert</span>
                    </div>
                  )}
                  <p className={`text-[15px] leading-relaxed whitespace-pre-wrap ${
                    message.role === "user" 
                      ? "text-white font-medium" 
                      : "text-gray-900"
                  }`}>
                    {message.content}
                  </p>
                  
                  {/* Run Another Workflow Button (for all AI responses) */}
                  {message.role === "assistant" && (
                    <div className="mt-4 pt-3 border-t border-gray-100/50">
                      <div className="flex justify-center">
                        <RunAnotherWorkflow
                          onWorkflowSelect={(workflow) => {
                            initializeWorkflowConversation(workflow, true);
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Premium Tools Button (only for AI responses and subscribed users) */}
                  {message.role === "assistant" && isSubscribed && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setShowPremiumAutomationModal(true)}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50 text-purple-700 hover:from-purple-100 hover:to-indigo-100 text-xs"
                          data-testid="premium-automation-button"
                        >
                          <Zap className="h-3 w-3 mr-1.5" />
                          Automation
                        </Button>
                        <Button
                          onClick={() => setShowPremiumTemplatesModal(true)}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 text-xs"
                          data-testid="premium-templates-button"
                        >
                          <FileText className="h-3 w-3 mr-1.5" />
                          Templates
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className={`text-xs mt-3 flex items-center justify-between ${
                    message.role === "user" 
                      ? "text-emerald-100/80" 
                      : "text-gray-500"
                  }`}>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(message.content);
                        toast({ title: "Copied to clipboard" });
                      }}
                      variant="ghost"
                      size="sm"
                      className={`w-7 h-7 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                        message.role === "user"
                          ? "text-emerald-100/60 hover:text-emerald-100 hover:bg-emerald-400/20"
                          : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                      }`}
                      data-testid={`copy-message-${message.id}`}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    
                    <div className="flex items-center">
                      <span>{message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {message.role === "user" && (
                        <div className="ml-1.5 w-4 h-4 flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-emerald-100/60" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* iOS-Style Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex justify-start mb-4"
              >
                <div className="bg-white/95 backdrop-blur-sm border border-gray-200/50 text-gray-900 rounded-3xl rounded-bl-lg shadow-lg shadow-gray-200/30 px-5 py-4 max-w-[80%]">
                  <div className="flex items-center space-x-2.5 mb-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tracking-tight">Medical Bill Expert</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 bg-emerald-500 rounded-full"
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-emerald-500 rounded-full"
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-emerald-500 rounded-full"
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">Analyzing your bill details...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* iOS-Style Input Composer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/30 p-4 lg:p-6 safe-area-inset-bottom lg:relative lg:bg-white lg:border lg:rounded-2xl lg:m-4 lg:shadow-lg">
          {/* Quick Upload Hint */}
          {localMessages.length === 0 && !conversationStarted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 text-center"
            >
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-2 lg:mb-3">
                💡 <span className="font-medium">Pro Tip:</span> Upload bill images for instant AI analysis
              </p>
              <Button
                onClick={() => setShowOptionalIntakePopup(true)}
                variant="outline"
                size="sm"
                className="h-9 lg:h-11 px-4 lg:px-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 hover:border-emerald-300 lg:text-base"
                data-testid="quick-capture-button"
              >
                <Camera className="h-4 w-4 mr-2" />
                Quick Info Capture
              </Button>
            </motion.div>
          )}
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="w-11 h-11 lg:w-14 lg:h-14 p-0 rounded-2xl bg-gray-100/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 border-0"
              data-testid="attach-file-button"
              disabled={uploadingFiles}
            >
              <Paperclip className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOptionalIntakePopup(true)}
              className="w-11 h-11 lg:w-14 lg:h-14 p-0 rounded-2xl bg-emerald-100/80 hover:bg-emerald-200/80 border-0"
              data-testid="quick-info-button"
              title="Quick Info Capture"
            >
              <Brain className="h-5 w-5 lg:h-6 lg:w-6 text-emerald-600" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell me about your bill..."
                className="h-11 lg:h-14 pr-12 lg:pr-16 rounded-2xl border-gray-200/50 bg-gray-50/80 focus:border-emerald-500/50 dark:focus:border-emerald-400/50 focus:bg-white dark:focus:bg-gray-800 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-base lg:text-lg"
                disabled={isTyping}
                data-testid="message-input"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                size="sm"
                className="absolute right-1.5 lg:right-2 top-1.5 lg:top-2 w-8 h-8 lg:w-10 lg:h-10 p-0 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-sm"
                data-testid="send-message-button"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* AI Disclaimer */}
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 text-center">
            This is generative AI. For medical advice, please consult your healthcare provider.
          </p>
        </div>

        {/* Drag and Drop Area */}
        {dragActive && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border-2 border-dashed border-emerald-300"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Drop Medical Bills Here</h3>
                  <p className="text-sm text-gray-600">Drop up to 5 medical bill images for instant AI analysis</p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <span>JPG</span>
                  <Circle className="h-1 w-1 fill-gray-400" />
                  <span>PNG</span>
                  <Circle className="h-1 w-1 fill-gray-400" />
                  <span>WebP</span>
                  <Circle className="h-1 w-1 fill-gray-400" />
                  <span>Max 10MB each</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Upload Progress Overlay */}
        {uploadingFiles && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Processing Medical Bills</h3>
                  <p className="text-sm text-gray-600">AI is extracting text and analyzing your bills...</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.total > 0 ? (uploadProgress.current / uploadProgress.total) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {uploadProgress.total > 0 ? `${uploadProgress.current} of ${uploadProgress.total} files processed` : 'Starting upload...'}
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
          data-testid="file-input"
        />

        {/* Premium Automation Engine Modal */}
        <Sheet open={showPremiumAutomationModal} onOpenChange={setShowPremiumAutomationModal}>
          <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                Premium Automation Engine
              </SheetTitle>
              <SheetDescription>
                Automate your medical bill analysis and dispute processes with AI-powered workflows.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4">
              <PremiumAutomationEngine onSendMessage={sendMessage} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Premium Templates Library Modal */}
        <Sheet open={showPremiumTemplatesModal} onOpenChange={setShowPremiumTemplatesModal}>
          <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                Premium Templates Library
              </SheetTitle>
              <SheetDescription>
                Access professional-grade dispute letter templates and automated document generation.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4">
              <PremiumTemplatesLibrary onSendMessage={sendMessage} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Optional Intake Popup */}
        <OptionalIntakePopup
          isOpen={showOptionalIntakePopup}
          onClose={() => setShowOptionalIntakePopup(false)}
          onSubmit={handleOptionalIntakeSubmit}
          onFileUpload={handleFileUpload}
        />
      </div>
    </MobileLayout>
  );
}