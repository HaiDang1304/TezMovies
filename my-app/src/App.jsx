import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
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
// import Favorites from "./pages/Account/Favorites";
// import Lists from "./pages/Account/Lists";
// import WatchLater from "./pages/Account/WatchLater";
// import Notifications from "./pages/Account/Notifications";

const GOOGLE_CLIENT_ID =
  "685737935777-maqlvjhft09oistl0e1jdm54m1m02fee.apps.googleusercontent.com";

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
  // <SectionMovie describe="quoc-gia" slug="viet-nam" orientation="horizontal" title="Phim Việt Nam" swiperResponsive={SwiperSlide}/>,
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
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/verify/:token" element={<VerifyPage />} />

        <Route path="/" element={<Layout />}>
          {/* Trang chủ */}
          <Route
            index
            element={
              <>
                <SlideListMovie />
                {/* <MovieList /> */}
                <CategoryList />
                <SlideVNMovie />
                {/* <SlideHQMovie/> */}
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

          {/* Trang không tìm thấy */}
          <Route path="*" element={<NotFound />} />

          <Route path="/chu-de" element={<TopicPages />} />

          {/* Layout con: Quản lý tài khoản */}
          <Route path="account" element={<AccountLayout />}>
            {/* <Route path="favorites" element={<Favorites />} />
            <Route path="lists" element={<Lists />} />
            <Route path="watch-later" element={<WatchLater />} />
            <Route path="notifications" element={<Notifications />} /> */}
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
