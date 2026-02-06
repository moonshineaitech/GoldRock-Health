import { useState } from "react";
import { MobileLayout, MobileCard } from "@/components/mobile-layout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FileText, Plus, Clock, CheckCircle2, AlertTriangle, DollarSign,
  TrendingDown, Calendar, Building2, ArrowRight, Eye, Loader2,
  Search, Filter, BarChart3, Shield, Gavel, Heart, Timer
} from "lucide-react";
import { Link } from "wouter";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; progress: number }> = {
  uploaded: { label: "Received", color: "bg-blue-100 text-blue-700", icon: FileText, progress: 10 },
  analyzing: { label: "Analyzing", color: "bg-yellow-100 text-yellow-700", icon: Search, progress: 25 },
  analyzed: { label: "Analyzed", color: "bg-purple-100 text-purple-700", icon: Eye, progress: 40 },
  disputing: { label: "Disputing", color: "bg-orange-100 text-orange-700", icon: Gavel, progress: 60 },
  negotiating: { label: "Negotiating", color: "bg-amber-100 text-amber-700", icon: TrendingDown, progress: 75 },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-700", icon: CheckCircle2, progress: 100 },
  charity_care: { label: "Charity Care", color: "bg-pink-100 text-pink-700", icon: Heart, progress: 80 },
};

const TIMELINE_STEPS = ["uploaded", "analyzing", "analyzed", "disputing", "negotiating", "resolved"];

