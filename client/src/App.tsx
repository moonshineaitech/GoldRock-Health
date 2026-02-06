import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
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
import Support from "@/pages/support";
import AiUsageAgreement from "@/pages/ai-usage-agreement";
import NotFound from "@/pages/not-found";
import NegotiationCoaching from "@/pages/negotiation-coaching";
import TimingGuide from "@/pages/timing-guide";
import DisputeArsenal from "@/pages/dispute-arsenal";
import ReductionCoach from "@/pages/reduction-coach";
import CodeMastery from "@/pages/code-mastery";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import RightsHub from "@/pages/rights-hub";
import EmergencyHelp from "@/pages/emergency-help";
import QuickAnalyzer from "@/pages/quick-analyzer";
import ProviderContacts from "@/pages/provider-contacts";
import CaseDetail from "@/pages/case-detail";
import Settings from "@/pages/settings";
import Admin from "@/pages/admin";
import ResourcesHub from "@/pages/resources-hub";
import Templates from "@/pages/templates";
import InsuranceDenials from "@/pages/insurance-denials";
import InsuranceBenefits from "@/pages/insurance-benefits";
import ImportantDisclaimer from "@/pages/important-disclaimer";
import HowItWorksGuide from "@/pages/how-it-works-guide";
import HealthInsights from "@/pages/health-insights";
import SyntheticPatientDiagnostics from "@/pages/synthetic-patient-diagnostics";
import ClinicalCommandCenter from "@/pages/clinical-command-center";
import LabAnalyzer from "@/pages/lab-analyzer";
import DrugInteractions from "@/pages/drug-interactions";
import SymptomChecker from "@/pages/symptom-checker";
import HealthMetrics from "@/pages/health-metrics";
import Enrollment from "@/pages/enrollment";
import LunaFold from "@/pages/lunafold";
import LunaFoldLab from "@/pages/lunafold-lab";
import MedicalConditions from "@/pages/medical-conditions";
import ConditionDetail from "@/pages/condition-detail";
import DrugPrices from "@/pages/drug-prices";
import BillGrader from "@/pages/bill-grader";
import HospitalReviews from "@/pages/hospital-reviews";
import Enterprise from "@/pages/enterprise";
import ArticlesIndex from "@/pages/articles/index";
import MedicalBillErrorsGuide from "@/pages/articles/medical-bill-errors-guide";
import HospitalPriceTransparency from "@/pages/articles/hospital-price-transparency";
import NegotiateMedicalBillsArticle from "@/pages/articles/negotiate-medical-bills";
import AIMedicalBillAnalysis from "@/pages/articles/ai-medical-bill-analysis";
import InsuranceDenialsAppeals from "@/pages/articles/insurance-denials-appeals";
import MedicalDebtReliefOptions from "@/pages/articles/medical-debt-relief-options";
import PlatformStats from "@/pages/platform-stats";
import CaseStudies from "@/pages/case-studies";
import Investors from "@/pages/investors";
import ForVCs from "@/pages/for-vcs";
import ForHealthcare from "@/pages/for-healthcare";
import ForInsurance from "@/pages/for-insurance";
import ForEmployers from "@/pages/for-employers";
import CollectionsDefenseGuide from "@/pages/collections-defense-guide";
import HospitalBillPlaybook from "@/pages/hospital-bill-playbook";
import AboutGoldRock from "@/pages/about-goldrock";
import BillSummarizer from "@/pages/bill-summarizer";
import NegotiationSimulator from "@/pages/negotiation-simulator";
import GetStarted from "@/pages/get-started";
import BillTracker from "@/pages/bill-tracker";
import SavingsDashboard from "@/pages/savings-dashboard";
import NotificationsCenter from "@/pages/notifications-center";
import StateRights from "@/pages/state-rights";
import PriceComparison from "@/pages/price-comparison";
import DenialAppeals from "@/pages/denial-appeals";
import CommunityStories from "@/pages/community-stories";
import EmployerPortal from "@/pages/employer-portal";
import DataInsights from "@/pages/data-insights";
import PartnerApi from "@/pages/partner-api";
import DocumentVault from "@/pages/document-vault";
import { OfflineIndicator } from "@/components/offline-indicator";
import { DemoAccountBanner } from "@/components/demo-account-banner";
import { useEffect } from "react";
import { revenueCatService } from "@/lib/revenuecat-service";

