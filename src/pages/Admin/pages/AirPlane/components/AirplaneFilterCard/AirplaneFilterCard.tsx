import { FunnelIcon } from 'lucide-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faRotate } from '@fortawesome/free-solid-svg-icons'

import { useMemo } from 'react'

import { AircraftFilter, Airline } from '~/apis/aircraft.api'

interface AircraftFilterCardProps {
    filters: AircraftFilter
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onFilterSubmit: (e: React.FormEvent) => void
    onFilterReset: () => void
    airlines: Airline[]
    isLoadingAirlines: boolean
}

export default function AircraftFilterCard({
    filters,
    onFilterChange,
    onFilterSubmit,
    onFilterReset,
    airlines,
    isLoadingAirlines
}: AircraftFilterCardProps) {
    const airlineOptions = useMemo(() => {
        if (!airlines) return []
        return airlines.map((a) => ({
            value: a.airline_id.toString(), // Lọc theo ID
            label: a.airline_name
        }))
    }, [airlines])

    // (Bạn có thể thêm list 'aircraft_type' (Boeing, Airbus) ở đây nếu muốn)
    const aircraftTypeOptions = [
        { value: 'Boeing', label: 'Boeing' },
        { value: 'Airbus', label: 'Airbus' },
        { value: 'Other', label: 'Khác' }
    ]

    return (
        <div className='bg-white p-6 rounded-lg shadow-md h-fit'>
            <h2 className='flex items-center text-lg font-semibold mb-5 text-gray-800'>
                <FunnelIcon className='h-5 w-5 mr-2 text-gray-500' />
                Bộ lọc Máy bay
            </h2>

            <form onSubmit={onFilterSubmit}>
                <div className='space-y-4'>
                    {/* Tên (Model) */}
                    <div>
                        <label htmlFor='filter_model' className='block text-sm font-medium text-gray-700'>
                            Tên (Model)
                        </label>
                        <input
                            type='text'
                            name='model'
                            id='filter_model'
                            placeholder='VD: 787'
                            value={filters.model || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        />
                    </div>

                    {/* SỬA: Xóa Hãng sản xuất */}

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
                            disabled={isLoadingAirlines}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100'
                        >
                            <option value=''>Tất cả</option>
                            {airlineOptions.map((n) => (
                                <option key={n.value} value={n.value}>
                                    {n.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Loại máy bay */}
                    <div>
                        <label htmlFor='filter_type' className='block text-sm font-medium text-gray-700'>
                            Loại máy bay
                        </label>
                        <select
                            name='aircraft_type'
                            id='filter_type'
                            value={filters.aircraft_type || ''}
                            onChange={onFilterChange}
                            className='text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none'
                        >
                            <option value=''>Tất cả</option>
                            {aircraftTypeOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Nút bấm (Giữ nguyên) */}
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
