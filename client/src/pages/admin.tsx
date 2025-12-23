import { MobileLayout, MobileCard } from "@/components/mobile-layout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { Shield, Users, TrendingUp, DollarSign, Activity, Settings, AlertTriangle, RefreshCw, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format, parseISO, subDays } from "date-fns";
import type { User } from "@shared/schema";

interface AdminStats {
  totalUsers: number;
  activeSubscribers: number;
  trialUsers: number;
  usersWithAiTerms: number;
  recentSignups: number;
  dailySignups: Record<string, number>;
  platformStats: any;
  subscriptionBreakdown: {
    monthly: number;
    annual: number;
    lifetime: number;
  };
}

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isBootstrapping, setIsBootstrapping] = useState(false);

  const { data: adminCheck, isLoading: checkingAdmin } = useQuery<{ isAdmin: boolean; email: string }>({
    queryKey: ['/api/admin/check'],
  });

  const { data: stats, isLoading: loadingStats, refetch: refetchStats } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    enabled: adminCheck?.isAdmin === true,
  });

  const { data: users, isLoading: loadingUsers, refetch: refetchUsers } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    enabled: adminCheck?.isAdmin === true,
  });

  const bootstrapMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/admin/bootstrap', {});
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Admin access granted", description: "You now have admin access." });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/check'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Bootstrap failed", 
        description: error.message || "Could not grant admin access.",
        variant: "destructive"
      });
    }
  });

  const cleanupMutation = useMutation({
    mutationFn: async (retentionDays: number) => {
      const res = await apiRequest('POST', '/api/admin/cleanup-old-data', { retentionDays });
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Cleanup complete", description: `Cleaned up old data.` });
    },
    onError: (error: any) => {
      toast({ 
        title: "Cleanup failed", 
        description: error.message || "Could not cleanup data.",
        variant: "destructive"
      });
    }
  });

  const chartData = stats?.dailySignups 
    ? Object.entries(stats.dailySignups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({
          date: format(parseISO(date), 'MMM dd'),
          signups: count
        }))
    : [];

  if (checkingAdmin) {
    return (
      <MobileLayout title="Admin" showBackButton={true} showBottomNav={true}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      </MobileLayout>
    );
  }

  if (!adminCheck?.isAdmin) {
    const isDesignatedAdmin = user?.email?.toLowerCase() === 'ryan@moonshineai.com';
    
    return (
      <MobileLayout title="Admin" showBackButton={true} showBottomNav={true}>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
          <p className="text-gray-600 mb-6">
            {isDesignatedAdmin 
              ? "Your account is designated as admin but hasn't been activated yet."
              : "You don't have permission to access this area."}
          </p>
          {isDesignatedAdmin && (
            <Button
              onClick={() => bootstrapMutation.mutate()}
              disabled={bootstrapMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700"
              data-testid="button-bootstrap-admin"
            >
              {bootstrapMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Activate Admin Access
                </>
              )}
            </Button>
          )}
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Admin Dashboard" showBackButton={true} showBottomNav={true}>
      <div className="space-y-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Platform management and analytics</p>
        </motion.div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
            <TabsTrigger value="system" data-testid="tab-system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Users className="h-6 w-6 opacity-80" />
                    <span className="text-2xl font-bold">{stats?.totalUsers || 0}</span>
                  </div>
                  <p className="text-sm opacity-80 mt-1">Total Users</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <DollarSign className="h-6 w-6 opacity-80" />
                    <span className="text-2xl font-bold">{stats?.activeSubscribers || 0}</span>
                  </div>
                  <p className="text-sm opacity-80 mt-1">Subscribers</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <TrendingUp className="h-6 w-6 opacity-80" />
                    <span className="text-2xl font-bold">{stats?.recentSignups || 0}</span>
                  </div>
                  <p className="text-sm opacity-80 mt-1">7-Day Signups</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <UserCheck className="h-6 w-6 opacity-80" />
                    <span className="text-2xl font-bold">{stats?.usersWithAiTerms || 0}</span>
                  </div>
                  <p className="text-sm opacity-80 mt-1">AI Terms Accepted</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subscription Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly</span>
                    <span className="font-semibold">{stats?.subscriptionBreakdown?.monthly || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Annual</span>
                    <span className="font-semibold">{stats?.subscriptionBreakdown?.annual || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Lifetime</span>
                    <span className="font-semibold">{stats?.subscriptionBreakdown?.lifetime || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {chartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Daily Signups (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 10 }}
                          interval="preserveStartEnd"
                        />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="signups" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">User Management</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => refetchUsers()}
                data-testid="button-refresh-users"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {loadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {users?.slice(0, 50).map((u) => (
                  <Card key={u.id} className="bg-white" data-testid={`card-user-${u.id}`}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">
                            {u.firstName || u.lastName 
                              ? `${u.firstName || ''} ${u.lastName || ''}`.trim()
                              : 'No Name'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{u.email || 'No email'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {u.isAdmin && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                              Admin
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            u.subscriptionStatus === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {u.subscriptionStatus === 'active' ? 'Premium' : 'Free'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Joined: {u.createdAt ? format(new Date(u.createdAt), 'MMM d, yyyy') : 'Unknown'}</span>
                        {u.acceptedAiTerms && <span className="text-green-600">AI Terms ✓</span>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {users && users.length > 50 && (
                  <p className="text-center text-sm text-gray-500 py-2">
                    Showing first 50 of {users.length} users
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Controls</CardTitle>
                <CardDescription>Administrative actions for platform management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Data Cleanup
                  </h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Remove old analytics and session data to improve performance.
                    This will not affect user accounts or subscription data.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cleanupMutation.mutate(30)}
                    disabled={cleanupMutation.isPending}
                    className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                    data-testid="button-cleanup-data"
                  >
                    {cleanupMutation.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Cleaning...
                      </>
                    ) : (
                      'Run Cleanup (30 days)'
                    )}
                  </Button>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Platform Statistics
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Total Cases: {stats?.platformStats?.totalCasesCompleted || 0}</p>
                    <p>Total Bills Analyzed: {stats?.platformStats?.totalBillsAnalyzed || 0}</p>
                    <p>Total Savings Found: ${stats?.platformStats?.totalSavingsFound?.toLocaleString() || 0}</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh Data
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Refresh all dashboard statistics from the database.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      refetchStats();
                      refetchUsers();
                    }}
                    className="border-blue-300 text-blue-800 hover:bg-blue-100"
                    data-testid="button-refresh-all"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}
