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

