import { useLocation, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

const CheckEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as any)?.email || "your email";

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-[#12122a]/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-900/30 border border-purple-500/15 p-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Mail className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>
          <p className="text-gray-400 mb-2 text-sm leading-relaxed">
            We sent a verification link to
          </p>
          <p className="text-purple-400 font-semibold mb-6 text-base break-all">{email}</p>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Click the link in the email to verify your account. The link expires in 24 hours.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:opacity-90 transition"
            >
              Go to Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="w-full py-3 rounded-2xl border border-purple-500/20 text-gray-400 text-sm hover:text-white hover:border-purple-500/40 transition"
            >
              Use a different email
            </button>
          </div>
        </div>
        <p className="mt-6 text-gray-600 text-xs">
          Didn't receive the email? Check your spam folder or try signing up again.
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
