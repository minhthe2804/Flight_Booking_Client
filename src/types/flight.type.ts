import { FlightQueryConfig } from '~/hooks/useSearchFlightQueryConfig'

export interface Airline {
    id: number
    name: string
    code: string
    logo_url: string
}

export interface Aircraft {
    id: number
    model: string
    total_seats: number
}

export interface Airport {
    id: number
    code: string
    name: string
    city: string
}

export interface FlightLeg {
    airport: Airport
    time: string
}

export interface Flight {
    flight_id: number
    flight_number: string
    economy_price: number
    business_price: number
    airline: Airline
    aircraft: Aircraft
    departure: FlightLeg
    arrival: FlightLeg
    duration: string
    status: string
}

// Kiểu dữ liệu cho toàn bộ phản hồi API
export interface FlightListResponse {
    success: boolean
    message: string
    data: Flight[]
    meta: {
        pagination: {
            currentPage: number
            totalPages: number
            totalItems: number
            itemsPerPage: number
            hasNextPage: boolean
            hasPrevPage: false
        }
    }
    timestamp: string
}

export type FlightFilter = Pick<
    FlightQueryConfig,
    | 'page'
    | 'limit'
    | 'flight_number'
    | 'status'
    | 'airline_id'
    | 'flight_type'
    | 'departure_airport_id'
    | 'arrival_airport_id'
    | 'departure_date_from'
    | 'departure_date_to'
    | 'sortBy'
    | 'order'
>
