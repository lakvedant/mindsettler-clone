import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Shield, Loader2, AlertCircle } from "lucide-react";
import API from "../api/axios";
import Logo from "../assets/icons/MindsettlerLogo-removebg-preview.png";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#3F2965]" />
      </div>
    );
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (user && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    const formData = Object.fromEntries(new FormData(e.target));

    try {
      const { data } = await API.post("/admin/login", formData);
      if (data.success) {
        setUser(data.user);
        navigate("/admin", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to sign in. Please check your credentials and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <img src={Logo} alt="MindSettler" className="w-40 mb-6" />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#3F2965]/10 rounded-full">
              <Shield size={14} className="text-[#3F2965]" />
              <span className="text-xs font-bold text-[#3F2965] uppercase tracking-wide">
                Admin Portal
              </span>
            </div>
            <h1 className="mt-4 text-2xl font-black text-[#3F2965]">
              Administrator Sign In
            </h1>
            <p className="mt-2 text-sm text-slate-500 text-center">
              Restricted access. Authorized personnel only.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@mindsettler.in"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-[#3F2965] focus:ring-2 focus:ring-[#3F2965]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-slate-200 focus:border-[#3F2965] focus:ring-2 focus:ring-[#3F2965]/20 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#3F2965]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-[#3F2965] text-white font-bold hover:bg-[#2d1d4a] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In to Admin"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Not an administrator?{" "}
            <Link to="/" className="font-bold text-[#DD1764] hover:underline">
              Return to site
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
