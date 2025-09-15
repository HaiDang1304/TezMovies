import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  slug: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, 
  guestName: { type: String, default: "Khách" },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

commentSchema.pre(/^find/, function(next) {
    this.populate("user","name picture email");
    next();
});

export default mongoose.model("Comment", commentSchema);
