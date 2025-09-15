import express from "express";
import Comment from "../models/Comment.js";

const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     const { slug, user, text } = req.body;
//     console.log("Received comment data:", { slug, user, text });
//     console.log("Request body:", req.body);

//     if (!slug || !user || !text) {
//       return res.status(400).json({ status: false, msg: "Missing fields" });
//     }

//     const newComment = new Comment({
//       slug,
//       user: req.user ? req.user._id : null,
//       guestName: req.user ? req.user.name : "Khách",
//       text,
//       createdAt: new Date(),
//     });

//     await newComment.save();
//     res.json({ status: true, msg: "Comment saved", comment: newComment });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ status: false, msg: "Server error", error: err.message });
//   }
// });
router.post("/", async (req, res) => {
  try {
    const { slug, text } = req.body;

    if (!slug || !text) {
      return res.status(400).json({ status: false, msg: "Missing fields" });
    }

    let userData = req.session.user; // lấy từ session

    const newComment = new Comment({
      slug,
      user: userData ? userData.id : null,
      guestName: userData ? userData.name : "Khách",
      text,
      createdAt: new Date(),
    });

    await newComment.save();
    res.json({ status: true, msg: "Comment saved", comment: newComment });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, msg: "Server error", error: err.message });
  }
});


export default router;
