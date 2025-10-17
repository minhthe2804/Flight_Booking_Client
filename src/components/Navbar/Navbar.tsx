import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UserCircleIcon } from 'lucide-react'
import { useContext, useState } from 'react'
import { Link, useMatch } from 'react-router-dom'
import { navHeader } from '~/constants/navHeader'
import { path } from '~/constants/path'
import { AppContext } from '~/contexts/app.context'

export default function Navbar() {
    const { isAuthenticated, profile } = useContext(AppContext)
    const [isActive, setIsActive] = useState<number>(0)
    const pageSearchFlight = useMatch(path.searchFlight)
    const isPageSearchFlight = Boolean(pageSearchFlight)

    const handleActiveNavbar = (index: Number) => {
        setIsActive(Number(index))
    }

    return (
        <div className='max-w-[1278px] mx-auto'>
            <div className='grid grid-cols-12'>
                {/* Logo */}
                <div className='col-span-2 mr-auto'>
                    <Link to={path.home} className='text-white flex flex-col'>
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
                    </Link>
                </div>

                {/* Navbar */}
                <nav className='col-span-7'>
                    <ul className='flex items-center py-2 gap-8'>
                        {navHeader.map((nav, index) => (
                            <li className='py-2 text-white text-[14px] font-semibold' key={index}>
                                <Link
                                    to={nav.path}
                                    className={
                                        isActive === index && !isPageSearchFlight
                                            ? 'flex flex-col justify-center items-center gap-1 opacity-100'
                                            : 'flex flex-col justify-center items-center gap-1 opacity-70 '
                                    }
                                    onClick={() => handleActiveNavbar(Number(index))}
                                >
                                    <FontAwesomeIcon className='text-[17px]' icon={nav.icon} />
                                    <p>{nav.name}</p>
                                    <div
                                        className={
                                            isActive === index && !isPageSearchFlight
                                                ? 'border-[1px] border-white border-solid w-full'
                                                : ''
                                        }
                                    ></div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Register/login */}
                {isAuthenticated ? (
                    <div className='col-span-3 pt-5'>
                        <div className='flex items-center justify-end p-2 gap-2 cursor-pointer'>
                            {/* Avatar */}

                            <img
                                src='data:image/jpeg;base64,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'
                                alt=''
                                className='w-[32px] h-[32px] rounded-full'
                            />

                            {/* Email */}
                            <span className='text-base font-medium text-white hidden md:inline'>{profile?.email}</span>

                            <FontAwesomeIcon icon={faCaretDown} className='text-xs text-white mt-[3px]' />
                        </div>
                    </div>
                ) : (
                    <div className='col-span-3 pt-5'>
                        <Link
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
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
