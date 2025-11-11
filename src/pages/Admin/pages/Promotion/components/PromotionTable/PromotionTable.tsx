import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Promotion } from '../../Promotion'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { TrashIcon } from 'lucide-react'

interface PromotionTableProps {
    promotions: Promotion[]
    onEdit: (promotion: Promotion) => void
    onDelete: (id: string) => void
}

// Hàm helper để format ngày YYYY-MM-DD sang DD/MM/YYYY
const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
        const [year, month, day] = dateString.split('-')
        return `${day}/${month}/${year}`
    } catch (e) {
        return dateString
    }
}

export default function PromotionTable({ onDelete, onEdit, promotions }: PromotionTableProps) {
    return (
        <div className='bg-white rounded-lg shadow-md overflow-hidden mt-6'>
            {/* Bảng */}
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th scope='col' className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase'>
                                Mã KM
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase'>
                                Tên KM
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase'>
                                Loại
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase'>
                                Giá trị
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase'>
                                Ngày Bắt Đầu
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase'>
                                Ngày Kết Thúc
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase'>
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {promotions.length > 0 ? (
                            promotions.map((promo) => (
                                <tr key={promo.id} className='hover:bg-gray-50'>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                        {promo.id}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{promo.name}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>{promo.type}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {promo.type === 'Phần trăm'
                                            ? `${promo.value}%`
                                            : promo.value.toLocaleString('vi-VN')}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {formatDate(promo.startDate)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {formatDate(promo.endDate)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                        <div className='flex items-center space-x-3'>
                                            <button
                                                title='Sửa'
                                                className='border border-green-600 rounded-md text-green-600 hover:text-green-800 transition-colors duration-150 p-2 bg-white'
                                                onClick={() => onEdit(promo)}
                                            >
                                                <FontAwesomeIcon icon={faPenToSquare} className='h-5 w-5' />
                                            </button>
                                            <button
                                                title='Xóa'
                                                className='border border-red-600 text-red-600 rounded-md hover:text-red-800 transition-colors duration-150 p-2 bg-white'
                                                onClick={() => onDelete(promo.id)}
                                            >
                                                <TrashIcon className='h-5 w-5' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className='px-6 py-10 text-center text-sm text-gray-500'>
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
