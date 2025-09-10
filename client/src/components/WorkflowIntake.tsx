import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Send, Upload } from "lucide-react";
import type { BillWorkflow, WorkflowField } from "@shared/bill-ai-workflows";

interface WorkflowIntakeProps {
  workflow: BillWorkflow;
  onComplete: (data: Record<string, any>, finalMessage: string) => void;
  onBack: () => void;
}

export function WorkflowIntake({ workflow, onComplete, onBack }: WorkflowIntakeProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Group fields into logical steps for better UX
  const fieldSteps = workflow.intakeFields.reduce((steps, field, index) => {
    const stepIndex = Math.floor(index / 3); // 3 fields per step max
    if (!steps[stepIndex]) steps[stepIndex] = [];
    steps[stepIndex].push(field);
    return steps;
  }, [] as WorkflowField[][]);

  const currentFields = fieldSteps[currentStep] || [];
  const progress = ((currentStep + 1) / fieldSteps.length) * 100;
  const isLastStep = currentStep === fieldSteps.length - 1;

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const validateCurrentStep = () => {
    for (const field of currentFields) {
      if (field.required && !formData[field.id]) {
        toast({
          title: "Required Field Missing",
          description: `Please fill in ${field.label}`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const handleComplete = async () => {
    if (!validateCurrentStep()) return;
    
    setIsProcessing(true);

    try {
      // Generate the final message using the workflow template
      let finalMessage = workflow.userPromptTemplate;
      
      // Replace template variables with form data
      Object.entries(formData).forEach(([key, value]) => {
        const regex = new RegExp(`{${key}}`, 'g');
        finalMessage = finalMessage.replace(regex, String(value || ''));
      });

      // Clean up any remaining unreplaced template variables
      finalMessage = finalMessage.replace(/{[^}]+}/g, '[Not provided]');

      onComplete(formData, finalMessage);
    } catch (error) {
      toast({
        title: "Error Processing Request",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderField = (field: WorkflowField) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
        return (
          <Input
            id={field.id}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full"
            data-testid={`input-${field.id}`}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full h-24 resize-none"
            data-testid={`textarea-${field.id}`}
          />
        );
      
      case 'select':
        return (
          <Select value={value} onValueChange={(val) => handleFieldChange(field.id, val)}>
            <SelectTrigger className="w-full" data-testid={`select-${field.id}`}>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'number':
        return (
          <Input
            id={field.id}
            type="number"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full"
            data-testid={`number-${field.id}`}
          />
        );
      
      case 'date':
        return (
          <Input
            id={field.id}
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full"
            data-testid={`date-${field.id}`}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value === true}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
              data-testid={`checkbox-${field.id}`}
            />
            <Label htmlFor={field.id} className="text-sm text-gray-600">
              {field.description || field.label}
            </Label>
          </div>
        );
      
      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">{field.description || 'Upload file'}</p>
            <Input
              id={field.id}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFieldChange(field.id, file);
                }
              }}
              data-testid={`file-${field.id}`}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById(field.id)?.click()}
              className="mt-2"
            >
              Choose File
            </Button>
            {value && (
              <p className="text-xs text-green-600 mt-2">
                File selected: {value.name || value}
              </p>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBack}
            className="w-8 h-8 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
            data-testid="back-button"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{workflow.title}</h3>
            <p className="text-sm text-gray-600">Step {currentStep + 1} of {fieldSteps.length}</p>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={progress} className="w-full h-2" />
        </div>
      </div>

      {/* Form Fields */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {currentFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderField(field)}
                {field.description && field.type !== 'checkbox' && (
                  <p className="text-xs text-gray-500">{field.description}</p>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <Button
          onClick={handleNext}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold"
          data-testid="next-button"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : isLastStep ? (
            <div className="flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Start Analysis</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}