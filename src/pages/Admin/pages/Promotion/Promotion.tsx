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
import { promotionApi, Promotion, PromotionFormData, PromotionListResponse } from '~/apis/promotion.api'

import { path } from '~/constants/path' // Giả sử bạn có path.admin_promotions
import useFlightQueryConfig from '~/hooks/useSearchFlightQueryConfig'
import { PromotionFilter } from '~/types/promotion'
import PromotionFilterCard from './components/PromotionFilterCard'
import PromotionForm from './components/PromotionForm'
import PromotionTable from './components/PromotionTable'

// --- Component Chính ---
export default function AdminPromotionPage() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)

    const queryConfig = useFlightQueryConfig()

    // 'filters' là state nội bộ
    const [filters, setFilters] = useState<PromotionFilter>(() => {
        const { promotion_code, discount_type, is_active } = queryConfig as PromotionFilter
        return { promotion_code, discount_type, is_active }
    })

    // === GỌI API ===

    // Gọi API Khuyến mãi (dùng queryConfig từ URL)
    const { data: promoData, isLoading: isLoadingPromotions } = useQuery<PromotionListResponse, Error>({
        queryKey: ['adminPromotions', queryConfig],
        queryFn: () => promotionApi.getPromotions(queryConfig as PromotionFilter).then((res) => res.data),
        staleTime: 1000 * 60
    })

    // SỬA: Truy cập đúng cấu trúc API
    const promotions = promoData?.data|| []
    const pagination = promoData?.data?.pagination

    // --- MUTATIONS (Thêm/Sửa/Xóa) ---
    const createPromotionMutation = useMutation({
        mutationFn: (data: Omit<PromotionFormData, 'promotion_id'>) => promotionApi.createPromotion(data),
        onSuccess: () => {
            toast.success('Thêm khuyến mãi thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminPromotions'] })
            handleResetForm()
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Thêm thất bại')
        }
    })

    const updatePromotionMutation = useMutation({
        mutationFn: (data: PromotionFormData) => promotionApi.updatePromotion(data.promotion_id, data),
        onSuccess: () => {
            toast.success('Cập nhật khuyến mãi thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminPromotions'] })
            handleResetForm()
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại')
        }
    })

    const deletePromotionMutation = useMutation({
        mutationFn: (id: number) => promotionApi.deletePromotion(id),
        onSuccess: () => {
            toast.success('Xóa khuyến mãi thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminPromotions'] })
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Xóa thất bại')
        }
    })

    // === HANDLERS ===
    const onSubmitForm: SubmitHandler<PromotionFormData> = (data) => {
        if (editingPromotion) {
            updatePromotionMutation.mutate(data)
        } else {
            const { promotion_id, ...dataToSend } = data
            createPromotionMutation.mutate(dataToSend)
        }
    }

    const handleResetForm = () => {
        setEditingPromotion(null)
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
            pathname: path.adminPromotion, // Sửa: Dùng path trang admin
            search: createSearchParams(cleanedParams).toString()
        })
    }

    // Hàm Reset filter
    const handleFilterReset = () => {
        setFilters({})
        const newParams = { page: '1', limit: queryConfig.limit || '10' }
        navigate({
            pathname: path.adminPromotion, // Sửa: Dùng path trang admin
            search: createSearchParams(newParams).toString()
        })
    }

    const handleEditClick = (promo: Promotion) => {
        // Chuyển đổi 'discount_value' (string) sang number cho Form
        setEditingPromotion({
            ...promo,
            discount_value: parseFloat(promo.discount_value),
            min_purchase: parseFloat(promo.min_purchase)
        } as any) // Ép kiểu 'any' vì Form Data khác API Data
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDeleteClick = (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mã khuyến mãi này?')) {
            deletePromotionMutation.mutate(id)
        }
    }

    return (
        <div className='max-w-[1278px] mx-auto py-8 px-4'>
            <h1 className='text-3xl font-bold text-gray-900 text-center mb-8'>Quản lý Khuyến mãi</h1>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                {/* --- CỘT CHÍNH (FORM VÀ BẢNG) --- */}
                <div className='lg:col-span-9 space-y-6'>
                    {/* Form Thêm/Sửa (Luôn hiển thị) */}
                    <PromotionForm
                        editingPromotion={editingPromotion}
                        onSubmitForm={onSubmitForm}
                        onResetForm={handleResetForm}
                    />

                    {/* Bảng Hiển thị Kết quả */}
                    <PromotionTable
                        promotions={promotions}
                        isLoading={isLoadingPromotions}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />

                    {/* Phân trang */}
                    {pagination && pagination.totalPages > 1 && (
                        <Paginate pageSize={pagination.totalPages} queryConfig={queryConfig} />
                    )}
                </div>
                {/* --- CỘT LỌC (FILTER) --- */}
                <div className='lg:col-span-3'>
                    <PromotionFilterCard
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onFilterSubmit={handleFilterSubmit}
                        onFilterReset={handleFilterReset}
                    />
                </div>
            </div>
        </div>
    )
}
