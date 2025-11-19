// src/pages/FlightBookingDetail/FlightBookingDetail.tsx

import { useContext, useState } from 'react'
import {  useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useQuery } from '@tanstack/react-query'

// Import Schemas
import {
    ContactFormData,
    contactSchema,
    PassengerFormData,
    passengerSchema,
    PassportFormData,
    passportSchema
} from '~/utils/rules'

// Import Components
import ContactInformation from './components/ContactInformation'
import PassengerInFormation from './components/PassengerInFormation'
import FlightEssentials from './components/FlightEssentials/FlightEssentials'
import InFlightMeals from './components/InFlightMeals/InFlightMeals'
import FlightSummary from './components/FlightSummary'
import Button from '~/components/Button'

// Import Constants/Hooks
import { path } from '~/constants/path'
import {
    FlightServiceModal,
    PackageConfig
} from '~/pages/SearchFlight/components/FlightServiceModal/FlightServiceModal'
import { flightServices } from '~/apis/flightServices.api'
import { Passenger } from '~/types/passenger' // Import kiểu Passenger mới
import { SelectedMeals } from '~/types/passenger'
import { BaggageModal } from './components/BaggageModal/BaggageModal'
import { MealModal } from './components/MealModal/MealModal'
import { AppContext } from '~/contexts/app.context'
import { setFlightBookingDataFromLS } from '~/utils/auth'
import { Flight } from '~/types/searchFlight.type'

interface PassengerCount {
    adults: number
    children: number
    infants: number
    total: number
}
export interface FlightServiceModal {
    departureFlight: Flight | null
    returnFlight: Flight | null
    selectedPackage: PackageConfig
    selectedReturnPackage: PackageConfig
    passengerCounts: PassengerCount
}

export interface FlightBookingData {
    departure_flight_id: number | undefined
    class_type: string
    return_flight_id: number | null
    service_package_id: number | undefined
    return_service_package_id: number | undefined
    contact_info: ContactFormData
    passengers: Passenger[]
    passengersInfo: (PassengerFormData & PassportFormData)[]
    baggage_options: {
        passenger_id: number
        baggage_service_id: number
        flight_leg?: string | undefined
    }[]
    meal_options: {
        passenger_id: number
        meal_service_id: number
        quantity: number
        flight_leg?: string | undefined
    }[]
}

// --- Hàm tiện ích (Cập nhật Passenger) ---
const generatePassengers = (adults: number, children: number, infants: number): Passenger[] => {
    const list: Passenger[] = []
    let idCounter = 1
    for (let i = 0; i < adults; i++) {
        list.push({
            id: idCounter++,
            fullName: `Người lớn ${i + 1}`,
            type: 'Người lớn',
            departureBaggageId: 'baggage_0',
            returnBaggageId: 'baggage_0',
            departureMeals: {},
            returnMeals: {}
        })
    }
    for (let i = 0; i < children; i++) {
        list.push({
            id: idCounter++,
            fullName: `Trẻ em ${i + 1}`,
            type: 'Trẻ em',
            departureBaggageId: 'baggage_0',
            returnBaggageId: 'baggage_0',
            departureMeals: {},
            returnMeals: {}
        })
    }
    for (let i = 0; i < infants; i++) {
        list.push({
            id: idCounter++,
            fullName: `Em bé ${i + 1}`,
            type: 'Em bé',
            departureBaggageId: 'baggage_0',
            returnBaggageId: 'baggage_0',
            departureMeals: {},
            returnMeals: {}
        })
    }
    return list
}

// --- Schema Validation & Types (Giữ nguyên) ---
const validationSchema = yup.object({
    contact: contactSchema,
    passengers: yup.array().of(passengerSchema.concat(passportSchema)).min(1, '...').required()
})

type BookingFormData = {
    contact: ContactFormData
    passengers: (PassengerFormData & PassportFormData)[]
}

