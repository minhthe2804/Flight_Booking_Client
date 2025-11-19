import { FunnelIcon } from 'lucide-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faRotate } from '@fortawesome/free-solid-svg-icons'

import { useMemo } from 'react'
import { Country } from '~/apis/airport.api'
import { AirlineFilter } from '~/types/airlineAdmin.type'
import { Airline } from '~/apis/airLine.api'

interface AirlineFilterCardProps {
    filters: AirlineFilter
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onFilterSubmit: (e: React.FormEvent) => void
    onFilterReset: () => void
    countries: Country[]
    isLoadingCountries: boolean
    airlines: Airline[] | any// Nhận danh sách hãng bay (dùng cho loading)
}


export default function AirlineFilterCard({
    filters,
    onFilterChange,
    onFilterSubmit,
    onFilterReset,
    countries,
    isLoadingCountries,
}: AirlineFilterCardProps) {
    const countryOptions = useMemo(() => {
        if (!countries) return []
        return countries.map((c) => ({
            value: c.country_id.toString(), // Lọc theo ID
            label: c.country_name
        }))
    }, [countries])

    // (Không cần airlineOptions nữa vì dùng Input)

    return (
        <div className='bg-white p-6 rounded-lg shadow-md h-fit'>
            <h2 className='flex items-center text-lg font-semibold mb-5 text-gray-800'>
                <FunnelIcon className='h-5 w-5 mr-2 text-gray-500' />
                Bộ lọc tìm kiếm
            </h2>

            <form onSubmit={onFilterSubmit}>
                <div className='space-y-4'>
                    {/* Mã Hãng Bay (Input) */}
                    <div>
                        <label htmlFor='filter_code' className='block text-sm font-medium text-gray-700'>
                            Mã hãng hàng không
                        </label>
                        <input
                            type='text'
                            name='airline_code' // SỬA: Dùng code
                            id='filter_code'
                            placeholder='Nhập mã hãng hàng không...'
                            value={filters.airline_code || ''} // SỬA: Dùng code
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Tên Hãng bay */}
                    <div>
                        <label htmlFor='filter_name' className='block text-sm font-medium text-gray-700'>
                            Tên hãng hàng không
                        </label>
                        <input
                            type='text'
                            name='airline_name'
                            id='filter_name'
                            placeholder='Nhập tên hãng hàng không...'
                            value={filters.airline_name || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Quốc gia */}
                    <div>
                        <label htmlFor='filter_country' className='block text-sm font-medium text-gray-700'>
                            Quốc gia
                        </label>
                        <select
                            name='country_id'
                            id='filter_country'
                            value={filters.country_id || ''}
                            onChange={onFilterChange}
                            disabled={isLoadingCountries}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100'
                        >
                            <option value=''>Tất cả quốc gia</option>
                            {countryOptions.map((n) => (
                                <option key={n.value} value={n.value}>
                                    {n.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* SỬA: Xóa 2 ô Select (sortBy, order) */}
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
