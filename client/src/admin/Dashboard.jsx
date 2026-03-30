import { useState, useEffect, useCallback } from "react";
import Logo from "../assets/icons/MindsettlerLogo-removebg-preview.png";
import { useNavigate, Link, Navigate } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  LogOut,
  X,
  Check,
  Plus,
  Loader2,
  UserCircle,
  Mail,
  Edit3,
  Camera,
  User,
  Phone,
  Save,
  TrendingUp,
  Info,
  BrainCircuit,
  Video,
  MessageSquare,
  Calendar,
  Trash2,
  CalendarIcon,
  AlertCircle,
  Menu,
  MapPin,
  Link2,
  ExternalLink,
  Users,
  ChevronDown,
  CreditCard
} from "lucide-react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

// --- 1. ADMIN PROFILE VIEW ---
const AdminProfileView = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.patch("/admin/profile", formData);
      setUser(response.data.user);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.log(err);
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
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#3F2965] tracking-tight">
            Account Settings
          </h2>
          <p className="text-slate-500 font-medium text-xs sm:text-sm">
            Manage your administrative identity
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm transition-all ${
            isEditing
              ? "bg-slate-100 text-slate-600"
              : "bg-[#3F2965] text-white shadow-lg"
          }`}
        >
          {isEditing ? <X size={16} /> : <Edit3 size={16} />}
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Avatar Card */}
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[2.5rem] border shadow-sm flex flex-col items-center text-center h-fit">
          <div className="relative group cursor-pointer">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full bg-linear-to-tr from-[#3F2965] to-[#Dd1764] flex items-center justify-center text-white text-3xl sm:text-4xl lg:text-5xl font-black shadow-2xl ring-4 ring-white">
              {formData.name?.charAt(0)}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={20} />
            </div>
          </div>
          <h3 className="mt-4 sm:mt-6 text-lg sm:text-xl font-black text-[#3F2965]">
            {formData.name}
          </h3>
          <p className="text-[10px] sm:text-xs font-black text-[#Dd1764] uppercase tracking-widest mt-1">
            {user?.role}
          </p>
        </div>

        {/* Form Card */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="bg-white p-4 sm:p-6 lg:p-10 rounded-2xl sm:rounded-[2.5rem] border shadow-sm">
<form
  onSubmit={handleUpdateProfile}
  className="space-y-4 sm:space-y-6"
>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
    {/* Full Name */}
    <div className="space-y-1.5 sm:space-y-2">
      <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase ml-1">
        Full Name
      </label>
      <div className="relative">
        <User
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-300"
          size={16}
        />
        <input
          name="name"
          disabled={!isEditing}
          value={formData.name}
          onChange={handleChange}
          className="w-full pl-10 sm:pl-12 p-3 sm:p-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#3F2965] disabled:opacity-60 transition-all"
        />
      </div>
    </div>

    {/* Email Address */}
    <div className="space-y-1.5 sm:space-y-2">
      <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase ml-1">
        Email Address
      </label>
      <div className="relative">
        <Mail
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-300"
          size={16}
        />
        <input
          name="email"
          disabled={!isEditing}
          value={formData.email}
          onChange={handleChange}
          className="w-full pl-10 sm:pl-12 p-3 sm:p-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#3F2965] disabled:opacity-60 transition-all"
        />
      </div>
    </div>

    {/* Phone Number */}
    <div className="space-y-1.5 sm:space-y-2">
      <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase ml-1">
        Phone Number
      </label>
      <div className="relative">
        <Phone
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-300"
          size={16}
        />
        <input
          name="phone"
          disabled={!isEditing}
          value={formData.phone}
          onChange={handleChange}
          className="w-full pl-10 sm:pl-12 p-3 sm:p-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#3F2965] disabled:opacity-60 transition-all"
        />
      </div>
    </div>

    {/* Gender */}
    <div className="space-y-1.5 sm:space-y-2">
      <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase ml-1">
        Gender
      </label>
      <div className="relative">
        <Users
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
          size={16}
        />
        <select
          name="gender"
          disabled={!isEditing}
          value={formData.gender}
          onChange={handleChange}
          className="w-full pl-10 sm:pl-12 p-3 sm:p-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#3F2965] disabled:opacity-60 transition-all cursor-pointer appearance-none"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <ChevronDown
          className={`absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none ${
            !isEditing ? "opacity-60" : ""
          }`}
          size={16}
        />
      </div>
    </div>
  </div>

  {isEditing && (
    <button
      type="submit"
      disabled={loading}
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#Dd1764] text-white rounded-xl sm:rounded-2xl font-black shadow-xl hover:opacity-90 disabled:opacity-50 transition-all"
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <Save size={18} />
      )}
      Save Changes
    </button>
  )}
</form>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. SESSION PAYMENTS VIEW ---
const SessionPaymentsView = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procId, setProcId] = useState(null);

  useEffect(() => {
    API.get("/session-payments/pending")
      .then((res) => {
        setPayments(res.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAction = async (id, status, reason = "") => {
    setProcId(id);
    try {
      if (status === "reject") {
        await API.patch(`/session-payments/reject/${id}`, {
          rejectionReason: reason || "Payment verification failed",
        });
      } else {
        await API.patch(`/session-payments/approve/${id}`);
      }
      setPayments((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      alert("Error processing payment");
    } finally {
      setProcId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-12 sm:p-20">
        <Loader2 className="animate-spin text-[#3F2965]" size={40} />
      </div>
    );

  return (
    <div className="space-y-4">
      {payments.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <CreditCard size={48} className="mx-auto text-slate-200 mb-3" />
          <p className="text-slate-500 font-bold">No pending payments</p>
          <p className="text-sm text-slate-400">All payments have been verified</p>
        </div>
      ) : (
        payments.map((payment) => (
          <div
            key={payment._id}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">User</p>
                <p className="font-bold text-slate-700">{payment.user?.name}</p>
                <p className="text-xs text-slate-500">{payment.user?.email}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Amount</p>
                <p className="font-black text-2xl text-[#3F2965]">₹{payment.amount}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">UTR Number</p>
                <p className="font-mono font-bold text-slate-700">{payment.utrNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Therapy</p>
                <p className="text-sm font-bold text-slate-700">{payment.appointment?.therapyType || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Session Type</p>
                <p className="text-sm font-bold text-slate-700 capitalize">{payment.appointment?.sessionType || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Date</p>
                <p className="text-sm font-bold text-slate-700">
                  {payment.appointment?.availabilityRef?.date
                    ? new Date(payment.appointment.availabilityRef.date).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Time</p>
                <p className="text-sm font-bold text-slate-700">{payment.appointment?.timeSlot || "N/A"}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                disabled={procId !== null}
                onClick={() => handleAction(payment._id, "reject")}
                className="flex-1 py-2.5 text-xs font-black uppercase text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {procId === payment._id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <X size={14} /> Reject
                  </>
                )}
              </button>
              <button
                disabled={procId !== null}
                onClick={() => handleAction(payment._id, "approve")}
                className="flex-1 py-2.5 text-xs font-black uppercase text-white bg-[#3F2965] rounded-xl shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {procId === payment._id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <Check size={14} /> Approve
                  </>
                )}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// --- 3. APPOINTMENTS VIEW ---
const AppointmentsView = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const [selectedApp, setSelectedApp] = useState(null);
  const [modalError, setModalError] = useState("");
  const [tableError, setTableError] = useState("");

  // Meet Link specific states
  const [meetLink, setMeetLink] = useState("");
  const [isEditingLink, setIsEditingLink] = useState(false);

  useEffect(() => {
    API.get("/admin/pending-appointments")
      .then((res) => {
        setAppointments(res.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setTableError("Failed to load appointments. Please refresh.");
        setLoading(false);
      });
  }, []);

  // Sync meetLink state when a modal is opened
  useEffect(() => {
    if (selectedApp) {
      setMeetLink(selectedApp.meetLink || "");
      setIsEditingLink(false);
    }
  }, [selectedApp]);

  const updateStatus = async (id, status) => {
    setActionId(id);
    setModalError("");
    setTableError("");

    try {
      await API.patch(`/appointment/status/${id}`, { status });
      setAppointments((prev) => prev.filter((app) => app._id !== id));
      if (selectedApp?._id === id) setSelectedApp(null);
    } catch (e) {
      const errorText =
        e.response?.data?.message || "Action failed. Please try again.";
      if (selectedApp) {
        setModalError(errorText);
      } else {
        setTableError(errorText);
      }
    } finally {
      setActionId(null);
    }
  };

  const saveMeetLink = async () => {
    if (!selectedApp) return;
    setActionId(selectedApp._id);
    setModalError("");

    try {
      // Endpoint to update only the meet link
      await API.put(`/appointment/meet-link-update/${selectedApp._id}`, {
        meetLink,
      });

      // Update local state so the table/list reflects the new link
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === selectedApp._id ? { ...app, meetLink } : app
        )
      );
      setSelectedApp((prev) => ({ ...prev, meetLink }));
      setIsEditingLink(false);
    } catch (e) {
      setModalError(
        e.response?.data?.message || "Failed to save meeting link."
      );
    } finally {
      setActionId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-12 sm:p-20">
        <Loader2 className="animate-spin text-[#Dd1764]" size={36} />
      </div>
    );

  return (
    <div className="relative">
      {/* Error Banner */}
      {tableError && (
        <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={16} />
          <p className="text-xs sm:text-sm font-bold flex-1">{tableError}</p>
          <button
            onClick={() => setTableError("")}
            className="hover:bg-red-100 p-1 rounded-full transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Empty State - Show when no appointments */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl border shadow-sm p-8 sm:p-12 lg:p-16 text-center animate-in fade-in duration-500">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-linear-to-tr from-purple-50 to-pink-50 flex items-center justify-center">
            <CalendarCheck className="w-8 h-8 sm:w-10 sm:h-10 text-[#3F2965]/40" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-[#3F2965] mb-2">
            No Pending Appointments
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm font-medium max-w-sm mx-auto">
            You're all caught up! There are no appointments waiting for your review at the moment.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-2xl sm:rounded-3xl border shadow-sm overflow-hidden animate-in fade-in duration-500">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-4 lg:p-5 text-[10px] sm:text-xs font-black text-slate-500 uppercase">
                    #
                  </th>
                  <th className="p-4 lg:p-5 text-[10px] sm:text-xs font-black text-slate-500 uppercase">
                    Client Details
                  </th>
                  <th className="p-4 lg:p-5 text-[10px] sm:text-xs font-black text-slate-500 uppercase text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app, idx) => (
                <tr
                  key={app._id}
                  className="border-b last:border-0 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="p-4 lg:p-5 text-sm font-bold text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="p-4 lg:p-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800 text-sm">
                          {app.user?.name}
                        </p>
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
                          title="View Details"
                        >
                          <Info size={14} />
                        </button>
                        {app.meetLink && (
                          <Link2
                            size={12}
                            className="text-blue-500"
                            title="Link assigned"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                        <Mail size={12} /> {app.user?.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 lg:p-5 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        disabled={actionId === app._id}
                        onClick={() => updateStatus(app._id, "rejected")}
                        className="px-4 py-2 text-[10px] font-black uppercase text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
                      >
                        {actionId === app._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          "Reject"
                        )}
                      </button>
                      <button
                        disabled={actionId === app._id}
                        onClick={() => updateStatus(app._id, "completed")}
                        className="px-4 py-2 text-[10px] font-black uppercase text-white bg-green-500 rounded-xl shadow-md hover:bg-green-600 transition-all"
                      >
                        {actionId === app._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          "Complete"
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-3">
          {appointments.map((app) => (
          <div
            key={app._id}
            className="bg-white rounded-2xl border shadow-sm p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#3F2965] to-[#Dd1764] flex items-center justify-center text-white font-bold text-sm">
                  {app.user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">
                    {app.user?.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {app.user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(app)}
                className="p-2 rounded-xl bg-slate-50 text-slate-400"
              >
                <Info size={16} />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(app._id, "rejected")}
                className="flex-1 py-2.5 text-[10px] font-black uppercase text-red-600 bg-red-50 rounded-xl"
              >
                Reject
              </button>
              <button
                onClick={() => updateStatus(app._id, "completed")}
                className="flex-1 py-2.5 text-[10px] font-black uppercase text-white bg-green-500 rounded-xl shadow-md"
              >
                Complete
              </button>
            </div>
          </div>
        ))}
        </div>
      </>
      )}

      {/* Appointment Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-slate-50 border-b flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-black text-[#3F2965] uppercase text-[10px] sm:text-xs tracking-widest">
                  Appointment Summary
                </h3>
                <p className="text-[9px] sm:text-xs font-bold text-slate-400 mt-0.5">
                  ID: {selectedApp._id.toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                  <AlertCircle size={14} /> {modalError}
                </div>
              )}

              {/* Client Contact Info */}
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter mb-3">
                  Client Contact
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-700">
                    {selectedApp.user?.name}
                  </p>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Mail size={12} className="text-slate-400" />
                    <p className="text-slate-600">{selectedApp.user?.email}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Phone size={12} className="text-slate-400" />
                    <p className="text-slate-600">{selectedApp.user?.phone || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Therapy & Date Info */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 text-[#3F2965] rounded-2xl">
                    <BrainCircuit size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                      Therapy Mode
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedApp.therapyType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <CalendarIcon size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                      Date
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {new Date(selectedApp.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Time & Format */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-pink-50 text-[#Dd1764] rounded-lg">
                    <Clock size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase">
                      Time
                    </p>
                    <p className="text-xs font-bold text-slate-700">
                      {selectedApp.timeSlot}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    {selectedApp.sessionType === "online" ? (
                      <Video size={14} />
                    ) : (
                      <MapPin size={14} />
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase">
                      Format
                    </p>
                    <p className="text-xs font-bold text-slate-700 capitalize">
                      {selectedApp.sessionType}
                    </p>
                  </div>
                </div>
              </div>

              {/* MEET LINK SECTION (NEW) */}
              {selectedApp.sessionType === "online" && (
              <div className="bg-blue-50/50 p-4 sm:p-5 rounded-3xl border border-blue-100 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Video size={14} />
                    <p className="text-[9px] font-black uppercase tracking-widest">
                      Session Link
                    </p>
                  </div>
                  {!isEditingLink && (
                    <button
                      onClick={() => setIsEditingLink(true)}
                      className="text-[9px] font-black uppercase text-blue-600 hover:underline"
                    >
                      Edit Link
                    </button>
                  )}
                </div>

                {isEditingLink ? (
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={meetLink}
                      onChange={(e) => setMeetLink(e.target.value)}
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      className="w-full p-3 rounded-xl bg-white border border-blue-200 text-xs font-medium outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditingLink(false)}
                        className="px-3 py-2 text-[9px] font-black uppercase text-slate-400 bg-white rounded-lg border"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveMeetLink}
                        disabled={actionId === selectedApp._id}
                        className="flex-1 px-3 py-2 text-[9px] font-black uppercase text-white bg-blue-600 rounded-lg flex items-center justify-center gap-2 shadow-md"
                      >
                        {actionId === selectedApp._id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <>
                            <Check size={12} /> Save Link
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm text-blue-900 font-bold truncate max-w-50">
                      {selectedApp.meetLink || "No link assigned yet"}
                    </p>
                    {selectedApp.meetLink && (
                      <a
                        href={selectedApp.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-600 text-white rounded-lg"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                )}
              </div>)}

              {/* Client Notes */}
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-[#3F2965]">
                  <MessageSquare size={12} />
                  <p className="text-[9px] font-black uppercase tracking-widest">
                    Client Notes
                  </p>
                </div>
                <p className="text-xs text-slate-600 italic">
                  "{selectedApp.notes || "No additional notes provided."}"
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t flex gap-3 shrink-0">
              <button
                disabled={actionId === selectedApp._id}
                onClick={() => updateStatus(selectedApp._id, "rejected")}
                className="flex-1 py-4 bg-white border text-red-600 font-black text-[10px] uppercase rounded-xl"
              >
                {actionId === selectedApp._id ? (
                  <Loader2 size={16} className="animate-spin mx-auto" />
                ) : (
                  "Reject"
                )}
              </button>
              <button
                disabled={actionId === selectedApp._id}
                onClick={() => updateStatus(selectedApp._id, "completed")}
                className="flex-1 py-4 bg-[#3F2965] text-white font-black text-[10px] uppercase rounded-xl shadow-lg"
              >
                {actionId === selectedApp._id ? (
                  <Loader2 size={16} className="animate-spin mx-auto" />
                ) : (
                  "Complete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 4. TIME SLOTS VIEW ---
const TimeSlotsView = () => {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [newSlot, setNewSlot] = useState("");
  const [slots, setSlots] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [flushing, setFlushing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [availabilityId, setAvailabilityId] = useState(null);

  const [modalType, setModalType] = useState(null);

  const checkExistingAvailability = async () => {
    if (!date) return;
    setFetching(true);
    setErrorMsg("");
    try {
      const res = await API.get(`/appointment/get-availability?date=${date}`);
      setAvailabilityId(res.data.data?.availabilityId || null);
      const existingSlots = res.data.data?.slots || [];
      const formattedSlots = existingSlots.map((s) =>
        typeof s === "object" ? s.time : s
      );
      setSlots(formattedSlots.sort());
    } catch (e) {
      setSlots([]);
      setAvailabilityId(null);
      if (e.response?.status === 400 || e.response?.status === 404) {
        setErrorMsg(e.response.data?.message);
      } else {
        setErrorMsg("Failed to fetch existing schedule.");
      }
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (date) checkExistingAvailability();
  }, [date]);

  const addSlot = () => {
    if (newSlot && !slots.includes(newSlot)) {
      setSlots([...slots, newSlot].sort());
      setNewSlot("");
    }
  };

  const publishAvailability = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      await API.post("/admin/set-availability", { date, slots });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (e) {
      setErrorMsg(
        e.response?.data?.message || "Failed to update portal schedule."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrigger = (slotToRemove) => {
    const updatedSlots = slots.filter((t) => t !== slotToRemove);
    if (updatedSlots.length === 0 && availabilityId) {
      setModalType("delete_all");
    } else {
      setSlots(updatedSlots);
    }
  };

  const confirmDeleteAll = async () => {
    setModalType(null);
    setLoading(true);
    try {
      await API.delete(`/appointment/delete-availability/${availabilityId}`);
      setSlots([]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (e) {
      setErrorMsg("Error: " + (e.response?.data?.message || "Delete failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleFlush = async () => {
    setModalType(null);
    setFlushing(true);
    try {
      await API.delete("/appointment/flush-availability");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      if (date) await checkExistingAvailability();
    } catch (e) {
      setErrorMsg("Error: " + (e.response?.data?.message || "Flush failed"));
    } finally {
      setFlushing(false);
    }
  };

  return (
    <div className="relative bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border shadow-sm space-y-4 sm:space-y-6 animate-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      {/* Success Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-40 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-xl">
            <Check size={32} strokeWidth={3} className="animate-bounce" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#3F2965]">
            Schedule Synced!
          </h3>
        </div>
      )}

      {/* Confirmation Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            <div className="p-6 sm:p-8 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={28} />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#3F2965]">
                Confirm Action
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                {modalType === "flush"
                  ? "This will remove all availability records dated before today. This cannot be undone."
                  : "Removing the final slot will delete the entire schedule for this date."}
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-slate-50 flex gap-2 sm:gap-3">
              <button
                onClick={() => setModalType(null)}
                className="flex-1 py-3 sm:py-4 text-[10px] sm:text-xs font-black uppercase text-slate-400 bg-white border rounded-xl sm:rounded-2xl hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={modalType === "flush" ? handleFlush : confirmDeleteAll}
                className="flex-1 py-3 sm:py-4 text-[10px] sm:text-xs font-black uppercase text-white bg-red-500 rounded-xl sm:rounded-2xl shadow-lg hover:bg-red-600 transition-all"
              >
                Execute
              </button>
            </div>
            <div className="h-4 sm:h-0 bg-slate-50" />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Calendar size={16} className="text-[#3F2965]" />
        <h2 className="font-black text-[10px] sm:text-xs uppercase tracking-widest text-slate-400">
          Manage Availability
        </h2>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-3 sm:p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl sm:rounded-2xl flex items-start gap-2 sm:gap-3 animate-in fade-in">
          <AlertCircle className="shrink-0 mt-0.5" size={16} />
          <p className="text-xs sm:text-sm font-bold flex-1">{errorMsg}</p>
          <button onClick={() => setErrorMsg("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Date & Time Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        <div className="relative">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 sm:p-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-[#3F2965] focus:ring-2 focus:ring-[#3F2965] outline-none"
          />
          {fetching && (
            <Loader2
              size={14}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 animate-spin text-[#3F2965]"
            />
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="time"
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            className="flex-1 p-3 sm:p-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-sm text-[#3F2965] focus:ring-2 focus:ring-[#3F2965] outline-none"
          />
          <button
            onClick={addSlot}
            disabled={!date || !newSlot}
            className="p-3 sm:p-4 bg-[#3F2965] text-white rounded-xl sm:rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Slots Display */}
      <div className="space-y-2 sm:space-y-3">
        <p className="text-[9px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest">
          {slots.length > 0
            ? `Current Slots (${slots.length})`
            : "No slots added yet"}
        </p>
        <div className="flex flex-wrap gap-2 sm:gap-3 p-4 sm:p-6 bg-slate-50 rounded-xl sm:rounded-2xl border-2 border-dashed min-h-20 sm:min-h-25">
          {slots.map((s) => (
            <div
              key={s}
              className="bg-white text-[#3F2965] px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm border shadow-sm flex items-center gap-2 sm:gap-3 animate-in fade-in zoom-in"
            >
              {s}
              <X
                size={12}
                className="cursor-pointer text-red-300 hover:text-red-500 transition-colors"
                onClick={() => handleDeleteTrigger(s)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <button
          disabled={flushing}
          onClick={() => setModalType("flush")}
          className="sm:col-span-1 py-3 sm:py-4 bg-slate-100 text-slate-600 font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl border-2 border-slate-200 flex justify-center items-center gap-2 hover:bg-slate-200 disabled:opacity-30 transition-all"
        >
          {flushing ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <Trash2 size={16} /> Flush Past
            </>
          )}
        </button>
        <button
          disabled={loading || !date || slots.length === 0}
          onClick={publishAvailability}
          className="sm:col-span-2 py-4 sm:py-5 bg-[#Dd1764] text-white font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-xl flex justify-center items-center gap-2 sm:gap-3 hover:opacity-90 active:scale-[0.98] disabled:opacity-30 transition-all"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <TrendingUp size={18} /> Broadcast Schedule
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// --- MOBILE SIDEBAR COMPONENT ---
const MobileSidebar = ({
  isOpen,
  onClose,
  navItems,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-70 bg-white z-50 lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <Link to="/" onClick={onClose}>
            <img src={Logo} className="w-32" alt="Mindsettler" />
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
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={`#${encodeURIComponent(item.name)}`}
                onClick={() => {
                  setActiveTab(item.name);
                  onClose();
                }}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === item.name
                    ? "bg-linear-to-r from-[#3F2965] to-[#Dd1764] text-white shadow-lg"
                    : "text-slate-500 hover:text-[#3F2965] hover:bg-slate-50"
                }`}
              >
                <Icon size={18} strokeWidth={2.5} /> {item.name}
              </a>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} strokeWidth={2.5} /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

// --- BOTTOM NAVIGATION FOR MOBILE ---
const BottomNavigation = ({ navItems, activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-30 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          // Shorten names for mobile
          const shortName = item.name
            .replace("Session Payments", "Payments")
            .replace("Appointments", "Appts")
            .replace("Time Slots", "Slots");
          return (
            <a
              key={item.name}
              href={`#${encodeURIComponent(item.name)}`}
              onClick={() => setActiveTab(item.name)}
              className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all min-w-15 ${
                isActive ? "text-[#Dd1764] bg-pink-50" : "text-slate-400"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-tight">
                {shortName}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser, loading: authLoading } = useAuth();

  const navItems = [
    { name: "Profile", icon: UserCircle },
    { name: "Session Payments", icon: CreditCard },
    { name: "Appointments", icon: CalendarCheck },
    { name: "Time Slots", icon: Clock },
  ];

  useEffect(() => {
    const syncTabFromHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace("#", ""));
      const matched = navItems.find((item) => item.name === hash);
      setActiveTab(matched ? matched.name : "Profile");
    };
    syncTabFromHash();
    window.addEventListener("hashchange", syncTabFromHash);
    return () => window.removeEventListener("hashchange", syncTabFromHash);
  }, []);

  // Lock body scroll when mobile menu is open
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
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-slate-100"></div>
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-[#3F2965] animate-spin"></div>
          </div>
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return <Navigate to="/auth" replace />;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-white border-r border-slate-100 flex-col p-6 xl:p-8">
        <Link to="/" className="mb-8 xl:mb-12 self-center">
          <img
            src={Logo}
            className="w-36 xl:w-48 transition-transform hover:scale-105"
            alt="Mindsettler"
          />
        </Link>
        <nav className="flex-1 space-y-2 xl:space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={`#${encodeURIComponent(item.name)}`}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 xl:gap-4 px-4 xl:px-5 py-3 xl:py-4 rounded-xl xl:rounded-2xl font-black text-xs xl:text-sm transition-all duration-300 ${
                  activeTab === item.name
                    ? "bg-[#3F2965] text-white shadow-xl translate-x-1 xl:translate-x-2"
                    : "text-slate-400 hover:bg-slate-50 hover:text-[#3F2965]"
                }`}
              >
                <Icon size={18} strokeWidth={2.5} /> {item.name}
              </a>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-6 xl:mt-8 flex items-center gap-3 xl:gap-4 px-4 xl:px-5 py-3 xl:py-4 rounded-xl xl:rounded-2xl font-black text-xs xl:text-sm text-red-500 hover:bg-red-50 transition-all group"
        >
          <LogOut
            size={18}
            strokeWidth={2.5}
            className="group-hover:translate-x-1 transition-transform"
          />{" "}
          Logout
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 sm:h-16 lg:h-20 xl:h-24 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-12 z-10 shrink-0">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Menu size={22} className="text-[#3F2965]" />
          </button>

          {/* Title */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 justify-center lg:justify-start">
            <div className="hidden sm:flex p-2 lg:p-3 bg-purple-50 rounded-xl lg:rounded-2xl text-[#3F2965]">
              {(() => {
                const activeItem = navItems.find((i) => i.name === activeTab);
                const ActiveIcon = activeItem ? activeItem.icon : UserCircle;
                return <ActiveIcon size={20} />;
              })()}
            </div>
            <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-black text-[#3F2965] uppercase tracking-tighter">
              {activeTab}
            </h1>
          </div>

          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden">
            <img src={Logo} className="h-7 sm:h-8 w-auto" alt="Mindsettler" />
          </Link>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 xl:p-12 pb-24 lg:pb-10 bg-slate-50/50">
          <div className="max-w-6xl mx-auto">
            {activeTab === "Profile" && (
              <AdminProfileView user={user} setUser={setUser} />
            )}
            {activeTab === "Session Payments" && <SessionPaymentsView />}
            {activeTab === "Appointments" && <AppointmentsView />}
            {activeTab === "Time Slots" && <TimeSlotsView />}
          </div>
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation
        navItems={navItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default AdminDashboard;
