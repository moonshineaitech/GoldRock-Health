import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { tutorialSteps } from "@shared/tutorial-steps";
import { useToast } from "@/hooks/use-toast";

interface TutorialContextType {
  isActive: boolean;
  currentStepId: string;
  completedSteps: string[];
  skippedSteps: string[];
  tutorialCompleted: boolean;
  startTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  restartTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

interface TutorialProviderProps {
  children: ReactNode;
}

export function TutorialProvider({ children }: TutorialProviderProps) {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [currentStepId, setCurrentStepId] = useState(tutorialSteps[0]?.id || '');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [skippedSteps, setSkippedSteps] = useState<string[]>([]);

  // Fetch user tutorial progress
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  const tutorialCompleted = (user as any)?.tutorialCompleted || false;
  const savedProgress = (user as any)?.tutorialProgress;

  // Load saved progress on mount
  useEffect(() => {
    if (savedProgress) {
      setCompletedSteps(savedProgress.completedSteps || []);
      setSkippedSteps(savedProgress.skippedSteps || []);
      if (savedProgress.currentStep > 0 && savedProgress.currentStep < tutorialSteps.length) {
        setCurrentStepId(tutorialSteps[savedProgress.currentStep]?.id || tutorialSteps[0].id);
      }
    }
  }, [savedProgress]);

  // Auto-start tutorial for new users
  useEffect(() => {
    if (user && !tutorialCompleted && !isActive && completedSteps.length === 0) {
      // Show welcome message and offer to start tutorial
      const timer = setTimeout(() => {
        const shouldStart = !localStorage.getItem('tutorial-dismissed');
        if (shouldStart) {
          setIsActive(true);
        }
      }, 2000); // Wait 2 seconds after page load

      return () => clearTimeout(timer);
    }
  }, [user, tutorialCompleted, isActive, completedSteps.length]);

  // Mutation to save progress
  const saveMutation = useMutation({
    mutationFn: async (progress: {
      currentStep: number;
      completedSteps: string[];
      skippedSteps: string[];
      tutorialCompleted?: boolean;
    }) => {
      return await apiRequest('/api/tutorial/progress', {
        method: 'POST',
        body: JSON.stringify(progress),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: (data, variables) => {
      // Only invalidate when tutorial completes or is skipped
      // Don't invalidate on every step to avoid resetting local state
      if (variables.tutorialCompleted) {
        queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      }
    },
  });

  const startTutorial = () => {
    setIsActive(true);
    setCurrentStepId(tutorialSteps[0].id);
    setCompletedSteps([]);
    setSkippedSteps([]);
  };

  const nextStep = () => {
    const currentIndex = tutorialSteps.findIndex(step => step.id === currentStepId);
    
    // Mark current step as completed
    if (!completedSteps.includes(currentStepId)) {
      const newCompleted = [...completedSteps, currentStepId];
      setCompletedSteps(newCompleted);
      
      // Save progress
      saveMutation.mutate({
        currentStep: currentIndex + 1,
        completedSteps: newCompleted,
        skippedSteps,
      });
    }

    // Move to next step
    if (currentIndex < tutorialSteps.length - 1) {
      setCurrentStepId(tutorialSteps[currentIndex + 1].id);
    }
  };

  const previousStep = () => {
    const currentIndex = tutorialSteps.findIndex(step => step.id === currentStepId);
    if (currentIndex > 0) {
      setCurrentStepId(tutorialSteps[currentIndex - 1].id);
    }
  };

  const skipStep = () => {
    if (!skippedSteps.includes(currentStepId)) {
      setSkippedSteps([...skippedSteps, currentStepId]);
    }
    nextStep();
  };

  const skipTutorial = () => {
    setIsActive(false);
    localStorage.setItem('tutorial-dismissed', 'true');
    
    // Save that tutorial was skipped
    const currentIndex = tutorialSteps.findIndex(step => step.id === currentStepId);
    saveMutation.mutate({
      currentStep: currentIndex,
      completedSteps,
      skippedSteps: [...skippedSteps, ...tutorialSteps.map(s => s.id)],
    });
  };

  const completeTutorial = () => {
    setIsActive(false);
    
    // Mark all steps as completed
    const allStepIds = tutorialSteps.map(s => s.id);
    setCompletedSteps(allStepIds);
    
    // Save completion
    saveMutation.mutate({
      currentStep: tutorialSteps.length,
      completedSteps: allStepIds,
      skippedSteps,
      tutorialCompleted: true,
    });
  };

  const restartTutorial = () => {
    setIsActive(true);
    setCurrentStepId(tutorialSteps[0].id);
    setCompletedSteps([]);
    setSkippedSteps([]);
    localStorage.removeItem('tutorial-dismissed');
    
    saveMutation.mutate({
      currentStep: 0,
      completedSteps: [],
      skippedSteps: [],
      tutorialCompleted: false,
    });
  };

  const value: TutorialContextType = {
    isActive,
    currentStepId,
    completedSteps,
    skippedSteps,
    tutorialCompleted,
    startTutorial,
    nextStep,
    previousStep,
    skipStep,
    skipTutorial,
    completeTutorial,
    restartTutorial,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}
