// src/hooks/useFlightQueryConfig.ts
import { useSearchParams } from 'react-router-dom'
import { isUndefined, omitBy } from 'lodash'

// Định nghĩa kiểu dữ liệu cho TẤT CẢ các tham số có thể có trên URL
export interface FlightQueryConfig {
    page?: string
    limit?: string
    search?: string

    departure_airport_code?: string
    arrival_airport_code?: string
    departure_date?: string
    return_date?: string
    adults?: string
    children?: string
    infants?: string
    class_code?: string
    is_round_trip?: string
    origin_departure_code?: string
    origin_arrival_code?: string

    airport_code?: string
    airport_name?: string
    city?: string
    country_id?: string
    airport_type?: string

    model?: string
    airline_id?: string
    aircraft_type?: string
}

export default function useFlightQueryConfig(): FlightQueryConfig {
    const [searchParams] = useSearchParams()

    const config = {
        page: searchParams.get('page'),
        limit: searchParams.get('limit'),
        search: searchParams.get('search'),

        departure_airport_code: searchParams.get('departure_airport_code'),
        arrival_airport_code: searchParams.get('arrival_airport_code'),
        departure_date: searchParams.get('departure_date'),
        return_date: searchParams.get('return_date'),
        adults: searchParams.get('adults'),
        children: searchParams.get('children'),
        infants: searchParams.get('infants'),
        class_code: searchParams.get('class_code'),
        is_round_trip: searchParams.get('is_round_trip'),
        origin_departure_code: searchParams.get('origin_departure_code'),
        origin_arrival_code: searchParams.get('origin_arrival_code'),

        airport_code: searchParams.get('airport_code'),
        airport_name: searchParams.get('airport_name'),
        city: searchParams.get('city'),
        country_id: searchParams.get('country_id'),
        airport_type: searchParams.get('airport_type'),

        passenger_id: searchParams.get('passenger_id'),
        first_name: searchParams.get('first_name'),
        last_name: searchParams.get('last_name'),
        title: searchParams.get('title'),
        citizen_id: searchParams.get('citizen_id'),
        date_of_birth: searchParams.get('date_of_birth'),
        nationality: searchParams.get('nationality'),
        passenger_type: searchParams.get('passenger_type'),

        model: searchParams.get('model'),
        airline_id: searchParams.get('airline_id'),
        aircraft_type: searchParams.get('aircraft_type')
    }

    // Kết quả trả về sẽ có adults/children/infants là string | undefined
    return omitBy(config, (value) => isUndefined(value) || value === null || value === '') as FlightQueryConfig
}
