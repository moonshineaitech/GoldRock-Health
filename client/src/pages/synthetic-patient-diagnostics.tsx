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
  RefreshCw,
  Trophy
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

// Interactive Training Mode - Step-by-step diagnostic simulation
interface TrainingSessionState {
  phase: "initial" | "history" | "exam" | "labs" | "imaging" | "diagnosis";
  revealedInfo: Record<string, boolean>;
  orderedTests: string[];
  requestsMade: number;
  startTime: number;
  score: number;
  hints: string[];
}

interface InteractiveTrainingModeProps {
  patient: Partial<SyntheticPatient>;
  onClose: () => void;
  isDemo?: boolean;
}

const InteractiveTrainingMode = ({ patient, onClose, isDemo = false }: InteractiveTrainingModeProps) => {
  const { toast } = useToast();
  const [session, setSession] = useState<TrainingSessionState>({
    phase: "initial",
    revealedInfo: {},
    orderedTests: [],
    requestsMade: 0,
    startTime: Date.now(),
    score: 100,
    hints: []
  });
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [userDiagnosis, setUserDiagnosis] = useState("");
  const [confidence, setConfidence] = useState(3);
  const [diagnosisResult, setDiagnosisResult] = useState<{correct: boolean; feedback: string; actualDiagnosis: string} | null>(null);
  const [isAnalyzingDiagnosis, setIsAnalyzingDiagnosis] = useState(false);

  // Demo patient data for training cases
  const getDemoPatientData = (patientId: string) => {
    const demoData: Record<string, any> = {
      "demo-1": { // Maria Chen - Cardiology
        history: {
          allergies: "Penicillin (rash), Aspirin (GI upset)",
          medications: "Lisinopril 10mg daily, Metformin 500mg BID, Atorvastatin 20mg nightly",
          surgeries: "Appendectomy age 25, C-section x2",
          familyHistory: "Father: MI at age 58. Mother: Type 2 DM. Sister: Hypertension",
          socialHistory: "Former smoker (quit 5 years ago, 20 pack-years). Occasional wine. Works as accountant."
        },
        vitals: { bp: "158/92", hr: "98", rr: "20", temp: "98.6F", o2: "96% RA" },
        physicalExam: {
          general: "Anxious appearing, diaphoretic, clutching chest",
          cardiac: "S1S2 regular, no murmurs, JVD present",
          lungs: "Bilateral basilar crackles",
          abdomen: "Soft, non-tender, no organomegaly"
        },
        labs: {
          troponin: "2.4 ng/mL (elevated)",
          bnp: "890 pg/mL (elevated)",
          cbc: "WBC 11.2, Hgb 13.1, Plt 245",
          bmp: "Na 138, K 4.2, Cr 1.1, Glucose 186"
        },
        imaging: {
          ekg: "ST elevations in leads V1-V4, reciprocal changes in II, III, aVF",
          cxr: "Cardiomegaly, pulmonary vascular congestion"
        },
        correctDiagnosis: "Acute Anterior STEMI",
        differentials: ["Unstable Angina", "Aortic Dissection", "Pericarditis", "Pulmonary Embolism"]
      },
      "demo-2": { // James Wilson - Neurology
        history: {
          allergies: "No known allergies",
          medications: "None regularly. Ibuprofen PRN for occasional headaches",
          surgeries: "None",
          familyHistory: "Mother: Migraines. No family history of stroke or aneurysm",
          socialHistory: "Non-smoker, occasional alcohol, software engineer, high stress job"
        },
        vitals: { bp: "142/88", hr: "72", rr: "16", temp: "101.2F", o2: "98% RA" },
        physicalExam: {
          general: "Appears ill, photophobic, lying still in darkened room",
          neuro: "GCS 14, + Kernig sign, + Brudzinski sign, no focal deficits",
          cardiac: "Regular rhythm, no murmurs",
          skin: "No rashes, no petechiae"
        },
        labs: {
          csf: "Opening pressure 28 cmH2O, WBC 1200 (95% PMN), Protein 180, Glucose 32",
          cbc: "WBC 18.5, Hgb 14.2, Plt 198",
          bmp: "Normal except glucose 110"
        },
        imaging: {
          ctHead: "No acute intracranial abnormality, no mass effect or hemorrhage",
          mri: "Leptomeningeal enhancement"
        },
        correctDiagnosis: "Bacterial Meningitis",
        differentials: ["Viral Meningitis", "Subarachnoid Hemorrhage", "Migraine", "Encephalitis"]
      },
      "demo-3": { // Sarah Thompson - Pulmonology
        history: {
          allergies: "Sulfa drugs (hives)",
          medications: "Birth control pills",
          surgeries: "Wisdom teeth extraction",
          familyHistory: "No significant pulmonary or cardiac disease",
          socialHistory: "Non-smoker, no alcohol, works remotely, recently took long flight from Europe"
        },
        vitals: { bp: "118/76", hr: "110", rr: "24", temp: "99.1F", o2: "91% RA" },
        physicalExam: {
          general: "Tachypneic, anxious, speaking in short sentences",
          cardiac: "Tachycardic, regular, + S3 gallop",
          lungs: "Clear to auscultation bilaterally, no wheezes or crackles",
          extremities: "Right calf swelling and tenderness, + Homans sign"
        },
        labs: {
          dDimer: "4.2 mcg/mL (elevated)",
          bnp: "320 pg/mL (mildly elevated)",
          abg: "pH 7.48, pCO2 28, pO2 68, HCO3 22"
        },
        imaging: {
          ctpa: "Filling defects in right main pulmonary artery and segmental branches",
          legDoppler: "DVT in right popliteal and femoral veins"
        },
        correctDiagnosis: "Pulmonary Embolism with DVT",
        differentials: ["Pneumonia", "Anxiety/Hyperventilation", "Asthma Exacerbation", "Pneumothorax"]
      },
      "demo-4": { // Robert Garcia - Oncology
        history: {
          allergies: "No known allergies",
          medications: "Omeprazole 20mg daily",
          surgeries: "Hernia repair 10 years ago",
          familyHistory: "Father: Colon cancer at 65. Mother: Breast cancer at 72",
          socialHistory: "40 pack-year smoker (current), 2 beers daily, retired construction worker"
        },
        vitals: { bp: "128/78", hr: "88", rr: "18", temp: "100.4F", o2: "95% RA" },
        physicalExam: {
          general: "Cachectic appearing, temporal wasting",
          lymph: "Palpable supraclavicular lymph node on right",
          lungs: "Decreased breath sounds right upper lobe",
          abdomen: "Hepatomegaly 3cm below costal margin"
        },
        labs: {
          cbc: "WBC 12.1, Hgb 10.2 (low), Plt 389",
          lft: "AST 78, ALT 65, Alk Phos 312, Total Bili 1.8",
          ldh: "450 (elevated)",
          cea: "28.5 ng/mL (elevated)"
        },
        imaging: {
          ctChest: "5.2cm spiculated mass in right upper lobe with mediastinal lymphadenopathy",
          petScan: "Hypermetabolic lesions in lung, liver, and bone"
        },
        correctDiagnosis: "Stage IV Non-Small Cell Lung Cancer",
        differentials: ["Tuberculosis", "Lung Abscess", "Lymphoma", "Metastatic Cancer from Unknown Primary"]
      },
      "demo-5": { // Emily Davis - Gastroenterology
        history: {
          allergies: "Codeine (nausea)",
          medications: "Oral contraceptives, Multivitamin",
          surgeries: "None",
          familyHistory: "Mother: Gallbladder removed. No liver disease",
          socialHistory: "Social drinker (1-2 drinks/week), non-smoker, bank manager"
        },
        vitals: { bp: "108/68", hr: "102", rr: "18", temp: "101.8F", o2: "97% RA" },
        physicalExam: {
          general: "Ill-appearing, icteric sclera and skin",
          abdomen: "RUQ tenderness, + Murphy sign, mild guarding",
          skin: "Jaundiced, no spider angiomata, no palmar erythema"
        },
        labs: {
          lft: "AST 245, ALT 312, Alk Phos 456, Total Bili 8.2, Direct Bili 6.1",
          lipase: "45 (normal)",
          cbc: "WBC 16.8, Hgb 12.8, Plt 234",
          inr: "1.2"
        },
        imaging: {
          ruqUs: "Dilated CBD 12mm, common bile duct stone, gallbladder wall thickening",
          mrcp: "Choledocholithiasis with obstruction"
        },
        correctDiagnosis: "Ascending Cholangitis (Choledocholithiasis)",
        differentials: ["Acute Cholecystitis", "Hepatitis", "Pancreatitis", "Biliary Stricture"]
      },
      "demo-6": { // Michael Brown - Emergency Medicine
        history: {
          allergies: "No known allergies",
          medications: "Metoprolol 50mg BID, Warfarin 5mg daily (for Afib)",
          surgeries: "CABG x3 - 8 years ago",
          familyHistory: "Strong family history of stroke and heart disease",
          socialHistory: "Quit smoking 8 years ago after CABG, no alcohol, retired"
        },
        vitals: { bp: "188/102", hr: "88 irregular", rr: "16", temp: "98.4F", o2: "97% RA" },
        physicalExam: {
          general: "Confused, not oriented to time, following simple commands inconsistently",
          neuro: "Right facial droop, right arm drift, slurred speech, NIH Stroke Scale 12",
          cardiac: "Irregularly irregular rhythm",
          extremities: "Right-sided weakness 3/5"
        },
        labs: {
          cbc: "WBC 9.2, Hgb 14.1, Plt 212",
          bmp: "Na 141, K 4.0, Cr 1.2, Glucose 128",
          inr: "1.8 (subtherapeutic)",
          pt: "21.5 seconds"
        },
        imaging: {
          ctHead: "No acute hemorrhage",
          ctAngio: "Left MCA M1 occlusion",
          ctPerfusion: "Large penumbra, small core infarct"
        },
        correctDiagnosis: "Acute Ischemic Stroke (Left MCA Territory)",
        differentials: ["Hemorrhagic Stroke", "Todd Paralysis", "Hypoglycemia", "Complex Migraine"]
      }
    };
    return demoData[patientId] || null;
  };

  // Get patient data from demo cases OR from actual SyntheticPatient structure
  const getPatientData = () => {
    // For demo patients, use hardcoded data
    if (isDemo && patient.id?.startsWith("demo-")) {
      return getDemoPatientData(patient.id);
    }
    
    // For real synthetic patients, map their actual stored data
    const fullPatient = patient as SyntheticPatient;
    const mh = fullPatient.medicalHistory;
    const pe = fullPatient.physicalExam;
    const symptoms = fullPatient.presentingSymptoms;
    
    // Build history from structured medicalHistory object
    const history = {
      allergies: mh?.allergies?.length 
        ? mh.allergies.map(a => `${a.allergen} (${a.reaction})`).join(", ")
        : "No known allergies",
      medications: mh?.medications?.length
        ? mh.medications.map(m => `${m.name} ${m.dosage} ${m.frequency}`).join(", ")
        : "None reported",
      surgeries: mh?.surgicalHistory?.length
        ? mh.surgicalHistory.map(s => `${s.procedure} (${s.date})`).join(", ")
        : "None",
      familyHistory: mh?.familyHistory?.length
        ? mh.familyHistory.map(f => `${f.relationship}: ${f.condition}`).join(", ")
        : "Non-contributory",
      socialHistory: mh?.socialHistory
        ? `Smoking: ${mh.socialHistory.smoking?.status || "Unknown"}, Alcohol: ${mh.socialHistory.alcohol?.status || "Unknown"}, Exercise: ${mh.socialHistory.exercise || "Unknown"}`
        : "No significant social history"
    };
    
    // Build vitals from physicalExam
    const vitals = pe?.vitals ? {
      bp: pe.vitals.bloodPressure || "120/80",
      hr: pe.vitals.heartRate || "72",
      rr: pe.vitals.respiratoryRate || "16",
      temp: pe.vitals.temperature || "98.6F",
      o2: pe.vitals.oxygenSaturation || "98% RA"
    } : { bp: "120/80", hr: "72", rr: "16", temp: "98.6F", o2: "98% RA" };
    
    // Build physical exam from systems
    const physicalExam = {
      general: pe?.general?.appearance 
        ? `${pe.general.appearance}, ${pe.general.distress || "no acute distress"}`
        : "Alert and oriented, no acute distress",
      cardiac: pe?.systems?.cardiovascular 
        ? Object.values(pe.systems.cardiovascular).join(", ")
        : "Regular rate and rhythm, no murmurs",
      lungs: pe?.systems?.pulmonary
        ? Object.values(pe.systems.pulmonary).join(", ")
        : "Clear to auscultation bilaterally",
      neuro: pe?.systems?.neurological
        ? Object.values(pe.systems.neurological).join(", ")
        : "Alert and oriented x3, no focal deficits",
      abdomen: pe?.systems?.abdominal
        ? Object.values(pe.systems.abdominal).join(", ")
        : "Soft, non-tender, non-distended"
    };
    
    // Presenting symptoms summary
    const symptomsText = symptoms?.length
      ? symptoms.map(s => `${s.symptom} (severity ${s.severity}/10, ${s.duration})`).join("; ")
      : fullPatient.chiefComplaint || "Chief complaint as stated";
    
    return {
      history,
      vitals,
      physicalExam,
      labs: {
        cbc: "Order if needed",
        bmp: "Order if needed",
        lft: "Order if needed"
      },
      imaging: {
        cxr: "Order if needed",
        ekg: "Order if needed"
      },
      correctDiagnosis: "Use AI Diagnosis mode for complete analysis",
      differentials: ["Use AI Diagnosis for differential diagnosis"],
      symptomsDetail: symptomsText
    };
  };

  const patientData = getPatientData();

  const requestInfo = (category: string, item: string) => {
    const key = `${category}_${item}`;
    if (session.revealedInfo[key]) {
      toast({ title: "Already requested", description: "You already have this information." });
      return;
    }
    
    setSession(prev => ({
      ...prev,
      revealedInfo: { ...prev.revealedInfo, [key]: true },
      requestsMade: prev.requestsMade + 1,
      score: Math.max(0, prev.score - 2) // Small penalty for each request
    }));
    toast({ title: "Information revealed", description: `${item} results are now available.` });
  };

  const orderTest = (testName: string) => {
    if (session.orderedTests.includes(testName)) {
      toast({ title: "Already ordered", description: "This test has already been ordered." });
      return;
    }
    
    setSession(prev => ({
      ...prev,
      orderedTests: [...prev.orderedTests, testName],
      requestsMade: prev.requestsMade + 1,
      score: Math.max(0, prev.score - 5) // Larger penalty for ordering tests
    }));
    toast({ title: "Test ordered", description: `${testName} results are now available.` });
  };

  const submitDiagnosis = async () => {
    if (!userDiagnosis.trim()) {
      toast({ title: "Enter a diagnosis", description: "Please type your diagnosis.", variant: "destructive" });
      return;
    }

    setIsAnalyzingDiagnosis(true);
    
    // Calculate time bonus
    const timeElapsed = (Date.now() - session.startTime) / 1000 / 60; // minutes
    const timeBonus = timeElapsed < 5 ? 20 : timeElapsed < 10 ? 10 : 0;
    
    // Check diagnosis (for demo cases, compare with known answer)
    const correctDiagnosis = patientData?.correctDiagnosis || "Unknown";
    const userDiagLower = userDiagnosis.toLowerCase();
    const correctLower = correctDiagnosis.toLowerCase();
    
    const isCorrect = correctLower.includes(userDiagLower) || 
                     userDiagLower.includes(correctLower.split(" ")[0]) ||
                     (correctLower.includes("stemi") && userDiagLower.includes("mi")) ||
                     (correctLower.includes("stroke") && userDiagLower.includes("stroke")) ||
                     (correctLower.includes("embolism") && userDiagLower.includes("pe")) ||
                     (correctLower.includes("meningitis") && userDiagLower.includes("meningitis")) ||
                     (correctLower.includes("cancer") && userDiagLower.includes("cancer")) ||
                     (correctLower.includes("cholangitis") && userDiagLower.includes("cholangitis"));

    const accuracyBonus = isCorrect ? 50 : 0;
    const confidenceMultiplier = confidence / 5;
    const finalScore = Math.round((session.score + timeBonus + accuracyBonus) * confidenceMultiplier);

    setTimeout(() => {
      setDiagnosisResult({
        correct: isCorrect,
        feedback: isCorrect 
          ? `Excellent work! You correctly identified ${correctDiagnosis}. Your clinical reasoning was sound.`
          : `The correct diagnosis was ${correctDiagnosis}. Review the key findings: ${patientData?.differentials?.join(", ") || "N/A"}`,
        actualDiagnosis: correctDiagnosis
      });
      setSession(prev => ({ ...prev, score: finalScore }));
      setIsAnalyzingDiagnosis(false);
    }, 1500);
  };

  const getElapsedTime = () => {
    const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Request panels
  const historyItems = [
    { key: "allergies", label: "Allergies", icon: AlertTriangle },
    { key: "medications", label: "Medications", icon: FileText },
    { key: "surgeries", label: "Surgical History", icon: Activity },
    { key: "familyHistory", label: "Family History", icon: User },
    { key: "socialHistory", label: "Social History", icon: User }
  ];

  const examItems = [
    { key: "general", label: "General Appearance", icon: Eye },
    { key: "cardiac", label: "Cardiac Exam", icon: Heart },
    { key: "lungs", label: "Lung Exam", icon: Activity },
    { key: "neuro", label: "Neurological Exam", icon: Brain },
    { key: "abdomen", label: "Abdominal Exam", icon: Activity }
  ];

  const labTests = [
    { key: "cbc", label: "Complete Blood Count", cost: "$25" },
    { key: "bmp", label: "Basic Metabolic Panel", cost: "$35" },
    { key: "lft", label: "Liver Function Tests", cost: "$45" },
    { key: "troponin", label: "Troponin", cost: "$50" },
    { key: "bnp", label: "BNP/Pro-BNP", cost: "$60" },
    { key: "dDimer", label: "D-Dimer", cost: "$40" },
    { key: "lipase", label: "Lipase", cost: "$30" },
    { key: "csf", label: "CSF Analysis (LP)", cost: "$200" }
  ];

  const imagingTests = [
    { key: "cxr", label: "Chest X-Ray", cost: "$75" },
    { key: "ekg", label: "ECG/EKG", cost: "$50" },
    { key: "ctHead", label: "CT Head", cost: "$500" },
    { key: "ctChest", label: "CT Chest", cost: "$600" },
    { key: "ctpa", label: "CT Pulmonary Angiogram", cost: "$800" },
    { key: "ruqUs", label: "RUQ Ultrasound", cost: "$250" },
    { key: "mri", label: "MRI", cost: "$1200" }
  ];

  if (diagnosisResult) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
              diagnosisResult.correct ? "bg-green-100" : "bg-orange-100"
            } mb-4`}
          >
            {diagnosisResult.correct ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <Target className="h-10 w-10 text-orange-600" />
            )}
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {diagnosisResult.correct ? "Correct Diagnosis!" : "Keep Learning!"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Final Score: {session.score} points</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Feedback</h3>
            <p className="text-gray-700 dark:text-gray-300">{diagnosisResult.feedback}</p>
            
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-gray-500">Your Diagnosis</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{userDiagnosis}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-gray-500">Correct Answer</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{diagnosisResult.actualDiagnosis}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-gray-500">Tests Ordered</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{session.requestsMade}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-gray-500">Time Taken</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{getElapsedTime()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={onClose} className="w-full">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with patient info and score */}
      <div className="flex items-center justify-between">
        <Button onClick={onClose} variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            <Clock className="h-4 w-4 inline mr-1" />
            {getElapsedTime()}
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            Score: {session.score}
          </span>
        </div>
      </div>

      {/* Patient Brief */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">{patient.profileName}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{patient.age} yo {patient.gender}</p>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mt-1">Chief Complaint: {patient.chiefComplaint}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vitals - Always visible */}
      {patientData?.vitals && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-red-500" />
              Vital Signs
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <p className="text-gray-500">BP</p>
                <p className="font-bold">{patientData.vitals.bp}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <p className="text-gray-500">HR</p>
                <p className="font-bold">{patientData.vitals.hr}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <p className="text-gray-500">RR</p>
                <p className="font-bold">{patientData.vitals.rr}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <p className="text-gray-500">Temp</p>
                <p className="font-bold">{patientData.vitals.temp}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <p className="text-gray-500">SpO2</p>
                <p className="font-bold">{patientData.vitals.o2}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Request Panels - Tabbed Interface */}
      <div className="space-y-3">
        {/* History Tab */}
        <Card>
          <CardHeader className="py-3 cursor-pointer" onClick={() => setSession(prev => ({ ...prev, phase: prev.phase === "history" ? "initial" : "history" }))}>
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-500" />
                Patient History
              </span>
              <span className="text-xs text-gray-400">{Object.keys(session.revealedInfo).filter(k => k.startsWith("history")).length}/5</span>
            </CardTitle>
          </CardHeader>
          <AnimatePresence>
            {session.phase === "history" && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <CardContent className="pt-0 space-y-2">
                  {historyItems.map(item => {
                    const isRevealed = session.revealedInfo[`history_${item.key}`];
                    return (
                      <div key={item.key} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        {isRevealed ? (
                          <p className="text-xs text-gray-600 dark:text-gray-400 max-w-[200px] text-right">
                            {patientData?.history?.[item.key] || "No significant history"}
                          </p>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => requestInfo("history", item.key)}>
                            Ask
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Physical Exam Tab */}
        <Card>
          <CardHeader className="py-3 cursor-pointer" onClick={() => setSession(prev => ({ ...prev, phase: prev.phase === "exam" ? "initial" : "exam" }))}>
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-green-500" />
                Physical Examination
              </span>
              <span className="text-xs text-gray-400">{Object.keys(session.revealedInfo).filter(k => k.startsWith("exam")).length}/5</span>
            </CardTitle>
          </CardHeader>
          <AnimatePresence>
            {session.phase === "exam" && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <CardContent className="pt-0 space-y-2">
                  {examItems.map(item => {
                    const isRevealed = session.revealedInfo[`exam_${item.key}`];
                    return (
                      <div key={item.key} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        {isRevealed ? (
                          <p className="text-xs text-gray-600 dark:text-gray-400 max-w-[200px] text-right">
                            {patientData?.physicalExam?.[item.key] || "Within normal limits"}
                          </p>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => requestInfo("exam", item.key)}>
                            Examine
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Labs Tab */}
        <Card>
          <CardHeader className="py-3 cursor-pointer" onClick={() => setSession(prev => ({ ...prev, phase: prev.phase === "labs" ? "initial" : "labs" }))}>
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TestTube className="h-4 w-4 text-blue-500" />
                Laboratory Tests
              </span>
              <span className="text-xs text-gray-400">{session.orderedTests.filter(t => labTests.some(l => l.key === t)).length} ordered</span>
            </CardTitle>
          </CardHeader>
          <AnimatePresence>
            {session.phase === "labs" && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <CardContent className="pt-0 space-y-2">
                  {labTests.map(test => {
                    const isOrdered = session.orderedTests.includes(test.key);
                    return (
                      <div key={test.key} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <span className="text-sm">{test.label}</span>
                          <span className="text-xs text-gray-400 ml-2">{test.cost}</span>
                        </div>
                        {isOrdered ? (
                          <p className="text-xs text-gray-600 dark:text-gray-400 max-w-[180px] text-right font-medium">
                            {patientData?.labs?.[test.key] || "Pending"}
                          </p>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => orderTest(test.key)}>
                            Order
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Imaging Tab */}
        <Card>
          <CardHeader className="py-3 cursor-pointer" onClick={() => setSession(prev => ({ ...prev, phase: prev.phase === "imaging" ? "initial" : "imaging" }))}>
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-orange-500" />
                Imaging Studies
              </span>
              <span className="text-xs text-gray-400">{session.orderedTests.filter(t => imagingTests.some(i => i.key === t)).length} ordered</span>
            </CardTitle>
          </CardHeader>
          <AnimatePresence>
            {session.phase === "imaging" && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <CardContent className="pt-0 space-y-2">
                  {imagingTests.map(test => {
                    const isOrdered = session.orderedTests.includes(test.key);
                    return (
                      <div key={test.key} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <span className="text-sm">{test.label}</span>
                          <span className="text-xs text-gray-400 ml-2">{test.cost}</span>
                        </div>
                        {isOrdered ? (
                          <p className="text-xs text-gray-600 dark:text-gray-400 max-w-[180px] text-right font-medium">
                            {patientData?.imaging?.[test.key] || "Pending"}
                          </p>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => orderTest(test.key)}>
                            Order
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* Submit Diagnosis Button */}
      <Button 
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
        onClick={() => setShowDiagnosisModal(true)}
      >
        <Target className="h-4 w-4 mr-2" />
        Submit Diagnosis
      </Button>

      {/* Diagnosis Modal */}
      {showDiagnosisModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
          onClick={() => setShowDiagnosisModal(false)}
        >
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-t-3xl p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Submit Your Diagnosis</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What is your diagnosis?
              </label>
              <Input
                value={userDiagnosis}
                onChange={(e) => setUserDiagnosis(e.target.value)}
                placeholder="Enter your primary diagnosis..."
                className="text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confidence Level: {confidence}/5
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      confidence === level 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                    onClick={() => setConfidence(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={submitDiagnosis} 
                disabled={isAnalyzingDiagnosis}
                className="flex-1"
              >
                {isAnalyzingDiagnosis ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {isAnalyzingDiagnosis ? "Evaluating..." : "Submit"}
              </Button>
              <Button variant="outline" onClick={() => setShowDiagnosisModal(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

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
  const [activeView, setActiveView] = useState<"dashboard" | "create" | "analyze" | "training">("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<SyntheticPatient | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSelectedDemo, setIsSelectedDemo] = useState(false);
  
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
      await apiRequest("POST", "/api/synthetic-patients/generate", { generationType: "ai_generated" });
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
      await apiRequest("POST", "/api/synthetic-patients", {
        ...formData,
        generationType: "custom_created",
        age: parseInt(formData.age),
        complexity: parseInt(formData.complexity)
      });
      queryClient.invalidateQueries({ queryKey: ["/api/synthetic-patients"] });
      setActiveView("dashboard");
      toast({ title: "Patient Created!", description: "Custom patient profile created successfully." });
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

  // Demo patient profiles for training
  const demoPatients: Partial<SyntheticPatient>[] = [
    {
      id: "demo-1",
      profileName: "Maria Chen",
      age: 52,
      gender: "Female",
      chiefComplaint: "Crushing chest pain radiating to left arm for 45 minutes",
      complexity: 3,
      specialty: "Cardiology",
      generationType: "demo"
    },
    {
      id: "demo-2", 
      profileName: "James Wilson",
      age: 34,
      gender: "Male",
      chiefComplaint: "Severe headache with visual disturbances and neck stiffness",
      complexity: 4,
      specialty: "Neurology",
      generationType: "demo"
    },
    {
      id: "demo-3",
      profileName: "Sarah Thompson",
      age: 28,
      gender: "Female", 
      chiefComplaint: "Shortness of breath and productive cough for 5 days",
      complexity: 2,
      specialty: "Pulmonology",
      generationType: "demo"
    },
    {
      id: "demo-4",
      profileName: "Robert Garcia",
      age: 67,
      gender: "Male",
      chiefComplaint: "Progressive fatigue, weight loss, and night sweats for 2 months",
      complexity: 4,
      specialty: "Oncology",
      generationType: "demo"
    },
    {
      id: "demo-5",
      profileName: "Emily Davis",
      age: 45,
      gender: "Female",
      chiefComplaint: "Severe abdominal pain, nausea, and jaundice",
      complexity: 3,
      specialty: "Gastroenterology",
      generationType: "demo"
    },
    {
      id: "demo-6",
      profileName: "Michael Brown",
      age: 58,
      gender: "Male",
      chiefComplaint: "Sudden confusion, slurred speech, and right-sided weakness",
      complexity: 5,
      specialty: "Emergency Medicine",
      generationType: "demo"
    }
  ];

  const [showDemoPatients, setShowDemoPatients] = useState(true);

  const dashboardView = (
    <div className="space-y-6">
      {/* Welcome Hub Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-6 text-white shadow-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Medical Training Hub</h1>
                <p className="text-white/80 text-sm">Master diagnostic skills</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{patients.length}</div>
              <div className="text-white/70 text-xs">Patients</div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
              <Trophy className="h-5 w-5 mx-auto mb-1 text-amber-300" />
              <div className="text-lg font-bold">6</div>
              <div className="text-[10px] text-white/70">Demo Cases</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
              <Zap className="h-5 w-5 mx-auto mb-1 text-yellow-300" />
              <div className="text-lg font-bold">2</div>
              <div className="text-[10px] text-white/70">Modes</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
              <Target className="h-5 w-5 mx-auto mb-1 text-emerald-300" />
              <div className="text-lg font-bold">AI</div>
              <div className="text-[10px] text-white/70">Powered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selection Cards */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-purple-600" />
          Choose Your Mode
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {/* Interactive Training Mode */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-200 dark:border-emerald-700 rounded-2xl p-5 cursor-pointer"
            onClick={() => setShowDemoPatients(true)}
          >
            <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              RECOMMENDED
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Interactive Training Mode</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Step-by-step diagnostic workup. Request history, order labs, and submit your diagnosis like a real case.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-1 rounded-full">Scoring System</span>
                  <span className="bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-1 rounded-full">Learning Points</span>
                  <span className="bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-1 rounded-full">Efficiency Tracking</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Full Diagnosis Mode */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-200 dark:border-purple-700 rounded-2xl p-5 cursor-pointer"
            onClick={() => {
              if (patients.length > 0) {
                setSelectedPatient(patients[0]);
                setActiveView("analyze");
              }
            }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">AI Full Diagnosis Mode</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Get comprehensive AI-powered analysis for custom patient profiles. Complete differential diagnosis and treatment recommendations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full">Full Analysis</span>
                  <span className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full">Differentials</span>
                  <span className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full">Treatment Plan</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={generateAIPatient}
          disabled={isGenerating}
          className="h-16 flex-col space-y-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
        >
          {isGenerating ? (
            <RefreshCw className="h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
          <span className="text-xs font-medium">Generate AI Patient</span>
        </Button>
        
        <Button 
          onClick={() => setActiveView("create")}
          variant="outline"
          className="h-16 flex-col space-y-1 rounded-xl border-2"
        >
          <UserPlus className="h-5 w-5 text-emerald-600" />
          <span className="text-xs font-medium">Create Custom</span>
        </Button>
      </div>

      {/* Demo Training Cases */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Training Cases
          </h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowDemoPatients(!showDemoPatients)}
          >
            {showDemoPatients ? "Hide" : "Show"}
          </Button>
        </div>
        
        <AnimatePresence>
          {showDemoPatients && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {demoPatients.map((patient, idx) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{patient.profileName}</h4>
                            <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs rounded-full font-medium">
                              Demo
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{patient.chiefComplaint}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{patient.age} yo {patient.gender}</span>
                            <span>Complexity: {patient.complexity}/5</span>
                            <span className="text-amber-600 dark:text-amber-400 font-medium">{patient.specialty}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedPatient(patient as SyntheticPatient);
                            setIsSelectedDemo(true);
                            setActiveView("training");
                          }}
                          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                        >
                          <Stethoscope className="h-4 w-4 mr-1" />
                          Train
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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
                        variant="outline"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsSelectedDemo(false);
                          setActiveView("training");
                        }}
                      >
                        <Target className="h-4 w-4 mr-1" />
                        Train
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsSelectedDemo(false);
                          setActiveView("analyze");
                        }}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600"
                      >
                        <Brain className="h-4 w-4 mr-1" />
                        AI Diagnose
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

            {activeView === "training" && selectedPatient && (
              <motion.div
                key="training"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <InteractiveTrainingMode 
                  patient={selectedPatient} 
                  isDemo={isSelectedDemo}
                  onClose={() => {
                    setActiveView("dashboard");
                    setSelectedPatient(null);
                    setIsSelectedDemo(false);
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