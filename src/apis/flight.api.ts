import { FlightFilter, FlightListResponse as FlightListResponseUser } from '~/types/flight.type'
import { SuccessResponse } from '~/types/utils.type'
import http from '~/utils/http'
import { Airline } from './airLine.api'
import { Aircraft } from './aircraft.api'
import { Airport } from './airport.api'

// --- KIỂU DỮ LIỆU (TỪ API RESPONSE) ---
interface BaggageService {
    baggage_service_id: number
    weight_kg: string
    price: string
    description: string
    is_active: boolean
}

interface MealService {
    meal_service_id: number
    meal_name: string
    meal_description: string
    price: string
    is_vegetarian: boolean
    is_halal: boolean
    is_active: boolean
}

// Kiểu chi tiết cho 1 chuyến bay (GET /api/flights)
export interface Flight {
    flight_id: number
    flight_number: string
    airline_id: number
    aircraft_id: number
    departure_airport_id: number
    arrival_airport_id: number
    departure_time: string // "2025-11-17T08:00:00.000Z"
    arrival_time: string
    status: string
    economy_price: string
    business_price: string
    flight_type: string // "international" | "domestic"
    created_at: string
    updated_at: string
    is_active: boolean
    Airline: Pick<Airline, 'airline_id' | 'airline_name' | 'airline_code'>
    Aircraft: Pick<Aircraft, 'aircraft_id' | 'model' | 'aircraft_type' | 'business_seats' | 'economy_seats'>
    DepartureAirport: Airport
    ArrivalAirport: Airport
    baggage_services: BaggageService[]
    meal_services: MealService[]
}

// --- KIỂU DỮ LIỆU (CHO FORM PAYLOAD) ---
// (Khớp với flightFormSchema)
interface BaggageServicePayload {
    baggage_service_id?: number
    weight_kg: number
    price: number
    description: string
}

interface MealServicePayload {
    meal_service_id?: number
    meal_name: string
    meal_description: string
    price: number
    is_vegetarian: boolean
    is_halal: boolean
}

export type FlightFormData = {
    flight_id: number // (Dùng cho Sửa)
    airline_id: number
    aircraft_id: number
    departure_airport_id: number
    arrival_airport_id: number
    departure_time: string // (Sẽ dùng input datetime-local)
    arrival_time: string
    status: string
    flight_type: string
    economy_price: number
    business_price: number
    baggage_services: BaggageServicePayload[]
    meal_services: MealServicePayload[]
}
// ------------------------------------

// Kiểu cho toàn bộ response (bao gồm pagination)
export type FlightListResponse = SuccessResponse<{
    data: Flight[]
}>

// Kiểu cho response chi tiết (Thêm/Sửa)
export type FlightDetailResponse = SuccessResponse<{
    flight: Flight // API của bạn trả về { data: { flight: ... } }
}>

// API lấy danh sách chuyến bay
export const getFlights = () => {
    return http.get<FlightListResponseUser>('flights/list')
}

// --- HÀM GỌI API ---
export const flightApi = {
    getFlights: (params: FlightFilter) => {
        return http.get<FlightListResponse>('/admin/flights', { params })
    },

    // (API Chi tiết - Rất quan trọng để Sửa)
    getFlightDetails: (id: number) => {
        return http.get<FlightDetailResponse>(`/admin/flights/${id}`)
    },

    createFlight: (data: Omit<FlightFormData, 'flight_id'>) => {
        return http.post<FlightDetailResponse>('/admin/flights', data)
    },

    updateFlight: (id: number, data: Partial<FlightFormData>) => {
        // Thêm force_edit (như trong JSON) nếu API yêu cầu
        const payload = { ...data, force_edit: true }
        return http.put<FlightDetailResponse>(`/admin/flights/${id}`, payload)
    },

    deleteFlight: (id: number) => {
        return http.delete<SuccessResponse<{}>>(`/admin/flights/${id}`)
    }
}
