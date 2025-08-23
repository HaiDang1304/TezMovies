import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryCard from "./CateGoryCard.jsx";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import các module cần dùng
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Import CSS Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("https://phimapi.com/the-loai")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Lỗi lấy thể loại", err));
  }, []);

  return (
    <div className="bg-gray-900 text-white m-auto">
      <h2 className="text-2xl font-bold max-w-7xl mx-auto px-4 mb-4">
        Bạn đang quan tâm gì?
      </h2>

      <div className="max-w-7xl mx-auto p-4">
        <Swiper
          modules={[ Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          autoplay ={{delay: 3000}}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
        >
          {categories.slice(0, 8).map((category, idx) => (
            <SwiperSlide key={category.slug}>
              <CategoryCard category={category} index={idx} />
            </SwiperSlide>
          ))}

          {categories.length > 8 && (
            <SwiperSlide>
              <Link
                to={"/chu-de"}
                className="rounded-lg text-white p-4 cursor-pointer bg-gray-600 hover:opacity-80 transition h-full flex flex-col justify-center"
              >
                <h3 className="text-lg font-bold">Xem tất cả</h3>
                <p className="text-sm mt-2">Khám phá thêm &rarr;</p>
              </Link>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default CategoryList;
