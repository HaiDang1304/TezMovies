import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import ModalSearch from "../Others/ModalSeacrch";
import DropdownList from "../Categories/DropdownList";
import DropdownCategory from "../Categories/DropdownCategory";
import UserMenu from "./UserMenu";
import { useRef } from "react";

const Header = ({ onLoginClick, onRegisterClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  const menuRef = useRef(null);

  useEffect(() => {
    fetchUser();
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside); // cho mobile

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []); // Chỉ chạy một lần khi component mount

  const fetchUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
        credentials: "include", // Gửi cookie session
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null); // Lấy user từ response
      } else {
        setUser(null); // Nếu không authenticated
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
  };

  const handleSearch = () => {
    setSearchTerm("");
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Logout response:", data);
        setUser(null);
        await fetchUser();
        window.location.reload();
      } else {
        const text = await res.text();
        console.error(
          "Logout failed with status:",
          res.status,
          "Response:",
          text
        );
      }
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
                setSearchTerm("");
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
          <a href="/" className="hover:underline !text-white">
            Trang chủ
          </a>
          <Link to={"/chu-de"} className="hover:underline !text-white">
            Chủ đề
          </Link>
          <DropdownList />
          <DropdownCategory />
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
            <div className="">
              <div className="relative">
                <img
                src={user?.picture || "/default-avatar.avif"}
                referrerPolicy="no-referrer"
                alt={user?.name || "User avatar"}
                className="w-10 h-10 rounded-full border cursor-pointer"
                onClick={toggleUserMenu}
              />
              <span class="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
              </div>
              {userMenuOpen && (
                <div ref={menuRef}>
                  <UserMenu
                    user={user}
                    onLogout={handleLogout}
                    onClose={() => setUserMenuOpen(false)} // phải là hàm
                  />
                </div>
              )}
            </div>

            <span>{user.name || "Unknown User"}</span>
            {/* <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Đăng xuất
            </button> */}
          </div>
        )}
        <div className="md:hidden flex flex-row gap-4">
          {!user ? (
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  onLoginClick();
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 rounded-xl text-black hover:opacity-90"
                style={{
                  background: "linear-gradient(39deg, #fecf59, #fff1cc)",
                }}
              >
                <div className="text-black font-stretch-110% text-sm">Đăng nhập</div>
              </button>
              {/* <button
                onClick={() => {
                  onRegisterClick();
                  setMenuOpen(false);
                }}
                className="w-full bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
              >
                Đăng Ký
              </button> */}
            </div>
          ) : (
            <div className="">
              <div className="relative">
                <img
                src={user.picture || "/default-avatar.avif"}
                referrerPolicy="no-referrer"
                alt={user.name || "User avatar"}
                className="w-10 h-10 rounded-full border cursor-pointer"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              />
              <span class="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
              </div>
              {userMenuOpen && (
                <div ref={menuRef}>
                  <UserMenu
                    user={user}
                    onLogout={handleLogout}
                    onClose={() => setUserMenuOpen(false)}
                  />
                </div>
              )}
            </div>
          )}
          <button
            className="md:hidden text-white text-xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
          </button>
        </div>
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
            <Link
              to={"/"}
              onClick={() => setMenuOpen(false)}
              className="hover:underline !text-white"
            >
              Trang chủ
            </Link>
            <Link
              to={"/chu-de"}
              onClick={() => setMenuOpen(false)}
              className="hover:underline !text-white"
            >
              Chủ đề
            </Link>
            <DropdownCategory onClick={() => setMenuOpen(false)} />
            <DropdownList onClick={() => setMenuOpen(false)} />
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
