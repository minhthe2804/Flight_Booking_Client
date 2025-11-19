import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import Input from '~/components/Input'
import SelectField from '~/components/SelectField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faRotate, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Promotion, PromotionFormData } from '~/apis/promotion.api'
import { promotionAdminSchema } from '~/utils/rules'

// --- Dữ liệu mặc định (Trống) ---
const defaultValues: PromotionFormData = {
    promotion_id: 0,
    promotion_code: '',
    description: '',
    discount_type: 'percentage', // Mặc định
    discount_value: 0,
    min_purchase: 0,
    start_date: '',
    end_date: '',
    is_active: true,
    usage_limit: 100
}

// --- Props ---
interface PromotionFormProps {
    editingPromotion: Promotion | null
    onSubmitForm: SubmitHandler<PromotionFormData>
    onResetForm: () => void
}

export default function PromotionForm({ editingPromotion, onSubmitForm, onResetForm }: PromotionFormProps) {
    const isEditing = !!editingPromotion

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm<PromotionFormData>({
        resolver: yupResolver(promotionAdminSchema),
        defaultValues: defaultValues
    })

    // Effect để reset form khi 'editingPromotion' thay đổi
    useEffect(() => {
        if (editingPromotion) {
            // Chuyển đổi string (từ API) sang number (cho Form)
            reset({
                ...editingPromotion,
                discount_value: parseFloat(editingPromotion.discount_value),
                min_purchase: parseFloat(editingPromotion.min_purchase)
            })
        } else {
            reset(defaultValues)
        }
    }, [editingPromotion, reset])

    const handleResetClick = () => {
        reset(defaultValues)
        onResetForm()
    }

    const discountType = watch('discount_type')

    return (
        <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-5 text-gray-800'>
                {isEditing ? `Cập nhật Khuyến mãi (ID: ${editingPromotion?.promotion_id})` : 'Thêm Khuyến mãi mới'}
            </h2>

            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                    {/* Mã Code */}
                    <Input
                        isFont
                        label='Mã khuyến mãi'
                        isRequired
                        register={register}
                        type='text'
                        name='promotion_code'
                        placeholder='VD: SUMMER2025'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400'
                        errorMessage={errors.promotion_code?.message}
                    />
                    {/* Mô tả */}
                    <Input
                        isFont
                        label='Mô tả'
                        isRequired
                        register={register}
                        type='text'
                        name='description'
                        className='md:col-span-2'
                        placeholder='VD: Giảm 10% cho đơn hàng đầu tiên'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400'
                        errorMessage={errors.description?.message}
                    />
                    {/* Loại giảm giá */}
                    <SelectField
                        isLabel
                        name='discount_type'
                        control={control}
                        label='Loại giảm giá'
                        options={[
                            { value: 'percentage', label: 'Theo phần trăm (%)' },
                            { value: 'fixed_amount', label: 'Theo số tiền (VND)' }
                        ]}
                    />
                    {/* Giá trị giảm */}
                    <Input
                        isFont
                        label={discountType === 'percentage' ? 'Giá trị (%)' : 'Giá trị (VND)'}
                        isRequired
                        register={register}
                        type='number'
                        name='discount_value'
                        placeholder={discountType === 'percentage' ? 'VD: 15' : 'VD: 50000'}
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400'
                        errorMessage={errors.discount_value?.message}
                    />
                    {/* Mua tối thiểu */}
                    <Input
                        isFont
                        label='Giá trị đơn tối thiểu (VND)'
                        isRequired
                        register={register}
                        type='number'
                        name='min_purchase'
                        placeholder='VD: 300000'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400'
                        errorMessage={errors.min_purchase?.message}
                    />
                    {/* Ngày bắt đầu */}
                    <div className='mt-2'>
                        <label htmlFor='start_date' className='block text-sm font-medium text-gray-700'>
                            Ngày bắt đầu <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='date'
                            id='start_date'
                            {...register('start_date')}
                            className={`text-black mt-2 w-full outline-none border-[1px] rounded-[4px] py-[7px] px-[12px] ${errors.start_date ? 'border-red-500' : 'border-[#cdcdcd]'}`}
                        />
                        {errors.start_date && (
                            <p className='text-red-500 text-[14px] mt-[2px] min-h-[20px]'>
                                {errors.start_date.message}
                            </p>
                        )}
                    </div>
                    {/* Ngày kết thúc */}
                    <div className='mt-2'>
                        <label htmlFor='end_date' className='block text-sm font-medium text-gray-700'>
                            Ngày kết thúc <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='date'
                            id='end_date'
                            {...register('end_date')}
                            className={`text-black mt-2 w-full outline-none border-[1px] rounded-[4px] py-[7px] px-[12px] ${errors.end_date ? 'border-red-500' : 'border-[#cdcdcd]'}`}
                        />
                        {errors.end_date && (
                            <p className='text-red-500 text-[14px] mt-[2px] min-h-[20px]'>{errors.end_date.message}</p>
                        )}
                    </div>
                    {/* Giới hạn sử dụng */}
                    <Input
                        isFont
                        label='Giới hạn sử dụng'
                        isRequired
                        register={register}
                        type='number'
                        name='usage_limit'
                        className='mt-1'
                        classNameInput='mt-2 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[14px] text-black focus:border-blue-400'
                        errorMessage={errors.usage_limit?.message}
                    />

                    {/* SỬA: Bọc checkbox Kích hoạt vào div (giống các Input khác) */}
                    <div className='flex items-end pb-2'>
                        {' '}
                        {/* Căn chỉnh xuống dưới */}
                        <div className='flex items-center'>
                            <input
                                type='checkbox'
                                id='is_active' // SỬA: Dùng ID đơn giản
                                {...register('is_active')}
                                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                            />
                            <label htmlFor='is_active' className='ml-2 text-sm font-medium text-gray-700'>
                                Kích hoạt
                            </label>
                        </div>
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

                    {/* SỬA: Đổi màu nút Reset */}
                    <button
                        type='button'
                        onClick={handleResetClick}
                        className='inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md shadow-sm hover:bg-gray-300 transition duration-200 ease-in'
                    >
                        <FontAwesomeIcon icon={faRotate} className='text-gray-700 text-base' />
                        {isEditing ? 'Hủy' : 'Làm mới'}
                    </button>
                </div>
            </form>
        </div>
    )
}
