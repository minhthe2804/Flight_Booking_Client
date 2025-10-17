import { Outlet, useRoutes } from 'react-router-dom'

import { path } from './constants/path'
import MainLayout from './Layouts/MainLayout'
import Home from './pages/Home'
import Reservation from './pages/Reservation'
import Lookup from './pages/Lookup'
import Promotion from './pages/Promotion'
import Login from './pages/Login'
import Register from './pages/Register'
import SearchFlight from './pages/SearchFlight'
import FlightBooking from './pages/FlightBooking'
import FlightBookingDetail from './pages/FlightBooking/pages/FlightBookingDetail'
import FlightBookingPayment from './pages/FlightBooking/pages/FlightBookingPayment'

export default function useRouteElements() {
    const routeElements = useRoutes([
        {
            path: path.home,
            index: true,
            element: (
                <MainLayout>
                    <Home />
                </MainLayout>
            )
        },
        {
            path: path.reservation,
            element: (
                <MainLayout>
                    <Reservation />
                </MainLayout>
            )
        },
        {
            path: path.lookup,
            element: (
                <MainLayout>
                    <Lookup />
                </MainLayout>
            )
        },
        {
            path: path.promotion,
            element: (
                <MainLayout>
                    <Promotion />
                </MainLayout>
            )
        },
        {
            path: path.searchFlight,
            element: (
                <MainLayout>
                    <SearchFlight />
                </MainLayout>
            )
        },
        {
            path: path.login,
            element: <Login />
        },
        {
            path: path.register,
            element: <Register />
        },
        {
            path: path.flightBooking,
            element: <FlightBooking />,
            children: [
                {
                    path: '',
                    element: <Outlet />,
                    children: [
                        {
                            path: path.flightBookingDetail,
                            element: <FlightBookingDetail />
                        },
                        {
                            path: path.flightBookingPayment,
                            element: <FlightBookingPayment />
                        }
                    ]
                }
            ]
        }
    ])
    return routeElements
}
