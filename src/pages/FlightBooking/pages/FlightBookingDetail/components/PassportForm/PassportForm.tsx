import React from 'react'
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import { PassportFormData } from '~/utils/rules'

// Giả sử bạn đã có các component này từ trước
import Input from '~/components/Input' // Component Input tuỳ chỉnh
import SelectField from '~/components/SelectField' // Component chọn quốc gia có tìm kiếm
import PassportExpiryDateInput from '~/components/PassportExpiryDateInput/PassportExpiryDateInput'

const countryOptions = [
    { value: 'Việt Nam', label: 'Việt Nam' },
    { value: 'Hoa Kỳ', label: 'Hoa Kỳ (United States)' },
    { value: 'Nhật Bản', label: 'Nhật Bản (Japan)' },
    { value: 'Hàn Quốc', label: 'Hàn Quốc (South Korea)' },
    { value: 'Khác', label: 'Khác (Other)' }
]

// Định nghĩa props cho component
interface PassportFormProps {
    // Chúng ta dùng Partial vì form cha có thể có nhiều trường hơn
    errors: FieldErrors<Partial<PassportFormData>>
    control: Control<any>
    register: UseFormRegister<any>
}

const PassportForm: React.FC<PassportFormProps> = ({ errors, control, register }) => {
    return (
        <div className='mt-4'>
            <h2 className='text-base font-semibold mb-4 text-gray-800'>Thông tin hộ chiếu</h2>

            {/* Ô thông báo */}
            <div className='bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-sm'>
                <p className='text-gray-700'>
                    Nếu hành khách này chưa có hộ chiếu hoặc hộ chiếu đã hết hạn, bạn vẫn có thể tiếp tục đặt vé này.
                </p>
                <a href='#' className='text-blue-600 font-semibold hover:underline'>
                    Tìm hiểu thêm
                </a>
            </div>

            <div className='w-[450px]'>
                {/* Trường Số hộ chiếu */}
                <Input
                    classNameError='text-red-500 text-[14px] mt-[2px] min-h-[20px]'
                    classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[12px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]'
                    name='passportNumber'
                    type='text'
                    label='Số hộ chiếu'
                    register={register}
                    errorMessage={errors.passportNumber?.message}
                    isFont
                    isRequired
                />
                {!errors.passportNumber?.message && (
                    <p className='text-sm text-gray-500'>
                        Đối với hành khách là trẻ em hoặc trẻ sơ sinh, vui lòng nhập giấy tờ tùy thân của người giám hộ
                        đi cùng trẻ. (Vui lòng đảm bảo chỉ nhập số trong trường này)
                    </p>
                )}
            </div>
            <div className='w-[360px] mt-5'>
                <SelectField
                    name='issuingCountry'
                    control={control}
                    label='Quốc gia cấp'
                    isNationality
                    placeholder='Chọn quốc gia'
                    options={countryOptions}
                />
            </div>
            <div className='w-[399px] mt-3'>
                <PassportExpiryDateInput name='expiryDate' control={control} label='Ngày hết hạn' />
            </div>
        </div>
    )
}

export default PassportForm
