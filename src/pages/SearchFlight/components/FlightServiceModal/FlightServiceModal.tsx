// src/components/FlightServiceModal/FlightServiceModal.tsx

import React, { useState, useEffect, useMemo, useContext } from 'react'
import { Flight } from '~/types/searchFlight.type'
import { formatCurrencyVND, formatCustomDate, formatFlightTimeOnly, formatDuration } from '~/utils/utils'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlaneDeparture,
    faPlaneArrival,
    faCheckCircle,
    faXmark
} from '@fortawesome/free-solid-svg-icons'
import { path } from '~/constants/path'
import { AppContext } from '~/contexts/app.context' // Import context
import { setFlightServicesFromLS } from '~/utils/auth' // Import hàm lưu LS
import { useQuery } from '@tanstack/react-query' // Import useQuery

// 1. Import kiểu dữ liệu từ API
// (Đảm bảo đường dẫn import là chính xác)
import { ServiceFeature, ServiceFeatureOne, ServicePackageData } from '~/types/airlineServices.type'
import { airlineServicesApi as servicePackageApi } from '~/apis/airlineServices.api'
import { FlightServiceModal as FlightServiceModalType } from '~/pages/FlightBooking/pages/FlightBookingDetail/FlightBookingDetail'

// --- 3. SỬA: ĐỊNH NGHĨA KIỂU DỮ LIỆU ĐÚNG ---
// Gói đã được tính toán giá
export interface PackageConfig extends ServicePackageData {
    pricePerPassenger: number
    parsedFeatures: ServiceFeatureOne[]
}

// --- Props (Giữ nguyên) ---
interface FlightServiceModalProps {
    isOpen: boolean
    onClose: () => void
    departureFlight: Flight | null
    returnFlight: Flight | null
    searchedClassCode: string | undefined
    passengerCounts: {
        adults: number
        children: number
        infants: number
        total: number
    }
}

// --- 3. SỬA LỖI: XÓA BỎ INTERFACE TRÙNG TÊN ---
// (Xóa bỏ hoàn toàn interface FlightServiceModal ở đây)

