import { faArrowsRotate, faFilter, faPlaneUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { airplane, planeup } from '~/assets/images/image'
import Button from '~/components/Button'
import { formatCurrencyVND } from '~/utils/utils'
import { FlightServiceModal } from './components/FlightServiceModal'

interface FilterState {
    airlines: string[]
    departureTime: string
    arrivalTime: string
    priceRange: [number, number]
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
    const [filters, setFilters] = useState<FilterState>({
        airlines: [],
        departureTime: '',
        arrivalTime: '',
        priceRange: [0, 3000000]
    })

    const [isOpen, setIsOpen] = useState<OpenState>({
        airlines: true,
        fightTime: true,
        price: true
    })

    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    const airlines: string[] = ['Bamboo Airways', 'VietJet Air', 'Vietnam Airlines', 'VietTravel Airlines']

    const timeSlots: TimeSlot[] = [
        { label: 'Đêm đến Sáng', range: '00:00 - 06:00' },
        { label: 'Sáng đến Trưa', range: '06:00 - 12:00' },
        { label: 'Trưa đến Tối', range: '12:00 - 18:00' },
        { label: 'Tối đến Đêm', range: '18:00 - 23:59' }
    ]

    const handleAirlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target
        setFilters((prev) => ({
            ...prev,
            airlines: checked ? [...prev.airlines, value] : prev.airlines.filter((airline) => airline !== value)
        }))
    }

    const handleTimeChange = (type: 'departureTime' | 'arrivalTime', value: string) => {
        setFilters((prev) => ({
            ...prev,
            [type]: value
        }))
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10)
        setFilters((prev) => ({
            ...prev,
            priceRange: [prev.priceRange[0], value]
        }))
    }

    const toggleSection = (section: keyof OpenState) => {
        setIsOpen((prev) => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    return (
        <div>
            <div className='max-w-[1278px] mx-auto'>
                <div className='grid grid-cols-12 gap-5 mt-5'>
                    <div className='col-span-4'>
                        <div className='w-full rounded-md bg-slate-100 border border-[#cdcdcd]'>
                            <div className='w-full rounded-t-md px-4 py-2 flex items-center gap-2'>
                                <img src={planeup} className='w-[18px] h-[18px] mt-[1px]' />
                                <p className='text-base font-medium'>Chuyến bay của bạn</p>
                            </div>
                            <hr className='w-full h-[1px] bg-[#cdcdcd]' />
                            <div className='bg-white px-4 py-2 flex justify-between rounded-b-md'>
                                <div className='flex gap-3'>
                                    <div className='bg-[#007bff] rounded-full w-6 h-6 text-white flex items-center justify-center'>
                                        1
                                    </div>
                                    <div className='text-base font-medium mt-[-5px]'>
                                        <div className='flex items-center gap-1'>
                                            <p>HAN</p>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                stroke-width='1.5'
                                                stroke='currentColor'
                                                className='size-4'
                                            >
                                                <path
                                                    stroke-linecap='round'
                                                    stroke-linejoin='round'
                                                    d='M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3'
                                                />
                                            </svg>
                                            <p>SGN</p>
                                        </div>
                                        <p className='text-sm font-normal text-gray-600'>T6,24-01-2025</p>
                                    </div>
                                </div>
                                <div className='rounded-[8px] w-[80px] h-[20px] px-2 py-1 text-xs font-medium bg-slate-600 text-white flex items-center justify-center mt-1'>
                                    <p>Chưa chọn</p>
                                </div>
                            </div>
                        </div>

                        <div className='w-full rounded-md bg-slate-100 border border-[#cdcdcd] mt-5'>
                            <div className='w-full rounded-t-md px-4 py-2 flex items-center justify-between gap-2'>
                                <div className='flex items-center gap-2'>
                                    <FontAwesomeIcon icon={faFilter} className='w-[18px] h-[18px] mt-[1px]' />
                                    <h2 className='text-base font-semibold'>Bộ lọc</h2>
                                </div>
                                <button className='text-base text-[#007bff] font-semibold flex items-center gap-2'>
                                    <FontAwesomeIcon icon={faArrowsRotate} className='w-[14px] h-[14px] mt-[1px]' />
                                    Đặt lại
                                </button>
                            </div>
                            <hr className='w-full h-[1px] bg-[#cdcdcd]' />
                            <div className='bg-white rounded-b-md px-4 py-2'>
                                {/* Hãng hàng không */}
                                <div className=''>
                                    <button
                                        onClick={() => toggleSection('airlines')}
                                        className='w-full text-left text-lg font-semibold text-gray-700 mb-2 flex justify-between items-center'
                                    >
                                        Hãng hàng không
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke-width='1.5'
                                            stroke='currentColor'
                                            className={`size-6 transform transition-transform ${isOpen.airlines ? 'rotate-180' : ''}`}
                                        >
                                            <path
                                                stroke-linecap='round'
                                                stroke-linejoin='round'
                                                d='m19.5 8.25-7.5 7.5-7.5-7.5'
                                            />
                                        </svg>
                                    </button>
                                    {isOpen.airlines && (
                                        <div>
                                            {airlines.map((airline) => (
                                                <div key={airline} className='flex items-center mb-2'>
                                                    <input
                                                        type='checkbox'
                                                        id={airline}
                                                        value={airline}
                                                        onChange={handleAirlineChange}
                                                        className='mr-2'
                                                    />
                                                    <label htmlFor={airline} className='text-gray-600'>
                                                        {airline}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <hr className='w-full h-[1px] bg-[#cdcdcd]' />
                                {/* Thời gian bay - Đi */}
                                <div className='mt-3'>
                                    <button
                                        onClick={() => toggleSection('fightTime')}
                                        className='w-full text-left text-lg font-semibold text-gray-700 mb-2 flex justify-between items-center'
                                    >
                                        Thời gian bay
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke-width='1.5'
                                            stroke='currentColor'
                                            className={`size-6 transform transition-transform ${isOpen.fightTime ? 'rotate-180' : ''}`}
                                        >
                                            <path
                                                stroke-linecap='round'
                                                stroke-linejoin='round'
                                                d='m19.5 8.25-7.5 7.5-7.5-7.5'
                                            />
                                        </svg>
                                    </button>
                                    {isOpen.fightTime && (
                                        <>
                                            <div className=''>
                                                <h2 className='mt-2 text-lg text-gray-600 font-semibold'>
                                                    Giờ cất cánh
                                                </h2>
                                                <div className='flex flex-wrap gap-4 mt-3'>
                                                    {timeSlots.map((slot) => (
                                                        <button
                                                            key={slot.range}
                                                            onClick={() =>
                                                                handleTimeChange('departureTime', slot.range)
                                                            }
                                                            className={`text-sm w-[180px] text-center p-2 rounded-md border ${
                                                                filters.departureTime === slot.range
                                                                    ? 'bg-blue-100 border-blue-500'
                                                                    : 'bg-gray-50 border-gray-300'
                                                            }`}
                                                        >
                                                            <p className='text-gray-500 font-medium'> {slot.label}</p>
                                                            <p className='text-[#007bff] text-base font-bold'>
                                                                ({slot.range})
                                                            </p>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <hr className='w-full h-[1px] bg-[#cdcdcd] mt-6 opacity-50' />
                                            <div className='mt-3'>
                                                <h2 className='mt-2 text-lg text-gray-600 font-semibold'>
                                                    Giờ hạ cánh
                                                </h2>
                                                <div className='flex flex-wrap gap-4 mt-3'>
                                                    {timeSlots.map((slot) => (
                                                        <button
                                                            key={slot.range}
                                                            onClick={() => handleTimeChange('arrivalTime', slot.range)}
                                                            className={`text-sm w-[180px] text-center p-2 rounded-md border ${
                                                                filters.arrivalTime === slot.range
                                                                    ? 'bg-blue-100 border-blue-500'
                                                                    : 'bg-gray-50 border-gray-300'
                                                            }`}
                                                        >
                                                            <p className='text-gray-500 font-medium'> {slot.label}</p>
                                                            <p className='text-[#007bff] text-base font-bold'>
                                                                ({slot.range})
                                                            </p>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <hr className='w-full h-[1px] bg-[#cdcdcd] mt-3' />
                                {/* Giá vé */}
                                <div className='mt-3'>
                                    <button
                                        onClick={() => toggleSection('price')}
                                        className='w-full text-left text-lg font-semibold text-gray-700 mb-2 flex justify-between items-center'
                                    >
                                        Giá/hành khách
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke-width='1.5'
                                            stroke='currentColor'
                                            className={`size-6 transform transition-transform ${isOpen.price ? 'rotate-180' : ''}`}
                                        >
                                            <path
                                                stroke-linecap='round'
                                                stroke-linejoin='round'
                                                d='m19.5 8.25-7.5 7.5-7.5-7.5'
                                            />
                                        </svg>
                                    </button>
                                    {isOpen.price && (
                                        <div>
                                            <input
                                                type='range'
                                                min='0'
                                                max='3000000'
                                                value={filters.priceRange[1]}
                                                onChange={handlePriceChange}
                                                className='w-full'
                                            />
                                            <p className='text-gray-600 text-sm mt-2'>
                                                {filters.priceRange[0].toLocaleString()}₫ -{' '}
                                                {filters.priceRange[1].toLocaleString()}₫
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-8'>
                        <div className='w-full rounded-md px-5 py-[22px] bg-gradient-to-r from-[#1488cc] to-[#2b32b2] relative'>
                            <div className='flex flex-col gap-1'>
                                <div className='flex items-center gap-1 text-white font-semibold text-lg'>
                                    <p>HAN</p>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke-width='1.5'
                                        stroke='currentColor'
                                        className='size-5 mt-1'
                                    >
                                        <path
                                            stroke-linecap='round'
                                            stroke-linejoin='round'
                                            d='M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3'
                                        />
                                    </svg>
                                    <p>SGN</p>
                                </div>
                                <div className='flex gap-1 items-center text-white text-sm'>
                                    <p>24-01-2025</p>
                                    <hr className='w-3 h-[1px] bg-white rotate-90' />
                                    <p>3 hành khách</p>
                                    <hr className='w-3 h-[1px] bg-white rotate-90' />
                                    <p>Phổ thông</p>
                                    <hr className='w-3 h-[1px] bg-white rotate-90' />
                                </div>
                                <img src={airplane} alt='' className='absolute w-32 top-[-18px] right-20 opacity-70' />
                            </div>
                        </div>
                        <div className='mt-[22px] py-6 px-4 w-full rounded-md border border-[#cdcdcd] bg-white shadow-md cursor-pointer hover:border-[#007bff] transtion duration-200 ease-in'>
                            <div className='flex items-center justify-between'>
                                <div className='flex flex-col gap-[2px] text-base font-medium'>
                                    <p>VietJet Air</p>
                                    <p className='text-sm text-gray-600'>VJ000001</p>
                                </div>
                                <div className='flex gap-10'>
                                    <div className='flex items-center gap-5'>
                                        <div className='flex flex-col justify-center items-center gap-[2px] text-lg font-medium'>
                                            <p>04:40</p>
                                            <p className='text-sm text-gray-600'>Hà Nội</p>
                                        </div>
                                        <div className='flex flex-col justify-center items-center text-base font-medium gap-[8px]'>
                                            <p>1h 0m</p>
                                            <div className='flex items-center'>
                                                <div className='w-[10px] h-[10px] rounded-full bg-[#007bff] mt-[1px]'></div>
                                                <hr className='w-5 h-[2px] bg-slate-400' />
                                                <FontAwesomeIcon icon={faPlaneUp} className='text-xs text-[#007bff]' />
                                                <hr className='w-5 h-[2px] bg-slate-400' />
                                                <div className='w-[10px] h-[10px] rounded-full bg-[#007bff] mt-[1px]'></div>
                                            </div>
                                            <p className='text-sm text-gray-600'>Bay thẳng</p>
                                        </div>
                                        <div className='flex flex-col justify-center items-center gap-[2px] text-lg font-medium'>
                                            <p>05:40</p>
                                            <p className='text-sm text-gray-600'>TP. Hồ Chí Minh</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-4 justify-center items-center'>
                                        <p className='text-base text-[#007bff] font-bold'>
                                            {formatCurrencyVND(2500000)}
                                        </p>
                                        <Button
                                            className='text-base bg-[#007bff] rounded-md w-[80px] h-[20px] p-4 flex items-center justify-center font-semibold hover:bg-[#479af3] transition duration-200 ease-in'
                                            onClick={() => openModal()}
                                        >
                                            Chọn
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-6 py-6 px-4 w-full rounded-md border border-[#cdcdcd] bg-white shadow-md cursor-pointer hover:border-[#007bff] transtion duration-200 ease-in'>
                            <div className='flex items-center justify-between'>
                                <div className='flex flex-col gap-[2px] text-base font-medium'>
                                    <p>Bamboo Airways</p>
                                    <p className='text-sm text-gray-600'>BA000001</p>
                                </div>
                                <div className='flex gap-10'>
                                    <div className='flex items-center gap-5'>
                                        <div className='flex flex-col justify-center items-center gap-[2px] text-lg font-medium'>
                                            <p>04:40</p>
                                            <p className='text-sm text-gray-600'>Hà Nội</p>
                                        </div>
                                        <div className='flex flex-col justify-center items-center text-base font-medium gap-[8px]'>
                                            <p>1h 0m</p>
                                            <div className='flex items-center'>
                                                <div className='w-[10px] h-[10px] rounded-full bg-[#007bff] mt-[1px]'></div>
                                                <hr className='w-5 h-[2px] bg-slate-400' />
                                                <FontAwesomeIcon icon={faPlaneUp} className='text-xs text-[#007bff]' />
                                                <hr className='w-5 h-[2px] bg-slate-400' />
                                                <div className='w-[10px] h-[10px] rounded-full bg-[#007bff] mt-[1px]'></div>
                                            </div>
                                            <p className='text-sm text-gray-600'>Bay thẳng</p>
                                        </div>
                                        <div className='flex flex-col justify-center items-center gap-[2px] text-lg font-medium'>
                                            <p>05:40</p>
                                            <p className='text-sm text-gray-600'>TP. Hồ Chí Minh</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-4 justify-center items-center'>
                                        <p className='text-base text-[#007bff] font-bold'>
                                            {formatCurrencyVND(3500000)}
                                        </p>
                                        <Button className='text-base bg-[#007bff] rounded-md w-[80px] h-[20px] p-4 flex items-center justify-center font-semibold hover:bg-[#479af3] transition duration-200 ease-in'>
                                            Chọn
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-6 py-6 px-4 w-full rounded-md border border-[#cdcdcd] bg-white shadow-md cursor-pointer hover:border-[#007bff] transtion duration-200 ease-in'>
                            <div className='flex items-center justify-between'>
                                <div className='flex flex-col gap-[2px] text-base font-medium'>
                                    <p>VietNam Airlines</p>
                                    <p className='text-sm text-gray-600'>VA000001</p>
                                </div>
                                <div className='flex gap-10'>
                                    <div className='flex items-center gap-5'>
                                        <div className='flex flex-col justify-center items-center gap-[2px] text-lg font-medium'>
                                            <p>04:40</p>
                                            <p className='text-sm text-gray-600'>Hà Nội</p>
                                        </div>
                                        <div className='flex flex-col justify-center items-center text-base font-medium gap-[8px]'>
                                            <p>1h 0m</p>
                                            <div className='flex items-center'>
                                                <div className='w-[10px] h-[10px] rounded-full bg-[#007bff] mt-[1px]'></div>
                                                <hr className='w-5 h-[2px] bg-slate-400' />
                                                <FontAwesomeIcon icon={faPlaneUp} className='text-xs text-[#007bff]' />
                                                <hr className='w-5 h-[2px] bg-slate-400' />
                                                <div className='w-[10px] h-[10px] rounded-full bg-[#007bff] mt-[1px]'></div>
                                            </div>
                                            <p className='text-sm text-gray-600'>Bay thẳng</p>
                                        </div>
                                        <div className='flex flex-col justify-center items-center gap-[2px] text-lg font-medium'>
                                            <p>05:40</p>
                                            <p className='text-sm text-gray-600'>TP. Hồ Chí Minh</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-4 justify-center items-center'>
                                        <p className='text-base text-[#007bff] font-bold'>
                                            {formatCurrencyVND(2000000)}
                                        </p>
                                        <Button className='text-base bg-[#007bff] rounded-md w-[80px] h-[20px] p-4 flex items-center justify-center font-semibold hover:bg-[#479af3] transition duration-200 ease-in'>
                                            Chọn
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FlightServiceModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    )
}
