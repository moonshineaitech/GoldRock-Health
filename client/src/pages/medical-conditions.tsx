import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Search, 
  Heart, 
  Stethoscope, 
  Brain, 
  Eye, 
  Activity, 
  Bone,
  Baby,
  AlertCircle,
  DollarSign,
  TrendingDown,
  ArrowRight,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo-head";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MedicalCondition {
  slug: string;
  name: string;
  category: string;
  description: string;
  averageCost: {
    low: number;
    median: number;
    high: number;
    uninsured: number;
  };
  savingsPotential: string;
  seoDescription: string;
}

const categoryIcons: Record<string, any> = {
  'Surgical': Stethoscope,
  'Diagnostic': Search,
  'Imaging': Eye,
  'Orthopedic': Bone,
  'Cardiac': Heart,
  'Emergency': AlertCircle,
  'Obstetric': Baby,
  'Ophthalmology': Eye,
  'Pain Management': Activity,
  'Mental Health': Brain,
  'Dental': Stethoscope,
  'default': Activity
};

const categoryColors: Record<string, string> = {
  'Surgical': 'bg-secondary text-muted-foreground border-border',
  'Diagnostic': 'bg-secondary text-muted-foreground border-border',
  'Imaging': 'bg-secondary text-muted-foreground border-border',
  'Orthopedic': 'bg-secondary text-muted-foreground border-border',
  'Cardiac': 'bg-secondary text-muted-foreground border-border',
  'Emergency': 'bg-secondary text-muted-foreground border-border',
  'Obstetric': 'bg-secondary text-muted-foreground border-border',
  'default': 'bg-secondary text-muted-foreground border-border'
};

export default function MedicalConditions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: conditions, isLoading } = useQuery<MedicalCondition[]>({
    queryKey: ['/api/medical-conditions'],
  });

  const { data: categories } = useQuery<string[]>({
    queryKey: ['/api/medical-conditions-categories'],
  });

  const filteredConditions = conditions?.filter(condition => {
    const matchesSearch = condition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      condition.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || condition.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      <SEOHead
        title="Medical Procedure Cost Guide | GoldRock Health"
        description="Compare medical procedure costs and learn how to reduce your medical bills. Find average prices, billing errors, and negotiation tips for 50+ procedures."
        keywords="medical procedure costs, hospital bill prices, surgery costs, how to reduce medical bills, medical billing errors"
        canonicalUrl="https://goldrockhealth.com/conditions"
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-foreground mb-4">
              Medical Procedure <span className="text-gold">Cost Guide</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Understand what medical procedures cost, common billing errors to watch for, 
              and proven strategies to reduce your medical bills.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                data-testid="input-search-conditions"
                placeholder="Search procedures (e.g., knee replacement, MRI, colonoscopy)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger data-testid="select-category" className="w-full md:w-[200px] bg-card border-border text-foreground">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-gold">{conditions?.length || 0}+</div>
                <div className="text-sm text-muted-foreground">Procedures Covered</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-foreground">15-45%</div>
                <div className="text-sm text-muted-foreground">Avg. Savings Potential</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-foreground">100+</div>
                <div className="text-sm text-muted-foreground">Billing Errors Listed</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-foreground">200+</div>
                <div className="text-sm text-muted-foreground">Negotiation Tips</div>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <Card key={i} className="bg-card border-border animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-secondary rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-secondary rounded mb-2 w-1/2"></div>
                    <div className="h-20 bg-secondary rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {filteredConditions.map((condition) => {
                const CategoryIcon = categoryIcons[condition.category] || categoryIcons['default'];
                const colorClass = categoryColors[condition.category] || categoryColors['default'];
                
                return (
                  <motion.div
                    key={condition.slug}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <Link href={`/conditions/${condition.slug}`}>
                      <Card 
                        data-testid={`card-condition-${condition.slug}`}
                        className="bg-card border-border hover:border-gold transition-all cursor-pointer group h-full"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <Badge className={`${colorClass} border`}>
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {condition.category}
                            </Badge>
                            <TrendingDown className="h-4 w-4 text-emerald-600" />
                          </div>
                          <CardTitle className="text-foreground group-hover:text-gold transition-colors text-lg">
                            {condition.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {condition.seoDescription || condition.description.substring(0, 120) + '...'}
                          </p>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <div>
                              <div className="text-xs text-muted-foreground">Average Cost</div>
                              <div className="text-foreground font-semibold">
                                {formatCurrency(condition.averageCost?.low || 0)} - {formatCurrency(condition.averageCost?.high || 0)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground">Savings Potential</div>
                              <div className="text-emerald-600 font-semibold">
                                {condition.savingsPotential}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-gold text-sm group-hover:translate-x-1 transition-transform">
                            View Guide <ArrowRight className="h-4 w-4 ml-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {filteredConditions.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl text-foreground mb-2">No procedures found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 luxury-card rounded-xl p-8"
          >
            <div className="text-center">
              <DollarSign className="h-12 w-12 text-gold mx-auto mb-4" />
              <h2 className="text-2xl font-bold font-serif text-foreground mb-4">
                Get Your Bill Analyzed by AI
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Upload your medical bill and let our AI identify billing errors, 
                calculate potential savings, and provide personalized negotiation strategies.
              </p>
              <Link href="/bill-ai">
                <Button data-testid="button-analyze-bill" size="lg" className="bg-primary text-primary-foreground hover:opacity-90 font-semibold">
                  Analyze My Bill <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
