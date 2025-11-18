import React, { useRef, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlaneDeparture, 
  faPlaneArrival, 
  faTag, 
  faSpinner,
  faChevronLeft,
  faChevronRight,
  faArrowRight,
  faCalendarAlt,
  faFire
} from '@fortawesome/free-solid-svg-icons'

import { formatCurrencyVND, formatDateTime } from '~/utils/utils'
import { path } from '~/constants/path'
import { FlightSearchQuery, FlightSearchResult, searchFlightApi } from '~/apis/searchFlight.api'

// --- Helper: Format ngày cho URL ---
const formatDateForUrl = (isoString: string) => {
  if (!isoString) return ''
  return isoString.split('T')[0]
}

// --- Component Card cho từng chuyến bay ---
interface DealCardProps {
  flight: FlightSearchResult | any
}

const DealCard: React.FC<DealCardProps> = ({ flight }) => {
  // Lấy thông tin từ cấu trúc mới
  const depCode = flight.departure.airport.code
  const arrCode = flight.arrival.airport.code
  const depCity = flight.departure.airport.city
  const arrCity = flight.arrival.airport.city
  const depTime = flight.departure.time
  const airlineName = flight.airline.name
  const price = flight.starting_price // Hoặc flight.economy_price

  // Tạo link tìm kiếm
  const searchLink = `${path.searchFlight}?departure_airport_code=${depCode}&arrival_airport_code=${arrCode}&departure_date=${formatDateForUrl(depTime)}`

  return (
    <div className='bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex flex-col justify-between border border-gray-100 h-full group w-full relative overflow-hidden'>
      {/* Badge Giá tốt */}
      <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10 shadow-sm">
         GIÁ TỐT
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 mt-1">
             <div className="flex items-center gap-2">
                {/* Logo hãng bay */}
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 overflow-hidden border border-blue-100">
                  {flight.airline.logo_url ? (
                    <img src={flight.airline.logo_url} alt={airlineName} className="w-full h-full object-cover" />
                  ) : (
                    <FontAwesomeIcon icon={faPlaneDeparture} className="text-xs" />
                  )}
                </div>
                <span className="text-xs font-bold text-gray-700 truncate max-w-[100px]" title={airlineName}>
                    {airlineName}
                </span>
             </div>
        </div>
        
        {/* Hành trình: HAN -> SGN */}
        <div className="flex items-center justify-between mb-2 px-1">
            <div className="text-center min-w-[60px]">
                <span className="block text-2xl font-bold text-gray-800">{depCode}</span>
                <span className="block text-[10px] text-gray-500 truncate max-w-[80px] mx-auto" title={depCity}>
                    {depCity}
                </span>
            </div>
            
            <div className="flex-1 mx-3 flex flex-col items-center justify-center">
                <div className="w-full border-t-2 border-dashed border-gray-300 relative top-1.5"></div>
                <FontAwesomeIcon icon={faPlaneArrival} className="text-gray-400 text-xs mt-1 bg-white px-1" />
                <span className="text-[10px] text-gray-400 mt-1">{flight.duration}</span>
            </div>

            <div className="text-center min-w-[60px]">
                <span className="block text-2xl font-bold text-gray-800">{arrCode}</span>
                <span className="block text-[10px] text-gray-500 truncate max-w-[80px] mx-auto" title={arrCity}>
                    {arrCity}
                </span>
            </div>
        </div>

        {/* Ngày giờ bay */}
        <p className='text-xs text-gray-500 flex items-center justify-center gap-2 bg-gray-50 py-1.5 rounded-md mt-4 border border-gray-100'>
          <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400" />
          <span className="font-medium">{formatDateTime(depTime)}</span>
        </p>
      </div>
      
      <div className='mt-5 pt-3 border-t border-dashed border-gray-200'>
          <div className="flex justify-between items-end">
             <div>
                 <p className="text-[10px] text-gray-400 uppercase font-semibold">Giá vé chỉ từ</p>
                 <div className='flex items-baseline gap-1'>
                    <span className='text-xl font-bold text-orange-600'>
                        {formatCurrencyVND(price)}
                    </span>
                 </div>
             </div>
             <Link to={searchLink} className='bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200'>
                <FontAwesomeIcon icon={faArrowRight} />
             </Link>
          </div>
      </div>
    </div>
  )
}

