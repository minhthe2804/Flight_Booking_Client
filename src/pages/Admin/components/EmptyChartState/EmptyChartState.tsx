// (File: EmptyChartState.tsx - COMPONENT MỚI)
import React from 'react'

interface EmptyChartStateProps {
    message: string
    description: string
}

// Icon "Hộp rỗng" (hoặc bất kỳ icon nào bạn thích)
const EmptyBoxIcon = () => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='size-12' // Kích thước 12 (tương đương 3rem)
    >
        <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z'
        />
    </svg>
)

const EmptyChartState: React.FC<EmptyChartStateProps> = ({ message, description }) => {
    return (
        // Component này sẽ chiếm toàn bộ không gian 72 (h-72) của biểu đồ
        // và căn giữa nội dung
        <div className='flex h-full w-full flex-col items-center justify-center text-gray-400'>
            <EmptyBoxIcon />
            <p className='mt-3 text-sm font-semibold'>{message}</p>
            <p className='text-xs'>{description}</p>
        </div>
    )
}

export default EmptyChartState
