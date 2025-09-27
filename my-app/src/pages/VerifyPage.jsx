import React, { useEffect, useState } from 'react';

export default function VerifyPage() {
  // Get token from URL params (you'll need to pass this as prop)
  const token = window.location.pathname.split('/verify/')[1];
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        console.log('🔍 Verifying token:', token);
        console.log('🔍 API URL:', `/api/auth/verify/${token}`);
        
        const response = await fetch(`/api/auth/verify/${token}`, {
          method: 'GET',
          credentials: 'include'
        });
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
        
        const contentType = response.headers.get('content-type');
        console.log('📡 Content-Type:', contentType);
        
        let data = null;

        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
          console.log('📝 JSON data:', data);
        } else {
          const text = await response.text();
          console.error('❌ Non-JSON response (first 500 chars):', text.substring(0, 500));
          
          // Nếu trả về HTML, có thể endpoint không tồn tại
          if (text.includes('<html')) {
            throw new Error('API endpoint không tồn tại. Server trả về trang HTML thay vì JSON.');
          }
          
          throw new Error('Server trả về dữ liệu không hợp lệ');
        }
        
        if (response.ok) {
          console.log('✅ Verification successful:', data);
          setStatus('success');
          setMessage(data.message || 'Xác thực thành công!');
          
          // Tự động chuyển về trang chủ sau 3 giây
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        } else {
          console.error('❌ Verification failed:', data);
          setStatus('error');
          setMessage(data.message || 'Xác thực thất bại');
        }
      } catch (err) {
        console.error('❌ Verify error:', err);
        setStatus('error');
        setMessage(err.message || 'Lỗi kết nối server');
      }
    };

    if (token) {
      verifyToken();
    } else {
      setStatus('error');
      setMessage('Token không hợp lệ');
    }
  }, [token]);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E1E3F] to-[#2A2A4A] px-4">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
        {status === 'verifying' && (
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#FFD369]/30 border-t-[#FFD369] rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-[#FFD369] rounded-full animate-pulse"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mt-6 mb-2">Đang xác thực</h2>
            <p className="text-gray-300">Vui lòng chờ trong giây lát...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Xác thực thành công!</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">{message}</p>
            <p className="text-sm text-gray-400 mb-6">
              Tự động chuyển về trang chủ sau 3 giây...
            </p>
            <button
              onClick={handleGoHome}
              className="bg-[#FFD369] hover:bg-yellow-300 text-gray-900 font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Về trang chủ ngay
            </button>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Xác thực thất bại</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">{message}</p>
            <div className="space-y-3">
              <button
                onClick={handleGoHome}
                className="w-full bg-[#FFD369] hover:bg-yellow-300 text-gray-900 font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Về trang chủ
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-all duration-200"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}