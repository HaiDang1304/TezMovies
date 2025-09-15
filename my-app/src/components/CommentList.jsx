import React from "react";

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center 
                py-6 sm:py-8 md:py-12 
                px-4 sm:px-6 md:px-8 
                text-gray-400 bg-gray-900 rounded-2xl mt-6 sm:mt-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          className="w-4 h-4 sm:w-12 sm:h-12 md:w-16 md:h-16 mb-3 opacity-70"
          fill="gray"
        >
          <path
            className="w-2 h-2"
            d="M320 544C461.4 544 576 436.5 576 304C576 171.5 461.4 64 320 64C178.6 64 64 171.5 64 304C64 358.3 83.2 408.3 115.6 448.5L66.8 540.8C62 549.8 63.5 560.8 70.4 568.3C77.3 575.8 88.2 578.1 97.5 574.1L215.9 523.4C247.7 536.6 282.9 544 320 544zM192 272C209.7 272 224 286.3 224 304C224 321.7 209.7 336 192 336C174.3 336 160 321.7 160 304C160 286.3 174.3 272 192 272zM320 272C337.7 272 352 286.3 352 304C352 321.7 337.7 336 320 336C302.3 336 288 321.7 288 304C288 286.3 302.3 272 320 272zM416 304C416 286.3 430.3 272 448 272C465.7 272 480 286.3 480 304C480 321.7 465.7 336 448 336C430.3 336 416 321.7 416 304z"
          />
        </svg>

        <p className="text-base sm:text-lg md:text-xl font-semibold text-center">
          Chưa có bình luận nào
        </p>

        <p className="mt-2 text-lg sm:text-base md:text-sx italic text-center max-w-md">
          Hãy là người đầu tiên bình luận
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {comments.map((cmt, index) => (
        <div
          key={cmt._id || index}
          className="bg-gray-800 p-3 rounded-xl text-white text-sm border border-gray-700"
        >
          <p className="font-semibold text-blue-400">
            {cmt.user?.name || cmt.guestName || "Khách"}
          </p>
          <p className="mt-1">{cmt.text}</p>
          <small className="text-gray-400 text-xs">
            {new Date(cmt.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
