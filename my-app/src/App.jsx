import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieList from "./components/MovieList";
import Header from "./components/Header";
import WatchMovie from "./pages/WatchMovie";
import MovieDetail from "./components/MovieDetail";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col items-center min-h-screen">
        <div className="w-full">
          <Header />
        </div>

        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/phim/:slug" element={<WatchMovie />} />
        </Routes>
      </div>
    </Router>
    
  );
};

export default App;
