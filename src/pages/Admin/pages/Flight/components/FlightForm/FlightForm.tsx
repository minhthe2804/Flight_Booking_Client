import { SubmitHandler, useForm, useFieldArray, Control, UseFormRegister, FieldErrors } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { useEffect, useMemo } from 'react'
import Input from '~/components/Input'
import SelectField from '~/components/SelectField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import {
    faRotate,
    faPlus,
    faTrash,
    faPlane,
    faDollarSign,
    faBoxOpen,
    faUtensils,
    faRoute
} from '@fortawesome/free-solid-svg-icons'

import { Airport } from '~/apis/airport.api'
import { Aircraft } from '~/apis/aircraft.api'
import { Flight, FlightFormData } from '~/apis/flight.api'
import { flightFormSchema } from '~/utils/rules'
import { Airline } from '~/apis/airLine.api'

// --- Dữ liệu mặc định (Trống) ---
const defaultValues: FlightFormData = {
    flight_id: 0,
    airline_id: 0,
    aircraft_id: 0,
    departure_airport_id: 0,
    arrival_airport_id: 0,
    departure_time: '',
    arrival_time: '',
    status: 'scheduled',
    flight_type: 'domestic',
    economy_price: 0,
    business_price: 0,
    baggage_services: [],
    meal_services: []
}

// --- Props ---
interface FlightFormProps {
    editingFlight: Flight | null // Nhận kiểu API (Response)
    onSubmitForm: SubmitHandler<FlightFormData> // Gửi kiểu Form (Payload)
    onResetForm: () => void // SỬA: Đây là hàm Tắt Form
    airlines: Airline[] | any
    airports: Airport[] | any
    aircrafts: Aircraft[] | any
    isLoading: boolean
}

// --- Helper: Chuyển đổi Datetime (API) sang (Input) ---
const formatDateTimeForInput = (isoString: string) => {
    if (!isoString) return ''
    try {
        // (Giả sử múi giờ địa phương là +07:00)
        // Lấy 16 ký tự đầu (YYYY-MM-DDTHH:mm)
        const date = new Date(new Date(isoString).getTime() - new Date().getTimezoneOffset() * 60000)
        return date.toISOString().slice(0, 16)
    } catch (e) {
        return ''
    }
}

// --- Component Con (Hành lý) ---
interface NestedBaggageArrayProps {
    control: Control<FlightFormData>
    register: UseFormRegister<FlightFormData>
    errors: FieldErrors<FlightFormData>
}
const NestedBaggageArray: React.FC<NestedBaggageArrayProps> = ({ control, register, errors }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'baggage_services'
    })

    return (
        <div className='space-y-2'>
            {/* SỬA: Hàng Tiêu đề riêng biệt */}
            {fields.length > 0 && (
                <div className='grid grid-cols-12 gap-x-4 mb-2 px-1'>
                    <div className='col-span-2'>
                        <label className='block text-xs font-medium text-gray-500 uppercase tracking-wide'>Số kg</label>
                    </div>
                    <div className='col-span-3'>
                        <label className='block text-xs font-medium text-gray-500 uppercase tracking-wide'>
                            Giá (VND)
                        </label>
                    </div>
                    <div className='col-span-6'>
                        <label className='block text-xs font-medium text-gray-500 uppercase tracking-wide'>
                            Mô tả dịch vụ
                        </label>
                    </div>
                    <div className='col-span-1'></div>
                </div>
            )}

            {fields.map((item, index) => (
                <div key={item.id} className='grid grid-cols-12 gap-x-4 items-start'>
                    <div className='col-span-2'>
                        <Input
                            // Không truyền label vào Input nữa
                            isFont
                            name={`baggage_services.${index}.weight_kg`}
                            type='number'
                            register={register}
                            placeholder='20'
                            classNameInput='text-black w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                            errorMessage={errors.baggage_services?.[index]?.weight_kg?.message}
                        />
                    </div>
                    <div className='col-span-3'>
                        <Input
                            isFont
                            name={`baggage_services.${index}.price`}
                            type='number'
                            register={register}
                            placeholder='200000'
                            classNameInput='text-black w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                            errorMessage={errors.baggage_services?.[index]?.price?.message}
                        />
                    </div>
                    <div className='col-span-6'>
                        <Input
                            isFont
                            name={`baggage_services.${index}.description`}
                            type='text'
                            register={register}
                            placeholder='Gói hành lý 20kg'
                            classNameInput='text-black w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                            errorMessage={errors.baggage_services?.[index]?.description?.message}
                        />
                    </div>
                    {/* Nút Xóa được căn giữa chiều cao với Input */}
                    <div className='col-span-1 flex justify-center pt-1'>
                        <button
                            type='button'
                            onClick={() => remove(index)}
                            className='text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50'
                            title='Xóa dịch vụ này'
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                </div>
            ))}

            <button
                type='button'
                onClick={() =>
                    append({
                        baggage_service_id: undefined,
                        weight_kg: 20,
                        price: 0,
                        description: 'Hành lý ký gửi 20kg'
                    })
                }
                className='mt-2 text-sm font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 py-2'
            >
                <FontAwesomeIcon icon={faPlus} className='w-3 h-3' />
                Thêm dịch vụ hành lý
            </button>
        </div>
    )
}

