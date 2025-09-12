import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { movieId, userId, content } = req.body;

    if (!movieId || !userId || !content) {
      return res.status(400).json({ message: "Thiếu dữ liệu!" });
    }

    const newComment = new Comment({ movieId, userId, content });
    await newComment.save();

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  lấy comment theo movieId
router.get("/:movieId", async (req, res) => {
  try {
    const comments = await Comment.find({ movieId: req.params.movieId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;