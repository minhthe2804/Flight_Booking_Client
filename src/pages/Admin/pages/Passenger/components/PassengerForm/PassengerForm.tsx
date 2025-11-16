import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { customerSchemaPassenger } from '~/utils/rules'
import { useEffect, useMemo } from 'react'
import Input from '~/components/Input'
import { PassengerAdmin as Passenger, passengerTypes, titles, genders } from '~/types/passenger'
import SelectField from '~/components/SelectField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faPlus, faRotate } from '@fortawesome/free-solid-svg-icons'
import {} from '~/apis/country.api' // Import kiểu Country
import {} from '../../../Airport/Airport'
import { Country } from '~/apis/airport.api'

// --- 1. Dữ liệu mặc định (khớp với Passenger.ts và customerSchema) ---
const defaultValues: Passenger = {
    passenger_id: 0,
    last_name: '',
    first_name: '',
    title: '',
    gender: 'male',
    citizen_id: '',
    passenger_type: 'adult',
    date_of_birth: '',
    nationality: 'VN',
    passport_number: '',
    passport_expiry: '',
    passport_issuing_country: ''
}

// --- 2. Định nghĩa Props (Như bạn cung cấp) ---
interface PassengerFormProps {
    editingPassenger: Passenger | null
    onSubmitForm: SubmitHandler<Passenger>
    onResetForm: () => void
    countries: Country[] // Thêm: Nhận props
    isLoadingCountries: boolean // Thêm: Nhận props
}

