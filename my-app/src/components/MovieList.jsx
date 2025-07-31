import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";



const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get("https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1")
      .then((res) => {
        console.log(res.data.items);
        setMovies(res.data.items);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  return (
    <div className="bg-gray-900 py-8 w-full">
      <h2 className="text-2xl text-white font-bold max-w-7xl mx-auto px-4 mb-4">
        🎬 Phim mới cập nhật
      </h2>
      <Swiper
        pagination={{ dynamicBullets: true, clickable: true }}
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        modules={[Autoplay, Pagination]}
        autoplay={{ deplay: 2500 }}
        loop={true}
        className="w-full max-w-7xl mx-auto px-4"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie._id}>
            <Link to={`/phim/${movie.slug}`}>
              <div className="bg-gray-800 text-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group">
                <div className="overflow-hidden">
                  <img
                    src={movie.poster_url}
                    alt={movie.name}
                    className="w-full h-72 object-cover transfrom group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"
                  />
                </div>
                <div className="p-3">
                  <h2 className="text-base font-semibold line-clamp-1 group-hover:text-yellow-400 transition">{movie.name}</h2>
                  <p className="text-sm text-gray-400 line-clamp-1">{movie.origin_name}</p>
                </div>
              </div>
            </Link>
          </SwiperSlide>

        ))}
      </Swiper>
    </div>
  );
};

export default MovieList;
