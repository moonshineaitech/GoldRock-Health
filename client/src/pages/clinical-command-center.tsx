import { motion } from "framer-motion";
import { Link } from "wouter";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Beaker, Pill, Activity, Brain, Stethoscope, 
  AlertTriangle, ArrowRight, Heart, ChevronRight, Shield,
  FileText, Scale
} from "lucide-react";

interface ToolCardProps {
  icon: any;
  title: string;
  description: string;
  href: string;
  gradient: string;
  badge?: string;
}

const ToolCard = ({ icon: Icon, title, description, href, gradient, badge }: ToolCardProps) => (
  <Link href={href}>
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden rounded-2xl cursor-pointer h-full"
      data-testid={`card-tool-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={`bg-gradient-to-br ${gradient} p-5 text-white min-h-[140px] flex flex-col h-full`}>
        <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center mb-3">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-white/85 text-sm flex-1 leading-snug">{description}</p>
        {badge && (
          <Badge className="bg-white/25 text-white text-xs mt-2 w-fit">{badge}</Badge>
        )}
        <ChevronRight className="absolute bottom-4 right-4 h-5 w-5 text-white/60" />
      </div>
    </motion.div>
  </Link>
);

export default function ClinicalCommandCenter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-24">
      {/* Simple Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white px-4 pt-12 pb-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Stethoscope className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-black mb-2" data-testid="heading-clinical-command">
            Clinical Command Center
          </h1>
          <p className="text-white/90 text-sm">
            AI-powered tools to understand your health
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Medical Disclaimer */}
        <Card className="border-amber-200 bg-amber-50/80">
          <CardContent className="p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              <strong>For learning only.</strong> These tools help you understand health information. Always talk to your doctor for medical advice.
            </p>
          </CardContent>
        </Card>

        {/* Main 4 Tools - Simple Grid */}
        <div className="grid grid-cols-2 gap-3">
          <ToolCard
            icon={Beaker}
            title="Lab Results"
            description="Understand your bloodwork and test results"
            href="/lab-analyzer"
            gradient="from-blue-500 to-indigo-600"
            badge="AI Powered"
          />
          <ToolCard
            icon={Pill}
            title="Drug Check"
            description="Check if your medications interact"
            href="/drug-interactions"
            gradient="from-purple-500 to-violet-600"
            badge="Safety Database"
          />
          <ToolCard
            icon={Brain}
            title="Symptoms"
            description="Describe symptoms and get guidance"
            href="/symptom-checker"
            gradient="from-emerald-500 to-teal-600"
            badge="AI Triage"
          />
          <ToolCard
            icon={Activity}
            title="Health Tracking"
            description="Track blood pressure, weight, and more"
            href="/health-metrics"
            gradient="from-rose-500 to-pink-600"
          />
        </div>

        {/* Quick Links Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-600 px-1">More Tools</h2>
          
          <Link href="/patient-diagnostics">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                    <Heart className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Patient Diagnostics</h3>
                    <p className="text-xs text-gray-500">Practice with AI patient cases</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/health-insights">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                    <Shield className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Health Insights AI</h3>
                    <p className="text-xs text-gray-500">Chat about health questions</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Financial Tools Quick Access */}
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Scale className="h-6 w-6" />
              <h3 className="font-bold text-lg">Medical Bill Help</h3>
            </div>
            <p className="text-white/90 text-sm mb-4">
              Save money on medical bills with AI analysis and negotiation coaching
            </p>
            <div className="flex gap-2">
              <Link href="/bill-ai">
                <Button className="bg-white text-emerald-700 hover:bg-white/90" data-testid="button-bill-ai">
                  Bill AI
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/dispute-arsenal">
                <Button variant="outline" className="border-white/50 text-white hover:bg-white/20" data-testid="button-dispute">
                  Dispute Letters
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <MobileBottomNav />
    </div>
  );
}
