// Kiểu cho một dịch vụ bên trong 'services_included'
export interface ServiceFeatureOne {
    package_id: number
    service_id: number
    name: string
    type: string
    value: number | null
    unit: string | null
    description: string
}

// Kiểu cho một gói dịch vụ (khớp với API)
export interface ServicePackage {
    success: boolean
    message: string
    data: {
        package_id: number
        airline_id: number
        package_name: string
        package_code: string
        class_type: string
        package_type: string
        price_multiplier: string
        description: null
        services_included: string
        is_active: boolean
        created_at: string
        updated_at: string
        Airline: {
            airline_id: number
            airline_name: string
            airline_code: string
        }
        service_package_id: number
    }[]
    meta: null
    timestamp: string
}

// Kiểu cho một gói dịch vụ (khớp với API)
export interface ServicePackageData {
    package_id: number
    airline_id: number
    package_name: string
    package_code: string
    class_type: string
    package_type: string
    price_multiplier: string
    description: null
    services_included: string
    is_active: boolean
    created_at: string
    updated_at: string
    Airline: {
        airline_id: number
        airline_name: string
        airline_code: string
    }
    service_package_id: number
}

export interface PackageConfig {
    success: boolean
    message: string
    data: any[]
    meta: any
    timestamp: string
}

export interface ServiceFeature {
    service_id: number
    name: string
    type: string // 'baggage_hand', 'baggage_check', 'ticket_refund'...
    value: number | null // 23 (kg), 80 (%)
    unit: string | null // "kg", "%"
    description: string
}
