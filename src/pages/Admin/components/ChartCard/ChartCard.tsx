import React from 'react'
import { MarketSharePeriod } from '~/apis/dashboard.api'

// Định nghĩa các loại bộ lọc
type FilterType = 'dateRange' | 'monthYear'

interface ChartCardProps {
    title: string
    colSpan: string
    filterType: FilterType
    children: React.ReactNode

    // Props điều khiển 'dateRange'
    periodValue?: MarketSharePeriod
    onPeriodChange?: (value: MarketSharePeriod) => void

    // Props điều khiển 'monthYear'
    monthValue?: number
    yearValue?: number
    onMonthChange?: (value: number) => void
    onYearChange?: (value: number) => void

    // Props cho Export
    onExportClick?: () => void
    isExporting?: boolean

    // (Props tùy chọn khác)
    isBooking?: boolean
    titleBlogOne?: string
    textBlogOne?: string
    titleBlogTwo?: string
    textBlogTwo?: string
}

// === DỮ LIỆU TĨNH CHO DROPDOWN ===
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
const years = [2025, 2024, 2023]

// === COMPONENT NÚT EXPORT (Đã có) ===
const ExportButton: React.FC<{ onClick?: () => void; disabled?: boolean }> = ({ onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className='flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed'
    >
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='size-5'
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z'
            />
        </svg>
        <span>{disabled ? 'Đang xuất...' : 'Export'}</span>
    </button>
)

// === COMPONENT CHARTCARD CHÍNH ===
const ChartCard: React.FC<ChartCardProps> = ({
    title,
    colSpan,
    filterType,
    children,
    // Props 'dateRange'
    periodValue,
    onPeriodChange,
    // Props 'monthYear'
    monthValue,
    yearValue,
    onMonthChange,
    onYearChange,
    // Props export
    onExportClick,
    isExporting,
    // (Props khác)
    isBooking,
    titleBlogOne,
    titleBlogTwo,
    textBlogOne,
    textBlogTwo
}) => {
    return (
        <div className={`${colSpan} bg-white p-6 rounded-lg shadow-sm border border-gray-200`}>
            <div className='flex flex-wrap justify-between items-center gap-2 mb-4'>
                <h3 className='text-lg font-semibold text-gray-700'>{title}</h3>

                <div className='flex items-center space-x-2'>
                    {/* === BỘ LỌC 'dateRange' === */}
                    {filterType === 'dateRange' && (
                        <select
                            className='text-sm w-[200px] border border-[#cdcdcd] rounded-md shadow-sm outline-none p-2'
                            value={periodValue}
                            onChange={(e) => onPeriodChange?.(e.target.value as MarketSharePeriod)}
                        >
                            <option value='7days'>7 ngày qua</option>
                            <option value='14days'>14 ngày qua</option>
                            <option value='1months'>30 ngày qua</option>
                        </select>
                    )}

                    {/* === BỘ LỌC 'monthYear' === */}
                    {filterType === 'monthYear' && (
                        <>
                            <select
                                className='text-sm w-[130px] border border-[#cdcdcd] rounded-md shadow-sm outline-none p-2'
                                value={monthValue}
                                onChange={(e) => onMonthChange?.(Number(e.target.value))}
                            >
                                {months.map((month) => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                className='text-sm w-[130px] border border-[#cdcdcd] rounded-md shadow-sm outline-none p-2'
                                value={yearValue}
                                onChange={(e) => onYearChange?.(Number(e.target.value))}
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    {/* === NÚT EXPORT (Luôn hiển thị) === */}
                    <ExportButton onClick={onExportClick} disabled={isExporting} />
                </div>
            </div>

            {/* (Phần 'isBooking' giữ nguyên) */}
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

            {/* (Phần 'children' giữ nguyên) */}
            <div className='h-72 w-full mt-6'>{children}</div>
        </div>
    )
}

export default ChartCard
