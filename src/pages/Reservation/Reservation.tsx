import React, { useState, useMemo } from 'react'
import {  faSearch, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import Paginate from '~/components/Pagination'
import BookingDetailModal from './components/BookingDetailModal/BookingDetailModal'
import { bookingApi } from '~/apis/booking.api'
import { formatCurrencyVND, formatDateTime } from '~/utils/utils'
import { BookingHistoryItem } from '~/types/reservation.type'
import useFlightQueryConfig from '~/hooks/useSearchFlightQueryConfig'

// --- Helper: Hiển thị Badge Trạng thái ---
const getStatusBadge = (status: string) => {
    switch (status) {
        case 'pending':
            return (
                <span className='bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold border border-yellow-200 whitespace-nowrap'>
                    Chờ thanh toán
                </span>
            )
        case 'confirmed':
            return (
                <span className='bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold border border-green-200 whitespace-nowrap'>
                    Đã xác nhận
                </span>
            )
        case 'completed':
            return (
                <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold border border-blue-200 whitespace-nowrap'>
                    Đã hoàn thành
                </span>
            )
        case 'cancelled':
            return (
                <span className='bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold border border-gray-200 whitespace-nowrap'>
                    Đã hủy
                </span>
            )
        case 'pending_cancellation':
            return (
                <span className='bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 whitespace-nowrap'>
                    Chờ hủy vé
                </span>
            )
        case 'cancellation_rejected':
            return (
                <span className='bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold border border-red-200 whitespace-nowrap'>
                    Từ chối hủy
                </span>
            )
        default:
            return (
                <span className='bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-semibold border border-gray-200 whitespace-nowrap'>
                    {status}
                </span>
            )
    }
}

// Component Skeleton Card
const StatBoxSkeleton: React.FC = () => (
    <div className='col-span-12 md:col-span-6 lg:col-span-3'>
        <div className='w-full h-[100px] rounded-lg border border-gray-200 bg-white p-4 animate-pulse shadow-sm'>
            <div className='h-4 bg-gray-200 rounded w-1/2 mb-2'></div>
            <div className='h-8 bg-gray-200 rounded w-1/3'></div>
        </div>
    </div>
)

// Component Skeleton Bảng
const TableRowSkeleton: React.FC = () => (
    <tr className='animate-pulse'>
        {Array(8)
            .fill(0)
            .map((_, idx) => (
                <td key={idx} className='px-6 py-4 border-b border-gray-100'>
                    <div className='h-4 bg-gray-200 rounded w-full'></div>
                </td>
            ))}
    </tr>
)

export default function Reservation() {
    const [selectedBookingRef, setSelectedBookingRef] = useState<number | null>(null)

    const queryConfig = useFlightQueryConfig()
    const page = Number(queryConfig.page || 1)
    const [limit, setLimit] = useState(5)
    const [search, setSearch] = useState('')

    const {
        data: bookingsData,
        isLoading,
    } = useQuery({
        queryKey: ['myBookings', page, limit, search],
        queryFn: () => bookingApi.getBookingsHistory({ page, limit, search: search.length > 0 ? search : undefined }),
        staleTime: 1000 * 60 * 3
    })

    const bookings = bookingsData?.data.data || []
    const pagination = bookingsData?.data.meta.pagination

    // --- Tính toán Tóm tắt (Dựa trên dữ liệu trang hiện tại) ---
    const summaryStats = useMemo(() => {
        if (!bookings) return { total: 0, success: 0, pending: 0, cancel: 0 }

        // Success: Confirmed + Completed
        const successCount = bookings.filter((b) => ['confirmed', 'completed'].includes(b.status)).length

        // Pending: Pending Payment
        const pendingCount = bookings.filter((b) => b.status === 'pending').length

        // Cancel/Processing: Cancelled + Pending Cancellation
        const cancelCount = bookings.filter((b) =>
            ['cancelled', 'pending_cancellation', 'cancellation_rejected'].includes(b.status)
        ).length

        return {
            total: pagination?.totalItems || 0,
            success: successCount,
            pending: pendingCount,
            cancel: cancelCount
        }
    }, [bookings, pagination])

    // Hàm mở/đóng modal
    const handleOpenDetailModal = (booking_id: number) => setSelectedBookingRef(booking_id)
    const handleCloseDetailModal = () => setSelectedBookingRef(null)

    return (
        <div className='bg-gray-50'>
            <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
                <h1 className='text-2xl font-bold text-gray-900 mb-6'>Lịch sử đặt chỗ của tôi</h1>

                {/* --- Ô TÓM TẮT --- */}
                <div className='grid grid-cols-12 gap-4 mb-8'>
                    {isLoading ? (
                        <>
                            <StatBoxSkeleton />
                            <StatBoxSkeleton />
                            <StatBoxSkeleton />
                            <StatBoxSkeleton />
                        </>
                    ) : (
                        <>
                            <div className='col-span-12 md:col-span-6 lg:col-span-3'>
                                <div className='bg-white rounded-lg p-5 shadow-sm border-l-4 border-blue-500'>
                                    <p className='text-sm text-gray-500 font-medium'>Tổng đơn đặt</p>
                                    <p className='text-3xl font-bold text-gray-800 mt-1'>{summaryStats.total}</p>
                                </div>
                            </div>
                            <div className='col-span-12 md:col-span-6 lg:col-span-3'>
                                <div className='bg-white rounded-lg p-5 shadow-sm border-l-4 border-green-500'>
                                    <p className='text-sm text-gray-500 font-medium'>Thành công (Vé đã xuất)</p>
                                    <p className='text-3xl font-bold text-green-600 mt-1'>{summaryStats.success}</p>
                                </div>
                            </div>
                            <div className='col-span-12 md:col-span-6 lg:col-span-3'>
                                <div className='bg-white rounded-lg p-5 shadow-sm border-l-4 border-yellow-500'>
                                    <p className='text-sm text-gray-500 font-medium'>Chờ thanh toán</p>
                                    <p className='text-3xl font-bold text-yellow-600 mt-1'>{summaryStats.pending}</p>
                                </div>
                            </div>
                            <div className='col-span-12 md:col-span-6 lg:col-span-3'>
                                <div className='bg-white rounded-lg p-5 shadow-sm border-l-4 border-red-500'>
                                    <p className='text-sm text-gray-500 font-medium'>Hủy / Yêu cầu hủy</p>
                                    <p className='text-3xl font-bold text-red-600 mt-1'>{summaryStats.cancel}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* --- THANH CÔNG CỤ (Filter & Search) --- */}
                <div className='bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4'>
                    {/* Limit Selector */}
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <span>Hiển thị</span>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className='border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500 outline-none'
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                        <span>bản ghi</span>
                    </div>

                    {/* Search Input */}
                    <div className='relative w-full md:w-72'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <FontAwesomeIcon icon={faSearch} className='text-gray-400' />
                        </div>
                        <input
                            type='text'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='Tìm theo mã đặt chỗ, sân bay...'
                            className='text-black block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                        />
                    </div>
                </div>

                {/* --- BẢNG DỮ LIỆU --- */}
                <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full divide-y divide-gray-200'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                    >
                                        Mã đặt chỗ
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                    >
                                        Ngày đặt
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                    >
                                        Hành trình
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                    >
                                        Chuyến bay
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                    >
                                        SL Khách
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                    >
                                        Tổng tiền
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                    >
                                        Trạng thái
                                    </th>
                                    <th scope='col' className='relative px-6 py-3'>
                                        <span className='sr-only'>Hành động</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                                {isLoading && <TableRowSkeleton />}

                                {!isLoading && bookings.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className='px-6 py-10 text-center text-sm text-gray-500'>
                                            Không tìm thấy lịch sử đặt chỗ nào.
                                        </td>
                                    </tr>
                                )}

                                {!isLoading &&
                                    bookings.length > 0 &&
                                    bookings.map((booking: BookingHistoryItem) => (
                                        <tr key={booking.booking_id} className='hover:bg-gray-50 transition-colors'>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600'>
                                                {booking.booking_reference}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                                {formatDateTime(booking.created_at)}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='font-medium'>
                                                        {booking.flight.departure_airport_code}
                                                    </span>
                                                    <span className='text-gray-400'>→</span>
                                                    <span className='font-medium'>
                                                        {booking.flight.arrival_airport_code}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                                {booking.flight.flight_number}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                                {booking.trip_type === 'round-trip'
                                                    ? booking.passenger_count / 2
                                                    : booking.passenger_count}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900'>
                                                {formatCurrencyVND(parseFloat(booking.total_amount))}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                {getStatusBadge(booking.status)}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                                <button
                                                    onClick={() => handleOpenDetailModal(Number(booking.booking_id))}
                                                    className='text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ml-auto'
                                                >
                                                    <FontAwesomeIcon icon={faEye} className='w-3 h-3' />
                                                    Chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className='px-6 py-4 border-t border-gray-200 flex items-center justify-between'>
                            <div className='text-sm text-gray-500'>
                                Hiển thị {bookings.length} trên tổng số {pagination.totalItems} kết quả
                            </div>
                            <Paginate pageSize={pagination.totalPages} queryConfig={queryConfig} />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Chi Tiết */}
            <BookingDetailModal
                isOpen={!!selectedBookingRef}
                onClose={handleCloseDetailModal}
                bookingReference={selectedBookingRef}
            />
        </div>
    )
}
