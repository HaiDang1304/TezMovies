import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/watch/${movie.slug}`}
      className="block bg-gray-800 text-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="hover:scale-105 transition-transform duration-300">
        <img
          src={movie.poster_url}
          alt={movie.name}
          className="w-full h-72 object-cover"
        />
        <div className="p-2">
          <h3 className="text-lg font-semibold">{movie.name}</h3>
          <p className="text-sm text-gray-400">{movie.origin_name}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
