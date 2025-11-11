interface NoFlightsFoundProps {
    onclick?: () => void
}

export default function NoFlightsFound({ onclick }: NoFlightsFoundProps) {
    return (
        <div
            className='flex flex-col items-center justify-center text-center p-8 border border-gray-200 rounded-lg bg-gray-50 shadow-sm mt-6 cursor-pointer'
            onClick={onclick}
        >
            <svg
                className='w-16 h-16 text-blue-400 mb-4 transform rotate-[-30deg]' /* Added rotation */
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
            >
                <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5} /* Thinner stroke */
                    d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                />
            </svg>
            <h2 className='text-xl font-semibold text-gray-700 mb-2'>Không tìm thấy chuyến bay phù hợp</h2>
            <p className='text-gray-500'>
                Vui lòng thử điều chỉnh lại điểm đi/đến, ngày bay hoặc số lượng hành khách nhé.
            </p>
        </div>
    )
}
