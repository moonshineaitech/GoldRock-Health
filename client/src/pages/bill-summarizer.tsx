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
  "Office Visit": "bg-secondary text-secondary-foreground",
  "Lab Work": "bg-secondary text-secondary-foreground",
  "Imaging": "bg-secondary text-secondary-foreground",
  "Surgery": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "Medication": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "Supplies": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "Facility Fee": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "Professional Fee": "bg-secondary text-secondary-foreground",
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

      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/bill-ai")}
            className="mb-4 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bill AI
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-8"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ background: 'var(--gold-soft)' }}
            >
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">AI-Powered Analysis</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
              Bill Summarizer & Jargon Simplifier
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Paste your medical bill and we'll translate it into plain English. No more confusing codes or billing jargon.
            </p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 bg-muted">
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
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gold" />
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
                    <p className="text-sm text-muted-foreground">
                      {billText.length} characters
                      {billText.length < 20 && billText.length > 0 && (
                        <span className="text-amber-600 dark:text-amber-400 ml-2">(minimum 20 required)</span>
                      )}
                    </p>
                    <Button
                      onClick={handleAnalyze}
                      disabled={summarizeMutation.isPending || billText.length < 20}
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
                <Card className="luxury-card">
                  <CardContent className="pt-6">
                    <Lightbulb className="h-8 w-8 text-gold mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Plain English Summary</h3>
                    <p className="text-sm text-muted-foreground">
                      Get a simple explanation of what you're being charged for
                    </p>
                  </CardContent>
                </Card>
                <Card className="luxury-card">
                  <CardContent className="pt-6">
                    <BookOpen className="h-8 w-8 text-gold mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Jargon Decoded</h3>
                    <p className="text-sm text-muted-foreground">
                      Every medical term and code explained in simple terms
                    </p>
                  </CardContent>
                </Card>
                <Card className="luxury-card">
                  <CardContent className="pt-6">
                    <AlertTriangle className="h-8 w-8 text-gold mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Issue Detection</h3>
                    <p className="text-sm text-muted-foreground">
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
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-6"
                  >
                    <Card className="luxury-card overflow-hidden">
                      <div className="p-6 text-white" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-xl font-serif font-bold mb-2">Bill Summary</h2>
                            <p className="text-white/80">{result.summary}</p>
                          </div>
                          {result.totalAmount && (
                            <div className="text-right">
                              <p className="text-sm text-white/80">Total</p>
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
                      <Card className="luxury-card">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-gold" />
                            Charges Explained
                          </CardTitle>
                          <CardDescription>Each charge translated to plain English</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {result.lineItems.map((item, index) => (
                              <div
                                key={index}
                                className="p-4 rounded-lg bg-secondary"
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
                                    <p className="font-medium text-foreground">
                                      {item.description}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      <span className="text-gold">In plain English: </span>
                                      {item.simplifiedDescription}
                                    </p>
                                  </div>
                                  <div className="text-right ml-4">
                                    <p className="text-lg font-semibold text-foreground">
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
                        <Card className="luxury-card">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-gold" />
                              Jargon Decoded
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-[300px] pr-4">
                              <div className="space-y-4">
                                {result.jargonTerms.map((term, index) => (
                                  <div key={index} className="p-3 rounded-lg bg-secondary">
                                    <p className="font-semibold text-foreground">{term.term}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{term.definition}</p>
                                    <p className="text-xs text-muted-foreground mt-1 italic">{term.context}</p>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      )}

                      <div className="space-y-6">
                        {result.potentialIssues && result.potentialIssues.length > 0 && (
                          <Card className="luxury-card">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                <AlertTriangle className="h-5 w-5" />
                                Potential Issues Found
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {result.potentialIssues.map((issue, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                                    <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                                    <span>{issue}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}

                        {result.actionItems && result.actionItems.length > 0 && (
                          <Card className="luxury-card">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 className="h-5 w-5" />
                                Recommended Actions
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {result.actionItems.map((action, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{index + 1}.</span>
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
                      <Card className="luxury-card">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-gold" />
                            Key Insights
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-3">
                            {result.keyInsights.map((insight, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3 p-3 rounded-lg bg-secondary"
                              >
                                <Lightbulb className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-muted-foreground">{insight}</p>
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
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-gold" />
                    Medical Billing Jargon Dictionary
                  </CardTitle>
                  <CardDescription>
                    Common medical billing terms explained in plain English
                  </CardDescription>
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search terms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {filteredDictionary?.map((term, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-secondary"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">{term.term}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{term.definition}</p>
                              {term.examples && term.examples.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-medium text-muted-foreground">Examples:</p>
                                  <ul className="text-xs text-muted-foreground mt-1">
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
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-gold" />
                    Your Bill Analysis History
                  </CardTitle>
                  <CardDescription>
                    Previously analyzed bills and summaries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isAuthenticated ? (
                    <div className="text-center py-12">
                      <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Sign in to save and view your bill analysis history
                      </p>
                      <Button onClick={() => navigate("/auth")}>Sign In</Button>
                    </div>
                  ) : summaryHistory && summaryHistory.length > 0 ? (
                    <div className="space-y-4">
                      {summaryHistory.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-lg bg-secondary hover:bg-muted transition-colors cursor-pointer"
                          onClick={() => navigate(`/bill-summarizer/${item.id}`)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {item.providerName && (
                                  <span className="font-medium text-foreground">
                                    {item.providerName}
                                  </span>
                                )}
                                {item.serviceDate && (
                                  <Badge variant="outline">{item.serviceDate}</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.summary}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                Analyzed {new Date(item.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {item.totalAmount && (
                              <div className="text-right ml-4">
                                <p className="text-lg font-semibold text-foreground">
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
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
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
