// src/components/SummaryAndSubmit/SummaryAndSubmit.tsx

import React from 'react'
import { formatCurrencyVND } from '~/utils/utils' // Giả sử import hàm format

// --- SỬA LỖI Ở ĐÂY ---
interface SummaryAndSubmitProps {
    onSubmitPayment: () => void
    isLoading: boolean
    finalPrice: number // <-- Thêm dòng này
}

export default function SummaryAndSubmit({ onSubmitPayment, isLoading, finalPrice }: SummaryAndSubmitProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isLoading) return
        onSubmitPayment()
    }

    return (
        // Nằm trong cột bên trái (col-span-8)
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 mt-5'>
            <form onSubmit={handleSubmit}>
                {/* Phần hiển thị tổng tiền cuối cùng */}
                <div className='p-4 flex justify-between items-center border-b border-gray-200'>
                    <span className='text-lg font-bold text-gray-900'>Tổng thanh toán</span>
                    {/* Giờ component có thể đọc 'finalPrice' */}
                    <span className='text-xl font-bold text-orange-600'>{formatCurrencyVND(finalPrice)}</span>
                </div>

                {/* Phần nút bấm */}
                <div className='p-4 bg-gray-50 rounded-b-lg'>
                    <p className='text-xs text-gray-500 mb-3'>
                        Bằng cách tiếp tục, bạn đồng ý với{' '}
                        <a href='#' className='text-blue-600 hover:underline'>
                            Điều khoản & Điều kiện
                        </a>
                        .
                    </p>
                    <button
                        type='submit'
                        disabled={isLoading}
                        className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center min-h-[48px] ${
                            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 shadow-md'
                        }`}
                    >
                        {isLoading ? (
                            <svg
                                className='animate-spin h-5 w-5 text-white'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                            >
                                <circle
                                    className='opacity-25'
                                    cx='12'
                                    cy='12'
                                    r='10'
                                    stroke='currentColor'
                                    strokeWidth='4'
                                ></circle>
                                <path
                                    className='opacity-75'
                                    fill='currentColor'
                                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                ></path>
                            </svg>
                        ) : (
                            'Thanh toán qua ZaloPay'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