// --- Component Con (Suất ăn) ---
interface NestedMealArrayProps {
    control: Control<FlightFormData>
    register: UseFormRegister<FlightFormData>
    errors: FieldErrors<FlightFormData>
}
const NestedMealArray: React.FC<NestedMealArrayProps> = ({ control, register, errors }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'meal_services'
    })

    return (
        <div className='space-y-2'>
            {/* SỬA: Hàng Tiêu đề riêng biệt */}
            {fields.length > 0 && (
                <div className='grid grid-cols-12 gap-x-4 mb-2 px-1'>
                    <div className='col-span-3'>
                        <label className='block text-xs font-medium text-gray-500 uppercase tracking-wide'>
                            Tên suất ăn
                        </label>
                    </div>
                    <div className='col-span-3'>
                        <label className='block text-xs font-medium text-gray-500 uppercase tracking-wide'>
                            Giá (VND)
                        </label>
                    </div>
                    <div className='col-span-3'>
                        <label className='block text-xs font-medium text-gray-500 uppercase tracking-wide'>Mô tả</label>
                    </div>
                    <div className='col-span-2'>
                        <label className='block text-xs font-medium text-gray-500 uppercase tracking-wide'>
                            Tùy chọn
                        </label>
                    </div>
                    <div className='col-span-1'></div>
                </div>
            )}

            {fields.map((item, index) => (
                <div key={item.id} className='grid grid-cols-12 gap-x-4 items-start'>
                    <div className='col-span-3'>
                        <Input
                            isFont
                            name={`meal_services.${index}.meal_name`}
                            type='text'
                            register={register}
                            placeholder='Cơm gà'
                            classNameInput='text-black w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                            errorMessage={errors.meal_services?.[index]?.meal_name?.message}
                        />
                    </div>
                    <div className='col-span-3'>
                        <Input
                            isFont
                            name={`meal_services.${index}.price`}
                            type='number'
                            register={register}
                            placeholder='50000'
                            classNameInput='text-black w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                            errorMessage={errors.meal_services?.[index]?.price?.message}
                        />
                    </div>
                    <div className='col-span-3'>
                        <Input
                            isFont
                            name={`meal_services.${index}.meal_description`}
                            type='text'
                            register={register}
                            placeholder='Cơm gà chiên mắm'
                            classNameInput='text-black w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                            errorMessage={errors.meal_services?.[index]?.meal_description?.message}
                        />
                    </div>
                    {/* Checkbox */}
                    <div className='col-span-2 flex items-center h-[42px]'>
                        <div className='flex items-center space-x-2'>
                            <input
                                type='checkbox'
                                id={`is_vegetarian_${index}`}
                                {...register(`meal_services.${index}.is_vegetarian`)}
                                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
                            />
                            <label
                                htmlFor={`is_vegetarian_${index}`}
                                className='text-sm text-gray-700 cursor-pointer select-none'
                            >
                                Chay
                            </label>
                        </div>
                    </div>

                    {/* Nút Xóa */}
                    <div className='col-span-1 flex justify-center pt-1'>
                        <button
                            type='button'
                            onClick={() => remove(index)}
                            className='text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50'
                            title='Xóa dịch vụ này'
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                </div>
            ))}

            <button
                type='button'
                onClick={() =>
                    append({
                        meal_service_id: undefined,
                        meal_name: 'Suất ăn mới',
                        price: 0,
                        meal_description: 'Mô tả...',
                        is_vegetarian: false,
                        is_halal: false
                    })
                }
                className='mt-2 text-sm font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 py-2'
            >
                <FontAwesomeIcon icon={faPlus} className='w-3 h-3' />
                Thêm dịch vụ suất ăn
            </button>
        </div>
    )
}
// -----------------------------

