import { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  Building2,
  FileText,
  DollarSign,
  Shield,
  Heart,
  Brain,
  Baby,
  Eye,
  Pill,
  Stethoscope,
  AlertCircle,
  ChevronRight,
  Plus,
  Trash2,
  Star,
  CheckCircle,
  XCircle,
  HelpCircle,
  Sparkles,
  BarChart3,
  Info,
  Scale,
  Clock,
  Users,
  Network,
  Loader2,
  BookOpen
} from "lucide-react";

interface InsuranceProvider {
  id: string;
  name: string;
  type: string;
  logoUrl?: string;
  planCount: number;
}

interface InsurancePlan {
  id: string;
  providerId: string;
  providerName: string;
  name: string;
  type: string;
  premium: number;
  deductible: number;
  outOfPocketMax: number;
  networkType: string;
  copays: {
    primaryCare: number;
    specialist: number;
    urgentCare: number;
    emergencyRoom: number;
  };
  prescriptionTiers: {
    tier1: number;
    tier2: number;
    tier3: number;
    tier4: number;
  };
  benefits: BenefitCategory[];
}

interface BenefitCategory {
  category: string;
  icon: string;
  benefits: Benefit[];
}

interface Benefit {
  id: string;
  name: string;
  coverageType: string;
  details: string;
  copay?: number;
  coinsurancePercent?: number;
  deductibleApplies: boolean;
  priorAuthRequired: boolean;
}

interface UserPlan {
  id: string;
  planId: string;
  planName: string;
  providerName: string;
  memberNumber: string;
  groupNumber: string;
  effectiveDate: string;
  isPrimary: boolean;
}

interface ExplainBenefitResponse {
  explanation: string;
  examples: string[];
  tips: string[];
}

interface ComparePlansResponse {
  analysis: string;
  recommendations: { planId: string; pros: string[]; cons: string[] }[];
}

const benefitCategoryIcons: Record<string, React.ElementType> = {
  "Preventive Care": Heart,
  "Mental Health": Brain,
  "Maternity": Baby,
  "Vision": Eye,
  "Prescription": Pill,
  "Primary Care": Stethoscope,
  "Specialist Care": Users,
  "Emergency": AlertCircle,
  "Hospital": Building2,
  "Rehabilitation": Scale,
};

const commonTerms = [
  {
    term: "Deductible",
    definition: "The amount you pay for covered healthcare services before your insurance plan starts to pay.",
    icon: DollarSign,
  },
  {
    term: "Copay",
    definition: "A fixed amount you pay for a covered healthcare service after you've paid your deductible.",
    icon: FileText,
  },
  {
    term: "Coinsurance",
    definition: "Your share of the costs of a covered healthcare service, calculated as a percentage.",
    icon: Scale,
  },
  {
    term: "Out-of-Pocket Maximum",
    definition: "The most you have to pay for covered services in a plan year. After you reach this, your plan pays 100%.",
    icon: Shield,
  },
  {
    term: "Prior Authorization",
    definition: "Approval from your health plan that may be required before you get a service or fill a prescription.",
    icon: Clock,
  },
];

