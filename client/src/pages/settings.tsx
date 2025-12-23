import { MobileLayout, MobileCard } from "@/components/mobile-layout";
import { AccountDeletion } from "@/components/account-deletion";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Bell, Shield, FileText, HelpCircle, AlertTriangle, Smartphone, Wifi, WifiOff, LogOut, Edit2, Save, ChevronRight, Crown, Download, Trash2 } from "lucide-react";
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
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <SettingsIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </motion.div>

        {adminCheck?.isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link href="/admin">
              <MobileCard className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white cursor-pointer hover:opacity-95 transition-opacity">
                <div className="flex items-center justify-between py-2" data-testid="link-admin-dashboard">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">Admin Dashboard</h3>
                      <p className="text-sm text-white/80">Manage users and platform</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/80" />
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
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Profile
          </h2>
          <MobileCard>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    {user?.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt="Profile" className="w-12 h-12 rounded-2xl" />
                    ) : (
                      <User className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user?.firstName || user?.lastName 
                        ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
                        : 'Set your name'}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email || 'No email'}</p>
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

              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Subscription</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    user?.subscriptionStatus === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user?.subscriptionStatus === 'active' ? 'Premium' : 'Free Plan'}
                  </span>
                </div>
                {user?.subscriptionStatus !== 'active' && (
                  <Link href="/premium">
                    <Button className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" data-testid="button-upgrade-premium">
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
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Notifications
          </h2>
          <MobileCard>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-500">Get alerts for analysis updates</p>
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
                  <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                    <Bell className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Bill Reminders</p>
                    <p className="text-sm text-gray-500">Reminders for upcoming bills</p>
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
                  <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FileText className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Weekly Digest</p>
                    <p className="text-sm text-gray-500">Summary of your savings</p>
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
                  <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Bell className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Marketing Emails</p>
                    <p className="text-sm text-gray-500">Tips and offers</p>
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
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            App Status
          </h2>
          <MobileCard>
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isOnline ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {isOnline ? (
                    <Wifi className="h-4 w-4 text-green-600" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">Connection Status</p>
                  <p className="text-sm text-gray-500">
                    {isOnline ? 'Online - Data syncing' : 'Offline - Changes pending'}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isOnline ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
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
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Privacy & Legal
          </h2>
          <MobileCard>
            <div className="divide-y divide-gray-100">
              <Link href="/privacy-policy">
                <div className="flex items-center justify-between py-3 hover:bg-gray-50 transition-colors cursor-pointer" data-testid="link-privacy-policy">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Shield className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">Privacy Policy</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </Link>
              <Link href="/terms-of-service">
                <div className="flex items-center justify-between py-3 hover:bg-gray-50 transition-colors cursor-pointer" data-testid="link-terms-of-service">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FileText className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">Terms of Service</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </Link>
              <Link href="/support">
                <div className="flex items-center justify-between py-3 hover:bg-gray-50 transition-colors cursor-pointer" data-testid="link-support">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                      <HelpCircle className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">Help & Support</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
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
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Medical Disclaimer
          </h2>
          <MobileCard className="bg-amber-50 border border-amber-200">
            <div className="flex items-start space-x-3 py-1">
              <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-amber-900">Important Medical Notice</p>
                <p className="text-sm text-amber-700 mt-1">
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
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
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
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
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
            <MobileCard className="hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 py-1">
                <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">Log Out</h3>
                  <p className="text-sm text-gray-600">Sign out of your account</p>
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
