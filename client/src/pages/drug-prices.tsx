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

      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#0a1628]">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Pill className="h-10 w-10 text-cyan-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Drug Price <span className="text-cyan-400">Comparison</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Compare prescription prices across pharmacies and save up to 80% on your medications.
            </p>
          </motion.div>

          <Card className="bg-white/5 border-white/10 max-w-4xl mx-auto mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="drugName" className="text-gray-300 mb-2 block">Drug Name</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="drugName"
                        data-testid="input-drug-name"
                        placeholder="Enter drug name (e.g., Lipitor, Metformin)"
                        value={drugName}
                        onChange={(e) => {
                          setDrugName(e.target.value);
                          setSearchSubmitted(false);
                        }}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-gray-300 mb-2 block">ZIP Code (Optional)</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="zipCode"
                        data-testid="input-zip-code"
                        placeholder="Enter ZIP"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        maxLength={5}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label className="text-gray-300 mb-2 block">Quantity</Label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white"
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
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                      disabled={drugName.length < 3}
                    >
                      <Search className="mr-2 h-4 w-4" /> Compare Prices
                    </Button>
                  </div>
                </div>
              </form>

              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {popularDrugs.map((drug) => (
                    <Badge 
                      key={drug}
                      variant="outline"
                      className="cursor-pointer hover:bg-white/10 text-gray-300 border-gray-600"
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
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400"></div>
            </div>
          )}

          {drugData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto space-y-6"
            >
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl text-white">{drugData.drugName}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {drugData.genericName} • {drugData.dosage} {drugData.form} • Qty: {drugData.quantity}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {drugData.genericAvailable && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Generic Available
                        </Badge>
                      )}
                      {drugData.manufacturerCoupon && (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
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
                        <TableRow className="border-white/10">
                          <TableHead className="text-gray-400">Pharmacy</TableHead>
                          <TableHead className="text-gray-400">Type</TableHead>
                          <TableHead className="text-gray-400 text-right">Retail Price</TableHead>
                          <TableHead className="text-gray-400 text-right">Discount Price</TableHead>
                          <TableHead className="text-gray-400 text-right">You Save</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {drugData.prices.sort((a, b) => a.discountPrice - b.discountPrice).map((price, index) => (
                          <TableRow key={price.pharmacyName} className="border-white/10">
                            <TableCell className="font-medium text-white">
                              <div className="flex items-center gap-2">
                                {price.pharmacyType === 'Mail-Order' ? (
                                  <Truck className="h-4 w-4 text-blue-400" />
                                ) : (
                                  <Store className="h-4 w-4 text-gray-400" />
                                )}
                                {price.pharmacyName}
                                {index === 0 && (
                                  <Badge className="bg-green-500/20 text-green-400 text-xs">Lowest</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-400">{price.pharmacyType}</TableCell>
                            <TableCell className="text-right text-gray-500 line-through">
                              {formatCurrency(price.retailPrice)}
                            </TableCell>
                            <TableCell className="text-right text-white font-bold">
                              {formatCurrency(price.discountPrice)}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="text-green-400 font-semibold">
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
                      <CardTitle className="text-white flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-green-400" />
                        Generic Alternative Available
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-3">
                        A generic version of this medication is available and can save you up to{' '}
                        <span className="text-green-400 font-bold">{drugData.genericSavings}%</span> compared to the brand name.
                      </p>
                      <p className="text-sm text-gray-400">
                        Ask your doctor or pharmacist if the generic is right for you.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {drugData.patientAssistanceProgram && (
                  <Card className="bg-blue-500/10 border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-400" />
                        Patient Assistance Program
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-3">
                        The manufacturer offers a patient assistance program that may provide 
                        this medication at reduced cost or free for qualifying patients.
                      </p>
                      <p className="text-sm text-gray-400">
                        Contact the manufacturer or ask your pharmacist for details.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    Money-Saving Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {drugData.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{tip}</span>
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
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 text-center">
                  <TrendingDown className="h-10 w-10 text-green-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Save Up to 80%</h3>
                  <p className="text-gray-400 text-sm">
                    Find the lowest prices on your medications by comparing across pharmacies.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 text-center">
                  <Pill className="h-10 w-10 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Generic Alternatives</h3>
                  <p className="text-gray-400 text-sm">
                    Discover if a lower-cost generic version of your medication is available.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-10 w-10 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Manufacturer Coupons</h3>
                  <p className="text-gray-400 text-sm">
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
              <AlertCircle className="h-6 w-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-2">Important Notice</h3>
                <p className="text-gray-300 text-sm">
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
