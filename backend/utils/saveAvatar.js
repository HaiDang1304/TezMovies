import axios from "axios";
import fs from "fs";
import path from "path";

/**
 * Tải avatar từ URL và lưu vào public/avatars
 * @param {string} url - URL avatar Google
 * @param {string} userId - id của user (dùng làm tên file)
 * @returns {string} - URL public để lưu vào database
 */
export async function saveAvatar(url, userId) {
  try {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    const filePath = path.join(__dirname, "../public/avatars", `${userId}.jpg`);
    fs.writeFileSync(filePath, res.data);
    return `/avatars/${userId}.jpg`; // URL public
  } catch (err) {
    console.error("Lỗi tải avatar:", err.message);
    return "/default-avatar.png"; // fallback
  }
}
