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
            .get("https://phimapi.com/v1/api/quoc-gia/viet-nam?page=1&limit=50")
            .then((res) => {
                console.log("Data trả về", res.data);
                setMovies(res.data.data.items || []);
            })
            .catch((err) => {
                console.error("Lỗi khi lấy dữ liệu:", err);
            });
    }, []);

    return (
        <div className="bg-gray-900 py-4 w-full">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <h2 className="text-2xl font-bold text-white mb-6">
                    🎬 Phim Việt Nam
                </h2>

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
                        1280: { slidesPerView: 5 },
                    }}
                    className="w-full"
                >
                    {movies.map((movie) => (
                        <SwiperSlide key={movie._id}>
                            <Link to={`/phim/${movie.slug}`}>
                                <div className="bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-xl transition duration-300 group">
                                    <div className="relative transition-all duration-300">
                                        <div className="overflow-hidden relative">
                                            <Image
                                                orientation="horizontal"
                                                rounded="none"
                                                src={`https://img.phimapi.com/${movie.thumb_url}`}
                                                alt={movie.name}
                                                className=" transform group-hover:scale-105 group-hover:brightness-110 transition"
                                            />
                                        </div>
                                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                                            <span className="bg-black text-white text-xs  font-medium px-1 py-0.5 rounded">{movie.quality}</span>
                                            <span className="bg-white text-black text-xs font-medium px-1 py-0.5 rounded">{movie.lang}</span>
                                            <span className="bg-gradient-to-r from-yellow-400 via-yellow300 to-yellow-200 text-black text-xs font-medium px-2 py-0.5 rounded">
                                                {movie.episode_current}
                                            </span>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="text-white text-base font-semibold line-clamp-1 group-hover:text-yellow-400 transition">
                                                {movie.name}
                                            </h3>
                                            <p className="text-sm text-gray-400 line-clamp-1">
                                                {movie.origin_name}
                                            </p>
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
