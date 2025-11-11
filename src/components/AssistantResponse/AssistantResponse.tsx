// src/components/AssistantResponse.tsx

import React from 'react'
import * as T from '~/types/aiTypes'
import {
    TicketIcon,
    BriefcaseIcon,
    ClipboardDocumentCheckIcon,
    ShieldCheckIcon,
    ShieldExclamationIcon,
    ClockIcon
} from '@heroicons/react/24/outline' // Dùng icon Outline cho đẹp

interface AssistantResponseProps {
    data: T.BookingAssistantData
}

// Component con cho từng mục gợi ý
const SuggestionItem: React.FC<{
    icon: React.ElementType
    title: string
    children: React.ReactNode
}> = ({ icon: Icon, title, children }) => (
    <div className='flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm'>
        <Icon className='w-6 h-6 text-blue-600 flex-shrink-0 mt-1' />
        <div className='flex-1'>
            <h4 className='font-semibold text-gray-800'>{title}</h4>
            <div className='text-sm text-gray-600'>{children}</div>
        </div>
    </div>
)

// Component chính
const AssistantResponse: React.FC<AssistantResponseProps> = ({ data }) => {
    return (
        <div className='space-y-3'>
            <h3 className='font-semibold text-gray-900'>Trợ lý đặt vé có một vài gợi ý cho bạn:</h3>

            {/* 1. Gợi ý Ghế */}
            {data.seat_recommendations && (
                <SuggestionItem icon={TicketIcon} title='Gợi ý Ghế ngồi'>
                    <p className='font-medium text-gray-700'>
                        {data.seat_recommendations.recommended_seats.join(', ')}
                    </p>
                    <p className='italic text-gray-500'>"{data.seat_recommendations.reason}"</p>
                </SuggestionItem>
            )}

            {/* 2. Gợi ý Hành lý */}
            {data.baggage_suggestions && (
                <SuggestionItem icon={BriefcaseIcon} title='Gợi ý Hành lý'>
                    <p className='font-medium text-gray-700'>{data.baggage_suggestions.recommended_baggage}</p>
                    <p className='italic text-gray-500'>"{data.baggage_suggestions.reason}"</p>
                </SuggestionItem>
            )}

            {/* 3. Gợi ý Bữa ăn */}
            {data.meal_suggestions && (
                <SuggestionItem icon={ClipboardDocumentCheckIcon} title='Gợi ý Bữa ăn'>
                    <p className='font-medium text-gray-700'>{data.meal_suggestions.recommended_meals.join(', ')}</p>
                    <p className='italic text-gray-500'>"{data.meal_suggestions.reason}"</p>
                </SuggestionItem>
            )}

            {/* 4. Gợi ý Bảo hiểm */}
            {data.insurance_suggestion && (
                <SuggestionItem
                    icon={data.insurance_suggestion.recommended ? ShieldCheckIcon : ShieldExclamationIcon}
                    title='Gợi ý Bảo hiểm'
                >
                    <p className='font-medium text-gray-700'>
                        {data.insurance_suggestion.recommended ? 'Nên mua' : 'Không khuyến nghị'}
                    </p>
                    <p className='italic text-gray-500'>"{data.insurance_suggestion.reason}"</p>
                </SuggestionItem>
            )}

            {/* 5. Nhắc nhở Check-in */}
            {data.check_in_reminder && (
                <SuggestionItem icon={ClockIcon} title='Nhắc nhở Check-in'>
                    <p className='font-medium text-gray-700'>{data.check_in_reminder.reminder_message}</p>
                    <p className='text-xs text-gray-500'>
                        Thời gian mở: {new Date(data.check_in_reminder.check_in_time).toLocaleString('vi-VN')}
                    </p>
                </SuggestionItem>
            )}
        </div>
    )
}

export default AssistantResponse
