import { Bell, GraduationCap, LogOut, User, Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "react-router-dom";
import { useAnnouncements } from "@/lib/supabase-data";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const LAST_SEEN_KEY = "edumaster.notifications.lastSeen";

export function AppHeader() {
  const { role, logout, user } = useAuth();
  const navigate = useNavigate();
  const { data: announcements = [] } = useAnnouncements();
  const qc = useQueryClient();
  const [lastSeen, setLastSeen] = useState<number>(() => {
    const v = localStorage.getItem(LAST_SEEN_KEY);
    return v ? parseInt(v, 10) : 0;
  });

  // Realtime: refetch announcements + toast on new one
  useEffect(() => {
    const channel = supabase
      .channel("announcements-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "announcements" },
        (payload: any) => {
          qc.invalidateQueries({ queryKey: ["announcements"] });
          if (role !== "admin") {
            toast.message(payload.new?.title || "New announcement", {
              description: payload.new?.message,
            });
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc, role]);

  // Realtime: notify teacher of new student questions (doubts + live chat)
  useEffect(() => {
    if (role !== "admin") return;
    const channel = supabase
      .channel("teacher-questions-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "doubts" },
        (payload: any) => {
          qc.invalidateQueries({ queryKey: ["doubts"] });
          toast.message(`New doubt from ${payload.new?.student_name || "a student"}`, {
            description: payload.new?.question,
            action: { label: "View", onClick: () => navigate("/admin/doubts") },
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "live_chat" },
        (payload: any) => {
          if (payload.new?.is_teacher) return;
          toast.message(`Live question from ${payload.new?.sender_name || "a student"}`, {
            description: payload.new?.message,
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [role, qc, navigate]);

  // Realtime: notify student when their doubt receives a teacher reply
  useEffect(() => {
    if (role === "admin" || !user?.id) return;
    const channel = supabase
      .channel(`doubt-replies-${user.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "doubts", filter: `user_id=eq.${user.id}` },
        (payload: any) => {
          const before = payload.old?.reply;
          const after = payload.new?.reply;
          if (after && after !== before) {
            qc.invalidateQueries({ queryKey: ["doubts"] });
            toast.success("Teacher replied to your doubt", {
              description: after,
              action: { label: "View", onClick: () => navigate("/doubts") },
            });
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [role, user?.id, qc, navigate]);

  // Reset unread count when on the notifications page
  useEffect(() => {
    const onRouteChange = () => {
      if (window.location.pathname === "/notifications") {
        const now = Date.now();
        localStorage.setItem(LAST_SEEN_KEY, String(now));
        setLastSeen(now);
      }
    };
    onRouteChange();
    window.addEventListener("popstate", onRouteChange);
    return () => window.removeEventListener("popstate", onRouteChange);
  }, []);

  const unread = useMemo(
    () => announcements.filter((a: any) => new Date(a.created_at).getTime() > lastSeen).length,
    [announcements, lastSeen]
  );

  const handleBellClick = () => {
    const now = Date.now();
    localStorage.setItem(LAST_SEEN_KEY, String(now));
    setLastSeen(now);
    navigate("/notifications");
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0d0d20]/80 backdrop-blur-xl border-b border-purple-500/10">
      <div className="px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo — mobile only (desktop uses sidebar) */}
          <div className="flex items-center gap-2.5 md:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                UPSC <span className="gradient-text">Nadiya</span>
              </h1>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                role === "super_admin"
                  ? "bg-amber-500/20 text-amber-400"
                  : role === "admin"
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-pink-500/20 text-pink-400"
              }`}>
                {role === "super_admin" ? "Super Admin" : role === "admin" ? "Teacher" : "Student"}
              </div>
            </div>
          </div>

          {/* Desktop: search bar + greeting */}
          <div className="hidden md:flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search courses, lectures, notes..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-purple-500/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 transition-all"
              />
            </div>
            <p className="text-sm font-semibold text-gray-300 whitespace-nowrap" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] ?? 'there'}</span>
            </p>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button
              onClick={handleBellClick}
              className="relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-purple-500/10 transition-all duration-200 flex items-center justify-center"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/30">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>

            {/* Profile — mobile only (sidebar handles it on desktop) */}
            <button
              onClick={() => navigate("/profile")}
              className="md:hidden w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-purple-500/10 transition-all duration-200 flex items-center justify-center"
            >
              <User className="w-5 h-5 text-gray-400" />
            </button>

            {/* Logout — mobile only */}
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="md:hidden w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 transition-all duration-200 flex items-center justify-center"
            >
              <LogOut className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
