import { Control, FieldErrors, UseFormRegister } from 'react-hook-form'

import DateOfBirthInput from '~/components/DateOfBirthInput'
import Input from '~/components/Input'
import SelectField from '~/components/SelectField'
import { PassengerFormData } from '~/utils/rules'
import PassportForm from '../PassportForm/PassportForm'

// Dữ liệu cho các lựa chọn
const titleOptions = [
    { value: 'Ông', label: 'Ông' },
    { value: 'Bà', label: 'Bà' },
    { value: 'Cô', label: 'Cô' }
]
const countryOptions = [
    { value: 'Việt Nam', label: 'Việt Nam' },
    { value: 'Hoa Kỳ', label: 'Hoa Kỳ (United States)' },
    { value: 'Nhật Bản', label: 'Nhật Bản (Japan)' },
    { value: 'Hàn Quốc', label: 'Hàn Quốc (South Korea)' },
    { value: 'Khác', label: 'Khác (Other)' }
]

interface PassengerInFormationFromProps {
    // Chúng ta dùng Partial vì form cha có thể có nhiều trường hơn
    errors: FieldErrors<Partial<PassengerFormData>>
    control: Control<any>
    register: UseFormRegister<any>
}
export default function PassengerInFormation({ control, errors, register }: PassengerInFormationFromProps) {
    return (
        <div className='mt-4'>
            <div className='w-full rounded-md px-3 pt-3 pb-10 border-2 border-[#cdcdcd]'>
                <h2 className='text-xl font-semibold mb-4 text-gray-800'>Thông tin hành khách</h2>

                {/* Khối thông tin cho Người lớn 1 */}
                <div>
                    <h3 className='text-lg font-semibold mb-4 text-gray-800'>Người lớn 1</h3>

                    {/* Ô cảnh báo */}
                    <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6'>
                        <p className='text-sm text-yellow-800'>
                            <span className='font-bold'>Vui lòng chú ý cho những điều sau đây:</span>
                            <br />
                            ⚠️ Bạn phải nhập chính xác tên như trong CCCD của mình.
                        </p>
                    </div>

                    {/* Lưới chứa các trường input */}

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6'>
                        {/* --- Trường Danh xưng --- */}
                        <SelectField
                            name='title'
                            control={control}
                            label='Danh xưng'
                            placeholder='Chọn danh xưng'
                            options={titleOptions}
                        />

                        {/* Khoảng trống để giữ layout 2 cột */}
                        <div className='hidden md:block'></div>

                        {/* --- Trường Họ --- */}
                        <div className='w-[399px]'>
                            <Input
                                classNameError='text-red-500 text-[14px] mt-[2px] min-h-[20px]'
                                classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[12px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]'
                                register={register}
                                errorMessage={errors.lastnamePassenger?.message}
                                name='lastnamePassenger'
                                type='text'
                                label='Họ (vd: Nguyen)'
                                isFont
                                isRequired
                                placeholder='như trên CCCD (không dấu)'
                            />
                        </div>

                        {/* --- Trường Tên Đệm & Tên --- */}
                        <div className='w-[399px]'>
                            <Input
                                classNameError='text-red-500 text-[14px] mt-[2px] min-h-[20px]'
                                classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[12px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]'
                                register={register}
                                errorMessage={errors.namePassenger?.message}
                                name='namePassenger'
                                type='text'
                                label='Tên Đệm & Tên (vd: Thi Ngoc Anh)'
                                isFont
                                isRequired
                                placeholder='như trên CCCD (không dấu)'
                            />
                        </div>

                        <div className='w-[399px]'>
                            <DateOfBirthInput name='date_of_birth' control={control} label='Ngày sinh' />
                        </div>
                        {/* --- Trường Quốc tịch --- */}
                        <div>
                            <SelectField
                                name='nationality'
                                control={control}
                                label='Quốc tịch'
                                isNationality
                                placeholder='Chọn quốc tịch'
                                options={countryOptions}
                            />
                        </div>
                    </div>

                    <PassportForm control={control} register={register} errors={errors} />
                </div>
            </div>
        </div>
    )
}
