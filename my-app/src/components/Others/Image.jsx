import { useEffect, useState } from "react"
import Loading from "../Layout/Loading"

const Image = ({ orientation = "vertical",pbValueDefault ,rounded = "2xl", className = " ", ...props }) => {

    const [statusImg, setStatusImg] = useState("loading")

    const pbValue =
        orientation === "vertical"
            ? "pb-[150%]" // dọc
            : orientation === "horizontal"
                ? "pb-[56.25%]" // ngang (16:9)
                : pbValueDefault || "pb-[62%]"

    const roundeds = {
        "none": "rounded-none",
        "sm": " rounded-sm",
        "md": " rounded-md",
        "lg": "rounded-lg",
        "xl": "rounded-xl",
        "2xl": " rounded-2xl"
    }
    useEffect(() => {
        // Tạo một đối tượng ảnh ẩn mới
        const img = new window.Image()

        // Khi ảnh tải thành công → cập nhật trạng thái thành "success"
        img.onload = () => setStatusImg("success")

        // Khi ảnh bị lỗi (sai link, không tồn tại,...) → cập nhật trạng thái thành "error"
        img.onerror = () => setStatusImg("error")

        // Gán link ảnh để bắt đầu tải ảnh
        img.src = props.src

        // useEffect sẽ chạy lại nếu props.src thay đổi (tức ảnh mới được truyền vào)
    }, [props.src])


    const getImgSrc = (status) => {
        if (status === "loading")
            return "/placeholder.webp"
        if (status === "error")
            return "/notfound.webp"
        return props.src
    }


    return (<div className={`relative ${pbValue}`}>
        <img {...props} src={getImgSrc(statusImg)} loading="lazy" className={`absolute inset-0 w-full h-full object-cover block ${roundeds[rounded]} ${className ? className : ""}`} />

    </div>);
}

export default Image;