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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div>
      </div>
    );
  }

  if (error || !condition) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl text-foreground mb-2">Procedure Not Found</h1>
          <p className="text-muted-foreground mb-6">The procedure you're looking for doesn't exist.</p>
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

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href="/conditions">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground mb-6">
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
                  <Badge className="bg-secondary text-muted-foreground border border-border">
                    {condition.category}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={handleShare} data-testid="button-share">
                    <Share2 className="h-4 w-4 mr-1" /> Share
                  </Button>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4">
                  {condition.name}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {condition.description}
                </p>
              </div>

              <Tabs defaultValue="errors" className="w-full">
                <TabsList className="bg-card border border-border">
                  <TabsTrigger value="errors" data-testid="tab-billing-errors">Billing Errors</TabsTrigger>
                  <TabsTrigger value="tips" data-testid="tab-negotiation-tips">Negotiation Tips</TabsTrigger>
                  <TabsTrigger value="codes" data-testid="tab-codes">Billing Codes</TabsTrigger>
                </TabsList>

                <TabsContent value="errors" className="mt-4">
                  <Card className="bg-card border border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                        Common Billing Errors to Watch For
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {condition.commonBillingErrors?.map((error, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{error}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tips" className="mt-4">
                  <Card className="bg-card border border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-400" />
                        Proven Negotiation Strategies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {condition.negotiationTips?.map((tip, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="codes" className="mt-4">
                  <Card className="bg-card border border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Common Billing Codes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">ICD-10 Diagnosis Codes</h4>
                        <div className="flex flex-wrap gap-2">
                          {condition.icdCodes?.map((code) => (
                            <Badge key={code} variant="outline" className="text-muted-foreground border-border">
                              {code}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">CPT Procedure Codes</h4>
                        <div className="flex flex-wrap gap-2">
                          {condition.cptCodes?.map((code) => (
                            <Badge key={code} variant="outline" className="text-muted-foreground border-border">
                              {code}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        Verify these codes match your itemized bill. Incorrect codes can result in overcharges.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {condition.symptoms && condition.symptoms.length > 0 && (
                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Common Symptoms & Indications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {condition.symptoms.map((symptom, index) => (
                        <Badge key={index} variant="secondary" className="bg-secondary text-muted-foreground">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    Cost Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">Low</div>
                      <div className="text-xl font-bold text-foreground">
                        {formatCurrency(condition.averageCost?.low || 0)}
                      </div>
                    </div>
                    <div className="bg-secondary rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">Median</div>
                      <div className="text-xl font-bold text-gold">
                        {formatCurrency(condition.averageCost?.median || 0)}
                      </div>
                    </div>
                    <div className="bg-secondary rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">High</div>
                      <div className="text-xl font-bold text-foreground">
                        {formatCurrency(condition.averageCost?.high || 0)}
                      </div>
                    </div>
                    <div className="bg-secondary rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">Uninsured</div>
                      <div className="text-xl font-bold text-destructive">
                        {formatCurrency(condition.averageCost?.uninsured || 0)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-5 w-5 text-emerald-600" />
                      <span className="font-semibold text-foreground">Savings Potential</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">
                      {condition.savingsPotential}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Using our negotiation strategies
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardContent className="p-6">
                  <h3 className="text-foreground font-semibold mb-4">Get Your Bill Analyzed</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Upload your {condition.name} bill and get personalized savings recommendations.
                  </p>
                  <Link href="/bill-ai">
                    <Button data-testid="button-analyze-my-bill" className="w-full bg-primary text-primary-foreground">
                      Analyze My Bill <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {condition.relatedConditions && condition.relatedConditions.length > 0 && (
                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg">Related Procedures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {condition.relatedConditions.map((related) => (
                        <Link key={related} href={`/conditions/${related}`}>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary"
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
