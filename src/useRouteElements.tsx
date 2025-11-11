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
import Admin from './pages/Admin'
import Dashboard from './pages/Admin/pages/Dashboard'
import Airport from './pages/Admin/pages/Airport'
import AirPlane from './pages/Admin/pages/AirPlane'
import Passenger from './pages/Admin/pages/Passenger'
import Contact from './pages/Admin/pages/Contact'
import PromotionAdmin from './pages/Admin/pages/Promotion'
import PaymentSuccess from './pages/PaymentSuccess'
import Profile from './pages/Profile/Profile'
import ChangePassword from './pages/ChangePassword/ChangePassword'

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
            path: path.profile,
            element: (
                <MainLayout>
                    <Profile />
                </MainLayout>
            )
        },
        {
            path: path.changePassword,
            element: (
                <MainLayout>
                    <ChangePassword />
                </MainLayout>
            )
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
        },
        {
            path: path.admin,
            element: <Admin />,
            children: [
                {
                    path: '',
                    element: <Outlet />,
                    children: [
                        {
                            path: path.adminDashboard,
                            element: <Dashboard />
                        },
                        {
                            path: path.adminAirport,
                            element: <Airport />
                        },
                        {
                            path: path.adminAirplane,
                            element: <AirPlane />
                        },
                        {
                            path: path.adminPassenger,
                            element: <Passenger />
                        },
                        {
                            path: path.adminContact,
                            element: <Contact />
                        },
                        {
                            path: path.adminPromotion,
                            element: <PromotionAdmin />
                        }
                    ]
                }
            ]
        },
        {
            path: path.paymentSuccess,
            element: <PaymentSuccess />
        }
    ])
    return routeElements
}
