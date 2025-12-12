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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Stethoscope, ArrowLeft, AlertTriangle, Brain,
  Plus, Trash2, Loader2, Sparkles,
  CheckCircle, Phone, XCircle
} from "lucide-react";

interface PossibleCondition {
  name: string;
  likelihood: 'high' | 'moderate' | 'low';
  description: string;
  commonSymptoms: string[];
  whenToSeek: string;
}

interface SymptomAnalysis {
  urgency: 'emergency' | 'urgent' | 'soon' | 'routine';
  summary: string;
  possibleConditions: PossibleCondition[];
  redFlags: string[];
  selfCareAdvice: string[];
  questions: string[];
  disclaimer: string;
}

const QUICK_SYMPTOMS = ['Headache', 'Fever', 'Fatigue', 'Nausea', 'Cough', 'Sore throat', 'Back pain', 'Dizziness'];

export default function SymptomChecker() {
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("5");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [result, setResult] = useState<SymptomAnalysis | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/analyze-symptoms", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: () => {
      toast({ title: "Error", description: "Could not analyze symptoms", variant: "destructive" });
    }
  });

  const addSymptom = () => {
    const s = currentSymptom.trim();
    if (!s) return;
    if (symptoms.some(x => x.toLowerCase() === s.toLowerCase())) {
      toast({ title: "Already Added", variant: "destructive" });
      return;
    }
    setSymptoms([...symptoms, s]);
    setCurrentSymptom("");
  };

  const quickAdd = (s: string) => {
    if (!symptoms.some(x => x.toLowerCase() === s.toLowerCase())) {
      setSymptoms([...symptoms, s]);
    }
  };

  const removeSymptom = (i: number) => setSymptoms(symptoms.filter((_, idx) => idx !== i));

  const handleAnalyze = () => {
    if (symptoms.length === 0) {
      toast({ title: "Add Symptoms", description: "Add at least one symptom", variant: "destructive" });
      return;
    }
    analyzeMutation.mutate({
      symptoms,
      age: parseInt(age) || 30,
      gender,
      duration,
      severity: parseInt(severity),
      additionalInfo
    });
  };

  const reset = () => {
    setSymptoms([]);
    setResult(null);
    setAdditionalInfo("");
  };

  const getUrgencyStyle = (u: string) => {
    switch (u) {
      case 'emergency': return { bg: 'bg-red-500', border: 'border-red-400', light: 'bg-red-50' };
      case 'urgent': return { bg: 'bg-orange-500', border: 'border-orange-400', light: 'bg-orange-50' };
      case 'soon': return { bg: 'bg-yellow-500', border: 'border-yellow-400', light: 'bg-yellow-50' };
      default: return { bg: 'bg-green-500', border: 'border-green-400', light: 'bg-green-50' };
    }
  };

  const getUrgencyText = (u: string) => {
    switch (u) {
      case 'emergency': return 'Call 911 or go to the ER now';
      case 'urgent': return 'See a doctor within 24 hours';
      case 'soon': return 'Schedule an appointment this week';
      default: return 'Monitor and follow up as needed';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 pt-12 pb-6">
        <div className="max-w-lg mx-auto">
          <Link href="/clinical-command-center">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 mb-3 -ml-2 h-8 text-sm" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" data-testid="heading-symptom-checker">Symptom Library</h1>
              <p className="text-white/80 text-xs">Browse symptom information for educational purposes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Emergency Warning */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-3 flex items-start gap-2">
            <Phone className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-800">
              <strong>Emergency?</strong> Chest pain, difficulty breathing, severe bleeding, or stroke symptoms? Call 911 now.
            </p>
          </CardContent>
        </Card>

        {/* Input Form - Only show if no result */}
        {!result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Symptoms Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">What are you feeling?</CardTitle>
                <CardDescription className="text-xs">Add each symptom you have</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., headache, nausea..."
                    value={currentSymptom}
                    onChange={(e) => setCurrentSymptom(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSymptom()}
                    className="flex-1"
                    data-testid="input-symptom"
                  />
                  <Button onClick={addSymptom} className="bg-emerald-600 hover:bg-emerald-700" data-testid="button-add-symptom">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Symptom Pills */}
                {symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 rounded-full px-3 py-1.5"
                      >
                        <span className="text-sm font-medium">{s}</span>
                        <button onClick={() => removeSymptom(i)} className="text-emerald-600 hover:text-emerald-800 ml-1">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Quick Add */}
                {symptoms.length === 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Quick add:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_SYMPTOMS.map((s) => (
                        <button
                          key={s}
                          onClick={() => quickAdd(s)}
                          className="text-xs bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-700 rounded-full px-2.5 py-1 transition-colors"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">A few more details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Age</Label>
                    <Input
                      type="number"
                      placeholder="30"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      data-testid="input-age"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger data-testid="select-gender">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">How long have you had symptoms?</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger data-testid="select-duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Less than 24 hours</SelectItem>
                      <SelectItem value="days">1-3 days</SelectItem>
                      <SelectItem value="week">4-7 days</SelectItem>
                      <SelectItem value="weeks">1-4 weeks</SelectItem>
                      <SelectItem value="months">Over a month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Severity: {severity}/10</Label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    data-testid="input-severity"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Mild</span>
                    <span>Severe</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Anything else? (optional)</Label>
                  <Textarea
                    placeholder="Medical conditions, medications, recent travel..."
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="min-h-[60px] text-sm"
                    data-testid="input-additional"
                  />
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={symptoms.length === 0 || analyzeMutation.isPending}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600"
                  data-testid="button-analyze"
                >
                  {analyzeMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Sparkles className="h-4 w-4 mr-2" /> Check Symptoms</>
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
              {/* Urgency Banner */}
              <Card className={`border-2 ${getUrgencyStyle(result.urgency).border} ${getUrgencyStyle(result.urgency).light}`}>
                <CardContent className="p-5 text-center">
                  <Badge className={`${getUrgencyStyle(result.urgency).bg} text-white text-base px-4 py-1 mb-2`}>
                    {result.urgency.toUpperCase()}
                  </Badge>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{getUrgencyText(result.urgency)}</h3>
                  <p className="text-sm text-gray-700">{result.summary}</p>
                </CardContent>
              </Card>

              {/* Red Flags */}
              {result.redFlags?.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-red-800">
                      <XCircle className="h-4 w-4" /> Watch for these warning signs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {result.redFlags.map((flag, i) => (
                        <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Possible Conditions */}
              {result.possibleConditions?.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-600" /> What this might be
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.possibleConditions.map((c, i) => (
                      <div key={i} className={`p-3 rounded-lg border ${
                        c.likelihood === 'high' ? 'bg-purple-50 border-purple-200' :
                        c.likelihood === 'moderate' ? 'bg-blue-50 border-blue-200' :
                        'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{c.name}</span>
                          <Badge variant="outline" className="text-xs">{c.likelihood}</Badge>
                        </div>
                        <p className="text-xs text-gray-600">{c.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Self Care */}
              {result.selfCareAdvice?.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" /> What you can try
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {result.selfCareAdvice.map((a, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Questions */}
              {result.questions?.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-blue-600" /> Ask your doctor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {result.questions.map((q, i) => (
                        <li key={i} className="text-sm text-gray-700">{i + 1}. {q}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Disclaimer */}
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-3">
                  <p className="text-xs text-gray-500 text-center">
                    This is educational information only. It is not a diagnosis. Always see a doctor for medical advice.
                  </p>
                </CardContent>
              </Card>

              {/* New Check */}
              <Button onClick={reset} variant="outline" className="w-full" data-testid="button-new-check">
                Check Different Symptoms
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MobileBottomNav />
    </div>
  );
}
