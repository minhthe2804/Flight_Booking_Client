import http from '~/utils/http'
import { SuccessResponse } from '~/types/utils.type'
import { PromotionFilter } from '~/types/promotion'

// --- 1. KIỂU DỮ LIỆU TỪ API ---
export interface Promotion {
    promotion_id: number
    promotion_code: string
    description: string
    discount_type: 'percentage' | 'fixed_amount'
    discount_value: string // API trả về "15.00"
    min_purchase: string // API trả về "300.00"
    start_date: string // YYYY-MM-DD
    end_date: string // YYYY-MM-DD
    is_active: boolean
    usage_limit: number
    usage_count: number
    created_at: string
    updated_at: string
}

// Kiểu cho 1 Khuyến mãi (dùng cho Form)
export type PromotionFormData = Omit<
    Promotion,
    'promotion_id' | 'usage_count' | 'created_at' | 'updated_at' | 'discount_value' | 'min_purchase'
> & {
    promotion_id: number
    discount_value: number // Form dùng number
    min_purchase: number // Form dùng number
}

// Kiểu cho toàn bộ response (bao gồm pagination)
export type PromotionListResponse = SuccessResponse<{
    promotions: Promotion[] // Sửa: API của bạn trả về { contacts: [] }
    pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
        hasNextPage: boolean
        hasPrevPage: boolean
    }
}>

// Kiểu cho response chi tiết (Thêm/Sửa)
export type PromotionDetailResponse = SuccessResponse<Promotion>

const URL_PROMOTION = '/promotions'

export const promotionApi = {
    getPromotion: () => http.get<SuccessResponse<Promotion[]>>(URL_PROMOTION),

    getPromotions: (params: PromotionFilter) => {
        return http.get<PromotionListResponse>('/admin/promotions', { params })
    },

    createPromotion: (data: Omit<PromotionFormData, 'promotion_id'>) => {
        return http.post<PromotionDetailResponse>('/admin/promotions', data)
    },

    updatePromotion: (id: number, data: Partial<PromotionFormData>) => {
        return http.put<PromotionDetailResponse>(`/admin/promotions/${id}`, data)
    },

    deletePromotion: (id: number) => {
        return http.delete<SuccessResponse<{}>>(`/admin/promotions/${id}`)
    }
}
