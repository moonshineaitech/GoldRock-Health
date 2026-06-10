import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Search, 
  Pill, 
  MapPin, 
  DollarSign, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Store,
  Truck,
  Star,
  Info,
  ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { SEOHead } from "@/components/seo-head";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PharmacyPrice {
  pharmacyName: string;
  pharmacyType: string;
  retailPrice: number;
  discountPrice: number;
  savings: number;
  savingsPercent: number;
}

interface DrugPriceData {
  drugName: string;
  genericName: string;
  dosage: string;
  form: string;
  quantity: number;
  prices: PharmacyPrice[];
  genericAvailable: boolean;
  genericSavings: number;
  manufacturerCoupon: boolean;
  patientAssistanceProgram: boolean;
  tips: string[];
}

export default function DrugPrices() {
  const [drugName, setDrugName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [quantity, setQuantity] = useState("30");
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  const { data: drugData, isLoading, error } = useQuery<DrugPriceData>({
    queryKey: ['/api/drug-prices', drugName, zipCode, quantity],
    enabled: searchSubmitted && drugName.length > 2,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (drugName.length > 2) {
      setSearchSubmitted(true);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const popularDrugs = [
    "Lipitor", "Metformin", "Lisinopril", "Omeprazole", 
    "Amlodipine", "Gabapentin", "Atorvastatin", "Levothyroxine"
  ];

  return (
    <>
      <SEOHead
        title="Drug Price Comparison Tool | Compare Pharmacy Prices | GoldRock Health"
        description="Compare prescription drug prices across pharmacies. Find the lowest prices on medications, discover generic alternatives, and save up to 80% on prescriptions."
        keywords="drug price comparison, prescription prices, pharmacy prices, medication costs, generic drugs, GoodRx alternative"
        canonicalUrl="https://goldrockhealth.com/drug-prices"
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-white"
                style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
              >
                <Pill className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Drug Price <span className="text-gold">Comparison</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Compare prescription prices across pharmacies and save up to 80% on your medications.
            </p>
          </motion.div>

          <Card className="luxury-card max-w-4xl mx-auto mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="drugName" className="text-muted-foreground mb-2 block">Drug Name</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="drugName"
                        data-testid="input-drug-name"
                        placeholder="Enter drug name (e.g., Lipitor, Metformin)"
                        value={drugName}
                        onChange={(e) => {
                          setDrugName(e.target.value);
                          setSearchSubmitted(false);
                        }}
                        className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-muted-foreground mb-2 block">ZIP Code (Optional)</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="zipCode"
                        data-testid="input-zip-code"
                        placeholder="Enter ZIP"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
                        maxLength={5}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label className="text-muted-foreground mb-2 block">Quantity</Label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-card border border-border rounded-md px-3 py-2 text-foreground"
                      data-testid="select-quantity"
                    >
                      <option value="30">30 pills</option>
                      <option value="60">60 pills</option>
                      <option value="90">90 pills</option>
                    </select>
                  </div>
                  <div className="flex-1 flex items-end">
                    <Button 
                      type="submit" 
                      data-testid="button-search-prices"
                      className="w-full bg-primary text-primary-foreground hover:opacity-90 font-semibold"
                      disabled={drugName.length < 3}
                    >
                      <Search className="mr-2 h-4 w-4" /> Compare Prices
                    </Button>
                  </div>
                </div>
              </form>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {popularDrugs.map((drug) => (
                    <Badge 
                      key={drug}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary text-muted-foreground border-border"
                      onClick={() => {
                        setDrugName(drug);
                        setSearchSubmitted(true);
                      }}
                    >
                      {drug}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div>
            </div>
          )}

          {drugData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto space-y-6"
            >
              <Card className="luxury-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl text-foreground">{drugData.drugName}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {drugData.genericName} • {drugData.dosage} {drugData.form} • Qty: {drugData.quantity}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {drugData.genericAvailable && (
                        <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30">
                          Generic Available
                        </Badge>
                      )}
                      {drugData.manufacturerCoupon && (
                        <Badge className="bg-secondary text-muted-foreground border-border">
                          Coupon Available
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="text-muted-foreground">Pharmacy</TableHead>
                          <TableHead className="text-muted-foreground">Type</TableHead>
                          <TableHead className="text-muted-foreground text-right">Retail Price</TableHead>
                          <TableHead className="text-muted-foreground text-right">Discount Price</TableHead>
                          <TableHead className="text-muted-foreground text-right">You Save</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {drugData.prices.sort((a, b) => a.discountPrice - b.discountPrice).map((price, index) => (
                          <TableRow key={price.pharmacyName} className="border-border">
                            <TableCell className="font-medium text-foreground">
                              <div className="flex items-center gap-2">
                                {price.pharmacyType === 'Mail-Order' ? (
                                  <Truck className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Store className="h-4 w-4 text-muted-foreground" />
                                )}
                                {price.pharmacyName}
                                {index === 0 && (
                                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs">Lowest</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{price.pharmacyType}</TableCell>
                            <TableCell className="text-right text-muted-foreground line-through">
                              {formatCurrency(price.retailPrice)}
                            </TableCell>
                            <TableCell className="text-right text-foreground font-bold">
                              {formatCurrency(price.discountPrice)}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="text-green-700 dark:text-green-400 font-semibold">
                                {formatCurrency(price.savings)} ({price.savingsPercent}%)
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {drugData.genericAvailable && (
                  <Card className="bg-green-500/10 border-green-500/30">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-green-700 dark:text-green-400" />
                        Generic Alternative Available
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3">
                        A generic version of this medication is available and can save you up to{' '}
                        <span className="text-green-700 dark:text-green-400 font-bold">{drugData.genericSavings}%</span> compared to the brand name.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Ask your doctor or pharmacist if the generic is right for you.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {drugData.patientAssistanceProgram && (
                  <Card className="luxury-card">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Info className="h-5 w-5 text-muted-foreground" />
                        Patient Assistance Program
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3">
                        The manufacturer offers a patient assistance program that may provide 
                        this medication at reduced cost or free for qualifying patients.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Contact the manufacturer or ask your pharmacist for details.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Star className="h-5 w-5 text-gold" />
                    Money-Saving Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {drugData.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-700 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!drugData && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              <Card className="luxury-card">
                <CardContent className="p-6 text-center">
                  <TrendingDown className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-foreground font-semibold mb-2">Save Up to 80%</h3>
                  <p className="text-muted-foreground text-sm">
                    Find the lowest prices on your medications by comparing across pharmacies.
                  </p>
                </CardContent>
              </Card>
              <Card className="luxury-card">
                <CardContent className="p-6 text-center">
                  <Pill className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-foreground font-semibold mb-2">Generic Alternatives</h3>
                  <p className="text-muted-foreground text-sm">
                    Discover if a lower-cost generic version of your medication is available.
                  </p>
                </CardContent>
              </Card>
              <Card className="luxury-card">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-foreground font-semibold mb-2">Manufacturer Coupons</h3>
                  <p className="text-muted-foreground text-sm">
                    Find manufacturer coupons and patient assistance programs.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 max-w-4xl mx-auto"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-foreground font-semibold mb-2">Important Notice</h3>
                <p className="text-muted-foreground text-sm">
                  Drug prices shown are estimates and may vary by location and pharmacy. 
                  Always verify prices at the pharmacy before purchasing. This tool is for 
                  informational purposes only and does not replace professional medical advice.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
