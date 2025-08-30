import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, AlertTriangle, CheckCircle, BookOpen } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ClinicalReasoning {
  chiefComplaint: string;
  keyFindings: string[];
  redFlags: string[];
  recommendedWorkup: string[];
  clinicalPearls: string[];
}

interface ClinicalReasoningPanelProps {
  caseId: string;
  questionsAsked: string[];
  isVisible: boolean;
  onClose: () => void;
}

export function ClinicalReasoningPanel({ 
  caseId, 
  questionsAsked, 
  isVisible, 
  onClose 
}: ClinicalReasoningPanelProps) {
  const [reasoning, setReasoning] = useState<ClinicalReasoning | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible && caseId) {
      loadReasoning();
    }
  }, [isVisible, caseId, questionsAsked]);

  const loadReasoning = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(`/api/cases/${caseId}/clinical-reasoning`, {
        method: 'POST',
        body: JSON.stringify({ questionsAsked }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setReasoning(data);
    } catch (error) {
      console.error('Error loading clinical reasoning:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-800">Clinical Reasoning</h2>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-slate-600">Analyzing clinical reasoning...</span>
            </div>
          ) : reasoning ? (
            <div className="space-y-6">
              {/* Chief Complaint */}
              <Card className="border-l-4 border-l-indigo-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-800">Chief Complaint</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 font-medium">{reasoning.chiefComplaint}</p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Key Findings */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Key Findings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {reasoning.keyFindings.map((finding, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span className="text-slate-700">{finding}</span>
                        </div>
                      ))}
                      {reasoning.keyFindings.length === 0 && (
                        <p className="text-slate-500 italic">No key findings identified yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Red Flags */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Red Flags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {reasoning.redFlags.map((flag, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">⚠</span>
                          <span className="text-slate-700">{flag}</span>
                        </div>
                      ))}
                      {reasoning.redFlags.length === 0 && (
                        <p className="text-slate-500 italic">No red flags identified</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommended Workup */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Recommended Workup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {reasoning.recommendedWorkup.map((item, index) => (
                      <Badge key={index} variant="secondary" className="justify-start p-2">
                        {item}
                      </Badge>
                    ))}
                  </div>
                  {reasoning.recommendedWorkup.length === 0 && (
                    <p className="text-slate-500 italic">Continue gathering information to generate workup recommendations</p>
                  )}
                </CardContent>
              </Card>

              {/* Clinical Pearls */}
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    Clinical Pearls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reasoning.clinicalPearls.map((pearl, index) => (
                      <div key={index} className="p-3 bg-white rounded-lg border border-yellow-200">
                        <p className="text-slate-700 font-medium">{pearl}</p>
                      </div>
                    ))}
                    {reasoning.clinicalPearls.length === 0 && (
                      <p className="text-slate-500 italic">Clinical pearls will appear as you progress through the case</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Progress Indicator */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-800 mb-2">Your Progress</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    Questions Asked: {questionsAsked.length}
                  </Badge>
                  <Badge variant="outline">
                    Key Findings: {reasoning.keyFindings.length}
                  </Badge>
                  <Badge variant={reasoning.redFlags.length > 0 ? "destructive" : "outline"}>
                    Red Flags: {reasoning.redFlags.length}
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              Unable to load clinical reasoning. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}