function BillTimeline({ status }: { status: string }) {
  const currentIndex = TIMELINE_STEPS.indexOf(status);
  return (
    <div className="flex items-center w-full gap-1 my-3">
      {TIMELINE_STEPS.map((step, i) => {
        const isCompleted = i <= currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step} className="flex-1 flex flex-col items-center">
            <div className={`w-full h-2 rounded-full transition-all ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'} ${isCurrent ? 'ring-2 ring-emerald-300' : ''}`} />
            <span className={`text-[10px] mt-1 ${isCompleted ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
              {STATUS_CONFIG[step]?.label || step}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AddBillDialog({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: "", providerName: "", totalAmount: "", patientResponsibility: "", dueDate: ""
  });

  const createBill = useMutation({
    mutationFn: async (data: any) => apiRequest("POST", "/api/bill-tracker/bills", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bill-tracker/bills"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bill-tracker/summary"] });
      toast({ title: "Bill added", description: "Your bill has been added to the tracker." });
      onClose();
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <Label>Bill Name</Label>
        <Input placeholder="e.g., Emergency Room Visit" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div>
        <Label>Provider / Hospital</Label>
        <Input placeholder="e.g., City General Hospital" value={form.providerName} onChange={(e) => setForm({ ...form, providerName: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Total Amount</Label>
          <Input type="number" placeholder="0.00" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} />
        </div>
        <div>
          <Label>Your Responsibility</Label>
          <Input type="number" placeholder="0.00" value={form.patientResponsibility} onChange={(e) => setForm({ ...form, patientResponsibility: e.target.value })} />
        </div>
      </div>
      <div>
        <Label>Due Date</Label>
        <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
      </div>
      <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => createBill.mutate(form)} disabled={createBill.isPending || !form.title || !form.totalAmount}>
        {createBill.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
        Add Bill to Tracker
      </Button>
    </div>
  );
}

function BillCard({ bill }: { bill: any }) {
  const config = STATUS_CONFIG[bill.status] || STATUS_CONFIG.uploaded;
  const StatusIcon = config.icon;
  const saved = bill.totalAmount && bill.negotiatedAmount ? (parseFloat(bill.totalAmount) - parseFloat(bill.negotiatedAmount)) : 0;
  const daysUntilDue = bill.dueDate ? Math.ceil((new Date(bill.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">{bill.title}</h3>
          {bill.providerName && <p className="text-xs text-gray-500 flex items-center gap-1"><Building2 className="w-3 h-3" />{bill.providerName}</p>}
        </div>
        <Badge className={`${config.color} text-xs`}>
          <StatusIcon className="w-3 h-3 mr-1" />{config.label}
        </Badge>
      </div>

      <BillTimeline status={bill.status} />

      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-[10px] text-gray-500">Original</p>
          <p className="font-bold text-sm text-gray-900">${parseFloat(bill.totalAmount || 0).toLocaleString()}</p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-[10px] text-gray-500">You Owe</p>
          <p className="font-bold text-sm text-gray-900">${parseFloat(bill.patientResponsibility || 0).toLocaleString()}</p>
        </div>
        <div className={`text-center p-2 rounded-lg ${saved > 0 ? 'bg-emerald-50' : 'bg-gray-50'}`}>
          <p className="text-[10px] text-gray-500">Saved</p>
          <p className={`font-bold text-sm ${saved > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>${saved.toLocaleString()}</p>
        </div>
      </div>

      {daysUntilDue !== null && (
        <div className={`mt-3 flex items-center gap-2 text-xs ${daysUntilDue <= 7 ? 'text-red-600' : daysUntilDue <= 30 ? 'text-amber-600' : 'text-gray-500'}`}>
          <Timer className="w-3 h-3" />
          {daysUntilDue > 0 ? `${daysUntilDue} days until due` : daysUntilDue === 0 ? 'Due today!' : `${Math.abs(daysUntilDue)} days overdue`}
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <Link href={`/bill-ai`}>
          <Button size="sm" variant="outline" className="text-xs flex-1">
            <Eye className="w-3 h-3 mr-1" />Analyze
          </Button>
        </Link>
        <Link href="/dispute-arsenal">
          <Button size="sm" variant="outline" className="text-xs flex-1">
            <Gavel className="w-3 h-3 mr-1" />Dispute
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function BillTracker() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: bills = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/bill-tracker/bills"],
    enabled: !!user,
  });

  const { data: summary } = useQuery<any>({
    queryKey: ["/api/bill-tracker/summary"],
    enabled: !!user,
  });

  const filteredBills = statusFilter === "all" ? bills : bills.filter((b: any) => b.status === statusFilter);

  const totalOriginal = bills.reduce((sum: number, b: any) => sum + parseFloat(b.totalAmount || 0), 0);
  const totalOwed = bills.reduce((sum: number, b: any) => sum + parseFloat(b.patientResponsibility || 0), 0);
  const totalSaved = summary?.totalSaved || 0;

  return (
    <MobileLayout title="Bill Tracker" >
      <div className="space-y-6 pb-20">
        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs font-medium">Total Bills Tracked</p>
                <p className="text-3xl font-bold">{bills.length}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-xs font-medium">Total Saved</p>
                <p className="text-2xl font-bold text-emerald-300">${totalSaved.toLocaleString()}</p>
              </div>
            </div>
            {totalOriginal > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-blue-100 mb-1">
                  <span>Original: ${totalOriginal.toLocaleString()}</span>
                  <span>Current: ${totalOwed.toLocaleString()}</span>
                </div>
                <Progress value={totalOwed > 0 ? ((totalOriginal - totalOwed) / totalOriginal) * 100 : 0} className="h-2 bg-blue-400" />
              </div>
            )}
          </motion.div>

          {[
            { label: "Active", count: bills.filter((b: any) => !['resolved'].includes(b.status)).length, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Resolved", count: bills.filter((b: any) => b.status === 'resolved').length, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${stat.bg} rounded-xl p-3 text-center`}>
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1 bg-white">
              <Filter className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bills</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700"><Plus className="w-4 h-4 mr-1" />Add Bill</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a New Bill</DialogTitle>
              </DialogHeader>
              <AddBillDialog onClose={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : filteredBills.length === 0 ? (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <h3 className="font-semibold text-gray-700 mb-1">{bills.length === 0 ? "No bills tracked yet" : "No matching bills"}</h3>
              <p className="text-sm text-gray-500 mb-4">{bills.length === 0 ? "Add your first medical bill to start tracking savings" : "Try adjusting your filter"}</p>
              {bills.length === 0 && (
                <Button onClick={() => setDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-1" />Add Your First Bill
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredBills.map((bill: any) => (
                <BillCard key={bill.id} bill={bill} />
              ))}
            </AnimatePresence>
          </div>
        )}

        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-emerald-800 text-sm">Need help with a bill?</h4>
                <p className="text-xs text-emerald-600">Our AI analyzer can find errors and savings opportunities automatically.</p>
              </div>
              <Link href="/bill-ai">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 ml-auto whitespace-nowrap">
                  <ArrowRight className="w-3 h-3 mr-1" />Analyze
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}