import { Control, FieldErrors, UseFormRegister } from 'react-hook-form'

import DateOfBirthInput from '~/components/DateOfBirthInput'
import Input from '~/components/Input'
import SelectField from '~/components/SelectField'
import { PassengerFormData, PassportFormData } from '~/utils/rules'
import PassportForm from '../PassportForm/PassportForm'
import { Passenger } from '~/types/passenger'
import { countryApi } from '~/apis/country.api'
import { useQuery } from '@tanstack/react-query'

// Dữ liệu cho các lựa chọn
const titleOptions = [
    { value: 'Mr', label: 'Ông' },
    { value: 'Mrs', label: 'Bà' },
    { value: 'Ms', label: 'Cô' }
]

const genderOptions = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' }
]

interface PassengerInFormationFromProps {
    control: Control<any>
    register: UseFormRegister<any>
    errors?: FieldErrors<Partial<PassengerFormData & PassportFormData>>
    index: number
    passenger: Passenger
}

export default function PassengerInFormation({
    control,
    errors,
    register,
    index,
    passenger
}: PassengerInFormationFromProps) {
    
    const { data: countriesData } = useQuery({
        queryKey: ['countries'],
        queryFn: () => countryApi.getCountriesUser().then((res) => res.data.data),
        staleTime: Infinity, // Cache vĩnh viễn
        refetchOnWindowFocus: false
    })

    const countries = countriesData || []
    return (
        // Sử dụng mt-5 để tạo khoảng cách
        <div className='mt-5 bg-white rounded-lg shadow-sm border border-gray-200'>
            {/* --- Hiển thị tên hành khách động --- */}
            <div className='px-4 py-3 bg-gray-50 rounded-t-lg border-b border-gray-200'>
                <h3 className='text-lg font-semibold text-gray-800'>{passenger.fullName}</h3>
            </div>

            <div className='p-4'>
                <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6'>
                    <p className='text-sm text-yellow-800'>
                        <span className='font-bold'>Vui lòng chú ý cho những điều sau đây:</span>
                        <br />
                        ⚠️ Bạn phải nhập chính xác tên như trong CCCD của mình.
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6'>
                    {/* --- Hàng 1 --- */}
                    <div className='w-full'>
                        <SelectField
                            name={`passengers.${index}.title`}
                            control={control}
                            label='Danh xưng'
                            placeholder='Chọn danh xưng'
                            options={titleOptions}
                        />
                    </div>
                    <div className='w-full'>
                        <SelectField
                            name={`passengers.${index}.gender`}
                            control={control}
                            label='Giới tính'
                            placeholder='Chọn giới tính'
                            options={genderOptions}
                        />
                    </div>

                    {/* --- Hàng 2 --- */}
                    <div className='w-full'>
                        <Input
                            classNameError='text-red-500 text-[14px] mt-1 min-h-[20px]'
                            classNameInput='text-black mt-2 w-full outline-none border border-gray-300 rounded-[4px] py-2 px-3 focus:border-blue-500 transition duration-200'
                            register={register}
                            errorMessage={errors?.lastnamePassenger?.message}
                            name={`passengers.${index}.lastnamePassenger`} // Thêm index
                            type='text'
                            label='Họ (vd: Nguyen)'
                            isFont
                            isRequired
                            placeholder='Như trên CCCD (không dấu)'
                        />
                    </div>
                    <div className='w-full'>
                        <Input
                            type='text'
                            classNameError='text-red-500 text-[14px] mt-1 min-h-[20px]'
                            classNameInput='text-black mt-2 w-full outline-none border border-gray-300 rounded-[4px] py-2 px-3 focus:border-blue-500 transition duration-200'
                            register={register}
                            errorMessage={errors?.namePassenger?.message}
                            name={`passengers.${index}.namePassenger`}
                            label='Tên Đệm & Tên (vd: Thi Ngoc Anh)'
                            placeholder='Như trên CCCD (không dấu)'
                            isFont
                            isRequired
                        />
                    </div>

                    {/* --- Hàng 3 --- */}
                    <div className='w-full'>
                        <DateOfBirthInput
                            name={`passengers.${index}.date_of_birth`}
                            control={control}
                            label='Ngày sinh'
                        />
                    </div>
                    <div>
                        <SelectField
                            name={`passengers.${index}.nationality`}
                            control={control}
                            label='Quốc tịch'
                            placeholder='Chọn quốc tịch'
                            options={countries}
                            countryApi
                        />
                    </div>

                    {/* --- Hàng 4 (CCCD) --- */}
                    {passenger.type !== 'Em bé' && (
                        <div className='w-full'>
                            <Input
                                type='text'
                                classNameError='text-red-500 text-[14px] mt-1 min-h-[20px]'
                                classNameInput='text-black mt-2 w-full outline-none border border-gray-300 rounded-[4px] py-2 px-3 focus:border-blue-500 transition duration-200'
                                register={register}
                                errorMessage={errors?.citizen_id?.message}
                                name={`passengers.${index}.citizen_id`}
                                label='Số căn cước công dân'
                                placeholder='như trên CCCD'
                                isFont
                                isRequired
                            />
                        </div>
                    )}
                </div>
                <PassportForm control={control} register={register} errors={errors} index={index} />
            </div>
        </div>
    )
}
