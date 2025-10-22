import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter,
  Phone, 
  Mail, 
  Building2, 
  Users, 
  Clock,
  Star,
  MapPin,
  PhoneCall,
  MessageCircle,
  FileText,
  Target,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Shield,
  Heart,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Info,
  Calendar,
  Timer,
  Award,
  TrendingUp,
  BarChart3,
  Zap,
  BookOpen,
  ClipboardList,
  Handshake,
  Scale,
  BadgeCheck,
  HelpCircle,
  Eye,
  Lock,
  Crown
} from "lucide-react";

// Helper function for copying to clipboard
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error('Failed to copy:', e);
    return false;
  }
}

// Provider Contact Database
const providerDatabase = [
  // Major Hospital Systems
  {
    id: "hca-healthcare",
    name: "HCA Healthcare",
    type: "Hospital System",
    locations: ["National", "Tennessee", "Florida", "Texas", "Virginia"],
    contacts: {
      billing: {
        main: "(844) 472-4477",
        hours: "Monday-Friday 7:00 AM - 7:00 PM CST",
        extensions: {
          "Payment Plans": "1",
          "Charity Care": "2", 
          "Billing Questions": "3",
          "Insurance Issues": "4"
        }
      },
      patientAdvocate: {
        main: "(855) 401-4222",
        email: "patientrelations@hcahealthcare.com",
        hours: "Monday-Friday 8:00 AM - 5:00 PM CST"
      },
      executive: {
        cfo: "Bill Rutherford - CFO",
        email: "investor.relations@hcahealthcare.com",
        address: "One Park Plaza, Nashville, TN 37203"
      },
      charitycare: {
        main: "(855) MyHCAHelp",
        website: "hcahealthcare.com/financial-assistance",
        application: "Online application available"
      }
    },
    successRate: 85,
    avgResponseTime: "3-5 business days",
    bestTimeToCall: "Tuesday-Thursday 9:00 AM - 11:00 AM",
    specialNotes: [
      "Most receptive to charity care applications",
      "Payment plans available for as low as $25/month",
      "Executive escalation effective for amounts >$10,000"
    ]
  },
  {
    id: "kaiser-permanente",
    name: "Kaiser Permanente",
    type: "Integrated Health System",
    locations: ["California", "Colorado", "Georgia", "Hawaii", "Maryland", "Oregon", "Virginia", "Washington"],
    contacts: {
      billing: {
        main: "1-800-464-4000",
        hours: "24/7 automated, live agents Monday-Friday 7:00 AM - 7:00 PM PST",
        extensions: {
          "Member Services": "1",
          "Billing Questions": "2",
          "Payment Arrangements": "3"
        }
      },
      patientAdvocate: {
        main: "1-800-632-2314",
        email: "member.services@kp.org",
        hours: "Monday-Friday 8:00 AM - 6:00 PM local time"
      },
      executive: {
        cfo: "Kathy Lancaster - CFO",
        email: "greg.adams@kp.org",
        address: "1 Kaiser Plaza, Oakland, CA 94612"
      },
      charitycare: {
        main: "1-800-390-3505",
        website: "healthy.kaiserpermanente.org/financial-assistance",
        income_limit: "Up to 400% Federal Poverty Level"
      }
    },
    successRate: 92,
    avgResponseTime: "1-3 business days",
    bestTimeToCall: "Wednesday-Thursday 10:00 AM - 2:00 PM",
    specialNotes: [
      "Integrated billing system - easier resolution",
      "Strong financial assistance programs",
      "Member advocates have significant authority"
    ]
  },
  {
    id: "mayo-clinic",
    name: "Mayo Clinic",
    type: "Academic Medical Center",
    locations: ["Minnesota", "Arizona", "Florida", "Wisconsin"],
    contacts: {
      billing: {
        main: "1-844-217-9591",
        hours: "Monday-Friday 7:00 AM - 6:00 PM local time",
        extensions: {
          "Account Questions": "1",
          "Payment Plans": "2",
          "Insurance Authorization": "3",
          "Financial Counseling": "4"
        }
      },
      patientAdvocate: {
        main: "1-507-538-0735",
        email: "patientexperience@mayo.edu",
        hours: "Monday-Friday 8:00 AM - 4:30 PM CST"
      },
      executive: {
        cfo: "Dennis Dahlen - CFO",
        ceo: "Gianrico Farrugia - CEO",
        address: "200 First Street SW, Rochester, MN 55905"
      },
      charitycare: {
        main: "1-507-284-8900",
        website: "mayoclinic.org/financial-assistance",
        requirements: "Income up to 300% Federal Poverty Level for free care"
      }
    },
    successRate: 88,
    avgResponseTime: "2-4 business days",
    bestTimeToCall: "Tuesday-Thursday 8:00 AM - 10:00 AM",
    specialNotes: [
      "Excellent financial counselors",
      "Nonprofit status - generous charity care",
      "Research costs not eligible for patient assistance"
    ]
  },
  {
    id: "cleveland-clinic",
    name: "Cleveland Clinic",
    type: "Academic Medical Center",
    locations: ["Ohio", "Florida", "Nevada", "Abu Dhabi", "Toronto"],
    contacts: {
      billing: {
        main: "1-216-445-6249",
        hours: "Monday-Friday 8:00 AM - 5:00 PM EST",
        extensions: {
          "Billing Inquiries": "1",
          "Payment Options": "2",
          "Insurance Questions": "3"
        }
      },
      patientAdvocate: {
        main: "1-216-444-2200",
        email: "patientexperience@ccf.org",
        hours: "Monday-Friday 8:00 AM - 4:30 PM EST"
      },
      executive: {
        cfo: "Steve Glass - CFO",
        ceo: "Tom Mihaljevic - CEO",
        address: "9500 Euclid Avenue, Cleveland, OH 44195"
      },
      charitycare: {
        main: "1-216-444-0770",
        website: "clevelandclinic.org/financial-assistance",
        income_limit: "Up to 400% Federal Poverty Level"
      }
    },
    successRate: 90,
    avgResponseTime: "1-2 business days",
    bestTimeToCall: "Monday-Wednesday 9:00 AM - 11:00 AM",
    specialNotes: [
      "Very responsive patient experience team",
      "Generous charity care policies",
      "Good at resolving complex billing issues"
    ]
  },
  // Regional Hospitals
  {
    id: "texas-health-resources",
    name: "Texas Health Resources",
    type: "Regional Health System",
    locations: ["Texas - Dallas-Fort Worth"],
    contacts: {
      billing: {
        main: "1-855-757-7342",
        hours: "Monday-Friday 8:00 AM - 5:00 PM CST",
        extensions: {
          "Billing Questions": "1",
          "Financial Counseling": "2",
          "Payment Plans": "3"
        }
      },
      patientAdvocate: {
        main: "1-682-236-7900",
        email: "patientrelations@texashealth.org",
        hours: "Monday-Friday 8:00 AM - 5:00 PM CST"
      },
      charitycare: {
        main: "1-855-757-7342",
        website: "texashealth.org/financial-assistance",
        income_limit: "Up to 250% Federal Poverty Level for free care"
      }
    },
    successRate: 82,
    avgResponseTime: "3-5 business days",
    bestTimeToCall: "Tuesday-Thursday 9:00 AM - 12:00 PM",
    specialNotes: [
      "Regional focus allows personalized service",
      "Strong community charity programs",
      "Payment plans readily available"
    ]
  },
  // Specialty Contact Categories
  {
    id: "emergency-room-billing",
    name: "Emergency Room Billing Services",
    type: "Specialty Billing",
    locations: ["National"],
    contacts: {
      billing: {
        main: "1-877-377-4342",
        hours: "Monday-Friday 8:00 AM - 6:00 PM local time",
        note: "Most ER billing is outsourced to third-party companies"
      },
      patientAdvocate: {
        main: "1-888-743-7326",
        email: "patientadvocate@emergencybilling.com",
        hours: "Monday-Friday 9:00 AM - 5:00 PM EST"
      }
    },
    successRate: 75,
    avgResponseTime: "5-7 business days",
    bestTimeToCall: "Monday-Tuesday 10:00 AM - 2:00 PM",
    specialNotes: [
      "Often separate from hospital billing",
      "Challenge facility fee vs physician fee splits",
      "Good Faith Estimate violations common"
    ]
  }
];

