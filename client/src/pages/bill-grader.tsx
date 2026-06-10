import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  FileText, 
  DollarSign, 
  Shield, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Gauge,
  ArrowRight,
  Download,
  Share2,
  Lightbulb,
  Loader2,
  BarChart2,
  Calculator,
  Building2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { SEOHead } from "@/components/seo-head";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  downloadSavingsReport, 
  getSavingsReportFile, 
  isNativePlatform, 
  nativeSaveAndSharePDF, 
  nativeDownloadPDF,
  type SavingsReportData 
} from "@/lib/pdf-service";
import { shareService } from "@/lib/share-service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GradeResult {
  overallScore: number;
  billingAccuracy: number;
  priceFairness: number;
  documentationQuality: number;
  negotiationLeverage: number;
  complianceScore: number;
  issuesFound: {
    critical: string[];
    major: string[];
    minor: string[];
  };
  potentialSavings: {
    lowEstimate: number;
    highEstimate: number;
    methods: string[];
  };
  recommendations: string[];
  comparisonData: {
    averageForProcedure: number;
    percentile: number;
    region: string;
  };
}

function ScoreGauge({ score, label, color }: { score: number; label: string; color: string }) {
  return (
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-2">
        <svg className="w-20 h-20 -rotate-90">
          <circle
            className="text-black/10 dark:text-white/10"
            strokeWidth="6"
            stroke="currentColor"
            fill="transparent"
            r="32"
            cx="40"
            cy="40"
          />
          <circle
            className={color}
            strokeWidth="6"
            strokeDasharray={`${score * 2.01} 201`}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="32"
            cx="40"
            cy="40"
          />
        </svg>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-foreground">
          {score}
        </span>
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export default function BillGrader() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    billAmount: "",
    procedureType: "",
    hospitalType: "",
    insuranceType: "",
    state: "",
    itemizedCharges: ""
  });
  const [result, setResult] = useState<GradeResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const prepareReportData = (): SavingsReportData | null => {
    if (!result) return null;
    
    return {
      billAmount: parseFloat(formData.billAmount) || 0,
      procedureType: formData.procedureType,
      hospitalType: formData.hospitalType,
      insuranceType: formData.insuranceType,
      state: formData.state,
      overallScore: result.overallScore,
      scores: {
        billingAccuracy: result.billingAccuracy,
        priceFairness: result.priceFairness,
        documentationQuality: result.documentationQuality,
        negotiationLeverage: result.negotiationLeverage,
        complianceScore: result.complianceScore
      },
      savings: {
        lowEstimate: result.potentialSavings.lowEstimate,
        highEstimate: result.potentialSavings.highEstimate,
        methods: result.potentialSavings.methods
      },
      issues: result.issuesFound,
      recommendations: result.recommendations,
      generatedAt: new Date()
    };
  };

  const handleDownloadReport = async () => {
    const reportData = prepareReportData();
    if (!reportData) {
      toast({
        title: "No Report",
        description: "Please grade a bill first before downloading.",
        variant: "destructive"
      });
      return;
    }

    setIsDownloading(true);
    try {
      if (isNativePlatform()) {
        const result = await nativeDownloadPDF(reportData);
        if (result.success) {
          toast({
            title: "Report Saved",
            description: "Your savings report PDF has been saved to Documents."
          });
        } else {
          throw new Error('Native download failed');
        }
      } else {
        await downloadSavingsReport(reportData);
        toast({
          title: "Report Downloaded",
          description: "Your savings report PDF has been downloaded."
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareReport = async () => {
    const reportData = prepareReportData();
    if (!reportData) {
      toast({
        title: "No Report",
        description: "Please grade a bill first before sharing.",
        variant: "destructive"
      });
      return;
    }

    setIsSharing(true);
    try {
      if (isNativePlatform()) {
        // Native: Save PDF to cache and share via native share sheet
        const result = await nativeSaveAndSharePDF(reportData);
        if (result.success) {
          toast({
            title: "Report Shared",
            description: "Your savings report PDF has been shared."
          });
        } else {
          throw new Error('Native share failed');
        }
      } else {
        // Web: Try Web Share API with file attachment
        const canShareFiles = shareService.canShareFiles();
        
        if (canShareFiles) {
          const file = await getSavingsReportFile(reportData);
          const shared = await shareService.share({
            title: `Bill Savings Report - ${formData.procedureType || 'Medical Bill'}`,
            text: `I found ${formatCurrency(result!.potentialSavings.lowEstimate)} - ${formatCurrency(result!.potentialSavings.highEstimate)} in potential savings on my medical bill!`,
            files: [file]
          });
          
          if (shared) {
            toast({
              title: "Report Shared",
              description: "Your savings report PDF has been shared."
            });
          }
        } else {
          // Fallback: Download PDF
          await downloadSavingsReport(reportData);
          toast({
            title: "Report Downloaded",
            description: "Your savings report PDF has been downloaded."
          });
        }
      }
    } catch (error) {
      console.error('Share error:', error);
      try {
        // Fallback to download
        if (isNativePlatform()) {
          const downloadResult = await nativeDownloadPDF(reportData);
          if (downloadResult.success) {
            toast({
              title: "Report Saved",
              description: "PDF saved to Documents. Sharing unavailable."
            });
          } else {
            throw new Error('Native download failed');
          }
        } else {
          await downloadSavingsReport(reportData);
          toast({
            title: "Report Downloaded",
            description: "PDF downloaded. Sharing unavailable on this device."
          });
        }
      } catch {
        toast({
          title: "Share Failed",
          description: "Failed to generate report. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSharing(false);
    }
  };

  const gradeMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('/api/bill-grader', {
        method: 'POST',
        body: JSON.stringify({
          billAmount: parseFloat(data.billAmount),
          procedureType: data.procedureType,
          hospitalType: data.hospitalType,
          insuranceType: data.insuranceType,
          state: data.state,
          itemizedCharges: data.itemizedCharges ? data.itemizedCharges.split('\n').filter(Boolean) : []
        })
      });
      return response as GradeResult;
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Bill Graded!",
        description: `Your bill received a score of ${data.overallScore}/100`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to grade bill. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.billAmount || !formData.procedureType) {
      toast({
        title: "Missing Information",
        description: "Please enter at least the bill amount and procedure type.",
        variant: "destructive"
      });
      return;
    }
    gradeMutation.mutate(formData);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-700 dark:text-emerald-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Good";
    if (score >= 60) return "Fair";
    return "Poor";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      <SEOHead
        title="Medical Bill Grader - Score Your Hospital Bill | GoldRock Health"
        description="Grade your medical bill from 0-100. Our AI analyzes billing accuracy, price fairness, and identifies potential savings. Free bill scoring tool."
        keywords={["medical bill grader", "hospital bill score", "bill analysis", "medical billing errors", "healthcare costs"]}
        canonicalPath="/bill-grader"
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gauge className="h-10 w-10 text-gold" />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Bill Intelligence</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Medical Bill <span className="text-gold">Grader</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get your medical bill scored from 0-100. We analyze billing accuracy, price fairness, 
              and identify potential savings opportunities.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="luxury-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gold" />
                  Enter Bill Details
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Provide information about your medical bill to get a grade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billAmount" className="text-foreground">Bill Amount *</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="billAmount"
                          data-testid="input-bill-amount"
                          type="number"
                          placeholder="10,000"
                          value={formData.billAmount}
                          onChange={(e) => setFormData({ ...formData, billAmount: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-foreground">State</Label>
                      <Input
                        id="state"
                        data-testid="input-state"
                        placeholder="CA, TX, NY..."
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="mt-1"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="procedureType" className="text-foreground">Procedure Type *</Label>
                    <Input
                      id="procedureType"
                      data-testid="input-procedure-type"
                      placeholder="e.g., Appendectomy, MRI, Emergency Room Visit"
                      value={formData.procedureType}
                      onChange={(e) => setFormData({ ...formData, procedureType: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-foreground">Hospital Type</Label>
                      <Select
                        value={formData.hospitalType}
                        onValueChange={(value) => setFormData({ ...formData, hospitalType: value })}
                      >
                        <SelectTrigger data-testid="select-hospital-type" className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="non-profit">Non-Profit</SelectItem>
                          <SelectItem value="for-profit">For-Profit</SelectItem>
                          <SelectItem value="public">Public/Government</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-foreground">Insurance Type</Label>
                      <Select
                        value={formData.insuranceType}
                        onValueChange={(value) => setFormData({ ...formData, insuranceType: value })}
                      >
                        <SelectTrigger data-testid="select-insurance-type" className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ppo">PPO</SelectItem>
                          <SelectItem value="hmo">HMO</SelectItem>
                          <SelectItem value="medicare">Medicare</SelectItem>
                          <SelectItem value="medicaid">Medicaid</SelectItem>
                          <SelectItem value="uninsured">Uninsured</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="itemizedCharges" className="text-foreground">
                      Itemized Charges (Optional)
                    </Label>
                    <Textarea
                      id="itemizedCharges"
                      data-testid="textarea-itemized-charges"
                      placeholder="Enter each charge on a new line:&#10;Room and Board - $2,500&#10;Surgical Supplies - $1,200&#10;Anesthesia - $800"
                      value={formData.itemizedCharges}
                      onChange={(e) => setFormData({ ...formData, itemizedCharges: e.target.value })}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  <Button 
                    type="submit"
                    data-testid="button-grade-bill"
                    className="w-full"
                    disabled={gradeMutation.isPending}
                  >
                    {gradeMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Gauge className="mr-2 h-4 w-4" /> Grade My Bill
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <Card className="luxury-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-sm text-muted-foreground">Overall Score</div>
                        <div className={`text-5xl font-bold ${getScoreColor(result.overallScore)}`}>
                          {result.overallScore}
                          <span className="text-2xl text-muted-foreground">/100</span>
                        </div>
                        <Badge className={`mt-2 ${
                          result.overallScore >= 80 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' :
                          result.overallScore >= 60 ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400' :
                          'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                        }`}>
                          {getScoreLabel(result.overallScore)} Bill
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleDownloadReport}
                          disabled={isDownloading}
                          data-testid="button-download-report"
                        >
                          {isDownloading ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-1" />
                          )}
                          Save PDF
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleShareReport}
                          disabled={isSharing}
                          data-testid="button-share-report"
                        >
                          {isSharing ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Share2 className="h-4 w-4 mr-1" />
                          )}
                          Share
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      <ScoreGauge score={result.billingAccuracy} label="Accuracy" color="text-gold" />
                      <ScoreGauge score={result.priceFairness} label="Fairness" color="text-gold" />
                      <ScoreGauge score={result.documentationQuality} label="Docs" color="text-gold" />
                      <ScoreGauge score={result.negotiationLeverage} label="Leverage" color="text-gold" />
                      <ScoreGauge score={result.complianceScore} label="Compliance" color="text-gold" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="luxury-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      Potential Savings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                      {formatCurrency(result.potentialSavings.lowEstimate)} - {formatCurrency(result.potentialSavings.highEstimate)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Based on common reduction strategies for your bill type
                    </p>
                    <div className="space-y-2">
                      {result.potentialSavings.methods.slice(0, 3).map((method, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          {method}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {(result.issuesFound.critical.length > 0 || result.issuesFound.major.length > 0) && (
                  <Card className="luxury-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Issues Found
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.issuesFound.critical.map((issue, i) => (
                        <div key={`c-${i}`} className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-destructive mt-0.5" />
                          <span className="text-foreground text-sm">{issue}</span>
                        </div>
                      ))}
                      {result.issuesFound.major.map((issue, i) => (
                        <div key={`m-${i}`} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                          <span className="text-foreground text-sm">{issue}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <Card className="luxury-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-gold" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <ArrowRight className="h-4 w-4 text-gold mt-0.5" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {result.comparisonData && (
                  <Card className="luxury-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <BarChart2 className="h-5 w-5 text-gold" />
                        Regional Benchmark Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-secondary rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-foreground">
                            {formatCurrency(result.comparisonData.averageForProcedure)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Regional Average</div>
                        </div>
                        <div className="bg-secondary rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-foreground">
                            {result.comparisonData.percentile}th
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Percentile</div>
                        </div>
                        <div className="bg-secondary rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-gold">
                            {formData.state || 'N/A'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Region</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                          <span>Your Bill vs Regional Average</span>
                          <span>{((parseFloat(formData.billAmount) / result.comparisonData.averageForProcedure) * 100 - 100).toFixed(0)}% {parseFloat(formData.billAmount) > result.comparisonData.averageForProcedure ? 'Above' : 'Below'}</span>
                        </div>
                        <div className="relative h-4 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${parseFloat(formData.billAmount) > result.comparisonData.averageForProcedure ? 'bg-destructive' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, (parseFloat(formData.billAmount) / (result.comparisonData.averageForProcedure * 2)) * 100)}%` }}
                          />
                          <div 
                            className="absolute top-0 bottom-0 w-0.5 bg-foreground"
                            style={{ left: '50%' }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>$0</span>
                          <span>Avg: {formatCurrency(result.comparisonData.averageForProcedure)}</span>
                          <span>{formatCurrency(result.comparisonData.averageForProcedure * 2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="luxury-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-gold" />
                      Savings Methodology
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Our savings estimate is calculated using multiple factors based on your specific bill characteristics:
                    </p>
                    <div className="space-y-3">
                      <div className="bg-secondary rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-foreground">Billing Error Corrections</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">15-30%</span>
                        </div>
                        <Progress value={result.billingAccuracy < 70 ? 80 : 40} className="h-2" />
                      </div>
                      <div className="bg-secondary rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-foreground">Price Negotiation</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">20-40%</span>
                        </div>
                        <Progress value={result.priceFairness < 60 ? 90 : 50} className="h-2" />
                      </div>
                      <div className="bg-secondary rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-foreground">Financial Assistance</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">50-100%</span>
                        </div>
                        <Progress value={formData.hospitalType === 'non-profit' ? 85 : 35} className="h-2" />
                      </div>
                      <div className="bg-secondary rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-foreground">Prompt Pay Discounts</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">10-20%</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="luxury-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-gold" />
                      Industry Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-secondary rounded-lg">
                        <div className="text-3xl font-bold text-gold">80%</div>
                        <div className="text-xs text-muted-foreground mt-1">of hospital bills contain errors</div>
                      </div>
                      <div className="text-center p-4 bg-secondary rounded-lg">
                        <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">$400</div>
                        <div className="text-xs text-muted-foreground mt-1">avg saved per disputed bill</div>
                      </div>
                      <div className="text-center p-4 bg-secondary rounded-lg">
                        <div className="text-3xl font-bold text-gold">90%</div>
                        <div className="text-xs text-muted-foreground mt-1">success rate for charity care</div>
                      </div>
                      <div className="text-center p-4 bg-secondary rounded-lg">
                        <div className="text-3xl font-bold text-foreground">30 days</div>
                        <div className="text-xs text-muted-foreground mt-1">avg time to resolve disputes</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <Card className="luxury-card">
                  <CardContent className="p-8 text-center">
                    <Gauge className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-serif text-foreground mb-2">No Bill Graded Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Enter your bill details to receive a comprehensive grade and savings analysis.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-secondary rounded-lg p-4">
                        <Shield className="h-6 w-6 text-gold mx-auto mb-2" />
                        <div className="text-foreground font-medium">Billing Accuracy</div>
                        <div className="text-muted-foreground">Check for coding errors</div>
                      </div>
                      <div className="bg-secondary rounded-lg p-4">
                        <DollarSign className="h-6 w-6 text-gold mx-auto mb-2" />
                        <div className="text-foreground font-medium">Price Fairness</div>
                        <div className="text-muted-foreground">Compare to averages</div>
                      </div>
                      <div className="bg-secondary rounded-lg p-4">
                        <FileText className="h-6 w-6 text-gold mx-auto mb-2" />
                        <div className="text-foreground font-medium">Documentation</div>
                        <div className="text-muted-foreground">Itemization quality</div>
                      </div>
                      <div className="bg-secondary rounded-lg p-4">
                        <TrendingDown className="h-6 w-6 text-gold mx-auto mb-2" />
                        <div className="text-foreground font-medium">Savings Potential</div>
                        <div className="text-muted-foreground">Negotiation leverage</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
