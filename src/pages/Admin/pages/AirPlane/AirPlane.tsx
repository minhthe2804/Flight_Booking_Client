import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { SubmitHandler } from 'react-hook-form'
import { AxiosError } from 'axios'
import { useNavigate, createSearchParams } from 'react-router-dom'
import { omitBy, isNil } from 'lodash'

// Import các components con
import Paginate from '~/components/Pagination'

// Import API và Kiểu
import { aircraftApi, Aircraft, AircraftFormData, AircraftListResponse, AircraftFilter } from '~/apis/aircraft.api'
import { path } from '~/constants/path' // Giả sử bạn có path.admin_aircrafts
import useFlightQueryConfig from '~/hooks/useSearchFlightQueryConfig'
import { airlineApi } from '~/apis/airLine.api'
import AirplaneFilterCard from './components/AirplaneFilterCard'
import AirplaneForm from './components/AirplaneForm'
import AirplaneTable from './components/AirplaneTable'

// --- Component Chính ---
export default function AdminAircraftPage() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const [editingAircraft, setEditingAircraft] = useState<Aircraft | null>(null)

    const queryConfig = useFlightQueryConfig()

    const [filters, setFilters] = useState<AircraftFilter>(() => {
        const { page, limit, model, airline_id, aircraft_type } = queryConfig as AircraftFilter
        return { model, airline_id, aircraft_type }
    })

    // === GỌI API ===

    // 1. Gọi API Hãng bay
    const { data: airlinesData, isLoading: isLoadingAirlines } = useQuery({
        queryKey: ['airlines'],
        queryFn: () => airlineApi.getAirlines().then((res) => res.data.data),
        staleTime: Infinity,
        refetchOnWindowFocus: false
    })
    const airlines = airlinesData || []

    // 2. Gọi API Máy bay
    const { data: aircraftsData, isLoading: isLoadingAircrafts } = useQuery<AircraftListResponse, Error>({
        queryKey: ['adminAircrafts', queryConfig],
        queryFn: () => aircraftApi.getAircrafts(queryConfig as AircraftFilter).then((res) => res.data),
        staleTime: 1000 * 60
    })
    const aircrafts = aircraftsData?.data || []
    const pagination = aircraftsData?.meta?.pagination

    // --- 5. MUTATIONS (Thêm/Sửa/Xóa) ---
    const createAircraftMutation = useMutation({
        mutationFn: (data: Omit<AircraftFormData, 'aircraft_id'>) => aircraftApi.createAircraft(data),
        onSuccess: () => {
            toast.success('Thêm máy bay thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminAircrafts'] })
            handleResetForm()
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Thêm thất bại')
        }
    })

    const updateAircraftMutation = useMutation({
        mutationFn: (data: AircraftFormData) => aircraftApi.updateAircraft(data.aircraft_id, data),
        onSuccess: () => {
            toast.success('Cập nhật máy bay thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminAircrafts'] })
            handleResetForm()
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data.message|| 'Cập nhật thất bại')
        }
    })

    const deleteAircraftMutation = useMutation({
        mutationFn: (id: number) => aircraftApi.deleteAircraft(id),
        onSuccess: () => {
            toast.success('Xóa máy bay thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminAircrafts'] })
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Xóa thất bại')
        }
    })

    // === 6. HANDLERS ===
    const onSubmitForm: SubmitHandler<AircraftFormData> = (data) => {
        if (editingAircraft) {
            updateAircraftMutation.mutate(data)
        } else {
            const { aircraft_id, ...dataToSend } = data
            createAircraftMutation.mutate(dataToSend)
        }
    }

    const handleResetForm = () => {
        setEditingAircraft(null)
    }

    // Cập nhật state filter nội bộ KHI GÕ
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFilters((prev) => ({
            ...prev,
            [name]: value === 'Tất cả' ? '' : value
        }))
    }

    // Hàm Submit filter (Cập nhật URL)
    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newParams = {
            ...queryConfig, // Giữ lại limit
            ...filters, // Áp dụng filter mới
            page: '1', // Luôn quay về trang 1
            limit: queryConfig.limit || '5' // SỬA: Giữ limit (hoặc 5)
        }

        // Dọn dẹp các giá trị null/undefined/rỗng
        const cleanedParams = omitBy(newParams, (value) => isNil(value) || value === '')

        navigate({
            pathname: path.adminAirplane, // Sửa: Dùng path trang admin
            search: createSearchParams(cleanedParams).toString()
        })
    }

    // Hàm Reset filter
    const handleFilterReset = () => {
        setFilters({})
        const newParams = { page: '1', limit: queryConfig.limit || '5' }
        navigate({
            pathname: path.adminAirplane, // Sửa: Dùng path trang admin
            search: createSearchParams(newParams).toString()
        })
    }

    const handleEditClick = (aircraft: Aircraft) => {
        setEditingAircraft(aircraft)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDeleteClick = (id: number) => {
        deleteAircraftMutation.mutate(id)
    }

    return (
        <div className='max-w-[1278px] mx-auto py-8 px-4'>
            <h1 className='text-3xl font-bold text-gray-900 text-center mb-8'>Quản lý Máy bay</h1>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                {/* --- CỘT CHÍNH (FORM VÀ BẢNG) --- */}
                <div className='lg:col-span-9 space-y-6'>
                    {/* Form Thêm/Sửa (Luôn hiển thị) */}
                    <AirplaneForm
                        editingAircraft={editingAircraft}
                        onSubmitForm={onSubmitForm}
                        onResetForm={handleResetForm}
                        airlines={airlines}
                        isLoadingAirlines={isLoadingAirlines}
                    />

                    {/* Bảng Hiển thị Kết quả */}
                    <AirplaneTable
                        aircrafts={aircrafts}
                        isLoading={isLoadingAircrafts}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick} // Truyền hàm xóa
                    />

                    {/* Phân trang */}
                    {pagination && pagination.totalPages > 1 && (
                        <Paginate pageSize={pagination.totalPages} queryConfig={queryConfig} />
                    )}
                </div>

                {/* --- CỘT LỌC (FILTER) --- */}
                <div className='lg:col-span-3'>
                    <AirplaneFilterCard
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onFilterSubmit={handleFilterSubmit}
                        onFilterReset={handleFilterReset}
                        airlines={airlines}
                        isLoadingAirlines={isLoadingAirlines}
                    />
                </div>
            </div>
        </div>
    )
}
