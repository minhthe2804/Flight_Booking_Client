import { createContext, useState } from 'react'
import { User } from '~/types/user.type'
import { getAccesTokenFromLS, getProfileFromLS } from '~/utils/auth'

interface AppContextInterface {
    isAuthenticated: boolean
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    profile: User | null
    setProfile: React.Dispatch<React.SetStateAction<User | null>>

    reset: () => void
}

const initialAppContext: AppContextInterface = {
    isAuthenticated: Boolean(getAccesTokenFromLS()),
    setIsAuthenticated: () => null,
    profile: getProfileFromLS(),
    setProfile: () => null,
    reset: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
    const [profile, setProfile] = useState<User | null>(initialAppContext.profile)

    const reset = () => {
        setIsAuthenticated(false)

        setProfile(null)
    }

    const value = {
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,

        reset
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
