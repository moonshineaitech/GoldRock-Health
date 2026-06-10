import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Stethoscope, 
  Heart, 
  Activity, 
  Brain, 
  Eye, 
  Thermometer,
  User,
  Zap,
  FileText
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ComprehensivePhysicalExamModalProps {
  caseId: string;
  isVisible: boolean;
  onClose: () => void;
}

interface PatientInfo {
  name: string;
  age: number;
  gender: string;
  chiefComplaint: string;
}

interface PhysicalExamFindings {
  vitals: {
    bloodPressure: string;
    heartRate: string;
    respiratoryRate: string;
    temperature: string;
    oxygenSaturation?: string;
  };
  general: {
    appearance: string;
    distress: string;
    mobility: string;
  };
  cardiovascular: {
    heartSounds: string;
    murmurs: string;
    pulses: string;
    edema: string;
    jugularVeinDistension: string;
  };
  pulmonary: {
    inspection: string;
    palpation: string;
    percussion: string;
    auscultation: string;
  };
  abdominal: {
    inspection: string;
    palpation: string;
    percussion: string;
    auscultation: string;
    organomegaly: string;
  };
  neurological: {
    mentalStatus: string;
    cranialNerves: string;
    motor: string;
    sensory: string;
    reflexes: string;
    coordination: string;
  };
  musculoskeletal: {
    inspection: string;
    palpation: string;
    rangeOfMotion: string;
    strength: string;
  };
  skin: {
    color: string;
    texture: string;
    lesions: string;
    rashes: string;
  };
  heent: {
    head: string;
    eyes: string;
    ears: string;
    nose: string;
    throat: string;
  };
}

