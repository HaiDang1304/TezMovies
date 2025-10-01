import React from "react";

export default function UserAvatar({ user, size = 40 }) {
  const dimension = `${size}px`; // kích thước động

  return user?.picture ? (
    <img
      src={user.picture}
      alt={user.name || "User avatar"}
      className={`w-[120px] h-[120px] rounded-full border`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "/avatar-default.png";
      }}
    />
  ) : (
    <div
      className={`w-[${dimension}] h-[${dimension}] rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold`}
    >
      {user?.name?.charAt(0).toUpperCase()}
    </div>
  );
}
