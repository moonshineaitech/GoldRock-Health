import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { HealthMetric } from "@shared/schema";
import {
  Activity, ArrowLeft, Heart, Thermometer, Scale, TrendingDown, TrendingUp,
  Plus, BarChart3, Loader2, Trash2, AlertTriangle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const getBpStatus = (sys: number) => {
  if (sys < 120) return { label: 'Normal', color: 'bg-green-500' };
  if (sys < 130) return { label: 'Elevated', color: 'bg-yellow-500' };
  if (sys < 140) return { label: 'High', color: 'bg-orange-500' };
  return { label: 'Very High', color: 'bg-red-500' };
};

const getHrStatus = (bpm: number) => {
  if (bpm >= 60 && bpm <= 100) return { label: 'Normal', color: 'bg-green-500' };
  if (bpm < 60) return { label: 'Low', color: 'bg-yellow-500' };
  return { label: 'High', color: 'bg-orange-500' };
};

const getTempStatus = (temp: number) => {
  if (temp >= 97.8 && temp <= 99.1) return { label: 'Normal', color: 'bg-green-500' };
  if (temp > 100.4) return { label: 'Fever', color: 'bg-red-500' };
  if (temp > 99.1) return { label: 'Elevated', color: 'bg-yellow-500' };
  return { label: 'Low', color: 'bg-gold' };
};

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return d.toLocaleDateString('en-US', { weekday: 'short' });
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function HealthMetrics() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showLogForm, setShowLogForm] = useState(false);
  const [bpSys, setBpSys] = useState("");
  const [bpDia, setBpDia] = useState("");
  const [hr, setHr] = useState("");
  const [weight, setWeight] = useState("");
  const [temp, setTemp] = useState("");

  const { data: metrics = [], isLoading } = useQuery<HealthMetric[]>({
    queryKey: ['/api/health-metrics'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { type: string; systolic?: string; diastolic?: string; heartRate?: string; weight?: string; temperature?: string }) => {
      const response = await apiRequest("POST", "/api/health-metrics", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/health-metrics'] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error?.message || "Failed to save reading", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/health-metrics/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/health-metrics'] });
      toast({ title: "Deleted", description: "Reading removed" });
    },
  });

  const handleLogBp = () => {
    if (!bpSys || !bpDia) { toast({ title: "Missing values", description: "Enter both systolic and diastolic", variant: "destructive" }); return; }
    createMutation.mutate({ type: 'bp', systolic: bpSys, diastolic: bpDia }, {
      onSuccess: () => { setBpSys(""); setBpDia(""); toast({ title: "Logged", description: "Blood pressure recorded" }); }
    });
  };

  const handleLogHr = () => {
    if (!hr) { toast({ title: "Missing value", description: "Enter heart rate", variant: "destructive" }); return; }
    createMutation.mutate({ type: 'hr', heartRate: hr }, {
      onSuccess: () => { setHr(""); toast({ title: "Logged", description: "Heart rate recorded" }); }
    });
  };

  const handleLogWeight = () => {
    if (!weight) { toast({ title: "Missing value", description: "Enter weight", variant: "destructive" }); return; }
    createMutation.mutate({ type: 'weight', weight: weight }, {
      onSuccess: () => { setWeight(""); toast({ title: "Logged", description: "Weight recorded" }); }
    });
  };

  const handleLogTemp = () => {
    if (!temp) { toast({ title: "Missing value", description: "Enter temperature", variant: "destructive" }); return; }
    createMutation.mutate({ type: 'temp', temperature: temp }, {
      onSuccess: () => { setTemp(""); toast({ title: "Logged", description: "Temperature recorded" }); }
    });
  };

  const bpData = metrics
    .filter(m => m.type === 'bp' && m.systolic && m.diastolic)
    .slice(0, 14)
    .reverse()
    .map(m => ({ day: formatDate(m.recordedAt!), sys: m.systolic!, dia: m.diastolic! }));

  const hrData = metrics
    .filter(m => m.type === 'hr' && m.heartRate)
    .slice(0, 14)
    .reverse()
    .map(m => ({ day: formatDate(m.recordedAt!), bpm: m.heartRate! }));

  const weightData = metrics
    .filter(m => m.type === 'weight' && m.weight)
    .slice(0, 14)
    .reverse()
    .map(m => ({ day: formatDate(m.recordedAt!), lbs: m.weight! }));

  const latestBp = metrics.find(m => m.type === 'bp' && m.systolic);
  const latestHr = metrics.find(m => m.type === 'hr' && m.heartRate);
  const latestWeight = metrics.find(m => m.type === 'weight' && m.weight);
  const latestTemp = metrics.find(m => m.type === 'temp' && m.temperature);

  const hasAnyData = metrics.length > 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-card border-b border-border px-4 pt-12 pb-6">
        <div className="max-w-lg mx-auto">
          <Link href="/clinical-command-center">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-secondary mb-3 -ml-2 h-8 text-sm" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-serif text-foreground" data-testid="heading-health-metrics">Health Tracker</h1>
                <p className="text-muted-foreground text-xs">Your vital signs at a glance</p>
              </div>
            </div>
            <Button
              onClick={() => setShowLogForm(!showLogForm)}
              className="bg-primary text-primary-foreground hover:opacity-90 h-9"
              data-testid="button-log"
            >
              <Plus className="h-4 w-4 mr-1" /> Log
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        <AnimatePresence>
          {showLogForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Log New Reading</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" /> Blood Pressure
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input type="number" placeholder="120" value={bpSys} onChange={(e) => setBpSys(e.target.value)} className="w-20" data-testid="input-bp-sys" />
                      <span className="text-muted-foreground">/</span>
                      <Input type="number" placeholder="80" value={bpDia} onChange={(e) => setBpDia(e.target.value)} className="w-20" data-testid="input-bp-dia" />
                      <span className="text-xs text-muted-foreground">mmHg</span>
                      <Button size="sm" onClick={handleLogBp} disabled={createMutation.isPending} className="bg-primary text-primary-foreground hover:opacity-90 h-8">
                        {createMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" /> Heart Rate
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input type="number" placeholder="70" value={hr} onChange={(e) => setHr(e.target.value)} className="w-20" data-testid="input-hr" />
                      <span className="text-xs text-muted-foreground">bpm</span>
                      <Button size="sm" onClick={handleLogHr} disabled={createMutation.isPending} className="bg-primary text-primary-foreground hover:opacity-90 h-8">
                        {createMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <Scale className="h-4 w-4 text-muted-foreground" /> Weight
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input type="number" step="0.1" placeholder="170" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-24" data-testid="input-weight" />
                      <span className="text-xs text-muted-foreground">lbs</span>
                      <Button size="sm" onClick={handleLogWeight} disabled={createMutation.isPending} className="bg-primary text-primary-foreground hover:opacity-90 h-8">
                        {createMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-muted-foreground" /> Temperature
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input type="number" step="0.1" placeholder="98.6" value={temp} onChange={(e) => setTemp(e.target.value)} className="w-24" data-testid="input-temp" />
                      <span className="text-xs text-muted-foreground">°F</span>
                      <Button size="sm" onClick={handleLogTemp} disabled={createMutation.isPending} className="bg-primary text-primary-foreground hover:opacity-90 h-8">
                        {createMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        )}

        {!isLoading && !hasAnyData && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">Start Tracking Your Health</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tap the "Log" button above to record your first blood pressure, heart rate, weight, or temperature reading.
              </p>
              <Button onClick={() => setShowLogForm(true)} className="bg-primary text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4 mr-1" /> Log Your First Reading
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && hasAnyData && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs text-muted-foreground">Blood Pressure</span>
                    </div>
                    {latestBp ? (
                      <>
                        <div className="text-2xl font-bold">{latestBp.systolic}/{latestBp.diastolic}</div>
                        <div className="text-xs text-muted-foreground mb-1">mmHg</div>
                        <Badge className={`${getBpStatus(latestBp.systolic!).color} text-xs`}>{getBpStatus(latestBp.systolic!).label}</Badge>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground mt-2">No readings yet</div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Activity className="h-4 w-4" />
                      <span className="text-xs text-muted-foreground">Heart Rate</span>
                    </div>
                    {latestHr ? (
                      <>
                        <div className="text-2xl font-bold">{latestHr.heartRate}</div>
                        <div className="text-xs text-muted-foreground mb-1">bpm</div>
                        <Badge className={`${getHrStatus(latestHr.heartRate!).color} text-xs`}>{getHrStatus(latestHr.heartRate!).label}</Badge>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground mt-2">No readings yet</div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Scale className="h-4 w-4" />
                      <span className="text-xs text-muted-foreground">Weight</span>
                    </div>
                    {latestWeight ? (
                      <>
                        <div className="text-2xl font-bold">{latestWeight.weight}</div>
                        <div className="text-xs text-muted-foreground mb-1">lbs</div>
                        {weightData.length >= 2 && (
                          <div className="flex items-center gap-1 text-xs">
                            {weightData[weightData.length - 1].lbs <= weightData[0].lbs ? (
                              <><TrendingDown className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> <span className="text-emerald-600 dark:text-emerald-400">{(weightData[weightData.length - 1].lbs - weightData[0].lbs).toFixed(1)}</span></>
                            ) : (
                              <><TrendingUp className="h-3 w-3 text-amber-600 dark:text-amber-400" /> <span className="text-amber-600 dark:text-amber-400">+{(weightData[weightData.length - 1].lbs - weightData[0].lbs).toFixed(1)}</span></>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground mt-2">No readings yet</div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Thermometer className="h-4 w-4" />
                      <span className="text-xs text-muted-foreground">Temperature</span>
                    </div>
                    {latestTemp ? (
                      <>
                        <div className="text-2xl font-bold">{latestTemp.temperature}</div>
                        <div className="text-xs text-muted-foreground mb-1">°F</div>
                        <Badge className={`${getTempStatus(latestTemp.temperature!).color} text-xs`}>{getTempStatus(latestTemp.temperature!).label}</Badge>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground mt-2">No readings yet</div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {bpData.length >= 2 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" /> Blood Pressure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={bpData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                        <YAxis domain={[60, 160]} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="sys" stroke="#ef4444" fill="#fee2e2" name="Systolic" />
                        <Area type="monotone" dataKey="dia" stroke="#a16207" fill="#fef3c7" name="Diastolic" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {hrData.length >= 2 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" /> Heart Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={hrData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                        <YAxis domain={[50, 110]} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="bpm" stroke="#b8860b" strokeWidth={2} dot={{ fill: '#b8860b', r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {weightData.length >= 2 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Scale className="h-4 w-4 text-muted-foreground" /> Weight Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weightData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                        <YAxis domain={['dataMin - 3', 'dataMax + 3']} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="lbs" stroke="#b8860b" strokeWidth={2} dot={{ fill: '#b8860b', r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Readings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {metrics.slice(0, 20).map((m) => (
                    <div key={m.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          m.type === 'bp' ? 'bg-secondary' :
                          m.type === 'hr' ? 'bg-secondary' :
                          m.type === 'weight' ? 'bg-secondary' :
                          'bg-secondary'
                        }`}>
                          {m.type === 'bp' && <Heart className="h-4 w-4 text-muted-foreground" />}
                          {m.type === 'hr' && <Activity className="h-4 w-4 text-muted-foreground" />}
                          {m.type === 'weight' && <Scale className="h-4 w-4 text-muted-foreground" />}
                          {m.type === 'temp' && <Thermometer className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {m.type === 'bp' && `${m.systolic}/${m.diastolic} mmHg`}
                            {m.type === 'hr' && `${m.heartRate} bpm`}
                            {m.type === 'weight' && `${m.weight} lbs`}
                            {m.type === 'temp' && `${m.temperature}°F`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {m.recordedAt ? formatDate(m.recordedAt) : ''}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(m.id)}
                        disabled={deleteMutation.isPending}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Normal Ranges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="dark:text-gray-200">Blood Pressure</span>
                <span className="text-muted-foreground">Below 120/80 mmHg</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="dark:text-gray-200">Resting Heart Rate</span>
                <span className="text-muted-foreground">60-100 bpm</span>
              </div>
              <div className="flex justify-between py-1.5 border-border">
                <span className="dark:text-gray-200">Body Temperature</span>
                <span className="text-muted-foreground">97.8-99.1°F</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/80 dark:bg-amber-900/20 dark:border-amber-800">
          <CardContent className="p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              <strong>For personal tracking only.</strong> This tool helps you log and visualize your health readings. Always consult your doctor for medical advice and interpretation of your vital signs.
            </p>
          </CardContent>
        </Card>
      </div>

      <MobileBottomNav />
    </div>
  );
}
