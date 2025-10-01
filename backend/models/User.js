import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  gender: { type: String, enum: ["male", "female", "other"], default: "other" },
  picture: { type: String },
  isVerified: { type: Boolean, default: false }, 
  verificationToken: { type: String },           
}, { timestamps: true });

export default mongoose.model("User", userSchema);
