import { FunnelIcon } from 'lucide-react'
import { AirportFilter, Country } from '~/apis/airport.api' // Import kiểu Filter
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faRotate } from '@fortawesome/free-solid-svg-icons'
import { useMemo } from 'react'

interface AirportFilterCardProps {
    filters: AirportFilter
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onFilterSubmit: (e: React.FormEvent) => void
    onFilterReset: () => void
    countries: Country[]
    isLoadingCountries: boolean
}

// SỬA: Thêm hằng số cho loại sân bay
const airportTypeOptions = [
    { value: 'domestic', label: 'Nội địa' },
    { value: 'international', label: 'Quốc tế' }
]

export default function AirportFilterCard({
    filters,
    onFilterChange,
    onFilterSubmit,
    onFilterReset,
    countries,
    isLoadingCountries
}: AirportFilterCardProps) {
    const countryOptions = useMemo(() => {
        if (!countries) return []
        return countries.map((c) => ({
            value: c.country_id.toString(), // Lọc theo ID
            label: c.country_name
        }))
    }, [countries])

    return (
        <div className='bg-white p-6 rounded-lg shadow-md h-fit'>
            <h2 className='flex items-center text-lg font-semibold mb-5 text-gray-800'>
                <FunnelIcon className='h-5 w-5 mr-2 text-gray-500' />
                Bộ lọc Sân bay
            </h2>

            <form onSubmit={onFilterSubmit}>
                <div className='space-y-4'>
                    {/* Tên Sân bay */}
                    <div>
                        <label htmlFor='filter_name' className='block text-sm font-medium text-gray-700'>
                            Tên sân bay
                        </label>
                        <input
                            type='text'
                            name='airport_name'
                            id='filter_name'
                            placeholder='VD: Noi Bai'
                            value={filters.airport_name || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Mã Sân bay */}
                    <div>
                        <label htmlFor='filter_code' className='block text-sm font-medium text-gray-700'>
                            Mã sân bay (Code)
                        </label>
                        <input
                            type='text'
                            name='airport_code'
                            id='filter_code'
                            placeholder='VD: HAN'
                            value={filters.airport_code || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Thành phố */}
                    <div>
                        <label htmlFor='filter_city' className='block text-sm font-medium text-gray-700'>
                            Thành phố
                        </label>
                        <input
                            type='text'
                            name='city'
                            id='filter_city'
                            placeholder='VD: Hanoi'
                            value={filters.city || ''}
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
                            <option value=''>Tất cả</option>
                            {countryOptions.map((n) => (
                                <option key={n.value} value={n.value}>
                                    {n.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* SỬA: THÊM LỌC LOẠI SÂN BAY */}
                    <div>
                        <label htmlFor='filter_type' className='block text-sm font-medium text-gray-700'>
                            Loại sân bay
                        </label>
                        <select
                            name='airport_type' // Khớp với API
                            id='filter_type'
                            value={filters.airport_type || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        >
                            <option value=''>Tất cả</option>
                            {airportTypeOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* HẾT SỬA */}
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
