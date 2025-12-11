import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Activity, ArrowLeft, Heart, Thermometer, Scale, TrendingUp, TrendingDown,
  Plus, Calendar, Clock, Droplet, Wind, Brain, Sparkles, BarChart3
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface HealthMetric {
  id: string;
  type: string;
  value: number;
  unit: string;
  timestamp: Date;
  notes?: string;
}

const DEMO_BP_DATA = [
  { date: 'Mon', systolic: 128, diastolic: 82 },
  { date: 'Tue', systolic: 125, diastolic: 80 },
  { date: 'Wed', systolic: 130, diastolic: 85 },
  { date: 'Thu', systolic: 122, diastolic: 78 },
  { date: 'Fri', systolic: 126, diastolic: 81 },
  { date: 'Sat', systolic: 124, diastolic: 79 },
  { date: 'Today', systolic: 120, diastolic: 76 },
];

const DEMO_HR_DATA = [
  { date: 'Mon', value: 72 },
  { date: 'Tue', value: 75 },
  { date: 'Wed', value: 68 },
  { date: 'Thu', value: 70 },
  { date: 'Fri', value: 74 },
  { date: 'Sat', value: 71 },
  { date: 'Today', value: 69 },
];

const DEMO_WEIGHT_DATA = [
  { date: 'Week 1', value: 175 },
  { date: 'Week 2', value: 174.5 },
  { date: 'Week 3', value: 173.8 },
  { date: 'Week 4', value: 173.2 },
];

