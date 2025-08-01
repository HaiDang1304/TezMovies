import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const WatchMovie = () => {
  const { slug } = useParams();
  const [movieData, setMovieData] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`https://phimapi.com/phim/${slug}`);
        const data = res.data;
        setMovieData(data);

        // Lấy tập đầu tiên từ server đầu tiên
        const defaultEpisode = data.episodes?.[0]?.server_data?.[0];
        setCurrentEpisode(defaultEpisode);
      } catch (err) {
        console.error("Lỗi khi tải phim:", err);
      }
    };
    fetchMovie();
  }, [slug]);

  if (!movieData) return <p className="text-center mt-10">Đang tải...</p>;

  const { movie, episodes } = movieData;
  const episodeList = episodes?.[0]?.server_data || [];

  return (
    <div className="p-4 max-w-4xl mx-auto text-white">
      {/* Video */}
      {currentEpisode ? (
        <div className="aspect-video mb-4">
          <iframe
            src={currentEpisode.link_embed}
            title={currentEpisode.name}
            width="100%"
            height="100%"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <p>Không có video.</p>
      )}

      <h2 className="text-2xl font-bold mb-2">{movie.name}</h2>

      {/* Thông tin thêm */}
      <div className="flex items-start gap-4 mb-6">
        <img
          src={movie.thumb_url}
          alt={movie.name}
          className="w-full max-w-sm rounded-lg"
        />
        <div className="text-sm text-gray-400">
          <p><strong>Quốc gia:</strong> {movie.country?.name}</p>
          <p><strong>Thời lượng:</strong> {movie.time}</p>
          <p><strong>Đạo diễn:</strong> {movie.director}</p>
        </div>
      </div>

      {/* Danh sách tập */}
      <div className="flex flex-wrap gap-2 mb-6">
        {episodeList.map((ep, index) => (
          <button
            key={index}
            onClick={() => setCurrentEpisode(ep)}
            className={`px-3 py-1 border rounded 
              ${currentEpisode?.name === ep.name
                ? "bg-red-600 text-white font-bold"
                : "bg-gray-100 text-gray-800 hover:bg-gray-300"
              }`}
          >
            {ep.name}
          </button>
        ))}
      </div>

      {/* Nội dung */}
      <div className="text-sm text-gray-300">
        <p>{movie.content}</p>
      </div>
    </div>
  );
};

export default WatchMovie;
