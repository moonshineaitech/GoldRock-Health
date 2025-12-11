import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Activity, ArrowLeft, Heart, Thermometer, Scale, TrendingDown,
  Plus, BarChart3
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const DEMO_BP = [
  { day: 'Mon', sys: 128, dia: 82 },
  { day: 'Tue', sys: 125, dia: 80 },
  { day: 'Wed', sys: 130, dia: 85 },
  { day: 'Thu', sys: 122, dia: 78 },
  { day: 'Fri', sys: 126, dia: 81 },
  { day: 'Sat', sys: 124, dia: 79 },
  { day: 'Today', sys: 120, dia: 76 },
];

const DEMO_HR = [
  { day: 'Mon', bpm: 72 },
  { day: 'Tue', bpm: 75 },
  { day: 'Wed', bpm: 68 },
  { day: 'Thu', bpm: 70 },
  { day: 'Fri', bpm: 74 },
  { day: 'Sat', bpm: 71 },
  { day: 'Today', bpm: 69 },
];

const DEMO_WEIGHT = [
  { week: 'Wk 1', lbs: 175 },
  { week: 'Wk 2', lbs: 174.5 },
  { week: 'Wk 3', lbs: 173.8 },
  { week: 'Wk 4', lbs: 173.2 },
];

export default function HealthMetrics() {
  const { toast } = useToast();
  const [showLogForm, setShowLogForm] = useState(false);
  const [bpSys, setBpSys] = useState("");
  const [bpDia, setBpDia] = useState("");
  const [hr, setHr] = useState("");
  const [weight, setWeight] = useState("");
  const [temp, setTemp] = useState("");

  const currentBp = DEMO_BP[DEMO_BP.length - 1];
  const currentHr = DEMO_HR[DEMO_HR.length - 1];
  const currentWeight = DEMO_WEIGHT[DEMO_WEIGHT.length - 1];

  const getBpStatus = (sys: number) => {
    if (sys < 120) return { label: 'Normal', color: 'bg-green-500' };
    if (sys < 130) return { label: 'Elevated', color: 'bg-yellow-500' };
    if (sys < 140) return { label: 'High', color: 'bg-orange-500' };
    return { label: 'Very High', color: 'bg-red-500' };
  };

  const bpStatus = getBpStatus(currentBp.sys);

  const handleLog = (type: string) => {
    toast({ title: "Logged", description: `${type} recorded successfully` });
    setBpSys(""); setBpDia(""); setHr(""); setWeight(""); setTemp("");
    setShowLogForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 pt-12 pb-6">
        <div className="max-w-lg mx-auto">
          <Link href="/clinical-command-center">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 mb-3 -ml-2 h-8 text-sm" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" data-testid="heading-health-metrics">Health Tracker</h1>
                <p className="text-white/80 text-xs">Your vital signs at a glance</p>
              </div>
            </div>
            <Button
              onClick={() => setShowLogForm(!showLogForm)}
              className="bg-white/20 hover:bg-white/30 h-9"
              data-testid="button-log"
            >
              <Plus className="h-4 w-4 mr-1" /> Log
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Log Form */}
        {showLogForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Log New Reading</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Blood Pressure */}
                <div className="space-y-2">
                  <Label className="text-sm flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" /> Blood Pressure
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="120"
                      value={bpSys}
                      onChange={(e) => setBpSys(e.target.value)}
                      className="w-20"
                      data-testid="input-bp-sys"
                    />
                    <span className="text-gray-400">/</span>
                    <Input
                      type="number"
                      placeholder="80"
                      value={bpDia}
                      onChange={(e) => setBpDia(e.target.value)}
                      className="w-20"
                      data-testid="input-bp-dia"
                    />
                    <span className="text-xs text-gray-500">mmHg</span>
                    <Button size="sm" onClick={() => handleLog('Blood pressure')} className="bg-red-500 hover:bg-red-600 h-8">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Heart Rate */}
                <div className="space-y-2">
                  <Label className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-500" /> Heart Rate
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="70"
                      value={hr}
                      onChange={(e) => setHr(e.target.value)}
                      className="w-20"
                      data-testid="input-hr"
                    />
                    <span className="text-xs text-gray-500">bpm</span>
                    <Button size="sm" onClick={() => handleLog('Heart rate')} className="bg-purple-500 hover:bg-purple-600 h-8">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <Label className="text-sm flex items-center gap-2">
                    <Scale className="h-4 w-4 text-blue-500" /> Weight
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="170"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-24"
                      data-testid="input-weight"
                    />
                    <span className="text-xs text-gray-500">lbs</span>
                    <Button size="sm" onClick={() => handleLog('Weight')} className="bg-blue-500 hover:bg-blue-600 h-8">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Temperature */}
                <div className="space-y-2">
                  <Label className="text-sm flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" /> Temperature
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="98.6"
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                      className="w-24"
                      data-testid="input-temp"
                    />
                    <span className="text-xs text-gray-500">F</span>
                    <Button size="sm" onClick={() => handleLog('Temperature')} className="bg-orange-500 hover:bg-orange-600 h-8">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs text-white/80">Blood Pressure</span>
                </div>
                <div className="text-2xl font-bold">{currentBp.sys}/{currentBp.dia}</div>
                <div className="text-xs text-white/70 mb-1">mmHg</div>
                <Badge className={`${bpStatus.color} text-xs`}>{bpStatus.label}</Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <Activity className="h-4 w-4" />
                  <span className="text-xs text-white/80">Heart Rate</span>
                </div>
                <div className="text-2xl font-bold">{currentHr.bpm}</div>
                <div className="text-xs text-white/70 mb-1">bpm</div>
                <Badge className="bg-green-500 text-xs">Normal</Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <Scale className="h-4 w-4" />
                  <span className="text-xs text-white/80">Weight</span>
                </div>
                <div className="text-2xl font-bold">{currentWeight.lbs}</div>
                <div className="text-xs text-white/70 mb-1">lbs</div>
                <div className="flex items-center gap-1 text-xs text-green-300">
                  <TrendingDown className="h-3 w-3" /> -1.8 this month
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <Thermometer className="h-4 w-4" />
                  <span className="text-xs text-white/80">Temperature</span>
                </div>
                <div className="text-2xl font-bold">98.6</div>
                <div className="text-xs text-white/70 mb-1">F</div>
                <Badge className="bg-green-500 text-xs">Normal</Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Blood Pressure Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-red-500" /> Blood Pressure (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DEMO_BP}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis domain={[60, 150]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="sys" stroke="#ef4444" fill="#fee2e2" name="Systolic" />
                  <Area type="monotone" dataKey="dia" stroke="#3b82f6" fill="#dbeafe" name="Diastolic" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Heart Rate Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" /> Heart Rate (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DEMO_HR}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="bpm" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weight Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Scale className="h-4 w-4 text-blue-500" /> Weight Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DEMO_WEIGHT}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                  <YAxis domain={['dataMin - 3', 'dataMax + 3']} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="lbs" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="font-bold text-gray-900">{currentWeight.lbs}</div>
                <div className="text-xs text-gray-500">Current</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="font-bold text-green-600">-1.8</div>
                <div className="text-xs text-gray-500">Change</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="font-bold text-blue-600">170</div>
                <div className="text-xs text-gray-500">Goal</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reference Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Normal Ranges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b">
                <span>Blood Pressure</span>
                <span className="text-gray-600">Below 120/80 mmHg</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span>Resting Heart Rate</span>
                <span className="text-gray-600">60-100 bpm</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Body Temperature</span>
                <span className="text-gray-600">97.8-99.1 F</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <MobileBottomNav />
    </div>
  );
}
