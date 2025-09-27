import React, { useState } from "react";
import axios from "axios";

const Comment = ({ onNewComment, movieId, user }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/api/comments",
        {
          slug: movieId,
          text: comment,
          // userId: user?.id || user?._id,
        },
        { withCredentials: true }
      );
      onNewComment(res.data.comment);
      setComment("");
    } catch (err) {
      console.error("Error posting comment", err);
    }
  };

  return (
    <div className="w-ful rounded-2xl shadow-lg mt-6 mb-10">
      <h2 className="text-xl font-semibold text-white mb-3">Bình luận</h2>
      <div className="flex flex-col justify-end gap-2 p-2 rounded-xl bg-[#ffffff10] css-0">
        <textarea
          className="chakra-textarea bg-[#191b24] text-white rounded-lg p-4 border-2 border-transparent outline-none focus:border-gray-500 css-sedhif w-full h-[120px]"
          maxLength={500}
          placeholder={user ? "Viết bình luận..." : "Bạn phải đăng nhập mới có thể bình luận !!"}
          disabled={!user}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex flex-row items-center justify-between">
          <p className="text-sm text-gray-400 mt-2">
            {comment.length}/500 ký tự
          </p>
          <button
            onClick={handleSubmit}
            className=" text-white rounded-lg flex items-center gap-2 cursor-pointer"
          >
            Gửi
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1.2em"
              width="1.2em"
              xmlns="http://www.w3.org/2000/svg"
              className=""
            >
              <path d="M48 448l416-192L48 64v149.333L346 256 48 298.667z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
