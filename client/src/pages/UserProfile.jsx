import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import {
  User,
  Wallet,
  LogOut,
  Plus,
  Loader2,
  Save,
  CreditCard,
  CalendarCheck,
  X,
  AlertCircle,
  ArrowDownLeft,
  Clock,
  Hash,
  MessageSquare,
  CheckCircle2,
  Copy,
  Video,
  CalendarPlus,
  Menu,
  ChevronRight,
  Sparkles,
  Shield,
  Heart,
  ArrowRight,
  Edit3,
  Phone,
  Mail,
  UserCheck,
  IndianRupee,
  QrCode,
  Smartphone,
  Check
} from "lucide-react";
import Logo from "../assets/icons/MindsettlerLogo-removebg-preview.png";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { ProfileSEO } from "../components/common/SEO";
import { IsLoginUser, IsVerifiedUser } from "../components/auth/Verification";

// --- ANIMATED BACKGROUND COMPONENT ---
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3F2965]/5 rounded-full blur-3xl animate-pulse" />
    <div className="absolute top-1/2 -left-20 w-60 h-60 bg-[#Dd1764]/5 rounded-full blur-3xl animate-pulse delay-1000" />
    <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-[#3F2965]/3 rounded-full blur-3xl animate-pulse delay-500" />
  </div>
);



