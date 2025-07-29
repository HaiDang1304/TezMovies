import React, { useEffect, useState } from "react";
import axios from "axios";

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get("https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1")
      .then((res) => {
        console.log(res.data.items); // Kiểm tra dữ liệu trả về
        
        setMovies(res.data.items); // API trả về { items: [...] }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);
    
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {movies.map((movie) => (
        <div key={movie._id} className="bg-black rounded shadow p-2">
          <img src={movie.poster_url} alt={movie.name} className="w-full h-64 object-cover rounded" />
          <h2 className="text-md font-semibold mt-2">{movie.name}</h2>
          <p className="text-sm text-gray-500">{movie.origin_name}</p>
        </div>
      ))}
    </div>
  );
};

export default MovieList;
