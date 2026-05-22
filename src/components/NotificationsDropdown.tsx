import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import {
  Bell, Check, CheckCircle, Trophy, Video, MessageCircle, Megaphone,
  ChevronRight, X, Loader2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  category: "quiz_result" | "new_lecture" | "live_class" | "doubt_reply" | "announcement";
  link?: string;
  is_read: boolean;
  created_at: string;
}

const categoryIcons: Record<string, any> = {
  quiz_result: Trophy,
  new_lecture: Video,
  live_class: Video,
  doubt_reply: MessageCircle,
  announcement: Megaphone,
};

const categoryColors: Record<string, string> = {
  quiz_result: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  new_lecture: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  live_class: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  doubt_reply: "text-green-400 bg-green-500/10 border-green-500/20",
  announcement: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

const NotificationsDropdown = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from("notifications" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20) as any;
      
      setNotifications(data || []);
      setUnreadCount(data?.filter((n: any) => !n.is_read).length || 0);
    } catch {
      console.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await supabase.from("notifications" as any).update({ is_read: true }).eq("id", id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      await supabase.from("notifications" as any).update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      window.location.href = notification.link;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) loadNotifications(); }}
        className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-400 hover:text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-96 max-h-[500px] bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-down">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} size="sm" variant="ghost" className="text-xs">
                  <Check className="w-3.5 h-3.5 mr-1" /> Mark all read
                </Button>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => {
                    const Icon = categoryIcons[notification.category] || Bell;
                    const colorClass = categoryColors[notification.category] || "text-gray-400 bg-gray-500/10 border-gray-500/20";
                    
                    return (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${!notification.is_read ? "bg-purple-500/5" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${colorClass}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-foreground line-clamp-1">{notification.title}</p>
                              {!notification.is_read && <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-1.5" />}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{notification.message}</p>
                            <p className="text-[10px] text-gray-500 mt-1.5">
                              {new Date(notification.created_at).toLocaleDateString()} at {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border text-center">
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-xs text-muted-foreground">
                Close
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsDropdown;
