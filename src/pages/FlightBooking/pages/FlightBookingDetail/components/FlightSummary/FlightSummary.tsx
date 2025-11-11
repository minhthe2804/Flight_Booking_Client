import { useMemo } from 'react'
import { Flight } from '~/types/searchFlight.type'
import { PackageConfig } from '~/pages/SearchFlight/components/FlightServiceModal/FlightServiceModal'
import { Passenger } from '~/types/passenger'
import { BaggageOption, MealOption } from '~/types/flightServices'
import { formatCurrencyVND } from '~/utils/utils'
import { FlightInfoCard } from './components/FlightInfoCard/FlightInfoCard'

type PriceMap = {
    [key: string]: number
}

interface FlightSummaryProps {
    departureFlight: Flight | null
    returnFlight: Flight | null
    selectedPackage: PackageConfig
    passengers: Passenger[]
    passengerCounts: {
        adults: number
        children: number
        infants: number
        total: number
    }
    baggageOptions: BaggageOption[]
    mealOptions: MealOption[]
    returnBaggageOptions: BaggageOption[]
    returnMealOptions: MealOption[]
    isLoadingServices: boolean
}

// --- SỬA: Hằng số giá vé EM BÉ ---
const INFANT_TICKET_PRICE = 400000 // 400,000 VND

