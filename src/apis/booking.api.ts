import { BookingPayload } from '~/pages/FlightBooking/pages/FlightBookingPayment/FlightBookingPayment'
import { BookingDetailResponse, BookingHistoryResponse } from '~/types/reservation.type'
import { SuccessResponse } from '~/types/utils.type'
import http from '~/utils/http'

export interface BookingSuccess {
    success: boolean
    message: string
    data: {
        booking_id: number
        booking_reference: string
        user_id: number
        flight_id: number
        status: string
        total_amount: number
        base_amount: number
        baggage_fees: number
        meal_fees: number
        service_package_fees: number
        discount_amount: number
        discount_code: null
        tax_amount: number
        final_amount: number
        passengers: number
        allocated_seats: {
            seat_number: string
            price: number
        }[]
        calculation_breakdown: {
            flight_tickets: {
                amount: number
                description: string
            }
            baggage: {
                amount: number
                services: {
                    service_id: number
                    quantity: number
                }[]
            }
            meals: {
                amount: number
                services: {
                    service_id: number
                    quantity: number
                }[]
            }
            service_package: {
                amount: number
                package_id: number
            }
            discount: {
                amount: number
                code: null
                percentage: number
            }
        }
        seat_allocation: string
        message: string
    }
    meta: null
    timestamp: string
}

export interface CancelBookingResponse {
    success: boolean
    message: string
    data: {
        booking_id: number
        status: string
        cancellation_reason: string
    }
    meta: null
    timestamp: string
}


export const bookingApi = {
    createBooking: (payload: BookingPayload) => http.post<BookingSuccess>('bookings', payload),
    getBookingsHistory: (params: { page: number; limit: number; search?: string }) => {
        return http.get<BookingHistoryResponse>('bookings', { params })
    },
    cancelBooking: (bookingId: number, reason: string) => {
        return http.post<CancelBookingResponse>(`/bookings/${bookingId}/cancel`, {
            reason 
        })
    },
     getBookingInfomation: (booking_id: number) => {
    return http.get<BookingDetailResponse>(`/users/bookings/${booking_id}`)
  },
}
