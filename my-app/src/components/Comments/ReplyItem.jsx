import React, { useState } from "react";
import axios from "axios";

const ReplyItem = ({ reply, user, onReplyAdded }) => {
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState("");

  // ✅ Nếu reply rỗng => khỏi render
  if (!reply || typeof reply !== "object") return null;

  const author = reply?.user ?? {};
  const parentUser = reply?.parentUser ?? null;
  const children = Array.isArray(reply?.replies) ? reply.replies.filter(Boolean) : [];

  const handleReply = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:3000/api/replies",
        { commentId: reply?.commentId, parentReplyId: reply?._id, text },
        { withCredentials: true }
      );
      onReplyAdded?.(reply?._id, res.data.reply);
      setText("");
      setReplying(false);
    } catch (err) {
      console.error("Error posting nested reply:", err);
    }
  };

  return (
    <div className="ml-6 mt-2 bg-gray-700 p-2 rounded">
      <p className="font-semibold text-green-400 flex items-center gap-2">
        <img
          src={author?.picture || "/default-avatar.png"}
          alt={author?.name || "Ẩn danh"}
          className="w-5 h-5 rounded-full"
        />
        {author?.name || "Ẩn danh"}
      </p>

      {parentUser?.name && (
        <p className="text-sm text-gray-400">
          Trả lời <span className="text-blue-400">@{parentUser.name}</span>
        </p>
      )}

      <p>{reply?.text}</p>

      {user && (
        <button className="text-xs text-yellow-400 mt-1" onClick={() => setReplying(!replying)}>
          Trả lời
        </button>
      )}

      {replying && (
        <div className="mt-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-1 rounded bg-gray-600 text-white text-sm"
            placeholder="Viết phản hồi..."
          />
          <button onClick={handleReply} className="text-xs text-white bg-blue-600 px-2 py-1 rounded mt-1">
            Gửi
          </button>
        </div>
      )}

      {children.map((child) => (
        <ReplyItem
          key={child?._id || Math.random()}
          reply={child}
          user={user}
          onReplyAdded={onReplyAdded}
        />
      ))}
    </div>
  );
};

export default ReplyItem;
