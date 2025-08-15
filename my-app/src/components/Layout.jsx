import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import LoginModal from "./LoginModal";

const Layout = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <div className="flex flex-col min-h-screen">
 
      <Header onLoginClick={openLogin} />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
    </div>
  );
};

export default Layout;
