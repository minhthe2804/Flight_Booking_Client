import { FlightQueryConfig } from '~/hooks/useSearchFlightQueryConfig'

export interface Promotion {
    promotion_id: number
    code: string
    description: string
    discount_percentage: number
    discount_amount: number
    start_date: string
    end_date: string
    is_active: boolean
}

export type PromotionFilter = Pick<
    FlightQueryConfig,
    'page' | 'limit' | 'promotion_code' | 'discount_type' | 'is_active'
>

export type PromotionType = 'Phần trăm' | 'Trực tiếp'
