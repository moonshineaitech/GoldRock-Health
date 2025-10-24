import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSubscription } from "@/hooks/useSubscription";
import { BILL_AI_WORKFLOWS, type BillWorkflow } from "@shared/bill-ai-workflows";
import { 
  ArrowRight, 
  Sparkles, 
  Star, 
  AlertTriangle, 
  Shield, 
  DollarSign, 
  FileText, 
  Siren, 
  Crown,
  Database,
  Network,
  Radar,
  Brain,
  Target,
  Zap,
  Lock,
  TrendingUp,
  Settings,
  BarChart3,
  HeartHandshake,
  Building2,
  Stethoscope,
  Pill,
  Wrench,
  ChevronRight,
  X,
  Info
} from "lucide-react";

interface RunAnotherWorkflowProps {
  onWorkflowSelect: (workflow: BillWorkflow) => void;
}

interface WorkflowCardProps {
  workflow: BillWorkflow;
  onClick: () => void;
  isCompact?: boolean;
}

const WorkflowCard = ({ workflow, onClick, isCompact = false }: WorkflowCardProps) => {
  const { isSubscribed } = useSubscription();
  const IconComponent = workflow.icon;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-gray-200/50 ${
          workflow.isPremium && !isSubscribed ? 'opacity-60' : 'hover:border-emerald-300/50'
        } ${isCompact ? 'p-3' : ''}`}
        onClick={onClick}
        data-testid={`workflow-card-${workflow.id}`}
      >
        <CardContent className={`${isCompact ? 'p-0' : 'p-4'} space-y-3`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`${workflow.bgColor} ${isCompact ? 'w-8 h-8' : 'w-10 h-10'} rounded-xl flex items-center justify-center shadow-sm`}>
                <IconComponent className={`${workflow.color} ${isCompact ? 'h-4 w-4' : 'h-5 w-5'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold text-gray-900 truncate ${isCompact ? 'text-sm' : 'text-base'}`}>
                    {workflow.title}
                  </h3>
                  {workflow.isPremium && (
                    <Crown className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                  )}
                </div>
                <p className={`text-gray-600 truncate ${isCompact ? 'text-xs' : 'text-sm'}`}>
                  {workflow.subtitle}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
          </div>
          
          {!isCompact && (
            <>
              <p className="text-sm text-gray-600 line-clamp-2">
                {workflow.description}
              </p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {workflow.successRate} success
                  </Badge>
                  <span className="text-gray-500">{workflow.estimatedTime}</span>
                </div>
                <span className="font-medium text-emerald-600">{workflow.savingsPotential}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface WorkflowCategoryProps {
  title: string;
  icon: any;
  iconColor: string;
  workflows: BillWorkflow[];
  onWorkflowSelect: (workflow: BillWorkflow) => void;
  isCompact?: boolean;
  maxVisible?: number;
}

const WorkflowCategory = ({ 
  title, 
  icon: Icon, 
  iconColor, 
  workflows, 
  onWorkflowSelect, 
  isCompact = false,
  maxVisible 
}: WorkflowCategoryProps) => {
  const [expanded, setExpanded] = useState(false);
  const { isSubscribed } = useSubscription();
  
  const visibleWorkflows = maxVisible && !expanded 
    ? workflows.slice(0, maxVisible)
    : workflows;
  
  const hasMoreWorkflows = maxVisible && workflows.length > maxVisible;
  
  if (workflows.length === 0) return null;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <Badge variant="outline" className="text-xs">
            {workflows.length}
          </Badge>
        </div>
        {hasMoreWorkflows && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-xs h-6 px-2"
            data-testid={`expand-category-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {expanded ? 'Show Less' : `+${workflows.length - maxVisible!} More`}
          </Button>
        )}
      </div>
      
      <div className={`grid gap-2 ${isCompact ? 'grid-cols-1' : 'grid-cols-1'}`}>
        {visibleWorkflows.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            workflow={workflow}
            onClick={() => onWorkflowSelect(workflow)}
            isCompact={isCompact}
          />
        ))}
      </div>
    </div>
  );
};

