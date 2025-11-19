// src/components/RecommendationsResponse.tsx

import React from 'react'
import * as T from '~/types/aiTypes'
import {
    PaperAirplaneIcon,
    CalendarDaysIcon,
    ClockIcon,
    SparklesIcon
} from '@heroicons/react/24/outline'

interface RecommendationsResponseProps {
    data: T.RecommendationsData // Đây là object { recommendations: [...] }
}

// Hàm helper format thời gian (HH:mm)
const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })
}

// Hàm helper format ngày (dd/MM/yyyy)
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
}

// Component cho một thẻ chuyến bay
const FlightCard: React.FC<{ rec: T.NewRecommendation }> = ({ rec }) => {
    // Lấy giá (ưu tiên economy, nếu không có thì business)
    // API của bạn trả về `starting_price: null` và `available_seats: 0`
    // Trong thực tế, bạn sẽ dùng giá Economy/Business
    const price = rec.starting_price || 'N/A' // Cần điều chỉnh nếu API trả về giá

    return (
        <div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
            {/* Header (Lý do) */}
            <div className='p-3 bg-yellow-50 border-b border-yellow-200'>
                <div className='flex items-center space-x-2'>
                    <SparklesIcon className='w-5 h-5 text-yellow-600' />
                    <h4 className='font-semibold text-yellow-800'>Lý do gợi ý:</h4>
                </div>
                <p className='text-sm text-yellow-700 mt-1 italic'>"{rec.recommendation_reasons.join(', ')}"</p>
            </div>

            {/* Body (Thông tin chuyến bay) */}
            <div className='p-4 space-y-3'>
                {/* Hãng bay và Logo */}
                <div className='flex justify-between items-center'>
                    <div className='flex items-center space-x-2'>
                        <img
                            src={rec.airline.logo_url}
                            alt={rec.airline.name}
                            className='w-6 h-6 rounded-full border border-gray-300'
                        />
                        <span className='font-semibold text-gray-800'>{rec.airline.name}</span>
                    </div>
                    <span className='text-sm font-medium text-gray-600'>{rec.flight_number}</span>
                </div>

                {/* Lộ trình (SGN -> HAN) */}
                <div className='flex items-center justify-between mt-2'>
                    <div className='text-left'>
                        <p className='text-2xl font-bold text-gray-900'>{rec.departure.airport.code}</p>
                        <p className='text-sm text-gray-600'>{rec.departure.airport.city}</p>
                    </div>
                    <div className='flex-1 text-center px-2'>
                        <PaperAirplaneIcon className='w-5 h-5 text-gray-400 inline-block' />
                        <p className='text-xs text-gray-500'>{rec.duration}</p>
                    </div>
                    <div className='text-right'>
                        <p className='text-2xl font-bold text-gray-900'>{rec.arrival.airport.code}</p>
                        <p className='text-sm text-gray-600'>{rec.arrival.airport.city}</p>
                    </div>
                </div>

                {/* Giờ bay */}
                <div className='flex justify-between text-sm text-gray-700 border-t pt-3 mt-3'>
                    <div className='flex items-center space-x-1.5'>
                        <ClockIcon className='w-4 h-4' />
                        <span>
                            Cất cánh: <strong>{formatTime(rec.departure.time)}</strong>
                        </span>
                    </div>
                    <div className='flex items-center space-x-1.5'>
                        <ClockIcon className='w-4 h-4' />
                        <span>
                            Hạ cánh: <strong>{formatTime(rec.arrival.time)}</strong>
                        </span>
                    </div>
                </div>
                <div className='flex items-center space-x-1.5 text-sm text-gray-700'>
                    <CalendarDaysIcon className='w-4 h-4' />
                    <span>
                        Ngày: <strong>{formatDate(rec.departure.time)}</strong>
                    </span>
                </div>

                {/* Giá vé */}
                <div className='text-right'>
                    <span className='text-xl font-bold text-red-600'>{price}</span>
                    {price !== 'N/A' && <span className='text-sm text-gray-500'> / vé</span>}
                </div>
            </div>
        </div>
    )
}

// Component chính
const RecommendationsResponse: React.FC<RecommendationsResponseProps> = ({ data }) => {
    return (
        <div className='space-y-4'>
            <h3 className='font-semibold text-gray-900'>AI đã tìm thấy {data.total_count} chuyến bay gợi ý cho bạn:</h3>
            {data.recommendations.map((recommendation) => (
                <FlightCard key={recommendation.flight_id} rec={recommendation} />
            ))}
        </div>
    )
}

export default RecommendationsResponse
