import { Fragment, useState, useMemo } from 'react'
import {
    faXmark,
    faSpinner,
    faExclamationTriangle,
    faPlaneUp,
    faUser,
    faTicket,
    faReceipt,
    faTrash,
    faCreditCard,
    faFilePdf
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingApi } from '~/apis/booking.api'
import { lookupApi } from '~/apis/lookup.api' // SỬA: Import API Lookup để lấy vé
import { BookingDetailItem } from '~/types/reservation.type'
import {
    formatCurrencyVND,
    formatDateTime,
    formatFlightTimeOnly,
    formatDurationLookup,
    formatDateForAPI
} from '~/utils/utils'
import { toast } from 'react-toastify'
import { isAxiosError } from 'axios'
import CancelBookingModal from '../CancelBookingModal'

interface BookingDetailModalProps {
    isOpen: boolean
    onClose: () => void
    bookingReference: number | null
    isAdmin?: boolean
    onPayment?: (id: number) => void
}

// ... (Giữ nguyên các interface GroupedFlight, ModalSkeleton, getStatusBadge)
// Kiểu dữ liệu cho chuyến bay đã được nhóm
interface GroupedFlight {
    flight: BookingDetailItem['Flight']
    passengers: BookingDetailItem[]
}

// Component Skeleton
const ModalSkeleton = () => (
    <div className='bg-white rounded-lg shadow-xl w-full max-w-4xl animate-pulse'>
        <div className='h-16 bg-gray-200 rounded-t-lg'></div>
        <div className='p-6 space-y-4'>
            <div className='h-8 bg-gray-200 rounded w-1/3'></div>
            <div className='flex gap-4'>
                <div className='w-1/2 space-y-2'>
                    <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                    <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                </div>
                <div className='w-1/2 space-y-2'>
                    <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                    <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                </div>
            </div>
            <div className='h-32 bg-gray-200 rounded'></div>
            <div className='h-24 bg-gray-200 rounded'></div>
        </div>
        <div className='h-16 bg-gray-200 rounded-b-lg'></div>
    </div>
)

// Helper: Hiển thị Badge Trạng thái
const getStatusBadge = (status: string) => {
    switch (status) {
        case 'pending':
            return (
                <span className='bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium border border-yellow-200 whitespace-nowrap'>
                    Chờ thanh toán
                </span>
            )
        case 'confirmed':
            return (
                <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200 whitespace-nowrap'>
                    Đã xác nhận
                </span>
            )
        case 'completed':
            return (
                <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200 whitespace-nowrap'>
                    Đã hoàn thành
                </span>
            )
        case 'cancelled':
            return (
                <span className='bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-gray-200 whitespace-nowrap'>
                    Đã hủy
                </span>
            )
        case 'pending_cancellation':
            return (
                <span className='bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium border border-orange-200 whitespace-nowrap'>
                    Chờ hủy vé
                </span>
            )
        case 'cancellation_rejected':
            return (
                <span className='bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium border border-red-200 whitespace-nowrap'>
                    Từ chối hủy
                </span>
            )
        default:
            return (
                <span className='bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium border border-gray-200 whitespace-nowrap'>
                    {status}
                </span>
            )
    }
}

