import { FunnelIcon, Search } from 'lucide-react'
import { PassengerFilterAdmin as PassengerFilter, passengerTypes, titles } from '~/types/passenger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faRotate } from '@fortawesome/free-solid-svg-icons'

import { useMemo } from 'react'
import { Country } from '../../../Airport/Airport'

interface PassengerFilterCardProps {
    filters: PassengerFilter
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onFilterSubmit: (e: React.FormEvent) => void // (Prop này không còn dùng)
    onFilterReset: () => void
    countries: Country[]
    isLoadingCountries: boolean
}

export default function PassengerFilterCard({
    filters,
    onFilterChange,
    onFilterSubmit,
    onFilterReset,
    countries,
    isLoadingCountries
}: PassengerFilterCardProps) {
    const countryOptions = useMemo(() => {
        if (!countries) return []
        return countries?.map((c) => ({
            value: c.country_code, // 'VN'
            label: c.country_name // 'Việt Nam'
        }))
    }, [countries])

    return (
        <div className='bg-white p-6 rounded-lg shadow-md h-fit'>
            <h2 className='flex items-center text-lg font-semibold mb-5 text-gray-800'>
                <FunnelIcon className='h-5 w-5 mr-2 text-gray-500' />
                Bộ lọc tìm kiếm
            </h2>

            {/* SỬA: Xóa <form> vì lọc tự động */}
            <form className='' onSubmit={onFilterSubmit}>
                <div className='space-y-4'>
                    {/* Mã hành khách */}
                    <div>
                        <label htmlFor='filter_id' className='block text-sm font-medium text-gray-700'>
                            Mã hành khách
                        </label>
                        <input
                            type='text'
                            name='passenger_id'
                            id='filter_id'
                            placeholder='Nhập mã hành khách...'
                            value={filters.passenger_id || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Họ */}
                    <div>
                        <label htmlFor='filter_lastName' className='block text-sm font-medium text-gray-700'>
                            Họ
                        </label>
                        <input
                            type='text'
                            name='last_name'
                            id='filter_lastName'
                            placeholder='Nhập họ...'
                            value={filters.last_name || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Tên hành khách */}
                    <div>
                        <label htmlFor='filter_firstName' className='block text-sm font-medium text-gray-700'>
                            Tên hành khách
                        </label>
                        <input
                            type='text'
                            name='first_name'
                            id='filter_firstName'
                            placeholder='Nhập tên hành khách...'
                            value={filters.first_name || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Danh xưng */}
                    <div>
                        <label htmlFor='filter_title' className='block text-sm font-medium text-gray-700'>
                            Danh xưng
                        </label>
                        <select
                            name='title'
                            id='filter_title'
                            value={filters.title || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        >
                            <option value=''>Tất cả</option>
                            {titles.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Mã CCCD */}
                    <div>
                        <label htmlFor='filter_cccd' className='block text-sm font-medium text-gray-700'>
                            Mã CCCD
                        </label>
                        <input
                            type='text'
                            name='citizen_id'
                            id='filter_cccd'
                            placeholder='Nhập mã CCCD...'
                            value={filters.citizen_id || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Ngày sinh */}
                    <div>
                        <label htmlFor='filter_dob' className='block text-sm font-medium text-gray-700'>
                            Ngày sinh
                        </label>
                        <input
                            type='date'
                            name='date_of_birth'
                            id='filter_dob'
                            value={filters.date_of_birth || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Quốc tịch */}
                    <div>
                        <label htmlFor='filter_nationality' className='block text-sm font-medium text-gray-700'>
                            Quốc tịch
                        </label>
                        <select
                            name='nationality'
                            id='filter_nationality'
                            value={filters.nationality || ''}
                            onChange={onFilterChange}
                            disabled={isLoadingCountries}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100'
                        >
                            <option value=''>Tất cả</option>
                            {countryOptions.map((n) => (
                                <option key={n.value} value={n.value}>
                                    {n.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Loại hành khách */}
                    <div>
                        <label htmlFor='filter_type' className='block text-sm font-medium text-gray-700'>
                            Loại hành khách
                        </label>
                        <select
                            name='passenger_type'
                            id='filter_type'
                            value={filters.passenger_type || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        >
                            <option value=''>Tất cả</option>
                            {passengerTypes.map((p) => (
                                <option key={p.value} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Nút bấm */}
                <div className='mt-6 pt-4 border-t border-gray-200 space-y-3'>
                    {/* SỬA: Bỏ type='submit' */}
                    <button
                        type='submit'
                        className='flex w-full items-center justify-center rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    >
                        {/* Sửa: Dùng icon lucide-react */}
                        <Search className='mr-2 h-4 w-4' />
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
                {/* SỬA: Xóa <form> */}
            </form>
        </div>
    )
}
