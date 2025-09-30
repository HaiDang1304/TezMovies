
// import React from "react";

// export default function GoogleLoginButton() {
//   const handleClick = () => {
//     // Redirect thẳng tới backend
//     window.location.href = "http://localhost:3000/auth/google";
//   };

//   return (
//     <button
//       onClick={handleClick}
//       className="flex items-center justify-center gap-2 bg-white text-gray-800 rounded-lg py-1 px-3 font-semibold hover:bg-gray-200 transition-all duration-200 w-full shadow-md hover:shadow-lg"
//     >
//       <img
//         src="/icons8-google-96.png"
//         alt="Google"
//         className="w-10 h-10"
//       />
      
//       Đăng nhập với Google
//     </button>
//   );
// }

import React from "react";

export default function GoogleLoginButton() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleClick = () => {
    console.log("🔹 BACKEND_URL:", BACKEND_URL);
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center gap-2 bg-white text-gray-800 rounded-lg py-1 px-3 font-semibold hover:bg-gray-200 transition-all duration-200 w-full shadow-md hover:shadow-lg"
    >
      <img src="/icons8-google-96.png" alt="Google" className="w-10 h-10" />
      Đăng nhập với Google
    </button>
  );
}
