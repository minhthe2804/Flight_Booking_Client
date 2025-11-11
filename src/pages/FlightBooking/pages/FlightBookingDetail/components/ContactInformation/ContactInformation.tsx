// src/components/ContactInformation/ContactInformation.tsx

import React from 'react'
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form'
import Input from '~/components/Input'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import { ContactFormData } from '~/utils/rules'
import './ContactInformation.css' // Đảm bảo file này có style cho PhoneInput

interface ContactFromProps {
    errors?: FieldErrors<Partial<ContactFormData>>
    control: Control<any> // Nên thay 'any' bằng kiểu BookingFormData
    register: UseFormRegister<any> // Nên thay 'any' bằng kiểu BookingFormData
    setErrorEmail: React.Dispatch<React.SetStateAction<string>>
    errorEmail: string
}

export default function ContactInformation({ control, errors, register, setErrorEmail, errorEmail }: ContactFromProps) {
    return (
        <div>
            {/* Nên dùng style nhất quán với PassengerInFormation (mt-5, bg-white, v.v.) */}
            <div className='w-full bg-white rounded-lg shadow-sm border border-gray-200 px-4 pt-3 pb-6'>
                <h1 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3'>
                    Thông tin liên hệ (nhận vé/phiếu thanh toán)
                </h1>
                <div className='mt-4'>
                    {/* Sử dụng grid để responsive tốt hơn */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6'>
                        <div className='w-full'>
                            <Input
                                classNameError='text-red-500 text-[14px] mt-1 min-h-[20px]'
                                classNameInput='text-black mt-2 w-full outline-none border border-gray-300 rounded-[4px] py-2 px-3 focus:border-blue-500 transition duration-200'
                                register={register}
                                errorMessage={errors?.lastnameContact?.message}
                                
                                name='contact.lastnameContact'
                                type='text'
                                label='Họ (vd: Nguyen)'
                                isFont
                                isRequired
                                placeholder='như trên CCCD (không dấu)'
                            />
                        </div>
                        <div className='w-full'>
                            <Input
                                classNameError='text-red-500 text-[14px] mt-1 min-h-[20px]'
                                classNameInput='text-black mt-2 w-full outline-none border border-gray-300 rounded-[4px] py-2 px-3 focus:border-blue-500 transition duration-200'
                                register={register}
                                errorMessage={errors?.nameContact?.message}
                                name='contact.nameContact'
                                type='text'
                                label='Tên Đệm & Tên (vd: Thi Ngoc Anh)'
                                isFont
                                isRequired
                                placeholder='như trên CCCD (không dấu)'
                            />
                        </div>
                        <div className='w-full'>
                            <label className='text-gray-700 font-semibold text-[15px]'>
                                Điện thoại di động
                                <span className='text-red-500'>*</span>
                            </label>
                            <Controller
                                name='contact.phone'
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
                            <p className='text-red-500 text-[14px] mt-[2px] min-h-[20px]'>{errors?.phone?.message}</p>
                        </div>
                        <div className='w-full'>
                            <Input
                                classNameError='text-red-500 text-[14px] mt-1 min-h-[20px]'
                                classNameInput='text-black mt-2 w-full outline-none border border-gray-300 rounded-[4px] py-2 px-3 focus:border-blue-500 transition duration-200'
                                register={register}
                                errorMessage={errors?.email?.message}
                                // SỬA: Thêm prefix 'contact.'
                                name='contact.email'
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
