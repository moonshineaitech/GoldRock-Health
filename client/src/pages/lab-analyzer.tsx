import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearch } from "wouter";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Beaker, FlaskConical, Droplet, Activity, Heart, ArrowLeft, AlertTriangle,
  CheckCircle, XCircle, Info, TrendingUp, TrendingDown, Minus, Sparkles,
  FileText, Upload, Loader2, ChevronDown, ChevronUp, Brain
} from "lucide-react";

interface LabValue {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'normal' | 'low' | 'high' | 'critical';
}

interface LabAnalysisResult {
  summary: string;
  overallHealth: 'good' | 'concerning' | 'requires-attention';
  values: LabValue[];
  insights: string[];
  recommendations: string[];
  followUp: string[];
}

const COMMON_PANELS = {
  cbc: {
    name: "Complete Blood Count (CBC)",
    icon: Droplet,
    color: "text-red-600",
    tests: [
      { name: "WBC", label: "White Blood Cells", unit: "K/uL", normalRange: "4.5-11.0" },
      { name: "RBC", label: "Red Blood Cells", unit: "M/uL", normalRange: "4.5-5.5" },
      { name: "Hemoglobin", label: "Hemoglobin", unit: "g/dL", normalRange: "12.0-17.5" },
      { name: "Hematocrit", label: "Hematocrit", unit: "%", normalRange: "36-50" },
      { name: "Platelets", label: "Platelets", unit: "K/uL", normalRange: "150-400" },
      { name: "MCV", label: "Mean Corpuscular Volume", unit: "fL", normalRange: "80-100" },
    ]
  },
  metabolic: {
    name: "Comprehensive Metabolic Panel (CMP)",
    icon: Activity,
    color: "text-emerald-600",
    tests: [
      { name: "Glucose", label: "Glucose (Fasting)", unit: "mg/dL", normalRange: "70-100" },
      { name: "BUN", label: "Blood Urea Nitrogen", unit: "mg/dL", normalRange: "7-20" },
      { name: "Creatinine", label: "Creatinine", unit: "mg/dL", normalRange: "0.7-1.3" },
      { name: "Sodium", label: "Sodium", unit: "mEq/L", normalRange: "136-145" },
      { name: "Potassium", label: "Potassium", unit: "mEq/L", normalRange: "3.5-5.0" },
      { name: "Chloride", label: "Chloride", unit: "mEq/L", normalRange: "98-106" },
      { name: "CO2", label: "Carbon Dioxide", unit: "mEq/L", normalRange: "23-29" },
      { name: "Calcium", label: "Calcium", unit: "mg/dL", normalRange: "8.5-10.5" },
      { name: "Protein", label: "Total Protein", unit: "g/dL", normalRange: "6.0-8.3" },
      { name: "Albumin", label: "Albumin", unit: "g/dL", normalRange: "3.5-5.0" },
      { name: "Bilirubin", label: "Total Bilirubin", unit: "mg/dL", normalRange: "0.1-1.2" },
      { name: "ALP", label: "Alkaline Phosphatase", unit: "U/L", normalRange: "44-147" },
      { name: "AST", label: "AST (SGOT)", unit: "U/L", normalRange: "10-40" },
      { name: "ALT", label: "ALT (SGPT)", unit: "U/L", normalRange: "7-56" },
    ]
  },
  lipid: {
    name: "Lipid Panel",
    icon: Heart,
    color: "text-orange-600",
    tests: [
      { name: "TotalCholesterol", label: "Total Cholesterol", unit: "mg/dL", normalRange: "<200" },
      { name: "HDL", label: "HDL (Good Cholesterol)", unit: "mg/dL", normalRange: ">40" },
      { name: "LDL", label: "LDL (Bad Cholesterol)", unit: "mg/dL", normalRange: "<100" },
      { name: "Triglycerides", label: "Triglycerides", unit: "mg/dL", normalRange: "<150" },
      { name: "VLDL", label: "VLDL", unit: "mg/dL", normalRange: "5-40" },
    ]
  },
  thyroid: {
    name: "Thyroid Panel",
    icon: Brain,
    color: "text-purple-600",
    tests: [
      { name: "TSH", label: "Thyroid Stimulating Hormone", unit: "mIU/L", normalRange: "0.4-4.0" },
      { name: "T4", label: "Free T4 (Thyroxine)", unit: "ng/dL", normalRange: "0.8-1.8" },
      { name: "T3", label: "Free T3", unit: "pg/mL", normalRange: "2.3-4.2" },
    ]
  }
};

