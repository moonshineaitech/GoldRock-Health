import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Clock, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface DifferentialDiagnosis {
  diagnosis: string;
  probability: number;
  supportingFindings: string[];
  opposingFindings: string[];
  nextSteps: string[];
}

interface DifferentialDiagnosisProps {
  caseId: string;
  isVisible: boolean;
  onClose: () => void;
}

export function DifferentialDiagnosisPanel({ caseId, isVisible, onClose }: DifferentialDiagnosisProps) {
  const [differentials, setDifferentials] = useState<DifferentialDiagnosis[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDifferential, setSelectedDifferential] = useState<number | null>(null);

  useEffect(() => {
    if (isVisible && caseId) {
      loadDifferentials();
    }
  }, [isVisible, caseId]);

  const loadDifferentials = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(`/api/cases/${caseId}/differential-diagnosis`, {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setDifferentials(data.differentials || []);
    } catch (error) {
      console.error('Error loading differentials:', error);
    } finally {
      setLoading(false);
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
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y'
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-800">Differential Diagnosis</h2>
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

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-slate-600">Generating differential diagnosis...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {differentials.map((differential, index) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedDifferential === index ? 'ring-2 ring-indigo-500' : ''
                  }`}
                  onClick={() => setSelectedDifferential(selectedDifferential === index ? null : index)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-slate-800">
                          {differential.diagnosis}
                        </CardTitle>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-slate-500" />
                            <span className="text-sm text-slate-600">
                              Probability: {differential.probability}%
                            </span>
                          </div>
                          <Progress 
                            value={differential.probability} 
                            className="w-24 h-2"
                          />
                        </div>
                      </div>
                      <Badge 
                        variant={differential.probability >= 70 ? "default" : 
                               differential.probability >= 40 ? "secondary" : "outline"}
                        className="ml-4"
                      >
                        {differential.probability >= 70 ? "High" : 
                         differential.probability >= 40 ? "Medium" : "Low"}
                      </Badge>
                    </div>
                  </CardHeader>

                  {selectedDifferential === index && (
                    <CardContent className="border-t border-slate-100 pt-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                            <ArrowRight className="h-4 w-4" />
                            Supporting Findings
                          </h4>
                          <ul className="space-y-1">
                            {differential.supportingFindings.map((finding, idx) => (
                              <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                {finding}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                            <ArrowRight className="h-4 w-4" />
                            Opposing Findings
                          </h4>
                          <ul className="space-y-1">
                            {differential.opposingFindings.map((finding, idx) => (
                              <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                {finding}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Next Steps
                          </h4>
                          <ul className="space-y-1">
                            {differential.nextSteps.map((step, idx) => (
                              <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}

              {differentials.length === 0 && !loading && (
                <div className="text-center py-8 text-slate-500">
                  No differential diagnoses available. Complete more of the case to generate recommendations.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}