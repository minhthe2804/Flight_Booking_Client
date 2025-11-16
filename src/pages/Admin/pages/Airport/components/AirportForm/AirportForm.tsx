import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { airportSchema } from '~/utils/rules' // Import schema
import { useEffect, useMemo } from 'react'
import Input from '~/components/Input'
import SelectField from '~/components/SelectField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faRotate, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Country, Airport, AirportFormData } from '~/apis/airport.api'

// --- Dữ liệu mặc định (Trống) ---
const defaultValues: AirportFormData = {
    airport_id: 0,
    airport_code: '',
    airport_name: '',
    city: '',
    country_id: 0,
    airport_type: 'domestic'
}

// --- Props ---
interface AirportFormProps {
    editingAirport: Airport | null
    onSubmitForm: SubmitHandler<AirportFormData>
    onResetForm: () => void
    countries: Country[]
    isLoadingCountries: boolean
}

export default function AirportForm({
    editingAirport,
    onSubmitForm,
    onResetForm,
    countries,
    isLoadingCountries
}: AirportFormProps) {
    const isEditing = !!editingAirport

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<AirportFormData>({
        resolver: yupResolver(airportSchema),
        defaultValues: defaultValues
    })

    // Effect để reset form khi 'editingAirport' thay đổi
    useEffect(() => {
        if (editingAirport) {
            reset({
                airport_id: editingAirport.airport_id,
                airport_code: editingAirport.airport_code,
                airport_name: editingAirport.airport_name,
                city: editingAirport.city,
                country_id: editingAirport.country_id,
                airport_type: editingAirport.airport_type
            })
        } else {
            reset(defaultValues)
        }
    }, [editingAirport, reset])

    const handleResetClick = () => {
        // Reset về trống (default) và gọi onResetForm
        reset(defaultValues)
        onResetForm()
    }

    // Chuyển đổi 'countries' (API) sang 'options' (Select)
    const countryOptions = useMemo(() => {
        if (!countries) return []
        return countries.map((c) => ({
            value: c.country_id, // Gửi ID (number)
            label: c.country_name // 'Việt Nam'
        }))
    }, [countries])

    return (
        <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-5 text-gray-800'>
                {isEditing ? `Cập nhật Sân bay (ID: ${editingAirport?.airport_id})` : 'Thêm Sân bay mới'}
            </h2>

            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                    {/* Mã Sân bay */}
                    <Input
                        isFont
                        label='Mã Sân bay (Code)'
                        isRequired
                        register={register}
                        type='text'
                        name='airport_code'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400'
                        errorMessage={errors.airport_code?.message}
                    />
                    {/* Tên Sân bay */}
                    <Input
                        label='Tên Sân bay'
                        isFont
                        isRequired
                        register={register}
                        type='text'
                        name='airport_name'
                        className='md:col-span-2'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400'
                        errorMessage={errors.airport_name?.message}
                    />
                    {/* Thành phố */}
                    <Input
                        isFont
                        label='Thành phố'
                        isRequired
                        register={register}
                        type='text'
                        name='city'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400'
                        errorMessage={errors.city?.message}
                    />
                    {/* Quốc gia */}
                    <SelectField
                        isLabel
                        name='country_id'
                        control={control}
                        label='Quốc gia'
                        placeholder={isLoadingCountries ? 'Đang tải...' : 'Chọn quốc gia'}
                        options={countryOptions}
                    />
                    {/* Loại sân bay */}
                    <SelectField
                        isLabel
                        name='airport_type'
                        control={control}
                        label='Loại sân bay'
                        placeholder='Chọn loại'
                        options={[
                            { value: 'domestic', label: 'Nội địa' },
                            { value: 'international', label: 'Quốc tế' }
                        ]}
                    />
                </div>

                {/* Nút bấm */}
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
