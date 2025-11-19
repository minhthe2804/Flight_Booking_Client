import { Link } from 'react-router-dom'
import { Flight } from '~/types/flight.type'
import { path } from '~/constants/path'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlaneDeparture, faPlaneArrival } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'

interface FlightCardProps {
    flight: Flight
}

// Hàm chuyển đổi thời lượng (ví dụ: "02:30" -> "2h 30m")
const formatDuration = (duration: string) => {
    if (!duration) return ''
    const parts = duration.split(':')
    const hours = parseInt(parts[0], 10)
    const minutes = parseInt(parts[1], 10)
    let result = ''
    if (hours > 0) {
        result += `${hours}h `
    }
    if (minutes > 0) {
        result += `${minutes}m`
    }
    return result.trim() || 'N/A'
}

// SỬA: Hàm mới để định dạng Giờ và Ngày (theo múi giờ Việt Nam)
const formatDateTime = (isoString: string) => {
    if (!isoString) return { time: '', date: '' }

    // Chuyển sang múi giờ Việt Nam (GMT+7)
    const date = new Date(isoString)

    const time = date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Ho_Chi_Minh' // Chỉ định múi giờ
    })

    const dateString = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Asia/Ho_Chi_Minh'
    })

    return { time, date: dateString }
}

export default function FlightCard({ flight }: FlightCardProps) {
    // Lấy thông tin cho query params
    const fromCode = flight.departure.airport.code
    const toCode = flight.arrival.airport.code
    const departureDate = flight.departure.time.split('T')[0]
    const adults = 1
    const children = 0
    const infants = 0

    const searchUrl = `${path.searchFlight}?departure_airport_code=${fromCode}&arrival_airport_code=${toCode}&departure_date=${departureDate}&adults=${adults}&children=${children}&infants=${infants}`

    // SỬA: Lấy giờ/ngày đã định dạng
    const departure = formatDateTime(flight.departure.time)
    const arrival = formatDateTime(flight.arrival.time)

    return (
        <Link
            to={searchUrl}
            className='block rounded-lg shadow-lg border border-gray-200 bg-white overflow-hidden h-full 
                 p-4 group transition-all duration-200 hover:shadow-xl hover:border-blue-400 relative'
        >
            <div
                className='absolute inset-0 bg-gradient-to-t from-transparent to-transparent 
                      group-hover:from-blue-50 group-hover:to-blue-50 opacity-0 group-hover:opacity-100 
                      transition-opacity duration-200 rounded-lg'
            ></div>

            <div className='relative z-10'>
                {/* Hàng trên: Hãng bay & Thời lượng */}
                <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-2'>
                        <FontAwesomeIcon icon={faPlaneDeparture} className='text-blue-500 text-lg' />
                        <div>
                            <p className='text-xs font-medium text-gray-500'>Hãng bay</p>
                            <p className='text-sm font-semibold text-gray-800'>{flight.airline.name}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-1 text-gray-600'>
                        <FontAwesomeIcon icon={faClock} className='text-sm' />
                        <span className='text-sm font-medium'>{formatDuration(flight.duration)}</span>
                    </div>
                </div>

                {/* Thông tin chặng bay */}
                <div className='space-y-3'>
                    {/* Điểm đi */}
                    <div className='flex items-center gap-2'>
                        <FontAwesomeIcon icon={faPlaneDeparture} className='text-gray-400 text-base' />
                        <div>
                            {/* SỬA: Thêm giờ và ngày, bỏ chữ "Từ" */}
                            <p className='text-xs font-medium text-gray-600'>
                                {departure.time} - {departure.date}
                            </p>
                            <p className='text-sm font-semibold text-gray-900 line-clamp-1'>
                                {flight.departure.airport.city} ({fromCode})
                            </p>
                        </div>
                    </div>

                    {/* Dấu gạch nối */}
                    <div className='flex items-center gap-2 pl-4'>
                        <div className='w-px h-6 bg-gray-300 ml-[10px]'></div>
                    </div>

                    {/* Điểm đến */}
                    <div className='flex items-center gap-2'>
                        <FontAwesomeIcon icon={faPlaneArrival} className='text-gray-400 text-base' />
                        <div>
                            {/* SỬA: Thêm giờ và ngày, bỏ chữ "Đến" */}
                            <p className='text-xs font-medium text-gray-600'>
                                {arrival.time} - {arrival.date}
                            </p>
                            <p className='text-sm font-semibold text-gray-900 line-clamp-1'>
                                {flight.arrival.airport.city} ({toCode})
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
