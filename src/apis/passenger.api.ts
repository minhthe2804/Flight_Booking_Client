import http from '~/utils/http'
import { SuccessResponse } from '~/types/utils.type'
import { PassengerAdmin, PassengerFilterAdmin as PassengerFilter } from '~/types/passenger' // Import kiểu từ file Passenger.ts

// Kiểu dữ liệu cho 1 hành khách (từ API)
export interface PassengerDetails extends PassengerAdmin {
    created_at: string
}


export type PassengerListResponse = SuccessResponse<{
    data: PassengerDetails[]
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

export const passengerApi = {
    getPassengers: (params: PassengerFilter) => {
        // API sẽ nhận params như: /api/passengers?page=1&limit=5&last_name=Nguyen
        return http.get<PassengerListResponse>('/admin/passengers', { params })
    },

    createPassenger: (data: PassengerAdmin) => {
        // API trả về chi tiết của hành khách vừa tạo
        return http.post<SuccessResponse<PassengerDetails>>('/admin/passengers', data)
    },

    updatePassenger: (id: number, data: PassengerAdmin) => {
        // API trả về chi tiết của hành khách vừa cập nhật
        return http.put<SuccessResponse<PassengerDetails>>(`/admin/passengers/${id}`, data)
    },

    deletePassenger: (id: number) => {
        // API thường trả về { success: true, message: '...' }
        return http.delete<SuccessResponse<{}>>(`/admin/passengers/${id}`)
    }
}
