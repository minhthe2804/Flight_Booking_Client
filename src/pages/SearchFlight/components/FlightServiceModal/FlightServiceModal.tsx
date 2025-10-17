import React, { useState, useEffect } from 'react'

// Định nghĩa cấu trúc cho dữ liệu chuyến bay
interface FlightData {
    airline: string
    flightNumber: string
    departure: string
    destination: string
    departureTime: string
    arrivalTime: string
    date: string
}

// Định nghĩa kiểu cho ID của gói dịch vụ để giới hạn giá trị
type ServicePackageId = 'economy' | 'plus'

// Định nghĩa cấu trúc cho một gói dịch vụ
interface ServicePackage {
    id: ServicePackageId
    name: string
    price: number
    features: string[]
}

// Định nghĩa props cho component Modal
interface FlightServiceModalProps {
    isOpen: boolean
    onClose: () => void
}

export const FlightServiceModal: React.FC<FlightServiceModalProps> = ({ isOpen, onClose }) => {
    const flightData: FlightData = {
        airline: 'VietJet Air',
        flightNumber: 'VJ000001',
        departure: 'Hà Nội',
        destination: 'TP. Hồ Chí Minh',
        departureTime: '04:40',
        arrivalTime: '05:40',
        date: '24-01-2025'
    }

    const servicePackages: ServicePackage[] = [
        {
            id: 'economy',
            name: 'Economy Class',
            price: 2500000,
            features: ['Được phép mang 7kg hành lý xách tay', 'Được phép ký gửi 10kg hành lý']
        },
        {
            id: 'plus',
            name: 'Economy Plus',
            price: 3000000,
            features: [
                'Được phép mang 7kg hành lý xách tay',
                'Được phép ký gửi 20kg hành lý',
                'Hoàn 70% giá vé',
                'Có bảo hiểm du lịch'
            ]
        }
    ]

    // useState với TypeScript: Kiểu dữ liệu được suy luận hoặc chỉ định rõ
    const [selectedPackageId, setSelectedPackageId] = useState<ServicePackageId>('economy')

    // Tìm gói dịch vụ được chọn. `selectedPackage` sẽ có kiểu `ServicePackage` hoặc `undefined`
    // Sử dụng "non-null assertion" (!) vì ta biết chắc chắn id luôn tồn tại trong mảng
    const selectedPackage = servicePackages.find((p) => p.id === selectedPackageId)!

    // useEffect với TypeScript: Không có gì thay đổi lớn
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    useEffect(() => {
        if (isOpen) setSelectedPackageId('economy')
    }, [isOpen])

    if (!isOpen) return null

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace(/\s/g, '')
    }

    // Kiểu sự kiện được cung cấp bởi React (React.MouseEvent)
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        onClose()
    }

    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
    }

    return (
        <div
            className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4'
            onClick={handleBackdropClick}
        >
            <div
                className='bg-white rounded-xl shadow-2xl w-full max-w-4xl animate-fade-in-scale overflow-hidden'
                onClick={handleModalClick}
            >
                {/* Header */}
                <div className='relative px-6 py-4 border-b-[3px] border-gray-200'>
                    <h2 className='text-xl font-bold text-center text-gray-800'>Chọn loại vé</h2>
                    <button
                        onClick={onClose}
                        className='absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors'
                        aria-label='Đóng'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='w-6 h-6'
                        >
                            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className='p-4'>
                    {/* Tabs và Flight Info */}
                    <div className='flex items-end'>
                        <div className='w-[13%] py-3 px-4 text-blue-600 border-b-[3px] border-blue-600 font-bold text-sm sm:text-base'>
                            Chuyến đi
                        </div>
                        <div className='w-[87%] h-[2px] bg-gray-200 '></div>
                    </div>
                    <div className='mt-4 py-6 px-4 bg-slate-100 rounded-md'>
                        <div className='flex items-center space-x-4 text-sm flex-wrap'>
                            <div className='font-bold text-gray-800 whitespace-nowrap'>
                                {flightData.airline} - {flightData.flightNumber}
                            </div>
                            <div className='flex-grow border-t border-gray-200 hidden md:block'></div>
                            <div className='text-gray-600 whitespace-nowrap font-semibold'>
                                {flightData.departure} → {flightData.destination}
                            </div>
                            <div className='text-gray-600 whitespace-nowrap'>{flightData.date}</div>
                            <div className='text-gray-600 whitespace-nowrap'>
                                {flightData.departureTime} - {flightData.arrivalTime}
                            </div>
                        </div>
                    </div>

                    {/* Service Packages */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                        {servicePackages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className={`rounded-lg border-2 px-5 pt-5 pb-8 cursor-pointer transition-all duration-200 ${selectedPackageId === pkg.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                                onClick={() => setSelectedPackageId(pkg.id)}
                            >
                                <div className='flex items-start justify-between mb-4'>
                                    <div className='flex items-center'>
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-3 mt-1 bg-white transition-all duration-200 ${selectedPackageId === pkg.id ? 'border-blue-500' : 'border-gray-400'}`}
                                        >
                                            {selectedPackageId === pkg.id && (
                                                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                            )}
                                        </div>
                                        <span className='font-bold text-lg text-gray-800'>{pkg.name}</span>
                                    </div>
                                    <span className='font-bold text-lg text-blue-600 text-right ml-2'>
                                        {formatCurrency(pkg.price)}
                                    </span>
                                </div>
                                <ul className='space-y-2 text-gray-700 pl-8'>
                                    {pkg.features.map((feature, index) => (
                                        <li key={index} className='flex items-start'>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                viewBox='0 0 20 20'
                                                fill='currentColor'
                                                className='w-5 h-5 text-green-500 flex-shrink-0'
                                            >
                                                <path
                                                    fillRule='evenodd'
                                                    d='M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z'
                                                    clipRule='evenodd'
                                                />
                                            </svg>
                                            <span className='ml-2 text-sm'>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className='flex flex-col sm:flex-row justify-between sm:items-center px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200 gap-4'>
                    <div>
                        <span className='text-sm text-gray-600'>Giá cho 1 hành khách</span>
                        <p className='font-bold text-2xl text-blue-600'>{formatCurrency(selectedPackage.price)}</p>
                    </div>
                    <div className='flex space-x-3'>
                        <button
                            onClick={onClose}
                            className='px-8 py-3 w-1/2 sm:w-auto rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors'
                        >
                            Đóng
                        </button>
                        <button
                            className='px-8 py-3 w-1/2 sm:w-auto rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors'
                            onClick={() => {
                                onClose()
                            }}
                        >
                            Tiếp tục
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
