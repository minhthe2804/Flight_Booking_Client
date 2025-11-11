import React from 'react'

// Định nghĩa các loại bộ lọc mà Card có thể hiển thị
type FilterType = 'dateRange' | 'monthYear'

interface ChartCardProps {
    title: string
    colSpan: string
    // Prop mới để ra lệnh cho Card hiển thị bộ lọc nào
    filterType: FilterType
    isBooking?: boolean
    titleBlogOne?: string
    textBlogOne?: string
    titleBlogTwo?: string
    textBlogTwo?: string
    children: React.ReactNode
}

// Dữ liệu giả lập cho tháng và năm
const months = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' }
]

const years = [2025, 2024, 2023] // Thêm các năm khác nếu muốn

// Component nút Export được đưa vào đây để tái sử dụng nội bộ
const ExportButton = () => (
    <button className='flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100'>
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            className='size-5'
        >
            <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z'
            />
        </svg>

        <span>Export</span>
    </button>
)

const ChartCard: React.FC<ChartCardProps> = ({
    title,
    colSpan,
    filterType,
    isBooking,
    titleBlogOne,
    titleBlogTwo,
    textBlogOne,
    textBlogTwo,
    children
}) => {
    return (
        <div className={`${colSpan} bg-white p-6 rounded-lg shadow-sm border border-gray-200`}>
            <div className='flex flex-wrap justify-between items-center gap-2 mb-4'>
                <h3 className='text-lg font-semibold text-gray-700'>{title}</h3>

                <div className='flex items-center space-x-2'>
                    {/* Logic hiển thị bộ lọc dựa trên prop filterType */}
                    {filterType === 'dateRange' && (
                        <select className='text-sm w-[200px] border border-[#cdcdcd] rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none p-2 '>
                            <option>7 ngày qua</option>
                            <option>30 ngày qua</option>
                        </select>
                    )}

                    {filterType === 'monthYear' && (
                        <>
                            <select
                                defaultValue='1'
                                className='text-sm w-[130px] border border-[#cdcdcd] rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none p-2 '
                            >
                                {months.map((month) => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                defaultValue='2025'
                                className='text-sm w-[130px] border border-[#cdcdcd] rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none p-2 '
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    <ExportButton />
                </div>
            </div>

            {isBooking && (
                <div className='flex items-center gap-5 w-full'>
                    <div className='w-1/2 border border-[#cdcdcd] rounded-md px-3 py-2'>
                        <p className='text-gray-500 text-base font-semibold'>{titleBlogOne}</p>
                        <p className='text-xl font-semibold text-gray-800'>{textBlogOne}</p>
                    </div>
                    <div className='w-1/2 border border-[#cdcdcd] rounded-md px-3 py-2'>
                        <p className='text-gray-500 text-base font-medium'>{titleBlogTwo}</p>
                        <p className='text-xl font-semibold text-gray-800'>{textBlogTwo}</p>
                    </div>
                </div>
            )}

            <div className='h-72 w-full mt-6'>{children}</div>
        </div>
    )
}

export default ChartCard
