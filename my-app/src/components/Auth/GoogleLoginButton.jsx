
// import React, { useEffect, useState } from "react";
// import { GoogleOAuthProvider } from "@react-oauth/google";

// const GoogleLoginButton = ({ onLoginSuccess }) => {
//   const [isChecking, setIsChecking] = useState(false);
  
//   // Detect mobile với accuracy cao hơn
//   const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
//   const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
//   const isAndroid = /Android/.test(navigator.userAgent);

//   const handleLoginClick = () => {
//     const authUrl = `${import.meta.env.VITE_API_URL}/auth/google?prompt=select_account`;
//     console.log(`🔄 Redirecting to: ${authUrl} (${isMobile ? 'Mobile' : 'Desktop'})`);
    
//     if (isMobile) {
//       // Trên mobile, mở trong cùng tab để giữ session context
//       window.location.href = authUrl;
//     } else {
//       // Desktop có thể dùng popup hoặc redirect
//       window.location.href = authUrl;
//     }
//   };

//   // Enhanced user check với retry mechanism cho mobile
//   const checkUserAuth = async (retryCount = 0) => {
//     const maxRetries = isMobile ? 5 : 3;
    
//     try {
//       setIsChecking(true);
//       console.log(`🔍 Checking auth (attempt ${retryCount + 1}/${maxRetries})`);
      
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//           'Cache-Control': 'no-cache',
//           'Pragma': 'no-cache'
//         }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         console.log('✅ User authenticated:', data.user);
//         setIsChecking(false);
//         if (onLoginSuccess) {
//           onLoginSuccess(data.user);
//         }
//         return true;
//       } else {
//         console.log(`❌ User not authenticated (${response.status})`);
        
//         // Retry logic cho mobile
//         if (retryCount < maxRetries - 1 && isMobile) {
//           console.log(`🔄 Retrying in ${(retryCount + 1) * 1000}ms...`);
//           setTimeout(() => {
//             checkUserAuth(retryCount + 1);
//           }, (retryCount + 1) * 1000);
//           return false;
//         }
//       }
//     } catch (error) {
//       console.error('❌ Auth check failed:', error);
      
//       // Retry on network error for mobile
//       if (retryCount < maxRetries - 1 && isMobile) {
//         console.log(`🔄 Network error, retrying in ${(retryCount + 1) * 1000}ms...`);
//         setTimeout(() => {
//           checkUserAuth(retryCount + 1);
//         }, (retryCount + 1) * 1000);
//         return false;
//       }
//     }
    
//     setIsChecking(false);
//     return false;
//   };

//   // Check for auth success on page load
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const authStatus = urlParams.get('auth');
    
//     if (authStatus === 'success') {
//       console.log('🔄 Auth success detected from URL, checking user...');
      
//       // Longer delay cho mobile browsers để đảm bảo session đã được lưu
//       const delay = isMobile ? 
//         (isIOS ? 4000 : isAndroid ? 3000 : 2000) : 1000;
      
//       setTimeout(() => {
//         checkUserAuth(0);
//         // Clean URL after processing
//         window.history.replaceState({}, document.title, window.location.pathname);
//       }, delay);
//     } else if (authStatus === 'failed') {
//       console.error('❌ Authentication failed');
//       setIsChecking(false);
//       // Clean URL
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }
//   }, []);

//   // Auto-check auth on component mount (cho trường hợp user đã login)
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     if (!urlParams.get('auth')) {
//       // Chỉ check nếu không có auth param để tránh double check
//       checkUserAuth(0);
//     }
//   }, []);

//   return (
//     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
//       <div className="w-full">
//         <button
//           onClick={handleLoginClick}
//           disabled={isChecking}
//           className={`flex items-center justify-center gap-3 bg-white text-gray-700 font-medium px-5 py-2 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 w-full ${
//             isChecking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
//           }`}
//         >
//           {isChecking ? (
//             <>
//               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
//               <span>Đang kiểm tra...</span>
//             </>
//           ) : (
//             <>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 48 48"
//               >
//                 <path
//                   fill="#4285F4"
//                   d="M24 9.5c3.54 0 6.72 1.22 9.22 3.6l6.88-6.88C35.9 2.4 30.3 0 24 0 14.62 0 6.52 5.38 2.56 13.22l7.98 6.2C12.46 13.32 17.74 9.5 24 9.5z"
//                 />
//                 <path
//                   fill="#34A853"
//                   d="M46.5 24.5c0-1.56-.14-3.05-.39-4.5H24v9h12.7c-.55 2.9-2.2 5.36-4.7 7.04l7.4 5.76C43.44 38.48 46.5 32 46.5 24.5z"
//                 />
//                 <path
//                   fill="#FBBC05"
//                   d="M10.54 28.58c-.64-1.9-1-3.92-1-6.08s.36-4.18 1-6.08l-7.98-6.2C1.42 13.82 0 18.74 0 24s1.42 10.18 3.56 13.78l7.98-6.2z"
//                 />
//                 <path
//                   fill="#EA4335"
//                   d="M24 48c6.3 0 11.6-2.08 15.47-5.66l-7.4-5.76c-2.07 1.4-4.72 2.24-8.07 2.24-6.26 0-11.54-3.82-13.46-9.12l-7.98 6.2C6.52 42.62 14.62 48 24 48z"
//                 />
//               </svg>
//               Đăng nhập với Google
//             </>
//           )}
//         </button>
        
//         {/* Debug info - remove in production */}
//         {import.meta.env.DEV && (
//           <div className="mt-2 text-xs text-gray-500 text-center space-y-1">
//             <div>Device: {isMobile ? '📱 Mobile' : '💻 Desktop'}</div>
//             {isMobile && (
//               <div>Platform: {isIOS ? '🍎 iOS' : isAndroid ? '🤖 Android' : '📱 Mobile'}</div>
//             )}
//             {isChecking && <div className="text-blue-500">🔄 Checking authentication...</div>}
//           </div>
//         )}
        
//         {/* Status indicator */}
//         {isChecking && (
//           <div className="mt-2 text-center">
//             <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
//               <div className="animate-pulse mr-2">⏳</div>
//               Đang xác thực...
//             </div>
//           </div>
//         )}
//       </div>
//     </GoogleOAuthProvider>
//   );
// };

// export default GoogleLoginButton;

import React from "react";

export default function GoogleLoginButton() {
  const handleClick = () => {
    // Redirect thẳng tới backend
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center gap-2 bg-white text-gray-800 rounded-lg py-1 px-3 font-semibold hover:bg-gray-200 transition-all duration-200 w-full shadow-md hover:shadow-lg"
    >
      <img
        src="/icons8-google-96.png"
        alt="Google"
        className="w-10 h-10"
      />
      
      Đăng nhập với Google
    </button>
  );
}
