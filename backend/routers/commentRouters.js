import express from "express";
import Comment from "../models/Comment.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { slug, text } = req.body;

    if (!slug || !text) {
      return res.status(400).json({ status: false, msg: "Missing fields" });
    }

    const user = req.user ? req.user.name : "Khách";

    const newComment = new Comment({
      slug,
      text,
      user: userId, 
    });
    await newComment.save();
    console.log("USERRR:", user);
    res.json({ status: true, msg: "Comment saved", comment: newComment });
  } catch (err) {
    console.error("Lỗi cmt:", err);
    res
      .status(500)
      .json({ status: false, msg: "Server error", error: err.message });
  }
});

export default router;
