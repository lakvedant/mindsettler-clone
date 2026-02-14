import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { 
  CheckCircle, 
  XCircle,
  Loader2,
  AlertCircle,
  Home,
  ArrowRight
} from "lucide-react";
import API from "../../api/axios";

const VerifyEmail = ({ setUser }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading, success, error, expired, already_verified
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setStatus("error");
      setMessage("No verification token provided.");
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      setStatus("loading");
      const response = await API.post("/user/auth/verify-email", { token });

      if (response.data.alreadyVerified) {
        setStatus("already_verified");
        setMessage(response.data.message);
      } else {
        setStatus("success");
        setMessage(response.data.message);

        // Auto-authenticate: store token and set user in context
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        if (setUser && response.data.user) {
          setUser(response.data.user);
        }

        // Redirect to home after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2500);
      }
    } catch (error) {
      console.error("Verification error:", error);
      
      if (error.response?.data?.expired) {
        setStatus("expired");
        setMessage(error.response.data.message);
      } else {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed. Please try again.");
      }
    }
  };

  // Render different states
  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#3F2965]/10 to-[#DD1764]/10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#3F2965] animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Verifying Your Email
            </h1>
            <p className="text-slate-500">
              Please wait while we verify your email address...
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 animate-in zoom-in duration-500">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Email Verified! 🎉
            </h1>
            <p className="text-slate-500 mb-2">
              {message}
            </p>
            <p className="text-sm text-[#3F2965]/60 mb-6">Redirecting you to the homepage...</p>
            <div className="w-full h-1.5 bg-gradient-to-r from-[#3F2965] via-[#DD1764] to-[#3F2965] rounded-full overflow-hidden">
              <div className="h-full bg-white/30 animate-pulse" />
            </div>
          </div>
        );

      case "already_verified":
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Already Verified
            </h1>
            <p className="text-slate-500 mb-6">
              Your email address has already been verified. You're all set!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/auth")}
                className="w-full py-3 bg-gradient-to-r from-[#3F2965] to-[#DD1764] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
              >
                Go to Login
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        );

      case "expired":
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Link Expired
            </h1>
            <p className="text-slate-500 mb-6">
              {message}
            </p>
            
            <button
              onClick={() => navigate("/auth")}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
            >
              Sign Up Again
              <ArrowRight size={18} />
            </button>
            
            <button
              onClick={() => navigate("/")}
              className="w-full mt-3 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
            >
              <Home size={18} />
              Back to Home
            </button>
          </div>
        );

      case "error":
      default:
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Verification Failed
            </h1>
            <p className="text-slate-500 mb-6">
              {message}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate("/auth")}
                className="w-full py-3 bg-gradient-to-r from-[#3F2965] to-[#DD1764] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
              >
                Go to Sign Up
                <ArrowRight size={18} />
              </button>
              
              <button
                onClick={() => navigate("/")}
                className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
              >
                <Home size={18} />
                Back to Home
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3F2965] to-[#DD1764] flex items-center justify-center">
              <span className="text-white text-xl font-bold">M</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#3F2965] to-[#DD1764] bg-clip-text text-transparent">
              MindSettler
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-xl">
          {renderContent()}
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Having trouble? {" "}
          <Link to="/contact" className="text-[#3F2965] font-medium hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;