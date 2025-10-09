import { createContext, useState, useEffect, useContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Fetch user từ cookie token
  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Fetch user error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Chạy khi mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Logout: gọi API backend xóa cookie
  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook tiện lợi
export const useUser = () => useContext(UserContext);
