import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Flight } from '~/apis/flight.api'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
// SỬA: Import faPlus, faFilter, faTimes
import { faTrash, faPlus, faFilter } from '@fortawesome/free-solid-svg-icons'

import { formatCurrencyVND, formatDateTime } from '~/utils/utils' // Import formatters

interface FlightTableProps {
    flights: Flight[] | any
    isLoading: boolean
    onEdit: (flight: Flight) => void // SỬA: Nhận lại object
    onDelete: (id: number) => void
    // SỬA: Thêm props cho toggle
    viewMode: 'filter' | 'form'
    onShowAddForm: () => void
    onShowFilterView: () => void
}

// Component Skeleton Bảng
const TableRowSkeleton: React.FC = () => (
    <tr className='animate-pulse'>
        <td className='px-6 py-4'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        <td className='px-6 py-4'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        <td className='px-6 py-4'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        <td className='px-6 py-4'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        <td className='px-6 py-4'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        <td className='px-6 py-4'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        {/* SỬA: Thêm 2 cột skeleton */}
        <td className='px-6 py-4'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        <td className='px-6 py-4'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        <td className='px-6 py-4'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        <td className='px-6 py-4'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        <td className='px-6 py-4'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        <td className='px-6 py-4'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
    </tr>
)

export default function FlightTable({
    flights,
    isLoading,
    onEdit,
    onDelete,
    viewMode,
    onShowAddForm,
    onShowFilterView
}: FlightTableProps) {
    return (
        // SỬA: Bọc trong 1 div chung
        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
            {/* --- SỬA: THÊM HEADER VÀO ĐÂY --- */}
            <div className='flex justify-between items-center p-4 border-b border-gray-100'>
                <h2 className='text-xl font-semibold text-gray-800'>Danh sách chuyến bay</h2>

                {/* Nút này giờ là "Thêm" hoặc "Hủy" */}
                {viewMode === 'filter' ? (
                    <button
                        onClick={onShowAddForm} // Nhấn để Hiện Form
                        className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 transition-colors'
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Thêm chuyến bay
                    </button>
                ) : (
                    <button
                        onClick={onShowFilterView} // Nhấn để Hiện Filter
                        className='inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white font-medium rounded-md shadow-sm hover:bg-gray-600 transition-colors'
                    >
                        <FontAwesomeIcon icon={faFilter} /> {/* Sửa icon */}
                        Hủy (Hiện Bộ lọc)
                    </button>
                )}
            </div>
            {/* --- HẾT HEADER --- */}

            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        {/* SỬA: Thêm 2 cột Header */}
                        <tr>
                            <th className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'>
                                Mã Chuyến bay
                            </th>
                            <th className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'>
                                Thời gian đi
                            </th>
                            <th className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'>
                                Sân bay đi
                            </th>
                            <th className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'>
                                Thời gian đến
                            </th>
                            <th className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'>
                                Sân bay đến
                            </th>
                            <th className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'>
                                Loại
                            </th>
                            {/* THÊM MỚI */}
                            <th className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'>
                                Ghế Business
                            </th>
                            <th className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'>
                                Ghế Economy
                            </th>
                            <th className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'>
                                Giá Economy
                            </th>
                            <th className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'>
                                Giá Business
                            </th>
                            <th className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'>
                                Trạng thái
                            </th>
                            <th className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'>
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {isLoading ? (
                            Array(5)
                                .fill(0)
                                .map((_, idx) => <TableRowSkeleton key={idx} />)
                        ) : flights.length > 0 ? (
                            flights.map((flight: Flight) => (
                                <tr key={flight.flight_id} className='hover:bg-gray-50 transition-colors duration-150'>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600'>
                                        {flight.flight_number}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {formatDateTime(flight.departure_time)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {flight.DepartureAirport.airport_code}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {formatDateTime(flight.arrival_time)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {flight.ArrivalAirport.airport_code}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize'>
                                        {flight.flight_type === 'domestic' ? 'Nội địa' : 'Quốc tế'}
                                    </td>

                                    {/* THÊM MỚI: Cột Ghế C (Lấy từ API) */}
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {flight.bus_seats_available} / {flight.bus_seats_total}
                                    </td>
                                    {/* THÊM MỚI: Cột Ghế E (Lấy từ API) */}
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {flight.eco_seats_available} / {flight.eco_seats_total}
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {formatCurrencyVND(parseFloat(flight.economy_price))}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {formatCurrencyVND(parseFloat(flight.business_price))}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize'>
                                        {flight.status}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                        <div className='flex items-center space-x-3'>
                                            <button
                                                title='Sửa'
                                                className='border border-yellow-600 rounded-md text-yellow-600 hover:bg-yellow-50 transition-colors duration-150 p-2'
                                                onClick={() => onEdit(flight)} // Sửa: Gửi cả object
                                            >
                                                <FontAwesomeIcon icon={faPenToSquare} className='h-4 w-4' />
                                            </button>
                                            <button
                                                title='Xóa'
                                                className='border border-red-600 rounded-md text-red-600 hover:bg-red-50 transition-colors duration-150 p-2'
                                                onClick={() => onDelete(flight.flight_id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className='h-4 w-4' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                {/* SỬA: colSpan = 12 */}
                                <td colSpan={12} className='px-6 py-10 text-center text-sm text-gray-500'>
                                    Không tìm thấy chuyến bay nào phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