// --- Component ---
export default function FlightBookingDetail() {
    const { flightServicesData, setFlightBookingData } = useContext(AppContext)
    const navigate = useNavigate()

    const { departureFlight, passengerCounts, returnFlight, selectedPackage, selectedReturnPackage } =
        flightServicesData as FlightServiceModal
    // --- State ---
    const [isBaggageModalOpen, setBaggageModalOpen] = useState(false)
    const [isMealModalOpen, setMealModalOpen] = useState(false)
    const [errorEmail, setErrorEmail] = useState<string>('')
    const [passengers, setPassengers] = useState<Passenger[]>(() =>
        generatePassengers(
            passengerCounts?.adults as number,
            passengerCounts?.children as number,
            passengerCounts?.infants as number
        )
    )

    // --- React Hook Form (Giữ nguyên) ---
    const {
        control,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<BookingFormData>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            contact: { email: '', phone: '', lastnameContact: '', nameContact: '' },
            passengers: passengers.map(() => ({
                lastnamePassenger: '',
                namePassenger: '',
                title: '',
                gender: '',
                date_of_birth: undefined,
                nationality: '',
                citizen_id: '',
                passportNumber: '',
                passport_expiry: undefined,
                passport_issuing_country: ''
            }))
        }
    })
    const { fields } = useFieldArray({ control, name: 'passengers' })

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

    const onSubmit = handleSubmit((formData) => {
        const finalBookingData: FlightBookingData = {
            departure_flight_id: departureFlight?.flight_id,
            class_type: departureFlight?.travel_class?.code.toLowerCase() || 'economy',
            return_flight_id: returnFlight?.flight_id || null,
            service_package_id: selectedPackage?.service_package_id,
            return_service_package_id: selectedReturnPackage?.service_package_id,
            contact_info: formData.contact,
            passengers: passengers,
            passengersInfo: formData.passengers,

            // Dùng index làm passenger_id
            baggage_options: passengers.flatMap((p) => {
                const options: {
                    passenger_id: number
                    baggage_service_id: number
                    flight_leg?: string
                }[] = []
                // Thêm hành lý đi (nếu chọn)
                if (p.departureBaggageId !== 'baggage_0') {
                    options.push({
                        passenger_id: p.id,
                        baggage_service_id: parseInt(p.departureBaggageId.split('_')[1]),
                        flight_leg: 'departure'
                    })
                }
                // Thêm hành lý về (nếu chọn)
                if (returnFlight && p.returnBaggageId !== 'baggage_0') {
                    options.push({
                        passenger_id: p.id,
                        baggage_service_id: parseInt(p.returnBaggageId.split('_')[1]),
                        flight_leg: 'return'
                    })
                }
                return options
            }),

            meal_options: passengers.flatMap((p) => {
                const meals: {
                    passenger_id: number
                    meal_service_id: number
                    quantity: number
                    flight_leg?: string
                }[] = []

                Object.entries(p.departureMeals).forEach(([mealKey, quantity]) => {
                    if (quantity > 0) {
                        meals.push({
                            passenger_id: p.id, // Dùng index 0, 1, 2...
                            meal_service_id: parseInt(mealKey.split('_')[1]), // Lấy số 1 từ 'meal_1'
                            quantity: quantity,
                            flight_leg: 'departure'
                        })
                    }
                })

                if (returnFlight) {
                    Object.entries(p.returnMeals).forEach(([mealKey, quantity]) => {
                        if (quantity > 0) {
                            meals.push({
                                passenger_id: p.id,
                                meal_service_id: parseInt(mealKey.split('_')[1]),
                                quantity: quantity,
                                flight_leg: 'return'
                            })
                        }
                    })
                }

                return meals
            })
        }

        console.log('Chuyển sang thanh toán với dữ liệu:', finalBookingData)
        setFlightBookingData(finalBookingData)
        setFlightBookingDataFromLS(finalBookingData)
        navigate(path.flightBookingPayment)
    })

    // Cập nhật onSave
    const saveBaggageSelections = (selections: {
        departure: { [pId: number]: string }
        return: { [pId: number]: string }
    }) => {
        setPassengers((prev) =>
            prev.map((p) => ({
                ...p,
                departureBaggageId: selections.departure[p.id] || p.departureBaggageId,
                returnBaggageId: selections.return[p.id] || p.returnBaggageId
            }))
        )
    }
    const saveMealSelections = (selections: {
        departure: { [pId: number]: SelectedMeals }
        return: { [pId: number]: SelectedMeals }
    }) => {
        setPassengers((prev) =>
            prev.map((p) => ({
                ...p,
                departureMeals: selections.departure[p.id] || p.departureMeals,
                returnMeals: selections.return[p.id] || p.returnMeals
            }))
        )
    }

    return (
        <div className='mt-5'>
            <div className='max-w-[1278px] mx-auto'>
                <div className='grid grid-cols-12 gap-5'>
                    {/* Cột trái - Form */}
                    <div className='col-span-8'>
                        <form onSubmit={onSubmit}>
                            <ContactInformation
                                control={control}
                                register={register}
                                errors={errors.contact}
                                setErrorEmail={setErrorEmail}
                                errorEmail={errorEmail}
                            />

                            {fields.map((field, index) => (
                                <PassengerInFormation
                                    key={field.id}
                                    control={control}
                                    register={register}
                                    errors={errors.passengers?.[index]}
                                    index={index}
                                    passenger={passengers[index]}
                                />
                            ))}

                            <FlightEssentials onOpenBaggageModal={() => setBaggageModalOpen(true)} />
                            <InFlightMeals onOpenMealModal={() => setMealModalOpen(true)} />

                            {/* Nút Quay lại và Tiếp tục */}
                            <div className='flex justify-between items-center mt-8 py-4 border-t border-gray-200'>
                                <Button
                                    type='button'
                                    onClick={() => navigate(-1)} // Nút quay lại, dùng navigate(-1) để quay về trang trước
                                    className='text-blue-600 font-semibold border border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center text-center'
                                >
                                    <svg
                                        className='w-5 h-5 mr-2'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth='1.5'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18'
                                        />
                                    </svg>
                                    Quay lại
                                </Button>

                                <Button
                                    type='submit' // Nút submit form
                                    className='bg-orange-500 text-white font-bold px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center text-center'
                                >
                                    Tiếp tục
                                    <svg
                                        className='w-5 h-5 ml-2'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth='1.5'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3'
                                        />
                                    </svg>
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Cột phải - Tóm tắt */}
                    <div className='col-span-4 '>
                        <FlightSummary
                            departureFlight={departureFlight}
                            returnFlight={returnFlight}
                            selectedPackage={selectedPackage!}
                            passengers={passengers}
                            passengerCounts={passengerCounts!}
                            baggageOptions={departureBaggageOptions}
                            mealOptions={departureMealOptions}
                            returnBaggageOptions={returnBaggageOptions}
                            returnMealOptions={returnMealOptions}
                            isLoadingServices={isLoadingServices}
                        />
                    </div>
                </div>
            </div>

            {/* Modals (Truyền props mới) */}
            <BaggageModal
                isOpen={isBaggageModalOpen}
                onClose={() => setBaggageModalOpen(false)}
                passengers={passengers}
                onSave={saveBaggageSelections}
                departureOptions={departureBaggageOptions}
                returnOptions={returnBaggageOptions}
                departureFlight={departureFlight}
                returnFlight={returnFlight}
            />
            <MealModal
                isOpen={isMealModalOpen}
                onClose={() => setMealModalOpen(false)}
                passengers={passengers}
                onSave={saveMealSelections}
                departureOptions={departureMealOptions}
                returnOptions={returnMealOptions}
                departureFlight={departureFlight}
                returnFlight={returnFlight}
            />
        </div>
    )
}
