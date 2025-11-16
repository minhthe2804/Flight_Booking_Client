import http from '~/utils/http'

// 1. Định nghĩa Type chung
// (T đã được sửa thành kiểu generic <T> để dùng chung)
interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}

// 2. Định nghĩa Type cho từng loại dữ liệu
interface WeeklyRevenueData {
    period: string
    total_revenue: number
    total_bookings: number
    percentage_change: number
    previous_revenue: number
    week_start: string
    week_end: string
}

interface MonthlyRevenueData {
    period: string
    total_revenue: number
    total_bookings: number
    month_start: string
    month_end: string
}

interface TodayBookingsData {
    date: string
    total_bookings: number
    total_tickets_sold: number
}

interface UserStatsData {
    total_users: number
    total_passengers: number
    passenger_ratio: number
}

interface AirlineMarketShareData {
    period: string
    period_start: string
    period_end: string
    total_tickets: number
    airlines: Array<{
        airline_id: number
        airline_code: string
        airline_name: string
        ticket_count: number
        market_share_percentage: number
    }>
}

export type MarketSharePeriod = '7days' | '14days'

interface RevenueTrendData {
    month: number
    year: number
    total_orders: number
    total_revenue: number
    daily_revenue: Array<{
        date: string
        orders_count: number
        revenue: number
    }>
}

interface BookingStatsData {
    period: string
    period_start: string
    period_end: string
    total_bookings: number
    total_passengers: number
    daily_stats: Array<{
        date: string
        bookings_count: number
        passengers_count: number
    }>
}

interface BaggageStatsData {
    period: string
    period_start: string
    period_end: string
    total_orders: number
    total_revenue: number
    baggage_services: Array<{
        date: string
        revenue: number
        orders_count: number // Giả định
    }>
}

// 3. Đối tượng API
export const DashboardApi = {
    getWeeklyRevenue: () => http.get<ApiResponse<WeeklyRevenueData>>('admin/dashboard/weekly-revenue'),

    getMonthlyRevenue: () => http.get<ApiResponse<MonthlyRevenueData>>('admin/dashboard/monthly-revenue'),

    getTodayBookings: () => http.get<ApiResponse<TodayBookingsData>>('admin/dashboard/today-bookings'),

    getUserStats: () => http.get<ApiResponse<UserStatsData>>('admin/dashboard/user-stats'),

    getAirlineMarketShare: (period: MarketSharePeriod) =>
        http.get<ApiResponse<AirlineMarketShareData>>(`admin/analytics/airline-market-share?period=${period}`),

    exportAirlineMarketShare: (period: MarketSharePeriod) => {
        return http.get(`admin/analytics/airline-market-share/export?period=${period}`, {
            responseType: 'blob'
        })
    },

    getRevenueTrend: (month: number, year: number) =>
        http.get<ApiResponse<RevenueTrendData>>(`admin/analytics/revenue-trend?month=${month}&year=${year}`),

    exportRevenueTrend: (month: number, year: number) => {
        return http.get(`admin/analytics/revenue-trend/export?month=${month}&year=${year}`, {
            responseType: 'blob'
        })
    },

    getBookingStats: (period: MarketSharePeriod) =>
        http.get<ApiResponse<BookingStatsData>>(`admin/analytics/booking-stats?period=${period}`),

    exportBookingStats: (period: MarketSharePeriod) => {
        return http.get(`admin/analytics/booking-stats/export?period=${period}`, {
            responseType: 'blob'
        })
    },

    getBaggageStats: (period: MarketSharePeriod) =>
        http.get<ApiResponse<BaggageStatsData>>(`admin/analytics/baggage-service-stats?period=${period}`),

    exportBaggageStats: (period: MarketSharePeriod) => {
        return http.get(`admin/analytics/baggage-service-stats/export?period=${period}`, {
            responseType: 'blob' // Yêu cầu nhận về file
        })
    }
}
