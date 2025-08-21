import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Layout from "./components/Layout";
import MovieList from "./components/MovieList";
import CategoryList from "./components/CategoryList";
import SectionMovie from "./components/SectionMovie";
import WatchMovie from "./pages/WatchMovie";
import MovieDetail from "./pages/MovieDetail";
import CategoryDetail from "./pages/CategoryDetail";
import SearchPage from "./pages/SearchPage";
import NotFound from "./components/NotFound";
import TopicPages from "./pages/TopicPages";

const GOOGLE_CLIENT_ID =
  "685737935777-maqlvjhft09oistl0e1jdm54m1m02fee.apps.googleusercontent.com";

const defaultSwiper = {
  0: { slidesPerView: 2 },
  640: { slidesPerView: 3 },
  768: { slidesPerView: 4 },
  1024: { slidesPerView: 5 },
  1280: { slidesPerView: 6 },
};

// Gom tất cả SectionMovie thành mảng
const sectionComponents = [
  <SectionMovie describe="quoc-gia" slug="viet-nam" orientation="horizontal" title="Phim Việt Nam" />,
  <SectionMovie describe="quoc-gia" slug="trung-quoc" orientation="horizontal" title="Phim Trung Quốc" />,
  <SectionMovie describe="quoc-gia" slug="han-quoc" orientation="horizontal" title="Phim Hàn Quốc" />,
  <SectionMovie describe="the-loai" slug="hanh-dong" title="Hành Động Đỉnh Cao" swiperResponsive={defaultSwiper} />,
  <SectionMovie describe="the-loai" slug="kinh-di" orientation="horizontal" title="Kinh Dị Đến Đáng Sợ" />,
  <SectionMovie describe="the-loai" slug="tinh-cam" title="Cảm Xúc Dâng Trào" swiperResponsive={defaultSwiper} />,
  <SectionMovie describe="the-loai" slug="phieu-luu" orientation="horizontal" title="Phiêu Lưu Kỳ Thú" />,
  <SectionMovie describe="the-loai" slug="gia-dinh" title="Khoảnh Khắc Gia Đình" swiperResponsive={defaultSwiper} />,
  <SectionMovie describe="the-loai" slug="co-trang" orientation="horizontal" title="Cổ Trang Kinh Điển" />,
  <SectionMovie describe="the-loai" slug="vien-tuong" title="Khoa Học Viễn Tưởng" swiperResponsive={defaultSwiper} />,
  <SectionMovie describe="the-loai" slug="hai-huoc" title="Vui Vẻ Hài Hước" swiperResponsive={defaultSwiper} />,
  <SectionMovie describe="the-loai" slug="bi-an" orientation="horizontal" title="Bí Ẩn Rùng Rợn" />,
  <SectionMovie describe="the-loai" slug="chien-tranh" title="Chiến Tranh Khốc Liệt" swiperResponsive={defaultSwiper} />,
];

const App = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Trang chủ */}
          <Route
            index
            element={
              <>
                <MovieList />
                <CategoryList />
                {sectionComponents.map((Section, i) => (
                  <React.Fragment key={i}>{Section}</React.Fragment>
                ))}
              </>
            }
          />

          {/* Trang chi tiết phim */}
          <Route path="phim/:slug" element={<MovieDetail />} />

          {/* Trang xem phim */}
          <Route path="xem-phim/:slug" element={<WatchMovie />} />

          {/* Trang thể loại */}
          <Route path=":describe/:slug" element={<CategoryDetail />} />

          {/* Trang tìm kiếm */}
          <Route path="search" element={<SearchPage />} />

          {/* Trang không tìm thấy */}
          <Route path="*" element={<NotFound />} />

          <Route path="/chu-de" element={<TopicPages />} />
        </Route>
      </Routes>
    </Router>
  </GoogleOAuthProvider>
);

export default App;