export default function HealthMetrics() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form states for adding new readings
  const [newBpSystolic, setNewBpSystolic] = useState("");
  const [newBpDiastolic, setNewBpDiastolic] = useState("");
  const [newHeartRate, setNewHeartRate] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [newTemp, setNewTemp] = useState("");

  const getBpStatus = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return { status: 'Normal', color: 'bg-green-500' };
    if (systolic < 130 && diastolic < 80) return { status: 'Elevated', color: 'bg-yellow-500' };
    if (systolic < 140 || diastolic < 90) return { status: 'High Stage 1', color: 'bg-orange-500' };
    return { status: 'High Stage 2', color: 'bg-red-500' };
  };

  const handleAddReading = (type: string) => {
    toast({
      title: "Reading Added",
      description: `Your ${type} reading has been logged successfully`,
    });
    // Reset form
    setNewBpSystolic("");
    setNewBpDiastolic("");
    setNewHeartRate("");
    setNewWeight("");
    setNewTemp("");
  };

  const currentBp = DEMO_BP_DATA[DEMO_BP_DATA.length - 1];
  const bpStatus = getBpStatus(currentBp.systolic, currentBp.diastolic);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 pt-12 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/clinical-command">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 mb-4 -ml-2" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Clinical Command Center
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="heading-health-metrics">Health Metrics Dashboard</h1>
              <p className="text-white/80 text-sm">Track and visualize your vital signs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="vitals" className="text-xs">Vitals</TabsTrigger>
            <TabsTrigger value="weight" className="text-xs">Weight</TabsTrigger>
            <TabsTrigger value="log" className="text-xs">Log</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Blood Pressure Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-5 w-5" />
                      <span className="text-sm font-medium text-white/80">Blood Pressure</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {currentBp.systolic}/{currentBp.diastolic}
                    </div>
                    <div className="text-xs text-white/70">mmHg</div>
                    <Badge className={`${bpStatus.color} mt-2 text-xs`}>
                      {bpStatus.status}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Heart Rate Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-5 w-5" />
                      <span className="text-sm font-medium text-white/80">Heart Rate</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {DEMO_HR_DATA[DEMO_HR_DATA.length - 1].value}
                    </div>
                    <div className="text-xs text-white/70">bpm</div>
                    <Badge className="bg-green-500 mt-2 text-xs">Normal</Badge>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Weight Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Scale className="h-5 w-5" />
                      <span className="text-sm font-medium text-white/80">Weight</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {DEMO_WEIGHT_DATA[DEMO_WEIGHT_DATA.length - 1].value}
                    </div>
                    <div className="text-xs text-white/70">lbs</div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-green-300">
                      <TrendingDown className="h-3 w-3" />
                      -1.8 lbs this month
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Temperature Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-5 w-5" />
                      <span className="text-sm font-medium text-white/80">Temperature</span>
                    </div>
                    <div className="text-2xl font-bold">98.6</div>
                    <div className="text-xs text-white/70">F</div>
                    <Badge className="bg-green-500 mt-2 text-xs">Normal</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Blood Pressure Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-red-500" />
                  Blood Pressure Trend (7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={DEMO_BP_DATA}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis domain={[60, 150]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="systolic" stroke="#ef4444" fill="#fee2e2" name="Systolic" />
                      <Area type="monotone" dataKey="diastolic" stroke="#3b82f6" fill="#dbeafe" name="Diastolic" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Heart Rate Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  Heart Rate Trend (7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={DEMO_HR_DATA}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis domain={[50, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} name="BPM" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vitals Tab */}
          <TabsContent value="vitals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Log Vital Signs</CardTitle>
                <CardDescription>Record your current measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Blood Pressure */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Blood Pressure
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder="Systolic"
                      value={newBpSystolic}
                      onChange={(e) => setNewBpSystolic(e.target.value)}
                      className="w-24"
                      data-testid="input-bp-systolic"
                    />
                    <span className="text-gray-400">/</span>
                    <Input
                      type="number"
                      placeholder="Diastolic"
                      value={newBpDiastolic}
                      onChange={(e) => setNewBpDiastolic(e.target.value)}
                      className="w-24"
                      data-testid="input-bp-diastolic"
                    />
                    <span className="text-sm text-gray-500">mmHg</span>
                    <Button 
                      size="sm" 
                      onClick={() => handleAddReading('blood pressure')}
                      className="bg-red-500 hover:bg-red-600"
                      data-testid="button-add-bp"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Heart Rate */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-500" />
                    Heart Rate
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder="BPM"
                      value={newHeartRate}
                      onChange={(e) => setNewHeartRate(e.target.value)}
                      className="w-24"
                      data-testid="input-heart-rate"
                    />
                    <span className="text-sm text-gray-500">bpm</span>
                    <Button 
                      size="sm" 
                      onClick={() => handleAddReading('heart rate')}
                      className="bg-purple-500 hover:bg-purple-600"
                      data-testid="button-add-hr"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Temperature */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    Temperature
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="98.6"
                      value={newTemp}
                      onChange={(e) => setNewTemp(e.target.value)}
                      className="w-24"
                      data-testid="input-temperature"
                    />
                    <span className="text-sm text-gray-500">F</span>
                    <Button 
                      size="sm" 
                      onClick={() => handleAddReading('temperature')}
                      className="bg-orange-500 hover:bg-orange-600"
                      data-testid="button-add-temp"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reference Ranges */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Normal Ranges Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Blood Pressure</span>
                    <span className="text-gray-600">Less than 120/80 mmHg</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Resting Heart Rate</span>
                    <span className="text-gray-600">60-100 bpm</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Body Temperature</span>
                    <span className="text-gray-600">97.8-99.1 F</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Respiratory Rate</span>
                    <span className="text-gray-600">12-20 breaths/min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weight Tab */}
          <TabsContent value="weight" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-500" />
                  Weight Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Enter weight"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-32"
                    data-testid="input-weight"
                  />
                  <span className="text-sm text-gray-500">lbs</span>
                  <Button 
                    onClick={() => handleAddReading('weight')}
                    className="bg-blue-500 hover:bg-blue-600"
                    data-testid="button-add-weight"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Log Weight
                  </Button>
                </div>

                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={DEMO_WEIGHT_DATA}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name="Weight (lbs)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Weight Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">173.2</div>
                    <div className="text-xs text-gray-500">Current</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">-1.8</div>
                    <div className="text-xs text-gray-500">This Month</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">170</div>
                    <div className="text-xs text-gray-500">Goal</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Log Tab */}
          <TabsContent value="log" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Readings</CardTitle>
                <CardDescription>Your health measurements history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'Blood Pressure', value: '120/76 mmHg', time: 'Today, 8:30 AM', icon: Heart, color: 'text-red-500' },
                    { type: 'Heart Rate', value: '69 bpm', time: 'Today, 8:30 AM', icon: Activity, color: 'text-purple-500' },
                    { type: 'Weight', value: '173.2 lbs', time: 'Today, 7:00 AM', icon: Scale, color: 'text-blue-500' },
                    { type: 'Blood Pressure', value: '124/79 mmHg', time: 'Yesterday, 9:15 AM', icon: Heart, color: 'text-red-500' },
                    { type: 'Heart Rate', value: '71 bpm', time: 'Yesterday, 9:15 AM', icon: Activity, color: 'text-purple-500' },
                  ].map((reading, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <reading.icon className={`h-5 w-5 ${reading.color}`} />
                        <div>
                          <div className="font-medium">{reading.type}</div>
                          <div className="text-xs text-gray-500">{reading.time}</div>
                        </div>
                      </div>
                      <div className="font-semibold">{reading.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <MobileBottomNav />
    </div>
  );
}
