import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const WatchMovie = () => {
  const { slug } = useParams();
  const [movieData, setMovieData] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await axios.get(`https://phimapi.com/phim/${slug}`);
      setMovieData(res.data);
    };
    fetchMovie();
  }, [slug]);

  if (!movieData) return <p>Đang tải...</p>;

  const episode = movieData.episodes?.[0]?.server_data?.[0];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{movieData.movie.name}</h1>
      {episode ? (
        <div className="aspect-video mb-4">
          <iframe
            src={episode.link_embed}
            title="Video"
            width="100%"
            height="100%"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <p>Không có video.</p>
      )}
      <p className="text-gray-600">{movieData.movie.content}</p>
    </div>
  );
};

export default WatchMovie;
