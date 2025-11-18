// src/apis/searchFlight.api.ts
import { FlightQueryConfig } from '~/hooks/useSearchFlightQueryConfig'
import { searchFlight } from '~/types/searchFlight.type'
import http from '~/utils/http'
import { SuccessResponse } from '~/types/utils.type'

const URL_SEARCHFLIGHT = 'flights/search'

// --- KIỂU DỮ LIỆU CHO ADMIN (Giữ nguyên) ---
export interface Airport {
    airport_id: number
    airport_name: string
    airport_code: string
    city: string
    country: string
}

export interface Airline {
    airline_id: number
    airline_name: string
    airline_code: string
}

export interface Flight {
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
    flight_type: 'domestic' | 'international'
    created_at: string
    updated_at: string
    Airline: Airline
    DepartureAirport: Airport
    ArrivalAirport: Airport
}

// --- KIỂU DỮ LIỆU MỚI CHO PUBLIC SEARCH (Khớp JSON bạn gửi) ---
export interface FlightSearchResult {
    flight_type: string
    flight_id: number
    flight_number: string
    economy_price: number
    business_price: number
    airline: {
        id: number
        name: string
        code: string
        logo_url: string | null
    }
    aircraft: {
        id: number
        model: string
        total_seats: number
    }
    departure: {
        airport: {
            id: number
            code: string
            name: string
            city: string
        }
        time: string
    }
    arrival: {
        airport: {
            id: number
            code: string
            name: string
            city: string
        }
        time: string
    }
    duration: string
    status: string
    available_seats: number
    starting_price: number
    travel_class: {
        id: number
        name: string
        code: string
    }
}

// Interface cho query params
export interface FlightSearchQuery {
    departure_airport_code?: string
    arrival_airport_code?: string
    departure_date?: string
    return_date?: string
    flight_type?: string
    min_price?: number
    max_price?: number
    airline_code?: string
    page?: string
    limit?: string
    sortBy?: string
    order?: 'asc' | 'desc'
    status?: string
}

// Response cho Search
export type FlightSearchResponse = SuccessResponse<{
    data: FlightSearchResult[] // Sử dụng kiểu dữ liệu mới
}>

export const searchFlightApi = {
    searchFlights: (params: FlightQueryConfig) =>
        http.get<searchFlight>(URL_SEARCHFLIGHT, {
            params
        })
}
