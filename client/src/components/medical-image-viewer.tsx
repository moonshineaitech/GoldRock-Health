import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Eye,
  EyeOff,
  Target,
  CheckCircle,
  XCircle,
  Lightbulb,
  Timer,
  Award
} from "lucide-react";
import type { MedicalImage } from "@shared/schema";

interface Finding {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  userDescription: string;
  confidence: number;
  isCorrect?: boolean;
}

interface MedicalImageViewerProps {
  image: MedicalImage;
  onComplete?: (findings: Finding[], diagnosis: string, confidence: number) => void;
  showHints?: boolean;
  timeLimit?: number;
}

export function MedicalImageViewer({ 
  image, 
  onComplete, 
  showHints = false,
  timeLimit 
}: MedicalImageViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [currentAnnotation, setCurrentAnnotation] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<string | null>(null);
  const [showKeyFindings, setShowKeyFindings] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [confidence, setConfidence] = useState(3);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Timer effect
  useEffect(() => {
    if (isCompleted) return;
    
    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        if (timeLimit && prev >= timeLimit * 60) {
          handleComplete();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted, timeLimit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getImageCoordinates = (clientX: number, clientY: number) => {
    if (!imageRef.current || !containerRef.current) return { x: 0, y: 0 };
    
    const rect = imageRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const x = ((clientX - rect.left) / (rect.width * zoom)) * 100;
    const y = ((clientY - rect.top) / (rect.height * zoom)) * 100;
    
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getImageCoordinates(e.clientX, e.clientY);
    
    if (isAnnotating) {
      setCurrentAnnotation({ x, y, width: 0, height: 0 });
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (currentAnnotation) {
      const { x, y } = getImageCoordinates(e.clientX, e.clientY);
      setCurrentAnnotation(prev => prev ? {
        ...prev,
        width: Math.abs(x - prev.x),
        height: Math.abs(y - prev.y),
        x: Math.min(x, prev.x),
        y: Math.min(y, prev.y)
      } : null);
    } else if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (currentAnnotation && currentAnnotation.width > 1 && currentAnnotation.height > 1) {
      const newFinding: Finding = {
        id: Date.now().toString(),
        ...currentAnnotation,
        userDescription: "",
        confidence: 3
      };
      setFindings(prev => [...prev, newFinding]);
      setSelectedFinding(newFinding.id);
      setCurrentAnnotation(null);
    } else {
      setCurrentAnnotation(null);
    }
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleAnnotationMode = () => {
    setIsAnnotating(!isAnnotating);
    setCurrentAnnotation(null);
  };

  const updateFinding = (id: string, description: string, confidence: number) => {
    setFindings(prev => 
      prev.map(f => f.id === id ? { ...f, userDescription: description, confidence } : f)
    );
  };

  const deleteFinding = (id: string) => {
    setFindings(prev => prev.filter(f => f.id !== id));
    setSelectedFinding(null);
  };

  const useHint = () => {
    setHintsUsed(prev => prev + 1);
    setShowKeyFindings(true);
  };

  const handleComplete = () => {
    if (isCompleted) return;
    
    setIsCompleted(true);
    onComplete?.(findings, diagnosis, confidence);
  };

  const calculateAccuracy = () => {
    const keyFindings = image.keyFindings || [];
    const correctFindings = findings.filter(f => 
      keyFindings.some(kf => 
        Math.abs(f.x - kf.x) < 10 && 
        Math.abs(f.y - kf.y) < 10
      )
    );
    return Math.round((correctFindings.length / Math.max(1, keyFindings.length)) * 100);
  };

  const selectedFindingData = findings.find(f => f.id === selectedFinding);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900" data-testid="medical-image-viewer">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-xs font-medium">
            {image.imageType.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {image.modality}
          </Badge>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {image.bodyRegion}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm">
            <Timer className="w-4 h-4" />
            <span className={timeLimit && timeElapsed >= timeLimit * 60 ? "text-red-500" : ""}>
              {formatTime(timeElapsed)}
            </span>
            {timeLimit && (
              <span className="text-gray-400">/ {formatTime(timeLimit * 60)}</span>
            )}
          </div>
          
          {showHints && (
            <Button
              variant="outline"
              size="sm"
              onClick={useHint}
              disabled={showKeyFindings}
              data-testid="button-hint"
            >
              <Lightbulb className="w-4 h-4 mr-1" />
              Hint ({hintsUsed})
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Image Viewer */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-b">
            <div className="flex items-center space-x-2">
              <Button
                variant={isAnnotating ? "default" : "outline"}
                size="sm"
                onClick={toggleAnnotationMode}
                data-testid="button-annotate"
              >
                <Target className="w-4 h-4 mr-1" />
                {isAnnotating ? "Exit Annotate" : "Annotate"}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowKeyFindings(!showKeyFindings)}
                data-testid="button-toggle-findings"
              >
                {showKeyFindings ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleZoom(-0.2)}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button variant="outline" size="sm" onClick={() => handleZoom(0.2)}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Image Container */}
          <div 
            ref={containerRef}
            className="flex-1 overflow-hidden relative cursor-move bg-black"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            data-testid="image-container"
          >
            <div
              className="relative transition-transform duration-200"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center'
              }}
            >
              <img
                ref={imageRef}
                src={image.imageUrl}
                alt={image.title}
                className="max-w-full max-h-full object-contain mx-auto block"
                draggable={false}
                data-testid="medical-image"
              />

              {/* User Annotations */}
              {findings.map(finding => (
                <motion.div
                  key={finding.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`absolute border-2 cursor-pointer ${
                    selectedFinding === finding.id 
                      ? 'border-blue-500 bg-blue-500/20' 
                      : 'border-yellow-400 bg-yellow-400/20'
                  }`}
                  style={{
                    left: `${finding.x}%`,
                    top: `${finding.y}%`,
                    width: `${finding.width}%`,
                    height: `${finding.height}%`
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFinding(finding.id);
                  }}
                  data-testid={`annotation-${finding.id}`}
                >
                  <div className="absolute -top-6 left-0 bg-yellow-400 text-black px-1 py-0.5 text-xs rounded">
                    Finding {findings.indexOf(finding) + 1}
                  </div>
                </motion.div>
              ))}

              {/* Current Annotation */}
              {currentAnnotation && (
                <div
                  className="absolute border-2 border-dashed border-blue-500 bg-blue-500/20"
                  style={{
                    left: `${currentAnnotation.x}%`,
                    top: `${currentAnnotation.y}%`,
                    width: `${currentAnnotation.width}%`,
                    height: `${currentAnnotation.height}%`
                  }}
                />
              )}

              {/* Key Findings (when shown) */}
              {showKeyFindings && (image.keyFindings || []).map((finding, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute border-2 border-green-500 bg-green-500/20"
                  style={{
                    left: `${finding.x}%`,
                    top: `${finding.y}%`,
                    width: `${finding.width}%`,
                    height: `${finding.height}%`
                  }}
                  data-testid={`key-finding-${index}`}
                >
                  <div className="absolute -top-6 left-0 bg-green-500 text-white px-1 py-0.5 text-xs rounded">
                    {finding.finding}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Image Info */}
            <Card className="p-3">
              <h3 className="font-medium text-sm mb-2">{image.title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {image.description}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span>Difficulty:</span>
                <div className="flex">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full mr-1 ${
                        i <= image.difficulty ? 'bg-orange-400' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Findings List */}
            <Card className="p-3">
              <h4 className="font-medium text-sm mb-3">Your Findings ({findings.length})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {findings.map((finding, index) => (
                  <div
                    key={finding.id}
                    className={`p-2 rounded border cursor-pointer transition-colors ${
                      selectedFinding === finding.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedFinding(finding.id)}
                    data-testid={`finding-item-${finding.id}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Finding {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFinding(finding.id);
                        }}
                        className="h-6 w-6 p-0"
                        data-testid={`button-delete-finding-${finding.id}`}
                      >
                        <XCircle className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {finding.userDescription || "No description"}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs">Confidence:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full mr-0.5 ${
                              i <= finding.confidence ? 'bg-blue-400' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Finding Details */}
            {selectedFindingData && (
              <Card className="p-3">
                <h4 className="font-medium text-sm mb-3">Finding Details</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium block mb-1">Description</label>
                    <Textarea
                      value={selectedFindingData.userDescription}
                      onChange={(e) => updateFinding(
                        selectedFindingData.id, 
                        e.target.value, 
                        selectedFindingData.confidence
                      )}
                      placeholder="Describe what you see..."
                      className="text-xs"
                      rows={3}
                      data-testid="textarea-finding-description"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium block mb-2">
                      Confidence: {selectedFindingData.confidence}/5
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <button
                          key={i}
                          onClick={() => updateFinding(
                            selectedFindingData.id,
                            selectedFindingData.userDescription,
                            i
                          )}
                          className={`w-6 h-6 rounded-full transition-colors ${
                            i <= selectedFindingData.confidence
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                          data-testid={`button-confidence-${i}`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Diagnosis */}
            <Card className="p-3">
              <h4 className="font-medium text-sm mb-3">Your Diagnosis</h4>
              <div className="space-y-3">
                <Textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter your diagnosis..."
                  className="text-xs"
                  rows={3}
                  data-testid="textarea-diagnosis"
                />
                
                <div>
                  <label className="text-xs font-medium block mb-2">
                    Confidence: {confidence}/5
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <button
                        key={i}
                        onClick={() => setConfidence(i)}
                        className={`w-6 h-6 rounded-full transition-colors ${
                          i <= confidence
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        data-testid={`button-diagnosis-confidence-${i}`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Complete Button */}
            <Button
              onClick={handleComplete}
              disabled={isCompleted || !diagnosis.trim()}
              className="w-full"
              data-testid="button-complete"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isCompleted ? "Completed" : "Submit Analysis"}
            </Button>

            {/* Progress Stats */}
            {isCompleted && (
              <Card className="p-3">
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  Results
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Findings Accuracy:</span>
                    <span className="font-medium">{calculateAccuracy()}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Taken:</span>
                    <span className="font-medium">{formatTime(timeElapsed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hints Used:</span>
                    <span className="font-medium">{hintsUsed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Findings Found:</span>
                    <span className="font-medium">{findings.length}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}