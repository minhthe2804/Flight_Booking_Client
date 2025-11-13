import axios, { AxiosError } from 'axios'
import HttpStatusCode from '~/constants/httpStatusCode.emum'
import { ErrorResponse } from '~/types/utils.type'

export function formatCurrency(amount: number) {
    return amount.toLocaleString('vi-VN') + ' đ'
}

export function formatCurrencyVND(currency: number) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(currency)
}

export const formatDurationLookup = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return ''
    const start = new Date(startTime)
    const end = new Date(endTime)
    let diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60)

    if (diffInMinutes < 0) diffInMinutes += 24 * 60 // Xử lý bay qua đêm

    const hours = Math.floor(diffInMinutes / 60)
    const minutes = Math.round(diffInMinutes % 60) // Làm tròn phút

    return `${hours}h ${minutes}m`
}

export const formatDateForAPI = (dateInput: Date | string | undefined | null): string => {
    let date: Date

    // 1. Kiểm tra đầu vào
    if (dateInput instanceof Date) {
        // A. Nếu là Date object (từ RHF)
        date = dateInput
    } else if (typeof dateInput === 'string') {
        // B. Nếu là String (từ localStorage/JSON)
        date = new Date(dateInput)
    } else {
        // C. Nếu là null/undefined
        return '' // Hoặc trả về null tùy yêu cầu API
    }

    // 2. Kiểm tra Date hợp lệ
    if (isNaN(date.getTime())) {
        return '' // Trả về rỗng nếu Date không hợp lệ (ví dụ: "Invalid Date")
    }

    // 3. Format (Đây là Dòng 18 cũ của bạn)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0') // +1 vì tháng 0-11
    const day = date.getDate().toString().padStart(2, '0')

    return `${day}-${month}-${year}`
}

export const formatFlightTimeOnly = (isoString: string, locale = 'vi-VN') => {
    if (!isoString) return ''

    try {
        const dateObject = new Date(isoString)

        // Explicitly type the options object
        const formatOptions: Intl.DateTimeFormatOptions = {
            hour: '2-digit', // Keep as literal type
            minute: '2-digit', // Keep as literal type
            hour12: false
        }

        return new Intl.DateTimeFormat(locale, formatOptions).format(dateObject)
    } catch (error) {
        console.error('Lỗi định dạng giờ:', error)
        return 'Invalid Time'
    }
}

export const formatDuration = (durationString: string) => {
    if (!durationString || !durationString.includes(':')) {
        return '' // Return empty if format is wrong
    }

    try {
        const [hoursStr, minutesStr] = durationString.split(':')
        const hours = parseInt(hoursStr, 10)
        const minutes = parseInt(minutesStr, 10)

        // Handle invalid numbers
        if (isNaN(hours) || isNaN(minutes)) {
            return 'Invalid Duration'
        }

        // Handle 00:00 case
        if (hours === 0 && minutes === 0) {
            return '0m'
        }

        let result = ''
        if (hours > 0) {
            result += `${hours}h` // Append 'h' for hours
        }
        if (minutes >= 0) {
            // Always show minutes, even if 0 when hours > 0
            if (hours > 0) {
                // Add space only if hours exist
                result += ' '
            }
            result += `${minutes}m` // Append 'm' for minutes
        }

        return result.trim() // Use trim to handle potential leading/trailing spaces if logic changes
    } catch (error) {
        console.error('Error formatting duration:', error)
        return 'Invalid Duration'
    }
}

export const formatCustomDate = (dateString: string) => {
    if (!dateString) return ''

    try {
        // Tạo đối tượng Date. Thêm 'T00:00:00' để tránh lỗi timezone không nhất quán
        const date = new Date(`${dateString}T00:00:00`)

        // Lấy số thứ tự ngày trong tuần (0=Chủ Nhật, 6=Thứ Bảy)
        const dayOfWeek = date.getDay()

        // Lấy ngày, tháng, năm
        const day = String(date.getDate()).padStart(2, '0') // PadStart đảm bảo có 2 chữ số (01, 02...)
        const month = String(date.getMonth() + 1).padStart(2, '0') // Tháng bắt đầu từ 0 nên +1
        const year = date.getFullYear()

        // Ghép lại theo định dạng mong muốn
        return `T${dayOfWeek}, ${day}-${month}-${year}`
    } catch (error) {
        console.error('Lỗi định dạng ngày:', error)
        return 'Invalid Date'
    }
}

// Trả về: "11:56, 03/11/2025"
export const formatDateTime = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)

    const time = date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })

    const day = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })

    return `${time}, ${day}`
}

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
    return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
    return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
    return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
    return (
        isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error) &&
        error.response?.data?.data?.name === 'EXPIRED_TOKEN'
    )
}
