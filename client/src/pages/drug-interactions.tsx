import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SEOHead, SEOContent, SEO_KEYWORDS } from "@/components/seo-head";
import {
  Pill, ArrowLeft, AlertTriangle, XCircle, AlertCircle, Info, Plus,
  Trash2, Loader2, Shield, Search, CheckCircle, BookOpen, Beaker,
  Heart, Brain, Activity, Clock, FileWarning, Stethoscope, FlaskConical
} from "lucide-react";

interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'major' | 'moderate' | 'minor';
  description: string;
  mechanism?: string;
  clinicalEffects?: string;
  management?: string;
  monitoring?: string;
  alternatives?: string;
}

interface MedicationSummary {
  name: string;
  drugClass: string;
  primaryUse: string;
}

interface InteractionResult {
  medications: string[];
  interactions: DrugInteraction[];
  safetyNotes: string[];
  polypharmacyConcerns?: string;
  medicationSummary?: MedicationSummary[];
  disclaimer: string;
}

interface DrugInfo {
  identified: boolean;
  genericName: string;
  brandNames: string[];
  drugClass: string;
  deaSchedule?: string;
  forms: string[];
  mechanismOfAction: string;
  primaryUses: Array<{ indication: string; isApproved: boolean; notes?: string }>;
  dosing: { typical: string; maximum: string; adjustments: string };
  sideEffects: {
    veryCommon: string[];
    common: string[];
    serious: string[];
    blackBoxWarning?: string;
  };
  precautions: {
    contraindications: string[];
    warnings: string[];
    pregnancy: string;
    breastfeeding: string;
    pediatric: string;
    geriatric: string;
  };
  interactions: {
    majorDrugClasses: string[];
    specificDrugs: string[];
    food?: string;
    alcohol: string;
    supplements: string[];
  };
  patientCounseling: string[];
  monitoring: { labTests: string[]; symptoms: string[] };
  storage: string;
  missedDose: string;
  disclaimer: string;
}

const COMMON_MEDS = [
  'Lisinopril', 'Metformin', 'Atorvastatin', 'Omeprazole', 'Metoprolol', 
  'Warfarin', 'Aspirin', 'Ibuprofen', 'Gabapentin', 'Amlodipine',
  'Sertraline', 'Tramadol', 'Prednisone', 'Levothyroxine'
];

