// ReplyItem.js
import React, { useState } from 'react';
import axios from 'axios';

const ReplyItem = ({ reply, user, onReplyAdded, level = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = async () => {
    if (!replyText.trim() || !user) {
      alert('Vui lòng đăng nhập và nhập nội dung');
      return;
    }

    try {
      const response = await axios.post('/api/replies', { // ✅ Dùng relative URL
        commentId: reply.commentId,
        parentReplyId: reply._id,
        text: replyText.trim()
      }, {
        withCredentials: true
      });

      if (response.data.status) {
        console.log('✅ Nested reply added');
        onReplyAdded(reply._id, response.data.reply);
        setReplyText('');
        setShowReplyForm(false);
      }
    } catch (error) {
      console.error('❌ Error adding nested reply:', error);
      alert(error.response?.data?.msg || 'Lỗi khi gửi phản hồi');
    }
  };

  return (
    <div className={`${level > 2 ? 'ml-2' : 'ml-4'} border-l-2 border-gray-600 pl-3 py-2`}>
      <div className="flex items-start gap-2">
        <img 
          src={reply.user?.picture || '/default-avatar.png'} 
          alt={reply.user?.name || 'User'}
          className="w-6 h-6 rounded-full flex-shrink-0"
          onError={(e) => {
            e.target.src = "/default-avatar.png";
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="bg-gray-700 rounded-lg p-2">
            <p className="font-medium text-blue-300 text-xs mb-1">
              {reply.user?.name || 'User'}
              {reply.parentUser && (
                <span className="text-gray-400">
                  {' → '}{reply.parentUser.name}
                </span>
              )}
            </p>
            <p className="text-white text-sm">{reply.text}</p>
            <small className="text-gray-400 text-xs">
              {new Date(reply.createdAt).toLocaleString('vi-VN')}
            </small>
          </div>
          
          {user && level < 3 && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-yellow-400 hover:text-yellow-300 mt-1"
            >
              {showReplyForm ? 'Hủy' : 'Trả lời'}
            </button>
          )}

          {showReplyForm && (
            <div className="mt-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-2 text-sm bg-gray-600 text-white rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Trả lời ${reply.user?.name || 'user'}...`}
                rows="2"
              />
              <div className="flex gap-2 mt-1">
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Gửi
                </button>
                <button
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyText('');
                  }}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Nested replies */}
          {Array.isArray(reply.replies) && reply.replies.length > 0 && (
            <div className="mt-2 space-y-1">
              {reply.replies.map((nestedReply) => (
                <ReplyItem
                  key={nestedReply._id}
                  reply={nestedReply}
                  user={user}
                  onReplyAdded={onReplyAdded}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReplyItem;