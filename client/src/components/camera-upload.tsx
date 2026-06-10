import { useState, useEffect } from "react";
import { Camera, Image as ImageIcon, Upload, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cameraService } from "@/lib/camera-service";
import { motion, AnimatePresence } from "framer-motion";

interface CameraUploadProps {
  onPhotoSelected: (base64: string, uri: string) => void;
  onCancel?: () => void;
  multiple?: boolean;
}

export function CameraUpload({ onPhotoSelected, onCancel, multiple = false }: CameraUploadProps) {
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    checkCameraAvailability();
  }, []);

  const checkCameraAvailability = async () => {
    const available = await cameraService.isCameraAvailable();
    setCameraAvailable(available);
  };

  const handleCameraCapture = async () => {
    setIsUploading(true);
    const photo = await cameraService.capturePhoto();
    
    if (photo && photo.base64) {
      setSelectedPhoto(photo.uri);
      onPhotoSelected(photo.base64, photo.uri);
    }
    
    setIsUploading(false);
  };

  const handleLibraryPick = async () => {
    setIsUploading(true);
    const photo = await cameraService.pickFromLibrary();
    
    if (photo && photo.base64) {
      setSelectedPhoto(photo.uri);
      onPhotoSelected(photo.base64, photo.uri);
    }
    
    setIsUploading(false);
  };

  return (
    <div className="space-y-4">
      {/* Upload Options */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-32 flex-col space-y-2 hover:border-[var(--gold-deep)] hover:bg-secondary transition-all"
          onClick={handleCameraCapture}
          disabled={isUploading}
          data-testid="button-camera-capture"
        >
          <Camera className="h-8 w-8 text-gold" />
          <div className="text-center">
            <div className="font-semibold">Take Photo</div>
            <div className="text-xs text-muted-foreground">Use camera</div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-32 flex-col space-y-2 hover:border-border hover:bg-secondary transition-all"
          onClick={handleLibraryPick}
          disabled={isUploading}
          data-testid="button-library-pick"
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <div className="text-center">
            <div className="font-semibold">Choose Photo</div>
            <div className="text-xs text-muted-foreground">From library</div>
          </div>
        </Button>
      </div>

      {/* Preview */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            <div className="aspect-video bg-secondary rounded-lg overflow-hidden">
              <img 
                src={selectedPhoto} 
                alt="Selected bill" 
                className="w-full h-full object-contain"
                data-testid="img-preview"
              />
            </div>
            
            <div className="absolute top-2 right-2 flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-card border border-border shadow-sm"
                onClick={() => {
                  setSelectedPhoto(null);
                  onCancel?.();
                }}
                data-testid="button-remove-photo"
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="bg-emerald-600 text-white rounded-md px-3 py-1 flex items-center space-x-1">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Selected</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Status */}
      {!cameraAvailable && (
        <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 p-3 rounded-lg flex items-start space-x-2">
          <Upload className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium">Camera not available</div>
            <div className="text-xs text-amber-700 dark:text-amber-300">Using file picker instead. On iOS, you'll have full camera access.</div>
          </div>
        </div>
      )}

      {/* iOS Features Notice */}
      <div className="text-xs text-muted-foreground text-center">
        📱 <span className="font-medium">iOS App Features:</span> Document scanning, edge detection, and multi-page capture
      </div>
    </div>
  );
}
