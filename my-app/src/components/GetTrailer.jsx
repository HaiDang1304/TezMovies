// src/components/GetTrailer.jsx
import axios from "axios";

export const getTrailerUrl = async (id, type = "movie") => {
  const apiKey = "8afc137d2cb21415981fb4af3b88e9e5";
  const url = `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${apiKey}&language=en-US`;

  try {
    const response = await axios.get(url);
    const videos = response.data.results;

    console.log("TMDB Videos:", videos); // để kiểm tra dữ liệu

    // Ưu tiên trailer chính thức
    const officialTrailer = videos.find(
      (video) =>
        video.type === "Trailer" &&
        video.site === "YouTube" &&
        video.official === true
    );

    // Nếu không có trailer chính thức, lấy trailer bất kỳ
    const fallbackTrailer = videos.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    const trailerToUse = officialTrailer || fallbackTrailer;

    return trailerToUse ? `https://www.youtube.com/watch?v=${trailerToUse.key}` : null;
  } catch (error) {
    console.error("Không thể lấy trailer từ TMDB:", error.message);
    return null;
  }
};
