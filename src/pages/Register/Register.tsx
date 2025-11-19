import PhoneInput from 'react-phone-number-input'
import { useMutation } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { backgroundLogin } from '~/assets/images/image'
import Button from '~/components/Button'
import Input from '~/components/Input'
import { path } from '~/constants/path'

import { schema, Schema } from '~/utils/rules'
import authApi from '~/apis/auth.api'
import { omit } from 'lodash'
import { AuthResponse } from '~/types/auth.type'
import { toast } from 'react-toastify'
import { setProfileFromLS } from '~/utils/auth'
import { isAxiosUnprocessableEntityError } from '~/utils/utils'
import { ErrorResponse } from '~/types/utils.type'
import { AppContext } from '~/contexts/app.context'

type FormData = Pick<Schema, 'first_name' | 'password' | 'confirm_password' | 'email' | 'phone' | 'last_name'>
const regiterSchema = schema.pick(['first_name', 'password', 'confirm_password', 'email', 'phone', 'last_name'])
export default function Register() {
    const { setIsAuthenticated } = useContext(AppContext)
    const [errorEmail, setErrorEmail] = useState<string>('')
    const [errorPassword, setErrorPassword] = useState<string>('')
    const {
        register,
        control,
        setError,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            confirm_password: '',
            password: ''
        },
        resolver: yupResolver(regiterSchema)
    })

    const registerAccountMutation = useMutation({
        mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
    })

    const navigate = useNavigate()

    const onSubmit = handleSubmit((data) => {
        const body = omit(data, ['confirm_password'])
        registerAccountMutation.mutate(body, {
            onSuccess: (data) => {
                console.log(data)
                const newData = data.data as unknown as AuthResponse
                toast.success('Bạn đã đăng kí thành công', { autoClose: 3000 })
                reset({ first_name: '', last_name: '', email: '', phone: '', password: '', confirm_password: '' })
                setIsAuthenticated(true)
                setProfileFromLS(newData.data.user)
                navigate(path.login)
            },
            onError: (error) => {
                if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
                    const formError = error.response?.data.data
                    if (formError) {
                        Object.keys(formError).forEach((key) => {
                            setError(key as keyof Omit<FormData, 'confirm_password'>, {
                                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                                type: 'Server'
                            })
                        })
                    }
                    // if (formError?.email) {
                    //     setError('email', {
                    //         message: formError.email,
                    //         type: 'Server'
                    //     })
                    // }
                    // if (formError?.password) {
                    //     setError('password', {
                    //         message: formError.password,
                    //         type: 'Server'
                    //     })
                    // }
                }
            }
        })
    })
    
    return (
        <div>
            <div
                className='bg-cover bg-no-repeat pt-[6px] pb-2 min-h-screen relative'
                style={{
                    backgroundImage: `url(${backgroundLogin})`
                }}
            >
                <div className='w-[450px] h-[800px] rounded-md shadow bg-[rgba(2,31,59,0.8)] absolute right-[20%] top-[50%] -translate-y-1/2 pb-4'>
                    <p className='text-[28px] font-medium text-center mt-5 text-white'>Đăng ký</p>
                    <form className='w-[400px] mx-auto' onSubmit={onSubmit}>
                        <Input
                            classNameError='text-red-500 text-[15px] mt-1 min-h-[24px]'
                            classNameInput='w-full outline-none border-[1px] border-[#ebebeb] rounded-[4px] py-[9px] px-4 placeholder:text-[15px] focus:border-blue-400 transition duration-300 ease-in text-[15px] text-[#555d6b] mt-2'
                            label='Họ'
                            placeholder='Hãy nhập họ của bạn'
                            register={register}
                            errorMessage={errors.last_name?.message}
                            name='last_name'
                            type='text'
                        />
                        <Input
                            classNameError='text-red-500 text-[15px] mt-1 min-h-[24px]'
                            classNameInput='w-full outline-none border-[1px] border-[#ebebeb] rounded-[4px] py-[9px] px-4 placeholder:text-[15px] focus:border-blue-400 transition duration-300 ease-in text-[15px] text-[#555d6b] mt-2'
                            label='Tên'
                            placeholder='Hãy nhập tên của bạn'
                            register={register}
                            errorMessage={errors.first_name?.message}
                            name='first_name'
                            type='text'
                        />
                        <Input
                            classNameError='text-red-500 text-[15px] mt-1 min-h-[24px]'
                            classNameInput='w-full outline-none border-[1px] border-[#ebebeb] rounded-[4px] py-[9px] px-4 placeholder:text-[15px] focus:border-blue-400 transition duration-300 ease-in text-[15px] text-[#555d6b] mt-2'
                            register={register}
                            errorMessage={errors.email?.message}
                            name='email'
                            type='text'
                            label='Email'
                            errorEmail={errorEmail}
                            inputEmail
                            setErrorEmail={setErrorEmail}
                            placeholder='Nhập Email của bạn'
                        />
                        <div className=''>
                            <label className='text-[#dddddf] text-[15px]'>Điện thoại di động</label>
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
                        <Input
                            classNameError='text-red-500 text-[15px] mt-1 min-h-[24px]'
                            classNameInput='w-full outline-none border-[1px] border-[#ebebeb] rounded-[4px] py-[9px] px-4 placeholder:text-[15px] focus:border-blue-400 transition duration-300 ease-in text-[15px] text-[#555d6b] mt-2'
                            label='Mật khẩu'
                            register={register}
                            errorMessage={errors.password?.message}
                            name='password'
                            type='password'
                            placeholder='Mật khẩu'
                            errorPassword={errorPassword}
                            inputPassword
                            setErrorPassword={setErrorPassword}
                        />
                        <Input
                            classNameError='text-red-500 text-[15px] mt-1 min-h-[24px]'
                            classNameInput='w-full outline-none border-[1px] border-[#ebebeb] rounded-[4px] py-[9px] px-4 placeholder:text-[15px] focus:border-blue-400 transition duration-300 ease-in text-[15px] text-[#555d6b] mt-2'
                            label='Nhập lại mật khẩu'
                            register={register}
                            name='confirm_password'
                            placeholder='Nhập lại mật khẩu'
                            type='password'
                            errorMessage={errors.confirm_password?.message}
                        />
                        <Button
                            className={classNames(
                                'w-full py-[9px] rounded-md bg-[#0d89f7] text-[16px] text-white hover:bg-[#3985c9] transition duration-200 ease-in flex items-center justify-center mt-8',
                                {
                                    // 'w-[126px] py-[9px] bg-[#ff3237] opacity-[0.8] rounded-[30px] text-[14px] font-[600] text-[#333333] flex items-center justify-center':
                                    //     updateCartMutation.isPending
                                }
                            )}
                            // onClick={handleUpdate}
                            // isLoading={updateCartMutation.isPending}
                            // disabled={updateCartMutation.isPending}
                        >
                            Đăng Ký
                        </Button>

                        <div className='flex items-center gap-2 mt-3'>
                            <p className='text-[16px] text-[#dddddf]'>Bạn đã có tài khoản?</p>
                            <Link to={path.login} className='text-[16px] text-[#0d89f7] font-semibold'>
                                Đăng nhập
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
