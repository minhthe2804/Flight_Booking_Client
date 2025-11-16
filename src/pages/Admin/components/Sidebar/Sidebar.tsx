import React, { useContext } from 'react'
import { MenuIcon } from '../../Admin'
import { path } from '~/constants/path'
import Button from '~/components/Button'
import { NavLink } from 'react-router-dom'
import { AppContext } from '~/contexts/app.context'
import { clearLS } from '~/utils/auth'

// Định nghĩa kiểu cho một link điều hướng
interface NavLink {
    id: string
    text: string
    icon: React.ReactNode
    path: string
}

// Định nghĩa kiểu cho props của component
interface SidebarProps {
    isOpen: boolean
}

const IconDashboard = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
    >
        <path strokeLinecap='round' strokeLinejoin='round' d='M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15z' />
        <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z' />
    </svg>
)
const IconPaperAirplane = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
    >
        <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5'
        />
    </svg>
)
const IconBuilding = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
    >
        <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21'
        />
    </svg>
)
const IconAirplane = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
    >
        <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M6 12 3.269 3.125A59.767 59.767 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
            transform='rotate(315 12 12)'
        />
    </svg>
)
const IconUsers = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
    >
        <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.023 1.53-1.85 2.7-2.336m-2.7 2.336a9.123 9.123 0 01-4.28 1.002 2.999 2.999 0 01-3.32-2.92c0-1.052.53-2.006 1.343-2.596M12 12.75c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z'
        />
    </svg>
)
const IconUserCircle = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
    >
        <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
        />
    </svg>
)
const IconTag = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
    >
        <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z'
        />
        <path strokeLinecap='round' strokeLinejoin='round' d='M6 6h.008v.008H6V6z' />
    </svg>
)
const IconGlobe = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
    >
        <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
        />
    </svg>
)
const IconTicket = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
    >
        <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h5.25m0 0h5.25m-10.5 0h5.25m-5.25 0h5.25m0 0h5.25m-10.5 0h5.25'
        />
    </svg>
)

const IconLogout = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
    >
        <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9'
        />
    </svg>
)

const navLinks: NavLink[] = [
    { id: 'dashboard', text: 'Dashboard', icon: <IconDashboard className='h-6 w-6' />, path: path.adminDashboard },
    { id: 'sanbay', text: 'Sân bay', icon: <IconPaperAirplane className='h-6 w-6' />, path: path.adminAirport },
    {
        id: 'hanghangkhong',
        text: 'Hãng hàng không',
        icon: <IconBuilding className='h-6 w-6' />,
        path: path.adminAirline
    },
    { id: 'maybay', text: 'Máy bay', icon: <IconAirplane className='h-6 w-6' />, path: path.adminAirplane },
    { id: 'hangkhach', text: 'Hành khách', icon: <IconUsers className='h-6 w-6' />, path: path.adminPassenger },
    { id: 'nguoilienhe', text: 'Người liên hệ', icon: <IconUserCircle className='h-6 w-6' />, path: path.adminContact },
    { id: 'khuyenmai', text: 'Khuyến mãi', icon: <IconTag className='h-6 w-6' />, path: path.adminPromotion },
    { id: 'chuyenbay', text: 'Chuyến bay', icon: <IconGlobe className='h-6 w-6' />, path: path.adminFlight },
    { id: 'datcho', text: 'Đặt chỗ', icon: <IconTicket className='h-6 w-6' />, path: path.adminBooking }
]

export default function Sidebar({ isOpen }: SidebarProps) {
    const { reset } = useContext(AppContext)

    const handleLogout = () => {
        reset()
        clearLS()
    }

    return (
        <aside
            className={`
      bg-slate-900 text-white w-64 fixed inset-y-0 left-0
      transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:relative md:translate-x-0
      transition-transform duration-300 ease-in-out
      z-30 flex flex-col
    `}
        >
            <div className='flex items-center justify-evenly h-20 border-b border-slate-800'>
                <MenuIcon className='h-7 w-7 text-white' />
                <h1 className='text-xl font-bold text-white'>Đặt vé máy bay</h1>
            </div>
            <nav className='flex-1 px-4 py-4'>
                <ul className='space-y-2'>
                    {navLinks.map((link) => (
                        <li key={link.id}>
                            <NavLink
                                to={link.path}
                                end={link.path === path.adminDashboard}
                                className={({ isActive }) =>
                                    `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                                        isActive // Dùng 'isActive' thay cho state 'activeLink'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                                    }`
                                }
                            >
                                {link.icon}
                                <span className='ml-4 font-medium'>{link.text}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div
                className='flex justify-center px-4 py-4 mt-auto  border-t border-slate-800'
                onClick={() => handleLogout()}
            >
                <Button className='flex items-center p-3 rounded-lg transition-colors duration-200 text-gray-400 hover:bg-red-800 hover:text-white'>
                    <IconLogout className='h-6 w-6' />
                    <span className='ml-4 font-medium'>Đăng xuất</span>
                </Button>
            </div>
        </aside>
    )
}
