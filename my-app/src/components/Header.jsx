import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [searchTerm, setsearchTerm] = useState("");
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search?keyword=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-md text-white ">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-4 lg:px-20 py-2">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2">
          <h2 className="text-3xl font-bold text-white">Tez</h2>
          <h2 className="text-3xl font-bold text-red-600">Movies</h2>
        </a>

        {/* Search Bar */}
        <div className="relative hidden md:block w-64">
          <form onSubmit={handleSearch}>
            <div className="relative hidden md:block w-64">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setsearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
              />
            </div>
          </form>

          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
          />
        </div>


        <nav className="hidden md:flex items-center space-x-6 text-lg font-medium">
          <a href="#" className="hover:underline !text-white">Chủ đề</a>
          <a href="#" className="hover:underline !text-white">Thể Loại</a>
          <a href="#" className="hover:underline !text-white">Phim Mới</a>
          <a href="#" className="hover:underline !text-white">Phim Hot</a>
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Đăng Nhập</button>
          <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Đăng Ký</button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-4 pb-2 space-y-3 bg-black/80">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
            />
          </div>

          <nav className="flex flex-col space-y-2 text-lg">
            <a href="#" className="hover:underline !text-white">Chủ đề</a>
            <a href="#" className="hover:underline !text-white">Thể Loại</a>
            <a href="#" className="hover:underline !text-white">Phim Mới</a>
            <a href="#" className="hover:underline !text-white">Phim Hot</a>
          </nav>

          <div className="flex space-x-3 mt-3">
            <button className="w-full bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Đăng Nhập</button>
            <button className="w-full bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Đăng Ký</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
