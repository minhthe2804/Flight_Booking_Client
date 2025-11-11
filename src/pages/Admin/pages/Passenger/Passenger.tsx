import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { SubmitHandler } from 'react-hook-form'
import { AxiosError } from 'axios'
// SỬA: Import 'createSearchParams' và 'useNavigate'
import { useNavigate, createSearchParams } from 'react-router-dom'
// SỬA: Import lodash
import { omitBy, isNil } from 'lodash'

// Import các components con
import PassengerForm from './components/PassengerForm'
import PassengerFilterCard from './components/PassengerFilterCard'
import PassengerTable from './components/PassengerTable'
import Paginate from '~/components/Pagination'

// Import API
import { passengerApi } from '~/apis/passenger.api'
import { countryApi } from '~/apis/country.api'

// Import Kiểu
import { PassengerAdmin as Passenger, PassengerFilterAdmin as PassengerFilter } from '~/types/passenger'
// SỬA: Import đúng hook
import useFlightQueryConfig from '~/hooks/useSearchFlightQueryConfig'
import { path } from '~/constants/path'

// --- Component Chính ---
export default function AdminPassengerPage() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const [editingPassenger, setEditingPassenger] = useState<Passenger | null>(null)

    // SỬA: Lấy TẤT CẢ params từ URL
    const queryConfig = useFlightQueryConfig()

    const [filters, setFilters] = useState<PassengerFilter>(() => {
        // Lấy filter từ URL
        const { page, limit, ...rest } = queryConfig as PassengerFilter
        return rest
    })

    // === GỌI API ===

    // 1. Gọi API lấy danh sách Quốc gia (dùng chung)
    const { data: countriesData, isLoading: isLoadingCountries } = useQuery({
        queryKey: ['countries'],
        queryFn: () => countryApi.getCountries().then((res) => res.data.data),
        staleTime: Infinity,
        refetchOnWindowFocus: false
    })
    const countries = countriesData || []

    // 2. SỬA: Gọi API Hành khách (dùng queryConfig)
    const {
        data: passengersData,
        isLoading: isLoadingPassengers,
        refetch
    } = useQuery({
        // queryKey giờ phụ thuộc vào queryConfig (từ URL)
        queryKey: ['adminPassengers', queryConfig],
        queryFn: () =>
            // Truyền TẤT CẢ queryConfig (đã chứa page, limit, filter) vào API
            passengerApi.getPassengers(queryConfig as PassengerFilter).then((res) => res.data),
        staleTime: 1000 * 60
    })

    // SỬA: Truy cập đúng
    const passengers = passengersData?.data || []
    const pagination = passengersData?.data?.meta?.pagination

    const updatePassengerMutation = useMutation({
        mutationFn: (data: Passenger) => passengerApi.updatePassenger(data.passenger_id, data),
        onSuccess: () => {
            toast.success('Cập nhật thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminPassengers'] })
            handleResetForm()
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại')
        }
    })

    // === 5. HANDLERS (Đã sửa) ===
    const onSubmitForm: SubmitHandler<Passenger> = (data) => {
        updatePassengerMutation.mutate(data)
    }

    const handleResetForm = () => {
        setEditingPassenger(null)
    }
    // SỬA: Hàm này CHỈ cập nhật state, KHÔNG navigate
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFilters((prev) => ({
            ...prev,
            [name]: value === 'Tất cả' ? '' : value
        }))
    }

    // SỬA: Hàm này thực hiện navigate (lọc)
    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const newParams = {
            ...queryConfig,
            ...filters,
        }

        const cleanedParams = omitBy(newParams, (value) => isNil(value) || value === '')
        navigate({
            pathname: path.adminPassenger,
            search: createSearchParams(cleanedParams as any).toString()
        })
    }

    const handleFilterReset = () => {
        setFilters({})
        refetch()
        navigate({
            pathname: path.adminPassenger // Sửa: Dùng path trang admin
        })
    }

    const handleEditClick = (passenger: Passenger) => {
        setEditingPassenger(passenger)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className='max-w-[1278px] mx-auto py-8 px-4'>
            <h1 className='text-3xl font-bold text-gray-900 text-center mb-8'>Quản lý Hành khách</h1>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                {/* --- CỘT CHÍNH (FORM VÀ BẢNG) --- */}
                <div className='lg:col-span-9 space-y-6'>
                    {/* Form Thêm/Sửa */}
                    <PassengerForm
                        editingPassenger={editingPassenger}
                        onSubmitForm={onSubmitForm}
                        onResetForm={handleResetForm}
                        countries={countries}
                        isLoadingCountries={isLoadingCountries}
                    />

                    {/* Bảng Hiển thị Kết quả */}
                    <PassengerTable
                        passengers={passengers} // SỬA: Dùng 'passengers' (đã lọc từ server)
                        isLoading={isLoadingPassengers}
                        onEdit={handleEditClick}
                    />

                    {pagination && pagination.totalItems > 1 && (
                        <Paginate pageSize={pagination?.totalPages as number} queryConfig={queryConfig} />
                    )}
                </div>

                {/* --- CỘT LỌC (FILTER) --- */}
                <div className='lg:col-span-3'>
                    <PassengerFilterCard
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onFilterSubmit={handleFilterSubmit}
                        onFilterReset={handleFilterReset}
                        countries={countries}
                        isLoadingCountries={isLoadingCountries}
                    />
                </div>
            </div>
        </div>
    )
}
