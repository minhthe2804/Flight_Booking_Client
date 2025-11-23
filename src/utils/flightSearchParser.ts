// Utility để parse câu truy vấn tiếng Việt tìm kiếm chuyến bay

export interface ParsedFlightSearch {
    departure_airport_code?: string
    arrival_airport_code?: string
    departure_date?: string
    isValid: boolean
    confidence: number
}

// Danh sách từ khóa phổ biến cho tìm kiếm chuyến bay
const SEARCH_KEYWORDS = [
    'tìm kiếm',
    'tìm',
    'search',
    'chuyến bay',
    'flight',
    'vé máy bay',
    'ticket'
]

const FROM_KEYWORDS = ['từ', 'from', 'đi', 'departure']
const TO_KEYWORDS = ['đến', 'to', 'tới', 'arrival']
const DATE_KEYWORDS = ['ngày', 'date', 'vào', 'on', 'lúc']

// Mapping các tên sân bay phổ biến sang mã sân bay
const AIRPORT_MAPPINGS: Record<string, string> = {
    // Việt Nam
    'hồ chí minh': 'SGN',
    'tp hcm': 'SGN',
    'sài gòn': 'SGN',
    'ho chi minh': 'SGN',
    'hà nội': 'HAN',
    'hanoi': 'HAN',
    'nội bài': 'HAN',
    'noi bai': 'HAN',
    'đà nẵng': 'DAD',
    'da nang': 'DAD',
    'danang': 'DAD',
    // Quốc tế
    'bangkok': 'BKK',
    'singapore': 'SIN',
    'kuala lumpur': 'KUL',
    'seoul': 'ICN',
    'quảng châu': 'CAN',
    'guangzhou': 'CAN'
}

/**
 * Parse câu truy vấn tiếng Việt để tìm thông tin chuyến bay
 * @param query - Câu truy vấn của người dùng
 * @param airports - Danh sách sân bay (optional, để matching chính xác hơn)
 * @returns ParsedFlightSearch object
 */
export function parseFlightSearchQuery(
    query: string,
    airports?: Array<{ code: string; name: string; city: string }>
): ParsedFlightSearch {
    const lowerQuery = query.toLowerCase().trim()
    let confidence = 0
    let departure_airport_code: string | undefined
    let arrival_airport_code: string | undefined
    let departure_date: string | undefined

    // Kiểm tra xem có phải là câu tìm kiếm chuyến bay không
    const isFlightSearch = SEARCH_KEYWORDS.some(keyword => lowerQuery.includes(keyword))
    if (!isFlightSearch) {
        // Nếu không có từ khóa tìm kiếm, kiểm tra xem có "từ ... đến" không
        const hasFromTo = FROM_KEYWORDS.some(kw => lowerQuery.includes(kw)) &&
                         TO_KEYWORDS.some(kw => lowerQuery.includes(kw))
        if (!hasFromTo) {
            return { isValid: false, confidence: 0 }
        }
    }

    confidence += 0.3 // Có từ khóa tìm kiếm

    // Tìm sân bay đi (departure)
    const fromIndex = findKeywordIndex(lowerQuery, FROM_KEYWORDS)
    if (fromIndex !== -1) {
        const afterFrom = lowerQuery.substring(fromIndex)
        const toIndex = findKeywordIndex(afterFrom, TO_KEYWORDS)
        const airportText = toIndex !== -1 
            ? afterFrom.substring(0, toIndex).trim()
            : afterFrom.trim()
        
        departure_airport_code = extractAirportCode(airportText, airports)
        if (departure_airport_code) {
            confidence += 0.3
        }
    }

    // Tìm sân bay đến (arrival)
    const toIndex = findKeywordIndex(lowerQuery, TO_KEYWORDS)
    if (toIndex !== -1) {
        const afterTo = lowerQuery.substring(toIndex)
        const dateIndex = findKeywordIndex(afterTo, DATE_KEYWORDS)
        const airportText = dateIndex !== -1
            ? afterTo.substring(0, dateIndex).trim()
            : afterTo.trim()
        
        arrival_airport_code = extractAirportCode(airportText, airports)
        if (arrival_airport_code) {
            confidence += 0.3
        }
    }

    // Tìm ngày khởi hành
    const dateIndex = findKeywordIndex(lowerQuery, DATE_KEYWORDS)
    if (dateIndex !== -1) {
        const afterDate = lowerQuery.substring(dateIndex)
        departure_date = extractDate(afterDate)
        if (departure_date) {
            confidence += 0.1
        }
    }

    // Nếu không tìm thấy ngày, thử tìm ngày trong toàn bộ câu
    if (!departure_date) {
        departure_date = extractDate(lowerQuery)
    }

    const isValid = !!(departure_airport_code && arrival_airport_code)
    
    return {
        departure_airport_code,
        arrival_airport_code,
        departure_date,
        isValid,
        confidence: Math.min(confidence, 1.0)
    }
}

