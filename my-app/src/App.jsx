import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieList from "./components/MovieList";
import Header from "./components/Header";
import WatchMovie from "./pages/WatchMovie";
import MovieDetail from "./pages/MovieDetail";
import CategoryList from "./components/CategoryList";
import CategoryDetail from "./pages/CategoryDetail";
import SearchPage  from "./pages/SearchPage";

const App = () => {
  return (
    <Router>
      <div className="flex-col items-center">
        <div className="w-full">
          <Header />
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <MovieList />
                <CategoryList />
              </>
            }
          />
          {/* ✅ Trang chi tiết phim */}
          <Route path="/phim/:slug" element={<MovieDetail />} />


          {/* ✅ Trang xem phim */}
          <Route path="/xem-phim/:slug" element={<WatchMovie />} />

          {/* ✅ Trang thể loại */}
          <Route path="/the-loai/:slug" element={<CategoryDetail />} />
          <Route path="/search" element={<SearchPage />} />
          

        </Routes>
      </div>
    </Router>
  );
};

export default App;
