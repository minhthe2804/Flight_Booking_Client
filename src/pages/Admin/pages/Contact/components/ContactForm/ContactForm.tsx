import { SubmitHandler, useForm } from 'react-hook-form'
import { Contact } from '../../Contact'
import { yupResolver } from '@hookform/resolvers/yup'
import { contactPersonSchema } from '~/utils/rules'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faRotate } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import Input from '~/components/Input'

const defaultValues: Contact = {
    id: 0,
    lastName: '',
    firstName: '',
    phone: '',
    email: ''
}

// 2. Định nghĩa Props
interface ContactFormProps {
    editingContact: Contact | null
    onSubmitForm: SubmitHandler<Contact>
    onResetForm: () => void
}

export default function ContactForm({ editingContact, onSubmitForm, onResetForm }: ContactFormProps) {
    const isEditing = !!editingContact

    // 3. Khởi tạo react-hook-form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<Contact>({
        resolver: yupResolver(contactPersonSchema),
        defaultValues: defaultValues
    })

    // 4. Dùng useEffect để reset form khi `editingContact` thay đổi
    useEffect(() => {
        if (editingContact) {
            reset(editingContact) // Cập nhật form với dữ liệu edit
        } else {
            reset(defaultValues) // Reset về form trống
        }
    }, [editingContact, reset])

    // Hàm này có thể dùng cho nút "Làm mới" (nếu có)
    const handleResetClick = () => {
        reset(defaultValues)
        onResetForm()
    }

    return (
        <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-5 text-gray-800'>
                {isEditing ? 'Cập nhật người liên hệ' : 'Thêm mới người liên hệ'}
            </h2>

            <form onSubmit={handleSubmit(onSubmitForm)}>
                {/* Grid layout 2 cột */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    {/* Họ và chữ lót */}
                    <Input
                        label='Họ và chữ lót'
                        isRequired
                        isFont
                        placeholder='VD: Nguyễn Văn'
                        register={register}
                        type='text'
                        name='lastName'
                        classNameError='text-red-500 text-[14px] mt-[2px] min-h-[20px]'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]'
                        errorMessage={errors.lastName?.message}
                    />

                    {/* Tên */}
                    <Input
                        label='Tên'
                        isRequired
                        isFont
                        placeholder='VD: An'
                        register={register}
                        type='text'
                        name='firstName'
                        classNameError='text-red-500 text-[14px] mt-[2px] min-h-[20px]'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]'
                        errorMessage={errors.firstName?.message}
                    />

                    {/* Số điện thoại */}
                    <div>
                        <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                            Số điện thoại <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='tel'
                            id='phone'
                            placeholder='012345678'
                            {...register('phone')}
                            className={`mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]`}
                        />
                        {errors.phone && (
                            <p className='text-red-500 text-[14px] mt-[2px] min-h-[20px]'>{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                            Email <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='email'
                            id='email'
                            placeholder='VD: example@gmail.com'
                            {...register('email')}
                            className={`mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]`}
                        />
                        {errors.email && (
                            <p className='text-red-500 text-[14px] mt-[2px] min-h-[20px]'>{errors.email.message}</p>
                        )}
                    </div>
                </div>

                {/* Nút bấm */}
                <div className='flex justify-start gap-3 mt-6'>
                    <button
                        type='submit'
                        className='inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    >
                        {isEditing ? (
                            <FontAwesomeIcon icon={faPenToSquare} className='text-white text-base' />
                        ) : (
                            <FontAwesomeIcon icon={faPlus} className='text-white text-base' />
                        )}
                        {isEditing ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                    <button
                        type='button'
                        onClick={handleResetClick}
                        className='inline-flex items-center gap-1 px-4 py-2 bg-gray-400 text-white font-medium rounded-md shadow-sm hover:bg-gray-300 transtion duration-200 ease-in '
                    >
                        <FontAwesomeIcon icon={faRotate} className='text-white text-base' />
                        Làm mới
                    </button>
                </div>
            </form>
        </div>
    )
}
