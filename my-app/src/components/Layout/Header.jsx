import React, { useState, useEffect, useRef, useContext } from "react";
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
import { UserContext } from "../../context/UserContext.jsx";


const Header = ({ onLoginClick, onRegisterClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser, loading } = useContext(UserContext);

  const [desktopUserMenuOpen, setDesktopUserMenuOpen] = useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);

  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navigate = useNavigate();

  // useEffect(() => {
  //   fetchUser();
  // }, []);

  // Click ngoài menu desktop
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(e.target)
      ) {
        setDesktopUserMenuOpen(false);
      }
    };
    if (desktopUserMenuOpen) {
      document.addEventListener("click", handleClickOutside, true);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [desktopUserMenuOpen]);

  // Click ngoài menu mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileUserMenuOpen(false);
      }
    };
    if (mobileUserMenuOpen) {
      document.addEventListener("click", handleClickOutside, true);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [mobileUserMenuOpen]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setUser(null);
        setDesktopUserMenuOpen(false);
        setMobileUserMenuOpen(false);
        setMenuOpen(false);
        await fetchUser();
      } else {
        const text = await res.text();
        console.error("Logout failed:", text);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleAvatarClickDesktop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDesktopUserMenuOpen(!desktopUserMenuOpen);
  };

  const handleAvatarClickMobile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileUserMenuOpen(!mobileUserMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-md text-white">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-4 lg:px-20 py-2">
        <a href="/" className="flex items-center space-x-2">
          <h2 className="text-3xl font-bold text-white">Tez</h2>
          <h2 className="text-3xl font-bold text-red-600">Movies</h2>
        </a>

        {/* Search desktop */}
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

        {/* Menu desktop */}
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

        {/* User / Auth desktop */}
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
          <div className="relative " ref={desktopMenuRef}>
            <div className="relative hidden md:flex items-center space-x-2 cursor-pointer gap-2">
              <div className="relative">
                <img
                  src={user.picture || "/default-avatar.avif"}
                  referrerPolicy="no-referrer"
                  alt={user.name || "User avatar"}
                  className="w-10 h-10 rounded-full border cursor-pointer"
                  onClick={handleAvatarClickDesktop}
                />
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
              </div>
              <div className="text-md font-medium" >{user.name}</div>
            </div>
            {desktopUserMenuOpen && (
              <UserMenu
                user={user}
                onLogout={handleLogout}
                onClose={() => setDesktopUserMenuOpen(false)}
              />
            )}
          </div>
        )}

        {/* Mobile menu */}
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
                <div className="text-black font-stretch-110% text-sm">
                  Đăng nhập
                </div>
              </button>
            </div>
          ) : (
            <div className="" ref={mobileMenuRef}>
              <div className="relative">
                <img
                  src={user.picture || "/default-avatar.avif"}
                  referrerPolicy="no-referrer"
                  alt={user.name || "User avatar"}
                  className="w-10 h-10 rounded-full border cursor-pointer"
                  onClick={handleAvatarClickMobile}
                />
                <span className="top-0 left-7 absolute w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
              {mobileUserMenuOpen && (
                <UserMenu
                  user={user}
                  onLogout={handleLogout}
                  onClose={() => setMobileUserMenuOpen(false)}
                />
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

      {/* Mobile menu content */}
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
