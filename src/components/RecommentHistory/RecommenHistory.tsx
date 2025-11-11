// src/components/RecommendationsResponse.tsx

import React from 'react'
import * as T from '~/types/aiTypes'
import {
    PaperAirplaneIcon,
    CalendarDaysIcon,
    ClockIcon,
    ArrowRightIcon,
    SparklesIcon
} from '@heroicons/react/24/outline'

interface RecommentHistoryProps {
    data: T.RecommenHistory // Đây là một mảng T.FlightRecommendation[]
}

// Hàm helper format tiền tệ
const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(Number(value))
}

// Hàm helper format thời gian
const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Component cho một thẻ chuyến bay
const FlightCard: React.FC<{ rec: T.FlightRecommendation }> = ({ rec }) => {
    const { Flight, recommendation_reason } = rec

    return (
        <div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
            {/* Header (Lý do) */}
            <div className='p-3 bg-yellow-50 border-b border-yellow-200'>
                <div className='flex items-center space-x-2'>
                    <SparklesIcon className='w-5 h-5 text-yellow-600' />
                    <h4 className='font-semibold text-yellow-800'>Lý do gợi ý:</h4>
                </div>
                <p className='text-sm text-yellow-700 mt-1 italic'>"{recommendation_reason}"</p>
            </div>

            {/* Body (Thông tin chuyến bay) */}
            <div className='p-4 space-y-3'>
                {/* Hãng bay và Mã chuyến */}
                <div className='flex justify-between items-center'>
                    <span className='font-semibold text-gray-800'>{Flight.Airline.airline_name}</span>
                    <span className='text-sm font-medium text-gray-600'>{Flight.flight_number}</span>
                </div>

                {/* Lộ trình (SGN -> HAN) */}
                <div className='flex items-center justify-between'>
                    <div className='text-center'>
                        <p className='text-2xl font-bold text-gray-900'>{Flight.DepartureAirport.airport_code}</p>
                        <p className='text-sm text-gray-600'>{Flight.DepartureAirport.city}</p>
                    </div>
                    <ArrowRightIcon className='w-6 h-6 text-gray-400' />
                    <div className='text-center'>
                        <p className='text-2xl font-bold text-gray-900'>{Flight.ArrivalAirport.airport_code}</p>
                        <p className='text-sm text-gray-600'>{Flight.ArrivalAirport.city}</p>
                    </div>
                </div>

                {/* Giờ bay */}
                <div className='flex justify-between text-sm text-gray-700 border-t pt-3 mt-3'>
                    <div className='flex items-center space-x-1.5'>
                        <ClockIcon className='w-4 h-4' />
                        <span>
                            Cất cánh: <strong>{formatTime(Flight.departure_time)}</strong>
                        </span>
                    </div>
                    <div className='flex items-center space-x-1.5'>
                        <ClockIcon className='w-4 h-4' />
                        <span>
                            Hạ cánh: <strong>{formatTime(Flight.arrival_time)}</strong>
                        </span>
                    </div>
                </div>

                {/* Giá vé */}
                <div className='text-right'>
                    <span className='text-xl font-bold text-red-600'>{formatCurrency(Flight.economy_price)}</span>
                    <span className='text-sm text-gray-500'> / vé Economy</span>
                </div>
            </div>
        </div>
    )
}

// Component chính
const RecommentHistory: React.FC<RecommentHistoryProps> = ({ data }) => {
    return (
        <div className='space-y-4'>
            <h3 className='font-semibold text-gray-900'>
                AI đã tìm thấy {data.length} chuyến bay phù hợp nhất cho bạn:
            </h3>
            {data.map((recommendation) => (
                <FlightCard key={recommendation.recommendation_id} rec={recommendation} />
            ))}
        </div>
    )
}

export default RecommentHistory
