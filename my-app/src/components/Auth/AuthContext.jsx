// AuthContext.jsx
import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm fetch user từ token
  const fetchUser = async () => {
    const token = localStorage.getItem("token"); // token lưu sau login
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("Fetch user error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Chạy khi mount component
  useEffect(() => {
    fetchUser();
  }, []);

  // Hàm login thành công
  const login = (token) => {
    localStorage.setItem("token", token); // lưu token
    fetchUser(); // fetch user ngay lập tức
  };

  // Hàm logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook tiện lợi để sử dụng auth
export const useAuth = () => useContext(AuthContext);
