import express from "express";
import ReplyComment from "../models/ReplyComment.js";
import Comment from "../models/Comment.js";

const router = express.Router();

// Thêm reply vào comment hoặc reply khác
router.post("/", async (req, res) => {
  try {
    const { commentId, parentReplyId, text } = req.body;
    if (!text || !commentId) {
      return res.status(400).json({ status: false, msg: "Missing fields" });
    }

    if (!req.user) {
      return res.status(401).json({
        status: false,
        msg: "Bạn phải đăng nhập mới có thể trả lời !!",
      });
    }

    let parentUser = null;
    if (parentReplyId) {
      const parent = await ReplyComment.findById(parentReplyId);
      if (!parent) {
        return res
          .status(404)
          .json({ status: false, msg: "Parent reply not found" });
      }
      parentUser = parent.user; // lưu toàn bộ user cha
    }

    const reply = new ReplyComment({
      commentId,
      parentReply: parentReplyId || null,
      parentUser, // gán object luôn
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        picture: req.user.picture,
      },
      text,
    });

    await reply.save();
    res.json({ status: true, msg: "Reply added", reply });
  } catch (err) {
    console.error("Lỗi reply:", err);
    res
      .status(500)
      .json({ status: false, msg: "Server error", error: err.message });
  }
});

// Lấy toàn bộ reply theo commentId (dạng cây)
router.get("/:commentId", async (req, res) => {
  try {
    const replies = await ReplyComment.find({
      commentId: req.params.commentId,
    }).sort({ createdAt: 1 });

    const buildTree = (parentId = null) => {
      return replies
        .filter((r) =>
          parentId
            ? r.parentReply?.toString() === parentId.toString()
            : !r.parentReply
        )
        .map((r) => ({
          ...r.toObject(),
          replies: buildTree(r._id),
        }));
    };

    res.json({ status: true, replies: buildTree() });
  } catch (err) {
    console.error("Lỗi lấy reply:", err);
    res
      .status(500)
      .json({ status: false, msg: "Server error", error: err.message });
  }
});

export default router;
