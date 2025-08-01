import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieList from "./components/MovieList";
import Header from "./components/Header";
import WatchMovie from "./pages/WatchMovie";
import MovieDetail from "./components/MovieDetail";
import CategoryList from "./components/CategoryList";
import CategoryDetail from "./pages/CategoryDetail";

const App = () => {
  return (
    <Router>
      <div className="flex-col items-center">
        <div className="w-full">
          <Header />
        </div>

        <Routes>
          <Route path="/" element={
            <>
              <MovieList />
              <CategoryList />
            </>
          } />
          <Route path="/phim/:slug" element={<WatchMovie />} />
          <Route path="/the-loai/:slug" element={<CategoryDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
