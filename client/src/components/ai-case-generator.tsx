import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Brain, 
  Users, 
  Clock, 
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AICaseGeneratorProps {
  onCaseGenerated?: (caseId: string) => void;
}

interface CaseGenerationRequest {
  specialty: string;
  difficulty: number;
  patientAgeRange?: string;
  patientGender?: string;
  focusArea?: string;
  learningObjectives?: string[];
}

interface GeneratedCase {
  id: string;
  name: string;
  specialty: string;
  difficulty: number;
  chiefComplaint: string;
  correctDiagnosis: string;
  estimatedDuration: number;
}

export function AICaseGenerator({ onCaseGenerated }: AICaseGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingMultiple, setGeneratingMultiple] = useState(false);
  const [specialty, setSpecialty] = useState("");
  const [difficulty, setDifficulty] = useState<number>(1);
  const [ageRange, setAgeRange] = useState("Any");
  const [gender, setGender] = useState("Any");
  const [focusArea, setFocusArea] = useState("");
  const [objectives, setObjectives] = useState("");
  const [generatedCases, setGeneratedCases] = useState<GeneratedCase[]>([]);
  const { toast } = useToast();

  const specialties = [
    "Cardiology", "Neurology", "Pulmonology", "Gastroenterology", 
    "Endocrinology", "Nephrology", "Rheumatology", "Hematology",
    "Infectious Disease", "Emergency Medicine", "Internal Medicine",
    "Pediatrics", "Geriatrics", "Psychiatry", "Dermatology", 
    "Orthopedics", "Oncology", "Radiology", "Pathology"
  ];

  const difficultyLevels = [
    { level: 1, name: "Foundation", description: "Common conditions, straightforward presentations", color: "bg-green-100 text-green-800" },
    { level: 2, name: "Clinical", description: "Moderate complexity, clinical reasoning required", color: "bg-yellow-100 text-yellow-800" },
    { level: 3, name: "Expert", description: "Complex cases, rare conditions, multiple comorbidities", color: "bg-red-100 text-red-800" }
  ];

  const ageRanges = ["Any", "18-30", "31-65", "65+"];
  const genderOptions = ["Any", "Male", "Female"];

  const buildGenerationRequest = (): CaseGenerationRequest => {
    const learningObjectives = objectives.trim() 
      ? objectives.split('\n').map(obj => obj.trim()).filter(obj => obj.length > 0)
      : undefined;

    return {
      specialty,
      difficulty,
      patientAgeRange: ageRange === "Any" ? undefined : ageRange,
      patientGender: gender === "Any" ? undefined : gender,
      focusArea: focusArea.trim() || undefined,
      learningObjectives
    };
  };

  const generateSingleCase = async () => {
    if (!specialty) {
      toast({
        title: "Missing Information",
        description: "Please select a specialty",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const request = buildGenerationRequest();
      const response = await apiRequest('/api/ai/generate-case', {
        method: 'POST',
        body: JSON.stringify(request),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (data.success) {
        const newCase: GeneratedCase = {
          id: data.case.id,
          name: data.case.name,
          specialty: data.case.specialty,
          difficulty: data.case.difficulty,
          chiefComplaint: data.case.chiefComplaint,
          correctDiagnosis: data.case.correctDiagnosis,
          estimatedDuration: data.case.estimatedDuration
        };
        
        setGeneratedCases(prev => [newCase, ...prev]);
        
        toast({
          title: "Case Generated Successfully!",
          description: `${specialty} case "${newCase.name}" has been created`,
        });

        if (onCaseGenerated) {
          onCaseGenerated(newCase.id);
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error generating case:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate case",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const generateMultipleCases = async (count: number) => {
    if (!specialty) {
      toast({
        title: "Missing Information",
        description: "Please select a specialty",
        variant: "destructive",
      });
      return;
    }

    setGeneratingMultiple(true);
    try {
      const request = buildGenerationRequest();
      const response = await apiRequest('/api/ai/generate-multiple-cases', {
        method: 'POST',
        body: JSON.stringify({ request, count }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (data.success) {
        const newCases: GeneratedCase[] = data.cases.map((caseData: any) => ({
          id: caseData.id,
          name: caseData.name,
          specialty: caseData.specialty,
          difficulty: caseData.difficulty,
          chiefComplaint: caseData.chiefComplaint,
          correctDiagnosis: caseData.correctDiagnosis,
          estimatedDuration: caseData.estimatedDuration
        }));
        
        setGeneratedCases(prev => [...newCases, ...prev]);
        
        toast({
          title: "Cases Generated Successfully!",
          description: `Generated ${data.count} ${specialty} cases`,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error generating multiple cases:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate cases",
        variant: "destructive",
      });
    } finally {
      setGeneratingMultiple(false);
    }
  };

  const getDifficultyBadge = (level: number) => {
    const difficultyInfo = difficultyLevels.find(d => d.level === level);
    return difficultyInfo ? (
      <Badge className={difficultyInfo.color}>
        {difficultyInfo.name}
      </Badge>
    ) : null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          data-testid="button-ai-generator"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI Case Generator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <span>AI-Powered Case Generator</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              GPT-4 Powered
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Single Case
            </TabsTrigger>
            <TabsTrigger value="multiple" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Multiple Cases
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="single" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generate Custom Medical Case</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Medical Specialty *</Label>
                    <Select value={specialty} onValueChange={setSpecialty}>
                      <SelectTrigger data-testid="select-specialty">
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map(spec => (
                          <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level *</Label>
                    <Select value={difficulty.toString()} onValueChange={(value) => setDifficulty(parseInt(value))}>
                      <SelectTrigger data-testid="select-difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyLevels.map(level => (
                          <SelectItem key={level.level} value={level.level.toString()}>
                            <div className="flex items-center gap-2">
                              <span>{level.name}</span>
                              <Badge className={level.color} variant="outline">
                                Level {level.level}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age-range">Patient Age Range</Label>
                    <Select value={ageRange} onValueChange={setAgeRange}>
                      <SelectTrigger data-testid="select-age-range">
                        <SelectValue placeholder="Any age" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageRanges.map(range => (
                          <SelectItem key={range} value={range}>{range}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Patient Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger data-testid="select-gender">
                        <SelectValue placeholder="Any gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map(g => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focus-area">Focus Area (Optional)</Label>
                  <Input
                    id="focus-area"
                    placeholder="e.g., chest pain, diabetes management, stroke"
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value)}
                    data-testid="input-focus-area"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objectives">Learning Objectives (Optional)</Label>
                  <Textarea
                    id="objectives"
                    placeholder="Enter learning objectives, one per line"
                    value={objectives}
                    onChange={(e) => setObjectives(e.target.value)}
                    rows={3}
                    data-testid="textarea-objectives"
                  />
                </div>

                <Button 
                  onClick={generateSingleCase} 
                  disabled={generating || !specialty}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  data-testid="button-generate-single"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Case...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Case with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="multiple" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generate Multiple Cases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty-multi">Medical Specialty *</Label>
                    <Select value={specialty} onValueChange={setSpecialty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map(spec => (
                          <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty-multi">Difficulty Level *</Label>
                    <Select value={difficulty.toString()} onValueChange={(value) => setDifficulty(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyLevels.map(level => (
                          <SelectItem key={level.level} value={level.level.toString()}>
                            {level.name} (Level {level.level})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => generateMultipleCases(3)} 
                    disabled={generatingMultiple || !specialty}
                    variant="outline"
                    className="flex-1"
                    data-testid="button-generate-3"
                  >
                    {generatingMultiple ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Users className="h-4 w-4 mr-2" />
                    )}
                    Generate 3 Cases
                  </Button>
                  <Button 
                    onClick={() => generateMultipleCases(5)} 
                    disabled={generatingMultiple || !specialty}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    data-testid="button-generate-5"
                  >
                    {generatingMultiple ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Generate 5 Cases
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Generated Cases Display */}
        {generatedCases.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Recently Generated Cases ({generatedCases.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {generatedCases.map((medicalCase) => (
                  <div key={medicalCase.id} className="border rounded-lg p-3 bg-green-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-green-800">{medicalCase.name}</h4>
                          {getDifficultyBadge(medicalCase.difficulty)}
                          <Badge variant="outline" className="text-xs">
                            {medicalCase.specialty}
                          </Badge>
                        </div>
                        <p className="text-sm text-green-700 mb-1">{medicalCase.chiefComplaint}</p>
                        <p className="text-xs text-green-600">Diagnosis: {medicalCase.correctDiagnosis}</p>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{medicalCase.estimatedDuration}m</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => setIsOpen(false)} variant="outline">
            Close Generator
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}