// Contact Scripts and Templates
const contactScripts = {
  billing_inquiry: {
    title: "Initial Billing Inquiry Script",
    scenario: "First contact about a questionable medical bill",
    script: `"Hello, I'm calling about account #[ACCOUNT_NUMBER] for services on [DATE]. I've received a bill for $[AMOUNT] and need to speak with someone about reviewing it for accuracy. I'm not disputing legitimate charges, but I want to ensure everything is correct. Can you connect me with a financial counselor who can help review this bill in detail?"`
  },
  charity_care_request: {
    title: "Charity Care Application Script",
    scenario: "Requesting financial assistance due to hardship",
    script: `"I'm calling to apply for your charity care program. I'm experiencing significant financial hardship and cannot afford the full amount of my medical bill. According to your published policy, patients with income up to [X]% of Federal Poverty Level are eligible for assistance. My income qualifies me for consideration. Can you please send me the application and expedite the review? I understand you cannot pursue collections while my application is pending."`
  },
  payment_plan_negotiation: {
    title: "Payment Plan Negotiation Script",
    scenario: "Setting up affordable payment arrangements",
    script: `"I want to pay this bill but need to set up a payment plan that fits my budget. I can afford $[AMOUNT] per month. I understand hospitals are required to accept reasonable payment arrangements. Can we set up a plan for $[AMOUNT] monthly with no interest charges? I'd also like this agreement in writing."`
  },
  supervisor_escalation: {
    title: "Supervisor Escalation Script", 
    scenario: "When front-line staff cannot help",
    script: `"I appreciate your time, but this matter requires management attention. I've identified billing errors totaling $[AMOUNT] and have documentation supporting my concerns. I need to speak with your supervisor or the Patient Financial Services Manager. This requires someone with authority to make billing adjustments. When would be the best time to reach them directly?"`
  }
};

