import { faClose, faInfo } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

export default function CancelBookingModal({ isOpen, onClose, onSubmit }: any) {
    const [selectedReason, setSelectedReason] = useState('')

    const cancellationReasons = [
        { id: 'schedule', label: 'Thay đổi lịch trình công việc/cá nhân' },
        { id: 'health', label: 'Vấn đề sức khỏe không thể đi được' },
        { id: 'family', label: 'Tình huống khẩn cấp trong gia đình' },
        { id: 'other', label: 'Lý do khác' }
    ]

    const handleSubmit = () => {
        if (selectedReason) {
            onSubmit({ reason: selectedReason })
            setSelectedReason('')
            onClose()
        }
    }

    const handleClose = () => {
        setSelectedReason('')
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg shadow-xl w-full max-w-3xl'>
                {/* Header */}
                <div className='px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
                    <h2 className='text-xl font-medium text-gray-800'>Yêu cầu hủy đặt chỗ</h2>
                    <FontAwesomeIcon
                        icon={faClose}
                        className='text-xl opacity-65 cursor-pointer'
                        onClick={() => handleClose()}
                    />
                </div>

                {/* Body */}
                <div className='px-4 py-4 '>
                    {/* Cancellation Terms */}
                    <div className='mt-1 bg-[#97dff5] rounded-md pt-3 pb-4 px-4'>
                        <div className='flex items-center gap-2'>
                            <div className='w-4 h-4 rounded-full border border-gray-700 flex items-center justify-center text-center'>
                                <FontAwesomeIcon icon={faInfo} className='text-[10px] text-gray-700 mt-[-1px]' />
                            </div>
                            <h3 className='text-base font-medium text-gray-700'>Điều khoản hủy đặt chỗ</h3>
                        </div>
                        <p className='text-gray-600 mt-1 ml-[25px] text-base'>
                            Yêu cầu hủy vé chỉ được chấp nhận khi thực hiện trước giờ bay ít nhất 8 tiếng
                        </p>
                        <div className='text-base mt-[6px] text-gray-600 pl-6'>
                            <h4>Hoàn tiền:</h4>
                            <div className='pl-7'>
                                <p className=''>
                                    Nếu vé của bạn có dịch vụ hoàn vé, số tiền hoàn lại sẽ được tính theo tỷ lệ phần
                                    trăm đã nêu trên gói dịch vụ
                                </p>
                                <p className=''>Nếu vé không có dịch vụ hoàn vé, bạn sẽ không được hoàn lại tiền</p>
                            </div>
                        </div>
                        <p className='text-gray-600 mt-1 ml-[25px] text-base'>
                            Vui lòng kiểm tra gói dịch vụ của vé để biết chi tiết về điều khoản hoàn vé
                        </p>
                    </div>

                    {/* Cancellation Reason */}
                    <div className='mt-3'>
                        <h3 className='text-base font-medium text-gray-700 '>Lý do hủy đặt chỗ</h3>
                        <div className='mt-3 rounded-md border-[2px] border-gray-200'>
                            {cancellationReasons.map((reason) => (
                                <div
                                    key={reason.id}
                                    className='flex items-center border-b-[2px] border-gray-200 py-2 px-4'
                                >
                                    <input
                                        type='radio'
                                        name='cancellationReason'
                                        value={reason.id}
                                        checked={selectedReason === reason.id}
                                        onChange={(e) => setSelectedReason(e.target.value)}
                                        className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300'
                                    />
                                    <span className='ml-2 text-base text-gray-700'>{reason.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3'>
                    <button
                        onClick={() => handleClose()}
                        className='px-4 py-2 bg-slate-500 border border-gray-300 rounded-md text-white hover:bg-gray-400 transtion duration-200 ease-in-out '
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedReason}
                        className={`px-4 py-2 rounded-md text-white flex items-center justify-center gap-1 ${
                            selectedReason
                                ? 'bg-red-500 hover:bg-red-400 transtion duration-200 ease-in-out'
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} className='text-xs' />
                        Gửi yêu cầu
                    </button>
                </div>
            </div>
        </div>
    )
}
