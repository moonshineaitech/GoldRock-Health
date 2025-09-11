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
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
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
    color: 'text-green-600',
    bgColor: 'bg-green-100'
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
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
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
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
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
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
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
    color: 'text-teal-600',
    bgColor: 'bg-teal-100'
  }
];

export function OptionalIntakePopup({ isOpen, onClose, onSubmit, onFileUpload }: OptionalIntakePopupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OptionalIntakeData>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const currentStepData = INTAKE_STEPS.find(step => step.id === currentStep);
  const progress = (currentStep / INTAKE_STEPS.length) * 100;

  const handleInputChange = (field: keyof OptionalIntakeData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelection = (files: FileList | File[]) => {
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quick Info Capture</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Optional helper to speed up analysis</p>
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
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
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
                <div className={`w-16 h-16 ${currentStepData.bgColor} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                  <currentStepData.icon className={`h-8 w-8 ${currentStepData.color}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {currentStepData.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
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
                        ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="upload-area"
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Drop medical bill images here or click to browse
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      JPG, PNG, WebP • Max 10MB each • Up to 5 files
                    </p>
                  </div>

                  {/* Uploaded Files Preview */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Uploaded Files ({uploadedFiles.length}/5)
                      </p>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
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
                            className="w-8 h-8 p-0 text-gray-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

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
                  className="min-h-[120px] resize-none rounded-2xl border-gray-200 dark:border-gray-700"
                  data-testid={`input-${currentStepData.field}`}
                />
              ) : (
                <Input
                  value={formData[currentStepData.field] as string || ''}
                  onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
                  placeholder={currentStepData.placeholder}
                  className="h-12 rounded-2xl border-gray-200 dark:border-gray-700"
                  data-testid={`input-${currentStepData.field}`}
                />
              )}

              {/* Step-specific Tips */}
              {currentStep === 1 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">Pro Tip</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Uploading bill images is the fastest way to get accurate analysis. Our AI can extract all details automatically!
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
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
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl"
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
                  className="flex-1 h-12 rounded-2xl border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                  data-testid="start-chat"
                >
                  Start Chat
                </Button>
                <Button
                  onClick={() => handleSubmit('analysis')}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl"
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
              className="text-gray-500 hover:text-emerald-600"
              data-testid="skip-to-chat"
            >
              {hasAnyData ? 'Continue with provided info' : 'Skip and start chatting'}
            </Button>
          </div>

          {/* Success Metrics */}
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3 text-emerald-600" />
              <span>94% Success Rate</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-emerald-600" />
              <span>$12K Avg Savings</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}