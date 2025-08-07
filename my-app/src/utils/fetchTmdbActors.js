import axios from "axios";

const API_KEY = "8afc137d2cb21415981fb4af3b88e9e5";

/**
 * Lấy danh sách diễn viên từ TMDB dựa vào type và id
 * @param {string} type - "movie" hoặc "tv"
 * @param {string|number} tmdbId - TMDB ID của phim
 * @returns {Promise<Array<{ name: string, avatar_url: string }>>}
 */
export const fetchTmdbActors = async (type, tmdbId) => {
  if (!tmdbId || !type) {
    console.warn("Thiếu TMDB ID hoặc type");
    return [];
  }

  try {
    const creditsUrl = `https://api.themoviedb.org/3/${type}/${tmdbId}/credits?api_key=${API_KEY}`;
    const creditsRes = await axios.get(creditsUrl);

    const cast = creditsRes.data.cast?.slice(0, 12) || [];

    return cast.map((actor) => ({
      name: actor.name,
      avatar_url: actor.profile_path
        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&background=random`,
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách diễn viên từ TMDB:", error);
    return [];
  }
};
