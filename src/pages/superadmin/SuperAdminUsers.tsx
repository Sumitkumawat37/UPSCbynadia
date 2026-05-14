import { useState } from "react";
import { useProfiles, useUserRoles } from "@/lib/supabase-data";
import { useSetUserRole, useDeleteProfile } from "@/lib/supabase-mutations";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, GraduationCap, Plus, Trash2, Search, ShieldCheck, Mail, Crown } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const SUPER_ADMIN_EMAILS = ["superadmin@demo.com"];

const SuperAdminUsers = () => {
  const { data: profiles = [], isLoading } = useProfiles();
  const { data: userRoles = [] } = useUserRoles();
  const setUserRole = useSetUserRole();
  const deleteProfile = useDeleteProfile();
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"student" | "admin">("student");
  const [adding, setAdding] = useState(false);

  const getRoleForUser = (userId: string) => {
    const email = profiles.find((p) => p.user_id === userId)?.email ?? "";
    if (SUPER_ADMIN_EMAILS.includes(email.toLowerCase())) return "super_admin";
    return userRoles.some((r) => r.user_id === userId && r.role === "admin") ? "admin" : "student";
  };

  const filtered = profiles.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalTeachers = profiles.filter((p) => getRoleForUser(p.user_id) === "admin").length;
  const totalStudents = profiles.filter((p) => getRoleForUser(p.user_id) === "student").length;
  const totalSuperAdmins = profiles.filter((p) => getRoleForUser(p.user_id) === "super_admin").length;

  const handleRoleToggle = (userId: string, currentRole: string) => {
    const email = profiles.find((p) => p.user_id === userId)?.email ?? "";
    if (SUPER_ADMIN_EMAILS.includes(email.toLowerCase())) {
      toast.error("Cannot change Admin role");
      return;
    }
    const newR = currentRole === "admin" ? "student" : "admin";
    setUserRole.mutate({ userId, role: newR }, {
      onSuccess: () => toast.success(`User promoted to ${newR === "admin" ? "Teacher" : "Student"}`),
      onError: () => toast.error("Failed to update role"),
    });
  };

  const handleDelete = (userId: string, name: string) => {
    const email = profiles.find((p) => p.user_id === userId)?.email ?? "";
    if (SUPER_ADMIN_EMAILS.includes(email.toLowerCase())) {
      toast.error("Cannot delete Admin account");
      return;
    }
    if (!confirm(`Remove ${name} from the platform? This cannot be undone.`)) return;
    deleteProfile.mutate(userId, {
      onSuccess: () => toast.success("User removed"),
      onError: () => toast.error("Failed to remove user"),
    });
  };

  const handleAddUser = async () => {
    if (!newName.trim() || !newEmail.trim() || !newPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setAdding(true);
    try {
      // Use a temp client that doesn't disturb the current admin session
      const tempClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        { auth: { persistSession: false, autoRefreshToken: false, storageKey: "sa_temp_create" } }
      );
      const { data, error } = await tempClient.auth.signUp({
        email: newEmail.trim(),
        password: newPassword,
        options: { data: { name: newName.trim() } },
      });
      if (error) throw error;
      const newUserId = data.user?.id;
      if (newUserId && newRole === "admin") {
        await supabase.from("user_roles").insert({ user_id: newUserId, role: "admin" });
      }
      qc.invalidateQueries({ queryKey: ["profiles"] });
      qc.invalidateQueries({ queryKey: ["user_roles"] });
      toast.success(`${newRole === "admin" ? "Teacher" : "Student"} account created! They may need to verify their email.`);
      setShowAdd(false);
      setNewName(""); setNewEmail(""); setNewPassword(""); setNewRole("student");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create user");
    } finally {
      setAdding(false);
    }
  };

  const roleBadge = (role: string) => {
    if (role === "super_admin") return (
      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
        <Crown className="w-2.5 h-2.5" /> Admin
      </span>
    );
    if (role === "admin") return (
      <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-violet-200">
        <ShieldCheck className="w-2.5 h-2.5" /> Teacher
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-sky-200">
        <GraduationCap className="w-2.5 h-2.5" /> Student
      </span>
    );
  };

  return (
    <div className="space-y-5 animate-slide-up">

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl gradient-hero p-5 shadow-lg">
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full animate-float" />
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 shadow-sm">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>User Management</h2>
              <p className="text-white/70 text-[10px]">{profiles.length} total registered accounts</p>
            </div>
          </div>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1.5 bg-white text-sky-600 text-xs font-bold px-3 py-2 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95">
                <Plus className="w-3.5 h-3.5" /> Add User
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create New User</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-1">
                <div className="space-y-1">
                  <Label className="text-xs">Full Name *</Label>
                  <Input placeholder="e.g. Priya Sharma" value={newName} onChange={(e) => setNewName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Email *</Label>
                  <Input type="email" placeholder="user@example.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Password * (min 6 chars)</Label>
                  <Input type="password" placeholder="••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Role</Label>
                  <div className="flex gap-2">
                    {(["student", "admin"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setNewRole(r)}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border ${newRole === r ? "gradient-hero text-white border-transparent shadow-md" : "text-slate-500 border-slate-200 hover:border-sky-300"}`}
                      >
                        {r === "admin" ? "Teacher" : "Student"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                  <p className="text-[10px] text-amber-700 font-semibold">Note: If email confirmation is enabled in your Supabase project, the user must verify their email before logging in.</p>
                </div>
                <Button className="w-full" onClick={handleAddUser} disabled={adding}>
                  {adding ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Users,      label: "Total",    value: profiles.length, color: "from-sky-400 to-cyan-500" },
          { icon: UserCheck,  label: "Teachers", value: totalTeachers,   color: "from-violet-400 to-purple-500" },
          { icon: GraduationCap, label: "Students", value: totalStudents, color: "from-emerald-400 to-teal-500" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-slate-50">
              <p className={`text-xl font-extrabold bg-gradient-to-br ${s.color} bg-clip-text text-transparent`}>{s.value}</p>
              <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-2xl border-sky-100 bg-sky-50/50 input-glow"
        />
      </div>

      {/* User list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl shimmer-bg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-50">
          <Users className="w-10 h-10 text-slate-200 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No users found</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((p, i) => {
            const role = getRoleForUser(p.user_id);
            const isSA = role === "super_admin";
            const initials = (p.name ?? p.email ?? "U").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-50 flex items-center gap-3 animate-slide-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white text-xs font-extrabold shadow-sm shrink-0 ${isSA ? "bg-gradient-to-br from-amber-400 to-orange-500" : role === "admin" ? "bg-gradient-to-br from-violet-400 to-purple-500" : "gradient-hero"}`}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-800 truncate">{p.name}</p>
                    {roleBadge(role)}
                  </div>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Mail className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{p.email}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {!isSA && (
                    <button
                      onClick={() => handleRoleToggle(p.user_id, role)}
                      disabled={setUserRole.isPending}
                      className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition-all active:scale-95 ${role === "admin" ? "bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-100" : "bg-violet-50 text-violet-600 hover:bg-violet-100 border border-violet-100"}`}
                    >
                      {role === "admin" ? "Make Student" : "Make Teacher"}
                    </button>
                  )}
                  {!isSA && (
                    <button
                      onClick={() => handleDelete(p.user_id, p.name ?? "user")}
                      className="w-8 h-8 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-all active:scale-95 border border-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {isSA && (
                    <span className="text-[9px] text-amber-500 font-bold px-2 py-1">Admin</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SuperAdminUsers;
