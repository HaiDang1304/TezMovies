import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MovieInfo from "../components/MovieInfo";
import Loading from "../components/Loading";



const MovieDetail = () => {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [episodeList, setEpisodeList] = useState([]);
  const navigate = useNavigate();
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleWatchEpisode = (ep) => {
    navigate(`/xem-phim/${slug}?ep=${encodeURIComponent(ep.name)}`);
  }

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`https://phimapi.com/phim/${slug}`)
        setMovie(res.data.movie);
        setEpisodeList(res.data.episodes)
        console.log("movie", res.data.movie);
      } catch (error) {
        setMovie(null)
      } finally { setLoading(false) }

    }
    // axios
    //   .get(`https://phimapi.com/phim/${slug}`)
    //   .then((res) => {
    //     setMovie(res.data.movie);
    //   })
    //   .catch((err) => {
    //     console.error("Lỗi tải phim:", err);
    //   });
    getData()
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
          <div className="mt-[-150px] bg-gradient-to-t from-gray-600 to-transparent z-5 relative">
            <div className="grid grid-cols-12 gap-5 py-6 px-6 min-w-full ">
              <div className="bg-gradient-to-b lg:from-gray-600 to-gray-transparent rounded-2xl lg:col-span-7 col-span-12">
                <div className="px-3 py-3 flex flex-col lg:justify-center justify-center">
                  <MovieInfo movie={movie} />
                  <h2 className="text-xl font-bold mb-4">Giới thiệu: </h2>
                  <p className="text-sm text-gray-300 gap-4">{movie?.content}</p>
                </div>

              </div>
              <div className="w-full px-6 py-3 bg-gradient-to-b from-gray-600 to-gray-transparent rounded-2xl lg:col-span-5 col-span-12">
                <button
                  className="px-4 py-2 !bg-yellow-600 hover:!bg-gray-400 rounded text-white flex"
                  onClick={() => navigate(`/xem-phim/${slug}?tap=${episodeList?.[0]?.name}`)}
                >
                  ▶ Xem phim
                </button>

                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">Danh sách tập phim</h2>
                  <div className="">
                    <div>
                      <h2 className="text-l mb-2 font-semibold">Danh sách tập</h2>
                      <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-4 gap-2">
                        {groupedEpisodes.map((_, groupIndex) => (
                          <button
                            key={groupIndex}
                            onClick={() => setCurrentGroupIndex(groupIndex)}
                            className={`px-3 py-1 border rounded text-sm ${currentGroupIndex === groupIndex
                              ? "!bg-yellow-900 text-white font-bold !hover:bg-yellow-900"
                              : "bg-gray-300 text-white"
                              }`}
                          >
                            Tập {groupIndex * groupSize + 1} - {Math.min((groupIndex + 1) * groupSize, episodeList[0]?.server_data.length)}
                          </button>
                        ))}
                      </div>

                      <h2 className="text-l mb-2 font-semibold">Tập hiện tại</h2>
                      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-5 gap-2 mb-4">
                        {groupedEpisodes[currentGroupIndex]?.map((ep, index) => (
                          <button
                            key={index}
                            onClick={() => handleWatchEpisode(ep)}
                            className={`px-3 py-1 border rounded text-sm ${currentEpisode?.name === ep.name
                              ? "!bg-yellow-800 text-white font-bold"
                              : "bg-gray-300 text-white hover:bg-yellow-400"
                              }`}
                          >
                            {ep.name}
                          </button>
                        ))}
                      </div>

                    </div>
                  </div>
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
