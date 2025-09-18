// src/components/SectionMovieVN.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";
import Image from "./Image";
import { API_URL } from "../constants/env";
import Loading from "./Loading";

const SlideVNMovie = ({ limit = 12, page = 1 }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await axios(
          `${API_URL}/v1/api/quoc-gia/viet-nam?page=${page}&limit=${limit}`
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

  // console.log(movies);
  if (loading) return <Loading />;

  return (
    <div className="py-4 px-4 sm:py-6 sm:px-6 relative rounded-2xl w-full justify-center items-center">
      <div className="xl:px-8">
        <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gradient-movieVN drop-shadow-md">
            Phim Việt Nam
          </h2>
          <Link
            to="/quoc-gia/viet-nam"
            className="text-white  font-medium text-md bg-gray-900 border border-white px-2 h-8 rounded-3xl hover:text-amber-300 hover:border-amber-300 "
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
                <div className="relative w-full h-[300px] sm:h-[365px] bg-gray-900 items-center justify-between rounded-xl overflow-hidden shadow-lg">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="flex-1 flex items-center justify-center text-center p-4 sm:p-6 md:pt-10 order-2 md:order-1">
                      <div className="w-full max-w-lg">
                        <h3 className="text-lg sm:text-2xl md:text-4xl font-bold text-white group-hover:text-red-400 transition text-gradient-secondary mb-2">
                          {movie.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-amber-300 italic mb-3 sm:mb-4">
                          {movie.origin_name}
                        </p>

                        <div className="flex flex-wrap gap-1 sm:gap-2 items-center justify-center mb-3 sm:mb-4">
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

                        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 mb-3 sm:mb-6">
                          {movie.category?.slice(0, 4).map((item, index) => (
                            <div
                              key={index}
                              className="bg-red-500 p-1 px-2 text-xs font-medium rounded-2xl"
                            >
                              {item.name}
                            </div>
                          ))}
                        </div>

                        <div className="hidden sm:flex justify-center">
                          <p className="max-w-2xl text-amber-300 font-semibold text-sm sm:text-xl text-center p-2 rounded-2xl">
                            Ngày cập nhật:{" "}
                            {new Date(movie.modified?.time).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

            
                    <div className="relative w-full md:w-[350px] lg:w-[450px] xl:w-[650px] h-[150px] sm:h-[200px] md:h-full dot-overlay order-1 md:order-2">
                      <Image
                        orientation="horizontal"
                        rounded="none"
                        src={`https://img.phimapi.com/${movie.thumb_url}`}
                        alt={movie.name}
                        className="w-full h-full object-cover rounded-t-xl md:rounded-t-none md:rounded-r-xl group-hover:scale-105 transition-transform"
                      />

          
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent pointer-events-none z-[1]"></div>
                    </div>
                  </div>

          
                  <div className="absolute bottom-[-4px] left-2 right-2 sm:hidden ">
                    <p className="text-amber-300 font-medium text-xs text-center p-1 rounded">
                      Cập nhật:{" "}
                      {new Date(movie.modified?.time).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
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

export default SlideVNMovie;
