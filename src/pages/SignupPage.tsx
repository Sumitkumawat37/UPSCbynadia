import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, UserPlus } from "lucide-react";
import { toast } from "sonner";

const SignupPage = () => {
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) return toast.error("Please fill all fields");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await signup(email.trim(), password, name.trim());
      toast.success("Account created! Check your email to verify your account.");
      navigate("/check-email", { state: { email: email.trim() } });
    } catch (err: any) {
      const msg = typeof err?.message === "string" && err.message ? err.message : "Signup failed. Please try again.";
      if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else if (msg.toLowerCase().includes("database")) {
        toast.error("Account creation failed. Please try again or contact support.");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    const success = await signInWithGoogle();
    setLoading(false);
    if (!success) {
      toast.error("Google sign-up failed. Please try again.");
    }
  };

  const benefits = [
    "Access 150+ live class recordings",
    "500+ curated notes & PYQs",
    "Weekly mock tests with analytics",
    "Direct doubt resolution in 24hrs",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col md:flex-row">

      {/* LEFT: branding */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/80 via-[#1a1040] to-pink-900/40 pt-12 pb-20 px-6 flex flex-col items-center md:w-1/2 md:min-h-screen md:pt-0 md:pb-0 md:items-start md:justify-center md:px-14 aurora-bg">
        <div className="absolute -top-10 -left-10 w-44 h-44 bg-purple-600/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 -right-10 w-36 h-36 bg-pink-600/20 rounded-full blur-3xl animate-blob-2" />
        <div className="absolute top-6 right-10 w-5 h-5 bg-purple-400/30 rounded-full animate-float" />
        <div className="absolute bottom-10 left-16 w-3 h-3 bg-pink-400/50 rounded-full animate-float-reverse" />
        <div className="hidden md:block absolute bottom-20 right-10 w-32 h-32 bg-purple-500/5 rounded-full animate-blob" />

        <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left animate-fade-in">
          <div
            className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-purple-400/40 flex items-center justify-center shadow-2xl shadow-purple-500/30 mb-4 animate-float-slow animate-glow-breathe"
          >
            <div className="absolute inset-0 rounded-3xl bg-white/10 animate-pulse" style={{ animationDuration: '3s' }} />
            <GraduationCap className="w-8 h-8 text-white relative z-10 icon-glow-purple icon-animated-pulse" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Join <span className="text-shimmer">UPSC Nadiya</span>
          </h1>
          <p className="text-white/75 text-sm md:text-base mt-1.5 md:mt-3">Create your free student account</p>

          <div className="hidden md:flex flex-col gap-3 mt-10">
            {benefits.map((item, i) => (
              <div key={item} className="flex items-center gap-3 animate-slide-in-left" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-5 h-5 rounded-full bg-purple-500/30 border border-purple-400/50 flex items-center justify-center shrink-0 hover-scale">
                  <span className="text-purple-300 text-[10px] font-bold">&#10003;</span>
                </div>
                <span className="text-white/90 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: form */}
      <div className="flex-1 flex items-start md:items-center justify-center px-4 pt-0 pb-8 md:py-0 -mt-8 md:mt-0 relative z-10">
        <div className="w-full max-w-sm">
          <div className="bg-[#12122a]/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-900/30 border border-purple-500/15 p-5 animate-slide-in-bounce">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 icon-container-glow">
                <UserPlus className="w-4 h-4 text-white icon-glow-purple" />
              </div>
              <p className="text-sm font-bold text-white">Create Student Account</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Full Name</Label>
                <Input
                  placeholder="e.g. Priya Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-2xl border-purple-500/15 bg-white/5 h-12 pl-4 text-white input-glow"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl border-purple-500/15 bg-white/5 h-12 pl-4 text-white input-glow"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Password</Label>
                <Input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-2xl border-purple-500/15 bg-white/5 h-12 pl-4 text-white input-glow"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 rounded-2xl text-sm mt-2 ripple neon-glow disabled:opacity-70 magnetic-hover"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : 'Create Account'}
              </button>

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
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-gray-900 py-3 rounded-2xl text-sm font-semibold transition-all disabled:opacity-70"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