export default function BookingDetailModal({ isOpen, onClose, bookingReference, isAdmin, onPayment }: BookingDetailModalProps) {
    const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false)
    const queryClient = useQueryClient()

    // 1. Gọi API lấy chi tiết booking
    const {
        data: bookingDetailData,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['bookingDetail', bookingReference],
        queryFn: () => bookingApi.getBookingInfomation(Number(bookingReference)),
        enabled: !!bookingReference && isOpen,
        staleTime: 1000 * 60 * 5
    })

    const booking = bookingDetailData?.data.data
    
    // --- SỬA: LOGIC TẢI VÉ ĐIỆN TỬ ---
    const eticketMutation = useMutation({
        mutationFn: (ref: string) => lookupApi.getEticket(ref),
        onSuccess: (response, ref) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `eticket-${ref}.pdf`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            toast.success('Đã tải vé điện tử thành công!')
        },
        onError: () => {
            toast.error('Tải vé điện tử thất bại.')
        }
    })

    const handleDownloadTicket = () => {
        if (!booking) return
        eticketMutation.mutate(booking.booking_reference)
    }
    // ----------------------------------

    // 2. Logic Hủy vé (Giữ nguyên)
    const cancelMutation = useMutation({
        mutationFn: (data: { bookingId: number; reason: string }) =>
            bookingApi.cancelBooking(data.bookingId, data.reason),
        onSuccess: (data) => {
            toast.success(data.data.message || 'Yêu cầu hủy đã được gửi!')
            queryClient.invalidateQueries({ queryKey: ['myBookings'] })
            queryClient.invalidateQueries({ queryKey: ['bookingDetail', bookingReference] })
            setIsConfirmCancelOpen(false)
        },
        onError: (error) => {
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi hủy')
            } else {
                toast.error('Có lỗi xảy ra khi hủy')
            }
        }
    })

    const handleSubmitCancellation = (data: { reason: string }) => {
        if (booking) {
            cancelMutation.mutate({ bookingId: booking.booking_id, reason: data.reason })
        }
    }

    // 3. Xử lý nhóm dữ liệu (Giữ nguyên)
    const groupedFlights = useMemo((): GroupedFlight[] => {
        if (!booking?.BookingDetails) return []

        const flightMap = new Map<number, GroupedFlight>()
        booking.BookingDetails.forEach((item) => {
            const flightId = item.Flight.flight_id
            if (!flightMap.has(flightId)) {
                flightMap.set(flightId, {
                    flight: item.Flight,
                    passengers: []
                })
            }
            flightMap.get(flightId)!.passengers.push(item as any)
        })
        return Array.from(flightMap.values())
    }, [booking])

    const uniquePassengers = useMemo((): BookingDetailItem['Passenger'][] => {
        if (!booking?.BookingDetails) return []
        const passengerMap = new Map<number, BookingDetailItem['Passenger']>()
        booking.BookingDetails.forEach((item) => {
            if (!passengerMap.has(item.Passenger.passenger_id)) {
                passengerMap.set(item.Passenger.passenger_id, item.Passenger)
            }
        })
        return Array.from(passengerMap.values())
    }, [booking])

    if (!isOpen) return null

    return (
        <Fragment>
            <div
                className='fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 overflow-y-auto'
                onClick={onClose}
            >
                <div
                    className='bg-white rounded-lg shadow-xl w-full max-w-4xl my-8 animate-fade-in-scale overflow-hidden flex flex-col'
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* === Header === */}
                    <div className='relative px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg flex items-center justify-between'>
                        <h2 className='text-lg font-semibold text-gray-800'>Chi tiết đặt chỗ</h2>
                        
                        <div className="flex items-center gap-3">
                             {booking && (booking.status === 'confirmed' || booking.status === 'completed') && (
                                <button
                                    onClick={handleDownloadTicket}
                                    disabled={eticketMutation.isPending}
                                    className='px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-md border border-blue-200 flex items-center gap-2 transition-colors'
                                    title="Tải vé điện tử (PDF)"
                                >
                                    {eticketMutation.isPending ? (
                                        <FontAwesomeIcon icon={faSpinner} spin />
                                    ) : (
                                        <FontAwesomeIcon icon={faFilePdf} />
                                    )}
                                    In vé điện tử
                                </button>
                             )}

                            <button
                                onClick={onClose}
                                className='text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100'
                                aria-label='Đóng'
                            >
                                <FontAwesomeIcon icon={faXmark} className='w-5 h-5' />
                            </button>
                        </div>
                    </div>

                    {/* === Body (Nội dung chính) === */}
                    <div className='p-6 overflow-y-auto' style={{ maxHeight: 'calc(100vh - 210px)' }}>
                        {isLoading && <ModalSkeleton />}

                        {isError && (
                            <div className='text-center text-red-600 p-10'>
                                <FontAwesomeIcon icon={faExclamationTriangle} size='2x' className='mb-2' />
                                <p>Không thể tải chi tiết đặt chỗ.</p>
                                <p className='text-sm text-gray-500'>
                                    {isAxiosError(error) && error.response?.data?.message}
                                </p>
                            </div>
                        )}

                        {!isLoading && !isError && booking && (
                            <div className='space-y-6'>
                                {/* --- 1. Thông tin chung --- */}
                                <div className='p-4 rounded-lg border border-gray-200 bg-white'>
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <p className='text-sm text-gray-500'>Mã đặt chỗ (PNR)</p>
                                            <h3 className='text-2xl font-bold text-blue-600'>
                                                {booking.booking_reference}
                                            </h3>
                                        </div>
                                        {getStatusBadge(booking.status)}
                                    </div>
                                    <hr className='my-4' />
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm'>
                                        <div>
                                            <span className='text-gray-500'>Ngày đặt: </span>
                                            <strong className='text-gray-900'>
                                                {formatDateTime(booking.booking_date)}
                                            </strong>
                                        </div>
                                        <div>
                                            <span className='text-gray-500'>Loại vé: </span>
                                            <strong className='text-gray-900 capitalize'>
                                                {booking.trip_type === 'round-trip' ? 'Khứ hồi' : 'Một chiều'}
                                            </strong>
                                        </div>
                                        <div>
                                            <span className='text-gray-500'>Người liên hệ: </span>
                                            <strong className='text-gray-900'>{booking.contact_email}</strong>
                                        </div>
                                        <div>
                                            <span className='text-gray-500'>Số điện thoại: </span>
                                            <strong className='text-gray-900'>{booking.contact_phone}</strong>
                                        </div>
                                        {(booking.status === 'cancelled' ||
                                            booking.status === 'cancellation_rejected') && (
                                            <div className='col-span-2 bg-red-50 p-2 rounded mt-2 border border-red-100'>
                                                <span className='text-gray-500'>Lý do hủy: </span>
                                                <strong className='text-red-600'>
                                                    {booking.cancellation_reason || 'Không có lý do cụ thể'}
                                                </strong>
                                            </div>
                                        )}
                                        {booking.status === 'pending_cancellation' && (
                                            <div className='col-span-2 bg-orange-50 p-2 rounded mt-2 border border-orange-100'>
                                                <span className='text-orange-800 font-medium'>
                                                    Yêu cầu hủy đang được xử lý.
                                                </span>
                                                {booking.cancellation_reason && (
                                                    <p className='text-sm text-gray-600 mt-1'>
                                                        Lý do: {booking.cancellation_reason}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* --- 2. Chi tiết chuyến bay --- */}
                                <div className='space-y-4'>
                                    <h4 className='text-base font-semibold text-gray-700 flex items-center'>
                                        <FontAwesomeIcon icon={faTicket} className='mr-2 text-blue-500' />
                                        Chi tiết hành trình
                                    </h4>
                                    {groupedFlights.map((group, index) => (
                                        <div key={index} className='p-4 rounded-lg border border-gray-200'>
                                            {/* Header Chuyến bay */}
                                            <div className='flex items-center space-x-3 mb-3'>
                                                <div>
                                                    <p className='font-semibold text-gray-800'>
                                                        {group.flight.Airline.airline_name}
                                                    </p>
                                                    <p className='text-xs text-gray-500'>
                                                        {group.flight.flight_number} | {group.flight.Aircraft.model}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Nội dung Chuyến bay */}
                                            <div className='flex items-center justify-between text-center'>
                                                {/* Cất cánh */}
                                                <div className='flex-1'>
                                                    <p className='text-xl font-bold text-blue-600'>
                                                        {formatFlightTimeOnly(group.flight.departure_time)}
                                                    </p>
                                                    <p className='text-sm font-semibold'>
                                                        {group.flight.DepartureAirport.airport_code}
                                                    </p>
                                                    <p className='text-xs text-gray-500'>
                                                        {group.flight.DepartureAirport.city}
                                                    </p>
                                                    <p className='text-xs text-gray-500'>
                                                        {formatDateForAPI(group.flight.departure_time)}
                                                    </p>
                                                </div>
                                                {/* Đường bay */}
                                                <div className='flex-1 px-2'>
                                                    <div className='text-xs text-gray-500'>
                                                        {formatDurationLookup(
                                                            group.flight.departure_time,
                                                            group.flight.arrival_time
                                                        )}
                                                    </div>
                                                    <div className='flex items-center text-blue-400'>
                                                        <hr className='flex-grow border-t-2 border-dotted' />
                                                        <FontAwesomeIcon icon={faPlaneUp} className='mx-2' />
                                                        <hr className='flex-grow border-t-2 border-dotted' />
                                                    </div>
                                                </div>
                                                {/* Hạ cánh */}
                                                <div className='flex-1'>
                                                    <p className='text-xl font-bold text-blue-600'>
                                                        {formatFlightTimeOnly(group.flight.arrival_time)}
                                                    </p>
                                                    <p className='text-sm font-semibold'>
                                                        {group.flight.ArrivalAirport.airport_code}
                                                    </p>
                                                    <p className='text-xs text-gray-500'>
                                                        {group.flight.ArrivalAirport.city}
                                                    </p>
                                                    <p className='text-xs text-gray-500'>
                                                        {formatDateForAPI(group.flight.arrival_time)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* --- 3. Thông tin hành khách --- */}
                                <div>
                                    <h4 className='text-base font-semibold text-gray-700 flex items-center mb-3'>
                                        <FontAwesomeIcon icon={faUser} className='mr-2 text-blue-500' />
                                        Thông tin hành khách
                                    </h4>
                                    <div className='p-4 rounded-lg border border-gray-200 space-y-4'>
                                        {uniquePassengers.map((passenger) => (
                                            <div
                                                key={passenger.passenger_id}
                                                className='text-sm border-b border-gray-100 pb-3 last:border-b-0'
                                            >
                                                <div className='flex justify-between items-center'>
                                                    <strong className='text-gray-900 capitalize text-base'>
                                                        {passenger.title}. {passenger.first_name} {passenger.last_name}
                                                    </strong>
                                                    <span className='text-gray-500 ml-2 text-xs'>
                                                        ({passenger.passenger_type})
                                                    </span>
                                                </div>
                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-gray-600'>
                                                    <p>
                                                        Ngày sinh:{' '}
                                                        <b className='text-gray-800'>
                                                            {formatDateForAPI(passenger.date_of_birth)}
                                                        </b>
                                                    </p>
                                                    <p>
                                                        Quốc tịch:{' '}
                                                        <b className='text-gray-800'>{passenger.nationality}</b>
                                                    </p>
                                                    {passenger.citizen_id && (
                                                        <p>
                                                            CCCD:{' '}
                                                            <b className='text-gray-800'>{passenger.citizen_id}</b>
                                                        </p>
                                                    )}
                                                    {passenger.passport_number && (
                                                        <p>
                                                            Hộ chiếu:{' '}
                                                            <b className='text-gray-800'>{passenger.passport_number}</b>
                                                        </p>
                                                    )}
                                                    {passenger.passport_expiry && (
                                                        <p>
                                                            Hết hạn:{' '}
                                                            <b className='text-gray-800'>
                                                                {formatDateForAPI(passenger.passport_expiry)}
                                                            </b>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* --- 4. Chi tiết giá --- */}
                                <div>
                                    <h4 className='text-base font-semibold text-gray-700 flex items-center mb-3'>
                                        <FontAwesomeIcon icon={faReceipt} className='mr-2 text-blue-500' />
                                        Chi tiết thanh toán
                                    </h4>
                                    <div className='p-4 rounded-lg border border-gray-200 space-y-2 text-sm'>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-600'>
                                                Giá vé ({uniquePassengers.length} khách)
                                            </span>
                                            <span className='font-medium text-gray-800'>
                                                {formatCurrencyVND(Number(booking.base_amount))}
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-600'>Phí hành lý</span>
                                            <span className='font-medium text-gray-800'>
                                                {formatCurrencyVND(Number(booking.baggage_fees))}
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-600'>Phí suất ăn</span>
                                            <span className='font-medium text-gray-800'>
                                                {formatCurrencyVND(Number(booking.meal_fees))}
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-600'>Phí gói dịch vụ</span>
                                            <span className='font-medium text-gray-800'>
                                                {formatCurrencyVND(Number(booking.service_package_fees))}
                                            </span>
                                        </div>
                                        {parseFloat(booking.discount_amount) > 0 && (
                                            <div className='flex justify-between text-green-600'>
                                                <span className=''>Giảm giá ({booking.discount_code})</span>
                                                <span className='font-medium'>
                                                    -{formatCurrencyVND(Number(booking.discount_amount))}
                                                </span>
                                            </div>
                                        )}
                                        <hr className='my-2' />
                                        <div className='flex justify-between font-bold text-base'>
                                            <span className='text-gray-900'>Tổng cộng</span>
                                            <span className='text-orange-600'>
                                                {formatCurrencyVND(Number(booking.final_amount))}
                                            </span>
                                        </div>
                                        <div className='flex justify-between text-sm'>
                                            <span className='text-gray-600'>Trạng thái</span>
                                            <span
                                                className={`font-medium ${booking.payment_status === 'paid' ? 'text-green-600' : 'text-red-600'}`}
                                            >
                                                {booking.payment_status === 'paid'
                                                    ? 'Đã thanh toán'
                                                    : 'Chưa thanh toán'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* === Footer === */}
                    <div className='flex justify-between sm:items-center px-6 py-4 bg-white rounded-b-lg border-t border-gray-200 gap-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]'>
                        <button
                            onClick={onClose}
                            className='px-5 py-2.5 rounded-lg font-semibold text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-150'
                        >
                            Đóng
                        </button>

                        <div className="flex gap-2">
                            {/* Nút Thanh Toán */}
                            {booking && booking.status === 'pending' && onPayment && !isAdmin && (
                                <button
                                    onClick={() => onPayment(booking.booking_id)}
                                    className='px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150 shadow hover:shadow-md flex items-center gap-2'
                                >
                                    <FontAwesomeIcon icon={faCreditCard} /> Thanh toán ngay
                                </button>
                            )}

                            {/* Nút Hủy */}
                            {booking && 
                            ['pending', 'confirmed'].includes(booking.status) && !isAdmin && (
                            <button
                                onClick={() => setIsConfirmCancelOpen(true)}
                                disabled={cancelMutation.isPending}
                                className='px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-red-600 hover:bg-red-700 transition-colors duration-150 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {cancelMutation.isPending ? (
                                <FontAwesomeIcon icon={faSpinner} spin className='mr-2' />
                                ) : (
                                <FontAwesomeIcon icon={faTrash} className='mr-2' />
                                )}
                                Yêu cầu hủy
                            </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal xác nhận Hủy */}
            <CancelBookingModal
                isOpen={isConfirmCancelOpen}
                onClose={() => setIsConfirmCancelOpen(false)}
                onSubmit={handleSubmitCancellation}
                isLoading={cancelMutation.isPending}
            />
        </Fragment>
    )
}