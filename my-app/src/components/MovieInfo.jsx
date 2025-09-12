import React from "react";

const MovieInfo = ({ movie, hidePoster = false }) => {
    const statusMap = {
        completed: "Đã hoàn thành",
        ongoing: "Đang phát sóng",
        upcoming: "Sắp ra mắt",
        cancelled: "Đã hủy",
    };

    return (
        <div className="flex items-center lg:flex-row flex-col gap-4 mb-6 lg:items-start  ">
            { !hidePoster && (
                 <img
                src={movie?.poster_url}
                alt={movie?.name}
                className="w-full max-w-45 rounded-lg"
            />
            )}
            <div className="text-sm text-gray-400">
                <h2 className="lg:text-2xl text-xl font-bold mb-2 ">{movie?.name}</h2>
                <p><strong>Quốc gia:</strong> {movie?.country?.name}</p>
                <p><strong>Đạo diễn:</strong> {movie?.director}</p>
                <div><strong>Diễn viên:</strong>
                    <div className="flex flex-wrap ">
                        {
                            movie.actor?.map((c, index) => (
                                <span key={index}>{c}{index < movie.actor.length - 1 ? ", " : ""}</span>
                            ))
                        }
                    </div>
                </div>
                <p><strong>Thể loại:</strong> {
                    Array.isArray(movie?.category)
                        ? movie?.category.map(c => c.name).join(", ")
                        : movie?.category?.name || "Đang cập nhật"
                }</p>

                <p><strong>Năm phát hành:</strong> {
                    Array.isArray(movie?.year)
                        ? movie?.year.map(y => y.date || y).join(", ")
                        : movie?.year || "Đang cập nhật"
                }</p>
                <p><strong>Trạng thái:</strong> {statusMap[movie?.status] || "Đang cập nhật"}</p>
            </div>
        </div>
    );
};

export default MovieInfo;
