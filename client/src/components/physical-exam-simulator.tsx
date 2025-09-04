import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Heart, Activity, Eye, Brain, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface PhysicalExamFinding {
  system: string;
  finding: string;
  significance: string;
  technique: string;
}

interface PhysicalExamSimulatorProps {
  caseId: string;
  isVisible: boolean;
  onClose: () => void;
}

const examSystems = [
  { id: "cardiovascular", name: "Cardiovascular", icon: Heart, color: "text-red-500" },
  { id: "pulmonary", name: "Pulmonary", icon: Zap, color: "text-blue-500" },
  { id: "neurological", name: "Neurological", icon: Brain, color: "text-purple-500" },
  { id: "abdominal", name: "Abdominal", icon: Activity, color: "text-green-500" },
];

export function PhysicalExamSimulator({ caseId, isVisible, onClose }: PhysicalExamSimulatorProps) {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [examFindings, setExamFindings] = useState<{ [key: string]: PhysicalExamFinding[] }>({});
  const [loading, setLoading] = useState<string | null>(null);

  const performExam = async (system: string) => {
    setLoading(system);
    try {
      const response = await apiRequest(`/api/cases/${caseId}/physical-exam/${system}`, {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setExamFindings(prev => ({
        ...prev,
        [system]: data.findings || []
      }));
      setSelectedSystem(system);
    } catch (error) {
      console.error('Error performing physical exam:', error);
    } finally {
      setLoading(null);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      style={{ 
        zIndex: 9999,
        paddingTop: 'max(1rem, env(safe-area-inset-top, 0px) + 4rem)'
      }}
    >
      <div 
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y'
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-800">Physical Examination Simulator</h2>
            </div>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              Close
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* System Selection */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Select System to Examine</h3>
              <div className="grid grid-cols-2 gap-3">
                {examSystems.map((system) => {
                  const Icon = system.icon;
                  const hasFindings = examFindings[system.id]?.length > 0;
                  
                  return (
                    <Card 
                      key={system.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedSystem === system.id ? 'ring-2 ring-indigo-500' : ''
                      } ${hasFindings ? 'bg-green-50 border-green-200' : ''}`}
                      onClick={() => performExam(system.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center">
                          {loading === system.id ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                          ) : (
                            <Icon className={`h-8 w-8 mb-2 ${system.color}`} />
                          )}
                          <h4 className="font-semibold text-slate-800">{system.name}</h4>
                          {hasFindings && (
                            <Badge variant="secondary" className="mt-2 text-xs">
                              Examined
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Examination Results */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Examination Findings</h3>
              {selectedSystem && examFindings[selectedSystem] ? (
                <div className="space-y-4">
                  {examFindings[selectedSystem].map((finding, index) => (
                    <Card key={index} className="border-l-4 border-l-indigo-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-slate-800">
                          {finding.finding}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium text-slate-700 mb-1">Clinical Significance</h5>
                            <p className="text-sm text-slate-600">{finding.significance}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-slate-700 mb-1">Examination Technique</h5>
                            <p className="text-sm text-slate-600">{finding.technique}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-300 rounded-lg">
                  <div className="text-center">
                    <Stethoscope className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500">Select a system to begin examination</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {Object.keys(examFindings).length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Examination Summary</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(examFindings).map(([system, findings]) => (
                  <Badge key={system} variant="secondary" className="text-xs">
                    {examSystems.find(s => s.id === system)?.name}: {findings.length} findings
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}