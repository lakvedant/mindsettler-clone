import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({ children, roleRequired, loginPath = "/auth" }) => {
  const { user, loading } = useAuth();
  if (loading) {
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
  if (!user) {
    return <Navigate to={loginPath} replace />;
  }
  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PrivateRoute;