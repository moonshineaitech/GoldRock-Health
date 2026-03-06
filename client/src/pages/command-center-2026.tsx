import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield, Heart, Brain, FileText, Upload, Send, DollarSign,
  Sparkles, Lock, Activity, Pill, Beaker, BookOpen, FolderOpen,
  Scale, Phone, Clock, CheckCircle, AlertTriangle, ArrowRight,
  Camera, ChevronRight, Loader2, ShieldCheck, Crown, Zap,
  TrendingUp, X, Eye, Star, MessageCircle, FileEdit
} from "lucide-react";

type ActivePanel = "home" | "analyze" | "dispute" | "vault" | "wellness" | "chat";

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  panel: ActivePanel;
  gradient: string;
  description: string;
}

const quickActions: QuickAction[] = [
  { id: "analyze", label: "Analyze Bill", icon: Brain, panel: "analyze", gradient: "from-purple-500 to-indigo-600", description: "AI scans every line item" },
  { id: "dispute", label: "Dispute Tools", icon: Scale, panel: "dispute", gradient: "from-blue-500 to-cyan-600", description: "Letters, scripts & strategies" },
  { id: "vault", label: "Document Vault", icon: FolderOpen, panel: "vault", gradient: "from-emerald-500 to-teal-600", description: "Secure encrypted storage" },
  { id: "wellness", label: "Health Tools", icon: Activity, panel: "wellness", gradient: "from-rose-500 to-pink-600", description: "Labs, meds & vitals" },
  { id: "chat", label: "AI Advisor", icon: MessageCircle, panel: "chat", gradient: "from-amber-500 to-orange-600", description: "Ask anything about your bill" },
];

