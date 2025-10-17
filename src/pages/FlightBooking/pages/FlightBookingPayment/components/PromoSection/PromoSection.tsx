import { FC, useState } from 'react'
import { TicketPercent, CircleX, CheckCircle } from 'lucide-react'

// --- Type Definitions ---
type Promotion = {
    id: string
    title: string
    description: string
    discount: string
    iconColor: string
}

type PromoSectionProps = {
    promotions: Promotion[]
    appliedPromoId: string | null
    onApplyPromo: (promoId: string) => boolean
    onRemovePromo: () => void
}

const PromoSection: FC<PromoSectionProps> = ({ promotions, appliedPromoId, onApplyPromo, onRemovePromo }) => {
    const [inputValue, setInputValue] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const handleApply = () => {
        setError(null)
        setSuccessMessage(null)

        if (!inputValue.trim()) {
            setError('Vui lòng nhập mã giảm giá.')
            return
        }

        // Gọi hàm của cha để xử lý logic
        const success = onApplyPromo(inputValue.trim().toUpperCase())

        if (success) {
            setSuccessMessage(`Áp dụng mã "${inputValue.trim().toUpperCase()}" thành công!`)
            setInputValue('') // Xóa input sau khi thành công
        } else {
            setError(`Mã "${inputValue.trim().toUpperCase()}" không hợp lệ hoặc đã hết hạn.`)
        }
    }

    const handleSuggestionClick = (promoId: string) => {
        setError(null)
        setSuccessMessage(null)
        onApplyPromo(promoId)
    }

    const handleRemoveClick = () => {
        setError(null)
        setSuccessMessage(null)
        onRemovePromo()
    }

    return (
        <div className='mt-8 p-6 bg-gray-50/70 rounded-lg border border-gray-200'>
            <h3 className='flex items-center text-md font-bold mb-4 text-gray-800'>
                <TicketPercent className='w-5 h-5 mr-2 text-gray-500' />
                Thêm mã giảm giá
            </h3>

            {/* --- Phần Input và Nút bấm --- */}
            <div className='flex mb-1'>
                <input
                    type='text'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder='Nhập mã khuyến mãi chuyến bay'
                    className='flex-grow p-2 border border-gray-300 text-black rounded-l-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100'
                    // Vô hiệu hóa input nếu đã có mã được áp dụng
                    disabled={!!appliedPromoId}
                />
                <button
                    onClick={handleApply}
                    className='bg-white text-blue-600 font-semibold px-4 py-2 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-100 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                    disabled={!!appliedPromoId}
                >
                    Áp dụng
                </button>
            </div>

            {/* --- Phần hiển thị thông báo Lỗi hoặc Thành công --- */}
            <div className='h-5 mb-3 text-sm'>
                {error && (
                    <div className='flex items-center text-red-500'>
                        <CircleX size={16} className='mr-1' />
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className='flex items-center text-green-600'>
                        <CheckCircle size={16} className='mr-1' />
                        {successMessage}
                    </div>
                )}
            </div>

            {/* --- Phần danh sách khuyến mãi gợi ý --- */}
            <div className='space-y-4'>
                {promotions.map((promo) => {
                    const isApplied = appliedPromoId === promo.id
                    const isDisabled = !!appliedPromoId && !isApplied

                    return (
                        <div
                            key={promo.id}
                            className={`flex items-start p-3 rounded-lg ${isApplied ? 'bg-green-50 border border-green-200' : ''}`}
                        >
                            <TicketPercent
                                className={`w-8 h-8 mr-3 mt-1 flex-shrink-0 ${isApplied ? 'text-green-500' : promo.iconColor}`}
                            />
                            <div className='flex-grow'>
                                <p className='font-semibold text-gray-700'>{promo.title}</p>
                                <p className='text-sm text-gray-500'>
                                    {promo.description} <br />
                                    <span className='font-semibold text-blue-600'>{promo.discount}</span>
                                </p>
                            </div>

                            {isApplied ? (
                                <button
                                    onClick={handleRemoveClick}
                                    className='text-sm text-red-600 font-semibold hover:underline self-center'
                                >
                                    Bỏ
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleSuggestionClick(promo.id)}
                                    className='text-sm text-blue-600 font-semibold hover:underline self-center disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed'
                                    disabled={isDisabled}
                                >
                                    Áp dụng
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PromoSection
