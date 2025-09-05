import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MovieInfo from "../components/MovieInfo";
import Loading from "../components/Loading";
import TabMenuMovieDetail from "../components/TabMenuMovieDetail";
import { fetchTmdbActors } from "../utils/fetchTmdbActors";
import MoviesRecommended from "../components/MovieRecommended";
import { getIdLinkm3u8 } from "../utils/getIdLinkm3u8";
import GetActorTMDB from "../components/GetActorTMDB";
import CommentList from "../components/CommentList";
import Comment from "../components/Comment";

const MovieDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [episodeList, setEpisodeList] = useState([]);
  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [tmdbActors, setTmdbActors] = useState([]);

  const toggleContent = () => setExpanded(!expanded);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`https://phimapi.com/phim/${slug}`);
        setMovie(data.movie);
        setEpisodeList(data.episodes);

        const { id, type } = data.movie?.tmdb || {};
        if (id && type) setTmdbActors(await fetchTmdbActors(type, id));
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [slug]);

  const groupSize = episodeList[0]?.server_data?.length > 100 ? 100 : 10;

  const groupedEpisodes = useMemo(() => {
    const serverData = episodeList[currentServerIndex]?.server_data || [];
    return Array.from(
      { length: Math.ceil(serverData.length / groupSize) },
      (_, i) => serverData.slice(i * groupSize, (i + 1) * groupSize)
    );
  }, [episodeList, currentServerIndex, groupSize]);

  if (loading) return <Loading />;
  if (!movie) return null;

  const getEmbedUrl = (url) => {
    if (!url) return "";
    const videoId = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleChangeServer = (index) => {
    setCurrentServerIndex(index);
    setCurrentGroupIndex(0);
  };

  const tabs = [
    {
      label: "Tập Phim",
      content: (
        <div className="mt-8">
          {/* Chọn server */}
          <div className="flex flex-wrap gap-2 mb-4">
            {episodeList.map((ep, i) => {
              const name = ep.server_name.includes("Vietsub")
                ? "Phụ đề"
                : ep.server_name.includes("Thuyết Minh")
                ? "Thuyết minh"
                : "Lồng tiếng";
              return (
                <button
                  key={i}
                  onClick={() => handleChangeServer(i)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                    currentServerIndex === i
                      ? "bg-yellow-600 border-yellow-600 text-white shadow-lg scale-105"
                      : "border-gray-500 text-gray-300 hover:border-yellow-400 hover:text-yellow-400"
                  }`}
                >
                  {name}
                  <span className="ml-1 text-xs opacity-75">
                    ({ep.server_data.length} tập)
                  </span>
                </button>
              );
            })}
          </div>

          {/* Nhóm tập */}
          <div>
            <h2 className="text-l mb-2 font-semibold">Danh sách tập</h2>
            <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-2">
              {groupedEpisodes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentGroupIndex(i)}
                  className={`px-3 py-1 rounded text-sm ${
                    currentGroupIndex === i
                      ? "bg-yellow-600 text-white font-bold"
                      : "bg-gray-600 text-white hover:bg-yellow-400"
                  }`}
                >
                  Tập {i * groupSize + 1} -{" "}
                  {Math.min(
                    (i + 1) * groupSize,
                    episodeList[currentServerIndex]?.server_data.length
                  )}
                </button>
              ))}
            </div>

            {/* Tập hiện tại */}
            <h2 className="text-l mb-2 font-semibold">Tập hiện tại</h2>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-6 gap-2 mb-4">
              {groupedEpisodes[currentGroupIndex]?.map((ep, i) => (
                <Link
                  key={i}
                  to={`/xem-phim/${slug}?id=${getIdLinkm3u8(
                    ep.link_m3u8
                  )}&index=${currentServerIndex}&groupIndex=${currentGroupIndex}`}
                >
                  <button
                    id={getIdLinkm3u8(ep.link_m3u8)}
                    className={`min-w-full py-1 rounded text-sm ${
                      currentEpisode?.name === ep.name
                        ? "bg-yellow-600 text-white font-bold"
                        : "bg-gray-600 text-white hover:bg-yellow-400"
                    }`}
                  >
                    {ep.name}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Diễn viên",
      content: (
        <div>
         
          <GetActorTMDB
            type={movie?.tmdb?.type || "movie"}
            tmdbId={movie?.tmdb?.id}
          />
        </div>
      ),
    },
    {
      label: "Trailer",
      content: getEmbedUrl(movie.trailer_url) ? (
        <iframe
          src={getEmbedUrl(movie.trailer_url)}
          title="Trailer"
          allowFullScreen
          className="min-w-full h-[400px] rounded-lg"
        />
      ) : (
        <div className="text-red-500 bg-gray-800 p-4 rounded-lg text-center">
          Hiện không có Trailer phim, vui lòng quay lại sau nhé !!!
        </div>
      ),
    },
    { label: "Đề xuất", content: <MoviesRecommended /> },
  ];

  return (
    <div className="bg-gray-600 text-white">
      <div className="relative bg-[#242424] min-h-screen">
        {/* Background */}
        <div className="relative lg:pt-[32%] md:pt-[46%] sm:pt-[50%] pt-[60%]">
          <img
            src={movie?.thumb_url}
            alt={movie?.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "grayscale(70%)" }}
          />
          <div className="bg-gradient-to-t h-1/2 absolute bottom-0 from-[#242424] inset-x-0 to-transparent"></div>
        </div>

        {/* Nội dung */}
        <div className="mt-[-150px] bg-gradient-to-t from-gray-700 to-transparent relative">
          <div className="grid grid-cols-12 gap-5 py-6 px-6">
            {/* Sidebar Thông tin */}
            <div className="lg:col-span-4 col-span-12 lg:bg-gradient-to-b lg:from-gray-800 rounded-2xl p-3">
              <MovieInfo movie={movie} />
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 rounded-full border border-yellow-400 text-yellow-400 text-sm font-semibold">
                  TMDb {movie.tmdb.vote_average || 0}
                </span>
                {[
                  movie.quality,
                  movie.year,
                  movie.lang,
                  movie.time,
                  movie.episode_current,
                ].map((info, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-gray-700 text-sm"
                  >
                    {info}
                  </span>
                ))}
                {movie.category?.map((c, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-gray-600 text-sm"
                  >
                    {c.name}
                  </span>
                ))}
              </div>

              {/* Giới thiệu */}
              <h2 className="text-xl font-bold mt-2">Giới thiệu:</h2>
              <p
                className="text-sm text-gray-300 transition-all"
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  WebkitLineClamp: expanded ? "unset" : 2,
                }}
              >
                {movie?.content}
              </p>
              {movie?.content?.length > 50 && (
                <p
                  onClick={toggleContent}
                  className="text-amber-300 hover:text-amber-500 mt-1 hover:underline text-sm font-semibold cursor-pointer"
                >
                  {expanded ? "Thu gọn" : "Xem thêm"}
                </p>
              )}
              <div>
                <GetActorTMDB
                  type={movie?.tmdb?.type || "movie"}
                  tmdbId={movie?.tmdb?.id}
                  variant="carousel"
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 col-span-12 bg-gradient-to-b from-gray-800 rounded-2xl px-6 py-4">
              <div className="flex gap-6 md:flex-row flex-col md:justify-start md:gap-6 justify-center md:items-start items-center css-0">
                <button
                  className="px-4 py-2 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 rounded text-white min-w-[200px] md:min-w-[100px] rounded-4xl"
                  onClick={() =>
                    navigate(`/xem-phim/${slug}?tap=${episodeList?.[0]?.name}`)
                  }
                >
                  ▶ Xem phim
                </button>
                <div className="flex flex-wrap gap-2 justify-center items-center">
                  {/* Yêu Thích */}
                  <div className="p-2 sm:w-20 md:w-24 cursor-pointer rounded-2xl hover:bg-white/10 transition-all duration-300 flex flex-col items-center gap-2 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="w-5 h-5 text-white md:w-4 md:h-4"
                      fill="currentColor"
                    >
                      <path d="M241 87.1l15 20.7 15-20.7C296 52.5 336.2 32 378.9 32 452.4 32 512 91.6 512 165.1l0 2.6c0 112.2-139.9 242.5-212.9 298.2-12.4 9.4-27.6 14.1-43.1 14.1s-30.8-4.6-43.1-14.1C139.9 410.2 0 279.9 0 167.7l0-2.6C0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1z" />
                    </svg>
                    <h3 className="text-xs font-medium text-white">
                      Yêu Thích
                    </h3>
                  </div>

                  {/* Thêm Vào */}
                  <div className="p-2 sm:w-20 md:w-24 cursor-pointer rounded-2xl hover:bg-white/10 transition-all duration-300 flex flex-col items-center gap-2 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      className="w-5 h-5 text-white md:w-4 md:h-4"
                      fill="currentColor"
                    >
                      <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z" />
                    </svg>
                    <h3 className="text-xs font-medium text-white">Thêm Vào</h3>
                  </div>

                  {/* Chia Sẻ */}
                  <div className="p-2 sm:w-20 md:w-24 cursor-pointer rounded-2xl hover:bg-white/10 transition-all duration-300 flex flex-col items-center gap-2 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      className="w-5 h-5 text-white md:w-4 md:h-4"
                      fill="currentColor"
                    >
                      <path d="M568.4 37.7C578.2 34.2 589 36.7 596.4 44C603.8 51.3 606.2 62.2 602.7 72L424.7 568.9C419.7 582.8 406.6 592 391.9 592C377.7 592 364.9 583.4 359.6 570.3L295.4 412.3C290.9 401.3 292.9 388.7 300.6 379.7L395.1 267.3C400.2 261.2 399.8 252.3 394.2 246.7C388.6 241.1 379.6 240.7 373.6 245.8L261.2 340.1C252.1 347.7 239.6 349.7 228.6 345.3L70.1 280.8C57 275.5 48.4 262.7 48.4 248.5C48.4 233.8 57.6 220.7 71.5 215.7L568.4 37.7z" />
                    </svg>
                    <h3 className="text-xs font-medium text-white">Chia Sẻ</h3>
                  </div>

                  {/* Bình Luận */}
                  <div className="p-2 sm:w-20 md:w-24 cursor-pointer rounded-2xl hover:bg-white/10 transition-all duration-300 flex flex-col items-center gap-2 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      className="w-5 h-5 text-white md:w-4 md:h-4"
                      fill="currentColor"
                    >
                      <path d="M576 304C576 436.5 461.4 544 320 544C282.9 544 247.7 536.6 215.9 523.3L97.5 574.1C88.1 578.1 77.3 575.8 70.4 568.3C63.5 560.8 62 549.8 66.8 540.8L115.6 448.6C83.2 408.3 64 358.3 64 304C64 171.5 178.6 64 320 64C461.4 64 576 171.5 576 304z" />
                    </svg>
                    <h3 className="text-xs font-medium text-white">
                      Bình Luận
                    </h3>
                  </div>
                </div>
              </div>
              <h1 className="text-lg font-bold">{movie.title}</h1>
              <TabMenuMovieDetail tabs={tabs} />
              <Comment/>
              <CommentList/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
