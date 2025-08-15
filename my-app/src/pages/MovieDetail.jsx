import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MovieInfo from "../components/MovieInfo";
import Loading from "../components/Loading";
import TabMenuMovieDetail from "../components/TabMenuMovieDetail"
import { fetchTmdbActors } from "../utils/fetchTmdbActors";
import { movieRecommended } from "../utils/fetchMovieRecommended";
import MoviesRecommended from "../components/MovieRecommended";
import Image from "../components/Image";





const MovieDetail = () => {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [episodeList, setEpisodeList] = useState([]);
  const navigate = useNavigate();
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [tmdbActors, setTmdbActors] = useState([]);



  const toggleContent = () => setExpanded(!expanded); /*rút gọn/xem thêm*/

  const handleWatchEpisode = (ep) => {
    navigate(`/xem-phim/${slug}?ep=${encodeURIComponent(ep.name)}`);
  }
  const [recommendedMovies, setRecommendedMovies] = useState([]);



  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://phimapi.com/phim/${slug}`);
        setMovie(res.data.movie);
        setEpisodeList(res.data.episodes);

        const tmdbId = res.data.movie?.tmdb?.id;
        const type = res.data.movie?.tmdb?.type;


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
    if (!episodeList || episodeList.length === 0) return [];
    const serverData = episodeList[0]?.server_data || [];
    const result = [];

    for (let i = 0; i < serverData.length; i += groupSize) {
      result.push(serverData.slice(i, i + groupSize));
    }

    return result;
  }, [episodeList, groupSize]);

  console.log("episodeList:", episodeList);
  if (loading) return <Loading />;
  if (!loading && !movie) return null;

  {/*Lấy trailer phim từ API trả về thông qua embe*/ }
  const getEmbedUrl = (url) => {
    if (!url) return "";
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get("v");
    return `https://www.youtube.com/embed/${videoId}`;
  };

  /*Tag */
  const tabs = [
    {
      label: "Tập Phim",
      content: (
        <ul className="text-gray-300 list-disc list-inside">
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Danh sách tập phim</h2>
            <div className="">
              <div>
                <h2 className="text-l mb-2 font-semibold">Danh sách tập</h2>
                <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-2">
                  {groupedEpisodes.map((_, groupIndex) => (
                    <button
                      key={groupIndex}
                      onClick={() => setCurrentGroupIndex(groupIndex)}
                      className={`px-3 py-1 rounded text-sm ${currentGroupIndex === groupIndex
                        ? "!bg-yellow-600 text-white font-bold !hover:bg-yellow-900"
                        : "bg-gray-600 text-white hover:bg-yellow-400"
                        }`}
                    >
                      Tập {groupIndex * groupSize + 1} - {Math.min((groupIndex + 1) * groupSize, episodeList[0]?.server_data.length)}
                    </button>
                  ))}
                </div>

                <h2 className="text-l mb-2 font-semibold">Tập hiện tại</h2>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-6 gap-2 mb-4">
                  {groupedEpisodes[currentGroupIndex]?.map((ep, index) => (
                    <button
                      key={index}
                      onClick={() => handleWatchEpisode(ep)}
                      className={`px-3 py-1 rounded text-sm ${currentEpisode?.name === ep.name
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
          </div>
        </ul>
      ),

    },
    {
      label: "Diễn viên",
      content: (
        <ul className="text-gray-300 list-disc list-inside">
          <div>
            <h2 className="text-l mb-2 font-semibold mt-4">Diễn viên</h2>
          </div>
          {tmdbActors.length === 0 ? (
            <p className="text-red-500">Không tìm thấy diễn viên.</p>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 ">
              {tmdbActors.map((actor, index) => (
                <div key={index} className="">
                  <div className="relative">
                    <div className="transition delay-50 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:border-amber-300">
                      <div className="relative">

                        <Image
                          src={
                            actor.avatar_url.includes("ui-avatars.com")
                              ? "/NoImages.jpg"
                              : actor.avatar_url
                          }
                          alt={actor.name}
                  
                        />



                        <div className="bg-gradient-to-t h-1/2 absolute z-[1] bottom-0 from-[#242424] inset-x-0 to-transparent pointer-events-none css-0 rounded-xl"></div>
                      </div>

                      <div className="mt-[-60px] to-transparent z-5 relative text-center  ">
                        <p className="text-amber-400 font-medium text-sm mt-2 truncate duration-10 p-5">{actor.name}</p>
                      </div>
                    </div>


                  </div>
                </div>
              ))}
            </div>
          )}
        </ul>
      ),
    },
    {
      label: "Trailer",
      content: (
        <div className="min-w-full lg:h-100">
          {getEmbedUrl(movie.trailer_url) ? (
            <iframe
              src={getEmbedUrl(movie.trailer_url)}
              title="Trailer"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          ) : (
            <div className="text-red-500 bg-gray-800 p-4 rounded-lg text-center">
              Hiện không có Trailer phim, vui lòng quay lại sau nhé !!!
            </div>
          )}
        </div>
      ),
    },
    {
      label: "Đề xuất",
      content: (
        <MoviesRecommended/>
      ),
    },
  ];




  return (
    <div className=" bg-gray-600 text-white">
      <div className="relative bg-[#242424] min-h-screen">
        <div className="">
          <div className="relative ">
            <div className=" relative lg:pt-[32%] md:pt-[46%] sm:pt-[50%] pt-[60%]">
              <img src={movie?.thumb_url} alt={movie?.name} className="absolute inset-0 w-full h-full object-cover block " style={{ filter: 'grayscale(70%)' }} />
              <div className="bg-gradient-to-t h-1/2 absolute z-[1] bottom-0 from-[#242424] inset-x-0 to-transparent pointer-events-none css-0">
              </div>
            </div>
          </div>
          <div className="mt-[-150px] bg-gradient-to-t from-gray-700 to-transparent z-5 relative">
            <div className="grid grid-cols-12 gap-5 py-6 px-6 min-w-full ">
              <div className="bg-gradient-to-b lg:from-gray-800 to-gray-transparent rounded-2xl lg:col-span-4 col-span-12">
                <div className="px-3 py-3 flex flex-col lg:justify-center justify-center">

                  <MovieInfo movie={movie} />
                  <div className="">
                    <div className="flex flex-wrap gap-2">
                      {/* TMDb */}
                      <span className="px-3 py-1 rounded-full border border-yellow-400 text-yellow-400 text-sm font-semibold">
                        TMDb {movie.tmdb.vote_average || 0}
                      </span>

                      {/* Chất lượng */}
                      <span className="px-3 py-1 rounded-full bg-gray-700 text-white text-sm">
                        {movie.quality}
                      </span>

                      {/* Năm */}
                      <span className="px-3 py-1 rounded-full bg-gray-700 text-white text-sm">
                        {movie.year}
                      </span>

                      {/* Ngôn ngữ */}
                      <span className="px-3 py-1 rounded-full bg-gray-700 text-white text-sm">
                        {movie.lang}
                      </span>

                      {/* Thời lượng */}
                      <span className="px-3 py-1 rounded-full bg-gray-700 text-white text-sm">
                        {movie.time}
                      </span>

                      {/* Tập hiện tại */}
                      <span className="px-3 py-1 rounded-full bg-gray-700 text-white text-sm">
                        {movie.episode_current}
                      </span>

                      {/* Các thể loại (category) */}
                      {movie.category?.map((cat, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-gray-600 text-white text-sm"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold mb-2 mt-2">Giới thiệu: </h2>
                  <div>
                    <p
                      className={`text-sm text-gray-300 gap-4 transition-all duration-300`}
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        WebkitLineClamp: expanded ? 'unset' : 2,
                      }}
                    >
                      {movie?.content}
                    </p>

                    {/* Nút xem thêm / thu gọn */}
                    <div>
                      {movie?.content && movie.content.length > 50 && (
                        <p
                          onClick={toggleContent}
                          className=" text-amber-300 hover:text-amber-500 mt-1 hover:underline text-sm font-semibold"
                        >
                          {expanded ? 'Thu gọn' : 'Xem thêm'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              </div>
              <div className="w-full px-6 py-4 bg-gradient-to-b from-gray-800 to-gray-transparent rounded-2xl lg:col-span-8 col-span-12">
                <button
                  className="px-4 py-2 !bg-yellow-600 hover:!bg-amber-400 rounded text-white flex !rounded-4xl"
                  onClick={() => navigate(`/xem-phim/${slug}?tap=${episodeList?.[0]?.name}`)}
                >
                  ▶ Xem phim
                </button>


                <div className="">
                  <h1 className="!text-lg font-bold">{movie.title}</h1>
                  <TabMenuMovieDetail tabs={tabs} />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default MovieDetail;
