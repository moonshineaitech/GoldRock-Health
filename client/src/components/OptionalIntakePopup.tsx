import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  X, 
  Upload, 
  Camera, 
  DollarSign, 
  Building2, 
  Calendar, 
  Shield, 
  FileText, 
  CheckCircle,
  Sparkles,
  Brain,
  ArrowRight,
  ArrowLeft,
  Target,
  Zap
} from "lucide-react";

interface OptionalIntakeData {
  billAmount?: string;
  providerHospital?: string;
  serviceDates?: string;
  insuranceInfo?: string;
  medicalCodes?: string;
  additionalDetails?: string;
  uploadedFiles?: File[];
}

interface OptionalIntakePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OptionalIntakeData, submissionType: 'chat' | 'analysis') => void;
  onFileUpload: (files: FileList | File[]) => void;
}

const INTAKE_STEPS = [
  {
    id: 1,
    title: 'Upload Bill Images',
    icon: Camera,
    description: 'Upload photos of your medical bills (preferred method)',
    field: 'uploadedFiles' as keyof OptionalIntakeData,
    type: 'upload' as const,
    placeholder: 'Drag & drop or click to upload medical bill images',
    required: false,
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary'
  },
  {
    id: 2,
    title: 'Bill Amount',
    icon: DollarSign,
    description: 'Total amount or disputed charges',
    field: 'billAmount' as keyof OptionalIntakeData,
    type: 'text' as const,
    placeholder: 'e.g., $15,000 or $50,000+',
    required: false,
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary'
  },
  {
    id: 3,
    title: 'Provider/Hospital',
    icon: Building2,
    description: 'Healthcare facility or provider name',
    field: 'providerHospital' as keyof OptionalIntakeData,
    type: 'text' as const,
    placeholder: 'e.g., General Hospital, Medical Center',
    required: false,
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary'
  },
  {
    id: 4,
    title: 'Service Dates',
    icon: Calendar,
    description: 'When you received medical services',
    field: 'serviceDates' as keyof OptionalIntakeData,
    type: 'text' as const,
    placeholder: 'e.g., January 2025, Last month',
    required: false,
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary'
  },
  {
    id: 5,
    title: 'Insurance Information',
    icon: Shield,
    description: 'Insurance company and claim details',
    field: 'insuranceInfo' as keyof OptionalIntakeData,
    type: 'text' as const,
    placeholder: 'e.g., Blue Cross, Claim denied',
    required: false,
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary'
  },
  {
    id: 6,
    title: 'Additional Details',
    icon: FileText,
    description: 'Any other concerns or information',
    field: 'additionalDetails' as keyof OptionalIntakeData,
    type: 'textarea' as const,
    placeholder: 'e.g., Duplicate charges, Services not received, Emergency room overcharge',
    required: false,
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary'
  }
];

