import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  DollarSign, 
  AlertTriangle, 
  Lightbulb, 
  TrendingDown,
  Share2,
  Bookmark,
  CheckCircle2,
  XCircle,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEOHead } from "@/components/seo-head";
import { useToast } from "@/hooks/use-toast";

interface MedicalCondition {
  slug: string;
  name: string;
  category: string;
  icdCodes: string[];
  cptCodes: string[];
  description: string;
  symptoms: string[];
  averageCost: {
    low: number;
    median: number;
    high: number;
    uninsured: number;
  };
  commonBillingErrors: string[];
  negotiationTips: string[];
  savingsPotential: string;
  relatedConditions: string[];
  seoKeywords: string[];
  seoDescription: string;
}

export default function ConditionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const { data: condition, isLoading, error } = useQuery<MedicalCondition>({
    queryKey: ['/api/medical-conditions', slug],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${condition?.name} Cost Guide - GoldRock Health`,
          text: condition?.seoDescription,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Share this guide with others",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#0a1628] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400"></div>
      </div>
    );
  }

  if (error || !condition) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl text-white mb-2">Procedure Not Found</h1>
          <p className="text-gray-400 mb-6">The procedure you're looking for doesn't exist.</p>
          <Link href="/conditions">
            <Button>Back to Procedures</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${condition.name} Cost Guide - How to Save | GoldRock Health`}
        description={condition.seoDescription}
        keywords={condition.seoKeywords?.join(', ')}
        canonicalUrl={`https://goldrockhealth.com/conditions/${slug}`}
      />

      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#0a1628]">
        <div className="container mx-auto px-4 py-8">
          <Link href="/conditions">
            <Button variant="ghost" className="text-gray-400 hover:text-white mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Procedures
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    {condition.category}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={handleShare} data-testid="button-share">
                    <Share2 className="h-4 w-4 mr-1" /> Share
                  </Button>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {condition.name}
                </h1>
                <p className="text-lg text-gray-300 leading-relaxed">
                  {condition.description}
                </p>
              </div>

              <Tabs defaultValue="errors" className="w-full">
                <TabsList className="bg-white/5 border-white/10">
                  <TabsTrigger value="errors" data-testid="tab-billing-errors">Billing Errors</TabsTrigger>
                  <TabsTrigger value="tips" data-testid="tab-negotiation-tips">Negotiation Tips</TabsTrigger>
                  <TabsTrigger value="codes" data-testid="tab-codes">Billing Codes</TabsTrigger>
                </TabsList>

                <TabsContent value="errors" className="mt-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                        Common Billing Errors to Watch For
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {condition.commonBillingErrors?.map((error, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{error}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tips" className="mt-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-400" />
                        Proven Negotiation Strategies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {condition.negotiationTips?.map((tip, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="codes" className="mt-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Common Billing Codes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">ICD-10 Diagnosis Codes</h4>
                        <div className="flex flex-wrap gap-2">
                          {condition.icdCodes?.map((code) => (
                            <Badge key={code} variant="outline" className="text-cyan-400 border-cyan-400/50">
                              {code}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">CPT Procedure Codes</h4>
                        <div className="flex flex-wrap gap-2">
                          {condition.cptCodes?.map((code) => (
                            <Badge key={code} variant="outline" className="text-purple-400 border-purple-400/50">
                              {code}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-4">
                        Verify these codes match your itemized bill. Incorrect codes can result in overcharges.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {condition.symptoms && condition.symptoms.length > 0 && (
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Common Symptoms & Indications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {condition.symptoms.map((symptom, index) => (
                        <Badge key={index} variant="secondary" className="bg-white/10 text-gray-300">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    Cost Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-xs text-gray-400">Low</div>
                      <div className="text-xl font-bold text-white">
                        {formatCurrency(condition.averageCost?.low || 0)}
                      </div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-xs text-gray-400">Median</div>
                      <div className="text-xl font-bold text-cyan-400">
                        {formatCurrency(condition.averageCost?.median || 0)}
                      </div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-xs text-gray-400">High</div>
                      <div className="text-xl font-bold text-white">
                        {formatCurrency(condition.averageCost?.high || 0)}
                      </div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-xs text-gray-400">Uninsured</div>
                      <div className="text-xl font-bold text-red-400">
                        {formatCurrency(condition.averageCost?.uninsured || 0)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-5 w-5 text-green-400" />
                      <span className="font-semibold text-white">Savings Potential</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      {condition.savingsPotential}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Using our negotiation strategies
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-4">Get Your Bill Analyzed</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Upload your {condition.name} bill and get personalized savings recommendations.
                  </p>
                  <Link href="/bill-ai">
                    <Button data-testid="button-analyze-my-bill" className="w-full bg-cyan-500 hover:bg-cyan-600 text-black">
                      Analyze My Bill <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {condition.relatedConditions && condition.relatedConditions.length > 0 && (
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Related Procedures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {condition.relatedConditions.map((related) => (
                        <Link key={related} href={`/conditions/${related}`}>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
                          >
                            <ChevronRight className="h-4 w-4 mr-2" />
                            {related.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
