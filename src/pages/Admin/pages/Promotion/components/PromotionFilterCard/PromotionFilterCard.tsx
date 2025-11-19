import { FunnelIcon } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faRotate } from '@fortawesome/free-solid-svg-icons'
import { PromotionFilter } from '~/types/promotion'

interface PromotionFilterCardProps {
    filters: PromotionFilter
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onFilterSubmit: (e: React.FormEvent) => void
    onFilterReset: () => void
}

const discountTypeOptions = [
    { value: 'percentage', label: 'Phần trăm (%)' },
    { value: 'fixed_amount', label: 'Số tiền (VND)' }
]

const statusOptions = [
    { value: 'true', label: 'Đang hoạt động' },
    { value: 'false', label: 'Không hoạt động' }
]

export default function PromotionFilterCard({
    filters,
    onFilterChange,
    onFilterSubmit,
    onFilterReset
}: PromotionFilterCardProps) {
    return (
        <div className='bg-white p-6 rounded-lg shadow-md h-fit'>
            <h2 className='flex items-center text-lg font-semibold mb-5 text-gray-800'>
                <FunnelIcon className='h-5 w-5 mr-2 text-gray-500' />
                Bộ lọc Khuyến mãi
            </h2>

            <form onSubmit={onFilterSubmit}>
                <div className='space-y-4'>
                    {/* Mã (Code) */}
                    <div>
                        <label htmlFor='filter_code' className='block text-sm font-medium text-gray-700'>
                            Mã khuyến mãi
                        </label>
                        <input
                            type='text'
                            name='promotion_code'
                            id='filter_code'
                            placeholder='VD: SUMMER2025'
                            value={filters.promotion_code || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Loại giảm giá */}
                    <div>
                        <label htmlFor='filter_type' className='block text-sm font-medium text-gray-700'>
                            Loại giảm giá
                        </label>
                        <select
                            name='discount_type'
                            id='filter_type'
                            value={filters.discount_type || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        >
                            <option value=''>Tất cả</option>
                            {discountTypeOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Trạng thái */}
                    <div>
                        <label htmlFor='filter_status' className='block text-sm font-medium text-gray-700'>
                            Trạng thái
                        </label>
                        <select
                            name='is_active'
                            id='filter_status'
                            value={filters.is_active || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        >
                            <option value=''>Tất cả</option>
                            {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Nút bấm */}
                <div className='mt-6 pt-4 border-t border-gray-200 space-y-3'>
                    <button
                        type='submit'
                        className='flex w-full items-center justify-center gap-1 rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} className='mr-2 text-sm' />
                        Tìm kiếm
                    </button>

                    <button
                        type='button'
                        onClick={onFilterReset}
                        className='flex w-full items-center justify-center gap-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
                    >
                        <FontAwesomeIcon icon={faRotate} className='mr-2 text-sm' />
                        Đặt lại
                    </button>
                </div>
            </form>
        </div>
    )
}
