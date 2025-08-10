// Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-300 mt-10">
            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Cột 1: Thông tin */}
                <div>
                    <h2 className="text-xl font-bold text-amber-400 mb-3">Giới thiệu</h2>
                    <p className="text-md text-justify">
                        TezMovie là trang web xem phim trực tuyến được phát triển bởi Lữ Hải Đăng. Trang web là nền tảng xem phim
                        trực tuyến miễn phí với hàng nghìn bộ phim chất lượng cao, cập nhật nhanh chóng
                        và đầy đủ từ các quốc gia như Việt Nam, Trung Quốc, Hàn Quốc, Mỹ…
                        Tôi sẽ mang đến trải nghiệm xem phim mượt mà, không giật lag và có thể hỗ trợ trên nhiều thiết bị.
                    </p>
                </div>

                {/* Cột 2: Menu */}
                <div>
                    <h3 className="text-xl font-bold text-amber-400 mb-3">Bản Quyền</h3>
                    <p className="text-md text-justify">
                        Tất cả nội dung trên trang web được thu thập từ các nguồn phát video trực tuyến công khai trên Internet. Chúng tôi không lưu trữ hay phát trực tiếp bất kỳ nội dung bản quyền nào. Nếu bạn là chủ sở hữu bản quyền và nhận thấy nội dung nào vi phạm quyền lợi của mình, vui lòng liên hệ với chúng tôi để được hỗ trợ xử lý và gỡ bỏ kịp thời. Xin chân thành cảm ơn!
                    </p>
                </div>

                {/* Cột 3: Liên hệ */}
                <div>
                    <h3 className="text-xl font-bold text-amber-400 mb-3">Liên hệ</h3>
                    <div>
                        <span className="font-bold text-3xl">Tez</span>
                        <span className="font-bold text-3xl text-red-500">Moive</span>
                    </div>
                    <div className="flex space-x-4 text-xl py-4">
                        <a href="#" className="hover:text-blue-500"><FaFacebookF /></a>
                        <a href="#" className="hover:text-red-500"><FaYoutube /></a>
                        <a href="#" className="hover:text-gray-400"><FaGithub /></a>
                    </div>
                </div>

            </div>

            {/* Copyright */}
            <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-500">
                © {new Date().getFullYear()} - Phát tiển bởi LuHaiDang.
            </div>
        </footer>
    );
};

export default Footer;
