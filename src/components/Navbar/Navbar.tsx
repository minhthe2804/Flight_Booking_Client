import { faCaretDown, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// SỬA: Thêm useRef và useEffect
import { useContext, useState, useRef, useEffect } from 'react'

import { NavLink, Link } from 'react-router-dom'
import { navHeader } from '~/constants/navHeader'
import { path } from '~/constants/path'
import { AppContext } from '~/contexts/app.context'
import { clearLS } from '~/utils/auth'

export default function Navbar() {
    const { isAuthenticated, profile, reset } = useContext(AppContext)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    // SỬA: Thêm ref để lưu ID của timer
    const timerRef = useRef<number | null>(null)

    const handleLogout = () => {
        clearLS()
        reset()
        setIsDropdownOpen(false)
    }

    // SỬA: Hàm xử lý khi hover vào
    const handleMouseEnter = () => {
        // Nếu có timer đang chạy (định đóng), thì hủy nó
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }
        // Mở dropdown
        setIsDropdownOpen(true)
    }

    // SỬA: Hàm xử lý khi chuột rời đi
    const handleMouseLeave = () => {
        // Đặt một timer để đóng dropdown sau 200ms
        timerRef.current = window.setTimeout(() => {
            setIsDropdownOpen(false)
        }, 200) // 200ms delay
    }

    // SỬA: Thêm useEffect để dọn dẹp timer khi component unmount
    useEffect(() => {
        return () => {
            // Đảm bảo clear timer nếu component bị hủy
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [])

    return (
        <div className='max-w-[1278px] mx-auto'>
            <div className='grid grid-cols-12'>
                {/* Logo (Giữ nguyên) */}
                <div className='col-span-2 mr-auto'>
                    <NavLink to={path.home} className='text-white flex flex-col'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke-width='1.5'
                            stroke='currentColor'
                            className='w-8 mx-auto'
                        >
                            <path
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z'
                            />
                        </svg>
                        <p className='text-[22px] font-semibold text-center'>Flight Booking</p>
                    </NavLink>
                </div>

                {/* Navbar (Giữ nguyên) */}
                <nav className='col-span-7'>
                    <ul className='flex items-center py-2 gap-8'>
                        {navHeader.map((nav, index) => (
                            <li className='py-2 text-white text-[14px] font-semibold' key={index}>
                                <NavLink
                                    to={nav.path}
                                    end={nav.path === path.home}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'flex flex-col justify-center items-center gap-1 opacity-100'
                                            : 'flex flex-col justify-center items-center gap-1 opacity-70 '
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <FontAwesomeIcon className='text-[17px]' icon={nav.icon} />
                                            <p>{nav.name}</p>
                                            <div
                                                className={
                                                    isActive ? 'border-[1px] border-white border-solid w-full' : ''
                                                }
                                            ></div>
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Register/login */}
                {isAuthenticated ? (
                    <div className='col-span-3 pt-5 flex justify-end'>
                        {/* SỬA: Gắn các hàm xử lý mouse enter/leave */}
                        <div className='relative' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                            {/* Trigger (Icon User, Email) */}
                            <div className='flex items-center justify-end p-2 gap-2 cursor-pointer'>
                                <FontAwesomeIcon icon={faUserCircle} className='text-3xl text-white' />
                                <span className='text-base font-medium text-white hidden md:inline'>
                                    {profile?.email}
                                </span>
                                <FontAwesomeIcon
                                    icon={faCaretDown}
                                    className={`text-xs text-white mt-[3px] transition-transform duration-200 ${
                                        isDropdownOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </div>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div
                                    className='absolute top-full right-0 w-60 bg-white rounded-md shadow-lg z-20
                             overflow-hidden border border-gray-200 mt-2'
                                >
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
                    </div>
                ) : (
                    // Phần chưa đăng nhập (Giữ nguyên)
                    <div className='col-span-3 pt-5'>
                        <NavLink
                            to={path.login}
                            className='w-[200px] h-[42px] bg-[#0194f3] ml-auto flex items-center justify-center text-center text-white text-[16px] font-semibold rounded-md gap-1 hover:bg-[#0578c4] transition duration-300 ease-in-out'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke-width='1.5'
                                stroke='currentColor'
                                className='size-4 mt-[1px]'
                            >
                                <path
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                    d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                                />
                            </svg>
                            Đăng nhập / Đăng ký
                        </NavLink>
                    </div>
                )}
            </div>
        </div>
    )
}
