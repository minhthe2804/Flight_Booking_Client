import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// SỬA: Import đúng kiểu Passenger (snake_case)
import { PassengerAdmin as Passenger } from '~/types/passenger'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { TrashIcon } from 'lucide-react'

interface PassengerTableProps {
    passengers: Passenger[] | any
    isLoading: boolean // Thêm prop isLoading
    onEdit: (passenger: Passenger) => void
}

// Hàm helper để format ngày YYYY-MM-DD sang DD/MM/YYYY
const formatDate = (dateString: string | null | undefined) => {
    // Sửa: Cho phép null/undefined
    if (!dateString) return '' // Trả về 'N/A' nếu rỗng
    try {
        const [year, month, day] = dateString.split('-')
        if (day && month && year) {
            return `${day}/${month}/${year}`
        }
        return dateString
    } catch (e) {
        return dateString // Trả về nguyên bản nếu format sai
    }
}

// Hàm helper để hiển thị badge
const getTypeBadge = (type: 'adult' | 'child' | 'infant' | string) => {
    switch (type) {
        case 'adult':
            return <span className='bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-medium'>Người lớn</span>
        case 'child':
            return <span className='bg-green-600 text-white px-2 py-0.5 rounded text-xs font-medium'>Trẻ em</span>
        case 'infant':
            return <span className='bg-purple-600 text-white px-2 py-0.5 rounded text-xs font-medium'>Em bé</span>
        default:
            return <span>{type}</span>
    }
}

// SỬA: Helper mới cho Giới tính
const getGenderLabel = (gender: 'male' | 'female' | string) => {
    if (gender === 'male') return 'Nam'
    if (gender === 'female') return 'Nữ'
    return 'Khác'
}

// Component Skeleton Bảng
const TableRowSkeleton: React.FC = () => (
    <tr className='animate-pulse'>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
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
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-full'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-full'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-full'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-full'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-8 bg-gray-200 rounded w-full'></div>
        </td>
    </tr>
)

export default function PassengerTable({ passengers, isLoading, onEdit }: PassengerTableProps) {
    return (
        <div className='bg-white rounded-lg shadow-md overflow-hidden mt-6'>
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        {/* SỬA: Cập nhật các cột */}
                        <tr>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Mã
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Họ
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Tên đệm
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Tên
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Danh xưng
                            </th>
                            {/* THÊM: Giới tính */}
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Giới tính
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                CCCD
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Ngày sinh
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Quốc tịch
                            </th>
                            {/* THÊM: Hộ chiếu */}
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Số hộ chiếu
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Hết hạn
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
                            // Hiển thị Skeleton khi loading
                            Array(5)
                                .fill(0)
                                .map((_, idx) => <TableRowSkeleton key={idx} />)
                        ) : passengers.length > 0 ? (
                            passengers?.map((p: any) => (
                                <tr key={p.passenger_id} className='hover:bg-gray-50 transition-colors duration-150'>
                                    {/* SỬA: Dùng p.passenger_id */}
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                        {p.passenger_id}
                                    </td>
                                    {/* SỬA: Dùng p.last_name */}
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{p.last_name}</td>
                                    {/* SỬA: Dùng p.middle_name */}
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {p.middle_name || ''}
                                    </td>
                                    {/* SỬA: Dùng p.first_name */}
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {p.first_name}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{p.title}</td>
                                    {/* THÊM: Giới tính */}
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {getGenderLabel(p.gender)}
                                    </td>
                                    {/* SỬA: Dùng p.citizen_id */}
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {p.citizen_id || ''}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {/* SỬA: Dùng p.date_of_birth */}
                                        {formatDate(p.date_of_birth)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {p.nationality}
                                    </td>
                                    {/* THÊM: Hộ chiếu */}
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {p.passport_number || ''}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {formatDate(p.passport_expiry)}
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {/* SỬA: Dùng p.passenger_type */}
                                        {getTypeBadge(p.passenger_type)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                        <div className='flex items-center space-x-3'>
                                            <button
                                                title='Sửa'
                                                className='border border-green-600 rounded-md text-green-600 hover:bg-yellow-50 transition-colors duration-150 p-2'
                                                onClick={() => onEdit(p)}
                                            >
                                                <FontAwesomeIcon icon={faPenToSquare} className='h-4 w-4' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                {/* SỬA: Cập nhật colSpan (13 cột) */}
                                <td colSpan={13} className='px-6 py-10 text-center text-sm text-gray-500'>
                                    Không tìm thấy hành khách nào phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
