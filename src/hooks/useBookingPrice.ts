// src/hooks/useBookingPrice.ts

import { useMemo } from 'react'
// Đảm bảo import đúng các kiểu dữ liệu
import { PackageConfig } from '~/pages/SearchFlight/components/FlightServiceModal/FlightServiceModal'
import { Passenger } from '~/types/passenger'
import { BaggageOption, MealOption } from '~/types/flightServices'

// --- Hằng số giá (Bạn có thể chuyển ra file constants) ---
const CHILD_TICKET_PRICE = 400000 // 400,000 VND
const INFANT_TICKET_PRICE = 0 // Giả sử em bé 0đ

// --- Định nghĩa Kiểu cho Map Tra Cứu Giá ---
type PriceMap = {
    [key: string]: number
}

// --- Props mà Hook này cần ---
interface UseBookingPriceProps {
    selectedPackage: PackageConfig | null
    passengers: Passenger[]
    passengerCounts: {
        adults: number
        children: number
        infants: number
    } | null
    baggageOptions: BaggageOption[]
    mealOptions: MealOption[]
    returnBaggageOptions: BaggageOption[]
    returnMealOptions: MealOption[]
    returnFlight: any // Chỉ cần biết có tồn tại hay không
}

/**
 * Hook tùy chỉnh để tính toán toàn bộ chi tiết giá vé
 */
export const useBookingPrice = ({
    selectedPackage,
    passengers,
    passengerCounts,
    baggageOptions,
    mealOptions,
    returnBaggageOptions,
    returnMealOptions,
    returnFlight
}: UseBookingPriceProps) => {
    // --- Map Tra Cứu Giá ---
    const depBaggageMap = useMemo(() => {
        return baggageOptions.reduce(
            (acc: PriceMap, opt) => {
                acc[`baggage_${opt.baggage_id}`] = parseFloat(opt.price)
                return acc
            },
            { baggage_0: 0 } as PriceMap
        )
    }, [baggageOptions])

    const retBaggageMap = useMemo(() => {
        return returnBaggageOptions.reduce(
            (acc: PriceMap, opt) => {
                acc[`baggage_${opt.baggage_id}`] = parseFloat(opt.price)
                return acc
            },
            { baggage_0: 0 } as PriceMap
        )
    }, [returnBaggageOptions])

    const depMealMap = useMemo(() => {
        return mealOptions.reduce((acc: PriceMap, opt) => {
            acc[`meal_${opt.meal_id}`] = parseFloat(opt.price)
            return acc
        }, {} as PriceMap)
    }, [mealOptions])

    const retMealMap = useMemo(() => {
        return returnMealOptions.reduce((acc: PriceMap, opt) => {
            acc[`meal_${opt.meal_id}`] = parseFloat(opt.price)
            return acc
        }, {} as PriceMap)
    }, [returnMealOptions])

    // --- Tính toán tổng giá ---
    const priceData = useMemo(() => {
        if (!selectedPackage || !passengerCounts) {
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
        }

        // 1. Tính giá vé
        const adultPrice = passengerCounts.adults * (selectedPackage?.pricePerPassenger as number)
        const childPrice = passengerCounts.children * CHILD_TICKET_PRICE
        const infantPrice = passengerCounts.infants * INFANT_TICKET_PRICE
        const basePrice = adultPrice + childPrice + infantPrice

        // 2. Tính giá dịch vụ (Nhân 1000)
        let depBaggagePrice = 0
        passengers.forEach((p) => {
            depBaggagePrice += (depBaggageMap[p.departureBaggageId] || 0) * 1000
        })

        let retBaggagePrice = 0
        if (returnFlight) {
            passengers.forEach((p) => {
                retBaggagePrice += (retBaggageMap[p.returnBaggageId] || 0) * 1000
            })
        }

        let depMealPrice = 0
        passengers.forEach((p) => {
            Object.keys(p.departureMeals).forEach((key) => {
                depMealPrice += (depMealMap[key] || 0) * (p.departureMeals[key] || 0) * 1000
            })
        })

        let retMealPrice = 0
        if (returnFlight) {
            passengers.forEach((p) => {
                Object.keys(p.returnMeals).forEach((key) => {
                    retMealPrice += (retMealMap[key] || 0) * (p.returnMeals[key] || 0) * 1000
                })
            })
        }

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
    }, [
        selectedPackage,
        passengers,
        passengerCounts,
        depBaggageMap,
        retBaggageMap,
        depMealMap,
        retMealMap,
        returnFlight
    ])

    // Trả về tất cả giá trị đã tính
    return priceData
}
