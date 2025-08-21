import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const gradients = [
    "linear-gradient(135deg, #ff0080, #ff8c00)",
    "linear-gradient(135deg, #00f5a0, #00d9f5)",
    "linear-gradient(135deg, #8a2be2, #ff00ff)",
    "linear-gradient(135deg, #ff4e50, #f9d423)",
    "linear-gradient(135deg, #00c6ff, #0072ff)",
    "linear-gradient(135deg, #f953c6, #b91d73)",
    "linear-gradient(135deg, #ff9966, #ff5e62)"
];

const TopicPagex = () => {
    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        axios
            .get("https://phimapi.com/the-loai")
            .then(res => {
                setCategoryList(res.data);
            })
            .catch(err => console.error("Lỗi khi fetch thể loại:", err));
    }, []);

    return (
        <div className="p-8 mt-10">
            <h2 className="text-2xl font-bold mb-4">Khám Phá Thế Giới Phim</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 ">
                {categoryList.map((cat, i) => (
                    <Link
                        key={cat.id}
                        to={`/the-loai/${cat.slug}`}
                        className="rounded-lg text-white p-8 cursor-pointer hover:opacity-80 transition-transform duration-300 transform hover:scale-105 "
                        style={{ background: gradients[i % gradients.length] }}
                    >
                        {cat.slug !== "18" && (
                            <h3 className="text-lg font-bold">{cat.name}</h3>
                        )}

                        <p className="text-md font-medium ">Xem chi tiết</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TopicPagex;
