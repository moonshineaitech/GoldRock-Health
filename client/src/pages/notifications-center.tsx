import { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell, BellOff, Clock, AlertTriangle, CheckCircle2, Calendar,
  DollarSign, FileText, Shield, Trash2, Eye, ExternalLink,
  Loader2, Inbox, Settings, Filter
} from "lucide-react";
import { Link } from "wouter";

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  deadline: { icon: Clock, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10" },
  savings: { icon: DollarSign, color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  update: { icon: FileText, color: "text-muted-foreground", bg: "bg-secondary" },
  alert: { icon: AlertTriangle, color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-500/10" },
  program: { icon: Shield, color: "text-muted-foreground", bg: "bg-secondary" },
  milestone: { icon: CheckCircle2, color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
};

function NotificationCard({ notification, onRead, onDismiss }: { notification: any; onRead: (id: string) => void; onDismiss: (id: string) => void }) {
  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.update;
  const Icon = config.icon;
  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-xl border p-4 transition-all ${notification.read ? 'bg-card border-border' : 'bg-card border-gold shadow-sm'}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={`text-sm font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>{notification.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{notification.message}</p>
            </div>
            {!notification.read && <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0 mt-1.5" />}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-muted-foreground">{timeAgo}</span>
            {notification.priority === "urgent" && <Badge className="bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300 text-[10px]">Urgent</Badge>}
            <div className="flex-1" />
            {!notification.read && (
              <Button size="sm" variant="ghost" className="h-6 text-xs text-muted-foreground hover:text-gold" onClick={() => onRead(notification.id)}>
                <Eye className="w-3 h-3 mr-1" />Read
              </Button>
            )}
            {notification.actionUrl && (
              <Link href={notification.actionUrl}>
                <Button size="sm" variant="ghost" className="h-6 text-xs text-gold"><ExternalLink className="w-3 h-3 mr-1" />View</Button>
              </Link>
            )}
            <Button size="sm" variant="ghost" className="h-6 text-xs text-muted-foreground hover:text-destructive" onClick={() => onDismiss(notification.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getTimeAgo(date: string) {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return then.toLocaleDateString();
}

export default function NotificationsCenter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("all");

  const { data: notifications = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/notifications"],
    enabled: !!user,
  });

  const markRead = useMutation({
    mutationFn: (id: string) => apiRequest("PATCH", `/api/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/notifications"] }),
  });

  const dismiss = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({ title: "Notification dismissed" });
    },
  });

  const markAllRead = useMutation({
    mutationFn: () => apiRequest("POST", "/api/notifications/mark-all-read"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({ title: "All notifications marked as read" });
    },
  });

  const unreadCount = notifications.filter((n: any) => !n.read).length;
  const filtered = tab === "all" ? notifications : tab === "unread" ? notifications.filter((n: any) => !n.read) : notifications.filter((n: any) => n.type === tab);

  return (
    <MobileLayout title="Notifications" subtitle={`${unreadCount} unread`}>
      <div className="space-y-4 pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{notifications.length} notifications</span>
          </div>
          {unreadCount > 0 && (
            <Button size="sm" variant="outline" onClick={() => markAllRead.mutate()} disabled={markAllRead.isPending}>
              <CheckCircle2 className="w-3 h-3 mr-1" />Mark All Read
            </Button>
          )}
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
            <TabsTrigger value="deadline">Deadlines</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="bg-secondary border-dashed border-border">
            <CardContent className="py-12 text-center">
              <Inbox className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-serif font-semibold text-foreground mb-1">
                {tab === "unread" ? "All caught up!" : "No notifications yet"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {tab === "unread" ? "You've read all your notifications" : "We'll notify you about bill deadlines, savings opportunities, and more"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((n: any) => (
                <NotificationCard key={n.id} notification={n} onRead={(id) => markRead.mutate(id)} onDismiss={(id) => dismiss.mutate(id)} />
              ))}
            </AnimatePresence>
          </div>
        )}

        <Card className="bg-secondary border-border">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-gold" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground">Notification Preferences</h4>
                <p className="text-xs text-muted-foreground">Control what notifications you receive</p>
              </div>
              <Link href="/settings">
                <Button size="sm" variant="outline" className="border-border">Settings</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}