import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, History } from "lucide-react";
import { MobileCard } from "@/components/mobile-layout";
import type { MedicalCase } from "@shared/schema";

interface PatientPanelProps {
  medicalCase: MedicalCase;
  questionsAsked: number;
  timeElapsed: number;
}

export function PatientPanel({ medicalCase, questionsAsked, timeElapsed }: PatientPanelProps) {
  const progress = Math.min((questionsAsked / 20) * 100, 100); // Assume 20 questions for full interview
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full mb-4">
      <MobileCard className="p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">Patient Information</h3>
          <Select defaultValue={medicalCase.id}>
            <SelectTrigger className="w-40 text-sm border border-border rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={medicalCase.id}>
                {medicalCase.name} - {medicalCase.specialty}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Patient Demographics */}
        <div className="bg-secondary rounded-xl p-4 mb-4 border border-border">
          <div className="flex items-center space-x-3 mb-3">
            <img 
              src={`https://images.unsplash.com/photo-1${medicalCase.gender === 'Male' ? '582750433449' : '560087637-6a54a7a5b6f6'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150`}
              alt={`Patient ${medicalCase.name}`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold text-foreground">{medicalCase.name}</h4>
              <p className="text-muted-foreground text-sm">
                {medicalCase.age}-year-old {medicalCase.gender} • DOB: {new Date(Date.now() - medicalCase.age * 365.25 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Insurance:</span>
              <p className="font-medium">Medicare</p>
            </div>
            <div>
              <span className="text-muted-foreground">Allergies:</span>
              <p className="font-medium text-red-600 dark:text-red-400">NKDA</p>
            </div>
          </div>
        </div>

        {/* Chief Complaint */}
        <div className="bg-secondary rounded-xl p-4 mb-4 border border-border">
          <h4 className="font-semibold text-foreground mb-2 flex items-center">
            <AlertCircle className="text-gold mr-2 h-4 w-4" />
            Chief Complaint
          </h4>
          <p className="text-foreground text-sm leading-relaxed">
            {medicalCase.chiefComplaint}
          </p>
        </div>

        {/* Medical History */}
        <div className="bg-secondary rounded-xl p-4 border border-border">
          <h4 className="font-semibold text-foreground mb-3 flex items-center">
            <History className="text-muted-foreground mr-2 h-4 w-4" />
            Medical History
          </h4>
          <div className="space-y-2 text-sm">
            {Object.entries(medicalCase.medicalHistory || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </MobileCard>

      {/* Progress Indicator */}
      <MobileCard className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900">Interview Progress</h4>
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="mb-3" />
        <div className="flex justify-between text-xs text-gray-600">
          <span>{questionsAsked} questions asked</span>
          <span>{formatTime(timeElapsed)} elapsed</span>
        </div>
      </MobileCard>
    </div>
  );
}
