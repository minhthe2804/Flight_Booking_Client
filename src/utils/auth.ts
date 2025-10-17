import { User } from "~/types/user.type"

export const localStorageEventTarget = new EventTarget()

export const setAccesTokenToLS = (access_token: string) => {
    localStorage.setItem('access_token', access_token)
}

export const setRefreshTokenToLS = (refresh_token: string) => {
    localStorage.setItem('refresh_token', refresh_token)
}

export const clearLS = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('profile')
    const clearLSEvent = new Event('clearLS')
    localStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getAccesTokenFromLS = () => localStorage.getItem('access_token') || ''

export const getRefreshTokenFromLS = () => localStorage.getItem('refresh_token') || ''

export const getProfileFromLS = () => {
    const result = localStorage.getItem('profile')
    return result ? JSON.parse(result) : null
}

export const setProfileFromLS = (profile: User) => {
    localStorage.setItem('profile', JSON.stringify(profile))
}
