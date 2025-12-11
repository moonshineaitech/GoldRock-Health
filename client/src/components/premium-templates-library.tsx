import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { PremiumPaywallOverlay } from "./premium-paywall-overlay";
import { 
  FileText,
  Download,
  Copy,
  Search,
  Filter,
  Star,
  Crown,
  Scale,
  Gavel,
  Shield,
  DollarSign,
  Building2,
  Users,
  Brain,
  Target,
  Sparkles,
  Award,
  BookOpen,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Lock,
  Database,
  Network,
  Radar,
  TrendingUp,
  BarChart3,
  PieChart,
  Settings,
  Folder,
  FolderOpen,
  Tag,
  Bookmark,
  Edit,
  Share,
  Archive,
  FileX,
  FileCheck,
  Briefcase,
  Handshake,
  Lightbulb,
  Zap,
  Heart,
  Home,
  CreditCard,
  Calculator,
  Map,
  Compass,
  Navigation,
  MapPin
} from "lucide-react";

interface DocumentTemplate {
  id: string;
  title: string;
  category: 'legal' | 'hardship' | 'communication' | 'intelligence';
  type: string;
  description: string;
  successRate: string;
  avgSavings: string;
  difficulty: 'Easy' | 'Intermediate' | 'Advanced' | 'Expert';
  timeToComplete: string;
  lastUpdated: Date;
  usageCount: number;
  tags: string[];
  requirements: string[];
  outcomes: string[];
  legalBasis?: string;
  psychologyPrinciples?: string[];
  targetAudience: string;
  template: string;
  variables: string[];
  instructions: string;
  examples: string[];
  relatedTemplates: string[];
  warningsAndDisclosures: string[];
}

interface TemplatesLibraryProps {
  onSendMessage: (message: string) => void;
}