export default function LabAnalyzer() {
  const { toast } = useToast();
  const searchParams = useSearch();
  const urlParams = new URLSearchParams(searchParams);
  const initialPanel = urlParams.get('panel') || 'manual';
  
  const [activeTab, setActiveTab] = useState(initialPanel);
  const [manualInput, setManualInput] = useState("");
  const [panelValues, setPanelValues] = useState<Record<string, string>>({});
  const [analysisResult, setAnalysisResult] = useState<LabAnalysisResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    values: true,
    insights: true,
    recommendations: true
  });

  const analyzeLabsMutation = useMutation({
    mutationFn: async (data: { type: string; values: Record<string, string> | string }) => {
      const response = await apiRequest("POST", "/api/analyze-labs", data);
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast({
        title: "Analysis Complete",
        description: "Your lab results have been analyzed by AI",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Unable to analyze lab results",
        variant: "destructive",
      });
    }
  });

  const handleManualAnalysis = () => {
    if (!manualInput.trim()) {
      toast({
        title: "Enter Lab Values",
        description: "Please enter your lab results to analyze",
        variant: "destructive",
      });
      return;
    }
    analyzeLabsMutation.mutate({ type: 'manual', values: manualInput });
  };

  const handlePanelAnalysis = (panelType: string) => {
    const panel = COMMON_PANELS[panelType as keyof typeof COMMON_PANELS];
    if (!panel) return;

    const filledValues = panel.tests.reduce((acc, test) => {
      if (panelValues[test.name]) {
        acc[test.name] = panelValues[test.name];
      }
      return acc;
    }, {} as Record<string, string>);

    if (Object.keys(filledValues).length === 0) {
      toast({
        title: "Enter Lab Values",
        description: "Please enter at least one lab value to analyze",
        variant: "destructive",
      });
      return;
    }

    analyzeLabsMutation.mutate({ type: panelType, values: filledValues });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'low':
        return <TrendingDown className="h-4 w-4 text-blue-500" />;
      case 'high':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 pt-12 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/clinical-command">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 mb-4 -ml-2" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Clinical Command Center
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FlaskConical className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="heading-lab-analyzer">Lab Results Analyzer</h1>
              <p className="text-white/80 text-sm">AI-powered interpretation of your bloodwork</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Disclaimer */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Educational purposes only.</strong> This AI analysis is not a substitute for professional medical interpretation. Always discuss your results with your healthcare provider.
            </p>
          </CardContent>
        </Card>

        {/* Input Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="manual" className="text-xs">Manual</TabsTrigger>
            <TabsTrigger value="cbc" className="text-xs">CBC</TabsTrigger>
            <TabsTrigger value="metabolic" className="text-xs">CMP</TabsTrigger>
            <TabsTrigger value="lipid" className="text-xs">Lipid</TabsTrigger>
            <TabsTrigger value="thyroid" className="text-xs">Thyroid</TabsTrigger>
          </TabsList>

          {/* Manual Entry Tab */}
          <TabsContent value="manual">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Enter Lab Results
                </CardTitle>
                <CardDescription>
                  Paste your lab results or type them in any format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Example:
WBC: 7.5 K/uL
RBC: 4.8 M/uL
Hemoglobin: 14.2 g/dL
Glucose: 95 mg/dL
Creatinine: 1.0 mg/dL
..."
                  className="min-h-[200px] font-mono text-sm"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  data-testid="input-manual-labs"
                />
                <Button 
                  onClick={handleManualAnalysis}
                  disabled={analyzeLabsMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  data-testid="button-analyze-manual"
                >
                  {analyzeLabsMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Panel Entry Tabs */}
          {Object.entries(COMMON_PANELS).map(([key, panel]) => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <panel.icon className={`h-5 w-5 ${panel.color}`} />
                    {panel.name}
                  </CardTitle>
                  <CardDescription>
                    Enter your values for each test (leave blank for tests you don't have)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {panel.tests.map((test) => (
                      <div key={test.name} className="space-y-1.5">
                        <Label htmlFor={test.name} className="text-sm font-medium">
                          {test.label}
                          <span className="text-gray-400 text-xs ml-2">({test.normalRange} {test.unit})</span>
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id={test.name}
                            type="text"
                            placeholder="Enter value"
                            value={panelValues[test.name] || ''}
                            onChange={(e) => setPanelValues(prev => ({ ...prev, [test.name]: e.target.value }))}
                            className="flex-1"
                            data-testid={`input-${test.name.toLowerCase()}`}
                          />
                          <span className="text-xs text-gray-500 w-16">{test.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => handlePanelAnalysis(key)}
                    disabled={analyzeLabsMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    data-testid={`button-analyze-${key}`}
                  >
                    {analyzeLabsMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Analyze {panel.name}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Summary Card */}
              <Card className={`border-2 ${
                analysisResult.overallHealth === 'good' ? 'border-green-200 bg-green-50' :
                analysisResult.overallHealth === 'concerning' ? 'border-orange-200 bg-orange-50' :
                'border-red-200 bg-red-50'
              }`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Analysis Summary</CardTitle>
                    <Badge className={
                      analysisResult.overallHealth === 'good' ? 'bg-green-500' :
                      analysisResult.overallHealth === 'concerning' ? 'bg-orange-500' :
                      'bg-red-500'
                    }>
                      {analysisResult.overallHealth === 'good' ? 'Within Normal Limits' :
                       analysisResult.overallHealth === 'concerning' ? 'Some Concerns' :
                       'Requires Attention'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{analysisResult.summary}</p>
                </CardContent>
              </Card>

              {/* Values Section */}
              {analysisResult.values && analysisResult.values.length > 0 && (
                <Card>
                  <CardHeader 
                    className="cursor-pointer flex flex-row items-center justify-between"
                    onClick={() => toggleSection('values')}
                  >
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Beaker className="h-5 w-5" />
                      Lab Values Interpretation
                    </CardTitle>
                    {expandedSections.values ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CardHeader>
                  {expandedSections.values && (
                    <CardContent>
                      <div className="space-y-3">
                        {analysisResult.values.map((value, index) => (
                          <div key={index} className={`p-3 rounded-lg border ${getStatusColor(value.status)}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(value.status)}
                                <span className="font-medium">{value.name}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold">{value.value} {value.unit}</span>
                                <span className="text-xs block text-gray-500">Normal: {value.normalRange}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Insights Section */}
              {analysisResult.insights && analysisResult.insights.length > 0 && (
                <Card>
                  <CardHeader 
                    className="cursor-pointer flex flex-row items-center justify-between"
                    onClick={() => toggleSection('insights')}
                  >
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      AI Insights
                    </CardTitle>
                    {expandedSections.insights ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CardHeader>
                  {expandedSections.insights && (
                    <CardContent>
                      <ul className="space-y-2">
                        {analysisResult.insights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Recommendations Section */}
              {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                <Card>
                  <CardHeader 
                    className="cursor-pointer flex flex-row items-center justify-between"
                    onClick={() => toggleSection('recommendations')}
                  >
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Recommendations
                    </CardTitle>
                    {expandedSections.recommendations ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CardHeader>
                  {expandedSections.recommendations && (
                    <CardContent>
                      <ul className="space-y-2">
                        {analysisResult.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Follow Up Section */}
              {analysisResult.followUp && analysisResult.followUp.length > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-blue-600" />
                      Discuss with Your Doctor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysisResult.followUp.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-800">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MobileBottomNav />
    </div>
  );
}
