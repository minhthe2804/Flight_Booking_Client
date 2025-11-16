import { SuccessResponse } from '~/types/utils.type'
import http from '~/utils/http'
export interface Country {
    country_id: number
    country_name: string
    country_code: string // 'VN', 'US', ...
}

// Kiểu cho Form (Gửi đi)
export type CountryFormData = Omit<Country, 'country_id'>

// Kiểu cho toàn bộ response
export type CountryResponse = SuccessResponse<Country[]>

// Kiểu cho response chi tiết
export type CountryDetailResponse = SuccessResponse<Country>

export const countryApi = {
    getCountriesUser: () => http.get('countries'),
    getCountries: () => http.get('admin/countries'),
    createCountry: (data: CountryFormData) => {
        return http.post<CountryDetailResponse>('/api/countries', data)
    }
}
