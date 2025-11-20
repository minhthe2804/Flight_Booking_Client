import { useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames/bind'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { addDays } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Controller } from 'react-hook-form'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { classOptions } from '~/constants/ticket'
import { Option } from '~/types/option'
import { faBaby, faChild, faPlaneArrival, faPlaneDeparture, faUser } from '@fortawesome/free-solid-svg-icons'
import styles from './Header.module.css'
import Navbar from '../Navbar'
import { useMatch } from 'react-router-dom'
import { path } from '~/constants/path'
import useSearchFlights from '~/hooks/useSearchFlight'
import { useQuery } from '@tanstack/react-query'
import { airportApi } from '~/apis/airport.api'
import TrustedBy from '../TrustedBy/TrustedBy'

const cx = classNames.bind(styles)
// Danh sách mã sân bay phổ biến để hiển thị mặc định
const POPULAR_AIRPORT_CODES = ['SGN', 'HAN', 'DAD', 'CXR', 'PQC', 'KUL', 'VCA', 'VDO']

export default function Header() {
    const [showDepartureOptions, setShowDepartureOptions] = useState(false)
    const [showDestinationOptions, setShowDestinationOptions] = useState(false)
    const [isClassOpen, setIsClassOpen] = useState<boolean>(false)
    const [isPassengerOpen, setIsPassengerOpen] = useState<boolean>(false)

    const classDropdownRef = useRef<HTMLDivElement>(null)
    const passengerDropdownRef = useRef<HTMLDivElement>(null)

    const pageHome = useMatch(path.home)
    const isPageHome = Boolean(pageHome)

    const { control, watch, setValue, onSubmitSearch, today, maxDate, handleQuantityChange } = useSearchFlights()

    const isRoundTrip = watch('isRoundTrip')
    const departureValue = watch('departure')
    const destinationValue = watch('destination')
    const selectedClass = watch('class')
    const selectedOption = watch('passengers')
    const startDate = watch('startDate')

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (classDropdownRef.current && !classDropdownRef.current.contains(event.target as Node)) {
                setIsClassOpen(false)
            }
            if (passengerDropdownRef.current && !passengerDropdownRef.current.contains(event.target as Node)) {
                setIsPassengerOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (isRoundTrip && startDate) {
            const newEndDate = addDays(startDate, 2)
            // Dùng setValue để cập nhật form
            setValue('endDate', newEndDate <= maxDate ? newEndDate : maxDate)
        } else {
            setValue('endDate', null)
        }
    }, [isRoundTrip, startDate, maxDate, setValue])

    const { data: airportsData } = useQuery({
        queryKey: ['airports'],
        queryFn: () => airportApi.getAirport(),
        staleTime: Infinity
    })

    const airports = airportsData?.data.data || []

    // --- LOGIC LỌC SÂN BAY ---
    // 1. Lọc sân bay ĐI
    const filteredDepartureAirports = useMemo(() => {
        // Nếu input trống -> Hiển thị danh sách Phổ biến
        if (!departureValue || departureValue.trim() === '') {
            return airports.filter((a) => POPULAR_AIRPORT_CODES.includes(a.airport_code))
        }
        // Nếu có input -> Tìm kiếm chính xác (theo code, tên, thành phố)
        const searchTerm = departureValue.toLowerCase()
        return airports.filter(
            (a) =>
                a.airport_code.toLowerCase().includes(searchTerm) ||
                a.airport_name.toLowerCase().includes(searchTerm) ||
                a.city.toLowerCase().includes(searchTerm)
        )
    }, [departureValue, airports])

    // 2. Lọc sân bay ĐẾN
    const filteredDestinationAirports = useMemo(() => {
        // Nếu input trống -> Hiển thị danh sách Phổ biến
        if (!destinationValue || destinationValue.trim() === '') {
            return airports.filter((a) => POPULAR_AIRPORT_CODES.includes(a.airport_code))
        }
        // Nếu có input -> Tìm kiếm chính xác
        const searchTerm = destinationValue.toLowerCase()
        return airports.filter(
            (a) =>
                a.airport_code.toLowerCase().includes(searchTerm) ||
                a.airport_name.toLowerCase().includes(searchTerm) ||
                a.city.toLowerCase().includes(searchTerm)
        )
    }, [destinationValue, airports])

    // Xử lý chọn lớp vé
    const handleClassSelect = (option: Option) => {
        setValue('class', option)
        setIsClassOpen(false)
    }

    // Tạo chuỗi hiển thị cho số lượng hành khách
    const getDisplayLabel = (): string => {
        return `${selectedOption.adult} Người lớn, ${selectedOption.child} Trẻ em, ${selectedOption.infant} Em bé`
    }

    // Nút hoán đổi
    const swapLocations = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        setValue('departure', destinationValue)
        setValue('destination', departureValue)
    }

    return (
        <header
            className={
                isPageHome ? 'bg-cover bg-no-repeat pt-[10px] pb-2 h-[550px]' : 'bg-cover bg-no-repeat pt-[10px] pb-2'
            }
            style={{
                backgroundImage:
                    "url('https://ik.imagekit.io/tvlk/image/imageResource/2025/01/05/1736039153373-64c979a852c7ec9063c6f2104bcf58dd.png?tr=q-100,w-1920')"
            }}
        >
            <Navbar />
            {isPageHome && (
                <>
                    <div className='w-full h-[0.5px] bg-slate-200 opacity-10'></div>
                    <h1 className='mt-[60px] text-[32px] text-white font-semibold text-center uppercase'>
                        App du lịch hàng đầu, một chạm đi bất cứ đâu
                    </h1>

                    {/* Form Search */}
                    <div className='max-w-[1278px] mx-auto'>
                        <div className='mt-5 w-full h-[1px] bg-white'></div>

                        {/* QUAN TRỌNG: Thêm onSubmit tại đây */}
                        <form className='relative mt-4' onSubmit={onSubmitSearch}>
                            {/* group 1 */}
                            <div className='flex items-center justify-end gap-2'>
                                <div className=''></div>
                                {/* Dropdown số lượng hành khách */}
                                <div className='relative w-[310px]' ref={passengerDropdownRef}>
                                    <div
                                        className='w-full h-[34px] px-2 py-1 rounded-md border-[1px] border-gray-200 bg-[#ffffff40] text-white text-[14px] font-semibold flex items-center justify-between cursor-pointer'
                                        onClick={() => setIsPassengerOpen(!isPassengerOpen)}
                                    >
                                        <div className='flex items-center'>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                strokeWidth='1.5'
                                                stroke='currentColor'
                                                className='size-4 text-white mr-2'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    d='M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z'
                                                />
                                            </svg>
                                            {/* Hiển thị giá trị từ 'watch' */}
                                            <span className='text-[15px] font-semibold'>{getDisplayLabel()}</span>
                                        </div>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth='1.5'
                                            stroke='currentColor'
                                            className='size-4 text-white'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M19.5 8.25l-7.5 7.5-7.5-7.5'
                                            />
                                        </svg>
                                    </div>

                                    {isPassengerOpen && (
                                        <ul className='absolute w-full h-[120px] mt-[1px] bg-white border-[1px] border-gray-200 rounded-md text-black text-[16px] font-semibold z-[999]'>
                                            <li className='px-2 py-2 flex items-center justify-between'>
                                                <div className='flex items-center gap-2'>
                                                    <FontAwesomeIcon
                                                        icon={faUser}
                                                        className='text-[16px] text-[#097de9]'
                                                    />
                                                    <span>Người lớn</span>
                                                </div>
                                                <div className='flex items-center'>
                                                    <button
                                                        className='w-6 h-6 bg-gray-300 text-[#097de9] rounded-full flex items-center justify-center hover:bg-gray-400 transition duration-200 ease-in-out'
                                                        onClick={(event) => handleQuantityChange(event, 'adult', -1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className='mx-2'>{selectedOption.adult}</span>
                                                    <button
                                                        className='w-6 h-6 bg-gray-300 text-[#097de9] rounded-full flex items-center justify-center hover:bg-gray-400 transition duration-200 ease-in-out'
                                                        onClick={(event) => handleQuantityChange(event, 'adult', 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </li>
                                            <li className='px-2 py-2 flex items-center justify-between'>
                                                <div className='flex items-center gap-2'>
                                                    <FontAwesomeIcon
                                                        icon={faChild}
                                                        className='text-[18px] text-[#097de9]'
                                                    />
                                                    <span>Trẻ em</span>
                                                </div>
                                                <div className='flex items-center'>
                                                    <button
                                                        className='w-6 h-6 bg-gray-300 text-[#097de9] rounded-full flex items-center justify-center hover:bg-gray-400 transition duration-200 ease-in-out'
                                                        onClick={(event) => handleQuantityChange(event, 'child', -1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className='mx-2'>{selectedOption.child}</span>
                                                    <button
                                                        className='w-6 h-6 bg-gray-300 text-[#097de9] rounded-full flex items-center justify-center hover:bg-gray-400 transition duration-200 ease-in-out'
                                                        onClick={(event) => handleQuantityChange(event, 'child', 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </li>
                                            <li className='px-2 py-2 flex items-center justify-between'>
                                                <div className='flex items-center gap-2'>
                                                    <FontAwesomeIcon
                                                        icon={faBaby}
                                                        className='text-[18px] text-[#097de9]'
                                                    />
                                                    <span>Em bé</span>
                                                </div>
                                                <div className='flex items-center'>
                                                    <button
                                                        className='w-6 h-6 bg-gray-300 text-[#097de9] rounded-full flex items-center justify-center hover:bg-gray-400 transition duration-200 ease-in-out'
                                                        onClick={(event) => handleQuantityChange(event, 'infant', -1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className='mx-2'>{selectedOption.infant}</span>
                                                    <button
                                                        className='w-6 h-6 bg-gray-300 text-[#097de9] rounded-full flex items-center justify-center hover:bg-gray-400 transition duration-200 ease-in-out'
                                                        onClick={(event) => handleQuantityChange(event, 'infant', 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </li>
                                        </ul>
                                    )}
                                </div>

                                {/* Dropdown hạng vé */}
                                <div className='relative w-[310px]' ref={classDropdownRef}>
                                    <div
                                        className='w-full h-[34px] px-2 py-1 rounded-md border-[1px] border-gray-200 bg-[#ffffff40] text-white text-[14px] font-semibold flex items-center justify-between cursor-pointer'
                                        onClick={() => setIsClassOpen(!isClassOpen)}
                                    >
                                        <span className='text-[15px] font-semibold'>
                                            {/* Hiển thị giá trị từ 'watch' */}
                                            {selectedClass?.label || 'Chọn lớp vé'}
                                        </span>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth='1.5'
                                            stroke='currentColor'
                                            className='size-4 text-white'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M19.5 8.25l-7.5 7.5-7.5-7.5'
                                            />
                                        </svg>
                                    </div>

                                    {isClassOpen && (
                                        <ul className='absolute w-full mt-[1px] bg-white border-[1px] border-gray-200 rounded-md text-black text-[16px] font-semibold z-10'>
                                            {classOptions.map((option) => (
                                                <li
                                                    key={option.value}
                                                    className='px-2 py-1 flex items-center hover:bg-[#e1e2e2] cursor-pointer gap-2 group'
                                                    onClick={() => handleClassSelect(option)} // Gọi hàm helper
                                                >
                                                    <div
                                                        className={
                                                            selectedClass?.label === option.label
                                                                ? 'w-[10px] h-[10px] rounded-full bg-[#0692e9] mt-[-2px]'
                                                                : 'w-[10px] h-[10px] rounded-full group-hover:bg-[#b8b6b6] mt-[-2px]'
                                                        }
                                                    ></div>
                                                    <span
                                                        className={
                                                            selectedClass?.label === option.label
                                                                ? 'text-[16px] text-[#0692e9]'
                                                                : ''
                                                        }
                                                    >
                                                        {option.label}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* group 2 */}
                            <div className='flex items-center gap-3'>
                                {/* Input Sân bay */}
                                <div className='flex justify-start mt-6'>
                                    <div className='w-[580px] p-4'>
                                        <div className='w-full flex items-center'>
                                            <div className='w-1/2'>
                                                <p className='text-[16px] font-semibold text-white text-left'>Từ</p>
                                            </div>
                                            <div className='w-1/2'>
                                                <p className='text-[16px] font-semibold text-white text-left'>Đến</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center space-x-2 outline outline-[#cdd0d180] rounded-[20px] p-2 mt-3 bg-white'>
                                            {/* Input Điểm đi (Departure) */}
                                            <Controller
                                                name='departure'
                                                control={control}
                                                render={({ field }) => (
                                                    <div className='relative w-1/2 flex items-center'>
                                                        <svg
                                                            width='24'
                                                            height='24'
                                                            viewBox='0 0 24 24'
                                                            fill='none'
                                                            xmlns='http://www.w3.org/2000/svg'
                                                            data-id='IcFlightTakeOff'
                                                        >
                                                            <path
                                                                d='M3 21H21'
                                                                stroke='#0194f3'
                                                                stroke-width='1.5'
                                                                stroke-linecap='round'
                                                                stroke-linejoin='round'
                                                            ></path>
                                                            <path
                                                                fill-rule='evenodd'
                                                                clip-rule='evenodd'
                                                                d='M12 9L15.1924 7.93585C17.317 7.22767 19.6563 7.95843 21 9.75L7.44513 14.0629C5.86627 14.5653 4.1791 13.6926 3.67674 12.1137C3.66772 12.0854 3.65912 12.0569 3.65094 12.0283L3 9.75L5.25 10.875L9 9.75L4.5 3H5.25L12 9Z'
                                                                stroke='#0194f3'
                                                                stroke-width='1.5'
                                                                stroke-linecap='round'
                                                                stroke-linejoin='round'
                                                            ></path>
                                                        </svg>
                                                        <input
                                                            {...field}
                                                            type='text'
                                                            onFocus={() => setShowDepartureOptions(true)}
                                                            // Delay blur để click sự kiện hoạt động
                                                            onBlur={() =>
                                                                setTimeout(() => setShowDepartureOptions(false), 200)
                                                            }
                                                            placeholder='TP HCM (SGN)'
                                                            className='w-full p-2 border-none outline-none text-black font-semibold placeholder:text-black'
                                                            autoComplete='off'
                                                        />
                                                        {/* DROPDOWN GỢI Ý ĐIỂM ĐI */}
                                                        {showDepartureOptions && (
                                                            <div className='absolute z-20 w-full bg-white border rounded-md top-[100%] shadow-xl max-h-60 overflow-y-auto mt-2'>
                                                                <p className='text-xs text-gray-500 font-semibold px-3 py-2 bg-gray-50 sticky top-0 border-b'>
                                                                    {!departureValue || departureValue.trim() === ''
                                                                        ? 'SÂN BAY PHỔ BIẾN'
                                                                        : 'KẾT QUẢ TÌM KIẾM'}
                                                                </p>
                                                                {filteredDepartureAirports.length > 0 ? (
                                                                    filteredDepartureAirports.map((airport) => (
                                                                        <div
                                                                            key={airport.airport_id}
                                                                            className='p-3 hover:bg-blue-50 cursor-pointer text-black font-medium flex items-center gap-2 transition-colors border-b border-gray-50 last:border-none'
                                                                            onMouseDown={() => {
                                                                                setValue(
                                                                                    'departure',
                                                                                    `${airport.airport_code} - ${airport.airport_name}`
                                                                                )
                                                                                setShowDepartureOptions(false)
                                                                            }}
                                                                        >
                                                                            <FontAwesomeIcon
                                                                                icon={faPlaneDeparture}
                                                                                className='text-gray-400 text-sm'
                                                                            />
                                                                            <div>
                                                                                <span className='font-bold mr-1'>
                                                                                    {airport.city} (
                                                                                    {airport.airport_code})
                                                                                </span>
                                                                                <span className='text-xs text-gray-500 block'>
                                                                                    {airport.airport_name}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className='p-3 text-sm text-gray-500 text-center'>
                                                                        Không tìm thấy sân bay
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            />

                                            <div className='w-[65px] h-[2px] bg-[#cdd0d1] rotate-90'></div>
                                            {/* Nút Swap */}
                                            <button
                                                onClick={swapLocations} // Gọi hàm helper
                                                className='text-gray-500 hover:text-gray-700 outline-none rounded-[50%] border border-[#cdd0d1] w-[40px] h-[40px] flex justify-center items-center absolute left-[20.5%] z-10 bg-white'
                                            >
                                                <img
                                                    src='https://d1785e74lyxkqq.cloudfront.net/_next/static/v4.6.0/e/e80dbd4faf646eb55cace85548781da8.svg'
                                                    alt=''
                                                    className='w-6 h-6'
                                                />
                                            </button>

                                            {/* Input Điểm đến (Destination) */}
                                            <Controller
                                                name='destination'
                                                control={control}
                                                render={({ field }) => (
                                                    <div className='relative w-1/2 flex items-center'>
                                                        <svg
                                                            width='24'
                                                            height='24'
                                                            viewBox='0 0 24 24'
                                                            fill='none'
                                                            xmlns='http://www.w3.org/2000/svg'
                                                            data-id='IcFlightLanding'
                                                        >
                                                            <path
                                                                d='M21 20.25C21.4142 20.25 21.75 20.5858 21.75 21C21.75 21.4142 21.4142 21.75 21 21.75H3C2.58579 21.75 2.25 21.4142 2.25 21C2.25 20.5858 2.58579 20.25 3 20.25H21ZM16.4014 16.668C16.6959 16.4277 17.1307 16.4451 17.4053 16.7197L17.7803 17.0947C18.0732 17.3876 18.0732 17.8624 17.7803 18.1553L17.4053 18.5303C17.1124 18.8232 16.6376 18.8232 16.3447 18.5303L15.9697 18.1553C15.6768 17.8624 15.6768 17.3876 15.9697 17.0947L16.3447 16.7197L16.4014 16.668ZM8.2041 2.25684C8.44224 2.29015 8.65274 2.43721 8.76562 2.6543L12.498 9.83398L17.4893 10.833L17.7842 10.9004C19.2444 11.281 20.476 12.2744 21.1553 13.6328L21.6709 14.665C21.7919 14.9074 21.773 15.1966 21.6211 15.4209C21.4691 15.6452 21.2075 15.7696 20.9375 15.7471L7.06445 14.5908C4.34342 14.3641 2.25 12.0898 2.25 9.35938V7.5L2.26074 7.37207C2.31113 7.08009 2.53189 6.84044 2.82812 6.77051C3.16655 6.69077 3.51539 6.85402 3.6709 7.16504L4.96387 9.75H8.08496L6.76465 3.14746C6.72058 2.92713 6.77747 2.69818 6.91992 2.52441C7.06238 2.35066 7.27531 2.25 7.5 2.25H8.09961L8.2041 2.25684ZM9.73535 10.3525C9.77942 10.5729 9.72253 10.8018 9.58008 10.9756C9.43762 11.1493 9.22469 11.25 9 11.25H4.5C4.40631 11.25 4.31595 11.2308 4.23145 11.1982C4.82345 12.2488 5.90865 12.99 7.18848 13.0967L19.7256 14.1406C19.2263 13.2544 18.3888 12.6089 17.4053 12.3525L17.1943 12.3037L11.8525 11.2354C11.6298 11.1907 11.4398 11.0472 11.335 10.8457L8.89551 6.15527L9.73535 10.3525Z'
                                                                fill='#0194f3'
                                                            ></path>
                                                        </svg>
                                                        <input
                                                            {...field}
                                                            type='text'
                                                            onFocus={() => setShowDestinationOptions(true)}
                                                            onBlur={() =>
                                                                setTimeout(() => setShowDestinationOptions(false), 200)
                                                            }
                                                            placeholder='Hà Nội (HAN)'
                                                            className='w-full p-2 border-none outline-none text-black font-semibold placeholder:text-black'
                                                            autoComplete='off'
                                                        />
                                                        {/* DROPDOWN GỢI Ý ĐIỂM ĐẾN */}
                                                        {showDestinationOptions && (
                                                            <div className='absolute z-20 w-full bg-white border rounded-md mt-1 top-[100%] shadow-xl max-h-60 overflow-y-auto'>
                                                                <p className='text-xs text-gray-500 font-semibold px-3 py-2 bg-gray-50 sticky top-0 border-b'>
                                                                    {!destinationValue || destinationValue.trim() === ''
                                                                        ? 'SÂN BAY PHỔ BIẾN'
                                                                        : 'KẾT QUẢ TÌM KIẾM'}
                                                                </p>
                                                                {filteredDestinationAirports.length > 0 ? (
                                                                    filteredDestinationAirports.map((airport) => (
                                                                        <div
                                                                            key={airport.airport_id}
                                                                            className='p-3 hover:bg-blue-50 cursor-pointer text-black font-medium flex items-center gap-2 transition-colors border-b border-gray-50 last:border-none'
                                                                            onMouseDown={() => {
                                                                                setValue(
                                                                                    'destination',
                                                                                    `${airport.airport_code} - ${airport.airport_name}`
                                                                                )
                                                                                setShowDestinationOptions(false)
                                                                            }}
                                                                        >
                                                                            <FontAwesomeIcon
                                                                                icon={faPlaneArrival}
                                                                                className='text-gray-400 text-sm'
                                                                            />
                                                                            <div>
                                                                                <span className='font-bold mr-1'>
                                                                                    {airport.city} (
                                                                                    {airport.airport_code})
                                                                                </span>
                                                                                <span className='text-xs text-gray-500 block'>
                                                                                    {airport.airport_name}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className='p-3 text-sm text-gray-500 text-center'>
                                                                        Không tìm thấy sân bay
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Input Ngày
                                 */}
                                <div className='flex mt-[22px]'>
                                    <div className='w-[580px]'>
                                        <div className='flex items-center'>
                                            <div className='w-1/2'>
                                                <p className='text-[16px] font-semibold text-white'>Ngày khởi hành</p>
                                            </div>
                                            <div className='flex items-center gap-2 w-1/2 pl-1'>
                                                {/* Checkbox Khứ hồi */}
                                                <Controller
                                                    name='isRoundTrip'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <label className='flex items-center cursor-pointer relative'>
                                                            <input
                                                                type='checkbox'
                                                                checked={field.value}
                                                                onChange={field.onChange}
                                                                className='absolute opacity-0 w-0 h-0'
                                                            />
                                                            <div
                                                                className={
                                                                    field.value
                                                                        ? 'w-5 h-5 bg-[#0194f3] border-2 border-gray-300 rounded-md flex items-center justify-center mr-2 transition-all duration-200'
                                                                        : 'w-5 h-5 bg-white border-2 border-gray-300 rounded-md flex items-center justify-center mr-2 transition-all duration-200'
                                                                }
                                                            >
                                                                {isRoundTrip ? (
                                                                    <svg
                                                                        className='w-4 h-4 text-white ml-[2px]'
                                                                        fill='none'
                                                                        stroke='currentColor'
                                                                        viewBox='0 0 24 24'
                                                                    >
                                                                        <path
                                                                            strokeLinecap='round'
                                                                            strokeLinejoin='round'
                                                                            strokeWidth={2}
                                                                            d='M5 13l4 4L19 7'
                                                                        />
                                                                    </svg>
                                                                ) : (
                                                                    <svg
                                                                        className='w-4 h-4 text-[#918f8f] ml-[2px]'
                                                                        fill='none'
                                                                        stroke='currentColor'
                                                                        viewBox='0 0 24 24'
                                                                    >
                                                                        <path
                                                                            strokeLinecap='round'
                                                                            strokeLinejoin='round'
                                                                            strokeWidth={2}
                                                                            d='M5 13l4 4L19 7'
                                                                        />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <span className='text-[16px] font-semibold text-white'>
                                                                Khứ hồi
                                                            </span>
                                                        </label>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className='flex items-center space-x-2 outline outline-[#cdd0d180] rounded-[20px] h-[55px] mt-3 relative bg-white'>
                                            {/* DatePicker Ngày đi */}
                                            <div className='text-gray-900 rounded-[20px] flex items-center gap-2 w-1/2 p-2'>
                                                <svg
                                                    width='24'
                                                    height='24'
                                                    viewBox='0 0 24 24'
                                                    fill='none'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    data-id='IcSystemCalendar'
                                                >
                                                    <path
                                                        d='M15.9999 1.25C17.2425 1.25014 18.2499 2.25745 18.2499 3.5C18.2499 3.91413 17.914 4.24986 17.4999 4.25C17.1118 4.25 16.7925 3.95511 16.7538 3.57715L16.746 3.42285C16.7074 3.04497 16.388 2.75013 15.9999 2.75C15.5857 2.75 15.2499 3.08579 15.2499 3.5V4.75H17.8671C17.889 4.75001 17.9108 4.75242 17.9326 4.75293C17.9547 4.75097 17.9773 4.75 17.9999 4.75H19.4999C21.2947 4.75014 22.7499 6.20516 22.7499 8V19C22.7499 19.9664 21.9663 20.7499 20.9999 20.75H19.2421C18.7363 21.3613 17.9745 21.7499 17.1249 21.75H4.13275C2.54459 21.7498 1.28654 20.4081 1.38861 18.8232L2.1308 7.32324L2.16107 7.05566C2.37522 5.73967 3.51557 4.75006 4.87494 4.75H6.24994V3.5C6.24994 2.25736 7.2573 1.25 8.49994 1.25C9.74246 1.25014 10.7499 2.25745 10.7499 3.5C10.7499 3.91413 10.414 4.24986 9.99994 4.25C9.61178 4.25 9.29248 3.95511 9.25385 3.57715L9.24604 3.42285C9.20742 3.04497 8.88799 2.75013 8.49994 2.75C8.08573 2.75 7.74994 3.08579 7.74994 3.5V4.75H13.7499V3.5C13.7499 2.25736 14.7573 1.25 15.9999 1.25ZM4.87494 6.25C4.21589 6.25007 3.67031 6.76223 3.62787 7.41992L2.88568 18.9199C2.83944 19.6401 3.41105 20.2498 4.13275 20.25H17.1249C17.7839 20.2498 18.3296 19.7377 18.372 19.0801L19.1142 7.58008L19.1162 7.44727C19.0892 6.78655 18.5439 6.25034 17.8671 6.25H15.2031C15.0998 6.54057 14.8259 6.74989 14.4999 6.75C14.1738 6.75 13.8991 6.54072 13.7958 6.25H7.70307C7.59979 6.54057 7.32592 6.74989 6.99994 6.75C6.6738 6.75 6.39911 6.54072 6.29584 6.25H4.87494ZM20.4355 6.52246C20.555 6.83579 20.6213 7.17501 20.6171 7.5293L20.6113 7.67676L19.8691 19.1768C19.8675 19.2013 19.8635 19.2256 19.8613 19.25H20.9999C21.1379 19.2499 21.2499 19.138 21.2499 19V8C21.2499 7.37797 20.9245 6.83281 20.4355 6.52246ZM15.5927 8.75586C15.8834 8.7923 16.1121 8.99157 16.204 9.25H16.9999C17.414 9.25014 17.7499 9.58587 17.7499 10C17.7499 10.4141 17.414 10.7499 16.9999 10.75H16.0996L15.8496 12.75H16.7499C17.164 12.7501 17.4999 13.0859 17.4999 13.5C17.4999 13.9141 17.164 14.2499 16.7499 14.25H15.6621L15.4121 16.25H16.2499C16.664 16.2501 16.9999 16.5859 16.9999 17C16.9999 17.4141 16.664 17.7499 16.2499 17.75H15.206C15.0912 18.0751 14.7632 18.2884 14.4072 18.2441C14.1163 18.2078 13.8879 18.0085 13.7958 17.75H11.206C11.0912 18.0751 10.7632 18.2884 10.4072 18.2441C10.1163 18.2078 9.88788 18.0085 9.79584 17.75H7.206C7.09124 18.0751 6.76324 18.2884 6.40717 18.2441C6.11635 18.2078 5.88788 18.0085 5.79584 17.75H4.99994C4.58573 17.75 4.24994 17.4142 4.24994 17C4.24994 16.5858 4.58573 16.25 4.99994 16.25H5.90033L6.15033 14.25H5.24994C4.83573 14.25 4.49994 13.9142 4.49994 13.5C4.49994 13.0858 4.83573 12.75 5.24994 12.75H6.33783L6.58783 10.75H5.49994C5.08573 10.75 4.74994 10.4142 4.74994 10C4.74994 9.58579 5.08573 9.25 5.49994 9.25H6.79389C6.9087 8.92488 7.23657 8.71146 7.59272 8.75586C7.88345 8.7923 8.11205 8.99157 8.20404 9.25H10.7939C10.9087 8.92488 11.2366 8.71146 11.5927 8.75586C11.8834 8.7923 12.1121 8.99157 12.204 9.25H14.7939C14.9087 8.92488 15.2366 8.71146 15.5927 8.75586ZM7.41205 16.25H9.90033L10.1503 14.25H7.66205L7.41205 16.25ZM11.4121 16.25H13.9003L14.1503 14.25H11.6621L11.4121 16.25ZM7.84955 12.75H10.3378L10.5878 10.75H8.09955L7.84955 12.75ZM11.8496 12.75H14.3378L14.5878 10.75H12.0996L11.8496 12.75Z'
                                                        fill='#0194f3'
                                                    ></path>
                                                </svg>
                                                <Controller
                                                    name='startDate'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <DatePicker
                                                            selected={field.value}
                                                            onChange={(date) => field.onChange(date)}
                                                            dateFormat='dd MMMM yyyy'
                                                            locale={vi}
                                                            className='border-none outline-none bg-transparent placeholder:text-black font-semibold placeholder:text-[16px] text-black text-[16px]'
                                                            popperClassName='z-50'
                                                            minDate={today} // Giới hạn ngày
                                                            maxDate={maxDate} // Giới hạn ngày
                                                        />
                                                    )}
                                                />
                                            </div>

                                            <div className='w-[56px] h-[2px] bg-[#cdd0d1] rotate-90 absolute left-[44.5%]'></div>

                                            {/* DatePicker Ngày về */}
                                            <div
                                                className={
                                                    isRoundTrip
                                                        ? 'bg-white text-gray-900 rounded-r-[20px] h-full flex items-center gap-2 w-1/2 p-2'
                                                        : 'bg-[#dfe0e0] text-gray-900 rounded-r-[20px] h-full flex items-center gap-2 w-1/2 p-2'
                                                }
                                            >
                                                <svg
                                                    width='24'
                                                    height='24'
                                                    viewBox='0 0 24 24'
                                                    fill='none'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    data-id='IcSystemCalendar'
                                                >
                                                    <path
                                                        d='M15.9999 1.25C17.2425 1.25014 18.2499 2.25745 18.2499 3.5C18.2499 3.91413 17.914 4.24986 17.4999 4.25C17.1118 4.25 16.7925 3.95511 16.7538 3.57715L16.746 3.42285C16.7074 3.04497 16.388 2.75013 15.9999 2.75C15.5857 2.75 15.2499 3.08579 15.2499 3.5V4.75H17.8671C17.889 4.75001 17.9108 4.75242 17.9326 4.75293C17.9547 4.75097 17.9773 4.75 17.9999 4.75H19.4999C21.2947 4.75014 22.7499 6.20516 22.7499 8V19C22.7499 19.9664 21.9663 20.7499 20.9999 20.75H19.2421C18.7363 21.3613 17.9745 21.7499 17.1249 21.75H4.13275C2.54459 21.7498 1.28654 20.4081 1.38861 18.8232L2.1308 7.32324L2.16107 7.05566C2.37522 5.73967 3.51557 4.75006 4.87494 4.75H6.24994V3.5C6.24994 2.25736 7.2573 1.25 8.49994 1.25C9.74246 1.25014 10.7499 2.25745 10.7499 3.5C10.7499 3.91413 10.414 4.24986 9.99994 4.25C9.61178 4.25 9.29248 3.95511 9.25385 3.57715L9.24604 3.42285C9.20742 3.04497 8.88799 2.75013 8.49994 2.75C8.08573 2.75 7.74994 3.08579 7.74994 3.5V4.75H13.7499V3.5C13.7499 2.25736 14.7573 1.25 15.9999 1.25ZM4.87494 6.25C4.21589 6.25007 3.67031 6.76223 3.62787 7.41992L2.88568 18.9199C2.83944 19.6401 3.41105 20.2498 4.13275 20.25H17.1249C17.7839 20.2498 18.3296 19.7377 18.372 19.0801L19.1142 7.58008L19.1162 7.44727C19.0892 6.78655 18.5439 6.25034 17.8671 6.25H15.2031C15.0998 6.54057 14.8259 6.74989 14.4999 6.75C14.1738 6.75 13.8991 6.54072 13.7958 6.25H7.70307C7.59979 6.54057 7.32592 6.74989 6.99994 6.75C6.6738 6.75 6.39911 6.54072 6.29584 6.25H4.87494ZM20.4355 6.52246C20.555 6.83579 20.6213 7.17501 20.6171 7.5293L20.6113 7.67676L19.8691 19.1768C19.8675 19.2013 19.8635 19.2256 19.8613 19.25H20.9999C21.1379 19.2499 21.2499 19.138 21.2499 19V8C21.2499 7.37797 20.9245 6.83281 20.4355 6.52246ZM15.5927 8.75586C15.8834 8.7923 16.1121 8.99157 16.204 9.25H16.9999C17.414 9.25014 17.7499 9.58587 17.7499 10C17.7499 10.4141 17.414 10.7499 16.9999 10.75H16.0996L15.8496 12.75H16.7499C17.164 12.7501 17.4999 13.0859 17.4999 13.5C17.4999 13.9141 17.164 14.2499 16.7499 14.25H15.6621L15.4121 16.25H16.2499C16.664 16.2501 16.9999 16.5859 16.9999 17C16.9999 17.4141 16.664 17.7499 16.2499 17.75H15.206C15.0912 18.0751 14.7632 18.2884 14.4072 18.2441C14.1163 18.2078 13.8879 18.0085 13.7958 17.75H11.206C11.0912 18.0751 10.7632 18.2884 10.4072 18.2441C10.1163 18.2078 9.88788 18.0085 9.79584 17.75H7.206C7.09124 18.0751 6.76324 18.2884 6.40717 18.2441C6.11635 18.2078 5.88788 18.0085 5.79584 17.75H4.99994C4.58573 17.75 4.24994 17.4142 4.24994 17C4.24994 16.5858 4.58573 16.25 4.99994 16.25H5.90033L6.15033 14.25H5.24994C4.83573 14.25 4.49994 13.9142 4.49994 13.5C4.49994 13.0858 4.83573 12.75 5.24994 12.75H6.33783L6.58783 10.75H5.49994C5.08573 10.75 4.74994 10.4142 4.74994 10C4.74994 9.58579 5.08573 9.25 5.49994 9.25H6.79389C6.9087 8.92488 7.23657 8.71146 7.59272 8.75586C7.88345 8.7923 8.11205 8.99157 8.20404 9.25H10.7939C10.9087 8.92488 11.2366 8.71146 11.5927 8.75586C11.8834 8.7923 12.1121 8.99157 12.204 9.25H14.7939C14.9087 8.92488 15.2366 8.71146 15.5927 8.75586ZM7.41205 16.25H9.90033L10.1503 14.25H7.66205L7.41205 16.25ZM11.4121 16.25H13.9003L14.1503 14.25H11.6621L11.4121 16.25ZM7.84955 12.75H10.3378L10.5878 10.75H8.09955L7.84955 12.75ZM11.8496 12.75H14.3378L14.5878 10.75H12.0996L11.8496 12.75Z'
                                                        fill='#0194f3'
                                                    ></path>
                                                </svg>
                                                <Controller
                                                    name='endDate'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <DatePicker
                                                            selected={field.value}
                                                            onChange={(date) => field.onChange(date)}
                                                            dateFormat='dd MMMM yyyy'
                                                            locale={vi}
                                                            className={cx(
                                                                'border-none outline-none bg-transparent placeholder:text-black font-semibold placeholder:text-[16px] text-black text-[16px] w-full'
                                                            )}
                                                            popperClassName='z-50'
                                                            minDate={startDate || today} // Giới hạn ngày khứ hồi
                                                            maxDate={maxDate} // Giới hạn ngày tối đa
                                                            disabled={!isRoundTrip} // Vô hiệu hóa nếu không khứ hồi
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {/* NÚT TÌM KIẾM */}
                                        <button
                                            type='submit' // QUAN TRỌNG: Đổi thành type="submit"
                                            className='absolute right-1 top-[60%] w-[55px] h-[55px] outline outline-[#cdd0d180] rounded-[16px] bg-[#ff5e1f] cursor-pointer flex items-center justify-center text-center hover:bg-[#c94b1a] transtion duration-200 ease-in-out'
                                            // Xóa onClick khỏi nút này
                                        >
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                stroke-width='1.5'
                                                stroke='currentColor'
                                                className='size-6'
                                            >
                                                <path
                                                    stroke-linecap='round'
                                                    stroke-linejoin='round'
                                                    d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Phần còn lại của Giao diện
                         */}
                        <div className='flex items-center gap-2 mt-3'>
                            <h3 className='text-[16px] font-semibold text-white'>Tìm kiếm</h3>
                            <div className='rounded-[6px] w-[280px] h-[30px] text-[15px] text-white font-semibold flex items-center justify-center gap-2 bg-[#ffffff40] cursor-pointer'>
                                <svg
                                    width='18'
                                    height='18'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                    data-id='IcSystemMapSphereGlobal'
                                >
                                    <path
                                        d='M2.13989 7.71209C4.50666 2.26903 10.8383 -0.225512 16.2815 2.1408C21.7247 4.50756 24.2192 10.8392 21.8528 16.2824C19.486 21.7256 13.1544 24.2202 7.71117 21.8537C2.26813 19.4868 -0.226578 13.1553 2.13989 7.71209ZM17.2707 15.1076C15.9282 17.764 13.6673 19.9642 10.7278 21.1564C14.4975 21.6806 18.2992 19.8204 20.1467 16.3586L17.2707 15.1076ZM9.30004 20.0773C12.2832 19.1403 14.5727 17.0686 15.8918 14.508L12.384 12.9836L9.30004 20.0773ZM7.50121 10.8605C6.52842 13.5713 6.57623 16.6592 7.92504 19.4797L11.009 12.3849L7.50121 10.8605ZM3.24633 9.00994C1.97451 12.7218 3.20851 16.7715 6.16235 19.1711C5.02998 16.2086 5.0955 13.0541 6.12231 10.2609L3.24633 9.00994ZM17.8293 4.82244C18.9622 7.78508 18.8961 10.9392 17.8694 13.7326L20.7454 14.9836C22.017 11.2713 20.7839 7.22178 17.8293 4.82244ZM12.9827 11.6086L16.4905 13.133C17.4632 10.422 17.416 7.33444 16.0666 4.51385L12.9827 11.6086ZM14.6916 3.91619C11.709 4.8533 9.41888 6.9253 8.09985 9.48553L11.6077 11.0099L14.6916 3.91619ZM13.2639 2.83709C9.49478 2.31351 5.69237 4.17383 3.84496 7.63494L6.72094 8.88592C8.06347 6.22993 10.3249 4.02931 13.2639 2.83709Z'
                                        fill='#FFFFFF'
                                    ></path>
                                </svg>
                                <p>Khám phá ý tưởng chuyến bay</p>
                            </div>
                            <div className='rounded-[6px] w-[150px] h-[30px] text-[15px] text-white font-semibold flex items-center justify-center gap-2 bg-[#ffffff40] cursor-pointer'>
                                <svg
                                    width='18'
                                    height='18'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                    data-id='IcFlightPriceWatch'
                                >
                                    <path
                                        d='M13.001 1.24931C13.6737 1.24931 14.2508 1.78681 14.251 2.48759V2.81083C15.1504 2.95356 15.9992 3.24773 16.7676 3.6663L16.9883 3.7913L17.0528 3.83427C17.3592 4.059 17.4515 4.48396 17.2549 4.81864C17.0581 5.15312 16.6423 5.27872 16.2969 5.1204L16.2286 5.08525L15.8682 4.88896C15.0106 4.45742 14.0363 4.21318 13.001 4.21318C9.53185 4.2132 6.75125 6.95233 6.75103 10.2923V14.1946C6.751 14.3134 6.72216 14.4307 6.66803 14.5364L4.75103 18.2767V18.3225H21.251V18.2542L19.8145 14.9837L20.501 14.6829L21.1876 14.3811L22.6876 17.7952C22.7293 17.8901 22.751 17.9933 22.751 18.097V19.0725C22.751 19.4867 22.4152 19.8225 22.001 19.8225H16.6729C16.3185 21.5042 14.7964 22.7493 13.001 22.7493C11.2057 22.7493 9.68358 21.5042 9.32916 19.8225H4.00103C3.58687 19.8225 3.25107 19.4867 3.25103 19.0725V18.097C3.2511 17.9782 3.27988 17.8609 3.33404 17.7552L5.25103 14.014V10.2923C5.25123 6.50864 8.0775 3.39647 11.751 2.81278V2.48759C11.7512 1.78683 12.3284 1.24934 13.001 1.24931ZM10.8917 19.8225C11.2057 20.6475 12.0203 21.2493 13.001 21.2493C13.9818 21.2493 14.7963 20.6475 15.1104 19.8225H10.8917ZM20.1993 13.9954C20.5784 13.829 21.0209 14.0022 21.1876 14.3811L19.8145 14.9837C19.6484 14.6046 19.8202 14.1619 20.1993 13.9954ZM20.0547 5.62626C20.9139 5.77983 21.5781 6.29415 21.8126 7.02568L20.2208 7.34208C20.084 7.03501 19.791 6.84501 19.4297 6.84501C18.9903 6.84501 18.7169 7.07155 18.7169 7.4329C18.717 7.75791 18.9319 7.94733 19.3712 8.0286L19.8497 8.11943C21.2754 8.38141 22.0274 9.01391 22.0274 10.0979C22.0272 11.2269 21.285 11.9761 20.0547 12.1477V13.0159H19.0001V12.1575C17.7891 12.013 16.8809 11.3441 16.754 10.4768L18.3555 10.1517C18.5215 10.6124 18.9122 10.847 19.4883 10.847C20.0155 10.847 20.2889 10.6307 20.2891 10.2063C20.2891 9.85403 20.0645 9.65508 19.5567 9.56474L18.9415 9.44755C17.7208 9.22171 17.0079 8.56138 17.0079 7.6038C17.0081 6.54707 17.8088 5.76151 19.0001 5.59892V4.74052H20.0547V5.62626ZM3.044 5.96513C3.42314 5.98922 3.7302 6.29805 3.74517 6.68583C3.75976 7.07362 3.47686 7.40346 3.10064 7.45634L3.02447 7.46415L1.96295 7.50419H1.8858C1.50653 7.48023 1.19959 7.17137 1.18463 6.78349C1.16997 6.39555 1.45277 6.06574 1.82916 6.01298L1.90533 6.00517L2.96685 5.96415L3.044 5.96513ZM2.62115 2.8079C2.88182 2.48603 3.35394 2.43594 3.67584 2.69657L4.29693 3.20048C4.61884 3.46115 4.66893 3.93326 4.40826 4.25517C4.14758 4.57704 3.67547 4.62618 3.35357 4.36552L2.7315 3.86259C2.40969 3.6019 2.36051 3.12977 2.62115 2.8079ZM6.21099 0.57548C6.61887 0.505095 7.00737 0.77903 7.07818 1.18681L7.25885 2.23466C7.32926 2.6427 7.05557 3.03126 6.64752 3.10185C6.23964 3.17213 5.85103 2.89835 5.78033 2.49052L5.59967 1.44267C5.52912 1.03465 5.80304 0.646225 6.21099 0.57548Z'
                                        fill='#FFFFFF'
                                    ></path>
                                </svg>
                                <p>Cảnh báo giá</p>
                            </div>
                        </div>

                        <TrustedBy />
                    </div>
                </>
            )}
        </header>
    )
}
