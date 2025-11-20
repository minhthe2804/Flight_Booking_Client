import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { SubmitHandler } from 'react-hook-form'
import { AxiosError } from 'axios'
import { useNavigate, createSearchParams } from 'react-router-dom'
import { omitBy, isNil } from 'lodash'

// Import các components con

import Paginate from '~/components/Pagination'

import { path } from '~/constants/path' // Giả sử bạn có path.admin_airlines
import { Airline, airlineApi, AirlineFormData, AirlineListResponse } from '~/apis/airLine.api'
import useFlightQueryConfig from '~/hooks/useSearchFlightQueryConfig'
import { AirlineFilter } from '~/types/airlineAdmin.type'
import { countryApi } from '~/apis/country.api'
import AirlineForm from './components/AirlineForm/AirlineForm'
import AirlineTable from './components/AirlineTable/AirlineTable'
import AirlineFilterCard from './components/AirlineFilterCard/AirlineFilterCard'

// --- Component Chính ---
export default function AdminAirlinePage() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const [editingAirline, setEditingAirline] = useState<Airline | null>(null)

    const queryConfig = useFlightQueryConfig()

    // SỬA: 'filters' (state nội bộ, xóa sortBy, order)
    const [filters, setFilters] = useState<AirlineFilter>(() => {
        const {
            airline_code,
            airline_name,
            country_id,
            is_active
            // (sortBy, order đã bị xóa)
        } = queryConfig as AirlineFilter
        return { airline_code, airline_name, country_id, is_active }
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

    // 2. Gọi API Hãng bay (dùng queryConfig từ URL)
    const { data: airlinesData, isLoading: isLoadingAirlines } = useQuery<AirlineListResponse, Error>({
        queryKey: ['adminAirlines', queryConfig],
        queryFn: () => airlineApi.getAirlineAdmin(queryConfig as AirlineFilter).then((res) => res.data),
        staleTime: 1000 * 60
    })
    const airlines = airlinesData?.data || []
    const pagination = airlinesData?.meta?.pagination

    // --- 5. MUTATIONS (Thêm/Sửa/Xóa) ---
    const createAirlineMutation = useMutation({
        mutationFn: (data: Omit<AirlineFormData, 'airline_id'>) => airlineApi.createAirline(data),
        onSuccess: () => {
            toast.success('Thêm hãng bay thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminAirlines'] })
            handleResetForm()
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Thêm thất bại')
        }
    })

    const updateAirlineMutation = useMutation({
        mutationFn: (data: AirlineFormData) => airlineApi.updateAirline(data.airline_id, data),
        onSuccess: () => {
            toast.success('Cập nhật hãng bay thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminAirlines'] })
            handleResetForm()
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại')
        }
    })

    const deleteAirlineMutation = useMutation({
        mutationFn: (id: number) => airlineApi.deleteAirline(id),
        onSuccess: () => {
            toast.success('Xóa hãng bay thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminAirlines'] })
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Xóa thất bại')
        }
    })

    // === 6. HANDLERS ===
    const onSubmitForm: SubmitHandler<AirlineFormData> = (data) => {
        console.log(data)
        if (editingAirline) {
            updateAirlineMutation.mutate(data)
        } else {
            createAirlineMutation.mutate(data)
        }
    }

    const handleResetForm = () => {
        setEditingAirline(null)
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
            ...queryConfig,
            ...filters,
            page: '1'
        }
        const cleanedParams = omitBy(newParams, (value) => isNil(value) || value === '')
        navigate({
            pathname: path.adminAirline, // Sửa: Dùng path trang admin
            search: createSearchParams(cleanedParams).toString()
        })
    }

    // Hàm Reset filter
    const handleFilterReset = () => {
        setFilters({})
        const newParams = { page: '1', limit: queryConfig.limit || '10' }
        navigate({
            pathname: path.adminAirline, // Sửa: Dùng path trang admin
            search: createSearchParams(newParams).toString()
        })
    }

    const handleEditClick = (airline: Airline) => {
        setEditingAirline(airline)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDeleteClick = (id: number) => {
        deleteAirlineMutation.mutate(id)
    }

    return (
        <div className='max-w-[1278px] mx-auto py-8 px-4'>
            <h1 className='text-3xl font-bold text-gray-900 text-center mb-8'>Quản lý Hãng hàng không</h1>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                {/* --- CỘT CHÍNH (FORM VÀ BẢNG) --- */}
                <div className='lg:col-span-9 space-y-6'>
                    {/* Form Thêm/Sửa (Luôn hiển thị) */}
                    <AirlineForm
                        editingAirline={editingAirline}
                        onSubmitForm={onSubmitForm}
                        onResetForm={handleResetForm}
                        countries={countries}
                        isLoadingCountries={isLoadingCountries}
                    />

                    {/* Bảng Hiển thị Kết quả */}
                    <AirlineTable
                        airlines={airlines}
                        isLoading={isLoadingAirlines}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        countries={countries} // Truyền countries để map tên
                    />

                    {/* Phân trang */}
                    {pagination && pagination.totalPages > 1 && (
                        <Paginate pageSize={pagination.totalPages} queryConfig={queryConfig} />
                    )}
                </div>

                {/* --- CỘT LỌC (FILTER) --- */}
                <div className='lg:col-span-3'>
                    <AirlineFilterCard
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onFilterSubmit={handleFilterSubmit}
                        onFilterReset={handleFilterReset}
                        countries={countries}
                        isLoadingCountries={isLoadingCountries}
                        airlines={airlines}
                    />
                </div>
            </div>
        </div>
    )
}
