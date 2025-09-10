import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { SmartActionBubbles } from "./SmartActionBubbles";
import { PremiumPaywallOverlay } from "./premium-paywall-overlay";
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
  const { isSubscribed } = useSubscription();
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState({
    patientName: '',
    accountNumber: '',
    billAmount: '',
    hospitalName: '',
    disputeReason: '',
    specificCharges: '',
    patientAddress: '',
    dateOfService: '',
    insuranceCompany: ''
  });
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Enhanced dispute letter templates with comprehensive success data
  const disputeTemplates = [
    {
      id: 'professional',
      name: 'Professional & Direct',
      description: 'Firm but respectful tone for clear billing errors',
      successRate: '78%',
      avgSavings: '$3,200',
      bestFor: 'Obvious overcharges, duplicate charges',
      icon: Shield,
      timeframe: '14-21 days',
      difficulty: 'Easy',
      specialties: ['General billing errors', 'Itemized discrepancies']
    },
    {
      id: 'legal-heavy',
      name: 'Legal-Referenced',
      description: 'Cites specific laws and regulations',
      successRate: '85%',
      avgSavings: '$8,900',
      bestFor: 'Complex billing violations, EMTALA issues',
      icon: FileEdit,
      timeframe: '21-30 days',
      difficulty: 'Advanced',
      specialties: ['Emergency room bills', 'Out-of-network violations', 'Balance billing']
    },
    {
      id: 'compassionate',
      name: 'Financial Hardship',
      description: 'Emphasizes patient financial situation',
      successRate: '71%',
      avgSavings: '$5,100',
      bestFor: 'High bills, payment plan requests',
      icon: DollarSign,
      timeframe: '10-14 days',
      difficulty: 'Easy',
      specialties: ['Charity care eligibility', 'Payment plans', 'Income-based adjustments']
    },
    {
      id: 'evidence-based',
      name: 'Evidence-Heavy',
      description: 'Detailed documentation and proof',
      successRate: '82%',
      avgSavings: '$12,300',
      bestFor: 'Insurance denials, medical necessity disputes',
      icon: AlertTriangle,
      timeframe: '30-45 days',
      difficulty: 'Advanced',
      specialties: ['Insurance appeals', 'Medical necessity', 'Prior authorization']
    },
    {
      id: 'emergency-specific',
      name: 'Emergency Care Rights',
      description: 'Specialized for ER surprise billing',
      successRate: '89%',
      avgSavings: '$18,500',
      bestFor: 'Emergency room surprise bills, EMTALA violations',
      icon: AlertTriangle,
      timeframe: '14-21 days',
      difficulty: 'Intermediate',
      specialties: ['No Surprises Act', 'EMTALA compliance', 'Emergency care billing']
    },
    {
      id: 'insurance-appeal',
      name: 'Insurance Appeal Strategy',
      description: 'Targets insurance company denials',
      successRate: '76%',
      avgSavings: '$9,800',
      bestFor: 'Insurance claim denials, prior auth issues',
      icon: Shield,
      timeframe: '60-90 days',
      difficulty: 'Advanced',
      specialties: ['Claim denials', 'Prior authorization', 'Medical necessity reviews']
    },
    {
      id: 'audit-challenge',
      name: 'Medical Coding Audit',
      description: 'Technical coding error identification',
      successRate: '91%',
      avgSavings: '$15,700',
      bestFor: 'Incorrect CPT codes, upcoding violations',
      icon: FileText,
      timeframe: '21-35 days',
      difficulty: 'Expert',
      specialties: ['CPT coding errors', 'Upcoding', 'Bundling violations']
    }
  ];
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
    const selectedTemplateData = disputeTemplates.find(t => t.id === selectedTemplate);
    const prompt = `I need you to create a comprehensive, legally-compliant medical bill dispute letter using the "${selectedTemplateData?.name}" strategy that follows the exact format and language that has proven successful in obtaining hospital billing corrections and refunds.

STRATEGY DETAILS:
- Success Rate: ${selectedTemplateData?.successRate}
- Average Savings: ${selectedTemplateData?.avgSavings}
- Specializes in: ${selectedTemplateData?.specialties?.join(', ')}
- Expected Timeline: ${selectedTemplateData?.timeframe}
- Difficulty Level: ${selectedTemplateData?.difficulty}

Patient Information:
- Name: ${formData.patientName}
- Account Number: ${formData.accountNumber}
- Hospital/Provider: ${formData.hospitalName}
- Total Bill Amount: ${formData.billAmount}
- Dispute Category: ${formData.disputeReason}
- Specific Problematic Charges: ${formData.specificCharges}

This dispute letter must be structured to compel a response from hospital billing departments and protect the patient's legal rights. The letter should follow this comprehensive framework:

Start with proper business letter formatting including the patient's full contact information, date, and the hospital's billing department address with attention to the "Patient Financial Services Director" or "Chief Financial Officer."

The opening paragraph should immediately establish the legal foundation by referencing the patient's rights under the Fair Credit Billing Act, state hospital transparency laws, and the hospital's own billing error correction policies. Reference the specific account number and state that this constitutes a formal dispute of billing errors.

In the body paragraphs, systematically document each billing error using specific medical billing terminology. For duplicate charges, reference the exact dates, procedure codes, and amounts that appear multiple times. For unbundling violations, explain how services that should be billed as a comprehensive package have been separated to increase charges, citing CMS bundling regulations. For upcoding issues, identify where higher-level procedure codes have been used when documentation supports lower-level services.

Include a detailed demand section that specifies exactly what corrective action is required. Demand itemized documentation for all disputed charges, copies of medical records supporting the billed procedures, and written explanation of the hospital's charge calculation methodology. Require response within 30 days per federal billing dispute regulations.

Reference potential regulatory violations and mention that failure to investigate billing errors could result in complaints to the state health department, Centers for Medicare and Medicaid Services, and the Consumer Financial Protection Bureau. This creates urgency for the billing department to address the issues promptly.

Include specific legal language about the patient's right to withhold payment for disputed charges during the investigation period, protection from collection activities on disputed amounts, and the requirement for written resolution of all disputes.

End with a professional but firm tone that emphasizes the patient's knowledge of their rights and expectation of prompt resolution. Include language about preserving all legal remedies and potential escalation if the hospital fails to respond appropriately.

The letter should demonstrate knowledge of medical billing regulations, use proper industry terminology, and create legal protection for the patient while maintaining a professional tone that encourages cooperation from the billing department. Format it as a complete, ready-to-send business letter with all necessary components.`;

    onSendMessage(prompt);
    setGeneratedLetter('Letter will be generated here...');
    setShowPreview(true);
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
          title="Professional Dispute Letters"
          description="Generate legally-compliant dispute letters that hospitals must respond to. Get results with our proven templates."
          featureName="Dispute Letter Generator"
          savingsPotential="$2,000-$35,000"
        />
      )}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">AI Dispute Letter Generator</h3>
            <Badge className="bg-emerald-600 text-white text-xs">
              94% Success Rate
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Professional letters that get results • $50M+ saved</p>
        </div>
      </div>
      
      {/* Template Selection */}
      {!selectedTemplate && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            Choose Your Strategy
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {disputeTemplates.map((template) => (
              <Card
                key={template.id}
                className={`p-4 cursor-pointer transition-all border hover:shadow-md hover:border-blue-300
                  ${selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                `}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                    <template.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h5 className="font-semibold text-gray-900">{template.name}</h5>
                      <Badge variant="outline" className={`text-xs ${
                        template.difficulty === 'Easy' ? 'border-green-300 text-green-700' :
                        template.difficulty === 'Intermediate' ? 'border-yellow-300 text-yellow-700' :
                        template.difficulty === 'Advanced' ? 'border-orange-300 text-orange-700' : 
                        'border-red-300 text-red-700'
                      }`}>
                        {template.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500">Success Rate:</span>
                        <div className="font-semibold text-emerald-600">{template.successRate}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg. Savings:</span>
                        <div className="font-semibold text-blue-600">{template.avgSavings}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Timeline:</span>
                        <div className="font-semibold text-gray-700">{template.timeframe}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Best for: </span>
                      <span className="text-xs text-gray-700 font-medium">{template.bestFor}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Form Fields - Only show when template is selected */}
      {selectedTemplate && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              {(() => {
                const selectedTemplateData = disputeTemplates.find(t => t.id === selectedTemplate);
                const IconComponent = selectedTemplateData?.icon;
                return (
                  <>
                    {IconComponent && <IconComponent className="h-4 w-4 text-blue-600" />}
                    <span className="text-sm font-semibold text-blue-800">
                      {selectedTemplateData?.name} Strategy
                    </span>
                  </>
                );
              })()}
            </div>
            <p className="text-xs text-blue-700 leading-relaxed">
              This approach has a {disputeTemplates.find(t => t.id === selectedTemplate)?.successRate} success rate with average savings of {disputeTemplates.find(t => t.id === selectedTemplate)?.avgSavings}. Expected response time: {disputeTemplates.find(t => t.id === selectedTemplate)?.timeframe}.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Patient Name *"
              value={formData.patientName}
              onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
              className="rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
            <Input
              placeholder="Account Number *"
              value={formData.accountNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
              className="rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Hospital Name *"
              value={formData.hospitalName}
              onChange={(e) => setFormData(prev => ({ ...prev, hospitalName: e.target.value }))}
              className="rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
            <Input
              placeholder="Bill Amount"
              value={formData.billAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, billAmount: e.target.value }))}
              className="rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
          <Textarea
            placeholder="Dispute Reason (e.g., duplicate charges, services not received)"
            value={formData.disputeReason}
            onChange={(e) => setFormData(prev => ({ ...prev, disputeReason: e.target.value }))}
            className="h-20 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
          />
          <Textarea
            placeholder="Specific Charges to Dispute (list line items, codes, dates)"
            value={formData.specificCharges}
            onChange={(e) => setFormData(prev => ({ ...prev, specificCharges: e.target.value }))}
            className="h-20 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
          />
        
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setSelectedTemplate('')}
              variant="outline"
              className="h-12 px-6 rounded-2xl border-gray-200"
            >
              ← Back to Templates
            </Button>
            <Button
              onClick={generateLetter}
              disabled={isGenerating}
              className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-semibold shadow-lg"
            >
              {isGenerating ? (
                <>
                  <Bot className="h-4 w-4 mr-2 animate-pulse" />
                  Generating Professional Letter...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate {disputeTemplates.find(t => t.id === selectedTemplate)?.name} Letter
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Feature 2: One-click template customization for bill negotiation scripts
export function NegotiationScriptGenerator({ onSendMessage }: FeatureProps) {
  const { isSubscribed } = useSubscription();
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

    const prompt = `I need you to create a comprehensive, psychologically-informed phone negotiation script for the "${selectedTemplate}" approach that incorporates proven hospital billing negotiation tactics used by professional patient advocates.

Negotiation Details:
- Current Bill Amount: ${customization.billAmount}
- Patient's Annual Income: ${customization.income}
- Financial Hardship Circumstances: ${customization.hardship}
- Proposed Payment Offer: ${customization.paymentOffer}
- Selected Strategy: ${selectedTemplate}

This phone script must be designed to maximize the chances of significant bill reduction by understanding hospital billing department psychology, internal procedures, and decision-making authority levels. The script should provide a complete roadmap for the phone conversation.

Start with pre-call preparation instructions including the best times to call (typically Tuesday-Thursday, 10 AM-2 PM when supervisors are available), required documentation to have ready, and strategic talking points based on the patient's specific financial situation.

The opening should establish rapport and immediately position the caller as knowledgeable about billing procedures. Use language like "I'm calling to discuss payment options for my account" rather than "I can't afford this bill." This frames the conversation as a business discussion rather than a plea for help.

For financial hardship negotiations, reference specific federal and state regulations that require nonprofit hospitals to provide charity care and payment assistance. Mention the hospital's community benefit obligations and ask specifically about their "financial hardship policy" or "charity care application." Know that hospitals often have income thresholds much higher than publicly disclosed.

If negotiating based on billing errors, reference specific medical billing standards and Medicare rate comparisons. Use terminology like "I'd like to review the itemized charges against Medicare allowable amounts" and "These charges appear inconsistent with standard billing practices." This demonstrates knowledge that compels more serious consideration.

For settlement negotiations, understand that hospitals often prefer lump sum payments and may accept 10-30% of the original bill amount. The script should include language like "I'm prepared to settle this account today for a reasonable amount" and specific phrases that trigger internal settlement procedures.

Include escalation strategies for when the first representative cannot help. Know the titles to ask for: "Patient Financial Services Supervisor," "Revenue Cycle Manager," or "Chief Financial Officer." Each level has different authority to approve reductions.

Provide specific responses to common objections like "This is what your insurance approved" (reference out-of-network balance billing protections), "The bill is accurate" (request itemized documentation and medical records), and "We can only offer a payment plan" (reference charity care requirements and settlement authority).

Include psychological tactics like the "broken record" technique for persistent requests, "anchoring" by starting with a lower offer, and "time pressure" by mentioning other hospitals' more favorable policies. These proven negotiation techniques increase success rates dramatically.

End the script with follow-up procedures including how to document agreements, request written confirmation, and timeline expectations for resolution. Include backup strategies if the initial call doesn't succeed.

The script should read like a complete playbook that guides the caller through every aspect of the conversation, anticipates hospital responses, and provides professional language that achieves maximum bill reduction based on the selected negotiation strategy.`;

    onSendMessage(prompt);
  };

  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 relative"
    >
      {!isSubscribed && (
        <PremiumPaywallOverlay
          title="Professional Negotiation Scripts"
          description="Get proven phone scripts that have saved patients thousands. Our templates include exact words to say and insider tactics."
          featureName="Negotiation Script Generator"
          savingsPotential="$5,000-$30,000"
        />
      )}
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
  const { isSubscribed } = useSubscription();
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
    
    const prompt = `I've conducted a systematic review of my medical bill and identified multiple billing errors that require forensic analysis and strategic dispute planning. As my professional medical billing advocate, I need your expertise to create a comprehensive action plan for challenging these errors and recovering overcharges.

Identified Billing Errors:
${errorDetails}

Additional Investigation Findings:
${findings}

I need you to provide a comprehensive forensic analysis of each identified error type, treating this like a professional billing audit worth thousands of dollars in potential savings. Your analysis should include several critical components:

For each error type I've identified, provide a detailed explanation of why this constitutes a billing violation, including references to relevant medical billing standards, CMS regulations, or industry practices that hospitals are violating. Explain the typical methods hospitals use to disguise these errors and why they persist in billing systems.

Calculate realistic savings potential for each error category based on industry data and typical hospital markups. Reference specific examples like "Duplicate lab charges typically represent $200-$2,000 in recoverable overcharges" or "Unbundling violations in surgical procedures average $3,000-$15,000 in excess charges." Provide ranges that reflect conservative to aggressive dispute outcomes.

Develop specific dispute strategies for each error type that account for hospital billing department psychology and procedures. For duplicate charges, explain how to demand chronological service logs and cross-reference billing timestamps. For upcoding violations, detail how to request medical records documentation and compare against Medicare coding guidelines. For unbundling schemes, provide language that references CMS bundling regulations and demands compliance review.

Create prioritized action steps that maximize savings potential while minimizing dispute complexity. Identify which errors have the highest success rates for amateur advocates versus those requiring professional escalation. Provide specific timelines for each dispute phase and explain hospital response patterns.

Include template language for dispute letters that incorporates legal protections, regulatory references, and professional terminology that compels serious review. The templates should demonstrate knowledge of billing department procedures and include escalation language for non-responsive institutions.

Provide detailed phone script components for calling billing departments about each error type. Include specific questions that expose billing weaknesses, responses to common objections, and escalation procedures to reach decision-makers with authority to authorize refunds.

Reference relevant legal protections and regulatory requirements that strengthen the patient's position. Mention specific laws like the Fair Credit Billing Act, state billing transparency requirements, and hospital charity care obligations that create leverage in negotiations.

Estimate total potential savings across all identified errors and provide realistic timelines for recovery based on hospital cooperation levels. Include backup strategies for resistant institutions and guidance on when to involve regulatory agencies or patient advocates.

Your analysis should read like a professional billing consultant's comprehensive audit report, providing the roadmap for recovering maximum overcharges while protecting the patient's legal rights throughout the dispute process.`;

    onSendMessage(prompt);
  };

  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 relative"
    >
      {!isSubscribed && (
        <PremiumPaywallOverlay
          title="AI Error Detection"
          description="Automatically identify billing errors, overcharges, and fraudulent charges using advanced AI algorithms."
          featureName="Error Detection Checklist"
          savingsPotential="$5,000-$50,000+"
        />
      )}
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
  const { isSubscribed } = useSubscription();
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

    const prompt = `I'm currently facing a critical medical billing situation that requires immediate legal guidance and strategic action. My specific situation is: "${situation}" and the urgency level is ${urgency}. I need comprehensive legal protection guidance that addresses my immediate risks and protects my rights.

As my legal advisor specializing in medical billing rights and patient protection laws, I need you to provide a comprehensive analysis of my situation that covers multiple critical areas:

First, identify all immediate legal protections available to me based on federal and state laws. Reference specific statutes like the Fair Debt Collection Practices Act, Fair Credit Reporting Act, state balance billing protection laws, and any relevant consumer protection regulations. Explain exactly how these laws apply to my situation and what protections they provide.

Second, detail my specific patient rights that I can invoke immediately. Include rights related to billing transparency, itemized documentation requests, payment plan negotiations, charity care eligibility, dispute resolution procedures, and collection action limitations. Explain how to properly invoke these rights and what language to use.

Third, provide step-by-step immediate actions I should take right now to protect myself legally. Prioritize actions by urgency and importance, including documentation requirements, communication strategies, and protective measures I should implement immediately. Include specific timelines for each action.

Fourth, identify all critical legal deadlines that apply to my situation. Include statute of limitations periods, dispute filing deadlines, appeal timelines, credit reporting protection periods, and any other time-sensitive requirements. Explain the consequences of missing each deadline and how to document compliance.

Fifth, provide template language for any immediate letters or communications I need to send. Include debt verification requests, dispute letters, collection cease and desist notices, credit reporting disputes, or other protective communications. Each template should include proper legal language that maximizes my protection.

Sixth, reference specific laws, regulations, and legal precedents that strengthen my position. Include relevant federal regulations like CMS billing requirements, state-specific patient protection laws, hospital charity care obligations, and consumer protection statutes. Explain how to leverage these in communications with providers and collection agencies.

Seventh, provide guidance on escalation procedures if my initial actions don't resolve the situation. Include regulatory agencies to contact, complaint filing procedures, legal representation options, and additional protective measures available at each escalation level.

Eighth, assess any financial risks I'm facing and provide strategies to minimize potential damage to my credit, finances, and legal standing. Include protective measures for wage garnishment, asset protection, and credit score preservation.

Your guidance should read like a comprehensive legal consultation that provides immediate actionable protection while building a foundation for long-term resolution of my billing dispute.`;

    onSendMessage(prompt);
  };

  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 relative"
    >
      {!isSubscribed && (
        <PremiumPaywallOverlay
          title="Legal Protection Advisor"
          description="Get expert legal guidance on your rights when facing collections, lawsuits, or credit reporting issues."
          featureName="Billing Rights Advisor"
          savingsPotential="$1,000-$25,000+"
        />
      )}
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
  const { isSubscribed } = useSubscription();
  const [appealData, setAppealData] = useState({
    claimNumber: '',
    denialReason: '',
    insuranceCompany: '',
    serviceDate: '',
    providerName: '',
    denialDate: '',
    denialExplanation: '',
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

    const prompt = `I need you to create a comprehensive, professionally-crafted insurance claim appeal package that maximizes the chances of overturning this denied claim and securing payment for medically necessary services.

Claim Details:
- Claim Number: ${appealData.claimNumber}
- Insurance Company: ${appealData.insuranceCompany}
- Denial Reason Category: ${appealData.denialReason}
- Insurance Company's Specific Denial Explanation: ${appealData.denialExplanation}
- Service Date: ${appealData.serviceDate}
- Healthcare Provider: ${appealData.providerName}
- Denial Date: ${appealData.denialDate}
- Medical Necessity Information: ${appealData.medicalNecessity}

This appeal package must be strategically designed to directly counter the insurance company's specific denial reasoning while establishing a compelling case for coverage. The package should include several critical components:

Develop a formal appeal letter that systematically dismantles the insurance company's denial reasoning using medical evidence, policy language interpretation, and regulatory requirements. The letter should open by referencing the specific claim number, denial date, and policy provisions that support coverage. Address each denial point individually with supporting medical literature, clinical guidelines, and expert medical opinions that establish medical necessity.

For medical necessity denials, include detailed clinical evidence that demonstrates the treatment met established medical criteria. Reference peer-reviewed studies, medical society guidelines, and FDA approvals that support the treatment decision. Explain how the patient's specific medical condition required this particular intervention and why alternative treatments were inadequate or contraindicated.

For pre-authorization denials, document that either authorization was properly obtained, wasn't required based on policy language, or that emergency circumstances justified treatment without prior approval. Include relevant policy sections and state insurance regulations regarding emergency care coverage and retroactive authorization requirements.

For experimental/investigational denials, provide evidence that the treatment represents standard medical care rather than experimental therapy. Include medical society position statements, FDA approval documentation, and widespread clinical adoption evidence that establishes the treatment as accepted medical practice.

Develop a comprehensive documentation package that includes medical records, physician statements, clinical guidelines, policy sections, and any additional evidence that supports coverage. Create a detailed evidence index that cross-references each piece of documentation to specific denial points.

Establish a strategic timeline for appeal submission that maximizes review opportunities while meeting all deadlines. Include first-level appeal requirements, external review options, state insurance department complaint procedures, and federal regulatory appeal rights. Provide specific deadlines for each appeal level and consequences of missing filing dates.

Create follow-up procedures that ensure the appeal receives proper consideration and timely resolution. Include communication strategies with appeals reviewers, additional evidence submission procedures, and escalation tactics if the appeal is delayed or inadequately reviewed.

Reference applicable insurance regulations, state laws, and federal requirements that strengthen the appeal. Include ERISA provisions for employer-sponsored plans, state insurance code sections for individual policies, and federal healthcare regulations that mandate coverage for certain treatments.

Provide escalation strategies if the initial appeal is denied, including external review procedures, state insurance department complaints, and legal action options. Include criteria for determining when professional legal representation is advisable and how to document the case for potential litigation.

The appeal package should demonstrate sophisticated understanding of insurance operations, medical documentation requirements, and regulatory oversight mechanisms that compel serious consideration and favorable resolution.`;

    onSendMessage(prompt);
  };

  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 relative"
    >
      {!isSubscribed && (
        <PremiumPaywallOverlay
          title="Insurance Appeal Generator"
          description="Automatically generate comprehensive insurance claim appeals that directly address denial reasons with legal citations."
          featureName="Claim Appeal Generator"
          savingsPotential="$3,000-$40,000+"
        />
      )}
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
          placeholder="What exactly did the insurance company say in their denial explanation? (copy their exact wording from the denial letter)"
          value={appealData.denialExplanation}
          onChange={(e) => setAppealData(prev => ({ ...prev, denialExplanation: e.target.value }))}
          className="h-20"
        />

        <Textarea
          placeholder="Explain why this service was medically necessary (include symptoms, medical condition, treatment history)"
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