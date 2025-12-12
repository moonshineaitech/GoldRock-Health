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
  Trash2, Loader2, Shield, Search, CheckCircle
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

const COMMON_MEDS = ['Lisinopril', 'Metformin', 'Atorvastatin', 'Omeprazole', 'Metoprolol', 'Warfarin', 'Aspirin', 'Ibuprofen'];

export default function DrugInteractions() {
  const { toast } = useToast();
  const [medications, setMedications] = useState<string[]>([]);
  const [currentMed, setCurrentMed] = useState("");
  const [result, setResult] = useState<InteractionResult | null>(null);

  const checkMutation = useMutation({
    mutationFn: async (meds: string[]) => {
      const response = await apiRequest("POST", "/api/check-drug-interactions", { medications: meds });
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      if (data.interactions.length === 0) {
        toast({ title: "All Clear", description: "No interactions found between your medications" });
      } else {
        toast({ title: "Warning", description: `Found ${data.interactions.length} interaction(s)`, variant: "destructive" });
      }
    },
    onError: () => {
      toast({ title: "Error", description: "Could not check interactions", variant: "destructive" });
    }
  });

  const addMed = () => {
    const med = currentMed.trim();
    if (!med) return;
    if (medications.some(m => m.toLowerCase() === med.toLowerCase())) {
      toast({ title: "Already Added", description: "This medication is in your list", variant: "destructive" });
      return;
    }
    setMedications([...medications, med]);
    setCurrentMed("");
  };

  const removeMed = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
    setResult(null);
  };

  const quickAdd = (med: string) => {
    if (!medications.some(m => m.toLowerCase() === med.toLowerCase())) {
      setMedications([...medications, med]);
    }
  };

  const handleCheck = () => {
    if (medications.length < 2) {
      toast({ title: "Add More", description: "Need at least 2 medications to check", variant: "destructive" });
      return;
    }
    checkMutation.mutate(medications);
  };

  const reset = () => {
    setMedications([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 pt-12 pb-6">
        <div className="max-w-lg mx-auto">
          <Link href="/clinical-command-center">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 mb-3 -ml-2 h-8 text-sm" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
              <Pill className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" data-testid="heading-drug-interactions">Medication Information</h1>
              <p className="text-white/80 text-xs">Look up medication information and known interactions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Disclaimer */}
        <Card className="border-amber-200 bg-amber-50/80">
          <CardContent className="p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              <strong>Reference information only.</strong> This uses published drug databases for educational purposes. Not a substitute for professional advice.
            </p>
          </CardContent>
        </Card>

        {/* Input Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Pill className="h-5 w-5 text-purple-600" />
              Your Medications
            </CardTitle>
            <CardDescription className="text-xs">
              Add each medication you take
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type medication name..."
                value={currentMed}
                onChange={(e) => setCurrentMed(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMed()}
                className="flex-1"
                data-testid="input-medication"
              />
              <Button onClick={addMed} className="bg-purple-600 hover:bg-purple-700" data-testid="button-add-med">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Medication Pills */}
            {medications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {medications.map((med, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 bg-purple-100 text-purple-800 rounded-full px-3 py-1.5"
                  >
                    <Pill className="h-3 w-3" />
                    <span className="text-sm font-medium">{med}</span>
                    <button onClick={() => removeMed(i)} className="text-purple-600 hover:text-purple-800 ml-1">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Quick Add */}
            {medications.length === 0 && (
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-2">Quick add common medications:</p>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_MEDS.map((med) => (
                    <button
                      key={med}
                      onClick={() => quickAdd(med)}
                      className="text-xs bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-700 rounded-full px-2.5 py-1 transition-colors"
                    >
                      + {med}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleCheck}
              disabled={medications.length < 2 || checkMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600"
              data-testid="button-check-interactions"
            >
              {checkMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Checking...</>
              ) : (
                <><Search className="h-4 w-4 mr-2" /> Check for Interactions</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* No Interactions */}
              {result.interactions.length === 0 ? (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-5 text-center">
                    <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                    <h3 className="font-bold text-green-800 mb-1">No Known Interactions</h3>
                    <p className="text-sm text-green-700">
                      These medications appear safe to take together. Still, always tell your doctor about all medications you take.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Warning Header */}
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4 flex items-center gap-3">
                      <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-red-800">{result.interactions.length} Interaction(s) Found</h3>
                        <p className="text-sm text-red-700">Talk to your doctor or pharmacist about these</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Interaction Cards */}
                  {result.interactions.map((interaction, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className={`border-2 ${
                        interaction.severity === 'major' ? 'border-red-300 bg-red-50' :
                        interaction.severity === 'moderate' ? 'border-orange-300 bg-orange-50' :
                        'border-yellow-300 bg-yellow-50'
                      }`}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {interaction.severity === 'major' ? <XCircle className="h-5 w-5 text-red-500" /> :
                               interaction.severity === 'moderate' ? <AlertCircle className="h-5 w-5 text-orange-500" /> :
                               <Info className="h-5 w-5 text-yellow-600" />}
                              <span className="font-bold">{interaction.drug1} + {interaction.drug2}</span>
                            </div>
                            <Badge className={
                              interaction.severity === 'major' ? 'bg-red-500' :
                              interaction.severity === 'moderate' ? 'bg-orange-500' : 'bg-yellow-500'
                            }>
                              {interaction.severity.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-700">{interaction.description}</p>
                          
                          {interaction.mechanism && (
                            <div className="bg-white/60 rounded-lg p-3">
                              <p className="text-xs font-semibold text-gray-600 mb-1">Why this happens:</p>
                              <p className="text-sm text-gray-700">{interaction.mechanism}</p>
                            </div>
                          )}
                          
                          {interaction.management && (
                            <div className="bg-white/60 rounded-lg p-3">
                              <p className="text-xs font-semibold text-gray-600 mb-1">What to do:</p>
                              <p className="text-sm text-gray-700">{interaction.management}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </>
              )}

              {/* Safety Notes */}
              {result.safetyNotes?.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" /> Safety Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {result.safetyNotes.map((note, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Check Again */}
              <Button onClick={reset} variant="outline" className="w-full" data-testid="button-check-again">
                Check Different Medications
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MobileBottomNav />
    </div>
  );
}
