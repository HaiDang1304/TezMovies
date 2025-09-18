import React from "react";
import GoogleLoginButton from "./GoogleLoginButton";

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  if (!isOpen) return null;



  const handleSwitchToRegister = () => {
    onClose();
    onSwitchToRegister();
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] transition-opacity duration-300"
      />

      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        bg-gradient-to-br from-[#1E1E3F] to-[#2A2A4A] rounded-2xl w-full max-w-[480px] sm:max-w-[640px] lg:max-w-[800px]
        z-[1001] flex overflow-hidden shadow-2xl transition-all duration-300"
      >
        <div className="hidden sm:block sm:w-48 lg:w-64 relative">
          <div
            className="absolute inset-0 bg-center bg-cover filter brightness-75 transition-all duration-300"
            style={{ backgroundImage: "url('/bannerlogin.png')" }}
          />
        </div>

        <div className="flex-1 p-6 sm:p-8 flex flex-col text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Đăng nhập</h2>
            <button
              onClick={onClose}
              className="text-white text-3xl font-bold hover:text-gray-300 transition-transform duration-200 hover:scale-110"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          <p className="text-sm sm:text-base text-gray-300 mb-6">
            Nếu bạn chưa có tài khoản ?{" "}
            <button
              onClick={handleSwitchToRegister}
              className="text-[#FFD369] hover:text-yellow-300 hover:opacity-80 transition-transform duration-150 transform hover:scale-105 cursor-pointer"
            >
              Đăng Ký Ngay
            </button>
          </p>

          <input
            type="email"
            placeholder="Email"
            className="mb-4 px-4 py-3 rounded-lg border border-gray-600 bg-[#2A2A4A]/80 text-white text-base focus:outline-none focus:ring-2 focus:ring-[#FFD369] transition-all duration-200"
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            className="mb-6 px-4 py-3 rounded-lg border border-gray-600 bg-[#2A2A4A]/80 text-white text-base focus:outline-none focus:ring-2 focus:ring-[#FFD369] transition-all duration-200"
          />

          <button
            className="mb-6 bg-[#FFD369] rounded-lg py-3 font-semibold text-gray-900 hover:bg-yellow-300 transition-all duration-200 w-full shadow-md hover:shadow-lg"
          >
            Đăng nhập
          </button>

          <a
            href="#"
            className="text-sm text-gray-400 text-center mb-6 hover:text-gray-200 transition-colors duration-200 block"
          >
            Quên mật khẩu?
          </a>

          <GoogleLoginButton/>
        </div>
      </div>
    </>
  );
}