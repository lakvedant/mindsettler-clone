import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Shield,
  KeyRound,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import API from "../api/axios";
import logo from "../assets/icons/MindsettlerLogo-removebg-preview.png";

const Input = ({ icon, label, rightIcon, error, ...props }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-1.5"
  >
    {label && (
      <label className="block text-[#3F2965] text-xs sm:text-sm font-semibold ml-1">
        {label}
      </label>
    )}
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3F2965] to-[#DD1764] rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300" />

      <div className="relative flex items-center">
        <div className="absolute left-4 text-[#6B4D8A]/40 group-focus-within:text-[#3F2965] transition-colors duration-300">
          {icon}
        </div>
        <input
          {...props}
          className={`
            w-full pl-11 sm:pl-12 pr-11 sm:pr-12 py-3.5 sm:py-4
            bg-white/80 backdrop-blur-sm
            border-2 ${error ? "border-[#DD1764]/50" : "border-[#3F2965]/10"}
            rounded-xl sm:rounded-2xl
            focus:border-[#3F2965]/30 focus:bg-white
            outline-none transition-all duration-300
            text-[#3F2965] placeholder-[#6B4D8A]/30
            text-sm sm:text-base font-medium
            shadow-sm focus:shadow-lg focus:shadow-[#3F2965]/5
          `}
        />
        {rightIcon && <div className="absolute right-4">{rightIcon}</div>}
      </div>
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[#DD1764] text-xs ml-1"
      >
        {error}
      </motion.p>
    )}
  </motion.div>
);

// Password Strength Indicator
const PasswordStrength = ({ password }) => {
  const getStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = getStrength(password);
  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mt-2"
    >
      <div className="flex gap-1 mb-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < strength ? colors[strength - 1] : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${strength < 3 ? "text-orange-500" : "text-green-500"}`}>
        {labels[strength - 1] || "Too short"}
      </p>
    </motion.div>
  );
};