// --- Cấu hình các Tabs ---
const DEAL_TABS = [
    { 
        id: 'domestic', 
        label: 'Vé máy bay Nội địa', 
        icon: faPlaneDeparture,
        params: { flight_type: 'domestic' } 
    },
    { 
        id: 'international', 
        label: 'Vé máy bay Quốc tế', 
        icon: faPlaneArrival,
        params: { flight_type: 'international' } 
    },
    { 
        id: 'hot_deals', 
        label: 'Săn vé rẻ (Hot Deals)', 
        icon: faFire,
        // Lọc vé rẻ dưới 2 triệu
        params: { max_price: 2000000 } 
    }
]

export default function BestFlightDeals() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeTabId, setActiveTabId] = useState(DEAL_TABS[0].id)

  // Tính ngày mai
  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }, []);

  // Lấy params của tab hiện tại
  const currentTabParams = useMemo(() => {
      return DEAL_TABS.find(t => t.id === activeTabId)?.params || {}
  }, [activeTabId])

  // Query Params
  const queryParams: FlightSearchQuery = {
    departure_date: tomorrow, 
    sortBy: 'economy_price', // Sắp xếp giá rẻ nhất
    order: 'asc',
    limit: '10', 
    status: 'scheduled',
    ...currentTabParams 
  }

  // Gọi API
  const { data: flightsData, isLoading } = useQuery({
    queryKey: ['bestDealsApi', activeTabId], 
    queryFn: () => searchFlightApi.searchFlights(queryParams).then(res => res.data),
    staleTime: 1000 * 60 * 30, 
    select: (data) => data.data 
  })

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef
      const scrollAmount = 320 
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }
  }

  return (
    <div className='bg-slate-50 py-16'>
        <div className='container mx-auto px-4'>
            
        {/* Header & Tabs */}
        <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                        Ưu đãi chuyến bay tốt nhất <span className='text-orange-500'>.</span>
                    </h2>
                    <p className='text-gray-600 max-w-xl'>
                        Các chuyến bay có giá tốt nhất khởi hành trong thời gian tới. Cập nhật liên tục.
                    </p>
                </div>
                
                {/* Nút điều hướng */}
                <div className="flex gap-2">
                    <button 
                        onClick={() => scroll('left')}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-95"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-95"
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
                {DEAL_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTabId(tab.id)}
                        className={`
                            flex items-center gap-2 px-5 py-3 rounded-t-lg font-semibold text-sm transition-all relative top-[1px] border-b-2
                            ${activeTabId === tab.id 
                                ? 'text-blue-600 border-blue-600 bg-white shadow-sm' 
                                : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100'}
                        `}
                    >
                        <FontAwesomeIcon icon={tab.icon} className={activeTabId === tab.id ? 'text-blue-500' : 'text-gray-400'} />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[300px]">
            {isLoading ? (
                <div className="flex flex-col justify-center items-center h-60 gap-3 text-gray-400">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-blue-500 text-3xl" />
                    <p className="text-sm">Đang tìm kiếm ưu đãi tốt nhất...</p>
                </div>
            ) : (
                (!flightsData || flightsData.length === 0) ? (
                    <div className="flex flex-col justify-center items-center h-60 gap-3 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                        <FontAwesomeIcon icon={faTag} className="text-4xl opacity-20" />
                        <p>Chưa tìm thấy ưu đãi nào phù hợp cho danh mục này.</p>
                    </div>
                ) : (
                    <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
                        <div 
                            ref={scrollRef}
                            className='flex overflow-x-auto gap-5 pb-8 pt-2 scroll-smooth snap-x snap-mandatory hide-scrollbar' 
                            style={{ 
                                scrollbarWidth: 'none', 
                                msOverflowStyle: 'none',
                            }} 
                        >
                            {flightsData.map((flight) => (
                            <div key={flight.flight_id} className="min-w-[260px] md:min-w-[280px] snap-start flex-shrink-0">
                                <DealCard flight={flight} />
                            </div>
                            ))}
                        </div>
                    </div>
                )
            )}
        </div>
        
        {/* Footer Link */}
        <div className="text-center mt-6">
            <Link 
            to={path.searchFlight} 
            className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors group text-sm"
            >
            <span>Xem tất cả chuyến bay</span>
            <FontAwesomeIcon icon={faArrowRight} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
        </div>
        
        <style>{`
            .hide-scrollbar::-webkit-scrollbar {
                display: none;
            }
        `}</style>
    </div>
  )
}