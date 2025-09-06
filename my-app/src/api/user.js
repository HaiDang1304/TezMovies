const API_URL = import.meta.env.VITE_API_URL;

export async function getUser() {
  const res = await fetch(`${API_URL}/api/user`, {
    method: "GET",
    credentials: "include", // bắt buộc để gửi cookie session
  });
  if (!res.ok) {
    throw new Error("Không thể lấy thông tin user");
  }
  return res.json();
}
