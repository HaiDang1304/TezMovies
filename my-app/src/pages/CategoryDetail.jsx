import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


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
      .get(`https://phimapi.com/v1/api/the-loai/${slug}?page=${page}`)
      .then((res) => {
        console.log("API Response:", res.data); // Kiểm tra phản hồi
        const data = res.data.data;
        setMovies(data.items || []);
        // Kiểm tra trường totalPages hoặc số lượng phim tổng cộng
        setTotalPages(data.pagination?.totalPages || data.total || 1);
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

  return (
    <div className="min-h-screen bg-gray-900 text-white px-42 py-6 m-auto-gray-900 w-full">
      <h2 className="text-2xl font-bold mb-4">Thể Loại: {categoryName[slug] || slug}</h2>

      {loading ? (
        <p>Đang tải phim...</p>
      ) : movies.length === 0 ? (
        <p>Không có phim nào hoặc có lỗi xảy ra.</p>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-5 gap-5">
            {movies.map((movie, index) => (
              <div key={index} className="bg-gray-800 text-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group">
                <div className="overflow-hidden">
                  <div key={movie._id}
                    className="bg-gray-800 text-white rounded-lg cursor-pointer hover:opacity-80 transition"
                    onClick={() => handleClick(movie.slug)}>
                    <div className="w-full h-95 object-cover transition-all duration-300">
                      <img
                        src={`https://img.phimapi.com/${movie.poster_url}`}
                        alt={movie.name}
                        className="w-full h-72 object-cover transfrom group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"
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
      )}
    </div>
  );
};

export default CategoryDetail;