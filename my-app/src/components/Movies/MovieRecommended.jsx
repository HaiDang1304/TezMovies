import { use, useEffect, useState } from "react";
import { getRandomItem } from "../../../../backend/utils/random-movie-suggestion";
import { categories, countries } from "../../constants/movie";
import { movieRecommended } from "../../../../backend/utils/fetchMovieRecommended";
import Loading from "../Layout/Loading";
import { Link } from "react-router-dom";
import Image from "../Others/Image";


const MoviesRecommended = () => {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = [...countries, ...categories]
        const itemRandom = getRandomItem(data);
        const describe = categories.includes(itemRandom) ? "the-loai" : "quoc-gia";
        console.log("iteamRamdom", itemRandom);
        console.log("descride", describe);

        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await movieRecommended(describe, itemRandom.slug)
                setItems(res.items)
                console.log("res", res);
            } catch (err) {
                console.log(err)

            } finally {
                setLoading(false);

            }

        }
        fetchData()

    }, [])


    if (loading) {
        return (
            <Loading />
        )
    }



    return (<ul className="text-gray-300 list-disc list-inside">
        <div>
            {items.length === 0 ? (
                <p className="text-red-500">Không có phim đề xuất.</p>
            ) : (
                <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 mt-4">
                    {items.map((movie, index) => (
                        <Link
                            key={index}
                            className="transition transform hover:scale-105 cursor-pointer"
                            to={`/phim/${movie.slug}`}
                        >
                            <Image
                                src={movie.poster_url.includes(`https://phimimg.com/`) ? movie.poster_url : `https://phimimg.com/${movie.poster_url}`}
                                alt={movie.name}
                                orientation = "vertical" />
                            <p className="mt-2 text-sm text-center text-white">{movie.name}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    </ul>);
}

export default MoviesRecommended;