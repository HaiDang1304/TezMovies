import MovieList from "./components/MovieList";
import Header from "./components/Header";

const App = () => {
  return (<div className="flex flex-col items-center min-h-screen">
    <div className="w-full"> 
      <Header />
    </div>
    <h1 className="text-2xl font-bold text-center my-4">Danh Sách Phim Mới Cập Nhật</h1>
    <MovieList />
  </div> );
}
 
export default App;