// Scroll to top on route change
function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

// Define AI-protected routes that require AI agreement
const AI_PROTECTED_ROUTES = [
  '/ai-generator',
  '/bill-ai', 
  '/bill-analyzer',
  '/bill-grader',
  '/bill-summarizer',
  '/image-analysis',
  '/training',
  '/game',
  '/blitz-demo',
  '/health-insights',
  '/patient-diagnostics',
  '/clinical-command-center',
  '/lab-analyzer',
  '/drug-interactions',
  '/symptom-checker',
  '/negotiation-simulator'
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
  const { isAuthenticated, isLoading, user } = useAuth();

  // Initialize RevenueCat when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Initialize RevenueCat with user ID for iOS IAP
      revenueCatService.initialize(user.id.toString()).catch((error) => {
        console.error('Failed to initialize RevenueCat:', error);
      });
    }
  }, [isAuthenticated, user?.id]);

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

  // Show auth landing for unauthenticated users, but allow access to legal pages and SEO content
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/important-disclaimer" component={ImportantDisclaimer} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/support" component={Support} />
        <Route path="/conditions" component={MedicalConditions} />
        <Route path="/conditions/:slug" component={ConditionDetail} />
        <Route path="/drug-prices" component={DrugPrices} />
        <Route path="/hospital-reviews" component={HospitalReviews} />
        <Route path="/enterprise" component={Enterprise} />
        <Route path="/articles" component={ArticlesIndex} />
        <Route path="/articles/medical-bill-errors-guide" component={MedicalBillErrorsGuide} />
        <Route path="/articles/hospital-price-transparency" component={HospitalPriceTransparency} />
        <Route path="/articles/negotiate-medical-bills" component={NegotiateMedicalBillsArticle} />
        <Route path="/articles/ai-medical-bill-analysis" component={AIMedicalBillAnalysis} />
        <Route path="/articles/insurance-denials-appeals" component={InsuranceDenialsAppeals} />
        <Route path="/articles/medical-debt-relief-options" component={MedicalDebtReliefOptions} />
        <Route path="/platform-stats" component={PlatformStats} />
        <Route path="/case-studies" component={CaseStudies} />
        <Route path="/investors" component={Investors} />
        <Route path="/for-vcs" component={ForVCs} />
        <Route path="/for-healthcare" component={ForHealthcare} />
        <Route path="/for-insurance" component={ForInsurance} />
        <Route path="/for-employers" component={ForEmployers} />
        <Route path="/about" component={AboutGoldRock} />
        <Route component={AuthLanding} />
      </Switch>
    );
  }

  // Show main app for authenticated users
  return (
    <>
      <DemoAccountBanner />
      <Switch>
      <Route path="/ai-agreement" component={AiUsageAgreement} />
      <Route path="/" component={Landing} />
      <Route path="/get-started" component={GetStarted} />
      <Route path="/training">
        <AIRouteGuard path="/training">
          <Training />
        </AIRouteGuard>
      </Route>
      <Route path="/cases/:id" component={CaseDetail} />
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
      <Route path="/negotiation-coaching" component={NegotiationCoaching} />
      <Route path="/reduction-coach" component={ReductionCoach} />
      <Route path="/industry-insights" component={IndustryInsights} />
      <Route path="/timing-guide" component={TimingGuide} />
      <Route path="/dispute-arsenal" component={DisputeArsenal} />
      <Route path="/code-mastery" component={CodeMastery} />
      <Route path="/analytics-dashboard" component={AnalyticsDashboard} />
      <Route path="/rights-hub" component={RightsHub} />
      <Route path="/resources-hub" component={ResourcesHub} />
      <Route path="/templates" component={Templates} />
      <Route path="/insurance-denials" component={InsuranceDenials} />
      <Route path="/insurance-benefits" component={InsuranceBenefits} />
      <Route path="/emergency-help" component={EmergencyHelp} />
      <Route path="/quick-analyzer" component={QuickAnalyzer} />
      <Route path="/provider-contacts" component={ProviderContacts} />
      <Route path="/settings" component={Settings} />
      <Route path="/admin" component={Admin} />
      <Route path="/how-it-works-guide" component={HowItWorksGuide} />
      <Route path="/health-insights">
        <AIRouteGuard path="/health-insights">
          <HealthInsights />
        </AIRouteGuard>
      </Route>
      <Route path="/patient-diagnostics">
        <AIRouteGuard path="/patient-diagnostics">
          <SyntheticPatientDiagnostics />
        </AIRouteGuard>
      </Route>
      <Route path="/blitz-demo">
        <AIRouteGuard path="/blitz-demo">
          <BlitzDemo />
        </AIRouteGuard>
      </Route>
      <Route path="/clinical-command-center">
        <AIRouteGuard path="/clinical-command-center">
          <ClinicalCommandCenter />
        </AIRouteGuard>
      </Route>
      <Route path="/lab-analyzer">
        <AIRouteGuard path="/lab-analyzer">
          <LabAnalyzer />
        </AIRouteGuard>
      </Route>
      <Route path="/drug-interactions">
        <AIRouteGuard path="/drug-interactions">
          <DrugInteractions />
        </AIRouteGuard>
      </Route>
      <Route path="/symptom-checker">
        <AIRouteGuard path="/symptom-checker">
          <SymptomChecker />
        </AIRouteGuard>
      </Route>
      <Route path="/health-metrics" component={HealthMetrics} />
      <Route path="/enrollment" component={Enrollment} />
      <Route path="/lunafold" component={LunaFold} />
      <Route path="/lunafold-lab" component={LunaFoldLab} />
      <Route path="/conditions" component={MedicalConditions} />
      <Route path="/conditions/:slug" component={ConditionDetail} />
      <Route path="/drug-prices" component={DrugPrices} />
      <Route path="/bill-grader">
        <AIRouteGuard path="/bill-grader">
          <BillGrader />
        </AIRouteGuard>
      </Route>
      <Route path="/bill-summarizer">
        <AIRouteGuard path="/bill-summarizer">
          <BillSummarizer />
        </AIRouteGuard>
      </Route>
      <Route path="/negotiation-simulator">
        <AIRouteGuard path="/negotiation-simulator">
          <NegotiationSimulator />
        </AIRouteGuard>
      </Route>
      <Route path="/hospital-reviews" component={HospitalReviews} />
      <Route path="/enterprise" component={Enterprise} />
      <Route path="/articles" component={ArticlesIndex} />
      <Route path="/articles/medical-bill-errors-guide" component={MedicalBillErrorsGuide} />
      <Route path="/articles/hospital-price-transparency" component={HospitalPriceTransparency} />
      <Route path="/articles/negotiate-medical-bills" component={NegotiateMedicalBillsArticle} />
      <Route path="/articles/ai-medical-bill-analysis" component={AIMedicalBillAnalysis} />
      <Route path="/articles/insurance-denials-appeals" component={InsuranceDenialsAppeals} />
      <Route path="/articles/medical-debt-relief-options" component={MedicalDebtReliefOptions} />
      <Route path="/platform-stats" component={PlatformStats} />
      <Route path="/case-studies" component={CaseStudies} />
      <Route path="/investors" component={Investors} />
      <Route path="/for-vcs" component={ForVCs} />
      <Route path="/for-healthcare" component={ForHealthcare} />
      <Route path="/for-insurance" component={ForInsurance} />
      <Route path="/for-employers" component={ForEmployers} />
      <Route path="/collections-defense-guide" component={CollectionsDefenseGuide} />
      <Route path="/hospital-bill-playbook" component={HospitalBillPlaybook} />
      <Route path="/about" component={AboutGoldRock} />
      <Route path="/bill-tracker" component={BillTracker} />
      <Route path="/savings" component={SavingsDashboard} />
      <Route path="/notifications" component={NotificationsCenter} />
      <Route path="/state-rights" component={StateRights} />
      <Route path="/price-comparison" component={PriceComparison} />
      <Route path="/denial-appeals" component={DenialAppeals} />
      <Route path="/community-stories" component={CommunityStories} />
      <Route path="/employer" component={EmployerPortal} />
      <Route path="/data-insights" component={DataInsights} />
      <Route path="/document-vault" component={DocumentVault} />
      <Route path="/partner-api" component={PartnerApi} />
      <Route path="/important-disclaimer" component={ImportantDisclaimer} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/support" component={Support} />
      <Route component={NotFound} />
    </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="goldrock-theme">
        <TooltipProvider>
          <ScrollToTop />
          <Toaster />
          <OfflineIndicator />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
