import { useNavigate } from "react-router-dom";
import { useCourses, useProfiles, useUserRoles, useLectures, useAllPurchases } from "@/lib/supabase-data";
import { useAuth } from "@/lib/auth-context";
import {
  Crown, Users, GraduationCap, BookOpen, Video, ShoppingCart,
  UserCog, Megaphone, MessageCircle, Trophy, Lock, BarChart3,
  TrendingUp, Activity, UserCheck, Star,
} from "lucide-react";

const SUPER_ADMIN_EMAILS = ["superadmin@demo.com"];

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: profiles = [] } = useProfiles();
  const { data: userRoles = [] } = useUserRoles();
  const { data: courses = [] } = useCourses();
  const { data: lectures = [] } = useLectures();
  const { data: purchases = [] } = useAllPurchases();

  const totalTeachers = profiles.filter((p) =>
    userRoles.some((r) => r.user_id === p.user_id && r.role === "admin") &&
    !SUPER_ADMIN_EMAILS.includes((p.email ?? "").toLowerCase())
  ).length;

  const totalStudents = profiles.filter((p) =>
    !userRoles.some((r) => r.user_id === p.user_id && r.role === "admin") &&
    !SUPER_ADMIN_EMAILS.includes((p.email ?? "").toLowerCase())
  ).length;

  const stats = [
    { label: "Total Users",  value: profiles.length,   icon: Users,       from: "from-amber-400",  to: "to-orange-500",   to_path: "/superadmin/users" },
    { label: "Teachers",     value: totalTeachers,      icon: UserCheck,   from: "from-violet-400", to: "to-purple-500",   to_path: "/superadmin/users" },
    { label: "Students",     value: totalStudents,      icon: GraduationCap, from: "from-sky-400",  to: "to-cyan-500",     to_path: "/admin/students" },
    { label: "Courses",      value: courses.length,     icon: BookOpen,    from: "from-emerald-400",to: "to-teal-500",     to_path: "/admin/content" },
    { label: "Lectures",     value: lectures.length,    icon: Video,       from: "from-pink-400",   to: "to-rose-500",     to_path: "/admin/content" },
    { label: "Purchases",    value: purchases.length,   icon: ShoppingCart,from: "from-indigo-400", to: "to-blue-500",     to_path: "/admin/access" },
  ];

  const quickActions = [
    { label: "User Management",  desc: "Add / promote / remove users",   icon: UserCog,       path: "/superadmin/users",        bg: "bg-amber-50",  iconBg: "bg-amber-100 text-amber-600",   border: "border-amber-100" },
    { label: "Content",          desc: "Courses, chapters & lectures",    icon: BookOpen,      path: "/admin/content",           bg: "bg-sky-50",    iconBg: "bg-sky-100 text-sky-600",       border: "border-sky-100" },
    { label: "Students",         desc: "View all registered students",    icon: GraduationCap, path: "/admin/students",          bg: "bg-emerald-50",iconBg: "bg-emerald-100 text-emerald-600",border: "border-emerald-100" },
    { label: "Quizzes",          desc: "Create & manage quiz tests",      icon: Trophy,        path: "/admin/quizzes",           bg: "bg-violet-50", iconBg: "bg-violet-100 text-violet-600", border: "border-violet-100" },
    { label: "Announcements",    desc: "Post updates & notices",          icon: Megaphone,     path: "/admin/announcements",     bg: "bg-rose-50",   iconBg: "bg-rose-100 text-rose-600",     border: "border-rose-100" },
    { label: "Doubts",           desc: "Review & reply to queries",       icon: MessageCircle, path: "/admin/doubts",            bg: "bg-cyan-50",   iconBg: "bg-cyan-100 text-cyan-600",     border: "border-cyan-100" },
    { label: "Live Classes",     desc: "Schedule & manage live sessions", icon: Activity,      path: "/admin/live",              bg: "bg-pink-50",   iconBg: "bg-pink-100 text-pink-600",     border: "border-pink-100" },
    { label: "Course Access",    desc: "Grant / revoke course access",    icon: Lock,          path: "/admin/access",            bg: "bg-indigo-50", iconBg: "bg-indigo-100 text-indigo-600", border: "border-indigo-100" },
  ];

  const recentUsers = [...profiles].slice(0, 6);

  const getRoleLabel = (userId: string, email: string) => {
    if (SUPER_ADMIN_EMAILS.includes((email ?? "").toLowerCase())) return { label: "Admin", cls: "bg-amber-100 text-amber-700" };
    if (userRoles.some((r) => r.user_id === userId && r.role === "admin")) return { label: "Teacher", cls: "bg-violet-100 text-violet-700" };
    return { label: "Student", cls: "bg-sky-100 text-sky-700" };
  };

  return (
    <div className="space-y-5 animate-slide-up">

      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl p-5 shadow-xl"
        style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 40%, #b45309 100%)" }}>
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full blur-2xl animate-blob" />
        <div className="absolute bottom-0 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-blob-2" />
        <div className="absolute top-4 left-4 w-4 h-4 bg-white/30 rounded-full animate-float" />
        <div className="absolute top-8 right-20 w-3 h-3 bg-yellow-200/60 rounded-full animate-float-reverse" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Platform Admin</p>
              <h1 className="text-xl font-extrabold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
                Welcome, {user?.name?.split(" ")[0] ?? "Admin"} 👑
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
              <Star className="w-3 h-3 text-yellow-200" />
              <span className="text-white text-[10px] font-bold">Full Platform Control</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
              <TrendingUp className="w-3 h-3 text-white" />
              <span className="text-white text-[10px] font-bold">{profiles.length} registered users</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
              <BarChart3 className="w-3 h-3 text-white" />
              <span className="text-white text-[10px] font-bold">{purchases.length} total purchases</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              onClick={() => navigate(s.to_path)}
              className="bg-white rounded-2xl p-3 text-center shadow-sm border border-slate-50 hover:shadow-md transition-all active:scale-95 group"
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.from} ${s.to} flex items-center justify-center mx-auto mb-1.5 shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className={`text-lg font-extrabold bg-gradient-to-br ${s.from} ${s.to} bg-clip-text text-transparent`}>{s.value}</p>
              <p className="text-[9px] text-slate-400 font-semibold">{s.label}</p>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-0.5">Quick Actions</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.label}
                onClick={() => navigate(a.path)}
                className={`${a.bg} rounded-2xl p-3.5 text-left border ${a.border} hover:shadow-md transition-all active:scale-95 group`}
              >
                <div className={`w-9 h-9 rounded-xl ${a.iconBg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-700">{a.label}</p>
                <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{a.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Users */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Users</p>
          <button
            onClick={() => navigate("/superadmin/users")}
            className="text-[10px] font-bold text-amber-600 hover:underline"
          >
            View All →
          </button>
        </div>
        <div className="space-y-2">
          {recentUsers.map((p, i) => {
            const roleInfo = getRoleLabel(p.user_id, p.email ?? "");
            const initials = (p.name ?? p.email ?? "U").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl px-3.5 py-2.5 flex items-center gap-3 shadow-sm border border-slate-50 animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-[10px] font-extrabold shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                  <p className="text-[9px] text-slate-400 truncate">{p.email}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${roleInfo.cls}`}>
                  {roleInfo.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