/**
 * Tìm index của từ khóa đầu tiên trong chuỗi
 */
function findKeywordIndex(text: string, keywords: string[]): number {
    for (const keyword of keywords) {
        const index = text.indexOf(keyword)
        if (index !== -1) {
            return index + keyword.length
        }
    }
    return -1
}

/**
 * Trích xuất mã sân bay từ text
 */
function extractAirportCode(
    text: string,
    airports?: Array<{ code: string; name: string; city: string }>
): string | undefined {
    // Loại bỏ các từ khóa không cần thiết
    const cleaned = text
        .replace(/^(từ|from|đi|departure|đến|to|tới|arrival|ngày|date|vào|on|lúc)\s+/i, '')
        .trim()

    // Nếu là mã sân bay 3 ký tự (ví dụ: SGN, HAN)
    const codeMatch = cleaned.match(/\b([A-Z]{3})\b/i)
    if (codeMatch) {
        return codeMatch[1].toUpperCase()
    }

    // Tìm trong mapping
    for (const [key, code] of Object.entries(AIRPORT_MAPPINGS)) {
        if (cleaned.includes(key)) {
            return code
        }
    }

    // Nếu có danh sách sân bay, tìm kiếm trong đó
    if (airports) {
        for (const airport of airports) {
            // Tìm theo tên sân bay
            if (cleaned.includes(airport.name.toLowerCase()) || 
                cleaned.includes(airport.city.toLowerCase())) {
                return airport.code
            }
            // Tìm theo mã sân bay
            if (cleaned.includes(airport.code.toLowerCase())) {
                return airport.code
            }
        }
    }

    return undefined
}

/**
 * Trích xuất ngày từ text
 * Hỗ trợ các format: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, "ngày mai", "hôm nay", etc.
 */
function extractDate(text: string): string | undefined {
    // Loại bỏ các từ khóa ngày
    const cleaned = text
        .replace(/^(ngày|date|vào|on|lúc)\s+/i, '')
        .trim()

    // Format: DD/MM/YYYY hoặc DD-MM-YYYY
    const dateMatch1 = cleaned.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/)
    if (dateMatch1) {
        const day = dateMatch1[1].padStart(2, '0')
        const month = dateMatch1[2].padStart(2, '0')
        const year = dateMatch1[3]
        return `${year}-${month}-${day}`
    }

    // Format: YYYY-MM-DD
    const dateMatch2 = cleaned.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/)
    if (dateMatch2) {
        const year = dateMatch2[1]
        const month = dateMatch2[2].padStart(2, '0')
        const day = dateMatch2[3].padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    // Format: DD/MM/YY
    const dateMatch3 = cleaned.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/)
    if (dateMatch3) {
        const day = dateMatch3[1].padStart(2, '0')
        const month = dateMatch3[2].padStart(2, '0')
        const year = '20' + dateMatch3[3]
        return `${year}-${month}-${day}`
    }

    // Xử lý các từ khóa đặc biệt
    const today = new Date()
    if (cleaned.includes('hôm nay') || cleaned.includes('today')) {
        return formatDate(today)
    }
    if (cleaned.includes('ngày mai') || cleaned.includes('tomorrow')) {
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        return formatDate(tomorrow)
    }
    if (cleaned.includes('ngày kia') || cleaned.includes('day after tomorrow')) {
        const dayAfter = new Date(today)
        dayAfter.setDate(dayAfter.getDate() + 2)
        return formatDate(dayAfter)
    }

    // Tìm số ngày trong tương lai (ví dụ: "3 ngày nữa")
    const daysMatch = cleaned.match(/(\d+)\s*(ngày|day)/)
    if (daysMatch) {
        const days = parseInt(daysMatch[1])
        const futureDate = new Date(today)
        futureDate.setDate(futureDate.getDate() + days)
        return formatDate(futureDate)
    }

    return undefined
}

/**
 * Format date thành YYYY-MM-DD
 */
function formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

