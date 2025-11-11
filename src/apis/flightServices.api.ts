import http from '~/utils/http'

export interface FlightBaggageServicesResponse {
    success: boolean
    message: string
    data: {
        baggage_service_id: number
        weight_kg: string
        price: string
        description: string
        is_active: boolean
    }[]
    meta: null
    timestamp: string
}

export interface FlightMealServicesResponse {
    success: boolean
    message: string
    data: {
        meal_service_id: number
        meal_name: string
        meal_description: string
        price: string
        is_vegetarian: boolean
        is_halal: boolean
        is_active: boolean
    }[]
    meta: null
    timestamp: string
}

export const flightServices = {
    getBaggageServices: (flightId: number | string) => {
        return http.get<FlightBaggageServicesResponse>(`flights/${flightId}/baggage-services`)
    },
    getMealServices: (flightId: number | string) => {
        return http.get<FlightMealServicesResponse>(`flights/${flightId}/meal-services`)
    }
}
