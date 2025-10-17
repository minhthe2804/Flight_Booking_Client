import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faG } from '@fortawesome/free-solid-svg-icons'

import { backgroundLogin } from '~/assets/images/image'
import Input from '~/components/Input'
import { schema, Schema } from '~/utils/rules'
import classNames from 'classnames'
import Button from '~/components/Button'
import { Link } from 'react-router-dom'
import { path } from '~/constants/path'
import { AppContext } from '~/contexts/app.context'
import { useMutation } from '@tanstack/react-query'
import authApi from '~/apis/auth.api'
import { AuthResponse } from '~/types/auth.type'
import { isAxiosUnprocessableEntityError } from '~/utils/utils'
import { ErrorResponse } from '~/types/utils.type'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])
export default function Login() {
    // const { setIsAuthenticated, setProfile } = useContext(AppContext)
    const [errorEmail, setErrorEmail] = useState<string>('')
    const [errorPassword, setErrorPassword] = useState<string>('')
    const [isMemorize, setIsMemorize] = useState<boolean>(false)

    const { setIsAuthenticated, setProfile } = useContext(AppContext)
    const navigate = useNavigate()
    const {
        register,
        reset,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        defaultValues: {
            email: '',
            password: ''
        },
        resolver: yupResolver(loginSchema)
    })

    const loginMutation = useMutation({
        mutationFn: (body: FormData) => authApi.login(body)
    })

    const onSubmit = handleSubmit((data) => {
        loginMutation.mutate(data, {
            onSuccess: (data) => {
                const newData = data.data as AuthResponse
                toast.success('Đăng nhập thành công', { autoClose: 3000 })
                reset({ email: '', password: '' })
                setIsAuthenticated(true)
                setProfile(newData.data.user)
                navigate(path.home)
            },
            onError: (error) => {
                if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
                    const formError = error.response?.data.data
                    if (formError) {
                        Object.keys(formError).forEach((key) => {
                            setError(key as keyof FormData, {
                                message: formError[key as keyof FormData],
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
                <div className='w-[450px] h-[540px] rounded-md shadow bg-[rgba(2,31,59,0.8)] absolute right-[20%] top-[50%] -translate-y-1/2'>
                    <p className='text-[28px] font-medium text-center mt-5 text-white'>Đăng nhập</p>
                    <form className='w-[400px] mx-auto' onSubmit={onSubmit}>
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
                        <Input
                            classNameError='text-red-500 text-[15px] mt-1 min-h-[20px]'
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

                        <div className='flex items-center gap-2 w-1/2 pl-1 mt-1'>
                            <label className='flex items-center cursor-pointer relative'>
                                <input
                                    type='checkbox'
                                    checked={isMemorize}
                                    onChange={(e) => setIsMemorize(e.target.checked)}
                                    className='absolute opacity-0 w-0 h-0' // Ẩn checkbox gốc
                                />
                                <div
                                    className={
                                        isMemorize
                                            ? 'w-5 h-5 bg-[#0194f3] border-2 border-gray-300 rounded-md flex items-center mr-2 transition-all duration-200 '
                                            : 'w-5 h-5 bg-white border-2 border-gray-300 rounded-md flex items-center mr-2 transition-all duration-200'
                                    }
                                >
                                    {/* Custom icon */}
                                    {isMemorize && (
                                        <svg
                                            className='w-4 h-4 text-white ml-[1px]'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M5 13l4 4L19 7'
                                            />
                                        </svg>
                                    )}
                                </div>
                                <p className='text-[17px] text-white opacity-35 mt-[1px]'>Ghi nhớ cho lần sau</p>
                            </label>
                        </div>

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
                            Đăng Nhập
                        </Button>
                        <div className='flex items-center gap-2 mt-2'>
                            <p className='text-[16px] text-[#dddddf]'>Bạn chưa có tài khoản?</p>
                            <Link to={path.register} className='text-[16px] text-[#0d89f7] font-semibold'>
                                Đăng ký
                            </Link>
                        </div>
                        <div className='w-full h-[1px] bg-white opacity-35 mt-4'></div>
                        <p className='text-[20px] text-center mt-4'>Hoặc đăng nhập bằng:</p>
                        <button className='w-full py-[7px] border border-[#0d89f7] rounded-md cursor-pointer mt-2 flex items-center justify-center gap-2'>
                            <FontAwesomeIcon icon={faG} className='text-[#0d89f7] text-[20px]' />
                            <span className='text-[18px] text-[#0d89f7]'>Google</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
