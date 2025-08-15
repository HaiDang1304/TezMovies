# 📽 TMDb API - Tổng hợp API mẫu

---

## 🔐 Cấu hình chung

- **Base URL:** `https://api.themoviedb.org/3/`  
- **API key:** `?api_key=YOUR_API_KEY`  
- **Ngôn ngữ (tùy chọn):** `&language=vi-VN`  

---

## 📽 PHIM (Movies)

- 🔍 **Tìm kiếm phim:** `/search/movie?query=batman`  
- 📄 **Chi tiết phim:** `/movie/{movie_id}`  
- 👥 **Diễn viên phim:** `/movie/{movie_id}/credits`  
- 🎞 **Trailer & video:** `/movie/{movie_id}/videos`  
- 🗓 **Ngày phát hành:** `/movie/{movie_id}/release_dates`  
- 📚 **Thể loại:** `/genre/movie/list`  
- 🔥 **Phổ biến:** `/movie/popular`  
- 🆕 **Mới ra rạp:** `/movie/now_playing`  
- 🌟 **Top rated:** `/movie/top_rated`  
- 📅 **Sắp chiếu:** `/movie/upcoming`  

---

## 📺 TV SHOW

- 🔍 **Tìm kiếm TV:** `/search/tv?query=the office`  
- 📄 **Chi tiết TV:** `/tv/{tv_id}`  
- 📅 **Danh sách mùa:** `/tv/{tv_id}/season/{season_number}`  
- 👥 **Diễn viên:** `/tv/{tv_id}/credits`  
- 🎞 **Video:** `/tv/{tv_id}/videos`  
- 🔥 **Phổ biến:** `/tv/popular`  
- 🌟 **Top rated:** `/tv/top_rated`  

---

## 👤 DIỄN VIÊN (People)

- 🔍 **Tìm diễn viên:** `/search/person?query=tom hanks`  
- 📄 **Chi tiết:** `/person/{person_id}`  
- 🎥 **Phim đã đóng:** `/person/{person_id}/combined_credits`  
- 🎬 **Chỉ phim điện ảnh:** `/person/{person_id}/movie_credits`  
- 📺 **Chỉ TV show:** `/person/{person_id}/tv_credits`  

---

## 🌐 KHÁC

- 🌎 **Cấu hình ảnh:** `/configuration`  
- 🌐 **Ngôn ngữ hỗ trợ:** `/configuration/languages`  
- 📊 **Trending:** `/trending/{media_type}/{time_window}`  
- 📌 **Khuyến nghị phim:** `/movie/{movie_id}/recommendations`  
- 🧠 **Phim tương tự:** `/movie/{movie_id}/similar`  

---

## 📷 Ảnh Poster

- **URL ảnh:** `https://image.tmdb.org/t/p/w500 + poster_path`  
- **Ví dụ:**  
  `https://image.tmdb.org/t/p/w500/eKF1sGJRrZJbfBG1KirPt1cfNd3.jpg`  
