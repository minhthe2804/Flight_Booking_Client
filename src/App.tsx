import { ToastContainer } from 'react-toastify'
import useRouteElements from './useRouteElements'
import 'react-toastify/dist/ReactToastify.css'
import HybridChatPopup from './components/HybridChatPopup/HybridChatPopup'
import { useState } from 'react'
import * as T from '~/types/aiTypes' // (MỚI) Import types

function App() {
    const routeElements = useRouteElements()
    const [userContext, setUserContext] = useState<T.UserContext>({
        travel_interest: 'culture and food',
        budget: 'medium',
        duration: '7 days'
    })

    const [userContextFamiLy, setUserContextFamily] = useState<T.UserContext>({
        family_composition: {
            adults: 2,
            children: 2,
            ages: [8, 12]
        },
        interests: ['theme parks', 'museums', 'nature', 'food'],
        accessibility_needs: false,
        budget: 'moderate'
    })

    const [userContextBusiness, setUserContextBusiness] = useState<T.UserContext>({
        trip_type: 'business',
        meeting_locations: ['CBD', 'Marina Bay'],
        client_entertainment: true,
        efficiency_priority: true
    })

    return (
        <div>
            {routeElements}
            <ToastContainer />

            <HybridChatPopup
                context={userContext}
                contextFamily={userContextFamiLy}
                contextBusiness={userContextBusiness}
            />
        </div>
    )
}

export default App
