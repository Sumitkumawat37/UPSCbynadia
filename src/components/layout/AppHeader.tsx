import { Bell, GraduationCap, LogOut, User } from "lucide-react";
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
    <header className="sticky top-0 z-30 glass border-b border-white/60 shadow-sm shadow-sky-100/50">
      <div className="px-4 md:px-8 py-2.5">
        <div className="flex items-center justify-between">
          {/* Logo — mobile only (desktop uses sidebar) */}
          <div className="flex items-center gap-2.5 md:hidden">
            <div className="relative w-9 h-9 rounded-2xl gradient-hero flex items-center justify-center shadow-lg shadow-sky-300/40 animate-float-slow">
              <GraduationCap className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                UPSC <span className="text-primary">Nadiya</span>
              </h1>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                role === "admin"
                  ? "bg-violet-100 text-violet-600"
                  : "bg-sky-100 text-sky-600"
              }`}>
                <span className={`w-1 h-1 rounded-full ${role === "admin" ? "bg-violet-500" : "bg-sky-500"} animate-pulse`} />
                {role === "admin" ? "Teacher" : "Student"}
              </div>
            </div>
          </div>

          {/* Desktop: greeting text */}
          <div className="hidden md:flex items-center gap-2">
            <p className="text-sm font-bold text-slate-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Welcome back, <span className="text-primary">{user?.name?.split(' ')[0] ?? 'there'}</span> 👋
            </p>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            {/* Notifications */}
            <button
              onClick={handleBellClick}
              className="relative w-9 h-9 rounded-2xl bg-white/80 hover:bg-white transition-all duration-200 flex items-center justify-center shadow-sm shadow-sky-100 border border-sky-100 hover:shadow-md hover:border-sky-200 hover:scale-105 active:scale-95"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-gradient-to-r from-red-400 to-rose-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold shadow-md animate-pop-in">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>

            {/* Profile — mobile only (sidebar handles it on desktop) */}
            <button
              onClick={() => navigate("/profile")}
              className="md:hidden w-9 h-9 rounded-2xl bg-white/80 hover:bg-white transition-all duration-200 flex items-center justify-center shadow-sm shadow-sky-100 border border-sky-100 hover:shadow-md hover:scale-105 active:scale-95"
            >
              <User className="w-4 h-4 text-slate-600" />
            </button>

            {/* Logout — mobile only */}
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="md:hidden w-9 h-9 rounded-2xl bg-red-50 hover:bg-red-100 transition-all duration-200 flex items-center justify-center border border-red-100 hover:border-red-200 hover:scale-105 active:scale-95"
            >
              <LogOut className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
