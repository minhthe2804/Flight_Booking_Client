import { useState, useMemo } from 'react'
import { faInfo, faSort, faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useQuery } from '@tanstack/react-query'

import Paginate from '~/components/Pagination'

import BookingDetailModal from './components/BookingDetailModal/BookingDetailModal'
import { bookingApi } from '~/apis/booking.api'
import { formatCurrencyVND, formatDateTime } from '~/utils/utils'
import { BookingHistoryItem } from '~/types/reservation.type'
import useFlightQueryConfig from '~/hooks/useSearchFlightQueryConfig'

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'confirmed':
            return (
                <span className='bg-green-600 text-white px-2 py-1 rounded-lg text-[12px] font-medium'>
                    Đã xác nhận
                </span>
            )
        case 'pending':
            return (
                <span className='bg-yellow-500 text-white px-2 py-1 rounded-lg text-[12px] font-medium'>
                    Chờ thanh toán
                </span>
            )
        case 'cancelled':
            return (
                <span className='bg-slate-300 text-white px-2 py-1 rounded-lg text-[12px] font-medium'>
                    Đang chờ xác nhận
                </span>
            )
        default:
            return <span className='bg-gray-500 text-white px-2 py-1 rounded-lg text-[12px] font-medium'>{status}</span>
    }
}

// Component Skeleton Card (giữ nguyên)
const StatBoxSkeleton: React.FC = () => (
    <div className='col-span-4'>
        <div className='w-full h-[100px] rounded border border-gray-200 bg-gray-100 py-2 pl-4 animate-pulse'>
            <div className='h-5 bg-gray-200 rounded w-3/4'></div>
            <div className='h-8 bg-gray-200 rounded w-1/4 mt-2'></div>
        </div>
    </div>
)

