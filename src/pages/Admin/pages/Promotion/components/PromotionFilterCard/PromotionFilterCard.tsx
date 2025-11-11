import { FunnelIcon } from 'lucide-react'
import { PromotionFilter, promotionTypes } from '../../Promotion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faRotate } from '@fortawesome/free-solid-svg-icons'

interface PromotionFilterCardProps {
    filters: PromotionFilter
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onFilterSubmit: (e: React.FormEvent) => void
    onFilterReset: () => void
}
export default function PromotionFilterCard({
    filters,
    onFilterChange,
    onFilterReset,
    onFilterSubmit
}: PromotionFilterCardProps) {
    return (
        <div className='bg-white p-6 rounded-lg shadow-md h-fit'>
            <h2 className='flex items-center text-lg font-semibold mb-5 text-gray-800'>
                <FunnelIcon className='h-5 w-5 mr-2 text-gray-500' />
                Bộ lọc tìm kiếm
            </h2>

            <form onSubmit={onFilterSubmit}>
                <div className='space-y-4'>
                    {/* Mã khuyến mãi */}
                    <div>
                        <label htmlFor='filter_id' className='block text-sm font-medium text-gray-700'>
                            Mã khuyến mãi
                        </label>
                        <input
                            type='text'
                            name='id'
                            id='filter_id'
                            placeholder='Nhập mã khuyến mãi...'
                            value={filters.id}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none transtion duration-200 ease-in'
                        />
                    </div>

                    {/* Tên khuyến mãi */}
                    <div>
                        <label htmlFor='filter_name' className='block text-sm font-medium text-gray-700'>
                            Tên khuyến mãi
                        </label>
                        <input
                            type='text'
                            name='name'
                            id='filter_name'
                            placeholder='Nhập tên khuyến mãi...'
                            value={filters.name}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none transtion duration-200 ease-in'
                        />
                    </div>

                    {/* Loại khuyến mãi */}
                    <div>
                        <label htmlFor='filter_type' className='block text-sm font-medium text-gray-700'>
                            Loại khuyến mãi
                        </label>
                        <select
                            name='type'
                            id='filter_type'
                            value={filters.type}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none transtion duration-200 ease-in'
                        >
                            <option value='Tất cả'>Tất cả loại khuyến mãi</option>
                            {promotionTypes.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sắp xếp theo */}
                    <div>
                        <label htmlFor='filter_sort' className='block text-sm font-medium text-gray-700'>
                            Sắp xếp theo
                        </label>
                        <select
                            name='sortBy'
                            id='filter_sort'
                            value={filters.sortBy}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none transtion duration-200 ease-in'
                        >
                            <option value='id'>Mã khuyến mãi</option>
                            <option value='name'>Tên khuyến mãi</option>
                            <option value='value'>Giá trị</option>
                        </select>
                    </div>

                    {/* Thứ tự */}
                    <div>
                        <label htmlFor='filter_order' className='block text-sm font-medium text-gray-700'>
                            Thứ tự
                        </label>
                        <select
                            name='order'
                            id='filter_order'
                            value={filters.order}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none transtion duration-200 ease-in'
                        >
                            <option value='asc'>Tăng dần</option>
                            <option value='desc'>Giảm dần</option>
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
