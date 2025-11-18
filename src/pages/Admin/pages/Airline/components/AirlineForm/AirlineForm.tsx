import {
    SubmitHandler,
    useForm,
    useFieldArray,
    Controller,
    Control,
    UseFormRegister,
    FieldErrors,
    UseFormWatch,
    UseFormGetValues
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// SỬA: Import đúng schema

import { useEffect, useMemo, useState } from 'react'
import Input from '~/components/Input'
import SelectField from '~/components/SelectField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faRotate, faPlus, faTrash, faCube, faPlane } from '@fortawesome/free-solid-svg-icons'
// SỬA: Import đúng kiểu
import { ServiceFeature } from '~/types/airlineServices.type'
import { Airline, AirlineFormData } from '~/apis/airLine.api'
import { Country } from '~/apis/airport.api'
import { airlineFormSchema } from '~/utils/rules'

// --- Dữ liệu (Mock) cho Dịch vụ (Service) ---
export const mockServices: ServiceFeature[] = [
    {
        service_id: 1,
        name: 'Hành lý xách tay',
        type: 'baggage_hand',
        value: 7,
        unit: 'kg',
        description: 'Được phép mang [X]kg hành lý xách tay'
    },
    {
        service_id: 2,
        name: 'Hành lý ký gửi',
        type: 'baggage_check',
        value: 20,
        unit: 'kg',
        description: 'Được phép ký gửi [X]kg hành lý'
    },
    {
        service_id: 3,
        name: 'Phí đổi vé',
        type: 'ticket_change',
        value: 35,
        unit: '%',
        description: 'Phí đổi vé: [X]% giá vé'
    },
    {
        service_id: 4,
        name: 'Hoàn vé',
        type: 'ticket_refund',
        value: 75,
        unit: '%',
        description: 'Hoàn [X]% giá vé'
    },
    {
        service_id: 5,
        name: 'Bảo hiểm du lịch',
        type: 'insurance',
        value: 1,
        unit: null,
        description: 'Có bảo hiểm du lịch'
    }
]

// --- SỬA: Dữ liệu mặc định (khớp schema mới) ---
const defaultPackage: Omit<AirlineFormData['service_packages'][0], 'class_type'> = {
    package_name: '',
    package_code: '',
    package_type: 'standard',
    price_multiplier: 1.0,
    benefits: [] // Dùng 'benefits'
}

const defaultValues: AirlineFormData = {
    airline_id: 0,
    airline_code: '',
    airline_name: '',
    country_id: 0,
    logo_url: '',
    service_packages: [
        { ...defaultPackage, class_type: 'economy', package_name: 'Economy Class', package_code: 'ECONOMY' },
        { ...defaultPackage, class_type: 'business', package_name: 'Business Class', package_code: 'BUSINESS' }
    ]
}

// --- Props ---
interface AirlineFormProps {
    editingAirline: Airline | null // Nhận kiểu API (Response)
    onSubmitForm: SubmitHandler<AirlineFormData> // Gửi kiểu Form (Payload)
    onResetForm: () => void
    countries: Country[]
    isLoadingCountries: boolean
}

// --- Component Con (Nested Array) ---
interface NestedBenefitArrayProps {
    packageIndex: number
    control: Control<AirlineFormData>
    register: UseFormRegister<AirlineFormData>
    errors: FieldErrors<AirlineFormData>
    watch: UseFormWatch<AirlineFormData>
    getValues: UseFormGetValues<AirlineFormData>
}

const NestedBenefitArray: React.FC<NestedBenefitArrayProps> = ({
    packageIndex,
    control,
    register,
    errors,
    watch,
    getValues
}) => {
    const {
        fields,
        append,
        remove: removeBenefit,
        update
    } = useFieldArray({
        control,
        name: `service_packages.${packageIndex}.benefits`
    })

    const benefitsValues = watch(`service_packages.${packageIndex}.benefits`)

    const handleAddFeature = () => {
        // SỬA: Lấy dịch vụ đầu tiên và gán giá trị 0
        const newFeature = { ...mockServices[0], value: 0 }
        append(newFeature)
    }

    const handleRemoveFeature = (featureIndex: number) => {
        removeBenefit(featureIndex)
    }

    // SỬA: Logic khi chọn 1 dịch vụ
    const handleServiceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, featureIndex: number) => {
        const selectedService = mockServices.find((s) => s.type === e.target.value)
        if (selectedService) {
            // Lấy 'value' (tham số) hiện tại
            const currentValue = getValues(`service_packages.${packageIndex}.benefits.${featureIndex}.value`)

            // SỬA: Dùng 'update' để thay thế toàn bộ object
            update(featureIndex, {
                ...selectedService, // Ghi đè (service_id, name, type, unit, description)
                value: currentValue || 0 // Giữ lại 'value' đã nhập (hoặc 0)
            })
        }
    }

    return (
        <div className='mt-4 space-y-3'>
            <h4 className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                <FontAwesomeIcon icon={faCube} className='text-blue-500' />
                Các dịch vụ bao gồm (Benefits):
            </h4>

            {fields.length === 0 && <p className='text-sm text-gray-400 italic ml-6'>Chưa có dịch vụ nào được thêm.</p>}

            {fields.map((feature, featureIndex) => {
                // SỬA: Lấy thông tin (description, unit) từ 'benefitsValues' (dữ liệu form)
                // thay vì 'mockServices' (dữ liệu tĩnh)
                const currentBenefit = benefitsValues?.[featureIndex]

                const serviceDescription =
                    currentBenefit?.description?.replace('[X]', (currentBenefit?.value || 0).toString()) ||
                    'Chọn dịch vụ...'

                const serviceUnit = currentBenefit?.unit || 'kg/%'

                return (
                    <div
                        key={feature.id}
                        className='relative bg-white p-3 rounded-md border border-gray-200 shadow-sm transition-all hover:border-blue-300'
                    >
                        <div className='grid grid-cols-12 gap-4 items-start'>
                            {/* Dịch vụ Select */}
                            <div className='col-span-7'>
                                <Controller
                                    name={`service_packages.${packageIndex}.benefits.${featureIndex}.type`}
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <label className='block text-sm font-medium text-gray-500 mb-[5px]'>
                                                Loại dịch vụ
                                            </label>
                                            <select
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    handleServiceTypeChange(e, featureIndex)
                                                }}
                                                className='text-black w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
                                            >
                                                <option value=''>Chọn dịch vụ</option>
                                                {mockServices.map((s) => (
                                                    <option key={s.service_id} value={s.type}>
                                                        {s.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Tham số Input */}
                            <div className='col-span-4'>
                                <Input
                                    isFont
                                    label={`Tham số (${serviceUnit})`}
                                    classNameInput='text-black w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
                                    isRequired
                                    register={register}
                                    type='number'
                                    name={`service_packages.${packageIndex}.benefits.${featureIndex}.value`}
                                    errorMessage={
                                        errors.service_packages?.[packageIndex]?.benefits?.[featureIndex]?.value
                                            ?.message
                                    }
                                />
                            </div>

                            {/* Nút Xóa */}
                            <div className='col-span-1 flex justify-end pt-6'>
                                <button
                                    type='button'
                                    onClick={() => removeBenefit(featureIndex)}
                                    className='text-gray-400 hover:text-red-500 transition-colors p-1'
                                    title='Xóa dịch vụ'
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>

                        {/* Mô tả Preview */}
                        <div className='mt-2 pl-1'>
                            <p className='text-xs text-blue-600 font-medium bg-blue-50 inline-block px-2 py-1 rounded'>
                                Mô tả hiển thị: "{serviceDescription}"
                            </p>
                        </div>
                    </div>
                )
            })}

            <button
                type='button'
                onClick={handleAddFeature}
                className='mt-2 text-sm font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors'
            >
                <FontAwesomeIcon icon={faPlus} className='w-3 h-3' />
                Thêm dịch vụ
            </button>
        </div>
    )
}
// --- HẾT COMPONENT CON ---

// --- Component Cha ---
export default function AirlineForm({
    editingAirline,
    onSubmitForm,
    onResetForm,
    countries,
    isLoadingCountries
}: AirlineFormProps) {
    const isEditing = !!editingAirline
    const [activeTab, setActiveTab] = useState<'economy' | 'business'>('economy')

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        getValues,
        formState: { errors }
    } = useForm<AirlineFormData>({
        resolver: yupResolver(airlineFormSchema), // SỬA: Dùng schema mới
        defaultValues: defaultValues
    })

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: 'service_packages'
    })

    const fieldsByClass = fields.filter((field) => field.class_type === activeTab)
    const fieldIndices = fields.map((field, index) => ({ id: field.id, index, class_type: field.class_type }))

    // SỬA: Effect (Dịch API Response (JSON 2) sang Form Data (JSON 1))
    useEffect(() => {
        if (editingAirline) {
            // Chuyển đổi API (ServicePackages) sang Form (service_packages)
            const formattedPackages = editingAirline.service_packages?.map((pkg) => {
                let parsedBenefits: ServiceFeature[] = [] // SỬA: Đổi tên
                try {
                    // 1. Parse chuỗi JSON
                    const apiFeatures = JSON.parse(pkg.services_included) as ServiceFeature[]
                    // 2. Map lại description
                    parsedBenefits = apiFeatures.map((apiFeature) => {
                        // SỬA: Đổi tên
                        const mock = mockServices.find((s) => s.type === apiFeature.type)
                        const description = mock ? mock.description : apiFeature.description || 'N/A'
                        return {
                            ...apiFeature,
                            description: description.replace('[X]', (apiFeature.value || 0).toString()),
                            value: apiFeature.value || 0, // Đảm bảo value là number
                            unit: apiFeature.unit || null
                        }
                    })
                } catch (e) {}

                return {
                    package_id: pkg.package_id,
                    package_name: pkg.package_name,
                    package_code: pkg.package_code,
                    class_type: pkg.class_type as 'economy' | 'business',
                    package_type: pkg.package_type,
                    price_multiplier: parseFloat(pkg.price_multiplier), // Chuyển string sang number
                    benefits: parsedBenefits // SỬA: Đổi tên
                }
            })

            reset({
                airline_id: editingAirline.airline_id, // Thêm
                airline_code: editingAirline.airline_code,
                airline_name: editingAirline.airline_name,
                country_id: editingAirline.country_id,
                logo_url: editingAirline.logo_url || null,
                service_packages: formattedPackages as any
            })
        } else {
            reset(defaultValues)
        }
    }, [editingAirline, reset])

    const handleResetClick = () => {
        reset(defaultValues)
        onResetForm()
    }

    const countryOptions = useMemo(() => {
        if (!countries) return []
        return countries.map((c) => ({
            value: c.country_id, // Gửi ID (number)
            label: c.country_name // 'Việt Nam'
        }))
    }, [countries])

    // Hàm thêm Gói (Package)
    const handleAddService = () => {
        append({
            ...defaultPackage,
            class_type: activeTab,
            package_name: activeTab === 'economy' ? 'Economy (New)' : 'Business (New)',
            package_code: activeTab === 'economy' ? 'ECONOMY_NEW' : 'BUSINESS_NEW'
        })
    }

    // Hàm xóa Gói (Package)
    const handleRemovePackage = (trueIndex: number) => {
        if (window.confirm('Bạn có chắc muốn xóa gói dịch vụ này?')) {
            remove(trueIndex)
        }
    }

    return (
        <div className='bg-white p-6 rounded-lg shadow-md border border-gray-100'>
            <div className='flex items-center justify-between mb-6 pb-4 border-b border-gray-100'>
                <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                    <FontAwesomeIcon icon={faPlane} className='text-blue-600' />
                    {isEditing ? `Cập nhật Hãng bay` : 'Thêm Hãng bay mới'}
                    {isEditing && (
                        <span className='text-sm font-normal text-gray-500 ml-2'>
                            (ID: {editingAirline?.airline_id})
                        </span>
                    )}
                </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmitForm)}>
                {/* --- 1. Thông tin chung --- */}
                <div className='mb-8'>
                    <h3 className='text-md font-semibold text-gray-700 mb-4 uppercase tracking-wide text-xs'>
                        Thông tin cơ bản
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
                        <div className='md:col-span-4'>
                            <Input
                                label='Mã hãng (Code)'
                                isRequired
                                isFont
                                register={register}
                                type='text'
                                name='airline_code'
                                placeholder='VD: VN'
                                classNameInput='text-black placeholder:text-[14px] text-sm mt-1 w-full outline-none border border-gray-300 rounded-md py-2 px-3 focus:border-blue-500 transition duration-300 ease-in'
                                errorMessage={errors.airline_code?.message}
                            />
                        </div>
                        <div className='md:col-span-8'>
                            <Input
                                label='Tên hãng hàng không'
                                isRequired
                                isFont
                                register={register}
                                type='text'
                                name='airline_name'
                                placeholder='VD: Vietnam Airlines'
                                classNameInput='text-black placeholder:text-[14px] text-sm mt-1 w-full outline-none border border-gray-300 rounded-[4px] py-2 px-3 focus:border-blue-500 transition duration-300 ease-in'
                                errorMessage={errors.airline_name?.message}
                            />
                        </div>
                        <div className='md:col-span-4'>
                            <SelectField
                                isLabel
                                name='country_id'
                                control={control}
                                label='Quốc Gia'
                                placeholder={isLoadingCountries ? 'Đang tải...' : 'Chọn quốc gia'}
                                options={countryOptions}
                            />
                        </div>
                        <div className='md:col-span-8'>
                            <Input
                                isFont
                                label='Logo URL'
                                register={register}
                                type='text'
                                name='logo_url'
                                className='mt-0.5'
                                placeholder='https://example.com/logo.png'
                                classNameInput='text-black placeholder:text-[14px] text-sm mt-1 w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm focus:border-blue-500 transition duration-300 ease-in'
                                errorMessage={errors.logo_url?.message}
                            />
                        </div>
                    </div>
                </div>

                {/* --- 2. Cấu hình dịch vụ --- */}
                <div className='mt-8 pt-6 border-t border-gray-200'>
                    <h3 className='text-md font-semibold text-gray-700 mb-4 uppercase tracking-wide text-xs'>
                        Cấu hình dịch vụ
                    </h3>

                    {/* Tabs */}
                    <div className='flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit'>
                        <button
                            type='button'
                            onClick={() => setActiveTab('economy')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                activeTab === 'economy'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Hạng Phổ thông (Economy)
                        </button>
                        <button
                            type='button'
                            onClick={() => setActiveTab('business')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                activeTab === 'business'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Hạng Thương gia (Business)
                        </button>
                    </div>

                    {/* Nội dung Tabs */}
                    <div className='space-y-6'>
                        {fieldsByClass.map((pkg, index) => {
                            const trueIndex = fieldIndices.find((f) => f.id === pkg.id)!.index

                            return (
                                <div
                                    key={pkg.id}
                                    className='bg-gray-50 border border-gray-200 rounded-lg p-5 relative transition-shadow hover:shadow-md'
                                >
                                    <button
                                        type='button'
                                        onClick={() => handleRemovePackage(trueIndex)}
                                        className='absolute top-3 right-3 text-gray-400 hover:text-red-500 p-1 bg-white rounded-full shadow-sm border border-transparent hover:border-red-100 transition-all'
                                        title='Xóa gói này'
                                    >
                                        <FontAwesomeIcon icon={faTrash} className='w-3 h-3' />
                                    </button>

                                    {/* SỬA LỖI: Bổ sung 4 cột (thay vì 3) */}
                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6'>
                                        <Input
                                            label='Tên gói dịch vụ'
                                            isRequired
                                            isFont
                                            register={register}
                                            type='text'
                                            name={`service_packages.${trueIndex}.package_name`}
                                            placeholder='VD: Economy Super'
                                            classNameInput='text-black mt-1 w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm focus:border-blue-500 transition duration-300 ease-in'
                                            errorMessage={errors.service_packages?.[trueIndex]?.package_name?.message}
                                        />
                                        <Input
                                            label='Mã code'
                                            isRequired
                                            isFont
                                            register={register}
                                            type='text'
                                            name={`service_packages.${trueIndex}.package_code`}
                                            placeholder='VD: ECO_SUPER'
                                            classNameInput='text-black mt-1 w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm focus:border-blue-500 transition duration-300 ease-in'
                                            errorMessage={errors.service_packages?.[trueIndex]?.package_code?.message}
                                        />
                                        {/* THÊM: Input cho 'package_type' */}
                                        <Input
                                            label='Loại gói (Type)'
                                            isRequired
                                            isFont
                                            register={register}
                                            type='text'
                                            name={`service_packages.${trueIndex}.package_type`}
                                            placeholder='VD: standard / plus'
                                            classNameInput='text-black mt-1 w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm focus:border-blue-500 transition duration-300 ease-in'
                                            errorMessage={errors.service_packages?.[trueIndex]?.package_type?.message}
                                        />

                                        {/* SỬA LỖI: Thêm Input ẩn cho class_type */}
                                        <input
                                            type='hidden'
                                            {...register(`service_packages.${trueIndex}.class_type`)}
                                            value={activeTab} // Giá trị 'economy' hoặc 'business'
                                        />
                                        {/* ------------------------------- */}

                                        <Input
                                            label='Hệ số nhân giá'
                                            isRequired
                                            isFont
                                            register={register}
                                            type='number'
                                            step='0.01'
                                            name={`service_packages.${trueIndex}.price_multiplier`}
                                            placeholder='1.0'
                                            classNameInput='text-black mt-1 w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm focus:border-blue-500 transition duration-300 ease-in'
                                            errorMessage={
                                                errors.service_packages?.[trueIndex]?.price_multiplier?.message
                                            }
                                        />
                                    </div>

                                    <div className='bg-white p-4 rounded-md border border-dashed border-gray-300'>
                                        <NestedBenefitArray
                                            packageIndex={trueIndex}
                                            {...{ control, register, errors, watch, getValues, update }}
                                        />
                                    </div>
                                </div>
                            )
                        })}

                        <button
                            type='button'
                            onClick={handleAddService}
                            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors border border-blue-200'
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Thêm gói {activeTab === 'economy' ? 'Hạng Phổ thông' : 'Hạng Thương gia'}
                        </button>
                    </div>
                </div>

                {/* Sticky Footer Actions */}
                <div className='flex justify-start  gap-3 mt-8 pt-4 border-t border-gray-200 sticky bottom-0 bg-white pb-2'>
                    <button
                        type='submit'
                        className='inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200'
                    >
                        {isEditing ? <FontAwesomeIcon icon={faPenToSquare} /> : <FontAwesomeIcon icon={faPlus} />}
                        {isEditing ? 'Cập nhật Hãng bay' : 'Thêm Hãng bay'}
                    </button>
                    <button
                        type='button'
                        onClick={handleResetClick}
                        className='inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-all duration-200'
                    >
                        <FontAwesomeIcon icon={faRotate} />
                        {isEditing ? 'Hủy bỏ' : 'Làm mới'}
                    </button>
                </div>
            </form>
        </div>
    )
}
