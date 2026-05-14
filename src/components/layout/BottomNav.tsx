import { Home, BookOpen, FileText, Trophy, User, LayoutDashboard, Users, Megaphone, Video, MessageCircle, Lock, Calendar, BarChart3 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

const studentNav = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/courses", icon: BookOpen, label: "Courses" },
  { to: "/live-classes", icon: Video, label: "Live" },
  { to: "/quizzes", icon: Trophy, label: "Quizzes" },
  { to: "/profile", icon: User, label: "Profile" },
];

const adminNav = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/content", icon: BookOpen, label: "Content" },
  { to: "/admin/quizzes", icon: Trophy, label: "Quizzes" },
  { to: "/admin/students", icon: Users, label: "Students" },
  { to: "/admin/live", icon: Video, label: "Live" },
];

export function BottomNav() {
  const { role } = useAuth();
  const items = role === "admin" ? adminNav : studentNav;
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-3 mb-3">
        <div className="glass rounded-3xl border border-white/70 shadow-xl shadow-sky-200/30 px-2 py-2">
          <div className="flex justify-around items-center">
            {items.map((item) => {
              const isActive = location.pathname === item.to ||
                (item.to !== "/" && item.to !== "/admin" && location.pathname.startsWith(item.to));
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-300 relative min-w-[52px] ${
                    isActive ? "scale-105" : "hover:scale-105 active:scale-95"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "gradient-hero shadow-lg shadow-sky-300/40 scale-110"
                      : "bg-transparent hover:bg-sky-50"
                  }`}>
                    <item.icon className={`w-4.5 h-4.5 transition-colors duration-200 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-sky-500"
                    }`} style={{ width: '18px', height: '18px' }} />
                  </div>
                  <span className={`text-[10px] font-semibold transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-slate-400"
                  }`}>{item.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary animate-pop-in" />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
