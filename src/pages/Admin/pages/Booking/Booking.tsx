import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

import useFlightQueryConfig from '~/hooks/useSearchFlightQueryConfig'
import { bookingApi, BookingListResponse, UpdateBookingBody } from '~/apis/bookingadmin.api'
import { BookingFilter } from '~/types/bookingadmin.type'
import Paginate from '~/components/Pagination'
import BookingTable from './BookingTable/BookingTable'
import AdminCancelModal from './AdminCancelModal/AdminCancelModal'
import { isNil, omitBy } from 'lodash'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { path } from '~/constants/path'
import BookingDetailModal_Admin from '~/components/BookingDetailModal_Admin/BookingDetailModal_Admin'

export default function AdminBookingPage() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const queryConfig = useFlightQueryConfig()

    // State cho Modals
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    // Modal Xử lý Hủy (Duyệt)
    const [isApproveCancelOpen, setIsApproveCancelOpen] = useState(false)
    // Modal Từ chối Hủy (Reject)
    const [isRejectCancelOpen, setIsRejectCancelOpen] = useState(false)

    // 1. Gọi API lấy danh sách (Tất cả)
    const { data: bookingsData, isLoading: isLoadingAll } = useQuery<BookingListResponse>({
        queryKey: ['adminBookings', queryConfig],
        queryFn: () => bookingApi.getBookings(queryConfig as BookingFilter).then((res) => res.data),
        staleTime: 1000 * 60
    })

    const allBookings = bookingsData?.data || ([] as any)
    const pagination = bookingsData?.meta?.pagination

    // 2. Gọi API lấy danh sách Yêu cầu hủy
    const { data: requestsData, isLoading: isLoadingRequests } = useQuery<BookingListResponse>({
        queryKey: ['adminCancelRequests'],
        queryFn: () =>
            bookingApi
                .getBookings({ status: 'pending_cancellation', limit: '100' } as BookingFilter)
                .then((res) => res.data),
        staleTime: 1000 * 30
    })

    const cancelRequests = requestsData?.data || ([] as any)

    // 3. Mutation Cập nhật trạng thái
    const updateStatusMutation = useMutation({
        mutationFn: (data: { id: number; body: UpdateBookingBody }) =>
            bookingApi.updateBookingStatus(data.id, data.body),
        onSuccess: () => {
            toast.success('Đã xử lý yêu cầu thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminBookings'] })
            queryClient.invalidateQueries({ queryKey: ['adminCancelRequests'] })
            queryClient.invalidateQueries({ queryKey: ['adminBookingDetail'] })
            setIsApproveCancelOpen(false)
            setIsRejectCancelOpen(false)
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại')
        }
    })

    // --- HANDLERS ---

    // Xử lý tìm kiếm từ Bảng
    const handleSearch = (value: string) => {
        const newParams = {
            ...queryConfig,
            search: value,
            page: '1'
        }
        const cleanedParams = omitBy(newParams, (v) => isNil(v) || v === '')
        navigate({
            pathname: path.adminBooking,
            search: createSearchParams(cleanedParams as any).toString()
        })
    }

    const handleViewDetail = (id: number) => {
        setSelectedBookingId(id)
        setIsDetailOpen(true)
    }

    // A. Mở Modal DUYỆT Hủy (Approve)
    const handleOpenApproveCancel = (id: number) => {
        setSelectedBookingId(id)
        setIsApproveCancelOpen(true)
    }

    // B. Mở Modal TỪ CHỐI Hủy (Reject)
    const handleOpenRejectCancel = (id: number) => {
        setSelectedBookingId(id)
        setIsRejectCancelOpen(true)
    }

    // Submit DUYỆT Hủy
    const handleSubmitApprove = (reason: string) => {
        if (selectedBookingId) {
            updateStatusMutation.mutate({
                id: selectedBookingId,
                body: {
                    status: 'cancelled',
                    payment_status: 'refunded',
                    cancellation_reason: reason // Lý do admin note lại
                }
            })
        }
    }

    // Submit TỪ CHỐI Hủy
    const handleSubmitReject = (reason: string) => {
        if (selectedBookingId) {
            updateStatusMutation.mutate({
                id: selectedBookingId,
                body: {
                    status: 'cancellation_rejected', // Quay về trạng thái bị từ chối (hoặc confirmed tùy logic)
                    // payment_status giữ nguyên 'paid'
                    cancellation_reason: reason // Lý do từ chối (gửi cho user)
                }
            })
        }
    }

    return (
        <div className='max-w-[1278px] mx-auto py-8 px-4 space-y-12'>
            <h1 className='text-3xl font-bold text-gray-900 text-center'>Quản trị Đặt chỗ</h1>

            {/* --- BẢNG 1: TẤT CẢ ĐẶT CHỖ --- */}
            <div className='space-y-4'>
                <BookingTable
                    bookings={allBookings}
                    isLoading={isLoadingAll}
                    onViewDetail={handleViewDetail}
                    onCancel={handleOpenApproveCancel} // Nút Hủy thông thường
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
                <div className='border-l-4 border-red-500 pl-4'>
                    <h2 className='text-xl font-bold text-red-700 mb-2'>
                        Yêu cầu Hủy vé cần xử lý ({cancelRequests?.length as any})
                    </h2>
                </div>

                {(cancelRequests?.length as any) === 0 ? (
                    <div className='bg-green-50 border border-green-200 rounded-lg p-8 text-center text-green-800 font-medium'>
                        <p>Tuyệt vời! Hiện không có yêu cầu hủy vé nào cần xử lý.</p>
                    </div>
                ) : (
                    <BookingTable
                        bookings={cancelRequests}
                        isLoading={isLoadingRequests}
                        onViewDetail={handleViewDetail}
                        onCancel={handleOpenApproveCancel}
                        onReject={handleOpenRejectCancel}
                        isAdmin
                    />
                )}
            </div>

            {/* --- MODALS --- */}
            <BookingDetailModal_Admin
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                bookingId={selectedBookingId as number}
            />
          

            {/* Modal DUYỆT */}
            <AdminCancelModal
                isOpen={isApproveCancelOpen}
                onClose={() => setIsApproveCancelOpen(false)}
                onSubmit={handleSubmitApprove}
                isLoading={updateStatusMutation.isPending}
                title='Duyệt yêu cầu Hủy vé'
                confirmText='Xác nhận hủy'
                type='approve'
            />

            {/* Modal TỪ CHỐI */}
            <AdminCancelModal
                isOpen={isRejectCancelOpen}
                onClose={() => setIsRejectCancelOpen(false)}
                onSubmit={handleSubmitReject}
                isLoading={updateStatusMutation.isPending}
                title='Từ chối yêu cầu Hủy vé'
                confirmText='Từ chối Hủy'
                type='reject' // Để đổi màu nút thành đỏ/xám
            />
        </div>
    )
}
