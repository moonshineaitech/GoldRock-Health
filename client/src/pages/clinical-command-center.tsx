import { motion } from "framer-motion";
import { Link } from "wouter";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Beaker, Pill, Activity, Heart, Brain, FileText, Stethoscope, 
  AlertTriangle, TrendingUp, Shield, Sparkles, ArrowRight, 
  FlaskConical, Dna, Scale, Apple, Calendar, Users, Clock,
  Thermometer, Droplet, Zap, Target, Search, ChevronRight
} from "lucide-react";

interface ToolCardProps {
  icon: any;
  title: string;
  description: string;
  href: string;
  gradient: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  isNew?: boolean;
  comingSoon?: boolean;
}

const ToolCard = ({ icon: Icon, title, description, href, gradient, badge, badgeVariant = "secondary", isNew, comingSoon }: ToolCardProps) => (
  <Link href={comingSoon ? "#" : href}>
    <motion.div
      whileHover={comingSoon ? {} : { scale: 1.02, y: -4 }}
      whileTap={comingSoon ? {} : { scale: 0.98 }}
      className={`relative overflow-hidden rounded-2xl ${comingSoon ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      data-testid={`card-tool-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={`bg-gradient-to-br ${gradient} p-5 text-white min-h-[160px] flex flex-col`}>
        {isNew && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-yellow-400 text-yellow-900 font-bold text-xs">NEW</Badge>
          </div>
        )}
        {comingSoon && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="border-white/50 text-white/80 text-xs">Coming Soon</Badge>
          </div>
        )}
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-white/85 text-sm flex-1">{description}</p>
        {badge && (
          <div className="mt-3">
            <Badge variant={badgeVariant} className="text-xs">{badge}</Badge>
          </div>
        )}
        {!comingSoon && (
          <div className="absolute bottom-4 right-4">
            <ChevronRight className="h-5 w-5 text-white/60" />
          </div>
        )}
      </div>
    </motion.div>
  </Link>
);

export default function ClinicalCommandCenter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white px-4 pt-12 pb-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">AI-Powered Medical Tools</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3" data-testid="heading-clinical-command">
              Clinical Command Center
            </h1>
            <p className="text-white/90 text-lg max-w-xl mx-auto">
              Your comprehensive suite of AI medical analysis tools for understanding your health
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Medical Disclaimer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Educational Tool Only:</strong> These AI tools provide general health information and are not a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical decisions.
          </div>
        </motion.div>

        {/* Lab & Test Analysis Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Beaker className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Lab & Test Analysis</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ToolCard
              icon={FlaskConical}
              title="Lab Results Analyzer"
              description="Upload bloodwork and get AI interpretation of your values with clear explanations"
              href="/lab-analyzer"
              gradient="from-blue-500 to-indigo-600"
              badge="AI Powered"
              isNew
            />
            <ToolCard
              icon={Droplet}
              title="Complete Blood Count"
              description="Understand your CBC panel including WBC, RBC, platelets, and hemoglobin levels"
              href="/lab-analyzer?panel=cbc"
              gradient="from-red-500 to-pink-600"
            />
            <ToolCard
              icon={Activity}
              title="Metabolic Panel"
              description="CMP and BMP analysis for kidney function, electrolytes, and blood glucose"
              href="/lab-analyzer?panel=metabolic"
              gradient="from-emerald-500 to-teal-600"
            />
            <ToolCard
              icon={Heart}
              title="Lipid Panel"
              description="Cholesterol, HDL, LDL, and triglycerides with cardiovascular risk assessment"
              href="/lab-analyzer?panel=lipid"
              gradient="from-orange-500 to-red-600"
            />
          </div>
        </section>

        {/* Medication Safety Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Pill className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Medication Safety</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ToolCard
              icon={Pill}
              title="Drug Interaction Checker"
              description="Check your medications for dangerous interactions using the FDA drug database"
              href="/drug-interactions"
              gradient="from-purple-500 to-violet-600"
              badge="FDA Database"
              isNew
            />
            <ToolCard
              icon={Search}
              title="Medication Lookup"
              description="Search drug information including uses, dosages, side effects, and warnings"
              href="/medication-lookup"
              gradient="from-cyan-500 to-blue-600"
              comingSoon
            />
          </div>
        </section>

        {/* Symptom & Diagnosis Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Symptom Analysis</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ToolCard
              icon={Brain}
              title="Symptom Checker"
              description="Describe your symptoms and get AI analysis with possible conditions and next steps"
              href="/symptom-checker"
              gradient="from-emerald-500 to-green-600"
              badge="AI Triage"
              isNew
            />
            <ToolCard
              icon={Target}
              title="Patient Diagnostics"
              description="Interactive diagnostic training with AI-generated patient cases"
              href="/patient-diagnostics"
              gradient="from-violet-500 to-purple-600"
            />
          </div>
        </section>

        {/* Health Tracking Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Health Tracking</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ToolCard
              icon={Activity}
              title="Health Metrics Dashboard"
              description="Track vitals, weight, blood pressure, and visualize your health trends over time"
              href="/health-metrics"
              gradient="from-blue-500 to-cyan-600"
              isNew
            />
            <ToolCard
              icon={Thermometer}
              title="Vital Signs Logger"
              description="Log and monitor your blood pressure, heart rate, temperature, and more"
              href="/health-metrics?tab=vitals"
              gradient="from-teal-500 to-emerald-600"
            />
          </div>
        </section>

        {/* Preventive Care Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-teal-600" />
            <h2 className="text-xl font-bold text-gray-900">Preventive Care</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ToolCard
              icon={Calendar}
              title="Preventive Care Planner"
              description="Age and gender-appropriate screening recommendations based on guidelines"
              href="/preventive-care"
              gradient="from-teal-500 to-cyan-600"
              comingSoon
            />
            <ToolCard
              icon={Apple}
              title="Nutrition Analyzer"
              description="AI analysis of your diet with personalized recommendations for your health goals"
              href="/nutrition-analyzer"
              gradient="from-green-500 to-lime-600"
              comingSoon
            />
          </div>
        </section>

        {/* Medical Documents Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Medical Documents</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ToolCard
              icon={FileText}
              title="Medical Record Parser"
              description="Upload discharge summaries and medical records to get plain-language explanations"
              href="/document-parser"
              gradient="from-gray-600 to-slate-700"
              comingSoon
            />
            <ToolCard
              icon={Dna}
              title="Second Opinion AI"
              description="Get an AI-powered analysis of your diagnosis and treatment plan"
              href="/second-opinion"
              gradient="from-indigo-500 to-blue-600"
              comingSoon
            />
          </div>
        </section>

        {/* Quick Access - Financial Tools */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Financial Defense Suite</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Save money on your medical bills with AI-powered analysis and negotiation tools
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/bill-ai">
              <Button className="bg-emerald-600 hover:bg-emerald-700" data-testid="button-bill-ai">
                Bill AI Analyzer
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/dispute-arsenal">
              <Button variant="outline" data-testid="button-dispute-arsenal">
                Dispute Templates
              </Button>
            </Link>
            <Link href="/reduction-coach">
              <Button variant="outline" data-testid="button-reduction-coach">
                Reduction Coach
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <MobileBottomNav />
    </div>
  );
}
