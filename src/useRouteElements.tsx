import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { useContext } from 'react'

import { path } from './constants/path'
import { AppContext } from './contexts/app.context'

// Import Layouts
import MainLayout from './Layouts/MainLayout'
import Admin from './pages/Admin'

// Import Pages (Public)
import Home from './pages/Home'
import Reservation from './pages/Reservation'
import Lookup from './pages/Lookup'
import Promotion from './pages/Promotion'
import Login from './pages/Login'
import Register from './pages/Register'
import SearchFlight from './pages/SearchFlight'
import PaymentSuccess from './pages/PaymentSuccess'

// Import Pages (User Protected)
import FlightBookingDetail from './pages/FlightBooking/pages/FlightBookingDetail'
import FlightBookingPayment from './pages/FlightBooking/pages/FlightBookingPayment'
import Profile from './pages/Profile/Profile'
import ChangePassword from './pages/ChangePassword/ChangePassword'

// Import Pages (Admin Protected)
import Dashboard from './pages/Admin/pages/Dashboard'
import Airport from './pages/Admin/pages/Airport'
import AirPlane from './pages/Admin/pages/AirPlane'
import Passenger from './pages/Admin/pages/Passenger'
import Contact from './pages/Admin/pages/Contact'
import PromotionAdmin from './pages/Admin/pages/Promotion'
import Airline from './pages/Admin/pages/Airline'
import Flight from './pages/Admin/pages/Flight/Flight'
import FlightBooking from './pages/FlightBooking'
import GoogleAuthCallback from './components/GoogleAuthCallback/GoogleAuthCallback'
import AdminBookingPage from './pages/Admin/pages/Booking/Booking'

function ProtectedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

function AdminRoute() {
    const { profile } = useContext(AppContext)
    // Giả định rằng nếu đã qua ProtectedRoute, profile sẽ không null
    return (profile?.roles[0] as string) === 'admin' ? <Outlet /> : <Navigate to={path.home} />
}

function UserRoute() {
    const { profile } = useContext(AppContext)
    return (profile?.roles[0] as string) === 'user' ? <Outlet /> : <Navigate to={path.home} />
}

// --- 2. HÀM CHÍNH ĐỊNH NGHĨA ROUTE ---

export default function useRouteElements() {
    const routeElements = useRoutes([
        {
            path: path.login,
            element: <Login />
        },
        {
            path: path.register,
            element: <Register />
        },
        {
            path: path.paymentSuccess,
            element: <PaymentSuccess />
        },
        {
            path: 'auth/callback',
            element: <GoogleAuthCallback />
        },
        {
            path: path.home,
            element: '',
            children: [
                {
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
                }
            ]
        },
        {
            path: '',
            element: <ProtectedRoute />,
            children: [
                {
                    path: '',
                    element: <AdminRoute />,
                    children: [
                        {
                            path: path.admin,
                            element: <Admin />,
                            children: [
                                {
                                    element: <Dashboard />,
                                    index: true
                                },
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
                                },
                                {
                                    path: path.adminAirline,
                                    element: <Airline />
                                },
                                {
                                    path: path.adminFlight,
                                    element: <Flight />
                                },
                                {
                                    path: path.adminBooking,
                                    element: <AdminBookingPage />
                                }
                            ]
                        }
                    ]
                },

                {
                    path: '',
                    element: <UserRoute />,
                    children: [
                        // Các trang cá nhân của user
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
            ]
        }
    ])
    return routeElements
}
