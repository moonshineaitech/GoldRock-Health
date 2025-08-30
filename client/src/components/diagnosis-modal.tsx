import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Brain, Stethoscope } from "lucide-react";

interface DiagnosisModalProps {
  onSubmit: (diagnosis: string, confidence: number) => void;
  isLoading?: boolean;
}

export function DiagnosisModal({ onSubmit, isLoading = false }: DiagnosisModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [confidence, setConfidence] = useState<number>(3);
  const [reasoning, setReasoning] = useState("");

  const handleSubmit = () => {
    if (!diagnosis.trim()) return;
    
    onSubmit(diagnosis.trim(), confidence);
    setIsOpen(false);
    
    // Reset form
    setDiagnosis("");
    setConfidence(3);
    setReasoning("");
  };

  const confidenceLevels = [
    { value: 1, label: "Very Low", color: "bg-red-100 text-red-800" },
    { value: 2, label: "Low", color: "bg-orange-100 text-orange-800" },
    { value: 3, label: "Moderate", color: "bg-yellow-100 text-yellow-800" },
    { value: 4, label: "High", color: "bg-blue-100 text-blue-800" },
    { value: 5, label: "Very High", color: "bg-green-100 text-green-800" },
  ];

  const currentConfidenceLevel = confidenceLevels.find(level => level.value === confidence);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          data-testid="button-diagnose"
        >
          <ClipboardCheck className="h-4 w-4" />
          <span className="font-medium">Diagnose</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            <span>Submit Your Diagnosis</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Primary Diagnosis</Label>
            <Input
              id="diagnosis"
              placeholder="Enter your primary diagnosis..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full"
              data-testid="input-diagnosis"
            />
          </div>

          <div className="space-y-2">
            <Label>Confidence Level</Label>
            <Select 
              value={confidence.toString()} 
              onValueChange={(value) => setConfidence(parseInt(value))}
            >
              <SelectTrigger data-testid="select-confidence">
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    <Badge className={currentConfidenceLevel?.color}>
                      {currentConfidenceLevel?.label}
                    </Badge>
                    <span>({confidence}/5)</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {confidenceLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value.toString()}>
                    <div className="flex items-center space-x-2">
                      <Badge className={level.color}>
                        {level.label}
                      </Badge>
                      <span>({level.value}/5)</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reasoning">Clinical Reasoning (Optional)</Label>
            <Textarea
              id="reasoning"
              placeholder="Explain your diagnostic reasoning..."
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              rows={3}
              className="resize-none"
              data-testid="textarea-reasoning"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!diagnosis.trim() || isLoading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              data-testid="button-submit"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Stethoscope className="h-4 w-4" />
                  <span>Submit Diagnosis</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}