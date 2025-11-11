import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Aircraft } from '~/apis/aircraft.api' // Import kiểu Aircraft
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

interface AircraftTableProps {
    aircrafts: Aircraft[] | any
    isLoading: boolean
    onEdit: (aircraft: Aircraft) => void
    onDelete: (id: number) => void
}

// Component Skeleton Bảng
const TableRowSkeleton: React.FC = () => (
    <tr className='animate-pulse'>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/4'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-full'></div>
        </td>
        {/* SỬA: Thêm 2 cột (Business, Economy), xóa 1 (Manufacturer) */}
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-8 bg-gray-200 rounded w-full'></div>
        </td>
    </tr>
)

export default function AircraftTable({ aircrafts, isLoading, onEdit, onDelete }: AircraftTableProps) {
    return (
        <div className='bg-white rounded-lg shadow-md overflow-hidden mt-6'>
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        {/* SỬA: Cập nhật Cột */}
                        <tr>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                ID
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Model
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Hãng Bay
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Tổng Ghế
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Ghế Business
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Ghế Economy
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Loại
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {isLoading ? (
                            Array(5)
                                .fill(0)
                                .map((_, idx) => <TableRowSkeleton key={idx} />)
                        ) : aircrafts.length > 0 ? (
                            aircrafts.map((aircraft: Aircraft) => (
                                <tr
                                    key={aircraft.aircraft_id}
                                    className='hover:bg-gray-50 transition-colors duration-150'
                                >
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                        {aircraft.aircraft_id}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600'>
                                        {aircraft.model}
                                    </td>
                                    {/* SỬA: Xóa Manufacturer */}
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {aircraft.Airline.airline_name}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {aircraft.total_seats}
                                    </td>
                                    {/* THÊM: Ghế C-Class */}
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {aircraft.business_seats}
                                    </td>
                                    {/* THÊM: Ghế E-Class */}
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {aircraft.economy_seats}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize'>
                                        {aircraft.aircraft_type || 'N/A'}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                        <div className='flex items-center space-x-3'>
                                            <button
                                                title='Sửa'
                                                className='border border-yellow-600 rounded-md text-yellow-600 hover:bg-yellow-50 transition-colors duration-150 p-2'
                                                onClick={() => onEdit(aircraft)}
                                            >
                                                <FontAwesomeIcon icon={faPenToSquare} className='h-4 w-4' />
                                            </button>
                                            <button
                                                title='Xóa'
                                                className='border border-red-600 rounded-md text-red-600 hover:bg-red-50 transition-colors duration-150 p-2'
                                                onClick={() => onDelete(aircraft.aircraft_id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className='h-4 w-4' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                {/* SỬA: colSpan = 8 */}
                                <td colSpan={8} className='px-6 py-10 text-center text-sm text-gray-500'>
                                    Không tìm thấy máy bay nào phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
