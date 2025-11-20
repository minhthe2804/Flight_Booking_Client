import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Promotion } from '~/apis/promotion.api' // Import kiểu Promotion
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faTrash, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { formatCurrencyVND, formatDateForAPI } from '~/utils/utils'

interface PromotionTableProps {
    promotions: Promotion[] | any
    isLoading: boolean
    onEdit: (promotion: Promotion) => void
    onDelete: (id: number) => void
}

// Component Skeleton Bảng
const TableRowSkeleton: React.FC = () => (
    <tr className='animate-pulse'>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/4'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
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
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/4'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-8 bg-gray-200 rounded w-full'></div>
        </td>
    </tr>
)

export default function PromotionTable({ promotions, isLoading, onEdit, onDelete }: PromotionTableProps) {
    // Helper (Định dạng giá trị)
    const formatDiscount = (p: Promotion) => {
        if (p.discount_type === 'percentage') {
            return `${p.discount_value}%`
        }
        return `${formatCurrencyVND(parseFloat(p.discount_value) * 1000)}`
    }

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
                                Mô tả
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Giá trị
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Đơn tối thiểu
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Hiệu lực
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Kích hoạt
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
                        ) : promotions.length > 0 ? (
                            promotions.map((promo: Promotion) => (
                                <tr
                                    key={promo.promotion_id}
                                    className='hover:bg-gray-50 transition-colors duration-150'
                                >
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                        {promo.promotion_id}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600'>
                                        {promo.promotion_code}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate'>
                                        {promo.description}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold'>
                                        {formatDiscount(promo)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {formatCurrencyVND(parseFloat(promo.min_purchase) * 1000)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        Từ ngày {formatDateForAPI(promo.start_date)} đến ngày{' '}
                                        {formatDateForAPI(promo.end_date)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize'>
                                        {promo.is_active ? (
                                            <FontAwesomeIcon
                                                icon={faCheckCircle}
                                                className='text-green-500'
                                                title='Đang hoạt động'
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faTimesCircle}
                                                className='text-red-500'
                                                title='Không hoạt động'
                                            />
                                        )}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                        <div className='flex items-center space-x-3'>
                                            <button
                                                title='Sửa'
                                                className='border border-yellow-600 rounded-md text-yellow-600 hover:bg-yellow-50 transition-colors duration-150 p-2'
                                                onClick={() => onEdit(promo)}
                                            >
                                                <FontAwesomeIcon icon={faPenToSquare} className='h-4 w-4' />
                                            </button>
                                            <button
                                                title='Xóa'
                                                className='border border-red-600 rounded-md text-red-600 hover:bg-red-50 transition-colors duration-150 p-2'
                                                onClick={() => onDelete(promo.promotion_id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className='h-4 w-4' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className='px-6 py-10 text-center text-sm text-gray-500'>
                                    Không tìm thấy khuyến mãi nào phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
