import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import ModalSearch from "./ModalSeacrch";

const Header = ({ onLoginClick, onRegisterClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/me", {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Not logged in");

      let data = await res.json();

      // Nếu avatar là đường dẫn tương đối -> thêm domain backend
      console.log("avatar", data);

      setUser(data);
    } catch (error) {
     
      setUser(null);
    }
  };
  console.log("USERRR", user);
  
  const handleSearch = () => {
    setSearchTerm("");
  }
  
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include"
      });
      setUser(null);
      await fetchUser();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-md text-white">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-4 lg:px-20 py-2">
        <a href="/" className="flex items-center space-x-2">
          <h2 className="text-3xl font-bold text-white">Tez</h2>
          <h2 className="text-3xl font-bold text-red-600">Movies</h2>
        </a>

        <div className="relative hidden md:block min-w-[360px]">
          <input
            type="search"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/search?keyword=${encodeURIComponent(searchTerm)}`);
              }
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
          />
          <ModalSearch searchTerm={searchTerm} />
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-lg font-medium">
          <Link to={"/chu-de"} className="hover:underline !text-white">Chủ đề</Link>
          <a href="#" className="hover:underline !text-white">Thể Loại</a>
          <a href="#" className="hover:underline !text-white">Phim Mới</a>
          <a href="#" className="hover:underline !text-white">Phim Hot</a>
        </nav>

        {!user ? (
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onLoginClick}
              className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
            >
              Đăng Nhập
            </button>
            <button 
              onClick={onRegisterClick}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Đăng Ký
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-3">
            {console.log("Avatar URL:", user?.avatar)}
            <img
              src={user?.avatar || "/default-avatar.avif"}
              referrerPolicy="no-referrer"
              alt={user?.name || "User avatar"}
              className="w-10 h-10 rounded-full border"
            />

            <span>{user.name || "Unknown User"}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Đăng xuất
            </button>
          </div>
        )}

        <button
          className="md:hidden text-white text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pt-4 pb-2 space-y-3 bg-black/80">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/search?keyword=${encodeURIComponent(searchTerm)}`);
                  setMenuOpen(false);
                }
              }}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
            />
          </div>

          <nav className="flex flex-col space-y-2 text-lg">
            <Link to={"/chu-de"} className="hover:underline !text-white">Chủ đề</Link>
            <a href="#" className="hover:underline !text-white">Thể Loại</a>
            <a href="#" className="hover:underline !text-white">Phim Mới</a>
            <a href="#" className="hover:underline !text-white">Phim Hot</a>
          </nav>

          {!user ? (
            <div className="flex space-x-3 mt-3">
              <button
                onClick={() => {
                  onLoginClick();
                  setMenuOpen(false);
                }}
                className="w-full bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
              >
                Đăng Nhập
              </button>
              <button 
                onClick={() => {
                  onRegisterClick();
                  setMenuOpen(false);
                }}
                className="w-full bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
              >
                Đăng Ký
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2 mt-3">
              {console.log("Avatar URL:", user?.avatar)}
              <img
                src={user?.avatar || "/default-avatar.avif"}
                alt={user?.name || "User avatar"}
                className="w-10 h-10 rounded-full border"
                onError={(e) => {
                  console.error("Avatar load failed for:", e.target.src);
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.avif";
                }}
              />

              <span>{user.name || "Unknown User"}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 w-full"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;