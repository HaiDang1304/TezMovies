import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
const API_KEY = "8afc137d2cb21415981fb4af3b88e9e5";



const WatchMovie = () => {
  const { slug } = useParams();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
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

        const defaultEpisode = data.episodes?.[0]?.server_data?.[0];
        setCurrentEpisode(defaultEpisode);

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
    <div className="p-4 max-w-7xl mx-auto text-white">
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
      <div className="flex gap-15 mb-5 mt-6">
        {/* Thông tin thêm */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <img
              src={movie.poster_url}
              alt={movie.name}
              className="w-full max-w-45 rounded-lg"
            />
            <div className="text-sm text-gray-400">
              <h2 className="text-2xl font-bold mb-2">{movie.name}</h2>
              <p><strong>Quốc gia:</strong> {movie.country?.name}</p>
              <p><strong>Thời lượng:</strong> {movie.time}</p>
              <p><strong>Đạo diễn:</strong> {movie.director}</p>
              <p><strong>Diễn viên:</strong> {movie.actor}</p>
              <p><strong>Thể loại:</strong> {
                Array.isArray(movie.category)
                  ? movie.category.map(c => c.name).join(", ")
                  : movie.category?.name || "Đang cập nhật"
              }</p>

              <p><strong>Năm phát hành: </strong> {
                Array.isArray(movie.year)
                  ? movie.year.map(y => y.date || y).join(", ")
                  : movie.year || "Đang cập nhật"
              }</p>


              <p><strong>Đánh giá:</strong> {movie.vote_average}</p>
              <p><strong>Lượt xem:</strong> {movie.view}</p>
              <p><strong>Trạng thái:</strong> {{
                completed: "Đã hoàn thành",
                ongoing: "Đang phát sóng",
                upcoming: "Sắp ra mắt",
                cancelled: "Đã hủy"
              }[movie.status] || "Đang cập nhật"
              }</p>
            </div>


          </div>
          {/* Danh sách tập */}

          <h2 className="text-l mb-2 font-semibold">Danh sách tập</h2>

          {/* Selector cho nhóm tập */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-5 gap-2 mb-4">
            {groupedEpisodes.map((_, groupIndex) => (
              <button
                key={groupIndex}
                onClick={() => setCurrentGroupIndex(groupIndex)}
                className={`px-3 py-1 border rounded text-sm ${currentGroupIndex === groupIndex
                  ? "!bg-yellow-900 text-white font-bold !hover:bg-yellow-900"
                  : "bg-gray-300 text-white"
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
                className={`px-3 py-1 border rounded text-sm bg-gray-500 ${currentEpisode?.name === ep.name
                    ? "!bg-yellow-800 text-white font-bold"
                    : "bg-gray-300 text-white hover:bg-yellow-400"
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
