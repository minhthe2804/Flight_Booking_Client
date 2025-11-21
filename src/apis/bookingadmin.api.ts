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

// 1. Các entity cơ bản (User, Airport, Airline)
export interface UserInfo {
    user_id: number
    email: string
    first_name: string
    last_name: string
}

export interface ContactInfo {
    first_name: string
    last_name: string
    email: string
    phone: string
}

export interface Airline {
    airline_name: string
    airline_code: string
}

export interface Airport {
    airport_code: string
    airport_name: string
    city: string
}

// 2. Thông tin chuyến bay (Flight)
export interface Flight {
    flight_id: number
    flight_number: string
    airline_id: number
    aircraft_id: number
    departure_airport_id: number
    arrival_airport_id: number
    departure_time: string // ISO Date string
    arrival_time: string // ISO Date string
    status: string
    economy_price: string // API trả về string số tiền
    business_price: string
    flight_type: string
    created_at: string
    updated_at: string
    Airline: Airline
    DepartureAirport: Airport
    ArrivalAirport: Airport
}

// 3. Thông tin hành khách (Passenger)
export interface Passenger {
    passenger_id: number
    title: string
    first_name: string
    middle_name: string | null
    last_name: string
    citizen_id: string
    passport_number: string
    passport_issuing_country: string
    passport_expiry: string
    nationality: string
    date_of_birth: string
    passenger_type: 'adult' | 'child' | 'infant' | string
}

// 4. Chi tiết đặt chỗ (Booking Detail - kết hợp Flight & Passenger)
export interface BookingDetail {
    booking_detail_id: number
    booking_id: number
    flight_id: number
    passenger_id: number
    seat_id: number
    baggage_option_id: number | null
    meal_option_id: number | null
    ticket_number: string | null
    check_in_status: boolean
    Flight: Flight
    Passenger: Passenger
}

// 5. Thanh toán (Payment)
export interface Payment {
    payment_id: number
    amount: string
    payment_method: string
    payment_reference: string
    payment_date: string
    status: string
}

// 6. Các dịch vụ bổ sung (Services: Package, Baggage, Meal)

// --- Service Package ---
// Lưu ý: 'services_included' trong JSON là một chuỗi stringified JSON
export interface PackageItem {
    package_id: number
    package_name: string
    package_code: string
    class_type: string
    package_type: string
    price_multiplier: string
    description: string | null
    services_included: string // Đây là JSON dạng chuỗi, cần parse nếu muốn dùng
}

export interface ServicePackageGroup {
    flight_id: number
    flight_number: string
    packages: PackageItem[]
}

// --- Baggage ---
export interface BaggageItem {
    baggage_service_id: number
    weight_kg: string
    price: string
    description: string
    quantity: number
}

export interface BaggageServiceGroup {
    flight_id: number
    flight_number: string
    services: BaggageItem[]
}

// --- Meal ---
export interface MealItem {
    meal_service_id: number
    meal_name: string
    meal_description: string
    price: string
    is_vegetarian: boolean
    is_halal: boolean
    quantity: number
}

export interface MealServiceGroup {
    flight_id: number
    flight_number: string
    services: MealItem[]
}

// 7. Object chính: Booking Data
export interface BookingData {
    booking_id: number
    booking_reference: string
    user_id: number
    contact_email: string
    contact_phone: string
    citizen_id: string | null
    booking_date: string

    // Các loại phí (API trả về string decimal)
    total_amount: string
    base_amount: string
    baggage_fees: string
    meal_fees: string
    service_package_fees: string

    // Stringified JSON arrays (cần JSON.parse để dùng)
    selected_baggage_services: string
    selected_meal_services: string

    discount_amount: string
    discount_code: string | null
    discount_percentage: string
    tax_amount: string
    final_amount: string

    status: 'confirmed' | 'pending' | 'cancelled' | string
    cancellation_processed: boolean
    cancellation_processed_at: string | null
    cancellation_processed_by: string | null
    payment_status: 'paid' | 'unpaid' | string
    cancellation_reason: string | null
    trip_type: 'one-way' | 'round-trip' | string
    updated_at: string

    // Nested Objects
    User: UserInfo
    BookingDetails: BookingDetail[]
    Payments: Payment[]
    service_packages: ServicePackageGroup[]
    baggage_services: BaggageServiceGroup[]
    meal_services: MealServiceGroup[]
    contact_info: ContactInfo
}

// 8. Root Response
export interface BookingResponse {
    success: boolean
    message: string
    data: BookingData
    meta: any | null
    timestamp: string
}
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
        return http.get<BookingResponse>(`/admin/bookings/${id}`)
    },

    /**
     * Cập nhật trạng thái booking (Hủy, Xác nhận, v.v.)
     */
    updateBookingStatus: (id: number, body: UpdateBookingBody) => {
        return http.put<BookingDetailResponse>(`/admin/bookings/${id}/status`, body)
    }
}
