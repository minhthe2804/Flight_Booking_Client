import { faCaretDown, faUserCircle, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext, useState, useRef, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { navHeader } from '~/constants/navHeader'
import { path } from '~/constants/path'
import { AppContext } from '~/contexts/app.context'
import { clearLS } from '~/utils/auth'

export default function Navbar() {
    const { isAuthenticated, profile, reset } = useContext(AppContext)

    // State cho Dropdown Desktop
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const timerRef = useRef<number | null>(null)

    // State cho Mobile Menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        clearLS()
        reset()
        setIsDropdownOpen(false)
        setIsMobileMenuOpen(false) // Đóng mobile menu nếu đang mở
    }

    // --- Logic Dropdown Desktop (Giữ nguyên) ---
    const handleMouseEnter = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }
        setIsDropdownOpen(true)
    }

    const handleMouseLeave = () => {
        timerRef.current = window.setTimeout(() => {
            setIsDropdownOpen(false)
        }, 200)
    }

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [])

    return (
        // SỬA: Dùng max-w-[1278px] thay vì container
        <div className='max-w-[1278px] mx-auto px-4'>
            <div className='flex justify-between items-center h-16 md:h-auto'>
                {/* --- 1. LOGO --- */}
                <div className='flex-shrink-0'>
                    <NavLink
                        to={path.home}
                        className='text-white flex flex-col items-center'
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='w-6 h-6 md:w-8 md:h-8'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z'
                            />
                        </svg>
                        <p className='text-[18px] md:text-[22px] font-semibold'>Flight Booking</p>
                    </NavLink>
                </div>

                {/* --- 2. DESKTOP NAVIGATION (Ẩn trên Mobile) --- */}
                <nav className='hidden md:flex flex-1 justify-center'>
                    <ul className='flex items-center gap-8'>
                        {navHeader.map((nav, index) => (
                            <li className='text-white text-[14px] font-semibold relative group' key={index}>
                                <NavLink
                                    to={nav.path}
                                    end={nav.path === path.home}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'flex flex-col justify-center items-center gap-1 opacity-100'
                                            : 'flex flex-col justify-center items-center gap-1 opacity-70 hover:opacity-100 transition-opacity'
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <FontAwesomeIcon className='text-[17px]' icon={nav.icon} />
                                            <p>{nav.name}</p>
                                            <div
                                                className={`h-[1px] bg-white transition-all duration-300 ${
                                                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                                                }`}
                                            ></div>
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* --- 3. DESKTOP USER ACTIONS (Ẩn trên Mobile) --- */}
                <div className='hidden md:flex justify-end min-w-[200px]'>
                    {isAuthenticated ? (
                        <div className='relative' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                            <div className='flex items-center justify-end p-2 gap-2 cursor-pointer'>
                                <FontAwesomeIcon icon={faUserCircle} className='text-3xl text-white' />
                                <span className='text-base font-medium text-white max-w-[150px] truncate'>
                                    {profile?.email}
                                </span>
                                <FontAwesomeIcon
                                    icon={faCaretDown}
                                    className={`text-xs text-white mt-[3px] transition-transform duration-200 ${
                                        isDropdownOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </div>

                            {isDropdownOpen && (
                                <div className='absolute top-full right-0 w-60 bg-white rounded-md shadow-lg z-20 overflow-hidden border border-gray-200 mt-1'>
                                    <ul className='text-gray-700'>
                                        <li>
                                            <Link
                                                to={path.profile || '/profile'}
                                                className='block w-full px-4 py-3 text-sm font-medium hover:bg-gray-100'
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Thông tin tài khoản
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={path.changePassword || '/profile/change-password'}
                                                className='block w-full px-4 py-3 text-sm font-medium hover:bg-gray-100'
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Đổi mật khẩu
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className='block w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-gray-100'
                                            >
                                                Đăng xuất
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <NavLink
                            to={path.login}
                            className='w-[180px] h-[42px] bg-[#0194f3] flex items-center justify-center text-center text-white text-[15px] font-semibold rounded-md gap-2 hover:bg-[#0578c4] transition duration-300'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth='1.5'
                                stroke='currentColor'
                                className='w-5 h-5'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                                />
                            </svg>
                            Đăng nhập / Đăng ký
                        </NavLink>
                    )}
                </div>

                {/* --- 4. MOBILE MENU BUTTON --- */}
                <div className='md:hidden flex items-center'>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className='text-white p-2 focus:outline-none'
                    >
                        <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className='text-2xl' />
                    </button>
                </div>
            </div>

            {/* --- 5. MOBILE MENU CONTENT (Dropdown dọc) --- */}
            {isMobileMenuOpen && (
                <div className='md:hidden absolute top-[60px] left-0 w-full bg-white shadow-xl z-50 border-t border-gray-100 animate-fade-in'>
                    <ul className='flex flex-col py-2'>
                        {/* Danh sách menu chính */}
                        {navHeader.map((nav, index) => (
                            <li key={index}>
                                <NavLink
                                    to={nav.path}
                                    end={nav.path === path.home}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 ${
                                            isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'font-medium'
                                        }`
                                    }
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <FontAwesomeIcon icon={nav.icon} className='w-5 text-center' />
                                    <span>{nav.name}</span>
                                </NavLink>
                            </li>
                        ))}

                        <hr className='my-2 border-gray-100' />

                        {/* Phần User / Login trên Mobile */}
                        {isAuthenticated ? (
                            <>
                                <li className='px-6 py-2 text-xs font-bold text-gray-400 uppercase'>Tài khoản</li>
                                <li className='px-6 py-2 flex items-center gap-2 text-gray-800 font-semibold'>
                                    <FontAwesomeIcon icon={faUserCircle} className='text-xl text-blue-500' />
                                    <span className='truncate'>{profile?.email}</span>
                                </li>
                                <li>
                                    <Link
                                        to={path.profile || '/profile'}
                                        className='block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50'
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Thông tin tài khoản
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={path.changePassword || '/profile/change-password'}
                                        className='block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50'
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Đổi mật khẩu
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className='block w-full text-left px-6 py-3 text-sm text-red-600 font-medium hover:bg-red-50'
                                    >
                                        Đăng xuất
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className='p-4'>
                                <NavLink
                                    to={path.login}
                                    className='flex w-full items-center justify-center gap-2 bg-[#0194f3] text-white py-3 rounded-md font-semibold hover:bg-[#0578c4]'
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth='1.5'
                                        stroke='currentColor'
                                        className='w-5 h-5'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                                        />
                                    </svg>
                                    Đăng nhập / Đăng ký
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    )
}
