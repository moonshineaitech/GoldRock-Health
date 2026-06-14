import { MobileLayout, MobileCard } from "@/components/mobile-layout";
import { AccountDeletion } from "@/components/account-deletion";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Bell, Shield, FileText, HelpCircle, AlertTriangle, Smartphone, Wifi, WifiOff, LogOut, Edit2, Save, ChevronRight, Crown, Download, Trash2, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { notificationService } from "@/lib/notification-service";
import { offlineService } from "@/lib/offline-service";
import { useToast } from "@/hooks/use-toast";

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  billReminders: boolean;
  weeklyDigest: boolean;
  language: string;
  timezone: string;
}

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const { data: adminCheck } = useQuery<{ isAdmin: boolean; email: string }>({
    queryKey: ['/api/admin/check'],
  });

  const { data: preferences, isLoading: loadingPrefs } = useQuery<UserPreferences>({
    queryKey: ['/api/user/preferences'],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profileForm) => {
      const res = await apiRequest('PATCH', '/api/user/profile', data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Profile updated", description: "Your profile has been saved." });
      setEditingProfile(false);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Update failed", 
        description: error.message || "Could not update profile.",
        variant: "destructive"
      });
    }
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (prefs: Partial<UserPreferences>) => {
      const res = await apiRequest('PATCH', '/api/user/preferences', prefs);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Preferences saved" });
      queryClient.invalidateQueries({ queryKey: ['/api/user/preferences'] });
    },
    onError: () => {
      toast({ 
        title: "Update failed", 
        description: "Could not save preferences.",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      });
    }
  }, [user]);

  useEffect(() => {
    checkNotificationStatus();
    checkOnlineStatus();
  }, []);

  const checkNotificationStatus = () => {
    setNotificationsEnabled(Notification.permission === 'granted');
  };

  const checkOnlineStatus = () => {
    setIsOnline(offlineService.getOnlineStatus());
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await notificationService.requestPermission();
      if (granted) {
        setNotificationsEnabled(true);
        await notificationService.registerPushToken();
        await notificationService.showNotification({
          title: 'Notifications Enabled!',
          body: 'You\'ll now receive updates on bill analysis and savings',
        });
        updatePreferencesMutation.mutate({ pushNotifications: true });
      }
    }
  };

  const handlePreferenceToggle = (key: keyof UserPreferences, value: boolean) => {
    updatePreferencesMutation.mutate({ [key]: value });
  };

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/user/export-data', {
        credentials: 'include'
      });
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Export complete", description: "Your data has been downloaded." });
    } catch (error) {
      toast({ 
        title: "Export failed", 
        description: "Could not export your data.",
        variant: "destructive"
      });
    }
  };

  return (
    <MobileLayout title="Settings" showBackButton={true} showBottomNav={true}>
      <div className="space-y-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm"
            style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
          >
            <SettingsIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-serif font-semibold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </motion.div>

        {adminCheck?.isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link href="/admin">
              <MobileCard className="cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between py-2" data-testid="link-admin-dashboard">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
                    >
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Admin Dashboard</h3>
                      <p className="text-sm text-muted-foreground">Manage users and platform</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </MobileCard>
            </Link>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-3 px-1">
            Profile
          </h2>
          <MobileCard>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
                  >
                    {user?.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt="Profile" className="w-12 h-12 rounded-2xl" />
                    ) : (
                      <User className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {user?.firstName || user?.lastName 
                        ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
                        : 'Set your name'}
                    </p>
                    <p className="text-sm text-muted-foreground">{user?.email || 'No email'}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingProfile(true)}
                  data-testid="button-edit-profile"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Subscription</span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      user?.subscriptionStatus === 'active'
                        ? 'text-white'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                    style={user?.subscriptionStatus === 'active'
                      ? { background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }
                      : undefined}
                  >
                    {user?.subscriptionStatus === 'active' ? 'Premium' : 'Free Plan'}
                  </span>
                </div>
                {user?.subscriptionStatus !== 'active' && (
                  <Link href="/premium">
                    <Button
                      className="w-full mt-2 text-white hover:opacity-95"
                      style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
                      data-testid="button-upgrade-premium"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </MobileCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-3 px-1">
            Notifications
          </h2>
          <MobileCard>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Get alerts for analysis updates</p>
                  </div>
                </div>
                <Switch
                  checked={notificationsEnabled && (preferences?.pushNotifications ?? true)}
                  onCheckedChange={toggleNotifications}
                  data-testid="toggle-push-notifications"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Bill Reminders</p>
                    <p className="text-sm text-muted-foreground">Reminders for upcoming bills</p>
                  </div>
                </div>
                <Switch
                  checked={preferences?.billReminders ?? true}
                  onCheckedChange={(v) => handlePreferenceToggle('billReminders', v)}
                  data-testid="toggle-bill-reminders"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Weekly Digest</p>
                    <p className="text-sm text-muted-foreground">Summary of your savings</p>
                  </div>
                </div>
                <Switch
                  checked={preferences?.weeklyDigest ?? true}
                  onCheckedChange={(v) => handlePreferenceToggle('weeklyDigest', v)}
                  data-testid="toggle-weekly-digest"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Marketing Emails</p>
                    <p className="text-sm text-muted-foreground">Tips and offers</p>
                  </div>
                </div>
                <Switch
                  checked={preferences?.marketingEmails ?? false}
                  onCheckedChange={(v) => handlePreferenceToggle('marketingEmails', v)}
                  data-testid="toggle-marketing-emails"
                />
              </div>
            </div>
          </MobileCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-3 px-1">
            Appearance
          </h2>
          <MobileCard>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
                    {resolvedTheme === 'dark' ? (
                      <Moon className="h-4 w-4 text-gold" />
                    ) : (
                      <Sun className="h-4 w-4 text-gold" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Theme</p>
                    <p className="text-sm text-muted-foreground">Choose your preferred appearance</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    theme === 'light'
                      ? 'bg-secondary'
                      : 'border-border hover:shadow-sm'
                  }`}
                  style={theme === 'light' ? { borderColor: 'var(--gold)' } : undefined}
                  data-testid="button-theme-light"
                >
                  <Sun className={`h-5 w-5 ${theme === 'light' ? 'text-gold' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${theme === 'light' ? 'text-gold' : 'text-muted-foreground'}`}>Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    theme === 'dark'
                      ? 'bg-secondary'
                      : 'border-border hover:shadow-sm'
                  }`}
                  style={theme === 'dark' ? { borderColor: 'var(--gold)' } : undefined}
                  data-testid="button-theme-dark"
                >
                  <Moon className={`h-5 w-5 ${theme === 'dark' ? 'text-gold' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gold' : 'text-muted-foreground'}`}>Dark</span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    theme === 'system'
                      ? 'bg-secondary'
                      : 'border-border hover:shadow-sm'
                  }`}
                  style={theme === 'system' ? { borderColor: 'var(--gold)' } : undefined}
                  data-testid="button-theme-system"
                >
                  <Monitor className={`h-5 w-5 ${theme === 'system' ? 'text-gold' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${theme === 'system' ? 'text-gold' : 'text-muted-foreground'}`}>System</span>
                </button>
              </div>
            </div>
          </MobileCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-3 px-1">
            App Status
          </h2>
          <MobileCard>
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isOnline ? 'bg-emerald-100 dark:bg-emerald-950' : 'bg-amber-100 dark:bg-amber-950'
                }`}>
                  {isOnline ? (
                    <Wifi className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">Connection Status</p>
                  <p className="text-sm text-muted-foreground">
                    {isOnline ? 'Online - Data syncing' : 'Offline - Changes pending'}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isOnline ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
              }`}>
                {isOnline ? 'Connected' : 'Offline'}
              </span>
            </div>
          </MobileCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-3 px-1">
            Privacy & Legal
          </h2>
          <MobileCard>
            <div className="divide-y divide-border">
              <Link href="/data-security">
                <div className="flex items-center justify-between py-3 hover:bg-secondary transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Data Security</span>
                      <p className="text-xs text-muted-foreground">Manage your health data &amp; privacy</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
              <Link href="/privacy-policy">
                <div className="flex items-center justify-between py-3 hover:bg-secondary transition-colors cursor-pointer" data-testid="link-privacy-policy">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium text-foreground">Privacy Policy</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
              <Link href="/terms-of-service">
                <div className="flex items-center justify-between py-3 hover:bg-secondary transition-colors cursor-pointer" data-testid="link-terms-of-service">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium text-foreground">Terms of Service</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
              <Link href="/support">
                <div className="flex items-center justify-between py-3 hover:bg-secondary transition-colors cursor-pointer" data-testid="link-support">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium text-foreground">Help & Support</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            </div>
          </MobileCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-3 px-1">
            Medical Disclaimer
          </h2>
          <MobileCard className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start space-x-3 py-1">
              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-amber-900 dark:text-amber-100">Important Medical Notice</p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  This app provides educational information and billing analysis only. Not medical advice. Always consult a licensed physician for health decisions.
                </p>
              </div>
            </div>
          </MobileCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-3 px-1">
            Data Management
          </h2>
          <MobileCard>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExportData}
                data-testid="button-export-data"
              >
                <Download className="h-4 w-4 mr-3" />
                Export My Data
              </Button>
            </div>
          </MobileCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-3 px-1">
            Danger Zone
          </h2>
          <AccountDeletion userEmail={user?.email || undefined} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <a href="/api/logout" className="block">
            <MobileCard className="hover:bg-secondary transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 py-1">
                <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">Log Out</h3>
                  <p className="text-sm text-muted-foreground">Sign out of your account</p>
                </div>
              </div>
            </MobileCard>
          </a>
        </motion.div>
      </div>

      <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm(p => ({ ...p, firstName: e.target.value }))}
                placeholder="Enter your first name"
                data-testid="input-first-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm(p => ({ ...p, lastName: e.target.value }))}
                placeholder="Enter your last name"
                data-testid="input-last-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                placeholder="Enter your email"
                data-testid="input-email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProfile(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => updateProfileMutation.mutate(profileForm)}
              disabled={updateProfileMutation.isPending}
              data-testid="button-save-profile"
            >
              {updateProfileMutation.isPending ? (
                'Saving...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
