import mongoose from "mongoose";

const ReplyScheme = new mongoose.Schema(
  {
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    }, // reply comment gốc

    parentReply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReplyComment",
      default: null,
    }, // reply trong reply

    parentUser: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      name: { type: String },
      email: { type: String },
      picture: { type: String },
    }, // lưu full thông tin user cha luôn

    user: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: { type: String, required: true },
      email: { type: String },
      picture: { type: String },
    },

    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ReplyComment", ReplyScheme);
