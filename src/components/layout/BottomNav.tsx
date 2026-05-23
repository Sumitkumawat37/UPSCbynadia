import { Home, BookOpen, Trophy, User, LayoutDashboard, Users, Video, UserCog } from "lucide-react";
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

const superAdminNav = [
  { to: "/superadmin",       icon: LayoutDashboard, label: "Dashboard" },
  { to: "/superadmin/users", icon: UserCog,         label: "Users" },
  { to: "/admin/content",    icon: BookOpen,        label: "Content" },
  { to: "/admin/students",   icon: Users,           label: "Students" },
  { to: "/admin/live",       icon: Video,           label: "Live" },
];

export function BottomNav() {
  const { role } = useAuth();
  const items = role === "super_admin" ? superAdminNav : role === "admin" ? adminNav : studentNav;
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe animate-slide-in-bounce">
      <div className="mx-3 mb-3">
        <div className="bg-[#050505]/90 backdrop-blur-xl rounded-3xl border border-[#A855F7]/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] px-2 py-2 animate-glow-breathe" style={{ animationDuration: '4s' }}>
          <div className="flex justify-around items-center">
            {items.map((item) => {
              const exactRoutes = ["/", "/admin", "/superadmin"];
              const isActive = location.pathname === item.to ||
                (!exactRoutes.includes(item.to) && location.pathname.startsWith(item.to));
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
                      ? "bg-gradient-to-r from-[#A855F7] to-[#EC4899] shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-110 animate-elastic"
                      : "bg-transparent hover:bg-[#0D0D0D]"
                  }`}>
                    <item.icon className={`transition-all duration-200 ${
                      isActive ? "text-white animate-bounce-icon icon-glow-purple" : "text-[#B3B3B3]"
                    }`} style={{ width: '18px', height: '18px' }} />
                  </div>
                  <span className={`text-[10px] font-semibold transition-colors duration-200 ${
                    isActive ? "text-[#A855F7]" : "text-[#777777]"
                  }`}>{item.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse-ring shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
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
