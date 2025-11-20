import http from '~/utils/http'
import { SuccessResponse } from '~/types/utils.type'

import { ServicePackageAdmin as ApiServicePackage, ServiceFeature } from '~/types/airlineServices.type'
import { Country } from './airport.api'
import { AirlineFilter } from '~/types/airlineAdmin.type'
import { mockServices } from '~/pages/Admin/pages/Airline/components/AirlineForm/AirlineForm'

// --- 1. KIỂU DỮ LIỆU TỪ API (Response - JSON 2) ---
export interface Airline {
    airline_id: number
    airline_code: string
    airline_name: string
    country_id: number
    service_config: string | null
    logo_url: string | null
    is_active: boolean
    class_type: 'economy' | 'business'
    ServicePackages: ApiServicePackage[] // API trả về (PascalCase, string JSON)
    service_packages:ApiServicePackage[]
    Country?: Country
}

// --- 2. SỬA: KIỂU DỮ LIỆU CHO FORM (Payload - JSON 1) ---

// Kiểu cho 'benefits' (lồng nhau)
interface BenefitPayload extends ServiceFeature {
    // (Giống hệt ServiceFeature)
}

export type AirlineSummary = Omit<Airline, 'ServicePackages' | 'Country'> & {
    Country: {
        country_name: string // (Giả sử List API trả về tên Country)
    }
}
// Kiểu cho 'service_packages' (lồng nhau)
interface ServicePackagePayload {
    package_id?: number // Optional khi tạo mới
    package_name: string
    package_code: string
    class_type: 'economy' | 'business'
    package_type: string
    price_multiplier: number // Form dùng number
    benefits: BenefitPayload[] // Form dùng mảng object 'benefits'
}

// Kiểu cho Form chính
export type AirlineFormData = {
    airline_id: number // Thêm ID (dùng cho Sửa)
    airline_code: string
    airline_name: string
    country_id: number // Cho phép undefined (khi chưa chọn)
    logo_url: string | null
    service_packages: ServicePackagePayload[] // mảng 'service_packages',
    country_name?: string
}
// ------------------------------------

// Kiểu cho toàn bộ response (bao gồm pagination)
export type AirlineListResponse = SuccessResponse<{
    data: Airline[]
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
export type AirlineDetailResponse = SuccessResponse<Airline>

// --- 3. HÀM GỌI API (SỬA: Thêm logic chuyển đổi) ---

// Helper: Chuyển đổi Form Data (JSON 1) sang API Payload (JSON 2)
const transformFormDataToPayload = (data: Partial<AirlineFormData>) => {
    const payload: any = { ...data }

    // Chuyển 'benefits' (array) thành 'services_included' (string)
    if (payload.service_packages) {
        payload.service_packages = payload.service_packages.map((pkg: ServicePackagePayload) => {
            // Tách 'benefits' ra
            const { benefits, ...restOfPackage } = pkg

            // SỬA LỖI Ở ĐÂY:
            // Map lại benefits, TẠO RA description mới dựa trên 'value'
            const transformedBenefits = benefits.map((b) => {
                // (Lấy description gốc, vd: "Được phép mang [X]kg...")
                const originalDescription = b.description.includes('[X]')
                    ? b.description
                    : mockServices.find((m) => m.type === b.type)?.description || b.description

                return {
                    ...b,
                    description: originalDescription.replace('[X]', (b.value || 0).toString()),
                    unit: b.unit || null
                }
            })

            return {
                ...restOfPackage,
                services_included: JSON.stringify(transformedBenefits)
            }
        })
    }

    if (payload.country_id === 0 || payload.country_id === undefined) {
        delete payload.country_id
    }

    return payload
}

export const airlineApi = {
    getAirlines: () => http.get<AirlineListResponse>('admin/airlines'),

    getAirlineAdmin: (params: AirlineFilter) => {
        return http.get<AirlineListResponse>('/admin/airlines', { params })
    },

    /**
     * SỬA: Tạo hãng bay
     */
    createAirline: (data: Omit<AirlineFormData, 'airline_id'>) => {
        const payload = transformFormDataToPayload(data)

        return http.post<AirlineDetailResponse>('/admin/airlines', payload)
    },

    /**
     * SỬA: Cập nhật
     */
    updateAirline: (id: number, data: Partial<AirlineFormData>) => {
        const payload = transformFormDataToPayload(data)

        return http.put<AirlineDetailResponse>(`/admin/airlines/${id}`, payload)
    },

    /**
     * Xóa một hãng bay
     */
    deleteAirline: (id: number) => {
        return http.delete<SuccessResponse<{}>>(`/admin/airlines/${id}`)
    },

    getAirlineDetails: (id: number) => {
        return http.get<AirlineDetailResponse>(`/admin/airlines/${id}/details`) // Giả sử API là /details
    }
}
