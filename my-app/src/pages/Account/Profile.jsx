import React from "react";
import UserAvatar from "../../components/Others/UserAvatar"; // đường dẫn tuỳ dự án
import useUser from "../../utils/useUser.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTh } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
  const { user, loading } = useUser();

  const handleLogout = async () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="mb-4 text-gray-400">Vui lòng đăng nhập</p>
        <a href="/" className="text-blue-400 hover:text-blue-300">
          Đăng nhập ngay
        </a>
      </div>
    );
  }

  return (
    <div className="p-2 min-w-full ">
      <div className="text-lg font-medium py-2">Thông tin tài khoản</div>
      <div className=" text-sm font-sans text-gray-500 py-2">
        Cập nhật thông tin tài khoản
      </div>
      <div className="flex gap-14">
        <form className="space-y-8 min-w-md ">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={user.email || ""}
              readOnly
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Tên hiển thị
            </label>
            <input
              type="text"
              defaultValue={user.name || ""}
              className="w-full p-3 rounded-lg  border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Giới tính
            </label>
            <div className="flex gap-4">
              {["male", "female", "other"].map((g) => (
                <label
                  key={g}
                  className="flex items-center gap-2 text-gray-300 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    defaultChecked={
                      g === user.gender || (!user.gender && g === "other")
                    }
                    className="cursor-pointer"
                  />
                  {g === "male" ? "Nam" : g === "female" ? "Nữ" : "Khác"}
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="w-full px-4 py-2 rounded-xl text-black hover:opacity-90"
            style={{
              background: "linear-gradient(39deg, #fecf59, #fff1cc)",
            }}
          >
            Cập nhật
          </button>
        </form>
        <div className="py-6 w-full">
          <div className="max-w-[120px] flex flex-col items-center text-center">
            <UserAvatar user={user} size={64} />
            <div className="mt-8 flex items-center gap-1">
             <div className="flex gap-1 ">
               <FontAwesomeIcon
                icon={faTh}
                className="text-xl text-white mb-1"
              />
              <p className="text-sm font-extralight">Ảnh có sẵn</p>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