// Component Skeleton Bảng (giữ nguyên)
const TableRowSkeleton: React.FC = () => (
    <tr className='animate-pulse'>
        <td className='pl-2 py-4 border-b border-gray-200'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        {/* ... (các <td> khác giữ nguyên) ... */}
        <td className='pl-2 py-4 border-b border-gray-200'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        <td className='pl-2 py-4 border-b border-gray-200'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        <td className='pl-2 py-4 border-b border-gray-200'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        <td className='pl-2 py-4 border-b border-gray-200'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        <td className='pl-2 py-4 border-b border-gray-200'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        <td className='pl-2 py-4 border-b border-gray-200'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
        <td className='pl-2 py-4 border-b border-gray-200'>
            <div className='h-4 bg-gray-200 rounded'></div>
        </td>
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
        isError
    } = useQuery({
        queryKey: ['myBookings', page, limit, search],
        queryFn: () => bookingApi.getBookingsHistory({ page, limit, search: search.length > 0 ? search : undefined }),
        staleTime: 1000 * 60 * 3
    })
    const bookings = bookingsData?.data.data || []
    const pagination = bookingsData?.data.meta.pagination

    // Tính toán các ô tóm tắt (giữ nguyên)
    const summaryStats = useMemo(() => {
        if (!pagination) return { total: 0, confirmed: 0, pending: 0, cancelled: 0 } // Thêm cancelled
        const confirmed = bookings.filter((b) => b.status === 'confirmed').length
        const pending = bookings.filter((b) => b.status === 'pending').length
        const cancelled = bookings.filter((b) => b.status === 'cancelled').length // Thêm
        return {
            total: pagination.totalItems,
            confirmed: confirmed,
            pending: pending,
            cancelled: cancelled // Thêm
        }
    }, [pagination, bookings])

    //  Hàm mở modal chi tiết
    const handleOpenDetailModal = (booking_id: number) => {
        setSelectedBookingRef(booking_id)
    }

    //  Hàm đóng modal chi tiết
    const handleCloseDetailModal = () => {
        setSelectedBookingRef(null)
    }

    return (
        <div>
            <div className='max-w-[1278px] mx-auto py-8 px-4'>
                <h1 className='text-[24px] text-black text-center mt-4 font-semibold'>Dach sách đặt chỗ</h1>

                {/* --- Ô TÓM TẮT (Cập nhật 4 cột) --- */}
                <div className='grid grid-cols-12 mt-5 gap-6'>
                    {isLoading ? (
                        <>
                            <StatBoxSkeleton />
                            <StatBoxSkeleton />
                            <StatBoxSkeleton />
                        </>
                    ) : (
                        <>
                            <div className='col-span-3'>
                                <div className='w-full h-[100px] rounded border border-gray-200 bg-blue-50 py-2 pl-4 font-semibold text-blue-800'>
                                    <p className='text-[18px]'>Tổng đặt chỗ</p>
                                    <b className='text-[30px] font-medium'>{summaryStats.total}</b>
                                </div>
                            </div>
                            <div className='col-span-3'>
                                <div className='w-full h-[100px] rounded border border-gray-200 bg-green-50 py-2 pl-4 font-semibold text-green-800'>
                                    <p className='text-[18px]'>Đã xác nhận</p>
                                    <b className='text-[30px] font-medium'>{summaryStats.confirmed}</b>
                                </div>
                            </div>
                            <div className='col-span-3'>
                                <div className='w-full h-[100px] rounded border border-gray-200 bg-yellow-50 py-2 pl-4 font-semibold text-yellow-800'>
                                    <p className='text-[18px]'>Chờ thanh toán</p>
                                    <b className='text-[30px] font-medium'>{summaryStats.pending}</b>
                                </div>
                            </div>
                            <div className='col-span-3'>
                                <div className='w-full h-[100px] rounded border border-gray-200 bg-slate-300 py-2 pl-4 font-semibold text-gray-600'>
                                    <p className='text-[18px]'>Đang chờ xác nhận</p>
                                    <b className='text-[30px] font-medium'>{summaryStats.cancelled}</b>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* --- Thanh tìm kiếm và phân trang (Giữ nguyên) --- */}
                <div className='rounded border border-gray-200 bg-white shadow-sm pb-8 pt-4 px-4 mt-5'>
                    <div className='flex items-center justify-between'>
                        {/* ... (select limit) ... */}
                        <div className='flex items-center space-x-2 text-gray-700'>
                            <span className='text-[16px] font-medium'>Hiển thị</span>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value))
                                }}
                                className='border border-gray-300 rounded px-2 py-1 text-[13px] outline-none'
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                            <span className='text-[16px] font-medium'>bản ghi</span>
                        </div>
                        {/* ... (search input) ... */}
                        <div className='flex items-center gap-1'>
                            <label className='text-[16px] text-gray-700 font-medium'>Tìm kiếm:</label>
                            <div className='relative'>
                                <input
                                    type='text'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder='Mã đặt chỗ, Sân bay...'
                                    className='border border-gray-300 rounded px-3 py-[6px] text-sm outline-none text-[18px] text-black w-[250px] pr-8'
                                />
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- BẢNG DỮ LIỆU (Đã sửa cột Chi tiết) --- */}
                    <table className='w-full text-left border-collapse mt-4'>
                        <thead>
                            <tr className='bg-gray-100'>
                                {/* ... (các <th> khác giữ nguyên) ... */}
                                <th className='p-2 border-b border-gray-300 text-sm font-semibold text-black'>
                                    Mã đặt chỗ <FontAwesomeIcon icon={faSort} className='text-[14px] opacity-35' />
                                </th>
                                <th className='p-2 border-b border-gray-300 text-sm font-semibold text-black'>
                                    Ngày mua <FontAwesomeIcon icon={faSort} className='text-[14px] opacity-35' />
                                </th>
                                <th className='p-2 border-b border-gray-300 text-sm font-semibold text-black'>
                                    Thông tin đặt chỗ{' '}
                                    <FontAwesomeIcon icon={faSort} className='text-[14px] opacity-35' />
                                </th>
                                <th className='p-2 border-b border-gray-300 text-sm font-semibold text-black'>
                                    Chuyến bay <FontAwesomeIcon icon={faSort} className='text-[14px] opacity-35' />
                                </th>
                                <th className='p-2 border-b border-gray-300 text-sm font-semibold text-black'>
                                    Số khách <FontAwesomeIcon icon={faSort} className='text-[14px] opacity-35' />
                                </th>
                                <th className='p-2 border-b border-gray-300 text-sm font-semibold text-black'>
                                    Tổng tiền <FontAwesomeIcon icon={faSort} className='text-[14px] opacity-35' />
                                </th>
                                <th className='p-2 border-b border-gray-300 text-sm font-semibold text-black'>
                                    Trạng thái <FontAwesomeIcon icon={faSort} className='text-[14px] opacity-35' />
                                </th>
                                <th className='p-2 border-b border-gray-300 text-sm font-semibold text-black text-center'>
                                    Chi tiết
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* === HIỂN THỊ LOADING HOẶC LỖI TRONG BẢNG (Giữ nguyên) === */}
                            {isLoading &&
                                Array(limit)
                                    .fill(0)
                                    .map((_, idx) => <TableRowSkeleton key={idx} />)}
                            {/* {isError && (
                                <tr>
                                    <td colSpan={8} className='text-center p-4 text-red-600'>
                                        <FontAwesomeIcon icon={faExclamationTriangle} className='mr-2' />
                                        Lỗi khi tải dữ liệu.
                                    </td>
                                </tr>
                            )} */}
                            {!isLoading && bookings.length === 0 && (
                                <tr>
                                    <td colSpan={8} className='text-center p-4 text-gray-500'>
                                        Không tìm thấy đơn đặt chỗ nào.
                                    </td>
                                </tr>
                            )}

                            {/* === LẶP DỮ LIỆU THẬT (Cập nhật nút) === */}
                            {!isLoading &&
                                !isError &&
                                bookings.length > 0 &&
                                bookings.map((booking: BookingHistoryItem) => (
                                    <tr
                                        key={booking.booking_id}
                                        className={'hover:bg-slate-100 transition duration-100 ease-in'}
                                    >
                                        <td className='pl-2 py-4 border-b border-gray-200 text-base font-semibold text-blue-600'>
                                            {booking.booking_reference}
                                        </td>
                                        <td className='pl-2 py-4 border-b border-gray-200 text-base'>
                                            {formatDateTime(booking.created_at)}
                                        </td>
                                        <td className='pl-2 py-4 border-b border-gray-200 text-base'>
                                            {booking.flight.departure_airport_code} →{' '}
                                            {booking.flight.arrival_airport_code}
                                        </td>
                                        <td className='pl-2 py-4 border-b border-gray-200 text-base'>
                                            {booking.flight.flight_number}
                                        </td>
                                        <td className='pl-2 py-4 border-b border-gray-200 text-base'>
                                            {booking.trip_type === 'round-trip'
                                                ? booking.passenger_count / 2
                                                : booking.passenger_count}
                                        </td>
                                        <td className='pl-2 py-4 border-b border-gray-200 text-base font-semibold'>
                                            {formatCurrencyVND(parseFloat(booking.total_amount))}
                                        </td>
                                        <td className='pl-2 py-4 border-b border-gray-200 text-base'>
                                            {getStatusBadge(booking.status)}
                                        </td>
                                        {/* ✅ NÚT XEM CHI TIẾT (Mở Modal) */}
                                        <td className='p-2 border-b border-gray-200 text-sm text-center'>
                                            <button
                                                onClick={() => handleOpenDetailModal(Number(booking.booking_id))}
                                                className='px-3 py-2 rounded text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors'
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                    {/* Phân trang (Giữ nguyên) */}
                    <div className='flex justify-between items-center mt-4 text-gray-700 text-sm'>
                        <span className='text-[16px] font-medium'>
                            Hiển thị {bookings.length} trong {pagination?.totalItems || 0} bản ghi
                        </span>
                        {pagination && pagination.totalPages > 1 && (
                            <Paginate
                                pageSize={pagination.totalPages}
                                queryConfig={queryConfig} // queryConfig giờ đã đúng kiểu
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* ✅ Render Modal Chi Tiết */}
            <BookingDetailModal
                isOpen={!!selectedBookingRef}
                onClose={handleCloseDetailModal}
                bookingReference={selectedBookingRef}
            />
        </div>
    )
}
