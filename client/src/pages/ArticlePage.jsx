import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Lock, CheckCircle2, Loader2, IndianRupee } from "lucide-react";
import API from "../api/axios";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";

const ArticlePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'pending', 'approved'
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await API.get(`/blog/${id}`);
        setArticle(res.data.data);
        
        if (!res.data.data.isPaid) {
          setIsUnlocked(true);
        } else if (user) {
          // Check if user has unlocked it
          const paymentRes = await API.get("/blog-payment/my-payments", { withCredentials: true });
          const userPayment = paymentRes.data.data.find(p => p.blog === id);
          if (userPayment) {
            setPaymentStatus(userPayment.status);
            if (userPayment.status === "approved") {
              setIsUnlocked(true);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id, user]);

  const submitPayment = async (e) => {
    e.preventDefault();
    if (utrNumber.length < 6) {
      setErrorMsg("Please enter a valid UTR number.");
      return;
    }
    
    setSubmittingPayment(true);
    setErrorMsg("");
    
    try {
      await API.post("/blog-payment/submit", { blogId: id, utrNumber }, { withCredentials: true });
      setPaymentStatus("pending");
      setPaymentModal(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to submit payment.");
    } finally {
      setSubmittingPayment(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-[#Dd1764] w-10 h-10" />
    </div>
  );

  if (!article) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#3F2965]">Article Not Found</h2>
        <Link to="/resources" className="text-[#Dd1764] hover:underline font-semibold flex items-center justify-center gap-2">
          <ArrowLeft size={16}/> Back to Resources
        </Link>
      </div>
    </div>
  );

  // Derive blurred content if locked
  const lockIndex = Math.floor(article.body.length * 0.4);
  const visibleContent = isUnlocked ? article.body : article.body.substring(0, lockIndex);

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-20 min-h-screen bg-slate-50">
        <article className="max-w-4xl mx-auto px-6">
          <Link to="/resources" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#3F2965] transition-colors mb-8 font-semibold text-sm">
            <ArrowLeft size={16} /> Back to Resources
          </Link>
          
          <header className="mb-10 text-center">
            {article.category && (
              <span className="bg-[#Dd1764]/10 text-[#Dd1764] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
                {article.category.name}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-black text-[#3F2965] mb-6 leading-tight font-serif">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                {article.subtitle}
              </p>
            )}
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-slate-500">
              <span className="flex items-center gap-1.5"><Calendar size={16}/> {new Date(article.createdAt).toLocaleDateString()}</span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
              <span className="flex items-center gap-1.5"><Clock size={16}/> {article.readTime}</span>
              {article.isPaid && (
                <>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                  <span className="flex items-center gap-1 text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md"><IndianRupee size={14}/> Premium</span>
                </>
              )}
            </div>
          </header>

          {article.pictureUrl && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full aspect-video rounded-[2rem] overflow-hidden shadow-2xl mb-12 border-4 border-white">
              <img src={article.pictureUrl} alt={article.title} className="w-full h-full object-cover" />
            </motion.div>
          )}

          <div className="prose prose-lg md:prose-xl prose-p:text-slate-700 prose-headings:text-[#3F2965] prose-a:text-[#Dd1764] max-w-none relative">
            <div dangerouslySetInnerHTML={{ __html: visibleContent.replace(/\n/g, '<br/>') }} />
            
            {!isUnlocked && (
              <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-slate-50 to-transparent z-10 flex items-end justify-center pb-8">
                <div className="bg-white/90 backdrop-blur shadow-2xl border p-8 rounded-3xl text-center max-w-md mx-4 relative overflow-hidden transform hover:-translate-y-1 transition-transform">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3F2965] to-[#Dd1764]" />
                  <Lock className="mx-auto w-10 h-10 text-[#Dd1764] mb-4" />
                  <h3 className="text-2xl font-black text-[#3F2965] mb-2">Premium Article</h3>
                  <p className="text-slate-600 mb-6 font-medium">
                    This article is exclusively available to premium readers. Unlock full access instantly.
                  </p>
                  
                  {!user ? (
                    <Link to="/login" className="block w-full py-3 bg-[#3F2965] text-white rounded-xl font-bold shadow-lg shadow-[#3F2965]/20 hover:bg-[#2d1d49] transition-all">
                      Login to Unlock (₹{article.price})
                    </Link>
                  ) : paymentStatus === "pending" ? (
                    <div className="block w-full py-3 bg-orange-100 text-orange-700 rounded-xl font-bold border border-orange-200">
                      Payment Checking...
                    </div>
                  ) : (
                    <button onClick={() => setPaymentModal(true)} className="block w-full py-3 bg-gradient-to-r from-[#Dd1764] to-[#ff4081] text-white rounded-xl font-bold shadow-lg shadow-pink-500/30 hover:shadow-xl transition-all">
                      Unlock Full Access — ₹{article.price}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-16 flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <span key={tag} className="bg-white border px-4 py-1.5 rounded-full text-slate-500 font-bold text-sm shadow-sm">#{tag}</span>
            ))}
          </div>
        </article>
      </div>
      <Footer />

      {/* Payment Modal */}
      {paymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPaymentModal(false)} />
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-3xl w-full max-w-md relative shadow-2xl z-10 border-t-4 border-[#Dd1764]">
            <h3 className="text-2xl font-black text-[#3F2965] mb-2 text-center">Unlock Premium</h3>
            <p className="text-center text-slate-500 mb-6 font-medium">Article: {article.title}</p>
            
            <div className="bg-[#dd1764]/5 border-2 border-[#dd1764]/20 rounded-2xl p-6 text-center mb-6 relative overflow-hidden">
              <p className="text-sm font-bold text-[#3F2965] mb-2 uppercase tracking-wide">Scan & Pay via UPI</p>
              
              <div className="bg-white p-3 rounded-xl mx-auto w-40 h-40 shadow-inner flex flex-col justify-center items-center relative group">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=7206103639@ybl&pn=Mindsettler&am=${article.price}&cu=INR`} alt="UPI QR Code" className="w-full h-full rounded-lg" />
              </div>
              <p className="font-extrabold text-3xl text-[#Dd1764] mt-4 mb-1">₹{article.price}</p>
              <p className="text-xs text-slate-500">Secure UPI Payment</p>
            </div>
            
            {errorMsg && <p className="text-red-500 text-sm font-bold text-center mb-4 bg-red-50 p-2 rounded-lg">{errorMsg}</p>}
            
            <form onSubmit={submitPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#3F2965] mb-1">UTR / Transaction ID</label>
                <input type="text" required placeholder="e.g. 123456789012" value={utrNumber} onChange={(e) => setUtrNumber(e.target.value)} className="w-full p-4 border-2 rounded-xl text-center font-mono font-bold tracking-widest outline-none focus:border-[#Dd1764] focus:ring-4 focus:ring-[#Dd1764]/10 transition-all uppercase" />
              </div>
              <button disabled={submittingPayment} type="submit" className="w-full flex justify-center py-4 bg-[#3F2965] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-[#25183d] active:scale-[0.98] transition-all disabled:opacity-50">
                {submittingPayment ? <Loader2 className="animate-spin" /> : "Verify Payment"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ArticlePage;
