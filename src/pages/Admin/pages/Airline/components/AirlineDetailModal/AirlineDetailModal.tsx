import React, { useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCheckCircle, faTimesCircle, faCube, faPlaneDeparture } from '@fortawesome/free-solid-svg-icons'

import { ServiceFeature } from '~/types/airlineServices.type' // Import kiểu ServiceFeature
import { Country } from '~/apis/airport.api'
import { Airline } from '~/apis/airLine.api'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    airline: Airline | null
    countries: Country[] // Cần để map ID sang Tên Quốc gia
}

// Helper: Parse chuỗi JSON benefits
const parseServices = (servicesString: string): ServiceFeature[] => {
    try {
        const features = JSON.parse(servicesString) as ServiceFeature[]
        return features.map((f) => ({
            ...f,
            description: f.description.replace('[X]', (f.value || 0).toString())
        }))
    } catch (e) {
        return []
    }
}

export default function AirlineDetailModal({ isOpen, onClose, airline, countries }: ModalProps) {
    // Tạo map để tra cứu tên quốc gia
    const countryMap = useMemo(() => {
        return countries.reduce(
            (acc, country) => {
                acc[country.country_id] = country.country_name
                return acc
            },
            {} as Record<number, string>
        )
    }, [countries])

    if (!isOpen || !airline) return null

    // Lấy 2 gói Economy
    const economyPackages = airline?.service_packages?.filter((p) => p.class_type === 'economy')
    // Lấy 2 gói Business
    const businessPackages = airline?.service_packages?.filter((p) => p.class_type === 'business')

    return (
        <div
            className='fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 overflow-y-auto'
            onClick={onClose}
        >
            <div
                className='bg-white rounded-lg shadow-xl w-full max-w-4xl my-8 animate-fade-in-scale overflow-hidden flex flex-col'
                onClick={(e) => e.stopPropagation()}
            >
                {/* === Header === */}
                <div className='relative px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg'>
                    <h2 className='text-lg font-semibold text-center text-gray-800 flex items-center gap-2'>
                        <FontAwesomeIcon icon={faPlaneDeparture} className='text-blue-600' />
                        Chi tiết Hãng bay: {airline.airline_name}
                    </h2>
                    <button
                        onClick={onClose}
                        className='absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100'
                        aria-label='Đóng'
                    >
                        <FontAwesomeIcon icon={faTimes} className='w-5 h-5' />
                    </button>
                </div>

                {/* === Body === */}
                <div className='p-6 overflow-y-auto' style={{ maxHeight: 'calc(100vh - 200px)' }}>
                    {/* Thông tin chung */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200'>
                        <div className='flex items-center gap-3'>
                            <img
                                src={airline.logo_url || 'https://placehold.co/64x64/E2E8F0/94A3B8?text=Logo'}
                                alt={airline.airline_name}
                                className='h-12 w-12 object-contain rounded-full bg-gray-100 border'
                            />
                            <div>
                                <p className='text-sm text-gray-500'>Hãng bay</p>
                                <p className='font-bold text-gray-800'>
                                    {airline.airline_name} ({airline.airline_code})
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>Quốc gia</p>
                            <p className='font-semibold text-gray-800'>
                                {countryMap[airline.country_id] || airline.country_id}
                            </p>
                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>Trạng thái</p>
                            {airline.is_active ? (
                                <p className='font-semibold text-green-600 flex items-center gap-1'>
                                    <FontAwesomeIcon icon={faCheckCircle} /> Đang hoạt động
                                </p>
                            ) : (
                                <p className='font-semibold text-red-600 flex items-center gap-1'>
                                    <FontAwesomeIcon icon={faTimesCircle} /> Không hoạt động
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Cấu hình dịch vụ */}
                    <div>
                        <h3 className='text-md font-semibold text-gray-700 mb-4 uppercase tracking-wide text-xs'>
                            Cấu hình dịch vụ
                        </h3>

                        {/* Hạng Phổ thông */}
                        <div className='mb-6'>
                            <h4 className='text-lg font-semibold text-gray-800 mb-3'>Hạng Phổ thông (Economy)</h4>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {economyPackages?.map((pkg) => (
                                    <div
                                        key={pkg.package_id}
                                        className='bg-gray-50 border border-gray-200 rounded-lg p-4'
                                    >
                                        <p className='font-semibold text-blue-700'>{pkg.package_name}</p>
                                        <p className='text-sm text-gray-500'>
                                            Loại: {pkg.package_type} | Hệ số: {pkg.price_multiplier}
                                        </p>
                                        <ul className='mt-3 space-y-2 text-sm text-gray-700 pl-4 border-l border-gray-300'>
                                            {parseServices(pkg.services_included).map((feature) => (
                                                <li key={feature.service_id}>
                                                    <strong>{feature.name}:</strong> {feature.description}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hạng Thương gia */}
                        <div>
                            <h4 className='text-lg font-semibold text-gray-800 mb-3'>Hạng Thương gia (Business)</h4>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {businessPackages?.map((pkg) => (
                                    <div
                                        key={pkg.package_id}
                                        className='bg-gray-50 border border-gray-200 rounded-lg p-4'
                                    >
                                        <p className='font-semibold text-blue-700'>{pkg.package_name}</p>
                                        <p className='text-sm text-gray-500'>
                                            Loại: {pkg.package_type} | Hệ số: {pkg.price_multiplier}
                                        </p>
                                        <ul className='mt-3 space-y-2 text-sm text-gray-700 pl-4 border-l border-gray-300'>
                                            {parseServices(pkg.services_included).map((feature) => (
                                                <li key={feature.service_id}>
                                                    <strong>{feature.name}:</strong> {feature.description}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