export default function InsuranceBenefits() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [providerTypeFilter, setProviderTypeFilter] = useState<string>("all");
  const [selectedProvider, setSelectedProvider] = useState<InsuranceProvider | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);
  const [comparisonPlans, setComparisonPlans] = useState<InsurancePlan[]>([]);
  const [explainDialogOpen, setExplainDialogOpen] = useState(false);
  const [currentBenefit, setCurrentBenefit] = useState<Benefit | null>(null);
  const [addPlanDialogOpen, setAddPlanDialogOpen] = useState(false);
  const [newPlanForm, setNewPlanForm] = useState({
    planId: "",
    memberNumber: "",
    groupNumber: "",
    effectiveDate: "",
  });

  // Fetch providers
  const { data: providers = [], isLoading: loadingProviders } = useQuery<InsuranceProvider[]>({
    queryKey: ["/api/insurance/providers"],
  });

  // Fetch plans for selected provider
  const { data: providerPlans = [], isLoading: loadingPlans } = useQuery<InsurancePlan[]>({
    queryKey: ["/api/insurance/plans", { providerId: selectedProvider?.id }],
    enabled: !!selectedProvider,
  });

  // Fetch all plans for comparison
  const { data: allPlans = [] } = useQuery<InsurancePlan[]>({
    queryKey: ["/api/insurance/plans"],
  });

  // Fetch user's saved plans
  const { data: userPlans = [], isLoading: loadingUserPlans } = useQuery<UserPlan[]>({
    queryKey: ["/api/insurance/user-plans"],
    enabled: isAuthenticated,
  });

  // Fetch plan details
  const { data: planDetails, isLoading: loadingPlanDetails } = useQuery<InsurancePlan>({
    queryKey: ["/api/insurance/plans", selectedPlan?.id],
    enabled: !!selectedPlan?.id,
  });

  // Explain benefit mutation
  const explainBenefitMutation = useMutation({
    mutationFn: async (benefit: Benefit) => {
      const res = await apiRequest("POST", "/api/insurance/explain-benefit", {
        benefit,
        planId: selectedPlan?.id,
      });
      return res.json();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get benefit explanation. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Compare plans mutation
  const comparePlansMutation = useMutation({
    mutationFn: async (planIds: string[]) => {
      const res = await apiRequest("POST", "/api/insurance/compare-plans", {
        planIds,
      });
      return res.json();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to compare plans. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Save user plan mutation
  const saveUserPlanMutation = useMutation({
    mutationFn: async (planData: typeof newPlanForm) => {
      const res = await apiRequest("POST", "/api/insurance/user-plans", planData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/insurance/user-plans"] });
      setAddPlanDialogOpen(false);
      setNewPlanForm({ planId: "", memberNumber: "", groupNumber: "", effectiveDate: "" });
      toast({
        title: "Plan Saved",
        description: "Your insurance plan has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete user plan mutation
  const deleteUserPlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      await apiRequest("DELETE", `/api/insurance/user-plans/${planId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/insurance/user-plans"] });
      toast({
        title: "Plan Removed",
        description: "The plan has been removed from your profile.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter providers
  const filteredProviders = providers.filter((provider) => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = providerTypeFilter === "all" || provider.type === providerTypeFilter;
    return matchesSearch && matchesType;
  });

  // Handle plan comparison toggle
  const togglePlanComparison = (plan: InsurancePlan) => {
    setComparisonPlans((prev) => {
      const exists = prev.find((p) => p.id === plan.id);
      if (exists) {
        return prev.filter((p) => p.id !== plan.id);
      }
      if (prev.length >= 5) {
        toast({
          title: "Maximum Plans Reached",
          description: "You can compare up to 5 plans at a time.",
          variant: "destructive",
        });
        return prev;
      }
      return [...prev, plan];
    });
  };

  // Handle explain benefit
  const handleExplainBenefit = (benefit: Benefit) => {
    setCurrentBenefit(benefit);
    setExplainDialogOpen(true);
    explainBenefitMutation.mutate(benefit);
  };

  return (
    <MobileLayout title="Insurance Benefits" showBottomNav={true}>
      <div className="space-y-6 pb-20">
        {/* Page Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="page-title">
            Insurance Benefits Explainer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1" data-testid="page-subtitle">
            Understand your coverage in plain English
          </p>
          
          {/* FDA-compliant disclaimer */}
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg" data-testid="disclaimer-banner">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-300 text-left">
                <strong>Educational Information Only:</strong> This tool provides general educational information about insurance benefits. It is not intended as insurance advice. Always verify coverage details with your insurance provider and consult licensed professionals for specific guidance.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full mb-4" data-testid="main-tabs">
                <TabsTrigger value="browse" data-testid="tab-browse">
                  <Search className="w-4 h-4 mr-1" />
                  Browse
                </TabsTrigger>
                <TabsTrigger value="details" data-testid="tab-details" disabled={!selectedPlan}>
                  <FileText className="w-4 h-4 mr-1" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="compare" data-testid="tab-compare" disabled={comparisonPlans.length < 2}>
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Compare
                </TabsTrigger>
                <TabsTrigger value="my-plans" data-testid="tab-my-plans">
                  <Star className="w-4 h-4 mr-1" />
                  My Plans
                </TabsTrigger>
              </TabsList>

              {/* Browse Tab */}
              <TabsContent value="browse" className="space-y-4">
                {/* Search and Filter */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search insurance providers..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                          data-testid="input-search-providers"
                        />
                      </div>
                      <Select value={providerTypeFilter} onValueChange={setProviderTypeFilter}>
                        <SelectTrigger className="w-full sm:w-48" data-testid="select-provider-type">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="medicare_advantage">Medicare Advantage</SelectItem>
                          <SelectItem value="medicaid_managed">Medicaid Managed</SelectItem>
                          <SelectItem value="marketplace">Marketplace</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Providers List */}
                <div className="grid gap-3">
                  {loadingProviders ? (
                    Array(4).fill(0).map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Skeleton className="w-12 h-12 rounded-lg" />
                            <div className="flex-1">
                              <Skeleton className="h-5 w-40 mb-2" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : filteredProviders.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No providers found matching your search.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredProviders.map((provider) => (
                      <motion.div
                        key={provider.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all ${
                            selectedProvider?.id === provider.id
                              ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                          onClick={() => {
                            setSelectedProvider(provider);
                            setSelectedPlan(null);
                          }}
                          data-testid={`card-provider-${provider.id}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                  <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {provider.name}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">
                                      {provider.type.replace("_", " ")}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {provider.planCount} plans
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Provider Plans */}
                <AnimatePresence>
                  {selectedProvider && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="mt-4">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            {selectedProvider.name} Plans
                          </CardTitle>
                          <CardDescription>
                            Select a plan to view details or add to comparison
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {loadingPlans ? (
                            <div className="space-y-3">
                              {Array(3).fill(0).map((_, i) => (
                                <Skeleton key={i} className="h-20 w-full" />
                              ))}
                            </div>
                          ) : providerPlans.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                              No plans available for this provider.
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {providerPlans.map((plan) => (
                                <div
                                  key={plan.id}
                                  className={`p-4 border rounded-lg transition-all ${
                                    selectedPlan?.id === plan.id
                                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                                  }`}
                                  data-testid={`card-plan-${plan.id}`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-medium text-gray-900 dark:text-white">
                                        {plan.name}
                                      </h4>
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        <Badge variant="outline" className="text-xs">
                                          {plan.type}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                          <Network className="w-3 h-3 mr-1" />
                                          {plan.networkType}
                                        </Badge>
                                      </div>
                                      <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                                        <div>
                                          <span className="text-gray-500">Premium</span>
                                          <p className="font-semibold text-gray-900 dark:text-white">
                                            ${plan.premium}/mo
                                          </p>
                                        </div>
                                        <div>
                                          <span className="text-gray-500">Deductible</span>
                                          <p className="font-semibold text-gray-900 dark:text-white">
                                            ${plan.deductible.toLocaleString()}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="text-gray-500">OOP Max</span>
                                          <p className="font-semibold text-gray-900 dark:text-white">
                                            ${plan.outOfPocketMax.toLocaleString()}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <Button
                                        size="sm"
                                        variant={selectedPlan?.id === plan.id ? "default" : "outline"}
                                        onClick={() => {
                                          setSelectedPlan(plan);
                                          setActiveTab("details");
                                        }}
                                        data-testid={`button-view-plan-${plan.id}`}
                                      >
                                        View
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant={comparisonPlans.find((p) => p.id === plan.id) ? "secondary" : "ghost"}
                                        onClick={() => togglePlanComparison(plan)}
                                        data-testid={`button-compare-plan-${plan.id}`}
                                      >
                                        {comparisonPlans.find((p) => p.id === plan.id) ? (
                                          <CheckCircle className="w-4 h-4" />
                                        ) : (
                                          <Plus className="w-4 h-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              {/* Plan Details Tab */}
              <TabsContent value="details" className="space-y-4">
                {selectedPlan && (
                  <>
                    {/* Plan Overview Card */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{selectedPlan.name}</CardTitle>
                            <CardDescription>{selectedPlan.providerName}</CardDescription>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {selectedPlan.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">Premium</p>
                            <p className="font-bold text-lg">${selectedPlan.premium}/mo</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <Shield className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">Deductible</p>
                            <p className="font-bold text-lg">${selectedPlan.deductible.toLocaleString()}</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <Scale className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">OOP Max</p>
                            <p className="font-bold text-lg">${selectedPlan.outOfPocketMax.toLocaleString()}</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <Network className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">Network</p>
                            <p className="font-bold text-lg capitalize">{selectedPlan.networkType}</p>
                          </div>
                        </div>

                        <Separator />

                        {/* Copays */}
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Stethoscope className="w-5 h-5 text-gray-600" />
                            Copays for Common Services
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Primary Care</span>
                              <span className="font-semibold">${selectedPlan.copays.primaryCare}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Specialist</span>
                              <span className="font-semibold">${selectedPlan.copays.specialist}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Urgent Care</span>
                              <span className="font-semibold">${selectedPlan.copays.urgentCare}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Emergency Room</span>
                              <span className="font-semibold">${selectedPlan.copays.emergencyRoom}</span>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Prescription Tiers */}
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Pill className="w-5 h-5 text-gray-600" />
                            Prescription Drug Tiers
                          </h3>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Tier</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Copay</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">Tier 1</TableCell>
                                <TableCell className="text-gray-500">Generic drugs</TableCell>
                                <TableCell className="text-right">${selectedPlan.prescriptionTiers.tier1}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Tier 2</TableCell>
                                <TableCell className="text-gray-500">Preferred brand</TableCell>
                                <TableCell className="text-right">${selectedPlan.prescriptionTiers.tier2}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Tier 3</TableCell>
                                <TableCell className="text-gray-500">Non-preferred brand</TableCell>
                                <TableCell className="text-right">${selectedPlan.prescriptionTiers.tier3}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Tier 4</TableCell>
                                <TableCell className="text-gray-500">Specialty</TableCell>
                                <TableCell className="text-right">${selectedPlan.prescriptionTiers.tier4}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Benefits Explorer */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          Benefits Explorer
                        </CardTitle>
                        <CardDescription>
                          Click "Explain This" on any benefit to get an AI-powered plain English explanation
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          {selectedPlan.benefits?.map((category, idx) => {
                            const IconComponent = benefitCategoryIcons[category.category] || Heart;
                            return (
                              <AccordionItem key={idx} value={category.category} data-testid={`accordion-${category.category.toLowerCase().replace(/\s/g, '-')}`}>
                                <AccordionTrigger className="hover:no-underline">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                      <IconComponent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="font-medium">{category.category}</span>
                                    <Badge variant="secondary" className="ml-2">
                                      {category.benefits.length} benefits
                                    </Badge>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-3 pt-2">
                                    {category.benefits.map((benefit) => (
                                      <div
                                        key={benefit.id}
                                        className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50"
                                        data-testid={`benefit-${benefit.id}`}
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                              {benefit.name}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                              {benefit.details}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                              <Badge variant="outline" className="text-xs">
                                                {benefit.coverageType}
                                              </Badge>
                                              {benefit.copay && (
                                                <Badge variant="secondary" className="text-xs">
                                                  ${benefit.copay} copay
                                                </Badge>
                                              )}
                                              {benefit.coinsurancePercent && (
                                                <Badge variant="secondary" className="text-xs">
                                                  {benefit.coinsurancePercent}% coinsurance
                                                </Badge>
                                              )}
                                              {benefit.deductibleApplies && (
                                                <Badge variant="outline" className="text-xs text-amber-600">
                                                  Deductible applies
                                                </Badge>
                                              )}
                                              {benefit.priorAuthRequired && (
                                                <Badge variant="outline" className="text-xs text-red-600">
                                                  Prior auth required
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="ml-3 flex-shrink-0"
                                            onClick={() => handleExplainBenefit(benefit)}
                                            data-testid={`button-explain-${benefit.id}`}
                                          >
                                            <Sparkles className="w-4 h-4 mr-1" />
                                            Explain This
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>

                        {(!selectedPlan.benefits || selectedPlan.benefits.length === 0) && (
                          <div className="text-center py-8">
                            <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Benefits information not available for this plan.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}

                {!selectedPlan && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No Plan Selected
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Browse providers and select a plan to view its details.
                      </p>
                      <Button onClick={() => setActiveTab("browse")} data-testid="button-browse-plans">
                        Browse Plans
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Compare Tab */}
              <TabsContent value="compare" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                          Plan Comparison
                        </CardTitle>
                        <CardDescription>
                          Comparing {comparisonPlans.length} plans side by side
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setComparisonPlans([])}
                        data-testid="button-clear-comparison"
                      >
                        Clear All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {comparisonPlans.length >= 2 ? (
                      <div className="space-y-6">
                        <ScrollArea className="w-full">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-40">Metric</TableHead>
                                {comparisonPlans.map((plan) => (
                                  <TableHead key={plan.id} className="text-center min-w-32">
                                    <div className="flex flex-col items-center gap-1">
                                      <span className="font-medium">{plan.name}</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => togglePlanComparison(plan)}
                                        data-testid={`button-remove-compare-${plan.id}`}
                                      >
                                        <XCircle className="w-4 h-4 text-red-500" />
                                      </Button>
                                    </div>
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">Monthly Premium</TableCell>
                                {comparisonPlans.map((plan) => (
                                  <TableCell key={plan.id} className="text-center">
                                    ${plan.premium}
                                  </TableCell>
                                ))}
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Deductible</TableCell>
                                {comparisonPlans.map((plan) => (
                                  <TableCell key={plan.id} className="text-center">
                                    ${plan.deductible.toLocaleString()}
                                  </TableCell>
                                ))}
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Out-of-Pocket Max</TableCell>
                                {comparisonPlans.map((plan) => (
                                  <TableCell key={plan.id} className="text-center">
                                    ${plan.outOfPocketMax.toLocaleString()}
                                  </TableCell>
                                ))}
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Network Type</TableCell>
                                {comparisonPlans.map((plan) => (
                                  <TableCell key={plan.id} className="text-center capitalize">
                                    {plan.networkType}
                                  </TableCell>
                                ))}
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Primary Care Copay</TableCell>
                                {comparisonPlans.map((plan) => (
                                  <TableCell key={plan.id} className="text-center">
                                    ${plan.copays.primaryCare}
                                  </TableCell>
                                ))}
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Specialist Copay</TableCell>
                                {comparisonPlans.map((plan) => (
                                  <TableCell key={plan.id} className="text-center">
                                    ${plan.copays.specialist}
                                  </TableCell>
                                ))}
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">ER Copay</TableCell>
                                {comparisonPlans.map((plan) => (
                                  <TableCell key={plan.id} className="text-center">
                                    ${plan.copays.emergencyRoom}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableBody>
                          </Table>
                        </ScrollArea>

                        <Separator />

                        {/* AI Analysis */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-purple-600" />
                              AI Analysis
                            </h3>
                            <Button
                              onClick={() => comparePlansMutation.mutate(comparisonPlans.map((p) => p.id))}
                              disabled={comparePlansMutation.isPending}
                              data-testid="button-ai-analysis"
                            >
                              {comparePlansMutation.isPending ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  <Brain className="w-4 h-4 mr-2" />
                                  Get AI Analysis
                                </>
                              )}
                            </Button>
                          </div>

                          {comparePlansMutation.data && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-4"
                            >
                              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                  {comparePlansMutation.data.analysis}
                                </p>
                              </div>

                              {comparePlansMutation.data.recommendations?.map((rec: any) => {
                                const plan = comparisonPlans.find((p) => p.id === rec.planId);
                                return (
                                  <div key={rec.planId} className="p-4 border rounded-lg">
                                    <h4 className="font-medium mb-3">{plan?.name}</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h5 className="text-sm font-medium text-green-600 mb-2 flex items-center gap-1">
                                          <CheckCircle className="w-4 h-4" />
                                          Pros
                                        </h5>
                                        <ul className="text-sm space-y-1">
                                          {rec.pros.map((pro: string, idx: number) => (
                                            <li key={idx} className="text-gray-600 dark:text-gray-400">
                                              • {pro}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <h5 className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
                                          <XCircle className="w-4 h-4" />
                                          Cons
                                        </h5>
                                        <ul className="text-sm space-y-1">
                                          {rec.cons.map((con: string, idx: number) => (
                                            <li key={idx} className="text-gray-600 dark:text-gray-400">
                                              • {con}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Select Plans to Compare
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Add 2-5 plans from the Browse tab to compare them side by side.
                        </p>
                        <Button onClick={() => setActiveTab("browse")} data-testid="button-add-plans-compare">
                          Browse Plans
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* My Plans Tab */}
              <TabsContent value="my-plans" className="space-y-4">
                {isAuthenticated ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-500" />
                            My Insurance Plans
                          </CardTitle>
                          <CardDescription>
                            Manage your saved insurance plans
                          </CardDescription>
                        </div>
                        <Dialog open={addPlanDialogOpen} onOpenChange={setAddPlanDialogOpen}>
                          <DialogTrigger asChild>
                            <Button data-testid="button-add-plan">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Plan
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Insurance Plan</DialogTitle>
                              <DialogDescription>
                                Enter your insurance plan details to save it to your profile.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="plan-select">Select Plan</Label>
                                <Select
                                  value={newPlanForm.planId}
                                  onValueChange={(value) => setNewPlanForm((prev) => ({ ...prev, planId: value }))}
                                >
                                  <SelectTrigger id="plan-select" data-testid="select-plan-to-add">
                                    <SelectValue placeholder="Choose a plan" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {allPlans.map((plan) => (
                                      <SelectItem key={plan.id} value={plan.id}>
                                        {plan.providerName} - {plan.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="member-number">Member Number</Label>
                                <Input
                                  id="member-number"
                                  placeholder="Enter member number"
                                  value={newPlanForm.memberNumber}
                                  onChange={(e) => setNewPlanForm((prev) => ({ ...prev, memberNumber: e.target.value }))}
                                  data-testid="input-member-number"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="group-number">Group Number</Label>
                                <Input
                                  id="group-number"
                                  placeholder="Enter group number"
                                  value={newPlanForm.groupNumber}
                                  onChange={(e) => setNewPlanForm((prev) => ({ ...prev, groupNumber: e.target.value }))}
                                  data-testid="input-group-number"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="effective-date">Effective Date</Label>
                                <Input
                                  id="effective-date"
                                  type="date"
                                  value={newPlanForm.effectiveDate}
                                  onChange={(e) => setNewPlanForm((prev) => ({ ...prev, effectiveDate: e.target.value }))}
                                  data-testid="input-effective-date"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button
                                onClick={() => saveUserPlanMutation.mutate(newPlanForm)}
                                disabled={!newPlanForm.planId || saveUserPlanMutation.isPending}
                                data-testid="button-save-plan"
                              >
                                {saveUserPlanMutation.isPending ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                  </>
                                ) : (
                                  "Save Plan"
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loadingUserPlans ? (
                        <div className="space-y-3">
                          {Array(2).fill(0).map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full" />
                          ))}
                        </div>
                      ) : userPlans.length === 0 ? (
                        <div className="text-center py-8">
                          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No Saved Plans
                          </h3>
                          <p className="text-gray-500 mb-4">
                            Add your insurance plans to easily access and manage them.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {userPlans.map((plan) => (
                            <div
                              key={plan.id}
                              className={`p-4 border rounded-lg ${
                                plan.isPrimary
                                  ? "border-amber-300 bg-amber-50 dark:bg-amber-900/20"
                                  : "border-gray-200 dark:border-gray-700"
                              }`}
                              data-testid={`user-plan-${plan.id}`}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                      {plan.planName}
                                    </h4>
                                    {plan.isPrimary && (
                                      <Badge className="bg-amber-500 text-white">
                                        <Star className="w-3 h-3 mr-1" />
                                        Primary
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 mt-1">{plan.providerName}</p>
                                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                                    <span>Member: {plan.memberNumber}</span>
                                    <span>Group: {plan.groupNumber}</span>
                                    <span>Effective: {new Date(plan.effectiveDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => deleteUserPlanMutation.mutate(plan.id)}
                                  data-testid={`button-delete-plan-${plan.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Sign In Required
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Please sign in to save and manage your insurance plans.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Common Questions Sidebar */}
          <div className="lg:w-80 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  Common Terms
                </CardTitle>
                <CardDescription>
                  Quick explanations of insurance terminology
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {commonTerms.map((term) => (
                  <Dialog key={term.term}>
                    <DialogTrigger asChild>
                      <button
                        className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        data-testid={`button-term-${term.term.toLowerCase().replace(/\s/g, '-')}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <term.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {term.term}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <term.icon className="w-5 h-5 text-blue-600" />
                          {term.term}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-gray-700 dark:text-gray-300">{term.definition}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {comparisonPlans.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Plans Selected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {comparisonPlans.map((plan) => (
                      <div key={plan.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
                          {plan.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => togglePlanComparison(plan)}
                        >
                          <XCircle className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    ))}
                    {comparisonPlans.length >= 2 && (
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => setActiveTab("compare")}
                      >
                        Compare Plans
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Explain Benefit Dialog */}
      <Dialog open={explainDialogOpen} onOpenChange={setExplainDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              {currentBenefit?.name}
            </DialogTitle>
            <DialogDescription>
              AI-powered explanation in plain English
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {explainBenefitMutation.isPending ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              </div>
            ) : explainBenefitMutation.data ? (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {explainBenefitMutation.data.explanation}
                  </p>
                </div>

                {explainBenefitMutation.data.examples?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      Examples
                    </h4>
                    <ul className="space-y-2">
                      {explainBenefitMutation.data.examples.map((example: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {explainBenefitMutation.data.tips?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Tips
                    </h4>
                    <ul className="space-y-2">
                      {explainBenefitMutation.data.tips.map((tip: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Click a benefit's "Explain This" button to get an explanation.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
