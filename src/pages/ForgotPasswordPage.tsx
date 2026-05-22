import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const success = await resetPassword(email);
      if (success) {
        toast.success("Password reset link sent to your email");
        navigate("/login");
      } else {
        toast.error("Failed to send reset link. Please try again.");
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      toast.error(err.message || "Failed to send reset link. Please try again.");
    }
    setLoading(false);
  };

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
            <Mail className="w-8 h-8 text-white relative z-10 icon-glow-purple" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Reset Password
          </h1>
          <p className="text-white/75 text-sm md:text-base mt-1.5 md:mt-3">Enter your email to receive a password reset link</p>
        </div>
      </div>

      {/* RIGHT: form */}
      <div className="flex-1 flex items-start md:items-center justify-center px-4 pt-0 pb-8 md:py-0 -mt-8 md:mt-0 relative z-10">
        <div className="w-full max-w-sm">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors press mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </button>

          <div className="bg-[#12122a]/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-900/30 border border-purple-500/15 p-5 animate-slide-in-bounce">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="rounded-2xl border-purple-500/15 bg-white/5 h-12 pl-4 text-white input-glow"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 rounded-2xl text-sm ripple neon-glow disabled:opacity-70 magnetic-hover"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-purple-500/10">
              <p className="text-center text-xs text-gray-500">
                We'll send a password reset link to your email address
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Remember your password?{' '}
            <Link to="/login" className="text-purple-400 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
