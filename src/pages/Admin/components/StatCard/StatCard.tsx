import React from 'react'

const DecreaseIcon = () => (
    <svg
        className='h-4 w-4 mr-1'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={2}
        stroke='currentColor'
    >
        <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3' />
    </svg>
)
const IncreaseIcon = () => (
    <svg
        className='h-4 w-4 mr-1'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={2}
        stroke='currentColor'
    >
        <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18' />
    </svg>
)

interface StatCardProps {
    title: string
    value: string | number
    change?: string
    changeType?: 'increase' | 'decrease'
    description: string | number
    changeColor?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, description, changeColor }) => {
    const isDecrease = changeType === 'decrease'
    const colorClass = isDecrease ? 'text-red-500' : 'text-green-500'

    return (
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
            <p className='text-sm font-medium text-gray-500'>{title}</p>
            <p className='text-3xl font-bold text-gray-800 mt-2'>{value}</p>
            {change && (
                <div className={`flex items-center mt-2 ${colorClass}`}>
                    {isDecrease ? <DecreaseIcon /> : <IncreaseIcon />}
                    <span className='text-sm font-medium'>
                        {change} {description}
                    </span>
                </div>
            )}
            {!change && description && (
                <p className={`text-sm mt-2 ${changeColor || 'text-gray-500'}`}>{description}</p>
            )}
        </div>
    )
}

export default StatCard
