import React from "react";
import { Home, BookOpen, FileText, Trophy, User, LayoutDashboard, Users, Megaphone, Video, MessageCircle, Bell, BarChart3, GraduationCap, LogOut, Lock, UserCog, Crown, Mail } from "lucide-react";
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
  { to: "/admin/content",       icon: BookOpen,      label: "Course",        end: false },
  { to: "/admin/students",      icon: Users,         label: "Students",      end: false },
  { to: "/admin/quizzes",       icon: Trophy,        label: "Quizzes",       end: false },
  { to: "/notes",               icon: FileText,      label: "Notes",         end: false },
  { to: "/admin/email-center",  icon: Mail,          label: "Email Center",  end: false },
  { to: "/admin/live",          icon: Video,         label: "Live Classes",  end: false },
  { to: "/admin/announcements", icon: Megaphone,     label: "Announcements", end: false },
  { to: "/admin/doubts",        icon: MessageCircle, label: "Doubts",        end: false },
  { to: "/admin/access",        icon: Lock,          label: "Course Access", end: false },
];

const adminNav = [
  { to: "/admin",                icon: LayoutDashboard, label: "Dashboard",     end: true },
  { to: "/admin/profile",        icon: User,            label: "My Profile",    end: false },
  { to: "/admin/content",        icon: BookOpen,        label: "Course",        end: false },
  { to: "/admin/quizzes",        icon: Trophy,          label: "Quizzes",       end: false },
  { to: "/notes",                icon: FileText,        label: "Notes",         end: false },
  { to: "/admin/students",       icon: Users,           label: "Students",      end: false },
  { to: "/admin/email-center",   icon: Mail,            label: "Email Center",  end: false },
  { to: "/admin/live",           icon: Video,           label: "Live Classes",  end: false },
  { to: "/admin/announcements",  icon: Megaphone,       label: "Announcements", end: false },
  { to: "/admin/doubts",         icon: MessageCircle,   label: "Doubts",        end: false },
  { to: "/admin/access",         icon: Lock,            label: "Course Access", end: false },
];

const navLink = (item: { to: string; icon: React.ElementType; label: string; end: boolean }, activeClass: string, hoverClass: string, index: number = 0) => (
  <NavLink
    key={item.to}
    to={item.to}
    end={item.end}
    className={({ isActive }) =>
      `group flex items-center gap-3 px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 animate-slide-in-left ${
        isActive ? `${activeClass}` : `text-gray-400 ${hoverClass}`
      }`
    }
    style={{ animationDelay: `${index * 40}ms` }}
  >
    <item.icon style={{ width: 18, height: 18 }} className="shrink-0 transition-transform duration-200" />
    {item.label}
  </NavLink>
);

export function SidebarNav() {
  const { role, logout, user } = useAuth();
  const navigate = useNavigate();

  const isSuperAdmin = role === "super_admin";
  const isAdmin = role === "admin";

  return (
    <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-72 z-40 bg-[#050505]/95 backdrop-blur-xl border-r border-[#A855F7]/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#A855F7]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#EC4899] flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-glow-breathe icon-container-glow">
            <GraduationCap className="w-5 h-5 text-white icon-glow-purple icon-animated-pulse" />
          </div>
          <div>
            <p className="font-bold text-white text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
              UPSC <span className="text-shimmer">Nadiya</span>
            </p>
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
              isSuperAdmin ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : isAdmin ? "bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/30" : "bg-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/30"
            }`}>
              {isSuperAdmin ? "Super Admin" : isAdmin ? "Teacher" : "Student"}
            </span>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {isSuperAdmin ? (
          <>
            <p className="text-[11px] font-semibold text-[#C084FC]/60 uppercase tracking-wider px-4 mb-2">Admin</p>
            {superAdminOwnNav.map((item, i) => navLink(
              item,
              "bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]",
              "hover:bg-[#0D0D0D]",
              i
            ))}
            <p className="text-[11px] font-semibold text-[#C084FC]/60 uppercase tracking-wider px-4 mb-2 mt-4">Manage Platform</p>
            {superAdminMgmtNav.map((item, i) => navLink(
              item,
              "bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]",
              "hover:bg-[#0D0D0D]",
              i + 3
            ))}
          </>
        ) : (
          (isAdmin ? adminNav : studentNav).map((item, i) => navLink(
            item,
            "bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]",
            "hover:bg-[#0D0D0D]",
            i
          ))
        )}
      </nav>

      {/* User card + logout */}
      <div className="px-4 py-4 border-t border-[#A855F7]/20 space-y-3">
        <div className="flex items-center gap-3 px-3 py-2.5 bg-[#0D0D0D] rounded-xl border border-[#A855F7]/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#EC4899] flex items-center justify-center text-white text-sm font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)] icon-container-glow">
            {(user?.name?.[0] ?? user?.email?.[0] ?? "U").toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{user?.name ?? "User"}</p>
            <p className="text-xs text-[#777777] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0D0D0D] hover:bg-red-500/10 text-[#B3B3B3] hover:text-red-400 text-sm font-medium transition-all duration-300 border border-[#A855F7]/20 hover:border-red-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]"
        >
          <LogOut style={{ width: 18, height: 18 }} className="icon-glow-purple" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
