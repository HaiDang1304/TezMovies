import express from "express";
import ReplyComment from "../models/ReplyComment.js";
import Comment from "../models/Comment.js";

const router = express.Router();

// Middleware để set req.user từ session
const setUserFromSession = (req, res, next) => {
  console.log("🔍 Reply auth check:");
  console.log("  - Session ID:", req.sessionID);
  console.log("  - Session user:", req.session?.user);
  console.log("  - Passport user:", req.user);
  
  // Nếu có session user nhưng chưa có req.user
  if (req.session?.user && !req.user) {
    req.user = {
      _id: req.session.user.id,
      name: req.session.user.name,
      email: req.session.user.email,
      picture: req.session.user.picture
    };
    console.log("✅ Set req.user from session for reply:", req.user.name);
  }
  
  next();
};

// Áp dụng middleware cho tất cả routes
router.use(setUserFromSession);

// Thêm reply vào comment hoặc reply khác
router.post("/", async (req, res) => {
  try {
    const { commentId, parentReplyId, text } = req.body;
    console.log("💬 New reply attempt:", { 
      commentId, 
      parentReplyId, 
      text: text?.substring(0, 50) + "...",
      user: req.user?.name 
    });
    
    if (!text || !commentId) {
      return res.status(400).json({ status: false, msg: "Missing fields" });
    }

    if (!req.user) {
      console.log("❌ No user found for reply");
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
      console.log("📝 Reply to:", parentUser.name);
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
    console.log("✅ Reply saved successfully");
    res.json({ status: true, msg: "Reply added", reply });
  } catch (err) {
    console.error("❌ Reply error:", err);
    res
      .status(500)
      .json({ status: false, msg: "Server error", error: err.message });
  }
});

// Lấy toàn bộ reply theo commentId (dạng cây)
router.get("/:commentId", async (req, res) => {
  try {
    console.log("📖 Getting replies for comment:", req.params.commentId);
    
    const replies = await ReplyComment.find({
      commentId: req.params.commentId,
    }).sort({ createdAt: 1 });

    console.log(`📊 Found ${replies.length} replies`);

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

    const tree = buildTree();
    res.json({ status: true, replies: tree });
  } catch (err) {
    console.error("❌ Get replies error:", err);
    res
      .status(500)
      .json({ status: false, msg: "Server error", error: err.message });
  }
});

export default router;