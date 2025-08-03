import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-md text-white px-3 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <a href="/" className="flex items-center space-x-2">
                        <h2 className="text-3xl font-bold text-white">Tez</h2>
                        <h2 className="text-3xl font-bold text-red-600">Movies</h2>
                    </a>

                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="pl-10 pr-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                    />
                </div>
                <nav>
                    <ul className="flex space-x-6 text-lg font-medium ">
                        <li><a href="#" className="hover:underline !text-white">Chủ đề</a></li>
                        <li><a href="#" className="hover:underline !text-white">Thể Loại</a></li>
                        <li><a href="#" className="hover:underline !text-white">Phim Mới</a></li>
                        <li><a href="#" className="hover:underline !text-white">Phim Hot</a></li>
                    </ul>
                </nav>
                <div className="flex items-center space-x-4">
                    <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition-colors">
                        Đăng Nhập
                    </button>
                    <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                        Đăng Ký
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
