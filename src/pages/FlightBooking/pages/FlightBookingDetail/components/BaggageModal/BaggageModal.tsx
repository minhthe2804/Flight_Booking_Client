import { faClose } from '@fortawesome/free-solid-svg-icons'
import { faPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { SelectedMeals } from '../MealModal/MealModal'

const BAGGAGE_OPTIONS = [
    { id: 'none', kg: 0, price: 0, title: 'Không có hành lý bổ sung', desc: 'Chỉ sử dụng hành lý miễn phí' },
    { id: 'plus_10kg', kg: 10, price: 200000, title: 'Hành lý bổ sung', desc: 'Thêm hành lý ký gửi' },
    { id: 'plus_15kg', kg: 15, price: 300000, title: 'Hành lý bổ sung', desc: 'Thêm hành lý ký gửi' },
    { id: 'plus_20kg', kg: 20, price: 400000, title: 'Hành lý bổ sung', desc: 'Thêm hành lý ký gửi' }
]

export interface Passenger {
    id: number
    fullName: string
    type: 'Người lớn' | 'Trẻ em'
    baggageId: string
    selectedMeals: SelectedMeals // Thêm thuộc tính này
}

type TempSelections = { [passengerId: number]: string }

interface BaggageModalProps {
    isOpen: boolean
    onClose: () => void
    passengers: Passenger[]
    onSave: (allSelections: TempSelections) => void
}

const BaggageModal: React.FC<BaggageModalProps> = ({ isOpen, onClose, passengers, onSave }) => {
    const [tempSelections, setTempSelections] = useState<TempSelections>({})

    // Khởi tạo state tạm thời mỗi khi modal được mở
    useEffect(() => {
        if (isOpen) {
            const initialSelections = passengers.reduce((acc, p) => {
                acc[p.id] = p.baggageId
                return acc
            }, {} as TempSelections)
            setTempSelections(initialSelections)
        }
    }, [isOpen, passengers])

    // Hàm cập nhật lựa chọn cho một hành khách cụ thể
    const handleSelectionChange = (passengerId: number, baggageId: string) => {
        setTempSelections((prev) => ({ ...prev, [passengerId]: baggageId }))
    }

    const handleSave = () => {
        onSave(tempSelections)
        onClose()
    }

    if (!isOpen) return null

    // Tính tổng phụ cho tất cả hành khách
    const subtotal = Object.values(tempSelections).reduce((total, baggageId) => {
        const option = BAGGAGE_OPTIONS.find((opt) => opt.id === baggageId)
        return total + (option ? option.price : 0)
    }, 0)

    return (
        <div className='fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4'>
            <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-down'>
                <div className='flex justify-between items-center p-4 border-b border-gray-200'>
                    <h2 className='text-xl font-semibold text-gray-800'>Hành lý</h2>
                    <button onClick={onClose} className='text-gray-500 hover:text-gray-800'>
                        <FontAwesomeIcon icon={faClose} className='text-[28px]' />
                    </button>
                </div>

                {/* --- NỘI DUNG LẶP --- */}
                <div className='overflow-y-auto flex-grow p-6'>
                    <div className='flex items-center text-blue-600 font-semibold text-lg pb-4 mb-4 border-b border-gray-200'>
                        <FontAwesomeIcon icon={faPlane} className='mr-3 text-xl' /> Hà Nội → TP. Hồ Chí Minh
                    </div>

                    {/* BẮT ĐẦU VÒNG LẶP QUA TẤT CẢ HÀNH KHÁCH */}
                    {passengers.map((passenger, index) => {
                        const selectedBaggageId = tempSelections[passenger.id] || 'none'
                        const selectedOption =
                            BAGGAGE_OPTIONS.find((opt) => opt.id === selectedBaggageId) || BAGGAGE_OPTIONS[0]
                        const totalBaggage = 7 + 10 + selectedOption.kg

                        return (
                            // Mỗi khối hành khách sẽ được bọc trong một div riêng
                            <div
                                key={passenger.id}
                                className='first:mt-0 mt-8 pt-8 border-t border-gray-200 first:border-t-0 first:pt-0'
                            >
                                <div className='flex justify-between items-start mb-6'>
                                    <div>
                                        <p className='text-gray-600 text-sm'>VietJet Air</p>
                                        <p className='font-semibold text-lg text-gray-800'>
                                            Hành khách {index + 1}/{passengers.length}
                                        </p>
                                        <p className='text-gray-800'>Hành khách: {passenger.fullName}</p>
                                        <p className='text-gray-600 text-sm'>{passenger.type}</p>
                                    </div>
                                    <span className='bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full'>
                                        Economy Class
                                    </span>
                                </div>

                                <div className='bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md flex justify-between items-center mb-6'>
                                    <div>
                                        <p className='text-gray-600 text-sm'>Đã bao gồm (Miễn phí)</p>
                                        <p className='font-semibold text-gray-800'>
                                            Xách tay: <span className='font-bold text-lg'>7kg</span>
                                        </p>
                                        <p className='font-semibold text-gray-800'>
                                            Ký gửi: <span className='font-bold text-lg'>10kg</span>
                                        </p>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-gray-600 text-sm'>Tổng số hành lý</p>
                                        <p className='font-bold text-2xl text-gray-800'>{totalBaggage} kg</p>
                                    </div>
                                </div>

                                <div className='space-y-3'>
                                    {BAGGAGE_OPTIONS.map((option) => (
                                        <div
                                            key={option.id}
                                            // Cập nhật lựa chọn cho đúng passengerId
                                            onClick={() => handleSelectionChange(passenger.id, option.id)}
                                            className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center transition-all 
                        ${selectedBaggageId === option.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'}`}
                                        >
                                            <div>
                                                <p className='font-semibold text-gray-800'>{option.title}</p>
                                                <p className='text-sm text-gray-500'>
                                                    {option.desc} {option.kg > 0 && `+${option.kg} kg`}
                                                </p>
                                            </div>
                                            <p
                                                className={`font-bold text-lg ${option.price > 0 ? 'text-red-500' : 'text-gray-800'}`}
                                            >
                                                {option.price > 0
                                                    ? `${option.price.toLocaleString('vi-VN')} VND`
                                                    : '0 VND'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                    {/* KẾT THÚC VÒNG LẶP */}
                </div>

                <div className='flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200'>
                    <div>
                        <span className='text-gray-600'>Tổng phụ</span>
                        <p className='font-bold text-2xl text-blue-600'>{subtotal.toLocaleString('vi-VN')} VND</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className='bg-blue-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-blue-700'
                    >
                        Hoàn tất
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BaggageModal
