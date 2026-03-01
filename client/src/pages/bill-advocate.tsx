import { useState, useRef } from "react";
import { useHealthcareConsent, HealthcareConsentModal } from "@/components/healthcare-consent-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { MobileLayout } from "@/components/mobile-layout";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  Brain,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  Lock,
  Loader2,
  DollarSign,
  AlertTriangle,
  Phone,
  Mail,
  Copy,
  Download,
  Sparkles,
  ClipboardList,
  Building2,
  Calendar,
  User,
  MapPin,
  Send,
  ChevronDown,
  Target,
  Zap,
  Heart,
  Scale,
  FileSearch,
  TrendingDown,
  Image as ImageIcon
} from "lucide-react";

type Situation = "new-bill" | "collections" | "insurance-denial" | "confused" | null;

interface BillLineItem {
  description: string;
  code: string;
  amount: string;
}

interface AnalysisResult {
  potentialSavings?: number;
  riskScore?: number;
  analysisConfidence?: number;
  issues?: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    riskLevel: string;
    potentialSavings: number;
    confidence: number;
    priority: number;
    actionRequired: string;
    evidence: string[];
    nextSteps: string[];
  }>;
  recommendations?: string[];
  negotiationStrategy?: {
    approach: string;
    talkingPoints: string[];
    targetReduction: string;
    fallbackOptions: string[];
  };
  financialAssistance?: {
    eligible: boolean;
    programs: string[];
    estimatedDiscount: string;
  };
  insiderTactics?: string[];
}

