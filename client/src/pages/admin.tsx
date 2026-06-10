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
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </MobileLayout>
    );
  }

  if (!adminCheck?.isAdmin) {
    const isDesignatedAdmin = user?.email?.toLowerCase() === 'ryan@moonshineai.com';
    
    return (
      <MobileLayout title="Admin" showBackButton={true} showBottomNav={true}>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold font-serif text-foreground mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground mb-6">
            {isDesignatedAdmin 
              ? "Your account is designated as admin but hasn't been activated yet."
              : "You don't have permission to access this area."}
          </p>
          {isDesignatedAdmin && (
            <Button
              onClick={() => bootstrapMutation.mutate()}
              disabled={bootstrapMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary"
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
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}>
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform management and analytics</p>
        </motion.div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
            <TabsTrigger value="system" data-testid="tab-system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="luxury-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Users className="h-6 w-6 text-muted-foreground" />
                    <span className="text-2xl font-bold text-foreground">{stats?.totalUsers || 0}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Total Users</p>
                </CardContent>
              </Card>

              <Card className="luxury-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <DollarSign className="h-6 w-6 text-gold" />
                    <span className="text-2xl font-bold text-foreground">{stats?.activeSubscribers || 0}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Subscribers</p>
                </CardContent>
              </Card>

              <Card className="luxury-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <TrendingUp className="h-6 w-6 text-muted-foreground" />
                    <span className="text-2xl font-bold text-foreground">{stats?.recentSignups || 0}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">7-Day Signups</p>
                </CardContent>
              </Card>

              <Card className="luxury-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <UserCheck className="h-6 w-6 text-muted-foreground" />
                    <span className="text-2xl font-bold text-foreground">{stats?.usersWithAiTerms || 0}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">AI Terms Accepted</p>
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
                    <span className="text-muted-foreground">Monthly</span>
                    <span className="font-semibold text-foreground">{stats?.subscriptionBreakdown?.monthly || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Annual</span>
                    <span className="font-semibold text-foreground">{stats?.subscriptionBreakdown?.annual || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Lifetime</span>
                    <span className="font-semibold text-foreground">{stats?.subscriptionBreakdown?.lifetime || 0}</span>
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
                        <Bar dataKey="signups" fill="var(--gold)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-foreground">User Management</h3>
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
                <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {users?.slice(0, 50).map((u) => (
                  <Card key={u.id} className="bg-card" data-testid={`card-user-${u.id}`}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">
                            {u.firstName || u.lastName 
                              ? `${u.firstName || ''} ${u.lastName || ''}`.trim()
                              : 'No Name'}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{u.email || 'No email'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {u.isAdmin && (
                            <span className="px-2 py-0.5 bg-secondary text-gold text-xs rounded-full">
                              Admin
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            u.subscriptionStatus === 'active'
                              ? 'bg-secondary text-emerald-700 dark:text-emerald-400'
                              : 'bg-secondary text-muted-foreground'
                          }`}>
                            {u.subscriptionStatus === 'active' ? 'Premium' : 'Free'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Joined: {u.createdAt ? format(new Date(u.createdAt), 'MMM d, yyyy') : 'Unknown'}</span>
                        {u.acceptedAiTerms && <span className="text-emerald-700 dark:text-emerald-400">AI Terms ✓</span>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {users && users.length > 50 && (
                  <p className="text-center text-sm text-muted-foreground py-2">
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
                <div className="p-4 bg-secondary border border-border rounded-lg">
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    Data Cleanup
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Remove old analytics and session data to improve performance.
                    This will not affect user accounts or subscription data.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cleanupMutation.mutate(30)}
                    disabled={cleanupMutation.isPending}
                    className="border-border text-foreground hover:bg-muted"
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

                <div className="p-4 bg-secondary border border-border rounded-lg">
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    Platform Statistics
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Total Cases: {stats?.platformStats?.totalCasesCompleted || 0}</p>
                    <p>Total Bills Analyzed: {stats?.platformStats?.totalBillsAnalyzed || 0}</p>
                    <p>Total Savings Found: ${stats?.platformStats?.totalSavingsFound?.toLocaleString() || 0}</p>
                  </div>
                </div>

                <div className="p-4 bg-secondary border border-border rounded-lg">
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-gold" />
                    Refresh Data
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Refresh all dashboard statistics from the database.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      refetchStats();
                      refetchUsers();
                    }}
                    className="border-border text-foreground hover:bg-muted"
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
