import axios from "axios";

const API_KEY = "8afc137d2cb21415981fb4af3b88e9e5";

/**
 * Lấy danh sách diễn viên từ TMDB dựa vào type và id
 * @param {string} type - "movie" hoặc "tv"
 * @param {string|number} tmdbId - TMDB ID của phim
 * @param {Object} options - Tùy chọn bổ sung (limit, language, imgSize)
 * @returns {Promise<Array<{ id: number, name: string, avatar_url: string, character: string }>>}
 */
export const fetchTmdbActors = async (type, tmdbId, options = {}) => {
  if (!tmdbId || !type) {
    console.warn("Thiếu TMDB ID hoặc type");
    return [];
  }

  const { limit = 12, language = "vi-VN", imgSize = "w185" } = options;

  try {
    const creditsUrl = `https://api.themoviedb.org/3/${type}/${tmdbId}/credits?api_key=${API_KEY}&language=${language}`;
    const creditsRes = await axios.get(creditsUrl);

    const cast = creditsRes.data.cast?.slice(0, limit) || [];

    return cast.map((actor) => ({
      id: actor.id,
      name: actor.name,
      character: actor.character,
      avatar_url: actor.profile_path
        ? `https://image.tmdb.org/t/p/${imgSize}${actor.profile_path}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&background=random`,
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách diễn viên từ TMDB:", error);
    return [];
  }
};