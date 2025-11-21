// src/pages/FlightBookingPayment/FlightBookingPayment.tsx

import { useState, useMemo, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// SỬA: Import thêm useMutation
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Import Components
import CountdownTimer from './components/CountdownTimer'
import PromoSection from './components/PromoSection/PromoSection'
import SummaryAndSubmit from './components/SummaryAndSubmit/SummaryAndSubmit'
import FlightSummaryCard, { FlightData, PriceDetails } from './components/FlightSummaryCard/FlightSummaryCard'

// Import APIs và Types
import { promotionApi } from '~/apis/promotion.api'
import { bookingApi } from '~/apis/booking.api' // API đặt vé
import {
    formatCurrencyVND,
    formatCustomDate,
    formatFlightTimeOnly,
    formatDuration,
    formatDateForAPI
} from '~/utils/utils'
import { AppContext } from '~/contexts/app.context'
import { FlightBookingData } from '../FlightBookingDetail/FlightBookingDetail'
import { flightServices } from '~/apis/flightServices.api'
import { clearAfterZaloPayLS, getFlightBookingDataFromLS, getFlightServicesFromLS } from '~/utils/auth'
import { path } from '~/constants/path'
import { zalopayApi } from '~/apis/zalopay.api'
import { Promotion } from '~/types/promotion'

// --- Các thành phần chung ---
interface ContactInfoPayload {
    email: string
    phone: string
    first_name: string
    last_name: string
}

interface PassengerPayload {
    first_name: string
    last_name: string
    gender: string
    date_of_birth: string // YYYY-MM-DD
    nationality: string
    passenger_type: 'adult' | 'child' | 'infant'
    title: string
    passport_number: string
    citizen_id: string
    passport_expiry: string // YYYY-MM-DD
    passport_issuing_country: string
}

interface MealOptionPayload {
    passenger_id: number
    meal_service_id: number
    quantity: number
}

interface BaggageOptionPayload {
    passenger_id: number
    baggage_service_id: number
}

export interface OneWayBookingPayload {
    flight_id: number // Sửa: Đổi tên
    class_type: string
    service_package_id: number // Sửa: Kiểu number
    contact_info: ContactInfoPayload
    passengers: PassengerPayload[]
    promotion_code: string | null
    baggage_options: BaggageOptionPayload[]
    meal_options: MealOptionPayload[]
}

interface ItinerarySegment {
    segment_type: 'outbound' | 'return'
    flight_id: number
    class_type: string
    service_package_id: number
    meal_options: MealOptionPayload[]
    baggage_options: BaggageOptionPayload[]
}

export interface RoundTripBookingPayload {
    itinerary: ItinerarySegment[]
    contact_info: ContactInfoPayload
    passengers: PassengerPayload[]
    promotion_code: string | null
}

// --- Kiểu Union (sử dụng 1 trong 2) ---
export type BookingPayload = OneWayBookingPayload | RoundTripBookingPayload

// --- Hằng số giá ---
const INFANT_TICKET_PRICE = 400000
type PriceMap = { [key: string]: number }

// --- Component ---
export default function FlightBookingPayment() {
    const navigate = useNavigate()
    const { flightBookingData, flightServicesData, setflightServicesData, setFlightBookingData } =
        useContext(AppContext)

    const isSessionValid =
        getFlightServicesFromLS() && getFlightBookingDataFromLS() && flightServicesData.departureFlight

    // Effect chuyển hướng (chạy sau khi render)
    useEffect(() => {
        if (!isSessionValid) {
            // Hiển thị thông báo 1 lần
            toast.info('Phiên đặt vé không tồn tại hoặc đã hết hạn. Đang chuyển hướng...', {
                toastId: 'session_expired' // Ngăn trùng lặp toast
            })
            // Chuyển hướng ngay lập tức
            navigate(path.reservation, { replace: true })
        }
    }, [isSessionValid, navigate])

    if (!isSessionValid) {
        return null
    }

    const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null)

    const { departureFlight, passengerCounts, returnFlight, selectedPackage, selectedReturnPackage } =
        flightServicesData

    const {
        departure_flight_id,
        passengers,
        baggage_options,
        class_type,
        contact_info,
        meal_options,
        passengersInfo,
        return_flight_id,
        return_service_package_id,
        service_package_id
    } = flightBookingData as FlightBookingData

    // --- Gọi API Khuyến mãi ---
    const { data: promoData, isLoading: isLoadingPromos } = useQuery({
        queryKey: ['promotions'],
        queryFn: () => promotionApi.getPromotion().then((res) => res.data),
        staleTime: 1000 * 60 * 10
    })
    const availablePromotions: Promotion[] = promoData?.data || ([] as any)

    // 1. Lấy hành lý chuyến đi
    const { data: departureBaggageServices, isLoading: isLoadingDepBaggageServices } = useQuery({
        // Key phải duy nhất: thêm 'baggage'
        queryKey: ['flightServices', departureFlight?.flight_id, 'baggage'],
        queryFn: async () => {
            const response = await flightServices.getBaggageServices(departureFlight?.flight_id as number)
            if (response.data.success) {
                return response.data.data
            }
            throw new Error(response.data.message || 'Lỗi khi tải dịch vụ chuyến đi')
        },
        staleTime: 1000 * 60 * 30,
        enabled: !!departureFlight?.flight_id // Chỉ chạy khi có flight_id
    })

    // 2. Lấy hành lý chuyến về
    const { data: returnBaggageServices, isLoading: isLoadingRetBaggageServices } = useQuery({
        // Key phải duy nhất: dùng returnFlight?.flight_id và 'baggage'
        queryKey: ['flightServices', returnFlight?.flight_id, 'baggage'],
        queryFn: async () => {
            // Phải gọi API với returnFlight?.flight_id
            const response = await flightServices.getBaggageServices(returnFlight?.flight_id as number)
            if (response.data.success) {
                return response.data.data
            }
            throw new Error(response.data.message || 'Lỗi khi tải dịch vụ chuyến về')
        },
        staleTime: 1000 * 60 * 30,
        enabled: !!returnFlight?.flight_id // Chỉ chạy khi có returnFlight
    })

    // 3. Lấy suất ăn chuyến đi
    const { data: departureMealServices, isLoading: isLoadingDepMealServices } = useQuery({
        // Key phải duy nhất: dùng departureFlight?.flight_id và 'meal'
        queryKey: ['flightServices', departureFlight?.flight_id, 'meal'],
        queryFn: async () => {
            // Phải gọi API với departureFlight?.flight_id
            const response = await flightServices.getMealServices(departureFlight?.flight_id as number)
            if (response.data.success) {
                return response.data.data
            }
            throw new Error(response.data.message || 'Lỗi khi tải dịch vụ chuyến đi')
        },
        staleTime: 1000 * 60 * 30,
        enabled: !!departureFlight?.flight_id // Chỉ chạy khi có departureFlight
    })

    // 4. Lấy suất ăn chuyến về
    const { data: returnMealServices, isLoading: isLoadingRetMealServices } = useQuery({
        // Key phải duy nhất: dùng returnFlight?.flight_id và 'meal'
        queryKey: ['flightServices', returnFlight?.flight_id, 'meal'],
        queryFn: async () => {
            const response = await flightServices.getMealServices(returnFlight?.flight_id as number) // Dùng as number cho an toàn
            if (response.data.success) {
                return response.data.data
            }
            throw new Error(response.data.message || 'Lỗi khi tải dịch vụ chuyến về')
        },
        staleTime: 1000 * 60 * 30,
        enabled: !!returnFlight?.flight_id // Đồng bộ với các query khác
    })

    // Phần còn lại của code đã đúng
    const isLoadingServices =
        isLoadingDepBaggageServices ||
        isLoadingRetBaggageServices ||
        isLoadingDepMealServices ||
        isLoadingRetMealServices

    const departureBaggageOptions = departureBaggageServices || []
    const departureMealOptions = departureMealServices || []
    const returnBaggageOptions = returnBaggageServices || []
    const returnMealOptions = returnMealServices || []

    // --- Tính toán Giá (Inline useMemo) ---
    const priceData = useMemo(() => {
        // ... (Toàn bộ logic tính giá phức tạp của bạn ở đây) ...
        // (Giữ nguyên như code trước)
        if (!selectedPackage || !passengerCounts || isLoadingServices) {
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
        const depBaggageMap = departureBaggageOptions.reduce(
            (acc: PriceMap, opt) => ({ ...acc, [`baggage_${opt.baggage_service_id}`]: parseFloat(opt.price) }),
            { baggage_0: 0 }
        )
        const retBaggageMap = returnBaggageOptions.reduce(
            (acc: PriceMap, opt) => ({ ...acc, [`baggage_${opt.baggage_service_id}`]: parseFloat(opt.price) }),
            { baggage_0: 0 }
        )
        const depMealMap = departureMealOptions.reduce(
            (acc: PriceMap, opt) => ({ ...acc, [`meal_${opt.meal_service_id}`]: parseFloat(opt.price) }),
            {}
        )
        const retMealMap = returnMealOptions.reduce(
            (acc: PriceMap, opt) => ({ ...acc, [`meal_${opt.meal_service_id}`]: parseFloat(opt.price) }),
            {}
        )

        const totalSelectedPackage = selectedPackage.pricePerPassenger + selectedReturnPackage.pricePerPassenger
        // 1. Tính giá vé
        // Giá người lớn = SL Người lớn * Giá Gói
        const adultPrice = passengerCounts.adults * (totalSelectedPackage as number)
        // Giá trẻ em = SL Trẻ em * Giá Gói
        const childPrice = passengerCounts.children * (totalSelectedPackage as number)
        // Giá em bé = SL Em bé * Giá cố định
        const infantPrice = passengerCounts.infants * INFANT_TICKET_PRICE

        const basePrice = returnFlight ? adultPrice + childPrice + infantPrice : adultPrice + childPrice + infantPrice // Tổng giá vé cơ sở

        // 2. Tính giá dịch vụ (Nhân 1000)

        let depBaggagePrice = 0,
            retBaggagePrice = 0,
            depMealPrice = 0,
            retMealPrice = 0
        passengers.forEach((p) => {
            depBaggagePrice += depBaggageMap[p.departureBaggageId] || 0
            if (returnFlight) retBaggagePrice += retBaggageMap[p.returnBaggageId] || 0
            Object.keys(p.departureMeals).forEach((key) => {
                depMealPrice += (depMealMap[key] || 0) * (p.departureMeals[key] || 0)
            })
            if (returnFlight)
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
    }, [
        selectedPackage,
        passengers,
        passengerCounts,
        departureBaggageOptions,
        departureMealOptions,
        returnBaggageOptions,
        returnMealOptions,
        isLoadingServices,
        returnFlight
    ])

    const { totalPrice, basePrice, depBaggagePrice, retBaggagePrice, depMealPrice, retMealPrice } = priceData

    const discountValue = useMemo(() => {
        if (appliedPromo) {
            if ((appliedPromo?.discount_percentage as number) > 0)
                return totalPrice * ((appliedPromo?.discount_percentage as number) / 100)
            return (appliedPromo?.discount_amount as number) * 1000
        }
        return 0
    }, [appliedPromo, totalPrice])

    const finalPrice = Math.max(0, totalPrice - discountValue)

    // --- 1. HÀM XỬ LÝ HẾT GIỜ ---
    const handleTimeUp = () => {
        console.log('Hết giờ rồi!')
        toast.error('Đã hết thời gian giữ chỗ. Vui lòng đặt lại.')
        setflightServicesData(null)
        setFlightBookingData(null)
        clearAfterZaloPayLS()
        navigate(path.home) // Điều hướng về trang chủ
    }

    // --- 2. HÀM XỬ LÝ ÁP DỤNG MÃ ---
    const handleApplyPromo = (promoCode: string): boolean => {
        // Tìm mã trong dữ liệu động từ API
        const validPromo = availablePromotions.find(
            (p: Promotion) => (p?.code as string).toUpperCase() === promoCode.toUpperCase() && p.is_active
        )

        if (validPromo) {
            setAppliedPromo(validPromo) // Lưu toàn bộ object khuyến mãi
            toast.success(`Đã áp dụng mã: ${validPromo.code}`)
            console.log(`LOGIC: Áp dụng mã ${validPromo.code}, tính lại tổng tiền...`)
            return true
        }

        toast.error('Mã khuyến mãi không hợp lệ hoặc đã hết hạn')
        return false
    }

    // --- 3. HÀM XỬ LÝ GỠ MÃ ---
    const handleRemovePromo = (): void => {
        console.log(`LOGIC: Gỡ mã ${appliedPromo?.code}, tính lại tổng tiền...`)
        setAppliedPromo(null)
        toast.info('Đã gỡ mã khuyến mãi')
    }

    // --- SỬA: TẠO useMutation ĐỂ THANH TOÁN ---
    const createBookingMutation = useMutation({
        mutationFn: (payload: BookingPayload) => bookingApi.createBooking(payload),
        onSuccess: (response) => {
            const body = {
                booking_id: response.data.data.booking_id
            }
            createZaloPaygMutation.mutate(body)
        },
        onError: (error: any) => {
            toast.error(error.message || 'Không tạo được booking chuyến bay tạm thời !.')
            // (isLoading sẽ tự động reset thành false)
        }
    })

    // --- SỬA: TẠO useMutation ĐỂ THANH TOÁN ---
    const createZaloPaygMutation = useMutation({
        mutationFn: (body: { booking_id: number }) => zalopayApi.createZaloPayPayment(body),
        onSuccess: (response) => {
            // 1. Lấy URL ZaloPay
            // (Giả sử API trả về { success: true, data: { paymentUrl: '...' } })
            const zaloPayUrl = response.data.data?.payment_url
            if (zaloPayUrl) {
                setflightServicesData(null)
                setFlightBookingData(null)
                clearAfterZaloPayLS()

                // 3. Chuyển hướng
                toast.success('Đang chuyển hướng đến ZaloPay...')
                window.location.href = zaloPayUrl
            } else {
                toast.error('Không nhận được URL thanh toán từ máy chủ.')
            }
        },
        onError: (error: any) => {
            console.error('Lỗi khi tạo thanh toán ZaloPay:', error)
            toast.error(error.message || 'Không thể tạo thanh toán. Vui lòng thử lại.')
            // (isLoading sẽ tự động reset thành false)
        }
    })

    const passengersPayload = passengersInfo!.map((formPassenger, index) => {
        const statePassenger = passengers[index]
        let passengerType = 'adult' // Mặc định là 'adult'
        if (statePassenger.type === 'Trẻ em') {
            passengerType = 'child'
        } else if (statePassenger.type === 'Em bé') {
            passengerType = 'infant'
        }
        return {
            first_name: formPassenger.namePassenger,
            last_name: formPassenger.lastnamePassenger,
            gender: formPassenger.gender,
            date_of_birth: formatDateForAPI(formPassenger.date_of_birth),
            nationality: formPassenger.nationality,
            passenger_type: passengerType,
            title: formPassenger.title,
            passport_number: formPassenger.passportNumber,
            citizen_id: formPassenger.citizen_id,
            passport_expiry: formatDateForAPI(formPassenger.passport_expiry),
            passport_issuing_country: formPassenger.passport_issuing_country
        }
    })

    // Hàm trợ giúp để lọc và biến đổi meal
    const getMealOptions = (leg: string) => {
        return (
            meal_options
                // 1. Lọc: Chỉ lấy meal hợp lệ VÀ đúng chặng bay
                ?.filter((meal) => meal && meal.flight_leg === leg)
                // 2. Map: Biến đổi
                .map((meal) => ({
                    passenger_id: meal.passenger_id,
                    meal_service_id: meal.meal_service_id,
                    quantity: meal.quantity
                }))
        )
    }

    // Hàm trợ giúp để lọc và biến đổi baggage
    const getBaggageOptions = (leg: string) => {
        return (
            baggage_options
                // 1. Lọc: Chỉ lấy baggage hợp lệ VÀ đúng chặng bay
                ?.filter((baggage) => baggage && baggage.flight_leg === leg)
                // 2. Map: Biến đổi
                .map((baggage) => ({
                    passenger_id: baggage.passenger_id,
                    baggage_service_id: baggage.baggage_service_id
                }))
        )
    }
    const handlePayWithZaloPay = async () => {
        let payload: BookingPayload
        if (returnFlight) {
            // --- TẠO PAYLOAD KHỨ HỒI (Round Trip) --
            payload = {
                itinerary: [
                    {
                        segment_type: 'outbound',
                        flight_id: departure_flight_id,
                        class_type: class_type,
                        service_package_id: service_package_id,
                        meal_options: getMealOptions('departure'),
                        baggage_options: getBaggageOptions('departure')
                    },
                    {
                        segment_type: 'return',
                        flight_id: return_flight_id,
                        class_type: class_type,
                        service_package_id: return_service_package_id,
                        meal_options: getMealOptions('return'),
                        baggage_options: getBaggageOptions('return')
                    }
                ],
                contact_info: {
                    email: contact_info.email,
                    first_name: contact_info.nameContact,
                    last_name: contact_info.lastnameContact,
                    phone: contact_info.phone
                },
                passengers: passengersPayload,
                promotion_code: (appliedPromo?.code as string) || ('' as string)
            } as RoundTripBookingPayload
        } else {
            // --- TẠO PAYLOAD MỘT CHIỀU (One Way) ---
            payload = {
                flight_id: departure_flight_id,
                class_type: class_type,
                service_package_id: service_package_id,
                contact_info: {
                    email: contact_info.email,
                    first_name: contact_info.nameContact,
                    last_name: contact_info.lastnameContact,
                    phone: contact_info.phone
                },
                passengers: passengersPayload,
                promotion_code: (appliedPromo?.code as string) || ('' as string),
                meal_options: getMealOptions('departure'),
                baggage_options: getBaggageOptions('departure')
            } as OneWayBookingPayload
        }

        console.log('LOGIC: Gửi payload lên backend (/api/bookings):', payload)

        // // Gọi mutation
        createBookingMutation.mutate(payload)
    }

    // --- Định dạng dữ liệu cho Card Tóm Tắt (Giữ nguyên) ---
    const flightDataForCard: FlightData = useMemo(
        () => ({
            departure: {
                time: formatFlightTimeOnly(departureFlight?.departure.time as string),
                city: departureFlight?.departure.airport.city as string,
                date: formatCustomDate((departureFlight?.departure.time as string)?.substring(0, 10))
            },
            arrival: {
                time: formatFlightTimeOnly(departureFlight?.arrival.time as string),
                city: departureFlight?.arrival.airport.city as string,
                date: formatCustomDate((departureFlight?.arrival.time as string)?.substring(0, 10))
            },
            duration: formatDuration(departureFlight?.duration as string),
            type: 'Bay thẳng',
            airline: departureFlight?.airline.name as string,
            flightClass: selectedPackage?.name as string
        }),
        [departureFlight, selectedPackage]
    )

    const passengersForCard: string[] = useMemo(() => {
        return passengers.map((p) => `${contact_info.nameContact} ${contact_info.lastnameContact} (${p.type})`)
    }, [passengers])

    const priceDetailsForCard: PriceDetails = useMemo(() => {
        const baggageTotal = depBaggagePrice + retBaggagePrice
        const mealsTotal = depMealPrice + retMealPrice
        return {
            baseFare: formatCurrencyVND(basePrice),
            baggage: baggageTotal > 0 ? `+${formatCurrencyVND(baggageTotal)}` : '0 VND',
            meals: mealsTotal > 0 ? `+${formatCurrencyVND(mealsTotal)}` : '0 VND',
            total: formatCurrencyVND(totalPrice)
        }
    }, [basePrice, depBaggagePrice, retBaggagePrice, depMealPrice, retMealPrice, totalPrice])

    return (
        <div className='mt-5'>
            <div className='max-w-[1278px] mx-auto'>
                <div className='grid grid-cols-12 gap-5'>
                    {/* === CỘT BÊN TRÁI === */}
                    <div className='col-span-8'>
                        <CountdownTimer initialMinutes={10} onExpire={handleTimeUp} />

                        <PromoSection
                            promotions={availablePromotions}
                            isLoading={isLoadingPromos}
                            appliedPromoId={appliedPromo?.code || null}
                            onApplyPromo={handleApplyPromo}
                            onRemovePromo={handleRemovePromo}
                        />

                        <SummaryAndSubmit
                            onSubmitPayment={handlePayWithZaloPay}
                            // SỬA: Dùng isLoading từ mutation
                            isLoading={createBookingMutation.isPending}
                            finalPrice={finalPrice}
                        />
                    </div>

                    {/* === CỘT BÊN PHẢI === */}
                    <div className='col-span-4 '>
                        <FlightSummaryCard
                            flightData={flightDataForCard}
                            passengers={passengersForCard}
                            priceDetails={priceDetailsForCard}
                        />

                        {appliedPromo && (
                            <div className='bg-white rounded-lg shadow-sm border border-gray-200 mt-5 p-4'>
                                <h3 className='text-md font-semibold text-gray-800 mb-2'>Khuyến mãi</h3>
                                <div className='flex justify-between text-sm text-green-600'>
                                    <span>Mã: {appliedPromo.code}</span>
                                    <span className='font-medium'>-{formatCurrencyVND(discountValue)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