// --- Component Cha ---
export default function FlightForm({
    editingFlight,
    onSubmitForm,
    onResetForm,
    airlines,
    airports,
    aircrafts,
    isLoading
}: FlightFormProps) {
    const isEditing = !!editingFlight

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch, // Thêm watch
        formState: { errors }
    } = useForm<FlightFormData>({
        resolver: yupResolver(flightFormSchema),
        defaultValues: defaultValues
    })

    // Effect (Dịch API Response sang Form Data)
    useEffect(() => {
        if (editingFlight) {
            // Dịch dữ liệu API (string) sang Form (number/date)
            reset({
                flight_id: editingFlight.flight_id,
                airline_id: editingFlight.airline_id,
                aircraft_id: editingFlight.aircraft_id,
                departure_airport_id: editingFlight.departure_airport_id,
                arrival_airport_id: editingFlight.arrival_airport_id,
                departure_time: formatDateTimeForInput(editingFlight.departure_time),
                arrival_time: formatDateTimeForInput(editingFlight.arrival_time),
                status: editingFlight.status,
                flight_type: editingFlight.flight_type,
                economy_price: parseFloat(editingFlight.economy_price),
                business_price: parseFloat(editingFlight.business_price),
                // Dịch baggage_services
                baggage_services: editingFlight.baggage_services.map((b) => ({
                    baggage_service_id: b.baggage_service_id,
                    weight_kg: parseFloat(b.weight_kg),
                    price: parseFloat(b.price),
                    description: b.description
                })),
                // Dịch meal_services
                meal_services: editingFlight.meal_services.map((m) => ({
                    meal_service_id: m.meal_service_id,
                    meal_name: m.meal_name,
                    meal_description: m.meal_description,
                    price: parseFloat(m.price),
                    is_vegetarian: m.is_vegetarian,
                    is_halal: m.is_halal
                }))
            })
        } else {
            reset(defaultValues)
        }
    }, [editingFlight, reset])

    const handleResetClick = () => {
        onResetForm()
    }

    // Chuyển đổi data cho Select
    const airlineOptions = useMemo(
        () => airlines.map((a: Airline) => ({ value: a.airline_id, label: `${a.airline_name} (${a.airline_code})` })),
        [airlines]
    )
    const airportOptions = useMemo(
        () => airports.map((a: Airport) => ({ value: a.airport_id, label: `${a.city} (${a.airport_code})` })),
        [airports]
    )

    const statusOptions = [
        { value: 'scheduled', label: 'Lên lịch (Scheduled)' },
        { value: 'on-time', label: 'Đúng giờ (On-time)' },
        { value: 'delayed', label: 'Bị trễ (Delayed)' },
        { value: 'cancelled', label: 'Đã hủy (Cancelled)' }
    ]
    const typeOptions = [
        { value: 'domestic', label: 'Nội địa' },
        { value: 'international', label: 'Quốc tế' }
    ]

    // (Lọc danh sách máy bay dựa trên hãng bay đã chọn)
    const selectedAirlineId = watch('airline_id')
    console.log(selectedAirlineId)
    console.log(aircrafts)
    const filteredAircraftOptions = useMemo(() => {
        if (isLoading) {
            const current = aircrafts.find((a: Aircraft) => a.aircraft_id === editingFlight?.aircraft_id)
            return current ? [{ value: current.aircraft_id, label: current.model }] : []
        }
        if (!selectedAirlineId) {
            return aircrafts.map((a: Aircraft) => ({ value: a.aircraft_id, label: `${a.model} (All Airlines)` }))
        }
        console.log('ss')
        return aircrafts
            .filter((a: Aircraft) => a.Airline.airline_id == selectedAirlineId)
            .map((a: Aircraft) => ({ value: a.aircraft_id, label: a.model }))
    }, [selectedAirlineId, aircrafts, isLoading, editingFlight])

    return (
        <div className='bg-white p-6 rounded-lg shadow-md border border-gray-100'>
            <div className='flex items-center justify-between mb-6 pb-4 border-b border-gray-100'>
                <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                    <FontAwesomeIcon icon={faPlane} className='text-blue-600' />
                    {isEditing ? `Cập nhật Chuyến bay (ID: ${editingFlight?.flight_id})` : 'Thêm Chuyến bay mới'}
                </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmitForm)}>
                {/* --- 1. Thông tin cơ bản --- */}
                <div className='p-5 border border-gray-200 rounded-lg'>
                    <h3 className='text-md font-semibold text-gray-700 mb-5 uppercase tracking-wide text-xs'>
                        Thông tin cơ bản
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <SelectField
                            name='airline_id'
                            control={control}
                            label='Hãng hàng không'
                            placeholder={isLoading ? 'Đang tải...' : 'Chọn hãng bay'}
                            options={airlineOptions}
                        />
                        <SelectField
                            name='aircraft_id'
                            control={control}
                            label='Máy bay'
                            placeholder={isLoading ? 'Đang tải...' : 'Chọn máy bay'}
                            options={filteredAircraftOptions}
                        />
                        <SelectField
                            name='flight_type'
                            control={control}
                            label='Loại chuyến bay'
                            options={typeOptions}
                        />
                        <SelectField name='status' control={control} label='Trạng thái' options={statusOptions} />
                    </div>
                </div>

                {/* --- 2. Lộ trình --- */}
                <div className='mt-6 p-5 border border-gray-200 rounded-lg'>
                    <h3 className='text-md font-semibold text-gray-700 mb-5 uppercase tracking-wide text-xs flex items-center gap-2'>
                        <FontAwesomeIcon icon={faRoute} className='text-gray-400' />
                        Lộ trình
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <SelectField
                            name='departure_airport_id'
                            control={control}
                            label='Sân bay đi'
                            placeholder={isLoading ? 'Đang tải...' : 'Chọn sân bay đi'}
                            options={airportOptions}
                        />
                        <SelectField
                            name='arrival_airport_id'
                            control={control}
                            label='Sân bay đến'
                            placeholder={isLoading ? 'Đang tải...' : 'Chọn sân bay đến'}
                            options={airportOptions}
                        />
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Thời gian đi</label>
                            <input
                                type='datetime-local'
                                {...register('departure_time')}
                                className={`text-black mt-1 w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm ${
                                    errors.departure_time ? 'border-red-500' : 'border-gray-300'
                                } focus:border-blue-500`}
                            />
                            {errors.departure_time && (
                                <p className='text-red-500 text-xs mt-1'>{errors.departure_time.message}</p>
                            )}
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Thời gian đến</label>
                            <input
                                type='datetime-local'
                                {...register('arrival_time')}
                                className={`text-black mt-1 w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm ${
                                    errors.arrival_time ? 'border-red-500' : 'border-gray-300'
                                } focus:border-blue-500`}
                            />
                            {errors.arrival_time && (
                                <p className='text-red-500 text-xs mt-1'>{errors.arrival_time.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- 3. Giá vé --- */}
                <div className='mt-6 p-5 border border-gray-200 rounded-lg'>
                    <h3 className='text-md font-semibold text-gray-700 mb-5 uppercase tracking-wide text-xs flex items-center gap-2'>
                        <FontAwesomeIcon icon={faDollarSign} className='text-gray-400' />
                        Giá vé
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <Input
                            label='Giá vé Economy (VND)'
                            isRequired
                            register={register}
                            type='number'
                            name='economy_price'
                            isFont
                            classNameInput='text-black mt-1 w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm focus:border-blue-500 '
                            errorMessage={errors.economy_price?.message}
                        />
                        <Input
                            label='Giá vé Business (VND)'
                            isRequired
                            register={register}
                            type='number'
                            name='business_price'
                            isFont
                            classNameInput='text-black mt-1 w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm focus:border-blue-500'
                            errorMessage={errors.business_price?.message}
                        />
                    </div>
                </div>

                {/* --- 4. Dịch vụ hành lý (lồng nhau) --- */}
                <div className='mt-6 p-5 border border-gray-200 rounded-lg'>
                    <h3 className='text-md font-semibold text-gray-700 mb-4 uppercase tracking-wide text-xs flex items-center gap-2'>
                        <FontAwesomeIcon icon={faBoxOpen} className='text-gray-400' />
                        Dịch vụ hành lý
                    </h3>
                    <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                        <NestedBaggageArray control={control} register={register} errors={errors} />
                    </div>
                </div>

                {/* --- 5. Dịch vụ suất ăn (lồng nhau) --- */}
                <div className='mt-6 p-5 border border-gray-200 rounded-lg'>
                    <h3 className='text-md font-semibold text-gray-700 mb-4 uppercase tracking-wide text-xs flex items-center gap-2'>
                        <FontAwesomeIcon icon={faUtensils} className='text-gray-400' />
                        Dịch vụ suất ăn
                    </h3>
                    <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                        <NestedMealArray control={control} register={register} errors={errors} />
                    </div>
                </div>

                {/* Nút bấm (Submit/Reset) */}
                <div className='flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200 sticky bottom-0 bg-white pb-2 -mx-6 px-6'>
                    <button
                        type='button'
                        onClick={handleResetClick} // SỬA: Chỉ gọi hàm này
                        className='inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50'
                    >
                        <FontAwesomeIcon icon={faRotate} />
                        Hủy
                    </button>
                    <button
                        type='submit'
                        className='inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700'
                    >
                        {isEditing ? <FontAwesomeIcon icon={faPenToSquare} /> : <FontAwesomeIcon icon={faPlus} />}
                        {isEditing ? 'Lưu thay đổi' : 'Tạo chuyến bay'}
                    </button>
                </div>
            </form>
        </div>
    )
}
