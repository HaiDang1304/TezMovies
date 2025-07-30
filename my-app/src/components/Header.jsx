import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
const Header = () => {
    return (
        <header className="bg-gray-800 text-white px-6 py-4 w-full">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-bold">TezMovies</h1>
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
                    <ul className="flex space-x-6 text-lg font-medium">
                        <li><a href="#" className="hover:underline">Chủ đề</a></li>
                        <li><a href="#" className="hover:underline">Thể Loại</a></li>
                        <li><a href="#" className="hover:underline">Phim Mới</a></li>
                        <li><a href="#" className="hover:underline">Phim Hot</a></li>
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
