import React from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";

const GoogleLoginButton = ({ onLoginSuccess }) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // Gửi token về backend để xác thực
      fetch(`${process.env.REACT_APP_API_URL}/auth/google/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: tokenResponse.code }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            onLoginSuccess(data.user); // Truyền user lên component cha
          } else {
            console.error("Login failed:", data.message);
          }
        })
        .catch((error) => console.error("Error:", error));
    },
    onError: (error) => console.error("Login Failed:", error),
    flow: "auth-code", // Sử dụng flow auth code để lấy code từ Google
  });

  return (
    <GoogleOAuthProvider clientId="685737935777-maqlvjhft09oistl0e1jdm54m1m02fee.apps.googleusercontent.com">
      <div className="w-full">
        <button
          onClick={() => login()}
          className="flex items-center justify-center gap-3 bg-white text-gray-700 font-medium px-5 py-2 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 w-full cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 48 48"
          >
            <path
              fill="#4285F4"
              d="M24 9.5c3.54 0 6.72 1.22 9.22 3.6l6.88-6.88C35.9 2.4 30.3 0 24 0 14.62 0 6.52 5.38 2.56 13.22l7.98 6.2C12.46 13.32 17.74 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.5 24.5c0-1.56-.14-3.05-.39-4.5H24v9h12.7c-.55 2.9-2.2 5.36-4.7 7.04l7.4 5.76C43.44 38.48 46.5 32 46.5 24.5z"
            />
            <path
              fill="#FBBC05"
              d="M10.54 28.58c-.64-1.9-1-3.92-1-6.08s.36-4.18 1-6.08l-7.98-6.2C1.42 13.82 0 18.74 0 24s1.42 10.18 3.56 13.78l7.98-6.2z"
            />
            <path
              fill="#EA4335"
              d="M24 48c6.3 0 11.6-2.08 15.47-5.66l-7.4-5.76c-2.07 1.4-4.72 2.24-8.07 2.24-6.26 0-11.54-3.82-13.46-9.12l-7.98 6.2C6.52 42.62 14.62 48 24 48z"
            />
          </svg>
          Đăng nhập với Google
        </button>
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;