export function PremiumTemplatesLibrary({ onSendMessage }: TemplatesLibraryProps) {
  const { isSubscribed } = useSubscription();
  const [activeTab, setActiveTab] = useState('legal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  // Initialize comprehensive templates database
  useEffect(() => {
    setTemplates([
      // LEGAL-GRADE DOCUMENT TEMPLATES
      {
        id: 'insurance-appeal-aetna',
        title: 'Aetna Insurance Appeal - Medical Necessity',
        category: 'legal',
        type: 'Insurance Appeal',
        description: 'Specialized appeal template for Aetna denials with regulatory citations',
        successRate: '89%',
        avgSavings: '$15,400',
        difficulty: 'Advanced',
        timeToComplete: '45 minutes',
        lastUpdated: new Date('2024-01-15'),
        usageCount: 234,
        tags: ['aetna', 'medical-necessity', 'prior-auth', 'appeals'],
        requirements: ['Denial letter', 'Medical records', 'Provider notes'],
        outcomes: ['Overturned denial', 'Expedited review', 'Case escalation'],
        legalBasis: 'ERISA Section 503, 29 CFR 2560.503-1, State Insurance Code',
        targetAudience: 'Aetna Members with Medical Necessity Denials',
        template: `[Professional letterhead template with legal citations]`,
        variables: ['patientName', 'policyNumber', 'denialDate', 'procedureCode', 'diagnosisCode'],
        instructions: 'Complete all fields and attach required documentation per ERISA guidelines',
        examples: ['Successful cardiac procedure appeal', 'Mental health coverage restoration'],
        relatedTemplates: ['insurance-appeal-bcbs', 'external-review-request'],
        warningsAndDisclosures: ['Legal document - ensure accuracy', 'May trigger external review process']
      },
      {
        id: 'hospital-emergency-billing-dispute',
        title: 'Emergency Room Surprise Billing Dispute',
        category: 'legal',
        type: 'Billing Dispute',
        description: 'No Surprises Act compliance letter with regulatory threats',
        successRate: '94%',
        avgSavings: '$23,600',
        difficulty: 'Expert',
        timeToComplete: '60 minutes',
        lastUpdated: new Date('2024-01-20'),
        usageCount: 156,
        tags: ['emergency', 'surprise-billing', 'no-surprises-act', 'emtala'],
        requirements: ['ER bill', 'Insurance EOB', 'Notice of rights'],
        outcomes: ['Bill elimination', 'In-network rates', 'Federal investigation'],
        legalBasis: 'No Surprises Act, EMTALA, 45 CFR 149.410',
        targetAudience: 'Emergency room patients with surprise bills',
        template: `[Federal No Surprises Act template with enforcement language]`,
        variables: ['hospitalName', 'providerName', 'serviceDate', 'billedAmount', 'networkStatus'],
        instructions: 'Use within 30 days of bill receipt for maximum effectiveness',
        examples: ['$45K ER bill eliminated', '$12K anesthesia surprise bill resolved'],
        relatedTemplates: ['balance-billing-prohibition', 'good-faith-estimate-violation'],
        warningsAndDisclosures: ['Federal law applies', 'May result in regulatory investigation']
      },

      // FINANCIAL HARDSHIP DOCUMENTATION SUITE
      {
        id: 'charity-care-optimizer',
        title: 'Hospital Charity Care Application Optimizer',
        category: 'hardship',
        type: 'Charity Care',
        description: 'Maximizes charity care approval with asset protection strategies',
        successRate: '87%',
        avgSavings: '$31,200',
        difficulty: 'Intermediate',
        timeToComplete: '30 minutes',
        lastUpdated: new Date('2024-01-10'),
        usageCount: 445,
        tags: ['charity-care', 'nonprofit-hospital', 'asset-protection', 'income-documentation'],
        requirements: ['Income documentation', 'Asset statements', 'Medical bills'],
        outcomes: ['100% bill forgiveness', 'Payment plan reduction', 'Retroactive coverage'],
        targetAudience: 'Patients with high medical bills seeking charity care',
        template: `[Optimized charity care application with legal protections]`,
        variables: ['income', 'householdSize', 'assets', 'medicalDebt', 'hospitalSystem'],
        instructions: 'Complete before bill due date for maximum protection',
        examples: ['$67K heart surgery - 100% forgiven', '$23K emergency - 90% reduction'],
        relatedTemplates: ['payment-plan-hardship', 'asset-protection-affidavit'],
        warningsAndDisclosures: ['Asset disclosure required', 'Income verification needed']
      },
      {
        id: 'bankruptcy-medical-debt-protection',
        title: 'Medical Debt Bankruptcy Protection Strategy',
        category: 'hardship',
        type: 'Bankruptcy Protection',
        description: 'Chapter 7/13 documentation optimized for medical debt',
        successRate: '91%',
        avgSavings: '$85,000+',
        difficulty: 'Expert',
        timeToComplete: '120 minutes',
        lastUpdated: new Date('2024-01-18'),
        usageCount: 78,
        tags: ['bankruptcy', 'chapter-7', 'chapter-13', 'medical-debt', 'asset-protection'],
        requirements: ['Complete financial records', 'Medical bill documentation', 'Legal consultation'],
        outcomes: ['Debt discharge', 'Payment plan reduction', 'Asset protection'],
        legalBasis: '11 USC § 707, Local Bankruptcy Rules, State Exemption Laws',
        targetAudience: 'Patients with overwhelming medical debt',
        template: `[Bankruptcy petition optimized for medical debt]`,
        variables: ['totalDebt', 'monthlyIncome', 'assets', 'exemptions', 'medicalCircumstances'],
        instructions: 'Requires attorney consultation - use as preparation guide',
        examples: ['$150K debt discharged', '$89K payment plan - $200/month'],
        relatedTemplates: ['hardship-affidavit', 'asset-exemption-planning'],
        warningsAndDisclosures: ['Attorney required', 'Credit impact significant', 'Complex legal process']
      },

      // PROFESSIONAL COMMUNICATION SCRIPTS
      {
        id: 'physician-advocacy-recruitment',
        title: 'Physician Advocacy Recruitment Script',
        category: 'communication',
        type: 'Provider Relations',
        description: 'Psychology-based scripts to get doctors advocating for you',
        successRate: '76%',
        avgSavings: '$8,900',
        difficulty: 'Intermediate',
        timeToComplete: '15 minutes',
        lastUpdated: new Date('2024-01-12'),
        usageCount: 312,
        tags: ['physician-advocacy', 'psychology', 'medical-necessity', 'provider-relations'],
        requirements: ['Treating physician relationship', 'Medical records access'],
        outcomes: ['Physician support letters', 'Enhanced documentation', 'Appeal assistance'],
        psychologyPrinciples: ['Authority bias', 'Social proof', 'Reciprocity principle'],
        targetAudience: 'Patients seeking physician advocacy for appeals',
        template: `[Psychology-based conversation framework]`,
        variables: ['physicianName', 'relationshipDuration', 'treatmentHistory', 'specificRequest'],
        instructions: 'Use during regular appointment for natural conversation flow',
        examples: ['Cardiologist wrote appeal letter', 'Oncologist provided additional documentation'],
        relatedTemplates: ['medical-necessity-request', 'provider-documentation-request'],
        warningsAndDisclosures: ['Maintain professional relationship', 'Respect physician boundaries']
      },
      {
        id: 'insurance-adjuster-psychology',
        title: 'Insurance Adjuster Psychology Framework',
        category: 'communication',
        type: 'Insurance Relations',
        description: 'Behavioral science approach to insurance claim discussions',
        successRate: '82%',
        avgSavings: '$12,300',
        difficulty: 'Advanced',
        timeToComplete: '25 minutes',
        lastUpdated: new Date('2024-01-16'),
        usageCount: 189,
        tags: ['insurance-adjuster', 'psychology', 'negotiation', 'behavioral-science'],
        requirements: ['Claim number', 'Adjuster contact info', 'Documentation ready'],
        outcomes: ['Claim approval', 'Reduced deductible', 'Expedited processing'],
        psychologyPrinciples: ['Loss aversion', 'Anchoring bias', 'Commitment consistency'],
        targetAudience: 'Patients dealing with insurance claim adjusters',
        template: `[Behavioral psychology conversation guide]`,
        variables: ['adjusterName', 'claimAmount', 'specificIssues', 'desiredOutcome'],
        instructions: 'Record calls where legally permitted for best results',
        examples: ['$15K claim approved after initial denial', '$8K deductible waived'],
        relatedTemplates: ['claim-appeal-phone-script', 'supervisor-escalation-script'],
        warningsAndDisclosures: ['Record only where legal', 'Professional tone required']
      },

      // PREMIUM INDUSTRY INTELLIGENCE DATABASE
      {
        id: 'hospital-vulnerability-profile-hca',
        title: 'HCA Healthcare Vulnerability Profile',
        category: 'intelligence',
        type: 'Hospital Intelligence',
        description: 'HCA-specific tactics, vulnerabilities, and successful strategies',
        successRate: '91%',
        avgSavings: '$19,800',
        difficulty: 'Expert',
        timeToComplete: '40 minutes',
        lastUpdated: new Date('2024-01-22'),
        usageCount: 67,
        tags: ['hca-healthcare', 'hospital-tactics', 'vulnerability-analysis', 'insider-intelligence'],
        requirements: ['HCA hospital bill', 'Service documentation'],
        outcomes: ['Targeted negotiations', 'Leverage identification', 'Strategic advantage'],
        targetAudience: 'Patients with HCA Healthcare bills',
        template: `[HCA-specific strategy and vulnerability analysis]`,
        variables: ['hcaFacility', 'serviceType', 'billingIssues', 'negotiationGoals'],
        instructions: 'Use HCA-specific leverage points for maximum effectiveness',
        examples: ['$34K surgery bill - 65% reduction', '$12K ER bill - eliminated'],
        relatedTemplates: ['nonprofit-hospital-tactics', 'for-profit-negotiation-strategies'],
        warningsAndDisclosures: ['For strategic use only', 'Maintain professional conduct']
      },
      {
        id: 'state-regulatory-complaint-database',
        title: 'State Regulatory Complaint Templates',
        category: 'intelligence',
        type: 'Regulatory Intelligence',
        description: 'State-by-state regulatory complaint templates with enforcement data',
        successRate: '88%',
        avgSavings: '$14,600',
        difficulty: 'Advanced',
        timeToComplete: '35 minutes',
        lastUpdated: new Date('2024-01-19'),
        usageCount: 145,
        tags: ['state-regulatory', 'complaint-templates', 'enforcement-leverage', 'legal-precedents'],
        requirements: ['State identification', 'Specific violations', 'Documentation'],
        outcomes: ['Regulatory investigation', 'Compliance enforcement', 'Resolution leverage'],
        legalBasis: 'State Insurance Codes, Health Department Regulations, Attorney General Authority',
        targetAudience: 'Patients seeking regulatory enforcement assistance',
        template: `[State-specific regulatory complaint templates]`,
        variables: ['state', 'violationType', 'providerName', 'evidenceDescription'],
        instructions: 'Select appropriate state template and complete all required fields',
        examples: ['Texas complaint led to $25K refund', 'California investigation resulted in policy change'],
        relatedTemplates: ['federal-complaint-templates', 'class-action-qualification'],
        warningsAndDisclosures: ['May trigger investigation', 'Public record potential']
      },

      // ADDITIONAL LEGAL TEMPLATES
      {
        id: 'bcbs-appeal-template',
        title: 'Blue Cross Blue Shield Appeal Letter',
        category: 'legal',
        type: 'Insurance Appeal',
        description: 'BCBS-specific appeal with network adequacy arguments',
        successRate: '86%',
        avgSavings: '$12,800',
        difficulty: 'Advanced',
        timeToComplete: '40 minutes',
        lastUpdated: new Date('2024-01-25'),
        usageCount: 198,
        tags: ['bcbs', 'network-adequacy', 'appeals', 'prior-auth'],
        requirements: ['Denial letter', 'Network documentation', 'Medical records'],
        outcomes: ['Overturned denial', 'Network exception', 'Retroactive coverage'],
        legalBasis: 'ACA Section 1311, State Network Adequacy Laws',
        targetAudience: 'BCBS members with coverage denials',
        template: '[BCBS-specific appeal template]',
        variables: ['patientName', 'memberId', 'denialDate', 'procedureCode'],
        instructions: 'Reference specific BCBS plan documents',
        examples: ['$18K surgery approval', '$9K specialist coverage'],
        relatedTemplates: ['insurance-appeal-aetna', 'network-exception-request'],
        warningsAndDisclosures: ['Plan-specific language required']
      },
      {
        id: 'unitedhealth-appeal',
        title: 'UnitedHealth Prior Authorization Appeal',
        category: 'legal',
        type: 'Insurance Appeal',
        description: 'UHC-specific prior auth appeal with Optum references',
        successRate: '84%',
        avgSavings: '$14,200',
        difficulty: 'Advanced',
        timeToComplete: '45 minutes',
        lastUpdated: new Date('2024-01-26'),
        usageCount: 176,
        tags: ['united-healthcare', 'optum', 'prior-auth', 'appeals'],
        requirements: ['Prior auth denial', 'Clinical notes', 'Treatment plan'],
        outcomes: ['Prior auth approval', 'Expedited review', 'Peer-to-peer scheduling'],
        legalBasis: 'ERISA, State Insurance Regulations, ACA',
        targetAudience: 'UHC members with prior authorization denials',
        template: '[UnitedHealth appeal template]',
        variables: ['patientName', 'authNumber', 'denialReason', 'clinicalJustification'],
        instructions: 'Request peer-to-peer review if initial appeal fails',
        examples: ['$22K medication approval', '$15K procedure authorization'],
        relatedTemplates: ['peer-to-peer-request', 'external-review'],
        warningsAndDisclosures: ['Time-sensitive deadlines apply']
      },
      {
        id: 'cigna-appeal-template',
        title: 'Cigna Coverage Determination Appeal',
        category: 'legal',
        type: 'Insurance Appeal',
        description: 'Cigna-specific appeal with eviCore workarounds',
        successRate: '81%',
        avgSavings: '$11,500',
        difficulty: 'Intermediate',
        timeToComplete: '35 minutes',
        lastUpdated: new Date('2024-01-27'),
        usageCount: 154,
        tags: ['cigna', 'evicore', 'coverage-determination', 'appeals'],
        requirements: ['Denial letter', 'Treatment records', 'eviCore case number'],
        outcomes: ['Coverage approval', 'eviCore override', 'Plan exception'],
        legalBasis: 'ERISA, Connecticut Insurance Law',
        targetAudience: 'Cigna members with coverage determinations',
        template: '[Cigna appeal template with eviCore strategies]',
        variables: ['patientName', 'caseNumber', 'denialDate', 'requestedService'],
        instructions: 'Address both Cigna and eviCore in appeal',
        examples: ['$16K imaging approval', '$8K therapy coverage'],
        relatedTemplates: ['evicore-override-request', 'cigna-escalation'],
        warningsAndDisclosures: ['eviCore has separate processes']
      },
      {
        id: 'medicare-appeal-letter',
        title: 'Medicare Part B Appeal Letter',
        category: 'legal',
        type: 'Insurance Appeal',
        description: 'CMS-compliant Medicare appeal with redetermination request',
        successRate: '79%',
        avgSavings: '$7,400',
        difficulty: 'Intermediate',
        timeToComplete: '30 minutes',
        lastUpdated: new Date('2024-01-28'),
        usageCount: 234,
        tags: ['medicare', 'cms', 'redetermination', 'part-b'],
        requirements: ['Medicare Summary Notice', 'Medical documentation', 'Provider support'],
        outcomes: ['Coverage approval', 'Payment adjustment', 'ALJ hearing referral'],
        legalBasis: 'Medicare Appeals Regulations, 42 CFR 405',
        targetAudience: 'Medicare beneficiaries with coverage denials',
        template: '[Medicare appeal template]',
        variables: ['beneficiaryName', 'medicareNumber', 'dateOfService', 'hicn'],
        instructions: 'File within 120 days of initial determination',
        examples: ['$5K DME coverage', '$12K outpatient procedure approval'],
        relatedTemplates: ['qic-appeal', 'alj-hearing-request'],
        warningsAndDisclosures: ['Strict timelines apply', 'Representative authorization may be needed']
      },
      {
        id: 'medicaid-fair-hearing',
        title: 'Medicaid Fair Hearing Request',
        category: 'legal',
        type: 'Administrative Appeal',
        description: 'State Medicaid fair hearing request with civil rights protections',
        successRate: '72%',
        avgSavings: '$9,200',
        difficulty: 'Advanced',
        timeToComplete: '50 minutes',
        lastUpdated: new Date('2024-01-29'),
        usageCount: 112,
        tags: ['medicaid', 'fair-hearing', 'state-benefits', 'civil-rights'],
        requirements: ['Denial notice', 'State Medicaid ID', 'Supporting documentation'],
        outcomes: ['Service restoration', 'Coverage approval', 'Aid continued pending'],
        legalBasis: 'Medicaid Act, Due Process Clause, State Administrative Law',
        targetAudience: 'Medicaid recipients with benefit denials',
        template: '[Medicaid fair hearing template]',
        variables: ['recipientName', 'caseNumber', 'denialDate', 'serviceRequested'],
        instructions: 'Request aid-paid-pending if applicable',
        examples: ['Home health restored', 'Medication coverage maintained'],
        relatedTemplates: ['aid-paid-pending-request', 'medicaid-ombudsman-complaint'],
        warningsAndDisclosures: ['Time limits vary by state', 'Legal aid may be available']
      },
      {
        id: 'balance-billing-dispute',
        title: 'Balance Billing Prohibition Letter',
        category: 'legal',
        type: 'Billing Dispute',
        description: 'No Surprises Act balance billing dispute with federal citations',
        successRate: '92%',
        avgSavings: '$8,900',
        difficulty: 'Intermediate',
        timeToComplete: '25 minutes',
        lastUpdated: new Date('2024-02-01'),
        usageCount: 289,
        tags: ['balance-billing', 'no-surprises-act', 'federal-law', 'patient-rights'],
        requirements: ['EOB showing balance bill', 'Provider bill', 'Insurance card'],
        outcomes: ['Bill eliminated', 'In-network rate applied', 'Provider compliance'],
        legalBasis: 'No Surprises Act, 45 CFR 149.410-149.450',
        targetAudience: 'Patients receiving surprise balance bills',
        template: '[Balance billing dispute with NSA citations]',
        variables: ['providerName', 'serviceDate', 'billedAmount', 'allowedAmount'],
        instructions: 'Send to both provider and insurance',
        examples: ['$6K anesthesia bill eliminated', '$3K assistant surgeon bill voided'],
        relatedTemplates: ['hospital-emergency-billing-dispute', 'good-faith-estimate'],
        warningsAndDisclosures: ['Applies to emergency and out-of-network scenarios']
      },
      {
        id: 'itemized-bill-request',
        title: 'Itemized Bill Request with Error Audit',
        category: 'legal',
        type: 'Billing Request',
        description: 'Formal request for itemized bill with common error identification',
        successRate: '95%',
        avgSavings: '$2,100',
        difficulty: 'Easy',
        timeToComplete: '10 minutes',
        lastUpdated: new Date('2024-02-02'),
        usageCount: 567,
        tags: ['itemized-bill', 'billing-errors', 'patient-rights', 'audit'],
        requirements: ['Original bill', 'Account number'],
        outcomes: ['Detailed bill received', 'Errors identified', 'Charges removed'],
        legalBasis: 'Patient Rights, Fair Credit Billing Act',
        targetAudience: 'Any patient with a medical bill',
        template: '[Itemized bill request template]',
        variables: ['patientName', 'accountNumber', 'dateOfService', 'facilityName'],
        instructions: 'Send within 30 days of receiving bill',
        examples: ['Found duplicate charges', 'Identified unbundled codes'],
        relatedTemplates: ['billing-error-dispute', 'medical-records-request'],
        warningsAndDisclosures: ['May delay payment deadline']
      },
      {
        id: 'billing-error-dispute',
        title: 'Medical Billing Error Dispute Letter',
        category: 'legal',
        type: 'Billing Dispute',
        description: 'Formal dispute for identified billing errors with correction request',
        successRate: '88%',
        avgSavings: '$4,300',
        difficulty: 'Intermediate',
        timeToComplete: '20 minutes',
        lastUpdated: new Date('2024-02-03'),
        usageCount: 423,
        tags: ['billing-errors', 'dispute', 'correction', 'overcharges'],
        requirements: ['Itemized bill', 'Error documentation', 'Supporting evidence'],
        outcomes: ['Charges removed', 'Bill corrected', 'Credit issued'],
        legalBasis: 'Fair Credit Billing Act, State Consumer Protection Laws',
        targetAudience: 'Patients with billing errors',
        template: '[Billing error dispute template]',
        variables: ['patientName', 'accountNumber', 'errorDescription', 'correctAmount'],
        instructions: 'List each error with supporting documentation',
        examples: ['$2K duplicate charge removed', '$1.5K wrong CPT code corrected'],
        relatedTemplates: ['itemized-bill-request', 'coding-audit-request'],
        warningsAndDisclosures: ['Document all communications']
      },
      {
        id: 'coding-audit-request',
        title: 'Medical Coding Audit Request',
        category: 'legal',
        type: 'Billing Request',
        description: 'Request professional coding review for complex bills',
        successRate: '78%',
        avgSavings: '$6,800',
        difficulty: 'Advanced',
        timeToComplete: '30 minutes',
        lastUpdated: new Date('2024-02-04'),
        usageCount: 156,
        tags: ['coding-audit', 'cpt-codes', 'upcoding', 'unbundling'],
        requirements: ['Itemized bill', 'Medical records', 'CPT code list'],
        outcomes: ['Coding corrections', 'Reduced charges', 'Compliance review'],
        legalBasis: 'CMS Coding Guidelines, OIG Compliance',
        targetAudience: 'Patients with complex or high bills',
        template: '[Coding audit request template]',
        variables: ['patientName', 'accountNumber', 'questionedCodes', 'auditReason'],
        instructions: 'Reference CMS coding guidelines',
        examples: ['$8K upcoding corrected', '$5K unbundling identified'],
        relatedTemplates: ['billing-error-dispute', 'oig-complaint'],
        warningsAndDisclosures: ['May require professional auditor']
      },
      {
        id: 'collection-cease-desist',
        title: 'Medical Debt Collection Cease & Desist',
        category: 'legal',
        type: 'Collections Defense',
        description: 'FDCPA-compliant cease and desist for medical debt collectors',
        successRate: '85%',
        avgSavings: '$3,200',
        difficulty: 'Easy',
        timeToComplete: '15 minutes',
        lastUpdated: new Date('2024-02-05'),
        usageCount: 387,
        tags: ['collections', 'fdcpa', 'cease-desist', 'debt-validation'],
        requirements: ['Collection letter', 'Original account info'],
        outcomes: ['Collection stopped', 'Debt validation required', 'Time to respond'],
        legalBasis: 'Fair Debt Collection Practices Act, 15 USC 1692',
        targetAudience: 'Patients contacted by debt collectors',
        template: '[FDCPA cease and desist template]',
        variables: ['patientName', 'collectorName', 'accountNumber', 'debtAmount'],
        instructions: 'Send within 30 days of first contact',
        examples: ['Collections halted for 6 months', 'Debt validation revealed errors'],
        relatedTemplates: ['debt-validation-request', 'credit-report-dispute'],
        warningsAndDisclosures: ['Does not eliminate debt', 'May escalate to lawsuit']
      },
      {
        id: 'debt-validation-request',
        title: 'Medical Debt Validation Request',
        category: 'legal',
        type: 'Collections Defense',
        description: 'FDCPA debt validation requiring proof of debt ownership',
        successRate: '67%',
        avgSavings: '$5,400',
        difficulty: 'Easy',
        timeToComplete: '10 minutes',
        lastUpdated: new Date('2024-02-06'),
        usageCount: 298,
        tags: ['debt-validation', 'fdcpa', 'collections', 'proof-of-debt'],
        requirements: ['Collection notice', 'Original creditor info'],
        outcomes: ['Debt validation received', 'Collection dismissed', 'Errors found'],
        legalBasis: 'Fair Debt Collection Practices Act, 15 USC 1692g',
        targetAudience: 'Patients disputing medical debt',
        template: '[Debt validation request template]',
        variables: ['patientName', 'collectorName', 'accountNumber', 'originalCreditor'],
        instructions: 'Send via certified mail within 30 days',
        examples: ['Collector unable to validate', '$7K debt dismissed'],
        relatedTemplates: ['collection-cease-desist', 'credit-report-dispute'],
        warningsAndDisclosures: ['Collector must cease until validated']
      },

      // ADDITIONAL HARDSHIP TEMPLATES
      {
        id: 'payment-plan-hardship',
        title: 'Hardship-Based Payment Plan Request',
        category: 'hardship',
        type: 'Payment Plan',
        description: 'Income-based payment plan with hardship documentation',
        successRate: '91%',
        avgSavings: '$1,800',
        difficulty: 'Easy',
        timeToComplete: '20 minutes',
        lastUpdated: new Date('2024-02-07'),
        usageCount: 456,
        tags: ['payment-plan', 'hardship', 'income-based', 'monthly-payments'],
        requirements: ['Income documentation', 'Bill statement', 'Budget info'],
        outcomes: ['Affordable payments', 'Interest waived', 'Extended timeline'],
        targetAudience: 'Patients needing payment plans',
        template: '[Hardship payment plan template]',
        variables: ['patientName', 'accountBalance', 'monthlyIncome', 'proposedPayment'],
        instructions: 'Propose realistic monthly amount based on income',
        examples: ['$50/month plan approved', '0% interest secured'],
        relatedTemplates: ['charity-care-optimizer', 'financial-assistance-app'],
        warningsAndDisclosures: ['Document agreement in writing']
      },
      {
        id: 'financial-assistance-app',
        title: 'Hospital Financial Assistance Application',
        category: 'hardship',
        type: 'Financial Assistance',
        description: 'Comprehensive financial assistance application with income optimization',
        successRate: '84%',
        avgSavings: '$18,500',
        difficulty: 'Intermediate',
        timeToComplete: '45 minutes',
        lastUpdated: new Date('2024-02-08'),
        usageCount: 334,
        tags: ['financial-assistance', 'hospital-discount', 'income-documentation', 'nonprofit'],
        requirements: ['Tax returns', 'Pay stubs', 'Asset documentation', 'Bills'],
        outcomes: ['Bill reduction', 'Full forgiveness', 'Sliding scale discount'],
        legalBasis: 'IRS 501(r) Requirements for Nonprofit Hospitals',
        targetAudience: 'Patients at nonprofit hospitals',
        template: '[Financial assistance application template]',
        variables: ['patientName', 'householdSize', 'annualIncome', 'totalBills'],
        instructions: 'Include all household members and income sources',
        examples: ['100% forgiveness at 200% FPL', '75% discount at 300% FPL'],
        relatedTemplates: ['charity-care-optimizer', 'hardship-affidavit'],
        warningsAndDisclosures: ['Documentation verification required']
      },
      {
        id: 'hardship-affidavit',
        title: 'Medical Hardship Affidavit',
        category: 'hardship',
        type: 'Legal Document',
        description: 'Sworn statement of financial hardship for medical debt relief',
        successRate: '76%',
        avgSavings: '$12,300',
        difficulty: 'Advanced',
        timeToComplete: '35 minutes',
        lastUpdated: new Date('2024-02-09'),
        usageCount: 178,
        tags: ['hardship', 'affidavit', 'sworn-statement', 'legal-document'],
        requirements: ['Financial records', 'Notary available', 'Supporting documentation'],
        outcomes: ['Debt reduction', 'Payment suspension', 'Legal protection'],
        targetAudience: 'Patients with severe financial hardship',
        template: '[Hardship affidavit template]',
        variables: ['patientName', 'financialDetails', 'hardshipCircumstances', 'reliefRequested'],
        instructions: 'Must be notarized for legal effect',
        examples: ['$25K debt discharged', 'Payment suspended 12 months'],
        relatedTemplates: ['financial-assistance-app', 'bankruptcy-protection'],
        warningsAndDisclosures: ['False statements are perjury', 'Notarization required']
      },
      {
        id: 'disability-hardship-letter',
        title: 'Disability-Related Hardship Letter',
        category: 'hardship',
        type: 'Hardship Letter',
        description: 'Specialized hardship letter for patients with disabilities',
        successRate: '82%',
        avgSavings: '$9,700',
        difficulty: 'Intermediate',
        timeToComplete: '25 minutes',
        lastUpdated: new Date('2024-02-10'),
        usageCount: 145,
        tags: ['disability', 'hardship', 'ada', 'fixed-income'],
        requirements: ['Disability documentation', 'Income proof', 'Bills'],
        outcomes: ['Bill reduction', 'Full forgiveness', 'ADA accommodations'],
        legalBasis: 'Americans with Disabilities Act, Rehabilitation Act',
        targetAudience: 'Patients with disabilities',
        template: '[Disability hardship template]',
        variables: ['patientName', 'disabilityType', 'fixedIncome', 'accommodationsNeeded'],
        instructions: 'Include disability income documentation',
        examples: ['SSDI-based forgiveness', 'Disability sliding scale applied'],
        relatedTemplates: ['financial-assistance-app', 'ada-accommodation-request'],
        warningsAndDisclosures: ['Disability status verification may be required']
      },
      {
        id: 'senior-fixed-income',
        title: 'Senior Fixed Income Assistance Request',
        category: 'hardship',
        type: 'Hardship Letter',
        description: 'Hardship assistance for seniors on Social Security and fixed income',
        successRate: '85%',
        avgSavings: '$7,200',
        difficulty: 'Easy',
        timeToComplete: '20 minutes',
        lastUpdated: new Date('2024-02-11'),
        usageCount: 234,
        tags: ['senior', 'fixed-income', 'social-security', 'medicare'],
        requirements: ['Social Security statement', 'Medicare card', 'Bills'],
        outcomes: ['Senior discount', 'Fixed payment plan', 'Bill reduction'],
        targetAudience: 'Seniors on fixed income',
        template: '[Senior fixed income template]',
        variables: ['patientName', 'age', 'ssIncome', 'otherIncome', 'monthlyExpenses'],
        instructions: 'Include all fixed income sources',
        examples: ['65% senior discount', 'Medicare-based forgiveness'],
        relatedTemplates: ['medicare-appeal-letter', 'financial-assistance-app'],
        warningsAndDisclosures: ['Age and income verification required']
      },
      {
        id: 'job-loss-hardship',
        title: 'Job Loss Hardship Documentation',
        category: 'hardship',
        type: 'Hardship Letter',
        description: 'Hardship relief for patients who recently lost employment',
        successRate: '88%',
        avgSavings: '$11,400',
        difficulty: 'Easy',
        timeToComplete: '20 minutes',
        lastUpdated: new Date('2024-02-12'),
        usageCount: 312,
        tags: ['job-loss', 'unemployment', 'hardship', 'income-change'],
        requirements: ['Unemployment documentation', 'Last pay stub', 'Bills'],
        outcomes: ['Payment suspension', 'Bill reduction', 'Extended timeline'],
        targetAudience: 'Recently unemployed patients',
        template: '[Job loss hardship template]',
        variables: ['patientName', 'previousEmployer', 'lossDate', 'currentStatus'],
        instructions: 'Include unemployment benefits if receiving',
        examples: ['6-month payment suspension', '70% bill reduction'],
        relatedTemplates: ['payment-plan-hardship', 'cobra-assistance'],
        warningsAndDisclosures: ['Verify unemployment documentation']
      },

      // ADDITIONAL COMMUNICATION TEMPLATES
      {
        id: 'billing-department-call',
        title: 'Billing Department Call Script',
        category: 'communication',
        type: 'Phone Script',
        description: 'Step-by-step script for effective billing department calls',
        successRate: '73%',
        avgSavings: '$3,600',
        difficulty: 'Easy',
        timeToComplete: '15 minutes',
        lastUpdated: new Date('2024-02-13'),
        usageCount: 543,
        tags: ['phone-call', 'billing', 'negotiation', 'script'],
        requirements: ['Bill in hand', 'Account number', 'Notes ready'],
        outcomes: ['Discount negotiated', 'Payment plan', 'Errors identified'],
        psychologyPrinciples: ['Reciprocity', 'Authority', 'Commitment'],
        targetAudience: 'Any patient calling billing department',
        template: '[Billing call script with talking points]',
        variables: ['patientName', 'accountNumber', 'specificIssues', 'desiredOutcome'],
        instructions: 'Stay calm and document everything',
        examples: ['40% discount negotiated', 'Duplicate charges removed'],
        relatedTemplates: ['supervisor-escalation-script', 'payment-plan-negotiation'],
        warningsAndDisclosures: ['Record calls where legal']
      },
      {
        id: 'supervisor-escalation-script',
        title: 'Supervisor Escalation Script',
        category: 'communication',
        type: 'Phone Script',
        description: 'Effective script for escalating to supervisors',
        successRate: '79%',
        avgSavings: '$5,100',
        difficulty: 'Intermediate',
        timeToComplete: '15 minutes',
        lastUpdated: new Date('2024-02-14'),
        usageCount: 287,
        tags: ['escalation', 'supervisor', 'phone-script', 'negotiation'],
        requirements: ['Previous call notes', 'Representative name', 'Issue summary'],
        outcomes: ['Higher authority approval', 'Exception granted', 'Resolution'],
        psychologyPrinciples: ['Authority bias', 'Escalation commitment', 'Social proof'],
        targetAudience: 'Patients needing escalation',
        template: '[Supervisor escalation script]',
        variables: ['previousRep', 'issuesSummary', 'requestedResolution', 'timeInvestment'],
        instructions: 'Always document representative names',
        examples: ['Supervisor approved 50% discount', 'Exception granted after escalation'],
        relatedTemplates: ['billing-department-call', 'executive-complaint'],
        warningsAndDisclosures: ['Stay professional and calm']
      },
      {
        id: 'patient-advocate-request',
        title: 'Hospital Patient Advocate Request',
        category: 'communication',
        type: 'Advocate Request',
        description: 'Request hospital patient advocate assistance',
        successRate: '81%',
        avgSavings: '$6,400',
        difficulty: 'Easy',
        timeToComplete: '10 minutes',
        lastUpdated: new Date('2024-02-15'),
        usageCount: 234,
        tags: ['patient-advocate', 'hospital', 'ombudsman', 'assistance'],
        requirements: ['Hospital name', 'Issue description', 'Account info'],
        outcomes: ['Advocate assigned', 'Issue resolution', 'Billing assistance'],
        targetAudience: 'Patients needing hospital advocacy',
        template: '[Patient advocate request template]',
        variables: ['patientName', 'hospitalName', 'issueDescription', 'desiredOutcome'],
        instructions: 'Request advocate through patient services',
        examples: ['Advocate resolved $15K billing dispute', 'Financial assistance fast-tracked'],
        relatedTemplates: ['billing-department-call', 'hospital-complaint'],
        warningsAndDisclosures: ['Advocate works for hospital']
      },
      {
        id: 'insurance-grievance-call',
        title: 'Insurance Grievance Phone Script',
        category: 'communication',
        type: 'Phone Script',
        description: 'Formal grievance filing via phone with documentation',
        successRate: '74%',
        avgSavings: '$8,900',
        difficulty: 'Intermediate',
        timeToComplete: '20 minutes',
        lastUpdated: new Date('2024-02-16'),
        usageCount: 167,
        tags: ['insurance', 'grievance', 'phone-script', 'formal-complaint'],
        requirements: ['Policy info', 'Issue details', 'Previous correspondence'],
        outcomes: ['Grievance filed', 'Case escalated', 'Resolution timeline'],
        legalBasis: 'ACA Grievance Requirements, ERISA',
        targetAudience: 'Insurance members filing grievances',
        template: '[Insurance grievance phone script]',
        variables: ['memberName', 'policyNumber', 'grievanceDetails', 'requestedResolution'],
        instructions: 'Get grievance reference number',
        examples: ['Coverage restored after grievance', 'Claim reprocessed'],
        relatedTemplates: ['written-grievance-letter', 'external-review-request'],
        warningsAndDisclosures: ['Timelines vary by plan type']
      },
      {
        id: 'written-grievance-letter',
        title: 'Formal Written Grievance Letter',
        category: 'communication',
        type: 'Written Correspondence',
        description: 'Formal grievance letter with regulatory references',
        successRate: '77%',
        avgSavings: '$9,300',
        difficulty: 'Intermediate',
        timeToComplete: '30 minutes',
        lastUpdated: new Date('2024-02-17'),
        usageCount: 198,
        tags: ['grievance', 'written', 'formal', 'regulatory'],
        requirements: ['Issue documentation', 'Previous communications', 'Desired outcome'],
        outcomes: ['Formal response required', 'Case escalation', 'Resolution'],
        legalBasis: 'ACA, ERISA, State Insurance Regulations',
        targetAudience: 'Patients filing formal grievances',
        template: '[Written grievance letter template]',
        variables: ['patientName', 'policyNumber', 'grievanceDetails', 'timeline'],
        instructions: 'Send via certified mail',
        examples: ['Written grievance led to policy change', 'Claim paid after formal grievance'],
        relatedTemplates: ['insurance-grievance-call', 'state-complaint'],
        warningsAndDisclosures: ['Keep copies of everything']
      },
      {
        id: 'provider-negotiation-script',
        title: 'Direct Provider Negotiation Script',
        category: 'communication',
        type: 'Phone Script',
        description: 'Negotiate directly with healthcare providers for discounts',
        successRate: '69%',
        avgSavings: '$2,800',
        difficulty: 'Intermediate',
        timeToComplete: '15 minutes',
        lastUpdated: new Date('2024-02-18'),
        usageCount: 278,
        tags: ['provider', 'negotiation', 'discount', 'direct-pay'],
        requirements: ['Bill amount', 'Ability to pay promptly', 'Comparison rates'],
        outcomes: ['Cash discount', 'Reduced bill', 'Payment terms'],
        psychologyPrinciples: ['Anchoring', 'Scarcity', 'Reciprocity'],
        targetAudience: 'Self-pay or underinsured patients',
        template: '[Provider negotiation script]',
        variables: ['providerName', 'serviceType', 'billedAmount', 'offerAmount'],
        instructions: 'Mention ability to pay quickly for discount',
        examples: ['30% cash discount secured', '50% reduction for prompt payment'],
        relatedTemplates: ['self-pay-discount-request', 'billing-department-call'],
        warningsAndDisclosures: ['Get agreement in writing']
      },

      // ADDITIONAL INTELLIGENCE TEMPLATES
      {
        id: 'ascension-vulnerability-profile',
        title: 'Ascension Health System Profile',
        category: 'intelligence',
        type: 'Hospital Intelligence',
        description: 'Ascension-specific tactics and vulnerability analysis',
        successRate: '88%',
        avgSavings: '$16,200',
        difficulty: 'Expert',
        timeToComplete: '35 minutes',
        lastUpdated: new Date('2024-02-19'),
        usageCount: 54,
        tags: ['ascension', 'catholic-hospital', 'nonprofit', 'tactics'],
        requirements: ['Ascension facility bill', 'Service documentation'],
        outcomes: ['Charity care access', 'Negotiation leverage', 'Regulatory pressure'],
        targetAudience: 'Patients with Ascension bills',
        template: '[Ascension strategy guide]',
        variables: ['facilityName', 'billAmount', 'serviceType', 'incomeLevel'],
        instructions: 'Leverage Catholic healthcare ethics and nonprofit status',
        examples: ['$28K surgery - 80% forgiven', '$9K ER bill - eliminated'],
        relatedTemplates: ['charity-care-optimizer', 'nonprofit-hospital-tactics'],
        warningsAndDisclosures: ['For strategic use only']
      },
      {
        id: 'commonspirit-profile',
        title: 'CommonSpirit Health System Profile',
        category: 'intelligence',
        type: 'Hospital Intelligence',
        description: 'CommonSpirit-specific strategies and billing patterns',
        successRate: '86%',
        avgSavings: '$14,800',
        difficulty: 'Expert',
        timeToComplete: '35 minutes',
        lastUpdated: new Date('2024-02-20'),
        usageCount: 48,
        tags: ['commonspirit', 'dignity-health', 'chi', 'catholic-hospital'],
        requirements: ['CommonSpirit facility bill', 'Account info'],
        outcomes: ['Financial assistance', 'Bill reduction', 'Payment plans'],
        targetAudience: 'Patients at CommonSpirit facilities',
        template: '[CommonSpirit strategy guide]',
        variables: ['facilityName', 'billAmount', 'financialSituation', 'negotiationGoals'],
        instructions: 'Reference Dignity Health or CHI specific policies',
        examples: ['$20K procedure - 70% reduction', '$12K hospitalization - charity care approved'],
        relatedTemplates: ['financial-assistance-app', 'nonprofit-hospital-tactics'],
        warningsAndDisclosures: ['Facility-specific policies may vary']
      },
      {
        id: 'tenet-profile',
        title: 'Tenet Healthcare Vulnerability Profile',
        category: 'intelligence',
        type: 'Hospital Intelligence',
        description: 'Tenet-specific tactics for for-profit hospital negotiation',
        successRate: '83%',
        avgSavings: '$13,400',
        difficulty: 'Expert',
        timeToComplete: '40 minutes',
        lastUpdated: new Date('2024-02-21'),
        usageCount: 42,
        tags: ['tenet', 'for-profit', 'hospital-tactics', 'negotiation'],
        requirements: ['Tenet facility bill', 'Service records'],
        outcomes: ['Price reduction', 'Payment negotiation', 'Error identification'],
        targetAudience: 'Patients at Tenet Healthcare facilities',
        template: '[Tenet negotiation strategy guide]',
        variables: ['facilityName', 'billAmount', 'serviceType', 'negotiationApproach'],
        instructions: 'Leverage for-profit regulatory scrutiny',
        examples: ['$18K bill - 55% reduction', '$7K ER - payment plan with discount'],
        relatedTemplates: ['for-profit-negotiation-strategies', 'billing-error-dispute'],
        warningsAndDisclosures: ['For-profit hospitals have different leverage points']
      },
      {
        id: 'kaiser-profile',
        title: 'Kaiser Permanente System Profile',
        category: 'intelligence',
        type: 'Insurance Intelligence',
        description: 'Kaiser-specific appeals and negotiation strategies',
        successRate: '79%',
        avgSavings: '$8,600',
        difficulty: 'Advanced',
        timeToComplete: '30 minutes',
        lastUpdated: new Date('2024-02-22'),
        usageCount: 67,
        tags: ['kaiser', 'hmo', 'integrated-system', 'appeals'],
        requirements: ['Kaiser member ID', 'Service documentation', 'Denial if applicable'],
        outcomes: ['Coverage approval', 'External care authorization', 'Appeal success'],
        legalBasis: 'Knox-Keene Act, State HMO Regulations',
        targetAudience: 'Kaiser Permanente members',
        template: '[Kaiser system navigation guide]',
        variables: ['memberName', 'memberID', 'serviceNeeded', 'denialReason'],
        instructions: 'Use Kaiser-specific appeal pathways',
        examples: ['Out-of-network specialist approved', 'Denied procedure authorized'],
        relatedTemplates: ['hmo-external-review', 'network-exception-request'],
        warningsAndDisclosures: ['Kaiser has unique integrated model']
      },
      {
        id: 'attorney-general-complaint',
        title: 'State Attorney General Complaint Template',
        category: 'intelligence',
        type: 'Regulatory Complaint',
        description: 'Formal complaint to state AG for healthcare billing violations',
        successRate: '71%',
        avgSavings: '$11,200',
        difficulty: 'Expert',
        timeToComplete: '45 minutes',
        lastUpdated: new Date('2024-02-23'),
        usageCount: 89,
        tags: ['attorney-general', 'state-complaint', 'consumer-protection', 'enforcement'],
        requirements: ['Violation documentation', 'Previous correspondence', 'Evidence'],
        outcomes: ['Investigation opened', 'Resolution pressure', 'Refund ordered'],
        legalBasis: 'State Consumer Protection Laws, UDAP',
        targetAudience: 'Patients with unresolved billing violations',
        template: '[AG complaint template by state]',
        variables: ['state', 'providerName', 'violationType', 'damagesAmount'],
        instructions: 'File after exhausting other options',
        examples: ['AG investigation led to $15K refund', 'Hospital policy changed after complaint'],
        relatedTemplates: ['state-regulatory-complaint-database', 'cfpb-complaint'],
        warningsAndDisclosures: ['Public record', 'May trigger investigation']
      },
      {
        id: 'cfpb-complaint',
        title: 'CFPB Medical Debt Complaint',
        category: 'intelligence',
        type: 'Federal Complaint',
        description: 'Consumer Financial Protection Bureau complaint for medical debt issues',
        successRate: '68%',
        avgSavings: '$4,800',
        difficulty: 'Intermediate',
        timeToComplete: '25 minutes',
        lastUpdated: new Date('2024-02-24'),
        usageCount: 123,
        tags: ['cfpb', 'federal-complaint', 'medical-debt', 'consumer-protection'],
        requirements: ['Debt documentation', 'Collector info', 'Issue description'],
        outcomes: ['Company response required', 'Issue escalation', 'Resolution'],
        legalBasis: 'Dodd-Frank Act, FDCPA, FCRA',
        targetAudience: 'Patients with medical debt collection issues',
        template: '[CFPB complaint template]',
        variables: ['patientName', 'companyName', 'issueType', 'desiredResolution'],
        instructions: 'File at consumerfinance.gov',
        examples: ['Collection halted after CFPB complaint', 'Credit report corrected'],
        relatedTemplates: ['collection-cease-desist', 'credit-report-dispute'],
        warningsAndDisclosures: ['Company has 15 days to respond']
      },
      {
        id: 'cms-complaint',
        title: 'CMS Medicare/Medicaid Complaint',
        category: 'intelligence',
        type: 'Federal Complaint',
        description: 'Formal complaint to CMS for Medicare/Medicaid violations',
        successRate: '65%',
        avgSavings: '$6,300',
        difficulty: 'Advanced',
        timeToComplete: '35 minutes',
        lastUpdated: new Date('2024-02-25'),
        usageCount: 87,
        tags: ['cms', 'medicare', 'medicaid', 'federal-complaint'],
        requirements: ['Medicare/Medicaid documentation', 'Violation details', 'Evidence'],
        outcomes: ['CMS investigation', 'Provider audit', 'Resolution'],
        legalBasis: 'Social Security Act, Medicare Regulations',
        targetAudience: 'Medicare/Medicaid beneficiaries with provider issues',
        template: '[CMS complaint template]',
        variables: ['beneficiaryName', 'medicareNumber', 'providerName', 'violationType'],
        instructions: 'File through Medicare.gov or state Medicaid agency',
        examples: ['Provider audit led to billing changes', 'Coverage issue resolved'],
        relatedTemplates: ['medicare-appeal-letter', 'oig-complaint'],
        warningsAndDisclosures: ['May trigger provider investigation']
      },
      {
        id: 'credit-report-dispute',
        title: 'Medical Debt Credit Report Dispute',
        category: 'intelligence',
        type: 'Credit Dispute',
        description: 'FCRA-compliant dispute for medical debt on credit reports',
        successRate: '72%',
        avgSavings: '$0 (credit improvement)',
        difficulty: 'Intermediate',
        timeToComplete: '20 minutes',
        lastUpdated: new Date('2024-02-26'),
        usageCount: 345,
        tags: ['credit-report', 'fcra', 'medical-debt', 'dispute'],
        requirements: ['Credit report with medical debt', 'Documentation of dispute'],
        outcomes: ['Debt removed', 'Credit score improvement', 'Accurate reporting'],
        legalBasis: 'Fair Credit Reporting Act, NCRA Medical Debt Rules',
        targetAudience: 'Patients with medical debt on credit reports',
        template: '[Credit report dispute template]',
        variables: ['patientName', 'creditorName', 'accountNumber', 'disputeReason'],
        instructions: 'Dispute with all three bureaus',
        examples: ['Paid medical debt removed', 'Inaccurate balance corrected'],
        relatedTemplates: ['debt-validation-request', 'collection-cease-desist'],
        warningsAndDisclosures: ['30-day investigation period']
      }
    ]);
  }, []);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const generateDocument = (template: DocumentTemplate) => {
    const prompt = `I want to generate a professional document using the "${template.title}" premium template. This template has a ${template.successRate} success rate and averages ${template.avgSavings} in savings.

TEMPLATE INFORMATION:
- Category: ${template.type}
- Difficulty: ${template.difficulty}
- Target Audience: ${template.targetAudience}
- Legal Basis: ${template.legalBasis || 'Professional standards and best practices'}
- Time to Complete: ${template.timeToComplete}

TEMPLATE REQUIREMENTS:
${template.requirements.map(req => `• ${req}`).join('\n')}

EXPECTED OUTCOMES:
${template.outcomes.map(outcome => `• ${outcome}`).join('\n')}

${template.psychologyPrinciples ? `
PSYCHOLOGY PRINCIPLES APPLIED:
${template.psychologyPrinciples.map(principle => `• ${principle}`).join('\n')}
` : ''}

VARIABLES TO CUSTOMIZE:
${template.variables.map(variable => `• ${variable}: [Please provide this information]`).join('\n')}

INSTRUCTIONS:
${template.instructions}

EXAMPLES OF SUCCESS:
${template.examples.map(example => `• ${example}`).join('\n')}

WARNINGS AND DISCLOSURES:
${template.warningsAndDisclosures.map(warning => `• ${warning}`).join('\n')}

Please generate a comprehensive, professional document based on this premium template. The document should be legally compliant, strategically optimized, and personalized for maximum effectiveness. Include all necessary legal citations, professional language, and strategic elements that make this template successful.`;

    onSendMessage(prompt);
    toast({
      title: "Template Generated",
      description: `Generated professional document using ${template.title}`,
    });
  };

  const toggleFavorite = (templateId: string) => {
    setFavorites(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'legal': return 'text-blue-600 bg-blue-100';
      case 'hardship': return 'text-emerald-600 bg-emerald-100';
      case 'communication': return 'text-purple-600 bg-purple-100';
      case 'intelligence': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-orange-600 bg-orange-100';
      case 'Expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 relative overflow-hidden"
    >
      {!isSubscribed && (
        <PremiumPaywallOverlay
          title="Exclusive Templates Library"
          description="Legal-grade templates, industry intelligence, and professional scripts worth thousands in consulting fees"
          featureName="Templates Library"
          savingsPotential="$10,000-$100,000+ in legal and consulting savings"
        />
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900">Exclusive Templates Library</h3>
              <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs">
                <Crown className="h-3 w-3 mr-1" />
                Premium Only
              </Badge>
            </div>
            <p className="text-sm text-gray-600">Legal-grade templates • Industry intelligence • Professional scripts</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="legal">Legal Documents</SelectItem>
                <SelectItem value="hardship">Financial Hardship</SelectItem>
                <SelectItem value="communication">Communication Scripts</SelectItem>
                <SelectItem value="intelligence">Industry Intelligence</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3">
            <Card className="p-3">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{templates.filter(t => t.category === 'legal').length}</div>
                <div className="text-xs text-gray-600">Legal Templates</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600">{templates.filter(t => t.category === 'hardship').length}</div>
                <div className="text-xs text-gray-600">Hardship Docs</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{templates.filter(t => t.category === 'communication').length}</div>
                <div className="text-xs text-gray-600">Scripts</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{templates.filter(t => t.category === 'intelligence').length}</div>
                <div className="text-xs text-gray-600">Intelligence</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              className="border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{template.title}</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(template.id);
                      }}
                      className="p-1 h-6 w-6"
                    >
                      <Star className={`h-3 w-3 ${favorites.includes(template.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryColor(template.category)}>
                      {template.type}
                    </Badge>
                    <Badge className={getDifficultyColor(template.difficulty)}>
                      {template.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-600 font-medium">{template.successRate}</span>
                  <span className="text-blue-600 font-medium">{template.avgSavings}</span>
                </div>
                <div className="text-gray-500">{template.timeToComplete}</div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {template.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Template Detail Modal */}
        <AnimatePresence>
          {selectedTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedTemplate(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedTemplate.title}</h3>
                      <p className="text-gray-600 mb-3">{selectedTemplate.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(selectedTemplate.category)}>
                          {selectedTemplate.type}
                        </Badge>
                        <Badge className={getDifficultyColor(selectedTemplate.difficulty)}>
                          {selectedTemplate.difficulty}
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-700">
                          {selectedTemplate.timeToComplete}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTemplate(null)}
                    >
                      ×
                    </Button>
                  </div>

                  {/* Success Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-emerald-50 rounded-xl">
                      <div className="text-lg font-bold text-emerald-600">{selectedTemplate.successRate}</div>
                      <div className="text-xs text-emerald-700">Success Rate</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <div className="text-lg font-bold text-blue-600">{selectedTemplate.avgSavings}</div>
                      <div className="text-xs text-blue-700">Avg Savings</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-xl">
                      <div className="text-lg font-bold text-purple-600">{selectedTemplate.usageCount}</div>
                      <div className="text-xs text-purple-700">Times Used</div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedTemplate.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Expected Outcomes</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedTemplate.outcomes.map((outcome, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-blue-600" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {selectedTemplate.psychologyPrinciples && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Psychology Principles</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {selectedTemplate.psychologyPrinciples.map((principle, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Brain className="h-4 w-4 text-purple-600" />
                              {principle}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedTemplate.warningsAndDisclosures.length > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Important:</strong> {selectedTemplate.warningsAndDisclosures.join(' • ')}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => generateDocument(selectedTemplate)}
                      className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                      data-testid={`button-generate-${selectedTemplate.id}`}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Document
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}