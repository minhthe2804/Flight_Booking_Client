import React, { useContext, useEffect } from 'react' // SỬA: Bỏ useState
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { AppContext } from '~/contexts/app.context'
import { getProfile, updateProfile } from '~/apis/auth.api'
import Input from '~/components/Input'
import { profileSchema, ProfileSchema } from '~/utils/rules'

export default function Profile() {
    const { setProfile } = useContext(AppContext)
    const queryClient = useQueryClient()

    // SỬA: Bỏ state isEditing
    // const [isEditing, setIsEditing] = useState(false)

    const { data: profileData, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile
    })
    const profile = profileData?.data.data

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<ProfileSchema>({
        resolver: yupResolver(profileSchema),
        defaultValues: {
            email: '',
            first_name: '',
            last_name: '',
            middle_name: null,
            title: 'Mr',
            phone: '',
            date_of_birth: '',
            citizen_id: ''
        }
    })

    useEffect(() => {
        if (profile) {
            reset({
                email: profile.email,
                first_name: profile.first_name,
                last_name: profile.last_name,
                middle_name: profile.middle_name,
                title: profile.title,
                phone: profile.phone,
                date_of_birth: profile.date_of_birth,
                citizen_id: profile.citizen_id
            })
        }
    }, [profile, reset])

    const updateProfileMutation = useMutation({
        mutationFn: (body: ProfileSchema) => updateProfile(body),
        onSuccess: (data) => {
            toast.success(data.data.message || 'Cập nhật thành công!')
            queryClient.invalidateQueries({ queryKey: ['profile'] })

            // SỬA: Bỏ setIsEditing
            // setIsEditing(false)

            const newProfile = data.data.data
            setProfile(newProfile as any)
            localStorage.setItem('profile', JSON.stringify(newProfile))
        },
        onError: (error: any) => {
            toast.error(error.message || 'Cập nhật thất bại!')
        }
    })

    const onSubmit = handleSubmit((data) => {
        updateProfileMutation.mutate(data)
    })

    // SỬA: Bỏ hàm handleCancel
    // const handleCancel = () => { ... }

    if (isLoading) {
        return <div className='min-h-screen bg-gray-100 py-10'>Đang tải...</div>
    }

    const classNameError = 'text-red-500 text-[14px] mt-1 min-h-[20px]'
    // SỬA: Bỏ các class disabled:
    const classNameInput =
        'text-black mt-2 w-full outline-none border border-gray-300 rounded-[4px] py-2 px-3 focus:border-blue-500 transition duration-200'

    return (
        <div className='min-h-screen bg-gray-100 py-10'>
            <div className='max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md'>
                <h1 className='text-3xl font-bold text-gray-900 mb-8'>Thông tin tài khoản</h1>

                <form className='space-y-6' onSubmit={onSubmit}>
                    {/* SỬA: Bỏ prop 'disabled' */}
                    <Input
                        label='Email'
                        isRequired
                        isFont
                        placeholder='VD: email@example.com'
                        register={register}
                        type='email'
                        name='email'
                        classNameError={classNameError}
                        classNameInput={classNameInput}
                        errorMessage={errors.email?.message}
                        // disabled={!isEditing} // Bỏ
                    />

                    {/* Title (Danh xưng) */}
                    <div className='flex flex-col'>
                        <label htmlFor='title' className='text-sm font-medium text-gray-700 mb-1'>
                            Danh xưng
                        </label>
                        <Controller
                            name='title'
                            control={control}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    id='title'
                                    // SỬA: Bỏ 'disabled' và class 'disabled:'
                                    className='text-lg text-gray-800 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                                    // disabled={!isEditing} // Bỏ
                                >
                                    <option value='Mr'>Ông (Mr.)</option>
                                    <option value='Mrs'>Bà (Mrs.)</option>
                                    <option value='Ms'>Cô (Ms.)</option>
                                </select>
                            )}
                        />
                    </div>

                    {/* Tên và Họ */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <Input
                            label='Tên'
                            isRequired
                            isFont
                            placeholder='VD: John'
                            register={register}
                            type='text'
                            name='first_name'
                            classNameError={classNameError}
                            classNameInput={classNameInput}
                            errorMessage={errors.first_name?.message}
                            // disabled={!isEditing} // Bỏ
                        />
                        <Input
                            label='Họ'
                            isRequired
                            isFont
                            placeholder='VD: Nguyen'
                            register={register}
                            type='text'
                            name='last_name'
                            classNameError={classNameError}
                            classNameInput={classNameInput}
                            errorMessage={errors.last_name?.message}
                            // disabled={!isEditing} // Bỏ
                        />
                    </div>

                    {/* Tên đệm */}
                    <Input
                        label='Tên đệm (Nếu có)'
                        isFont
                        placeholder='VD: Van'
                        register={register}
                        type='text'
                        name='middle_name'
                        classNameError={classNameError}
                        classNameInput={classNameInput}
                        errorMessage={errors.middle_name?.message}
                        // disabled={!isEditing} // Bỏ
                    />

                    {/* Số điện thoại */}
                    <Input
                        label='Số điện thoại'
                        isRequired
                        isFont
                        placeholder='VD: +84901234567'
                        register={register}
                        type='tel'
                        name='phone'
                        classNameError={classNameError}
                        classNameInput={classNameInput}
                        errorMessage={errors.phone?.message}
                        // disabled={!isEditing} // Bỏ
                    />

                    {/* Ngày sinh và CCCD */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <Input
                            label='Ngày sinh'
                            isRequired
                            isFont
                            register={register}
                            type='date'
                            name='date_of_birth'
                            classNameError={classNameError}
                            classNameInput={classNameInput}
                            errorMessage={errors.date_of_birth?.message}
                            // disabled={!isEditing} // Bỏ
                        />
                        <Input
                            label='Số CCCD'
                            isRequired
                            isFont
                            placeholder='VD: 012345678912'
                            register={register}
                            type='text'
                            name='citizen_id'
                            classNameError={classNameError}
                            classNameInput={classNameInput}
                            errorMessage={errors.citizen_id?.message}
                            // disabled={!isEditing} // Bỏ
                        />
                    </div>

                    {/* SỬA: Logic nút bấm (chỉ còn nút Lưu) */}
                    <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                        <button
                            type='submit'
                            disabled={updateProfileMutation.isPending}
                            className='w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md
                         hover:bg-blue-700 transition duration-300 ease-in-out
                         disabled:bg-gray-400 disabled:cursor-not-allowed'
                        >
                            {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
