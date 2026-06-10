import { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield, FileText, Gavel, AlertTriangle, CheckCircle2, Clock,
  Plus, Loader2, Copy, Download, ArrowRight, Sparkles,
  Brain, DollarSign, Calendar, Building2, Scale, Eye
} from "lucide-react";

const DENIAL_CODES = [
  { code: "CO-4", reason: "Procedure code inconsistent with modifier or not covered" },
  { code: "CO-16", reason: "Claim/service lacks information needed for adjudication" },
  { code: "CO-18", reason: "Duplicate claim/service" },
  { code: "CO-29", reason: "Time limit for filing has expired" },
  { code: "CO-50", reason: "Non-covered service because not deemed medically necessary" },
  { code: "CO-97", reason: "Payment adjusted - already processed under another claim" },
  { code: "CO-109", reason: "Claim/service not covered by this payer/contractor" },
  { code: "PR-1", reason: "Deductible amount" },
  { code: "PR-2", reason: "Coinsurance amount" },
  { code: "PR-3", reason: "Co-payment amount" },
  { code: "OA-23", reason: "Impact of prior payer adjudication" },
];

function NewDenialForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    insuranceCompany: "", denialCode: "", denialReason: "",
    procedureCode: "", procedureDescription: "", claimAmount: "",
    dateOfDenial: "", appealDeadline: ""
  });
  const [generating, setGenerating] = useState(false);

  const createDenial = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/denial-appeals", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/denial-appeals"] });
      toast({ title: "Denial case created", description: "AI is generating your appeal letter." });
      onClose();
    },
  });

  const selectedDenial = DENIAL_CODES.find(d => d.code === form.denialCode);

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div>
        <Label>Insurance Company</Label>
        <Input placeholder="e.g., UnitedHealthcare" value={form.insuranceCompany} onChange={(e) => setForm({ ...form, insuranceCompany: e.target.value })} />
      </div>
      <div>
        <Label>Denial Code</Label>
        <Select value={form.denialCode} onValueChange={(v) => {
          const d = DENIAL_CODES.find(c => c.code === v);
          setForm({ ...form, denialCode: v, denialReason: d?.reason || form.denialReason });
        }}>
          <SelectTrigger><SelectValue placeholder="Select denial code" /></SelectTrigger>
          <SelectContent>
            {DENIAL_CODES.map((d) => (
              <SelectItem key={d.code} value={d.code}>{d.code} - {d.reason}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Denial Reason (if different)</Label>
        <Textarea placeholder="Why was the claim denied?" value={form.denialReason} onChange={(e) => setForm({ ...form, denialReason: e.target.value })} rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Procedure Code (CPT)</Label>
          <Input placeholder="e.g., 99285" value={form.procedureCode} onChange={(e) => setForm({ ...form, procedureCode: e.target.value })} />
        </div>
        <div>
          <Label>Claim Amount</Label>
          <Input type="number" placeholder="0.00" value={form.claimAmount} onChange={(e) => setForm({ ...form, claimAmount: e.target.value })} />
        </div>
      </div>
      <div>
        <Label>Procedure Description</Label>
        <Input placeholder="What was the procedure?" value={form.procedureDescription} onChange={(e) => setForm({ ...form, procedureDescription: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Date of Denial</Label>
          <Input type="date" value={form.dateOfDenial} onChange={(e) => setForm({ ...form, dateOfDenial: e.target.value })} />
        </div>
        <div>
          <Label>Appeal Deadline</Label>
          <Input type="date" value={form.appealDeadline} onChange={(e) => setForm({ ...form, appealDeadline: e.target.value })} />
        </div>
      </div>
      <Button className="w-full bg-primary text-primary-foreground" onClick={() => createDenial.mutate(form)} disabled={createDenial.isPending || !form.insuranceCompany || !form.denialReason}>
        {createDenial.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
        Generate Appeal Letter with AI
      </Button>
    </div>
  );
}

function DenialCard({ denial }: { denial: any }) {
  const [showLetter, setShowLetter] = useState(false);
  const daysUntilDeadline = denial.appealDeadline ? Math.ceil((new Date(denial.appealDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  const statusConfig: Record<string, { label: string; color: string }> = {
    denied: { label: "Denied", color: "bg-red-100 text-red-700" },
    appealing: { label: "Appeal Filed", color: "bg-amber-100 text-amber-700" },
    appeal_submitted: { label: "Under Review", color: "bg-secondary text-foreground" },
    won: { label: "Appeal Won", color: "bg-emerald-100 text-emerald-700" },
    lost: { label: "Appeal Lost", color: "bg-secondary text-foreground" },
    escalated: { label: "Escalated", color: "bg-secondary text-foreground" },
  };

  const config = statusConfig[denial.status] || statusConfig.denied;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{denial.insuranceCompany}</h3>
          <p className="text-xs text-muted-foreground">{denial.procedureDescription || `Code: ${denial.denialCode}`}</p>
        </div>
        <Badge className={config.color}>{config.label}</Badge>
      </div>

      <p className="text-xs text-muted-foreground bg-red-50 rounded-lg p-2 mb-3">
        <AlertTriangle className="w-3 h-3 inline mr-1 text-red-500" />
        Denial reason: {denial.denialReason}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {denial.claimAmount && (
          <div className="text-center p-2 bg-secondary rounded-lg">
            <p className="text-[10px] text-muted-foreground">Claim Amount</p>
            <p className="text-sm font-bold">${parseFloat(denial.claimAmount).toLocaleString()}</p>
          </div>
        )}
        {daysUntilDeadline !== null && (
          <div className={`text-center p-2 rounded-lg ${daysUntilDeadline <= 7 ? 'bg-red-50' : 'bg-amber-50'}`}>
            <p className="text-[10px] text-muted-foreground">Appeal Deadline</p>
            <p className={`text-sm font-bold ${daysUntilDeadline <= 7 ? 'text-red-600' : 'text-amber-600'}`}>
              {daysUntilDeadline > 0 ? `${daysUntilDeadline} days` : 'Expired'}
            </p>
          </div>
        )}
      </div>

      {denial.generatedAppealLetter && (
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setShowLetter(!showLetter)}>
            <Eye className="w-3 h-3 mr-1" />{showLetter ? "Hide" : "View"} Appeal Letter
          </Button>
          {showLetter && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="bg-secondary rounded-lg p-3 text-xs text-foreground whitespace-pre-wrap max-h-60 overflow-y-auto border">
              {denial.generatedAppealLetter}
            </motion.div>
          )}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => {
              navigator.clipboard.writeText(denial.generatedAppealLetter);
            }}>
              <Copy className="w-3 h-3 mr-1" />Copy Letter
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-xs">
              <Download className="w-3 h-3 mr-1" />Download
            </Button>
          </div>
        </div>
      )}

      {denial.recoveredAmount && parseFloat(denial.recoveredAmount) > 0 && (
        <div className="mt-3 bg-emerald-50 rounded-lg p-2 text-center">
          <p className="text-xs text-emerald-600">Recovered</p>
          <p className="text-lg font-bold text-emerald-700">${parseFloat(denial.recoveredAmount).toLocaleString()}</p>
        </div>
      )}
    </motion.div>
  );
}

export default function DenialAppeals() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: denials = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/denial-appeals"],
    enabled: !!user,
  });

  const stats = {
    total: denials.length,
    active: denials.filter((d: any) => ['denied', 'appealing', 'appeal_submitted'].includes(d.status)).length,
    won: denials.filter((d: any) => d.status === 'won').length,
    recovered: denials.filter((d: any) => d.recoveredAmount).reduce((s: number, d: any) => s + parseFloat(d.recoveredAmount || 0), 0),
  };

  return (
    <MobileLayout title="Denial Appeals">
      <div className="space-y-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl p-6 border border-border" style={{ background: 'linear-gradient(180deg, var(--background), var(--card))' }}>
          <Gavel className="w-8 h-8 mb-2 text-gold" />
          <h2 className="text-xl font-bold mb-1 font-serif text-foreground">Fight Insurance Denials</h2>
          <p className="text-muted-foreground text-sm">~15% of claims are denied. Most people don't appeal. Our AI generates compelling appeal letters that win.</p>
        </motion.div>

        <div className="grid grid-cols-4 gap-2">
          <div className="bg-secondary border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="bg-secondary border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-xl font-bold text-foreground">{stats.active}</p>
          </div>
          <div className="bg-secondary border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground">Won</p>
            <p className="text-xl font-bold text-emerald-700">{stats.won}</p>
          </div>
          <div className="bg-secondary border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground">Recovered</p>
            <p className="text-xl font-bold text-gold">${stats.recovered.toLocaleString()}</p>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />File a New Appeal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Brain className="w-5 h-5 text-gold" />AI Appeal Letter Generator</DialogTitle>
            </DialogHeader>
            <NewDenialForm onClose={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : denials.length === 0 ? (
          <Card className="bg-secondary border border-dashed border-border">
            <CardContent className="py-12 text-center">
              <Gavel className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold text-foreground mb-1">No denial appeals yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Got a denied insurance claim? Our AI will generate a compelling appeal letter for you.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {denials.map((d: any) => <DenialCard key={d.id} denial={d} />)}
          </div>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Scale className="w-5 h-5 text-gold" />Appeal Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              "You have 180 days for most internal appeals - don't wait",
              "Always request an external review if internal appeal is denied",
              "Include your doctor's medical necessity letter",
              "Reference your plan's specific coverage language",
              "Keep records of every call and interaction",
              "File a complaint with your state insurance commissioner",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3 h-3 text-gold mt-0.5 flex-shrink-0" />{tip}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}