import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MobileLayout } from "@/components/mobile-layout";
import { useAuth } from "@/hooks/useAuth";
import { useVoice } from "@/hooks/use-voice";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Heart,
  Users,
  DollarSign,
  FileText,
  Mic,
  MicOff,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertTriangle,
  Info,
  Loader2,
  Building,
  Baby,
  Stethoscope,
  Pill,
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Volume2,
  RefreshCw
} from "lucide-react";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

const programTypes = [
  {
    id: "medicare_a",
    title: "Medicare Part A",
    subtitle: "Hospital Insurance",
    description: "Covers inpatient hospital stays, skilled nursing facility care, hospice care, and some home health care.",
    qualifies: "65+ years old, or under 65 with certain disabilities or ESRD",
    icon: Building,
    color: "from-blue-500 to-blue-600",
    emoji: "🏥"
  },
  {
    id: "medicare_b",
    title: "Medicare Part B",
    subtitle: "Medical Insurance",
    description: "Covers doctor visits, outpatient care, preventive services, and medical supplies.",
    qualifies: "65+ years old, or under 65 with certain disabilities",
    icon: Stethoscope,
    color: "from-emerald-500 to-emerald-600",
    emoji: "👨‍⚕️"
  },
  {
    id: "medicare_c",
    title: "Medicare Part C",
    subtitle: "Medicare Advantage",
    description: "Private insurance plans that combine Part A and Part B benefits, often with prescription drug coverage.",
    qualifies: "Must have Medicare Parts A and B",
    icon: Shield,
    color: "from-purple-500 to-purple-600",
    emoji: "⭐"
  },
  {
    id: "medicare_d",
    title: "Medicare Part D",
    subtitle: "Prescription Drug Coverage",
    description: "Helps cover the cost of prescription drugs, including many recommended vaccines.",
    qualifies: "Must have Medicare Part A and/or Part B",
    icon: Pill,
    color: "from-pink-500 to-pink-600",
    emoji: "💊"
  },
  {
    id: "medicaid",
    title: "Medicaid",
    subtitle: "Low-Income Healthcare",
    description: "Free or low-cost health coverage for eligible low-income adults, children, pregnant women, elderly adults, and people with disabilities.",
    qualifies: "Income below certain thresholds (varies by state)",
    icon: Heart,
    color: "from-rose-500 to-rose-600",
    emoji: "❤️"
  },
  {
    id: "chip",
    title: "CHIP",
    subtitle: "Children's Health Insurance",
    description: "Low-cost health coverage for children in families that earn too much money to qualify for Medicaid.",
    qualifies: "Children under 19 in families with income too high for Medicaid",
    icon: Baby,
    color: "from-amber-500 to-amber-600",
    emoji: "👶"
  },
  {
    id: "marketplace",
    title: "Health Insurance Marketplace",
    subtitle: "ACA Coverage",
    description: "Compare and shop for health plans, potentially with financial help to lower costs.",
    qualifies: "U.S. citizens and legal residents not eligible for Medicare",
    icon: DollarSign,
    color: "from-teal-500 to-teal-600",
    emoji: "🛒"
  }
];

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  ssnLast4: z.string().length(4, "Enter last 4 digits of SSN").regex(/^\d{4}$/, "Must be 4 digits"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Valid ZIP code required")
});

const eligibilitySchema = z.object({
  age: z.string().min(1, "Age is required"),
  annualIncome: z.string().min(1, "Annual income is required"),
  householdSize: z.string().min(1, "Household size is required"),
  currentCoverage: z.string().min(1, "Current coverage status is required"),
  hasDisability: z.string().min(1, "Disability status is required"),
  isPregnant: z.string().min(1, "Pregnancy status is required"),
  isVeteran: z.string().min(1, "Veteran status is required"),
  employmentStatus: z.string().min(1, "Employment status is required")
});

type PersonalInfoData = z.infer<typeof personalInfoSchema>;
type EligibilityData = z.infer<typeof eligibilitySchema>;

interface EligibilityResult {
  eligible: boolean;
  programId: string;
  reasoning: string;
  recommendedPrograms: Array<{
    id: string;
    name: string;
    reason: string;
    eligibilityScore: number;
  }>;
  nextSteps: string[];
  estimatedPremium?: string;
  enrollmentDeadline?: string;
}

