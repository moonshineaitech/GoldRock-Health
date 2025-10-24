// Tutorial step definitions for interactive onboarding
export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  page: string; // which page this step is on
  targetElement?: string; // CSS selector or data-testid
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'scroll' | 'input' | 'none';
  highlightElement?: boolean;
  imageUrl?: string;
  videoUrl?: string;
  ctaText?: string;
  ctaAction?: () => void;
}

export const tutorialSteps: TutorialStep[] = [
  // Welcome & Platform Overview
  {
    id: 'welcome',
    title: '👋 Welcome to GoldRock Health!',
    description: 'Your AI-powered medical bill reduction platform. We\'ll help you save $2,000-$35,000+ on inflated hospital bills through expert analysis and negotiation strategies.',
    page: '/',
    position: 'center',
    action: 'none',
    ctaText: 'Start Tour',
  },
  {
    id: 'home-quick-actions',
    title: 'Quick Actions Dashboard',
    description: 'Access your most important tools instantly: AI Bill Analyzer, Premium Coaching, Dispute Arsenal, and Savings Analytics. Everything you need to fight back against medical billing.',
    page: '/',
    targetElement: '[data-testid="section-quick-actions"]',
    position: 'bottom',
    action: 'none',
    highlightElement: true,
  },
  {
    id: 'home-how-it-works',
    title: 'Our Proven 4-Step Process',
    description: 'Upload bills → AI analysis finds errors → Expert coaching guides negotiations → Track your savings. We\'ve helped users save millions in unfair medical charges.',
    page: '/',
    targetElement: '[data-testid="section-how-it-works"]',
    position: 'top',
    action: 'scroll',
    highlightElement: true,
  },
  
  // Bill-AI Workflow Tutorial
  {
    id: 'bill-ai-intro',
    title: '🤖 AI-Powered Bill Analysis',
    description: 'Our AI analyzes bills in seconds, finding overcharges, billing errors, and negotiation opportunities that hospitals don\'t want you to know about.',
    page: '/bill-ai',
    position: 'center',
    action: 'none',
  },
  {
    id: 'bill-ai-workflows',
    title: 'Specialized Workflows for Every Bill Type',
    description: 'Choose from 10+ expert workflows: Emergency Room, Surgery, Hospital Stay, Anesthesia, Lab Tests, and more. Each workflow provides customized strategies based on industry insider knowledge.',
    page: '/bill-ai',
    targetElement: '[data-testid="section-workflows"]',
    position: 'bottom',
    action: 'scroll',
    highlightElement: true,
  },
  {
    id: 'bill-ai-chat',
    title: 'Expert AI Chat Assistant',
    description: 'Ask questions about your bill, get instant expert advice, and receive step-by-step guidance. Our AI is trained on "Never Pay the First Bill" strategies and real negotiation tactics.',
    page: '/bill-ai',
    targetElement: '[data-testid="section-ai-chat"]',
    position: 'left',
    action: 'none',
    highlightElement: true,
  },
  
  // Premium Coaching Tutorial
  {
    id: 'coaching-intro',
    title: '💎 Premium 1:1 Coaching',
    description: 'Get personalized guidance through every step of bill negotiation. Our coaching roadmap turns complex medical billing into a simple, step-by-step journey.',
    page: '/reduction-coach',
    position: 'center',
    action: 'none',
  },
  {
    id: 'coaching-assessment',
    title: 'Personalized Assessment',
    description: 'Start with a detailed intake about your bill, financial situation, and goals. We analyze your unique circumstances to create a custom negotiation strategy.',
    page: '/reduction-coach',
    targetElement: '[data-testid="step-personalized-assessment"]',
    position: 'right',
    action: 'none',
    highlightElement: true,
  },
  {
    id: 'coaching-strategy',
    title: 'Negotiation Strategy & Call Scripts',
    description: 'Get downloadable call scripts, email templates, and negotiation tactics. We provide word-for-word scripts based on what actually works with hospital billing departments.',
    page: '/reduction-coach',
    targetElement: '[data-testid="step-negotiation-strategy"]',
    position: 'right',
    action: 'scroll',
    highlightElement: true,
  },
  {
    id: 'coaching-execution',
    title: 'Execution & Live Coaching',
    description: 'Practice your negotiation approach, get coaching call preparation, and learn insider tactics like speaking to the "right person" and using financial hardship effectively.',
    page: '/reduction-coach',
    targetElement: '[data-testid="step-execution-coaching"]',
    position: 'right',
    action: 'scroll',
    highlightElement: true,
  },
  
  // Dispute Arsenal Tutorial
  {
    id: 'dispute-intro',
    title: '⚔️ Dispute Arsenal',
    description: 'Access professional dispute letter templates, billing rights guides, and regulatory resources. Everything you need to escalate when hospitals refuse to negotiate.',
    page: '/dispute-arsenal',
    position: 'center',
    action: 'none',
  },
  {
    id: 'dispute-templates',
    title: 'Professional Dispute Letter Templates',
    description: 'Download legally-sound dispute letters for common scenarios: billing errors, insurance denials, surprise billing, out-of-network charges, and more.',
    page: '/dispute-arsenal',
    targetElement: '[data-testid="section-templates"]',
    position: 'bottom',
    action: 'none',
    highlightElement: true,
  },
  {
    id: 'dispute-rights',
    title: 'Know Your Billing Rights',
    description: 'Learn federal protections like the No Surprises Act, Fair Debt Collection Practices Act, and state-specific regulations. Hospitals rely on you NOT knowing these.',
    page: '/dispute-arsenal',
    targetElement: '[data-testid="section-rights"]',
    position: 'bottom',
    action: 'scroll',
    highlightElement: true,
  },
  
  // Analytics Tutorial
  {
    id: 'analytics-intro',
    title: '📊 Savings Analytics Dashboard',
    description: 'Track your bill reduction journey with powerful analytics. See your total savings, success rates, and coaching progress all in one place.',
    page: '/analytics-dashboard',
    position: 'center',
    action: 'none',
  },
  {
    id: 'analytics-overview',
    title: 'Savings Overview & KPIs',
    description: 'Monitor your total savings, bills analyzed, active negotiations, and reduction percentage. Watch your savings grow as you apply our strategies.',
    page: '/analytics-dashboard',
    targetElement: '[data-testid="tab-overview"]',
    position: 'bottom',
    action: 'click',
    highlightElement: true,
  },
  {
    id: 'analytics-coaching',
    title: 'Coaching Progress Tracking',
    description: 'Premium members can track their coaching journey: current case, step completion, time invested, and total impact from personalized guidance.',
    page: '/analytics-dashboard',
    targetElement: '[data-testid="card-coaching-progress"]',
    position: 'left',
    action: 'scroll',
    highlightElement: true,
  },
  
  // Final Steps
  {
    id: 'navigation',
    title: '🧭 Easy Navigation',
    description: 'Use the bottom navigation to quickly switch between Home, Bill-AI, Guides (Coaching & Dispute), Analytics, and your Profile. Everything is one tap away.',
    page: '/',
    targetElement: 'nav[class*="bottom"]',
    position: 'top',
    action: 'none',
    highlightElement: true,
  },
  {
    id: 'completion',
    title: '🎉 You\'re Ready to Save!',
    description: 'You now know how to use GoldRock Health to reduce your medical bills. Start by uploading a bill to Bill-AI or jump into Premium Coaching. Let\'s save you thousands!',
    page: '/',
    position: 'center',
    action: 'none',
    ctaText: 'Start Saving Now',
  },
];

// Helper to get steps for a specific page
export function getStepsForPage(page: string): TutorialStep[] {
  return tutorialSteps.filter(step => step.page === page);
}

// Helper to get step by ID
export function getStepById(id: string): TutorialStep | undefined {
  return tutorialSteps.find(step => step.id === id);
}

// Helper to get next step
export function getNextStep(currentStepId: string): TutorialStep | undefined {
  const currentIndex = tutorialSteps.findIndex(step => step.id === currentStepId);
  if (currentIndex === -1 || currentIndex === tutorialSteps.length - 1) {
    return undefined;
  }
  return tutorialSteps[currentIndex + 1];
}

// Helper to get previous step
export function getPreviousStep(currentStepId: string): TutorialStep | undefined {
  const currentIndex = tutorialSteps.findIndex(step => step.id === currentStepId);
  if (currentIndex <= 0) {
    return undefined;
  }
  return tutorialSteps[currentIndex - 1];
}

// Get total number of steps
export function getTotalSteps(): number {
  return tutorialSteps.length;
}

// Get step number (1-indexed)
export function getStepNumber(stepId: string): number {
  const index = tutorialSteps.findIndex(step => step.id === stepId);
  return index === -1 ? 0 : index + 1;
}
