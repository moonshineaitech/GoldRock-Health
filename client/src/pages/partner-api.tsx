import { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Code2, Key, Shield, BarChart3, Copy, Eye, EyeOff,
  Plus, Loader2, CheckCircle2, AlertTriangle, Clock,
  Globe, Zap, Database, ArrowRight, Terminal, BookOpen,
  Lock, Activity
} from "lucide-react";

function CreateApiKeyForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ partnerName: "", tier: "basic", webhookUrl: "" });

  const create = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/partner/keys", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/partner/keys"] });
      toast({ title: "API Key Created", description: "Save your API secret - it won't be shown again." });
      onClose();
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <Label>Organization / Partner Name</Label>
        <Input placeholder="e.g., HealthTech Inc." value={form.partnerName} onChange={(e) => setForm({ ...form, partnerName: e.target.value })} />
      </div>
      <div>
        <Label>API Tier</Label>
        <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic (60 req/min, 1K/day)</SelectItem>
            <SelectItem value="professional">Professional (300 req/min, 10K/day)</SelectItem>
            <SelectItem value="enterprise">Enterprise (Custom limits)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Webhook URL (optional)</Label>
        <Input placeholder="https://your-app.com/webhook" value={form.webhookUrl} onChange={(e) => setForm({ ...form, webhookUrl: e.target.value })} />
      </div>
      <Button className="w-full bg-slate-800 hover:bg-slate-900" onClick={() => create.mutate(form)} disabled={create.isPending || !form.partnerName}>
        {create.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Key className="w-4 h-4 mr-2" />}
        Generate API Key
      </Button>
    </div>
  );
}

