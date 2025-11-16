
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons'
import Input from '~/components/Input'
import { CountryFormData } from '~/apis/country.api'
import { countrySchema } from '~/utils/rules'

interface AddCountryModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: SubmitHandler<CountryFormData>
    isLoading: boolean
}

export default function AddCountryModal({ isOpen, onClose, onSubmit, isLoading }: AddCountryModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CountryFormData>({
        resolver: yupResolver(countrySchema),
        defaultValues: {
            country_name: '',
            country_code: ''
        }
    })

    if (!isOpen) return null

    const handleClose = () => {
        reset() // Xóa form
        onClose()
    }

    // Hàm submit nội bộ, reset form sau khi submit
    const internalOnSubmit: SubmitHandler<CountryFormData> = (data) => {
        onSubmit(data)
        reset() // Tự động reset form
    }

    return (
        <div
            className='fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4'
            onClick={handleClose} // Đóng khi click bên ngoài
        >
            <div
                className='bg-white rounded-lg shadow-xl w-full max-w-md my-8 animate-fade-in-scale'
                onClick={(e) => e.stopPropagation()} // Ngăn click bên trong
            >
                <form onSubmit={handleSubmit(internalOnSubmit)}>
                    {/* Header */}
                    <div className='relative px-6 py-4 border-b border-gray-200'>
                        <h2 className='text-lg font-semibold text-gray-800'>Thêm Quốc gia mới</h2>
                        <button
                            type='button'
                            onClick={handleClose}
                            className='absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-red-500'
                        >
                            <FontAwesomeIcon icon={faTimes} className='w-5 h-5' />
                        </button>
                    </div>

                    {/* Body (Form) */}
                    <div className='p-6 space-y-4'>
                        <Input
                            label='Tên Quốc gia'
                            isRequired
                            isFont
                            register={register}
                            name='country_name'
                            placeholder='VD: Vietnam'
                            classNameInput='mt-1 w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm'
                            errorMessage={errors.country_name?.message}
                        />
                        <Input
                            label='Mã Quốc gia (Code)'
                            isRequired
                            isFont
                            register={register}
                            name='country_code'
                            placeholder='VD: VN (Tối đa 3 ký tự)'
                            classNameInput='mt-1 w-full outline-none border border-gray-300 rounded-md py-2 px-3 text-sm'
                            errorMessage={errors.country_code?.message}
                        />
                    </div>

                    {/* Footer */}
                    <div className='flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg'>
                        <button
                            type='button'
                            onClick={handleClose}
                            className='px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md shadow-sm hover:bg-gray-300'
                        >
                            Hủy
                        </button>
                        <button
                            type='submit'
                            disabled={isLoading}
                            className='px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2'
                        >
                            {isLoading && <FontAwesomeIcon icon={faSpinner} className='animate-spin w-4 h-4' />}
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
