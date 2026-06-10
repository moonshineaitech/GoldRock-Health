import { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, DollarSign, MapPin, TrendingDown, TrendingUp, Building2,
  ArrowRight, BarChart3, AlertTriangle, CheckCircle2, Star, Filter,
  Loader2
} from "lucide-react";

const COMMON_PROCEDURES = [
  { code: "99283", name: "ER Visit (Moderate)", avgPrice: 1200 },
  { code: "99284", name: "ER Visit (High)", avgPrice: 2800 },
  { code: "99285", name: "ER Visit (Critical)", avgPrice: 4500 },
  { code: "70553", name: "Brain MRI with Contrast", avgPrice: 2100 },
  { code: "71260", name: "CT Chest with Contrast", avgPrice: 1800 },
  { code: "27447", name: "Total Knee Replacement", avgPrice: 35000 },
  { code: "59400", name: "Vaginal Delivery", avgPrice: 12000 },
  { code: "59510", name: "Cesarean Delivery", avgPrice: 18000 },
  { code: "43239", name: "Upper GI Endoscopy", avgPrice: 3200 },
  { code: "29881", name: "Knee Arthroscopy", avgPrice: 8500 },
  { code: "47562", name: "Laparoscopic Cholecystectomy", avgPrice: 15000 },
  { code: "93000", name: "EKG/ECG", avgPrice: 350 },
];

function PriceBar({ label, price, maxPrice, color }: { label: string; price: number; maxPrice: number; color: string }) {
  const pct = maxPrice > 0 ? (price / maxPrice) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-24 text-right">{label}</span>
      <div className="flex-1 bg-secondary rounded-full h-6 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}
          className={`h-full ${color} rounded-full flex items-center justify-end pr-2`}>
          {pct > 20 && <span className="text-[10px] font-bold text-white">${price.toLocaleString()}</span>}
        </motion.div>
      </div>
      {pct <= 20 && <span className="text-xs font-medium text-foreground">${price.toLocaleString()}</span>}
    </div>
  );
}

function ProviderPriceCard({ provider, cheapest }: { provider: any; cheapest: boolean }) {
  const cashPrice = parseFloat(provider.cashPrice || 0);
  const natAvg = parseFloat(provider.nationalAverage || 0);
  const diff = natAvg > 0 ? ((cashPrice - natAvg) / natAvg * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-card rounded-xl border p-4 ${cheapest ? 'border-gold shadow-sm' : 'border-border'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{provider.providerName}</h3>
            {cheapest && <Badge className="text-white text-[10px]" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}><Star className="w-3 h-3 mr-0.5" />Best Price</Badge>}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{provider.city}, {provider.state}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">${cashPrice.toLocaleString()}</p>
          <p className={`text-xs flex items-center gap-0.5 justify-end ${diff < 0 ? 'text-emerald-600' : diff > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
            {diff < 0 ? <TrendingDown className="w-3 h-3" /> : diff > 0 ? <TrendingUp className="w-3 h-3" /> : null}
            {Math.abs(Math.round(diff))}% vs average
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        {provider.cashPrice && (
          <div className="text-center p-2 bg-secondary rounded-lg">
            <p className="text-[10px] text-muted-foreground">Cash Price</p>
            <p className="text-xs font-bold">${cashPrice.toLocaleString()}</p>
          </div>
        )}
        {provider.insurancePrice && (
          <div className="text-center p-2 bg-secondary rounded-lg">
            <p className="text-[10px] text-muted-foreground">Insured</p>
            <p className="text-xs font-bold">${parseFloat(provider.insurancePrice).toLocaleString()}</p>
          </div>
        )}
        {provider.medicareRate && (
          <div className="text-center p-2 bg-secondary rounded-lg">
            <p className="text-[10px] text-muted-foreground">Medicare</p>
            <p className="text-xs font-bold">${parseFloat(provider.medicareRate).toLocaleString()}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function PriceComparison() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProcedure, setSelectedProcedure] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const { data: results = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/price-comparison", selectedProcedure, stateFilter],
    enabled: !!selectedProcedure,
  });

  const sortedResults = [...results].sort((a: any, b: any) => parseFloat(a.cashPrice || 0) - parseFloat(b.cashPrice || 0));
  const filteredProcedures = COMMON_PROCEDURES.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.includes(searchQuery)
  );

  return (
    <MobileLayout title="Price Compare">
      <div className="space-y-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="luxury-card rounded-2xl p-6">
          <DollarSign className="w-8 h-8 mb-2 text-gold" />
          <h2 className="text-xl font-bold font-serif text-foreground mb-1">Compare Procedure Prices</h2>
          <p className="text-muted-foreground text-sm">See what hospitals charge for the same procedure. The exact same MRI can cost $400 at one facility and $4,000 at another.</p>
        </motion.div>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Search Procedures</Label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name or CPT code..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {filteredProcedures.slice(0, 8).map((p) => (
              <Button key={p.code} variant={selectedProcedure === p.code ? "default" : "outline"}
                className="text-xs h-auto py-2 px-3 justify-start"
                onClick={() => setSelectedProcedure(p.code)}>
                <div className="text-left">
                  <p className="font-medium truncate">{p.name}</p>
                  <p className="text-[10px] opacity-70">CPT {p.code} · Avg ${p.avgPrice.toLocaleString()}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {selectedProcedure && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold font-serif text-foreground">{COMMON_PROCEDURES.find(p => p.code === selectedProcedure)?.name}</h3>
                <p className="text-xs text-muted-foreground">CPT Code: {selectedProcedure}</p>
              </div>
              <Badge className="bg-secondary text-foreground">{sortedResults.length} facilities</Badge>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              </div>
            ) : sortedResults.length > 0 ? (
              <>
                <Card className="bg-card border-border">
                  <CardContent className="py-3">
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingDown className="w-4 h-4 text-gold" />
                      <span className="text-foreground font-medium">
                        Potential savings: up to ${(parseFloat(sortedResults[sortedResults.length - 1]?.cashPrice || 0) - parseFloat(sortedResults[0]?.cashPrice || 0)).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <div className="space-y-3">
                  {sortedResults.map((p: any, i: number) => (
                    <ProviderPriceCard key={p.id} provider={p} cheapest={i === 0} />
                  ))}
                </div>
              </>
            ) : (
              <Card className="bg-secondary border-dashed">
                <CardContent className="py-8 text-center">
                  <Building2 className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-semibold text-foreground mb-1">No price data yet</h3>
                  <p className="text-sm text-muted-foreground">Price transparency data for this procedure will be added as hospitals publish their rates</p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Why prices vary so much</h4>
                <p className="text-xs text-amber-700 mt-1">Under the Hospital Price Transparency Rule (2021), hospitals must publish their prices. However, the same procedure can cost 10x more at one facility than another. Always ask for the cash price and compare before scheduling non-emergency care.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}