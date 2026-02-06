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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2, Users, DollarSign, TrendingUp, BarChart3, Plus,
  Mail, UserPlus, CheckCircle2, Clock, Shield, ArrowRight,
  Loader2, Download, Settings, Award, Heart, Sparkles,
  Briefcase, Globe, PieChart, Target
} from "lucide-react";
import { Link } from "wouter";

function CreateOrgForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "", domain: "", industry: "", size: "",
    contactName: "", contactEmail: "", contactPhone: ""
  });

  const create = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/employer/orgs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employer/orgs"] });
      toast({ title: "Organization created!" });
      onClose();
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <Label>Company Name</Label>
        <Input placeholder="e.g., Acme Corporation" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Email Domain</Label>
          <Input placeholder="e.g., acme.com" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
        </div>
        <div>
          <Label>Company Size</Label>
          <Select value={form.size} onValueChange={(v) => setForm({ ...form, size: v })}>
            <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1-50">1-50</SelectItem>
              <SelectItem value="51-200">51-200</SelectItem>
              <SelectItem value="201-1000">201-1,000</SelectItem>
              <SelectItem value="1001-5000">1,001-5,000</SelectItem>
              <SelectItem value="5001+">5,001+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Industry</Label>
        <Select value={form.industry} onValueChange={(v) => setForm({ ...form, industry: v })}>
          <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
          <SelectContent>
            {["Technology", "Healthcare", "Finance", "Manufacturing", "Retail", "Education", "Government", "Non-profit", "Other"].map((i) => (
              <SelectItem key={i} value={i}>{i}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>HR Contact Name</Label>
        <Input placeholder="Full name" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Contact Email</Label>
          <Input type="email" placeholder="hr@acme.com" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
        </div>
        <div>
          <Label>Contact Phone</Label>
          <Input placeholder="(555) 123-4567" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
        </div>
      </div>
      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => create.mutate(form)} disabled={create.isPending || !form.name}>
        {create.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Building2 className="w-4 h-4 mr-2" />}
        Create Organization
      </Button>
    </div>
  );
}

