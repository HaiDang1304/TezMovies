import { useParams, useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
const API_KEY = "8afc137d2cb21415981fb4af3b88e9e5";
import MovieInfo from "../components/MovieInfo";
import App from "../App";




const WatchMovie = () => {
  const { slug } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ep = searchParams.get("ep");
  const [movieData, setMovieData] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [credits, setCredits] = useState([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [tmdbActors, setTmdbActors] = useState([]);

  {/* Group tập phim theo 10 tập 1 group*/ }
  const episodeList = movieData?.episodes?.[0]?.server_data || [];
  // Tính groupSize một lần (trước useMemo)
  const groupSize = episodeList?.length > 100 ? 100 : 10;

  const groupedEpisodes = useMemo(() => {
    if (!episodeList || episodeList.length === 0) return [];
    const result = [];
    for (let i = 0; i < episodeList.length; i += groupSize) {
      result.push(episodeList.slice(i, i + groupSize));
    }
    return result;
  }, [episodeList, groupSize]);

  useEffect(() => {
    const fetchMovieAndActors = async () => {
      try {
        // 1. Lấy dữ liệu phim từ phimapi
        const res = await axios.get(`https://phimapi.com/phim/${slug}`);
        const data = res.data;
        setMovieData(data);

        const episodeList = data.episodes?.[0]?.server_data || []
        const selectedEpisode = episodeList.find(e => e.name === ep);
        setCurrentEpisode(selectedEpisode || episodeList[0])

        if (selectedEpisode) {
          const index = episodeList.findIndex(e => e.name === selectedEpisode.name);
          const groupIndex = Math.floor(index / groupSize);
          setCurrentGroupIndex(groupIndex);
        }

        // 2. Lấy ID và type từ URL (vd: ?type=movie&id=12345)
        const tmdbId = data.movie?.tmdb?.id;
        const type = data.movie?.tmdb?.type;

        if (!tmdbId || !type) {
          console.warn("Thiếu id hoặc type TMDB trong URL");
          return;
        }

        // 3. Lấy danh sách diễn viên từ TMDB
        const creditsUrl = `https://api.themoviedb.org/3/${type}/${tmdbId}/credits?api_key=${API_KEY}`;
        const creditsRes = await axios.get(creditsUrl);

        const cast = creditsRes.data.cast?.slice(0, 12) || [];

        const formatted = cast.map((actor) => ({
          name: actor.name,
          avatar_url: actor.profile_path
            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&background=random`,
        }));

        setTmdbActors(formatted);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };

    fetchMovieAndActors();
  }, [slug, location.search]);

  if (!movieData) return <p className="text-center mt-10">Đang tải...</p>;

  const { movie, episodes } = movieData;

  const statusMap = {
    "completed": "Đã hoàn thành",
    "ongoing": "Đang phát sóng",
    "upcoming": "Sắp ra mắt",
    "cancelled": "Đã hủy"
  };
  const movieStatus = statusMap[movie.status] || "Đang cập nhật";



  return (
    <div className="p-4 mt-14 max-w-7xl mx-auto text-white">
      <div className="pb-6">
        <h2 className="text-2xl font-bold gradient-text">Bạn Đang Xem Phim {movie?.name} {currentEpisode?.name}  </h2>
      </div>
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
      <div className="flex flex-3/5 gap-15 mb-5 mt-6">
        {/* Thông tin thêm */}
        <div>
          <MovieInfo movie={movie} />
          {/* Danh sách tập */}

          <h2 className="text-l mb-2 font-semibold">Danh sách tập</h2>

          {/* Selector cho nhóm tập */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-5 gap-2 mb-4">
            {groupedEpisodes.map((_, groupIndex) => (
              <button
                key={groupIndex}
                onClick={() => setCurrentGroupIndex(groupIndex)}
                className={`px-3 py-1 rounded text-sm ${currentGroupIndex === groupIndex
                  ? "!bg-yellow-600 text-white font-bold !hover:bg-yellow-900"
                  : "bg-gray-600 text-white hover:bg-yellow-400"
                  }`}
              >
                Tập {groupIndex * groupSize + 1} -{" "}
                {Math.min((groupIndex + 1) * groupSize, episodeList.length)}
              </button>
            ))}
          </div>


          {/* Danh sách tập trong group hiện tại */}
          <h2 className="text-l mb-2 font-semibold">Tập hiện tại</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-6 gap-2 mb-4">
            {groupedEpisodes[currentGroupIndex]?.map((ep, index) => (
              <button
                key={index}
                onClick={() => setCurrentEpisode(ep)}
                className={`px-3 py-1 rounded text-sm bg-gray-500 ${currentEpisode?.name === ep.name
                  ? "!bg-yellow-600 text-white font-bold"
                  : "bg-gray-600 text-white hover:bg-yellow-400"
                  }`}
              >
                {ep.name}
              </button>
            ))}
          </div>

        </div>



        {/* Nội dung */}
        <div>
          <h2 className="text-l mb-2 font-semibold">Nội dụng</h2>
          <div className="text-sm text-gray-300 max-w-xl gap-4">
            <p>{movie.content}</p>
          </div>
          <div>
            <h2 className="text-l mb-2 font-semibold mt-4">Diễn viên</h2>
          </div>
          {tmdbActors.length === 0 ? (
            <p className="text-red-500">Không tìm thấy diễn viên.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
              {tmdbActors.map((actor, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <img
                    src={actor.avatar_url}
                    alt={actor.name}
                    className="w-15 h-15 rounded-full object-cover"
                  />
                  <p className="text-white mt-2">{actor.name}</p>
                </div>
              ))}
            </div>
          )}


        </div>



      </div>




    </div>

  );
};

export default WatchMovie;
