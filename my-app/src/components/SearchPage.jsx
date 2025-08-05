import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../api";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!keyword) return;
      setLoading(true);
      const data = await searchMovies({ keyword });
      console.log("Phim:", data?.data?.items);
      if (data?.data?.items) {
        setMovies(data.data.items);
      }
      setLoading(false);
    };

    fetchSearchResults();
  }, [keyword]);

  return (
    <div className="max-w-[1600px] mx-auto min-h-scree text-white px-4 sm:px-6 lg:px-20 py-10">
      <div className="mt-10">
        <h2 className="!text-2xl md:text-2xl font-bold mb-4">
          Kết quả cho: "<span className="text-yellow-400">{keyword}</span>"
        </h2>

        {loading ? (
          <p className="text-center text-lg">Đang tải...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
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
        )}
      </div>

    </div>
  );
};

export default SearchPage;
