import React, { useState } from "react";
import axios from "axios";

const CommentList = ({ comments, onReply, user }) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handleReply = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:3000/api/comments/${commentId}/reply`,
        { text: replyText },
        { withCredentials: true }
      );
      onReply(commentId, res.data.reply);
      setReplyText("");
      setReplyingTo(null);
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {comments.map((cmt) => (
        <div
          key={cmt._id}
          className="bg-gray-800 p-3 rounded-xl text-white text-sm border border-gray-700"
        >
          <p className="font-semibold text-blue-400 flex items-center gap-2">
            <img src={cmt.user?.picture} alt="" className="w-6 h-6 rounded-full" />
            {cmt.user?.name || "Khách"}
          </p>
          <p className="mt-1">{cmt.text}</p>
          <small className="text-gray-400 text-xs">
            {new Date(cmt.createdAt).toLocaleString()}
          </small>

          {/* Nút trả lời */}
          {user && (
            <button
              className="text-xs text-yellow-400 mt-2"
              onClick={() => setReplyingTo(cmt._id)}
            >
              Trả lời
            </button>
          )}

          {/* Form trả lời */}
          {replyingTo === cmt._id && (
            <div className="mt-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white text-sm"
                placeholder="Viết phản hồi..."
              />
              <button
                onClick={() => handleReply(cmt._id)}
                className="text-xs text-white bg-blue-600 px-2 py-1 rounded mt-1"
              >
                Gửi
              </button>
            </div>
          )}

          {/* Danh sách reply */}
          <div className="ml-6 mt-2 space-y-2">
            {cmt.replies?.map((rep, i) => (
              <div key={i} className="bg-gray-700 p-2 rounded text-sm">
                <p className="font-semibold text-green-400 flex items-center gap-2">
                  <img src={rep.user?.picture} alt="" className="w-5 h-5 rounded-full" />
                  {rep.user?.name}
                </p>
                <p>{rep.text}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
