import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faSpinner, faBan } from '@fortawesome/free-solid-svg-icons'

interface Props {
    isOpen: boolean
    onClose: () => void
    onSubmit: (reason: string) => void
    isLoading: boolean
    // Các props tùy chọn để tái sử dụng
    title?: string
    confirmText?: string
    type?: 'approve' | 'reject' // Để đổi màu sắc
}

export default function AdminCancelModal({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
    title = 'Xác nhận Hủy Đặt chỗ',
    confirmText = 'Xác nhận Hủy',
    type = 'approve'
}: Props) {
    const [reason, setReason] = useState('')

    // Reset reason khi mở modal
    useEffect(() => {
        if (isOpen) setReason('')
    }, [isOpen])

    if (!isOpen) return null

    const isReject = type === 'reject'

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
            <div className='bg-white rounded-lg w-full max-w-md shadow-xl p-6 animate-fade-in-scale'>
                <div className='text-center mb-4'>
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${isReject ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'}`}
                    >
                        <FontAwesomeIcon icon={isReject ? faBan : faExclamationTriangle} size='lg' />
                    </div>
                    <h3 className='text-lg font-bold text-gray-900'>{title}</h3>
                    <p className='text-sm text-gray-500 mt-1'>
                        {isReject
                            ? 'Bạn đang từ chối yêu cầu hủy vé. Vé sẽ trở về trạng thái ban đầu.'
                            : "Hành động này sẽ cập nhật trạng thái đơn hàng thành 'Cancelled' và hoàn tiền (nếu có)."}
                    </p>
                </div>

                <div className='mb-4'>
                    <label className='block text-xs font-medium text-gray-700 mb-1'>
                        {isReject ? 'Lý do từ chối (Gửi cho khách)' : 'Ghi chú xử lý (Admin)'}
                    </label>
                    <textarea
                        rows={3}
                        className={`w-full border rounded-md p-2 text-sm outline-none resize-none ${isReject ? 'border-gray-300 focus:border-gray-500' : 'border-gray-300 focus:border-red-500'}`}
                        placeholder={isReject ? 'Nhập lý do từ chối...' : 'Nhập ghi chú...'}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>

                <div className='flex gap-3 justify-center'>
                    <button
                        onClick={onClose}
                        className='flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium transition-colors'
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={() => onSubmit(reason)}
                        disabled={isLoading}
                        className={`flex-1 px-4 py-2 text-white rounded-md font-medium flex justify-center items-center gap-2 disabled:opacity-50 transition-colors ${
                            isReject ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
