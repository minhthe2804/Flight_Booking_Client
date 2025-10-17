import { useState } from 'react'

import {
    ContactFormData,
    contactSchema,
    PassengerFormData,
    passengerSchema,
    PassportFormData,
    passportSchema
} from '~/utils/rules'
import ContactInformation from './components/ContactInformation'
import PassengerInFormation from './components/PassengerInFormation'
import FlightEssentials from './components/FlightEssentials/FlightEssentials'
import InFlightMeals from './components/InFlightMeals/InFlightMeals'
import BaggageModal, { Passenger } from './components/BaggageModal/BaggageModal'
import MealModal, { SelectedMeals } from './components/MealModal/MealModal'
import FlightSummary from './components/FlightSummary'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Button from '~/components/Button'
import { useNavigate } from 'react-router-dom'
import { path } from '~/constants/path'

// --- Dữ liệu 3 hành khách ---
const initialPassengers: Passenger[] = [
    { id: 1, fullName: 'NGUYEN THI TAM', type: 'Người lớn', baggageId: 'none', selectedMeals: {} },
    { id: 2, fullName: 'TRAN VAN BA', type: 'Người lớn', baggageId: 'plus_10kg', selectedMeals: { banhmi: 1 } },
    { id: 3, fullName: 'LE THI C', type: 'Trẻ em', baggageId: 'none', selectedMeals: {} }
]
// ----------------------------

// 1. Gộp các schema lại với nhau trước
const combinedSchema = passengerSchema.concat(passportSchema).concat(contactSchema)
// Gộp 2 type lại với nhau theo cách thủ công
type CombinedFormData = PassengerFormData & PassportFormData & ContactFormData

export default function FlightBookingDetail() {
    const [isBaggageModalOpen, setBaggageModalOpen] = useState(false)
    const [isMealModalOpen, setMealModalOpen] = useState(false)
    const [passengers, setPassengers] = useState<Passenger[]>(initialPassengers)

    const [errorEmail, setErrorEmail] = useState<string>('')
    const {
        control,
        register,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm<CombinedFormData>({
        defaultValues: {
            email: '',
            phone: '',
            lastnameContact: '',
            lastnamePassenger: '',
            nameContact: '',
            namePassenger: '',
            title: '',
            date_of_birth: undefined,
            nationality: '',
            passportNumber: '',
            issuingCountry: '',
            expiryDate: undefined
        },
        resolver: yupResolver(combinedSchema)
    })

    const navigate = useNavigate()
    const onSubmit = handleSubmit((data: any) => {
        navigate(path.flightBookingPayment)
    })

    // --- Handlers cho Hành lý ---
    const saveBaggageSelections = (allSelections: { [pId: number]: string }) => {
        setPassengers((prev) => prev.map((p) => ({ ...p, baggageId: allSelections[p.id] || p.baggageId })))
        console.log('Đã lưu hành lý:', allSelections)
    }

    // --- Handlers cho Món ăn ---
    const saveMealSelections = (allSelections: { [pId: number]: SelectedMeals }) => {
        setPassengers((prev) => prev.map((p) => ({ ...p, selectedMeals: allSelections[p.id] || p.selectedMeals })))
        console.log('Đã lưu món ăn:', allSelections)
    }

    return (
        <div className='mt-5'>
            <div className='max-w-[1278px] mx-auto'>
                <div className='grid grid-cols-12 gap-5'>
                    <div className='col-span-8'>
                        <form onSubmit={onSubmit}>
                            <ContactInformation
                                control={control}
                                register={register}
                                errors={errors}
                                setErrorEmail={setErrorEmail}
                                errorEmail={errorEmail}
                            />
                            <PassengerInFormation control={control} register={register} errors={errors} />
                            <FlightEssentials onOpenBaggageModal={() => setBaggageModalOpen(true)} />
                            <InFlightMeals onOpenMealModal={() => setMealModalOpen(true)} />
                            <div className='flex justify-between items-center mt-8 py-4 border-t'>
                                <Button
                                    type='submit'
                                    className='text-blue-600 font-semibold border border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center text-center'
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke-width='1.5'
                                        stroke='currentColor'
                                        className='size-5 mt-[3px]'
                                    >
                                        <path
                                            stroke-linecap='round'
                                            stroke-linejoin='round'
                                            d='M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18'
                                        />
                                    </svg>
                                    Quay lại
                                </Button>

                                {/* --- Nút Tiếp tục --- */}
                                <Button className='bg-orange-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center text-center'>
                                    Tiếp tục đến phần thanh toán
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke-width='1.5'
                                        stroke='currentColor'
                                        className='size-5 mt-[3px]'
                                    >
                                        <path
                                            stroke-linecap='round'
                                            stroke-linejoin='round'
                                            d='M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3'
                                        />
                                    </svg>
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className='col-span-4 '>
                        <FlightSummary />
                    </div>
                </div>
            </div>
            <BaggageModal
                isOpen={isBaggageModalOpen}
                onClose={() => setBaggageModalOpen(false)}
                passengers={passengers}
                onSave={saveBaggageSelections}
            />

            <MealModal
                isOpen={isMealModalOpen}
                onClose={() => setMealModalOpen(false)}
                passengers={passengers}
                onSave={saveMealSelections}
            />
        </div>
    )
}
