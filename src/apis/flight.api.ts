import { FlightListResponse } from '~/types/flight.type'
import http from '~/utils/http'

// API lấy danh sách chuyến bay
export const getFlights = () => {
    return http.get<FlightListResponse>('flights/list')
}
