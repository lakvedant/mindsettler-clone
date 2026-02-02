// pages/AuthPage.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Heart,
  Shield,
  Star,
  Loader2,
} from "lucide-react";
import API from "../api/axios";
import logo from "../assets/icons/MindsettlerLogo-removebg-preview.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login_img from "../assets/images/Login_img-removebg-preview.png";
import useIsMobile from "../hooks/useIsMobile";
import { AuthenticationSEO } from "../components/common/SEO";

// Feature badges component
const FeatureBadge = ({ icon: Icon, text, delay, isMobile = false }) => (
  <motion.div
    initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={isMobile ? {} : { delay, duration: 0.5 }}
    className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-white/50"
  >
    <Icon size={14} className="text-[#DD1764]" />
    <span className="text-[10px] sm:text-xs font-semibold text-[#3F2965]">
      {text}
    </span>
  </motion.div>
);

// Desktop Illustration Section
const IllustrationSection = ({ illustrationSrc }) => (
  <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#f8f4fc] via-[#fdf2f5] to-[#f5f0fa] items-center justify-center">
    {/* Decorative elements */}
    <div className="absolute inset-0">
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#3F2965]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#DD1764]/5 rounded-full blur-3xl" />
    </div>

    {/* Arch background */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="absolute bottom-0 w-70 xl:w-87.5 h-100 xl:h-125 bg-gradient-to-t from-[#F8D7DA] via-[#FADBD8] to-transparent rounded-t-full"
    />

    {/* Character Image */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      className="relative z-10"
    >
      {illustrationSrc && (
        <img
          src={illustrationSrc}
          alt="Login Illustration"
          className="w-75 xl:w-95 h-auto object-contain drop-shadow-2xl"
        />
      )}
    </motion.div>

    {/* Feature badges */}
    <div className="absolute top-1/4 left-10 flex flex-col gap-3">
      <FeatureBadge icon={Shield} text="Secure & Private" delay={0.8} />
      <FeatureBadge icon={Heart} text="Compassionate Care" delay={1} />
      <FeatureBadge icon={Star} text="Expert Therapists" delay={1.2} />
    </div>

    {/* Testimonial card */}
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.4, duration: 0.6 }}
      className="absolute bottom-20 right-10 max-w-50 p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50"
    >
      <div className="flex gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-[10px] text-[#3F2965]/70 italic leading-relaxed">
        "MindSettler helped me find peace in chaos. Truly life-changing!"
      </p>
      <p className="text-[9px] font-bold text-[#DD1764] mt-2">— Sarah K.</p>
    </motion.div>
  </div>
);

// Mobile Illustration - No animations on mobile
const MobileIllustration = ({ illustrationSrc }) => (
  <div className="lg:hidden relative w-full flex justify-center items-end py-6">
    {/* Arch background */}
    <div className="absolute bottom-0 w-40 h-52 sm:w-48 sm:h-60 bg-gradient-to-t from-[#F8D7DA] via-[#FADBD8] to-transparent rounded-t-full" />

    {/* Character */}
    <img
      src={illustrationSrc}
      alt="Illustration"
      className="relative z-10 w-36 sm:w-44 h-auto object-contain drop-shadow-xl"
    />
  </div>
);

// Enhanced Input Component
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
      {/* Glow effect on focus */}
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
            text-base font-medium
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

