import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, SkipForward, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { tutorialSteps, getStepById, getNextStep, getPreviousStep, getTotalSteps, getStepNumber } from "@shared/tutorial-steps";
import { useLocation } from "wouter";
import confetti from "canvas-confetti";

interface TutorialOverlayProps {
  currentStepId: string;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
  isActive: boolean;
}

export function TutorialOverlay({
  currentStepId,
  onNext,
  onPrevious,
  onSkip,
  onComplete,
  isActive
}: TutorialOverlayProps) {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const currentStep = getStepById(currentStepId);
  const nextStep = getNextStep(currentStepId);
  const previousStep = getPreviousStep(currentStepId);
  const totalSteps = getTotalSteps();
  const stepNumber = getStepNumber(currentStepId);
  const progressPercent = (stepNumber / totalSteps) * 100;

  const isFirstStep = stepNumber === 1;
  const isLastStep = stepNumber === totalSteps;

  useEffect(() => {
    if (!isActive || !currentStep) return;

    // Navigate to the correct page if needed
    if (currentStep.page !== location) {
      setLocation(currentStep.page);
    }

    // Find and highlight target element
    if (currentStep.targetElement) {
      const timeout = setTimeout(() => {
        const element = document.querySelector(currentStep.targetElement!) as HTMLElement;
        if (element) {
          const rect = element.getBoundingClientRect();
          setHighlightRect(rect);

          // Scroll element into view
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // Calculate tooltip position based on step position
          const tooltipPos = calculateTooltipPosition(rect, currentStep.position);
          setTooltipPosition(tooltipPos);
        } else {
          // Element not found, show center tooltip
          setHighlightRect(null);
          setTooltipPosition(null);
        }
      }, 300); // Wait for navigation

      return () => clearTimeout(timeout);
    } else {
      // Center modal - no highlight
      setHighlightRect(null);
      setTooltipPosition(null);
    }
  }, [currentStepId, isActive, currentStep, location, setLocation]);

  const calculateTooltipPosition = (rect: DOMRect, position: string) => {
    const padding = 20;
    const tooltipWidth = 400;
    const tooltipHeight = 250;

    switch (position) {
      case 'top':
        return {
          top: rect.top - tooltipHeight - padding,
          left: rect.left + rect.width / 2 - tooltipWidth / 2,
        };
      case 'bottom':
        return {
          top: rect.bottom + padding,
          left: rect.left + rect.width / 2 - tooltipWidth / 2,
        };
      case 'left':
        return {
          top: rect.top + rect.height / 2 - tooltipHeight / 2,
          left: rect.left - tooltipWidth - padding,
        };
      case 'right':
        return {
          top: rect.top + rect.height / 2 - tooltipHeight / 2,
          left: rect.right + padding,
        };
      default:
        return {
          top: window.innerHeight / 2 - tooltipHeight / 2,
          left: window.innerWidth / 2 - tooltipWidth / 2,
        };
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      onNext();
    }
  };

  const handleComplete = () => {
    // Celebration animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#14b8a6', '#3b82f6', '#8b5cf6'],
    });

    toast({
      title: "🎉 Tutorial Complete!",
      description: "You're ready to start saving on medical bills. Let's get to work!",
    });

    onComplete();
  };

  const handleSkip = () => {
    onSkip();
    toast({
      title: "Tutorial Skipped",
      description: "You can restart it anytime from your profile settings.",
    });
  };

  if (!isActive || !currentStep) return null;

  return (
    <AnimatePresence>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] pointer-events-none"
        data-testid="tutorial-overlay"
      >
        {/* Dark overlay with spotlight cutout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 pointer-events-auto"
          onClick={handleSkip}
          data-testid="tutorial-backdrop"
        />

        {/* Highlight spotlight */}
        {highlightRect && currentStep.highlightElement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute border-4 border-emerald-400 rounded-xl shadow-2xl pointer-events-none"
            style={{
              top: highlightRect.top - 8,
              left: highlightRect.left - 8,
              width: highlightRect.width + 16,
              height: highlightRect.height + 16,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.5)',
            }}
            data-testid="tutorial-highlight"
          />
        )}

        {/* Tooltip Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="absolute bg-white rounded-2xl shadow-2xl pointer-events-auto overflow-hidden"
          style={{
            top: tooltipPosition?.top ?? window.innerHeight / 2 - 200,
            left: tooltipPosition?.left ?? window.innerWidth / 2 - 200,
            width: currentStep.position === 'center' ? 500 : 400,
            maxWidth: '90vw',
            maxHeight: '80vh',
          }}
          data-testid="tutorial-tooltip"
        >
          {/* Header with Progress */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Step {stepNumber} of {totalSteps}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                data-testid="button-skip-tutorial"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={progressPercent} className="h-2 bg-white/20" data-testid="progress-tutorial" />
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-tutorial-title">
              {currentStep.title}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6" data-testid="text-tutorial-description">
              {currentStep.description}
            </p>

            {/* Media (if any) */}
            {currentStep.imageUrl && (
              <img
                src={currentStep.imageUrl}
                alt={currentStep.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
                data-testid="img-tutorial-media"
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={isFirstStep}
                className="flex-1"
                data-testid="button-tutorial-previous"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {!isLastStep && (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="flex-1 text-gray-600"
                  data-testid="button-tutorial-skip-all"
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  Skip Tour
                </Button>
              )}

              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                data-testid="button-tutorial-next"
              >
                {isLastStep ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {currentStep.ctaText || 'Complete'}
                  </>
                ) : (
                  <>
                    {currentStep.ctaText || 'Next'}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Decorative pulse animation on highlighted element */}
          {currentStep.action === 'click' && highlightRect && (
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute border-4 border-blue-400 rounded-xl pointer-events-none"
              style={{
                top: highlightRect.top - 12,
                left: highlightRect.left - 12,
                width: highlightRect.width + 24,
                height: highlightRect.height + 24,
              }}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