export function RunAnotherWorkflow({ onWorkflowSelect }: RunAnotherWorkflowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isSubscribed } = useSubscription();
  
  // Organize workflows by categories
  const coreWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'core');
  const beginnerWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'beginner');
  const specialtyWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'specialty');
  const insuranceWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'insurance');
  const financialWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'financial');
  const legalWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'legal');
  const emergencyWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'emergency');
  const appealSystemWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'appeal-system');
  const denialReversalWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'denial-reversal');
  const coverageExpansionWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'coverage-expansion');
  const insuranceIntelligenceWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'insurance-intelligence');
  const automatedToolsWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'automated-tools');
  
  // Premium categories
  const hospitalInsiderWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'hospital-insider');
  const codingIntelligenceWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'coding-intelligence');
  const hardshipMasteryWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'hardship-mastery');
  const reportingSuiteWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'reporting-suite');
  const financialModelingWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'financial-modeling');
  const dataIntelligenceWorkflows = BILL_AI_WORKFLOWS.filter(w => w.category === 'data-intelligence');
  
  const totalWorkflows = BILL_AI_WORKFLOWS.length;
  const premiumWorkflows = BILL_AI_WORKFLOWS.filter(w => w.isPremium).length;
  
  const handleWorkflowSelect = (workflow: BillWorkflow) => {
    setIsOpen(false);
    onWorkflowSelect(workflow);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300/50 text-xs"
          data-testid="run-another-workflow-button"
        >
          <ArrowRight className="h-3 w-3 mr-1.5" />
          Run Another Workflow
        </Button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="h-[90vh] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-lg font-bold text-gray-900">
                  Run Another Workflow
                </SheetTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Continue your analysis with {totalWorkflows} powerful tools
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  {totalWorkflows} Tools
                </Badge>
                {premiumWorkflows > 0 && (
                  <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-purple-200">
                    <Crown className="h-3 w-3 mr-1" />
                    {premiumWorkflows} Premium
                  </Badge>
                )}
              </div>
            </div>
          </SheetHeader>
          
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-6">
              
              {/* Essential Workflows */}
              <WorkflowCategory
                title="Essential Workflows"
                icon={Sparkles}
                iconColor="text-emerald-600"
                workflows={coreWorkflows}
                onWorkflowSelect={handleWorkflowSelect}
                maxVisible={4}
              />
              
              {/* Getting Started */}
              {beginnerWorkflows.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <WorkflowCategory
                    title="Getting Started (Perfect for First-Time Users)"
                    icon={Star}
                    iconColor="text-yellow-600"
                    workflows={beginnerWorkflows}
                    onWorkflowSelect={handleWorkflowSelect}
                    isCompact={true}
                    maxVisible={6}
                  />
                </>
              )}
              
              {/* Specialty Analysis */}
              {specialtyWorkflows.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <WorkflowCategory
                    title="Specialty Analysis"
                    icon={Stethoscope}
                    iconColor="text-blue-600"
                    workflows={specialtyWorkflows}
                    onWorkflowSelect={handleWorkflowSelect}
                    isCompact={true}
                    maxVisible={8}
                  />
                </>
              )}
              
              {/* Insurance & Appeals */}
              {insuranceWorkflows.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <WorkflowCategory
                    title="Insurance & Appeals"
                    icon={Shield}
                    iconColor="text-indigo-600"
                    workflows={insuranceWorkflows}
                    onWorkflowSelect={handleWorkflowSelect}
                    isCompact={true}
                    maxVisible={6}
                  />
                </>
              )}
              
              {/* Financial Assistance */}
              {financialWorkflows.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <WorkflowCategory
                    title="Financial Assistance"
                    icon={DollarSign}
                    iconColor="text-green-600"
                    workflows={financialWorkflows}
                    onWorkflowSelect={handleWorkflowSelect}
                    isCompact={true}
                    maxVisible={5}
                  />
                </>
              )}
              
              {/* Legal & Disputes */}
              {legalWorkflows.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <WorkflowCategory
                    title="Legal & Disputes"
                    icon={FileText}
                    iconColor="text-purple-600"
                    workflows={legalWorkflows}
                    onWorkflowSelect={handleWorkflowSelect}
                    isCompact={true}
                    maxVisible={4}
                  />
                </>
              )}
              
              {/* Emergency Bills */}
              {emergencyWorkflows.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <WorkflowCategory
                    title="Emergency Bills"
                    icon={Siren}
                    iconColor="text-red-600"
                    workflows={emergencyWorkflows}
                    onWorkflowSelect={handleWorkflowSelect}
                    isCompact={true}
                    maxVisible={4}
                  />
                </>
              )}
              
              {/* PREMIUM SECTIONS */}
              {isSubscribed && (
                <>
                  {/* Premium Insider Secrets */}
                  {hospitalInsiderWorkflows.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-semibold text-purple-900">Premium Insider Knowledge</span>
                        </div>
                        <p className="text-xs text-purple-700">
                          Exclusive industry insights and advanced strategies for maximum savings
                        </p>
                      </div>
                      <WorkflowCategory
                        title="Hospital Insider Secrets"
                        icon={Building2}
                        iconColor="text-purple-600"
                        workflows={hospitalInsiderWorkflows}
                        onWorkflowSelect={handleWorkflowSelect}
                        isCompact={true}
                        maxVisible={6}
                      />
                    </>
                  )}
                  
                  {/* Coding Intelligence */}
                  {codingIntelligenceWorkflows.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <WorkflowCategory
                        title="Medical Coding Intelligence"
                        icon={Brain}
                        iconColor="text-indigo-600"
                        workflows={codingIntelligenceWorkflows}
                        onWorkflowSelect={handleWorkflowSelect}
                        isCompact={true}
                        maxVisible={6}
                      />
                    </>
                  )}
                  
                  {/* Advanced Appeal Systems */}
                  {appealSystemWorkflows.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <WorkflowCategory
                        title="Advanced Appeal Systems"
                        icon={Target}
                        iconColor="text-red-600"
                        workflows={appealSystemWorkflows}
                        onWorkflowSelect={handleWorkflowSelect}
                        isCompact={true}
                        maxVisible={4}
                      />
                    </>
                  )}
                  
                  {/* Denial Reversal Arsenal */}
                  {denialReversalWorkflows.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <WorkflowCategory
                        title="Denial Reversal Arsenal"
                        icon={Shield}
                        iconColor="text-orange-600"
                        workflows={denialReversalWorkflows}
                        onWorkflowSelect={handleWorkflowSelect}
                        isCompact={true}
                        maxVisible={4}
                      />
                    </>
                  )}
                  
                  {/* Automated Tools */}
                  {automatedToolsWorkflows.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <WorkflowCategory
                        title="Automated Tools"
                        icon={Zap}
                        iconColor="text-yellow-600"
                        workflows={automatedToolsWorkflows}
                        onWorkflowSelect={handleWorkflowSelect}
                        isCompact={true}
                        maxVisible={4}
                      />
                    </>
                  )}
                  
                  {/* Data Intelligence */}
                  {dataIntelligenceWorkflows.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <WorkflowCategory
                        title="Premium Intelligence Databases"
                        icon={Database}
                        iconColor="text-teal-600"
                        workflows={dataIntelligenceWorkflows}
                        onWorkflowSelect={handleWorkflowSelect}
                        isCompact={true}
                        maxVisible={6}
                      />
                    </>
                  )}
                </>
              )}
              
              {/* Non-premium users see upgrade prompt */}
              {!isSubscribed && (hospitalInsiderWorkflows.length > 0 || codingIntelligenceWorkflows.length > 0) && (
                <>
                  <Separator className="my-4" />
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 text-center">
                    <Crown className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-bold text-purple-900 mb-2">Unlock Premium Workflows</h3>
                    <p className="text-sm text-purple-700 mb-4">
                      Access {premiumWorkflows}+ exclusive insider tools and advanced strategies
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      size="sm"
                      data-testid="upgrade-to-premium-button"
                    >
                      <Crown className="h-3 w-3 mr-1.5" />
                      Upgrade to Premium
                    </Button>
                  </div>
                </>
              )}
              
            </div>
          </ScrollArea>
          
          {/* Footer */}
          <div className="border-t bg-gray-50/50 px-6 py-3">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-emerald-600" />
                  <span>94% Success Rate</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-emerald-600" />
                  <span>$50M+ Saved</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-emerald-600" />
                <span>Private & Secure</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}