import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Brain, Send, Sparkles, DollarSign, Building2, Calendar, Shield, FileText, Plus } from "lucide-react";
import type { BillWorkflow } from "@shared/bill-ai-workflows";

interface SimplifiedIntakeFormProps {
  workflow: BillWorkflow;
  onSubmit: (data: SimplifiedIntakeData) => void;
  onBack: () => void;
}

export interface SimplifiedIntakeData {
  billAmount: string;
  providerHospital: string;
  serviceDates: string;
  insuranceInfo: string;
  medicalCodes: string;
  additionalDetails: string;
}

const SIMPLIFIED_INTAKE_QUESTIONS = [
  {
    id: 'billAmount' as keyof SimplifiedIntakeData,
    label: 'Bill Amount',
    placeholder: 'Total amount or disputed charges (e.g., $15,000)',
    icon: DollarSign,
    description: 'Enter the total bill amount or specific charges you want analyzed',
    type: 'text' as const,
    suggestions: ['$5,000', '$15,000', '$50,000', '$100,000+']
  },
  {
    id: 'providerHospital' as keyof SimplifiedIntakeData,
    label: 'Provider/Hospital',
    placeholder: 'Hospital name, clinic, or healthcare provider',
    icon: Building2,
    description: 'Name of the healthcare facility or provider',
    type: 'text' as const,
    suggestions: ['General Hospital', 'Medical Center', 'Emergency Room', 'Specialist Clinic']
  },
  {
    id: 'serviceDates' as keyof SimplifiedIntakeData,
    label: 'Service Dates',
    placeholder: 'Date(s) of treatment or hospital stay',
    icon: Calendar,
    description: 'When did you receive the medical services?',
    type: 'text' as const,
    suggestions: ['January 2025', 'Last month', '3 months ago', 'Emergency visit']
  },
  {
    id: 'insuranceInfo' as keyof SimplifiedIntakeData,
    label: 'Insurance Information',
    placeholder: 'Insurance company, policy details, claim status',
    icon: Shield,
    description: 'Your insurance details and any claim information',
    type: 'text' as const,
    suggestions: ['Blue Cross Blue Shield', 'Aetna', 'Claim denied', 'No insurance']
  },
  {
    id: 'medicalCodes' as keyof SimplifiedIntakeData,
    label: 'Medical Codes',
    placeholder: 'CPT codes, ICD codes, procedure codes from bill',
    icon: FileText,
    description: 'Any medical billing codes shown on your bill',
    type: 'text' as const,
    suggestions: ['CPT 99213', 'ICD-10', 'Emergency codes', 'Surgery codes']
  },
  {
    id: 'additionalDetails' as keyof SimplifiedIntakeData,
    label: 'Additional Details',
    placeholder: 'Any other relevant information about your bill...',
    icon: Plus,
    description: 'Specific concerns, billing errors you noticed, or other details',
    type: 'textarea' as const,
    suggestions: ['Duplicate charges', 'Services not received', 'Out-of-network surprise bill', 'Emergency room overcharge']
  }
];

export function SimplifiedIntakeForm({ workflow, onSubmit, onBack }: SimplifiedIntakeFormProps) {
  const [formData, setFormData] = useState<SimplifiedIntakeData>({
    billAmount: '',
    providerHospital: '',
    serviceDates: '',
    insuranceInfo: '',
    medicalCodes: '',
    additionalDetails: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof SimplifiedIntakeData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Allow submission even with minimal data - the AI can work with whatever is provided
    onSubmit(formData);
    
    setIsSubmitting(false);
  };

  const hasAnyData = Object.values(formData).some(value => value.trim() !== '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-900">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex items-center justify-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${workflow.bgColor}`}>
              <workflow.icon className={`h-6 w-6 ${workflow.color}`} />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                {workflow.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                {workflow.subtitle}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Brain className="h-3 w-3 text-emerald-600" />
              <span className="text-gray-600 dark:text-gray-400">AI Analysis</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-blue-600" />
              <span className="text-gray-600 dark:text-gray-400">{workflow.successRate} Success</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-green-600" />
              <span className="text-gray-600 dark:text-gray-400">{workflow.savingsPotential}</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 p-4 rounded-2xl">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Quick Start:</span> 
              {' '}Fill out as many fields as possible. Even basic information can reveal significant savings opportunities.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {SIMPLIFIED_INTAKE_QUESTIONS.map((question, index) => {
            const Icon = question.icon;
            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                    <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <label 
                      htmlFor={question.id}
                      className="text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      {question.label}
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {question.description}
                    </p>
                  </div>
                </div>
                
                {question.type === 'textarea' ? (
                  <Textarea
                    id={question.id}
                    value={formData[question.id]}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    placeholder={question.placeholder}
                    className="min-h-[100px] resize-none rounded-2xl border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20"
                    data-testid={`input-${question.id}`}
                  />
                ) : (
                  <Input
                    id={question.id}
                    type="text"
                    value={formData[question.id]}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    placeholder={question.placeholder}
                    className="h-12 rounded-2xl border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20"
                    data-testid={`input-${question.id}`}
                  />
                )}
              </motion.div>
            );
          })}

          <div className="flex gap-3 pt-6">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 h-14 rounded-2xl border-gray-200 dark:border-gray-700"
              data-testid="button-back"
            >
              Back to Workflows
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-semibold"
              data-testid="button-submit-analysis"
            >
              {isSubmitting ? (
                <>
                  <Brain className="h-5 w-5 mr-2 animate-pulse" />
                  Starting Analysis...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>
          </div>

          {!hasAnyData && (
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 Pro tip: More details = better analysis and bigger savings
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Helper function to format the intake data for AI analysis
export function formatIntakeDataForChat(workflow: BillWorkflow, data: SimplifiedIntakeData): string {
  const sections = [];
  
  // Add workflow context
  sections.push(`SELECTED WORKFLOW: ${workflow.title} - ${workflow.description}`);
  sections.push('');

  // Add provided information
  sections.push('PATIENT INFORMATION PROVIDED:');
  
  if (data.billAmount) {
    sections.push(`• Bill Amount: ${data.billAmount}`);
  }
  
  if (data.providerHospital) {
    sections.push(`• Provider/Hospital: ${data.providerHospital}`);
  }
  
  if (data.serviceDates) {
    sections.push(`• Service Dates: ${data.serviceDates}`);
  }
  
  if (data.insuranceInfo) {
    sections.push(`• Insurance Information: ${data.insuranceInfo}`);
  }
  
  if (data.medicalCodes) {
    sections.push(`• Medical Codes: ${data.medicalCodes}`);
  }
  
  if (data.additionalDetails) {
    sections.push(`• Additional Details: ${data.additionalDetails}`);
  }

  sections.push('');
  sections.push('ANALYSIS REQUESTED:');
  sections.push(`Please perform a comprehensive ${workflow.title.toLowerCase()} analysis using the information provided above. Focus on identifying savings opportunities, billing errors, and actionable recommendations based on your expertise in medical billing advocacy.`);
  
  // Use the workflow's system prompt context
  if (workflow.systemPrompt) {
    sections.push('');
    sections.push('Apply your specialized knowledge as described: ' + workflow.systemPrompt.substring(0, 200) + '...');
  }

  return sections.join('\n');
}