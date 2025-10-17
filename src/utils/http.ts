import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'

import HttpStatusCode from '~/constants/httpStatusCode.emum'
import { AuthResponse, RefreshTokenResponse } from '../types/auth.type'
import {
    clearLS,
    getAccesTokenFromLS,
    getRefreshTokenFromLS,
    setAccesTokenToLS,
    setProfileFromLS,
    setRefreshTokenToLS
} from './auth'
import { path } from '~/constants/path'
import config from '~/constants/config'
import { URL_LOGIN, URL_REFRESH_TOKEN, URL_REGISTER } from '../apis/auth.api'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils'
import { ErrorResponse } from '..//types/utils.type'

export class Http {
    instance: AxiosInstance
    private accessToken: string
    private refreshToken: string
    private refreshTokenRequest: Promise<string> | null
    constructor() {
        this.accessToken = getAccesTokenFromLS()
        this.refreshToken = getRefreshTokenFromLS()
        this.refreshTokenRequest = null
        this.instance = axios.create({
            baseURL: config.baseUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
                // 'expire-access-token': 5, // 10 giây
                // 'expire-refresh-token': 60 * 60 // 1 giờ
            }
        })
        this.instance.interceptors.request.use(
            (config) => {
                if (this.accessToken && config.headers) {
                    config.headers.authorization = this.accessToken
                    return config
                }
                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )
        // Add a response interceptor
        this.instance.interceptors.response.use(
            (response) => {
                const { url } = response.config
                if (url === URL_LOGIN || url === URL_REGISTER) {
                    const data = response.data as AuthResponse
                    this.accessToken = data.data.accessToken
                    this.refreshToken = data.data.refreshToken
                    setAccesTokenToLS(this.accessToken)
                    setRefreshTokenToLS(this.refreshToken)
                    setProfileFromLS(data.data.user)
                } else if (url === path.logout) {
                    this.accessToken = ''
                    this.refreshToken = ''
                    clearLS()
                }
                return response
            },
            (error: AxiosError) => {
                // Xử lí lỗi message trả về không phải lỗi 422 và 401
                if (
                    ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(
                        error.response?.status as number
                    )
                ) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const data: any | undefined = error.response?.data
                    const message = data?.message || error.message
                    toast.error(message)
                }

                // Lỗi Unauthorized (401) có rất nhiều trường hợp
                // - Token không đúng
                // - Không truyền token
                // - Token hết hạn*

                // Nếu là lỗi 401
                if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
                    const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig)
                    const { url } = config
                    // Trường hợp Token hết hạn và request đó không phải là của request refresh token
                    // thì chúng ta mới tiến hành gọi refresh token
                    if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
                        // Hạn chế gọi 2 lần handleRefreshToken
                        this.refreshTokenRequest = this.refreshTokenRequest
                            ? this.refreshTokenRequest
                            : this.handleRefreshToken().finally(() => {
                                  // Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng
                                  setTimeout(() => {
                                      this.refreshTokenRequest = null
                                  }, 10000)
                              })
                        return this.refreshTokenRequest.then((access_token) => {
                            // Nghĩa là chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
                            return this.instance({
                                ...config,
                                headers: { ...config.headers, authorization: access_token }
                            })
                        })
                    }

                    // Còn những trường hợp như token không đúng
                    // không truyền token,
                    // token hết hạn nhưng gọi refresh token bị fail
                    // thì tiến hành xóa local storage và toast message
                    clearLS()
                    this.accessToken = ''
                    this.refreshToken = ''
                    toast.error(error.response?.data.data?.message || error.response?.data.message, { autoClose: 3000 })
                }
                return Promise.reject(error)
            }
        )
    }
    private handleRefreshToken() {
        return this.instance
            .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
                refresh_token: this.refreshToken
            })
            .then((res) => {
                const { access_token } = res.data.data
                setAccesTokenToLS(access_token)
                this.accessToken = access_token
                return access_token
            })
            .catch((error) => {
                clearLS()
                this.accessToken = ''
                this.refreshToken = ''
                throw error
            })
    }
}
const http = new Http().instance
export default http
