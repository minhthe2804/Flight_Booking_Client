import React, { useMemo, useState } from 'react' // SỬA: Thêm useState
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
// SỬA: Thêm faInfoCircle
import { faTrash, faInfoCircle, faSpinner } from '@fortawesome/free-solid-svg-icons'
// SỬA: Import Airline (chi tiết) và AirlineSummary (tóm tắt)

import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { Country } from '~/apis/airport.api'
import AirlineDetailModal from '../AirlineDetailModal/AirlineDetailModal'
import { Airline, airlineApi, AirlineSummary } from '~/apis/airLine.api'

// SỬA: Import Modal mới

interface AirlineTableProps {
    airlines: AirlineSummary[] | any // SỬA: Dùng kiểu tóm tắt (từ List)
    isLoading: boolean
    onEdit: (airline: Airline) => void
    onDelete: (id: number) => void
    countries: Country[] & { country_name: string } // Nhận countries để map ID
}

// Component Skeleton Bảng
const TableRowSkeleton: React.FC = () => (
    <tr className='animate-pulse'>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/4'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-8 w-8 bg-gray-200 rounded'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-full'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/4'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </td>
        <td className='px-6 py-4 whitespace-nowrap'>
            <div className='h-8 bg-gray-200 rounded w-full'></div>
        </td>
    </tr>
)

export default function AirlineTable({ airlines, isLoading, onEdit, onDelete, countries }: AirlineTableProps) {
    // --- STATE CHO MODAL XEM CHI TIẾT ---
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null)

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

    // Mutation cho nút Sửa (Giữ nguyên)
    const getDetailsMutation = useMutation({
        mutationFn: (id: number) => airlineApi.getAirlineDetails(id),
        onSuccess: (response) => {
            toast.success('Đã tải chi tiết. Đang mở form...')
            onEdit(response.data.data) // Gửi dữ liệu chi tiết lên component Cha
        },
        onError: (error: AxiosError) => {
            toast.error(error.message || 'Không thể tải chi tiết hãng bay')
        }
    })

    // --- SỬA: THÊM MUTATION CHO NÚT XEM ---
    const viewDetailsMutation = useMutation({
        mutationFn: (id: number) => airlineApi.getAirlineDetails(id),
        onSuccess: (response) => {
            setSelectedAirline(response.data.data) // Set data cho modal
            setIsViewModalOpen(true) // Mở modal
        },
        onError: (error: AxiosError) => {
            toast.error(error.message || 'Không thể tải chi tiết')
        }
    })

    return (
        <div className='bg-white rounded-lg shadow-md overflow-hidden mt-6'>
            <AirlineDetailModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                airline={selectedAirline}
                countries={countries}
            />

            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                ID
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Logo
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Tên Hãng bay
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Mã
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Quốc gia
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider'
                            >
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {isLoading ? (
                            Array(5)
                                .fill(0)
                                .map((_, idx) => <TableRowSkeleton key={idx} />)
                        ) : airlines.length > 0 ? (
                            airlines.map(
                                (
                                    airline: AirlineSummary // SỬA: Dùng AirlineSummary
                                ) => (
                                    <tr
                                        key={airline.airline_id}
                                        className='hover:bg-gray-50 transition-colors duration-150'
                                    >
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                            {airline.airline_id}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <img
                                                src={
                                                    airline.logo_url ||
                                                    'https://placehold.co/40x40/E2E8F0/94A3B8?text=Logo'
                                                }
                                                alt={airline.airline_name}
                                                className='h-8 w-8 object-contain rounded-full bg-gray-100'
                                            />
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600'>
                                            {airline.airline_name}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                            {airline.airline_code}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                            {countryMap[airline.country_id] || airline.Country.country_name}
                                        </td>
                                      
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                            <div className='flex items-center space-x-3'>
                                                {/* --- THÊM NÚT XEM --- */}
                                                <button
                                                    title='Xem chi tiết'
                                                    className='border border-blue-600 rounded-md text-blue-600 hover:bg-blue-50 transition-colors duration-150 p-2'
                                                    onClick={() => viewDetailsMutation.mutate(airline.airline_id)}
                                                    disabled={
                                                        viewDetailsMutation.isPending || getDetailsMutation.isPending
                                                    } // Vô hiệu hóa khi 1 trong 2 đang chạy
                                                >
                                                    {viewDetailsMutation.isPending ? (
                                                        <FontAwesomeIcon
                                                            icon={faSpinner}
                                                            className='h-4 w-4 animate-spin'
                                                        />
                                                    ) : (
                                                        <FontAwesomeIcon icon={faInfoCircle} className='h-4 w-4' />
                                                    )}
                                                </button>

                                                {/* Nút Sửa (Giữ nguyên) */}
                                                <button
                                                    title='Sửa'
                                                    className='border border-yellow-600 rounded-md text-yellow-600 hover:bg-yellow-50 transition-colors duration-150 p-2'
                                                    onClick={() => getDetailsMutation.mutate(airline.airline_id)}
                                                    disabled={
                                                        getDetailsMutation.isPending || viewDetailsMutation.isPending
                                                    } // Vô hiệu hóa khi 1 trong 2 đang chạy
                                                >
                                                    {getDetailsMutation.isPending ? (
                                                        <FontAwesomeIcon
                                                            icon={faSpinner}
                                                            className='h-4 w-4 animate-spin'
                                                        />
                                                    ) : (
                                                        <FontAwesomeIcon icon={faPenToSquare} className='h-4 w-4' />
                                                    )}
                                                </button>

                                                {/* Nút Xóa (Giữ nguyên) */}
                                                <button
                                                    title='Xóa'
                                                    className='border border-red-600 rounded-md text-red-600 hover:bg-red-50 transition-colors duration-150 p-2'
                                                    onClick={() => onDelete(airline.airline_id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} className='h-4 w-4' />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )
                        ) : (
                            <tr>
                                <td colSpan={7} className='px-6 py-10 text-center text-sm text-gray-500'>
                                    Không tìm thấy hãng bay nào phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
