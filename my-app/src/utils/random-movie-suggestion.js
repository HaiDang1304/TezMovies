export function getRandomItem(arr) {
  if (arr.length === 0) {
    throw new Error("Mảng không được rỗng.");
  }

  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}