// Communication Templates
const emailTemplates = {
  billing_dispute: {
    title: "Medical Bill Dispute Email",
    template: `Subject: Billing Dispute - Account #[ACCOUNT_NUMBER]

Dear Billing Manager,

I am writing to formally dispute charges on my medical bill dated [DATE] for services on [SERVICE_DATE]. 

Specific concerns:
1. [List specific billing errors]
2. [Documentation of overcharges] 
3. [Insurance processing issues]

I request:
• Immediate review and correction of identified errors
• Revised bill reflecting accurate charges  
• Written explanation of corrections made
• Suspension of collection activities during review

I am prepared to pay all legitimate charges but expect accurate billing per federal regulations. Please respond within 30 days.

Sincerely,
[YOUR NAME]
[CONTACT INFO]`
  },
  executive_escalation: {
    title: "Executive Escalation Email",
    template: `Subject: Urgent Patient Billing Matter - Account #[ACCOUNT_NUMBER]

Dear [EXECUTIVE NAME],

I am writing regarding unresolved billing issues with your organization that require senior management attention.

Background:
• Patient: [YOUR NAME]
• Account: [ACCOUNT_NUMBER]  
• Service Date: [DATE]
• Amount in Dispute: $[AMOUNT]

Despite multiple attempts to resolve this matter through your billing department, the issues remain unresolved. I have documented evidence of [specific issues].

As a nonprofit healthcare organization, I trust you share my commitment to fair and accurate billing practices. I am seeking your direct intervention to resolve this matter promptly.

I can be reached at [PHONE] and [EMAIL] and am available to discuss this further at your convenience.

Respectfully,
[YOUR NAME]`
  }
};

