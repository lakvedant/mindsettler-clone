import { useEffect } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

const Logout = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await API.post("/user/logout");
      } catch (error) {
        console.error(error);
      } finally {
        setUser(null);
        navigate("/auth", { replace: true });
      }
    };

    logoutUser();
  }, [setUser, navigate]);

  return null;
};

export default Logout;
