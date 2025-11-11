// (File này được import bởi BookingDetailModal, tôi tạo nó dựa trên logic cũ của bạn)
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import Button from '~/components/Button' // Giả định bạn có component Button

interface CancelBookingModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: { reason: string }) => void
    isLoading?: boolean // Sửa: đổi tên prop để cho biết đang loading
}

type FormValues = {
    reason: string
}

export default function CancelBookingModal({ isOpen, onClose, onSubmit, isLoading = false }: CancelBookingModalProps) {
    const { register, handleSubmit, reset } = useForm<FormValues>()

    const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
        onSubmit(data)
    }

    const handleClose = () => {
        reset() // Xóa form khi đóng
        onClose()
    }

    if (!isOpen) return null

    return (
        <div
            className='fixed inset-0 bg-black/60 flex justify-center items-center z-[60] p-4' // Tăng z-index
            onClick={handleClose}
        >
            <div
                className='bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-scale'
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    {/* Header */}
                    <div className='flex justify-between items-center p-4 border-b border-gray-200'>
                        <h3 className='text-lg font-semibold text-gray-800 flex items-center'>
                            <FontAwesomeIcon icon={faExclamationTriangle} className='text-red-500 mr-2' />
                            Xác nhận hủy đặt chỗ
                        </h3>
                        <button
                            type='button'
                            onClick={handleClose}
                            className='text-gray-400 hover:text-red-500 p-1 rounded-full'
                        >
                            <FontAwesomeIcon icon={faXmark} className='w-5 h-5' />
                        </button>
                    </div>

                    {/* Body */}
                    <div className='p-6 space-y-4'>
                        <p className='text-sm text-gray-600'>
                            Bạn có chắc chắn muốn hủy đặt chỗ này không? Vui lòng cung cấp lý do hủy (không bắt buộc).
                        </p>
                        <div>
                            <label htmlFor='reason' className='block text-sm font-medium text-gray-700 mb-1'>
                                Lý do hủy
                            </label>
                            <textarea
                                id='reason'
                                {...register('reason')}
                                rows={3}
                                className='w-full text-black border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                placeholder='Ví dụ: Thay đổi kế hoạch, tìm được vé rẻ hơn...'
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className='flex justify-end items-center p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg space-x-3'>
                        <Button
                            type='button'
                            onClick={handleClose}
                            className='bg-gray-200 text-gray-700 hover:bg-gray-300 p-1 rounded-md'
                        >
                            Không
                        </Button>
                        <Button
                            type='submit'
                            className='bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 p-1 rounded-md'
                            disabled={isLoading}
                        >
                            {isLoading ? <FontAwesomeIcon icon={faSpinner} spin className='mr-2' /> : null}
                            Xác nhận hủy
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
