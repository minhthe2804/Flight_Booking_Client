import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { airplaneSchema } from '~/utils/rules' // Import schema
import { useEffect, useMemo } from 'react'
import Input from '~/components/Input'
import SelectField from '~/components/SelectField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faRotate, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Aircraft, AircraftFormData, Airline } from '~/apis/aircraft.api'

// --- SỬA: Dữ liệu mặc định (khớp schema mới) ---
const defaultValues: AircraftFormData = {
    aircraft_id: 0,
    model: '',
    airline_id: 0,
    total_seats: 0,
    business_seats: 0,
    economy_seats: 0,
    aircraft_type: null // Sửa: Dùng null
}

// --- Props (Giữ nguyên) ---
interface AircraftFormProps {
    editingAircraft: Aircraft | null
    onSubmitForm: SubmitHandler<AircraftFormData>
    onResetForm: () => void
    airlines: Airline[]
    isLoadingAirlines: boolean
}

export default function AircraftForm({
    editingAircraft,
    onSubmitForm,
    onResetForm,
    airlines,
    isLoadingAirlines
}: AircraftFormProps) {
    const isEditing = !!editingAircraft

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<AircraftFormData>({
        resolver: yupResolver(airplaneSchema),
        defaultValues: defaultValues
    })

    // SỬA: Effect (khớp schema mới)
    useEffect(() => {
        if (editingAircraft) {
            reset({
                aircraft_id: editingAircraft.aircraft_id,
                model: editingAircraft.model,
                airline_id: editingAircraft.airline_id,
                total_seats: editingAircraft.total_seats,
                business_seats: editingAircraft.business_seats,
                economy_seats: editingAircraft.economy_seats,
                aircraft_type: editingAircraft.aircraft_type || null
            })
        } else {
            reset(defaultValues)
        }
    }, [editingAircraft, reset])

    const handleResetClick = () => {
        reset(defaultValues)
        onResetForm()
    }

    const airlineOptions = useMemo(() => {
        if (!airlines) return []
        return airlines.map((a) => ({
            value: a.airline_id, // Gửi ID (number)
            label: a.airline_name // 'Vietnam Airlines'
        }))
    }, [airlines])

    return (
        <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-5 text-gray-800'>
                {isEditing ? `Cập nhật Máy bay (ID: ${editingAircraft?.aircraft_id})` : 'Thêm Máy bay mới'}
            </h2>

            <form onSubmit={handleSubmit(onSubmitForm)}>
                {/* SỬA: Sắp xếp lại Grid */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                    {/* Model */}
                    <Input
                        isFont
                        label='Tên (Model)'
                        isRequired
                        register={register}
                        type='text'
                        name='model'
                        placeholder='VD: 787-9 Dreamliner'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400'
                        errorMessage={errors.model?.message}
                    />
                    {/* Loại máy bay (Type) */}
                    <Input
                        isFont
                        label='Loại máy bay'
                        // SỬA: Không bắt buộc
                        register={register}
                        type='text'
                        name='aircraft_type'
                        placeholder='VD: Narrow-body'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400'
                        errorMessage={errors.aircraft_type?.message}
                    />
                    {/* Hãng bay */}
                    <SelectField
                        name='airline_id'
                        control={control}
                        label='Hãng hàng không'
                        placeholder={isLoadingAirlines ? 'Đang tải...' : 'Chọn hãng bay'}
                        options={airlineOptions}
                    />

                    {/* Tổng số ghế */}
                    <Input
                        isFont
                        label='Tổng số ghế'
                        isRequired
                        register={register}
                        type='number'
                        name='total_seats'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400'
                        errorMessage={errors.total_seats?.message}
                    />
                    {/* Ghế Business */}
                    <Input
                        isFont
                        label='Số ghế Business'
                        isRequired
                        register={register}
                        type='number'
                        name='business_seats'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400'
                        errorMessage={errors.business_seats?.message}
                    />
                    {/* Ghế Economy */}
                    <Input
                        isFont
                        label='Số ghế Economy'
                        isRequired
                        register={register}
                        type='number'
                        name='economy_seats'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400'
                        errorMessage={errors.economy_seats?.message}
                    />
                </div>

                {/* Nút bấm (Giữ nguyên) */}
                <div className='flex justify-start gap-3 mt-6'>
                    <button
                        type='submit'
                        className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 transition duration-200 ease-in'
                    >
                        {isEditing ? (
                            <FontAwesomeIcon icon={faPenToSquare} className='text-white text-base' />
                        ) : (
                            <FontAwesomeIcon icon={faPlus} className='text-white text-base' />
                        )}
                        {isEditing ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                    <button
                        type='button'
                        onClick={handleResetClick}
                        className='inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white font-medium rounded-md shadow-sm hover:bg-gray-600 transition duration-200 ease-in'
                    >
                        <FontAwesomeIcon icon={faRotate} className='text-white text-base' />
                        {isEditing ? 'Hủy' : 'Làm mới'}
                    </button>
                </div>
            </form>
        </div>
    )
}
