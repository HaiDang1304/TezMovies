import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import Image from "./Image";

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get("https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1")
      .then((res) => {
        setMovies(res.data.items);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu:", err);
      });
  }, []);

  return (
    <div className="bg-gray-900 py-4 w-full">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-6">🎬 Phim mới cập nhật</h2>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 2500 }}
          spaceBetween={16}
          loop={true}
          breakpoints={{
            0: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="w-full "
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie._id}>
              <Link to={`/phim/${movie.slug}`}>
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-xl transition duration-300 group">
                  <div>
                    <div className="overflow-hidden relative h-0 pb-[150%]">
                      <Image
                        rounded="none"
                        src={movie.poster_url}
                        alt={movie.name}
                        className=" transform group-hover:scale-105 group-hover:brightness-110 transition duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-white text-base font-semibold line-clamp-1 group-hover:text-yellow-400 transition">
                        {movie.name}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-1">{movie.origin_name}</p>
                    </div>
                  </div>

                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default MovieList;
