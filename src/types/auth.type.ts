import { SuccessResponse } from './utils.type'
import { User } from './user.type'

export type AuthResponse = SuccessResponse<{
    accessToken: string
    refreshToken: string
    user: User
}>

export type RefreshTokenResponse = SuccessResponse<{ access_token: string }>