const SITUATIONS = [
  {
    id: "new-bill" as Situation,
    title: "I just got a bill",
    description: "Received a medical bill and want to check it for errors",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    id: "collections" as Situation,
    title: "Bill is going to collections",
    description: "Need to act fast before it damages my credit",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    id: "insurance-denial" as Situation,
    title: "Insurance denied my claim",
    description: "My insurance won't pay and I need to appeal",
    icon: Scale,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200"
  },
  {
    id: "confused" as Situation,
    title: "I don't understand my bill",
    description: "Need help making sense of the charges",
    icon: FileSearch,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  }
];

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const stepLabels = ["Situation", "Itemized Bill", "Bill Details", "AI Analysis", "Action Plan"];
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-3">
        {stepLabels.map((label, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isComplete = stepNum < currentStep;
          return (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                isComplete ? "bg-emerald-500 text-white" :
                isActive ? "bg-blue-600 text-white ring-4 ring-blue-100" :
                "bg-gray-100 text-gray-400"
              }`}>
                {isComplete ? <CheckCircle className="h-5 w-5" /> : stepNum}
              </div>
              <span className={`text-xs mt-1.5 text-center hidden sm:block ${
                isActive ? "text-blue-600 font-semibold" :
                isComplete ? "text-emerald-600 font-medium" :
                "text-gray-400"
              }`}>{label}</span>
            </div>
          );
        })}
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function BillAdvocate() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [situation, setSituation] = useState<Situation>(null);
  const { hasConsented, showModal, setShowModal, giveConsent, requestConsent } = useHealthcareConsent();

  const [patientName, setPatientName] = useState("");
  const [providerName, setProviderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [patientState, setPatientState] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [generatingLetter, setGeneratingLetter] = useState(false);

  const [billAmount, setBillAmount] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [billDescription, setBillDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadMode, setUploadMode] = useState<"upload" | "manual">("manual");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisStage, setAnalysisStage] = useState("");

  const [actionChat, setActionChat] = useState<Array<{ role: string; content: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [disputeLetter, setDisputeLetter] = useState("");
  const [generatingDispute, setGeneratingDispute] = useState(false);

  const handleGenerateLetter = async () => {
    if (!patientName || !providerName) {
      toast({ title: "Please fill in patient name and provider", variant: "destructive" });
      return;
    }
    setGeneratingLetter(true);
    try {
      const res = await apiRequest("/api/generate-itemized-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName,
          providerName,
          accountNumber,
          serviceDate,
          patientAddress,
          state: patientState
        })
      });
      const data = await res.json();
      setGeneratedLetter(data.letter || "Unable to generate letter. Please try again.");
      toast({ title: "Letter generated successfully" });
    } catch (err) {
      toast({ title: "Failed to generate letter. Please try again.", variant: "destructive" });
    } finally {
      setGeneratingLetter(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    const validFiles = files.filter(f => validTypes.includes(f.type) && f.size <= 10 * 1024 * 1024);
    if (validFiles.length < files.length) {
      toast({ title: "Some files were skipped (must be JPG, PNG, WebP, or PDF under 10MB)", variant: "destructive" });
    }
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const handleAnalyze = async () => {
    if (!billAmount && uploadedFiles.length === 0) {
      toast({ title: "Please enter a bill amount or upload bill images", variant: "destructive" });
      return;
    }
    setAnalyzing(true);
    setAnalysisStage("Scanning bill details...");

    try {
      const stages = [
        "Categorizing charges and medical codes...",
        "Comparing against Medicare rates...",
        "Checking for billing errors and overcharges...",
        "Calculating potential savings...",
        "Building your personalized action plan..."
      ];

      let stageIndex = 0;
      const stageInterval = setInterval(() => {
        stageIndex++;
        if (stageIndex < stages.length) {
          setAnalysisStage(stages[stageIndex]);
        }
      }, 2000);

      if (uploadedFiles.length > 0) {
        const formData = new FormData();
        uploadedFiles.forEach(f => formData.append("bills", f));
        const uploadRes = await fetch("/api/upload-bills", {
          method: "POST",
          credentials: "include",
          body: formData
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          const extractedText = uploadData.results?.map((r: any) => r.extractedText).join("\n") || "";

          const res = await apiRequest("/api/analyze-bill-ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              totalAmount: billAmount || "0",
              patientResponsibility: billAmount || "0",
              providerName: providerName || "Unknown Provider",
              serviceDate: serviceDate || new Date().toISOString().split("T")[0],
              serviceType: serviceType || "Medical Service",
              billDescription: `${billDescription}\n\nExtracted bill text:\n${extractedText}`
            })
          });
          const data = await res.json();
          clearInterval(stageInterval);
          setAnalysisResult(data.analysis || {});
        } else {
          throw new Error("Upload failed");
        }
      } else {
        const res = await apiRequest("/api/analyze-bill-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            totalAmount: billAmount,
            patientResponsibility: billAmount,
            providerName: providerName || "Unknown Provider",
            serviceDate: serviceDate || new Date().toISOString().split("T")[0],
            serviceType: serviceType || "Medical Service",
            billDescription
          })
        });
        const data = await res.json();
        clearInterval(stageInterval);
        setAnalysisResult(data.analysis || {});
      }

      setAnalysisStage("");
      setStep(4);
    } catch (err) {
      console.error("Analysis error:", err);
      toast({ title: "Analysis failed. Please try again.", variant: "destructive" });
      setAnalysisStage("");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setActionChat(prev => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);

    try {
      const context = analysisResult
        ? `Context: Bill amount $${billAmount}, provider: ${providerName}, savings found: $${analysisResult.potentialSavings || 0}, issues: ${analysisResult.issues?.map(i => i.title).join(", ") || "none"}`
        : "";
      const res = await apiRequest("/api/bill-ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${context}\n\n${userMsg}`,
          conversationHistory: actionChat.slice(-6),
          workflowId: "bill-advocate"
        })
      });
      const data = await res.json();
      setActionChat(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (err) {
      setActionChat(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateDisputeLetter = async () => {
    if (!analysisResult) return;
    setGeneratingDispute(true);
    try {
      const prompt = `Generate a professional dispute letter for this medical bill:

Patient: ${patientName || "Patient"}
Provider: ${providerName || "Healthcare Provider"}
Bill Amount: $${billAmount}
Account: ${accountNumber || "N/A"}
Service Date: ${serviceDate || "N/A"}

Issues Found:
${analysisResult.issues?.map(i => `- ${i.title}: ${i.description} (potential savings: $${i.potentialSavings})`).join("\n") || "Various billing concerns"}

Total Potential Savings: $${analysisResult.potentialSavings || 0}

Generate a formal, professional dispute letter that references specific issues, includes relevant legal citations, and requests a detailed review and adjustment of the charges. Write it ready to send.`;

      const res = await apiRequest("/api/bill-ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          conversationHistory: [],
          workflowId: "dispute-letter"
        })
      });
      const data = await res.json();
      setDisputeLetter(data.response);
    } catch (err) {
      toast({ title: "Failed to generate dispute letter", variant: "destructive" });
    } finally {
      setGeneratingDispute(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Heart className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">What's going on with your bill?</h2>
        <p className="text-gray-500 dark:text-gray-400">Select your situation so we can help you the right way.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SITUATIONS.map(s => (
          <motion.button
            key={s.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSituation(s.id); setStep(2); }}
            className={`p-5 rounded-2xl border-2 text-left transition-all ${
              situation === s.id
                ? `${s.borderColor} ${s.bgColor} shadow-md`
                : "border-gray-100 hover:border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl ${s.bgColor} flex items-center justify-center flex-shrink-0`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 mt-6">
        <Lock className="h-5 w-5 text-blue-500 flex-shrink-0" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Your information is encrypted (AES-256) and only used to help reduce your bill. Auto-deleted after 30 days.{" "}
          <a href="/data-security" className="underline font-medium hover:text-blue-900 dark:hover:text-blue-100">Learn more about how we protect your data</a>.
        </p>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <FileText className="h-7 w-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Request Your Itemized Bill</h2>
        <p className="text-gray-500 dark:text-gray-400">
          An itemized bill is the single most important document for finding savings. Hospitals must provide one by law.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Why this matters:</strong> Summary bills hide the details. An itemized bill shows every charge, code, and fee — that's where errors and savings are found.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <User className="h-4 w-4" /> Patient Name
          </label>
          <Input
            value={patientName}
            onChange={e => setPatientName(e.target.value)}
            placeholder="Full name as on the bill"
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Hospital / Provider
          </label>
          <Input
            value={providerName}
            onChange={e => setProviderName(e.target.value)}
            placeholder="Hospital or provider name"
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <ClipboardList className="h-4 w-4" /> Account Number
          </label>
          <Input
            value={accountNumber}
            onChange={e => setAccountNumber(e.target.value)}
            placeholder="Account or patient ID (optional)"
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Service Date
          </label>
          <Input
            type="date"
            value={serviceDate}
            onChange={e => setServiceDate(e.target.value)}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Your State
          </label>
          <Select value={patientState} onValueChange={setPatientState}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Mail className="h-4 w-4" /> Your Address (optional)
          </label>
          <Input
            value={patientAddress}
            onChange={e => setPatientAddress(e.target.value)}
            placeholder="Where they should send the response"
            className="rounded-xl"
          />
        </div>
      </div>

      <Button
        onClick={handleGenerateLetter}
        disabled={generatingLetter || !patientName || !providerName}
        className="w-full py-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg"
      >
        {generatingLetter ? (
          <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Generating Your Letter...</>
        ) : (
          <><Sparkles className="h-5 w-5 mr-2" /> Generate Itemized Bill Request Letter</>
        )}
      </Button>

      {generatedLetter && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Letter</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedLetter)} className="rounded-lg">
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed max-h-96 overflow-y-auto">
            {generatedLetter}
          </div>
          <p className="text-xs text-gray-400 text-center">
            Print this letter and mail it, or email it to the hospital's billing department.
          </p>
        </motion.div>
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Button
          onClick={() => {
            if (requestConsent()) {
              setStep(3);
            }
          }}
          className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {generatedLetter ? "Continue to Bill Analysis" : "Skip — I already have my itemized bill"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <Upload className="h-7 w-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enter Your Bill Details</h2>
        <p className="text-gray-500 dark:text-gray-400">Upload bill images or enter the details manually. The more info you provide, the better the analysis.</p>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <button
          onClick={() => setUploadMode("manual")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            uploadMode === "manual" ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500"
          }`}
        >
          Enter Details
        </button>
        <button
          onClick={() => setUploadMode("upload")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            uploadMode === "upload" ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500"
          }`}
        >
          Upload Bill Images
        </button>
      </div>

      {uploadMode === "upload" ? (
        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl p-8 text-center cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all"
          >
            <ImageIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Click to upload bill images or PDFs
            </p>
            <p className="text-xs text-gray-400">JPG, PNG, WebP, or PDF — up to 10MB each</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              {uploadedFiles.map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{f.name}</span>
                  </div>
                  <button
                    onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))}
                    className="text-gray-400 hover:text-red-500 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Bill Amount (if known)</label>
            <Input
              type="number"
              value={billAmount}
              onChange={e => setBillAmount(e.target.value)}
              placeholder="$ Amount"
              className="rounded-xl"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <DollarSign className="h-4 w-4" /> Total Bill Amount
              </label>
              <Input
                type="number"
                value={billAmount}
                onChange={e => setBillAmount(e.target.value)}
                placeholder="Enter total amount"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type of Care</label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Emergency Room">Emergency Room</SelectItem>
                  <SelectItem value="Hospital Stay">Hospital Stay</SelectItem>
                  <SelectItem value="Surgery">Surgery</SelectItem>
                  <SelectItem value="Diagnostic Tests">Diagnostic Tests / Lab Work</SelectItem>
                  <SelectItem value="Imaging">Imaging (MRI, CT, X-ray)</SelectItem>
                  <SelectItem value="Outpatient Procedure">Outpatient Procedure</SelectItem>
                  <SelectItem value="Specialist Visit">Specialist Visit</SelectItem>
                  <SelectItem value="Urgent Care">Urgent Care</SelectItem>
                  <SelectItem value="Maternity">Maternity / Childbirth</SelectItem>
                  <SelectItem value="Mental Health">Mental Health</SelectItem>
                  <SelectItem value="Physical Therapy">Physical Therapy</SelectItem>
                  <SelectItem value="Prescription">Prescription / Pharmacy</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!providerName && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Provider / Hospital Name
              </label>
              <Input
                value={providerName}
                onChange={e => setProviderName(e.target.value)}
                placeholder="Where you received care"
                className="rounded-xl"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bill Details (charges, codes, or anything you can share)
            </label>
            <Textarea
              value={billDescription}
              onChange={e => setBillDescription(e.target.value)}
              placeholder={"Paste your bill line items here, or describe what you were charged for.\n\nExample:\n- ER Facility Fee: $4,500\n- CT Scan: $3,200\n- Blood work: $850\n- IV fluids: $1,200"}
              className="rounded-xl min-h-[140px]"
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={() => setStep(2)} className="rounded-xl">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Button
          onClick={handleAnalyze}
          disabled={analyzing || (!billAmount && uploadedFiles.length === 0 && !billDescription)}
          className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-6 text-base shadow-lg"
        >
          {analyzing ? (
            <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> {analysisStage || "Analyzing..."}</>
          ) : (
            <><Brain className="h-5 w-5 mr-2" /> Analyze My Bill with AI</>
          )}
        </Button>
      </div>
    </motion.div>
  );

  const renderStep4 = () => {
    if (!analysisResult) return null;
    const savings = analysisResult.potentialSavings || 0;
    const issueCount = analysisResult.issues?.length || 0;
    const confidence = analysisResult.analysisConfidence || 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="text-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <CheckCircle className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analysis Complete</h2>
          <p className="text-gray-500 dark:text-gray-400">Here's what we found on your bill.</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                ${savings.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">Potential Savings</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-1" />
              <div className="text-2xl font-bold text-red-700 dark:text-red-400">{issueCount}</div>
              <div className="text-xs text-red-600 dark:text-red-400">Issues Found</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-blue-500 mx-auto mb-1" />
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{confidence}%</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Confidence</div>
            </CardContent>
          </Card>
        </div>

        {analysisResult.issues && analysisResult.issues.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Issues Detected
            </h3>
            {analysisResult.issues.map((issue, i) => (
              <motion.div
                key={issue.id || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`border-l-4 ${
                  issue.riskLevel === "high" ? "border-l-red-500" :
                  issue.riskLevel === "medium" ? "border-l-amber-500" :
                  "border-l-blue-500"
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{issue.title}</h4>
                      <Badge className={`text-xs ${
                        issue.riskLevel === "high" ? "bg-red-100 text-red-700" :
                        issue.riskLevel === "medium" ? "bg-amber-100 text-amber-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        ${issue.potentialSavings?.toLocaleString() || "0"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{issue.description}</p>
                    {issue.actionRequired && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">What to do:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{issue.actionRequired}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {analysisResult.negotiationStrategy && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Phone className="h-5 w-5 text-emerald-500" />
                Negotiation Strategy
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{analysisResult.negotiationStrategy.approach}</p>
              {analysisResult.negotiationStrategy.talkingPoints?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Key Talking Points:</p>
                  {analysisResult.negotiationStrategy.talkingPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Zap className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              )}
              {analysisResult.negotiationStrategy.targetReduction && (
                <div className="mt-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                    Target reduction: {analysisResult.negotiationStrategy.targetReduction}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {analysisResult.financialAssistance?.eligible && (
          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Heart className="h-5 w-5 text-purple-500" />
                Financial Assistance Available
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Estimated discount: {analysisResult.financialAssistance.estimatedDiscount}
              </p>
              {analysisResult.financialAssistance.programs?.map((prog, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  <span>{prog}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Recommendations
              </h3>
              <div className="space-y-2">
                {analysisResult.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="w-6 h-6 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {i + 1}
                    </span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => setStep(3)} className="rounded-xl">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Button
            onClick={() => setStep(5)}
            className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-5 shadow-lg"
          >
            Get My Action Plan <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    );
  };

  const renderStep5 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <Target className="h-7 w-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Action Plan</h2>
        <p className="text-gray-500 dark:text-gray-400">Here's exactly what to do next to reduce your bill.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          variant="outline"
          onClick={handleGenerateDisputeLetter}
          disabled={generatingDispute}
          className="py-6 rounded-xl border-2 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <div className="text-center">
            {generatingDispute ? (
              <Loader2 className="h-6 w-6 text-blue-500 mx-auto mb-2 animate-spin" />
            ) : (
              <Mail className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            )}
            <span className="text-sm font-medium">Generate Dispute Letter</span>
          </div>
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const script = analysisResult?.negotiationStrategy?.talkingPoints?.join("\n\n") || "";
            if (script) copyToClipboard(script);
            else toast({ title: "No talking points available" });
          }}
          className="py-6 rounded-xl border-2 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        >
          <div className="text-center">
            <Phone className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
            <span className="text-sm font-medium">Copy Phone Script</span>
          </div>
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const summary = `Bill Analysis Summary\n\nProvider: ${providerName}\nBill Amount: $${billAmount}\nPotential Savings: $${analysisResult?.potentialSavings?.toLocaleString() || "0"}\nIssues Found: ${analysisResult?.issues?.length || 0}\n\nIssues:\n${analysisResult?.issues?.map(i => `- ${i.title}: $${i.potentialSavings}`).join("\n") || "None"}\n\nRecommendations:\n${analysisResult?.recommendations?.map((r, i) => `${i + 1}. ${r}`).join("\n") || "None"}`;
            copyToClipboard(summary);
          }}
          className="py-6 rounded-xl border-2 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          <div className="text-center">
            <Download className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <span className="text-sm font-medium">Copy Full Summary</span>
          </div>
        </Button>
      </div>

      {disputeLetter && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Dispute Letter</h3>
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(disputeLetter)} className="rounded-lg">
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed max-h-80 overflow-y-auto">
            {disputeLetter}
          </div>
        </motion.div>
      )}

      {analysisResult?.insiderTactics && analysisResult.insiderTactics.length > 0 && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
          <CardContent className="p-5">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Insider Tactics
            </h3>
            <div className="space-y-2">
              {analysisResult.insiderTactics.map((tactic, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{tactic}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-md">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Ask Follow-Up Questions
          </h3>
          <div className="space-y-3">
            {actionChat.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Write me a phone script to call the billing department",
                  "What if they refuse to negotiate?",
                  "Should I set up a payment plan?",
                  "How do I file a formal appeal?"
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setChatInput(q); }}
                    className="text-left text-sm p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {actionChat.length > 0 && (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {actionChat.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}>
                      {msg.content.split("\n\n").map((para, j) => (
                        <p key={j} className={j > 0 ? "mt-3" : ""}>{para}</p>
                      ))}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask anything about your bill..."
                className="rounded-xl"
                onKeyDown={e => e.key === "Enter" && handleSendChat()}
              />
              <Button
                onClick={handleSendChat}
                disabled={chatLoading || !chatInput.trim()}
                className="rounded-xl bg-blue-600 hover:bg-blue-700"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={() => setStep(4)} className="rounded-xl">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Results
        </Button>
        <Button
          onClick={() => {
            setStep(1);
            setSituation(null);
            setAnalysisResult(null);
            setGeneratedLetter("");
            setDisputeLetter("");
            setActionChat([]);
            setBillAmount("");
            setBillDescription("");
            setUploadedFiles([]);
            toast({ title: "Ready to analyze another bill" });
          }}
          variant="outline"
          className="flex-1 rounded-xl"
        >
          Analyze Another Bill
        </Button>
      </div>
    </motion.div>
  );

  return (
    <MobileLayout title="Bill Advocate" showBackButton>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Bill Advocate</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI-powered medical bill reduction</p>
            </div>
            <Badge className="ml-auto bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Sparkles className="h-3 w-3 mr-1" /> Real AI
            </Badge>
          </div>

          <StepIndicator currentStep={step} totalSteps={5} />

          <AnimatePresence mode="wait">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </AnimatePresence>
        </div>
      </div>

      <HealthcareConsentModal
        open={showModal}
        onAccept={() => { giveConsent(); setStep(3); }}
        onClose={() => setShowModal(false)}
      />
    </MobileLayout>
  );
}