export default function DrugInteractions() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("interactions");
  const [medications, setMedications] = useState<string[]>([]);
  const [currentMed, setCurrentMed] = useState("");
  const [result, setResult] = useState<InteractionResult | null>(null);
  const [singleDrug, setSingleDrug] = useState("");
  const [drugInfo, setDrugInfo] = useState<DrugInfo | null>(null);

  const checkMutation = useMutation({
    mutationFn: async (meds: string[]) => {
      const response = await apiRequest("POST", "/api/check-drug-interactions", { medications: meds });
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      if (data.interactions.length === 0) {
        toast({ title: "All Clear", description: "No known interactions found between your medications" });
      } else {
        const majorCount = data.interactions.filter((i: DrugInteraction) => i.severity === 'major').length;
        toast({ 
          title: majorCount > 0 ? "Important Interactions Found" : "Interactions Found", 
          description: `Found ${data.interactions.length} interaction(s)${majorCount > 0 ? `, including ${majorCount} major` : ''}`, 
          variant: majorCount > 0 ? "destructive" : "default" 
        });
      }
    },
    onError: () => {
      toast({ title: "Error", description: "Could not check interactions. Please try again.", variant: "destructive" });
    }
  });

  const lookupMutation = useMutation({
    mutationFn: async (med: string) => {
      const response = await apiRequest("POST", "/api/drug-lookup", { medication: med });
      return response.json();
    },
    onSuccess: (data) => {
      setDrugInfo(data);
      toast({ title: "Medication Found", description: `Showing information for ${data.genericName}` });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not find medication information", variant: "destructive" });
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

  const handleLookup = () => {
    const med = singleDrug.trim();
    if (!med) {
      toast({ title: "Enter Medication", description: "Please enter a medication name", variant: "destructive" });
      return;
    }
    lookupMutation.mutate(med);
  };

  const reset = () => {
    setMedications([]);
    setResult(null);
  };

  const resetLookup = () => {
    setSingleDrug("");
    setDrugInfo(null);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <SEOHead 
        title="Drug Interaction Checker - AI-Powered Medication Safety"
        description="Free AI drug interaction checker. Check prescription drug interactions, medication side effects, pill identification, and get detailed drug information. Powered by advanced pharmaceutical AI."
        keywords={SEO_KEYWORDS.drugInteractions}
        canonicalPath="/drug-interactions"
      />
      <SEOContent content={[
        "Drug interaction checker for prescription medications and over-the-counter drugs",
        "Check warfarin interactions, blood thinner drug interactions, SSRI interactions",
        "Medication safety tool for polypharmacy patients taking multiple medications",
        "CYP450 enzyme interactions, serotonin syndrome risk checker, bleeding risk assessment",
        "Free pill identifier and drug lookup tool with side effects information",
        "AI-powered medication analysis using pharmaceutical database knowledge",
        "Check interactions between vitamins, supplements, and prescription drugs",
        "Lisinopril interactions, metformin drug interactions, statin interactions",
        "Medication guide for elderly patients and those with kidney or liver disease"
      ]} />
      <div className="bg-card border-b border-border px-4 pt-12 pb-6">
        <div className="max-w-lg mx-auto">
          <Link href="/clinical-command-center">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-secondary mb-3 -ml-2 h-8 text-sm" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
              <Pill className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif text-foreground" data-testid="heading-drug-interactions">AI Medication Assistant</h1>
              <p className="text-muted-foreground text-xs">Check interactions & look up any medication</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        <Card className="border-amber-200 bg-amber-50/80">
          <CardContent className="p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              <strong>AI-Powered Analysis.</strong> Uses advanced AI trained on pharmaceutical literature. For educational purposes only - always consult your pharmacist or doctor.
            </p>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="interactions" className="text-xs" data-testid="tab-interactions">
              <Beaker className="h-3.5 w-3.5 mr-1.5" />
              Check Interactions
            </TabsTrigger>
            <TabsTrigger value="lookup" className="text-xs" data-testid="tab-lookup">
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              Drug Lookup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="interactions" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Pill className="h-5 w-5 text-muted-foreground" />
                  Your Medications
                </CardTitle>
                <CardDescription className="text-xs">
                  Add all medications, vitamins, and supplements you take
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter medication, vitamin, or supplement..."
                    value={currentMed}
                    onChange={(e) => setCurrentMed(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addMed()}
                    className="flex-1"
                    data-testid="input-medication"
                  />
                  <Button onClick={addMed} className="bg-primary text-primary-foreground hover:opacity-90" data-testid="button-add-med">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {medications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {medications.map((med, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1.5 bg-secondary text-foreground rounded-full px-3 py-1.5"
                      >
                        <Pill className="h-3 w-3" />
                        <span className="text-sm font-medium">{med}</span>
                        <button onClick={() => removeMed(i)} className="text-muted-foreground hover:text-foreground ml-1" data-testid={`button-remove-med-${i}`}>
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {medications.length === 0 && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Quick add common medications:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_MEDS.slice(0, 8).map((med) => (
                        <button
                          key={med}
                          onClick={() => quickAdd(med)}
                          className="text-xs bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground rounded-full px-2.5 py-1 transition-colors"
                          data-testid={`button-quick-add-${med.toLowerCase()}`}
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
                  className="w-full bg-primary text-primary-foreground"
                  data-testid="button-check-interactions"
                >
                  {checkMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing with AI...</>
                  ) : (
                    <><Search className="h-4 w-4 mr-2" /> Check for Interactions</>
                  )}
                </Button>
              </CardContent>
            </Card>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {result.medicationSummary && result.medicationSummary.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <FlaskConical className="h-4 w-4 text-muted-foreground" /> Medications Analyzed
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {result.medicationSummary.map((med, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <Pill className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium">{med.name}</span>
                                <span className="text-muted-foreground"> - {med.drugClass}</span>
                                <p className="text-xs text-muted-foreground">{med.primaryUse}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {result.interactions.length === 0 ? (
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-5 text-center">
                        <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                        <h3 className="font-bold text-green-800 mb-1">No Known Interactions</h3>
                        <p className="text-sm text-green-700">
                          No significant interactions found between these medications. Still, always tell your healthcare providers about all medications you take.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-4 flex items-center gap-3">
                          <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
                          <div>
                            <h3 className="font-bold text-red-800">{result.interactions.length} Interaction(s) Found</h3>
                            <p className="text-sm text-red-700">Review these with your pharmacist or doctor</p>
                          </div>
                        </CardContent>
                      </Card>

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
                              
                              <p className="text-sm text-foreground">{interaction.description}</p>
                              
                              <Accordion type="single" collapsible className="w-full">
                                {interaction.mechanism && (
                                  <AccordionItem value="mechanism" className="border-0">
                                    <AccordionTrigger className="py-2 text-xs font-semibold text-muted-foreground hover:no-underline">
                                      <div className="flex items-center gap-1.5">
                                        <Beaker className="h-3.5 w-3.5" /> Why This Happens
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-foreground bg-secondary rounded-lg p-3">
                                      {interaction.mechanism}
                                    </AccordionContent>
                                  </AccordionItem>
                                )}
                                
                                {interaction.clinicalEffects && (
                                  <AccordionItem value="effects" className="border-0">
                                    <AccordionTrigger className="py-2 text-xs font-semibold text-muted-foreground hover:no-underline">
                                      <div className="flex items-center gap-1.5">
                                        <Activity className="h-3.5 w-3.5" /> What You Might Experience
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-foreground bg-secondary rounded-lg p-3">
                                      {interaction.clinicalEffects}
                                    </AccordionContent>
                                  </AccordionItem>
                                )}
                                
                                {interaction.management && (
                                  <AccordionItem value="management" className="border-0">
                                    <AccordionTrigger className="py-2 text-xs font-semibold text-muted-foreground hover:no-underline">
                                      <div className="flex items-center gap-1.5">
                                        <Stethoscope className="h-3.5 w-3.5" /> What To Do
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-foreground bg-secondary rounded-lg p-3">
                                      {interaction.management}
                                    </AccordionContent>
                                  </AccordionItem>
                                )}

                                {interaction.monitoring && (
                                  <AccordionItem value="monitoring" className="border-0">
                                    <AccordionTrigger className="py-2 text-xs font-semibold text-muted-foreground hover:no-underline">
                                      <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" /> Monitoring Needed
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-foreground bg-secondary rounded-lg p-3">
                                      {interaction.monitoring}
                                    </AccordionContent>
                                  </AccordionItem>
                                )}

                                {interaction.alternatives && (
                                  <AccordionItem value="alternatives" className="border-0">
                                    <AccordionTrigger className="py-2 text-xs font-semibold text-muted-foreground hover:no-underline">
                                      <div className="flex items-center gap-1.5">
                                        <Pill className="h-3.5 w-3.5" /> Possible Alternatives
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-foreground bg-secondary rounded-lg p-3">
                                      {interaction.alternatives}
                                    </AccordionContent>
                                  </AccordionItem>
                                )}
                              </Accordion>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </>
                  )}

                  {result.polypharmacyConcerns && (
                    <Card className="border-border bg-secondary">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <FileWarning className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">Polypharmacy Consideration</h4>
                            <p className="text-sm text-muted-foreground">{result.polypharmacyConcerns}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {result.safetyNotes?.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" /> Safety Tips
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1.5">
                          {result.safetyNotes.map((note, i) => (
                            <li key={i} className="text-sm text-foreground flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {note}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  <Button onClick={reset} variant="outline" className="w-full" data-testid="button-check-again">
                    Check Different Medications
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="lookup" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  Medication Lookup
                </CardTitle>
                <CardDescription className="text-xs">
                  Get detailed information about any medication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter medication name (brand or generic)..."
                    value={singleDrug}
                    onChange={(e) => setSingleDrug(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                    className="flex-1"
                    data-testid="input-single-drug"
                  />
                  <Button onClick={handleLookup} disabled={lookupMutation.isPending} className="bg-primary text-primary-foreground hover:opacity-90" data-testid="button-lookup-drug">
                    {lookupMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>

                {!drugInfo && !lookupMutation.isPending && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Try searching for:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_MEDS.slice(0, 6).map((med) => (
                        <button
                          key={med}
                          onClick={() => { setSingleDrug(med); lookupMutation.mutate(med); }}
                          className="text-xs bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground rounded-full px-2.5 py-1 transition-colors"
                        >
                          {med}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <AnimatePresence>
              {drugInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Card className="border-border">
                    <CardHeader className="pb-3 bg-secondary">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl text-foreground">{drugInfo.genericName}</CardTitle>
                          <CardDescription className="text-muted-foreground font-medium">{drugInfo.drugClass}</CardDescription>
                        </div>
                        {drugInfo.deaSchedule && (
                          <Badge variant="outline" className="border-red-300 text-red-700">
                            {drugInfo.deaSchedule}
                          </Badge>
                        )}
                      </div>
                      {drugInfo.brandNames.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {drugInfo.brandNames.map((brand, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{brand}</Badge>
                          ))}
                        </div>
                      )}
                    </CardHeader>
                  </Card>

                  {drugInfo.sideEffects.blackBoxWarning && (
                    <Card className="border-2 border-black bg-black text-white">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <XCircle className="h-6 w-6 text-white flex-shrink-0" />
                          <div>
                            <h4 className="font-bold text-lg mb-1">⚠️ BLACK BOX WARNING</h4>
                            <p className="text-sm">{drugInfo.sideEffects.blackBoxWarning}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <ScrollArea className="h-auto">
                    <Accordion type="multiple" defaultValue={["uses", "mechanism"]} className="space-y-2">
                      <AccordionItem value="mechanism" className="border rounded-lg px-4">
                        <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-muted-foreground" /> How It Works
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-foreground">
                          {drugInfo.mechanismOfAction}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="uses" className="border rounded-lg px-4">
                        <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500" /> What It's Used For
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {drugInfo.primaryUses.map((use, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <Badge variant={use.isApproved ? "default" : "secondary"} className="text-xs mt-0.5">
                                  {use.isApproved ? "FDA Approved" : "Off-Label"}
                                </Badge>
                                <span>{use.indication}</span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="dosing" className="border rounded-lg px-4">
                        <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Pill className="h-4 w-4 text-muted-foreground" /> Dosing Information
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 text-sm">
                            <p><strong>Typical Dose:</strong> {drugInfo.dosing.typical}</p>
                            <p><strong>Maximum:</strong> {drugInfo.dosing.maximum}</p>
                            <p><strong>Adjustments:</strong> {drugInfo.dosing.adjustments}</p>
                            <p><strong>Available Forms:</strong> {drugInfo.forms.join(', ')}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="sideEffects" className="border rounded-lg px-4">
                        <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-500" /> Side Effects
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 text-sm">
                            {drugInfo.sideEffects.veryCommon.length > 0 && (
                              <div>
                                <p className="font-semibold text-orange-600 mb-1">Very Common (&gt;10%)</p>
                                <p>{drugInfo.sideEffects.veryCommon.join(', ')}</p>
                              </div>
                            )}
                            {drugInfo.sideEffects.common.length > 0 && (
                              <div>
                                <p className="font-semibold text-yellow-600 mb-1">Common (1-10%)</p>
                                <p>{drugInfo.sideEffects.common.join(', ')}</p>
                              </div>
                            )}
                            {drugInfo.sideEffects.serious.length > 0 && (
                              <div>
                                <p className="font-semibold text-red-600 mb-1">Serious (Rare but Important)</p>
                                <ul className="list-disc list-inside">
                                  {drugInfo.sideEffects.serious.map((effect, i) => (
                                    <li key={i}>{effect}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="precautions" className="border rounded-lg px-4">
                        <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                          <div className="flex items-center gap-2">
                            <FileWarning className="h-4 w-4 text-red-500" /> Precautions & Warnings
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 text-sm">
                            {drugInfo.precautions.contraindications.length > 0 && (
                              <div>
                                <p className="font-semibold text-red-600 mb-1">Do NOT Use If:</p>
                                <ul className="list-disc list-inside">
                                  {drugInfo.precautions.contraindications.map((c, i) => (
                                    <li key={i}>{c}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <div className="bg-secondary p-2 rounded">
                                <p className="font-semibold text-muted-foreground text-xs">Pregnancy</p>
                                <p className="text-xs">{drugInfo.precautions.pregnancy}</p>
                              </div>
                              <div className="bg-secondary p-2 rounded">
                                <p className="font-semibold text-muted-foreground text-xs">Breastfeeding</p>
                                <p className="text-xs">{drugInfo.precautions.breastfeeding}</p>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="interactions" className="border rounded-lg px-4">
                        <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Beaker className="h-4 w-4 text-muted-foreground" /> Drug Interactions
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 text-sm">
                            {drugInfo.interactions.majorDrugClasses.length > 0 && (
                              <div>
                                <p className="font-semibold text-red-600 mb-1">Avoid with these drug classes:</p>
                                <div className="flex flex-wrap gap-1">
                                  {drugInfo.interactions.majorDrugClasses.map((dc, i) => (
                                    <Badge key={i} variant="destructive" className="text-xs">{dc}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {drugInfo.interactions.food && (
                              <p><strong>Food:</strong> {drugInfo.interactions.food}</p>
                            )}
                            <p><strong>Alcohol:</strong> {drugInfo.interactions.alcohol}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="counseling" className="border rounded-lg px-4">
                        <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-green-500" /> Patient Tips
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            {drugInfo.patientCounseling.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                            <li className="flex items-start gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <span><strong>Missed Dose:</strong> {drugInfo.missedDose}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <span><strong>Storage:</strong> {drugInfo.storage}</span>
                            </li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="monitoring" className="border rounded-lg px-4">
                        <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-muted-foreground" /> Monitoring Required
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 text-sm">
                            {drugInfo.monitoring.labTests.length > 0 && (
                              <div>
                                <p className="font-semibold mb-1">Lab Tests:</p>
                                <div className="flex flex-wrap gap-1">
                                  {drugInfo.monitoring.labTests.map((test, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">{test}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {drugInfo.monitoring.symptoms.length > 0 && (
                              <div>
                                <p className="font-semibold mb-1">Report These Symptoms:</p>
                                <ul className="list-disc list-inside">
                                  {drugInfo.monitoring.symptoms.map((s, i) => (
                                    <li key={i}>{s}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </ScrollArea>

                  <Card className="border-border bg-secondary">
                    <CardContent className="p-3 text-xs text-muted-foreground">
                      <strong>Disclaimer:</strong> {drugInfo.disclaimer}
                    </CardContent>
                  </Card>

                  <Button onClick={resetLookup} variant="outline" className="w-full" data-testid="button-lookup-another">
                    Look Up Another Medication
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>

      <MobileBottomNav />
    </div>
  );
}
