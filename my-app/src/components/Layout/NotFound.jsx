import { Link } from "react-router-dom";

const NotFound = () => {
    return (<section className="bg-transparent text-gray-50 min-h-screen flex items-center justify-center">
        <div className="py-8 px-4 mx-auto max-w-lg">
            <div className="text-center">
                <h1 className="mb-4 text-xl tracking-tight font-bold text-white md:text-3xl">
                    Lỗi 404 - Không tìm thấy trang
                </h1>
                <p className="mb-4 text-md font-light text-gray-200">
                    Trang bạn đang tìm kiếm không tồn tại. Vui lòng kiểm tra đường dẫn
                    hoặc quay về trang chủ.
                </p>
                <Link to="/">
                    <button
                        size="xl"
                        className="rounded-full bg-amber-400 linear-gradient mt-6 border text-gray-900 px-2 py-2 hover:bg-amber-300 hover:border-amber-200 hover:text-white"
                    >
                        Về trang chủ
                    </button>
                </Link>
            </div>
        </div>
    </section>
    );
}

export default NotFound;