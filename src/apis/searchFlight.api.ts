// src/apis/searchFlight.api.ts
import { FlightQueryConfig } from '~/hooks/useSearchFlightQueryConfig'
import { searchFlight } from '~/types/searchFlight.type'
import http from '~/utils/http'

const URL_SEARCHFLIGHT = 'flights/search'

export const searchFlightApi = {
    searchFlights: (params: FlightQueryConfig) =>
        http.get<searchFlight>(URL_SEARCHFLIGHT, {
            params
        })
}
