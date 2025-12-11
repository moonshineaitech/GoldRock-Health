import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Beaker, FlaskConical, Droplet, Activity, Heart, ArrowLeft, AlertTriangle,
  CheckCircle, XCircle, TrendingUp, TrendingDown, Minus, Sparkles,
  Loader2, Brain
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

const PANELS = [
  { id: 'cbc', name: 'Blood Count', icon: Droplet, color: 'bg-red-500', desc: 'CBC Panel' },
  { id: 'metabolic', name: 'Metabolic', icon: Activity, color: 'bg-emerald-500', desc: 'CMP Panel' },
  { id: 'lipid', name: 'Cholesterol', icon: Heart, color: 'bg-orange-500', desc: 'Lipid Panel' },
  { id: 'thyroid', name: 'Thyroid', icon: Brain, color: 'bg-purple-500', desc: 'TSH, T3, T4' },
];

const PANEL_FIELDS: Record<string, { name: string; label: string; unit: string; hint: string }[]> = {
  cbc: [
    { name: 'WBC', label: 'White Blood Cells', unit: 'K/uL', hint: '4.5-11.0' },
    { name: 'RBC', label: 'Red Blood Cells', unit: 'M/uL', hint: '4.5-5.5' },
    { name: 'Hemoglobin', label: 'Hemoglobin', unit: 'g/dL', hint: '12-17.5' },
    { name: 'Platelets', label: 'Platelets', unit: 'K/uL', hint: '150-400' },
  ],
  metabolic: [
    { name: 'Glucose', label: 'Glucose (Fasting)', unit: 'mg/dL', hint: '70-100' },
    { name: 'Creatinine', label: 'Creatinine', unit: 'mg/dL', hint: '0.7-1.3' },
    { name: 'Sodium', label: 'Sodium', unit: 'mEq/L', hint: '136-145' },
    { name: 'Potassium', label: 'Potassium', unit: 'mEq/L', hint: '3.5-5.0' },
  ],
  lipid: [
    { name: 'TotalCholesterol', label: 'Total Cholesterol', unit: 'mg/dL', hint: '<200' },
    { name: 'HDL', label: 'HDL (Good)', unit: 'mg/dL', hint: '>40' },
    { name: 'LDL', label: 'LDL (Bad)', unit: 'mg/dL', hint: '<100' },
    { name: 'Triglycerides', label: 'Triglycerides', unit: 'mg/dL', hint: '<150' },
  ],
  thyroid: [
    { name: 'TSH', label: 'TSH', unit: 'mIU/L', hint: '0.4-4.0' },
    { name: 'T4', label: 'Free T4', unit: 'ng/dL', hint: '0.8-1.8' },
    { name: 'T3', label: 'Free T3', unit: 'pg/mL', hint: '2.3-4.2' },
  ],
};

