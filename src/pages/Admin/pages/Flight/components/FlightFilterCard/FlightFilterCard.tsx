import { ChevronDown, ChevronUp, FunnelIcon } from 'lucide-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faRotate } from '@fortawesome/free-solid-svg-icons'

import { Airport } from '~/apis/airport.api'
import { useMemo, useState } from 'react'
import { FlightFilter } from '~/types/flight.type'
import { Airline } from '~/apis/airLine.api'

interface FlightFilterCardProps {
    filters: FlightFilter
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onFilterSubmit: (e: React.FormEvent) => void
    onFilterReset: () => void
    airlines: Airline[] | any
    airports: Airport[] | any
    isLoading: boolean
}

const statusOptions = [
    { value: 'scheduled', label: 'Lên lịch (Scheduled)' },
    { value: 'on-time', label: 'Đúng giờ (On-time)' },
    { value: 'delayed', label: 'Bị trễ (Delayed)' },
    { value: 'cancelled', label: 'Đã hủy (Cancelled)' }
]
const typeOptions = [
    { value: 'domestic', label: 'Nội địa' },
    { value: 'international', label: 'Quốc tế' }
]
// SỬA: Thêm hằng số Sắp xếp (khớp UI)
const sortOptions = [
    { value: 'departure_time', label: 'Thời gian đi' },
    { value: 'economy_price', label: 'Giá Economy' },
    { value: 'business_price', label: 'Giá Business' }
]
const orderOptions = [
    { value: 'asc', label: 'Tăng dần' },
    { value: 'desc', label: 'Giảm dần' }
]

export default function FlightFilterCard({
    filters,
    onFilterChange,
    onFilterSubmit,
    onFilterReset,
    airlines,
    airports,
    isLoading
}: FlightFilterCardProps) {
    const airlineOptions = useMemo(
        () => airlines.map((a: Airline) => ({ value: a.airline_id.toString(), label: a.airline_name })),
        [airlines]
    )
    const airportOptions = useMemo(
        () =>
            airports.map((a: Airport) => ({ value: a.airport_id.toString(), label: `${a.city} (${a.airport_code})` })),
        [airports]
    )
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className='bg-white p-6 rounded-lg shadow-md h-fit border border-gray-100'>
            <button
                type='button'
                className='flex items-center justify-between w-full text-lg font-semibold text-gray-800 pb-4 border-b mb-5'
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span className='inline-flex items-center'>
                    <FunnelIcon className='h-5 w-5 mr-2 text-gray-500' />
                    Tìm kiếm chuyến bay
                </span>
                {isOpen ? <ChevronUp className='h-5 w-5 text-gray-500' /> : <ChevronDown className='h-5 w-5 text-gray-500' />}
            </button>

            {isOpen && (
                <form onSubmit={onFilterSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Mã chuyến bay */}
                    <div>
                        <label htmlFor='filter_flight_number' className='block text-sm font-medium text-gray-700'>
                            Mã chuyến bay
                        </label>
                        <input
                            type='text'
                            name='flight_number'
                            id='filter_flight_number'
                            placeholder='VD: VN00027'
                            value={filters.flight_number || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Hãng bay */}
                    <div>
                        <label htmlFor='filter_airline' className='block text-sm font-medium text-gray-700'>
                            Hãng hàng không
                        </label>
                        <select
                            name='airline_id'
                            id='filter_airline'
                            value={filters.airline_id || ''}
                            onChange={onFilterChange}
                            disabled={isLoading}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100'
                        >
                            <option value=''>Tất cả</option>
                            {airlineOptions.map((n: any) => (
                                <option key={n.value} value={n.value}>
                                    {n.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Loại chuyến bay */}
                    <div>
                        <label htmlFor='filter_type' className='block text-sm font-medium text-gray-700'>
                            Loại chuyến bay
                        </label>
                        <select
                            name='flight_type' // SỬA: Khớp với UI
                            id='filter_type'
                            value={filters.flight_type || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        >
                            <option value=''>Tất cả</option>
                            {typeOptions.map((n) => (
                                <option key={n.value} value={n.value}>
                                    {n.label}
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
                            name='status'
                            id='filter_status'
                            value={filters.status || ''}
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

                    {/* Sân bay đi */}
                    <div>
                        <label htmlFor='filter_dep_airport' className='block text-sm font-medium text-gray-700'>
                            Sân bay đi
                        </label>
                        <select
                            name='departure_airport_id'
                            id='filter_dep_airport'
                            value={filters.departure_airport_id || ''}
                            onChange={onFilterChange}
                            disabled={isLoading}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100'
                        >
                            <option value=''>Tất cả</option>
                            {airportOptions.map((n: any) => (
                                <option key={n.value} value={n.value}>
                                    {n.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sân bay đến */}
                    <div>
                        <label htmlFor='filter_arr_airport' className='block text-sm font-medium text-gray-700'>
                            Sân bay đến
                        </label>
                        <select
                            name='arrival_airport_id'
                            id='filter_arr_airport'
                            value={filters.arrival_airport_id || ''}
                            onChange={onFilterChange}
                            disabled={isLoading}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100'
                        >
                            <option value=''>Tất cả</option>
                            {airportOptions.map((n: any) => (
                                <option key={n.value} value={n.value}>
                                    {n.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Thời gian đi (Từ) */}
                    <div>
                        <label htmlFor='filter_date_from' className='block text-sm font-medium text-gray-700'>
                            Thời gian đi (Từ ngày)
                        </label>
                        <input
                            type='date'
                            name='departure_date_from'
                            id='filter_date_from'
                            value={filters.departure_date_from || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>
                    {/* Thời gian đi (Đến) */}
                    <div>
                        <label htmlFor='filter_date_to' className='block text-sm font-medium text-gray-700'>
                            Thời gian đi (Đến ngày)
                        </label>
                        <input
                            type='date'
                            name='departure_date_to'
                            id='filter_date_to'
                            value={filters.departure_date_to || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* Sắp xếp */}
                    <div>
                        <label htmlFor='filter_sortBy' className='block text-sm font-medium text-gray-700'>
                            Sắp xếp theo
                        </label>
                        <select
                            name='sortBy'
                            id='filter_sortBy'
                            value={filters.sortBy || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        >
                            <option value=''>Mặc định</option>
                            {sortOptions.map((n) => (
                                <option key={n.value} value={n.value}>
                                    {n.label}
                                </option>
                            ))}
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
                            value={filters.order || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        >
                            {orderOptions.map((n) => (
                                <option key={n.value} value={n.value}>
                                    {n.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Nút bấm */}
                <div className='mt-6 pt-4 border-t border-gray-200 flex gap-3 justify-end'>
                    <button
                        type='button'
                        onClick={onFilterReset}
                        className='flex items-center justify-center gap-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'
                    >
                        <FontAwesomeIcon icon={faRotate} className='mr-2 text-sm' />
                        Đặt lại
                    </button>
                    <button
                        type='submit'
                        className='flex items-center justify-center gap-1 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700'
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} className='mr-2 text-sm' />
                        Tìm kiếm
                    </button>
                </div>
            </form>
            )}
        </div>
    )
}