// Success Screen Component
const SuccessScreen = ({ type, onBack, email }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="w-full min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f8f4fc] via-white to-[#fdf2f5]"
  >
    <div className="w-full max-w-sm sm:max-w-md bg-white/80 backdrop-blur-xl p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/50 text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3F2965]/5 to-[#DD1764]/5 pointer-events-none" />

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
        className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#3F2965] to-[#DD1764] rounded-full opacity-20 animate-ping" />
        <div className="relative w-full h-full bg-gradient-to-br from-[#3F2965] to-[#DD1764] rounded-full flex items-center justify-center shadow-xl shadow-[#3F2965]/30">
          {type === "forgot" ? (
            <Mail size={32} className="text-white sm:w-10 sm:h-10" />
          ) : (
            <CheckCircle2 size={32} className="text-white sm:w-10 sm:h-10" />
          )}
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl sm:text-3xl font-bold text-[#3F2965] mb-3"
      >
        {type === "forgot" ? "Check Your Email" : "Welcome Aboard! 🎉"}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-[#6B4D8A]/70 mb-2 text-sm sm:text-base leading-relaxed"
      >
        {type === "forgot"
          ? "We've sent a password reset link to your email."
          : "Your account is ready. Redirecting you to your dashboard..."}
      </motion.p>

      {type === "forgot" && email && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-[#3F2965] font-medium text-sm mb-4"
        >
          📧 {email}
        </motion.p>
      )}

      {type === "forgot" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left"
        >
          <p className="text-xs text-amber-800 font-medium">
            💡 <strong>Tips:</strong>
          </p>
          <ul className="text-xs text-amber-700 mt-2 space-y-1 list-disc list-inside">
            <li>Check your spam/junk folder</li>
            <li>The link expires in 1 hour</li>
            <li>Make sure to use a strong password</li>
          </ul>
        </motion.div>
      )}

      {type === "forgot" ? (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#DD1764] hover:text-[#3F2965] transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Login
        </motion.button>
      ) : (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-1.5 bg-gradient-to-r from-[#3F2965] via-[#DD1764] to-[#3F2965] rounded-full overflow-hidden"
        />
      )}
    </div>
  </motion.div>
);

// Main Auth Page Component
const AuthPage = () => {
  const [view, setView] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  useEffect(() => {
    setErrors([]);
    setShowPassword(false);
  }, [view]);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrors([]);
    setIsSubmitting(true);

    const formData = Object.fromEntries(new FormData(e.target));

    // Determine endpoint based on view
    let endpoint;
    if (view === "login") {
      endpoint = "/user/login";
    } else if (view === "signup") {
      endpoint = "/user/signup";
    } else if (view === "forgot") {
      endpoint = "/user/auth/forgot-password";
    }

    try {
      const { data: resData } = await API.post(endpoint, formData);

      if (resData.success) {
        if (view === "forgot") {
          setForgotEmail(formData.email);
          setView("forgot-success");
        } else {
          setView("success");
          setTimeout(() => {
            setUser(resData.user);
            navigate("/");
          }, 2500);
        }
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors ||
        [err.response?.data?.message] ||
        ["Service unavailable. Please try again."];
      setErrors(Array.isArray(errorMsg) ? errorMsg : [errorMsg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success/Forgot Success screens
  if (view === "forgot-success" || view === "success") {
    return (
      <SuccessScreen
        type={view === "forgot-success" ? "forgot" : "success"}
        onBack={() => setView("login")}
        email={forgotEmail}
      />
    );
  }

  return (
    <>
    <AuthenticationSEO />
    <div className="relative min-h-screen w-full flex bg-gradient-to-br from-[#f8f4fc] via-white to-[#fdf2f5] overflow-hidden">
      {/* Mobile background decorations */}
      <div className="lg:hidden absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#DD1764]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3F2965]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative z-10 w-full flex flex-col lg:flex-row"
        >
          {/* === LEFT SECTION - FORM === */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-5 py-8 sm:px-8 md:px-12 lg:px-16 xl:px-24 min-h-screen lg:min-h-0">
            <div className="w-full max-w-md">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link to="/" className="inline-block mb-4 sm:mb-6">
                  <img
                    src={logo}
                    alt="MindSettler"
                    className="h-9 sm:h-11 w-auto transition-transform hover:scale-105"
                  />
                </Link>
              </motion.div>

              {/* Mobile Illustration */}
              <MobileIllustration illustrationSrc={Login_img} />

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 sm:mb-8"
              >
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#3F2965] mb-2 leading-tight">
                  {view === "login" && (
                    <>
                      Welcome Back!{" "}
                      <span className="inline-block animate-bounce">👋</span>
                    </>
                  )}
                  {view === "signup" && (
                    <>
                      Begin Your{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DD1764] to-[#3F2965]">
                        Journey
                      </span>
                    </>
                  )}
                  {view === "forgot" && (
                    <>
                      Forgot Password?{" "}
                      <span className="inline-block">🔐</span>
                    </>
                  )}
                </h1>
                <p className="text-[#6B4D8A]/60 text-sm sm:text-base">
                  {view === "login" &&
                    "Sign in to continue your mental wellness journey."}
                  {view === "signup" &&
                    "Create an account to start healing today."}
                  {view === "forgot" &&
                    "No worries! Enter your email and we'll send you a reset link."}
                </p>
              </motion.div>

              {/* Error Messages */}
              <AnimatePresence>
                {errors.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -10 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -10 }}
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
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Name field - signup only */}
                <AnimatePresence>
                  {view === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Input
                        icon={<User size={18} />}
                        placeholder="John Doe"
                        name="name"
                        label="Full Name"
                        autoComplete="name"
                        required
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email field */}
                <Input
                  icon={<Mail size={18} />}
                  type="email"
                  placeholder="you@example.com"
                  name="email"
                  label="Email Address"
                  autoComplete="email"
                  required
                />

                {/* Password field */}
                <AnimatePresence>
                  {view !== "forgot" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Input
                        icon={<Lock size={18} />}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        name="password"
                        label="Password"
                        autoComplete={
                          view === "signup"
                            ? "new-password"
                            : "current-password"
                        }
                        required
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-[#6B4D8A]/40 hover:text-[#3F2965] active:scale-90 transition-all p-1"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Forgot password link */}
                {view === "login" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-end"
                  >
                    <button
                      type="button"
                      onClick={() => setView("forgot")}
                      className="text-xs sm:text-sm text-[#3F2965] hover:text-[#DD1764] font-semibold transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 40px -15px rgba(63, 41, 101, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  type="submit"
                  className={`
                    relative w-full py-4 sm:py-4.5 px-6 mt-2
                    bg-gradient-to-r from-[#3F2965] via-[#5a3d8a] to-[#3F2965]
                    bg-[length:200%_100%] bg-left
                    hover:bg-right
                    text-white font-bold text-sm sm:text-base
                    rounded-xl sm:rounded-2xl
                    transition-all duration-500
                    flex items-center justify-center gap-3
                    shadow-xl shadow-[#3F2965]/20
                    disabled:opacity-70 disabled:cursor-not-allowed
                    overflow-hidden
                    group
                  `}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <span className="relative z-10">
                        {view === "login" && "Sign In"}
                        {view === "signup" && "Create Account"}
                        {view === "forgot" && "Send Reset Link"}
                      </span>
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform relative z-10"
                      />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#3F2965]/20 to-transparent" />
                <span className="text-xs text-[#6B4D8A]/40 font-medium">
                  OR
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#3F2965]/20 to-transparent" />
              </div>

              {/* Toggle View */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <p className="text-[#6B4D8A]/60 text-sm">
                  {view === "login" && "New to MindSettler? "}
                  {view === "signup" && "Already have an account? "}
                  {view === "forgot" && "Remember your password? "}
                  <button
                    type="button"
                    onClick={() =>
                      setView(
                        view === "login"
                          ? "signup"
                          : view === "signup"
                          ? "login"
                          : "login"
                      )
                    }
                    className="text-[#DD1764] font-bold hover:underline underline-offset-2 transition-all"
                  >
                    {view === "login" && "Create an account"}
                    {view === "signup" && "Sign in"}
                    {view === "forgot" && "Sign in"}
                  </button>
                </p>
              </motion.div>

              {/* Trust badges - Mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="lg:hidden flex items-center justify-center gap-4 mt-8 pt-6 border-t border-[#3F2965]/10"
              >
                <div className="flex items-center gap-1.5 text-[10px] text-[#6B4D8A]/50">
                  <Shield size={12} />
                  <span>Secure</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-[#6B4D8A]/20" />
                <div className="flex items-center gap-1.5 text-[10px] text-[#6B4D8A]/50">
                  <Heart size={12} />
                  <span>Private</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-[#6B4D8A]/20" />
                <div className="flex items-center gap-1.5 text-[10px] text-[#6B4D8A]/50">
                  <Star size={12} />
                  <span>Trusted</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* === RIGHT SECTION - ILLUSTRATION (Desktop) === */}
          <IllustrationSection illustrationSrc={Login_img} />
        </motion.div>
      </AnimatePresence>
    </div>
    </>
  );
};

export default AuthPage;