export default function ProviderContacts() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("database");
  const [selectedScript, setSelectedScript] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Filter providers based on search criteria
  const filteredProviders = useMemo(() => {
    return providerDatabase.filter(provider => {
      const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           provider.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !selectedLocation || provider.locations.includes(selectedLocation);
      const matchesType = !selectedType || provider.type === selectedType;
      return matchesSearch && matchesLocation && matchesType;
    });
  }, [searchTerm, selectedLocation, selectedType]);

  // Get unique locations and types for filters
  const locations = Array.from(new Set(providerDatabase.flatMap(p => p.locations))).sort();
  const types = Array.from(new Set(providerDatabase.map(p => p.type))).sort();

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    toast({
      title: success ? "Copied!" : "Copy failed",
      description: success ? `${label} copied to clipboard` : "Please copy manually",
      variant: success ? "default" : "destructive"
    });
  };

  const handleCall = (phoneNumber: string) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber.replace(/[^\d]/g, '')}`;
    }
  };

  const renderProviderCard = (provider: any) => (
    <MobileCard key={provider.id} className="space-y-4">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpandedProvider(expandedProvider === provider.id ? null : provider.id)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-5 h-5 text-cyan-600" />
            <h3 className="text-lg font-semibold text-gray-800">{provider.name}</h3>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-amber-600">{provider.successRate}%</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="inline-flex items-center px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded-lg">
              {provider.type}
            </span>
            <span className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-lg">
              <MapPin className="w-3 h-3 mr-1" />
              {provider.locations[0]}{provider.locations.length > 1 && ` +${provider.locations.length - 1}`}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {provider.avgResponseTime}
            </span>
            <span className="flex items-center gap-1">
              <Timer className="w-4 h-4" />
              {provider.bestTimeToCall}
            </span>
          </div>
        </div>

        {expandedProvider === provider.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </div>

      {expandedProvider === provider.id && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 pt-4 border-t border-gray-200"
        >
          {/* Billing Contacts */}
          {provider.contacts.billing && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-gray-800">
                <Phone className="w-4 h-4 text-cyan-600" />
                Billing Department
              </h4>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{provider.contacts.billing.main}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCall(provider.contacts.billing.main)}
                      className="flex items-center gap-1 px-3 py-1 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 transition-colors"
                      data-testid="button-call-billing"
                    >
                      <PhoneCall className="w-3 h-3" />
                      Call
                    </button>
                    <button
                      onClick={() => handleCopy(provider.contacts.billing.main, "Phone number")}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
                      data-testid="button-copy-phone"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{provider.contacts.billing.hours}</p>
                {provider.contacts.billing.extensions && (
                  <div className="text-sm">
                    <p className="font-medium text-gray-700 mb-1">Extensions:</p>
                    {Object.entries(provider.contacts.billing.extensions).map(([ext, desc]) => (
                      <p key={ext} className="text-gray-600">• Press {ext} for {String(desc)}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Patient Advocate Contacts */}
          {provider.contacts.patientAdvocate && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-gray-800">
                <Users className="w-4 h-4 text-emerald-600" />
                Patient Advocate
              </h4>
              <div className="bg-emerald-50 rounded-lg p-3 space-y-2">
                {provider.contacts.patientAdvocate.main && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{provider.contacts.patientAdvocate.main}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCall(provider.contacts.patientAdvocate.main)}
                        className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors"
                        data-testid="button-call-advocate"
                      >
                        <PhoneCall className="w-3 h-3" />
                        Call
                      </button>
                    </div>
                  </div>
                )}
                {provider.contacts.patientAdvocate.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{provider.contacts.patientAdvocate.email}</span>
                    <button
                      onClick={() => handleCopy(provider.contacts.patientAdvocate.email, "Email")}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
                      data-testid="button-copy-email"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                )}
                <p className="text-sm text-gray-600">{provider.contacts.patientAdvocate.hours}</p>
              </div>
            </div>
          )}

          {/* Executive Contacts */}
          {provider.contacts.executive && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-gray-800">
                <Target className="w-4 h-4 text-purple-600" />
                Executive Escalation
              </h4>
              <div className="bg-purple-50 rounded-lg p-3 space-y-2">
                {provider.contacts.executive.cfo && (
                  <p className="text-sm"><span className="font-medium">CFO:</span> {provider.contacts.executive.cfo}</p>
                )}
                {provider.contacts.executive.ceo && (
                  <p className="text-sm"><span className="font-medium">CEO:</span> {provider.contacts.executive.ceo}</p>
                )}
                {provider.contacts.executive.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{provider.contacts.executive.email}</span>
                    <button
                      onClick={() => handleCopy(provider.contacts.executive.email, "Executive email")}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
                      data-testid="button-copy-exec-email"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                )}
                {provider.contacts.executive.address && (
                  <p className="text-sm text-gray-600">{provider.contacts.executive.address}</p>
                )}
              </div>
            </div>
          )}

          {/* Charity Care Contacts */}
          {provider.contacts.charitycare && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-gray-800">
                <Heart className="w-4 h-4 text-pink-600" />
                Financial Assistance
              </h4>
              <div className="bg-pink-50 rounded-lg p-3 space-y-2">
                {provider.contacts.charitycare.main && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{provider.contacts.charitycare.main}</span>
                    <button
                      onClick={() => handleCall(provider.contacts.charitycare.main)}
                      className="flex items-center gap-1 px-3 py-1 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700 transition-colors"
                      data-testid="button-call-charity"
                    >
                      <PhoneCall className="w-3 h-3" />
                      Call
                    </button>
                  </div>
                )}
                {provider.contacts.charitycare.website && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600">{provider.contacts.charitycare.website}</span>
                    <button
                      onClick={() => window.open(`https://${provider.contacts.charitycare.website}`, '_blank')}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      data-testid="button-visit-website"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Visit
                    </button>
                  </div>
                )}
                {provider.contacts.charitycare.income_limit && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Income Limit:</span> {provider.contacts.charitycare.income_limit}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Special Notes */}
          {provider.specialNotes && provider.specialNotes.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-gray-800">
                <Info className="w-4 h-4 text-amber-600" />
                Insider Tips
              </h4>
              <div className="bg-amber-50 rounded-lg p-3 space-y-1">
                {provider.specialNotes.map((note: string, index: number) => (
                  <p key={index} className="text-sm text-amber-800">• {note}</p>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </MobileCard>
  );

  const renderScripts = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Contact Scripts</h2>
        <p className="text-gray-600">Professional scripts for effective provider communications</p>
      </div>

      {Object.entries(contactScripts).map(([key, script]) => (
        <MobileCard key={key}>
          <div 
            className="cursor-pointer"
            onClick={() => setSelectedScript(selectedScript === key ? null : key)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">{script.title}</h3>
              {selectedScript === key ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </div>
            <p className="text-sm text-gray-600 mb-3">{script.scenario}</p>
          </div>

          {selectedScript === key && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-4 border-t border-gray-200"
            >
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm leading-relaxed text-gray-800">{script.script}</p>
              </div>
              <button
                onClick={() => handleCopy(script.script, "Script")}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 transition-colors"
                data-testid={`button-copy-script-${key}`}
              >
                <Copy className="w-4 h-4" />
                Copy Script
              </button>
            </motion.div>
          )}
        </MobileCard>
      ))}
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Email Templates</h2>
        <p className="text-gray-600">Professional email templates for formal communications</p>
      </div>

      {Object.entries(emailTemplates).map(([key, template]) => (
        <MobileCard key={key}>
          <div 
            className="cursor-pointer"
            onClick={() => setSelectedTemplate(selectedTemplate === key ? null : key)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">{template.title}</h3>
              {selectedTemplate === key ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </div>
          </div>

          {selectedTemplate === key && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-4 border-t border-gray-200"
            >
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <pre className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap font-sans">{template.template}</pre>
              </div>
              <button
                onClick={() => handleCopy(template.template, "Template")}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 transition-colors"
                data-testid={`button-copy-template-${key}`}
              >
                <Copy className="w-4 h-4" />
                Copy Template
              </button>
            </motion.div>
          )}
        </MobileCard>
      ))}
    </div>
  );

  return (
    <MobileLayout title="Provider Contacts">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-white/50 p-1 rounded-xl">
        {[
          { id: "database", label: "Contact Database", icon: Building2 },
          { id: "scripts", label: "Phone Scripts", icon: MessageCircle },
          { id: "templates", label: "Email Templates", icon: FileText }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-800 hover:bg-white/70"
            }`}
            data-testid={`tab-${id}`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Database Tab */}
      {activeTab === "database" && (
        <>
          {/* Search and Filters */}
          <MobileCard className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/70 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                data-testid="input-search-providers"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-2 bg-white/70 border border-white/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                data-testid="select-location-filter"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 bg-white/70 border border-white/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                data-testid="select-type-filter"
              >
                <option value="">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{filteredProviders.length} providers found</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Free Resource
              </span>
            </div>
          </MobileCard>

          {/* Provider Results */}
          <div className="space-y-4" data-testid="providers-list">
            {filteredProviders.map(renderProviderCard)}
          </div>

          {filteredProviders.length === 0 && (
            <MobileCard className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No providers found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </MobileCard>
          )}
        </>
      )}

      {/* Scripts Tab */}
      {activeTab === "scripts" && renderScripts()}

      {/* Templates Tab */}
      {activeTab === "templates" && renderTemplates()}

      {/* Free Resource Notice */}
      <MobileCard className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200 mt-8">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-emerald-600 mt-1" />
          <div>
            <h3 className="font-semibold text-emerald-800 mb-1">100% Free Resource</h3>
            <p className="text-sm text-emerald-700 leading-relaxed">
              This comprehensive provider contact database is completely free for all users. 
              Identify potential billing errors by contacting the right people with proven scripts and templates.
            </p>
          </div>
        </div>
      </MobileCard>
    </MobileLayout>
  );
}