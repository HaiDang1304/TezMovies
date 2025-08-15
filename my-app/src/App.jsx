import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Loading from "./components/Loading";
import Layout from "./components/Layout";
import MovieList from "./components/MovieList";
import CategoryList from "./components/CategoryList";
import WatchMovie from "./pages/WatchMovie";
import MovieDetail from "./pages/MovieDetail";
import CategoryDetail from "./pages/CategoryDetail";
import SearchPage from "./pages/SearchPage";
import SectionMovie from "./components/SectionMovie";
import NotFound from "./components/NotFound";

const GOOGLE_CLIENT_ID = "685737935777-maqlvjhft09oistl0e1jdm54m1m02fee.apps.googleusercontent.com";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router> {/* Bọc toàn bộ Routes trong BrowserRouter */}
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Trang chủ */}
            <Route
              index
              element={
                <>
                  <MovieList />
                  <CategoryList />
                  <SectionMovie
                    describe="quoc-gia"
                    slug="viet-nam"
                    orientation="horizontal"
                  />
                  <SectionMovie
                    describe="quoc-gia"
                    slug="trung-quoc"
                    orientation="horizontal"
                  />
                  <SectionMovie
                    describe="quoc-gia"
                    slug="han-quoc"
                    orientation="horizontal"
                  />
                  <SectionMovie
                    describe="the-loai"
                    slug="hanh-dong"
                    swiperResponsive={{
                      0: { slidesPerView: 2 },
                      640: { slidesPerView: 3 },
                      768: { slidesPerView: 4 },
                      1024: { slidesPerView: 5 },
                      1280: { slidesPerView: 6 },
                    }}
                  />
                  <SectionMovie
                    describe="the-loai"
                    slug="kinh-di"
                    orientation="horizontal"
                  />
                  <SectionMovie
                    describe="the-loai"
                    slug="tinh-cam"
                    swiperResponsive={{
                      0: { slidesPerView: 2 },
                      640: { slidesPerView: 3 },
                      768: { slidesPerView: 4 },
                      1024: { slidesPerView: 5 },
                      1280: { slidesPerView: 6 },
                    }}
                  />
                  <SectionMovie
                    describe="the-loai"
                    slug="phieu-luu"
                    orientation="horizontal"
                  />
                  <SectionMovie
                    describe="the-loai"
                    slug="gia-dinh"
                    swiperResponsive={{
                      0: { slidesPerView: 2 },
                      640: { slidesPerView: 3 },
                      768: { slidesPerView: 4 },
                      1024: { slidesPerView: 5 },
                      1280: { slidesPerView: 6 },
                    }}
                  />
                  <SectionMovie
                    describe="the-loai"
                    slug="co-trang"
                    orientation="horizontal"
                  />
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
          </Route>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;