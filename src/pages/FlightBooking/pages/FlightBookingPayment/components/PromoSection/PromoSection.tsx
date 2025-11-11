// src/components/PromoSection/PromoSection.tsx

import  { useState } from 'react'
import { toast } from 'react-toastify'
import { Promotion } from '~/types/promotion' // 1. Import kiểu Promotion

interface PromoSectionProps {
    promotions: Promotion[] // 2. Sử dụng kiểu dữ liệu mới
    isLoading: boolean // Thêm prop isLoading
    appliedPromoId: string | null
    onApplyPromo: (promoCode: string) => boolean
    onRemovePromo: () => void
}

const formatDiscount = (promo: Promotion): string => {
    if (promo.discount_percentage > 0) {
        return `Giảm ${promo.discount_percentage}%`
    }
    if (promo.discount_amount > 0) {
        // Giả sử API lưu 50 = 50,000 VND, 100 = 100,000 VND
        const amount = promo.discount_amount * 1000
        return `Giảm ${amount.toLocaleString('vi-VN')} VND`
    }
    return promo.description // Fallback
}

export default function PromoSection({
    promotions,
    isLoading,
    appliedPromoId,
    onApplyPromo,
    onRemovePromo
}: PromoSectionProps) {
    const [promoCode, setPromoCode] = useState('')

    const handleApply = () => {
        if (!promoCode) {
            toast.error('Vui lòng nhập mã khuyến mãi')
            return
        }
        const success = onApplyPromo(promoCode)
        if (success) {
            toast.success('Áp dụng mã thành công!')
        }
        // Không cần toast error ở đây nữa vì handleApplyPromo (cha) đã làm
    }

    // Lấy chi tiết của mã đã áp dụng
    const appliedPromoDetails = promotions.find((p) => p.code.toUpperCase() === appliedPromoId?.toUpperCase())

    return (
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 mt-5'>
            <h2 className='text-lg font-semibold p-4 border-b border-gray-200'>Mã giảm giá & Khuyến mãi</h2>

            {/* 3. Xử lý trạng thái Loading */}
            {isLoading && (
                <div className='p-4 space-y-2'>
                    <div className='h-10 bg-gray-100 rounded animate-pulse'></div>
                    <div className='h-16 bg-gray-100 rounded animate-pulse'></div>
                </div>
            )}

            {/* 4. Hiển thị khi đã áp dụng mã */}
            {!isLoading && appliedPromoId && appliedPromoDetails ? (
                <div className='p-4'>
                    <p className='text-sm text-gray-600 mb-2'>Mã khuyến mãi đã áp dụng:</p>
                    <div className='flex justify-between items-center bg-green-50 border border-green-200 p-3 rounded-md'>
                        <div>
                            <p className='font-semibold text-green-700'>{appliedPromoDetails.code}</p>
                            <p className='text-sm text-green-600'>{formatDiscount(appliedPromoDetails)}</p>
                        </div>
                        <button
                            onClick={onRemovePromo}
                            className='text-sm font-semibold text-red-500 hover:text-red-700'
                        >
                            Gỡ bỏ
                        </button>
                    </div>
                </div>
            ) : (
                /* 5. Hiển thị khi chưa áp dụng mã */
                !isLoading &&
                !appliedPromoId && (
                    <div className='p-4'>
                        <div className='flex space-x-2'>
                            <input
                                type='text'
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                placeholder='Nhập mã giảm giá'
                                className='flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <button
                                onClick={handleApply}
                                className='px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors'
                            >
                                Áp dụng
                            </button>
                        </div>

                        {/* 6. Hiển thị danh sách khuyến mãi (nếu có) */}
                        {promotions.length > 0 && (
                            <div className='mt-4 space-y-2 max-h-40 overflow-y-auto pr-2'>
                                <p className='text-sm font-semibold text-gray-700'>Khuyến mãi có sẵn:</p>
                                {promotions.map((promo) => (
                                    <div
                                        key={promo.promotion_id}
                                        className='flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200'
                                    >
                                        <div>
                                            <p className='font-semibold text-blue-600'>{promo.code}</p>
                                            <p className='text-sm text-gray-600'>{promo.description}</p>
                                            <p className='text-sm font-bold text-gray-700'>{formatDiscount(promo)}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setPromoCode(promo.code) // Tự điền code vào ô
                                                onApplyPromo(promo.code) // Và áp dụng ngay
                                            }}
                                            className='text-sm font-semibold text-blue-600 hover:underline'
                                        >
                                            Chọn
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    )
}
