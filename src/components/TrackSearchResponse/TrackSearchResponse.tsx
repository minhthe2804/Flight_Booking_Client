// src/components/TrackSearchResponse.tsx

import React from 'react'
import * as T from '~/types/aiTypes'
import {
    CheckCircleIcon,
    MapPinIcon,
    CalendarDaysIcon,
    UserGroupIcon,
    TagIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline'

interface TrackSearchResponseProps {
    data: T.TrackSearchResponse
}

// Component con cho từng mục
const StatItem: React.FC<{
    icon: React.ElementType
    label: string
    value: React.ReactNode
}> = ({ icon: Icon, label, value }) => (
    <div className='flex items-center space-x-2 text-sm'>
        <Icon className='w-4 h-4 text-gray-500 flex-shrink-0' />
        <span className='text-gray-600'>{label}:</span>
        <span className='font-semibold text-gray-800'>{value || 'N/A'}</span>
    </div>
)

// Component chính
const TrackSearchResponse: React.FC<TrackSearchResponseProps> = ({ data }) => {
    const { search_params } = data.data

    return (
        <div className='space-y-3'>
            {/* Thông báo thành công */}
            <div className='flex items-center space-x-2 p-3 bg-green-50 text-green-800 rounded-lg border border-green-200'>
                <CheckCircleIcon className='w-6 h-6' />
                <h3 className='font-semibold'>{data.message}</h3>
            </div>

            {/* Thẻ (Card) chi tiết */}
            <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3'>
                <h4 className='font-medium text-gray-700'>Chi tiết tìm kiếm đã lưu:</h4>

                {/* Lộ trình */}
                <div className='flex items-center justify-between'>
                    <div className='text-center'>
                        <p className='text-lg font-bold text-gray-900'>{search_params.departure_airport_code}</p>
                    </div>
                    <ArrowRightIcon className='w-5 h-5 text-gray-400' />
                    <div className='text-center'>
                        <p className='text-lg font-bold text-gray-900'>{search_params.arrival_airport_code}</p>
                    </div>
                </div>

                {/* Các thông tin khác */}
                <div className='border-t pt-3 space-y-2'>
                    <StatItem icon={CalendarDaysIcon} label='Ngày đi' value={search_params.departure_date} />
                    {search_params.return_date && (
                        <StatItem icon={CalendarDaysIcon} label='Ngày về' value={search_params.return_date} />
                    )}
                    <StatItem icon={UserGroupIcon} label='Hành khách' value={search_params.passengers} />
                    <StatItem icon={TagIcon} label='Hạng vé' value={search_params.class_code} />
                </div>
            </div>
        </div>
    )
}

export default TrackSearchResponse
