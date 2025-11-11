import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Airport } from '~/apis/airport.api' // Import kiểu Airport
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons' // SỬA: Import icon Xóa

interface AirportTableProps {
    airports: Airport[] | any
    isLoading: boolean
    onEdit: (airport: Airport) => void
    onDelete: (id: number) => void // SỬA: Thêm prop onDelete
}

// Component Skeleton Bảng
const TableRowSkeleton: React.FC = () => (
    <tr className='animate-pulse'>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/4'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/4'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-full'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-8 bg-gray-200 rounded w-full'></div>
        </td>
    </tr>
)

export default function AirportTable({ airports, isLoading, onEdit, onDelete }: AirportTableProps) {
    return (
        <div className='bg-white rounded-lg shadow-md overflow-hidden mt-6'>
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
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
                                Mã (Code)
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Tên Sân bay
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Thành phố
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Quốc gia
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
                        ) : airports.length > 0 ? (
                            airports.map((airport: Airport) => (
                                <tr
                                    key={airport.airport_id}
                                    className='hover:bg-gray-50 transition-colors duration-150'
                                >
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                        {airport.airport_id}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600'>
                                        {airport.airport_code}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {airport.airport_name}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {airport.city}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {airport.Country.country_name}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize'>
                                        {airport.airport_type}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                        {/* SỬA: Thêm lại nút Xóa */}
                                        <div className='flex items-center space-x-3'>
                                            <button
                                                title='Sửa'
                                                className='border border-green-600 rounded-md text-green-600 hover:bg-yellow-50 transition-colors duration-150 p-2'
                                                onClick={() => onEdit(airport)}
                                            >
                                                <FontAwesomeIcon icon={faPenToSquare} className='h-4 w-4' />
                                            </button>
                                            <button
                                                title='Xóa'
                                                className='border border-red-600 rounded-md text-red-600 hover:bg-red-50 transition-colors duration-150 p-2'
                                                onClick={() => onDelete(airport.airport_id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className='h-4 w-4' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className='px-6 py-10 text-center text-sm text-gray-500'>
                                    Không tìm thấy sân bay nào phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
