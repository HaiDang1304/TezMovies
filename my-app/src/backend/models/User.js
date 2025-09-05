import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String,
  picture: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
