// // database.js
// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/tezmovies");
//     console.log("✅ MongoDB connected");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   }
// };

// export default connectDB;

// database.js
// database.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "tezmovies", // Atlas sẽ tạo nếu chưa có
    });
    console.log("✅ MongoDB Atlas connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;

