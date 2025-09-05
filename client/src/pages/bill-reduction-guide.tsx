import { useState } from "react";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Phone, 
  Clock, 
  Shield, 
  Target, 
  TrendingDown, 
  Calculator,
  Heart,
  Crown,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink
} from "lucide-react";

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
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
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

function PremiumFeature({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-3 mt-3">
      <div className="flex items-center space-x-2 mb-2">
        <Crown className="h-4 w-4 text-orange-600" />
        <span className="text-sm font-bold text-orange-700">Premium Feature</span>
      </div>
      <div className="text-sm text-gray-700">
        {children}
      </div>
    </div>
  );
}

export default function BillReductionGuide() {
  const [openStep, setOpenStep] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<'guide' | 'tools' | 'templates'>('guide');

  const handleStepToggle = (stepNumber: number) => {
    setOpenStep(openStep === stepNumber ? null : stepNumber);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <MobileLayout title="Medical Bill Reduction Guide" showBottomNav={true}>
      <div className="space-y-4 pb-4">
        {/* Header Stats */}
        <motion.div 
          className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-4">
            <h1 className="text-xl font-black text-emerald-700 mb-2">Expert Bill Reduction Strategies</h1>
            <p className="text-sm text-emerald-600">Professional techniques that save patients $50K-$500K+</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-700">80%</div>
              <div className="text-xs text-emerald-600">Bills Have Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-700">50-90%</div>
              <div className="text-xs text-emerald-600">Avg Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-700">95%</div>
              <div className="text-xs text-emerald-600">Success Rate</div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-2xl border border-gray-200 shadow-sm">
          {[
            { id: 'guide', label: 'Step Guide', icon: FileText },
            { id: 'tools', label: 'Tools', icon: Calculator },
            { id: 'templates', label: 'Templates', icon: Copy }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`flex-1 py-3 px-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-emerald-700 bg-emerald-50 border-b-2 border-emerald-500'
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
          {activeTab === 'guide' && (
            <motion.div
              key="guide"
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <GuideStep
                step={1}
                title="Don't Pay Immediately"
                description="Hospitals don't rush to collections - you have time"
                isOpen={openStep === 1}
                onToggle={() => handleStepToggle(1)}
              >
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="font-bold text-red-700 text-sm">Never Pay With Credit Card First</span>
                    </div>
                    <p className="text-sm text-red-700">
                      Bills typically aren't sent to collections for 90-120 days. Use this time to your advantage.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-900 text-sm">Action Items:</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Set bill aside for 7-14 days to plan your approach</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Research the hospital's financial assistance programs</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Gather your financial documents</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GuideStep>

              <GuideStep
                step={2}
                title="Request Itemized Bill"
                description="Get detailed breakdown with billing codes"
                isOpen={openStep === 2}
                onToggle={() => handleStepToggle(2)}
              >
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    An itemized bill shows every charge, procedure code, and service. This is where you'll find the errors.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-bold text-blue-700 text-sm mb-2">What to Request:</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>• Line-by-line itemized bill</div>
                      <div>• CPT codes (procedure codes)</div>
                      <div>• ICD-10 codes (diagnosis codes)</div>
                      <div>• Date and time of each service</div>
                      <div>• Provider name for each charge</div>
                    </div>
                  </div>

                  <PremiumFeature>
                    <strong>Premium Script Template:</strong> "I need a detailed itemized bill showing all CPT and ICD-10 codes, service dates, and provider names. Please include the medical record number and patient account details for verification."
                  </PremiumFeature>
                </div>
              </GuideStep>

              <GuideStep
                step={3}
                title="Check for Billing Errors"
                description="80% of bills contain errors - find yours"
                isOpen={openStep === 3}
                onToggle={() => handleStepToggle(3)}
              >
                <div className="space-y-3">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="font-bold text-yellow-700 text-sm mb-2">Common Errors to Look For:</h4>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <div>• Duplicate charges for same procedure</div>
                      <div>• Services you didn't receive</div>
                      <div>• Wrong procedure codes (upcoding)</div>
                      <div>• Unbundled charges (should be bundled)</div>
                      <div>• Incorrect dates or times</div>
                      <div>• Wrong patient information</div>
                    </div>
                  </div>

                  <PremiumFeature>
                    <strong>Professional Error Detection Checklist:</strong> Access our comprehensive 47-point error detection checklist used by medical billing advocates, including specific code combinations that are frequently overbilled.
                  </PremiumFeature>
                </div>
              </GuideStep>

              <GuideStep
                step={4}
                title="Research Fair Market Prices"
                description="Use price transparency data as leverage"
                isOpen={openStep === 4}
                onToggle={() => handleStepToggle(4)}
              >
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    Hospitals must publish their standard charges. Use this data to negotiate.
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-900 text-sm">Research Tools:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Healthcare Bluebook</span>
                        <ExternalLink className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">FAIR Health Consumer</span>
                        <ExternalLink className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Hospital Price Transparency</span>
                        <ExternalLink className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <PremiumFeature>
                    <strong>AI-Powered Price Analysis:</strong> Upload your bill and get instant comparison against 10,000+ hospitals nationwide, with specific negotiation leverage points highlighted.
                  </PremiumFeature>
                </div>
              </GuideStep>

              <GuideStep
                step={5}
                title="Apply for Charity Care"
                description="Get 50-100% bill forgiveness"
                isOpen={openStep === 5}
                onToggle={() => handleStepToggle(5)}
              >
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-bold text-green-700 text-sm mb-2">Eligibility Guidelines:</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <div>• Free care: Usually ≤200% Federal Poverty Level</div>
                      <div>• Discounted care: 200-400% FPL</div>
                      <div>• Hardship programs: When bills exceed 20% annual income</div>
                      <div>• Available even with insurance coverage</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-900 text-sm">Required Documents:</h4>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>• Last 3 months pay stubs</div>
                      <div>• Previous year tax return</div>
                      <div>• Bank statements</div>
                      <div>• Insurance cards/documentation</div>
                      <div>• Proof of household size</div>
                    </div>
                  </div>

                  <PremiumFeature>
                    <strong>Charity Care Application Assistant:</strong> Pre-filled applications for 500+ major hospitals, plus appeal templates if initially denied. Success rate increases from 60% to 85% with proper preparation.
                  </PremiumFeature>
                </div>
              </GuideStep>

              <GuideStep
                step={6}
                title="Negotiate with Billing Department"
                description="Use research and errors as leverage"
                isOpen={openStep === 6}
                onToggle={() => handleStepToggle(6)}
              >
                <div className="space-y-3">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-bold text-purple-700 text-sm mb-2">Negotiation Strategy:</h4>
                    <div className="text-sm text-purple-700 space-y-1">
                      <div>• Start with errors you found</div>
                      <div>• Present fair market price research</div>
                      <div>• Offer lump sum payment for discount</div>
                      <div>• Be polite but persistent</div>
                      <div>• Get all agreements in writing</div>
                    </div>
                  </div>

                  <PremiumFeature>
                    <strong>Professional Negotiation Scripts:</strong> Word-for-word scripts used by medical billing advocates, including specific phrases that trigger maximum discounts and settlement offers.
                  </PremiumFeature>
                </div>
              </GuideStep>

              <GuideStep
                step={7}
                title="File Formal Disputes"
                description="Use legal protections when negotiation fails"
                isOpen={openStep === 7}
                onToggle={() => handleStepToggle(7)}
              >
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-bold text-blue-700 text-sm mb-2">Patient-Provider Dispute Resolution (PPDR):</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>• For bills $400+ above estimate</div>
                      <div>• Must file within 120 days</div>
                      <div>• $25 fee (refunded if you win)</div>
                      <div>• Independent third-party review</div>
                      <div>• Provider can't send to collections during process</div>
                    </div>
                  </div>

                  <PremiumFeature>
                    <strong>Legal Dispute Toolkit:</strong> Complete PPDR filing assistance, plus template letters for state insurance commissioners, attorney generals, and credit reporting disputes.
                  </PremiumFeature>
                </div>
              </GuideStep>
            </motion.div>
          )}

          {activeTab === 'tools' && (
            <motion.div
              key="tools"
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <MobileCard>
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 mb-3">Professional Tools & Resources</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">CPT Code Lookup</h4>
                        <p className="text-xs text-gray-600">Verify procedure codes on your bill</p>
                      </div>
                      <Crown className="h-5 w-5 text-orange-500" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">ICD-10 Diagnosis Checker</h4>
                        <p className="text-xs text-gray-600">Validate diagnosis codes</p>
                      </div>
                      <Crown className="h-5 w-5 text-orange-500" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">Error Detection Scanner</h4>
                        <p className="text-xs text-gray-600">AI-powered bill analysis</p>
                      </div>
                      <Crown className="h-5 w-5 text-orange-500" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">Price Comparison Tool</h4>
                        <p className="text-xs text-gray-600">Compare against 10K+ hospitals</p>
                      </div>
                      <Crown className="h-5 w-5 text-orange-500" />
                    </div>
                  </div>
                  
                  <MobileButton 
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-600"
                    onClick={() => window.location.href = '/premium'}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Unlock Professional Tools
                  </MobileButton>
                </div>
              </MobileCard>
            </motion.div>
          )}

          {activeTab === 'templates' && (
            <motion.div
              key="templates"
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <MobileCard>
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 mb-3">Expert Letter Templates</h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-green-800">Error Dispute Letter</h4>
                        <button 
                          onClick={() => copyToClipboard("Error dispute template...")}
                          className="p-1 hover:bg-green-200 rounded"
                        >
                          <Copy className="h-4 w-4 text-green-600" />
                        </button>
                      </div>
                      <p className="text-xs text-green-700 mb-2">Professional template for billing error disputes</p>
                      <div className="text-xs text-green-600 bg-white p-2 rounded border">
                        "Dear Billing Manager, I am writing to dispute the following charges on account #[ACCOUNT]..."
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-blue-800">Hardship Appeal Letter</h4>
                        <Crown className="h-4 w-4 text-orange-500" />
                      </div>
                      <p className="text-xs text-blue-700">For charity care appeals and hardship cases</p>
                    </div>
                    
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-purple-800">Settlement Negotiation Letter</h4>
                        <Crown className="h-4 w-4 text-orange-500" />
                      </div>
                      <p className="text-xs text-purple-700">Professional lump-sum settlement offers</p>
                    </div>
                    
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-red-800">Credit Report Dispute</h4>
                        <Crown className="h-4 w-4 text-orange-500" />
                      </div>
                      <p className="text-xs text-red-700">Remove medical debt from credit reports</p>
                    </div>
                  </div>
                  
                  <MobileButton 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600"
                    onClick={() => window.location.href = '/premium'}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Get All Templates
                  </MobileButton>
                </div>
              </MobileCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4 text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Heart className="h-8 w-8 mx-auto mb-2" />
          <h3 className="font-bold text-lg mb-1">Ready to Start Saving?</h3>
          <p className="text-emerald-100 text-sm mb-3">
            Join thousands who've reduced their medical bills by $50K-$500K+
          </p>
          <MobileButton 
            className="bg-white text-emerald-600 hover:bg-gray-50 font-bold"
            onClick={() => window.location.href = '/bill-analyzer'}
          >
            Analyze My Bill Now
          </MobileButton>
        </motion.div>
      </div>
    </MobileLayout>
  );
}