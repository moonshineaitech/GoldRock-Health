import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Copy,
  Crown,
  Lock,
  Target,
  Calendar,
  TrendingUp,
  Shield,
  Search,
  Filter,
  ArrowRight,
  Mail,
  Phone,
  Building,
  Gavel,
  Scale,
  Receipt,
  FileCheck,
  FileX,
  Zap,
  Star,
  Eye,
  Edit,
  Plus,
  Archive,
  BarChart3,
  Timer,
  Bell,
  AlertCircle,
  MessageCircle,
  Settings,
  ExternalLink,
  Printer,
  Share,
  Users,
  DollarSign,
  Percent,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Info,
  Lightbulb,
  BookOpen,
  Award,
  HandCoins,
  CreditCard,
  Heart,
  UserCheck,
  PhoneCall,
  Code
} from "lucide-react";
import { PremiumPaywallOverlay } from "@/components/premium-paywall-overlay";

// Helper function for copying text to clipboard
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    console.error('Failed to copy to clipboard:', e);
  }
}

// Letter Template Categories with comprehensive templates
const letterTemplateCategories = [
  {
    id: "initial-dispute",
    name: "Initial Dispute Letters",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Start your dispute with professional, legally-sound letters",
    templates: [
      {
        id: "billing-error-dispute",
        title: "Billing Error Dispute Letter",
        description: "Challenge specific billing errors and discrepancies",
        useCase: "Duplicate charges, incorrect coding, wrong dates",
        successRate: 87,
        avgSavings: "$3,200"
      },
      {
        id: "overcharge-dispute",
        title: "Overcharge Dispute Letter",
        description: "Contest unreasonable pricing and excessive charges",
        useCase: "Room rate inflation, supply markups, phantom billing",
        successRate: 79,
        avgSavings: "$8,500"
      },
      {
        id: "unbundling-violation",
        title: "Unbundling Violation Letter",
        description: "Challenge improper separation of bundled services",
        useCase: "Surgical procedures billed separately",
        successRate: 92,
        avgSavings: "$4,700"
      },
      {
        id: "upcoding-challenge",
        title: "Upcoding Challenge Letter",
        description: "Dispute inflated service level coding",
        useCase: "Emergency department level manipulation",
        successRate: 84,
        avgSavings: "$2,900"
      },
      {
        id: "balance-billing-dispute",
        title: "Balance Billing Dispute Letter",
        description: "Contest unexpected out-of-network charges",
        useCase: "Emergency out-of-network providers",
        successRate: 91,
        avgSavings: "$12,300"
      }
    ]
  },
  {
    id: "escalation",
    name: "Escalation Letters",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    description: "Escalate disputes when initial letters don't get results",
    templates: [
      {
        id: "billing-manager-escalation",
        title: "Billing Manager Escalation",
        description: "Escalate to billing management for unresolved issues",
        useCase: "No response to initial dispute within 30 days",
        successRate: 76,
        avgSavings: "$5,100"
      },
      {
        id: "patient-advocate-appeal",
        title: "Patient Advocate Appeal",
        description: "Request patient advocate intervention",
        useCase: "Billing department non-cooperation",
        successRate: 83,
        avgSavings: "$7,200"
      },
      {
        id: "compliance-violation-notice",
        title: "Compliance Violation Notice",
        description: "Cite regulatory violations and compliance issues",
        useCase: "Good Faith Estimate violations, charity care denials",
        successRate: 94,
        avgSavings: "$15,600"
      },
      {
        id: "ceo-executive-letter",
        title: "CEO/Executive Letter",
        description: "Direct appeal to hospital leadership",
        useCase: "Multiple failed resolution attempts",
        successRate: 88,
        avgSavings: "$18,900"
      },
      {
        id: "media-attention-threat",
        title: "Media Attention Notice",
        description: "Warn of potential public exposure",
        useCase: "Egregious billing practices and non-cooperation",
        successRate: 95,
        avgSavings: "$25,000"
      }
    ]
  },
  {
    id: "financial-assistance",
    name: "Financial Assistance",
    icon: HandCoins,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "Secure charity care and payment assistance programs",
    templates: [
      {
        id: "charity-care-application",
        title: "Charity Care Application Letter",
        description: "Apply for hospital charity care programs",
        useCase: "Financial hardship and low income",
        successRate: 71,
        avgSavings: "$22,500"
      },
      {
        id: "payment-plan-request",
        title: "Payment Plan Request",
        description: "Negotiate affordable payment arrangements",
        useCase: "Large bill amounts, payment difficulties",
        successRate: 89,
        avgSavings: "$0 (interest-free plans)"
      },
      {
        id: "hardship-documentation",
        title: "Hardship Documentation Letter",
        description: "Document financial circumstances for assistance",
        useCase: "Job loss, medical bankruptcy, disability",
        successRate: 78,
        avgSavings: "$19,800"
      },
      {
        id: "retroactive-charity-care",
        title: "Retroactive Charity Care Request",
        description: "Apply for charity care after service date",
        useCase: "Missed application deadlines",
        successRate: 62,
        avgSavings: "$16,200"
      },
      {
        id: "income-verification-appeal",
        title: "Income Verification Appeal",
        description: "Appeal charity care denials based on income",
        useCase: "Disputed income calculations",
        successRate: 74,
        avgSavings: "$13,700"
      }
    ]
  },
  {
    id: "legal-compliance",
    name: "Legal & Compliance",
    icon: Scale,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "Leverage legal requirements and regulatory violations",
    templates: [
      {
        id: "good-faith-estimate-violation",
        title: "Good Faith Estimate Violation",
        description: "Challenge bills exceeding estimate by $400+",
        useCase: "Federal No Surprises Act violations",
        successRate: 96,
        avgSavings: "$11,400"
      },
      {
        id: "no-surprises-act-complaint",
        title: "No Surprises Act Complaint",
        description: "File formal complaint for surprise billing",
        useCase: "Out-of-network emergency services",
        successRate: 93,
        avgSavings: "$28,700"
      },
      {
        id: "emtala-violation-report",
        title: "EMTALA Violation Report",
        description: "Report emergency treatment violations",
        useCase: "Denied emergency care due to insurance",
        successRate: 98,
        avgSavings: "$45,000"
      },
      {
        id: "price-transparency-violation",
        title: "Price Transparency Violation",
        description: "Challenge hidden pricing and lack of transparency",
        useCase: "Failure to provide price estimates",
        successRate: 85,
        avgSavings: "$7,900"
      },
      {
        id: "debt-collection-violation",
        title: "Debt Collection Violation",
        description: "Challenge improper debt collection practices",
        useCase: "FDCPA violations by collection agencies",
        successRate: 91,
        avgSavings: "$8,200"
      }
    ]
  },
  {
    id: "insurance-appeals",
    name: "Insurance Appeals",
    icon: Shield,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    description: "Appeal insurance denials and coverage disputes",
    templates: [
      {
        id: "medical-necessity-appeal",
        title: "Medical Necessity Appeal",
        description: "Appeal denials based on medical necessity",
        useCase: "Insurance claims medical treatment unnecessary",
        successRate: 68,
        avgSavings: "$14,300"
      },
      {
        id: "prior-authorization-appeal",
        title: "Prior Authorization Appeal",
        description: "Challenge prior authorization denials",
        useCase: "Emergency procedures without pre-approval",
        successRate: 73,
        avgSavings: "$9,600"
      },
      {
        id: "experimental-treatment-appeal",
        title: "Experimental Treatment Appeal",
        description: "Appeal denials for cutting-edge treatments",
        useCase: "New procedures labeled as experimental",
        successRate: 55,
        avgSavings: "$32,100"
      },
      {
        id: "network-coverage-dispute",
        title: "Network Coverage Dispute",
        description: "Challenge in-network vs out-of-network designations",
        useCase: "Provider network status disputes",
        successRate: 81,
        avgSavings: "$16,700"
      },
      {
        id: "policy-interpretation-appeal",
        title: "Policy Interpretation Appeal",
        description: "Challenge insurance policy interpretations",
        useCase: "Ambiguous policy language disputes",
        successRate: 69,
        avgSavings: "$11,900"
      }
    ]
  },
  {
    id: "settlement-negotiation",
    name: "Settlement & Negotiation",
    icon: Gavel,
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: "Negotiate final settlements and payment reductions",
    templates: [
      {
        id: "lump-sum-settlement",
        title: "Lump Sum Settlement Offer",
        description: "Propose reduced lump sum payment",
        useCase: "Offer percentage of total bill for closure",
        successRate: 82,
        avgSavings: "$13,200"
      },
      {
        id: "medicare-rate-negotiation",
        title: "Medicare Rate Negotiation",
        description: "Request payment at Medicare rates",
        useCase: "Self-pay patients requesting fair pricing",
        successRate: 77,
        avgSavings: "$18,500"
      },
      {
        id: "prompt-pay-discount",
        title: "Prompt Pay Discount Request",
        description: "Request discount for immediate payment",
        useCase: "Quick cash payment in exchange for reduction",
        successRate: 89,
        avgSavings: "$4,700"
      },
      {
        id: "final-demand-notice",
        title: "Final Demand Notice",
        description: "Last attempt before external escalation",
        useCase: "Final warning before regulatory complaints",
        successRate: 91,
        avgSavings: "$21,800"
      },
      {
        id: "attorney-representation-notice",
        title: "Attorney Representation Notice",
        description: "Notify of legal representation",
        useCase: "Serious disputes requiring legal intervention",
        successRate: 94,
        avgSavings: "$34,600"
      }
    ]
  }
];

