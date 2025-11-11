import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'

import { Promotion, promotionTypes } from '../../Promotion'
import { promotionSchema } from '~/utils/rules'
import Input from '~/components/Input'
import SelectField from '~/components/SelectField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faPlus, faRotate } from '@fortawesome/free-solid-svg-icons'

const defaultValues: Promotion = {
    id: '',
    name: '',
    type: '',
    value: 0,
    startDate: '',
    endDate: '',
    description: ''
}

// 2. Định nghĩa Props
interface PromotionFormProps {
    editingPromotion: Promotion | null
    onSubmitForm: SubmitHandler<Promotion>
    onResetForm: () => void
}
export default function PromotionForm({ editingPromotion, onResetForm, onSubmitForm }: PromotionFormProps) {
    const isEditing = !!editingPromotion

    // 3. Khởi tạo react-hook-form (Đã sửa lỗi)
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<Promotion>({
        resolver: yupResolver(promotionSchema),
        defaultValues: defaultValues
    })

    // 4. Dùng useEffect để reset form khi `editingPromotion` thay đổi
    useEffect(() => {
        if (editingPromotion) {
            reset(editingPromotion) // Cập nhật form với dữ liệu edit
        } else {
            reset(defaultValues) // Reset về form trống
        }
    }, [editingPromotion, reset])

    // 5. Hàm xử lý khi nhấn nút "Làm mới"
    const handleResetClick = () => {
        reset(defaultValues)
        onResetForm()
    }

    return (
        <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-5 text-gray-800'>
                {isEditing ? 'Cập nhật khuyến mãi' : 'Thêm khuyến mãi'}
            </h2>

            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-5 mb-5'>
                    {/* Loại Khuyến Mãi */}
                    <Input
                        label='Mã Khuyến Mãi'
                        isRequired
                        isFont
                        placeholder='VD: UuDaiT10'
                        register={register}
                        type='text'
                        name='id'
                        classNameError='text-red-500 text-[14px] mt-[2px] min-h-[20px]'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]'
                        errorMessage={errors.id?.message}
                    />

                    {/* Tên Khuyến Mãi */}
                    <Input
                        label='Tên Khuyến Mãi'
                        isRequired
                        isFont
                        placeholder='Nhập tên khuyến mãi...'
                        register={register}
                        type='text'
                        name='name'
                        classNameError='text-red-500 text-[14px] mt-[2px] min-h-[20px]'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]'
                        errorMessage={errors.name?.message}
                    />

                    {/* Danh xưng */}
                    <SelectField
                        name='type'
                        control={control}
                        label='Loại Khuyến Mãi'
                        isNationality
                        placeholder='Chọn loại'
                        options={promotionTypes}
                    />

                    {/* Giá trị */}
                    <Input
                        label='Giá trị'
                        isRequired
                        isFont
                        placeholder='Nhập giá trị'
                        register={register}
                        type='text'
                        name='value'
                        classNameError='text-red-500 text-[14px] mt-[2px] min-h-[20px]'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]'
                        errorMessage={errors.value?.message}
                    />
                </div>

                {/* Hàng 2: 3 cột (theo ảnh) */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-5'>
                    {/* Ngày Bắt Đầu */}
                    <div className='mt-1'>
                        <label htmlFor='startDate' className='block text-sm font-medium text-gray-700'>
                            Ngày Bắt Đầu<span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='date'
                            id='startDate'
                            {...register('startDate')}
                            className={`mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]`}
                        />
                        {errors.startDate && (
                            <p className='text-red-500 text-[14px] mt-[2px] min-h-[20px]'>{errors.startDate.message}</p>
                        )}
                    </div>

                    {/* Ngày Kết Thúc */}
                    <div className='mt-1'>
                        <label htmlFor='endDate' className='block text-sm font-medium text-gray-700'>
                            Ngày Kết Thúc<span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='date'
                            id='endDate'
                            {...register('endDate')}
                            className={`mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]`}
                        />
                        {errors.endDate && (
                            <p className='text-red-500 text-[14px] mt-[2px] min-h-[20px]'>{errors.endDate.message}</p>
                        )}
                    </div>

                    {/* Mô Tả */}
                    <Input
                        label='Mô Tả'
                        isRequired
                        isFont
                        placeholder='Mô tả ngắn...'
                        register={register}
                        type='text'
                        name='description'
                        classNameError='text-red-500 text-[14px] mt-[2px] min-h-[20px]'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]'
                        errorMessage={errors.description?.message}
                    />
                </div>

                {/* Nút bấm */}
                <div className='flex justify-start gap-3 mt-6'>
                    <button
                        type='submit'
                        className='inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 transtion duration-200 ease-in '
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
