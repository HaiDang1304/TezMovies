import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Image from "../components/Image";
import Loading from "../components/Loading";

const CategoryDetail = () => {
  const { slug, describe } = useParams();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Cần kiểm tra từ API
  const [loading, setLoading] = useState(true);
  const [nameMovie, setNameMovie] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
 
    axios
      .get(`https://phimapi.com/v1/api/${describe}/${slug}?page=${page}&limit=24`)
      .then((res) => {
        console.log("API Response:", res.data); // Kiểm tra phản hồi
        const data = res.data.data;
        setMovies(data.items || []);
        setNameMovie(data.titlePage)
        // Kiểm tra trường totalPages hoặc số lượng phim tổng cộng
        if (data.totalPages) {
          setTotalPages(data.totalPages);
        } else if (data.pagination?.limit) {
          setTotalPages(Math.ceil(data.pagination.total / data.pagination.limit));
        } else {
          setTotalPages(1);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải phim theo thể loại:", err);
        setMovies([]);
        setLoading(false);
      });
    window.scrollTo({ top: 0, behavior: "smooth" })

  }, [slug, page]);


  const handleClick = (slug) => {
    navigate(`/phim/${slug}`);
  }
  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };


  if (loading)
    return <Loading />
  if (!movies || movies.length === 0) {
    return (
      <div className="items-center justify-center flex min-h-screen">
        <h1>Không có phim để Loading</h1>
      </div>)
  }


  return (
    <div className="max-w-[1600px] mx-auto min-h-scree text-white px-4 sm:px-6 lg:px-20 py-12">
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">{describe === "the-loai" ? "Thể loại : " : "Quốc gia : "} {nameMovie}</h2>


        <>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {movies.map((movie, index) => (
              <div key={index} className="bg-gray-800 text-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group">
                <div className="overflow-hidden">
                  <div key={movie._id}
                    className="bg-gray-800 text-white rounded-lg cursor-pointer hover:opacity-80 transition"
                    onClick={() => handleClick(movie.slug)}>
                    <div className="relative transition-all duration-300">
                      {/* Poster phim */}
                      <Image
                        rounded="none"
                        src={`https://img.phimapi.com/${movie.poster_url}`}
                        alt={movie.name}
                        className="transform group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"
                      />

                      {/* Badge góc trên trái */}
                      <div className="absolute top-2 left-2 hidden lg:flex flex-wrap gap-1">
                        <span className="bg-black text-white text-xs  font-medium px-1 py-0.5 rounded">{movie.quality}</span>
                        {movie.lang.split(/\s*\+\s*/).map((langItem, index) => (
                          <span
                            key={index}
                            className="bg-white text-black text-xs font-medium px-1 py-0.5 rounded mr-1">
                            {langItem}
                          </span>
                        ))}

                      </div>

                      {/* Badge tập phim (góc dưới giữa) */}
                      <div className="absolute bottom-2 flex w-full items-center justify-center text-center">
                        <span className="bg-gradient-to-r from-yellow-400 via-yellow300 to-yellow-200 text-black text-xs font-medium px-2 py-0.5 rounded">
                          {movie.episode_current}
                        </span>
                      </div>
                    </div>

                    {/* Tên phim */}
                    <h2 className="group-hover:text-yellow-400 overflow-hidden truncate whitespace-nowrap px-2 py-2">
                      {movie?.name ? movie.name.replace(/<[^>]+>/g, "") : "Không tên"}
                    </h2>

                  </div>


                </div>
              </div>
            ))}

          </div>

          {/* Phân trang */}
          <div className="mt-6 flex justify-center items-center space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Trang trước
            </button>
            <span>
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>
        </>
      </div>
    </div>
  );
};

export default CategoryDetail;