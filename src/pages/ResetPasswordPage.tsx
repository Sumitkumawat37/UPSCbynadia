import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if we have the access token in the URL (from Supabase password reset)
    const accessToken = searchParams.get("access_token");
    if (!accessToken) {
      toast.error("Invalid or expired reset link");
      navigate("/forgot-password");
    }
  }, [searchParams, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const success = await updatePassword(newPassword);
    setLoading(false);

    if (success) {
      toast.success("Password reset successfully");
      navigate("/login");
    } else {
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>

        <div className="bg-[#12122a]/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-900/30 border border-purple-500/15 p-6 animate-slide-in-bounce">
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-purple-400/40 flex items-center justify-center shadow-2xl shadow-purple-500/30 mb-4 animate-float-slow animate-glow-breathe">
              <div className="absolute inset-0 rounded-3xl bg-white/10 animate-pulse" style={{ animationDuration: '3s' }} />
              <Lock className="w-8 h-8 text-white relative z-10 icon-glow-purple" />
            </div>
            <h1 className="text-xl font-bold text-white">Reset Password</h1>
            <p className="text-gray-400 text-sm mt-2 text-center">Enter your new password below</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-xs font-semibold text-gray-400 uppercase tracking-wide">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Min. 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-2xl border-purple-500/15 bg-white/5 h-12 pl-4 text-white input-glow"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Resetting...
                </span>
              ) : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-purple-500/10">
            <p className="text-center text-xs text-gray-500">
              Your password has been reset. You can now log in with your new password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
