import React from "react";
import { useNavigate } from "react-router-dom";

const gradients = [
  "linear-gradient(135deg, #ff0080, #ff8c00)", // hồng → cam
  "linear-gradient(135deg, #00f5a0, #00d9f5)", // xanh neon
  "linear-gradient(135deg, #8a2be2, #ff00ff)", // tím → hồng neon
  "linear-gradient(135deg, #ff4e50, #f9d423)", // đỏ → vàng
  "linear-gradient(135deg, #00c6ff, #0072ff)", // xanh đậm → xanh nhạt
  "linear-gradient(135deg, #f953c6, #b91d73)", // hồng đậm → tím
  "linear-gradient(135deg, #ff9966, #ff5e62)"  // cam → đỏ
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
      className={`rounded-sm text-white p-4 cursor-pointer hover:opacity-80 transition`}
      style={{background: gradients [index % gradients.length]}}
      onClick={handleClick}
    >
      <h3 className="text-lg font-bold">{displayNames[category.slug]||category.className}</h3>
      <p className="text-sm mt-2">Xem chủ đề &rarr;</p>
    </div>
  );
};

export default CategoryCard;
