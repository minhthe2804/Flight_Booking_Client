// src/components/MealModal/MealModal.tsx

import React, { useState, useEffect, useMemo } from 'react'
import { faClose, faPlaneDeparture, faPlaneArrival } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// --- Import Types ---
import { Flight } from '~/types/searchFlight.type'
import { MealOption } from '~/types/flightServices' // Import từ file API
import { Passenger, SelectedMeals } from '~/types/passenger' // Import Passenger
import { formatCurrencyVND } from '~/utils/utils'

// Kiểu state tạm thời
type TempMealSelections = {
    departure: { [passengerId: number]: SelectedMeals }
    return: { [passengerId: number]: SelectedMeals }
}

interface MealModalProps {
    isOpen: boolean
    onClose: () => void
    passengers: Passenger[]
    onSave: (allSelections: TempMealSelections) => void

    // Props động từ API
    departureOptions: MealOption[]
    returnOptions: MealOption[]
    departureFlight: Flight | null
    returnFlight: Flight | null
}

export const MealModal: React.FC<MealModalProps> = ({
    isOpen,
    onClose,
    passengers,
    onSave,
    departureOptions,
    returnOptions,
    departureFlight,
    returnFlight
}) => {
    // --- 1. TẤT CẢ HOOKS ĐƯỢC ĐẶT Ở ĐẦU ---
    const [activeTab, setActiveTab] = useState<'departure' | 'return'>('departure')
    const [activePassengerId, setActivePassengerId] = useState<number>(passengers[0]?.id || 0)
    const [tempSelections, setTempSelections] = useState<TempMealSelections>({ departure: {}, return: {} })

    // useEffect khởi tạo state
    useEffect(() => {
        if (isOpen) {
            const initialDep = passengers.reduce((acc, p) => ({ ...acc, [p.id]: { ...p.departureMeals } }), {})
            const initialRet = passengers.reduce((acc, p) => ({ ...acc, [p.id]: { ...p.returnMeals } }), {})
            setTempSelections({ departure: initialDep, return: initialRet })

            setActiveTab('departure')
            setActivePassengerId(passengers[0]?.id)
        }
    }, [isOpen, passengers])

    // useEffect xử lý ESC
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    // useMemo tính Map giá (ĐÃ DI CHUYỂN LÊN TRÊN)
    const priceMap = useMemo(() => {
        const map = new Map<string, number>()
        ;[...departureOptions, ...returnOptions].forEach((meal) => {
            if (meal) {
                map.set(`meal_${meal.meal_service_id}`, parseFloat(meal.price))
            }
        })
        return map
    }, [departureOptions, returnOptions])

    // useMemo tính Tổng phụ (ĐÃ DI CHUYỂN LÊN TRÊN)
    const subtotal = useMemo(() => {
        let total = 0
        // Tính tiền chiều đi
        Object.values(tempSelections.departure).forEach((passengerMeals) => {
            Object.entries(passengerMeals).forEach(([mealKey, quantity]) => {
                total += (priceMap.get(mealKey) || 0) * quantity
            })
        })
        // Tính tiền chiều về
        Object.values(tempSelections.return).forEach((passengerMeals) => {
            Object.entries(passengerMeals).forEach(([mealKey, quantity]) => {
                total += (priceMap.get(mealKey) || 0) * quantity
            })
        })
        return total
    }, [tempSelections, priceMap])
    // ------------------------------------

    // --- 2. HÀM XỬ LÝ (Handlers) ---
    const handleQuantityChange = (mealId: number, change: number) => {
        const mealIdKey = `meal_${mealId}`
        const currentSelections = tempSelections[activeTab][activePassengerId] || {}
        const currentQuantity = currentSelections[mealIdKey] || 0
        const newQuantity = Math.max(0, currentQuantity + change)

        const newPassengerMeals = { ...currentSelections }
        if (newQuantity === 0) {
            delete newPassengerMeals[mealIdKey]
        } else {
            newPassengerMeals[mealIdKey] = newQuantity
        }

        setTempSelections((prev) => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                [activePassengerId]: newPassengerMeals
            }
        }))
    }

    const handleSave = () => {
        onSave(tempSelections)
        onClose()
    }

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => onClose()
    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()

    // --- 3. LỆNH RETURN SỚM (Giữ nguyên) ---
    if (!isOpen) return null

    // --- 4. Logic hiển thị (Giữ nguyên) ---
    const currentOptions = activeTab === 'departure' ? departureOptions : returnOptions
    const currentPassengerSelections = tempSelections[activeTab]?.[activePassengerId] || {}

    // --- 5. JSX (Giữ nguyên) ---
    return (
        <div
            className='fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4'
            onClick={handleBackdropClick}
        >
            <div
                className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col'
                onClick={handleModalClick}
            >
                {/* Header */}
                <div className='flex justify-between items-center p-4 border-b border-gray-200'>
                    <h2 className='text-xl font-semibold text-gray-800'>Chọn món ăn</h2>
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
                                <FontAwesomeIcon icon={faPlaneDeparture} /> Chuyến đi
                            </button>
                            <button
                                onClick={() => setActiveTab('return')}
                                className={`whitespace-nowrap flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'return'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <FontAwesomeIcon icon={faPlaneArrival} /> Chuyến về
                            </button>
                        </nav>
                    </div>
                )}

                {/* === TABS HÀNH KHÁCH === */}
                <div className='border-b border-gray-200 px-2 overflow-x-auto'>
                    <div className='flex'>
                        {passengers.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setActivePassengerId(p.id)}
                                className={`py-3 px-4 font-semibold text-sm whitespace-nowrap ${activePassengerId === p.id ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                {p.fullName}
                            </button>
                        ))}
                    </div>
                </div>

                {/* === DANH SÁCH MÓN ĂN === */}
                <div className='overflow-y-auto flex-grow p-6'>
                    <p className='mb-4 text-sm text-gray-600'>
                        Đang chọn món cho {''}
                        <span className='font-semibold'>
                            {passengers.find((p) => p.id === activePassengerId)?.fullName}
                        </span>
                        {''} cho {''}
                        <span className='font-semibold'>{activeTab === 'departure' ? 'Chuyến đi' : 'Chuyến về'}</span>.
                    </p>

                    {currentOptions.length === 0 && (
                        <p className='text-gray-500'>Không có suất ăn nào cho chuyến bay này.</p>
                    )}

                    <div className='space-y-4'>
                        {currentOptions.map((meal) => {
                            const mealIdKey = `meal_${meal.meal_service_id}`
                            const quantity = currentPassengerSelections[mealIdKey] || 0
                            return (
                                <div
                                    key={meal.meal_service_id}
                                    className='flex justify-between items-center border border-gray-200 rounded-md p-4 shadow-sm'
                                >
                                    <div>
                                        <p className='font-semibold text-gray-800'>{meal.meal_name}</p>
                                        <p className='text-sm text-gray-500'>{meal.meal_description}</p>
                                    </div>
                                    <div className='flex items-center space-x-4'>
                                        <p className='font-bold text-blue-600 w-24 text-right'>
                                            {formatCurrencyVND(parseFloat(meal.price))}
                                        </p>
                                        <div className='flex items-center space-x-2'>
                                            <button
                                                onClick={() => handleQuantityChange(meal.meal_service_id, -1)}
                                                disabled={quantity === 0}
                                                className='w-8 h-8 border rounded text-lg font-bold text-gray-800 flex justify-center items-center disabled:opacity-50 hover:bg-gray-100'
                                            >
                                                <span className='mt-[-4px]'> -</span>
                                            </button>
                                            <span className='w-8 text-center font-semibold'>{quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(meal.meal_service_id, 1)}
                                                className='w-8 h-8 border rounded text-lg font-bold text-gray-800 flex justify-center items-center hover:bg-gray-100'
                                            >
                                                <span className='mt-[-4px]'> +</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200'>
                    <div>
                        <span className='text-gray-600'>Tổng phụ (Tất cả)</span>
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
