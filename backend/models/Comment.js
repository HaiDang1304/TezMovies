import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true },
    text: { type: String, required: true },
    user: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
      name: { type: String, required: true },
      email: { type: String },
      picture: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
