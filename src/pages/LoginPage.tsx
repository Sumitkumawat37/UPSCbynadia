import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, Shield, Users, Star } from "lucide-react";
import { toast } from "sonner";

const LoginPage = () => {
  const { login, signInWithGoogle } = useAuth();
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const success = await signInWithGoogle();
    setLoading(false);
    if (!success) {
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  const featureItems = [
    { icon: Users,  text: "2,500+ active students" },
    { icon: Star,   text: "4.9 rated platform" },
    { icon: Shield, text: "45+ UPSC selections" },
  ];

  const proofItems = [
    { icon: Users,  label: "2,500+ Students", color: "text-purple-400" },
    { icon: Star,   label: "4.9 Rating",       color: "text-amber-400" },
    { icon: Shield, label: "45+ Cleared",      color: "text-emerald-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col md:flex-row">

      {/* LEFT: branding */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/80 via-[#1a1040] to-pink-900/40 pt-14 pb-20 px-6 flex flex-col items-center md:w-1/2 md:min-h-screen md:pt-0 md:pb-0 md:items-start md:justify-center md:px-14 aurora-bg">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 -left-10 w-40 h-40 bg-pink-600/20 rounded-full blur-3xl animate-blob-2" />
        <div className="absolute top-8 left-8 w-6 h-6 bg-purple-400/30 rounded-full animate-float" />
        <div className="absolute top-12 right-20 w-4 h-4 bg-pink-400/50 rounded-full animate-float-reverse" />
        <div className="hidden md:block absolute bottom-20 right-10 w-32 h-32 bg-purple-500/5 rounded-full animate-blob" />

        <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left animate-fade-in">
          <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-purple-400/40 flex items-center justify-center shadow-2xl shadow-purple-500/30 mb-4 animate-float-slow animate-glow-breathe">
            <div className="absolute inset-0 rounded-3xl bg-white/10 animate-pulse" style={{ animationDuration: '3s' }} />
            <GraduationCap className="w-8 h-8 text-white relative z-10 icon-glow-purple icon-animated-pulse" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            UPSC by <span className="text-shimmer">Nadiya Ma&apos;am</span>
          </h1>
          <p className="text-white/75 text-sm md:text-base mt-1.5 md:mt-3">Sign in to continue your UPSC prep</p>

          <div className="hidden md:flex flex-col gap-3 mt-10">
            {featureItems.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.text} className="flex items-center gap-3 animate-slide-in-left" style={{ animationDelay: `${featureItems.indexOf(f) * 100}ms` }}>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/20 flex items-center justify-center shrink-0 hover-scale icon-glass">
                    <Icon className="w-4 h-4 text-white icon-glow-purple" />
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
          <div className="bg-[#12122a]/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-900/30 border border-purple-500/15 p-5 animate-slide-in-bounce">
            <div className="flex gap-1.5 bg-white/5 border border-purple-500/10 p-1.5 rounded-2xl mb-5">
              {(['student', 'teacher', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ripple press ${
                    role === r
                      ? r === 'admin'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25 text-white scale-[1.02]'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/25 text-white scale-[1.02]'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {r === 'student' ? 'Student' : r === 'teacher' ? 'Teacher' : 'Admin'}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl border-purple-500/15 bg-white/5 h-12 pl-4 text-white input-glow"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-2xl border-purple-500/15 bg-white/5 h-12 pl-4 pr-11 text-white input-glow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 icon-glow-purple" /> : <Eye className="w-4 h-4 icon-glow-purple" />}
                  </button>
                </div>
              </div>

              <div className="bg-purple-500/10 rounded-2xl p-3 border border-purple-500/15">
                <p className="text-[10px] font-bold text-purple-400 mb-1 uppercase tracking-wide">Demo Credentials</p>
                <p className="text-[10px] text-gray-500">Student: student@demo.com / 123456</p>
                <p className="text-[10px] text-gray-500">Teacher: teacher@demo.com / 123456</p>
                <p className="text-[10px] text-amber-400 font-semibold mt-0.5">Admin: superadmin@demo.com / 123456</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 rounded-2xl text-sm ripple neon-glow disabled:opacity-70 magnetic-hover"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-purple-400 text-xs font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-purple-500/20" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#12122a] text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-gray-900 py-3 rounded-2xl text-sm font-semibold transition-all disabled:opacity-70"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-purple-400 font-bold hover:underline">Sign Up</Link>
          </p>

          <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-purple-500/10">
            {proofItems.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="flex flex-col items-center gap-0.5 stat-counter hover-scale">
                  <Icon className={`w-4 h-4 ${b.color} icon-glow-purple`} />
                  <span className="text-[9px] font-bold text-gray-500 whitespace-nowrap">{b.label}</span>
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
