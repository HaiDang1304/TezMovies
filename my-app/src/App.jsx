import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import Layout from "./components/Layout/Layout";
import NotFound from "./components/Layout/NotFound";

// Auth
import { AuthProvider } from "./components/Auth/AuthContext";

// Movies
import MovieList from "./components/Movies/MovieList";
import SectionMovie from "./components/Movies/SectionMovie";
import SlideListMovie from "./components/Movies/SlideListMovie";
import SlideVNMovie from "./components/Movies/SlideVNMovie";

// Categories
import CategoryList from "./components/Categories/CategoryList";

// Pages
import WatchMovie from "./pages/WatchMovie";
import MovieDetail from "./pages/MovieDetail";
import CategoryDetail from "./pages/CategoryDetail";
import SearchPage from "./pages/SearchPage";
import TopicPages from "./pages/TopicPages";
import VerifyPage from "./pages/VerifyPage";

import AccountLayout from "./pages/Account/AccountLayout";
import Profile from "./pages/Account/Profile";
import { UserProvider } from "./context/UserContext.jsx";
// import Favorites from "./pages/Account/Favorites";
// import Lists from "./pages/Account/Lists";
// import WatchLater from "./pages/Account/WatchLater";
// import Notifications from "./pages/Account/Notifications";

// Responsive config
const defaultSwiper = {
  0: { slidesPerView: 2 },
  640: { slidesPerView: 3 },
  768: { slidesPerView: 4 },
  1024: { slidesPerView: 6 },
  1280: { slidesPerView: 7 },
};

const SwiperSlide = {
  0: { slidesPerView: 2 },
  640: { slidesPerView: 3 },
  768: { slidesPerView: 4 },
  1024: { slidesPerView: 5 },
  1280: { slidesPerView: 6 },
};

// Gom tất cả SectionMovie thành mảng
const sectionComponents = [
  <SectionMovie
    describe="quoc-gia"
    slug="trung-quoc"
    orientation="horizontal"
    title="Phim Trung Quốc"
    swiperResponsive={SwiperSlide}
  />,
  <SectionMovie
    describe="quoc-gia"
    slug="han-quoc"
    orientation="horizontal"
    title="Phim Hàn Quốc"
    swiperResponsive={SwiperSlide}
  />,
  <SectionMovie
    describe="the-loai"
    slug="hanh-dong"
    title="Hành Động Đỉnh Cao"
    swiperResponsive={defaultSwiper}
  />,
  <SectionMovie
    describe="the-loai"
    slug="kinh-di"
    orientation="horizontal"
    title="Kinh Dị Đến Đáng Sợ"
    swiperResponsive={SwiperSlide}
  />,
  <SectionMovie
    describe="the-loai"
    slug="tinh-cam"
    title="Cảm Xúc Dâng Trào"
    swiperResponsive={defaultSwiper}
  />,
  <SectionMovie
    describe="the-loai"
    slug="phieu-luu"
    orientation="horizontal"
    title="Phiêu Lưu Kỳ Thú"
    swiperResponsive={SwiperSlide}
  />,
  <SectionMovie
    describe="the-loai"
    slug="gia-dinh"
    title="Khoảnh Khắc Gia Đình"
    swiperResponsive={defaultSwiper}
  />,
  <SectionMovie
    describe="the-loai"
    slug="co-trang"
    orientation="horizontal"
    title="Cổ Trang Kinh Điển"
    swiperResponsive={SwiperSlide}
  />,
  <SectionMovie
    describe="the-loai"
    slug="vien-tuong"
    title="Khoa Học Viễn Tưởng"
    swiperResponsive={defaultSwiper}
  />,
  <SectionMovie
    describe="the-loai"
    slug="hai-huoc"
    title="Vui Vẻ Hài Hước"
    swiperResponsive={defaultSwiper}
  />,
  <SectionMovie
    describe="the-loai"
    slug="bi-an"
    orientation="horizontal"
    title="Bí Ẩn Rùng Rợn"
    swiperResponsive={SwiperSlide}
  />,
  <SectionMovie
    describe="the-loai"
    slug="chien-tranh"
    title="Chiến Tranh Khốc Liệt"
    swiperResponsive={defaultSwiper}
  />,
];

const App = () => (
  <UserProvider>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Xác thực email */}
          <Route path="/verify/:token" element={<VerifyPage />} />

          {/* Layout chính */}
          <Route path="/" element={<Layout />}>
            {/* Trang chủ */}
            <Route
              index
              element={
                <>
                  <SlideListMovie />
                  <CategoryList />
                  <SlideVNMovie />
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
            <Route path="/danh-sach/:type_list" element={<CategoryDetail />} />

            {/* Trang tìm kiếm */}
            <Route path="search" element={<SearchPage />} />

            {/* Trang chủ đề */}
            <Route path="/chu-de" element={<TopicPages />} />

            {/* Layout con: Quản lý tài khoản */}
            <Route path="account" element={<AccountLayout />}>
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Trang không tìm thấy */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  </UserProvider>
);

export default App;
