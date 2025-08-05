// api.js
import axios from "axios";

export const searchMovies = async ({
  keyword = "",
  page = 1,
  sort_field = "",
  sort_type = "",
  sort_lang = "",
  category = "",
  country = "",
  year = "",
  limit = 20,
}) => {
  try {
    const response = await axios.get("https://phimapi.com/v1/api/tim-kiem", {
      params: {
        keyword,
        page,
        sort_field,
        sort_type,
        sort_lang,
        category,
        country,
        year,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API phim:", error);
    return null;
  }
};
