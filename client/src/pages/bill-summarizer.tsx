import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  BookOpen,
  DollarSign,
  Clock,
  Building2,
  ChevronRight,
  Loader2,
  History,
  HelpCircle,
  ArrowLeft,
  Copy,
  Search
} from "lucide-react";
import { SEOHead } from "@/components/seo-head";

interface BillSummaryResult {
  id: string;
  summary: string;
  totalAmount: number | null;
  providerName: string | null;
  serviceDate: string | null;
  lineItems: Array<{
    description: string;
    code?: string;
    amount: number;
    simplifiedDescription: string;
    category: string;
  }>;
  jargonTerms: Array<{
    term: string;
    definition: string;
    context: string;
  }>;
  keyInsights: string[];
  potentialIssues: string[];
  actionItems: string[];
}

interface JargonTerm {
  term: string;
  definition: string;
  examples?: string[];
}

const categoryColors: Record<string, string> = {
  "Office Visit": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Lab Work": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "Imaging": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  "Surgery": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "Medication": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "Supplies": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "Facility Fee": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "Professional Fee": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  "Emergency": "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  "Other": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

export default function BillSummarizer() {
  const { isAuthenticated, hasAcceptedAiTerms } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [billText, setBillText] = useState("");
  const [result, setResult] = useState<BillSummaryResult | null>(null);
  const [activeTab, setActiveTab] = useState("input");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: jargonDictionary } = useQuery<JargonTerm[]>({
    queryKey: ["/api/jargon-dictionary"],
  });

  const { data: summaryHistory } = useQuery<Array<{
    id: string;
    summary: string;
    totalAmount: string | null;
    providerName: string | null;
    serviceDate: string | null;
    createdAt: string;
  }>>({
    queryKey: ["/api/bill-summaries"],
    enabled: isAuthenticated,
  });

  const summarizeMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/bill-summarizer", { billText: text });
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      setActiveTab("results");
      queryClient.invalidateQueries({ queryKey: ["/api/bill-summaries"] });
      toast({
        title: "Bill Analyzed",
        description: "Your bill has been summarized and simplified.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze bill. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    if (!hasAcceptedAiTerms) {
      navigate("/ai-usage-agreement");
      return;
    }
    if (billText.trim().length < 20) {
      toast({
        title: "More Text Needed",
        description: "Please paste at least 20 characters of your bill.",
        variant: "destructive",
      });
      return;
    }
    summarizeMutation.mutate(billText);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const filteredDictionary = jargonDictionary?.filter(
    (term) =>
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SEOHead
        title="Bill Summarizer & Jargon Simplifier | GoldRock Health"
        description="Paste your medical bill and get a plain-English summary. We translate complex medical codes, billing jargon, and charges into language anyone can understand."
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/bill-ai")}
            className="mb-4 text-slate-600 dark:text-slate-400"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bill AI
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 mb-4">
              <Sparkles className="h-4 w-4 text-cyan-500" />
              <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">AI-Powered Analysis</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Bill Summarizer & Jargon Simplifier
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Paste your medical bill and we'll translate it into plain English. No more confusing codes or billing jargon.
            </p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="input" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Input</span>
              </TabsTrigger>
              <TabsTrigger value="results" disabled={!result} className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Results</span>
              </TabsTrigger>
              <TabsTrigger value="dictionary" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Dictionary</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="input">
              <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-cyan-500" />
                    Paste Your Medical Bill
                  </CardTitle>
                  <CardDescription>
                    Copy and paste the text from your itemized medical bill, EOB, or hospital statement. Include codes and charges for the best analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder={`Example:
MERCY HOSPITAL - STATEMENT
Date of Service: 01/15/2024
Patient: John Doe

99284 - Emergency Room Visit Level 4    $1,250.00
36415 - Venipuncture                    $85.00
80053 - Comprehensive Metabolic Panel   $312.00
71046 - Chest X-Ray 2 Views            $475.00
96374 - IV Push                         $189.00

FACILITY FEE                            $2,100.00
TOTAL CHARGES                           $4,411.00`}
                    value={billText}
                    onChange={(e) => setBillText(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                      {billText.length} characters
                      {billText.length < 20 && billText.length > 0 && (
                        <span className="text-amber-500 ml-2">(minimum 20 required)</span>
                      )}
                    </p>
                    <Button
                      onClick={handleAnalyze}
                      disabled={summarizeMutation.isPending || billText.length < 20}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    >
                      {summarizeMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Analyze Bill
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-200 dark:border-cyan-800">
                  <CardContent className="pt-6">
                    <Lightbulb className="h-8 w-8 text-cyan-500 mb-3" />
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Plain English Summary</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Get a simple explanation of what you're being charged for
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-purple-200 dark:border-purple-800">
                  <CardContent className="pt-6">
                    <BookOpen className="h-8 w-8 text-purple-500 mb-3" />
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Jargon Decoded</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Every medical term and code explained in simple terms
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
                  <CardContent className="pt-6">
                    <AlertTriangle className="h-8 w-8 text-amber-500 mb-3" />
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Issue Detection</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Potential billing errors and overcharges flagged automatically
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="results">
              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <Card className="border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white">
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-xl font-bold mb-2">Bill Summary</h2>
                            <p className="text-cyan-100">{result.summary}</p>
                          </div>
                          {result.totalAmount && (
                            <div className="text-right">
                              <p className="text-sm text-cyan-100">Total</p>
                              <p className="text-3xl font-bold">${Number(result.totalAmount).toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 mt-4 text-sm">
                          {result.providerName && (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              <span>{result.providerName}</span>
                            </div>
                          )}
                          {result.serviceDate && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{result.serviceDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>

                    {result.lineItems && result.lineItems.length > 0 && (
                      <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-green-500" />
                            Charges Explained
                          </CardTitle>
                          <CardDescription>Each charge translated to plain English</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {result.lineItems.map((item, index) => (
                              <div
                                key={index}
                                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge className={categoryColors[item.category] || categoryColors["Other"]}>
                                        {item.category}
                                      </Badge>
                                      {item.code && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger>
                                              <Badge variant="outline" className="font-mono">
                                                {item.code}
                                              </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>CPT/HCPCS Code</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                    </div>
                                    <p className="font-medium text-slate-900 dark:text-white">
                                      {item.description}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                      <span className="text-cyan-600 dark:text-cyan-400">In plain English: </span>
                                      {item.simplifiedDescription}
                                    </p>
                                  </div>
                                  <div className="text-right ml-4">
                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                      ${Number(item.amount).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      {result.jargonTerms && result.jargonTerms.length > 0 && (
                        <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-purple-500" />
                              Jargon Decoded
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-[300px] pr-4">
                              <div className="space-y-4">
                                {result.jargonTerms.map((term, index) => (
                                  <div key={index} className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                                    <p className="font-semibold text-purple-800 dark:text-purple-300">{term.term}</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{term.definition}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">{term.context}</p>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      )}

                      <div className="space-y-6">
                        {result.potentialIssues && result.potentialIssues.length > 0 && (
                          <Card className="border-amber-200 dark:border-amber-800 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                                <AlertTriangle className="h-5 w-5" />
                                Potential Issues Found
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {result.potentialIssues.map((issue, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200">
                                    <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>{issue}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}

                        {result.actionItems && result.actionItems.length > 0 && (
                          <Card className="border-green-200 dark:border-green-800 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                                <CheckCircle2 className="h-5 w-5" />
                                Recommended Actions
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {result.actionItems.map((action, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm text-green-800 dark:text-green-200">
                                    <span className="font-bold">{index + 1}.</span>
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>

                    {result.keyInsights && result.keyInsights.length > 0 && (
                      <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-cyan-500" />
                            Key Insights
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-3">
                            {result.keyInsights.map((insight, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3 p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800"
                              >
                                <Lightbulb className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-slate-700 dark:text-slate-300">{insight}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex justify-center gap-4">
                      <Button variant="outline" onClick={() => setActiveTab("input")}>
                        Analyze Another Bill
                      </Button>
                      <Button
                        onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                        variant="secondary"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Analysis
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="dictionary">
              <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                    Medical Billing Jargon Dictionary
                  </CardTitle>
                  <CardDescription>
                    Common medical billing terms explained in plain English
                  </CardDescription>
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search terms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {filteredDictionary?.map((term, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-white">{term.term}</h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{term.definition}</p>
                              {term.examples && term.examples.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Examples:</p>
                                  <ul className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {term.examples.map((ex, i) => (
                                      <li key={i} className="font-mono">{ex}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => copyToClipboard(`${term.term}: ${term.definition}`)}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copy definition</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-blue-500" />
                    Your Bill Analysis History
                  </CardTitle>
                  <CardDescription>
                    Previously analyzed bills and summaries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isAuthenticated ? (
                    <div className="text-center py-12">
                      <HelpCircle className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Sign in to save and view your bill analysis history
                      </p>
                      <Button onClick={() => navigate("/auth")}>Sign In</Button>
                    </div>
                  ) : summaryHistory && summaryHistory.length > 0 ? (
                    <div className="space-y-4">
                      {summaryHistory.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-700 transition-colors cursor-pointer"
                          onClick={() => navigate(`/bill-summarizer/${item.id}`)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {item.providerName && (
                                  <span className="font-medium text-slate-900 dark:text-white">
                                    {item.providerName}
                                  </span>
                                )}
                                {item.serviceDate && (
                                  <Badge variant="outline">{item.serviceDate}</Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                {item.summary}
                              </p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                Analyzed {new Date(item.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {item.totalAmount && (
                              <div className="text-right ml-4">
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                  ${Number(item.totalAmount).toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">
                        No bill analyses yet. Paste a bill above to get started!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
