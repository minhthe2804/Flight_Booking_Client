import http from "~/utils/http"

export interface AirlineListResponse {
    success: boolean
    message: string
    data: (
        | {
              airline_id: number
              airline_code: string
              airline_name: string
              country_id: number
              service_config: null
              logo_url: string
              is_active: boolean
          }
        | {
              airline_id: number
              airline_code: string
              airline_name: string
              country_id: number
              service_config: null
              logo_url: null
              is_active: boolean
          }
    )[]
    meta: {
        pagination: {
            currentPage: number
            totalPages: number
            totalItems: number
            itemsPerPage: number
            hasNextPage: boolean
            hasPrevPage: boolean
        }
    }
    timestamp: string
}


export const airlineApi = {
    getAirlines: () => http.get<AirlineListResponse>('admin/airlines')
}
