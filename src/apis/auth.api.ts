import { User } from '~/types/user.type'
import { SuccessResponse } from '~/types/utils.type'
import http from '~/utils/http'
import { ChangePasswordSchema, ProfileSchema } from '~/utils/rules'

export const URL_REGISTER = 'auth/register'
export const URL_LOGIN = 'auth/login'
export const URL_LOGOUT = 'auth/logout'
export const URL_REFRESH_TOKEN = 'auth/refresh-access-token'

const authApi = {
    registerAccount: (body: {
        first_name: string
        last_name: string
        phone: string
        email: string
        password: string
    }) => http.post<SuccessResponse<User>>(URL_REGISTER, body),
    login: (body: { email: string; password: string }) => http.post<SuccessResponse<User>>(URL_LOGIN, body),
    getAccount: () => http.get<User>(URL_LOGIN),
    logout: () => http.post(URL_LOGOUT)
}

export default authApi

// Định nghĩa kiểu dữ liệu trả về từ API (dựa trên ví dụ của bạn)
interface ProfileApiResponse {
    success: boolean
    message: string
    data: {
        id: number
        email: string
        first_name: string
        middle_name: string | null
        last_name: string
        title: string
        phone: string
        date_of_birth: string // API trả về string YYYY-MM-DD
        citizen_id: string
        roles: string[]
    }
}

// API để LẤY thông tin profile
export const getProfile = () => {
    return http.get<ProfileApiResponse>('auth/profile')
}

export const updateProfile = (body: ProfileSchema) => {
    return http.put<ProfileApiResponse>('auth/profile', body)
}

interface SuccessResponseChangePassword {
    success: boolean
    message: string
}

export const changePassword = (body: Pick<ChangePasswordSchema, 'current_password' | 'new_password'>) => {
    return http.put<SuccessResponseChangePassword>('auth/change-password', body)
}