export default function FlightSummary({
    departureFlight,
    returnFlight,
    selectedPackage,
    passengers,
    passengerCounts,
    baggageOptions,
    mealOptions,
    returnBaggageOptions,
    returnMealOptions,
    isLoadingServices
}: FlightSummaryProps) {
    // --- Map Tra Cứu Giá (Giữ nguyên) ---
    const depBaggageMap = useMemo(() => {
        return baggageOptions.reduce(
            (acc: PriceMap, opt) => {
                acc[`baggage_${opt.baggage_service_id}`] = parseFloat(opt.price)
                return acc
            },
            { baggage_0: 0 } as PriceMap
        )
    }, [baggageOptions])

    const retBaggageMap = useMemo(() => {
        return returnBaggageOptions.reduce(
            (acc: PriceMap, opt) => {
                acc[`baggage_${opt.baggage_service_id}`] = parseFloat(opt.price)
                return acc
            },
            { baggage_0: 0 } as PriceMap
        )
    }, [returnBaggageOptions])

    const depMealMap = useMemo(() => {
        return mealOptions.reduce((acc: PriceMap, opt) => {
            acc[`meal_${opt.meal_service_id}`] = parseFloat(opt.price)
            return acc
        }, {} as PriceMap)
    }, [mealOptions])

    const retMealMap = useMemo(() => {
        return returnMealOptions.reduce((acc: PriceMap, opt) => {
            acc[`meal_${opt.meal_service_id}`] = parseFloat(opt.price)
            return acc
        }, {} as PriceMap)
    }, [returnMealOptions])

    const {
        adultPrice,
        childPrice,
        infantPrice,
        depBaggagePrice,
        retBaggagePrice,
        depMealPrice,
        retMealPrice,
        totalPrice
    } = useMemo(() => {
        if (!selectedPackage)
            return {
                basePrice: 0,
                adultPrice: 0,
                childPrice: 0,
                infantPrice: 0,
                depBaggagePrice: 0,
                retBaggagePrice: 0,
                depMealPrice: 0,
                retMealPrice: 0,
                totalPrice: 0
            }

            console.log(selectedPackage)
        // 1. Tính giá vé
        // Giá người lớn = SL Người lớn * Giá Gói
        const adultPrice = passengerCounts.adults * (selectedPackage.pricePerPassenger as number)
        // Giá trẻ em = SL Trẻ em * Giá Gói
        const childPrice = passengerCounts.children * (selectedPackage.pricePerPassenger as number)
        // Giá em bé = SL Em bé * Giá cố định
        const infantPrice = passengerCounts.infants * INFANT_TICKET_PRICE

        const basePrice = returnFlight ? (adultPrice + childPrice + infantPrice) * 2 : adultPrice + childPrice + infantPrice // Tổng giá vé cơ sở

        // 2. Tính giá dịch vụ (Nhân 1000)
        let depBaggagePrice = 0
        passengers.forEach((p) => {
            depBaggagePrice += depBaggageMap[p.departureBaggageId] || 0
        })
        let retBaggagePrice = 0
        passengers.forEach((p) => {
            retBaggagePrice += retBaggageMap[p.returnBaggageId] || 0
        })
        let depMealPrice = 0
        passengers.forEach((p) => {
            Object.keys(p.departureMeals).forEach((key) => {
                depMealPrice += (depMealMap[key] || 0) * (p.departureMeals[key] || 0)
            })
        })
        let retMealPrice = 0
        passengers.forEach((p) => {
            Object.keys(p.returnMeals).forEach((key) => {
                retMealPrice += (retMealMap[key] || 0) * (p.returnMeals[key] || 0)
            })
        })

        const totalPrice = basePrice + depBaggagePrice + retBaggagePrice + depMealPrice + retMealPrice

        return {
            basePrice,
            adultPrice,
            childPrice,
            infantPrice,
            depBaggagePrice,
            retBaggagePrice,
            depMealPrice,
            retMealPrice,
            totalPrice
        }
    }, [selectedPackage, passengers, passengerCounts, depBaggageMap, retBaggageMap, depMealMap, retMealMap])

    // Xử lý loading
    if (!departureFlight || !selectedPackage) {
        return (
            <div className='col-span-4 sticky top-5'>
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
                    <div className='h-24 bg-gray-100 rounded animate-pulse'></div>
                    <hr className='my-4' />
                    <div className='h-16 bg-gray-100 rounded animate-pulse'></div>
                </div>
            </div>
        )
    }

    return (
        <div className='col-span-4 sticky top-5'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
                {/* === Phần Chuyến bay === */}
                <div className='p-4 space-y-4'>
                    <FlightInfoCard flight={departureFlight} title='Chuyến đi' />
                    {returnFlight && (
                        <>
                            <hr className='my-4 border-t border-gray-200' />
                            <FlightInfoCard flight={returnFlight} title='Chuyến về' />
                        </>
                    )}
                </div>

                <hr className='border-t border-gray-200' />

                {/* === Phần Giá (SỬA LẠI HIỂN THỊ) === */}
                <div className='p-4'>
                    <h3 className='text-md font-semibold text-gray-800 mb-3'>Tóm tắt giá</h3>

                    {isLoadingServices && (
                        <div className='space-y-2 animate-pulse'>
                            <div className='h-4 bg-gray-200 rounded w-full'></div>
                            <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                        </div>
                    )}

                    {!isLoadingServices && (
                        <div className='space-y-2 text-sm text-gray-600'>
                            {/* Giá vé người lớn */}
                            <div className='flex justify-between'>
                                <span>
                                    Vé {selectedPackage.package_name} ({passengerCounts.adults} x Người lớn)
                                </span>
                                <span className='font-medium'>{formatCurrencyVND(adultPrice)}</span>
                            </div>

                            {/* Giá vé trẻ em */}
                            {passengerCounts.children > 0 && (
                                <div className='flex justify-between'>
                                    <span>
                                        Vé {selectedPackage.package_name} ({passengerCounts.children} x Trẻ em)
                                    </span>
                                    <span className='font-medium'>{formatCurrencyVND(childPrice)}</span>
                                </div>
                            )}

                            {/* Giá vé em bé */}
                            {passengerCounts.infants > 0 && (
                                <div className='flex justify-between'>
                                    <span>Vé Em bé ({passengerCounts.infants} x Em bé)</span>
                                    <span className='font-medium'>{formatCurrencyVND(infantPrice)}</span>
                                </div>
                            )}

                            {/* Dịch vụ */}
                            {depBaggagePrice > 0 && (
                                <div className='flex justify-between'>
                                    <span>Hành lý (Chuyến đi)</span>
                                    <span className='font-medium'>+{formatCurrencyVND(depBaggagePrice)}</span>
                                </div>
                            )}
                            {retBaggagePrice > 0 && (
                                <div className='flex justify-between'>
                                    <span>Hành lý (Chuyến về)</span>
                                    <span className='font-medium'>+{formatCurrencyVND(retBaggagePrice)}</span>
                                </div>
                            )}
                            {depMealPrice > 0 && (
                                <div className='flex justify-between'>
                                    <span>Suất ăn (Chuyến đi)</span>
                                    <span className='font-medium'>+{formatCurrencyVND(depMealPrice)}</span>
                                </div>
                            )}
                            {retMealPrice > 0 && (
                                <div className='flex justify-between'>
                                    <span>Suất ăn (Chuyến về)</span>
                                    <span className='font-medium'>+{formatCurrencyVND(retMealPrice)}</span>
                                </div>
                            )}

                            <hr className='pt-2 my-2 border-t border-dashed' />

                            {/* Tổng cộng */}
                            <div className='flex justify-between items-center text-lg font-bold text-gray-900'>
                                <span>Tổng cộng</span>
                                <span className='text-orange-600'>{formatCurrencyVND(totalPrice)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
