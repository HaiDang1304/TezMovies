import axios from "axios";

const API_KEY = "8afc137d2cb21415981fb4af3b88e9e5";

/**
 * Lấy danh sách phim đề xuất từ TMDB dựa vào type và tmdbId
 * @param {string} type - "movie" hoặc "tv"
 * @param {string|number} tmdbId - TMDB ID của phim
 * @returns {Promise<Array<{ id: number, title: string, poster_url: string }>>}
 */
export const fetchRecommendedMovies = async (type, tmdbId) => {
  if (!tmdbId || !type) {
    console.warn("Thiếu TMDB ID hoặc type");
    return [];
  }

  try {
    const url = `https://api.themoviedb.org/3/${type}/${tmdbId}/recommendations?api_key=${API_KEY}`;
    const res = await axios.get(url);

    const results = res.data.results?.slice(0, 10) || [];

    return results.map((movie) => ({
      id: movie.id,
      title: movie.title || movie.name,
      slug: movie.slug || " ",
      poster_url: movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : "/404.jpg", // Ảnh mặc định nếu không có poster
    }));
  } catch (error) {
    console.error("Lỗi khi fetch đề xuất phim:", error);
    return [];
  }
};