export function OptionalIntakePopup({ isOpen, onClose, onSubmit, onFileUpload }: OptionalIntakePopupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OptionalIntakeData>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [dataConsent, setDataConsent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const currentStepData = INTAKE_STEPS.find(step => step.id === currentStep);
  const progress = (currentStep / INTAKE_STEPS.length) * 100;

  const handleInputChange = (field: keyof OptionalIntakeData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelection = (files: FileList | File[]) => {
    // Check for data consent first
    if (!dataConsent) {
      toast({
        title: "Data processing consent required",
        description: "Please check the consent box to confirm you understand how your data will be processed before uploading files.",
        variant: "destructive",
      });
      return;
    }

    const fileArray = Array.from(files);
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = fileArray.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload only JPG, PNG, or WebP image files.",
        variant: "destructive",
      });
      return;
    }

    // Validate file sizes (max 10MB each)
    const oversizedFiles = fileArray.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: "Each image must be under 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFiles(prev => [...prev, ...fileArray].slice(0, 5));
    setFormData(prev => ({ ...prev, uploadedFiles: [...(prev.uploadedFiles || []), ...fileArray].slice(0, 5) }));
    
    toast({
      title: "✅ Files uploaded!",
      description: `${fileArray.length} medical bill image${fileArray.length > 1 ? 's' : ''} added successfully.`,
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ 
      ...prev, 
      uploadedFiles: (prev.uploadedFiles || []).filter((_, i) => i !== index) 
    }));
  };

  const nextStep = () => {
    if (currentStep < INTAKE_STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = (submissionType: 'chat' | 'analysis') => {
    // Upload files first if any
    if (uploadedFiles.length > 0) {
      onFileUpload(uploadedFiles);
    }
    
    onSubmit(formData, submissionType);
    onClose();
  };

  const hasAnyData = Object.values(formData).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value && value.toString().trim() !== '';
  });

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-card rounded-3xl w-full max-w-lg shadow-xl border border-border max-h-[90vh] overflow-hidden mb-20"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-foreground">Quick Info Capture</h2>
              <p className="text-sm text-muted-foreground">Optional helper to speed up analysis</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0 rounded-xl"
            data-testid="close-popup"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep} of {INTAKE_STEPS.length}
            </span>
            <Badge variant="secondary" className="text-xs">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="p-6 flex-1 overflow-y-auto max-h-[calc(90vh-200px)]">
          {currentStepData && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-3">
                <div className={`w-16 h-16 ${currentStepData.bgColor} rounded-2xl flex items-center justify-center mx-auto shadow-sm`}>
                  <currentStepData.icon className={`h-8 w-8 ${currentStepData.color}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-foreground mb-1">
                    {currentStepData.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentStepData.description}
                  </p>
                </div>
              </div>

              {currentStepData.type === 'upload' ? (
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                      dragActive 
                        ? 'border-gold bg-secondary' 
                        : 'border-border hover:border-gold hover:bg-secondary'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="upload-area"
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">
                      Drop medical bill images here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, WebP • Max 10MB each • Up to 5 files
                    </p>
                  </div>

                  {/* Uploaded Files Preview */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        Uploaded Files ({uploadedFiles.length}/5)
                      </p>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-card border border-border rounded-lg flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                                {file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(1)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="w-8 h-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Data Consent Checkbox */}
                  <div className="bg-secondary border border-border rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="data-consent-checkbox"
                        checked={dataConsent}
                        onChange={(e) => setDataConsent(e.target.checked)}
                        className="mt-1 w-4 h-4 bg-card border-2 border-border rounded focus:ring-2 focus:ring-ring"
                        style={{ accentColor: 'var(--gold)' }}
                        data-testid="data-consent-checkbox"
                      />
                      <div className="flex-1">
                        <label htmlFor="data-consent-checkbox" className="text-sm font-medium text-foreground cursor-pointer">
                          I understand my data processing
                        </label>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          I understand that my uploaded medical bill images will be processed by AI systems (including OpenAI) to analyze and identify potential billing errors, overcharges, and savings opportunities. My data will be handled securely and retained for 30 days maximum.
                        </p>
                      </div>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileSelection(e.target.files)}
                    data-testid="file-input-popup"
                  />
                </div>
              ) : currentStepData.type === 'textarea' ? (
                <Textarea
                  value={formData[currentStepData.field] as string || ''}
                  onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
                  placeholder={currentStepData.placeholder}
                  className="min-h-[120px] resize-none rounded-2xl border-border"
                  data-testid={`input-${currentStepData.field}`}
                />
              ) : (
                <Input
                  value={formData[currentStepData.field] as string || ''}
                  onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
                  placeholder={currentStepData.placeholder}
                  className="h-12 rounded-2xl border-border"
                  data-testid={`input-${currentStepData.field}`}
                />
              )}

              {/* Step-specific Tips */}
              {currentStep === 1 && (
                <div className="bg-secondary border border-border rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-gold" />
                    <span className="text-sm font-semibold text-foreground">Pro Tip</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Uploading bill images is the fastest way to get accurate analysis. Our AI can extract all details automatically!
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-border space-y-4">
          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="outline"
              className="flex-1 h-12 rounded-2xl"
              data-testid="prev-step"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < INTAKE_STEPS.length ? (
              <Button
                onClick={nextStep}
                className="flex-1 h-12 bg-primary text-primary-foreground hover:opacity-90 rounded-2xl"
                data-testid="next-step"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <div className="flex gap-2 flex-1">
                <Button
                  onClick={() => handleSubmit('chat')}
                  variant="outline"
                  className="flex-1 h-12 rounded-2xl border-border text-foreground hover:bg-secondary"
                  data-testid="start-chat"
                >
                  Start Chat
                </Button>
                <Button
                  onClick={() => handleSubmit('analysis')}
                  className="flex-1 h-12 text-white rounded-2xl hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
                  data-testid="run-analysis"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Run Analysis
                </Button>
              </div>
            )}
          </div>

          {/* Skip Options */}
          <div className="text-center">
            <Button
              onClick={() => handleSubmit('chat')}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              data-testid="skip-to-chat"
            >
              {hasAnyData ? 'Continue with provided info' : 'Skip and start chatting'}
            </Button>
          </div>

          {/* Success Metrics */}
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3 text-gold" />
              <span>94% Success Rate</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-gold" />
              <span>$12K Avg Savings</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}