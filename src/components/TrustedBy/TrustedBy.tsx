import { useEffect, useState } from 'react'

// Danh sách Logo (Nhân bản để demo hiệu ứng chạy)
const PARTNER_LOGOS = [
    'https://ik.imagekit.io/tvlk/image/imageResource/2023/06/13/1686627790690-7ea3ee26cb9f3737c4fddf7315ec2517.png?tr=h-25,q-75',
    'https://ik.imagekit.io/tvlk/image/imageResource/2023/06/13/1686627795821-b7a62e0084b1bd545b0ad7d3a4e454e5.png?tr=h-25,q-75',
    'https://ik.imagekit.io/tvlk/image/imageResource/2023/06/13/1686627803111-12b2e6b401b049f4c9d04e635d935b61.png?tr=h-25,q-75',
    'https://ik.imagekit.io/tvlk/image/imageResource/2025/03/18/1742281617235-6d7d971115c1207b1b06a37420356647.jpeg?tr=h-25,q-75',
    'https://ik.imagekit.io/tvlk/image/imageResource/2023/06/13/1686627817005-9c5c70219dd7cafb8838d08da8d71d1f.png?tr=h-25,q-75',
    // Thêm logo để loop

    'https://t3.ftcdn.net/jpg/04/85/88/18/360_F_485881813_one22FVyqurVBHJcKTts2nsHwHUNXM7N.jpg',
    'https://ibrand.vn/wp-content/uploads/2024/10/Logo-vietjet-1.jpg',
    'https://ik.imagekit.io/tvlk/image/imageResource/2023/06/13/1686627803111-12b2e6b401b049f4c9d04e635d935b61.png?tr=h-25,q-75',
    'https://quatangphuongtrinh.com/public/uploads/images/bai-viet/Bo-nhan-dien-thuong-hieu-cua-vietnam-airlines-niem-tu-hao-cua-quoc-gia/slogan-cua-vietnam-airlines.jpg',
    'https://upload.wikimedia.org/wikipedia/vi/thumb/5/58/Thai_Airways_Logo.svg/1280px-Thai_Airways_Logo.svg.png'
]

export default function TrustedBy() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const visibleCount = 5 // Số logo hiển thị cùng lúc

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % PARTNER_LOGOS.length)
        }, 5000) // Chuyển động mỗi 2 giây

        return () => clearInterval(interval)
    }, [])

    // Tính toán danh sách logo hiển thị (có tính chất vòng lặp)
    const visibleLogos = []
    for (let i = 0; i < visibleCount; i++) {
        visibleLogos.push(PARTNER_LOGOS[(currentIndex + i) % PARTNER_LOGOS.length])
    }

    return (
        <div className='flex items-center rounded-md bg-white/95 backdrop-blur-sm w-[380px] h-[48px] mx-auto mt-6 gap-3 px-4 py-2 shadow-sm border border-white/20'>
            <p className='text-[12px] font-bold w-auto opacity-60 italic text-gray-600 whitespace-nowrap'>Trusted by</p>
            <div className='flex-1 overflow-hidden'>
                <div className='flex items-center justify-between h-full gap-2 animate-fade-in'>
                    {visibleLogos.map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt='Partner'
                            // SỬA: Xóa 'grayscale' và 'opacity-80' để hiện màu gốc
                            className='h-5 w-auto object-contain transition-all duration-300'
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
