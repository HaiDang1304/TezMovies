import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import React, {useEfferct, useState} from "react";

const CateGoryCard = ({ category }) => {
    const [movies, setMovies] = useState([]);
    
    useEffect(() => {
        const fetchMovies = async () => {
        try {
            const res = await axios.get(`https://phimapi.com/the-loai/${category.slug}`);
            setMovies(res.data.movies);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
        };
        fetchMovies();
    }, [category.slug]);
    
    return (
        <div className="p-4">
        <h2 className="text-xl font-bold mb-4">{category.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {movies.map(movie => (
            <Link to={`/phim/${movie.slug}`} key={movie.id} className="block">
                <div className="bg-gray-800 p-4 rounded-lg hover:shadow-lg transition-shadow">
                <img src={movie.poster_url} alt={movie.name} className="w-full h-auto rounded mb-2" />
                <h3 className="text-lg font-semibold text-white">{movie.name}</h3>
                </div>
            </Link>
            ))}
        </div>
        </div>
    );
}