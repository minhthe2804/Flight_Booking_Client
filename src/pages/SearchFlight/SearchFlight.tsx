// src/pages/SearchFlight/SearchFlight.tsx

import { faArrowsRotate, faFilter, faPlaneUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { airplane, planeup } from '~/assets/images/image'
import Button from '~/components/Button'
import { formatCurrencyVND, formatCustomDate, formatDuration, formatFlightTimeOnly } from '~/utils/utils'
import { FlightServiceModal } from './components/FlightServiceModal'
import useFlightQueryConfig, { FlightQueryConfig } from '~/hooks/useSearchFlightQueryConfig'
import { searchFlightApi } from '~/apis/searchFlight.api'
import NoFlightsFound from '~/components/NoFlightsFound'
import { Flight, searchFlight } from '~/types/searchFlight.type'

// --- Interfaces (Định nghĩa kiểu nội bộ) ---
interface FilterState {
    airlines: string[]
    departureTime: string // "HH:MM - HH:MM"
    arrivalTime: string // "HH:MM - HH:MM"
    priceRange: [number, number] // [min, max]
}
interface OpenState {
    airlines: boolean
    fightTime: boolean
    price: boolean
}
interface TimeSlot {
    label: string
    range: string
}

export default function SearchFlight() {
    const queryConfig = useFlightQueryConfig()

    // 3. Parse số lượng hành khách TỪ ĐÂY
    const passengerCounts = useMemo(() => {
        const adults = parseInt(queryConfig.adults || '1', 10)
        const children = parseInt(queryConfig.children || '0', 10)
        const infants = parseInt(queryConfig.infants || '0', 10)
        const validAdults = isNaN(adults) || adults < 1 ? 1 : adults
        const validChildren = isNaN(children) ? 0 : children
        const validInfants = isNaN(infants) ? 0 : infants
        const total = validAdults + validChildren + validInfants
        return { adults: validAdults, children: validChildren, infants: validInfants, total }
    }, [queryConfig])

    // --- State cho UI Filter ---
    const [filters, setFilters] = useState<FilterState>({
        airlines: [],
        departureTime: '',
        arrivalTime: '',
        priceRange: [0, 20000000] // Ví dụ: max price mặc định 5 triệu
    })
    const [isOpen, setIsOpen] = useState<OpenState>({ airlines: true, fightTime: true, price: true })
    const [isModalOpen, setIsModalOpen] = useState(false)

    // --- State cho việc chọn chuyến bay ---
    const [selectedDepartureFlight, setSelectedDepartureFlight] = useState<Flight | null>(null)
    const [selectedReturnFlight, setSelectedReturnFlight] = useState<Flight | null>(null)

    // --- Constants ---
    // Nên lấy danh sách hãng bay từ API nếu có thể
    const airlines: string[] = useMemo(
        () => [
            'Bamboo Airways',
            'VietJet Air',
            'Vietnam Airlines',
            'VietTravel Airlines',
            'Japan Airlines',
            'Korean Air',
            'Malaysia Airlines',
            'Singapore Airlines',
            'Thai Airways',
            'Turkish Airlines'
        ],
        []
    )
    const timeSlots: TimeSlot[] = useMemo(
        () => [
            { label: 'Đêm đến Sáng', range: '00:00 - 06:00' },
            { label: 'Sáng đến Trưa', range: '06:00 - 12:00' },
            { label: 'Trưa đến Tối', range: '12:00 - 18:00' },
            { label: 'Tối đến Đêm', range: '18:00 - 23:59' }
        ],
        []
    )
    const MAX_PRICE = 20000000 // Giá trị max cho slider

    // Chuẩn bị params và kiểm tra cho Chiều Đi
    const departureQueryParams = useMemo(
        () => ({
            departure_airport_code: queryConfig.departure_airport_code || '',
            arrival_airport_code: queryConfig.arrival_airport_code || '',
            departure_date: queryConfig.departure_date || '',
            adults: parseInt(queryConfig.adults || '1', 10),
            children: parseInt(queryConfig.children || '0', 10),
            infants: parseInt(queryConfig.infants || '0', 10),
            class_code: queryConfig.class_code || 'ECONOMY'
        }),
        [queryConfig]
    )

    const areDepartureParamsPresent = useMemo(
        () =>
            Boolean(
                departureQueryParams.departure_airport_code &&
                    departureQueryParams.arrival_airport_code &&
                    departureQueryParams.departure_date &&
                    departureQueryParams.adults >= 1 &&
                    !isNaN(departureQueryParams.adults)
            ),
        [departureQueryParams]
    )

    const {
        data: departureFlightsData,
        isLoading: isLoadingDeparture,
        isError: isErrorDeparture
    } = useQuery<searchFlight, Error>({
        queryKey: ['flights', 'departure', departureQueryParams],
        queryFn: async () => {
            const response = await searchFlightApi.searchFlights(departureQueryParams as unknown as FlightQueryConfig)
            return response.data
        },
        enabled: areDepartureParamsPresent,
        staleTime: 1000 * 60 * 3,
        refetchOnWindowFocus: false
    })

    // Chuẩn bị params và kiểm tra cho Chiều Về
    const isRoundTrip = queryConfig.is_round_trip === 'true'
    const returnDepartureCode = queryConfig.origin_arrival_code || queryConfig.arrival_airport_code
    const returnArrivalCode = queryConfig.origin_departure_code || queryConfig.departure_airport_code

    const returnQueryParams = useMemo(
        () => ({
            departure_airport_code: returnDepartureCode || '',
            arrival_airport_code: returnArrivalCode || '',
            departure_date: queryConfig.return_date || '', // Ngày về
            adults: parseInt(queryConfig.adults || '1', 10),
            children: parseInt(queryConfig.children || '0', 10),
            infants: parseInt(queryConfig.infants || '0', 10),
            class_code: queryConfig.class_code || 'ECONOMY'
        }),
        [queryConfig, returnDepartureCode, returnArrivalCode]
    )

    const areReturnParamsPresent = useMemo(
        () =>
            Boolean(
                isRoundTrip &&
                    returnQueryParams.departure_airport_code &&
                    returnQueryParams.arrival_airport_code &&
                    returnQueryParams.departure_date &&
                    returnQueryParams.adults >= 1 &&
                    !isNaN(returnQueryParams.adults)
            ),
        [isRoundTrip, returnQueryParams]
    )

    const {
        data: returnFlightsData,
        isLoading: isLoadingReturn,
        isError: isErrorReturn
    } = useQuery<searchFlight, Error>({
        queryKey: ['flights', 'return', returnQueryParams],
        queryFn: async () => {
            const response = await searchFlightApi.searchFlights(returnQueryParams as unknown as FlightQueryConfig)
            // Quan trọng: Điều chỉnh dựa trên cấu trúc API trả về
            return response.data
        },
        enabled: areReturnParamsPresent, // Chạy ngay nếu đủ đk
        staleTime: 1000 * 60 * 3,
        refetchOnWindowFocus: false
    })

    const isLoading = isLoadingDeparture || (areReturnParamsPresent && isLoadingReturn)

    // --- Filtering Logic ---
    const isTimeInRange = useCallback((flightTimeStr: string | undefined, timeRange: string): boolean => {
        if (!flightTimeStr || !timeRange) return true
        try {
            const [startStr, endStr] = timeRange.split(' - ')
            const [startHour, startMin] = startStr.split(':').map(Number)
            const [endHour, endMin] = endStr.split(':').map(Number)
            const flightHour = parseInt(flightTimeStr.substring(0, 2), 10)
            const flightMin = parseInt(flightTimeStr.substring(3, 5), 10)

            if (isNaN(flightHour) || isNaN(flightMin)) return true // Bỏ qua nếu giờ không hợp lệ

            const startTime = startHour * 60 + startMin
            const endTime = endHour * 60 + endMin
            const currentTime = flightHour * 60 + flightMin

            // Xử lý trường hợp 18:00 - 23:59 (bao gồm cả 23:59)
            if (endHour === 23 && endMin === 59) {
                return currentTime >= startTime // Chỉ cần lớn hơn hoặc bằng giờ bắt đầu
            }

            return currentTime >= startTime && currentTime < endTime // So sánh phút
        } catch (e) {
            console.error('Error parsing time for filter:', e)
            return true
        }
    }, [])

    const filteredDepartureFlights = useMemo(() => {
        // Điều chỉnh truy cập data dựa trên API response
        const flights = departureFlightsData?.data || []
        return flights.filter((flight) => {
            const departureTimeStr = formatFlightTimeOnly(flight.departure?.time)
            const arrivalTimeStr = formatFlightTimeOnly(flight.arrival?.time)

            return (
                (filters.airlines.length === 0 || filters.airlines.includes(flight.airline.name)) &&
                isTimeInRange(departureTimeStr, filters.departureTime) &&
                isTimeInRange(arrivalTimeStr, filters.arrivalTime) &&
                flight.starting_price <= filters.priceRange[1]
            )
        })
    }, [departureFlightsData, filters, isTimeInRange])

    const filteredReturnFlights = useMemo(() => {
        // Điều chỉnh truy cập data dựa trên API response
        const flights = returnFlightsData?.data || []
        if (!isRoundTrip) return []
        return flights.filter((flight) => {
            const departureTimeStr = formatFlightTimeOnly(flight.departure?.time)
            const arrivalTimeStr = formatFlightTimeOnly(flight.arrival?.time)
            return (
                (filters.airlines.length === 0 || filters.airlines.includes(flight.airline.name)) &&
                isTimeInRange(departureTimeStr, filters.departureTime) &&
                isTimeInRange(arrivalTimeStr, filters.arrivalTime) &&
                flight.starting_price <= filters.priceRange[1]
            )
        })
    }, [returnFlightsData, filters, isRoundTrip, isTimeInRange])

    const openModal = () => {
        if (isRoundTrip && (!selectedDepartureFlight || !selectedReturnFlight)) {
            toast.warn('Vui lòng chọn cả chuyến đi và chuyến về.')
            return
        }
        if (!isRoundTrip && !selectedDepartureFlight) {
            toast.warn('Vui lòng chọn chuyến bay.')
            return
        }
        setIsModalOpen(true)
    }
    const closeModal = () => setIsModalOpen(false)

    const handleAirlineChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target
        setFilters((prev) => ({
            ...prev,
            airlines: checked ? [...prev.airlines, value] : prev.airlines.filter((a) => a !== value)
        }))
    }, [])

    const handleTimeChange = useCallback((type: 'departureTime' | 'arrivalTime', value: string) => {
        setFilters((prev) => ({ ...prev, [type]: prev[type] === value ? '' : value }))
    }, [])

    const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10)
        setFilters((prev) => ({ ...prev, priceRange: [0, value] }))
    }, [])

    const toggleSection = useCallback((section: keyof OpenState) => {
        setIsOpen((prev) => ({ ...prev, [section]: !prev[section] }))
    }, [])

    const handleResetFilters = useCallback(() => {
        setFilters({ airlines: [], departureTime: '', arrivalTime: '', priceRange: [0, MAX_PRICE] })
        setSelectedDepartureFlight(null) // Reset luôn lựa chọn khi reset filter
        setSelectedReturnFlight(null)
        toast.info('Đã đặt lại bộ lọc')
    }, [])

    const handleSelectDeparture = useCallback(
        (flight: Flight) => {
            setSelectedDepartureFlight(flight)
            setSelectedReturnFlight(null)
            toast.success(`Đã chọn chuyến đi: ${flight.flight_number}`)
            if (isRoundTrip) {
                document
                    .getElementById('return-flights-section')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        },
        [isRoundTrip]
    )

    const handleSelectReturn = useCallback(
        (flight: Flight) => {
            if (!selectedDepartureFlight) {
                toast.warn('Vui lòng chọn chuyến đi trước.')
                return
            }
            setSelectedReturnFlight(flight)
            toast.success(`Đã chọn chuyến về: ${flight.flight_number}`)
        },
        [selectedDepartureFlight]
    )

    const handelNotDataReturnFlight = () => {
        if (!selectedDepartureFlight) {
            toast.warn('Hiện tại không có chuyến bay phù hợp bạn hãy tìm kiếm chuyến bay khác')
            return
        }
        if (selectedDepartureFlight && filteredReturnFlights && filteredReturnFlights.length === 0) {
            toast.warn('Hiện tại không có chuyến bay phù hợp bạn hãy tìm kiếm chuyến bay khác')
            return
        }
    }

    return (
        <div className='bg-gray-100 min-h-screen py-5'>
            <div className='max-w-screen-xl mx-auto'>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                    {/* === Cột Filter (Sidebar) === */}
                    <aside className='lg:col-span-4 space-y-6'>
                        {/* Box Chuyến bay của bạn */}
                        <div className='w-full rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden'>
                            <div className='px-4 py-3 border-b border-gray-200 flex items-center gap-2 bg-gray-50'>
                                <img src={planeup} className='w-5 h-5' alt='Plane Icon' />
                                <p className='text-md font-semibold text-gray-800'>Chuyến bay của bạn</p>
                            </div>
                            {/* Chuyến đi */}
                            <div className='bg-white px-4 py-3 flex justify-between items-start'>
                                <div className='flex gap-3 items-center'>
                                    {' '}
                                    {/* Thêm items-center */}
                                    <div className='bg-blue-600 rounded-full w-6 h-6 text-white flex items-center justify-center text-sm font-bold flex-shrink-0'>
                                        1
                                    </div>
                                    <div className='text-sm font-medium'>
                                        <div className='flex items-center gap-1 font-semibold text-gray-800'>
                                            <p>{queryConfig.departure_airport_code}</p>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                strokeWidth='2'
                                                stroke='currentColor'
                                                className='w-4 h-4 text-gray-500'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    d='M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3'
                                                />
                                            </svg>
                                            <p>{queryConfig.arrival_airport_code}</p>
                                        </div>
                                        <p className='text-xs text-gray-500 mt-1'>
                                            {formatCustomDate(queryConfig.departure_date as string)}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className={`mt-1 rounded text-xs px-2 py-0.5 font-medium ${selectedDepartureFlight ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}
                                >
                                    {selectedDepartureFlight ? 'Đã chọn' : 'Chưa chọn'}
                                </div>
                            </div>
                            {/* Chuyến về */}
                            {isRoundTrip && (
                                <>
                                    <hr className='border-gray-200 mx-4' />
                                    <div className='bg-white px-4 py-3 flex justify-between items-start'>
                                        <div className='flex gap-3 items-center'>
                                            <div className='bg-blue-600 rounded-full w-6 h-6 text-white flex items-center justify-center text-sm font-bold flex-shrink-0'>
                                                2
                                            </div>
                                            <div className='text-sm font-medium'>
                                                <div className='flex items-center gap-1 font-semibold text-gray-800'>
                                                    <p>{returnQueryParams.departure_airport_code}</p>
                                                    <svg
                                                        xmlns='http://www.w3.org/2000/svg'
                                                        fill='none'
                                                        viewBox='0 0 24 24'
                                                        strokeWidth='2'
                                                        stroke='currentColor'
                                                        className='w-4 h-4 text-gray-500'
                                                    >
                                                        <path
                                                            strokeLinecap='round'
                                                            strokeLinejoin='round'
                                                            d='M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3'
                                                        />
                                                    </svg>
                                                    <p>{returnQueryParams.arrival_airport_code}</p>
                                                </div>
                                                <p className='text-xs text-gray-500 mt-1'>
                                                    {formatCustomDate(queryConfig.return_date as string)}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className={`mt-1 rounded text-xs px-2 py-0.5 font-medium ${selectedReturnFlight ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}
                                        >
                                            {selectedReturnFlight ? 'Đã chọn' : 'Chưa chọn'}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Box Bộ lọc */}
                        <div className='w-full rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden'>
                            <div className='px-4 py-3 border-b border-gray-200 flex items-center justify-between gap-2 bg-gray-50'>
                                <div className='flex items-center gap-2'>
                                    <FontAwesomeIcon icon={faFilter} className='w-4 h-4 text-gray-600' />
                                    <h2 className='text-md font-semibold text-gray-800'>Bộ lọc</h2>
                                </div>
                                <button
                                    onClick={handleResetFilters}
                                    className='text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1'
                                >
                                    <FontAwesomeIcon icon={faArrowsRotate} className='w-3 h-3' />
                                    Đặt lại
                                </button>
                            </div>
                            <div className='bg-white divide-y divide-gray-200'>
                                <div className='px-4'>
                                    <button
                                        onClick={() => toggleSection('airlines')}
                                        className='w-full text-left py-3 text-md font-semibold text-gray-800 flex justify-between items-center'
                                    >
                                        Hãng hàng không
                                        <svg
                                            className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen.airlines ? 'rotate-180' : ''}`}
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M19 9l-7 7-7-7'
                                            />
                                        </svg>
                                    </button>
                                    {isOpen.airlines && (
                                        <div className='pt-1 pb-3 pl-2 space-y-2'>
                                            {airlines.map((airline) => (
                                                <div key={airline} className='flex items-center'>
                                                    <input
                                                        type='checkbox'
                                                        id={`filter-${airline}`}
                                                        value={airline}
                                                        checked={filters.airlines.includes(airline)}
                                                        onChange={handleAirlineChange}
                                                        className='mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                                                    />
                                                    <label
                                                        htmlFor={`filter-${airline}`}
                                                        className='text-sm text-gray-700 select-none'
                                                    >
                                                        {airline}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {/* Thời gian bay */}
                                <div className='px-4'>
                                    <button
                                        onClick={() => toggleSection('fightTime')}
                                        className='w-full text-left py-3 text-md font-semibold text-gray-800 flex justify-between items-center'
                                    >
                                        Thời gian bay
                                        <svg
                                            className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen.fightTime ? 'rotate-180' : ''}`}
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M19 9l-7 7-7-7'
                                            />
                                        </svg>
                                    </button>
                                    {isOpen.fightTime && (
                                        <div className='pt-1 pb-3 pl-2 space-y-4'>
                                            {/* Giờ cất cánh */}
                                            <div>
                                                <h3 className='text-sm font-semibold text-gray-600 mb-2'>
                                                    Giờ cất cánh
                                                </h3>
                                                <div className='grid grid-cols-2 gap-2'>
                                                    {timeSlots.map((slot) => (
                                                        <button
                                                            key={`dep-${slot.range}`}
                                                            onClick={() =>
                                                                handleTimeChange('departureTime', slot.range)
                                                            }
                                                            className={`text-xs p-2 rounded border text-center transition-colors duration-150 ${filters.departureTime === slot.range ? 'bg-blue-100 border-blue-500 text-blue-700 font-semibold' : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                                                        >
                                                            <p>{slot.label}</p>
                                                            <p className='font-medium'>({slot.range})</p>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Giờ hạ cánh */}
                                            <div>
                                                <h3 className='text-sm font-semibold text-gray-600 mb-2'>
                                                    Giờ hạ cánh
                                                </h3>
                                                <div className='grid grid-cols-2 gap-2'>
                                                    {timeSlots.map((slot) => (
                                                        <button
                                                            key={`arr-${slot.range}`}
                                                            onClick={() => handleTimeChange('arrivalTime', slot.range)}
                                                            className={`text-xs p-2 rounded border text-center transition-colors duration-150 ${filters.arrivalTime === slot.range ? 'bg-blue-100 border-blue-500 text-blue-700 font-semibold' : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                                                        >
                                                            <p>{slot.label}</p>
                                                            <p className='font-medium'>({slot.range})</p>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Giá vé */}
                                <div className='px-4'>
                                    <button
                                        onClick={() => toggleSection('price')}
                                        className='w-full text-left py-3 text-md font-semibold text-gray-800 flex justify-between items-center'
                                    >
                                        Giá/hành khách
                                        <svg
                                            className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen.price ? 'rotate-180' : ''}`}
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M19 9l-7 7-7-7'
                                            />
                                        </svg>
                                    </button>
                                    {isOpen.price && (
                                        <div className='pt-1 pb-3 pl-2'>
                                            <input
                                                type='range'
                                                min='0'
                                                max={MAX_PRICE}
                                                step='50000'
                                                value={filters.priceRange[1]}
                                                onChange={handlePriceChange}
                                                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600'
                                            />
                                            <p className='text-gray-600 text-sm mt-1 text-right font-medium'>
                                                Đến {formatCurrencyVND(filters.priceRange[1])}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* === Cột Kết quả Chuyến bay === */}
                    <main className='lg:col-span-8'>
                        {/* Header thông tin tìm kiếm */}
                        <div className='w-full rounded-lg px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 relative text-white shadow-md mb-6 overflow-hidden'>
                            <div className='flex flex-col gap-1'>
                                <div className='flex items-center gap-1 font-semibold text-lg flex-wrap'>
                                    {' '}
                                    {/* Thêm flex-wrap */}
                                    <span>{queryConfig.departure_airport_code}</span>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth='2'
                                        stroke='currentColor'
                                        className='w-5 h-5 text-white mt-[2px]'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3'
                                        />
                                    </svg>
                                    <span>{queryConfig.arrival_airport_code}</span>
                                    {isRoundTrip && (
                                        <span className='ml-2 text-sm font-medium bg-white/20 px-2 py-0.5 rounded'>
                                            (Khứ hồi)
                                        </span>
                                    )}
                                </div>
                                <div className='flex flex-wrap gap-x-3 gap-y-1 items-center text-sm opacity-90 mt-1'>
                                    <span>{formatCustomDate(queryConfig.departure_date as string)}</span>
                                    {isRoundTrip && queryConfig.return_date && (
                                        <>
                                            <span className='hidden sm:inline'>•</span>
                                            <span>Về: {formatCustomDate(queryConfig.return_date as string)}</span>
                                        </>
                                    )}
                                    <span className='hidden sm:inline'>•</span>
                                    <span>
                                        {departureQueryParams.adults} người lớn
                                        {departureQueryParams.children > 0
                                            ? `, ${departureQueryParams.children} trẻ em`
                                            : ''}
                                        {departureQueryParams.infants > 0
                                            ? `, ${departureQueryParams.infants} em bé`
                                            : ''}
                                    </span>
                                    <span className='hidden sm:inline'>•</span>
                                    <span>{queryConfig.class_code}</span>
                                </div>
                            </div>
                            <img
                                src={airplane}
                                alt='Airplane graphic'
                                className='absolute w-28 top-[-10px] right-5 opacity-20 transform -scale-x-100'
                            />
                        </div>

                        {/* --- Hiển thị Loading / Error / No Results / Kết quả --- */}
                        {isLoading && (
                            <div className='text-center p-10 bg-white rounded-lg shadow border border-gray-200'>
                                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto'></div>
                                <p className='mt-4 text-gray-600'>Đang tìm chuyến bay...</p>
                            </div>
                        )}
                        {!isLoading &&
                            (isErrorDeparture || (isRoundTrip && areReturnParamsPresent && isErrorReturn)) && (
                                <div className='text-center text-red-600 font-semibold p-4 border border-red-200 bg-red-50 rounded-lg shadow-sm'>
                                    Lỗi khi tải dữ liệu chuyến bay. Vui lòng thử lại.
                                </div>
                            )}
                        {!isLoading && !isErrorDeparture && !areDepartureParamsPresent && (
                            <div className='text-center text-red-600 font-semibold p-4 border border-red-200 bg-red-50 rounded-lg shadow-sm'>
                                Vui lòng cung cấp đủ thông tin tìm kiếm.
                            </div>
                        )}

                        {/* --- Phần Hiển Thị Kết Quả --- */}
                        {!isLoading && areDepartureParamsPresent && !isErrorDeparture && (
                            <div className='space-y-6'>
                                {/* === Section Chiều Đi === */}
                                <div>
                                    {isRoundTrip && (
                                        <h2 className='text-xl font-semibold mb-4 text-gray-800 border-b pb-2'>
                                            Chọn chuyến đi
                                        </h2>
                                    )}
                                    <div className='space-y-4'>
                                        {filteredDepartureFlights.length > 0
                                            ? filteredDepartureFlights.map((flight: Flight) => (
                                                  <div
                                                      key={`dep-${flight.flight_id}`}
                                                      onClick={() => isRoundTrip && handleSelectDeparture(flight)}
                                                      className={`p-4 w-full rounded-lg border bg-white shadow-sm transition-all duration-200 ${isRoundTrip ? 'cursor-pointer hover:border-blue-500 hover:shadow-lg' : ''} ${selectedDepartureFlight?.flight_id === flight.flight_id ? 'border-blue-500 ring-2 ring-blue-300 ring-offset-1' : 'border-gray-200'}`}
                                                  >
                                                      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                                                          <div className='flex items-center gap-3 w-full sm:w-1/4 mb-2 sm:mb-0'>
                                                              {/* Thêm logo hãng bay nếu có */}
                                                              {/* <img src={flight.airline.logo_url} alt={flight.airline.name} className="w-8 h-8 object-contain mr-2"/> */}
                                                              <div className='flex flex-col gap-0 text-sm'>
                                                                  <p className='font-semibold text-gray-800'>
                                                                      {flight.airline.name}
                                                                  </p>
                                                                  <p className='text-xs text-gray-500'>
                                                                      {flight.flight_number}
                                                                  </p>
                                                              </div>
                                                          </div>
                                                          <div className='flex items-center justify-between w-full sm:w-1/2'>
                                                              <div className='flex flex-col items-center gap-0 text-center'>
                                                                  <p className='text-xl font-bold text-gray-800'>
                                                                      {formatFlightTimeOnly(flight.departure.time)}
                                                                  </p>
                                                                  <p className='text-xs text-gray-500'>
                                                                      {flight.departure.airport.code}
                                                                  </p>
                                                              </div>
                                                              <div className='flex flex-col items-center text-xs text-gray-500 px-2 flex-grow mx-1'>
                                                                  <span>{formatDuration(flight.duration)}</span>
                                                                  <div className='w-full h-px bg-gray-300 my-1 relative'>
                                                                      <FontAwesomeIcon
                                                                          icon={faPlaneUp}
                                                                          className='text-[10px] text-blue-600 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-1'
                                                                      />
                                                                  </div>
                                                                  <span className='text-[10px]'>Bay thẳng</span>
                                                              </div>
                                                              <div className='flex flex-col items-center gap-0 text-center'>
                                                                  <p className='text-xl font-bold text-gray-800'>
                                                                      {formatFlightTimeOnly(flight.arrival.time)}
                                                                  </p>
                                                                  <p className='text-xs text-gray-500'>
                                                                      {flight.arrival.airport.code}
                                                                  </p>
                                                              </div>
                                                          </div>
                                                          <div className='flex flex-col gap-1 items-end w-full sm:w-1/4 mt-2 sm:mt-0'>
                                                              <p className='text-xl text-orange-600 font-bold'>
                                                                  {formatCurrencyVND(flight.starting_price)}
                                                              </p>
                                                              <Button
                                                                  className='text-sm bg-orange-500 rounded h-8 px-4 font-semibold hover:bg-orange-600 transition duration-200 ease-in w-full sm:w-auto text-white' // Thêm text-white
                                                                  onClick={(e) => {
                                                                      e.stopPropagation()
                                                                      if (!isRoundTrip) {
                                                                          setSelectedDepartureFlight(flight)
                                                                          openModal()
                                                                      } else {
                                                                          handleSelectDeparture(flight)
                                                                      }
                                                                  }}
                                                              >
                                                                  {isRoundTrip ? 'Chọn đi' : 'Chọn'}
                                                              </Button>
                                                          </div>
                                                      </div>
                                                  </div>
                                              ))
                                            : !isLoadingDeparture && (
                                                  <NoFlightsFound onclick={handelNotDataReturnFlight} />
                                              )}{' '}
                                        {/* Chỉ hiện khi không loading */}
                                    </div>
                                </div>

                                {/* === Section Chiều Về (Chỉ hiện khi là khứ hồi và có kết quả chiều đi) === */}
                                {isRoundTrip && areReturnParamsPresent && !isErrorReturn && (
                                    <div id='return-flights-section' className='mt-8 pt-6 border-t border-gray-300'>
                                        <h2 className='text-xl font-semibold mb-4 text-gray-800'>Chọn chuyến về</h2>
                                        {/* Hiển thị loading riêng cho chiều về nếu cần */}
                                        {isLoadingReturn && (
                                            <div className='text-center p-6 bg-white rounded-lg shadow border border-gray-200'>
                                                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto'></div>
                                                <p className='mt-3 text-gray-500 text-sm'>Đang tải chuyến về...</p>
                                            </div>
                                        )}
                                        {!isLoadingReturn && ( // Chỉ hiển thị kết quả hoặc NoFlightsFound khi không loading
                                            <div className='space-y-4'>
                                                {filteredReturnFlights.length > 0 ? (
                                                    filteredReturnFlights.map((flight: Flight) => (
                                                        // --- Card Chuyến Về ---
                                                        <div
                                                            key={`ret-${flight.flight_id}`}
                                                            onClick={() => handleSelectReturn(flight)} // Gọi hàm chọn chuyến về
                                                            className={`p-4 w-full rounded-lg border bg-white shadow-sm transition-all duration-200 ${
                                                                !selectedDepartureFlight // Disable nếu chưa chọn chuyến đi
                                                                    ? 'opacity-60 cursor-not-allowed' // Tăng độ mờ
                                                                    : 'cursor-pointer hover:border-green-500 hover:shadow-lg'
                                                            } ${
                                                                selectedReturnFlight?.flight_id === flight.flight_id // Highlight nếu đã chọn
                                                                    ? 'border-green-500 ring-2 ring-green-300 ring-offset-1'
                                                                    : 'border-gray-200'
                                                            }`}
                                                        >
                                                            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                                                                {/* Col 1: Hãng + Số hiệu (Copy từ chiều đi) */}
                                                                <div className='flex items-center gap-3 w-full sm:w-1/4 mb-2 sm:mb-0'>
                                                                    {/* <img src={flight.airline.logo_url} alt={flight.airline.name} className="w-8 h-8 object-contain mr-2"/> */}
                                                                    <div className='flex flex-col gap-0 text-sm'>
                                                                        <p className='font-semibold text-gray-800'>
                                                                            {flight.airline.name}
                                                                        </p>
                                                                        <p className='text-xs text-gray-500'>
                                                                            {flight.flight_number}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                {/* Col 2: Giờ + Sân bay + Duration (Copy từ chiều đi) */}
                                                                <div className='flex items-center justify-between w-full sm:w-1/2'>
                                                                    <div className='flex flex-col items-center gap-0 text-center'>
                                                                        <p className='text-xl font-bold text-gray-800'>
                                                                            {formatFlightTimeOnly(
                                                                                flight.departure.time
                                                                            )}
                                                                        </p>
                                                                        <p className='text-xs text-gray-500'>
                                                                            {flight.departure.airport.code}
                                                                        </p>
                                                                    </div>
                                                                    <div className='flex flex-col items-center text-xs text-gray-500 px-2 flex-grow mx-1'>
                                                                        <span>{formatDuration(flight.duration)}</span>
                                                                        <div className='w-full h-px bg-gray-300 my-1 relative'>
                                                                            <FontAwesomeIcon
                                                                                icon={faPlaneUp}
                                                                                className='text-[10px] text-blue-600 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-1'
                                                                            />
                                                                        </div>
                                                                        <span className='text-[10px]'>Bay thẳng</span>
                                                                    </div>
                                                                    <div className='flex flex-col items-center gap-0 text-center'>
                                                                        <p className='text-xl font-bold text-gray-800'>
                                                                            {formatFlightTimeOnly(flight.arrival.time)}
                                                                        </p>
                                                                        <p className='text-xs text-gray-500'>
                                                                            {flight.arrival.airport.code}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                {/* Col 3: Giá + Nút chọn về */}
                                                                <div className='flex flex-col gap-1 items-end w-full sm:w-1/4 mt-2 sm:mt-0'>
                                                                    <p className='text-xl text-orange-600 font-bold'>
                                                                        {formatCurrencyVND(flight.starting_price)}
                                                                    </p>
                                                                    <Button
                                                                        className={`text-sm rounded h-8 px-4 font-semibold transition duration-200 ease-in w-full sm:w-auto ${
                                                                            !selectedDepartureFlight // Disable nếu chưa chọn đi
                                                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                                : 'bg-green-500 hover:bg-green-600 text-white' // Màu xanh cho nút chọn về
                                                                        }`}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation() // Ngăn card onClick
                                                                            handleSelectReturn(flight) // Gọi hàm chọn chuyến về
                                                                        }}
                                                                        disabled={!selectedDepartureFlight} // Disable nút nếu chưa chọn đi
                                                                    >
                                                                        Chọn về
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <NoFlightsFound onclick={handelNotDataReturnFlight} /> // Hiển thị nếu không có chuyến về phù hợp
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>

                {/* --- Thanh Tóm tắt/Tiếp tục (Fixed Bottom) --- */}
                {/* Chỉ hiển thị khi đã chọn đủ chuyến bay */}
                {((isRoundTrip && selectedDepartureFlight && selectedReturnFlight) ||
                    (!isRoundTrip && selectedDepartureFlight)) && (
                    <div className='fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center z-10'>
                        <div className='text-sm mb-2 sm:mb-0 text-gray-700'>
                            {selectedDepartureFlight && (
                                <p>
                                    <b>Đi:</b> {selectedDepartureFlight.airline.name} (
                                    {selectedDepartureFlight.flight_number}) -{' '}
                                    {formatFlightTimeOnly(selectedDepartureFlight.departure.time)}
                                </p>
                            )}
                            {selectedReturnFlight && (
                                <p>
                                    <b>Về:</b> {selectedReturnFlight.airline.name} ({selectedReturnFlight.flight_number}
                                    ) - {formatFlightTimeOnly(selectedReturnFlight.departure.time)}
                                </p>
                            )}
                        </div>
                        <div className='flex items-center gap-4'>
                            {' '}
                            {/* Tăng gap */}
                            <span className='text-xl font-bold text-orange-600'>
                                Tổng cộng:{' '}
                                {formatCurrencyVND(
                                    (selectedDepartureFlight?.starting_price || 0) +
                                        (selectedReturnFlight?.starting_price || 0)
                                )}
                            </span>
                            <Button
                                className='bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-md shadow transition-colors duration-150'
                                onClick={openModal}
                            >
                                Tiếp tục
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <FlightServiceModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    departureFlight={selectedDepartureFlight}
                    returnFlight={selectedReturnFlight}
                    searchedClassCode={queryConfig.class_code}
                    passengerCounts={passengerCounts}
                />
            )}
        </div>
    )
}