// --- 3. Component (Hoàn chỉnh) ---
export default function PassengerForm({
    editingPassenger,
    onSubmitForm,
    onResetForm,
    countries, // Lấy props
    isLoadingCountries // Lấy props
}: PassengerFormProps) {
    const isEditing = !!editingPassenger

    // Khởi tạo react-hook-form
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<Passenger>({
        resolver: yupResolver(customerSchemaPassenger),
        defaultValues: defaultValues
    })

    useEffect(() => {
        if (editingPassenger) {
            reset({
                ...editingPassenger,
                citizen_id: editingPassenger.citizen_id || '',
                passport_number: editingPassenger.passport_number || '',
                passport_expiry: editingPassenger.passport_expiry || '',
                passport_issuing_country: editingPassenger.passport_issuing_country || ''
            })
        } else {
            reset(defaultValues) // Reset về form trống
        }
    }, [editingPassenger, reset])

    // Hàm xử lý nút Làm mới
    const handleResetClick = () => {
        reset(defaultValues)
        onResetForm()
    }

    // Chuyển đổi 'countries' (API) sang 'options' (Select)
    const countryOptions = useMemo(() => {
        if (!countries) return []
        return countries?.map((c) => ({
            value: c.country_code, // 'VN'
            label: c.country_name // 'Việt Nam'
        }))
    }, [countries])

    return (
        <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-5 text-gray-800'>{'Cập nhật hành khách'}</h2>

            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                    {/* Họ */}
                    <Input
                        label='Họ'
                        isRequired
                        isFont
                        placeholder='VD: Nguyen'
                        register={register}
                        type='text'
                        name='last_name'
                        classNameError='text-red-500 text-[14px] mt-1 min-h-[20px]'
                        classNameInput='text-black mt-2 w-full outline-none border border-gray-300 rounded-[4px] py-2 px-3 focus:border-blue-500 transition duration-200'
                        errorMessage={errors.last_name?.message}
                        disabled={!isEditing}
                    />
                    {/* Tên */}
                    <Input
                        label='Tên'
                        isRequired
                        isFont
                        placeholder='VD: A'
                        register={register}
                        type='text'
                        name='first_name'
                        classNameError='text-red-500 text-[14px] mt-1 min-h-[20px]'
                        classNameInput='text-black mt-2 w-full outline-none border border-gray-300 rounded-[4px] py-2 px-3 focus:border-blue-500 transition duration-200'
                        errorMessage={errors.first_name?.message}
                        disabled={!isEditing}
                    />
                    {/* Danh xưng */}
                    <SelectField
                        isLabel
                        name='title'
                        control={control}
                        label='Danh xưng'
                        placeholder='Chọn danh xưng'
                        options={titles}
                        disabled={!isEditing}
                    />
                    {/* Giới tính */}
                    <SelectField
                        isLabel
                        name='gender'
                        control={control}
                        label='Giới tính'
                        placeholder='Chọn giới tính'
                        options={genders}
                        disabled={!isEditing}
                    />
                    {/* Ngày sinh */}
                    <div className=''>
                        <label htmlFor='dob' className='block text-[15px] font-medium text-gray-700'>
                            Ngày sinh <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='date'
                            id='dob'
                            {...register('date_of_birth')}
                            className={`mt-2 w-full outline-none border-[1px] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px] ${
                                errors.date_of_birth ? 'border-red-500' : 'border-[#cdcdcd]'
                            }`}
                            disabled={!isEditing}
                        />
                        {errors.date_of_birth && (
                            <p className='text-red-500 text-[14px] mt-[2px] min-h-[20px]'>
                                {errors.date_of_birth.message}
                            </p>
                        )}
                    </div>
                    {/* Quốc tịch */}
                    <SelectField
                        isLabel
                        name='nationality'
                        control={control}
                        label='Quốc tịch'
                        placeholder={isLoadingCountries ? 'Đang tải...' : 'Chọn quốc tịch'}
                        options={countryOptions}
                        disabled={!isEditing}
                    />
                    {/* Loại hành khách */}
                    <SelectField
                        isLabel
                        name='passenger_type'
                        control={control}
                        label='Loại hành khách'
                        placeholder='Chọn loại hành khách'
                        options={passengerTypes}
                        disabled={!isEditing}
                    />
                    {/* CCCD */}
                    <Input
                        label='CCCD'
                        isFont
                        placeholder='VD: 123456789000'
                        register={register}
                        type='text'
                        name='citizen_id'
                        classNameError='text-red-500 text-[14px] mt-[2px] min-h-[20px]'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[8px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]'
                        errorMessage={errors.citizen_id?.message}
                        disabled={!isEditing}
                    />
                    {/* Số hộ chiếu */}
                    <Input
                        label='Số hộ chiếu'
                        isFont
                        placeholder='VD: C1234567'
                        register={register}
                        type='text'
                        name='passport_number'
                        classNameError='text-red-500 text-[14px] mt-[2px] min-h-[20px]'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]'
                        errorMessage={errors.passport_number?.message}
                        disabled={!isEditing}
                    />
                    {/* Nơi cấp hộ chiếu */}
                    <SelectField
                        isLabel
                        name='passport_issuing_country'
                        control={control}
                        label='Nơi cấp hộ chiếu'
                        placeholder={isLoadingCountries ? 'Đang tải...' : 'Chọn quốc gia'}
                        options={countryOptions} // Dùng options động
                        disabled={!isEditing}
                    />
                    {/* Ngày hết hạn hộ chiếu */}
                    <div>
                        <label htmlFor='passport_expiry' className='block text-base font-medium text-gray-700'>
                            Ngày hết hạn hộ chiếu
                        </label>
                        <input
                            type='date'
                            id='passport_expiry'
                            {...register('passport_expiry')}
                            className={`mt-2 w-full outline-none border-[1px] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px] ${
                                errors.passport_expiry ? 'border-red-500' : 'border-[#cdcdcd]'
                            }`}
                            disabled={!isEditing}
                        />
                        {errors.passport_expiry && (
                            <p className='text-red-500 text-[14px] mt-[2px] min-h-[20px]'>
                                {errors.passport_expiry.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Nút bấm */}
                <div className='flex justify-start gap-3 mt-6'>
                    <button
                        type='submit'
                        className={`${!isEditing ? 'opacity-70' : 'hover:bg-blue-700'} inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm  transition duration-200 ease-in`}
                        disabled={!isEditing}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className='text-white text-base' />

                        {'Cập nhật'}
                    </button>
                    <button
                        type='button'
                        onClick={handleResetClick}
                        disabled={!isEditing}
                        className={`${!isEditing ? 'opacity-70' : 'hover:bg-gray-400'} inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white font-medium rounded-md shadow-sm transition duration-200 ease-in`}
                    >
                        <FontAwesomeIcon icon={faRotate} className='text-white text-base' />
                        Làm mới
                    </button>
                </div>
            </form>
        </div>
    )
}
