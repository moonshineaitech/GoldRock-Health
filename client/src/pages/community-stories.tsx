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
import {
  Heart, MessageCircle, ThumbsUp, Share2, Plus, DollarSign,
  TrendingDown, MapPin, Star, Award, Users, Sparkles,
  Loader2, Quote, CheckCircle2, Filter
} from "lucide-react";

const BILL_TYPES = ["Emergency Room", "Surgery", "Hospital Stay", "Lab Work", "Imaging/MRI", "Ambulance", "Specialist Visit", "Prescription", "Mental Health", "Physical Therapy", "Dental", "Other"];
const STRATEGIES = ["Negotiation", "Dispute Letter", "Charity Care", "Insurance Appeal", "Payment Plan", "Financial Assistance", "Billing Error Found", "Price Match", "Other"];

function ShareStoryForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    displayName: "Anonymous", state: "", billType: "", originalAmount: "",
    finalAmount: "", strategyUsed: "", story: "", advice: ""
  });

  const submitStory = useMutation({
    mutationFn: async (data: any) => apiRequest("POST", "/api/community-stories", {
      ...data,
      originalAmount: parseFloat(data.originalAmount),
      finalAmount: parseFloat(data.finalAmount),
      savedAmount: parseFloat(data.originalAmount) - parseFloat(data.finalAmount),
      savingsPercent: Math.round(((parseFloat(data.originalAmount) - parseFloat(data.finalAmount)) / parseFloat(data.originalAmount)) * 100),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-stories"] });
      toast({ title: "Story submitted!", description: "Your story will be reviewed and published soon." });
      onClose();
    },
  });

  const savings = form.originalAmount && form.finalAmount ? parseFloat(form.originalAmount) - parseFloat(form.finalAmount) : 0;

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Display Name</Label>
          <Input placeholder="Anonymous" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
        </div>
        <div>
          <Label>State</Label>
          <Input placeholder="e.g., CA" maxLength={2} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })} />
        </div>
      </div>
      <div>
        <Label>Type of Bill</Label>
        <Select value={form.billType} onValueChange={(v) => setForm({ ...form, billType: v })}>
          <SelectTrigger><SelectValue placeholder="Select bill type" /></SelectTrigger>
          <SelectContent>{BILL_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Original Bill Amount</Label>
          <Input type="number" placeholder="0.00" value={form.originalAmount} onChange={(e) => setForm({ ...form, originalAmount: e.target.value })} />
        </div>
        <div>
          <Label>Final Amount Paid</Label>
          <Input type="number" placeholder="0.00" value={form.finalAmount} onChange={(e) => setForm({ ...form, finalAmount: e.target.value })} />
        </div>
      </div>
      {savings > 0 && (
        <div className="bg-emerald-50 rounded-lg p-3 text-center">
          <p className="text-xs text-emerald-600">You saved</p>
          <p className="text-2xl font-bold text-emerald-700">${savings.toLocaleString()}</p>
        </div>
      )}
      <div>
        <Label>Strategy Used</Label>
        <Select value={form.strategyUsed} onValueChange={(v) => setForm({ ...form, strategyUsed: v })}>
          <SelectTrigger><SelectValue placeholder="What strategy worked?" /></SelectTrigger>
          <SelectContent>{STRATEGIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div>
        <Label>Your Story</Label>
        <Textarea placeholder="Tell us what happened and how you reduced your bill..." value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} rows={4} />
      </div>
      <div>
        <Label>Advice for Others</Label>
        <Textarea placeholder="What would you tell someone in the same situation?" value={form.advice} onChange={(e) => setForm({ ...form, advice: e.target.value })} rows={2} />
      </div>
      <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => submitStory.mutate(form)} disabled={submitStory.isPending || !form.story || !form.originalAmount || !form.finalAmount}>
        {submitStory.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Heart className="w-4 h-4 mr-2" />}
        Share Your Story
      </Button>
    </div>
  );
}

