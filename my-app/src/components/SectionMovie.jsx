import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import Image from "./Image";
import { API_URL } from "../constants/env";
import Loading from "./Loading";

const SectionMovie = ({
    describe, slug, swiperResponsive = {
        0: { slidesPerView: 2 },
        640: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 },
        1280: { slidesPerView: 5 },
    }, orientation = "vertical", limit = 16, page = 1
}) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nameMovie, setNameMovie] = useState("");


    useEffect(() => {
        // axios
        //     .get("https://phimapi.com/v1/api/quoc-gia/trung-quoc?page=1&limit=50")
        //     .then((res) => {
        //         console.log("Data trả về", res.data);
        //         setMovies(res.data.data.items || []);
        //     })
        //     .catch((err) => {
        //         console.error("Lỗi khi lấy dữ liệu:", err);
        //     });
        const getData = async () => {
            try {
                setLoading(true);
                const res = await axios(`${API_URL}/v1/api/${describe}/${slug}?page=${page}&limit=${limit}`)
                const data = res.data.data
                console.log(res)
                setMovies(data.items || []);
                setNameMovie(data.titlePage)

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }


        }
        getData()
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, []);

    console.log(movies)

    if (loading) return <Loading />;
    // if (!loading || movies.length === 0) return null;

    return (
        <div className="bg-gray-900 w-full">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <Link to={`/${describe}/${slug}`}>
                    <div className="flex justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white ">
                            Phim {nameMovie}
                        </h2>
                        <button className="text-white  font-medium text-md bg-gray-900 border border-white px-2 h-8 rounded-3xl hover:text-amber-300 hover:border-amber-300 ">Xem thêm </button>
                    </div>
                </Link>


                <Swiper
                    modules={[Autoplay, Pagination]}
                    autoplay={{ delay: 2000 }}
                    spaceBetween={16}
                    loop={true}
                    breakpoints={swiperResponsive}
                    className="w-full"
                >
                    {movies.map((movie) => (
                        <SwiperSlide key={movie._id}>
                            <Link to={`/phim/${movie.slug}`}>
                                <div className="bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-xl transition duration-300 group">
                                    <div className="relative transition-all duration-300">
                                        <div className="overflow-hidden relative">
                                            <Image
                                                orientation={orientation}
                                                rounded="none"
                                                src={`https://img.phimapi.com/${movie.thumb_url}`}
                                                alt={movie.name}
                                                className=" transform group-hover:scale-105 group-hover:brightness-110 transition"
                                            />
                                        </div>
                                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                                            <span className="bg-black text-white text-xs  font-medium px-1 py-0.5 rounded">{movie.quality}</span>
                                            {movie.lang.split(/\s*\+\s*/).map((langItem, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-white text-black text-xs font-medium px-1 py-0.5 rounded mr-1">
                                                    {langItem}
                                                </span>
                                            ))}
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

export default SectionMovie;