// --- Component ---
export const FlightServiceModal: React.FC<FlightServiceModalProps> = ({
    isOpen,
    onClose,
    departureFlight,
    returnFlight,
    searchedClassCode,
    passengerCounts
}) => {
    const navigate = useNavigate()
    // SỬA: Lấy đúng hàm set từ Context
    const { setFlightBookingData, flightBookingData,setflightServicesData } = useContext(AppContext)
    const [activeTab, setActiveTab] = useState<'departure' | 'return'>('departure')

    // --- 4. GỌI 2 API DỊCH VỤ ---
    const depAirlineId = departureFlight?.airline.id
    const retAirlineId = returnFlight?.airline.id

    const { data: depPkgData, isLoading: isLoadingDepPkg } = useQuery({
        queryKey: ['servicePackages', depAirlineId], // Key phụ thuộc vào airlineId
        queryFn: () => servicePackageApi.getAirlineSerives(depAirlineId as number).then((res) => res.data),
        staleTime: Infinity,
        enabled: !!isOpen && !!depAirlineId
    })

    // Gọi API cho chuyến về (chỉ khi có chuyến về VÀ hãng bay khác)
    const { data: retPkgData, isLoading: isLoadingRetPkg } = useQuery({
        queryKey: ['servicePackages', retAirlineId],
        queryFn: () => servicePackageApi.getAirlineSerives(retAirlineId as number).then((res) => res.data),
        staleTime: Infinity,
        enabled: !!isOpen && !!retAirlineId && retAirlineId !== depAirlineId
    })

    const availableDepPackages = depPkgData?.data || []
    const availableRetPackages = retPkgData?.data || []

    const depFlightInfo = useMemo(() => {
        if (!departureFlight) return null
        return {
            airline: departureFlight.airline.name,
            flightNumber: departureFlight.flight_number,
            departure: departureFlight.departure.airport.code,
            destination: departureFlight.arrival.airport.code,
            departureTime: formatFlightTimeOnly(departureFlight.departure.time),
            arrivalTime: formatFlightTimeOnly(departureFlight.arrival.time),
            date: formatCustomDate(departureFlight.departure.time?.substring(0, 10)),
            duration: formatDuration(departureFlight.duration)
        }
    }, [departureFlight])

    const retFlightInfo = useMemo(() => {
        if (!returnFlight) return null
        return {
            airline: returnFlight.airline.name,
            flightNumber: returnFlight.flight_number,
            departure: returnFlight.departure.airport.code,
            destination: returnFlight.arrival.airport.code,
            departureTime: formatFlightTimeOnly(returnFlight.departure.time),
            arrivalTime: formatFlightTimeOnly(returnFlight.arrival.time),
            date: formatCustomDate(returnFlight.departure.time?.substring(0, 10)),
            duration: formatDuration(returnFlight.duration)
        }
    }, [returnFlight])

    // --- 5. LỌC CÁC GÓI VÉ TỪ API (SỬA LỖI BIẾN) ---
    const activeDepPackages = useMemo(() => {
        if (!availableDepPackages || !searchedClassCode) return []
        const classType = searchedClassCode.toLowerCase()
        return availableDepPackages.filter((pkg) => pkg.class_type === classType)
    }, [availableDepPackages, searchedClassCode])

    const activeRetPackages = useMemo(() => {
        // Nếu cùng hãng bay, dùng chung gói
        if (retAirlineId === depAirlineId) return activeDepPackages

        if (!availableRetPackages || !searchedClassCode) return []
        const classType = searchedClassCode.toLowerCase()
        return availableRetPackages.filter((pkg) => pkg.class_type === classType)
    }, [availableRetPackages, activeDepPackages, retAirlineId, depAirlineId, searchedClassCode])

    // --- 6. TÍNH TOÁN GIÁ (SỬA LỖI BIẾN) ---
    const calculatedDepPackages = useMemo(() => {
        const basePrice = departureFlight?.starting_price || 0
        // SỬA: Dùng 'activeDepPackages'
        return activeDepPackages.map((config) => {
            let parsedFeatures: ServiceFeature[] = []
            try {
                parsedFeatures = JSON.parse(config.services_included)
            } catch (e) {}
            return {
                ...config,
                pricePerPassenger: Math.round((basePrice * parseFloat(config.price_multiplier)) / 1000) * 1000,
                parsedFeatures: parsedFeatures
            }
        })
    }, [departureFlight, activeDepPackages]) // Sửa dependency

    const calculatedRetPackages = useMemo(() => {
        if (!returnFlight) return []
        const basePrice = returnFlight?.starting_price || 0
        // SỬA: Dùng 'activeRetPackages'
        return activeRetPackages.map((config) => {
            let parsedFeatures: ServiceFeature[] = []
            try {
                parsedFeatures = JSON.parse(config.services_included)
            } catch (e) {}
            return {
                ...config,
                pricePerPassenger: Math.round((basePrice * parseFloat(config.price_multiplier)) / 1000) * 1000,
                parsedFeatures: parsedFeatures
            }
        })
    }, [returnFlight, activeRetPackages]) // Sửa dependency

    // --- 4. STATE LƯU TRỮ (2 GÓI RIÊNG BIỆT) ---
    const [selectedDepPackageId, setSelectedDepPackageId] = useState<number>(0)
    const [selectedRetPackageId, setSelectedRetPackageId] = useState<number>(0)

    // Tính giá gốc (SỬA LỖI BIẾN)
    // Tính riêng cho từng chặng
    const depBasePrice = useMemo(() => {
        const basePrice = departureFlight?.starting_price || 0
        const basePkg = calculatedDepPackages.find((p) => parseFloat(p.price_multiplier) === 1.0)
        return basePkg ? basePkg.pricePerPassenger : Math.round(basePrice / 1000) * 1000
    }, [departureFlight, calculatedDepPackages]) // Sửa dependency

    const retBasePrice = useMemo(() => {
        if (!returnFlight) return 0
        const basePrice = returnFlight?.starting_price || 0
        const basePkg = calculatedRetPackages.find((p) => parseFloat(p.price_multiplier) === 1.0)
        return basePkg ? basePkg.pricePerPassenger : Math.round(basePrice / 1000) * 1000
    }, [returnFlight, calculatedRetPackages]) // Sửa dependency

    // Set default
    useEffect(() => {
        // Chỉ set nếu chưa có gì được chọn (selectedDepPackageId === 0)
        if (isOpen && calculatedDepPackages.length > 0 && selectedDepPackageId === 0) {
            const defaultPkg = calculatedDepPackages.sort((a, b) => a.pricePerPassenger - b.pricePerPassenger)[0]
            setSelectedDepPackageId(defaultPkg.package_id)
        } // Chỉ set nếu chưa có gì được chọn (selectedRetPackageId === 0)
        if (isOpen && calculatedRetPackages.length > 0 && selectedRetPackageId === 0) {
            const defaultPkg = calculatedRetPackages.sort((a, b) => a.pricePerPassenger - b.pricePerPassenger)[0]
            setSelectedRetPackageId(defaultPkg.package_id)
        }
    }, [
        isOpen,
        calculatedDepPackages,
        calculatedRetPackages,
        selectedDepPackageId, // <-- Thêm 2 dependency này
        selectedRetPackageId // <-- Thêm 2 dependency này
    ])
    // Lấy object gói vé đã chọn
    const selectedDepPackage = calculatedDepPackages.find((p) => p.package_id === selectedDepPackageId)
    const selectedRetPackage = calculatedRetPackages.find((p) => p.package_id === selectedRetPackageId)

    // useEffect cho phím ESC (Giữ nguyên)
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    // Handlers (Giữ nguyên)
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => onClose()
    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()

    const handleContinue = () => {
        // Đây là dữ liệu MỚI bạn muốn thêm
        const newFlightData = {
            departureFlight,
            returnFlight,
            selectedPackage: selectedDepPackage,
            selectedReturnPackage: selectedRetPackage,
            passengerCounts
        }

        // Gộp dữ liệu CŨ (từ Context) và dữ liệu MỚI
        const finalState = {
            ...flightBookingData, // <-- Giữ lại dữ liệu cũ (như contactInfo, v.v.)
            ...newFlightData // <-- Ghi đè bằng dữ liệu chuyến bay mới
        }

        // Lưu dữ liệu đã gộp vào Context
        setflightServicesData(finalState as FlightServiceModalType)
        // Và lưu vào LocalStorage/SessionStorage
        setFlightServicesFromLS(finalState)
        navigate(path.flightBookingDetail)
        onClose()
    }

    if (!isOpen || !departureFlight) return null

    // Xác định gói vé nào đang được hiển thị trên UI
    const packagesToShow = activeTab === 'departure' ? calculatedDepPackages : calculatedRetPackages
    const currentSelectedId = activeTab === 'departure' ? selectedDepPackageId : selectedRetPackageId
    const handleSelectPackage = (id: number) =>
        activeTab === 'departure' ? setSelectedDepPackageId(id) : setSelectedRetPackageId(id)
    const isLoading =
        activeTab === 'departure'
            ? isLoadingDepPkg
            : isLoadingRetPkg || (retAirlineId === depAirlineId && isLoadingDepPkg)
    const currentBasePrice = activeTab === 'departure' ? depBasePrice : retBasePrice

    // Tính tổng giá (cho Footer)
    const totalPricePerPassenger =
        (selectedDepPackage?.pricePerPassenger || 0) + (returnFlight ? selectedRetPackage?.pricePerPassenger || 0 : 0)

    return (
        <div
            className='fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 overflow-y-auto'
            onClick={handleBackdropClick}
        >
            <div
                className='bg-white rounded-lg shadow-xl w-full max-w-4xl lg:max-w-5xl my-8 animate-fade-in-scale overflow-hidden flex flex-col'
                onClick={handleModalClick}
            >
                {/* === Header === */}
                <div className='relative px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg'>
                    <h2 className='text-lg font-semibold text-center text-gray-800'>Chọn loại vé phù hợp</h2>
                    <button
                        onClick={onClose}
                        className='absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100'
                        aria-label='Đóng'
                    >
                        <FontAwesomeIcon icon={faXmark} className='w-5 h-5' />
                    </button>
                </div>

                {/* === Body === */}
                <div className='p-6 overflow-y-auto' style={{ maxHeight: 'calc(100vh - 210px)' }}>
                    {/* --- SỬA: THÊM TABS (CHUYẾN ĐI/VỀ) --- */}
                    <div className='flex items-center border-b border-gray-200 mb-6'>
                        <button
                            onClick={() => setActiveTab('departure')}
                            className={`py-3 px-4 font-semibold text-sm ${activeTab === 'departure' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <FontAwesomeIcon icon={faPlaneDeparture} className='mr-2' />
                            Chuyến đi: {departureFlight.departure.airport.code} → {departureFlight.arrival.airport.code}
                        </button>
                        {returnFlight && (
                            <button
                                onClick={() => setActiveTab('return')}
                                className={`py-3 px-4 font-semibold text-sm ${activeTab === 'return' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <FontAwesomeIcon icon={faPlaneArrival} className='mr-2' />
                                Chuyến về: {returnFlight.departure.airport.code} → {returnFlight.arrival.airport.code}
                            </button>
                        )}
                    </div>

                    {/* --- Service Packages --- */}
                    {/* Hiển thị Loading (MỚI) */}
                    {isLoading && (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-pulse'>
                            <div className='h-[230px] bg-gray-200 rounded-lg'></div>
                            <div className='h-[230px] bg-gray-200 rounded-lg'></div>
                            <div className='h-[230px] bg-gray-200 rounded-lg'></div>
                        </div>
                    )}

                    {/* Hiển thị Gói vé (Khi không loading) */}
                    {!isLoading && (
                        <div
                            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.max(2, Math.min(packagesToShow.length, 4))} gap-3`}
                        >
                            {packagesToShow?.map((pkg) => (
                                <div
                                    key={pkg.package_id}
                                    className={`rounded-lg border-2 p-4 cursor-pointer transition-all duration-150 relative flex flex-col group ${
                                        currentSelectedId === pkg.package_id
                                            ? 'border-blue-500 bg-white shadow-lg'
                                            : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                                    onClick={() => handleSelectPackage(pkg.package_id)}
                                    style={{ minHeight: '230px' }}
                                >
                                    {currentSelectedId === pkg.package_id && (
                                        <div className='absolute top-2.5 right-2.5 text-blue-500 bg-white rounded-full'>
                                            <FontAwesomeIcon icon={faCheckCircle} className='w-5 h-5' />
                                        </div>
                                    )}
                                    {/* Tên và Giá */}
                                    <div className='mb-4'>
                                        <div className='flex items-start justify-between'>
                                            <span
                                                className={`font-bold text-base mr-2 ${currentSelectedId === pkg.package_id ? 'text-blue-700' : 'text-gray-800'}`}
                                            >
                                                {pkg.package_name}
                                            </span>
                                            <div className='text-right flex-shrink-0'>
                                                <span
                                                    className={`font-bold text-lg whitespace-nowrap ${currentSelectedId === pkg.package_id ? 'text-blue-600' : 'text-gray-700'}`}
                                                >
                                                    {formatCurrencyVND(pkg.pricePerPassenger)}
                                                </span>
                                                {parseFloat(pkg.price_multiplier) > 1.0 && (
                                                    <span className='text-xs font-normal text-gray-500 block'>
                                                        (+{formatCurrencyVND(pkg.pricePerPassenger - currentBasePrice)})
                                                    </span>
                                                )}
                                                <span className='text-xs font-normal text-gray-500 block mt-0.5'>
                                                    /khách
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Features (Đã parse) */}
                                    <ul className='space-y-1 text-gray-600 mt-auto text-xs'>
                                        {pkg.parsedFeatures?.map((feature) => (
                                            <li key={feature.service_id} className='flex items-start'>
                                                <FontAwesomeIcon
                                                    icon={faCheckCircle}
                                                    className={`w-3.5 h-3.5 flex-shrink-0 mr-1.5 mt-0.5 text-green-500`}
                                                />
                                                <span>{feature.description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* === Footer === */}
                <div className='flex flex-col sm:flex-row justify-between sm:items-center px-6 py-4 bg-white rounded-b-lg border-t border-gray-200 gap-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]'>
                    <div>
                        <span className='text-xs text-gray-500 block'>Tổng giá/khách</span>
                        <p className='font-bold text-xl sm:text-2xl text-orange-600'>
                            {/* SỬA: Tính tổng 2 gói */}
                            {formatCurrencyVND(totalPricePerPassenger)}
                        </p>
                    </div>
                    <div className='flex space-x-3 w-full sm:w-auto'>
                        <button
                            onClick={onClose}
                            className='px-5 py-2.5 w-1/2 sm:w-auto rounded-lg font-semibold text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-150'
                        >
                            Đóng
                        </button>
                        <button
                            onClick={handleContinue}
                            // Vô hiệu hóa nếu 1 trong 2 gói chưa được chọn
                            disabled={
                                (isLoadingDepPkg && isLoadingRetPkg) ||
                                (returnFlight ? !selectedDepPackage || !selectedRetPackage : !selectedDepPackage)
                            }
                            className='px-5 py-2.5 w-1/2 sm:w-auto rounded-lg font-semibold text-sm text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-150 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            Tiếp tục
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