function StoryCard({ story }: { story: any }) {
  const queryClient = useQueryClient();
  const markHelpful = useMutation({
    mutationFn: () => apiRequest("POST", `/api/community-stories/${story.id}/helpful`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/community-stories"] }),
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-emerald-700 font-bold text-xs">{(story.displayName || "A")[0].toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{story.displayName || "Anonymous"}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {story.state && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{story.state}</span>}
              {story.billType && <Badge variant="outline" className="text-[10px]">{story.billType}</Badge>}
            </div>
          </div>
        </div>
        {story.verified && <Badge className="bg-blue-100 text-blue-700 text-[10px]"><CheckCircle2 className="w-3 h-3 mr-0.5" />Verified</Badge>}
      </div>

      <div className="bg-emerald-50 rounded-xl p-3 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Original</p>
            <p className="text-sm font-bold text-gray-900 line-through">${parseFloat(story.originalAmount).toLocaleString()}</p>
          </div>
          <TrendingDown className="w-5 h-5 text-emerald-500" />
          <div>
            <p className="text-xs text-gray-500">Final</p>
            <p className="text-sm font-bold text-emerald-700">${parseFloat(story.finalAmount).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Saved</p>
            <p className="text-lg font-bold text-emerald-600">{story.savingsPercent}%</p>
          </div>
        </div>
      </div>

      {story.strategyUsed && (
        <Badge className="bg-purple-100 text-purple-700 text-xs mb-2">{story.strategyUsed}</Badge>
      )}

      <div className="relative mb-3">
        <Quote className="w-4 h-4 text-gray-200 absolute -top-1 -left-1" />
        <p className="text-sm text-gray-700 pl-4 italic">{story.story}</p>
      </div>

      {story.advice && (
        <div className="bg-blue-50 rounded-lg p-2 mb-3">
          <p className="text-xs text-blue-600 font-medium mb-0.5">Advice:</p>
          <p className="text-xs text-blue-700">{story.advice}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t">
        <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-emerald-600" onClick={() => markHelpful.mutate()}>
          <ThumbsUp className="w-3 h-3 mr-1" />{story.helpfulCount || 0} Helpful
        </Button>
        <Button variant="ghost" size="sm" className="text-xs text-gray-500" onClick={() => {
          navigator.clipboard.writeText(`I saved ${story.savingsPercent}% on my medical bill using GoldRock Health! ${story.strategyUsed ? `Strategy: ${story.strategyUsed}` : ''}`);
        }}>
          <Share2 className="w-3 h-3 mr-1" />Share
        </Button>
      </div>
    </motion.div>
  );
}

export default function CommunityStories() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const { data: stories = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/community-stories"],
  });

  const { data: aggregateStats } = useQuery<any>({
    queryKey: ["/api/community-stories/stats"],
  });

  const filtered = filter === "all" ? stories : stories.filter((s: any) => s.strategyUsed === filter || s.billType === filter);

  return (
    <MobileLayout title="Success Stories">
      <div className="space-y-6 pb-20">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <Award className="w-8 h-8 mb-2 text-emerald-200" />
          <h2 className="text-xl font-bold mb-1">Real People. Real Savings.</h2>
          <p className="text-emerald-200 text-sm">See how others have reduced their medical bills. Your story could inspire someone else.</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">Total Shared</p>
            <p className="text-xl font-bold text-emerald-600">{aggregateStats?.totalStories || stories.length}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">Avg Savings</p>
            <p className="text-xl font-bold text-blue-600">{aggregateStats?.avgSavingsPercent || 0}%</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">Total Saved</p>
            <p className="text-xl font-bold text-purple-600">${(aggregateStats?.totalSaved || 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="flex-1 bg-white">
              <Filter className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Filter stories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stories</SelectItem>
              {STRATEGIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap"><Plus className="w-4 h-4 mr-1" />Share Yours</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-emerald-600" />Share Your Success Story</DialogTitle>
              </DialogHeader>
              <ShareStoryForm onClose={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <h3 className="font-semibold text-gray-700 mb-1">Be the first to share</h3>
              <p className="text-sm text-gray-500 mb-4">Your story can help others who are struggling with medical bills</p>
              <Button onClick={() => setDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Heart className="w-4 h-4 mr-1" />Share Your Story
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filtered.map((story: any) => <StoryCard key={story.id} story={story} />)}
            </AnimatePresence>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}