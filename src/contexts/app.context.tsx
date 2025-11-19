import { createContext, useState } from 'react'
import { FlightBookingData } from '~/pages/FlightBooking/pages/FlightBookingDetail/FlightBookingDetail'
import { User } from '~/types/user.type'
import {
    getAccesTokenFromLS,
    getFlightBookingDataFromLS,
    getFlightServicesFromLS,
    getProfileFromLS
} from '~/utils/auth'

interface AppContextInterface {
    isAuthenticated: boolean
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    profile: User | null
    setProfile: React.Dispatch<React.SetStateAction<User | null>>
    flightServicesData: any | null
    setflightServicesData: React.Dispatch<React.SetStateAction<any | null>>
    flightBookingData: FlightBookingData | null
    setFlightBookingData: React.Dispatch<React.SetStateAction<FlightBookingData | null>>
    reset: () => void
}

const initialAppContext: AppContextInterface = {
    isAuthenticated: Boolean(getAccesTokenFromLS()),
    setIsAuthenticated: () => null,
    profile: getProfileFromLS(),
    setProfile: () => null,
    flightServicesData: getFlightServicesFromLS(),
    setflightServicesData: () => null,
    flightBookingData: getFlightBookingDataFromLS(),
    setFlightBookingData: () => null,
    reset: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
    const [profile, setProfile] = useState<User | null>(initialAppContext.profile)
    const [flightServicesData, setflightServicesData] = useState<any | null>(
        initialAppContext.flightServicesData
    )
    const [flightBookingData, setFlightBookingData] = useState<FlightBookingData | null>(
        initialAppContext.flightBookingData
    )

    const reset = () => {
        setIsAuthenticated(false)
        setProfile(null)
        setflightServicesData(null)
        setFlightBookingData(null)
    }

    const value = {
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        flightServicesData,
        setflightServicesData,
        flightBookingData,
        setFlightBookingData,
        reset
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
