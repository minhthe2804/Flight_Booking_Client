import  { useState } from 'react' // SỬA: Thêm useState
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
// SỬA: Thêm import cho icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import { changePassword } from '~/apis/auth.api'
import Input from '~/components/Input'
import { changePasswordSchema, ChangePasswordSchema } from '~/utils/rules'

export default function ChangePassword() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ChangePasswordSchema>({
        resolver: yupResolver(changePasswordSchema),
        defaultValues: {
            current_password: '',
            new_password: '',
            confirm_password: ''
        }
    })

    // SỬA: Thêm state cho 3 nút "con mắt"
    const [showCurrentPass, setShowCurrentPass] = useState(false)
    const [showNewPass, setShowNewPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)

    const changePasswordMutation = useMutation({
        mutationFn: (data: ChangePasswordSchema) => {
            return changePassword({
                current_password: data.current_password,
                new_password: data.new_password
            })
        },
        onSuccess: (data) => {
            toast.success(data.data.message || 'Đổi mật khẩu thành công!')
            reset()
        },
        onError: (error: any) => {
            toast.error(error.message || 'Đã có lỗi xảy ra')
        }
    })

    const onSubmit = handleSubmit((data) => {
        changePasswordMutation.mutate(data)
    })

    const classNameError = 'text-red-500 text-[14px] mt-1 min-h-[20px]'
    const classNameInput =
        'text-black mt-2 w-full outline-none border border-gray-300 rounded-[4px] py-2 px-3 focus:border-blue-500 transition duration-200'

    return (
        <div className='bg-gray-100 py-10'>
            <div className='max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md'>
                <h1 className='text-3xl font-bold text-gray-900 mb-8'>Đổi mật khẩu</h1>

                <form className='space-y-6' onSubmit={onSubmit}>
                    <div className='relative'>
                        <Input
                            label='Mật khẩu cũ'
                            isRequired
                            isFont
                            placeholder='Nhập mật khẩu cũ'
                            register={register}
                            type={showCurrentPass ? 'text' : 'password'} // SỬA: type động
                            name='current_password'
                            classNameError={classNameError}
                            classNameInput={classNameInput}
                            errorMessage={errors.current_password?.message}
                        />
                        {/* SỬA: Thêm nút con mắt */}
                        <button
                            type='button'
                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                            className='absolute top-10 right-4 text-gray-500 hover:text-gray-700'
                        >
                            <FontAwesomeIcon icon={showCurrentPass ? faEyeSlash : faEye} />
                        </button>
                    </div>

                    <div className='relative'>
                        <Input
                            label='Mật khẩu mới'
                            isRequired
                            isFont
                            placeholder='Nhập mật khẩu mới (ít nhất 6 ký tự)'
                            register={register}
                            type={showNewPass ? 'text' : 'password'} // SỬA: type động
                            name='new_password'
                            classNameError={classNameError}
                            classNameInput={classNameInput}
                            errorMessage={errors.new_password?.message}
                        />
                        {/* SỬA: Thêm nút con mắt */}
                        <button
                            type='button'
                            onClick={() => setShowNewPass(!showNewPass)}
                            className='absolute top-10 right-4 text-gray-500 hover:text-gray-700'
                        >
                            <FontAwesomeIcon icon={showNewPass ? faEyeSlash : faEye} />
                        </button>
                    </div>

                    <div className='relative'>
                        <Input
                            label='Nhập lại mật khẩu mới'
                            isRequired
                            isFont
                            placeholder='Nhập lại mật khẩu mới'
                            register={register}
                            type={showConfirmPass ? 'text' : 'password'}
                            name='confirm_password'
                            classNameError={classNameError}
                            classNameInput={classNameInput}
                            errorMessage={errors.confirm_password?.message}
                        />

                        <button
                            type='button'
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className='absolute top-10 right-4 text-gray-500 hover:text-gray-700'
                        >
                            <FontAwesomeIcon icon={showConfirmPass ? faEyeSlash : faEye} />
                        </button>
                    </div>

                    <button
                        type='submit'
                        disabled={changePasswordMutation.isPending}
                        className='w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md
                       hover:bg-blue-700 transition duration-300 ease-in-out
                       disabled:bg-gray-400 disabled:cursor-not-allowed'
                    >
                        {changePasswordMutation.isPending ? 'Đang lưu...' : 'Đổi mật khẩu'}
                    </button>
                </form>
            </div>
        </div>
    )
}
