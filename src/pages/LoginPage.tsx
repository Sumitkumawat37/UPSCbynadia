import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, Shield, Users, Star } from "lucide-react";
import { toast } from "sonner";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "teacher" | "admin">("student");
  const [email, setEmail] = useState("student@demo.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const handleRoleSwitch = (r: "student" | "teacher" | "admin") => {
    setRole(r);
    setEmail(r === "teacher" ? "teacher@demo.com" : r === "admin" ? "superadmin@demo.com" : "student@demo.com");
    setPassword("123456");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      // Navigation handled by auth state change
    } else {
      toast.error("Invalid credentials. Please check email and password.");
    }
  };

  const featureItems = [
    { icon: Users,  text: "2,500+ active students" },
    { icon: Star,   text: "4.9 rated platform" },
    { icon: Shield, text: "45+ UPSC selections" },
  ];

  const proofItems = [
    { icon: Users,  label: "2,500+ Students", color: "text-sky-500" },
    { icon: Star,   label: "4.9 Rating",       color: "text-amber-500" },
    { icon: Shield, label: "45+ Cleared",      color: "text-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">

      {/* LEFT: branding */}
      <div className="relative overflow-hidden gradient-hero pt-14 pb-20 px-6 flex flex-col items-center md:w-1/2 md:min-h-screen md:pt-0 md:pb-0 md:items-start md:justify-center md:px-14">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-blob" />
        <div className="absolute bottom-0 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-blob-2" />
        <div className="absolute top-8 left-8 w-6 h-6 bg-white/30 rounded-full animate-float" />
        <div className="absolute top-12 right-20 w-4 h-4 bg-yellow-300/60 rounded-full animate-float-reverse" />
        <div className="hidden md:block absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full animate-blob" />

        <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left animate-fade-in">
          <div className="relative w-16 h-16 rounded-3xl gradient-hero border-4 border-white/40 flex items-center justify-center shadow-2xl mb-4 animate-float-slow">
            <div className="absolute inset-0 rounded-3xl bg-white/20 animate-pulse" style={{ animationDuration: '3s' }} />
            <GraduationCap className="w-8 h-8 text-white relative z-10" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            UPSC by <span className="text-yellow-300">Nadiya Ma&apos;am</span>
          </h1>
          <p className="text-white/75 text-sm md:text-base mt-1.5 md:mt-3">Sign in to continue your UPSC prep</p>

          <div className="hidden md:flex flex-col gap-3 mt-10">
            {featureItems.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/90 text-sm font-medium">{f.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: form */}
      <div className="flex-1 flex items-start md:items-center justify-center px-4 pt-0 pb-8 md:py-0 -mt-8 md:mt-0 relative z-10">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-2xl shadow-sky-200/40 border border-sky-50 p-5 animate-slide-up">
            <div className="flex gap-1.5 bg-sky-50 p-1.5 rounded-2xl mb-5">
              {(['student', 'teacher', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ripple press ${
                    role === r
                      ? r === 'admin'
                        ? 'bg-white shadow-md text-amber-600 scale-[1.02]'
                        : 'bg-white shadow-md text-sky-600 scale-[1.02]'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {r === 'student' ? 'Student' : r === 'teacher' ? 'Teacher' : 'Admin'}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl border-sky-100 bg-sky-50/50 h-12 pl-4 text-slate-800 input-glow"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-2xl border-sky-100 bg-sky-50/50 h-12 pl-4 pr-11 text-slate-800 input-glow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-2xl p-3 border border-sky-100">
                <p className="text-[10px] font-bold text-sky-600 mb-1 uppercase tracking-wide">Demo Credentials</p>
                <p className="text-[10px] text-slate-500">Student: student@demo.com / 123456</p>
                <p className="text-[10px] text-slate-500">Teacher: teacher@demo.com / 123456</p>
                <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Admin: superadmin@demo.com / 123456</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 rounded-2xl text-sm ripple neon-glow disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-slate-500 mt-5">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-primary font-bold hover:underline">Sign Up</Link>
          </p>

          <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-sky-100">
            {proofItems.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="flex flex-col items-center gap-0.5 stat-counter">
                  <Icon className={`w-4 h-4 ${b.color}`} />
                  <span className="text-[9px] font-bold text-slate-500 whitespace-nowrap">{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
