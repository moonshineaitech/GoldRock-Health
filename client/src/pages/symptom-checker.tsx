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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Stethoscope, ArrowLeft, AlertTriangle, Brain, Heart, Activity,
  Thermometer, Clock, Plus, Trash2, Loader2, Sparkles, ChevronRight,
  AlertCircle, CheckCircle, Phone, MapPin, XCircle
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

const BODY_PARTS = [
  'Head', 'Eyes', 'Ears', 'Nose', 'Throat', 'Neck',
  'Chest', 'Heart', 'Lungs', 'Abdomen', 'Back',
  'Arms', 'Hands', 'Legs', 'Feet', 'Skin', 'General/Whole Body'
];

const SYMPTOM_DURATION = [
  { value: 'hours', label: 'Less than 24 hours' },
  { value: 'days', label: '1-3 days' },
  { value: 'week', label: '4-7 days' },
  { value: 'weeks', label: '1-4 weeks' },
  { value: 'months', label: 'More than a month' },
];

export default function SymptomChecker() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("5");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [result, setResult] = useState<SymptomAnalysis | null>(null);

  const analyzeSymptomsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/analyze-symptoms", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      setStep(4);
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Unable to analyze symptoms",
        variant: "destructive",
      });
    }
  });

  const addSymptom = () => {
    const symptom = currentSymptom.trim();
    if (!symptom) return;
    if (symptoms.includes(symptom.toLowerCase())) {
      toast({
        title: "Already Added",
        description: "This symptom is already in your list",
        variant: "destructive",
      });
      return;
    }
    setSymptoms([...symptoms, symptom]);
    setCurrentSymptom("");
  };

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    if (symptoms.length === 0) {
      toast({
        title: "Add Symptoms",
        description: "Please add at least one symptom to analyze",
        variant: "destructive",
      });
      return;
    }
    
    analyzeSymptomsMutation.mutate({
      symptoms,
      age: parseInt(age) || 30,
      gender,
      bodyPart,
      duration,
      severity: parseInt(severity),
      additionalInfo
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'bg-red-500';
      case 'urgent':
        return 'bg-orange-500';
      case 'soon':
        return 'bg-yellow-500';
      case 'routine':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'Seek Emergency Care Immediately';
      case 'urgent':
        return 'See a Doctor Within 24 Hours';
      case 'soon':
        return 'Schedule an Appointment This Week';
      case 'routine':
        return 'Monitor and Follow Up as Needed';
      default:
        return 'Consult a Healthcare Provider';
    }
  };

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case 'high':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'moderate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 pt-12 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/clinical-command">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 mb-4 -ml-2" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Clinical Command Center
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="heading-symptom-checker">AI Symptom Checker</h1>
              <p className="text-white/80 text-sm">Describe your symptoms for AI-powered analysis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Progress Bar */}
        {step < 4 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {step} of 3</span>
              <span>{Math.round((step / 3) * 100)}% complete</span>
            </div>
            <Progress value={(step / 3) * 100} className="h-2" />
          </div>
        )}

        {/* Emergency Disclaimer */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <Phone className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <strong>Emergency?</strong> If you are experiencing chest pain, difficulty breathing, severe bleeding, or other life-threatening symptoms, call 911 or go to the nearest emergency room immediately.
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Add Symptoms */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  What symptoms are you experiencing?
                </CardTitle>
                <CardDescription>
                  Add each symptom you are currently experiencing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., headache, fatigue, nausea, chest pain..."
                    value={currentSymptom}
                    onChange={(e) => setCurrentSymptom(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSymptom()}
                    className="flex-1"
                    data-testid="input-symptom"
                  />
                  <Button onClick={addSymptom} className="bg-emerald-600 hover:bg-emerald-700" data-testid="button-add-symptom">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>

                {/* Symptom List */}
                {symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((symptom, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1 bg-emerald-100 text-emerald-800 rounded-full px-3 py-1.5"
                      >
                        <span className="text-sm font-medium">{symptom}</span>
                        <button
                          onClick={() => removeSymptom(index)}
                          className="ml-1 text-emerald-600 hover:text-emerald-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Common Symptoms Quick Add */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Quick add common symptoms:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Headache', 'Fever', 'Fatigue', 'Nausea', 'Cough', 'Sore throat', 'Body aches', 'Dizziness'].map((s) => (
                      <button
                        key={s}
                        onClick={() => !symptoms.includes(s) && setSymptoms([...symptoms, s])}
                        disabled={symptoms.includes(s)}
                        className="text-xs bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-700 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={symptoms.length === 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  data-testid="button-next-step1"
                >
                  Continue
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  Tell us more about your symptoms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Body Part */}
                <div className="space-y-2">
                  <Label>Primary affected area</Label>
                  <Select value={bodyPart} onValueChange={setBodyPart}>
                    <SelectTrigger data-testid="select-body-part">
                      <SelectValue placeholder="Select body part" />
                    </SelectTrigger>
                    <SelectContent>
                      {BODY_PARTS.map((part) => (
                        <SelectItem key={part} value={part.toLowerCase()}>{part}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label>How long have you had these symptoms?</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger data-testid="select-duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {SYMPTOM_DURATION.map((d) => (
                        <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Severity */}
                <div className="space-y-2">
                  <Label>Severity (1 = mild, 10 = severe): {severity}</Label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    data-testid="input-severity"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    data-testid="button-next-step2"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Personal Info */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-emerald-600" />
                  A bit about you
                </CardTitle>
                <CardDescription>
                  This helps provide more accurate analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    data-testid="input-age"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Additional Info */}
                <div className="space-y-2">
                  <Label htmlFor="additional">Any other relevant information? (Optional)</Label>
                  <Textarea
                    id="additional"
                    placeholder="e.g., existing medical conditions, recent travel, medications you take..."
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="min-h-[100px]"
                    data-testid="input-additional"
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleAnalyze}
                    disabled={analyzeSymptomsMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    data-testid="button-analyze"
                  >
                    {analyzeSymptomsMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Analyze Symptoms
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Results */}
        {step === 4 && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Urgency Banner */}
            <Card className={`border-2 ${
              result.urgency === 'emergency' ? 'border-red-400 bg-red-50' :
              result.urgency === 'urgent' ? 'border-orange-400 bg-orange-50' :
              result.urgency === 'soon' ? 'border-yellow-400 bg-yellow-50' :
              'border-green-400 bg-green-50'
            }`}>
              <CardContent className="p-6 text-center">
                <Badge className={`${getUrgencyColor(result.urgency)} text-white text-lg px-4 py-1 mb-3`}>
                  {result.urgency.toUpperCase()}
                </Badge>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{getUrgencyText(result.urgency)}</h3>
                <p className="text-gray-700">{result.summary}</p>
              </CardContent>
            </Card>

            {/* Red Flags */}
            {result.redFlags && result.redFlags.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                    <XCircle className="h-5 w-5" />
                    Warning Signs to Watch For
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.redFlags.map((flag, index) => (
                      <li key={index} className="flex items-start gap-2 text-red-700">
                        <AlertTriangle className="h-4 w-4 mt-1 flex-shrink-0" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Possible Conditions */}
            {result.possibleConditions && result.possibleConditions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Possible Conditions
                  </CardTitle>
                  <CardDescription>
                    Based on your symptoms, these conditions may be relevant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.possibleConditions.map((condition, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getLikelihoodColor(condition.likelihood)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold">{condition.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {condition.likelihood} likelihood
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{condition.description}</p>
                      {condition.whenToSeek && (
                        <p className="text-xs text-gray-600 italic">
                          When to seek care: {condition.whenToSeek}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Self Care Advice */}
            {result.selfCareAdvice && result.selfCareAdvice.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Self-Care Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.selfCareAdvice.map((advice, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        {advice}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Questions for Doctor */}
            {result.questions && result.questions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                    Questions to Ask Your Doctor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.questions.map((q, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Start Over */}
            <Button
              variant="outline"
              onClick={() => {
                setStep(1);
                setSymptoms([]);
                setResult(null);
              }}
              className="w-full"
              data-testid="button-start-over"
            >
              Check Different Symptoms
            </Button>

            {/* Disclaimer */}
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-4">
                <p className="text-xs text-gray-600 text-center">
                  {result.disclaimer || "This AI symptom checker is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider."}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
}
