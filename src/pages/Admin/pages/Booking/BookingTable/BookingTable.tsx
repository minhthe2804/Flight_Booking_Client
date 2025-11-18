import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEye,
    faBan,
    faCheckCircle,
    faClock,
    faTimesCircle,
    faExclamationCircle,
    faSpinner,
    faCheckDouble
} from '@fortawesome/free-solid-svg-icons'
import { formatCurrencyVND, formatDateTime } from '~/utils/utils'
import { Booking } from '~/apis/bookingadmin.api'

interface BookingTableProps {
    bookings: Booking[] | any
    isLoading: boolean
    onViewDetail: (id: number) => void
    onCancel: (id: number) => void
    adminTable?: boolean
}

// Helper hiển thị Badge
const getStatusBadge = (status: string) => {
    switch (status) {
        case 'confirmed':
            return (
                <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-400 flex items-center gap-1 w-fit whitespace-nowrap'>
                    <FontAwesomeIcon icon={faCheckCircle} /> Đã xác nhận
                </span>
            )
        case 'completed':
            return (
                <span className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-400 flex items-center gap-1 w-fit whitespace-nowrap'>
                    <FontAwesomeIcon icon={faCheckCircle} /> Hoàn thành
                </span>
            )
        case 'pending':
            return (
                <span className='bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded border border-yellow-400 flex items-center gap-1 w-fit whitespace-nowrap'>
                    <FontAwesomeIcon icon={faClock} /> Chờ thanh toán
                </span>
            )
        case 'cancelled':
            return (
                <span className='bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-300 flex items-center gap-1 w-fit whitespace-nowrap'>
                    <FontAwesomeIcon icon={faTimesCircle} /> Đã hủy
                </span>
            )
        case 'pending_cancellation':
            return (
                <span className='bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded border border-red-400 flex items-center gap-1 w-fit whitespace-nowrap animate-pulse'>
                    <FontAwesomeIcon icon={faExclamationCircle} /> Chờ hủy vé
                </span>
            )
        case 'cancellation_rejected':
            return (
                <span className='bg-gray-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded border border-red-300 flex items-center gap-1 w-fit whitespace-nowrap'>
                    <FontAwesomeIcon icon={faBan} /> Từ chối hủy
                </span>
            )
        default:
            return <span className='bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded'>{status}</span>
    }
}

export default function BookingTable({ bookings, isLoading, onViewDetail, onCancel,adminTable }: BookingTableProps) {
    if (isLoading)
        return (
            <div className='p-10 text-center'>
                <FontAwesomeIcon icon={faSpinner} spin size='2x' className='text-blue-500' />
            </div>
        )

    return (
        <div className='bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200'>
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Mã PNR
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Khách hàng
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Ngày đặt
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Tổng tiền
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Trạng thái
                            </th>
                            <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan={6} className='p-6 text-center text-gray-500 italic'>
                                    Không có dữ liệu đặt chỗ.
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking: Booking) => (
                                <tr key={booking.booking_id} className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600'>
                                        {booking.booking_reference}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                        <div className='font-medium'>
                                            {booking.User.first_name} {booking.User.last_name}
                                        </div>
                                        <div className='text-xs text-gray-500'>{booking.contact_email}</div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {formatDateTime(booking.booking_date)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600'>
                                        {formatCurrencyVND(Number(booking.final_amount))}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>{getStatusBadge(booking.status)}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                        <div className='flex justify-end items-center gap-2'>
                                            <button
                                                onClick={() => onViewDetail(booking.booking_id)}
                                                className='text-gray-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition-colors'
                                                title='Xem chi tiết'
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>

                                            {/* Logic hiển thị nút Hành động */}
                                            {adminTable && booking.status === 'pending_cancellation' && (
                                                // Nếu đang chờ hủy -> Hiện nút "Xử lý" nổi bật
                                                <button
                                                    onClick={() => onCancel(booking.booking_id)}
                                                    className='bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 border border-red-200 shadow-sm'
                                                    title='Xử lý yêu cầu hủy'
                                                >
                                                    <FontAwesomeIcon icon={faCheckDouble} /> Xử lý
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
