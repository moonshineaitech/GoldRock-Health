import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Pill, ArrowLeft, AlertTriangle, XCircle, AlertCircle, Info, Plus,
  Trash2, Loader2, Shield, Search, CheckCircle, Sparkles
} from "lucide-react";

interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'major' | 'moderate' | 'minor';
  description: string;
  mechanism?: string;
  management?: string;
}

interface InteractionResult {
  medications: string[];
  interactions: DrugInteraction[];
  safetyNotes: string[];
  disclaimer: string;
}

export default function DrugInteractions() {
  const { toast } = useToast();
  const [medications, setMedications] = useState<string[]>([]);
  const [currentMed, setCurrentMed] = useState("");
  const [result, setResult] = useState<InteractionResult | null>(null);

  const checkInteractionsMutation = useMutation({
    mutationFn: async (meds: string[]) => {
      const response = await apiRequest("POST", "/api/check-drug-interactions", { medications: meds });
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      if (data.interactions.length === 0) {
        toast({
          title: "No Interactions Found",
          description: "No known interactions detected between your medications",
        });
      } else {
        toast({
          title: "Interactions Detected",
          description: `Found ${data.interactions.length} potential interaction(s)`,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Check Failed",
        description: error.message || "Unable to check drug interactions",
        variant: "destructive",
      });
    }
  });

  const addMedication = () => {
    const med = currentMed.trim();
    if (!med) return;
    if (medications.includes(med.toLowerCase())) {
      toast({
        title: "Already Added",
        description: "This medication is already in your list",
        variant: "destructive",
      });
      return;
    }
    setMedications([...medications, med]);
    setCurrentMed("");
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
    setResult(null);
  };

  const handleCheck = () => {
    if (medications.length < 2) {
      toast({
        title: "Add More Medications",
        description: "You need at least 2 medications to check for interactions",
        variant: "destructive",
      });
      return;
    }
    checkInteractionsMutation.mutate(medications);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'major':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'minor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'major':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'moderate':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'minor':
        return <Info className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 pt-12 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/clinical-command">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 mb-4 -ml-2" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Clinical Command Center
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="heading-drug-interactions">Drug Interaction Checker</h1>
              <p className="text-white/80 text-sm">Check for dangerous medication interactions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Disclaimer */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> This tool uses drug interaction databases but may not include all medications or interactions. Always consult your pharmacist or doctor about potential drug interactions, especially for new prescriptions.
            </p>
          </CardContent>
        </Card>

        {/* Medication Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Pill className="h-5 w-5 text-purple-600" />
              Your Medications
            </CardTitle>
            <CardDescription>
              Add your medications to check for interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter medication name (e.g., Lisinopril, Metformin)"
                value={currentMed}
                onChange={(e) => setCurrentMed(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMedication()}
                className="flex-1"
                data-testid="input-medication"
              />
              <Button onClick={addMedication} className="bg-purple-600 hover:bg-purple-700" data-testid="button-add-med">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {/* Medication List */}
            {medications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {medications.map((med, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 bg-purple-100 text-purple-800 rounded-full px-3 py-1.5"
                  >
                    <Pill className="h-3 w-3" />
                    <span className="text-sm font-medium">{med}</span>
                    <button
                      onClick={() => removeMedication(index)}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                      data-testid={`button-remove-${index}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            <Button
              onClick={handleCheck}
              disabled={medications.length < 2 || checkInteractionsMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
              data-testid="button-check-interactions"
            >
              {checkInteractionsMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking Interactions...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Check for Interactions
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Common Medication Examples */}
        {medications.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Common Medications to Check</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['Lisinopril', 'Metformin', 'Atorvastatin', 'Omeprazole', 'Amlodipine', 'Metoprolol', 'Warfarin', 'Aspirin'].map((med) => (
                  <button
                    key={med}
                    onClick={() => setMedications([...medications, med])}
                    className="text-xs bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full px-3 py-1.5 transition-colors"
                    data-testid={`button-quick-add-${med.toLowerCase()}`}
                  >
                    + {med}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* No Interactions Found */}
              {result.interactions.length === 0 ? (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-green-800 mb-2">No Known Interactions</h3>
                    <p className="text-green-700">
                      No major interactions were found between your medications in our database.
                      However, always inform your healthcare providers about all medications you take.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Summary */}
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                        <AlertTriangle className="h-5 w-5" />
                        {result.interactions.length} Interaction(s) Found
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-red-700 text-sm">
                        Review the interactions below and discuss them with your healthcare provider.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Interaction Cards */}
                  {result.interactions.map((interaction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`border-2 ${getSeverityColor(interaction.severity)}`}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getSeverityIcon(interaction.severity)}
                              <CardTitle className="text-base">
                                {interaction.drug1} + {interaction.drug2}
                              </CardTitle>
                            </div>
                            <Badge className={
                              interaction.severity === 'major' ? 'bg-red-500' :
                              interaction.severity === 'moderate' ? 'bg-orange-500' :
                              'bg-yellow-500'
                            }>
                              {interaction.severity.toUpperCase()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-gray-700">{interaction.description}</p>
                          
                          {interaction.mechanism && (
                            <div className="bg-white/50 rounded-lg p-3">
                              <h4 className="text-sm font-semibold text-gray-700 mb-1">How it happens:</h4>
                              <p className="text-sm text-gray-600">{interaction.mechanism}</p>
                            </div>
                          )}
                          
                          {interaction.management && (
                            <div className="bg-white/50 rounded-lg p-3">
                              <h4 className="text-sm font-semibold text-gray-700 mb-1">What to do:</h4>
                              <p className="text-sm text-gray-600">{interaction.management}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </>
              )}

              {/* Safety Notes */}
              {result.safetyNotes && result.safetyNotes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      General Safety Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.safetyNotes.map((note, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <Info className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Disclaimer */}
              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="p-4">
                  <p className="text-xs text-gray-600 text-center">
                    {result.disclaimer || "This information is for educational purposes only and does not replace professional medical advice. Always consult your pharmacist or healthcare provider."}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MobileBottomNav />
    </div>
  );
}
