import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { 
  Camera, 
  DollarSign, 
  Building2, 
  Shield, 
  Calendar, 
  FileText,
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  Sparkles
} from "lucide-react";

interface IntakeData {
  billImages?: File[];
  totalAmount?: string;
  providerName?: string;
  insuranceCompany?: string;
  serviceDate?: string;
  cptCodes?: string;
}

interface GuidedIntakeWizardProps {
  onComplete: (data: IntakeData) => void;
  onSkip: () => void;
}

const steps = [
  {
    id: "photo",
    title: "Upload Your Bill",
    subtitle: "Photos work best for accurate analysis",
    icon: Camera,
    emoji: "📸"
  },
  {
    id: "amount",
    title: "Bill Amount",
    subtitle: "What's the total you owe?",
    icon: DollarSign,
    emoji: "💰"
  },
  {
    id: "provider",
    title: "Provider Name",
    subtitle: "Hospital, clinic, or doctor's office",
    icon: Building2,
    emoji: "🏥"
  },
  {
    id: "insurance",
    title: "Insurance",
    subtitle: "Which insurance do you have?",
    icon: Shield,
    emoji: "🛡️"
  },
  {
    id: "date",
    title: "Service Date",
    subtitle: "When did you receive care?",
    icon: Calendar,
    emoji: "📅"
  },
  {
    id: "codes",
    title: "Billing Codes",
    subtitle: "Optional: CPT or procedure codes",
    icon: FileText,
    emoji: "📋"
  }
];

export function GuidedIntakeWizard({ onComplete, onSkip }: GuidedIntakeWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [intakeData, setIntakeData] = useState<IntakeData>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(intakeData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files).slice(0, 5);
      setSelectedFiles(fileArray);
      setIntakeData({ ...intakeData, billImages: fileArray });
    }
  };

  const canProceed = () => {
    switch (step.id) {
      case "photo":
        return true; // Optional
      case "amount":
        return !!intakeData.totalAmount;
      case "provider":
        return !!intakeData.providerName;
      default:
        return true; // Other fields are optional
    }
  };

  const renderStepContent = () => {
    switch (step.id) {
      case "photo":
        return (
          <div className="space-y-4">
            <label className="block">
              <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-8 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  data-testid="intake-file-input"
                />
                <Upload className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
                <p className="text-gray-700 font-medium">Tap to upload bill photos</p>
                <p className="text-sm text-gray-500 mt-1">Up to 5 images</p>
              </div>
            </label>
            {selectedFiles.length > 0 && (
              <div className="bg-emerald-50 rounded-xl p-3">
                <p className="text-emerald-700 font-medium">
                  ✓ {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                </p>
              </div>
            )}
            <p className="text-center text-sm text-gray-500">
              No bill handy? No problem, you can skip this
            </p>
          </div>
        );

      case "amount":
        return (
          <div className="space-y-4">
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="number"
                placeholder="Enter amount"
                value={intakeData.totalAmount || ""}
                onChange={(e) => setIntakeData({ ...intakeData, totalAmount: e.target.value })}
                className="pl-12 h-14 text-xl rounded-xl border-2 focus:border-emerald-500"
                data-testid="intake-amount-input"
              />
            </div>
            <p className="text-center text-sm text-gray-500">
              Your total patient responsibility amount
            </p>
          </div>
        );

      case "provider":
        return (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="e.g., Memorial Hospital"
              value={intakeData.providerName || ""}
              onChange={(e) => setIntakeData({ ...intakeData, providerName: e.target.value })}
              className="h-14 text-lg rounded-xl border-2 focus:border-emerald-500"
              data-testid="intake-provider-input"
            />
            <p className="text-center text-sm text-gray-500">
              The name on your bill
            </p>
          </div>
        );

      case "insurance":
        return (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="e.g., Blue Cross Blue Shield"
              value={intakeData.insuranceCompany || ""}
              onChange={(e) => setIntakeData({ ...intakeData, insuranceCompany: e.target.value })}
              className="h-14 text-lg rounded-xl border-2 focus:border-emerald-500"
              data-testid="intake-insurance-input"
            />
            <p className="text-center text-sm text-gray-500">
              Or "self-pay" if uninsured
            </p>
          </div>
        );

      case "date":
        return (
          <div className="space-y-4">
            <Input
              type="date"
              value={intakeData.serviceDate || ""}
              onChange={(e) => setIntakeData({ ...intakeData, serviceDate: e.target.value })}
              className="h-14 text-lg rounded-xl border-2 focus:border-emerald-500"
              data-testid="intake-date-input"
            />
            <p className="text-center text-sm text-gray-500">
              Approximate date is fine
            </p>
          </div>
        );

      case "codes":
        return (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="e.g., 99213, 36415"
              value={intakeData.cptCodes || ""}
              onChange={(e) => setIntakeData({ ...intakeData, cptCodes: e.target.value })}
              className="h-14 text-lg rounded-xl border-2 focus:border-emerald-500"
              data-testid="intake-codes-input"
            />
            <p className="text-center text-sm text-gray-500">
              These are usually on itemized bills. Skip if unsure.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-700"
            data-testid="intake-skip-button"
          >
            Skip to chat
          </Button>
        </div>
        <Progress value={progress} className="h-2 bg-gray-100" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 rounded-2xl border-0 shadow-lg bg-white">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                <span className="text-3xl">{step.emoji}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{step.title}</h2>
              <p className="text-gray-500 mt-1">{step.subtitle}</p>
            </div>

            <div className="min-h-[160px]">
              {renderStepContent()}
            </div>

            <div className="flex gap-3 mt-6">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 h-12 rounded-xl"
                  data-testid="intake-back-button"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
                data-testid="intake-next-button"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-1" />
                    Start Analysis
                  </>
                ) : (
                  <>
                    {step.id === "photo" && selectedFiles.length === 0 ? "Skip" : "Next"}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-2 mt-6">
        {steps.map((s, idx) => (
          <div
            key={s.id}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentStep
                ? "bg-emerald-500 w-6"
                : idx < currentStep
                ? "bg-emerald-300"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
