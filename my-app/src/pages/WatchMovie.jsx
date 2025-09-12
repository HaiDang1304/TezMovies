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
  const [episodeList, setEpisodeList] = useState([]);
  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id"); // "124"
  const index = params.get("index");
  const groupIndex = params.get("groupIndex");

  useEffect(() => {
    const fetchMovieAndActors = async () => {
      try {
        // 1. Lấy dữ liệu phim từ phimapi
        const res = await axios.get(`https://phimapi.com/phim/${slug}`);
        const data = res.data;
        setMovieData(data);
        setEpisodeList(res.data.episodes);

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
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                actor.name
              )}&background=random`,
        }));

        setTmdbActors(formatted);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };

    fetchMovieAndActors();
  }, [slug, location.search]);

  const currentServerData = episodeList[currentServerIndex]?.server_data || [];
  const groupSize = episodeList[0]?.server_data?.length > 100 ? 100 : 10;

  const groupedEpisodes = useMemo(() => {
    if (!episodeList || episodeList.length === 0) return [];
    const serverData = episodeList[currentServerIndex]?.server_data || [];
    const result = [];

    for (let i = 0; i < serverData.length; i += groupSize) {
      result.push(serverData.slice(i, i + groupSize));
    }

    return result;
  }, [episodeList, currentServerIndex, groupSize]);

  useEffect(() => {
    let episodeMerch = [];
    episodeList.forEach((ep) => {
      episodeMerch = [...episodeMerch, ...ep.server_data];
    });

    const currentEpisode = episodeMerch.find((ep) => ep.link_m3u8.includes(id));

    if (currentEpisode) {
      setCurrentEpisode(currentEpisode);
    } else {
      setCurrentEpisode(episodeMerch[0]);
    }
  }, [groupedEpisodes, id]);

  useEffect(() => {
    if (index > episodeList.length || !index) {
      setCurrentServerIndex(0);
    } else {
      setCurrentServerIndex(index);
    }
  }, [index, episodeList]);

  useEffect(() => {
    if (groupIndex > groupedEpisodes.length || !groupIndex) {
      setCurrentGroupIndex(0);
    } else {
      setCurrentGroupIndex(groupIndex);
    }
    console.log("555555", currentGroupIndex);
  }, [groupIndex, groupedEpisodes]);

  if (!movieData) return <p className="text-center mt-10">Đang tải...</p>;

  const { movie, episodes } = movieData;

  const statusMap = {
    completed: "Đã hoàn thành",
    ongoing: "Đang phát sóng",
    upcoming: "Sắp ra mắt",
    cancelled: "Đã hủy",
  };
  const movieStatus = statusMap[movie.status] || "Đang cập nhật";

  const handleChangeServer = (index) => {
    setCurrentServerIndex(index);
    setCurrentGroupIndex(0); // reset về trang 1 của server mới
  };

  return (
    <div className="p-2 sm:p-4 mt-12 sm:mt-14 max-w-7xl mx-auto text-white">
      {/* Title Section */}
      <div className="pb-4 sm:pb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text break-words">
          Bạn Đang Xem Phim {movie?.name} {currentEpisode?.name}
        </h2>
      </div>

      {/* Video Player */}
      {currentEpisode ? (
        <div className="aspect-video mb-4 w-full">
          <iframe
            src={currentEpisode.link_embed}
            title={currentEpisode.name}
            width="100%"
            height="100%"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
      ) : (
        <p className="text-center py-8 text-gray-400">Không có video.</p>
      )}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 mb-5 mt-4 sm:mt-6">
        {/* Left Column - Episode Controls */}
        <div className="flex-1 lg:flex-[3] order-2 lg:order-1">
          {/* Movie Info Component */}
          <div className="mb-4 lg:mb-6">
            <div className="flex gap-4 lg:items-start ">
               <img
                src={movie?.poster_url}
                alt={movie?.name}
                className="w-full max-w-45 max-h-65 rounded-lg mt-2"
            />
            <MovieInfo movie={movie} hidePoster ={true} />
            </div>
          </div>

          {/* Server Selection */}
          <div className="mb-4 lg:mb-6">
            <h3 className="text-base sm:text-lg mb-3 font-semibold">Chọn server</h3>
            <div className="flex flex-wrap gap-2">
              {episodeList.map((episode, index) => {
                // Đổi tên hiển thị
                let displayName = "";
                if (episode.server_name.includes("Vietsub")) {
                  displayName = "Phụ đề";
                } else if (episode.server_name.includes("Thuyết Minh")) {
                  displayName = "Thuyết minh";
                } else {
                  displayName = "Lồng tiếng"; // fallback
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleChangeServer(index)}
                    className={`
                      px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border-2 transition-all duration-200 flex-shrink-0
                      ${
                        currentServerIndex == index
                          ? "bg-yellow-600 border-yellow-600 text-white shadow-lg transform scale-105"
                          : "bg-transparent border-gray-500 text-gray-300 hover:border-yellow-400 hover:text-yellow-400"
                      }
                    `}
                  >
                    {displayName}
                    <span className="ml-1 text-xs opacity-75 hidden sm:inline">
                      ({episode.server_data.length} tập)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Episode Group Selection */}
          <div className="mb-4 lg:mb-6">
            <h3 className="text-base sm:text-lg mb-2 font-semibold">Danh sách tập</h3>
            <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-4">
              {groupedEpisodes.map((_, groupIndex) => (
                <button
                  key={groupIndex}
                  onClick={() => setCurrentGroupIndex(groupIndex)}
                  className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm transition-all ${
                    currentGroupIndex == groupIndex
                      ? "!bg-yellow-600 text-white font-bold !hover:bg-yellow-900"
                      : "bg-gray-600 text-white hover:bg-yellow-400"
                  }`}
                >
                  <span className="hidden sm:inline">Tập </span>
                  {groupIndex * groupSize + 1} - {Math.min(
                    (groupIndex + 1) * groupSize,
                    episodeList[currentServerIndex]?.server_data.length
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Current Episode List */}
          <div className="mb-4 lg:mb-6">
            <h3 className="text-base sm:text-lg mb-2 font-semibold">Tập hiện tại</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1 sm:gap-2">
              {groupedEpisodes[currentGroupIndex]?.map((ep, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentEpisode(ep)}
                  className={`px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm transition-all ${
                    currentEpisode?.name === ep.name
                      ? "!bg-yellow-600 text-white font-bold"
                      : "bg-gray-600 text-white hover:bg-yellow-400"
                  }`}
                >
                  {ep.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Movie Content & Actors */}
        <div className="flex-1 lg:flex-[2] order-2 lg:order-2">
         
          <div className="mb-4 lg:mb-6">
            <h3 className="text-base sm:text-lg mb-2 font-semibold">Nội dung</h3>
            <div className="text-sm text-gray-300">
              <p className="leading-relaxed">{movie.content}</p>
            </div>
          </div>

          {/* Actors Section */}
          <div>
            <h3 className="text-base sm:text-lg mb-4 font-semibold">Diễn viên</h3>
            {tmdbActors.length === 0 ? (
              <p className="text-red-500 text-sm">Không tìm thấy diễn viên.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {tmdbActors.map((actor, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center p-2 sm:p-3 hover:bg-gray-700/50 transition-colors"
                  >
                    <img
                      src={actor.avatar_url}
                      alt={actor.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover mb-2"
                      loading="lazy"
                    />
                    <p className="text-white text-xs sm:text-sm font-medium break-words text-center leading-tight">
                      {actor.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchMovie;