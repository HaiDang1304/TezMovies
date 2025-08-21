import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchMovies } from "../api";
import { Navigate } from "react-router-dom";
import Loading from "../components/Loading";
import Image from "../components/Image";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleClick = (slug) => {
    navigate(`/phim/${slug}`);
  }
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!keyword) return;
      setLoading(true);
      const data = await searchMovies({ keyword });
      setMovies(data.data.items || []);

      console.log("Phim:", data?.data?.items);

      setLoading(false);
    };

    fetchSearchResults();
  }, [keyword]);

  return (
    <div className="max-w-[1600px] mx-auto min-h-screen text-white px-4 sm:px-6 lg:px-20 py-10">
      <div className="mt-10">
        <h2 className="!text-2xl md:text-2xl font-bold mb-4">
          Kết quả cho: "<span className="text-yellow-400">{keyword}</span>"
        </h2>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-5">
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
        )}
      </div>

    </div >
  );
};

export default SearchPage;
