import cloudinary from "../config/cloudinary.js";

/**
 * Upload avatar Google lên Cloudinary
 * @param {string} url - URL ảnh Google
 * @param {string} userId - ID user để đặt tên file
 * @returns {Promise<string>} - URL Cloudinary để lưu vào DB
 */
export async function uploadAvatar(url, userId) {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: "avatars",        // Tạo folder "avatars" trong Cloudinary
      public_id: userId,        // Đặt tên file theo userId
      overwrite: true,          // Nếu đã có thì ghi đè
    });
    return result.secure_url;   // URL ảnh trả về (https)
  } catch (err) {
    console.error("Lỗi upload avatar:", err.message);
    return "/default-avatar.png";
  }
}