export default function CommandCenter2026() {
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activePanel, setActivePanel] = useState<ActivePanel>("home");
  const [billText, setBillText] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [disputeType, setDisputeType] = useState("");
  const [isGeneratingDispute, setIsGeneratingDispute] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { data: bills } = useQuery<any[]>({
    queryKey: ["/api/bill-tracker/bills"],
    enabled: !!user,
  });

  const { data: documents } = useQuery<any[]>({
    queryKey: ["/api/documents"],
    enabled: !!user,
  });

  const totalSavings = bills?.reduce((sum: number, bill: any) => sum + (bill.potentialSavings || 0), 0) || 0;
  const activeBills = bills?.filter((b: any) => b.status !== "resolved")?.length || 0;
  const resolvedBills = bills?.filter((b: any) => b.status === "resolved")?.length || 0;

  const analyzeBill = async () => {
    if (!billText.trim()) {
      toast({ title: "Enter bill details", description: "Paste or type your bill information to analyze.", variant: "destructive" });
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await apiRequest("POST", "/api/analyze-bill-ai", { billText });
      const data = await res.json();
      setAnalysisResult(data);
      toast({ title: "Analysis complete", description: "Your bill has been analyzed." });
    } catch (err: any) {
      toast({ title: "Analysis failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage;
    setChatMessage("");
    setChatHistory(prev => [...prev, { role: "user", content: userMsg }]);
    setIsChatting(true);
    try {
      const res = await apiRequest("POST", "/api/bill-ai-chat", { message: userMsg, history: chatHistory });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: "assistant", content: data.response || data.message || "I can help with that. Could you provide more details about your bill?" }]);
    } catch {
      setChatHistory(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting right now. Please try the Bill Advocate tool for guided help." }]);
    } finally {
      setIsChatting(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  const generateDispute = async () => {
    if (!disputeType) {
      toast({ title: "Select a dispute type", variant: "destructive" });
      return;
    }
    setIsGeneratingDispute(true);
    try {
      const disputePrompt = `Generate a professional ${disputeType.replace(/-/g, ' ')} dispute letter for a medical bill. ${
        analysisResult ? `Bill analysis found these issues: ${JSON.stringify(analysisResult.issues || [])}` : 
        billText ? `Bill details: ${billText.substring(0, 500)}` : 
        "General medical bill dispute."
      } Make the letter formal, reference relevant consumer protections, and include placeholders for [YOUR NAME], [ADDRESS], [ACCOUNT NUMBER], and [DATE].`;
      
      const res = await apiRequest("POST", "/api/bill-ai-chat", { message: disputePrompt });
      const data = await res.json();
      setGeneratedLetter(data.response || data.message || "");
      toast({ title: "Letter generated" });
    } catch {
      toast({ title: "Generation failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsGeneratingDispute(false);
    }
  };

  const firstName = user?.firstName || user?.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <div className="max-w-6xl mx-auto px-4 py-6 pb-28">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Hi, {firstName}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Your healthcare command center
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isSubscribed && (
                <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 text-xs">
                  <Crown className="h-3 w-3 mr-1" /> Premium
                </Badge>
              )}
              <button
                onClick={() => navigate("/settings")}
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              >
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                  {firstName.charAt(0).toUpperCase()}
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activePanel === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-3 gap-3 mb-6">
                <StatsCard
                  label="Active Bills"
                  value={activeBills}
                  icon={FileText}
                  color="text-blue-600"
                  bg="bg-blue-50 dark:bg-blue-950/50"
                />
                <StatsCard
                  label="Resolved"
                  value={resolvedBills}
                  icon={CheckCircle}
                  color="text-emerald-600"
                  bg="bg-emerald-50 dark:bg-emerald-950/50"
                />
                <StatsCard
                  label="Potential Savings"
                  value={`$${totalSavings.toLocaleString()}`}
                  icon={TrendingUp}
                  color="text-amber-600"
                  bg="bg-amber-50 dark:bg-amber-950/50"
                />
              </div>

              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                What do you need?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                {quickActions.map((action, i) => (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActivePanel(action.panel)}
                    className="group relative overflow-hidden rounded-2xl p-4 text-left bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                          {action.label}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {action.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors mt-1" />
                    </div>
                  </motion.button>
                ))}
              </div>

              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Quick Links
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
                {[
                  { label: "Bill Advocate", path: "/bill-advocate", icon: Shield, color: "text-emerald-600" },
                  { label: "Collections Help", path: "/collections-defense-guide", icon: AlertTriangle, color: "text-red-500" },
                  { label: "Know Your Rights", path: "/rights-hub", icon: Scale, color: "text-blue-600" },
                  { label: "Insurance Appeals", path: "/denial-appeals", icon: FileEdit, color: "text-purple-600" },
                  { label: "Price Comparison", path: "/price-comparison", icon: DollarSign, color: "text-amber-600" },
                  { label: "Savings Dashboard", path: "/savings", icon: TrendingUp, color: "text-teal-600" },
                  { label: "Bill Tracker", path: "/bill-tracker", icon: Eye, color: "text-indigo-600" },
                  { label: "Data Security", path: "/data-security", icon: Lock, color: "text-gray-600" },
                ].map((link, i) => (
                  <motion.button
                    key={link.path}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(link.path)}
                    className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                  >
                    <link.icon className={`h-4 w-4 ${link.color} flex-shrink-0`} />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{link.label}</span>
                  </motion.button>
                ))}
              </div>

              {bills && bills.length > 0 && (
                <>
                  <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Recent Bills
                  </h2>
                  <div className="space-y-2 mb-6">
                    {bills.slice(0, 3).map((bill: any, i: number) => (
                      <motion.div
                        key={bill.id || i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.08 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            bill.status === "resolved" ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-blue-100 dark:bg-blue-900/30"
                          }`}>
                            {bill.status === "resolved" ? (
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <FileText className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{bill.provider || bill.description || "Medical Bill"}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {bill.status === "resolved" ? "Resolved" : "In Progress"}
                              {bill.potentialSavings ? ` · $${bill.potentialSavings.toLocaleString()} potential savings` : ""}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          ${(bill.amount || bill.totalAmount || 0).toLocaleString()}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Your data is protected</h3>
                    <p className="text-xs text-emerald-100 mt-1">
                      AES-256 encryption, personal info stripped before AI processing, 30-day auto-deletion. You control your data.
                    </p>
                    <button
                      onClick={() => navigate("/data-security")}
                      className="text-xs font-semibold underline text-white mt-2 inline-block"
                    >
                      View Data Security Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activePanel === "analyze" && (
            <PanelWrapper title="Analyze a Bill" onBack={() => setActivePanel("home")}>
              <div className="space-y-4">
                <div className="rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <h3 className="font-bold text-sm text-purple-900 dark:text-purple-200">Paste your bill details</h3>
                  </div>
                  <p className="text-xs text-purple-700 dark:text-purple-300 mb-3">
                    Include line items, charges, codes, and amounts. Personal info is automatically stripped before AI processing.
                  </p>
                  <Textarea
                    placeholder="Paste bill text here... Include provider name, dates, procedure codes (CPT/HCPCS), descriptions, and charge amounts."
                    value={billText}
                    onChange={(e) => setBillText(e.target.value)}
                    className="min-h-[160px] rounded-xl bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700 text-sm"
                  />
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={analyzeBill}
                      disabled={isAnalyzing || !billText.trim()}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-xl"
                    >
                      {isAnalyzing ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
                      ) : (
                        <><Sparkles className="h-4 w-4 mr-2" /> Analyze with AI</>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/bill-advocate")}
                      className="rounded-xl"
                    >
                      <ArrowRight className="h-4 w-4 mr-1" /> Full Wizard
                    </Button>
                  </div>
                </div>

                {analysisResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" /> Analysis Results
                    </h3>

                    {analysisResult.issues && analysisResult.issues.length > 0 && (
                      <div className="space-y-2">
                        {analysisResult.issues.map((issue: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-red-800 dark:text-red-200">{issue.title || issue.type || "Issue Found"}</p>
                                <p className="text-xs text-red-600 dark:text-red-300 mt-0.5">{issue.description || issue.detail}</p>
                                {issue.savings && (
                                  <Badge className="mt-1 bg-red-100 text-red-700 text-xs">${issue.savings} potential savings</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {analysisResult.recommendations && (
                      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                        <h4 className="text-sm font-bold text-blue-800 dark:text-blue-200 mb-1">Recommendations</h4>
                        <ul className="space-y-1">
                          {(Array.isArray(analysisResult.recommendations) ? analysisResult.recommendations : [analysisResult.recommendations]).map((rec: any, idx: number) => (
                            <li key={idx} className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-1.5">
                              <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              <span>{typeof rec === "string" ? rec : rec.text || rec.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysisResult.summary && (
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{analysisResult.summary}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => { setActivePanel("dispute"); }}
                        className="flex-1 rounded-xl text-sm"
                      >
                        <FileEdit className="h-4 w-4 mr-1" /> Generate Dispute Letter
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/bill-ai")}
                        className="rounded-xl text-sm"
                      >
                        Advanced Tools
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </PanelWrapper>
          )}

          {activePanel === "dispute" && (
            <PanelWrapper title="Dispute Tools" onBack={() => setActivePanel("home")}>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select a dispute approach and generate a professional letter.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: "professional", label: "Professional & Direct", desc: "Clear billing errors", icon: FileText },
                    { id: "legal-heavy", label: "Legal-Referenced", desc: "Cites laws & regulations", icon: Scale },
                    { id: "compassionate", label: "Financial Hardship", desc: "Emphasizes financial situation", icon: Heart },
                    { id: "emergency-specific", label: "Emergency Care Rights", desc: "ER & surprise billing", icon: AlertTriangle },
                    { id: "insurance-appeal", label: "Insurance Appeal", desc: "Denial overturns", icon: Shield },
                    { id: "audit-challenge", label: "Coding Audit", desc: "CPT/HCPCS errors", icon: Eye },
                  ].map((type) => (
                    <motion.button
                      key={type.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDisputeType(type.id)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        disputeType === type.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-400 ring-1 ring-blue-500"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <type.icon className={`h-4 w-4 ${disputeType === type.id ? "text-blue-600" : "text-gray-400"}`} />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{type.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{type.desc}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <Button
                  onClick={generateDispute}
                  disabled={!disputeType || isGeneratingDispute}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-xl"
                >
                  {isGeneratingDispute ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                  ) : (
                    <><FileEdit className="h-4 w-4 mr-2" /> Generate Letter</>
                  )}
                </Button>

                {generatedLetter && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">Generated Letter</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { navigator.clipboard.writeText(generatedLetter); toast({ title: "Copied to clipboard" }); }}
                        className="text-xs"
                      >
                        Copy
                      </Button>
                    </div>
                    <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed max-h-64 overflow-y-auto">
                      {generatedLetter}
                    </pre>
                  </motion.div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigate("/dispute-arsenal")} className="flex-1 rounded-xl text-sm">
                    Full Template Library
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/collections-defense-guide")} className="flex-1 rounded-xl text-sm">
                    Collections Defense
                  </Button>
                </div>
              </div>
            </PanelWrapper>
          )}

          {activePanel === "vault" && (
            <PanelWrapper title="Document Vault" onBack={() => setActivePanel("home")}>
              <div className="space-y-4">
                <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">Encrypted Storage</h3>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    AES-256 encryption at rest. Your documents are never shared or used for AI training. Auto-deleted after 30 days unless you choose to keep them.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Bills", count: documents?.filter((d: any) => d.category === "bill").length || 0, icon: FileText, color: "blue" },
                    { label: "EOBs", count: documents?.filter((d: any) => d.category === "eob").length || 0, icon: BookOpen, color: "purple" },
                    { label: "Insurance", count: documents?.filter((d: any) => d.category === "insurance").length || 0, icon: Shield, color: "emerald" },
                    { label: "Receipts", count: documents?.filter((d: any) => d.category === "receipt").length || 0, icon: DollarSign, color: "amber" },
                  ].map((cat) => (
                    <div key={cat.label} className={`p-3 rounded-xl bg-${cat.color}-50 dark:bg-${cat.color}-950/30 border border-${cat.color}-200 dark:border-${cat.color}-800`}>
                      <div className="flex items-center gap-2">
                        <cat.icon className={`h-4 w-4 text-${cat.color}-600`} />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{cat.label}</span>
                      </div>
                      <p className={`text-2xl font-black text-${cat.color}-600 mt-1`}>{cat.count}</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => navigate("/document-vault")}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl"
                >
                  <FolderOpen className="h-4 w-4 mr-2" /> Open Full Vault
                </Button>
              </div>
            </PanelWrapper>
          )}

          {activePanel === "wellness" && (
            <PanelWrapper title="Health & Wellness Tools" onBack={() => setActivePanel("home")}>
              <div className="space-y-3">
                {[
                  { label: "Lab Analyzer", desc: "Understand blood work & lab results", icon: Beaker, path: "/lab-analyzer", gradient: "from-blue-500 to-indigo-600" },
                  { label: "Drug Information", desc: "Medication lookup & interactions", icon: Pill, path: "/drug-interactions", gradient: "from-rose-500 to-pink-600" },
                  { label: "Symptom Library", desc: "Educational symptom reference", icon: BookOpen, path: "/symptom-checker", gradient: "from-purple-500 to-violet-600" },
                  { label: "Health Journal", desc: "Track blood pressure, weight & vitals", icon: Activity, path: "/health-metrics", gradient: "from-emerald-500 to-teal-600" },
                  { label: "Drug Prices", desc: "Compare medication costs", icon: DollarSign, path: "/drug-prices", gradient: "from-amber-500 to-orange-600" },
                  { label: "Medical Conditions", desc: "Condition reference library", icon: Heart, path: "/conditions", gradient: "from-red-500 to-rose-600" },
                ].map((tool, i) => (
                  <motion.button
                    key={tool.path}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(tool.path)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-left"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <tool.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">{tool.label}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{tool.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                  </motion.button>
                ))}
              </div>
            </PanelWrapper>
          )}

          {activePanel === "chat" && (
            <PanelWrapper title="AI Bill Advisor" onBack={() => setActivePanel("home")}>
              <div className="space-y-3">
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Ask questions about your medical bills, insurance coverage, billing codes, or negotiation strategies. Your personal information is never shared with AI providers.
                  </p>
                </div>

                <div className="rounded-xl bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-3 min-h-[280px] max-h-[400px] overflow-y-auto">
                  {chatHistory.length === 0 && (
                    <div className="text-center py-8">
                      <MessageCircle className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ask me anything about your medical bills</p>
                      <div className="flex flex-wrap gap-2 justify-center mt-4">
                        {["What's upcoding?", "How to request itemized bill?", "Can I negotiate ER bills?", "What's the No Surprises Act?"].map((q) => (
                          <button
                            key={q}
                            onClick={() => { setChatMessage(q); }}
                            className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                          msg.role === "user"
                            ? "bg-blue-500 text-white rounded-br-md"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isChatting && (
                    <div className="flex justify-start mb-3">
                      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-md">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about your bill..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendChatMessage()}
                    className="flex-1 rounded-xl"
                  />
                  <Button
                    onClick={sendChatMessage}
                    disabled={isChatting || !chatMessage.trim()}
                    className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </PanelWrapper>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PanelWrapper({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4 transition-colors"
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
        <span>Back</span>
      </button>
      <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">{title}</h2>
      {children}
    </motion.div>
  );
}

function StatsCard({ label, value, icon: Icon, color, bg }: { label: string; value: string | number; icon: any; color: string; bg: string }) {
  return (
    <div className={`p-3 rounded-xl ${bg} border border-gray-100 dark:border-gray-700/50`}>
      <Icon className={`h-4 w-4 ${color} mb-1`} />
      <p className="text-lg font-black text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
