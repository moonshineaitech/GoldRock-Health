import { useState } from "react";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Copy, 
  ExternalLink, 
  Shield, 
  Download, 
  CreditCard, 
  FileText, 
  Smartphone, 
  CheckCircle,
  AlertTriangle,
  Globe,
  Lock,
  User,
  Calendar,
  Building,
  Heart,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface InsuranceProvider {
  name: string;
  portalName: string;
  url: string;
  appName?: string;
  color: string;
  notes: string;
}

interface StepProps {
  step: number;
  title: string;
  description: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function GuideStep({ step, title, description, children, isOpen, onToggle }: StepProps) {
  return (
    <MobileCard className="overflow-hidden">
      <motion.button
        className="w-full text-left"
        onClick={onToggle}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between p-1">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">{step}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
              <p className="text-xs text-gray-600">{description}</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </motion.div>
        </div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-3 px-1 border-t border-gray-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileCard>
  );
}

function ProviderCard({ provider }: { provider: InsuranceProvider }) {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(provider.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MobileCard className={`border-l-4 border-${provider.color}-500`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{provider.name}</h3>
            <p className="text-xs text-gray-600">{provider.portalName}</p>
          </div>
          <div className={`w-12 h-12 bg-${provider.color}-100 rounded-2xl flex items-center justify-center`}>
            <Building className={`h-6 w-6 text-${provider.color}-600`} />
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Portal URL:</span>
            <button 
              onClick={copyUrl}
              className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
              data-testid={`copy-${provider.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-gray-600 font-mono bg-white p-2 rounded border break-all">
            {provider.url}
          </p>
        </div>
        
        {provider.appName && (
          <div className="flex items-center space-x-2 text-xs text-gray-700">
            <Smartphone className="h-4 w-4" />
            <span>Mobile App: <strong>{provider.appName}</strong></span>
          </div>
        )}
        
        <p className="text-xs text-gray-600">{provider.notes}</p>
      </div>
    </MobileCard>
  );
}

export default function PortalAccessGuide() {
  const [openStep, setOpenStep] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<'steps' | 'providers' | 'tips'>('steps');

  const handleStepToggle = (stepNumber: number) => {
    setOpenStep(openStep === stepNumber ? null : stepNumber);
  };

  const majorProviders: InsuranceProvider[] = [
    {
      name: "UnitedHealthcare",
      portalName: "myuhc.com Member Portal",
      url: "https://www.uhc.com/",
      appName: "UnitedHealthcare",
      color: "blue",
      notes: "Uses One Healthcare ID for login. Largest health insurance provider in the US."
    },
    {
      name: "Anthem Blue Cross Blue Shield",
      portalName: "Anthem Member Portal",
      url: "https://www.anthem.com/account-login/",
      appName: "Anthem",
      color: "indigo",
      notes: "National network with state-specific portals. Check your state's Anthem portal."
    },
    {
      name: "Aetna",
      portalName: "Aetna Member Portal", 
      url: "https://www.aetna.com/",
      appName: "Aetna Health",
      color: "purple",
      notes: "Part of CVS Health. Offers comprehensive digital health tools."
    },
    {
      name: "Cigna Healthcare",
      portalName: "myCigna Portal",
      url: "https://my.cigna.com/",
      appName: "myCigna",
      color: "green",
      notes: "Global health services company with robust member portal features."
    },
    {
      name: "Humana",
      portalName: "MyHumana Portal",
      url: "https://www.humana.com/",
      appName: "MyHumana",
      color: "orange",
      notes: "Focuses on Medicare Advantage and wellness programs."
    },
    {
      name: "Kaiser Permanente",
      portalName: "kp.org Member Portal",
      url: "https://kp.org/",
      appName: "Kaiser Permanente",
      color: "teal",
      notes: "Integrated health system with comprehensive member portal access."
    },
    {
      name: "Health Net",
      portalName: "Health Net Member Portal",
      url: "https://www.healthnet.com/content/healthnet/en_us/login.html",
      appName: "Health Net",
      color: "red",
      notes: "Requires member ID from insurance card. California-based provider."
    },
    {
      name: "Medicare",
      portalName: "Medicare.gov Portal",
      url: "https://www.medicare.gov/",
      appName: "Medicare",
      color: "gray",
      notes: "Federal program portal for Medicare claims and coverage information."
    }
  ];

  return (
    <MobileLayout title="Get Your Bills from Portals" showBottomNav={true}>
      <div className="space-y-4 pb-4">
        {/* Header */}
        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Download className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-xl font-black text-blue-700 mb-2">Access Your Medical Bills</h1>
            <p className="text-sm text-blue-600">Step-by-step guide to download bills from insurance & provider portals</p>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-2xl border border-gray-200 shadow-sm">
          {[
            { id: 'steps', label: 'Steps', icon: FileText },
            { id: 'providers', label: 'Providers', icon: Building },
            { id: 'tips', label: 'Tips', icon: Shield }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`flex-1 py-3 px-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-blue-700 bg-blue-50 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab(tab.id as any)}
                data-testid={`tab-${tab.id}`}
              >
                <div className="flex items-center justify-center space-x-1">
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'steps' && (
            <motion.div
              key="steps"
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <GuideStep
                step={1}
                title="Find Your Provider's Portal"
                description="Locate your insurance or healthcare provider's website"
                isOpen={openStep === 1}
                onToggle={() => handleStepToggle(1)}
              >
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-bold text-blue-700 text-sm mb-2">What You'll Need:</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        <span>Your insurance card or member ID</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        <span>Personal information (name, DOB, SSN)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        <span>Valid email address</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700">
                    Check the "Providers" tab above for direct links to major insurance portals. 
                    You can copy these URLs and paste them into your browser.
                  </p>
                </div>
              </GuideStep>

              <GuideStep
                step={2}
                title="Register or Log Into Portal"
                description="Create account or sign in to existing portal"
                isOpen={openStep === 2}
                onToggle={() => handleStepToggle(2)}
              >
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-bold text-green-700 text-sm mb-2">Registration Process:</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <div>1. Click "Register" or "Sign Up" on portal homepage</div>
                      <div>2. Enter your member ID from insurance card</div>
                      <div>3. Provide personal verification information</div>
                      <div>4. Create username and secure password</div>
                      <div>5. Verify email address when prompted</div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-bold text-yellow-700 text-sm">First-Time Users</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Some portals require approval from your provider's office. Contact them if you can't register online.
                    </p>
                  </div>
                </div>
              </GuideStep>

              <GuideStep
                step={3}
                title="Navigate to Billing Section"
                description="Find bills, statements, and claims in your portal"
                isOpen={openStep === 3}
                onToggle={() => handleStepToggle(3)}
              >
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    Look for these sections in your portal menu:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <CreditCard className="h-5 w-5 mx-auto mb-2 text-gray-600" />
                      <span className="text-xs font-medium text-gray-700">Billing</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <FileText className="h-5 w-5 mx-auto mb-2 text-gray-600" />
                      <span className="text-xs font-medium text-gray-700">Statements</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <Download className="h-5 w-5 mx-auto mb-2 text-gray-600" />
                      <span className="text-xs font-medium text-gray-700">Claims</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <Heart className="h-5 w-5 mx-auto mb-2 text-gray-600" />
                      <span className="text-xs font-medium text-gray-700">Accounts</span>
                    </div>
                  </div>
                </div>
              </GuideStep>

              <GuideStep
                step={4}
                title="Download Your Bills"
                description="Save bills and EOBs to your device"
                isOpen={openStep === 4}
                onToggle={() => handleStepToggle(4)}
              >
                <div className="space-y-3">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-bold text-purple-700 text-sm mb-2">Download Process:</h4>
                    <div className="text-sm text-purple-700 space-y-1">
                      <div>1. Click on individual bills or statements</div>
                      <div>2. Look for "Download PDF" or "Print" buttons</div>
                      <div>3. Save files with descriptive names (date_provider_amount)</div>
                      <div>4. Download Explanation of Benefits (EOB) documents</div>
                      <div>5. Keep digital copies for your records</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700">
                    <strong>Pro Tip:</strong> Download both itemized bills and insurance EOBs to compare charges and ensure accuracy.
                  </p>
                </div>
              </GuideStep>

              <GuideStep
                step={5}
                title="Upload to GoldRock AI"
                description="Bring your bills to our AI analyzer"
                isOpen={openStep === 5}
                onToggle={() => handleStepToggle(5)}
              >
                <div className="space-y-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <h4 className="font-bold text-emerald-700 text-sm mb-2">Ready to Analyze:</h4>
                    <div className="text-sm text-emerald-700 space-y-1">
                      <div>• Upload your downloaded PDF bills</div>
                      <div>• AI will scan for errors and overcharges</div>
                      <div>• Get professional dispute templates</div>
                      <div>• Receive personalized reduction strategies</div>
                    </div>
                  </div>
                  
                  <MobileButton 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600"
                    onClick={() => window.location.href = '/bill-ai'}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Analyze My Bills Now
                  </MobileButton>
                </div>
              </GuideStep>
            </motion.div>
          )}

          {activeTab === 'providers' && (
            <motion.div
              key="providers"
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="text-center mb-4">
                <h3 className="font-bold text-gray-900 mb-2">Major Insurance Providers</h3>
                <p className="text-sm text-gray-600">Click "Copy" next to any URL to copy the portal link</p>
              </div>
              
              {majorProviders.map((provider, index) => (
                <motion.div
                  key={provider.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProviderCard provider={provider} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'tips' && (
            <motion.div
              key="tips"
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <MobileCard>
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 mb-3">Portal Access Tips</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Lock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm text-blue-800 mb-1">Security First</h4>
                        <p className="text-xs text-blue-700">Use strong passwords and enable two-factor authentication when available.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <Smartphone className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm text-green-800 mb-1">Mobile Apps Available</h4>
                        <p className="text-xs text-green-700">Most major insurers offer mobile apps with the same portal features.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm text-yellow-800 mb-1">Check Regularly</h4>
                        <p className="text-xs text-yellow-700">New bills and claims typically appear within 24-48 hours of processing.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                      <User className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm text-purple-800 mb-1">Family Access</h4>
                        <p className="text-xs text-purple-700">You can often add authorized family members to access your portal.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm text-red-800 mb-1">Troubleshooting</h4>
                        <p className="text-xs text-red-700">If you can't access your portal, contact customer service at the number on your insurance card.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </MobileCard>

              <MobileCard>
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900 text-sm">What Documents to Download:</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Itemized bills with procedure codes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Explanation of Benefits (EOB) documents</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Claims summaries and processing details</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Payment history and outstanding balances</span>
                    </div>
                  </div>
                </div>
              </MobileCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Globe className="h-8 w-8 mx-auto mb-2" />
          <h3 className="font-bold text-lg mb-1">Ready to Get Your Bills?</h3>
          <p className="text-blue-100 text-sm mb-3">
            Use the provider links above to access your portal and download your medical bills
          </p>
          <MobileButton 
            className="bg-white text-blue-600 hover:bg-gray-50 font-bold"
            onClick={() => setActiveTab('providers')}
          >
            View Provider Links
          </MobileButton>
        </motion.div>
      </div>
    </MobileLayout>
  );
}