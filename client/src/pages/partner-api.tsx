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
  Lock, Activity, RotateCcw, Trash2, DollarSign, TrendingUp,
  ShieldCheck, Server, FileText, Users
} from "lucide-react";

function CreateApiKeyForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ partnerName: "", tier: "basic", webhookUrl: "", allowedIps: "" });
  const [createdKey, setCreatedKey] = useState<any>(null);

  const create = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/partner/keys", {
        ...data,
        allowedIps: data.allowedIps ? data.allowedIps.split(",").map((ip: string) => ip.trim()).filter(Boolean) : [],
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/partner/keys"] });
      setCreatedKey(data);
    },
  });

  if (createdKey) {
    return (
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-amber-800">Save These Credentials Now</h3>
          </div>
          <p className="text-sm text-amber-700 mb-3">Your API secret will never be shown again. Copy it somewhere safe immediately.</p>
        </div>

        <div>
          <Label className="text-xs text-gray-500">API Key</Label>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
            <code className="text-xs font-mono text-gray-800 flex-1 break-all">{createdKey.apiKey}</code>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { navigator.clipboard.writeText(createdKey.apiKey); toast({ title: "Copied API Key" }); }}>
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-500">API Secret (shown once only)</Label>
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-2">
            <code className="text-xs font-mono text-red-800 flex-1 break-all">{createdKey.apiSecret}</code>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { navigator.clipboard.writeText(createdKey.apiSecret); toast({ title: "Copied API Secret" }); }}>
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {createdKey.webhookSecret && (
          <div>
            <Label className="text-xs text-gray-500">Webhook Secret</Label>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
              <code className="text-xs font-mono text-gray-800 flex-1 break-all">{createdKey.webhookSecret}</code>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { navigator.clipboard.writeText(createdKey.webhookSecret); toast({ title: "Copied Webhook Secret" }); }}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        <Button className="w-full" onClick={onClose}>I've Saved My Credentials</Button>
      </div>
    );
  }

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
            <SelectItem value="basic">Basic - $0/mo (1K requests/day)</SelectItem>
            <SelectItem value="professional">Professional - $499/mo (10K requests/day)</SelectItem>
            <SelectItem value="enterprise">Enterprise - Custom pricing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Webhook URL (optional)</Label>
        <Input placeholder="https://your-app.com/webhook" value={form.webhookUrl} onChange={(e) => setForm({ ...form, webhookUrl: e.target.value })} />
        <p className="text-[10px] text-gray-400 mt-1">We'll sign webhook payloads with HMAC-SHA256 for verification</p>
      </div>
      <div>
        <Label>IP Whitelist (optional, comma-separated)</Label>
        <Input placeholder="e.g., 203.0.113.5, 198.51.100.0" value={form.allowedIps} onChange={(e) => setForm({ ...form, allowedIps: e.target.value })} />
        <p className="text-[10px] text-gray-400 mt-1">Restrict API access to specific IP addresses</p>
      </div>
      <Button className="w-full bg-slate-800 hover:bg-slate-900" onClick={() => create.mutate(form)} disabled={create.isPending || !form.partnerName}>
        {create.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Key className="w-4 h-4 mr-2" />}
        Generate Secure API Key
      </Button>
    </div>
  );
}

