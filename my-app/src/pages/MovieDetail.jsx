import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const MovieDetail = () => {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://phimapi.com/phim/${slug}`)
      .then((res) => {
        setMovie(res.data.movie);
      })
      .catch((err) => {
        console.error("Lỗi tải phim:", err);
      });
  }, [slug]);

  if (!movie) return <div>Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-6 m-auto">
      
      <img src={movie.thumb_url} alt={movie.name} className="w-full max-w-sm rounded-lg" />
      <h1 className="text-3xl font-bold mb-4">{movie.name}</h1>
      <p className="mt-4 text-gray-300">{movie.content}</p>

      <button
        className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
        onClick={() => navigate(`/xem-phim/${slug}?tap=${movie.episodes?.[0]?.server_data?.[0]?.name}`)}
      >
        ▶ Xem phim
      </button>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Danh sách tập phim</h2>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
          {movie.episodes?.[0]?.server_data?.map((episode, index) => (
            <button
              key={index}
              onClick={() =>
                navigate(`/xem-phim/${slug}?tap=${encodeURIComponent(episode.name)}`)
              }
              className="bg-gray-800 hover:bg-red-600 px-3 py-2 rounded text-sm text-white"
            >
              {episode.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
