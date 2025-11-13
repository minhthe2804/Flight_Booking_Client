import { FunnelIcon } from 'lucide-react'
import { ContactFilter } from '~/types/contact.type' // Import kiểu Filter
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
    onFilterSubmit,
    onFilterReset
}: ContactFilterCardProps) {
    return (
        <div className='bg-white p-6 rounded-lg shadow-md h-fit'>
            <h2 className='flex items-center text-lg font-semibold mb-5 text-gray-800'>
                <FunnelIcon className='h-5 w-5 mr-2 text-gray-500' />
                Bộ lọc Liên hệ
            </h2>

            <form onSubmit={onFilterSubmit}>
                <div className='space-y-4'>
                    {/* Tên */}
                    <div>
                        <label htmlFor='filter_first_name' className='block text-sm font-medium text-gray-700'>
                            Tên
                        </label>
                        <input
                            type='text'
                            name='first_name'
                            id='filter_first_name'
                            placeholder='VD: An'
                            value={filters.first_name || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Họ */}
                    <div>
                        <label htmlFor='filter_last_name' className='block text-sm font-medium text-gray-700'>
                            Họ
                        </label>
                        <input
                            type='text'
                            name='last_name'
                            id='filter_last_name'
                            placeholder='VD: Nguyen'
                            value={filters.last_name || ''}
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
                            type='text'
                            name='email'
                            id='filter_email'
                            placeholder='VD: example@mail.com'
                            value={filters.email || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Điện thoại */}
                    <div>
                        <label htmlFor='filter_phone' className='block text-sm font-medium text-gray-700'>
                            Số điện thoại
                        </label>
                        <input
                            type='text'
                            name='phone'
                            id='filter_phone'
                            placeholder='VD: 090...'
                            value={filters.phone || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
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
