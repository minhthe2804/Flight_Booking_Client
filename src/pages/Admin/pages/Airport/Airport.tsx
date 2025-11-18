import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { SubmitHandler } from 'react-hook-form'
import { AxiosError } from 'axios'
import { useNavigate, createSearchParams } from 'react-router-dom'
import { omitBy, isNil } from 'lodash'

// Import các components con
import AirportForm from './components/AirportForm'
import FilterCard from './components/FilterCard'
import AirportTable from './components/AirportTable'
import Paginate from '~/components/Pagination'

// Import API và Kiểu
import { airportApi, Airport, AirportFormData, AirportListResponse } from '~/apis/airport.api'
import { countryApi, CountryFormData } from '~/apis/country.api' // API Quốc gia
import { AirportFilter } from '~/apis/airport.api' // Kiểu Filter
import useFlightQueryConfig from '~/hooks/useSearchFlightQueryConfig'
import { path } from '~/constants/path'
import AddCountryModal from './components/AddCountryModal/AddCountryModal'

// --- Component Chính ---
export default function AdminAirportPage() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const [editingAirport, setEditingAirport] = useState<Airport | null>(null)
    const [isCountryModalOpen, setIsCountryModalOpen] = useState(false) // SỬA: Thêm state modal

    // 1. Lấy TẤT CẢ params từ URL (page, limit, và các filter)
    const queryConfig = useFlightQueryConfig()

    // 2. 'filters' là state nội bộ, chỉ dùng để điền vào form filter
    const [filters, setFilters] = useState<AirportFilter>(() => {
        // Lấy filter từ URL
        const { page, limit, airport_code, airport_name, city, country_id, airport_type } = queryConfig as AirportFilter
        return { airport_code, airport_name, city, country_id, airport_type }
    })

    // === GỌI API ===

    // 3. Gọi API lấy danh sách Quốc gia (dùng chung)
    const { data: countriesData, isLoading: isLoadingCountries } = useQuery({
        queryKey: ['countries'],
        queryFn: () => countryApi.getCountries().then((res) => res.data.data),
        staleTime: Infinity,
        refetchOnWindowFocus: false
    })
    const countries = countriesData || []

    const createCountryMutation = useMutation({
        mutationFn: (data: CountryFormData) => countryApi.createCountry(data),
        onSuccess: () => {
            toast.success('Thêm quốc gia thành công!')
            queryClient.invalidateQueries({ queryKey: ['countries'] }) // Tải lại danh sách quốc gia
            setIsCountryModalOpen(false) // Đóng modal
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Thêm thất bại')
        }
    })

    // 4. Gọi API Sân bay (dùng queryConfig từ URL)
    const { data: airportsData, isLoading: isLoadingAirports } = useQuery<AirportListResponse, Error>({
        queryKey: ['adminAirports', queryConfig],
        queryFn: () => airportApi.getAirportAdmin(queryConfig as AirportFilter).then((res) => res.data),
        staleTime: 1000 * 60
    })
    const airports = airportsData?.data || []
    const pagination = airportsData?.meta?.pagination

    // --- 5. MUTATIONS (Thêm/Sửa/Xóa) ---
    const createAirportMutation = useMutation({
        mutationFn: (data: Omit<AirportFormData, 'airport_id'>) => airportApi.createAirportAdmin(data),
        onSuccess: () => {
            toast.success('Thêm sân bay thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminAirports'] })
            handleResetForm()
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Thêm thất bại')
        }
    })

    const updateAirportMutation = useMutation({
        mutationFn: (data: AirportFormData) => airportApi.updateAirportAdmin(data, data.airport_id),
        onSuccess: () => {
            toast.success('Cập nhật sân bay thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminAirports'] })
            handleResetForm()
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại')
        }
    })

    const deleteAirportMutation = useMutation({
        mutationFn: (id: number) => airportApi.deleteAirportAdmin(id),
        onSuccess: () => {
            toast.success('Xóa sân bay thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminAirports'] })
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Xóa thất bại')
        }
    })

    // === 6. HANDLERS ===
    const onSubmitForm: SubmitHandler<AirportFormData> = (data) => {
        if (editingAirport) {
            updateAirportMutation.mutate(data)
        } else {
            const { airport_id, ...dataToSend } = data
            createAirportMutation.mutate(dataToSend)
        }
    }

    const handleResetForm = () => {
        setEditingAirport(null)
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
            pathname: path.adminAirport, // Sửa: Dùng path trang admin
            search: createSearchParams(cleanedParams).toString()
        })
    }

    // Hàm Reset filter
    const handleFilterReset = () => {
        setFilters({})
        const newParams = { page: '1', limit: queryConfig.limit || '10' }
        navigate({
            pathname: path.adminAirport, // Sửa: Dùng path trang admin
            search: createSearchParams(newParams).toString()
        })
    }

    // Khi nhấn nút "Sửa" trong bảng
    const handleEditClick = (airport: Airport) => {
        setEditingAirport(airport)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDeleteClick = (id: number) => {
        deleteAirportMutation.mutate(id)
    }

    // SỬA: Thêm 2 handler cho modal
    const handleOpenCountryModal = () => {
        setIsCountryModalOpen(true)
    }

    const handleCountrySubmit: SubmitHandler<CountryFormData> = (data) => {
        createCountryMutation.mutate(data)
    }
    return (
        <div className='max-w-[1278px] mx-auto py-8 px-4'>
            <h1 className='text-3xl font-bold text-gray-900 text-center mb-8'>Quản lý Sân bay</h1>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                {/* --- CỘT CHÍNH (FORM VÀ BẢNG) --- */}
                <div className='lg:col-span-9 space-y-6'>
                    {/* Form Thêm/Sửa (Luôn hiển thị) */}
                    <AirportForm
                        editingAirport={editingAirport}
                        onSubmitForm={onSubmitForm}
                        onResetForm={handleResetForm}
                        countries={countries}
                        isLoadingCountries={isLoadingCountries}
                        onOpenCountryModal={handleOpenCountryModal}
                    />

                    {/* Bảng Hiển thị Kết quả */}
                    <AirportTable
                        airports={airports}
                        isLoading={isLoadingAirports}
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
                    <FilterCard
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onFilterSubmit={handleFilterSubmit}
                        onFilterReset={handleFilterReset}
                        countries={countries}
                        isLoadingCountries={isLoadingCountries}
                    />
                </div>
            </div>

            <AddCountryModal
                isOpen={isCountryModalOpen}
                onClose={() => setIsCountryModalOpen(false)}
                onSubmit={handleCountrySubmit}
                isLoading={createCountryMutation.isPending}
            />
        </div>
    )
}
