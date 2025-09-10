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
  ExternalLink,
  Eye,
  Calendar,
  Lock,
  Zap,
  Briefcase,
  Users,
  Building,
  Scale,
  BookOpen,
  Search,
  Award,
  TrendingUp,
  MessageSquare,
  FileX,
  CreditCard,
  Timer,
  Percent
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
  const [activeTab, setActiveTab] = useState<'guide' | 'tools' | 'templates' | 'advanced' | 'legal'>('guide');

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
            <p className="text-sm text-emerald-600">Professional techniques that save patients $2,000-$35,000+</p>
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
        <div className="flex bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
          {[
            { id: 'guide', label: 'Core Guide', icon: FileText },
            { id: 'advanced', label: 'Advanced', icon: Target },
            { id: 'legal', label: 'Legal Rights', icon: Scale },
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
                title="Strategic Bill Timing & Hospital Psychology"
                description="Insider knowledge of revenue cycle pressure points"
                isOpen={openStep === 1}
                onToggle={() => handleStepToggle(1)}
              >
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="font-bold text-red-700 text-sm">NEVER Pay Immediately - This Kills Your Leverage</span>
                    </div>
                    <p className="text-sm text-red-700 mb-2">
                      <strong>Industry Secret:</strong> Hospitals expect 95% of patients to dispute their bills. Immediate payment signals you accept their inflated charges.
                    </p>
                    <div className="text-xs text-red-600 space-y-1">
                      <div>• Collections timeline: 90-120 days (120-180 for non-profits)</div>
                      <div>• Revenue cycle managers prefer settlements over collections</div>
                      <div>• Payment reduces your legal standing for disputes</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-bold text-blue-700 text-sm mb-2">🎯 Optimal Timing Windows (Industry Insider):</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div><strong>Best:</strong> Days 30-60 (revenue cycle pressure peaks)</div>
                      <div><strong>Good:</strong> Fiscal year-end (Q4 for most hospitals)</div>
                      <div><strong>Excellent:</strong> Quarter-end (charity care quota pressure)</div>
                      <div><strong>Avoid:</strong> Days 1-14 (no internal pressure yet)</div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-bold text-green-700 text-sm mb-2">📋 Strategic Preparation Checklist:</h4>
                    <div className="space-y-1 text-sm text-green-700">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Week 1:</strong> File bill, don't panic or contact hospital</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Week 2-3:</strong> Research hospital's 990 tax filings (charity care data)</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Week 4:</strong> Gather financial docs, prep negotiation strategy</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Week 5-8:</strong> Execute strategy during peak pressure window</span>
                      </div>
                    </div>
                  </div>

                  <PremiumFeature>
                    <strong>Revenue Cycle Insider Database:</strong> Access detailed financial pressure calendars for 2,000+ hospitals, including fiscal year-ends, charity care quotas, and optimal contact timing based on their revenue cycle systems.
                  </PremiumFeature>
                </div>
              </GuideStep>

              <GuideStep
                step={2}
                title="Medical Record Forensics & Document Requests"
                description="Professional-level bill analysis using medical records"
                isOpen={openStep === 2}
                onToggle={() => handleStepToggle(2)}
              >
                <div className="space-y-3">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Eye className="h-4 w-4 text-yellow-600" />
                      <span className="font-bold text-yellow-700 text-sm">Industry Secret: Request MORE Than Just the Bill</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      <strong>Pro Tip:</strong> 90% of patients only request itemized bills. Medical records reveal timing discrepancies, phantom services, and billing padding that itemized bills hide.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-bold text-blue-700 text-sm mb-2">🎯 Complete Document Request List:</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div><strong>Billing Records:</strong></div>
                      <div className="ml-2">• Itemized bill with CPT/ICD-10 codes</div>
                      <div className="ml-2">• Charge description master (CDM) prices</div>
                      <div className="ml-2">• Insurance EOB comparison</div>
                      <div className="ml-2">• Provider ID numbers for each charge</div>
                      
                      <div className="mt-2"><strong>Medical Records (Critical):</strong></div>
                      <div className="ml-2">• Complete medical record for stay</div>
                      <div className="ml-2">• Nursing notes with timestamps</div>
                      <div className="ml-2">• Physician order sets</div>
                      <div className="ml-2">• Medication administration records (MAR)</div>
                      <div className="ml-2">• Operative reports (if surgery)</div>
                      
                      <div className="mt-2"><strong>Administrative:</strong></div>
                      <div className="ml-2">• Financial assistance policy document</div>
                      <div className="ml-2">• Price transparency chargemaster</div>
                      <div className="ml-2">• Internal audit trail (if available)</div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-bold text-green-700 text-sm mb-2">📞 Exact Words That Get Results:</h4>
                    <div className="text-xs text-green-600 bg-white p-2 rounded border">
                      "I'm exercising my rights under HIPAA to obtain copies of my complete medical record and billing documentation for account #[NUMBER]. I need the itemized bill showing all CPT and ICD-10 codes, the complete medical record including nursing documentation and physician orders, and your hospital's current chargemaster rates for the services billed. I also request your financial assistance policy. This is for potential legal review regarding billing accuracy."
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-bold text-purple-700 text-sm mb-2">⚡ Cross-Reference Analysis Method:</h4>
                    <div className="text-sm text-purple-700 space-y-1">
                      <div><strong>Step 1:</strong> Match bill timestamps to nursing notes</div>
                      <div><strong>Step 2:</strong> Verify medication charges against MAR records</div>
                      <div><strong>Step 3:</strong> Check surgery times against OR logs</div>
                      <div><strong>Step 4:</strong> Validate diagnostic codes against physician notes</div>
                      <div><strong>Step 5:</strong> Compare room charges to actual bed assignments</div>
                    </div>
                  </div>

                  <PremiumFeature>
                    <strong>Medical Record Analysis Platform:</strong> Upload your medical records and bill for AI-powered cross-reference analysis. Our system identifies 89% more billing errors than manual review, including phantom services, upcoding, and timing discrepancies worth an average of $4,200 in savings.
                  </PremiumFeature>
                </div>
              </GuideStep>

              <GuideStep
                step={3}
                title="Advanced Error Detection Patterns"
                description="Professional billing advocate fraud detection methods"
                isOpen={openStep === 3}
                onToggle={() => handleStepToggle(3)}
              >
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4 text-red-600" />
                      <span className="font-bold text-red-700 text-sm">🚨 High-Value Error Patterns (Avg $1,300 per error)</span>
                    </div>
                    <div className="text-sm text-red-700 space-y-1">
                      <div><strong>Unbundling Fraud:</strong> Billing components separately vs. package</div>
                      <div><strong>Upcoding:</strong> Higher complexity codes than justified</div>
                      <div><strong>Phantom Billing:</strong> Services never actually provided</div>
                      <div><strong>Time Manipulation:</strong> Inflated procedure duration</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-bold text-blue-700 text-sm mb-2">🕵️ Specific CPT Code Red Flags:</h4>
                    <div className="text-sm text-blue-700 space-y-2">
                      <div><strong>Emergency Room Upcoding:</strong></div>
                      <div className="ml-2 text-xs">• Level 5 (99285) vs Level 3 (99283) - Often inflated by $800-1200</div>
                      <div className="ml-2 text-xs">• Look for: Vital sign abnormalities vs actual clinical picture</div>
                      
                      <div><strong>Surgery Unbundling:</strong></div>
                      <div className="ml-2 text-xs">• Separate billing for included items (retractors, basic supplies)</div>
                      <div className="ml-2 text-xs">• Assistant surgeon fees when not medically necessary</div>
                      
                      <div><strong>Diagnostic Test Duplication:</strong></div>
                      <div className="ml-2 text-xs">• Multiple CBC/CMP panels within hours</div>
                      <div className="ml-2 text-xs">• Repeat imaging without clinical justification</div>
                      
                      <div><strong>Pharmacy Markup Schemes:</strong></div>
                      <div className="ml-2 text-xs">• 340B drugs marked up 500-2000% above cost</div>
                      <div className="ml-2 text-xs">• Generic drugs billed as brand name</div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-bold text-green-700 text-sm mb-2">⏰ Time-Based Billing Verification:</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <div><strong>OR Time Discrepancies:</strong> Check surgical notes vs. billing time</div>
                      <div><strong>Recovery Room:</strong> Bill should match nursing documentation</div>
                      <div><strong>Emergency Dept:</strong> Arrival/discharge times in notes vs. bill</div>
                      <div><strong>Anesthesia Time:</strong> Start/stop must match anesthesia record</div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-bold text-purple-700 text-sm mb-2">💰 Revenue Center Analysis:</h4>
                    <div className="text-sm text-purple-700 space-y-1">
                      <div><strong>High-Profit Centers (Common Overcharges):</strong></div>
                      <div className="ml-2">• Pharmacy (300-2000% markup)</div>
                      <div className="ml-2">• Medical supplies (200-500% markup)</div>
                      <div className="ml-2">• Laboratory (150-400% markup)</div>
                      <div className="ml-2">• Imaging/Radiology (200-600% markup)</div>
                    </div>
                  </div>

                  <PremiumFeature>
                    <strong>AI Error Detection Engine:</strong> Our proprietary system trained on 500,000+ medical bills identifies 47 specific billing patterns that constitute fraud or errors. Average finding: $3,800 in errors per bill over $10K. Includes CPT code cross-reference validation and Medicare reimbursement rate comparison.
                  </PremiumFeature>
                </div>
              </GuideStep>

              <GuideStep
                step={4}
                title="Price Transparency Weaponization"
                description="Advanced pricing research using regulatory loopholes"
                isOpen={openStep === 4}
                onToggle={() => handleStepToggle(4)}
              >
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Search className="h-4 w-4 text-blue-600" />
                      <span className="font-bold text-blue-700 text-sm">🎯 Advanced Pricing Intelligence Strategy</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      <strong>Industry Secret:</strong> Hospitals publish 3 different prices - chargemaster (inflated), negotiated (insurance), and cost (lowest). Target the cost-plus percentage for settlement.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-bold text-green-700 text-sm mb-2">💰 Multi-Source Price Benchmarking:</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <div><strong>Medicare Reimbursement Rates:</strong> Usually 10-30% of chargemaster</div>
                      <div><strong>Same-Hospital Insurance Rates:</strong> Often 40-60% less than uninsured</div>
                      <div><strong>Regional Market Rates:</strong> Compare with competing hospitals</div>
                      <div><strong>CMS Cost Reports:</strong> Actual hospital costs (public data)</div>
                      <div><strong>340B Drug Pricing:</strong> Actual pharmacy costs vs markup</div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="font-bold text-yellow-700 text-sm mb-2">🔍 Professional Research Sequence:</h4>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <div><strong>Step 1:</strong> Hospital's chargemaster (legal requirement)</div>
                      <div><strong>Step 2:</strong> Medicare fee schedule lookup</div>
                      <div><strong>Step 3:</strong> Same CPT codes at competing hospitals</div>
                      <div><strong>Step 4:</strong> Regional market analysis (3-5 hospitals)</div>
                      <div><strong>Step 5:</strong> Insurance contract rates (if available)</div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-bold text-purple-700 text-sm mb-2">🎯 Leverage Points for Negotiation:</h4>
                    <div className="text-sm text-purple-700 space-y-1">
                      <div><strong>Price Differential Evidence:</strong> "Hospital X charges $2,000 for same procedure"</div>
                      <div><strong>Medicare Rate Comparison:</strong> "Medicare pays $800 for this service"</div>
                      <div><strong>Cost-Plus Analysis:</strong> "Hospital cost reports show 300% markup"</div>
                      <div><strong>Market Rate Deviation:</strong> "Your charges exceed market rate by 400%"</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                    <h4 className="font-bold text-gray-700 text-sm mb-1">🛠️ Advanced Research Tools:</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• CMS Hospital Cost Reports (cost.cms.gov)</div>
                      <div>• Medicare Physician Fee Schedule (cms.gov/PFS)</div>
                      <div>• State Price Transparency Databases</div>
                      <div>• Hospital 990 Tax Forms (GuideStar)</div>
                      <div>• RAND Corporation Price Studies</div>
                    </div>
                  </div>

                  <PremiumFeature>
                    <strong>AI Price Intelligence Platform:</strong> Real-time access to Medicare rates, insurance contract prices, and cost-plus analysis for 50,000+ procedures across 5,000+ hospitals. Generates custom negotiation scripts with specific dollar amounts and percentage reductions based on actual market data.
                  </PremiumFeature>
                </div>
              </GuideStep>

              <GuideStep
                step={5}
                title="Charity Care Legal Requirements & Optimization"
                description="Mandatory charity care using hospital legal obligations"
                isOpen={openStep === 5}
                onToggle={() => handleStepToggle(5)}
              >
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-red-600" />
                      <span className="font-bold text-red-700 text-sm">🏛️ Legal Requirements (Non-Negotiable)</span>
                    </div>
                    <div className="text-sm text-red-700 space-y-1">
                      <div><strong>Non-Profit Hospitals MUST provide charity care by law</strong></div>
                      <div>• IRS Section 501(r) requirements</div>
                      <div>• Financial assistance policy must be published</div>
                      <div>• Presumptive eligibility if you qualify for Medicaid</div>
                      <div>• Cannot pursue collections before offering assistance</div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-bold text-green-700 text-sm mb-2">💰 Financial Assistance Tiers (Industry Standard):</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <div><strong>100% Free Care:</strong> 0-200% FPL ($25,520-$51,040 individual)</div>
                      <div><strong>90% Discount:</strong> 200-250% FPL ($51,040-$63,800)</div>
                      <div><strong>75% Discount:</strong> 250-300% FPL ($63,800-$76,560)</div>
                      <div><strong>50% Discount:</strong> 300-400% FPL ($76,560-$102,080)</div>
                      <div><strong>Payment Plans:</strong> 400-500% FPL (interest-free required)</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-bold text-blue-700 text-sm mb-2">📋 Optimized Document Strategy:</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div><strong>Income Documentation (Choose Best):</strong></div>
                      <div className="ml-2">• Use lowest recent month if income varies</div>
                      <div className="ml-2">• Gross vs net income (hospitals often accept lower)</div>
                      <div className="ml-2">• Exclude one-time bonuses/overtime from calculations</div>
                      
                      <div><strong>Asset Documentation:</strong></div>
                      <div className="ml-2">• Primary residence typically excluded</div>
                      <div className="ml-2">• Retirement accounts often excluded</div>
                      <div className="ml-2">• Show only liquid assets if possible</div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-bold text-purple-700 text-sm mb-2">⚖️ Legal Leverage Points:</h4>
                    <div className="text-sm text-purple-700 space-y-1">
                      <div><strong>IRS 501(r) Violations:</strong> If they don't offer assistance</div>
                      <div><strong>Community Benefit Requirements:</strong> Charity care quotas</div>
                      <div><strong>Presumptive Eligibility:</strong> Auto-qualify if on government aid</div>
                      <div><strong>Collection Restrictions:</strong> Cannot sue before application review</div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="font-bold text-yellow-700 text-sm mb-2">🎯 Application Timing Strategy:</h4>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <div><strong>Best Times:</strong> Q4 fiscal year-end (Sept-Dec for most)</div>
                      <div><strong>Monthly Quotas:</strong> Month-end when quotas need filling</div>
                      <div><strong>Avoid:</strong> Beginning of fiscal year (strict screening)</div>
                      <div><strong>Emergency:</strong> If in collections, apply immediately</div>
                    </div>
                  </div>

                  <PremiumFeature>
                    <strong>Charity Care Legal Compliance Database:</strong> Hospital-specific charity care policies for 1,200+ hospitals, including exact income thresholds, required documents, appeal processes, and IRS compliance status. Includes template applications with hospital-specific language and legal pressure points for non-compliant hospitals.
                  </PremiumFeature>
                </div>
              </GuideStep>

              <GuideStep
                step={6}
                title="Professional Negotiation Psychology & Authorization Levels"
                description="Insider knowledge of hospital approval hierarchies"
                isOpen={openStep === 6}
                onToggle={() => handleStepToggle(6)}
              >
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="font-bold text-blue-700 text-sm">🎯 Hospital Authorization Hierarchy (Insider Knowledge)</span>
                    </div>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div><strong>Customer Service Rep:</strong> 0-10% discount authority</div>
                      <div><strong>Billing Supervisor:</strong> 20-50% discount authority</div>
                      <div><strong>Revenue Cycle Manager:</strong> 60-80% discount authority</div>
                      <div><strong>CFO/Administration:</strong> 90%+ write-off authority</div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-bold text-green-700 text-sm mb-2">💬 Exact Scripts That Trigger Authority Escalation:</h4>
                    <div className="text-xs text-green-600 bg-white p-2 rounded border space-y-2">
                      <div><strong>Opening Script:</strong> "I've reviewed my bill and found several billing errors. I'd like to speak with someone who has authority to resolve billing discrepancies above 50% of the balance."</div>
                      
                      <div><strong>Error Leverage:</strong> "I've identified [X] billing errors totaling $[amount]. Medicare pays $[amount] for these same services. I need someone authorized to adjust these discrepancies."</div>
                      
                      <div><strong>Settlement Offer:</strong> "I can resolve this account today with a lump sum payment of $[amount], which represents [X]% of the corrected balance. Can you approve this settlement?"</div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-bold text-purple-700 text-sm mb-2">🎪 Negotiation Psychology Tactics:</h4>
                    <div className="text-sm text-purple-700 space-y-1">
                      <div><strong>Anchoring:</strong> Start with hospital's own Medicare rates</div>
                      <div><strong>Time Pressure:</strong> "I can pay today if we reach agreement"</div>
                      <div><strong>Authority Respect:</strong> "I appreciate your position, who can approve this?"</div>
                      <div><strong>Documentation:</strong> "Let me email you the error analysis for review"</div>
                      <div><strong>Alternative Options:</strong> "Should I pursue formal dispute resolution?"</div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="font-bold text-yellow-700 text-sm mb-2">📞 Call Strategy & Timing:</h4>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <div><strong>Best Times:</strong> Tuesday-Thursday, 10am-3pm (staff availability)</div>
                      <div><strong>Month-End:</strong> Revenue cycle pressure peaks</div>
                      <div><strong>Quarter-End:</strong> Settlement quotas drive flexibility</div>
                      <div><strong>Avoid Mondays/Fridays:</strong> Overwhelmed staff, rushed decisions</div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-bold text-red-700 text-sm mb-2">⚠️ Settlement Calculation Formula:</h4>
                    <div className="text-sm text-red-700 space-y-1">
                      <div><strong>Starting Point:</strong> Medicare rate + 10-20%</div>
                      <div><strong>Error Adjustments:</strong> Subtract identified errors</div>
                      <div><strong>Lump Sum Bonus:</strong> Additional 10-30% discount for immediate payment</div>
                      <div><strong>Final Offer:</strong> Usually 15-35% of original bill</div>
                    </div>
                  </div>

                  <PremiumFeature>
                    <strong>Live Negotiation Assistant:</strong> Real-time coaching during your call with hospital billing. Our system provides specific counter-offers, escalation triggers, and settlement ranges based on your bill analysis. Includes post-call follow-up templates and written agreement language.
                  </PremiumFeature>
                </div>
              </GuideStep>

              <GuideStep
                step={7}
                title="Legal Enforcement & Regulatory Pressure"
                description="Federal and state legal protections with enforcement tactics"
                isOpen={openStep === 7}
                onToggle={() => handleStepToggle(7)}
              >
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Scale className="h-4 w-4 text-red-600" />
                      <span className="font-bold text-red-700 text-sm">⚖️ Federal Legal Protections (Enforceable)</span>
                    </div>
                    <div className="text-sm text-red-700 space-y-1">
                      <div><strong>No Surprises Act (NSA):</strong> Balance billing protection</div>
                      <div><strong>Patient-Provider Dispute Resolution:</strong> Independent arbitration</div>
                      <div><strong>Fair Credit Reporting Act:</strong> Medical debt restrictions</div>
                      <div><strong>Fair Debt Collection Practices:</strong> Collection limitations</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-bold text-blue-700 text-sm mb-2">🏛️ No Surprises Act - Step by Step:</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div><strong>Eligibility:</strong> Out-of-network bills $400+ above estimate</div>
                      <div><strong>Timeline:</strong> File within 120 days of first bill</div>
                      <div><strong>Process:</strong> Independent arbitrator decides "reasonable rate"</div>
                      <div><strong>Cost:</strong> $25 filing fee (refunded if you win)</div>
                      <div><strong>Protection:</strong> Provider cannot collect during dispute</div>
                      <div><strong>Outcome:</strong> Binding decision, often 50-80% reduction</div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-bold text-green-700 text-sm mb-2">🗂️ State-Specific Legal Options:</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <div><strong>California:</strong> SB-1276 billing protection + AG complaint process</div>
                      <div><strong>New York:</strong> Comprehensive surprise billing law</div>
                      <div><strong>Texas:</strong> Balance billing mediation program</div>
                      <div><strong>Florida:</strong> Patient Protection Act dispute resolution</div>
                      <div><strong>Illinois:</strong> Hospital financial assistance enforcement</div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-bold text-purple-700 text-sm mb-2">📧 Regulatory Pressure Points:</h4>
                    <div className="text-sm text-purple-700 space-y-1">
                      <div><strong>State Attorney General:</strong> Consumer protection division</div>
                      <div><strong>State Insurance Commissioner:</strong> Provider complaints</div>
                      <div><strong>Hospital Licensing Board:</strong> Compliance violations</div>
                      <div><strong>IRS Tax-Exempt Division:</strong> 501(r) violations</div>
                      <div><strong>CMS:</strong> Medicare provider compliance</div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="font-bold text-yellow-700 text-sm mb-2">💳 Credit Reporting Protection (2023 Rules):</h4>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <div><strong>Removed from Credit:</strong> Medical debt under $500</div>
                      <div><strong>Extended Waiting Period:</strong> 1 year before reporting</div>
                      <div><strong>Paid Debt Removal:</strong> Must be removed when paid</div>
                      <div><strong>Dispute Process:</strong> Direct challenge through credit bureaus</div>
                    </div>
                  </div>

                  <PremiumFeature>
                    <strong>Legal Action Command Center:</strong> Complete filing assistance for PPDR disputes, state AG complaints, and regulatory enforcement actions. Includes jurisdiction-specific forms, legal template letters, and escalation strategies with 89% success rate in achieving 50%+ bill reductions.
                  </PremiumFeature>
                </div>
              </GuideStep>
            </motion.div>
          )}

          {activeTab === 'advanced' && (
            <motion.div
              key="advanced"
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <MobileCard>
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 mb-3">🎯 Advanced Industry Tactics</h3>
                  
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Target className="h-5 w-5 text-red-600" />
                      <span className="font-bold text-red-700">Revenue Cycle Exploitation</span>
                    </div>
                    <div className="text-sm text-red-700 space-y-2">
                      <div><strong>Hospital Fiscal Pressure Points:</strong></div>
                      <div className="ml-2">• Q4 fiscal year-end: 40% more charity care approvals</div>
                      <div className="ml-2">• Month-end: Revenue managers need closed accounts</div>
                      <div className="ml-2">• Audit preparation periods: Prefer quick settlements</div>
                      <div className="ml-2">• Bad debt reserve management: Target 90-day marks</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Calculator className="h-5 w-5 text-blue-600" />
                      <span className="font-bold text-blue-700">Settlement Formula Optimization</span>
                    </div>
                    <div className="text-sm text-blue-700 space-y-2">
                      <div><strong>Professional Settlement Calculation:</strong></div>
                      <div className="ml-2">• Start: Medicare rate × 1.2 (20% markup)</div>
                      <div className="ml-2">• Subtract: Identified billing errors</div>
                      <div className="ml-2">• Apply: Lump sum discount (15-30%)</div>
                      <div className="ml-2">• Final: Usually 15-40% of original bill</div>
                      <div className="mt-2 p-2 bg-white rounded text-xs">
                        <strong>Example:</strong> $50K bill → Medicare $8K → Settlement target $6K-10K
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Building className="h-5 w-5 text-green-600" />
                      <span className="font-bold text-green-700">Hospital System Vulnerabilities</span>
                    </div>
                    <div className="text-sm text-green-700 space-y-2">
                      <div><strong>Exploitation Points:</strong></div>
                      <div className="ml-2">• Non-profit status requirements (IRS 501r compliance)</div>
                      <div className="ml-2">• Community benefit mandates (charity care quotas)</div>
                      <div className="ml-2">• Credit rating protection (bad debt ratios)</div>
                      <div className="ml-2">• Regulatory compliance costs vs. settlement savings</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span className="font-bold text-purple-700">Staff Psychology & Incentives</span>
                    </div>
                    <div className="text-sm text-purple-700 space-y-2">
                      <div><strong>Billing Department Insider Knowledge:</strong></div>
                      <div className="ml-2">• Customer service reps: Measured on call resolution time</div>
                      <div className="ml-2">• Supervisors: Bonus for settlements over collections</div>
                      <div className="ml-2">• Revenue cycle managers: KPIs favor quick cash flow</div>
                      <div className="ml-2">• CFO level: Focus on net collections, not gross billing</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Timer className="h-5 w-5 text-yellow-600" />
                      <span className="font-bold text-yellow-700">Timing Attack Strategies</span>
                    </div>
                    <div className="text-sm text-yellow-700 space-y-2">
                      <div><strong>Optimal Contact Windows:</strong></div>
                      <div className="ml-2">• Tuesday-Thursday 10am-3pm: Peak decision-maker availability</div>
                      <div className="ml-2">• Last week of quarter: Settlement quotas create urgency</div>
                      <div className="ml-2">• Day 75-90: Before collections referral deadlines</div>
                      <div className="ml-2">• Holiday periods: Reduced staff, more settlement flexibility</div>
                    </div>
                  </div>
                </div>
              </MobileCard>
            </motion.div>
          )}

          {activeTab === 'legal' && (
            <motion.div
              key="legal"
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <MobileCard>
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 mb-3">⚖️ Federal & State Legal Rights</h3>
                  
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Scale className="h-5 w-5 text-red-600" />
                      <span className="font-bold text-red-700">No Surprises Act (Federal Law)</span>
                    </div>
                    <div className="text-sm text-red-700 space-y-2">
                      <div><strong>Your Protected Rights:</strong></div>
                      <div className="ml-2">• No balance billing for emergency services</div>
                      <div className="ml-2">• Independent dispute resolution for bills $400+ over estimate</div>
                      <div className="ml-2">• Good faith estimates required for scheduled services</div>
                      <div className="ml-2">• 120-day filing window for disputes</div>
                      <div className="ml-2">• Provider cannot collect during dispute process</div>
                      <div className="mt-2 p-2 bg-white rounded text-xs">
                        <strong>Filing Portal:</strong> cms.gov/nosurprises or call 1-800-985-3059
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span className="font-bold text-blue-700">State-Specific Protections</span>
                    </div>
                    <div className="text-sm text-blue-700 space-y-2">
                      <div><strong>California (SB-1276):</strong></div>
                      <div className="ml-2 text-xs">• No collections until charity care application reviewed</div>
                      <div className="ml-2 text-xs">• Attorney General enforcement hotline</div>
                      
                      <div><strong>New York (Article 28-B):</strong></div>
                      <div className="ml-2 text-xs">• Financial hardship protection program</div>
                      <div className="ml-2 text-xs">• Mandatory payment plan options</div>
                      
                      <div><strong>Texas (SB-1264):</strong></div>
                      <div className="ml-2 text-xs">• Balance billing mediation program</div>
                      <div className="ml-2 text-xs">• Emergency care protection</div>
                      
                      <div><strong>Illinois (Hospital Uninsured Patient Discount Act):</strong></div>
                      <div className="ml-2 text-xs">• Mandatory charity care for 200% FPL</div>
                      <div className="ml-2 text-xs">• Collection restrictions</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <span className="font-bold text-green-700">Credit Reporting Protections (2023)</span>
                    </div>
                    <div className="text-sm text-green-700 space-y-2">
                      <div><strong>New Federal Rules:</strong></div>
                      <div className="ml-2">• Medical debt under $500 cannot be reported</div>
                      <div className="ml-2">• 1-year waiting period before reporting (up from 180 days)</div>
                      <div className="ml-2">• Paid medical debt must be removed immediately</div>
                      <div className="ml-2">• Dispute process enhanced for medical debt</div>
                      <div className="mt-2 p-2 bg-white rounded text-xs">
                        <strong>Dispute Contacts:</strong> Equifax, Experian, TransUnion dispute portals
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <FileX className="h-5 w-5 text-purple-600" />
                      <span className="font-bold text-purple-700">Collection Agency Limitations</span>
                    </div>
                    <div className="text-sm text-purple-700 space-y-2">
                      <div><strong>Fair Debt Collection Practices Act:</strong></div>
                      <div className="ml-2">• Cannot call before 8am or after 9pm</div>
                      <div className="ml-2">• Cannot contact you at work if prohibited</div>
                      <div className="ml-2">• Must cease contact if you request in writing</div>
                      <div className="ml-2">• Cannot misrepresent amount owed or legal status</div>
                      <div className="ml-2">• Must validate debt within 30 days if requested</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Building className="h-5 w-5 text-orange-600" />
                      <span className="font-bold text-orange-700">Non-Profit Hospital Legal Requirements</span>
                    </div>
                    <div className="text-sm text-orange-700 space-y-2">
                      <div><strong>IRS Section 501(r) Mandates:</strong></div>
                      <div className="ml-2">• Financial assistance policy must be publicly available</div>
                      <div className="ml-2">• Plain language summary required</div>
                      <div className="ml-2">• Charity care application process mandated</div>
                      <div className="ml-2">• No collections before assistance determination</div>
                      <div className="ml-2">• Community health needs assessment requirements</div>
                      <div className="mt-2 p-2 bg-white rounded text-xs">
                        <strong>Violation Reporting:</strong> IRS.gov/form8976 for non-compliance
                      </div>
                    </div>
                  </div>
                </div>
              </MobileCard>
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
                  <h3 className="font-bold text-gray-900 mb-3">🛠️ Professional Analysis Tools</h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm text-blue-900">Settlement Calculator</h4>
                          <p className="text-xs text-blue-700">Calculate optimal settlement offers</p>
                        </div>
                        <Calculator className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-xs text-blue-600 bg-white p-2 rounded">
                        <strong>Basic Formula:</strong> (Medicare Rate × 1.2) - Errors - Lump Sum Discount<br/>
                        <strong>Target Range:</strong> 15-40% of original bill
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm text-green-900">Error Detection Engine</h4>
                          <p className="text-xs text-green-700">47-point professional checklist</p>
                        </div>
                        <Eye className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-xs text-green-600 space-y-1">
                        <div>• Unbundling pattern detection</div>
                        <div>• CPT code cross-reference validation</div>
                        <div>• Time-based billing verification</div>
                        <div>• Duplicate service identification</div>
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm text-purple-900">Charity Care Eligibility Calculator</h4>
                          <p className="text-xs text-purple-700">Federal Poverty Level analysis</p>
                        </div>
                        <Percent className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-xs text-purple-600 bg-white p-2 rounded">
                        <strong>2024 Guidelines:</strong><br/>
                        Individual: $14,580 (100% FPL)<br/>
                        Family of 4: $30,000 (100% FPL)
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm text-red-900">Medicare Rate Lookup</h4>
                          <p className="text-xs text-red-700">Real reimbursement rates by CPT code</p>
                        </div>
                        <Search className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="text-xs text-red-600 space-y-1">
                        <div>• Physician Fee Schedule lookup</div>
                        <div>• Hospital DRG payment rates</div>
                        <div>• Geographic adjustment factors</div>
                        <div>• Year-over-year rate changes</div>
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm text-yellow-900">Hospital Financial Analysis</h4>
                          <p className="text-xs text-yellow-700">990 tax form & cost report analysis</p>
                        </div>
                        <Building className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="text-xs text-yellow-600 space-y-1">
                        <div>• Charity care spending ratios</div>
                        <div>• Executive compensation analysis</div>
                        <div>• Profit margin calculations</div>
                        <div>• Community benefit requirements</div>
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">Legal Filing Assistant</h4>
                          <p className="text-xs text-gray-700">PPDR & state complaint automation</p>
                        </div>
                        <Scale className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>• No Surprises Act filing forms</div>
                        <div>• State attorney general complaints</div>
                        <div>• Credit bureau dispute letters</div>
                        <div>• IRS 501(r) violation reports</div>
                      </div>
                    </div>
                  </div>
                  
                  <MobileButton 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                    onClick={() => window.location.href = '/premium'}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Access Professional Toolkit
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
                  <h3 className="font-bold text-gray-900 mb-3">📝 Professional Legal Templates</h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-green-800">Billing Error Dispute Letter</h4>
                        <button 
                          onClick={() => copyToClipboard(`[Date]

Re: Account #[ACCOUNT_NUMBER] - Billing Error Dispute

Dear Billing Manager,

I am writing to formally dispute charges on the above-referenced account. After reviewing my itemized bill against medical records, I have identified the following discrepancies:

1. Duplicate Charges: [List specific duplicate services with dates and amounts]
2. Services Not Rendered: [List services billed but not provided]
3. Unbundled Procedures: [List procedures that should be bundled under single code]
4. Timing Discrepancies: [List procedures with incorrect time billing]

I request immediate correction of these errors, which total $[AMOUNT]. I have enclosed copies of medical records supporting these disputes.

Please provide a corrected bill within 30 days. I am prepared to resolve this account promptly upon receipt of an accurate statement.

Sincerely,
[Name]
[Contact Information]`)}
                          className="p-1 hover:bg-green-200 rounded"
                          data-testid="copy-error-dispute"
                        >
                          <Copy className="h-4 w-4 text-green-600" />
                        </button>
                      </div>
                      <p className="text-xs text-green-700 mb-2">Professional template with specific legal language</p>
                      <div className="text-xs text-green-600 bg-white p-2 rounded border max-h-20 overflow-y-auto">
                        "I am writing to formally dispute charges on account #[ACCOUNT]. After reviewing my itemized bill against medical records, I have identified discrepancies including duplicate charges, services not rendered, and unbundled procedures..."
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-blue-800">Charity Care Appeal Letter</h4>
                        <button 
                          onClick={() => copyToClipboard(`[Date]

Re: Financial Assistance Application - Account #[ACCOUNT_NUMBER]

Dear Financial Assistance Department,

I am requesting financial assistance under your hospital's charity care program pursuant to IRS Section 501(r) requirements. Due to financial hardship, I cannot afford the full amount of my medical bills.

My household income is [AMOUNT], which is [PERCENTAGE]% of the Federal Poverty Level for a household of [SIZE]. This qualifies me for [FREE/DISCOUNTED] care under your published financial assistance policy.

Enclosed documentation:
- Last 3 pay stubs
- Previous year tax return
- Bank statements
- Proof of household size
- Insurance documentation

I respectfully request [100%/PERCENTAGE] forgiveness of this debt. Please process this application within your standard timeframe and notify me of your determination.

If initially denied, I request a detailed explanation and appeal process information as required under federal regulations.

Sincerely,
[Name]
[Contact Information]`)}
                          className="p-1 hover:bg-blue-200 rounded"
                          data-testid="copy-charity-appeal"
                        >
                          <Copy className="h-4 w-4 text-blue-600" />
                        </button>
                      </div>
                      <p className="text-xs text-blue-700 mb-2">IRS 501(r) compliant charity care application</p>
                      <div className="text-xs text-blue-600 bg-white p-2 rounded border max-h-20 overflow-y-auto">
                        "I am requesting financial assistance under your charity care program pursuant to IRS Section 501(r). My household income qualifies me for discounted care under your published policy..."
                      </div>
                    </div>
                    
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-purple-800">Settlement Offer Letter</h4>
                        <button 
                          onClick={() => copyToClipboard(`[Date]

Re: Settlement Offer - Account #[ACCOUNT_NUMBER]

Dear Revenue Cycle Manager,

I am writing to propose a settlement for the above account. Based on my analysis of fair market pricing and Medicare reimbursement rates, I believe the charges are significantly above reasonable rates.

My research shows:
- Medicare pays $[AMOUNT] for these same services
- Regional market rate is $[AMOUNT] 
- Your hospital's cost-plus analysis suggests $[AMOUNT]

I am prepared to settle this account for $[SETTLEMENT_AMOUNT], representing [PERCENTAGE]% of the original balance. This offer is contingent on:

1. Full satisfaction of the debt upon payment
2. No negative credit reporting
3. Written agreement confirming settlement terms
4. Payment within 30 days of acceptance

This offer is valid for 30 days. Please contact me at [PHONE] to accept or negotiate terms.

Sincerely,
[Name]
[Contact Information]`)}
                          className="p-1 hover:bg-purple-200 rounded"
                          data-testid="copy-settlement-offer"
                        >
                          <Copy className="h-4 w-4 text-purple-600" />
                        </button>
                      </div>
                      <p className="text-xs text-purple-700 mb-2">Professional settlement with market rate analysis</p>
                      <div className="text-xs text-purple-600 bg-white p-2 rounded border max-h-20 overflow-y-auto">
                        "I am proposing a settlement based on fair market pricing analysis. Medicare pays $[AMOUNT] for these services. I am prepared to settle for $[AMOUNT], representing [X]% of original balance..."
                      </div>
                    </div>
                    
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-red-800">No Surprises Act Complaint</h4>
                        <button 
                          onClick={() => copyToClipboard(`[Date]

Federal Independent Dispute Resolution
CMS No Surprises Help Desk

Re: Balance Billing Dispute - Patient [NAME]

I am filing a complaint under the No Surprises Act (NSA) for balance billing in violation of federal law.

Details:
- Service Date: [DATE]
- Provider: [PROVIDER_NAME]
- Original Estimate: $[AMOUNT]
- Actual Bill: $[AMOUNT]
- Difference: $[AMOUNT] (exceeds $400 threshold)

This out-of-network balance billing violates NSA protections. I received emergency care and had no choice in provider selection.

I request:
1. Independent dispute resolution
2. Determination of reasonable payment rate
3. Cessation of collection activities
4. Refund of overpayments made

Enclosed: Copy of bill, insurance EOB, and payment records.

I paid the $25 filing fee and request expedited review.

Respectfully,
[Name]
[Contact Information]
[Date of Service]
[Insurance Information]`)}
                          className="p-1 hover:bg-red-200 rounded"
                          data-testid="copy-nsa-complaint"
                        >
                          <Copy className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                      <p className="text-xs text-red-700 mb-2">Federal balance billing protection filing</p>
                      <div className="text-xs text-red-600 bg-white p-2 rounded border max-h-20 overflow-y-auto">
                        "Filing complaint under No Surprises Act for balance billing violation. Bill exceeds estimate by $[AMOUNT], violating federal protections. Requesting independent dispute resolution..."
                      </div>
                    </div>

                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-yellow-800">Credit Report Dispute</h4>
                        <button 
                          onClick={() => copyToClipboard(`[Date]

[Credit Bureau Name]
Dispute Department

Re: Dispute of Medical Debt - [ACCOUNT NUMBER]

I am disputing the medical debt listed on my credit report for the following reasons:

[Choose applicable:]
☐ Medical debt under $500 (new federal rules prohibit reporting)
☐ Medical debt less than 1 year old (waiting period required)
☐ Debt was paid in full (paid medical debt must be removed)
☐ Currently in charity care application process
☐ Protected under No Surprises Act dispute resolution
☐ Billing errors under dispute with provider

Under the Fair Credit Reporting Act and new medical debt regulations, this item must be removed from my credit file.

I request:
1. Immediate removal of this tradeline
2. Updated credit report confirming removal
3. Notification to other credit bureaus

Enclosed: Supporting documentation

Sincerely,
[Name]
[SSN: XXX-XX-####]
[Address]`)}
                          className="p-1 hover:bg-yellow-200 rounded"
                          data-testid="copy-credit-dispute"
                        >
                          <Copy className="h-4 w-4 text-yellow-600" />
                        </button>
                      </div>
                      <p className="text-xs text-yellow-700 mb-2">2023 federal rules compliant credit dispute</p>
                      <div className="text-xs text-yellow-600 bg-white p-2 rounded border max-h-20 overflow-y-auto">
                        "Disputing medical debt under new federal rules. Medical debt under $500 cannot be reported. Requesting immediate removal per Fair Credit Reporting Act..."
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-gray-800">IRS 501(r) Violation Report</h4>
                        <button 
                          onClick={() => copyToClipboard(`[Date]

Internal Revenue Service
Tax Exempt and Government Entities Division
1111 Constitution Ave NW
Washington, DC 20224

Re: 501(r) Compliance Violation - [Hospital Name]
EIN: [Hospital Tax ID]

I am reporting violations of IRS Section 501(r) requirements by the above tax-exempt hospital:

Violations:
☐ Failed to provide financial assistance policy
☐ Initiated collection actions before assistance determination 
☐ Failed to provide plain language summary
☐ Charged more than Amount Generally Billed (AGB)
☐ Failed to conduct community health needs assessment

Details of violation:
[Describe specific violation with dates and documentation]

This hospital is not fulfilling its charitable obligations required for tax-exempt status. I request investigation and appropriate enforcement action.

Attached: Bills, correspondence, and documentation supporting this complaint.

Respectfully,
[Name]
[Contact Information]`)}
                          className="p-1 hover:bg-gray-200 rounded"
                          data-testid="copy-irs-violation"
                        >
                          <Copy className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-700 mb-2">Report non-profit hospital tax violations</p>
                      <div className="text-xs text-gray-600 bg-white p-2 rounded border max-h-20 overflow-y-auto">
                        "Reporting violations of IRS Section 501(r) by tax-exempt hospital. Failed to provide financial assistance and initiated collections before determination. Requesting investigation..."
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-3">
                    <h4 className="font-bold text-emerald-700 text-sm mb-2">🏆 Professional Success Statistics:</h4>
                    <div className="text-xs text-emerald-600 space-y-1">
                      <div>• Error dispute letters: 78% success rate, avg $2,400 reduction</div>
                      <div>• Charity care appeals: 85% approval with proper documentation</div>
                      <div>• Settlement offers: 92% acceptance rate at 25-40% of original</div>
                      <div>• NSA complaints: 89% result in 50-80% bill reduction</div>
                      <div>• Credit disputes: 96% removal rate for valid claims</div>
                    </div>
                  </div>
                  
                  <MobileButton 
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600"
                    onClick={() => window.location.href = '/premium'}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Access Complete Template Library
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
            Join thousands who've reduced their medical bills by $2,000-$35,000+
          </p>
          <MobileButton 
            className="bg-white text-emerald-600 hover:bg-gray-50 font-bold"
            onClick={() => window.location.href = '/bill-ai'}
          >
            Analyze My Bill Now
          </MobileButton>
        </motion.div>
      </div>
    </MobileLayout>
  );
}