function ApiKeyCard({ apiKey }: { apiKey: any }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showKey, setShowKey] = useState(false);
  const [rotatedKey, setRotatedKey] = useState<any>(null);

  const revoke = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/partner/keys/${apiKey.id}/revoke`, { reason: "Revoked by owner" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partner/keys"] });
      toast({ title: "API Key Revoked", description: "This key can no longer be used." });
    },
  });

  const rotate = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/partner/keys/${apiKey.id}/rotate`, {});
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/partner/keys"] });
      setRotatedKey(data);
      toast({ title: "Key Rotated", description: "Save your new credentials. Old key is now revoked." });
    },
  });

  if (rotatedKey) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="py-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-amber-800">New Key Created - Save Now</h3>
          </div>
          <div>
            <Label className="text-xs text-gray-500">New API Key</Label>
            <div className="flex items-center gap-2 bg-white rounded p-2">
              <code className="text-xs font-mono flex-1 break-all">{rotatedKey.apiKey}</code>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { navigator.clipboard.writeText(rotatedKey.apiKey); toast({ title: "Copied" }); }}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-500">New API Secret (shown once only)</Label>
            <div className="flex items-center gap-2 bg-white border border-red-200 rounded p-2">
              <code className="text-xs font-mono text-red-800 flex-1 break-all">{rotatedKey.apiSecret}</code>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { navigator.clipboard.writeText(rotatedKey.apiSecret); toast({ title: "Copied" }); }}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <Button size="sm" className="w-full" onClick={() => setRotatedKey(null)}>I've Saved My Credentials</Button>
        </CardContent>
      </Card>
    );
  }

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
          <Badge variant="outline" className="capitalize">{apiKey.tier}</Badge>
        </div>

        <div className="bg-gray-50 rounded-lg p-2 mb-3 flex items-center gap-2">
          <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <code className="text-xs text-gray-600 flex-1 font-mono">{showKey ? apiKey.apiKey : `${apiKey.apiKey.substring(0, 8)}${"•".repeat(30)}`}</code>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowKey(!showKey)}>
            {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center mb-3">
          <div className="bg-blue-50 rounded p-1.5">
            <p className="text-[10px] text-gray-500">Total Requests</p>
            <p className="text-xs font-bold text-blue-700">{(apiKey.usageCount || 0).toLocaleString()}</p>
          </div>
          <div className="bg-emerald-50 rounded p-1.5">
            <p className="text-[10px] text-gray-500">This Month</p>
            <p className="text-xs font-bold text-emerald-700">{(apiKey.monthlyUsageCount || 0).toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded p-1.5">
            <p className="text-[10px] text-gray-500">Rate Limit</p>
            <p className="text-xs font-bold">{apiKey.rateLimitPerMinute}/min</p>
          </div>
        </div>

        {apiKey.monthlyRequestQuota && (
          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
              <span>Monthly quota</span>
              <span>{(apiKey.monthlyUsageCount || 0).toLocaleString()} / {apiKey.monthlyRequestQuota.toLocaleString()}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${Math.min(100, ((apiKey.monthlyUsageCount || 0) / apiKey.monthlyRequestQuota) * 100)}%` }} />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 text-xs h-7" onClick={() => rotate.mutate()} disabled={rotate.isPending}>
            <RotateCcw className="w-3 h-3 mr-1" />Rotate
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs h-7 text-red-600 border-red-200 hover:bg-red-50" onClick={() => { if (confirm("Permanently revoke this API key? This cannot be undone.")) revoke.mutate(); }} disabled={revoke.isPending}>
            <Trash2 className="w-3 h-3 mr-1" />Revoke
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const CODE_EXAMPLES = {
  analyze: `curl -X POST https://api.goldrock.health/v1/analyze \\
  -H "Authorization: Bearer grh_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "billData": {
      "amount": 8500,
      "procedure": "Emergency Room Visit",
      "facilityType": "Hospital",
      "insuranceType": "commercial"
    }
  }'`,
  compare: `curl -X GET "https://api.goldrock.health/v1/prices?cpt=99285&state=CA" \\
  -H "Authorization: Bearer grh_your_api_key"`,
  template: `curl -X POST https://api.goldrock.health/v1/templates/generate \\
  -H "Authorization: Bearer grh_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "templateType": "dispute_letter",
    "variables": {
      "providerName": "City Hospital",
      "billAmount": 5200,
      "accountNumber": "ACC-12345"
    }
  }'`,
};

const PRICING_TIERS = [
  {
    tier: "Basic",
    price: "Free",
    monthlyPrice: "$0",
    limits: "60 req/min \u2022 1,000/day \u2022 10,000/mo",
    perRequest: "$0.00",
    features: ["Bill analysis", "Price comparison", "Basic templates", "Community support"],
    bestFor: "Testing & prototyping",
    color: "border-gray-200",
  },
  {
    tier: "Professional",
    price: "$499/mo",
    monthlyPrice: "$499",
    limits: "300 req/min \u2022 10,000/day \u2022 100,000/mo",
    perRequest: "$0.005",
    features: ["Everything in Basic", "Custom templates", "Webhook notifications", "IP whitelisting", "Usage analytics", "Priority email support", "99.9% SLA"],
    bestFor: "Growing platforms & apps",
    color: "border-blue-300",
    popular: true,
  },
  {
    tier: "Enterprise",
    price: "Custom",
    monthlyPrice: "Custom",
    limits: "1,000+ req/min \u2022 Custom limits",
    perRequest: "Volume discount",
    features: ["Everything in Professional", "Dedicated infrastructure", "Custom SLA", "White-label option", "Dedicated account manager", "Custom integrations", "On-premise option"],
    bestFor: "Insurance companies & large platforms",
    color: "border-purple-300",
  },
];

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
          <p className="text-slate-300 text-sm mb-3">Embed GoldRock Health's AI-powered bill analysis engine into your applications. Built for insurance companies, benefits platforms, patient advocacy organizations, and healthtech startups.</p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-slate-700 text-slate-200 text-[10px]"><ShieldCheck className="w-3 h-3 mr-1" />SHA-256 Hashed Secrets</Badge>
            <Badge className="bg-slate-700 text-slate-200 text-[10px]"><Server className="w-3 h-3 mr-1" />TLS 1.3 Encrypted</Badge>
            <Badge className="bg-slate-700 text-slate-200 text-[10px]"><Activity className="w-3 h-3 mr-1" />Real-time Rate Limiting</Badge>
          </div>
        </motion.div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="keys" className="text-xs">API Keys</TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs">Pricing</TabsTrigger>
            <TabsTrigger value="docs" className="text-xs">Docs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="py-4">
                <h3 className="text-sm font-bold text-emerald-800 mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" />What the API Does for Partners</h3>
                <p className="text-xs text-emerald-700 mb-3">Our API lets other companies offer medical bill reduction to their users without building the technology themselves. Instead of spending 12-18 months and $500K+ building an analysis engine, they call our API and get results in milliseconds.</p>
                <div className="space-y-2">
                  {[
                    { label: "Insurance Companies", desc: "Help policyholders understand their bills and reduce disputes", icon: Shield },
                    { label: "Benefits Platforms", desc: "Add bill analysis as a value-add feature for employers", icon: Users },
                    { label: "Patient Advocacy Orgs", desc: "Scale their dispute resolution with AI-powered analysis", icon: FileText },
                    { label: "Healthtech Startups", desc: "Build bill reduction features without hiring a medical billing team", icon: Zap },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 bg-white rounded-lg p-2">
                      <item.icon className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-800">{item.label}</p>
                        <p className="text-[10px] text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Zap, label: "Bill Analysis", desc: "AI grading, savings estimates, issue detection", color: "text-amber-600", bg: "bg-amber-50", cost: "$0.15/call" },
                { icon: Database, label: "Price Comparison", desc: "Regional price data for any CPT code", color: "text-blue-600", bg: "bg-blue-50", cost: "$0.02/call" },
                { icon: FileText, label: "Template Generation", desc: "Dispute letters, appeal letters, hardship apps", color: "text-purple-600", bg: "bg-purple-50", cost: "$0.08/call" },
                { icon: Shield, label: "Legal Rights", desc: "State-specific patient protections database", color: "text-emerald-600", bg: "bg-emerald-50", cost: "$0.01/call" },
              ].map((e, i) => (
                <Card key={i} className={`${e.bg} border-none`}>
                  <CardContent className="py-3">
                    <e.icon className={`w-5 h-5 ${e.color} mb-1`} />
                    <p className="text-sm font-medium">{e.label}</p>
                    <p className="text-[10px] text-gray-500 mb-1">{e.desc}</p>
                    <Badge variant="outline" className="text-[9px]">{e.cost}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="py-4">
                <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4" />Security Architecture</h3>
                <div className="space-y-2 text-xs text-blue-700">
                  <div className="flex items-start gap-2">
                    <Lock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <div><span className="font-medium">Hashed Secrets:</span> API secrets are SHA-256 hashed before storage. We never store or log plaintext secrets. Shown once at creation, then irretrievable.</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <div><span className="font-medium">IP Whitelisting:</span> Restrict API access to specific IP addresses. Requests from non-whitelisted IPs are rejected with 403.</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <RotateCcw className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <div><span className="font-medium">Key Rotation:</span> Rotate keys instantly without downtime. Old key is revoked immediately, new credentials are generated.</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Activity className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <div><span className="font-medium">Sliding Window Rate Limiting:</span> Per-minute and per-day limits with proper Retry-After headers. No brute force possible.</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Server className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <div><span className="font-medium">TLS 1.3 + Webhook Signing:</span> All data encrypted in transit. Webhook payloads signed with HMAC-SHA256 for verification.</div>
                  </div>
                </div>
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
              <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>Create Secure API Key</DialogTitle></DialogHeader>
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
                  <p className="text-sm text-gray-500 mb-2">Create your first API key to start integrating</p>
                  <p className="text-[10px] text-gray-400">Keys are secured with SHA-256 hashing. Secrets shown once at creation.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {apiKeys.map((k: any) => <ApiKeyCard key={k.id} apiKey={k} />)}
              </div>
            )}

            <Card className="bg-gray-50">
              <CardContent className="py-3">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Key Management Best Practices</h4>
                <ul className="space-y-1 text-[10px] text-gray-500">
                  <li className="flex items-start gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />Store API secrets in environment variables, never in code</li>
                  <li className="flex items-start gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />Use IP whitelisting in production to prevent unauthorized access</li>
                  <li className="flex items-start gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />Rotate keys every 90 days as a security best practice</li>
                  <li className="flex items-start gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />Revoke compromised keys immediately - rotation creates a new key instantly</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
              <CardContent className="py-4">
                <DollarSign className="w-6 h-6 text-emerald-600 mb-2" />
                <h3 className="text-sm font-bold text-gray-800 mb-1">Revenue Model: Pay-Per-Analysis + Subscription</h3>
                <p className="text-xs text-gray-600">Partners pay a base subscription for capacity, plus per-request fees for premium endpoints. Our AI costs ~$0.003/request to run, while we charge $0.02-$0.15 per call - that's 5x-50x margin on every request.</p>
              </CardContent>
            </Card>

            {PRICING_TIERS.map((t) => (
              <Card key={t.tier} className={`${t.color} ${t.popular ? 'ring-2 ring-blue-400' : ''}`}>
                <CardContent className="py-4">
                  {t.popular && <Badge className="bg-blue-600 text-white text-[10px] mb-2">Most Popular</Badge>}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800">{t.tier}</h3>
                      <p className="text-[10px] text-gray-500">{t.bestFor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{t.monthlyPrice}</p>
                      <p className="text-[10px] text-gray-400">/month</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-2">{t.limits}</p>
                  {t.perRequest !== "Volume discount" && (
                    <p className="text-[10px] text-gray-500 mb-2">+ {t.perRequest} per request over quota</p>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {t.features.map((f, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">{f}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="py-4">
                <h4 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" />Margin Analysis</h4>
                <div className="space-y-2 text-xs text-amber-700">
                  <div className="flex justify-between items-center">
                    <span>Bill Analysis (our cost)</span>
                    <span className="font-mono">~$0.003</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bill Analysis (we charge)</span>
                    <span className="font-mono font-bold">$0.15</span>
                  </div>
                  <div className="border-t border-amber-300 pt-1 flex justify-between items-center">
                    <span className="font-bold">Gross Margin</span>
                    <span className="font-mono font-bold text-emerald-700">98%</span>
                  </div>
                  <p className="text-[10px] mt-2">At Professional tier: 100K requests/mo = $499 subscription + $15,000 in per-request revenue. Our compute cost: ~$300. Net margin per customer: ~$15,199/mo.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <h4 className="text-sm font-bold text-gray-800 mb-2">Per-Request Pricing by Endpoint</h4>
                <div className="space-y-1.5">
                  {[
                    { endpoint: "Bill Analysis", cost: "$0.15", ourCost: "$0.003", margin: "98%" },
                    { endpoint: "Appeal Generation", cost: "$0.12", ourCost: "$0.003", margin: "97.5%" },
                    { endpoint: "Template Generation", cost: "$0.08", ourCost: "$0.001", margin: "98.8%" },
                    { endpoint: "Analytics Insights", cost: "$0.05", ourCost: "$0.001", margin: "98%" },
                    { endpoint: "Price Comparison", cost: "$0.02", ourCost: "$0.0005", margin: "97.5%" },
                    { endpoint: "Legal Rights Lookup", cost: "$0.01", ourCost: "$0.0001", margin: "99%" },
                    { endpoint: "CPT Code Lookup", cost: "$0.01", ourCost: "$0.0001", margin: "99%" },
                  ].map((e, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="flex-1 text-gray-700">{e.endpoint}</span>
                      <span className="font-mono text-blue-600 w-14 text-right">{e.cost}</span>
                      <span className="font-mono text-gray-400 w-16 text-right text-[10px]">(cost: {e.ourCost})</span>
                      <Badge className="bg-emerald-100 text-emerald-700 text-[9px] w-10 justify-center">{e.margin}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><Terminal className="w-4 h-4" />Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-gray-600">All requests require Bearer token authentication. Include your API key in the Authorization header:</p>
                <pre className="bg-slate-900 text-slate-200 rounded-lg p-3 text-[10px] overflow-x-auto font-mono">{`Authorization: Bearer grh_your_api_key_here`}</pre>
                <p className="text-xs text-gray-500">Rate limit headers are returned with every response:</p>
                <pre className="bg-slate-900 text-slate-200 rounded-lg p-3 text-[10px] overflow-x-auto font-mono">{`X-RateLimit-Limit: 300
X-RateLimit-Remaining: 299
X-Request-Cost: $0.15`}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><Zap className="w-4 h-4" />Quick Start Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">1. Analyze a Medical Bill</p>
                  <pre className="bg-slate-900 text-slate-200 rounded-lg p-3 text-[10px] overflow-x-auto font-mono whitespace-pre-wrap">{CODE_EXAMPLES.analyze}</pre>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">2. Compare Procedure Prices</p>
                  <pre className="bg-slate-900 text-slate-200 rounded-lg p-3 text-[10px] overflow-x-auto font-mono whitespace-pre-wrap">{CODE_EXAMPLES.compare}</pre>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">3. Generate a Dispute Letter</p>
                  <pre className="bg-slate-900 text-slate-200 rounded-lg p-3 text-[10px] overflow-x-auto font-mono whitespace-pre-wrap">{CODE_EXAMPLES.template}</pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><BookOpen className="w-4 h-4" />Available Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { method: "POST", path: "/v1/analyze", desc: "Analyze a medical bill", cost: "$0.15" },
                  { method: "GET", path: "/v1/prices", desc: "Compare procedure prices", cost: "$0.02" },
                  { method: "POST", path: "/v1/templates/generate", desc: "Generate dispute/appeal letter", cost: "$0.08" },
                  { method: "GET", path: "/v1/codes/:code", desc: "Look up CPT/medical code", cost: "$0.01" },
                  { method: "GET", path: "/v1/rights/:state", desc: "Get state legal rights", cost: "$0.01" },
                  { method: "GET", path: "/v1/analytics/overcharges", desc: "Overcharge statistics", cost: "$0.05" },
                  { method: "POST", path: "/v1/appeal/generate", desc: "Generate insurance appeal", cost: "$0.12" },
                  { method: "POST", path: "/v1/authenticate", desc: "Validate API key", cost: "Free" },
                ].map((e, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-b last:border-0">
                    <Badge className={`text-[10px] w-12 justify-center ${e.method === 'POST' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{e.method}</Badge>
                    <code className="text-xs font-mono text-gray-700 flex-1">{e.path}</code>
                    <span className="text-[10px] text-gray-400 hidden sm:inline">{e.desc}</span>
                    <Badge variant="outline" className="text-[9px]">{e.cost}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="py-4">
                <h4 className="text-sm font-medium text-slate-800 mb-2 flex items-center gap-2"><Shield className="w-4 h-4" />Webhook Verification</h4>
                <p className="text-xs text-slate-600 mb-2">Webhook payloads include an HMAC-SHA256 signature for verification:</p>
                <pre className="bg-slate-900 text-slate-200 rounded-lg p-3 text-[10px] overflow-x-auto font-mono whitespace-pre-wrap">{`// Verify webhook signature
const crypto = require('crypto');
const signature = req.headers['x-goldrock-signature'];
const expected = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(JSON.stringify(req.body))
  .digest('hex');
const verified = signature === expected;`}</pre>
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
