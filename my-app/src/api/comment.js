import express from "express";
import Comment from "../models/Comment.js";
const router = express.Router();

// Lấy danh sách comment theo movieId
router.get("/:movieId", async (req, res) => {
  try {
    const comments = await Comment.find({ movieId: req.params.movieId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Thêm comment mới
router.post("/", async (req, res) => {
  try {
    const { movieId, user, text } = req.body;
    const newComment = new Comment({ movieId, user, text });
    await newComment.save();
    res.json(newComment);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
