import { FunnelIcon } from 'lucide-react'
import { ContactFilter } from '../../Contact'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faRotate } from '@fortawesome/free-solid-svg-icons'

interface ContactFilterCardProps {
    filters: ContactFilter
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onFilterSubmit: (e: React.FormEvent) => void
    onFilterReset: () => void
}

export default function ContactFilterCard({
    filters,
    onFilterChange,
    onFilterReset,
    onFilterSubmit
}: ContactFilterCardProps) {
    return (
        <div className='bg-white p-6 rounded-lg shadow-md h-fit'>
            <h2 className='flex items-center text-lg font-semibold mb-5 text-gray-800'>
                <FunnelIcon className='h-5 w-5 mr-2 text-gray-500' />
                Bộ lọc tìm kiếm
            </h2>

            <form onSubmit={onFilterSubmit}>
                <div className='space-y-4'>
                    {/* Mã người liên hệ */}
                    <div>
                        <label htmlFor='filter_id' className='block text-sm font-medium text-gray-700'>
                            Mã người liên hệ
                        </label>
                        <input
                            type='text'
                            name='id'
                            id='filter_id'
                            placeholder='Nhập mã người liên hệ...'
                            value={filters.id}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Họ và chữ lót */}
                    <div>
                        <label htmlFor='filter_lastName' className='block text-sm font-medium text-gray-700'>
                            Họ và chữ lót
                        </label>
                        <input
                            type='text'
                            name='lastName'
                            id='filter_lastName'
                            placeholder='Nhập họ và chữ lót...'
                            value={filters.lastName}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Tên người liên hệ */}
                    <div>
                        <label htmlFor='filter_firstName' className='block text-sm font-medium text-gray-700'>
                            Tên người liên hệ
                        </label>
                        <input
                            type='text'
                            name='firstName'
                            id='filter_firstName'
                            placeholder='Nhập tên...'
                            value={filters.firstName}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Số điện thoại */}
                    <div>
                        <label htmlFor='filter_phone' className='block text-sm font-medium text-gray-700'>
                            Số điện thoại
                        </label>
                        <input
                            type='tel'
                            name='phone'
                            id='filter_phone'
                            placeholder='Nhập số điện thoại...'
                            value={filters.phone}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor='filter_email' className='block text-sm font-medium text-gray-700'>
                            Email
                        </label>
                        <input
                            type='email'
                            name='email'
                            id='filter_email'
                            placeholder='Nhập email...'
                            value={filters.email}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
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
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        >
                            <option value='id'>Mã người liên hệ</option>
                            <option value='lastName'>Họ và chữ lót</option>
                            <option value='firstName'>Tên</option>
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
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
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
                        Tìm kiếm Tìm kiếm
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
