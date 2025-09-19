import express from "express";
import Comment from "../models/Comment.js";


const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { slug, text } = req.body;
    if (!slug || !text) {
      return res.status(400).json({ status: false, msg: "Missing fields" });
    }

    if (!req.user) {
      return res
        .status(401)
        .json({
          status: false,
          msg: "Bạn phải đăng nhập mới có thể bình luận !!",
        });
    }

    // const user = req.user
    //   ? {
    //       id: req.user._id,
    //       name: req.user.name,
    //       email: req.user.email,
    //       picture: req.user.picture,
    //     }
    //   : { name: "Khách" };
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
    res.json({ status: true, msg: "Comment saved", comment: newComment });
  } catch (err) {
    console.error("Lỗi cmt:", err);
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
    console.error("Lỗi lấy cmt:", err);
    res
      .status(500)
      .json({ status: false, msg: "Server error", error: err.message });
  }
});

router.post("/:id/reply", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ status: false, msg: "Missing text" });
    }

    if (!req.user) {
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

    res.json({ status: true, msg: "Reply added", reply });
  } catch (err) {
    console.error("Lỗi reply:", err);
    res
      .status(500)
      .json({ status: false, msg: "Server error", error: err.message });
  }
});



export default router;