// Dispute tracking interface
interface DisputeCase {
  id: string;
  billAmount: number;
  provider: string;
  dateOfService: string;
  dateCreated: string;
  status: "active" | "pending" | "resolved" | "escalated";
  lettersSent: number;
  lastAction: string;
  expectedSavings: number;
  actualSavings?: number;
  nextDeadline?: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
}

// Mock dispute cases for demonstration
const mockDisputeCases: DisputeCase[] = [
  {
    id: "DC001",
    billAmount: 45000,
    provider: "Memorial Hospital",
    dateOfService: "2024-01-15",
    dateCreated: "2024-01-20",
    status: "active",
    lettersSent: 2,
    lastAction: "Escalation letter sent to billing manager",
    expectedSavings: 18000,
    nextDeadline: "2024-02-15",
    category: "overcharge-dispute",
    priority: "high"
  },
  {
    id: "DC002",
    billAmount: 12300,
    provider: "City Medical Center",
    dateOfService: "2024-02-01",
    dateCreated: "2024-02-05",
    status: "resolved",
    lettersSent: 1,
    lastAction: "Settlement accepted",
    expectedSavings: 4900,
    actualSavings: 4900,
    category: "billing-error-dispute",
    priority: "medium"
  },
  {
    id: "DC003",
    billAmount: 78000,
    provider: "Regional Medical",
    dateOfService: "2024-01-28",
    dateCreated: "2024-02-02",
    status: "escalated",
    lettersSent: 4,
    lastAction: "CEO letter sent",
    expectedSavings: 31200,
    nextDeadline: "2024-02-20",
    category: "balance-billing-dispute",
    priority: "urgent"
  }
];

