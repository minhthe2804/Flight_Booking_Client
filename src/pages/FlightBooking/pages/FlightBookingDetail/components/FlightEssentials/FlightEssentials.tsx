import React from 'react'
import { faSuitcase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface FlightEssentialsProps {
    onOpenBaggageModal: () => void
}

const FlightEssentials: React.FC<FlightEssentialsProps> = ({ onOpenBaggageModal }) => {
    return (
        <div className='bg-[#bbeafd] p-6 rounded-md border border-[#cdcdcd] mt-5'>
            <h3 className='font-semibold text-lg mb-3 text-gray-800'>Nhu yếu phẩm chuyến bay</h3>
            <div
                onClick={onOpenBaggageModal}
                className='flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors bg-white'
                role='button' // Thêm role cho accessibility
                tabIndex={0} // Cho phép focus bằng bàn phím
                onKeyDown={(e) => e.key === 'Enter' && onOpenBaggageModal()} // Cho phép kích hoạt bằng Enter
            >
                <FontAwesomeIcon icon={faSuitcase} className='text-lg text-blue-500 mr-4' />
                <div>
                    <p className='font-semibold text-gray-800'>Hành lý</p>
                    <p className='text-sm text-gray-500'>Bạn có cần mua thêm hành lý?</p>
                </div>
            </div>
        </div>
    )
}

export default FlightEssentials
