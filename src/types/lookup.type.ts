// Dựa trên JSON response bạn đã cung cấp

interface AirlineInfo {
    airline_id: number
    airline_name: string
    airline_code: string
    logo_url: string
}

interface AirportInfo {
    airport_id: number
    airport_code: string
    airport_name: string
    city: string
}

interface PassengerInfo {
    passenger_id: number
    first_name: string
    last_name: string
    date_of_birth: string
    nationality: string
    passport_number: string
}

interface TravelClassInfo {
    class_id: number
    class_name: string
    class_code: string
}

interface FlightInfo {
    flight_id: number
    flight_number: string
    airline: AirlineInfo
    departure_airport: AirportInfo
    arrival_airport: AirportInfo
    departure_time: string // ISO 8601 string
    arrival_time: string // ISO 8601 string
}

// Đây là item trong mảng 'passengers' của API
export interface BookingPassengerFlight {
    passenger: PassengerInfo
    flight: FlightInfo
    travel_class: TravelClassInfo
    seat_number: string
    price: string
}

interface UserInfo {
    user_id: number
    email: string
    first_name: string
    last_name: string
}

interface TicketTypeCount {
    class_name: string
    class_code: string
    count: number
}

interface PaymentInfo {
    payment_id: number
    amount: string
    payment_method: string
    status: string
}

// Đây là object 'data'
export interface Lookup {
    booking_id: number
    booking_reference: string
    booking_date: string // ISO 8601 string
    status: string
    payment_status: string
    total_amount: string
    contact_email: string
    contact_phone: string
    user: UserInfo
    passengers: BookingPassengerFlight[] // Mảng các chặng bay của hành khách
    ticket_type_counts: TicketTypeCount[]
    payment: PaymentInfo
    updated_at: string // ISO 8601 string
}

// Đây là response gốc từ API
export interface LookupResponse {
    success: boolean
    message: string
    data: Lookup
    meta: null
    timestamp: string // ISO 8601 string
}
