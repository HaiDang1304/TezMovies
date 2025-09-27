import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";

const DropdownList = () => {
    const [open, setOpen] =useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const handleSelect = () =>{
      setOpen(false);
    }
    useEffect (()=>{
      const handleResize = () => setIsMobile (window.innerWidth <768);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    },[]);
   
  return (
    <div className="relative group"
    onClick={() => isMobile && setOpen(!open)}
    onMouseEnter={() => !isMobile && setOpen(true)}
    onMouseLeave={() => !isMobile && setOpen(false)}>
      <button className="!text-white flex items-center cursor-pointer">
        Danh mục ▾
      </button>
      <div  className={`
          absolute text-sm -translate-x-1/2 left-1/2
          lg:w-[620px] w-[420px] grid grid-cols-3 gap-2 rounded-xl bg-black/90 px-4 py-4  shadow-lg
          transition-all duration-300 ease-in-out
          ${
            open
              ? "opacity-100 scale-100 translate-y-0 visible"
              : "opacity-0 scale-95 -translate-y-2 invisible"
          }
        `}>
        <Link to="/danh-sach/phim-le" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Phim Lẻ</Link>
        <Link to="danh-sach/phim-bo" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Phim Bộ</Link>
        <Link to="/danh-sach/hoat-hinh" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Phim Hoạt Hình</Link>
        <Link to="/danh-sach/tv-shows" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Phim Truyền Hình</Link>
        <Link to="/danh-sach/phim-vietsub" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Phim Phụ Đề</Link>
        <Link to="/danh-sach/phim-long-tieng" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Phim Lồng Tiếng</Link>
        <Link to="/danh-sach/phim-thuyet-minh" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Phim Thuyết Minh</Link>
        <Link to="/danh-sach/phim-chieu-rap" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Phim Chiếu Rạp</Link>
        <Link to="/danh-sach/subteam" className="block rounded-lg px-3 py-2 hover:bg-gray-800 hover:text-amber-300">Phim Độc Quyền</Link>
      </div>
    </div>
  );
};

export default DropdownList;
