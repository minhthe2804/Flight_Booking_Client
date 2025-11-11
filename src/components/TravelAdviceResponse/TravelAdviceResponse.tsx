// src/components/TravelAdviceResponse.tsx

import React from 'react'
import * as T from '~/types/aiTypes'
import { LightBulbIcon } from '@heroicons/react/24/outline'

// (CẬP NHẬT) Props giờ nhận T.AdviceResponse (toàn bộ JSON)
interface TravelAdviceResponseProps {
    data: T.AdviceResponse
}

// Component FormattedText (Không đổi, nhưng giờ sẽ nhận string)
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
    // Dòng 14: Sẽ không lỗi nữa vì 'text' sẽ là string
    const paragraphs = text.split('\n')

    return (
        <div className='space-y-2'>
            {paragraphs.map((paragraph, pIndex) => {
                if (paragraph.trim() === '') {
                    return <br key={pIndex} />
                }

                const parts = paragraph.split(/(\*\*.*?\*\*)/g)

                return (
                    <p key={pIndex} className='text-gray-700'>
                        {parts.map((part, index) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                    <strong key={index} className='font-semibold text-gray-900'>
                                        {part.substring(2, part.length - 2)}
                                    </strong>
                                )
                            }
                            return <span key={index}>{part}</span>
                        })}
                    </p>
                )
            })}
        </div>
    )
}

// Component chính (ĐÃ SỬA)
const TravelAdviceResponse: React.FC<TravelAdviceResponseProps> = ({ data }) => {
    // 'data' là T.AdviceResponse
    // 'adviceData' là T.AdviceData (nằm trong data.data)
    const adviceData = data.data

    return (
        <div className='space-y-3'>
            {/* Header (Chủ đề) */}
            <div className='flex items-center space-x-2 p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-200'>
                <LightBulbIcon className='w-6 h-6' />
                <h3 className='font-semibold capitalize'>
                    Mẹo du lịch: {adviceData.topic} {/* Sửa: data.topic -> adviceData.topic */}
                </h3>
            </div>

            {/* Thẻ (Card) nội dung */}
            <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
                {/* Sửa: data.advice -> adviceData.advice */}
                <FormattedText text={adviceData.advice} />
            </div>
        </div>
    )
}

export default TravelAdviceResponse