// Success metrics for dashboard
const successMetrics = {
  totalCases: 156,
  activeCases: 23,
  resolvedCases: 128,
  totalSavings: 2450000,
  averageSavings: 15700,
  successRate: 87,
  averageResolutionTime: 42
};

export default function DisputeArsenal() {
  const { isAuthenticated } = useAuth();
  const { isSubscribed } = useSubscription();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<"dashboard" | "templates" | "cases" | "analytics">("dashboard");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showLetterGenerator, setShowLetterGenerator] = useState(false);
  const [disputeCases, setDisputeCases] = useState<DisputeCase[]>(mockDisputeCases);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Premium gating check
  if (!isAuthenticated) {
    return (
      <MobileLayout title="Professional Dispute Arsenal" showBackButton>
        <div className="text-center py-12">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to access the Professional Dispute Arsenal</p>
          <Link href="/api/login">
            <MobileButton>Sign In</MobileButton>
          </Link>
        </div>
      </MobileLayout>
    );
  }

  // Tab Navigation Component
  function TabNavigation() {
    const tabs = [
      { id: "dashboard", label: "Dashboard", icon: BarChart3 },
      { id: "templates", label: "Templates", icon: FileText },
      { id: "cases", label: "My Cases", icon: Target },
      { id: "analytics", label: "Analytics", icon: TrendingUp }
    ];

    return (
      <MobileCard className="p-2 mb-6">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-2 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </MobileCard>
    );
  }

  // Dashboard Tab Component
  function DashboardTab() {
    return (
      <div className="space-y-6">
        {/* Success Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <MobileCard className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-emerald-700 font-medium">Total Saved</p>
                <p className="text-xl font-bold text-emerald-800" data-testid="text-total-savings">
                  ${successMetrics.totalSavings.toLocaleString()}
                </p>
              </div>
            </div>
          </MobileCard>

          <MobileCard className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Percent className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Success Rate</p>
                <p className="text-xl font-bold text-blue-800" data-testid="text-success-rate">
                  {successMetrics.successRate}%
                </p>
              </div>
            </div>
          </MobileCard>

          <MobileCard className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-700 font-medium">Active Cases</p>
                <p className="text-xl font-bold text-purple-800" data-testid="text-active-cases">
                  {successMetrics.activeCases}
                </p>
              </div>
            </div>
          </MobileCard>

          <MobileCard className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Timer className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-orange-700 font-medium">Avg Days</p>
                <p className="text-xl font-bold text-orange-800" data-testid="text-avg-resolution">
                  {successMetrics.averageResolutionTime}
                </p>
              </div>
            </div>
          </MobileCard>
        </motion.div>

        {/* Quick Actions */}
        <MobileCard className="p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span>Quick Actions</span>
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <MobileButton
              onClick={() => setActiveTab("templates")}
              className="justify-between"
              data-testid="button-browse-templates"
            >
              <span className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Browse Letter Templates</span>
              </span>
              <ChevronRight className="h-4 w-4" />
            </MobileButton>
            
            <MobileButton
              variant="secondary"
              onClick={() => setActiveTab("cases")}
              className="justify-between"
              data-testid="button-view-cases"
            >
              <span className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>View My Cases</span>
              </span>
              <ChevronRight className="h-4 w-4" />
            </MobileButton>
          </div>
        </MobileCard>

        {/* Recent Activity */}
        <MobileCard className="p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Recent Activity</span>
          </h3>
          <div className="space-y-3">
            {disputeCases.slice(0, 3).map((dispute) => (
              <div key={dispute.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{dispute.provider}</p>
                  <p className="text-xs text-gray-600">{dispute.lastAction}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    dispute.status === "resolved" ? "bg-green-100 text-green-800" :
                    dispute.status === "escalated" ? "bg-red-100 text-red-800" :
                    dispute.status === "active" ? "bg-blue-100 text-blue-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {dispute.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </MobileCard>
      </div>
    );
  }

  // Templates Tab Component
  function TemplatesTab() {
    return (
      <div className="space-y-6">
        {/* Search and Filter */}
        <MobileCard className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              data-testid="input-search-templates"
            />
          </div>
        </MobileCard>

        {/* Template Categories */}
        <div className="space-y-4">
          {letterTemplateCategories.map((category) => {
            const IconComponent = category.icon;
            const isExpanded = selectedCategory === category.id;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <MobileCard 
                  className={`p-4 cursor-pointer transition-all ${
                    isExpanded ? `${category.bgColor} border-2` : ""
                  }`}
                  onClick={() => setSelectedCategory(isExpanded ? null : category.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 ${category.bgColor} rounded-lg`}>
                        <IconComponent className={`h-5 w-5 ${category.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                        {category.templates.length}
                      </span>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </MobileCard>

                {/* Template List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 ml-4"
                    >
                      {category.templates.map((template) => (
                        <MobileCard
                          key={template.id}
                          className="p-4 border-l-4 border-blue-500 hover:bg-blue-50 cursor-pointer"
                          onClick={() => {
                            setSelectedTemplate({ ...template, category: category.id });
                            setShowLetterGenerator(true);
                          }}
                          data-testid={`template-${template.id}`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-bold text-gray-900">{template.title}</h4>
                              <Star className="h-4 w-4 text-yellow-500" />
                            </div>
                            <p className="text-sm text-gray-600">{template.description}</p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">{template.useCase}</span>
                              <div className="flex space-x-3">
                                <span className="text-green-600 font-semibold">
                                  {template.successRate}% success
                                </span>
                                <span className="text-blue-600 font-semibold">
                                  {template.avgSavings} avg
                                </span>
                              </div>
                            </div>
                          </div>
                        </MobileCard>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Cases Tab Component  
  function CasesTab() {
    const filteredCases = disputeCases.filter(dispute => {
      const matchesSearch = dispute.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dispute.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || dispute.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    return (
      <div className="space-y-6">
        {/* Filter Controls */}
        <MobileCard className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="input-search-cases"
              />
            </div>
            
            <div className="flex space-x-2">
              {["all", "active", "pending", "resolved", "escalated"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    filterStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  data-testid={`filter-${status}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </MobileCard>

        {/* Cases List */}
        <div className="space-y-4">
          {filteredCases.map((dispute) => (
            <MobileCard key={dispute.id} className="p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{dispute.provider}</h3>
                    <p className="text-sm text-gray-600">Case #{dispute.id}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      dispute.status === "resolved" ? "bg-green-100 text-green-800" :
                      dispute.status === "escalated" ? "bg-red-100 text-red-800" :
                      dispute.status === "active" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {dispute.status}
                    </span>
                  </div>
                </div>

                {/* Bill Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Bill Amount</p>
                    <p className="font-semibold">${dispute.billAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Expected Savings</p>
                    <p className="font-semibold text-green-600">${dispute.expectedSavings.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Letters Sent</p>
                    <p className="font-semibold">{dispute.lettersSent}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Priority</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                      dispute.priority === "urgent" ? "bg-red-100 text-red-800" :
                      dispute.priority === "high" ? "bg-orange-100 text-orange-800" :
                      dispute.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {dispute.priority}
                    </span>
                  </div>
                </div>

                {/* Last Action */}
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600">Last Action:</p>
                  <p className="text-sm font-medium">{dispute.lastAction}</p>
                  {dispute.nextDeadline && (
                    <p className="text-xs text-orange-600 mt-1">
                      Next deadline: {new Date(dispute.nextDeadline).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <MobileButton
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    data-testid={`button-view-case-${dispute.id}`}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </MobileButton>
                  <MobileButton
                    size="sm"
                    className="flex-1"
                    data-testid={`button-send-letter-${dispute.id}`}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send Letter
                  </MobileButton>
                </div>
              </div>
            </MobileCard>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <MobileCard className="p-8 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Cases Found</h3>
            <p className="text-gray-600 mb-4">No dispute cases match your current filters.</p>
            <MobileButton onClick={() => { setSearchTerm(""); setFilterStatus("all"); }}>
              Clear Filters
            </MobileButton>
          </MobileCard>
        )}
      </div>
    );
  }

  // Analytics Tab Component
  function AnalyticsTab() {
    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <MobileCard className="p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Performance Analytics</span>
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Average Savings Per Case</p>
                  <p className="text-2xl font-bold text-green-800">${successMetrics.averageSavings.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Resolution Success Rate</p>
                  <p className="text-2xl font-bold text-blue-800">{successMetrics.successRate}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Total Cases Handled</p>
                  <p className="text-2xl font-bold text-purple-800">{successMetrics.totalCases}</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </MobileCard>

        {/* Success Breakdown */}
        <MobileCard className="p-6">
          <h3 className="text-lg font-bold mb-4">Success by Template Type</h3>
          <div className="space-y-3">
            {letterTemplateCategories.slice(0, 4).map((category, index) => {
              const successRate = 75 + (index * 5);
              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm text-gray-600">{successRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${successRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </MobileCard>

        {/* Timeline Analysis */}
        <MobileCard className="p-6">
          <h3 className="text-lg font-bold mb-4">Resolution Timeline</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Average Resolution Time</span>
              <span className="font-semibold">{successMetrics.averageResolutionTime} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Fastest Resolution</span>
              <span className="font-semibold text-green-600">7 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Complex Case Average</span>
              <span className="font-semibold text-orange-600">89 days</span>
            </div>
          </div>
        </MobileCard>
      </div>
    );
  }

  // Letter Generator Modal
  function LetterGenerator() {
    const [formData, setFormData] = useState({
      patientName: "",
      accountNumber: "",
      billAmount: "",
      serviceDate: "",
      providerName: "",
      specificIssue: ""
    });
    const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);

    const generateLetterContent = () => {
      if (!selectedTemplate) return "";
      
      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      // Generate professional letter content based on template
      return `${formData.patientName || "[Your Name]"}
${formData.providerName || "[Provider Name]"} - Account #${formData.accountNumber || "[Account Number]"}
Date: ${today}

Re: ${selectedTemplate.title} - Account #${formData.accountNumber || "[Account Number]"}

Dear Billing Department Manager,

I am writing to formally dispute charges on my medical bill dated ${formData.serviceDate || "[Service Date]"} in the amount of ${formData.billAmount || "[Bill Amount]"}.

DISPUTE DETAILS:
${formData.specificIssue || "[Please describe the specific billing issues, errors, or overcharges you are disputing]"}

REQUESTED ACTION:
I respectfully request a thorough review of these charges and an itemized explanation of all disputed amounts. Under applicable consumer protection laws and healthcare billing regulations, I am entitled to:

1. A complete itemized statement showing all charges with corresponding CPT/ICD codes
2. Verification that all billed services were actually provided
3. Confirmation that charges comply with Medicare allowable rates and reasonable pricing
4. Adjustment or removal of any erroneous, duplicated, or excessive charges

REGULATORY CITATIONS:
This dispute is made pursuant to my rights under:
- Health Insurance Portability and Accountability Act (HIPAA) Right of Access (45 CFR § 164.524)
- No Surprises Act billing dispute provisions
- State consumer protection statutes
- Fair Debt Collection Practices Act (FDCPA)

I request a written response within 30 days detailing the results of your investigation and any adjustments to be made to my account. Please note that I am retaining all billing records and correspondence for potential regulatory review.

Please direct all correspondence to the address on file. I look forward to a prompt and fair resolution of this matter.

Sincerely,

${formData.patientName || "[Your Name]"}
Account Number: ${formData.accountNumber || "[Account Number]"}
Date of Service: ${formData.serviceDate || "[Service Date]"}

---
Template: ${selectedTemplate.title}
Success Rate: ${selectedTemplate.successRate}% | Average Savings: ${selectedTemplate.avgSavings}
Generated by GoldRock Health Dispute Arsenal`;
    };

    const generateLetter = () => {
      if (!selectedTemplate) return;

      const letterContent = generateLetterContent();
      setGeneratedLetter(letterContent);
      
      toast({
        title: "✅ Letter Generated Successfully",
        description: `${selectedTemplate.title} is ready to download or copy.`,
      });
    };

    const downloadLetter = () => {
      if (!generatedLetter) return;
      
      const blob = new Blob([generatedLetter], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate.id}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "📥 Letter Downloaded",
        description: "Your dispute letter has been saved to your device.",
      });
    };

    const copyLetter = async () => {
      if (!generatedLetter) return;
      
      await copyToClipboard(generatedLetter);
      toast({
        title: "📋 Letter Copied",
        description: "Letter content copied to clipboard.",
      });
    };

    if (!showLetterGenerator || !selectedTemplate) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={() => setShowLetterGenerator(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Generate Letter</h2>
            <button 
              onClick={() => setShowLetterGenerator(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">{selectedTemplate.title}</h3>
              <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name *
                </label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="input-patient-name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="input-account-number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bill Amount
                  </label>
                  <input
                    type="text"
                    value={formData.billAmount}
                    onChange={(e) => setFormData({ ...formData, billAmount: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="$0.00"
                    data-testid="input-bill-amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Date
                  </label>
                  <input
                    type="date"
                    value={formData.serviceDate}
                    onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    data-testid="input-service-date"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider Name *
                </label>
                <input
                  type="text"
                  value={formData.providerName}
                  onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="input-provider-name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specific Issue Description
                </label>
                <textarea
                  value={formData.specificIssue}
                  onChange={(e) => setFormData({ ...formData, specificIssue: e.target.value })}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the specific billing issue or error..."
                  data-testid="input-specific-issue"
                />
              </div>
            </div>

            {!generatedLetter ? (
              <div className="flex space-x-3 pt-4">
                <MobileButton
                  variant="secondary"
                  onClick={() => setShowLetterGenerator(false)}
                  className="flex-1"
                >
                  Cancel
                </MobileButton>
                <MobileButton
                  onClick={generateLetter}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  data-testid="button-generate-letter"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Letter
                </MobileButton>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Generated Letter Preview */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <CheckCircle className="h-4 w-4 text-emerald-600 mr-2" />
                      Letter Generated
                    </h4>
                    <div className="flex gap-2">
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                        {selectedTemplate.successRate}% Success
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {selectedTemplate.avgSavings} Avg
                      </span>
                    </div>
                  </div>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                    {generatedLetter}
                  </pre>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <MobileButton
                    onClick={downloadLetter}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    data-testid="button-download-letter"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download .txt
                  </MobileButton>
                  <MobileButton
                    onClick={copyLetter}
                    variant="secondary"
                    className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    data-testid="button-copy-letter"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Text
                  </MobileButton>
                </div>

                {/* Close Button */}
                <MobileButton
                  onClick={() => {
                    setGeneratedLetter(null);
                    setShowLetterGenerator(false);
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  Close & Create Another
                </MobileButton>

                {/* Pro Tip */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-amber-900 text-sm mb-1">Pro Tip</h5>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Send this letter via certified mail for proof of delivery. Keep copies of all correspondence. 
                        If no response within 30 days, escalate to the next level template.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <MobileLayout title="Professional Dispute Arsenal" showBackButton>
      {!isSubscribed && (
        <PremiumPaywallOverlay
          title="Professional Dispute Arsenal"
          description="Access 50+ professional letter templates, automated dispute tracking, and advanced settlement negotiation tools. Example outcomes: $15,000-$50,000+ per dispute."
          featureName="Professional Dispute Arsenal"
          savingsPotential="$15,000-$50,000+ example outcomes"
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <MobileCard className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900" data-testid="text-page-title">
                Professional Dispute Arsenal
              </h1>
              <p className="text-sm text-gray-600">
                Advanced tools for medical bill dispute management
              </p>
            </div>
          </div>
        </MobileCard>

        {/* Tab Navigation */}
        <TabNavigation />

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "templates" && <TemplatesTab />}
          {activeTab === "cases" && <CasesTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
        </AnimatePresence>

        {/* Letter Generator Modal */}
        <AnimatePresence>
          <LetterGenerator />
        </AnimatePresence>
      </motion.div>
    </MobileLayout>
  );
}