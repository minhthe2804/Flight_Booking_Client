// src/types.ts

// --- Cấu trúc chung ---
export interface ChatMessage {
    sender: 'user' | 'bot'
    text: string | any // 'any' để cho phép bot trả về JSON
    type?:
        | 'text'
        | 'assistant_response'
        | 'insights_response'
        | 'recommen_history'
        | 'suggestions_response'
        | 'recommendations_response'
        | 'track_search_response'
        | 'travel_advice_response'
        | 'family_travel_response'
}

export interface ApiError extends Error {
    message: string
    status?: number
}

export interface BasicApi {
    user_message: string
    ai_response: string
    timestamp: string
    model: string
    context_used: boolean
}

// Interface chung cho phản hồi API (vì API của bạn trả về { data: ... })
export interface ApiResponse<T> {
    data: T
    message?: string
    success?: boolean
}

// --- (MỚI) Cấu trúc cho Context ---
export interface UserContext {
    family_composition?: {
        // (MỚI)
        adults: number
        children: number
        ages: number[]
    }
    interests?: string[] // (MỚI)
    accessibility_needs?: boolean // (MỚI)
    budget?: string // (MỚI)
    trip_type?: string
    meeting_locations?: string[]
    client_entertainment?: boolean
    efficiency_priority?: boolean
    // (Key cũ, có thể giữ lại hoặc xóa đi nếu không dùng)
    travel_interest?: string
    duration?: number | string
}

// --- Cấu trúc API CHỨC NĂNG ---

// --- (CẬP NHẬT) Cấu trúc API CHỨC NĂNG ---

// GET /api/ai/insights
export interface InsightPreferences {
    preferred_airlines: string[]
    preferred_routes: string[]
    preferred_times: number[]
    preferred_class: string
    preferred_passengers: string
    search_frequency: number
}
export interface InsightPatterns {
    booked_airlines: string[]
    booked_routes: string[]
    booked_times: number[]
    booked_classes: string[]
    booking_frequency: number
    average_booking_advance: number
}
export interface InsightStats {
    most_searched_routes: string[]
    preferred_booking_advance: number
    search_frequency: number
    booking_frequency: number
    preferred_travel_times: number[]
    airline_loyalty: number
}
// (CẬP NHẬT) InsightsData giờ chứa tất cả
export interface InsightsData {
    preferences: InsightPreferences
    patterns: InsightPatterns
    insights: InsightStats
    generated_at: string
}

// GET /api/ai/search-history
export interface SearchHistoryRecord {
    id: number
    departure_airport_code: string
    arrival_airport_code: string
    departure_date: string
}
export type SearchHistoryData = SearchHistoryRecord[]

//  GET /api/ai/search-suggestions
export interface SuggestionAirport {
    type: 'airport'
    code: string
    name: string
    city: string
    relevance_score: number
}
export interface SuggestionRouteDeparture {
    code: string
    name: string
    city: string
}
export interface SuggestionRoute {
    type: 'route'
    departure: SuggestionRouteDeparture
    arrival: SuggestionRouteDeparture // Dùng chung kiểu
    relevance_score: number
}

export type SuggestionItem = SuggestionAirport | SuggestionRoute

export interface SuggestionsData {
    suggestions: SuggestionItem[] // <-- Mảng hỗn hợp
    query: string
    total_count: number
}
// --- Cấu trúc API CHỨC NĂNG ---

// (CẬP NHẬT) Định nghĩa cấu trúc JSON mới
export interface Airport {
    airport_id: number
    airport_code: string
    airport_name: string
    city: string
}
export interface Airline {
    airline_id: number
    airline_name: string
    airline_code: string
}
export interface Flight {
    flight_id: number
    flight_number: string
    departure_time: string
    arrival_time: string
    economy_price: string
    business_price: string
    Airline: Airline
    DepartureAirport: Airport
    ArrivalAirport: Airport
}
export interface FlightRecommendation {
    recommendation_id: number
    recommendation_score: string
    recommendation_reason: string
    Flight: Flight
}

// (CẬP NHẬT) Kiểu dữ liệu trả về của API Recommendations
export type RecommenHistory = FlightRecommendation[] // <-- API trả về một mảng

// (FlightArrival có thể dùng chung kiểu FlightDeparture)

// (CẬP NHẬT) Định nghĩa cấu trúc JSON mới cho Recommendations
export interface Airline {
    id: number
    name: string
    code: string
    logo_url: string
}
export interface Aircraft {
    id: number
    model: string
    total_seats: number
}
export interface Airport {
    id: number
    code: string
    name: string
    city: string
}
export interface FlightDeparture {
    airport: Airport
    time: string
}

export interface NewRecommendation {
    flight_id: number
    flight_number: string
    airline: Airline
    aircraft: Aircraft
    departure: FlightDeparture
    arrival: FlightDeparture
    duration: string
    status: string
    available_seats: number
    starting_price: string | null
    recommendation_score: number
    recommendation_reasons: string[]
}

// (CẬP NHẬT) Kiểu dữ liệu trả về của API Recommendations
export interface RecommendationsData {
    recommendations: NewRecommendation[] // <-- Mảng các chuyến bay
    total_count: number
    search_criteria: {
        limit: number
        departure_airport_code: string
        arrival_airport_code: string
        departure_date: string
        class_code: string
    }
}

// (CẬP NHẬT) POST /api/ai/track-search
export interface TrackSearchBody {
    departure_airport_code: string
    arrival_airport_code: string
    departure_date: string
    return_date?: string | null // <-- CẬP NHẬT
    passengers: number
    class_code: string
}
export interface TrackSearchData {
    search_params: TrackSearchBody
    tracked_at: string
}
export interface TrackSearchResponse {
    // <-- CẬP NHẬT
    success: boolean
    message: string
    data: TrackSearchData
    meta: null
    timestamp: string
}

// POST /api/ai/booking-assistant
export interface BookingAssistantBody {
    flight_id: number
    passengers: number
    class_code: string
}

export interface BookingAssistantData {
    seat_recommendations?: {
        recommended_seats: string[]
        reason: string
    }
    baggage_suggestions?: {
        recommended_baggage: string
        reason: string
    }
    meal_suggestions?: {
        // <-- (MỚI) Thêm từ JSON
        recommended_meals: string[]
        reason: string
    }
    insurance_suggestion?: {
        recommended: boolean
        reason: string
    }
    check_in_reminder?: {
        check_in_time: string
        reminder_message: string
    }
}

// --- Cấu trúc API CHAT AI & LỖI ---

// Bodies (Request Payloads)
export interface ChatBody {
    message: string
    context?: UserContext // <-- ĐÃ THÊM VÀO
}

export interface MultiTurnChatBody {
    message: string
    history: ChatMessage[]
    context?: UserContext // <-- Cũng nên thêm vào đây
}

export interface AdviceBody {
    query: string
    context?: UserContext // <-- Cũng nên thêm vào đây
}

export interface TooLongBody {
    message: string
    length: number
}

// Responses
export interface ChatResponse {
    reply: string
    message: string
}

export interface TestConnectionResponse {
    message: string
    success: boolean
}

// Kiểu cho TravelAdvice
export interface AdviceData {
    topic: string
    advice: string
    timestamp: string
    model: string
}
export interface AdviceResponse {
    success: boolean
    message: string
    data: AdviceData
    meta: null
    timestamp: string
}
