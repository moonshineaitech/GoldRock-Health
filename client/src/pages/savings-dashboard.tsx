import { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign, TrendingUp, TrendingDown, Target, Award, Calendar,
  PieChart, BarChart3, CheckCircle2, Clock, ArrowRight, Sparkles,
  Shield, FileText, Zap, Trophy
} from "lucide-react";
import { Link } from "wouter";

function StatCard({ icon: Icon, label, value, subtext }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="luxury-card p-4"
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {subtext && <p className="text-xs text-muted-foreground mt-0.5">{subtext}</p>}
    </motion.div>
  );
}

function SavingsGoalMeter({ current, goal }: { current: number; goal: number }) {
  const pct = Math.min((current / goal) * 100, 100);
  return (
    <div className="luxury-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-gold" />
          <h3 className="font-serif font-semibold text-foreground">Savings Goal</h3>
        </div>
        <span className="text-sm text-muted-foreground">{Math.round(pct)}%</span>
      </div>
      <Progress value={pct} className="h-3 mb-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>${current.toLocaleString()} saved</span>
        <span>Goal: ${goal.toLocaleString()}</span>
      </div>
    </div>
  );
}

function MilestoneTimeline({ milestones }: { milestones: any[] }) {
  return (
    <div className="space-y-3">
      {milestones.map((m, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.completed ? 'bg-secondary text-gold' : 'bg-muted text-muted-foreground'}`}>
            {m.completed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${m.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{m.title}</p>
            <p className="text-xs text-muted-foreground">{m.description}</p>
          </div>
          {m.amount && <span className="text-sm font-bold text-gold">${m.amount.toLocaleString()}</span>}
        </motion.div>
      ))}
    </div>
  );
}

export default function SavingsDashboard() {
  const { user } = useAuth();

  const { data: outcomes = [] } = useQuery<any[]>({
    queryKey: ["/api/savings/outcomes"],
    enabled: !!user,
  });

  const { data: summary } = useQuery<any>({
    queryKey: ["/api/savings/summary"],
    enabled: !!user,
  });

  const totalSaved = summary?.totalSaved || 0;
  const billsResolved = summary?.resolved || 0;
  const avgSavings = summary?.avgSavingsPercent || 0;
  const activeDisputes = summary?.active || 0;

  const milestones = [
    { title: "First Bill Analyzed", description: "Upload and analyze your first medical bill", completed: (summary?.totalBills || 0) > 0, amount: null },
    { title: "First Savings Found", description: "AI identifies your first savings opportunity", completed: totalSaved > 0, amount: null },
    { title: "$100 Saved", description: "Reach $100 in total savings", completed: totalSaved >= 100, amount: 100 },
    { title: "$500 Saved", description: "Reach $500 in total savings", completed: totalSaved >= 500, amount: 500 },
    { title: "$1,000 Saved", description: "Join the $1K savings club", completed: totalSaved >= 1000, amount: 1000 },
    { title: "$5,000 Saved", description: "You're a bill reduction pro!", completed: totalSaved >= 5000, amount: 5000 },
    { title: "$10,000 Saved", description: "Elite savings achiever", completed: totalSaved >= 10000, amount: 10000 },
  ];

  const strategies = [
    { name: "Negotiation", count: outcomes.filter((o: any) => o.savingsMethod === "negotiation").length, saved: outcomes.filter((o: any) => o.savingsMethod === "negotiation").reduce((s: number, o: any) => s + parseFloat(o.totalSaved || 0), 0) },
    { name: "Dispute", count: outcomes.filter((o: any) => o.savingsMethod === "dispute").length, saved: outcomes.filter((o: any) => o.savingsMethod === "dispute").reduce((s: number, o: any) => s + parseFloat(o.totalSaved || 0), 0) },
    { name: "Charity Care", count: outcomes.filter((o: any) => o.savingsMethod === "charity_care").length, saved: outcomes.filter((o: any) => o.savingsMethod === "charity_care").reduce((s: number, o: any) => s + parseFloat(o.totalSaved || 0), 0) },
    { name: "Insurance Appeal", count: outcomes.filter((o: any) => o.savingsMethod === "insurance_appeal").length, saved: outcomes.filter((o: any) => o.savingsMethod === "insurance_appeal").reduce((s: number, o: any) => s + parseFloat(o.totalSaved || 0), 0) },
  ].filter(s => s.count > 0 || s.saved > 0);

  return (
    <MobileLayout title="Savings Dashboard" >
      <div className="space-y-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl p-6 text-white text-center"
          style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
        >
          <Sparkles className="w-8 h-8 mx-auto mb-2 text-white" />
          <p className="text-white/80 text-sm">Total Savings</p>
          <p className="text-5xl font-serif font-bold tracking-tight">${totalSaved.toLocaleString()}</p>
          <p className="text-white/80 text-sm mt-1">Across {outcomes.length} bills</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={FileText} label="Bills Tracked" value={summary?.totalBills || 0} />
          <StatCard icon={CheckCircle2} label="Bills Resolved" value={billsResolved} />
          <StatCard icon={TrendingDown} label="Avg Savings" value={`${avgSavings}%`} subtext="per bill" />
          <StatCard icon={Clock} label="Active" value={activeDisputes} subtext="in progress" />
        </div>

        <SavingsGoalMeter current={totalSaved} goal={Math.max(totalSaved * 1.5, 1000)} />

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-serif flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold" />Savings Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MilestoneTimeline milestones={milestones} />
          </CardContent>
        </Card>

        {strategies.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />Savings by Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {strategies.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.count} bills</p>
                  </div>
                  <Badge className="bg-secondary text-gold">${s.saved.toLocaleString()}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {outcomes.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-muted-foreground" />Recent Outcomes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {outcomes.slice(0, 5).map((o: any) => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{o.providerName || "Medical Bill"}</p>
                    <p className="text-xs text-muted-foreground">${parseFloat(o.originalAmount).toLocaleString()} → ${parseFloat(o.finalAmount || o.originalAmount).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gold">-${parseFloat(o.totalSaved || 0).toLocaleString()}</p>
                    <Badge variant="outline" className="text-xs">{o.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {outcomes.length === 0 && (
          <Card className="luxury-card">
            <CardContent className="py-6 text-center">
              <DollarSign className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="font-serif font-semibold text-foreground mb-1">Start Tracking Your Savings</h3>
              <p className="text-sm text-muted-foreground mb-4">Upload a bill and let our AI find savings opportunities for you</p>
              <Link href="/bill-ai">
                <Button><ArrowRight className="w-4 h-4 mr-1" />Analyze a Bill</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Link href="/bill-tracker">
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
              <CardContent className="py-4 text-center">
                <FileText className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                <p className="text-xs font-medium text-foreground">Bill Tracker</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dispute-arsenal">
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
              <CardContent className="py-4 text-center">
                <Shield className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                <p className="text-xs font-medium text-foreground">Dispute Tools</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </MobileLayout>
  );
}