function ApiKeyCard({ apiKey }: { apiKey: any }) {
  const [showKey, setShowKey] = useState(false);

  return (
    <Card className="border-gray-200">
      <CardContent className="py-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{apiKey.partnerName}</h3>
            <Badge className={apiKey.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}>
              {apiKey.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <Badge variant="outline">{apiKey.tier}</Badge>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 mb-2 flex items-center gap-2">
          <code className="text-xs text-gray-600 flex-1 font-mono">{showKey ? apiKey.apiKey : '••••••••••••••••'}</code>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowKey(!showKey)}>
            {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => navigator.clipboard.writeText(apiKey.apiKey)}>
            <Copy className="w-3 h-3" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-50 rounded p-1.5">
            <p className="text-[10px] text-gray-500">Requests</p>
            <p className="text-xs font-bold text-blue-700">{(apiKey.usageCount || 0).toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded p-1.5">
            <p className="text-[10px] text-gray-500">Rate Limit</p>
            <p className="text-xs font-bold">{apiKey.rateLimitPerMinute}/min</p>
          </div>
          <div className="bg-gray-50 rounded p-1.5">
            <p className="text-[10px] text-gray-500">Last Used</p>
            <p className="text-xs font-bold">{apiKey.lastUsedAt ? new Date(apiKey.lastUsedAt).toLocaleDateString() : "Never"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const CODE_EXAMPLES = {
  analyze: `curl -X POST https://api.goldrock.health/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "bill_text": "Emergency Room Visit...",
    "include_strategies": true
  }'`,
  compare: `curl -X GET "https://api.goldrock.health/v1/prices?cpt=99285&state=CA" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
  template: `curl -X POST https://api.goldrock.health/v1/templates/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "template_type": "dispute_letter",
    "variables": {
      "provider_name": "City Hospital",
      "bill_amount": 5200,
      "issue_type": "overcharge"
    }
  }'`,
};

export default function PartnerApi() {
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [tab, setTab] = useState("overview");

  const { data: apiKeys = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/partner/keys"],
    enabled: !!user,
  });

  return (
    <MobileLayout title="Partner API">
      <div className="space-y-6 pb-20">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
          <Code2 className="w-8 h-8 mb-2 text-slate-300" />
          <h2 className="text-xl font-bold mb-1">Developer API</h2>
          <p className="text-slate-300 text-sm">Embed GoldRock Health's bill analysis engine into your own applications. Perfect for insurance companies, benefit platforms, and patient advocacy organizations.</p>
        </motion.div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Zap, label: "Bill Analysis", desc: "AI-powered bill analysis", color: "text-amber-600", bg: "bg-amber-50" },
                { icon: Database, label: "Price Data", desc: "Procedure price comparison", color: "text-blue-600", bg: "bg-blue-50" },
                { icon: Shield, label: "Templates", desc: "Dispute letter generation", color: "text-purple-600", bg: "bg-purple-50" },
                { icon: Activity, label: "Analytics", desc: "Billing pattern insights", color: "text-emerald-600", bg: "bg-emerald-50" },
              ].map((e, i) => (
                <Card key={i} className={`${e.bg} border-none`}>
                  <CardContent className="py-3">
                    <e.icon className={`w-5 h-5 ${e.color} mb-1`} />
                    <p className="text-sm font-medium">{e.label}</p>
                    <p className="text-xs text-gray-500">{e.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">API Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { tier: "Basic", price: "Free", limits: "60 req/min, 1,000/day", features: ["Bill analysis", "Price comparison", "Basic templates"] },
                  { tier: "Professional", price: "$499/mo", limits: "300 req/min, 10,000/day", features: ["Everything in Basic", "Custom templates", "Webhook notifications", "Priority support"] },
                  { tier: "Enterprise", price: "Custom", limits: "Custom limits", features: ["Everything in Professional", "Dedicated infrastructure", "SLA guarantee", "Custom integrations"] },
                ].map((t) => (
                  <div key={t.tier} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{t.tier}</span>
                      <span className="text-sm font-bold text-blue-600">{t.price}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mb-1">{t.limits}</p>
                    <div className="flex flex-wrap gap-1">
                      {t.features.map((f, i) => (
                        <Badge key={i} variant="outline" className="text-[10px]">{f}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keys" className="space-y-4">
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-slate-800 hover:bg-slate-900">
                  <Plus className="w-4 h-4 mr-2" />Create New API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create API Key</DialogTitle></DialogHeader>
                <CreateApiKeyForm onClose={() => setCreateOpen(false)} />
              </DialogContent>
            </Dialog>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
              </div>
            ) : apiKeys.length === 0 ? (
              <Card className="bg-gray-50 border-dashed">
                <CardContent className="py-8 text-center">
                  <Key className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <h3 className="font-semibold text-gray-700 mb-1">No API keys yet</h3>
                  <p className="text-sm text-gray-500">Create your first API key to start integrating</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {apiKeys.map((k: any) => <ApiKeyCard key={k.id} apiKey={k} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="docs" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><Terminal className="w-4 h-4" />Quick Start</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">1. Analyze a Bill</p>
                  <pre className="bg-slate-900 text-slate-200 rounded-lg p-3 text-[10px] overflow-x-auto font-mono">{CODE_EXAMPLES.analyze}</pre>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">2. Compare Prices</p>
                  <pre className="bg-slate-900 text-slate-200 rounded-lg p-3 text-[10px] overflow-x-auto font-mono">{CODE_EXAMPLES.compare}</pre>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">3. Generate a Dispute Letter</p>
                  <pre className="bg-slate-900 text-slate-200 rounded-lg p-3 text-[10px] overflow-x-auto font-mono">{CODE_EXAMPLES.template}</pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><BookOpen className="w-4 h-4" />Available Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { method: "POST", path: "/v1/analyze", desc: "Analyze a medical bill" },
                  { method: "GET", path: "/v1/prices", desc: "Compare procedure prices" },
                  { method: "POST", path: "/v1/templates/generate", desc: "Generate dispute letter" },
                  { method: "GET", path: "/v1/codes/:code", desc: "Look up medical code" },
                  { method: "GET", path: "/v1/rights/:state", desc: "Get state legal rights" },
                  { method: "GET", path: "/v1/analytics/overcharges", desc: "Overcharge statistics" },
                  { method: "POST", path: "/v1/appeal/generate", desc: "Generate appeal letter" },
                ].map((e, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-b last:border-0">
                    <Badge className={`text-[10px] w-12 justify-center ${e.method === 'POST' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{e.method}</Badge>
                    <code className="text-xs font-mono text-gray-700 flex-1">{e.path}</code>
                    <span className="text-[10px] text-gray-500">{e.desc}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-slate-500" />
                  <div>
                    <h4 className="text-sm font-medium text-slate-800">Security</h4>
                    <p className="text-xs text-slate-600">All API requests require Bearer token authentication. Data is encrypted in transit (TLS 1.3) and at rest.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-blue-500" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-800">Need help integrating?</h4>
                <p className="text-xs text-blue-600">CONTACT@GOLDROCK.ai</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}