import { Switch, Route, Redirect } from "wouter";
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
import Progress from "@/pages/progress";
import ImageAnalysis from "@/pages/image-analysis";
import StudyGroups from "@/pages/study-groups";
import BoardExamPrep from "@/pages/board-exam-prep";
import ClinicalDecisionTrees from "@/pages/clinical-decision-trees";
import BillAI from "@/pages/bill-ai";
import Premium from "@/pages/premium";
import PixelGame from "@/pages/pixel-game";
import BillReductionGuide from "@/pages/bill-reduction-guide";
import PortalAccessGuide from "@/pages/portal-access-guide";
import BillBestPractices from "@/pages/bill-best-practices";
import IndustryInsights from "@/pages/industry-insights";
import BlitzDemo from "@/pages/blitz-demo";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import AiUsageAgreement from "@/pages/ai-usage-agreement";
import NotFound from "@/pages/not-found";

// Define AI-protected routes that require AI agreement
const AI_PROTECTED_ROUTES = [
  '/ai-generator',
  '/bill-ai', 
  '/bill-analyzer',
  '/image-analysis',
  '/training',
  '/game',
  '/blitz-demo'
];

// Component wrapper to protect AI routes
function AIRouteGuard({ children, path }: { children: React.ReactNode; path: string }) {
  const { hasAcceptedAiTerms, isAuthenticated } = useAuth();
  
  // If not authenticated, let the main router handle it
  if (!isAuthenticated) {
    return <>{children}</>;
  }
  
  // If route requires AI agreement and user hasn't accepted, redirect
  if (AI_PROTECTED_ROUTES.includes(path) && !hasAcceptedAiTerms) {
    return <Redirect to="/ai-agreement" />;
  }
  
  return <>{children}</>;
}

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

  // Show auth landing for unauthenticated users, but allow access to legal pages
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route component={AuthLanding} />
      </Switch>
    );
  }

  // Show main app for authenticated users
  return (
    <Switch>
      <Route path="/ai-agreement" component={AiUsageAgreement} />
      <Route path="/" component={Landing} />
      <Route path="/training">
        <AIRouteGuard path="/training">
          <Training />
        </AIRouteGuard>
      </Route>
      <Route path="/ai-generator">
        <AIRouteGuard path="/ai-generator">
          <AIGenerator />
        </AIRouteGuard>
      </Route>
      <Route path="/game">
        <AIRouteGuard path="/game">
          <Game />
        </AIRouteGuard>
      </Route>
      <Route path="/game/:id">
        <AIRouteGuard path="/game">
          <Game />
        </AIRouteGuard>
      </Route>
      <Route path="/progress" component={Progress} />
      <Route path="/image-analysis">
        <AIRouteGuard path="/image-analysis">
          <ImageAnalysis />
        </AIRouteGuard>
      </Route>
      <Route path="/study-groups" component={StudyGroups} />
      <Route path="/board-exam-prep" component={BoardExamPrep} />
      <Route path="/clinical-decision-trees" component={ClinicalDecisionTrees} />
      <Route path="/bill-analyzer">
        <AIRouteGuard path="/bill-analyzer">
          <BillAI />
        </AIRouteGuard>
      </Route>
      <Route path="/bill-ai">
        <AIRouteGuard path="/bill-ai">
          <BillAI />
        </AIRouteGuard>
      </Route>
      <Route path="/premium" component={Premium} />
      <Route path="/pixel-game" component={PixelGame} />
      <Route path="/bill-reduction-guide" component={BillReductionGuide} />
      <Route path="/portal-access-guide" component={PortalAccessGuide} />
      <Route path="/bill-best-practices" component={BillBestPractices} />
      <Route path="/industry-insights" component={IndustryInsights} />
      <Route path="/blitz-demo">
        <AIRouteGuard path="/blitz-demo">
          <BlitzDemo />
        </AIRouteGuard>
      </Route>
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
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