function InviteMemberForm({ orgId, onClose }: { orgId: string; onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [emails, setEmails] = useState("");

  const invite = useMutation({
    mutationFn: (data: any) => apiRequest("POST", `/api/employer/orgs/${orgId}/invite`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employer/orgs", orgId, "members"] });
      toast({ title: "Invitations sent!" });
      onClose();
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <Label>Employee Email Addresses</Label>
        <Textarea placeholder="Enter email addresses, one per line" value={emails} onChange={(e) => setEmails(e.target.value)} rows={4} />
        <p className="text-xs text-gray-500 mt-1">Each employee will receive an invitation to join GoldRock Health through your company plan</p>
      </div>
      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => invite.mutate({ emails: emails.split('\n').map(e => e.trim()).filter(Boolean) })} disabled={invite.isPending || !emails.trim()}>
        {invite.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
        Send Invitations
      </Button>
    </div>
  );
}

function OrgDashboard({ org }: { org: any }) {
  const [inviteOpen, setInviteOpen] = useState(false);

  const { data: members = [] } = useQuery<any[]>({
    queryKey: ["/api/employer/orgs", org.id, "members"],
  });

  const { data: usage } = useQuery<any>({
    queryKey: ["/api/employer/orgs", org.id, "usage"],
  });

  const activeMembers = members.filter((m: any) => m.status === "active").length;
  const invitedMembers = members.filter((m: any) => m.status === "invited").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{org.name}</h3>
          <p className="text-xs text-gray-500">{org.industry} · {org.size} employees</p>
        </div>
        <Badge className={org.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}>
          {org.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-3 text-center">
            <Users className="w-5 h-5 mx-auto text-blue-600 mb-1" />
            <p className="text-2xl font-bold text-blue-700">{activeMembers}</p>
            <p className="text-xs text-blue-600">Active Members</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="py-3 text-center">
            <DollarSign className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
            <p className="text-2xl font-bold text-emerald-700">${(usage?.totalSavingsGenerated || 0).toLocaleString()}</p>
            <p className="text-xs text-emerald-600">Total Savings</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="py-3 text-center">
            <BarChart3 className="w-5 h-5 mx-auto text-purple-600 mb-1" />
            <p className="text-2xl font-bold text-purple-700">{usage?.billsAnalyzed || 0}</p>
            <p className="text-xs text-purple-600">Bills Analyzed</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="py-3 text-center">
            <Target className="w-5 h-5 mx-auto text-amber-600 mb-1" />
            <p className="text-2xl font-bold text-amber-700">${(usage?.averageSavingsPerUser || 0).toLocaleString()}</p>
            <p className="text-xs text-amber-600">Avg per Employee</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Team Members ({members.length})</CardTitle>
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700"><UserPlus className="w-3 h-3 mr-1" />Invite</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Invite Employees</DialogTitle></DialogHeader>
              <InviteMemberForm orgId={org.id} onClose={() => setInviteOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No members yet. Invite your team to get started.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {members.map((m: any) => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{m.email}</p>
                    <p className="text-xs text-gray-500">{m.role}</p>
                  </div>
                  <Badge className={m.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                    {m.status === "active" ? "Active" : "Invited"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {usage?.topStrategies?.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" />Top Strategies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {usage.topStrategies.map((s: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{s.strategy}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{s.count} uses</span>
                  <Badge className="bg-emerald-100 text-emerald-700">${s.savings.toLocaleString()}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function EmployerPortal() {
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [tab, setTab] = useState("dashboard");

  const { data: orgs = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/employer/orgs"],
    enabled: !!user,
  });

  const currentOrg = orgs[0];

  return (
    <MobileLayout title="Employer Benefits">
      <div className="space-y-6 pb-20">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
          <Briefcase className="w-8 h-8 mb-2 text-blue-200" />
          <h2 className="text-xl font-bold mb-1">Employee Benefits Portal</h2>
          <p className="text-blue-200 text-sm">Offer GoldRock Health as an employee benefit. Help your team save on medical bills while reducing healthcare costs.</p>
        </motion.div>

        {!currentOrg ? (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: DollarSign, label: "Avg $2,800 saved per employee/year", color: "text-emerald-600", bg: "bg-emerald-50" },
                { icon: Heart, label: "Reduces employee financial stress", color: "text-pink-600", bg: "bg-pink-50" },
                { icon: TrendingUp, label: "Lower healthcare utilization costs", color: "text-blue-600", bg: "bg-blue-50" },
              ].map((v, i) => (
                <Card key={i} className={`${v.bg} border-none`}>
                  <CardContent className="py-3 text-center">
                    <v.icon className={`w-6 h-6 mx-auto ${v.color} mb-1`} />
                    <p className="text-[10px] text-gray-600">{v.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">How It Works for Employers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { step: 1, title: "Create Your Organization", desc: "Set up your company profile and benefit plan" },
                  { step: 2, title: "Invite Employees", desc: "Send email invitations to your team" },
                  { step: 3, title: "Employees Save Money", desc: "Team members use AI tools to reduce medical bills" },
                  { step: 4, title: "Track ROI", desc: "See aggregate savings and engagement analytics" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</div>
                    <div>
                      <p className="text-sm font-medium">{s.title}</p>
                      <p className="text-xs text-gray-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Starter", price: "$5", per: "employee/mo", features: ["Up to 50 employees", "AI bill analysis", "Dispute templates", "Email support"] },
                  { name: "Professional", price: "$8", per: "employee/mo", features: ["Up to 500 employees", "Everything in Starter", "Usage analytics dashboard", "Priority support", "Custom branding"] },
                  { name: "Enterprise", price: "Custom", per: "", features: ["Unlimited employees", "Everything in Professional", "API access", "Dedicated success manager", "HRIS integration"] },
                ].map((plan) => (
                  <div key={plan.name} className="border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{plan.name}</h4>
                      <div className="text-right">
                        <span className="text-lg font-bold text-blue-600">{plan.price}</span>
                        {plan.per && <span className="text-xs text-gray-500">/{plan.per}</span>}
                      </div>
                    </div>
                    <div className="space-y-1">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />{f}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base">
                  <Building2 className="w-5 h-5 mr-2" />Set Up Your Organization
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Create Organization</DialogTitle></DialogHeader>
                <CreateOrgForm onClose={() => setCreateOpen(false)} />
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <OrgDashboard org={currentOrg} />
        )}

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-blue-500" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-800">Questions about employer plans?</h4>
                <p className="text-xs text-blue-600">CONTACT@GOLDROCK.ai</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}