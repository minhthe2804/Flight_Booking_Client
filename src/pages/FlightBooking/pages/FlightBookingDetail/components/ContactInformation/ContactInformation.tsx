import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form'
import Input from '~/components/Input'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import { ContactFormData } from '~/utils/rules'
import './ContactInformation.css'

interface ContactFromProps {
    // Chúng ta dùng Partial vì form cha có thể có nhiều trường hơn
    errors: FieldErrors<Partial<ContactFormData>>
    control: Control<any>
    register: UseFormRegister<any>
    setErrorEmail: React.Dispatch<React.SetStateAction<string>>
    errorEmail: string
}

export default function ContactInformation({ control, errors, register, setErrorEmail, errorEmail }: ContactFromProps) {
    return (
        <div>
            <div className='w-full rounded-md px-3 pt-3 pb-6 border-2 border-[#cdcdcd]'>
                <h1 className='text-lg font-semibold text-black'>Thông tin liên hệ(nhận vé/phiếu thanh toán)</h1>
                <div className='mt-4'>
                    <div className='w-full flex flex-wrap items-center gap-x-5 gap-y-2'>
                        <div className='w-[399px]'>
                            <Input
                                classNameError='text-red-500 text-[14px] mt-[2px] min-h-[20px]'
                                classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[12px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]'
                                register={register}
                                errorMessage={errors.lastnameContact?.message}
                                name='lastnameContact'
                                type='text'
                                label='Họ (vd: Nguyen)'
                                isFont
                                isRequired
                                placeholder='như trên CCCD (không dấu)'
                            />
                        </div>
                        <div className='w-[399px]'>
                            <Input
                                classNameError='text-red-500 text-[14px] mt-[2px] min-h-[20px]'
                                classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[12px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]'
                                register={register}
                                errorMessage={errors.nameContact?.message}
                                name='nameContact'
                                type='text'
                                label='Tên Đệm & Tên (vd: Thi Ngoc Anh)'
                                isFont
                                isRequired
                                placeholder='như trên CCCD (không dấu)'
                            />
                        </div>
                        <div className='w-[399px]'>
                            <label className='text-gray-700 font-semibold text-[15px]'>
                                Điện thoại di động
                                <span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='phone'
                                control={control}
                                render={({ field }) => (
                                    <PhoneInput
                                        {...field} // Truyền tất cả props của field (onChange, onBlur, value)
                                        placeholder='VD: 901 234 567'
                                        defaultCountry='VN' // Quốc gia mặc định
                                        international
                                        className='mt-2 text-black ' // Thêm class để CSS
                                    />
                                )}
                            />
                            <p className='text-red-500 text-[14px] mt-[2px] min-h-[20px]'>{errors.phone?.message}</p>
                        </div>
                        <div className='w-[399px]'>
                            <Input
                                classNameError='text-red-500 text-[14px] mt-[2px] min-h-[20px]'
                                classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[12px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]'
                                register={register}
                                errorMessage={errors.email?.message}
                                name='email'
                                type='text'
                                label='Email'
                                errorEmail={errorEmail}
                                inputEmail
                                setErrorEmail={setErrorEmail}
                                isFont
                                isRequired
                                placeholder='VD: email@example.com'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
