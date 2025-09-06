const API_URL = import.meta.env.VITE_API_URL;

export async function getUser() {
  const res = await fetch(`https://tezmovies.onrender.com/api/user`, {
    credentials: "include", // để session cookie hoạt động với cookie của backend
  });
  if (!res.ok) {
    throw new Error("Không thể lấy thông tin user");
  }
  return res.json();
}
