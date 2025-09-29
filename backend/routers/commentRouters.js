import express from "express";
import Comment from "../models/Comment.js";

const router = express.Router();

// Middleware để set req.user từ session
const setUserFromSession = (req, res, next) => {
  console.log("🔍 Comment auth check:");
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
    console.log("✅ Set req.user from session:", req.user.name);
  }
  
  next();
};

// Áp dụng middleware cho tất cả routes
router.use(setUserFromSession);

router.post("/", async (req, res) => {
  try {
    const { slug, text } = req.body;
    console.log("💬 New comment attempt:", { slug, text: text?.substring(0, 50) + "..." });
    console.log("👤 Current user:", req.user);
    
    if (!slug || !text) {
      return res.status(400).json({ status: false, msg: "Missing fields" });
    }

    if (!req.user) {
      console.log("❌ No user found for comment");
      return res
        .status(401)
        .json({
          status: false,
          msg: "Bạn phải đăng nhập mới có thể bình luận !!",
        });
    }

    const user = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      picture: req.user.picture,
    };

    const newComment = new Comment({
      slug,
      text,
      user,
    });
   
    await newComment.save();
    console.log("✅ Comment saved successfully");
    res.json({ status: true, msg: "Comment saved", comment: newComment });
  } catch (err) {
    console.error("❌ Comment error:", err);
    res
      .status(500)
      .json({ status: false, msg: "Server error", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { slug } = req.query;
    if (!slug) {
      return res.status(400).json({ status: false, msg: "Missing slug" });
    }
    const comments = await Comment.find({ slug })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ status: true, comments });
  } catch (err) {
    console.error("❌ Get comments error:", err);
    res
      .status(500)
      .json({ status: false, msg: "Server error", error: err.message });
  }
});

router.post("/:id/reply", async (req, res) => {
  try {
    const { text } = req.body;
    console.log("💬 New reply attempt:", { commentId: req.params.id, text: text?.substring(0, 50) + "..." });
    console.log("👤 Current user:", req.user);
    
    if (!text) {
      return res.status(400).json({ status: false, msg: "Missing text" });
    }

    if (!req.user) {
      console.log("❌ No user found for reply");
      return res
        .status(401)
        .json({ status: false, msg: "Bạn phải đăng nhập mới có thể trả lời !!" });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ status: false, msg: "Comment not found" });
    }

    const reply = {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        picture: req.user.picture,
      },
      text,
    };

    comment.replies.push(reply);
    await comment.save();

    console.log("✅ Reply saved successfully");
    res.json({ status: true, msg: "Reply added", reply });
  } catch (err) {
    console.error("❌ Reply error:", err);
    res
      .status(500)
      .json({ status: false, msg: "Server error", error: err.message });
  }
});

export default router;