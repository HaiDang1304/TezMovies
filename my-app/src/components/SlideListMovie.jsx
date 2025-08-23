import axios from "axios";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Image from "./Image";
import { Link } from "react-router-dom";

const SlideListMovie = () => {
  const [movies, setMovies] = useState();

  useEffect(() => {
    axios
      .get("https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3?page=1&limit=10")
      .then((res) => {
        setMovies(res.data.items);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu:", err);
      });
  }, []);

  return (
    <div>
      <Swiper
        slidesPerView={10}
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        grabCursor={true}
        effect="fade"
        loop={movies?.length > 1}
        className="w-full relative"
      >
        {movies?.map((movie, index) => (
          <SwiperSlide key={index}>
            <div className="relative">
              <Image
                orientation="custom"
                rounded="none"
                pbValueDefault={"pb-[48%]"}
                src={movie.thumb_url}
                alt={movie.name}
              />

              <div className="absolute left-0 bottom-0 p-16 max-w-[50%] pb-30 ">
                <h2 className="text-3xl font-bold text-gradient-primary">
                  {movie.name}
                </h2>
                <div className="flex gap-2 mt-4">
                  <p className="bg-[#fff5] p-1 px-2 rounded-xl text-black font-medium text-xs">
                    {movie.lang}
                  </p>
                  <p className="bg-[#fff5] p-1 px-2 rounded-xl text-black font-medium text-xs">
                    {movie.quality}
                  </p>
                  <p className="bg-[#fff5] p-1 px-2 rounded-xl text-black font-medium text-xs">
                    {movie.time}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {movie.category.map((item, index) => (
                    <Link to={`/the-loai/${item.slug}`}>
                      <div className="bg-amber-500 p-1 px-2 text-xs font-medium rounded-2xl">
                        {item.name}
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="flex flex-1 mt-4">
                  <Link to={`/xem-phim/${movie.slug}`}>
                  <button className="flex items-center cursor-pointer gap-2 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">
                   <svg xmlns="http://www.w3.org/2000/svg" 
                   viewBox="0 0 640 640"
                   className="w-4 h-4 ml-2 fill-current">
                   <path d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"/></svg>
                   <span className="whitespace-nowrap"> Xem Ngay</span>
                  </button>
                  </Link>

                  <Link to={`/phim/${movie.slug}`}>
                  <button className="flex items-center cursor-pointer text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                    <span className="whitespace-nowrap">Chi Tiết</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      className="w-4 h-4 ml-2 fill-current"
                    >
                      <path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM288 224C288 206.3 302.3 192 320 192C337.7 192 352 206.3 352 224C352 241.7 337.7 256 320 256C302.3 256 288 241.7 288 224zM280 288L328 288C341.3 288 352 298.7 352 312L352 400L360 400C373.3 400 384 410.7 384 424C384 437.3 373.3 448 360 448L280 448C266.7 448 256 437.3 256 424C256 410.7 266.7 400 280 400L304 400L304 336L280 336C266.7 336 256 325.3 256 312C256 298.7 266.7 288 280 288z" />
                    </svg>
                  </button>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SlideListMovie;
