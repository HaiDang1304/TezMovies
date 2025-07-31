import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const MovieDetail = () => {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios.get(`https://phimapi.com/phim/${slug}`)
      .then(res => setMovie(res.data.movie))
      .catch(err => console.error("Error:", err));
  }, [slug]);

  if (!movie) return <div className="text-white">Đang tải...</div>;

  return (
    <div className="text-white p-8">
      <h1 className="text-3xl font-bold">{movie.name}</h1>
      <p className="mt-2">{movie.origin_name}</p>
      <img src={movie.poster_url} alt={movie.name} className="mt-4 w-64 rounded" />
    </div>
  );
};

export default MovieDetail;