// --- 1. USER PROFILE VIEW ---
const UserProfileView = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.patch("/user/profile", formData);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.errors ||
          "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#3F2965] via-[#5a3e8c] to-[#3F2965] p-6 sm:p-8 lg:p-10 rounded-3xl text-white shadow-2xl">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#Dd1764]/20 rounded-full translate-y-1/2 -translate-x-1/2" />
        <Sparkles className="absolute top-6 right-6 text-white/20 w-8 h-8" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar with Ring */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#Dd1764] to-[#ff6b9d] rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-inner">
              {formData.name?.charAt(0) || "U"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-400 rounded-full border-4 border-[#3F2965] flex items-center justify-center">
              <CheckCircle2 size={14} className="text-white" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{formData.name}</h2>
              <Shield size={20} className="text-[#Dd1764]" />
            </div>
            <p className="text-white/60 text-sm font-medium mb-4 break-all">{user.email}</p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              
              <span className="px-4 py-1.5 bg-[#Dd1764]/20 text-[#ff9ec4] text-[10px] font-black uppercase rounded-full tracking-wider border border-[#Dd1764]/30 flex items-center gap-1.5">
                <Heart size={12} /> Verified
              </span>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
              isEditing 
                ? "bg-white/20 text-white border border-white/30" 
                : "bg-white text-[#3F2965] hover:bg-white/90 shadow-lg hover:shadow-xl hover:scale-105"
            }`}
          >
            {isEditing ? <X size={16} /> : <Edit3 size={16} />}
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

 

      {/* Profile Form Card */}
      <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-slate-100/50 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3F2965] to-[#5a3e8c] flex items-center justify-center">
            <UserCheck size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-black text-[#3F2965] text-lg">Personal Information</h3>
            <p className="text-xs text-slate-400">Manage your account details</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name Field */}
            <div className="group">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
                <User size={12} /> Full Name
              </label>
              <div className="relative">
                <input
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full p-4 bg-slate-50/80 border-2 rounded-xl font-medium text-base transition-all duration-300 ${
                    isEditing 
                      ? "border-[#3F2965]/20 focus:border-[#3F2965] focus:bg-white focus:shadow-lg" 
                      : "border-transparent opacity-70"
                  }`}
                />
                {isEditing && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Edit3 size={14} className="text-slate-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="group">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
                <Mail size={12} /> Email Address
              </label>
              <div className="relative">
                <input
                  disabled
                  value={user.email}
                  className="w-full p-4 bg-slate-50/80 border-2 border-transparent rounded-xl font-medium text-base opacity-60 cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Shield size={14} className="text-green-400" />
                </div>
              </div>
            </div>

            {/* Phone Field */}
            <div className="group">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
                <Phone size={12} /> Phone Number
              </label>
              <div className="relative">
                <input
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className={`w-full p-4 bg-slate-50/80 border-2 rounded-xl font-medium text-base transition-all duration-300 ${
                    isEditing 
                      ? "border-[#3F2965]/20 focus:border-[#3F2965] focus:bg-white focus:shadow-lg" 
                      : "border-transparent opacity-70"
                  }`}
                />
              </div>
            </div>

            {/* Gender Field */}
            <div className="group">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
                <User size={12} /> Gender
              </label>
              <div className="relative">
                <select
                  disabled={!isEditing}
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className={`w-full p-4 bg-slate-50/80 border-2 rounded-xl font-medium text-base transition-all duration-300 appearance-none cursor-pointer ${
                    isEditing 
                      ? "border-[#3F2965]/20 focus:border-[#3F2965] focus:bg-white focus:shadow-lg" 
                      : "border-transparent opacity-70"
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronRight size={16} className="text-slate-400 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#3F2965] to-[#5a3e8c] text-white rounded-xl font-black flex justify-center items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          )}
        </form>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link 
          to="/booking"
          className="group relative overflow-hidden bg-gradient-to-br from-[#Dd1764] to-[#ff6b9d] p-6 rounded-2xl text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <CalendarPlus size={24} />
            </div>
            <div>
              <h4 className="font-black text-lg">Book a Session</h4>
              <p className="text-white/70 text-sm">Start your healing journey</p>
            </div>
            <ArrowRight className="ml-auto group-hover:translate-x-2 transition-transform" />
          </div>
        </Link>

        
      </div>
    </div>
  );
};

// --- 2. WALLET VIEW ---
const WalletView = ({ user }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ amount: "", transactionId: "" });
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Payment, 2: Verify

  // Your UPI Details - Update these with actual values
  const upiDetails = {
    upiId: import.meta.env.VITE_UPI_ID,
    name: "MindSettler Wellness",
    merchantCode: "MINDSETTLER",
  };

  // Generate QR Code URL (using a QR code API)
  const generateQRCodeURL = (amount) => {
    const upiString = `upi://pay?pa=${upiDetails.upiId}&pn=${encodeURIComponent(
      upiDetails.name
    )}&am=${amount || ""}&cu=INR&tn=${encodeURIComponent("Wallet Topup")}`;
    
    // Using QR Server API (free)
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      upiString
    )}`;
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/transactions/user-wallet-transactions");
        setTransactions(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(upiDetails.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleTopup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/transactions/create-transaction", {
        amount: formData.amount,
        transactionId: formData.transactionId,
        type: "credit",
      });
      alert("Request Sent! Pending admin approval.");
      setShowPopup(false);
      setFormData({ amount: "", transactionId: "" });
      setCurrentStep(1);
      const res = await API.get("/transactions/user-wallet-transactions");
      setTransactions(res.data.data || []);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.errors ||
          "Transaction failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setCurrentStep(1);
    setFormData({ amount: "", transactionId: "" });
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-600 border-red-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  // Quick amount buttons
  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Balance Card - Enhanced */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#3F2965] via-[#5a3e8c] to-[#3F2965] p-6 sm:p-8 lg:p-10 rounded-3xl text-white shadow-2xl">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#Dd1764]/20 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45" />

        {/* Card Icon */}
        <div className="absolute top-6 right-6 opacity-20">
          <CreditCard size={80} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={20} className="text-[#Dd1764]" />
            <p className="text-purple-200 text-xs font-bold uppercase tracking-widest">
              Total Balance
            </p>
          </div>

          <div className="flex items-baseline gap-1 sm:gap-2 mb-2">
            <span className="text-purple-300 text-xl sm:text-2xl">₹</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
              {user?.walletBalance || "0"}
            </h2>
            <span className="text-purple-300 text-base sm:text-lg">.00</span>
          </div>

          <p className="text-purple-300 text-xs sm:text-sm mb-6 sm:mb-8">Available for sessions</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowPopup(true)}
              className="flex-1 sm:flex-none px-8 py-4 bg-[#Dd1764] text-white rounded-2xl font-black text-sm shadow-lg hover:bg-[#c41458] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Plus
                size={18}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
              Add Money
            </button>
          </div>
        </div>

        {/* Card Chip Design */}
        <div className="absolute bottom-6 right-6 flex items-center gap-4 opacity-30">
          <div className="w-12 h-10 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500" />
          <div className="flex gap-1">
            <div className="w-8 h-8 rounded-full border-2 border-white/50" />
            <div className="w-8 h-8 rounded-full border-2 border-white/50 -ml-4" />
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-100/50 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3F2965] to-[#5a3e8c] flex items-center justify-center">
              <Clock size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-[#3F2965]">Transaction History</h3>
              <p className="text-xs text-slate-400">
                {transactions.length} transactions
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {historyLoading ? (
            <div className="p-16 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-[#3F2965] mb-3" size={32} />
              <p className="text-sm text-slate-400">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Wallet size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-bold mb-2">No transactions yet</p>
              <p className="text-slate-400 text-sm">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            transactions.map((txn, index) => {
              const isRejected = txn.status?.toLowerCase() === "rejected";
              const isPending = txn.status?.toLowerCase() === "pending";
              const isCredit = txn.type === "credit";

              return (
                <div
                  key={txn._id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-slate-50/50 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Top Row: Icon, Title, Amount */}
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    {/* Transaction Icon */}
                    <div
                      className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                        isRejected
                          ? "bg-red-100"
                          : isPending
                          ? "bg-amber-100"
                          : isCredit
                          ? "bg-green-100"
                          : "bg-pink-100"
                      }`}
                    >
                      {isRejected ? (
                        <X size={18} className="text-red-600 sm:w-5 sm:h-5" />
                      ) : isPending ? (
                        <Clock size={18} className="text-amber-600 sm:w-5 sm:h-5" />
                      ) : isCredit ? (
                        <ArrowDownLeft size={18} className="text-green-600 sm:w-5 sm:h-5" />
                      ) : (
                        <CalendarCheck size={18} className="text-[#Dd1764] sm:w-5 sm:h-5" />
                      )}
                    </div>

                    {/* Transaction Title & Status */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 sm:mb-1 flex-wrap">
                        <p className="font-bold text-[#3F2965] text-sm sm:text-base truncate">
                          {isCredit ? "Wallet Deposit" : "Session Payment"}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase border shrink-0 ${getStatusStyles(
                            txn.status
                          )}`}
                        >
                          {txn.status}
                        </span>
                      </div>
                    </div>

                    {/* Amount - Visible on mobile in top row */}
                    <div className="text-right shrink-0 sm:hidden">
                      <p
                        className={`text-base font-black ${
                          isRejected
                            ? "text-slate-400 line-through"
                            : isPending
                            ? "text-amber-500"
                            : isCredit
                            ? "text-green-600"
                            : "text-[#3F2965]"
                        }`}
                      >
                        {isRejected || isPending ? "" : isCredit ? "+" : "-"}₹
                        {txn.amount}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Row: Date and Reference - Mobile */}
                  <div className="flex items-center justify-between sm:flex-1 pl-11 sm:pl-0">
                    <div className="flex items-center gap-2 sm:gap-3 text-[10px] text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <CalendarCheck size={10} />
                        {new Date(txn.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1 font-mono truncate max-w-[100px] sm:max-w-none">
                        <Hash size={10} className="text-[#Dd1764] shrink-0" />
                        <span className="truncate">{txn.referenceId?.toUpperCase()}</span>
                      </span>
                    </div>

                    {/* Amount - Desktop */}
                    <div className="text-right hidden sm:block">
                      <p
                        className={`text-lg font-black ${
                          isRejected
                            ? "text-slate-400 line-through"
                            : isPending
                            ? "text-amber-500"
                            : isCredit
                            ? "text-green-600"
                            : "text-[#3F2965]"
                        }`}
                      >
                        {isRejected || isPending ? "" : isCredit ? "+" : "-"}₹
                        {txn.amount}
                      </p>
                      <p className="text-[9px] font-mono text-slate-300">
                        {txn.transactionId}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Top-up Popup with UPI & QR Options */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-[#3F2965]/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={handleClosePopup}
        >
          <div
            className="bg-white w-full sm:max-w-lg rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[95vh] overflow-y-auto mb-16 sm:mb-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#3F2965] to-[#5a3e8c] p-6 text-white">
              <button
                onClick={handleClosePopup}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Plus size={24} />
                </div>
                <div>
                  <h3 className="font-black text-xl">Add Money</h3>
                  <p className="text-purple-200 text-sm">
                    Step {currentStep} of 2
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex gap-2 mt-4">
                <div
                  className={`flex-1 h-1 rounded-full ${
                    currentStep >= 1 ? "bg-[#Dd1764]" : "bg-white/20"
                  }`}
                />
                <div
                  className={`flex-1 h-1 rounded-full ${
                    currentStep >= 2 ? "bg-[#Dd1764]" : "bg-white/20"
                  }`}
                />
              </div>
            </div>

            {/* Step 1: Payment Options */}
            {currentStep === 1 && (
              <div className="p-6 space-y-5">
                {/* Amount Input */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
                    <IndianRupee size={12} /> Enter Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      placeholder="0"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-2xl focus:border-[#3F2965] focus:bg-white transition-all text-center"
                    />
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="flex gap-2 mt-3">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, amount: amt.toString() })
                        }
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                          formData.amount === amt.toString()
                            ? "bg-[#3F2965] text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs font-bold text-slate-400">
                    PAY USING
                  </span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* QR Code Section */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <QrCode size={18} className="text-[#3F2965]" />
                    <span className="font-bold text-[#3F2965]">
                      Scan QR Code
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    {/* QR Code */}
                    <div className="bg-white p-3 rounded-2xl shadow-lg mb-4">
                      {formData.amount ? (
                        <img
                          src={generateQRCodeURL(formData.amount)}
                          alt="Payment QR Code"
                          className="w-44 h-44 rounded-lg"
                        />
                      ) : (
                        <div className="w-44 h-44 bg-slate-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <QrCode
                              size={40}
                              className="text-slate-300 mx-auto mb-2"
                            />
                            <p className="text-xs text-slate-400">
                              Enter amount
                              <br />
                              to generate QR
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {formData.amount && (
                      <p className="text-sm text-slate-500 mb-2">
                        Scan & pay{" "}
                        <span className="font-bold text-[#3F2965]">
                          ₹{formData.amount}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* OR Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs font-bold text-slate-400">OR</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* UPI ID Section */}
                <div className="bg-gradient-to-br from-[#3F2965]/5 to-[#Dd1764]/5 rounded-2xl p-5 border border-[#3F2965]/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Smartphone size={18} className="text-[#Dd1764]" />
                    <span className="font-bold text-[#3F2965]">
                      Pay via UPI ID
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-4 flex items-center justify-between border border-slate-200">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                        UPI ID
                      </p>
                      <p className="font-mono font-bold text-[#3F2965] text-lg">
                        {upiDetails.upiId}
                      </p>
                    </div>
                    <button
                      onClick={handleCopyUPI}
                      className={`p-3 rounded-xl transition-all ${
                        copied
                          ? "bg-green-100 text-green-600"
                          : "bg-slate-100 text-slate-600 hover:bg-[#3F2965] hover:text-white"
                      }`}
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>

                  {copied && (
                    <p className="text-green-600 text-xs font-bold mt-2 text-center">
                      ✓ UPI ID copied to clipboard!
                    </p>
                  )}
                </div>

                {/* Info Note */}
                <div className="bg-amber-50 p-4 rounded-xl flex gap-3 items-start border border-amber-100">
                  <AlertCircle
                    size={18}
                    className="text-amber-500 shrink-0 mt-0.5"
                  />
                  <p className="text-amber-700 text-xs leading-relaxed">
                    After completing payment, click "I've Made Payment" and
                    enter your 12-digit UTR/Transaction ID for verification.
                  </p>
                </div>

                {/* Continue Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.amount) {
                      alert("Please enter amount first");
                      return;
                    }
                    setCurrentStep(2);
                  }}
                  disabled={!formData.amount}
                  className="w-full py-4 bg-gradient-to-r from-[#3F2965] to-[#Dd1764] text-white rounded-xl font-black flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  I've Made Payment
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            )}

            {/* Step 2: Verify Transaction */}
            {currentStep === 2 && (
              <form onSubmit={handleTopup} className="p-6 space-y-5">
                {/* Payment Summary */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Check size={16} className="text-green-600" />
                    </div>
                    <span className="font-bold text-green-700">
                      Payment Made
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">Amount Paid</span>
                    <span className="font-black text-2xl text-[#3F2965]">
                      ₹{formData.amount}
                    </span>
                  </div>
                </div>

                {/* Transaction ID Input */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
                    <Hash size={12} /> UTR / Transaction ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter 12-digit UTR number"
                    value={formData.transactionId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transactionId: e.target.value,
                      })
                    }
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-lg focus:border-[#3F2965] focus:bg-white transition-all font-mono tracking-wider text-center"
                    maxLength={20}
                  />
                  <p className="text-[10px] text-slate-400 mt-2 text-center">
                    You can find the UTR/Reference ID in your payment app's
                    transaction history
                  </p>
                </div>

                {/* Where to find UTR */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
                    <AlertCircle size={14} className="text-[#Dd1764]" />
                    Where to find UTR?
                  </p>
                  <div className="space-y-2 text-xs text-slate-500">
                    <p className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                        1
                      </span>
                      Open your UPI app (GPay, PhonePe, Paytm)
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                        2
                      </span>
                      Go to Transaction History
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                        3
                      </span>
                      Click on the payment you just made
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                        4
                      </span>
                      Copy the UTR/UPI Ref. No./Transaction ID
                    </p>
                  </div>
                </div>

                {/* Security Note */}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Shield size={14} className="text-green-500" />
                  <span>
                    Your transaction details are securely encrypted
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formData.transactionId}
                    className="flex-[2] py-4 bg-gradient-to-r from-[#3F2965] to-[#Dd1764] text-white rounded-xl font-black flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        Verify & Submit
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Safe area padding */}
            <div className="h-6 sm:h-0" />
          </div>
        </div>
      )}
    </div>
  );
};

// --- 3. MY BOOKINGS VIEW ---
const MyBookingsView = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await API.get("/appointment/my-sessions");
        setSessions(res.data.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Meeting link copied to clipboard!");
  };

  const getGoogleCalendarLink = (session) => {
    if (!session?.availabilityRef?.date || !session?.timeSlot) return "#";

    const base = "https://www.google.com/calendar/render?action=TEMPLATE";
    const title = `&text=${encodeURIComponent(
      "MindSettler: " + (session.therapyType || "Therapy Session")
    )}`;
    const details = `&details=${encodeURIComponent(
      session.notes || "No notes provided."
    )}`;
    const location = session.meetLink
      ? `&location=${encodeURIComponent(session.meetLink)}`
      : "";
    const timezone = `&ctz=Asia/Kolkata`;

    try {
      const dateStr = session.availabilityRef.date;
      const timeStr = session.timeSlot;
      const [year, month, day] = dateStr.split("-").map(Number);
      const [hours, minutes] = timeStr.split(":").map(Number);
      const start = new Date(year, month - 1, day, hours, minutes);
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      const formatGCalDate = (date) => {
        const pad = (num) => String(num).padStart(2, "0");
        return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(
          date.getDate()
        )}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(
          date.getSeconds()
        )}`;
      };

      const dates = `&dates=${formatGCalDate(start)}/${formatGCalDate(end)}`;
      return `${base}${title}${dates}${details}${location}${timezone}`;
    } catch (error) {
      console.error("Error generating Calendar Link:", error);
      return "#";
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return { color: "from-green-500 to-emerald-400", bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 };
      case "completed":
        return { color: "from-blue-500 to-indigo-400", bg: "bg-blue-100", text: "text-blue-700", icon: CheckCircle2 };
      case "rejected":
        return { color: "from-red-500 to-rose-400", bg: "bg-red-100", text: "text-red-600", icon: X };
      default:
        return { color: "from-amber-500 to-orange-400", bg: "bg-amber-100", text: "text-amber-700", icon: Clock };
    }
  };

  const filteredSessions = activeFilter === "all" 
    ? sessions 
    : sessions.filter(s => s.status?.toLowerCase() === activeFilter);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#3F2965] mb-4" size={48} />
        <p className="text-slate-400 font-medium">Loading your sessions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Stats */}
      <div className="bg-gradient-to-br from-[#3F2965] via-[#5a3e8c] to-[#3F2965] p-6 sm:p-8 rounded-3xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#Dd1764]/20 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Heart size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-black truncate">My Healing Journey</h2>
              <p className="text-purple-200 text-xs sm:text-sm truncate">Track your progress and sessions</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center border border-white/10">
              <p className="text-xl sm:text-3xl font-black">{sessions.length}</p>
              <p className="text-purple-200 text-[10px] sm:text-xs font-bold uppercase">Total</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center border border-white/10">
              <p className="text-xl sm:text-3xl font-black">{sessions.filter(s => s.status === "completed").length}</p>
              <p className="text-purple-200 text-[10px] sm:text-xs font-bold uppercase">Done</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center border border-white/10">
              <p className="text-xl sm:text-3xl font-black">{sessions.filter(s => s.status === "rejected").length}</p>
              <p className="text-purple-200 text-[10px] sm:text-xs font-bold uppercase">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {["all", "confirmed", "completed", "rejected"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
              activeFilter === filter
                ? "bg-gradient-to-r from-[#3F2965] to-[#5a3e8c] text-white shadow-lg"
                : "bg-white/80 text-slate-500 hover:bg-slate-100 border border-slate-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="py-16 text-center bg-white/80 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="text-slate-300" size={40} />
          </div>
          <p className="text-slate-500 font-bold text-lg mb-2">No sessions found</p>
          <p className="text-slate-400 text-sm mb-6">
            {activeFilter === "all" 
              ? "Start your healing journey by booking a session" 
              : `No ${activeFilter} sessions yet`}
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#Dd1764] to-[#ff6b9d] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <CalendarPlus size={18} />
            Book Your First Session
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {filteredSessions.map((session, index) => {
            const statusConfig = getStatusConfig(session.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div
                key={session._id}
                className="group bg-white/80 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-slate-100/50 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Decorative Gradient */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${statusConfig.color}`} />
                
                {/* ID Badge - Hidden on very small screens */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-slate-50 rounded-md sm:rounded-lg">
                  <Hash size={8} className="text-[#Dd1764] sm:w-2.5 sm:h-2.5" />
                  <span className="text-[7px] sm:text-[9px] font-mono text-slate-400 max-w-[60px] sm:max-w-none truncate">{session._id.slice(-8).toUpperCase()}</span>
                </div>

                {/* Status & Type Header */}
                <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4 mt-1">
                  <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl shrink-0 ${statusConfig.bg} group-hover:scale-110 transition-transform duration-300`}>
                    <StatusIcon size={16} className={`${statusConfig.text} sm:w-5 sm:h-5`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${statusConfig.bg} ${statusConfig.text}`}>
                        {session.status}
                      </span>
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
                        session.sessionType === "online" 
                          ? "bg-indigo-100 text-indigo-600" 
                          : "bg-pink-100 text-[#Dd1764]"
                      }`}>
                        {session.sessionType || "Online"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Session Title & Details */}
                <div className="mb-4">
                  <h4 className="font-black text-[#3F2965] text-base sm:text-lg md:text-xl mb-2 leading-tight">
                    {session.therapyType || "Personalized Counseling"}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-50 rounded-lg">
                      <CalendarCheck size={12} className="text-[#Dd1764] sm:w-3.5 sm:h-3.5" />
                      <span className="text-[10px] sm:text-xs font-bold text-slate-600">
                        {new Date(session.availabilityRef?.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-50 rounded-lg">
                      <Clock size={12} className="text-[#Dd1764] sm:w-3.5 sm:h-3.5" />
                      <span className="text-[10px] sm:text-xs font-bold text-slate-600">{session.timeSlot}</span>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                {session.notes && (
                  <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-purple-50/30 rounded-xl sm:rounded-2xl border border-slate-100/50">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <MessageSquare size={10} className="text-[#3F2965] sm:w-3 sm:h-3" />
                      <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Notes</p>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed italic line-clamp-2">
                      "{session.notes}"
                    </p>
                  </div>
                )}

                {/* Google Meet Section */}
                {session.status === "confirmed" && session.sessionType === "online" && (
                  <div className="mb-4">
                    {session.meetLink ? (
                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">
                              Meeting Room Ready
                            </p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(session.meetLink)}
                            className="p-2 hover:bg-white rounded-lg text-indigo-400 transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={session.meetLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg hover:shadow-xl transition-all duration-300 group"
                          >
                            <Video size={14} className="group-hover:scale-110 transition-transform sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Join</span> Session
                          </a>
                          <a
                            href={getGoogleCalendarLink(session)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white text-indigo-600 border-2 border-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-indigo-50 transition-all"
                          >
                            <CalendarPlus size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-2xl text-center border border-dashed border-slate-200">
                        <Clock size={20} className="text-slate-300 mx-auto mb-2" />
                        <p className="text-[11px] font-bold text-slate-400">
                          Meeting link will be shared 15 minutes before the session
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <Sparkles size={12} className="text-[#Dd1764] shrink-0 sm:w-3.5 sm:h-3.5" />
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 truncate">
                      {session.status === "completed" ? "Session completed" : "Your journey continues"}
                    </span>
                  </div>
                  
                  {session.status === "pending" && (
                    <button className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase text-[#Dd1764] hover:gap-2 transition-all shrink-0">
                      Reschedule <ChevronRight size={10} className="sm:w-3 sm:h-3" />
                    </button>
                  )}
                  
                  {session.status === "completed" && (
                    <div className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-50 rounded-full shrink-0">
                      <CheckCircle2 size={10} className="text-green-600 sm:w-3 sm:h-3" />
                      <span className="text-[9px] sm:text-[10px] font-black text-green-600 uppercase">Done</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      
    </div>
  );
};

// --- MOBILE SIDEBAR COMPONENT ---
const MobileSidebar = ({
  isOpen,
  onClose,
  menuItems,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-[#3F2965]/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 lg:hidden transform transition-transform duration-300 ease-out shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <Link to="/" onClick={onClose}>
            <img src={Logo} className="w-28" alt="MindSettler" />
          </Link>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <a
                key={item.name}
                href={`#${encodeURIComponent(item.name)}`}
                onClick={() => {
                  setActiveTab(item.name);
                  onClose();
                }}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#3F2965] to-[#5a3e8c] text-white shadow-lg"
                    : "text-slate-500 hover:text-[#3F2965] hover:bg-slate-50"
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? "bg-white/20" : "bg-slate-100"}`}>
                  <Icon size={16} className={isActive ? "text-white" : "text-[#3F2965]"} />
                </div>
                {item.name}
                {isActive && <ChevronRight className="ml-auto" size={16} />}
              </a>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-white">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-red-100">
              <LogOut size={16} />
            </div>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

// --- BOTTOM NAVIGATION FOR MOBILE ---
const BottomNavigation = ({ menuItems, activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 z-30 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          return (
            <a
              key={item.name}
              href={`#${encodeURIComponent(item.name)}`}
              onClick={() => setActiveTab(item.name)}
              className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive ? "text-[#Dd1764]" : "text-slate-400"
              }`}
            >
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-[#Dd1764] to-[#ff6b9d] rounded-full" />
              )}
              <div className={`p-2 rounded-xl transition-all ${isActive ? "bg-pink-50 scale-110" : ""}`}>
                <Icon size={20} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-tight">
                {item.name.replace("My ", "")}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

// --- MAIN USER DASHBOARD (Continued) ---
const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser, loading: authLoading } = useAuth();

  const menuItems = [
    { name: "Profile", icon: User },
    { name: "My Wallet", icon: Wallet },
    { name: "My Bookings", icon: CalendarCheck },
  ];

  useEffect(() => {
    const syncTabFromHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace("#", ""));
      const matched = menuItems.find((item) => item.name === hash);
      setActiveTab(matched ? matched.name : "Profile");
    };
    syncTabFromHash();
    window.addEventListener("hashchange", syncTabFromHash);
    return () => window.removeEventListener("hashchange", syncTabFromHash);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = useCallback(() => {
    setIsMobileMenuOpen(false);
    navigate("/logout");
  }, [navigate]);

  // Show loading state while auth is being checked
  if (authLoading) {
    return null; // IsLoginUser will show loading spinner
  }

  // Redirect non-users to auth page only after loading is complete
  if (!user || user.role !== "user") return <Navigate to="/auth" />;

  return (
    <IsLoginUser user={user} loading={authLoading}>
      <IsVerifiedUser user={user}>
      <ProfileSEO />
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 font-sans relative">
        {/* Animated Background */}
        <AnimatedBackground />

        {/* Desktop Sidebar - Enhanced */}
        <aside className="hidden lg:flex w-72 bg-white/80 backdrop-blur-xl border-r border-slate-100/50 flex-col fixed h-full z-20 shadow-xl">
          {/* Logo Section */}
          <div className="p-6 border-b border-slate-100/50">
            <Link
              to="/"
              className="block transition-transform hover:scale-105 duration-300"
            >
              <img src={Logo} className="w-40" alt="MindSettler" />
            </Link>
          </div>

          {/* User Mini Profile */}
          <div className="p-5 border-b border-slate-100/50">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-purple-50/50 rounded-2xl">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3F2965] to-[#5a3e8c] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#3F2965] text-sm truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-3">
              Main Menu
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <a
                  key={item.name}
                  href={`#${encodeURIComponent(item.name)}`}
                  onClick={() => setActiveTab(item.name)}
                  className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-[#3F2965] to-[#5a3e8c] text-white shadow-lg shadow-purple-200"
                      : "text-slate-500 hover:text-[#3F2965] hover:bg-slate-50"
                  }`}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#Dd1764] rounded-r-full" />
                  )}
                  
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? "bg-white/20" 
                      : "bg-slate-100 group-hover:bg-[#3F2965]/10"
                  }`}>
                    <Icon size={16} className={isActive ? "text-white" : "text-[#3F2965]"} />
                  </div>
                  
                  <span>{item.name}</span>
                  
                  {isActive && (
                    <ChevronRight className="ml-auto" size={16} />
                  )}
                  
                  {/* Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#3F2965]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? "hidden" : ""}`} />
                </a>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-slate-100/50 space-y-2">
          
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-red-100 transition-all">
                <LogOut size={16} />
              </div>
              Logout
            </button>
          </div>

      
        </aside>

        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          menuItems={menuItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 flex flex-col min-h-screen relative z-10">
          {/* Header - Enhanced */}
          <header className="sticky top-0 h-16 sm:h-18 lg:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-20 shadow-sm">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu size={22} className="text-[#3F2965]" />
            </button>

            {/* Page Title with Breadcrumb */}
            <div className="flex-1 lg:flex-none">
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
                  <span>Dashboard</span>
                  <ChevronRight size={12} />
                </div>
                <h1 className="text-lg sm:text-xl font-black text-[#3F2965] tracking-tight">
                  {activeTab}
                </h1>
              </div>
              <p className="hidden lg:block text-xs text-slate-400 mt-0.5">
                {activeTab === "Profile" && "Manage your personal information"}
                {activeTab === "My Wallet" && "View balance and transactions"}
                {activeTab === "My Bookings" && "Track your therapy sessions"}
              </p>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">
          

              {/* Quick Book Button - Desktop */}
              <Link
                to="/booking"
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#Dd1764] to-[#ff6b9d] text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <CalendarPlus size={16} />
                <span className="hidden md:inline">Book Session</span>
              </Link>

              {/* Mobile Logo */}
              <Link to="/" className="lg:hidden">
                <img src={Logo} className="h-8 w-auto" alt="MindSettler" />
              </Link>

              {/* User Avatar - Desktop */}
              <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-slate-100">
                <div className="text-right">
                  <p className="text-sm font-bold text-[#3F2965]">{user?.name}</p>
                  
                </div>
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3F2965] to-[#5a3e8c] flex items-center justify-center text-white font-bold shadow-lg">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              {/* Tab Content with Animation */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === "Profile" && (
                  <UserProfileView user={user} setUser={setUser} />
                )}
                {activeTab === "My Wallet" && <WalletView user={user} />}
                {activeTab === "My Bookings" && <MyBookingsView />}
              </div>
            </div>
          </div>

          {/* Footer - Desktop Only */}
          <footer className="hidden lg:flex items-center justify-between px-8 py-4 border-t border-slate-100/50 bg-white/50 backdrop-blur-sm">
            <p className="text-xs text-slate-400">
              © 2024 MindSettler. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-xs text-slate-400 hover:text-[#3F2965] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-slate-400 hover:text-[#3F2965] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-xs text-slate-400 hover:text-[#3F2965] transition-colors">
                Help Center
              </a>
            </div>
          </footer>
        </main>

        {/* Bottom Navigation for Mobile */}
        <BottomNavigation
          menuItems={menuItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Floating Action Button - Mobile */}
        <Link
          to="/booking"
          className="fixed bottom-24 right-4 lg:hidden w-14 h-14 bg-gradient-to-r from-[#Dd1764] to-[#ff6b9d] rounded-full flex items-center justify-center text-white shadow-2xl shadow-pink-300 hover:scale-110 transition-all duration-300 z-30"
        >
          <Plus size={24} />
        </Link>
      </div>
      </IsVerifiedUser>
    </IsLoginUser>
  );
};

export default UserDashboard;