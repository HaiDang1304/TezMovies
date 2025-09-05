import { useEffect, useState } from "react";
import { fetchTmdbActors } from "../utils/fetchTmdbActors";
import NoActorInfo from "./NoActorInfor";

export default function GetActorTMDB({
  type = "movie",
  tmdbId,
  variant = "gird",
}) {
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const fetchData = async () => {
      if (!tmdbId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const res = await fetchTmdbActors(type, tmdbId);
        if (alive) {
          setCast(res);
        }
      } catch (error) {
        console.error("Error fetching actors:", error);
        if (alive) {
          setCast([]);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      alive = false;
    };
  }, [type, tmdbId]);

  if (loading) return <p className="text-white">Đang tải...</p>;
  if (!cast.length) {
    if (variant === "carousel") {
      return null;
    }
    return <NoActorInfo />;
  }

  if (variant === "carousel") {
    return (
      <div className="justify-center items-center">
        <h2 className="text-lg mb-4 font-semibold mt-6">Danh sách diễn viên</h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 justify-items-center">
          {cast.map((actor) => (
            <div
              key={actor.id}
              className="flex-shrink-0 w-28 text-center group cursor-pointer"
            >
              <img
                src={actor.avatar_url}
                alt={actor.name}
                className="w-12 h-12 rounded-full object-cover mx-auto transform transition-transform duration-200 ease-out group-hover:scale-110"
              />
              <p className="mt-1 text-xs text-white transition-colors duration-200 group-hover:text-amber-300">
                {actor.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // default grid
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {cast.map((actor) => (
        <div key={actor.id} className="flex flex-col items-center group">
          <img
            src={actor.avatar_url}
            alt={actor.name}
            className="w-full aspect-[2/3] border-2 border-transparent object-cover rounded-xl transform transition-all duration-300 group-hover:scale-110 group-hover:border-amber-300"
            onError={(e) => (e.target.src = "/404.jpg")}
          />
          <p className="mt-2 text-xs sm:text-sm text-white text-center group-hover:text-amber-300">
            {actor.name}
          </p>
        </div>
      ))}
    </div>
  );
}
