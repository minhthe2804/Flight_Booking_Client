export interface searchFlight {
    success: boolean
    message: string
    data: {
        flight_id: number
        flight_number: string
        airline: {
            id: number
            name: string
            code: string
            logo_url: string
        }
        aircraft: {
            id: number
            model: string
            total_seats: number
        }
        departure: {
            airport: {
                id: number
                code: string
                name: string
                city: string
            }
            time: string
        }
        arrival: {
            airport: {
                id: number
                code: string
                name: string
                city: string
            }
            time: string
        }
        duration: string
        status: string
        available_seats: number
        starting_price: number
        travel_class: {
            id: number
            name: string
            code: string
        }
    }[]
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
    timestamp: string
}

// Kiểu dữ liệu cho MỘT chuyến bay (ví dụ)
export interface Flight {
    flight_id: number
    flight_number: string
    airline: {
        id: number
        name: string
        code: string
        logo_url: string
    }
    aircraft: {
        id: number
        model: string
        total_seats: number
    }
    departure: {
        airport: {
            id: number
            code: string
            name: string
            city: string
        }
        time: string
    }
    arrival: {
        airport: {
            id: number
            code: string
            name: string
            city: string
        }
        time: string
    }
    duration: string
    status: string
    available_seats: number
    starting_price: number
    travel_class: {
        id: number
        name: string
        code: string
    }
}

// Kiểu dữ liệu cho KẾT QUẢ trả về từ API (ví dụ)
// Thường API sẽ trả về một cấu trúc bọc ngoài
export interface FlightSearchResponse {
    success: boolean
    message: string
    data: Flight[] // Mảng các chuyến bay tìm được
}

