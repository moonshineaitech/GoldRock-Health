import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Copy, 
  CheckSquare, 
  Shield, 
  FileEdit,
  Download,
  Bot,
  DollarSign,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  Calendar,
  Sparkles
} from "lucide-react";

interface FeatureProps {
  onSendMessage: (message: string) => void;
}

// Feature 1: AI-powered document generation for medical bill dispute letters
export function DisputeLetterGenerator({ onSendMessage }: FeatureProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    accountNumber: '',
    billAmount: '',
    hospitalName: '',
    disputeReason: '',
    specificCharges: ''
  });
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateLetter = async () => {
    if (!formData.patientName || !formData.accountNumber || !formData.hospitalName) {
      toast({
        title: "Missing Information",
        description: "Please fill in required fields (name, account number, hospital).",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    const prompt = `Generate a professional medical bill dispute letter using this information:
Patient Name: ${formData.patientName}
Account Number: ${formData.accountNumber}
Hospital: ${formData.hospitalName}
Bill Amount: ${formData.billAmount}
Dispute Reason: ${formData.disputeReason}
Specific Charges: ${formData.specificCharges}

Create a formal, professional dispute letter that references specific billing errors, requests investigation, and cites patient rights. Include all necessary legal language and formatting.`;

    onSendMessage(prompt);
    setIsGenerating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">AI Dispute Letter Generator</h3>
          <p className="text-sm text-gray-600">Professional letters that get results</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Patient Name *"
            value={formData.patientName}
            onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
          />
          <Input
            placeholder="Account Number *"
            value={formData.accountNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Hospital Name *"
            value={formData.hospitalName}
            onChange={(e) => setFormData(prev => ({ ...prev, hospitalName: e.target.value }))}
          />
          <Input
            placeholder="Bill Amount"
            value={formData.billAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, billAmount: e.target.value }))}
          />
        </div>
        <Textarea
          placeholder="Dispute Reason (e.g., duplicate charges, services not received)"
          value={formData.disputeReason}
          onChange={(e) => setFormData(prev => ({ ...prev, disputeReason: e.target.value }))}
          className="h-20"
        />
        <Textarea
          placeholder="Specific Charges to Dispute (list line items, codes, dates)"
          value={formData.specificCharges}
          onChange={(e) => setFormData(prev => ({ ...prev, specificCharges: e.target.value }))}
          className="h-20"
        />
        
        <Button
          onClick={generateLetter}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
        >
          {isGenerating ? (
            <>
              <Bot className="h-4 w-4 mr-2 animate-pulse" />
              Generating Professional Letter...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Dispute Letter
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

// Feature 2: One-click template customization for bill negotiation scripts
export function NegotiationScriptGenerator({ onSendMessage }: FeatureProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customization, setCustomization] = useState({
    billAmount: '',
    income: '',
    hardship: '',
    paymentOffer: ''
  });

  const templates = [
    {
      id: 'hardship',
      title: 'Financial Hardship Script',
      desc: 'For income-based reductions',
      icon: DollarSign,
      color: 'emerald'
    },
    {
      id: 'error',
      title: 'Billing Error Script',
      desc: 'For disputing specific charges',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      id: 'settlement',
      title: 'Settlement Offer Script',
      desc: 'For lump-sum negotiations',
      icon: Clock,
      color: 'blue'
    },
    {
      id: 'payment-plan',
      title: 'Payment Plan Script',
      desc: 'For monthly payment setup',
      icon: Calendar,
      color: 'purple'
    }
  ];

  const generateScript = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Select Template",
        description: "Please choose a negotiation script template first.",
        variant: "destructive",
      });
      return;
    }

    const prompt = `Generate a professional phone negotiation script for "${selectedTemplate}" using this information:
Bill Amount: ${customization.billAmount}
Annual Income: ${customization.income}
Hardship Details: ${customization.hardship}
Payment Offer: ${customization.paymentOffer}

Create a step-by-step phone script with exact words to say, anticipated responses, and follow-up questions. Include specific dollar amounts and success tactics.`;

    onSendMessage(prompt);
  };

  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
          <Phone className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Negotiation Script Generator</h3>
          <p className="text-sm text-gray-600">One-click customized phone scripts</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Choose Template:</p>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((template) => {
              const IconComponent = template.icon;
              return (
                <Card
                  key={template.id}
                  className={`p-3 cursor-pointer transition-all ${
                    selectedTemplate === template.id 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 bg-gradient-to-br from-${template.color}-500 to-${template.color}-600 rounded-lg flex items-center justify-center`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{template.title}</p>
                      <p className="text-xs text-gray-600">{template.desc}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Bill Amount ($)"
            value={customization.billAmount}
            onChange={(e) => setCustomization(prev => ({ ...prev, billAmount: e.target.value }))}
          />
          <Input
            placeholder="Annual Income ($)"
            value={customization.income}
            onChange={(e) => setCustomization(prev => ({ ...prev, income: e.target.value }))}
          />
        </div>
        
        <Textarea
          placeholder="Describe your financial hardship or situation"
          value={customization.hardship}
          onChange={(e) => setCustomization(prev => ({ ...prev, hardship: e.target.value }))}
          className="h-20"
        />
        
        <Input
          placeholder="Payment Offer Amount (optional)"
          value={customization.paymentOffer}
          onChange={(e) => setCustomization(prev => ({ ...prev, paymentOffer: e.target.value }))}
        />

        <Button
          onClick={generateScript}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
        >
          <Phone className="h-4 w-4 mr-2" />
          Generate Custom Script
        </Button>
      </div>
    </motion.div>
  );
}

// Feature 3: Interactive bill error detection checklist with AI guidance
export function ErrorDetectionChecklist({ onSendMessage }: FeatureProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [findings, setFindings] = useState('');

  const errorTypes = [
    {
      id: 'duplicates',
      title: 'Duplicate Charges',
      desc: 'Same service charged multiple times',
      savings: '$1,500 - $15,000',
      common: true
    },
    {
      id: 'upcoding',
      title: 'Upcoding Violations',
      desc: 'Wrong procedure codes for higher costs',
      savings: '$3,000 - $25,000',
      common: true
    },
    {
      id: 'unbundling',
      title: 'Unbundling Schemes',
      desc: 'Services that should be packaged together',
      savings: '$2,000 - $18,000',
      common: true
    },
    {
      id: 'phantom',
      title: 'Phantom Charges',
      desc: 'Services billed but never provided',
      savings: '$800 - $12,000',
      common: true
    },
    {
      id: 'dates',
      title: 'Incorrect Dates/Times',
      desc: 'Wrong service dates or durations',
      savings: '$500 - $5,000',
      common: false
    },
    {
      id: 'equipment',
      title: 'Equipment Not Used',
      desc: 'Charges for unused medical devices',
      savings: '$1,000 - $8,000',
      common: false
    },
    {
      id: 'room-charges',
      title: 'Incorrect Room Charges',
      desc: 'Room fees for time not spent',
      savings: '$200 - $2,000',
      common: false
    },
    {
      id: 'insurance-info',
      title: 'Wrong Insurance Information',
      desc: 'Incorrect coverage or copay amounts',
      savings: '$1,000 - $10,000',
      common: false
    }
  ];

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const analyzeFindings = () => {
    if (checkedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please check the billing errors you've found.",
        variant: "destructive",
      });
      return;
    }

    const selectedErrors = errorTypes.filter(error => checkedItems.includes(error.id));
    const errorDetails = selectedErrors.map(error => `${error.title}: ${error.desc}`).join(', ');
    
    const prompt = `I've identified these billing errors on my medical bill: ${errorDetails}. 
    
    Additional findings: ${findings}
    
    Please provide a detailed analysis of these errors, estimated savings amounts, specific dispute strategies, and exact steps to challenge each error with the billing department. Include templates for dispute letters and phone scripts.`;

    onSendMessage(prompt);
  };

  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
          <CheckSquare className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Error Detection Checklist</h3>
          <p className="text-sm text-gray-600">AI-guided billing error identification</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {errorTypes.map((error) => (
          <div
            key={error.id}
            className={`flex items-start space-x-3 p-3 rounded-xl cursor-pointer transition-all ${
              checkedItems.includes(error.id) ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 hover:bg-gray-100'
            } border`}
            onClick={() => toggleCheck(error.id)}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
              checkedItems.includes(error.id) 
                ? 'bg-orange-500 border-orange-500' 
                : 'border-gray-300'
            }`}>
              {checkedItems.includes(error.id) && (
                <CheckSquare className="h-3 w-3 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 text-sm">{error.title}</p>
                <div className="flex items-center space-x-2">
                  {error.common && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-lg font-medium">
                      Common
                    </span>
                  )}
                  <span className="text-xs font-medium text-emerald-600">{error.savings}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-1">{error.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Textarea
        placeholder="Describe any additional findings or specific line items you're questioning..."
        value={findings}
        onChange={(e) => setFindings(e.target.value)}
        className="mb-4 h-20"
      />

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          {checkedItems.length} error{checkedItems.length !== 1 ? 's' : ''} selected
        </div>
        <div className="text-sm font-medium text-emerald-600">
          Potential Savings: $2K-$50K+
        </div>
      </div>

      <Button
        onClick={analyzeFindings}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
      >
        <Bot className="h-4 w-4 mr-2" />
        Analyze Selected Errors with AI
      </Button>
    </motion.div>
  );
}

// Feature 4: Real-time medical billing rights and protection advisor
export function BillingRightsAdvisor({ onSendMessage }: FeatureProps) {
  const [situation, setSituation] = useState('');
  const [urgency, setUrgency] = useState('');

  const situations = [
    {
      id: 'collections',
      title: 'Bill Sent to Collections',
      desc: 'Debt collectors are calling',
      urgency: 'High',
      color: 'red'
    },
    {
      id: 'lawsuit',
      title: 'Legal Action Threatened',
      desc: 'Hospital mentioned lawsuit',
      urgency: 'Critical',
      color: 'red'
    },
    {
      id: 'credit-report',
      title: 'Credit Report Impact',
      desc: 'Medical debt on credit report',
      urgency: 'Medium',
      color: 'orange'
    },
    {
      id: 'insurance-denial',
      title: 'Insurance Claim Denied',
      desc: 'Insurance refused to pay',
      urgency: 'Medium',
      color: 'orange'
    },
    {
      id: 'surprise-bill',
      title: 'Surprise Medical Bill',
      desc: 'Unexpected out-of-network charges',
      urgency: 'Medium',
      color: 'orange'
    },
    {
      id: 'charity-denied',
      title: 'Charity Care Denied',
      desc: 'Financial assistance rejected',
      urgency: 'Low',
      color: 'blue'
    }
  ];

  const getRightsAdvice = () => {
    if (!situation) {
      toast({
        title: "Select Situation",
        description: "Please choose your current billing situation.",
        variant: "destructive",
      });
      return;
    }

    const prompt = `I'm facing this medical billing situation: "${situation}". The urgency level is ${urgency}. 
    
    Please provide immediate legal protections available to me, specific patient rights I can invoke, step-by-step actions to take right now, legal deadlines I need to be aware of, and templates for any letters or communications I need to send. Include specific laws and regulations that protect me.`;

    onSendMessage(prompt);
  };

  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Billing Rights Advisor</h3>
          <p className="text-sm text-gray-600">Real-time legal protection guidance</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <p className="text-sm font-medium text-gray-700">Select your situation:</p>
        {situations.map((situationItem) => (
          <div
            key={situationItem.id}
            className={`p-3 rounded-xl cursor-pointer transition-all border ${
              situation === situationItem.title
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300 bg-gray-50'
            }`}
            onClick={() => {
              setSituation(situationItem.title);
              setUrgency(situationItem.urgency);
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 text-sm">{situationItem.title}</p>
                <p className="text-xs text-gray-600">{situationItem.desc}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-lg font-medium ${
                situationItem.urgency === 'Critical' ? 'bg-red-100 text-red-700' :
                situationItem.urgency === 'High' ? 'bg-red-100 text-red-700' :
                situationItem.urgency === 'Medium' ? 'bg-orange-100 text-orange-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {situationItem.urgency}
              </span>
            </div>
          </div>
        ))}
      </div>

      {situation && (
        <div className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Selected Situation</span>
          </div>
          <p className="text-sm text-purple-700">{situation}</p>
          <p className="text-xs text-purple-600">Urgency Level: {urgency}</p>
        </div>
      )}

      <Button
        onClick={getRightsAdvice}
        disabled={!situation}
        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
      >
        <Shield className="h-4 w-4 mr-2" />
        Get Legal Protection Advice
      </Button>
    </motion.div>
  );
}

// Feature 5: Automatic insurance claim appeal workflow generator
export function ClaimAppealGenerator({ onSendMessage }: FeatureProps) {
  const [appealData, setAppealData] = useState({
    claimNumber: '',
    denialReason: '',
    insuranceCompany: '',
    serviceDate: '',
    providerName: '',
    denialDate: '',
    medicalNecessity: ''
  });

  const denialReasons = [
    'Medical necessity not established',
    'Experimental/investigational procedure',
    'Pre-authorization required',
    'Out-of-network provider',
    'Duplicate claim',
    'Non-covered service',
    'Documentation insufficient',
    'Billing error/incorrect coding'
  ];

  const generateAppeal = () => {
    if (!appealData.claimNumber || !appealData.denialReason || !appealData.insuranceCompany) {
      toast({
        title: "Missing Required Information",
        description: "Please fill in claim number, denial reason, and insurance company.",
        variant: "destructive",
      });
      return;
    }

    const prompt = `Generate a comprehensive insurance claim appeal package for this denied claim:

Claim Number: ${appealData.claimNumber}
Insurance Company: ${appealData.insuranceCompany}
Denial Reason: ${appealData.denialReason}
Service Date: ${appealData.serviceDate}
Provider: ${appealData.providerName}
Denial Date: ${appealData.denialDate}
Medical Necessity Details: ${appealData.medicalNecessity}

Create a complete appeal workflow including: formal appeal letter with legal citations, required documentation checklist, timeline for submission, follow-up schedule, and escalation steps if denied. Include specific insurance regulations and appeal rights.`;

    onSendMessage(prompt);
  };

  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center">
          <FileEdit className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Insurance Appeal Generator</h3>
          <p className="text-sm text-gray-600">Automatic claim appeal workflows</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Claim Number *"
            value={appealData.claimNumber}
            onChange={(e) => setAppealData(prev => ({ ...prev, claimNumber: e.target.value }))}
          />
          <Input
            placeholder="Insurance Company *"
            value={appealData.insuranceCompany}
            onChange={(e) => setAppealData(prev => ({ ...prev, insuranceCompany: e.target.value }))}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Denial Reason *</p>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            value={appealData.denialReason}
            onChange={(e) => setAppealData(prev => ({ ...prev, denialReason: e.target.value }))}
          >
            <option value="">Select denial reason</option>
            {denialReasons.map((reason) => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Service Date"
            type="date"
            value={appealData.serviceDate}
            onChange={(e) => setAppealData(prev => ({ ...prev, serviceDate: e.target.value }))}
          />
          <Input
            placeholder="Denial Date"
            type="date"
            value={appealData.denialDate}
            onChange={(e) => setAppealData(prev => ({ ...prev, denialDate: e.target.value }))}
          />
        </div>

        <Input
          placeholder="Provider/Hospital Name"
          value={appealData.providerName}
          onChange={(e) => setAppealData(prev => ({ ...prev, providerName: e.target.value }))}
        />

        <Textarea
          placeholder="Explain why this service was medically necessary (include symptoms, diagnosis, treatment history)"
          value={appealData.medicalNecessity}
          onChange={(e) => setAppealData(prev => ({ ...prev, medicalNecessity: e.target.value }))}
          className="h-24"
        />

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FileEdit className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">Appeal Success Rate</span>
          </div>
          <p className="text-sm text-indigo-700">Internal appeals: 50-60% success rate</p>
          <p className="text-xs text-indigo-600">External reviews: 20-40% success rate</p>
        </div>

        <Button
          onClick={generateAppeal}
          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white"
        >
          <FileEdit className="h-4 w-4 mr-2" />
          Generate Complete Appeal Package
        </Button>
      </div>
    </motion.div>
  );
}