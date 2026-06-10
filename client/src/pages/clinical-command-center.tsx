import { motion } from "framer-motion";
import { Link } from "wouter";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead, SEOContent, SEO_KEYWORDS } from "@/components/seo-head";
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
  badge?: string;
}

const ToolCard = ({ icon: Icon, title, description, href, badge }: ToolCardProps) => (
  <Link href={href}>
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="luxury-card relative overflow-hidden rounded-2xl cursor-pointer h-full"
      data-testid={`card-tool-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="p-5 min-h-[140px] flex flex-col h-full">
        <div className="w-11 h-11 bg-secondary rounded-xl flex items-center justify-center mb-3">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="font-bold text-lg mb-1 text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm flex-1 leading-snug">{description}</p>
        {badge && (
          <Badge className="bg-secondary text-muted-foreground text-xs mt-2 w-fit">{badge}</Badge>
        )}
        <ChevronRight className="absolute bottom-4 right-4 h-5 w-5 text-muted-foreground" />
      </div>
    </motion.div>
  </Link>
);

export default function ClinicalCommandCenter() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <SEOHead 
        title="Health Information Center - Wellness Tools"
        description="Free health information tools: Lab results interpreter, drug interaction checker, symptom checker, and health metrics tracker. AI-powered reference tools."
        keywords={[...SEO_KEYWORDS.drugInteractions.slice(0, 5), ...SEO_KEYWORDS.labResults.slice(0, 5), ...SEO_KEYWORDS.symptoms.slice(0, 5)]}
        canonicalPath="/clinical-command-center"
      />
      <SEOContent content={[
        "Health information center with wellness reference tools",
        "Free drug interaction checker, lab results interpreter, symptom analyzer",
        "Health information tools for patients and wellness education",
        "Blood test results explained, medication safety checker, health metrics",
        "Wellness reference tools, patient education resources",
        "AI-powered health tools for understanding your health information"
      ]} />
      {/* Simple Header */}
      <div className="px-4 pt-12 pb-6 border-b border-border" style={{ background: 'linear-gradient(180deg, var(--background), var(--card))' }}>
        <div className="max-w-lg mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
            <Stethoscope className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-black mb-2 font-serif text-foreground" data-testid="heading-clinical-command">
            Health Information Center
          </h1>
          <p className="text-muted-foreground text-sm">
            Educational reference tools for health topics
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
            title="Lab Reference"
            description="Look up lab values and terminology"
            href="/lab-analyzer"
            badge="Reference Guide"
          />
          <ToolCard
            icon={Pill}
            title="Medication Info"
            description="Look up medication information"
            href="/drug-interactions"
            badge="Drug Database"
          />
          <ToolCard
            icon={Brain}
            title="Symptom Library"
            description="Browse symptom information"
            href="/symptom-checker"
            badge="Educational"
          />
          <ToolCard
            icon={Activity}
            title="Health Journal"
            description="Log blood pressure, weight, and more"
            href="/health-metrics"
          />
        </div>

        {/* Quick Links Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground px-1">More Tools</h2>
          
          <Link href="/patient-diagnostics">
            <Card className="luxury-card hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                    <Heart className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Learning Cases</h3>
                    <p className="text-xs text-muted-foreground">Practice with AI health scenarios</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/health-insights">
            <Card className="luxury-card hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Health Insights AI</h3>
                    <p className="text-xs text-muted-foreground">Chat about health questions</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Financial Tools Quick Access */}
        <Card className="luxury-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
                <Scale className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Medical Bill Help</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Save money on medical bills with AI analysis and negotiation coaching
            </p>
            <div className="flex gap-2">
              <Link href="/bill-ai">
                <Button className="bg-primary text-primary-foreground hover:opacity-90" data-testid="button-bill-ai">
                  Bill AI
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/dispute-arsenal">
                <Button variant="outline" data-testid="button-dispute">
                  Disputes
                  <ArrowRight className="h-4 w-4 ml-1" />
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
