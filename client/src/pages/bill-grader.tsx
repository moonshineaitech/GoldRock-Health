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
  Loader2
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
            className="text-white/10"
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
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-white">
          {score}
        </span>
      </div>
      <div className="text-xs text-gray-400">{label}</div>
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
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
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
        keywords="medical bill grader, hospital bill score, bill analysis, medical billing errors, healthcare costs"
        canonicalUrl="https://goldrockhealth.com/bill-grader"
      />

      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#0a1628]">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gauge className="h-10 w-10 text-cyan-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Medical Bill <span className="text-cyan-400">Grader</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get your medical bill scored from 0-100. We analyze billing accuracy, price fairness, 
              and identify potential savings opportunities.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-cyan-400" />
                  Enter Bill Details
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Provide information about your medical bill to get a grade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billAmount" className="text-gray-300">Bill Amount *</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="billAmount"
                          data-testid="input-bill-amount"
                          type="number"
                          placeholder="10,000"
                          value={formData.billAmount}
                          onChange={(e) => setFormData({ ...formData, billAmount: e.target.value })}
                          className="pl-9 bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-gray-300">State</Label>
                      <Input
                        id="state"
                        data-testid="input-state"
                        placeholder="CA, TX, NY..."
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="mt-1 bg-white/5 border-white/10 text-white"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="procedureType" className="text-gray-300">Procedure Type *</Label>
                    <Input
                      id="procedureType"
                      data-testid="input-procedure-type"
                      placeholder="e.g., Appendectomy, MRI, Emergency Room Visit"
                      value={formData.procedureType}
                      onChange={(e) => setFormData({ ...formData, procedureType: e.target.value })}
                      className="mt-1 bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Hospital Type</Label>
                      <Select
                        value={formData.hospitalType}
                        onValueChange={(value) => setFormData({ ...formData, hospitalType: value })}
                      >
                        <SelectTrigger data-testid="select-hospital-type" className="mt-1 bg-white/5 border-white/10 text-white">
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
                      <Label className="text-gray-300">Insurance Type</Label>
                      <Select
                        value={formData.insuranceType}
                        onValueChange={(value) => setFormData({ ...formData, insuranceType: value })}
                      >
                        <SelectTrigger data-testid="select-insurance-type" className="mt-1 bg-white/5 border-white/10 text-white">
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
                    <Label htmlFor="itemizedCharges" className="text-gray-300">
                      Itemized Charges (Optional)
                    </Label>
                    <Textarea
                      id="itemizedCharges"
                      data-testid="textarea-itemized-charges"
                      placeholder="Enter each charge on a new line:&#10;Room and Board - $2,500&#10;Surgical Supplies - $1,200&#10;Anesthesia - $800"
                      value={formData.itemizedCharges}
                      onChange={(e) => setFormData({ ...formData, itemizedCharges: e.target.value })}
                      className="mt-1 bg-white/5 border-white/10 text-white min-h-[100px]"
                    />
                  </div>

                  <Button 
                    type="submit"
                    data-testid="button-grade-bill"
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                    disabled={gradeMutation.isPending}
                  >
                    {gradeMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2" />
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-sm text-gray-400">Overall Score</div>
                        <div className={`text-5xl font-bold ${getScoreColor(result.overallScore)}`}>
                          {result.overallScore}
                          <span className="text-2xl text-gray-400">/100</span>
                        </div>
                        <Badge className={`mt-2 ${
                          result.overallScore >= 80 ? 'bg-green-500/20 text-green-400' :
                          result.overallScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {getScoreLabel(result.overallScore)} Bill
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-white/20 text-white"
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
                          className="border-white/20 text-white"
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
                      <ScoreGauge score={result.billingAccuracy} label="Accuracy" color="text-blue-400" />
                      <ScoreGauge score={result.priceFairness} label="Fairness" color="text-green-400" />
                      <ScoreGauge score={result.documentationQuality} label="Docs" color="text-purple-400" />
                      <ScoreGauge score={result.negotiationLeverage} label="Leverage" color="text-amber-400" />
                      <ScoreGauge score={result.complianceScore} label="Compliance" color="text-cyan-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-500/10 border-green-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-green-400" />
                      Potential Savings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {formatCurrency(result.potentialSavings.lowEstimate)} - {formatCurrency(result.potentialSavings.highEstimate)}
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      Based on common reduction strategies for your bill type
                    </p>
                    <div className="space-y-2">
                      {result.potentialSavings.methods.slice(0, 3).map((method, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          {method}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {(result.issuesFound.critical.length > 0 || result.issuesFound.major.length > 0) && (
                  <Card className="bg-red-500/10 border-red-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        Issues Found
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.issuesFound.critical.map((issue, i) => (
                        <div key={`c-${i}`} className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-400 mt-0.5" />
                          <span className="text-gray-300 text-sm">{issue}</span>
                        </div>
                      ))}
                      {result.issuesFound.major.map((issue, i) => (
                        <div key={`m-${i}`} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5" />
                          <span className="text-gray-300 text-sm">{issue}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-400" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <ArrowRight className="h-4 w-4 text-cyan-400 mt-0.5" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-8 text-center">
                    <Gauge className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl text-white mb-2">No Bill Graded Yet</h3>
                    <p className="text-gray-400 mb-4">
                      Enter your bill details to receive a comprehensive grade and savings analysis.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white/5 rounded-lg p-4">
                        <Shield className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
                        <div className="text-white font-medium">Billing Accuracy</div>
                        <div className="text-gray-400">Check for coding errors</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <DollarSign className="h-6 w-6 text-green-400 mx-auto mb-2" />
                        <div className="text-white font-medium">Price Fairness</div>
                        <div className="text-gray-400">Compare to averages</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <FileText className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                        <div className="text-white font-medium">Documentation</div>
                        <div className="text-gray-400">Itemization quality</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <TrendingDown className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                        <div className="text-white font-medium">Savings Potential</div>
                        <div className="text-gray-400">Negotiation leverage</div>
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
