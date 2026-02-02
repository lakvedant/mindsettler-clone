import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  X,
  Mail,
  RefreshCw,
  Loader2,
  Sparkles,
  AlertCircle,
  Lock,
  LogIn,
  ArrowRight,
  UserPlus,
  UserCircle
} from "lucide-react";
import API from "../../api/axios";

const AuthLoadingSpinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-slate-100"></div>
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-[#3F2965] animate-spin"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3F2965] to-[#DD1764] flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <span className="font-bold text-slate-600">MindSettler</span>
      </div>
      <p className="text-sm text-slate-400">Loading...</p>
    </div>
  </div>
);

export const IsLoginUser = ({ user, loading, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoToLogin = () => {
    navigate("/auth", { state: { from: location.pathname } });
  };

  const handleGoToRegister = () => {
    navigate("/auth", { state: { from: location.pathname } });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (loading) {
    return <AuthLoadingSpinner />;
  }

  if (user) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Background Content (Blurred) */}
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>

      {/* Popup Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ touchAction: 'manipulation' }}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={handleGoHome}
        />

        {/* Popup Card */}
        <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={handleGoHome}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X size={20} />
          </button>

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3F2965] to-[#DD1764] flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800">MindSettler</span>
          </div>

          {/* Content */}
          <div className="text-center">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#3F2965] to-[#DD1764] flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Lock className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Login Required
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Please log in to access this page
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGoToLogin}
                className="w-full py-3 bg-gradient-to-r from-[#3F2965] to-[#DD1764] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:opacity-90 transition-all active:scale-[0.98]"
              >
                <LogIn size={18} />
                Login
                <ArrowRight size={16} />
              </button>

              <button
                onClick={handleGoToRegister}
                className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
              >
                <UserPlus size={18} />
                Create Account
              </button>

              <button
                onClick={handleGoBack}
                className="w-full py-2 text-slate-400 text-sm hover:text-slate-600 transition-colors"
              >
                ← Go Back
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-slate-300 mt-6">
            🔒 Your data is secure with us
          </p>
        </div>
      </div>
    </>
  );
};

export const IsVerifiedUser = ({ user, children }) => {
  const navigate = useNavigate();
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSendVerification = async () => {
    setVerificationLoading(true);
    try {
      await API.post("/user/auth/send-verification-email");
      setVerificationSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send verification email.");
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setVerificationSent(false);
    setVerificationLoading(true);
    try {
      await API.post("/auth/send-verification-email");
      setVerificationSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend verification email.");
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  // If no user, let IsLoginUser handle it - just render children
  if (!user) {
    return <>{children}</>;
  }

  if (user.isVerified) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Background Content (Blurred) */}
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>

      {/* Popup Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ touchAction: 'manipulation' }}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={handleGoHome}
        />

        {/* Popup Card */}
        <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={handleGoHome}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X size={20} />
          </button>

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3F2965] to-[#DD1764] flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800">MindSettler</span>
          </div>

          {/* Content */}
          <div className="text-center">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Mail className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Verify Your Email
            </h2>
            <p className="text-slate-500 text-sm mb-1">
              Please verify your email to access this page
            </p>
            
            {/* User Email */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full mb-6">
              <Mail size={14} className="text-slate-400" />
              <span className="text-slate-600 text-xs font-medium">
                {user?.email}
              </span>
            </div>

            {/* Verification Status */}
            {verificationSent ? (
              <div className="space-y-4">
                {/* Success Message */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                    <CheckCircle size={20} />
                    <span className="font-bold">Email Sent!</span>
                  </div>
                  <p className="text-green-600 text-sm">
                    We've sent a verification link to your email.
                  </p>
                </div>

                {/* Instructions */}
                <div className="bg-slate-50 rounded-xl p-4 text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Next Steps
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <Inbox size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      <span>Check your inbox for the verification email</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                      <span>Don't forget to check your spam folder</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                      <span>Click the link to verify your email</span>
                    </div>
                  </div>
                </div>

                {/* Resend Button */}
                <button
                  onClick={handleResendVerification}
                  disabled={verificationLoading}
                  className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                  {verificationLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <RefreshCw size={18} />
                  )}
                  {verificationLoading ? "Sending..." : "Resend Email"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Info Box */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Email not verified
                      </p>
                      <p className="text-xs text-amber-600 mt-1">
                        Verify your email to access all features and keep your account secure.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Send Verification Button */}
                <button
                  onClick={handleSendVerification}
                  disabled={verificationLoading}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:opacity-90 transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                  {verificationLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Mail size={18} />
                  )}
                  {verificationLoading ? "Sending..." : "Send Verification Email"}
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-4 space-y-2">
              <button
                onClick={handleGoBack}
                className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                Go Back
              </button>

              <button
                onClick={handleGoHome}
                className="w-full py-2 text-slate-400 text-sm hover:text-slate-600 transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-slate-300 mt-6">
            🔒 Your data is secure with us
          </p>
        </div>
      </div>
    </>
  );
};

export const IsProfileCompleteUser = ({ user, children, requiredFields = ["name", "phone", "gender"] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const getMissingFields = () => {
    if (!user) return [];
    return requiredFields.filter((field) => {
      const value = user[field];
      return !value || (typeof value === "string" && value.trim() === "");
    });
  };

  const formatFieldName = (field) => {
    const fieldNames = {
      name: "Full Name",
      phone: "Phone Number",
      gender: "Gender",
      email: "Email Address",
      address: "Address",
      dateOfBirth: "Date of Birth",
      occupation: "Occupation",
      emergencyContact: "Emergency Contact",
    };
    return fieldNames[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      setIsAdmin(true);
    }
  }, [user]);

  const handleGoToProfile = () => {
    navigate(isAdmin ? "/admin#profile" : "/profile#profile", { state: { from: location.pathname, edit: true } });
  };
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  // If no user, let IsLoginUser handle it - just render children
  if (!user) {
    return <>{children}</>;
  }

  if (user.profileIsComplete) {
    return <>{children}</>;
  }

  const missingFields = getMissingFields();

  return (
    <>
      {/* Background Content (Blurred) */}
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>

      {/* Popup Overlay */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ touchAction: 'manipulation' }}>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleGoHome}
          />

          {/* Popup Card */}
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleGoHome}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3F2965] to-[#DD1764] flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-bold text-slate-800">MindSettler</span>
            </div>

            {/* Content */}
            <div className="text-center">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <UserCircle className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                Complete Your Profile
              </h2>
              <p className="text-slate-500 text-sm mb-4">
                Please complete your profile to access this page
              </p>

              {/* Missing Fields */}
              {missingFields.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Missing Information
                  </p>
                  <div className="space-y-2">
                    {missingFields.map((field) => (
                      <div
                        key={field}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <AlertCircle size={14} className="text-amber-500 shrink-0" />
                        <span>{formatFieldName(field)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleGoToProfile}
                  className="w-full py-3 bg-gradient-to-r from-[#3F2965] to-[#DD1764] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:opacity-90 transition-all active:scale-[0.98]"
                >
                  <UserCircle size={18} />
                  Complete Profile
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={handleGoBack}
                  className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  Go Back
                </button>

                <button
                  onClick={handleGoHome}
                  className="w-full py-2 text-slate-400 text-sm hover:text-slate-600 transition-colors"
                >
                  ← Back to Home
                </button>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-[10px] text-slate-300 mt-6">
              🔒 Your data is secure with us
            </p>
          </div>
        </div>
      )}
    </>
  );
};
