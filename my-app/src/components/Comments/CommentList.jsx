import React, { useState, useEffect } from "react";
import axios from "axios";
import ReplyItem from "./ReplyItem";

const CommentList = ({ comments, user }) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState({}); // { [commentId]: ReplyTree[] }

  useEffect(() => {
    if (!comments?.length) return;
    let alive = true;

    (async () => {
      try {
        const results = await Promise.all(
          comments.map((cmt) =>
            axios
              .get(`http://localhost:3000/api/replies/${cmt._id}`, {
                withCredentials: true,
              })
              .then((r) => ({
                commentId: cmt._id,
                items: Array.isArray(r.data?.replies)
                  ? r.data.replies.filter(Boolean)
                  : [],
              }))
              .catch(() => ({ commentId: cmt._id, items: [] }))
          )
        );

        if (!alive) return;

        const next = results.reduce((acc, { commentId, items }) => {
          acc[commentId] = items;
          return acc;
        }, {});
        setReplies(next);
      } catch (e) {
        // optional: console.error(e);
      }
    })();

    return () => {
      alive = false;
    };
  }, [comments]);

  const handleReply = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:3000/api/replies",
        { commentId, text: replyText },
        { withCredentials: true }
      );
      const newReply = res.data?.reply;
      setReplies((prev) => ({
        ...prev,
        [commentId]: [...(prev[commentId] ?? []), newReply].filter(Boolean),
      }));
      setReplyText("");
      setReplyingTo(null);
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  // Thêm reply con (nested)
  const handleReplyAdded = (parentReplyId, newReply) => {
    const cid = newReply?.commentId; // server trả kèm commentId
    if (!cid) return;

    const updateTree = (items = []) =>
      items.filter(Boolean).map((node) => {
        if (!node?._id) return node;
        if (node._id === parentReplyId) {
          const child = Array.isArray(node.replies) ? node.replies : [];
          return { ...node, replies: [...child, newReply].filter(Boolean) };
        }
        return { ...node, replies: updateTree(node?.replies || []) };
      });

    setReplies((prev) => ({
      ...prev,
      [cid]: updateTree(prev[cid] || []),
    }));
  };

  return (
    <div className="mt-4 space-y-3">
      {(comments ?? []).map((cmt) => (
        <div
          key={cmt._id}
          className="bg-gray-800 p-3 rounded-xl text-white text-sm border border-gray-700"
        >
          <p className="font-semibold text-blue-400 flex items-center gap-2">
            {cmt.user?.picture && (
              <img
                src={cmt.user.picture}
                alt={cmt.user.name}
                className="w-6 h-6 rounded-full"
              />
            )}
            {cmt.user?.name && <span>{cmt.user.name}</span>}
          </p>

          <p className="mt-1">{cmt.text}</p>
          <small className="text-gray-400 text-xs">
            {new Date(cmt.createdAt).toLocaleString()}
          </small>

          {user && (
            <button
              className="text-xs text-yellow-400 mt-2"
              onClick={() => setReplyingTo(cmt._id)}
            >
              Trả lời
            </button>
          )}

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

          <div className="ml-6 mt-2 space-y-2">
            {(replies[cmt._id] ?? []).filter(Boolean).map((rep) => (
              <ReplyItem
                key={rep?._id || Math.random()}
                reply={rep}
                user={user}
                onReplyAdded={handleReplyAdded}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
