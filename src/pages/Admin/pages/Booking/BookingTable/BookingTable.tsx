import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEye,
    faBan,
    faCheckCircle,
    faClock,
    faTimesCircle,
    faExclamationCircle,
    faSpinner,
    faCheck,
    faSearch,
    faTimes
} from '@fortawesome/free-solid-svg-icons'
import { formatCurrencyVND, formatDateTime } from '~/utils/utils'
import { Booking } from '~/apis/bookingadmin.api'

interface BookingTableProps {
    bookings: Booking[] | any
    isLoading: boolean
    onViewDetail: (id: number) => void
    onCancel: (id: number) => void // Đây là nút "Hủy" hoặc "Duyệt Hủy"
    onReject?: (id: number) => void // Nút "Từ chối Hủy" (Optional)
    onSearch?: (value: string) => void
    searchValue?: string
    title?: string
    isAdmin?: boolean
}

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

export default function BookingTable({
    bookings,
    isLoading,
    onViewDetail,
    onCancel,
    onReject,
    onSearch,
    searchValue,
    title,
    isAdmin
}: BookingTableProps) {
    const [keyword, setKeyword] = useState(searchValue || '')

    useEffect(() => {
        setKeyword(searchValue || '')
    }, [searchValue])

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (onSearch) onSearch(keyword)
    }

    const handleClearSearch = () => {
        setKeyword('')
        if (onSearch) onSearch('')
    }

    if (isLoading)
        return (
            <div className='p-10 text-center'>
                <FontAwesomeIcon icon={faSpinner} spin size='2x' className='text-blue-500' />
            </div>
        )

    return (
        <div className='bg-white rounded-lg shadow-md overflow-hidden border border-gray-200'>
            {/* HEADER (Tiêu đề + Tìm kiếm) */}
            {(title || onSearch) && (
                <div className='px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center gap-4'>
                    {title ? (
                        <h3 className='text-lg font-bold text-gray-800 whitespace-nowrap'>{title}</h3>
                    ) : (
                        <div className='hidden sm:block'></div>
                    )}

                    {onSearch && (
                        <form onSubmit={handleSearchSubmit} className='relative w-full sm:w-72 sm:ml-auto'>
                            <input
                                type='text'
                                className='text-black w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all'
                                placeholder='Tìm theo mã đặt chỗ...'
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <FontAwesomeIcon icon={faSearch} className='text-gray-400' />
                            </div>
                            {keyword && (
                                <button
                                    type='button'
                                    onClick={handleClearSearch}
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer'
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            )}
                        </form>
                    )}
                </div>
            )}

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
                                <td colSpan={6} className='p-8 text-center text-gray-500 italic'>
                                    Không tìm thấy dữ liệu đặt chỗ nào.
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking: Booking) => (
                                <tr key={booking.booking_id} className='hover:bg-blue-50 transition-colors'>
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
                                                className='text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-100 transition-colors'
                                                title='Xem chi tiết'
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>

                                            {/* --- LOGIC NÚT HÀNH ĐỘNG CHO ADMIN --- */}

                                            {/* TRƯỜNG HỢP 1: Yêu cầu hủy vé (pending_cancellation) */}
                                            {isAdmin && booking.status === 'pending_cancellation' ? (
                                                <div className='flex gap-1'>
                                                    {/* Nút Duyệt (Màu xanh/đỏ tùy logic) - Ở đây dùng cancel làm nút duyệt */}
                                                    <button
                                                        onClick={() => onCancel(booking.booking_id)}
                                                        className='bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 border border-green-200 shadow-sm transition-all'
                                                        title='Duyệt hủy vé'
                                                    >
                                                        <FontAwesomeIcon icon={faCheck} /> Duyệt
                                                    </button>

                                                    {/* Nút Từ chối (Màu xám/đỏ) */}
                                                    {onReject && (
                                                        <button
                                                            onClick={() => onReject(booking.booking_id)}
                                                            className='bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 border border-gray-300 shadow-sm transition-all'
                                                            title='Từ chối hủy vé'
                                                        >
                                                            <FontAwesomeIcon icon={faBan} /> Từ chối
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                // TRƯỜNG HỢP 2: Các trạng thái khác (Confirmed, Pending) -> Cho phép Hủy chủ động
                                                isAdmin && !['cancelled', 'completed', 'cancellation_rejected'].includes(
                                                    booking.status
                                                ) && (
                                                    <button
                                                        onClick={() => onCancel(booking.booking_id)}
                                                        className='text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors'
                                                        title='Hủy vé này'
                                                    >
                                                        <FontAwesomeIcon icon={faBan} />
                                                    </button>
                                                )
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
