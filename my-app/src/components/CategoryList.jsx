import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryCard from "./CateGoryCard.jsx";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("https://phimapi.com/the-loai")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Lỗi lấy thể loại", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-6 m-auto">
      <h2 className="text-2xl text-white font-bold max-w-7xl mx-auto px-4 mb-4">Bạn đang quan tâm gì?</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mx-auto max-w-7xl  ">
        {categories.slice(0, 7).map((category, idx) => (
          <CategoryCard key={category.slug} category={category} index={idx} />
        ))}
        {categories.length > 7 && (
          <div
            onClick={() => alert("Chuyển tới danh sách đầy đủ")}
            className="rounded-lg text-white p-4 cursor-pointer bg-gray-600 hover:opacity-80 transition"
          >
            <h3 className="text-lg font-bold">+{categories.length - 7} chủ đề</h3>
            <p className="text-sm mt-2">Xem thêm</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
