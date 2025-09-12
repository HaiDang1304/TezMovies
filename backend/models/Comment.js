import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  content: { type: String, required: true , maxlength: 500},
  createdAt: { type: Date, default: Date.now }
});

CommentSchema.pre(/^find/, function(next) {
    this.populate("userId","name picture email");
    next();
});

export default mongoose.model("Comment", CommentSchema);
