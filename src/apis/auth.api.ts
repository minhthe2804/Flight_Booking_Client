import { User } from '~/types/user.type'
import http from '~/utils/http'

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
    }) => http.post(URL_REGISTER, body),
    login: (body: { email: string; password: string }) => http.post(URL_LOGIN, body),
    getAccount: () => http.get<User>(URL_LOGIN),
    logout: () => http.post(URL_LOGOUT)
}

export default authApi
