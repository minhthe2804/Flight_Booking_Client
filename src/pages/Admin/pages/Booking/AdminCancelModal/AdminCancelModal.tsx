import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons'

interface Props {
    isOpen: boolean
    onClose: () => void
    onSubmit: (reason: string) => void
    isLoading: boolean
}

export default function AdminCancelModal({ isOpen, onClose, onSubmit, isLoading }: Props) {
    const [reason, setReason] = useState('')

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
            <div className='bg-white rounded-lg w-full max-w-md shadow-xl p-6 animate-fade-in-scale'>
                <div className='text-center mb-4'>
                    <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600'>
                        <FontAwesomeIcon icon={faExclamationTriangle} size='lg' />
                    </div>
                    <h3 className='text-lg font-bold text-gray-900'>Xác nhận Hủy Đặt chỗ</h3>
                    <p className='text-sm text-gray-500 mt-1'>
                        Hành động này sẽ cập nhật trạng thái đơn hàng thành "Cancelled". Bạn có chắc chắn?
                    </p>
                </div>

                <div className='mb-4'>
                    <label className='block text-xs font-medium text-gray-700 mb-1'>Lý do hủy / Ghi chú (Admin)</label>
                    <textarea
                        rows={3}
                        className='w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-red-500 resize-none'
                        placeholder='Nhập lý do hủy...'
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>

                <div className='flex gap-3 justify-center'>
                    <button
                        onClick={onClose}
                        className='flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium'
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={() => onSubmit(reason)}
                        disabled={isLoading}
                        className='flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium flex justify-center items-center gap-2 disabled:opacity-50'
                    >
                        {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
                        Xác nhận Hủy
                    </button>
                </div>
            </div>
        </div>
    )
}
