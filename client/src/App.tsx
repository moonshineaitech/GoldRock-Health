import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import AuthLanding from "@/pages/auth-landing";
import Landing from "@/pages/landing";
import Training from "@/pages/training";
import Game from "@/pages/game";
import AIGenerator from "@/pages/ai-generator";
import Achievements from "@/pages/achievements";
import ImageAnalysis from "@/pages/image-analysis";
import StudyGroups from "@/pages/study-groups";
import BoardExamPrep from "@/pages/board-exam-prep";
import ClinicalDecisionTrees from "@/pages/clinical-decision-trees";
import Premium from "@/pages/premium";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <i className="fas fa-stethoscope text-white text-lg"></i>
          </div>
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show auth landing for unauthenticated users
  if (!isAuthenticated) {
    return <AuthLanding />;
  }

  // Show main app for authenticated users
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/training" component={Training} />
      <Route path="/ai-generator" component={AIGenerator} />
      <Route path="/game" component={Game} />
      <Route path="/game/:id" component={Game} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/image-analysis" component={ImageAnalysis} />
      <Route path="/study-groups" component={StudyGroups} />
      <Route path="/board-exam-prep" component={BoardExamPrep} />
      <Route path="/clinical-decision-trees" component={ClinicalDecisionTrees} />
      <Route path="/premium" component={Premium} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
