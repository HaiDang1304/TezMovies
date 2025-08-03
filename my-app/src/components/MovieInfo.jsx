import React from "react";

const MovieInfo = ({ movie }) => {
    const statusMap = {
        completed: "Đã hoàn thành",
        ongoing: "Đang phát sóng",
        upcoming: "Sắp ra mắt",
        cancelled: "Đã hủy",
    };

    return (
        <div className="flex items-start gap-4 mb-6 w-2xl">
            <img
                src={movie?.poster_url}
                alt={movie?.name}
                className="w-full max-w-45 rounded-lg"
            />
            <div className="text-sm text-gray-400">
                <h2 className="text-2xl font-bold mb-2">{movie?.name}</h2>
                <p><strong>Quốc gia:</strong> {movie?.country?.name}</p>
                <p><strong>Thời lượng:</strong> {movie?.time}</p>
                <p><strong>Đạo diễn:</strong> {movie?.director}</p>
                <p><strong>Diễn viên:</strong> {movie?.actor}</p>
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

                <p><strong>Đánh giá:</strong> {movie?.vote_average}</p>
                <p><strong>Lượt xem:</strong> {movie?.view}</p>
                <p><strong>Trạng thái:</strong> {statusMap[movie?.status] || "Đang cập nhật"}</p>
            </div>
        </div>
    );
};

export default MovieInfo;
