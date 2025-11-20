import React, { useState, useCallback } from 'react'
import { faCopy, faTicket, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify' // Import toast

// Giả sử import đúng
import { promotionApi } from '~/apis/promotion.api'
import { formatCurrencyVND } from '~/utils/utils' // Đổi tên thành formatCurrencyVND cho nhất quán
import { Promotion as PromotionType } from '~/types/promotion'

// Component Skeleton (để hiển thị khi loading)
const PromotionSkeleton: React.FC = () => (
    <div className='col-span-4'>
        <div className='rounded-lg w-full h-[280px] shadow-md bg-white border border-gray-200 animate-pulse'>
            <div className='h-[100px] rounded-t-lg bg-gray-200'></div>
            <div className='p-4 space-y-3'>
                <div className='h-5 bg-gray-200 rounded w-1/2'></div>
                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                <div className='h-10 bg-gray-100 rounded-lg mt-4'></div>
            </div>
        </div>
    </div>
)

export default function Promotion() {
    const [copiedCode, setCopiedCode] = useState<string | null>(null)

    // 1. SỬA LỖI LOGIC: Thêm .then() và lấy data, isLoading, isError
    const {
        data: dataPromotion,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['promotions'],
        queryFn: () => promotionApi.getPromotion().then((res) => res.data),
        staleTime: 1000 * 60 * 5 // Cache 5 phút
    })

    // 2. SỬA LỖI LOGIC: Truy cập đúng vào mảng data
    const promotions = dataPromotion?.data || []

    const formatDate = (dateString: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    // 3. THÊM LOGIC: Xử lý sao chép
    const handleCopy = useCallback((code: string) => {
        navigator.clipboard.writeText(code).then(
            () => {
                toast.success(`Đã sao chép mã: ${code}`)
                setCopiedCode(code)
                // Reset trạng thái "Đã sao chép" sau 2 giây
                setTimeout(() => setCopiedCode(null), 2000)
            },
            (err) => {
                toast.error('Sao chép thất bại')
                console.error('Không thể sao chép: ', err)
            }
        )
    }, [])

    return (
        <div>
            <div className='max-w-[1278px] mx-auto py-8 px-4'>
                <h1 className='text-3xl font-semibold text-gray-900 text-center mb-8'>Thông tin khuyến mãi</h1>

                {/* 4. THÊM LOGIC: Xử lý Loading */}
                {isLoading && (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                        <PromotionSkeleton />
                        <PromotionSkeleton />
                        <PromotionSkeleton />
                    </div>
                )}

                {/* 5. THÊM LOGIC: Xử lý Lỗi */}
                {isError && (
                    <div className='text-center p-10 bg-red-50 border border-red-200 rounded-lg'>
                        <FontAwesomeIcon icon={faExclamationTriangle} className='text-red-500 text-3xl mb-3' />
                        <p className='font-semibold text-red-700'>Không thể tải danh sách khuyến mãi.</p>
                        <p className='text-sm text-red-600'>Vui lòng thử tải lại trang.</p>
                    </div>
                )}

                {/* 6. THÊM LOGIC: Xử lý Rỗng */}
                {!isLoading && !isError && promotions.length === 0 && (
                    <div className='text-center p-10 bg-gray-50 border border-gray-200 rounded-lg'>
                        <p className='font-semibold text-gray-600'>Hiện tại không có khuyến mãi nào.</p>
                    </div>
                )}

                {/* 7. SỬA UI: Giao diện Card mới */}
                {!isLoading && !isError && promotions.length > 0 && (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                        {promotions.map((promotion: PromotionType) => (
                            <div className='col-span-1' key={promotion.promotion_id}>
                                {/* Thẻ Card */}
                                <div className='rounded-lg w-full shadow-lg border border-gray-200 bg-white flex flex-col overflow-hidden h-full'>
                                    {/* Header Card (Màu xanh) */}
                                    <div className='w-full p-4 bg-blue-600 text-white flex items-center gap-4'>
                                        <FontAwesomeIcon icon={faTicket} className='text-4xl opacity-80' />
                                        <div>
                                            <p className='text-[13px] font-medium opacity-90'>Giảm</p>
                                            <b className='text-3xl font-bold'>
                                                {promotion?.discount_amount as number > 0
                                                    ? formatCurrencyVND(promotion?.discount_amount as number * 1000) // 50.00 -> 50,000 ₫
                                                    : `${promotion.discount_percentage}%`}
                                            </b>
                                        </div>
                                    </div>

                                    {/* Body Card (Thông tin) */}
                                    <div className='p-4 flex flex-col flex-grow'>
                                        <p className='text-sm text-gray-500 mb-1'>Mã: {promotion.code}</p>
                                        <h2 className='text-lg font-semibold text-gray-900 mb-2'>
                                            {promotion.description}
                                        </h2>
                                        <p className='text-xs text-gray-500 mt-auto'>
                                            Hạn sử dụng:
                                            <span className='font-medium text-gray-600 ml-1'>
                                                {formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Footer Card (Nút Copy) */}
                                    <div className='p-4 bg-gray-50 border-t border-gray-100'>
                                        <div className='flex items-center gap-2'>
                                            {/* Mã code */}
                                            <div className='flex-grow h-10 border-2 border-dashed border-gray-300 rounded-md bg-white flex items-center justify-center'>
                                                <p className='text-base text-gray-800 font-bold tracking-wider'>
                                                    {promotion.code}
                                                </p>
                                            </div>
                                            {/* Nút copy */}
                                            <button
                                                onClick={() => handleCopy(promotion?.code as string)}
                                                className={`w-28 h-10 rounded-md font-semibold text-white transition-colors duration-200 flex items-center justify-center gap-2 ${
                                                    copiedCode === promotion.code
                                                        ? 'bg-green-500' // Trạng thái đã copy
                                                        : 'bg-blue-500 hover:bg-blue-600' // Trạng thái bình thường
                                                }`}
                                            >
                                                {copiedCode === promotion.code ? (
                                                    'Đã chép'
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon={faCopy} className='w-4 h-4' />
                                                        Sao chép
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* XÓA BỎ: Phần tag airline cứng */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
