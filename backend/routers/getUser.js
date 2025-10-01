import express from "express";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/authMiddleware.js"

const router = express.Router();

router.get("/profile",authenticateToken, async (req, res) => {
    console.log("🔍 /profile hit | user:", req.user);
        try{
            const userId = req.user._id;
            const user = await User.findById(userId).select("-password");
            res.json(user);
        }catch(err){
            res.status(500).json({message: "Server Error"});
        }
});

export default router;
