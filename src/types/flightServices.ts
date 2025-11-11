export interface BaggageOption {
    baggage_service_id: number
    weight_kg: string
    price: string
    description: string
    is_active: boolean
}

export interface MealOption {
    meal_service_id: number
    meal_name: string
    meal_description: string
    price: string
    is_vegetarian: boolean
    is_halal: boolean
    is_active: boolean
}
