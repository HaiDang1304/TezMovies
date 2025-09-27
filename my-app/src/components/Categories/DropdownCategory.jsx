import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DropdownCategory = () => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // <768px là mobile
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="relative group"
      onClick={() => isMobile && setOpen(!open)}
      onMouseEnter={() => !isMobile && setOpen(true)} 
      onMouseLeave={() => !isMobile && setOpen(false)}
    >
      <button className="!text-white flex items-center cursor-pointer">
        Thể loại ▾
      </button>

      <div
        className={`
          absolute text-sm -translate-x-1/2 left-1/2
          w-[720px] grid grid-cols-5 gap-3 rounded-xl bg-black/90 p-4 shadow-lg
          transition-all duration-300 ease-in-out
          ${open ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-95 -translate-y-2 invisible"} z-50
        `}
      >
        <Link to="/the-loai/hanh-dong" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Hành Động</Link>
        <Link to="/the-loai/co-trang" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Cổ Trang</Link>
        <Link to="/the-loai/chien-tranh" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Chiến Tranh</Link>
        <Link to="/the-loai/vien-tuong" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Viễn Tưởng</Link>
        <Link to="/the-loai/kinh-di" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Kinh Dị</Link>
        <Link to="/the-loai/tai-lieu" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Tài Liệu</Link>
        <Link to="/the-loai/tre-em" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Hoạt Hình</Link>
        <Link to="/the-loai/lich-su" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Lịch Sử</Link>
        <Link to="/the-loai/bi-an" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Bí Ẩn</Link>
        <Link to="/the-loai/phim-18" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Phim 18+</Link>
        <Link to="/the-loai/tinh-cam" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Tình Cảm</Link>
        <Link to="/the-loai/tam-li" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Tâm Lí</Link>
        <Link to="/the-loai/the-thao" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Thể Thao</Link>
        <Link to="/the-loai/phieu-luu" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Phiêu Lưu</Link>
        <Link to="/the-loai/am-nhac" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Âm Nhạc</Link>
        <Link to="/the-loai/gia-dinh" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Gia Đình</Link>
        <Link to="/the-loai/hoc-duong" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Học Đường</Link>
        <Link to="/the-loai/hai-huoc" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Hài Hước</Link>
        <Link to="/the-loai/hinh-su" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Hình Sự</Link>
        <Link to="/the-loai/vo-thuat" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Võ Thuật</Link>
        <Link to="/the-loai/khoa-hoc" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Khoa Học</Link>
        <Link to="/the-loai/than-thoai" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Thần Thoại</Link>
        <Link to="/the-loai/chinh-kich" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Chính Kịch</Link>
        <Link to="/the-loai/kinh-dien" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Kinh Điển</Link>
      </div>
    </div>
  );
};

export default DropdownCategory;
