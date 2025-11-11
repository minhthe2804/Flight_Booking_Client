import {
    ApiResponse,
    BookingAssistantBody,
    BookingAssistantData,
    InsightsData,
    RecommendationsData,
    SearchHistoryData,
    SuggestionsData,
    TrackSearchBody,
    TrackSearchResponse
} from '~/types/aiTypes'
import http from '~/utils/http'

// --- 1. Recommendations API ---
export const recommendationsApi = {
    getInsights: () => http.get<ApiResponse<InsightsData>>('/ai/insights'),

    getSearchHistory: (params: { page: number; limit: number }) =>
        http.get<ApiResponse<SearchHistoryData>>('/ai/search-history?', { params }),

    getRecommendationsHistory: (params: { page: number; limit: number }) =>
        http.get<ApiResponse<any>>('/ai/recommendations-history', { params }),

    getSearchSuggestions: (params: { query: string; limit: number }) =>
        http.get<ApiResponse<SuggestionsData>>('/ai/search-suggestions', { params }),

    getRecommendations: (params: {
        departure_airport_code: string
        arrival_airport_code: string
        departure_date: string
        limit: number
    }) => http.get<ApiResponse<RecommendationsData>>('/ai/recommendations', { params }),

    trackSearch: (body: TrackSearchBody) => http.post<TrackSearchResponse>('/ai/track-search', body),

    getBookingAssistant: (body: BookingAssistantBody) =>
        http.post<ApiResponse<BookingAssistantData>>('/ai/booking-assistant', body)
}
