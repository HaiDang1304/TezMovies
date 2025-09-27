import React, { useState } from "react";
import GoogleLoginButton from "./GoogleLoginButton";

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Xóa lỗi khi user bắt đầu nhập
    if (error) setError('');
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email không hợp lệ');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Quan trọng cho session
        body: JSON.stringify(formData),
      });

      // Kiểm tra content-type trước khi parse JSON
      const contentType = response.headers.get('content-type');
      let data = null;

      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (parseError) {
          console.error('❌ JSON parse error:', parseError);
          setError('Server trả về dữ liệu không hợp lệ');
          return;
        }
      } else {
        // Server không trả về JSON
        const text = await response.text();
       
        setError(`Lỗi server (${response.status}): ${response.statusText}`);
        return;
      }

      if (response.ok) {
        // Đăng nhập thành công
        console.log('✅ Login successful:', data);
        
        // Refresh trang để cập nhật auth state
        window.location.reload();
        
        // Hoặc có thể gọi callback để update state
        // onLoginSuccess(data.user);
        
        onClose();
        
        // Reset form
        setFormData({ email: '', password: '' });
      } else {
        // Hiển thị lỗi từ server
        setError(data?.message || `Đăng nhập thất bại (${response.status})`);
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Không thể kết nối đến server. Kiểm tra kết nối mạng.');
      } else {
        setError('Lỗi không xác định. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

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

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              className="mb-4 px-4 py-3 rounded-lg border border-gray-600 bg-[#2A2A4A]/80 text-white text-base 
                focus:outline-none focus:ring-2 focus:ring-[#FFD369] transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              className="mb-6 px-4 py-3 rounded-lg border border-gray-600 bg-[#2A2A4A]/80 text-white text-base 
                focus:outline-none focus:ring-2 focus:ring-[#FFD369] transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mb-6 bg-[#FFD369] rounded-lg py-3 font-semibold text-gray-900 hover:bg-yellow-300 
                transition-all duration-200 w-full shadow-md hover:shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FFD369]
                flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </div>

          <a
            href="#"
            className="text-sm text-gray-400 text-center mb-6 hover:text-gray-200 transition-colors duration-200 block"
          >
            Quên mật khẩu?
          </a>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-[#1E1E3F] to-[#2A2A4A] text-gray-400">
                Hoặc
              </span>
            </div>
          </div>

          <GoogleLoginButton />
        </div>
      </div>
    </>
  );
}