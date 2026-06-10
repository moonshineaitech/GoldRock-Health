import { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign, MapPin,
  FileText, AlertTriangle, Building2, PieChart, Globe,
  Loader2, Shield, ArrowRight, Target, Percent,
  Activity, Zap, Eye, Database
} from "lucide-react";

function MetricCard({ icon: Icon, label, value, change, color, bg }: any) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className={`${bg} rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      {change && (
        <p className={`text-xs mt-0.5 ${change > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
          {change > 0 ? '+' : ''}{change}% vs last month
        </p>
      )}
    </motion.div>
  );
}

function InsightBar({ label, value, maxValue, color, suffix = "" }: any) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-32 truncate">{label}</span>
      <div className="flex-1 bg-secondary rounded-full h-4 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }}
          className={`h-full ${color} rounded-full`} />
      </div>
      <span className="text-xs font-medium text-foreground w-20 text-right">{typeof value === 'number' && value > 999 ? `$${(value/1000).toFixed(1)}k` : `${value}${suffix}`}</span>
    </div>
  );
}

export default function DataInsights() {
  const [period, setPeriod] = useState("30d");
  const [tab, setTab] = useState("overview");

  const { data: insights, isLoading } = useQuery<any>({
    queryKey: ["/api/data-insights", period],
  });

  const platformData = insights || {
    totalBillsAnalyzed: 0,
    totalSavingsGenerated: 0,
    avgSavingsPerBill: 0,
    avgOverchargePercent: 0,
    topOverchargedProcedures: [],
    savingsByState: [],
    savingsByStrategy: [],
    commonBillingErrors: [],
    monthlyTrends: [],
  };

  return (
    <MobileLayout title="Data Insights">
      <div className="space-y-6 pb-20">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="luxury-card rounded-2xl p-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
            <Database className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-1 font-serif text-foreground">Platform Analytics</h2>
          <p className="text-muted-foreground text-sm">Anonymized, aggregate insights about medical billing patterns, overcharges, and consumer savings across the platform.</p>
        </motion.div>

        <div className="flex items-center justify-between">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MetricCard icon={FileText} label="Bills Analyzed" value={platformData.totalBillsAnalyzed.toLocaleString()} color="text-foreground" bg="bg-secondary" />
          <MetricCard icon={DollarSign} label="Total Savings" value={`$${(platformData.totalSavingsGenerated / 1000).toFixed(0)}k`} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-900/20" />
          <MetricCard icon={Target} label="Avg Savings/Bill" value={`$${platformData.avgSavingsPerBill.toLocaleString()}`} color="text-gold" bg="bg-secondary" />
          <MetricCard icon={AlertTriangle} label="Avg Overcharge" value={`${platformData.avgOverchargePercent}%`} color="text-red-600 dark:text-red-400" bg="bg-red-50 dark:bg-red-900/20" />
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="procedures">Procedures</TabsTrigger>
            <TabsTrigger value="states">By State</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-gold" />Savings by Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(platformData.savingsByStrategy || [
                  { name: "Negotiation", savings: 125000, count: 340 },
                  { name: "Billing Error Disputes", savings: 98000, count: 210 },
                  { name: "Insurance Appeals", savings: 87000, count: 180 },
                  { name: "Charity Care", savings: 156000, count: 95 },
                  { name: "Price Transparency", savings: 45000, count: 120 },
                ]).map((s: any) => (
                  <InsightBar key={s.name} label={s.name} value={s.savings} maxValue={200000} color="bg-emerald-500" />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><Activity className="w-4 h-4 text-gold" />Key Findings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { insight: "Emergency room bills are overcharged by an average of 340% compared to Medicare rates", severity: "high" },
                  { insight: "43% of medical bills contain at least one billing error", severity: "high" },
                  { insight: "Patients who negotiate save an average of 37% off their original bill", severity: "medium" },
                  { insight: "Insurance denials are successfully overturned 60% of the time when appealed", severity: "medium" },
                  { insight: "Most nonprofit hospitals offer charity care but only 15% of eligible patients apply", severity: "high" },
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-secondary rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${f.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                    <p className="text-xs text-muted-foreground">{f.insight}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="procedures" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" />Most Overcharged Procedures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(platformData.topOverchargedProcedures || [
                  { procedure: "ER Visit (Critical) - 99285", avgOvercharge: 340, avgBill: 4500 },
                  { procedure: "Brain MRI - 70553", avgOvercharge: 280, avgBill: 2100 },
                  { procedure: "CT Scan - 71260", avgOvercharge: 250, avgBill: 1800 },
                  { procedure: "Colonoscopy - 45378", avgOvercharge: 220, avgBill: 3200 },
                  { procedure: "Blood Panel - 80053", avgOvercharge: 180, avgBill: 450 },
                  { procedure: "X-Ray - 71046", avgOvercharge: 160, avgBill: 300 },
                ]).map((p: any) => (
                  <div key={p.procedure} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-xs font-medium text-foreground">{p.procedure}</p>
                      <p className="text-[10px] text-muted-foreground">Avg bill: ${p.avgBill.toLocaleString()}</p>
                    </div>
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">{p.avgOvercharge}% overcharged</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="states" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><MapPin className="w-4 h-4 text-gold" />Savings by State (Top 10)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(platformData.savingsByState || [
                  { state: "California", savings: 89000, bills: 450 },
                  { state: "Texas", savings: 76000, bills: 380 },
                  { state: "Florida", savings: 67000, bills: 320 },
                  { state: "New York", savings: 61000, bills: 290 },
                  { state: "Illinois", savings: 45000, bills: 210 },
                  { state: "Pennsylvania", savings: 38000, bills: 180 },
                  { state: "Ohio", savings: 34000, bills: 160 },
                  { state: "Georgia", savings: 29000, bills: 140 },
                  { state: "North Carolina", savings: 26000, bills: 130 },
                  { state: "Michigan", savings: 23000, bills: 110 },
                ]).map((s: any) => (
                  <InsightBar key={s.state} label={s.state} value={s.savings} maxValue={100000} color="bg-emerald-500" />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><Shield className="w-4 h-4 text-gold" />Most Common Billing Errors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(platformData.commonBillingErrors || [
                  { error: "Upcoding (billing for more expensive procedure)", frequency: 23 },
                  { error: "Duplicate charges for same service", frequency: 18 },
                  { error: "Unbundling (splitting procedures to charge more)", frequency: 15 },
                  { error: "Incorrect patient information", frequency: 12 },
                  { error: "Services not rendered but billed", frequency: 9 },
                  { error: "Wrong diagnosis code applied", frequency: 8 },
                  { error: "Incorrect insurance adjustment", frequency: 7 },
                  { error: "Balance billing for in-network services", frequency: 5 },
                ]).map((e: any) => (
                  <InsightBar key={e.error} label={e.error} value={e.frequency} maxValue={30} color="bg-amber-500" suffix="%" />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-secondary border-border">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">Data Privacy</h4>
                <p className="text-xs text-muted-foreground">All data shown is anonymized and aggregated. No individual patient information is ever exposed. Data is used solely to help consumers understand billing patterns and fight overcharges.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}