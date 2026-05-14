import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, UserPlus } from "lucide-react";
import { toast } from "sonner";

const SignupPage = () => {
  const { signup } = useAuth();
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
      toast.success("Account created! Check your email to verify, then sign in.");
      navigate("/login");
    } catch (err: any) {
      const msg = err?.message || "";
      if (msg.toLowerCase().includes("already")) toast.error("This email is already registered. Try signing in.");
      else toast.error(msg || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    "Access 150+ live class recordings",
    "500+ curated notes & PYQs",
    "Weekly mock tests with analytics",
    "Direct doubt resolution in 24hrs",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">

      {/* LEFT: branding */}
      <div className="relative overflow-hidden gradient-hero pt-12 pb-20 px-6 flex flex-col items-center md:w-1/2 md:min-h-screen md:pt-0 md:pb-0 md:items-start md:justify-center md:px-14">
        <div className="absolute -top-10 -left-10 w-44 h-44 bg-white/10 rounded-full blur-2xl animate-blob" />
        <div className="absolute bottom-0 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl animate-blob-2" />
        <div className="absolute top-6 right-10 w-5 h-5 bg-white/30 rounded-full animate-float" />
        <div className="absolute bottom-10 left-16 w-3 h-3 bg-yellow-300/60 rounded-full animate-float-reverse" />
        <div className="hidden md:block absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full animate-blob" />

        <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left animate-fade-in">
          <div
            className="relative w-16 h-16 rounded-3xl border-4 border-white/40 flex items-center justify-center shadow-2xl mb-4 animate-float-slow"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))' }}
          >
            <div className="absolute inset-0 rounded-3xl bg-white/15 animate-pulse" style={{ animationDuration: '3s' }} />
            <GraduationCap className="w-8 h-8 text-white relative z-10" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Join <span className="text-yellow-300">UPSC Nadiya</span>
          </h1>
          <p className="text-white/75 text-sm md:text-base mt-1.5 md:mt-3">Create your free student account</p>

          <div className="hidden md:flex flex-col gap-3 mt-10">
            {benefits.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-yellow-300/30 border border-yellow-300/50 flex items-center justify-center shrink-0">
                  <span className="text-yellow-300 text-[10px] font-bold">&#10003;</span>
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
          <div className="bg-white rounded-3xl shadow-2xl shadow-sky-200/40 border border-sky-50 p-5 animate-slide-up">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl gradient-hero flex items-center justify-center shadow-sm">
                <UserPlus className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-bold text-slate-700">Create Student Account</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Full Name</Label>
                <Input
                  placeholder="e.g. Priya Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-2xl border-sky-100 bg-sky-50/50 h-12 pl-4 text-slate-800 input-glow"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl border-sky-100 bg-sky-50/50 h-12 pl-4 text-slate-800 input-glow"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Password</Label>
                <Input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-2xl border-sky-100 bg-sky-50/50 h-12 pl-4 text-slate-800 input-glow"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 rounded-2xl text-sm mt-2 ripple neon-glow disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