// Status types
const STATUS = {
  LOADING: "loading",
  VALID: "valid",
  INVALID: "invalid",
  EXPIRED: "expired",
  SUCCESS: "success",
  ERROR: "error",
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState(STATUS.LOADING);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (!token) {
      setStatus(STATUS.INVALID);
      return;
    }
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await API.post("/user/auth/verify-reset-password", { token });
      if (response.data.valid) {
        setEmail(response.data.email || "");
        setStatus(STATUS.VALID);
      } else {
        setStatus(STATUS.INVALID);
      }
    } catch (err) {
      if (err.response?.data?.expired) {
        setStatus(STATUS.EXPIRED);
      } else {
        setStatus(STATUS.INVALID);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrors([]);

    // Validate
    if (password.length < 6) {
      setErrors(["Password must be at least 6 characters long"]);
      return;
    }

    if (password !== confirmPassword) {
      setErrors(["Passwords do not match"]);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await API.post("/user/auth/reset-password", {
        token,
        password,
        confirmPassword,
      });

      if (response.data.success) {
        setStatus(STATUS.SUCCESS);
      }
    } catch (err) {
      if (err.response?.data?.expired) {
        setStatus(STATUS.EXPIRED);
      } else {
        const errorMsg =
          err.response?.data?.errors ||
          [err.response?.data?.message] ||
          ["Failed to reset password. Please try again."];
        setErrors(Array.isArray(errorMsg) ? errorMsg : [errorMsg]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading State
  if (status === STATUS.LOADING) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f4fc] via-white to-[#fdf2f5] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#3F2965] to-[#DD1764] flex items-center justify-center shadow-lg">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-[#6B4D8A] font-medium">Verifying reset link...</p>
        </motion.div>
      </div>
    );
  }

  // Invalid Token State
  if (status === STATUS.INVALID) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f4fc] via-white to-[#fdf2f5] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-lg">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#3F2965] mb-2">Invalid Link</h2>
          <p className="text-[#6B4D8A]/70 mb-6">
            This password reset link is invalid or has already been used.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3F2965] to-[#DD1764] text-white font-bold rounded-xl hover:opacity-90 transition-all"
          >
            <ChevronLeft size={18} />
            Back to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  // Expired Token State
  if (status === STATUS.EXPIRED) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f4fc] via-white to-[#fdf2f5] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#3F2965] mb-2">Link Expired</h2>
          <p className="text-[#6B4D8A]/70 mb-6">
            This password reset link has expired. Please request a new one.
          </p>
          <div className="space-y-3">
            <Link
              to="/auth"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3F2965] to-[#DD1764] text-white font-bold rounded-xl hover:opacity-90 transition-all"
            >
              <RefreshCw size={18} />
              Request New Link
            </Link>
            <Link
              to="/auth"
              className="block text-sm text-[#6B4D8A] hover:text-[#DD1764] font-medium transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Success State
  if (status === STATUS.SUCCESS) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f4fc] via-white to-[#fdf2f5] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#3F2965]/5 to-[#DD1764]/5 pointer-events-none" />

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
            className="relative w-20 h-20 mx-auto mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 animate-ping" />
            <div className="relative w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
              <CheckCircle2 size={40} className="text-white" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl sm:text-3xl font-bold text-[#3F2965] mb-3"
          >
            Password Reset! 🎉
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-[#6B4D8A]/70 mb-6"
          >
            Your password has been successfully changed. You can now login with your new password.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#3F2965] to-[#DD1764] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              Continue to Login
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Reset Password Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4fc] via-white to-[#fdf2f5] flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DD1764]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3F2965]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img
              src={logo}
              alt="MindSettler"
              className="h-10 w-auto mx-auto transition-transform hover:scale-105"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#3F2965]/5 to-[#DD1764]/5 pointer-events-none" />

          <div className="relative">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#3F2965] to-[#DD1764] flex items-center justify-center shadow-lg">
                <KeyRound className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#3F2965] mb-2">
                Create New Password
              </h1>
              <p className="text-[#6B4D8A]/60 text-sm">
                Enter a new password for your account
              </p>
              {email && (
                <p className="text-[#3F2965] font-medium text-sm mt-2">
                  📧 {email}
                </p>
              )}
            </div>

            {/* Error Messages */}
            <AnimatePresence>
              {errors.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="p-4 bg-[#DD1764]/10 border border-[#DD1764]/20 rounded-2xl">
                    {errors.map((err, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-sm text-[#DD1764] font-medium"
                      >
                        <span className="mt-0.5">•</span>
                        <span>{err}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div>
                <Input
                  icon={<Lock size={18} />}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  label="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#6B4D8A]/40 hover:text-[#3F2965] transition-all p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
                <PasswordStrength password={password} />
              </div>

              {/* Confirm Password */}
              <Input
                icon={<Lock size={18} />}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                error={
                  confirmPassword && password !== confirmPassword
                    ? "Passwords do not match"
                    : null
                }
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[#6B4D8A]/40 hover:text-[#3F2965] transition-all p-1"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              {/* Password Requirements */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-[#6B4D8A]/60 mb-2">
                  Password Requirements:
                </p>
                <ul className="space-y-1">
                  {[
                    { check: password.length >= 6, text: "At least 6 characters" },
                    { check: /[A-Z]/.test(password), text: "One uppercase letter" },
                    { check: /[0-9]/.test(password), text: "One number" },
                    { check: /[^A-Za-z0-9]/.test(password), text: "One special character" },
                  ].map((req, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-2 text-xs ${
                        req.check ? "text-green-600" : "text-[#6B4D8A]/40"
                      }`}
                    >
                      {req.check ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-current" />
                      )}
                      {req.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting || password.length < 6 || password !== confirmPassword}
                type="submit"
                className="relative w-full py-4 px-6 mt-2 bg-gradient-to-r from-[#3F2965] via-[#5a3d8a] to-[#3F2965] bg-[length:200%_100%] bg-left hover:bg-right text-white font-bold rounded-xl sm:rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-[#3F2965]/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                {isSubmitting ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10">Reset Password</span>
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform relative z-10"
                    />
                  </>
                )}
              </motion.button>
            </form>

            {/* Back to Login */}
            <div className="text-center mt-6">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#6B4D8A] hover:text-[#DD1764] transition-colors"
              >
                <ChevronLeft size={16} />
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/50">
            <Shield size={14} className="text-green-500" />
            <span className="text-xs text-[#6B4D8A]/60 font-medium">
              Secure Connection
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;