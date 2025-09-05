import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft,
  Brain, 
  UserPlus,
  Sparkles,
  Stethoscope,
  FileText,
  TrendingUp,
  Activity,
  Eye,
  Heart,
  Zap,
  Target,
  TestTube,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Plus,
  BarChart3,
  Lightbulb,
  Search,
  Filter,
  RefreshCw
} from "lucide-react";
import { Link } from "wouter";
import { MobileLayout } from "@/components/mobile-layout";
import type { SyntheticPatient, DiagnosticSession } from "@shared/schema";

interface PatientFormData {
  profileName: string;
  age: string;
  gender: string;
  ethnicity: string;
  occupation: string;
  chiefComplaint: string;
  symptoms: string;
  medicalHistory: string;
  medications: string;
  allergies: string;
  familyHistory: string;
  socialHistory: string;
  complexity: string;
  specialty: string;
}

interface DiagnosticAnalysisProps {
  patient: SyntheticPatient;
  onClose: () => void;
}

const DiagnosticAnalysisInterface = ({ patient, onClose }: DiagnosticAnalysisProps) => {
  const [selectedAnalysisType, setSelectedAnalysisType] = useState("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DiagnosticSession | null>(null);
  const { toast } = useToast();

  const analysisTypes = [
    { id: "differential_diagnosis", name: "Differential Diagnosis", icon: Target, desc: "Generate possible diagnoses with probabilities" },
    { id: "treatment_planning", name: "Treatment Planning", icon: Heart, desc: "Develop comprehensive treatment strategies" },
    { id: "risk_assessment", name: "Risk Assessment", icon: AlertTriangle, desc: "Evaluate patient risks and complications" },
    { id: "prognosis", name: "Prognosis Analysis", icon: TrendingUp, desc: "Predict outcomes and recovery timeline" }
  ];

  const specialties = [
    "Internal Medicine", "Cardiology", "Neurology", "Emergency Medicine", 
    "Pulmonology", "Gastroenterology", "Endocrinology", "Oncology"
  ];

  const runDiagnosticAnalysis = async () => {
    if (!selectedAnalysisType) {
      toast({ title: "Please select an analysis type", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await apiRequest("POST", `/api/synthetic-patients/${patient.id}/analyze`, {
        analysisType: selectedAnalysisType,
        focusAreas,
        sessionName: `${selectedAnalysisType.replace(/_/g, ' ')} - ${patient.profileName}`
      });
      const result = await response.json();
      setAnalysisResult(result);
      toast({ title: "Analysis complete!", description: "AI diagnostic insights generated successfully." });
    } catch (error) {
      toast({ title: "Analysis failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (analysisResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Analysis Results</h3>
          <Button onClick={() => setAnalysisResult(null)} variant="outline">New Analysis</Button>
        </div>
        
        {/* Analysis Results Display */}
        <div className="grid gap-4">
          {analysisResult.diagnosticAnalysis?.differentialDiagnoses && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Differential Diagnoses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResult.diagnosticAnalysis.differentialDiagnoses.map((dx, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{dx.diagnosis}</h4>
                        <span className="text-sm font-medium text-blue-600">{dx.probability}%</span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div><strong>Supporting:</strong> {dx.supportingEvidence.join(", ")}</div>
                        <div><strong>Required Tests:</strong> {dx.requiredTests.join(", ")}</div>
                        <div className={`text-sm font-medium ${dx.urgency === 'critical' ? 'text-red-600' : dx.urgency === 'high' ? 'text-orange-600' : 'text-green-600'}`}>
                          Urgency: {dx.urgency}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {analysisResult.diagnosticAnalysis?.recommendedTests && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5 text-green-600" />
                  Recommended Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {analysisResult.diagnosticAnalysis.recommendedTests.map((test, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{test.testName}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{test.rationale}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${test.priority === 'stat' ? 'text-red-600' : test.priority === 'urgent' ? 'text-orange-600' : 'text-blue-600'}`}>
                          {test.priority.toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500">{test.cost}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {analysisResult.learningPoints && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                  Learning Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResult.learningPoints.keyInsights?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Key Insights</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {analysisResult.learningPoints.keyInsights.map((insight, idx) => (
                          <li key={idx}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResult.learningPoints.clinicalPearls?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Clinical Pearls</h4>
                      <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                        {analysisResult.learningPoints.clinicalPearls.map((pearl, idx) => (
                          <li key={idx}>{pearl}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">AI Diagnostic Analysis</h3>
        <p className="text-gray-600 dark:text-gray-400">Patient: {patient.profileName}</p>
      </div>

      {/* Analysis Type Selection */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Select Analysis Type</h4>
        <div className="grid grid-cols-2 gap-3">
          {analysisTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <div
                key={type.id}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                  selectedAnalysisType === type.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedAnalysisType(type.id)}
              >
                <IconComponent className="h-6 w-6 text-blue-600 mb-2" />
                <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{type.name}</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">{type.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Focus Areas */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Focus Areas (Optional)</h4>
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                focusAreas.includes(specialty)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => {
                if (focusAreas.includes(specialty)) {
                  setFocusAreas(prev => prev.filter(s => s !== specialty));
                } else {
                  setFocusAreas(prev => [...prev, specialty]);
                }
              }}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          onClick={runDiagnosticAnalysis} 
          disabled={isAnalyzing}
          className="flex-1"
        >
          {isAnalyzing ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Brain className="h-4 w-4 mr-2" />
          )}
          {isAnalyzing ? "Analyzing..." : "Run Analysis"}
        </Button>
        <Button onClick={onClose} variant="outline">Cancel</Button>
      </div>
    </div>
  );
};

export default function SyntheticPatientDiagnostics() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState<"dashboard" | "create" | "analyze">("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<SyntheticPatient | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form data for custom patient creation
  const [formData, setFormData] = useState<PatientFormData>({
    profileName: "",
    age: "",
    gender: "",
    ethnicity: "",
    occupation: "",
    chiefComplaint: "",
    symptoms: "",
    medicalHistory: "",
    medications: "",
    allergies: "",
    familyHistory: "",
    socialHistory: "",
    complexity: "3",
    specialty: ""
  });

  // Get synthetic patients
  const { data: patients = [], isLoading: loadingPatients } = useQuery<SyntheticPatient[]>({
    queryKey: ["/api/synthetic-patients"]
  });

  // AI Patient Generation
  const generateAIPatient = async () => {
    setIsGenerating(true);
    try {
      const result = await apiRequest("/api/synthetic-patients/generate", {
        method: "POST",
        body: { generationType: "ai_generated" }
      });
      queryClient.invalidateQueries({ queryKey: ["/api/synthetic-patients"] });
      toast({ title: "AI Patient Generated!", description: "New synthetic patient profile created successfully." });
    } catch (error) {
      toast({ title: "Generation failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  // Custom Patient Creation
  const createCustomPatient = async () => {
    try {
      await apiRequest("/api/synthetic-patients", {
        method: "POST",
        body: {
          ...formData,
          generationType: "custom_created",
          age: parseInt(formData.age),
          complexity: parseInt(formData.complexity)
        }
      });
      queryClient.invalidateQueries({ queryKey: ["/api/synthetic-patients"] });
      setActiveView("dashboard");
      toast({ title: "Patient Created!", description: "Custom patient profile created successfully." });
      // Reset form
      setFormData({
        profileName: "", age: "", gender: "", ethnicity: "", occupation: "",
        chiefComplaint: "", symptoms: "", medicalHistory: "", medications: "",
        allergies: "", familyHistory: "", socialHistory: "", complexity: "3", specialty: ""
      });
    } catch (error) {
      toast({ title: "Creation failed", description: "Please try again.", variant: "destructive" });
    }
  };

  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const dashboardView = (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg"
        >
          <Brain className="h-8 w-8 text-white" />
        </motion.div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Synthetic Patient Diagnostics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">AI-powered medical training with realistic patient profiles</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={generateAIPatient}
          disabled={isGenerating}
          className="h-20 flex-col space-y-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isGenerating ? (
            <RefreshCw className="h-6 w-6 animate-spin" />
          ) : (
            <Sparkles className="h-6 w-6" />
          )}
          <span className="text-sm font-medium">Generate AI Patient</span>
        </Button>
        
        <Button 
          onClick={() => setActiveView("create")}
          variant="outline"
          className="h-20 flex-col space-y-2"
        >
          <UserPlus className="h-6 w-6 text-emerald-600" />
          <span className="text-sm font-medium">Create Custom</span>
        </Button>
      </div>

      {/* Patient List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Your Patient Profiles ({patients.length})</h3>
        
        {loadingPatients ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : patients.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No patient profiles yet</p>
              <p className="text-sm text-gray-400">Create your first synthetic patient to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {patients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{patient.profileName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{patient.chiefComplaint}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{patient.age} yo {patient.gender}</span>
                        <span>Complexity: {patient.complexity}/5</span>
                        {patient.specialty && <span>{patient.specialty}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setActiveView("analyze");
                        }}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600"
                      >
                        <Stethoscope className="h-4 w-4 mr-1" />
                        Analyze
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const createPatientView = (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button 
          onClick={() => setActiveView("dashboard")} 
          variant="ghost" 
          size="sm"
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Create Custom Patient</h2>
      </div>

      <div className="space-y-4">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Patient Name
                </label>
                <Input
                  value={formData.profileName}
                  onChange={(e) => handleInputChange("profileName", e.target.value)}
                  placeholder="e.g., John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age
                </label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="e.g., 45"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ethnicity
                </label>
                <Input
                  value={formData.ethnicity}
                  onChange={(e) => handleInputChange("ethnicity", e.target.value)}
                  placeholder="e.g., Caucasian"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinical Information */}
        <Card>
          <CardHeader>
            <CardTitle>Clinical Presentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Chief Complaint
              </label>
              <Input
                value={formData.chiefComplaint}
                onChange={(e) => handleInputChange("chiefComplaint", e.target.value)}
                placeholder="e.g., Chest pain for 2 hours"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Presenting Symptoms
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                rows={3}
                value={formData.symptoms}
                onChange={(e) => handleInputChange("symptoms", e.target.value)}
                placeholder="Describe symptoms, severity, duration, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Medical History
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                rows={3}
                value={formData.medicalHistory}
                onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                placeholder="Past medical history, surgeries, hospitalizations"
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Case Complexity (1-5)
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={formData.complexity}
                  onChange={(e) => handleInputChange("complexity", e.target.value)}
                >
                  <option value="1">1 - Basic</option>
                  <option value="2">2 - Simple</option>
                  <option value="3">3 - Moderate</option>
                  <option value="4">4 - Complex</option>
                  <option value="5">5 - Expert Level</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Primary Specialty
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={formData.specialty}
                  onChange={(e) => handleInputChange("specialty", e.target.value)}
                >
                  <option value="">Select specialty</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Emergency Medicine">Emergency Medicine</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Psychiatry">Psychiatry</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={createCustomPatient} className="flex-1">
            <UserPlus className="h-4 w-4 mr-2" />
            Create Patient Profile
          </Button>
          <Button onClick={() => setActiveView("dashboard")} variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  );

  return (
    <MobileLayout 
      title="Synthetic Patient Diagnostics"
      showBackButton={true}
      showBottomNav={true}
    >
      <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            {activeView === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {dashboardView}
              </motion.div>
            )}
            
            {activeView === "create" && (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {createPatientView}
              </motion.div>
            )}
            
            {activeView === "analyze" && selectedPatient && (
              <motion.div
                key="analyze"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <DiagnosticAnalysisInterface 
                  patient={selectedPatient} 
                  onClose={() => {
                    setActiveView("dashboard");
                    setSelectedPatient(null);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MobileLayout>
  );
}