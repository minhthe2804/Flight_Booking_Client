import http from '~/utils/http'
import { SuccessResponse } from '~/types/utils.type'
import { BookingFilter } from '~/types/bookingadmin.type'

// --- KIỂU DỮ LIỆU TỪ API ---
export interface BookingUser {
    user_id: number
    email: string
    first_name: string
    last_name: string
}

export interface BookingDetailItem {
    booking_detail_id: number
    flight_id: number
    passenger_id: number
    seat_id: number
    ticket_number: string | null
    check_in_status: boolean
    Flight: any // (Có thể dùng kiểu Flight từ flight.api.ts nếu cần chi tiết)
    Passenger: any // (Có thể dùng kiểu Passenger)
    FlightSeat: {
        seat_number: string
        TravelClass: { class_name: string }
    }
}

export interface Booking {
    booking_id: number
    booking_reference: string // Mã đặt chỗ (PNR)
    user_id: number
    contact_email: string
    contact_phone: string
    citizen_id: string | null
    booking_date: string
    total_amount: string
    base_amount: string
    baggage_fees: string
    meal_fees: string
    service_package_fees: string
    discount_amount: string
    discount_code: string | null
    final_amount: string

    // Trạng thái
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'pending_cancellation' | 'cancellation_rejected'
    payment_status: 'pending' | 'paid' | 'refunded'
    cancellation_reason: string | null
    trip_type: 'one-way' | 'round-trip'

    User: BookingUser
    BookingDetails?: BookingDetailItem[] // Chỉ có khi xem chi tiết
}

// Payload để cập nhật trạng thái/hủy
export interface UpdateBookingBody {
    status?: string
    payment_status?: string
    cancellation_reason?: string
}

// Response
export type BookingListResponse = SuccessResponse<{
    data: Booking[] // API trả về danh sách
}>

export type BookingDetailResponse = SuccessResponse<Booking>

// --- HÀM GỌI API ---
export const bookingApi = {
    /**
     * Lấy danh sách booking (Admin)
     */
    getBookings: (params: BookingFilter) => {
        return http.get<BookingListResponse>('/admin/bookings', { params })
    },

    /**
     * Lấy chi tiết 1 booking
     */
    getBookingDetail: (id: number) => {
        return http.get<BookingDetailResponse>(`/admin/bookings/${id}`)
    },

    /**
     * Cập nhật trạng thái booking (Hủy, Xác nhận, v.v.)
     */
    updateBookingStatus: (id: number, body: UpdateBookingBody) => {
        return http.put<BookingDetailResponse>(`/admin/bookings/${id}/status`, body)
    }
}
