import React from "react";

export default function Profile() {
  return (
    <div className="p-6 max-w-3xl">
      <div className="text-lg font-medium">Tài khoản</div>
      <div className="text-sm text-gray-500 font-semibold mt-2 mb-4">Cập nhật thông tin cá nhân của bạn.</div>
      <form className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value="haidanglu2004@gmail.com"
            readOnly
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          />
        </div>
        <div>
          <label className="block mb-1">Tên hiển thị</label>
          <input
            type="text"
            defaultValue="Hải Đăng Lữ"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          />
        </div>
        <div>
          <label className="block mb-1">Giới tính</label>
          <div className="flex gap-4">
            <label>
              <input type="radio" name="gender" /> Nam
            </label>
            <label>
              <input type="radio" name="gender" /> Nữ
            </label>
            <label>
              <input type="radio" name="gender" defaultChecked /> Không xác định
            </label>
          </div>
        </div>
        <button className="px-4 py-2 bg-yellow-500 text-black rounded">
          Cập nhật
        </button>
      </form>
    </div>
  );
}
