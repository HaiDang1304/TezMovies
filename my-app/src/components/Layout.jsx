import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const Layout = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Mở modal đăng nhập
  const openLogin = () => {
    setIsRegisterOpen(false); // Đóng modal đăng ký nếu đang mở
    setIsLoginOpen(true);
  };

  // Mở modal đăng ký
  const openRegister = () => {
    setIsLoginOpen(false); // Đóng modal đăng nhập nếu đang mở
    setIsRegisterOpen(true);
  };

  // Đóng tất cả modal
  const closeAllModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        onLoginClick={openLogin}
        onRegisterClick={openRegister} // Thêm prop này
      />
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

      {/* Modal đăng nhập */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={closeAllModals}
        onSwitchToRegister={openRegister} // Thêm prop này để chuyển sang đăng ký
      />

      {/* Modal đăng ký */}
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={closeAllModals}
        onSwitchToLogin={openLogin} // Thêm prop này để chuyển sang đăng nhập
      />
    </div>
  );
};

export default Layout;