interface EnrollmentSession {
  id: string;
  programId: string;
  currentStep: number;
  personalInfo?: PersonalInfoData;
  eligibilityInfo?: EligibilityData;
  eligibilityResult?: EligibilityResult;
  createdAt: string;
  updatedAt: string;
  status: "in_progress" | "completed" | "submitted";
}

const steps = [
  { id: "program", title: "Program", icon: ClipboardList },
  { id: "personal", title: "Personal Info", icon: Users },
  { id: "eligibility", title: "Eligibility", icon: FileText },
  { id: "results", title: "AI Check", icon: Shield },
  { id: "review", title: "Review", icon: Check }
];

export default function Enrollment() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showSessionList, setShowSessionList] = useState(false);

  const { isListening, isSupported, transcript, startListening, stopListening, resetTranscript } = useVoice({
    continuous: false,
    interimResults: true
  });

  const personalForm = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "", lastName: "", dateOfBirth: "", ssnLast4: "",
      email: "", phone: "", address: "", city: "", state: "", zipCode: ""
    }
  });

  const eligibilityForm = useForm<EligibilityData>({
    resolver: zodResolver(eligibilitySchema),
    defaultValues: {
      age: "", annualIncome: "", householdSize: "", currentCoverage: "",
      hasDisability: "", isPregnant: "", isVeteran: "", employmentStatus: ""
    }
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery<EnrollmentSession[]>({
    queryKey: ['/api/enrollment/sessions'],
    enabled: !!user
  });

  const eligibilityMutation = useMutation({
    mutationFn: async (data: { programId: string; personalInfo: PersonalInfoData; eligibilityInfo: EligibilityData }) => {
      const res = await apiRequest('/api/enrollment/eligibility-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    onSuccess: (result: EligibilityResult) => {
      setEligibilityResult(result);
      setCurrentStep(3);
      saveSession();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to check eligibility. Please try again.",
        variant: "destructive"
      });
    }
  });

  const saveSessionMutation = useMutation({
    mutationFn: async (data: Partial<EnrollmentSession>) => {
      if (sessionId) {
        const res = await apiRequest(`/api/enrollment/sessions/${sessionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return res.json();
      } else {
        const res = await apiRequest('/api/enrollment/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return res.json();
      }
    },
    onSuccess: (result) => {
      if (!sessionId && result.id) {
        setSessionId(result.id);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/enrollment/sessions'] });
    }
  });

  const saveSession = () => {
    saveSessionMutation.mutate({
      programId: selectedProgram || undefined,
      currentStep,
      personalInfo: personalForm.getValues(),
      eligibilityInfo: eligibilityForm.getValues(),
      eligibilityResult: eligibilityResult || undefined,
      status: currentStep === 4 ? "completed" : "in_progress"
    });
  };

  useEffect(() => {
    if (transcript && activeField && voiceEnabled) {
      const formattedTranscript = transcript.trim();
      if (currentStep === 1) {
        personalForm.setValue(activeField as keyof PersonalInfoData, formattedTranscript);
      } else if (currentStep === 2) {
        eligibilityForm.setValue(activeField as keyof EligibilityData, formattedTranscript);
      }
    }
  }, [transcript, activeField, voiceEnabled, currentStep]);

  const handleVoiceInput = (fieldName: string) => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Voice input is not supported in this browser.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      stopListening();
      setActiveField(null);
    } else {
      setActiveField(fieldName);
      resetTranscript();
      startListening();
    }
  };

  const resumeSession = (session: EnrollmentSession) => {
    setSessionId(session.id);
    setSelectedProgram(session.programId);
    setCurrentStep(session.currentStep);
    if (session.personalInfo) {
      Object.entries(session.personalInfo).forEach(([key, value]) => {
        personalForm.setValue(key as keyof PersonalInfoData, value);
      });
    }
    if (session.eligibilityInfo) {
      Object.entries(session.eligibilityInfo).forEach(([key, value]) => {
        eligibilityForm.setValue(key as keyof EligibilityData, value);
      });
    }
    if (session.eligibilityResult) {
      setEligibilityResult(session.eligibilityResult);
    }
    setShowSessionList(false);
  };

  const handleProgramSelect = (programId: string) => {
    setSelectedProgram(programId);
    setCurrentStep(1);
    saveSession();
  };

  const handlePersonalNext = async () => {
    const isValid = await personalForm.trigger();
    if (isValid) {
      setCurrentStep(2);
      saveSession();
    }
  };

  const handleEligibilitySubmit = async () => {
    const isValid = await eligibilityForm.trigger();
    if (isValid && selectedProgram) {
      eligibilityMutation.mutate({
        programId: selectedProgram,
        personalInfo: personalForm.getValues(),
        eligibilityInfo: eligibilityForm.getValues()
      });
    }
  };

  const VoiceInputButton = ({ fieldName }: { fieldName: string }) => {
    if (!voiceEnabled) return null;
    const isActiveField = activeField === fieldName && isListening;
    
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => handleVoiceInput(fieldName)}
        className={`ml-2 ${isActiveField ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}
        data-testid={`voice-input-${fieldName}`}
      >
        {isActiveField ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </Button>
    );
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <MobileLayout title="Enrollment" showBackButton={true}>
      <div className="space-y-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="page-title">
            Medicare & Medicaid Enrollment
          </h1>
          <p className="text-gray-600 mb-3" data-testid="page-subtitle">
            We help you navigate government healthcare programs
          </p>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200" data-testid="disclaimer-badge">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Educational assistance only - not official government enrollment
          </Badge>
        </motion.div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Step {currentStep + 1} of {steps.length}</span>
            <div className="flex items-center gap-2">
              <Label htmlFor="voice-toggle" className="text-sm text-gray-600">
                <Volume2 className="w-4 h-4 inline mr-1" />
                Voice Input
              </Label>
              <Switch
                id="voice-toggle"
                checked={voiceEnabled}
                onCheckedChange={setVoiceEnabled}
                disabled={!isSupported}
                data-testid="voice-toggle"
              />
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" data-testid="progress-bar" />
          <div className="flex justify-between">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${idx <= currentStep ? 'text-emerald-600' : 'text-gray-400'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                  ${idx < currentStep ? 'bg-emerald-500 text-white' : 
                    idx === currentStep ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500' : 
                    'bg-gray-100 text-gray-400'}`}
                >
                  {idx < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {sessions && sessions.length > 0 && currentStep === 0 && !showSessionList && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    You have {sessions.filter(s => s.status === 'in_progress').length} incomplete session(s)
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSessionList(true)}
                  className="text-blue-600 border-blue-300"
                  data-testid="view-sessions-button"
                >
                  Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {showSessionList && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Your Sessions</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSessionList(false)}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            </div>
            {sessions?.map((session) => {
              const program = programTypes.find(p => p.id === session.programId);
              return (
                <Card key={session.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => resumeSession(session)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{program?.title || 'Unknown Program'}</p>
                        <p className="text-sm text-gray-500">
                          Step {session.currentStep + 1} • {new Date(session.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                        {session.status === 'completed' ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {currentStep === 0 && !showSessionList && (
            <motion.div
              key="program-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-gray-900" data-testid="step-title">
                Select a Healthcare Program
              </h2>
              <p className="text-sm text-gray-600">
                Choose the program you'd like to explore. We'll help determine your eligibility.
              </p>
              
              <div className="grid gap-3">
                {programTypes.map((program, idx) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedProgram === program.id ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
                      }`}
                      onClick={() => handleProgramSelect(program.id)}
                      data-testid={`program-card-${program.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                            <span className="text-xl">{program.emoji}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{program.title}</h3>
                              <Badge variant="outline" className="text-xs">{program.subtitle}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{program.description}</p>
                            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                              <Info className="w-3 h-3" />
                              <span>{program.qualifies}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="personal-info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-gray-900" data-testid="step-title">
                Personal Information
              </h2>
              <p className="text-sm text-gray-600">
                Please provide your information. This is kept secure and confidential.
              </p>

              <Form {...personalForm}>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={personalForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            First Name
                            <VoiceInputButton fieldName="firstName" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="John" data-testid="input-firstName" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            Last Name
                            <VoiceInputButton fieldName="lastName" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Doe" data-testid="input-lastName" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={personalForm.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" data-testid="input-dateOfBirth" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalForm.control}
                      name="ssnLast4"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            SSN (Last 4)
                            <VoiceInputButton fieldName="ssnLast4" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} maxLength={4} placeholder="1234" data-testid="input-ssnLast4" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={personalForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Email
                          <VoiceInputButton fieldName="email" />
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="john@example.com" data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personalForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Phone
                          <VoiceInputButton fieldName="phone" />
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" placeholder="(555) 555-5555" data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personalForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Street Address
                          <VoiceInputButton fieldName="address" />
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="123 Main St" data-testid="input-address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={personalForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            City
                            <VoiceInputButton fieldName="city" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="New York" data-testid="input-city" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-state">
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {US_STATES.map((state) => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={personalForm.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          ZIP Code
                          <VoiceInputButton fieldName="zipCode" />
                        </FormLabel>
                        <FormControl>
                          <Input {...field} maxLength={5} placeholder="10001" data-testid="input-zipCode" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(0)}
                  className="flex-1"
                  data-testid="button-back"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  onClick={handlePersonalNext}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  data-testid="button-next"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="eligibility"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-gray-900" data-testid="step-title">
                Eligibility Questions
              </h2>
              <p className="text-sm text-gray-600">
                Answer these questions to help us determine your eligibility.
              </p>

              <Form {...eligibilityForm}>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={eligibilityForm.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            Age
                            <VoiceInputButton fieldName="age" />
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="65" data-testid="input-age" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={eligibilityForm.control}
                      name="householdSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Household Size</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-householdSize">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                <SelectItem key={n} value={n.toString()}>{n} {n === 1 ? 'person' : 'people'}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={eligibilityForm.control}
                    name="annualIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Annual Household Income
                          <VoiceInputButton fieldName="annualIncome" />
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-annualIncome">
                              <SelectValue placeholder="Select income range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="under_15000">Under $15,000</SelectItem>
                            <SelectItem value="15000_25000">$15,000 - $25,000</SelectItem>
                            <SelectItem value="25000_40000">$25,000 - $40,000</SelectItem>
                            <SelectItem value="40000_60000">$40,000 - $60,000</SelectItem>
                            <SelectItem value="60000_80000">$60,000 - $80,000</SelectItem>
                            <SelectItem value="80000_100000">$80,000 - $100,000</SelectItem>
                            <SelectItem value="over_100000">Over $100,000</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={eligibilityForm.control}
                    name="currentCoverage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Health Coverage</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-currentCoverage">
                              <SelectValue placeholder="Select current coverage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No current coverage</SelectItem>
                            <SelectItem value="employer">Employer-sponsored</SelectItem>
                            <SelectItem value="marketplace">Marketplace/ACA</SelectItem>
                            <SelectItem value="medicare">Medicare</SelectItem>
                            <SelectItem value="medicaid">Medicaid</SelectItem>
                            <SelectItem value="military">Military/VA</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={eligibilityForm.control}
                    name="employmentStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-employmentStatus">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="employed_full">Employed Full-time</SelectItem>
                            <SelectItem value="employed_part">Employed Part-time</SelectItem>
                            <SelectItem value="self_employed">Self-employed</SelectItem>
                            <SelectItem value="unemployed">Unemployed</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={eligibilityForm.control}
                      name="hasDisability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disability Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-hasDisability">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="no">No disability</SelectItem>
                              <SelectItem value="yes">Have a disability</SelectItem>
                              <SelectItem value="ssdi">Receiving SSDI</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={eligibilityForm.control}
                      name="isPregnant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pregnant</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-isPregnant">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="yes">Yes</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={eligibilityForm.control}
                    name="isVeteran"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Veteran Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-isVeteran">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="no">Not a veteran</SelectItem>
                            <SelectItem value="yes">Veteran</SelectItem>
                            <SelectItem value="active">Active duty</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1"
                  data-testid="button-back"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  onClick={handleEligibilitySubmit}
                  disabled={eligibilityMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  data-testid="button-check-eligibility"
                >
                  {eligibilityMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      Check Eligibility <Shield className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && eligibilityResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-gray-900" data-testid="step-title">
                AI Eligibility Assessment
              </h2>

              <Card className={`border-2 ${eligibilityResult.eligible ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${eligibilityResult.eligible ? 'bg-green-100' : 'bg-amber-100'}`}>
                      {eligibilityResult.eligible ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-8 h-8 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${eligibilityResult.eligible ? 'text-green-800' : 'text-amber-800'}`} data-testid="eligibility-status">
                        {eligibilityResult.eligible ? 'Likely Eligible' : 'May Not Qualify'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        for {programTypes.find(p => p.id === eligibilityResult.programId)?.title}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700" data-testid="eligibility-reasoning">{eligibilityResult.reasoning}</p>
                </CardContent>
              </Card>

              {eligibilityResult.recommendedPrograms && eligibilityResult.recommendedPrograms.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">
                    <Info className="w-4 h-4 inline mr-1" />
                    Recommended Programs
                  </h3>
                  {eligibilityResult.recommendedPrograms.map((rec, idx) => (
                    <Card key={idx} className="bg-blue-50 border-blue-200" data-testid={`recommendation-${idx}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-blue-900">{rec.name}</span>
                          <Badge className="bg-blue-100 text-blue-700">
                            {rec.eligibilityScore}% match
                          </Badge>
                        </div>
                        <p className="text-sm text-blue-700">{rec.reason}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  <ArrowRight className="w-4 h-4 inline mr-1" />
                  Next Steps
                </h3>
                <div className="space-y-2">
                  {eligibilityResult.nextSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg" data-testid={`next-step-${idx}`}>
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {eligibilityResult.enrollmentDeadline && (
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-purple-800">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Enrollment Deadline: {eligibilityResult.enrollmentDeadline}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1"
                  data-testid="button-back"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Revise Answers
                </Button>
                <Button
                  onClick={() => setCurrentStep(4)}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  data-testid="button-review"
                >
                  Review & Submit <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-gray-900" data-testid="step-title">
                Review Your Information
              </h2>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    Selected Program
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-gray-900">
                    {programTypes.find(p => p.id === selectedProgram)?.title}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <p className="font-medium">{personalForm.getValues('firstName')} {personalForm.getValues('lastName')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">DOB:</span>
                      <p className="font-medium">{personalForm.getValues('dateOfBirth')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium">{personalForm.getValues('email')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="font-medium">{personalForm.getValues('phone')}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Address:</span>
                    <p className="font-medium">
                      {personalForm.getValues('address')}, {personalForm.getValues('city')}, {personalForm.getValues('state')} {personalForm.getValues('zipCode')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-500" />
                    Eligibility Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-500">Age:</span>
                      <p className="font-medium">{eligibilityForm.getValues('age')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Household:</span>
                      <p className="font-medium">{eligibilityForm.getValues('householdSize')} person(s)</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Income:</span>
                      <p className="font-medium">{eligibilityForm.getValues('annualIncome')?.replace(/_/g, ' - $')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Employment:</span>
                      <p className="font-medium">{eligibilityForm.getValues('employmentStatus')?.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {eligibilityResult && (
                <Card className={eligibilityResult.eligible ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      {eligibilityResult.eligible ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      )}
                      <span className={`font-medium ${eligibilityResult.eligible ? 'text-green-800' : 'text-amber-800'}`}>
                        Eligibility: {eligibilityResult.eligible ? 'Likely Eligible' : 'May Not Qualify'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Important Notice</p>
                      <p>
                        This assessment is for educational purposes only. Final eligibility determination 
                        is made by the official government agencies. We recommend visiting the official 
                        websites or contacting your local Social Security office.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1"
                  data-testid="button-back"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  onClick={() => {
                    saveSession();
                    toast({
                      title: "Session Saved",
                      description: "Your enrollment information has been saved. Visit official government sites to complete enrollment."
                    });
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  data-testid="button-save-complete"
                >
                  <Check className="w-4 h-4 mr-1" /> Save & Complete
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {voiceEnabled && isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-24 left-4 right-4 bg-white rounded-xl shadow-2xl border p-4 z-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <Mic className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Listening...</p>
                <p className="text-sm text-gray-600 truncate">{transcript || 'Speak now'}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={stopListening} data-testid="stop-listening">
                <XCircle className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </MobileLayout>
  );
}
