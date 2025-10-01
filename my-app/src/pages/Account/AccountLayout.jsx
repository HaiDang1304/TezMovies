import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function AccountLayout() {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white py-10 mt-10 px-8 ">
      {/* Sidebar */}
      <aside className="min-w-[300px] bg-gray-800 p-6 flex flex-col rounded-3xl mt-4 mr-6">
        <h2 className="text-xl font-medium mb-6 items-center justify-center">
          Quản lý tài khoản
        </h2>
        <nav className="flex flex-col gap-1">
          <NavLink
            to="favorites"
            className={({ isActive }) =>
              `px-2 py-2 rounded hover:bg-gray-700 ${
                isActive ? "bg-gray-700 text-yellow-400" : ""
              }`
            }
          >
            <div className="flex items-center p-2 gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                color="gray"
                className="inline w-6 h-6 mr-1"
                fill="currentColor"
              >
                <path d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z" />
              </svg>
              <div className="text-sm font-extralight">Yêu thích</div>
            </div>
            <div className="border-t border-gray-700"></div>
          </NavLink>
          <NavLink
            to="lists"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-gray-700 ${
                isActive ? "bg-gray-700 text-yellow-400" : ""
              }`
            }
          >
            <div className="flex items-center p-2 gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                color="gray"
                className="inline w-6 h-6 mr-1"
                fill="currentColor"
              >
                <path d="M112 208C138.5 208 160 186.5 160 160C160 133.5 138.5 112 112 112C85.5 112 64 133.5 64 160C64 186.5 85.5 208 112 208zM256 128C238.3 128 224 142.3 224 160C224 177.7 238.3 192 256 192L544 192C561.7 192 576 177.7 576 160C576 142.3 561.7 128 544 128L256 128zM256 288C238.3 288 224 302.3 224 320C224 337.7 238.3 352 256 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L256 288zM256 448C238.3 448 224 462.3 224 480C224 497.7 238.3 512 256 512L544 512C561.7 512 576 497.7 576 480C576 462.3 561.7 448 544 448L256 448zM112 528C138.5 528 160 506.5 160 480C160 453.5 138.5 432 112 432C85.5 432 64 453.5 64 480C64 506.5 85.5 528 112 528zM160 320C160 293.5 138.5 272 112 272C85.5 272 64 293.5 64 320C64 346.5 85.5 368 112 368C138.5 368 160 346.5 160 320z" />
              </svg>
              <div className="text-sm font-extralight">Danh sách</div>
            </div>
            <div className="border-t border-gray-700"></div>
          </NavLink>
          <NavLink
            to="watch-later"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-gray-700 ${
                isActive ? "bg-gray-700 text-yellow-400" : ""
              }`
            }
          >
            <div className="flex items-center p-2 gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                color="gray"
                className="inline w-6 h-6 mr-1"
                fill="currentColor"
              >
                <path d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z" />
              </svg>
              <div className="text-sm font-extralight">Xem tiếp</div>
            </div>
            <div className="border-t border-gray-700"></div>
          </NavLink>
          <NavLink
            to="profile"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-gray-700 ${
                isActive ? "bg-gray-700 text-yellow-400" : ""
              }`
            }
          >
            <div className="flex items-center p-2 gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                color="gray"
                className="inline w-6 h-6 mr-1"
                fill="currentColor"
              >
                <path d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z" />
              </svg>
              <div className="text-sm font-extralight">Tài khoản</div>
            </div>
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-2">
        <Outlet />
      </main>
    </div>
  );
}
