import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";
import MovieList from "./components/MovieList";
import Header from "./components/Header";
import WatchMovie from "./pages/WatchMovie";
import MovieDetail from "./pages/MovieDetail";
import CategoryList from "./components/CategoryList";
import CategoryDetail from "./pages/CategoryDetail";
import SearchPage from "./pages/SearchPage";
import MovieVN from "./components/MovieVN";
import MovieTQ from "./components/MovieTQ";
import MovieHQ from "./components/MovieHQ";
import MovieAction from "./components/MovieAction";



const App = () => {
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve,1000));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  },[]);


  if (loading) {
    return (
      <Loading />
    )
  }


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
                <MovieVN />
                <MovieTQ />
                <MovieHQ />
                <MovieAction/>
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