export default function LabAnalyzer() {
  const { toast } = useToast();
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [panelValues, setPanelValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<LabAnalysisResult | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: async (data: { type: string; values: any }) => {
      const response = await apiRequest("POST", "/api/analyze-labs", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({ title: "Analysis Complete", description: "Your results are ready" });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not analyze results. Try again.", variant: "destructive" });
    }
  });

  const handlePanelAnalysis = () => {
    const filled = Object.entries(panelValues).filter(([_, v]) => v.trim());
    if (filled.length === 0) {
      toast({ title: "Enter Values", description: "Please enter at least one lab value", variant: "destructive" });
      return;
    }
    analyzeMutation.mutate({ type: selectedPanel || 'cbc', values: panelValues });
  };

  const handleManualAnalysis = () => {
    if (!manualInput.trim()) {
      toast({ title: "Enter Values", description: "Please paste or type your lab results", variant: "destructive" });
      return;
    }
    analyzeMutation.mutate({ type: 'manual', values: manualInput });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'low': return <TrendingDown className="h-4 w-4 text-blue-500" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-50 border-green-200';
      case 'low': return 'bg-blue-50 border-blue-200';
      case 'high': return 'bg-orange-50 border-orange-200';
      case 'critical': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const resetForm = () => {
    setSelectedPanel(null);
    setManualMode(false);
    setPanelValues({});
    setManualInput("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 pt-12 pb-6">
        <div className="max-w-lg mx-auto">
          <Link href="/clinical-command">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 mb-3 -ml-2 h-8 text-sm" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
              <FlaskConical className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" data-testid="heading-lab-analyzer">Lab Results Analyzer</h1>
              <p className="text-white/80 text-xs">AI helps you understand your bloodwork</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Disclaimer */}
        <Card className="border-amber-200 bg-amber-50/80">
          <CardContent className="p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              <strong>Educational only.</strong> Always discuss results with your doctor.
            </p>
          </CardContent>
        </Card>

        {/* No Result Yet - Show Selection */}
        {!result && !selectedPanel && !manualMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">Choose a lab panel</h2>
            <div className="grid grid-cols-2 gap-3">
              {PANELS.map((panel) => (
                <motion.button
                  key={panel.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPanel(panel.id)}
                  className="bg-white rounded-xl p-4 text-left shadow-sm border border-gray-100 hover:border-indigo-200 transition-colors"
                  data-testid={`button-panel-${panel.id}`}
                >
                  <div className={`w-10 h-10 ${panel.color} rounded-lg flex items-center justify-center mb-2`}>
                    <panel.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{panel.name}</h3>
                  <p className="text-xs text-gray-500">{panel.desc}</p>
                </motion.button>
              ))}
            </div>
            
            <div className="text-center pt-2">
              <button
                onClick={() => setManualMode(true)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                data-testid="button-manual-entry"
              >
                Or paste your full lab report
              </button>
            </div>
          </motion.div>
        )}

        {/* Panel Entry Form */}
        {selectedPanel && !result && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {PANELS.find(p => p.id === selectedPanel)?.name} Panel
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={resetForm} className="text-gray-500 h-8">
                    Change
                  </Button>
                </div>
                <CardDescription className="text-xs">
                  Enter the values from your lab report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {PANEL_FIELDS[selectedPanel]?.map((field) => (
                  <div key={field.name} className="space-y-1">
                    <Label className="text-sm">{field.label}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        placeholder={`Normal: ${field.hint}`}
                        value={panelValues[field.name] || ''}
                        onChange={(e) => setPanelValues({ ...panelValues, [field.name]: e.target.value })}
                        className="flex-1"
                        data-testid={`input-${field.name.toLowerCase()}`}
                      />
                      <span className="text-xs text-gray-500 w-14">{field.unit}</span>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={handlePanelAnalysis}
                  disabled={analyzeMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                  data-testid="button-analyze"
                >
                  {analyzeMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Sparkles className="h-4 w-4 mr-2" /> Analyze Results</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Manual Entry Mode */}
        {manualMode && !result && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Paste Lab Results</CardTitle>
                  <Button variant="ghost" size="sm" onClick={resetForm} className="text-gray-500 h-8">
                    Back
                  </Button>
                </div>
                <CardDescription className="text-xs">
                  Copy and paste your lab results in any format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Example:
WBC: 7.5 K/uL
Hemoglobin: 14.2 g/dL
Glucose: 95 mg/dL
..."
                  className="min-h-[180px] font-mono text-sm"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  data-testid="input-manual-labs"
                />
                <Button
                  onClick={handleManualAnalysis}
                  disabled={analyzeMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                  data-testid="button-analyze-manual"
                >
                  {analyzeMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Sparkles className="h-4 w-4 mr-2" /> Analyze Results</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Summary */}
              <Card className={`border-2 ${
                result.overallHealth === 'good' ? 'border-green-300 bg-green-50' :
                result.overallHealth === 'concerning' ? 'border-orange-300 bg-orange-50' :
                'border-red-300 bg-red-50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">Summary</span>
                    <Badge className={
                      result.overallHealth === 'good' ? 'bg-green-500' :
                      result.overallHealth === 'concerning' ? 'bg-orange-500' : 'bg-red-500'
                    }>
                      {result.overallHealth === 'good' ? 'Normal' :
                       result.overallHealth === 'concerning' ? 'Some Concerns' : 'Needs Attention'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{result.summary}</p>
                </CardContent>
              </Card>

              {/* Values */}
              {result.values?.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Beaker className="h-4 w-4" /> Your Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.values.map((v, i) => (
                      <div key={i} className={`p-3 rounded-lg border ${getStatusBg(v.status)}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(v.status)}
                            <span className="font-medium text-sm">{v.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-sm">{v.value} {v.unit}</span>
                            <div className="text-xs text-gray-500">Normal: {v.normalRange}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Insights */}
              {result.insights?.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-600" /> What This Means
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.insights.map((insight, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-purple-500 mt-1">-</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              {result.recommendations?.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" /> Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* New Analysis Button */}
              <Button onClick={resetForm} variant="outline" className="w-full" data-testid="button-new-analysis">
                Analyze Different Results
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MobileBottomNav />
    </div>
  );
}
