
export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
    if (!isOpen) return null;
    const handleSwitchToLogin = () => {
        onSwitchToLogin(); // Chuyển sang modal đăng nhập
    };

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] transition-opacity duration-300"
            />
            {/* Modal container */}
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                bg-gradient-to-br from-[#1E1E3F] to-[#2A2A4A] rounded-2xl w-full max-w-[480px] sm:max-w-[640px] lg:max-w-[800px]
                z-[1001] flex overflow-hidden shadow-2xl transition-all duration-300"
            >
                {/* Banner trái */}
                <div className="hidden sm:block sm:w-48 lg:w-64 relative">
                    <div
                        className="absolute inset-0 bg-center bg-cover filter brightness-75 transition-all duration-300"
                        style={{ backgroundImage: "url('/bannerlogin.png')" }}
                    />
                </div>

                {/* Form đăng ký */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col text-white">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Đăng ký</h2>
                        <button
                            onClick={onClose}
                            className="text-white text-3xl font-bold hover:text-gray-300 transition-transform duration-200 hover:scale-110"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>
                    </div>

                    {/* Mô tả */}
                    <p className="text-sm sm:text-base text-gray-300 mb-6">
                        Đã có tài khoản ? {" "}
                        <button
                            onClick={handleSwitchToLogin}
                            className="text-[#FFD369]  hover:text-yellow-300 hover:opacity-80 transition-transform duration-150 transform hover:scale-105 cursor-pointer"
                        >
                            Đăng Nhập Ngay
                        </button>
                    </p>

                    {/* Họ và tên */}
                    <input
                        type="text"
                        placeholder="Họ và tên"
                        className="mb-4 px-4 py-3 rounded-lg border border-gray-600 bg-[#2A2A4A]/80 text-white text-base focus:outline-none focus:ring-2 focus:ring-[#FFD369] transition-all duration-200"
                    />

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Email"
                        className="mb-4 px-4 py-3 rounded-lg border border-gray-600 bg-[#2A2A4A]/80 text-white text-base focus:outline-none focus:ring-2 focus:ring-[#FFD369] transition-all duration-200"
                    />

                    {/* Mật khẩu */}
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        className="mb-4 px-4 py-3 rounded-lg border border-gray-600 bg-[#2A2A4A]/80 text-white text-base focus:outline-none focus:ring-2 focus:ring-[#FFD369] transition-all duration-200"
                    />

                    {/* Xác nhận mật khẩu */}
                    <input
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                        className="mb-6 px-4 py-3 rounded-lg border border-gray-600 bg-[#2A2A4A]/80 text-white text-base focus:outline-none focus:ring-2 focus:ring-[#FFD369] transition-all duration-200"
                    />

                    {/* Nút đăng ký */}
                    <button
                        className="mb-6 bg-[#FFD369] rounded-lg py-3 font-semibold text-gray-900 hover:bg-yellow-300 transition-all duration-200 w-full shadow-md hover:shadow-lg"
                    >
                        Đăng ký
                    </button>

                    {/* Điều khoản sử dụng */}
                    <p className="text-xs text-gray-400 text-center mb-6">
                        Bằng việc đăng ký, bạn đồng ý với{" "}
                        <a href="#" className="text-[#FFD369] hover:text-yellow-300 transition-colors duration-200">
                            Điều khoản sử dụng
                        </a>{" "}
                        và{" "}
                        <a href="#" className="text-[#FFD369] hover:text-yellow-300 transition-colors duration-200">
                            Chính sách bảo mật
                        </a>
                    </p>

                </div>
            </div>
        </>
    );
}