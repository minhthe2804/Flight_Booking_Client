import React from 'react'
import { faUtensils } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface InFlightMealsProps {
    onOpenMealModal: () => void
}
const InFlightMeals: React.FC<InFlightMealsProps> = ({ onOpenMealModal }) => {
    return (
        <div className='bg-[#bbeafd] p-6 rounded-md border border-[#cdcdcd] mt-5'>
            <h3 className='font-semibold text-lg mb-3 text-gray-800'>Món ăn trên chuyến bay</h3>
            <div
                onClick={onOpenMealModal}
                className='flex items-center p-4 border-2  border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors bg-white'
                role='button' // Thêm role cho accessibility
                tabIndex={0} // Cho phép focus bằng bàn phím
                onKeyDown={(e) => e.key === 'Enter' && onOpenMealModal()} // Cho phép kích hoạt bằng Enter
            >
                <FontAwesomeIcon icon={faUtensils} className='text-lg text-blue-500 mr-4' />
                <div>
                    <p className='font-semibold text-gray-800'>Bữa ăn</p>
                    <p className='text-sm text-gray-500'>Chọn món ăn cho chuyến bay của bạn</p>
                </div>
            </div>
        </div>
    )
}

export default InFlightMeals
