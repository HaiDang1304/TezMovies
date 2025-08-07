import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Image from "../components/Image";
import Loading from "../components/Loading";

const CategoryDetail = () => {
  const { slug } = useParams();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Cần kiểm tra từ API
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    console.log("Fetching category:", slug); // Kiểm tra slug
    axios
      .get(`https://phimapi.com/v1/api/the-loai/${slug}?page=${page}&limit=24`)
      .then((res) => {
        console.log("API Response:", res.data); // Kiểm tra phản hồi
        const data = res.data.data;
        setMovies(data.items || []);
        // Kiểm tra trường totalPages hoặc số lượng phim tổng cộng
        setTotalPages(data.totalPages || Math.ceil(data.total || 1) / data.pagination?.limit || 20);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải phim theo thể loại:", err);
        setMovies([]);
        setLoading(false);
      });
  }, [slug, page]);

  const categoryName = {
    "hanh-dong": "Hành Động",
    "mien-tay": "Miền Tây",
    "tre-em": "Hoạt Hình",
    "lich-su": "Lịch Sử",
    "co-trang": "Cổ Trang",
    "chien-tranh": "Chiến Tranh",
    "vien-tuong": "Viễn Tưởng",
  }
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
        <h2 className="text-2xl font-bold mb-4">Thể Loại: {categoryName[slug] || slug}</h2>


        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {movies.map((movie, index) => (
              <div key={index} className="bg-gray-800 text-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group">
                <div className="overflow-hidden">
                  <div key={movie._id}
                    className="bg-gray-800 text-white rounded-lg cursor-pointer hover:opacity-80 transition"
                    onClick={() => handleClick(movie.slug)}>
                    <div className="transition-all duration-300">
                      <Image
                        rounded="none"
                        src={`https://img.phimapi.com/${movie.poster_url}`}
                        alt={movie.name}
                        className="transfrom group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"
                      />
                      <div className="ml-4 mt-5">
                        <h2 className="group-hover:text-yellow-400 mt-2 overflow-hidden truncate whitespace-nowrap" >{movie?.name ? movie.name.replace(/<[^>]+>/g, "") : "Không tên"}</h2>
                        <div className="flex text-sm text-gray-400">
                          <p>{movie.time}</p>
                          <div className="bg-indigo-400 text-white px-1 py-1 rounded ml-20">
                            <p>{movie.quality}</p>
                          </div>

                        </div>
                      </div>

                    </div>
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