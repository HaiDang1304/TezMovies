import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MovieInfo from "../components/MovieInfo";
import Loading from "../components/Loading";
import TabMenuMovieDetail from "../components/TabMenuMovieDetail"
import { fetchTmdbActors } from "../utils/fetchTmdbActors";
import { movieRecommended } from "../utils/fetchMovieRecommended";
import MoviesRecommended from "../components/MovieRecommended";
import Image from "../components/Image";
import {getIdLinkm3u8} from "../utils/getIdLinkm3u8";





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
  const [currentServerIndex, setCurrentServerIndex] = useState(0);


  const toggleContent = () => setExpanded(!expanded); /*rút gọn/xem thêm*/




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
  const handleChangeServer = (index) => {
    setCurrentServerIndex(index);
    setCurrentGroupIndex(0); 
    // reset về trang 1 của server mới
  };


  /*Tag */
  const tabs = [
    {
      label: "Tập Phim",
      content: (
        <ul className="text-gray-300 list-disc list-inside">

          <div className="mt-8">
            <div className="server-buttons mb-4">
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
            px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200
            ${currentServerIndex === index
                          ? "bg-yellow-600 border-yellow-600 text-white shadow-lg transform scale-105"
                          : "bg-transparent border-gray-500 text-gray-300 hover:border-yellow-400 hover:text-yellow-400"
                        }
          `}
                    >
                      {displayName}
                      <span className="ml-1 text-xs opacity-75">
                        ({episode.server_data.length} tập)
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

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
                      Tập {groupIndex * groupSize + 1} - {Math.min(
                        (groupIndex + 1) * groupSize,
                        episodeList[currentServerIndex]?.server_data.length
                      )}
                    </button>
                  ))}

                </div>

                <h2 className="text-l mb-2 font-semibold">Tập hiện tại</h2>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-6 gap-2 mb-4">
                  {groupedEpisodes[currentGroupIndex]?.map((ep, index) => (
                    <Link to={`/xem-phim/${slug}?id=${getIdLinkm3u8(ep.link_m3u8)}&index=${currentServerIndex}&groupIndex=${currentGroupIndex}`}>

                      <button
                        id={getIdLinkm3u8(ep.link_m3u8)}
                        key={index}
                        className={`px-3 py-1 rounded text-sm ${currentEpisode?.name === ep.name
                          ? "!bg-yellow-600 text-white font-bold"
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
        <MoviesRecommended />
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
                <div className="gap-4">
                  <div className="flex flex-row items-center gap-6">
                    <button
                      className="px-4 py-2 !bg-yellow-600 hover:!bg-amber-400 rounded text-white !rounded-4xl"
                      onClick={() => navigate(`/xem-phim/${slug}?tap=${episodeList?.[0]?.name}`)}
                    >
                      ▶ Xem phim
                    </button>
                    <div className="flex flex-row">
                      <div className=" p-4 select-none sm:min-w-16 cursor-pointer gap-2 transform-all rounded-2xl hover:bg-[#ffffff05] flex flex-col items-center justify-center text-center">
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height={"1em"} width={"1em"}>
                            <path d="M241 87.1l15 20.7 15-20.7C296 52.5 336.2 32 378.9 32 452.4 32 512 91.6 512 165.1l0 2.6c0 112.2-139.9 242.5-212.9 298.2-12.4 9.4-27.6 14.1-43.1 14.1s-30.8-4.6-43.1-14.1C139.9 410.2 0 279.9 0 167.7l0-2.6C0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1z" fill="white" /></svg>
                        </div>
                        <h3 className="text-sm font-medium ">Yêu Thích</h3>
                      </div>
                      <div className=" p-4 select-none sm:min-w-16 cursor-pointer gap-2 transform-all rounded-2xl hover:bg-[#ffffff05] flex flex-col items-center justify-center text-center">
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={"1em"} height={"1.5em"}>
                            <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z" fill="white" /></svg>
                        </div>
                        <h3 className="text-sm font-medium ">Thêm Vào</h3>
                      </div>
                      <div className=" p-4 select-none sm:min-w-16 cursor-pointer gap-2 transform-all rounded-2xl hover:bg-[#ffffff05] flex flex-col items-center justify-center text-center">
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={"1em"} height={"1em"}>
                            <path d="M568.4 37.7C578.2 34.2 589 36.7 596.4 44C603.8 51.3 606.2 62.2 602.7 72L424.7 568.9C419.7 582.8 406.6 592 391.9 592C377.7 592 364.9 583.4 359.6 570.3L295.4 412.3C290.9 401.3 292.9 388.7 300.6 379.7L395.1 267.3C400.2 261.2 399.8 252.3 394.2 246.7C388.6 241.1 379.6 240.7 373.6 245.8L261.2 340.1C252.1 347.7 239.6 349.7 228.6 345.3L70.1 280.8C57 275.5 48.4 262.7 48.4 248.5C48.4 233.8 57.6 220.7 71.5 215.7L568.4 37.7z" fill="white" /></svg>
                        </div>
                        <h3 className="text-sm font-medium ">Chia Sẻ</h3>
                      </div>
                      <div className=" p-4 select-none sm:min-w-16 cursor-pointer gap-2 transform-all rounded-2xl hover:bg-[#ffffff05] flex flex-col items-center justify-center text-center">
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={"1em"} height={"1em"}>
                            <path d="M576 304C576 436.5 461.4 544 320 544C282.9 544 247.7 536.6 215.9 523.3L97.5 574.1C88.1 578.1 77.3 575.8 70.4 568.3C63.5 560.8 62 549.8 66.8 540.8L115.6 448.6C83.2 408.3 64 358.3 64 304C64 171.5 178.6 64 320 64C461.4 64 576 171.5 576 304z" fill="white" /></svg>
                        </div>
                        <h3 className="text-sm font-medium ">Bình Luận</h3>
                      </div>
                    </div>



                  </div>

                </div>



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
