import { SuccessResponse } from '~/types/utils.type'
import http from '~/utils/http'

export interface Airline {
    airline_id: number
    airline_name: string
    airline_code: string
}
// --- 1. SỬA: KIỂU DỮ LIỆU TỪ API ---
export interface Aircraft {
    aircraft_id: number
    model: string
    // manufacturer: string // (Đã xóa)
    airline_id: number
    total_seats: number
    business_seats: number // THÊM
    economy_seats: number // THÊM
    aircraft_type: string | null // SỬA: Cho phép null
    Airline: Airline // Object lồng nhau
}

// Kiểu cho 1 Máy bay (dùng cho Form)
// (Tự động cập nhật nhờ Omit)
export type AircraftFormData = Omit<Aircraft, 'Airline'>

// Kiểu cho toàn bộ response (bao gồm pagination)
export type AircraftListResponse = SuccessResponse<{
    data: Aircraft[]
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

// --- KIỂU DỮ LIỆU LỌC (Cho Form Lọc và queryConfig) ---
export type AircraftFilter = {
    page?: string
    limit?: string
    model?: string
    airline_id?: string
    aircraft_type?: string
}

// Kiểu cho response chi tiết (Thêm/Sửa)
export type AircraftDetailResponse = SuccessResponse<Aircraft>

// --- 2. HÀM GỌI API ---
export const aircraftApi = {
    getAircrafts: (params: AircraftFilter) => {
        return http.get<AircraftListResponse>('/admin/aircraft', { params })
    },
    createAircraft: (data: Omit<AircraftFormData, 'aircraft_id'>) => {
        return http.post<AircraftDetailResponse>('/admin/aircraft', data)
    },
    updateAircraft: (id: number, data: Partial<AircraftFormData>) => {
        return http.put<AircraftDetailResponse>(`/admin/aircraft/${id}`, data)
    },
    deleteAircraft: (id: number) => {
        return http.delete<SuccessResponse<{}>>(`/admin/aircraft/${id}`)
    }
}
