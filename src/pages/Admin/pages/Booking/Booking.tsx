import React, { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import useFlightQueryConfig from '~/hooks/useSearchFlightQueryConfig'
import { bookingApi, UpdateBookingBody } from '~/apis/bookingadmin.api'
import { BookingFilter } from '~/types/bookingadmin.type'
import Paginate from '~/components/Pagination'
import BookingDetailModal from '~/pages/Reservation/components/BookingDetailModal/BookingDetailModal'
import BookingTable from './BookingTable/BookingTable'
import AdminCancelModal from './AdminCancelModal/AdminCancelModal'
import { isNil, omitBy } from 'lodash'
import { createSearchParams, Navigate, useNavigate } from 'react-router-dom'
import { path } from '~/constants/path'

export default function AdminBookingPage() {
    const queryClient = useQueryClient()
    const queryConfig = useFlightQueryConfig()
    const navigate = useNavigate()
    // State cho Modals
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [isCancelOpen, setIsCancelOpen] = useState(false)

    // === QUERY 1: TẤT CẢ ĐẶT CHỖ (Bảng trên) ===
    const { data: bookingsData, isLoading: isLoadingAll } = useQuery({
        queryKey: ['adminBookings', queryConfig],
        // Lấy tất cả (theo page/limit từ URL)
        queryFn: () => bookingApi.getBookings(queryConfig as BookingFilter).then((res) => res.data),
        staleTime: 1000 * 60
    })
    const allBookings = bookingsData?.data || []
    const pagination = bookingsData?.meta?.pagination

    // === QUERY 2: YÊU CẦU HỦY VÉ (Bảng dưới) ===
    const {
        data: requestsData,
        isLoading: isLoadingRequests,
        refetch
    } = useQuery({
        queryKey: ['adminCancelRequests'],
        // Lọc cứng status = 'pending_cancellation'
        queryFn: () => bookingApi.getBookings({ status: 'pending_cancellation', limit: '100' }).then((res) => res.data),
        staleTime: 1000 * 30 // Refresh mỗi 30s
    })
    const cancelRequests = requestsData?.data || ([] as any)

    // === MUTATION: CẬP NHẬT TRẠNG THÁI (Duyệt hủy / Từ chối) ===
    const updateStatusMutation = useMutation({
        mutationFn: (data: { id: number; body: UpdateBookingBody }) =>
            bookingApi.updateBookingStatus(data.id, data.body),
        onSuccess: () => {
            toast.success('Đã xử lý yêu cầu thành công!')
            // Reload cả 2 bảng
            queryClient.invalidateQueries({ queryKey: ['adminBookings'] })
            queryClient.invalidateQueries({ queryKey: ['adminCancelRequests'] })
            queryClient.invalidateQueries({ queryKey: ['adminBookingDetail'] })
            setIsCancelOpen(false)
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại')
        }
    })

    // --- HANDLERS ---

    // Mở Modal Chi tiết
    const handleViewDetail = (id: number) => {
        setSelectedBookingId(id)
        setIsDetailOpen(true)
    }

    // Mở Modal Hủy/Xử lý
    const handleOpenCancel = (id: number) => {
        setSelectedBookingId(id)
        setIsCancelOpen(true)
    }

    // Submit Xử lý (Duyệt hủy)
    const handleSubmitCancel = (reason: string) => {
        if (selectedBookingId) {
            updateStatusMutation.mutate({
                id: selectedBookingId,
                body: {
                    status: 'cancelled', // Chuyển thành Đã hủy (Chấp nhận)
                    payment_status: 'refunded', // Hoặc 'paid' tùy chính sách
                    cancellation_reason: reason
                }
            })
        }
    }

    // Xử lý tìm kiếm từ Bảng
    const handleSearch = (value: string) => {
        const newParams = {
            ...queryConfig,
            page: '1', // Reset về trang 1 khi tìm kiếm
            limit: '10',
            search: value // Map search value vào booking_code
        }
        const cleanedParams = omitBy(newParams, (v) => isNil(v) || v === '')
        navigate({
            pathname: path.adminBooking,
            search: createSearchParams(cleanedParams as any).toString()
        })
    }

    // (Có thể thêm nút "Từ chối hủy" nếu cần, gọi mutation với status='cancellation_rejected')
    useEffect(() => {
        refetch()
    })

    return (
        <div className='max-w-[1278px] mx-auto py-8 px-4 space-y-10'>
            <h1 className='text-3xl font-bold text-gray-900 text-center'>Quản lý Đặt chỗ</h1>

            {/* --- BẢNG 1: TẤT CẢ ĐẶT CHỖ --- */}
            <div className='space-y-4'>
                <div className='flex items-center gap-2 border-b border-gray-200 pb-2'>
                    <FontAwesomeIcon icon={faList} className='text-blue-600' />
                    <h2 className='text-xl font-semibold text-gray-800'>Danh sách Đặt chỗ (Toàn bộ)</h2>
                </div>

                <BookingTable
                    bookings={allBookings}
                    isLoading={isLoadingAll}
                    onViewDetail={handleViewDetail}
                    onCancel={handleOpenCancel}
                    onSearch={handleSearch}
                />

                {pagination && pagination.totalPages > 1 && (
                    <div className='flex justify-end'>
                        <Paginate pageSize={pagination.totalPages} queryConfig={queryConfig} />
                    </div>
                )}
            </div>

            {/* --- BẢNG 2: YÊU CẦU HỦY (CẦN XỬ LÝ) --- */}
            <div className='space-y-4'>
                <div className='flex items-center gap-2 border-b border-red-200 pb-2'>
                    <FontAwesomeIcon icon={faExclamationCircle} className='text-red-600' />
                    <h2 className='text-xl font-semibold text-red-700'>
                        Yêu cầu Hủy vé cần xử lý
                        <span className='ml-2 text-sm bg-red-100 text-red-800 px-2 py-0.5 rounded-full border border-red-200 text-center mt-[-2px] inline-block'>
                            {cancelRequests?.length}
                        </span>
                    </h2>
                </div>

                {cancelRequests.length === 0 ? (
                    <div className='bg-green-50 border border-green-200 rounded-lg p-6 text-center text-green-800'>
                        <p>Tuyệt vời! Không có yêu cầu hủy vé nào đang chờ xử lý.</p>
                    </div>
                ) : (
                    <BookingTable
                        bookings={cancelRequests}
                        isLoading={isLoadingRequests}
                        onViewDetail={handleViewDetail}
                        onCancel={handleOpenCancel}
                        adminTable
                    />
                )}
            </div>

            {/* --- MODALS --- */}

            {/* Modal Xem Chi Tiết */}
            <BookingDetailModal
                isAdmin
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                bookingReference={selectedBookingId as number}
            />

            {/* Modal Xử lý Hủy (Duyệt) */}
            <AdminCancelModal
                isOpen={isCancelOpen}
                onClose={() => setIsCancelOpen(false)}
                onSubmit={handleSubmitCancel}
                isLoading={updateStatusMutation.isPending}
            />
        </div>
    )
}
