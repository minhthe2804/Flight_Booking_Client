export interface FlightBookingDataAPI {
    flight_id: number
    class_type: string
    service_package_id: number
    contact_info: {
        email: string
        phone: string
        first_name: string
        last_name: string
    }
    passengers: {
        first_name: string
        last_name: string
        gender: string
        date_of_birth: string
        nationality: string
        passenger_type: string
        title: string
        passport_number: string
        citizen_id: string
    }[]
    meal_options: {
        passenger_id: number
        meal_id: number
        quantity: number
        flight_leg?: string | undefined
    }[]
    baggage_options: {
        passenger_id: number
        baggage_id: number
        flight_leg?: string | undefined
    }[]
    promotion_code: string
}
