import http from '~/utils/http'

export interface ZaloSucessPayment {
    success: boolean
    message: string
    data: {
        payment_url: string
        app_trans_id: string
        booking_reference: string
    }
    meta: null
    timestamp: string
}

export const zalopayApi = {
    createZaloPayPayment: (body: { booking_id: number }) => {
        return http.post<ZaloSucessPayment>('/payments/zalopay/create', body)
    }
}