export function ComprehensivePhysicalExamModal({ 
  caseId, 
  isVisible, 
  onClose 
}: ComprehensivePhysicalExamModalProps) {
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [physicalExam, setPhysicalExam] = useState<PhysicalExamFindings | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isVisible && caseId) {
      loadPhysicalExam();
    }
  }, [isVisible, caseId]);

  const loadPhysicalExam = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(`/api/cases/${caseId}/physical-exam-complete`, {
        method: 'GET'
      });
      const data = await response.json();
      setPatientInfo(data.patientInfo);
      setPhysicalExam(data.physicalExam);
    } catch (error) {
      console.error('Error loading physical exam:', error);
      toast({
        title: "Error",
        description: "Failed to load physical examination findings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderSystemFindings = (title: string, findings: Record<string, string> | undefined | null, Icon: React.ElementType, color: string) => {
    // Handle null/undefined findings gracefully
    const safeFindings = findings || {};
    const hasAbnormalFindings = Object.values(safeFindings).some(finding => 
      finding && finding.toLowerCase().includes('abnormal') || 
      finding && finding.toLowerCase().includes('positive') ||
      finding && finding.toLowerCase().includes('enlarged') ||
      finding && finding.toLowerCase().includes('decreased') ||
      finding && finding.toLowerCase().includes('increased') ||
      finding && finding.toLowerCase().includes('tenderness')
    );

    return (
      <Card className={`${hasAbnormalFindings ? 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950' : 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon className={`h-5 w-5 ${color}`} />
            {title}
            {hasAbnormalFindings && (
              <Badge variant="outline" className="text-orange-700 border-orange-300 dark:text-orange-400 dark:border-orange-700">
                Abnormal Findings
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {Object.keys(safeFindings).length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <Icon className={`h-8 w-8 mx-auto mb-2 ${color}`} />
                <p>Loading examination findings...</p>
              </div>
            ) : (
              Object.entries(safeFindings).map(([key, value]) => (
                <div key={key}>
                  <h5 className="font-medium text-foreground mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </h5>
                  <p className="text-sm text-muted-foreground bg-card p-2 rounded border">
                    {value || 'No findings recorded'}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!isVisible) return null;

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-gold" />
            <span>Comprehensive Physical Examination</span>
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
            <span className="ml-3 text-muted-foreground">Loading physical examination findings...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Patient Information */}
            {patientInfo && (
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <h5 className="font-medium text-foreground">Name</h5>
                      <p className="text-muted-foreground">{patientInfo.name}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground">Age</h5>
                      <p className="text-muted-foreground">{patientInfo.age} years</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground">Gender</h5>
                      <p className="text-muted-foreground">{patientInfo.gender}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground">Chief Complaint</h5>
                      <p className="text-muted-foreground text-sm">{patientInfo.chiefComplaint}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {physicalExam && (
              <Tabs defaultValue="vitals" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="vitals" className="flex items-center gap-1 text-xs">
                    <Thermometer className="h-3 w-3" />
                    Vitals
                  </TabsTrigger>
                  <TabsTrigger value="systems1" className="flex items-center gap-1 text-xs">
                    <Heart className="h-3 w-3" />
                    CV/Resp
                  </TabsTrigger>
                  <TabsTrigger value="systems2" className="flex items-center gap-1 text-xs">
                    <Activity className="h-3 w-3" />
                    Abd/MSK
                  </TabsTrigger>
                  <TabsTrigger value="neuro" className="flex items-center gap-1 text-xs">
                    <Brain className="h-3 w-3" />
                    Neuro
                  </TabsTrigger>
                  <TabsTrigger value="other" className="flex items-center gap-1 text-xs">
                    <Eye className="h-3 w-3" />
                    HEENT/Skin
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="vitals" className="mt-6">
                  <div className="grid gap-6">
                    {/* Vital Signs */}
                    <Card className="border-border bg-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <Thermometer className="h-5 w-5" />
                          Vital Signs
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="bg-card p-3 rounded-lg border">
                            <h5 className="font-medium text-foreground">Blood Pressure</h5>
                            <p className="text-lg font-semibold text-foreground">{physicalExam.vitals.bloodPressure} mmHg</p>
                          </div>
                          <div className="bg-card p-3 rounded-lg border">
                            <h5 className="font-medium text-foreground">Heart Rate</h5>
                            <p className="text-lg font-semibold text-foreground">{physicalExam.vitals.heartRate} bpm</p>
                          </div>
                          <div className="bg-card p-3 rounded-lg border">
                            <h5 className="font-medium text-foreground">Respiratory Rate</h5>
                            <p className="text-lg font-semibold text-foreground">{physicalExam.vitals.respiratoryRate} /min</p>
                          </div>
                          <div className="bg-card p-3 rounded-lg border">
                            <h5 className="font-medium text-foreground">Temperature</h5>
                            <p className="text-lg font-semibold text-foreground">{physicalExam.vitals.temperature}</p>
                          </div>
                          {physicalExam.vitals.oxygenSaturation && (
                            <div className="bg-card p-3 rounded-lg border">
                              <h5 className="font-medium text-foreground">Oxygen Saturation</h5>
                              <p className="text-lg font-semibold text-foreground">{physicalExam.vitals.oxygenSaturation}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* General Appearance */}
                    {renderSystemFindings("General Appearance", physicalExam.general, User, "text-muted-foreground")}
                  </div>
                </TabsContent>
                
                <TabsContent value="systems1" className="mt-6">
                  <div className="grid gap-6">
                    {renderSystemFindings("Cardiovascular System", physicalExam.cardiovascular, Heart, "text-muted-foreground")}
                    {renderSystemFindings("Pulmonary System", physicalExam.pulmonary, Zap, "text-muted-foreground")}
                  </div>
                </TabsContent>
                
                <TabsContent value="systems2" className="mt-6">
                  <div className="grid gap-6">
                    {renderSystemFindings("Abdominal Examination", physicalExam.abdominal, Activity, "text-muted-foreground")}
                    {renderSystemFindings("Musculoskeletal System", physicalExam.musculoskeletal, FileText, "text-muted-foreground")}
                  </div>
                </TabsContent>
                
                <TabsContent value="neuro" className="mt-6">
                  <div className="grid gap-6">
                    {renderSystemFindings("Neurological Examination", physicalExam.neurological, Brain, "text-muted-foreground")}
                  </div>
                </TabsContent>
                
                <TabsContent value="other" className="mt-6">
                  <div className="grid gap-6">
                    {renderSystemFindings("HEENT (Head, Eyes, Ears, Nose, Throat)", physicalExam.heent, Eye, "text-muted-foreground")}
                    {renderSystemFindings("Skin Examination", physicalExam.skin, User, "text-muted-foreground")}
                  </div>
                </TabsContent>
              </Tabs>
            )}
            
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={onClose} variant="outline">
                Close Examination
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}