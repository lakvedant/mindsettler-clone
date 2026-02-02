import { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await API.get('/user/me');
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setLoading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);