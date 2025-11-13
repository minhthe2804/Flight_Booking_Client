import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { contactAdminSchema } from '~/utils/rules' // Import schema
import { useEffect, useMemo } from 'react'
import Input from '~/components/Input'
import SelectField from '~/components/SelectField'
import PhoneInput from 'react-phone-number-input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faRotate, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Contact, ContactFormData } from '~/apis/contact.api'

// --- Dữ liệu mặc định (Trống) ---
const defaultValues: ContactFormData = {
    contact_id: 0,
    first_name: '',
    middle_name: null,
    last_name: '',
    phone: '',
    email: '',
    citizen_id: null,
    is_primary: false
}

// --- Props ---
interface ContactFormProps {
    editingContact: Contact | null
    onSubmitForm: SubmitHandler<ContactFormData>
    onResetForm: () => void
}

export default function ContactForm({ editingContact, onSubmitForm, onResetForm }: ContactFormProps) {
    const isEditing = !!editingContact

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch, // Theo dõi giá trị
        formState: { errors }
    } = useForm<ContactFormData>({
        resolver: yupResolver(contactAdminSchema),
        defaultValues: defaultValues
    })

    // Effect để reset form khi 'editingContact' thay đổi
    useEffect(() => {
        if (editingContact) {
            reset({
                ...editingContact,
                middle_name: editingContact.middle_name || null,
                citizen_id: editingContact.citizen_id || null
            })
        } else {
            reset(defaultValues)
        }
    }, [editingContact, reset])

    const handleResetClick = () => {
        reset(defaultValues)
        onResetForm()
    }

    return (
        <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-5 text-gray-800'>
                {isEditing ? `Cập nhật Liên hệ (ID: ${editingContact?.contact_id})` : 'Thêm Liên hệ mới'}
            </h2>

            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                    {/* Họ */}
                    <Input
                        isFont
                        label='Họ'
                        isRequired
                        register={register}
                        type='text'
                        name='last_name'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400'
                        errorMessage={errors.last_name?.message}
                    />
                    {/* Tên đệm */}
                    <Input
                        isFont
                        label='Tên đệm'
                        register={register}
                        type='text'
                        name='middle_name'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400'
                        errorMessage={errors.middle_name?.message}
                    />
                    {/* Tên */}
                    <Input
                        isFont
                        label='Tên'
                        isRequired
                        register={register}
                        type='text'
                        name='first_name'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400'
                        errorMessage={errors.first_name?.message}
                    />
                    {/* Email */}
                    <Input
                        isFont
                        label='Email'
                        isRequired
                        register={register}
                        type='email'
                        name='email'
                        className='md:col-span-2'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400'
                        errorMessage={errors.email?.message}
                    />
                    {/* Số điện thoại */}
                    <div className='w-full'>
                        <label className='text-gray-700 font-semibold text-[15px]'>
                            Điện thoại di động
                            <span className='text-red-500'>*</span>
                        </label>
                        <Controller
                            name='phone'
                            control={control}
                            render={({ field }) => (
                                <PhoneInput
                                    {...field}
                                    placeholder='VD: 901 234 567'
                                    defaultCountry='VN'
                                    international
                                    className='mt-2 text-black ' // Thêm class để CSS
                                />
                            )}
                        />
                        <p className='text-red-500 text-[14px] mt-[2px] min-h-[20px]'>{errors?.phone?.message}</p>
                    </div>
                </div>

                {/* Nút bấm */}
                <div className='flex justify-start gap-3 mt-6'>
                    <button
                        type='submit'
                        className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 transition duration-200 ease-in'
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
                        className='inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white font-medium rounded-md shadow-sm hover:bg-gray-600 transition duration-200 ease-in'
                    >
                        <FontAwesomeIcon icon={faRotate} className='text-white text-base' />
                        {isEditing ? 'Hủy' : 'Làm mới'}
                    </button>
                </div>
            </form>
        </div>
    )
}
