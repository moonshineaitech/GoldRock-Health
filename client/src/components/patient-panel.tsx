import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, History } from "lucide-react";
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
    <div className="w-full lg:w-1/3 bg-gradient-to-br from-slate-50 to-indigo-50 p-6 border-r border-slate-200">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Patient Information</h3>
          <Select defaultValue={medicalCase.id}>
            <SelectTrigger className="w-48 text-sm border border-slate-200 rounded-lg">
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
        <div className="bg-white/70 rounded-xl p-4 mb-4 border border-white/30">
          <div className="flex items-center space-x-3 mb-3">
            <img 
              src={`https://images.unsplash.com/photo-1${medicalCase.gender === 'Male' ? '582750433449' : '560087637-6a54a7a5b6f6'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150`}
              alt={`Patient ${medicalCase.name}`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold text-slate-900">{medicalCase.name}</h4>
              <p className="text-slate-600 text-sm">
                {medicalCase.age}-year-old {medicalCase.gender} • DOB: {new Date(Date.now() - medicalCase.age * 365.25 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-500">Insurance:</span>
              <p className="font-medium">Medicare</p>
            </div>
            <div>
              <span className="text-slate-500">Allergies:</span>
              <p className="font-medium text-red-600">NKDA</p>
            </div>
          </div>
        </div>

        {/* Chief Complaint */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4 border border-indigo-200">
          <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
            <AlertCircle className="text-indigo-600 mr-2 h-4 w-4" />
            Chief Complaint
          </h4>
          <p className="text-slate-700 text-sm leading-relaxed">
            {medicalCase.chiefComplaint}
          </p>
        </div>

        {/* Medical History */}
        <div className="bg-white/70 rounded-xl p-4 border border-white/30">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
            <History className="text-slate-600 mr-2 h-4 w-4" />
            Medical History
          </h4>
          <div className="space-y-2 text-sm">
            {Object.entries(medicalCase.medicalHistory || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-medium text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white/70 rounded-xl p-4 border border-white/30">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-slate-900">Interview Progress</h4>
          <span className="text-sm text-slate-600">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="mb-3" />
        <div className="flex justify-between text-xs text-slate-600">
          <span>{questionsAsked} questions asked</span>
          <span>{formatTime(timeElapsed)} elapsed</span>
        </div>
      </div>
    </div>
  );
}
