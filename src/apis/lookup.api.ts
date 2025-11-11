import { LookupResponse } from '~/types/lookup.type'
import http from '~/utils/http' // Giả định bạn có file http client

export const lookupApi = {
    /**
     * Lấy thông tin chi tiết đặt chỗ bằng mã tham chiếu (PNR)
     * @param bookingReference - Mã đặt chỗ (ví dụ: 'DXPOIW')
     */
    getlookup: (bookingReference: string) => {
        return http.get<LookupResponse>(`booking-lookup/lookup/${bookingReference}`)
    },

    /**
     * Tải file PDF vé điện tử
     * @param bookingReference - Mã đặt chỗ (ví dụ: 'DXPOIW')
     */
    getEticket: (bookingReference: string) => {
        return http.get(`/eticket/${bookingReference}/pdf`, {
            responseType: 'blob' // Rất quan trọng: để nhận về file
        })
    }
}
