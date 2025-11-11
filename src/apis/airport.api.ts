import { SuccessResponse } from '~/types/utils.type'
import http from '~/utils/http'

// --- 1. KIỂU DỮ LIỆU TỪ API ---
export interface Country {
    country_id: number
    country_name: string
    country_code: string
}

export interface Airport {
    airport_id: number
    airport_code: string
    airport_name: string
    city: string
    country_id: number
    airport_type: 'domestic' | 'international'
    latitude: string
    longitude: string
    Country: Country // Object lồng nhau
}

// Kiểu cho 1 Sân bay (dùng cho Form)
export type AirportFormData = Omit<Airport, 'Country' | 'airport_id' | 'latitude' | 'longitude'> & {
    airport_id: number
}

// Kiểu cho toàn bộ response (bao gồm pagination)
export type AirportListResponse = SuccessResponse<{
    data: Airport[]
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
}>

// Kiểu cho response chi tiết (Thêm/Sửa)
export type AirportDetailResponse = SuccessResponse<Airport>

export interface AirportResponApi {
    success: boolean
    message: string
    data: {
        airport_id: number
        airport_code: string
        airport_name: string
        city: string
        country_id: number
        airport_type: string
        latitude: string
        longitude: string
        Country: {
            country_id: number
            country_name: string
            country_code: string
        }
    }[]
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

export interface CreateAirportResponApi {
    success: boolean
    message: string
    data: {
        airport_type: string
        airport_id: number
        airport_code: string
        airport_name: string
        city: string
        country_id: number
    }
    meta: number
    timestamp: string
}

export interface UpdateAirportRespon {
    success: boolean
    message: string
    data: {
        airport_id: number
        airport_code: string
        airport_name: string
        city: string
        country_id: number
        airport_type: string
        latitude: string
        longitude: string
    }
    meta: null
    timestamp: string
}

export interface DeleteAirportRespon {
    success: boolean
    message: string
    data: {
        airport_id: number
        airport_code: string
        airport_name: string
        city: string
        country_id: number
        airport_type: string
        latitude: string
        longitude: string
    }
    meta: null
    timestamp: string
}

export interface bodyAirport {
    airport_code: string
    airport_name: string
    city: string
    country_id: number
}

export type AirportFilter = {
    page?: string
    limit?: string
    search?: string
    airport_code?: string
    airport_name?: string
    city?: string
    country_id?: string
    airport_type?: string 
}

export const airportApi = {
    getAirport: () => http.get<AirportResponApi>('flights/airports'),

    getAirportAdmin: (params: AirportFilter) => {
        return http.get<AirportListResponse>('admin/airports', { params })
    },
    createAirportAdmin: (body: bodyAirport) => http.post<CreateAirportResponApi>('admin/airports', body),
    updateAirportAdmin: (body: bodyAirport, id: number | string) =>
        http.put<UpdateAirportRespon>(`admin/airports/${id}`, body),
    deleteAirportAdmin: (id: number | string) => http.delete<UpdateAirportRespon>(`admin/airports/${id}`)
}
