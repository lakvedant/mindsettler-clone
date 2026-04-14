import { useState, useEffect } from "react";
import { Loader2, Check, X, Search } from "lucide-react";
import API from "../api/axios";

const ManageBlogPaymentsView = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await API.get("/blog-payment/pending", { withCredentials: true });
      setPayments(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/blog-payment/status/${id}`, { status }, { withCredentials: true });
      fetchPayments();
    } catch (err) {
      alert("Error updating payment status");
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#DD1764]" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-[#3F2965] mb-4 flex items-center gap-2">
          Verify Blog Payments <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs">{payments.length} Pending</span>
        </h3>

        {payments.length === 0 ? (
          <p className="text-slate-500 italic p-6 text-center bg-slate-50 rounded-xl border-dashed border-2">No pending payments to review.</p>
        ) : (
          <div className="space-y-4">
            {payments.map(p => (
              <div key={p._id} className="p-4 bg-slate-50 border rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <p className="font-bold text-[#3F2965]">User: {p.user?.name} ({p.user?.email})</p>
                  <p className="text-sm font-medium text-slate-600 mt-1">Article: {p.blog?.title}</p>
                  <div className="flex gap-4 mt-2 text-xs font-bold font-mono">
                    <span className="text-pink-600 bg-pink-100 px-2 py-1 rounded-md">Amount: ₹{p.amount}</span>
                    <span className="text-slate-600 bg-slate-200 px-2 py-1 rounded-md tracking-wider">UTR: {p.utrNumber}</span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleStatusUpdate(p._id, "approved")} className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-green-600">
                    <Check size={16} /> Approve
                  </button>
                  <button onClick={() => handleStatusUpdate(p._id, "rejected")} className="flex items-center gap-1 bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-200">
                    <X size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBlogPaymentsView;
