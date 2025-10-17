// src/features/PaymentPage/FlightSummaryCard.tsx

import React, { FC } from 'react'
import { Plane, Users } from 'lucide-react'

// --- ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU (TYPES) ---
// Export các type này để component cha (BookingPage) có thể sử dụng
export type FlightEndpoint = {
    time: string
    city: string
    date: string
}

export type FlightData = {
    departure: FlightEndpoint
    arrival: FlightEndpoint
    duration: string
    type: string
    airline: string
    flightClass: string
}

export type PriceDetails = {
    baseFare: string
    baggage: string
    meals: string
    total: string
}

// Định nghĩa kiểu cho props của component này
type FlightSummaryCardProps = {
    flightData: FlightData
    passengers: string[]
    priceDetails: PriceDetails
}

// Component logo VietJet Air (ví dụ)
const AirlineLogo: FC = () => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
            d='M21.56,12.44,12.44,21.56a1.45,1.45,0,0,1-2.05,0L2.44,13.61a1.45,1.45,0,0,1,0-2.05L11.56,2.44a1.45,1.45,0,0,1,2.05,0l8,8A1.45,1.45,0,0,1,21.56,12.44ZM12,12.69,9.44,15.25,6.19,12,3.31,14.88,12,23.56l8.88-8.88L18.19,12,14.75,15.44Z'
            fill='#e62624'
        />
        <path d='M23.56,12,14.88,3.31,12,6.19l2.56,2.56L12.69,12,15.44,14.75l2.75-2.75,2.69,2.69Z' fill='#fdb913' />
    </svg>
)

const FlightSummaryCard: FC<FlightSummaryCardProps> = ({ flightData, passengers, priceDetails }) => {
    return (
        <div className='border border-gray-200 rounded-lg p-5 bg-white shadow-sm h-fit'>
            {/* Phần 1: Tóm tắt vé máy bay */}
            <div className='pb-5 border-b border-gray-200'>
                <div className='flex items-center mb-4'>
                    <Plane className='w-5 h-5 text-gray-600 mr-3' />
                    <h3 className='font-bold text-gray-800'>Tóm tắt vé máy bay</h3>
                </div>

                <div className='flex justify-between items-center text-center my-4'>
                    <div className='w-1/3'>
                        <p className='text-xl font-bold text-gray-900'>{flightData.departure.time}</p>
                        <p className='text-sm font-semibold text-gray-800'>{flightData.departure.city}</p>
                        <p className='text-xs text-gray-500'>{flightData.departure.date}</p>
                    </div>

                    <div className='w-1/3 text-xs text-gray-500'>
                        <p>{flightData.duration}</p>
                        <div className='relative w-full h-px bg-gray-300 my-1'>
                            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1'>
                                <Plane className='w-4 h-4 text-blue-600 -rotate-45' />
                            </div>
                        </div>
                        <p>{flightData.type}</p>
                    </div>

                    <div className='w-1/3'>
                        <p className='text-xl font-bold text-gray-900'>{flightData.arrival.time}</p>
                        <p className='text-sm font-semibold text-gray-800'>{flightData.arrival.city}</p>
                        <p className='text-xs text-gray-500'>{flightData.arrival.date}</p>
                    </div>
                </div>

                <div className='flex items-center mt-4'>
                    <AirlineLogo />
                    <div className='ml-3'>
                        <p className='text-sm font-semibold'>{flightData.airline}</p>
                        <p className='text-xs text-gray-500'>{flightData.flightClass}</p>
                    </div>
                </div>
            </div>

            {/* Phần 2: Chi tiết hành khách */}
            <div className='py-5 border-b border-gray-200'>
                <div className='flex items-center mb-3'>
                    <Users className='w-5 h-5 text-gray-600 mr-3' />
                    <h3 className='font-bold text-gray-800'>Chi tiết (các) hành khách</h3>
                </div>
                <ul className='space-y-1 text-sm text-gray-700 list-disc list-inside'>
                    {passengers.map((passenger, index) => (
                        <li key={index}>{passenger}</li>
                    ))}
                </ul>
            </div>

            {/* Phần 3: Chi tiết giá */}
            <div className='pt-5'>
                <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>Giá vé:</span>
                        <span className='font-medium text-gray-800'>{priceDetails.baseFare}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>Hành lý:</span>
                        <span className='font-medium text-gray-800'>{priceDetails.baggage}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-gray-600'>Đồ ăn kèm:</span>
                        <span className='font-medium text-gray-800'>{priceDetails.meals}</span>
                    </div>
                </div>
                <hr className='my-3 border-gray-200' />
                <div className='flex justify-between items-center'>
                    <span className='font-bold text-gray-800'>Tổng cộng</span>
                    <span className='text-xl font-bold text-blue-600'>{priceDetails.total}</span>
                </div>
            </div>
        </div>
    )
}

export default FlightSummaryCard
