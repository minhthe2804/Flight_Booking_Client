// src/components/BaggageModal/BaggageModal.tsx

import React, { useState, useEffect } from 'react'
import { faClose, faPlaneDeparture, faPlaneArrival } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// --- Import Types ---
import { Flight } from '~/types/searchFlight.type'
import { BaggageOption } from '~/types/flightServices' // Import từ file API
import { Passenger } from '~/types/passenger' // Import Passenger mới
import { formatCurrencyVND } from '~/utils/utils'

// --- Kiểu dữ liệu nội bộ ---
type TempSelections = {
    departure: { [passengerId: number]: string }
    return: { [passengerId: number]: string }
}

interface BaggageModalProps {
    isOpen: boolean
    onClose: () => void
    passengers: Passenger[]
    onSave: (allSelections: TempSelections) => void

 
    departureOptions: BaggageOption[]
    returnOptions: BaggageOption[]
    departureFlight: Flight | null
    returnFlight: Flight | null
}

// --- Component ---
export const BaggageModal: React.FC<BaggageModalProps> = ({
    isOpen,
    onClose,
    passengers,
    onSave,
    departureOptions,
    returnOptions,
    departureFlight,
    returnFlight
}) => {
    const [activeTab, setActiveTab] = useState<'departure' | 'return'>('departure')
    const [tempSelections, setTempSelections] = useState<TempSelections>({ departure: {}, return: {} })

    // --- SỬA: Hàm tìm key mặc định (gói miễn phí từ API) ---
    // Tìm gói đầu tiên có giá 0.00
    const getDefaultKey = (options: BaggageOption[]): string => {
        if (!options || options.length === 0) return '' // Trả về rỗng nếu API chưa tải
        const freeOption = options.find((opt) => parseFloat(opt.price) === 0.0)
        if (freeOption) {
            return `baggage_${freeOption.baggage_service_id}`
        }
        // Nếu không có gói free, trả về ID của gói đầu tiên
        return `baggage_${options[0].baggage_service_id}`
    }

    // Khởi tạo state tạm thời
    useEffect(() => {
        if (isOpen) {
            const defaultDepKey = getDefaultKey(departureOptions)
            const initialDep = passengers.reduce(
                (acc, p) => {
                    // Nếu passenger chưa chọn (departureBaggageId là 'baggage_0') thì dùng defaultKey
                    acc[p.id] = p.departureBaggageId === 'baggage_0' ? defaultDepKey : p.departureBaggageId
                    return acc
                },
                {} as { [pId: number]: string }
            )

            const defaultRetKey = getDefaultKey(returnOptions)
            const initialRet = passengers.reduce(
                (acc, p) => {
                    acc[p.id] = p.returnBaggageId === 'baggage_0' ? defaultRetKey : p.returnBaggageId
                    return acc
                },
                {} as { [pId: number]: string }
            )

            setTempSelections({ departure: initialDep, return: initialRet })
            setActiveTab('departure')
        }
    }, [isOpen, passengers, departureOptions, returnOptions]) // Thêm dependencies

    // Hàm cập nhật lựa chọn (Giữ nguyên)
    const handleSelectionChange = (passengerId: number, baggageId: number) => {
        const selectionKey = `baggage_${baggageId}`
        setTempSelections((prev) => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                [passengerId]: selectionKey
            }
        }))
    }

    const handleSave = () => {
        onSave(tempSelections)
        onClose()
    }

    if (!isOpen) return null

    const isDeparture = activeTab === 'departure'
    const currentFlight = isDeparture ? departureFlight : returnFlight

    // --- SỬA: XÓA freeBaggageKg và freeCarryOnKg ---

    // --- SỬA: allOptions giờ chỉ là dữ liệu từ API ---
    const allOptions = isDeparture ? departureOptions : returnOptions

    // Tìm key mặc định cho tab hiện tại (dùng để fallback)
    const defaultBaggageKey = getDefaultKey(allOptions)

    // Tính tổng phụ (cho tab hiện tại)
    const subtotal = Object.values(tempSelections[activeTab] || {}).reduce((total, baggageKey) => {
        const option = allOptions.find((opt) => `baggage_${opt.baggage_service_id}` === baggageKey)
        // SỬA: Nhân giá với 1000 (Giả sử 50.00 = 50,000 VND)
        return total + (option ? parseFloat(option.price) : 0)
    }, 0)

    return (
        <div className='fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 overflow-y-auto'>
            <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-down'>
                {/* Header */}
                <div className='flex justify-between items-center p-4 border-b border-gray-200'>
                    <h2 className='text-xl font-semibold text-gray-800'>Hành lý</h2>
                    <button onClick={onClose} className='text-gray-500 hover:text-gray-800'>
                        <FontAwesomeIcon icon={faClose} className='text-[28px]' />
                    </button>
                </div>

                {/* === TABS (Chuyến đi / Chuyến về) === */}
                {returnFlight && (
                    <div className='border-b border-gray-200 px-4'>
                        <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
                            <button
                                onClick={() => setActiveTab('departure')}
                                className={`whitespace-nowrap flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'departure'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <FontAwesomeIcon icon={faPlaneDeparture} />
                                Chuyến đi ({departureFlight?.departure.airport.code} →{' '}
                                {departureFlight?.arrival.airport.code})
                            </button>
                            <button
                                onClick={() => setActiveTab('return')}
                                className={`whitespace-nowrap flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'return'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <FontAwesomeIcon icon={faPlaneArrival} />
                                Chuyến về ({returnFlight.departure.airport.code} → {returnFlight.arrival.airport.code})
                            </button>
                        </nav>
                    </div>
                )}

                {/* --- NỘI DUNG LẶP --- */}
                <div className='overflow-y-auto flex-grow p-6'>
                    {passengers.map((passenger, index) => {
                        // Lấy lựa chọn theo tab
                        const selectedBaggageKey = tempSelections[activeTab]?.[passenger.id] || defaultBaggageKey

                        return (
                            <div
                                key={passenger.id}
                                className='first:mt-0 mt-8 pt-8 border-t border-gray-200 first:border-t-0 first:pt-0'
                            >
                                <div className='flex justify-between items-start mb-6'>
                                    <div>
                                        <p className='text-gray-600 text-sm'>{currentFlight?.airline.name}</p>
                                        <p className='font-semibold text-lg text-gray-800'>Hành khách {index + 1}</p>
                                        <p className='text-gray-800'>
                                            {passenger.fullName} ({passenger.type})
                                        </p>
                                    </div>
                                    <span className='bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full'>
                                        {currentFlight?.travel_class?.name || 'Economy'}
                                    </span>
                                </div>

                                {/* --- SỬA: ĐÃ XÓA KHỐI HÀNH LÝ MIỄN PHÍ CỨNG --- */}

                                {/* Lựa chọn mua thêm (Lặp từ API) */}
                                <div className='space-y-3'>
                                    {allOptions.length > 0 ? (
                                        allOptions.map((option) => (
                                            <label
                                                key={option.baggage_service_id}
                                                className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center transition-all 
                                                ${selectedBaggageKey === `baggage_${option.baggage_service_id}` ? 'border-blue-500 ring-2 ring-blue-200 bg-white' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
                                            >
                                                <div>
                                                    <p className='font-semibold text-gray-800'>{option.description}</p>
                                                    <p className='text-sm text-gray-500'>
                                                        {Number(option.weight_kg) > 0 && `Nặng: ${option.weight_kg} kg`}
                                                    </p>
                                                </div>
                                                <div className='flex items-center space-x-4'>
                                                    <p
                                                        className={`font-bold text-lg ${parseFloat(option.price) > 0 ? 'text-orange-600' : 'text-gray-800'}`}
                                                    >
                                                        {/* Nhân 1000 */}
                                                        {parseFloat(option.price) > 0
                                                            ? `+${formatCurrencyVND(parseFloat(option.price))}`
                                                            : 'Miễn phí'}
                                                    </p>
                                                    <input
                                                        type='radio'
                                                        name={`baggage-${activeTab}-${passenger.id}`} // Tên radio phải duy nhất
                                                        checked={selectedBaggageKey === `baggage_${option.baggage_service_id}`}
                                                        onChange={() =>
                                                            handleSelectionChange(passenger.id, option.baggage_service_id)
                                                        }
                                                        className='form-radio h-5 w-5 text-blue-600 focus:ring-blue-500'
                                                    />
                                                </div>
                                            </label>
                                        ))
                                    ) : (
                                        <p className='text-gray-500 text-sm'>
                                            Không có tùy chọn hành lý cho chuyến bay này.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Footer */}
                <div className='flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200'>
                    <div>
                        <span className='text-gray-600'>Tổng phụ (Cho {isDeparture ? 'Chuyến đi' : 'Chuyến về'})</span>
                        <p className='font-bold text-2xl text-blue-600'>{formatCurrencyVND(subtotal)}</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className='bg-blue-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-blue-700'
                    >
                        Hoàn tất
                    </button>
                </div>
            </div>
        </div>
    )
}
