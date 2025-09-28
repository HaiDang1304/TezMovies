import React, { useState } from "react";
import { useParams } from "react-router-dom";

const Comment = ({ onNewComment, movieId, user }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      alert("Vui lòng nhập nội dung bình luận");
      return;
    }

    if (!user) {
      alert("Vui lòng đăng nhập để bình luận");
      return;
    }

    setLoading(true);

    try {
      console.log("🚀 Sending comment:", { slug, text: comment.trim() });

      // ✅ Sử dụng relative URL với proxy
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({
          slug: slug,   
          text: comment.trim()       
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ Error:", errorData);
        alert(errorData.msg || "Có lỗi xảy ra khi gửi bình luận");
        return;
      }

      const data = await res.json();
      console.log("✅ Comment saved:", data);

      if (data.status) {
        // ✅ Clear input sau khi thành công
        setComment("");
        
        // ✅ Gọi callback để update parent component
        if (onNewComment && typeof onNewComment === 'function') {
          onNewComment(data.comment);
        }
        
        // Hoặc có thể trigger reload comments ở parent
        // window.dispatchEvent(new CustomEvent('commentAdded', { detail: data.comment }));
        
        alert("Bình luận đã được gửi thành công!");
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl shadow-lg mt-6 mb-10">
      <h2 className="text-xl font-semibold text-white mb-3">Bình luận</h2>
      <div className="flex flex-col justify-end gap-2 p-2 rounded-xl bg-[#ffffff10] css-0">
        <textarea
          className="chakra-textarea bg-[#191b24] text-white rounded-lg p-4 border-2 border-transparent outline-none focus:border-gray-500 css-sedhif w-full h-[120px]"
          maxLength={500}
          placeholder={
            user
              ? "Viết bình luận..."
              : "Bạn phải đăng nhập mới có thể bình luận !!"
          }
          disabled={!user || loading}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex flex-row items-center justify-between">
          <p className="text-sm text-gray-400 mt-2">
            {comment.length}/500 ký tự
          </p>
          <button
            onClick={handleSubmit}
            disabled={!user || !comment.trim() || loading}
            className="text-white rounded-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:text-blue-300 transition-colors"
          >
            {loading ? "Đang gửi..." : "Gửi"}
            {!loading && (
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
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comment;