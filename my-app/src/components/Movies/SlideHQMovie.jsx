// src/components/SectionMovieVN.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";
import Image from "../Image";
import { API_URL } from "../../constants/env";
import Loading from "./Loading";

const SlideVNMovie = ({ limit = 12, page = 1 }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await axios(
          `${API_URL}/v1/api/quoc-gia/han-quoc?page=${page}&limit=${limit}`
        );
        const data = res.data.data;
        setMovies(data.items || []);
      } catch (error) {
        console.error("Lỗi khi load phim VN:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [page, limit]);
  console.log(movies);
  if (loading) return <Loading />;

  return (
    <div className=" py-6 px-6 rounded-2xl max-w-[1650px] h-[480px] ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gradient-movieVN drop-shadow-md">
          Phim Việt Nam
        </h2>
        <Link
          to="/quoc-gia/viet-nam"
          className="text-white font-medium text-md bg-black/30 border border-white px-3 h-9 rounded-xl hover:text-yellow-300 hover:border-yellow-300 transition"
        >
          Xem thêm
        </Link>
      </div>

      <Swiper
        slidesPerView={1}
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        grabCursor={true}
        effect="fade"
        loop={movies?.length > 1}
        className="w-full relative"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie._id}>
            <Link to={`/phim/${movie.slug}`}>
              <div className=" relative w-full h-[365px] bg-gray-900 items-center justify-between rounded-xl overflow-hidden shadow-lg">
                <div className="flex h-[365px] ">
                  <div className="relative w-[650px] h-[1280px] dot-overlay">
                    <Image
                      orientation="horizontal"
                      rounded="none"
                      src={`https://img.phimapi.com/${movie.thumb_url}`}
                      alt={movie.name}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                    />

                    {/* Overlay gradient */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none z-[1]"></div>
                  </div>
                  <div className="grow-4 items-center justify-center text-center pt-10">
                    <h3 className="text-4xl p-2 font-bold text-white group-hover:text-red-400 transition text-gradient-secondary">
                      {movie.name}
                    </h3>
                    <p className="text-sm text-amber-300 italic mt-4">
                      {movie.origin_name}
                    </p>
                    <div className="flex gap-2 mt-4 items-center justify-center mt-8 ">
                      <p className="bg-[#fff5] p-1 px-2 rounded-xl text-white font-medium text-xs">
                        {movie.lang}
                      </p>
                      <p className="bg-[#fff5] p-1 px-2 rounded-xl text-white font-medium text-xs">
                        {movie.quality}
                      </p>
                      <p className="bg-[#fff5] p-1 px-2 rounded-xl text-white font-medium text-xs">
                        {movie.time}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                      {movie.category.map((item, index) => (
                        <div
                          key={index}
                          className="bg-red-500 p-1 px-2 text-xs font-medium rounded-2xl"
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 flex justify-center">
                      <p className=" max-w-2xl text-amber-300 font-semibold text-xl text-center p-2 rounded-2xl">
                        Ngày cập nhật:{" "}
                        {new Date(movie.modified?.time).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SlideVNMovie;
