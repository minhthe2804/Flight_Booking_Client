
import { useQuery } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTimes,
    faSpinner,
    faPlane,
    faUser,
    faReceipt,
    faExclamationTriangle,
    faSuitcase,
    faUtensils,
    faBoxOpen
} from '@fortawesome/free-solid-svg-icons'
// Import API & Utils
import { bookingApi, BookingData } from '~/apis/bookingadmin.api'
import { formatCurrencyVND, formatDateTime } from '~/utils/utils'
// Import Types đã tạo (Giả sử file này nằm ở ~/types/booking.ts)

interface Props {
    isOpen: boolean
    onClose: () => void
    bookingId: number | null
}

export default function BookingDetailModal_Admin({ isOpen, onClose, bookingId }: Props) {
    // 1. Định nghĩa Type cho useQuery để data trả về đúng kiểu BookingResponse
    const {
        data: apiResponse, // Đổi tên biến cho rõ nghĩa (đây là axios response hoặc response wrap)
        isLoading,
        isError
    } = useQuery({
        queryKey: ['adminBookingDetail', bookingId],
        queryFn: () => bookingApi.getBookingDetail(Number(bookingId)),
        enabled: isOpen && !!bookingId
    })

    // 2. Safely Access Data (Dựa trên cấu trúc detailData?.data.data cũ của bạn)
    // Giả sử API của bạn trả về AxiosResponse<BookingResponse>
    // Thì apiResponse.data sẽ là BookingResponse
    // Và apiResponse.data.data sẽ là BookingData
    const booking: BookingData | undefined = apiResponse?.data?.data

    if (!isOpen) return null

    // Helper render trạng thái với Type an toàn
    const renderStatus = (status: string) => {
        const statusMap: Record<string, { text: string; className: string }> = {
            confirmed: { text: 'Đã xác nhận', className: 'bg-green-100 text-green-700' },
            pending: { text: 'Chờ thanh toán', className: 'bg-yellow-100 text-yellow-700' },
            cancelled: { text: 'Đã hủy', className: 'bg-gray-200 text-gray-700' },
            pending_cancellation: { text: 'Chờ hủy', className: 'bg-orange-100 text-orange-700' },
            cancellation_rejected: { text: 'Từ chối hủy', className: 'bg-red-100 text-red-700' },
            completed: { text: 'Hoàn thành', className: 'bg-blue-100 text-blue-700' },
            paid: { text: 'Đã thanh toán', className: 'bg-green-100 text-green-700' },
            unpaid: { text: 'Chưa thanh toán', className: 'bg-red-100 text-red-700' }
        }
        const s = statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-600' }
        return <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${s.className}`}>{s.text}</span>
    }

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'
            onClick={onClose}
        >
            <div
                className='bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-scale flex flex-col'
                onClick={(e) => e.stopPropagation()}
            >
                {/* --- HEADER --- */}
                <div className='flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50 rounded-t-xl sticky top-0 z-10'>
                    <div>
                        <h3 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                            Chi tiết Đặt chỗ <span className='text-blue-600'>#{booking?.booking_reference}</span>
                        </h3>
                        <p className='text-xs text-gray-500 mt-1'>ID: {booking?.booking_id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className='w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors'
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* --- BODY --- */}
                <div className='p-6 space-y-8 overflow-y-auto'>
                    {isLoading ? (
                        <div className='flex flex-col items-center justify-center py-12 gap-3 text-gray-400'>
                            <FontAwesomeIcon icon={faSpinner} spin size='2x' className='text-blue-500' />
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : isError || !booking ? (
                        <div className='flex flex-col items-center justify-center py-12 text-red-500 bg-red-50 rounded-lg border border-red-100'>
                            <FontAwesomeIcon icon={faExclamationTriangle} size='3x' className='mb-3 opacity-50' />
                            <p className='font-medium'>Không tìm thấy thông tin đặt chỗ.</p>
                        </div>
                    ) : (
                        <>
                            {/* 1. THÔNG TIN NGƯỜI LIÊN HỆ & TRẠNG THÁI */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {/* Box Trái: Người liên hệ */}
                                <div className='bg-blue-50/50 p-5 rounded-xl border border-blue-100'>
                                    <h4 className='text-sm font-bold text-blue-800 uppercase mb-3 flex items-center gap-2'>
                                        <FontAwesomeIcon icon={faUser} /> Người liên hệ
                                    </h4>
                                    <div className='space-y-2 text-sm text-gray-700'>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Họ tên:</span>
                                            <span className='font-semibold'>
                                                {booking.User.first_name} {booking.User.last_name}
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Email:</span>
                                            <span className='font-medium'>{booking.User.email}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>SĐT:</span>
                                            <span className='font-medium'>
                                                {booking.contact_phone || booking.contact_info?.phone}
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-500'>Tài khoản:</span>
                                            <span>
                                                {booking.User?.email || 'Khách vãng lai'} (ID: {booking.user_id})
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Box Phải: Trạng thái đơn hàng */}
                                <div className='bg-gray-50 p-5 rounded-xl border border-gray-200'>
                                    <h4 className='text-sm font-bold text-gray-700 uppercase mb-3 flex items-center gap-2'>
                                        <FontAwesomeIcon icon={faReceipt} /> Thông tin đơn hàng
                                    </h4>
                                    <div className='space-y-2 text-sm'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-gray-500'>Ngày đặt:</span>
                                            <span>{formatDateTime(booking.booking_date)}</span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-gray-500'>Trạng thái vé:</span>
                                            {renderStatus(booking.status)}
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-gray-500'>Thanh toán:</span>
                                            {renderStatus(booking.payment_status)}
                                        </div>
                                        {/* Hiển thị thông tin Hủy nếu có */}
                                        {(booking.cancellation_reason ||
                                            booking.status === 'cancelled' ||
                                            booking.status === 'pending_cancellation') && (
                                            <div className='mt-3 pt-3 border-t border-gray-200 bg-red-50 p-3 rounded-md border-l-4 border-l-red-400'>
                                                <p className='text-xs font-bold text-red-600 uppercase mb-1'>
                                                    Thông tin Hủy vé
                                                </p>
                                                <p className='text-sm text-gray-800'>
                                                    Lý do:{' '}
                                                    <span className='italic'>
                                                        {booking.cancellation_reason || 'Không có lý do'}
                                                    </span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 2. CHI TIẾT CHUYẾN BAY & DỊCH VỤ (QUAN TRỌNG) */}
                            <div>
                                <h4 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-l-4 border-blue-600 pl-3'>
                                    Chi tiết Chuyến bay & Dịch vụ
                                </h4>

                                <div className='space-y-6'>
                                    {/* Lấy danh sách các chuyến bay duy nhất (Unique Flight IDs) */}
                                    {Array.from(new Set(booking.BookingDetails.map((d) => d.flight_id))).map(
                                        (flightId) => {
                                            // Lọc hành khách thuộc chuyến bay này
                                            const detailsInFlight = booking.BookingDetails.filter(
                                                (d) => d.flight_id === flightId
                                            )
                                            // Lấy thông tin chuyến bay từ phần tử đầu tiên tìm thấy
                                            const flightInfo = detailsInFlight[0].Flight

                                            // 3. Lấy dịch vụ khớp với Flight ID (Dùng Optional Chaining ?. an toàn)
                                            const flightBaggage =
                                                booking.baggage_services.find((b) => b.flight_id === flightId)
                                                    ?.services || []
                                            const flightMeals =
                                                booking.meal_services.find((m) => m.flight_id === flightId)?.services ||
                                                []
                                            const flightPackages =
                                                booking.service_packages.find((p) => p.flight_id === flightId)
                                                    ?.packages || []

                                            return (
                                                <div
                                                    key={flightId}
                                                    className='border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow'
                                                >
                                                    {/* Header Chuyến bay */}
                                                    <div className='bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center'>
                                                        <div className='flex items-center gap-4'>
                                                            <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center border shadow-sm'>
                                                                <FontAwesomeIcon
                                                                    icon={faPlane}
                                                                    className='text-blue-500'
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className='font-bold text-gray-800 text-lg'>
                                                                    {flightInfo.Airline.airline_name}{' '}
                                                                    <span className='text-gray-400 font-normal'>
                                                                        ({flightInfo.flight_number})
                                                                    </span>
                                                                </p>
                                                                <p className='text-sm text-gray-600 flex items-center gap-2'>
                                                                    <span>
                                                                        {flightInfo.DepartureAirport.city} (
                                                                        {flightInfo.DepartureAirport.airport_code})
                                                                    </span>
                                                                    <span className='text-gray-400'>➝</span>
                                                                    <span>
                                                                        {flightInfo.ArrivalAirport.city} (
                                                                        {flightInfo.ArrivalAirport.airport_code})
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className='text-right'>
                                                            <p className='text-sm font-semibold text-gray-800'>
                                                                {formatDateTime(flightInfo.departure_time)}
                                                            </p>
                                                            <span className='text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded capitalize'>
                                                                {flightInfo.flight_type}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className='p-4 grid grid-cols-1 lg:grid-cols-3 gap-6'>
                                                        {/* Cột 1: Danh sách Hành khách */}
                                                        <div className='lg:col-span-1 border-r border-gray-100 pr-4'>
                                                            <h5 className='text-xs font-bold text-gray-400 uppercase mb-3'>
                                                                Hành khách ({detailsInFlight.length})
                                                            </h5>
                                                            <ul className='space-y-3'>
                                                                {detailsInFlight.map((detail) => (
                                                                    <li
                                                                        key={detail.booking_detail_id}
                                                                        className='flex justify-between items-start text-sm'
                                                                    >
                                                                        <div>
                                                                            <p className='font-semibold text-gray-800'>
                                                                                {detail.Passenger.title}.{' '}
                                                                                {detail.Passenger.first_name}{' '}
                                                                                {detail.Passenger.last_name}
                                                                            </p>
                                                                            <p className='text-[11px] text-gray-500 capitalize'>
                                                                                {detail.Passenger.passenger_type} •{' '}
                                                                                {detail.Passenger.nationality}
                                                                            </p>
                                                                        </div>
                                                                        <div className='text-right'>
                                                                            {/* Check-in Status */}
                                                                            <span
                                                                                className={`block text-[10px] font-bold px-1.5 py-0.5 rounded mb-1 ${
                                                                                    detail.check_in_status
                                                                                        ? 'bg-green-100 text-green-700'
                                                                                        : 'bg-gray-100 text-gray-500'
                                                                                }`}
                                                                            >
                                                                                {detail.check_in_status
                                                                                    ? 'Đã Check-in'
                                                                                    : 'Chưa Check-in'}
                                                                            </span>
                                                                            {/* Seat Info */}
                                                                            <span className='block bg-blue-50 px-2 py-0.5 rounded text-xs font-mono font-bold text-blue-700'>
                                                                                Ghế:{' '}
                                                                                {detail.seat_id
                                                                                    ? `ID ${detail.seat_id}`
                                                                                    : 'Chưa chọn'}
                                                                            </span>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        {/* Cột 2: Dịch vụ bổ sung (Hành lý, Suất ăn, Package) */}
                                                        <div className='lg:col-span-2'>
                                                            <h5 className='text-xs font-bold text-gray-400 uppercase mb-3'>
                                                                Dịch vụ bổ sung đã chọn
                                                            </h5>

                                                            {flightBaggage.length === 0 &&
                                                                flightMeals.length === 0 &&
                                                                flightPackages.length === 0 && (
                                                                    <p className='text-sm text-gray-400 italic bg-gray-50 p-3 rounded text-center'>
                                                                        Không có dịch vụ bổ sung nào cho chuyến bay này.
                                                                    </p>
                                                                )}

                                                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                                                {/* Hành lý */}
                                                                {flightBaggage.length > 0 && (
                                                                    <div className='bg-orange-50/50 p-3 rounded-lg border border-orange-100'>
                                                                        <p className='text-xs font-bold text-orange-700 mb-2 flex items-center gap-1'>
                                                                            <FontAwesomeIcon icon={faSuitcase} /> Hành
                                                                            lý mua thêm
                                                                        </p>
                                                                        <ul className='space-y-1'>
                                                                            {flightBaggage.map((bg, idx) => (
                                                                                <li
                                                                                    key={idx}
                                                                                    className='text-xs flex justify-between text-gray-700'
                                                                                >
                                                                                    <span>
                                                                                        {bg.weight_kg}kg{' '}
                                                                                        <span className='text-gray-400'>
                                                                                            ({bg.description})
                                                                                        </span>
                                                                                    </span>
                                                                                    <span className='font-medium'>
                                                                                        x{bg.quantity}
                                                                                    </span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                                {/* Suất ăn */}
                                                                {flightMeals.length > 0 && (
                                                                    <div className='bg-green-50/50 p-3 rounded-lg border border-green-100'>
                                                                        <p className='text-xs font-bold text-green-700 mb-2 flex items-center gap-1'>
                                                                            <FontAwesomeIcon icon={faUtensils} /> Suất
                                                                            ăn
                                                                        </p>
                                                                        <ul className='space-y-1'>
                                                                            {flightMeals.map((meal, idx) => (
                                                                                <li
                                                                                    key={idx}
                                                                                    className='text-xs flex justify-between text-gray-700'
                                                                                >
                                                                                    <span>{meal.meal_name}</span>
                                                                                    <span className='font-medium'>
                                                                                        x{meal.quantity}
                                                                                    </span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                                {/* Gói dịch vụ (Full width nếu có) */}
                                                                {flightPackages.length > 0 && (
                                                                    <div className='bg-purple-50/50 p-3 rounded-lg border border-purple-100 sm:col-span-2'>
                                                                        <p className='text-xs font-bold text-purple-700 mb-2 flex items-center gap-1'>
                                                                            <FontAwesomeIcon icon={faBoxOpen} /> Gói
                                                                            dịch vụ (Bundle)
                                                                        </p>
                                                                        <ul className='space-y-1'>
                                                                            {flightPackages.map((pkg, idx) => (
                                                                                <li
                                                                                    key={idx}
                                                                                    className='text-xs text-gray-700'
                                                                                >
                                                                                    <span className='font-bold'>
                                                                                        {pkg.package_name}
                                                                                    </span>{' '}
                                                                                    ({pkg.package_code}) -{' '}
                                                                                    <span className='capitalize'>
                                                                                        {pkg.class_type}
                                                                                    </span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    )}
                                </div>
                            </div>

                            {/* 3. TỔNG KẾT TÀI CHÍNH */}
                            <div className='bg-gray-50 rounded-xl p-5 border border-gray-200'>
                                <h4 className='text-sm font-bold text-gray-700 uppercase mb-4'>Bảng kê chi phí</h4>
                                <div className='space-y-2 text-sm'>
                                    {/* Lưu ý: Cần ép kiểu Number() vì API trả về string "1500000.00" */}
                                    <div className='flex justify-between text-gray-600'>
                                        <span>Giá vé cơ bản:</span>
                                        <span>{formatCurrencyVND(Number(booking.base_amount))}</span>
                                    </div>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>Phí hành lý:</span>
                                        <span>{formatCurrencyVND(Number(booking.baggage_fees))}</span>
                                    </div>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>Phí suất ăn:</span>
                                        <span>{formatCurrencyVND(Number(booking.meal_fees))}</span>
                                    </div>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>Phí gói dịch vụ:</span>
                                        <span>{formatCurrencyVND(Number(booking.service_package_fees))}</span>
                                    </div>

                                    {/* Thuế */}
                                    {Number(booking.tax_amount) > 0 && (
                                        <div className='flex justify-between text-gray-600'>
                                            <span>Thuế & Phí sân bay:</span>
                                            <span>{formatCurrencyVND(Number(booking.tax_amount))}</span>
                                        </div>
                                    )}

                                    {/* Giảm giá */}
                                    {Number(booking.discount_amount) > 0 && (
                                        <div className='flex justify-between text-green-600 bg-green-50 p-2 rounded font-medium'>
                                            <span>Giảm giá ({booking.discount_code}):</span>
                                            <span>-{formatCurrencyVND(Number(booking.discount_amount))}</span>
                                        </div>
                                    )}

                                    <div className='border-t border-gray-300 my-2 pt-2 flex justify-between items-end'>
                                        <span className='text-base font-bold text-gray-800'>TỔNG THANH TOÁN</span>
                                        <span className='text-2xl font-extrabold text-blue-600'>
                                            {formatCurrencyVND(Number(booking.final_amount))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className='p-5 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end'>
                    <button
                        onClick={onClose}
                        className='px-6 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 font-medium hover:bg-gray-100 transition-colors'
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    )
}
