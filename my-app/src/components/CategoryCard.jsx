import React from "react";
import { useNavigate } from "react-router-dom";

const colors = [
  "bg-blue-500", "bg-purple-400", "bg-green-500",
  "bg-indigo-400", "bg-orange-400", "bg-red-400", "bg-gray-700"
];
const displayNames = {
  "hanh-dong": "Hành Động",
  "mien-tay": "Miền Viễn Tây",
  "tre-em": "Hoạt Hình",
  "lich-su": "Lịch Sử",
  "co-trang": "Cổ Trang",
  "chien-tranh": "Chiến Tranh",
  "vien-tuong": "Viễn Tưởng",
  "kinh-di": "Kinh Dị",
};

const CategoryCard = ({ category, index }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/the-loai/${category.slug}`);
  };


  return (
    <div
      className={`rounded-lg text-white p-4 cursor-pointer ${colors[index % colors.length]} hover:opacity-80 transition`}
      onClick={handleClick}
    >
      <h3 className="text-lg font-bold">{displayNames[category.slug]||category.className}</h3>
      <p className="text-sm mt-2">Xem chủ đề &rarr;</p>
    </div>
  );
};

export default CategoryCard;
