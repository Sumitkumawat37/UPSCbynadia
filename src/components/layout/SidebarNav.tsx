import React from "react";
import { Home, BookOpen, FileText, Trophy, User, LayoutDashboard, Users, Megaphone, Video, MessageCircle, Bell, BarChart3, GraduationCap, LogOut, Lock, UserCog, Crown } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

const studentNav = [
  { to: "/",             icon: Home,          label: "Home",          end: true },
  { to: "/dashboard",    icon: BarChart3,     label: "Dashboard",     end: true },
  { to: "/courses",      icon: BookOpen,      label: "Courses",       end: false },
  { to: "/live-classes", icon: Video,         label: "Live Classes",  end: false },
  { to: "/notes",        icon: FileText,      label: "Notes",         end: false },
  { to: "/quizzes",      icon: Trophy,        label: "Quizzes",       end: false },
  { to: "/doubts",       icon: MessageCircle, label: "Doubts",        end: false },
  { to: "/notifications",icon: Bell,          label: "Notifications", end: false },
  { to: "/profile",      icon: User,          label: "Profile",       end: false },
];

const superAdminOwnNav = [
  { to: "/superadmin",       icon: Crown,   label: "Dashboard",       end: true },
  { to: "/superadmin/users", icon: UserCog, label: "User Management", end: false },
];

const superAdminMgmtNav = [
  { to: "/admin/content",       icon: BookOpen,      label: "Content",       end: false },
  { to: "/admin/students",      icon: Users,         label: "Students",      end: false },
  { to: "/admin/quizzes",       icon: Trophy,        label: "Quizzes",       end: false },
  { to: "/admin/live",          icon: Video,         label: "Live Classes",  end: false },
  { to: "/admin/announcements", icon: Megaphone,     label: "Announcements", end: false },
  { to: "/admin/doubts",        icon: MessageCircle, label: "Doubts",        end: false },
  { to: "/admin/access",        icon: Lock,          label: "Course Access", end: false },
];

const adminNav = [
  { to: "/admin",                icon: LayoutDashboard, label: "Dashboard",     end: true },
  { to: "/admin/content",        icon: BookOpen,        label: "Content",       end: false },
  { to: "/admin/quizzes",        icon: Trophy,          label: "Quizzes",       end: false },
  { to: "/admin/students",       icon: Users,           label: "Students",      end: false },
  { to: "/admin/live",           icon: Video,           label: "Live Classes",  end: false },
  { to: "/admin/announcements",  icon: Megaphone,       label: "Announcements", end: false },
  { to: "/admin/doubts",         icon: MessageCircle,   label: "Doubts",        end: false },
  { to: "/admin/access",         icon: Lock,            label: "Course Access", end: false },
];

const navLink = (item: { to: string; icon: React.ElementType; label: string; end: boolean }, activeClass: string, hoverClass: string) => (
  <NavLink
    key={item.to}
    to={item.to}
    end={item.end}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
        isActive ? activeClass : `text-slate-500 ${hoverClass} hover:scale-[1.01]`
      }`
    }
  >
    <item.icon style={{ width: 17, height: 17 }} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
    {item.label}
  </NavLink>
);

export function SidebarNav() {
  const { role, logout, user } = useAuth();
  const navigate = useNavigate();

  const isSuperAdmin = role === "super_admin";
  const isAdmin = role === "admin";

  const avatarBg = isSuperAdmin
    ? "bg-gradient-to-br from-amber-400 to-orange-500"
    : "gradient-hero";

  return (
    <aside className={`hidden md:flex flex-col fixed top-0 left-0 h-screen w-64 z-40 backdrop-blur-xl border-r shadow-xl ${
      isSuperAdmin
        ? "bg-amber-50/95 border-amber-100 shadow-amber-100/50"
        : "bg-white/90 border-slate-100 shadow-slate-100/50"
    }`}>

      {/* Logo */}
      <div className={`px-5 py-5 border-b ${isSuperAdmin ? "border-amber-100" : "border-slate-50"}`}>
        <div className="flex items-center gap-3">
          <div className={`relative w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${
            isSuperAdmin
              ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-300/40"
              : "gradient-hero shadow-sky-300/40"
          }`}>
            {isSuperAdmin ? <Crown className="w-5 h-5 text-white" /> : <GraduationCap className="w-5 h-5 text-white" />}
            <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <p className="font-extrabold text-slate-800 text-sm leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              UPSC <span className={isSuperAdmin ? "text-amber-500" : "text-primary"}>Nadiya</span>
            </p>
            <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
              isSuperAdmin ? "bg-amber-100 text-amber-600" : isAdmin ? "bg-violet-100 text-violet-600" : "bg-sky-100 text-sky-600"
            }`}>
              {isSuperAdmin
                ? <><Crown style={{width:9,height:9}} /> Admin Panel</>
                : <><span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isAdmin ? "bg-violet-500" : "bg-sky-500"}`} />{isAdmin ? "Teacher Panel" : "Student Panel"}</>
              }
            </span>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {isSuperAdmin ? (
          <>
            {/* Owner section */}
            <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest px-3 pt-1 pb-1">Admin</p>
            {superAdminOwnNav.map((item) => navLink(
              item,
              "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-300/30 scale-[1.02]",
              "hover:bg-amber-100 hover:text-amber-700"
            ))}
            {/* Platform management section */}
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-3 pt-3 pb-1">Manage Platform</p>
            {superAdminMgmtNav.map((item) => navLink(
              item,
              "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-300/30 scale-[1.02]",
              "hover:bg-amber-100 hover:text-amber-700"
            ))}
          </>
        ) : (
          (isAdmin ? adminNav : studentNav).map((item) => navLink(
            item,
            "gradient-hero text-white shadow-lg shadow-sky-300/30 scale-[1.02]",
            "hover:bg-sky-50 hover:text-sky-600"
          ))
        )}
      </nav>

      {/* User card + logout */}
      <div className={`px-4 py-4 border-t space-y-3 ${isSuperAdmin ? "border-amber-100" : "border-slate-50"}`}>
        <div className="flex items-center gap-2.5 px-1">
          <div className={`w-9 h-9 rounded-2xl ${avatarBg} flex items-center justify-center text-white text-xs font-extrabold shadow-md shrink-0`}>
            {(user?.name?.[0] ?? user?.email?.[0] ?? "U").toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 truncate">{user?.name ?? "User"}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-500 text-sm font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-95"
        >
          <LogOut style={{ width: 16, height: 16 }} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
