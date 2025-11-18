interface FlightInfo {
    flight_id: number
    flight_number: string
    departure_airport_code: string
    arrival_airport_code: string
    departure_time: string
    arrival_time: string
}

export interface BookingHistoryItem {
    booking_id: number
    booking_reference: string // "44VTWH"
    flight: FlightInfo
    status: 'confirmed' | 'pending' | 'cancelled'
    total_amount: string // "2960000.00"
    created_at: string // "2025-11-06T10:21:05.000Z"
    passenger_count: number
    trip_type?: string
}

export interface BookingHistoryResponse {
    success: boolean
    message: string
    data: {
        booking_id: number
        booking_reference: string
        flight: {
            flight_id: number
            flight_number: string
            departure_airport_code: string
            arrival_airport_code: string
            departure_time: string
            arrival_time: string
        }
        status: 'confirmed' | 'pending' | 'cancelled'
        total_amount: string
        created_at: string
        passenger_count: number
    }[]
    meta: {
        pagination: {
            currentPage: number
            totalPages: number
            totalItems: number
            itemsPerPage: number
        }
    }
    timestamp: string
}

// ✅ Đã cập nhật đầy đủ dựa trên JSON mới nhất của bạn (GJ7P9O)

// Các kiểu phụ
interface TravelClass {
    class_id: number
    class_name: string
    class_code: string
}

interface FlightSeat {
    seat_id: number
    flight_id: number
    class_id: number
    seat_number: string
    price: string
    is_available: boolean
    TravelClass: TravelClass
}

interface Airline {
    airline_id: number
    airline_code: string
    airline_name: string
    country_id: number
    service_config: null
    logo_url: string
    is_active: boolean
}

interface Aircraft {
    aircraft_id: number
    airline_id: number
    model: string
    total_seats: number
    business_seats: number
    economy_seats: number
    aircraft_type: null
}

interface Airport {
    airport_id: number
    airport_code: string
    airport_name: string
    city: string
    country_id: number
    airport_type: string
    latitude: string
    longitude: string
}

interface Flight {
    flight_id: number
    flight_number: string
    airline_id: number
    aircraft_id: number
    departure_airport_id: number
    arrival_airport_id: number
    departure_time: string
    arrival_time: string
    status: string
    economy_price: string
    business_price: string
    created_at: string
    updated_at: string
    Airline: Airline
    Aircraft: Aircraft
    DepartureAirport: Airport
    ArrivalAirport: Airport
}

interface Passenger {
    passenger_id: number
    first_name: string
    middle_name: null | string
    last_name: string
    title: string
    citizen_id: string
    passenger_type: string
    date_of_birth: string
    nationality: string
    passport_number: string
    passport_expiry: string
    passport_issuing_country: string
    created_at: string
}

export interface BookingDetailItem {
    booking_detail_id: number
    booking_id: number
    flight_id: number
    passenger_id: number
    seat_id: number
    baggage_option_id: null
    meal_option_id: null
    ticket_number: null
    check_in_status: boolean
    Passenger: Passenger
    FlightSeat: FlightSeat
    Flight: Flight
}

// Kiểu dữ liệu chính cho chi tiết một booking
export interface BookingDetail {
    booking_id: number
    booking_reference: string
    user_id: number
    contact_email: string
    contact_phone: string
    citizen_id: null | string
    booking_date: string
    total_amount: string
    base_amount: string
    baggage_fees: string
    meal_fees: string
    service_package_fees: string
    selected_baggage_services: null // Cần định nghĩa nếu có
    selected_meal_services: null // Cần định nghĩa nếu có
    discount_amount: string
    discount_code: string
    discount_percentage: string
    tax_amount: string
    final_amount: string
    status: 'confirmed' | 'pending' | 'cancelled' | 'cancellation_rejected' | 'pending_cancellation'
    payment_status: 'paid' | 'unpaid'
    cancellation_reason: null | string
    trip_type: string
    updated_at: string
    BookingDetails: BookingDetailItem[]
}

// Kiểu dữ liệu trả về của API getBooking
export interface BookingDetailResponse {
    success: boolean
    message: string
    data: BookingDetail
}
