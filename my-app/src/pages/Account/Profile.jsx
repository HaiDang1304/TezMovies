import React, { useEffect, useState, useContext } from "react";
import UserAvatar from "../../components/Others/UserAvatar";
import useUser from "../../utils/useUser.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTh } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../context/UserContext.jsx";

export default function Profile() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("other");
  const { user, setUser, loading } = useContext(UserContext);

  // Load dữ liệu user vào form khi user thay đổi
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setGender(user.gender || "other");
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // gửi cookie
        body: JSON.stringify({ name, gender }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Cập nhật thành công!");
        // window.location.reload();
        setUser(data.user);
      } else {
        toast.error(data.message || "Cập nhật thất bại!");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Lỗi server, vui lòng thử lại!");
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
    <div className="p-2 min-w-full">
      <div className="text-lg font-medium py-2">Thông tin tài khoản</div>
      <div className="text-sm font-sans text-gray-500 py-2">
        Cập nhật thông tin tài khoản
      </div>
      <div className="flex gap-14">
        <form className="space-y-8 min-w-md">
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
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full p-3 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    checked={gender === g}
                    onChange={() => setGender(g)}
                    className="cursor-pointer"
                  />
                  {g === "male" ? "Nam" : g === "female" ? "Nữ" : "Khác"}
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleUpdate}
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
              <div className="flex gap-1">
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
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName={() =>
          "flex items-center gap-2 bg-gray-800 text-white rounded-lg shadow-lg p-3 w-[320px] h-[60px]"
        }
        bodyClassName="font-sans text-sm"
      />
    </div>
  );
}
