import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { DashboardApi, MarketSharePeriod } from '~/apis/dashboard.api'
import ChartCard from '../ChartCard/ChartCard'
import DonutChart from '../DonutChart/DonutChart'
import EmptyChartState from '../EmptyChartState/EmptyChartState'
// Import đầy đủ từ file API

// --- HÀM TRỢ GIÚP ---

// Hàm định dạng ngày an toàn
const formatDate = (dateString?: string) => {
    if (!dateString) return '...'
    return new Date(dateString).toLocaleDateString('vi-VN')
}

// Danh sách màu cố định cho biểu đồ
const CHART_COLORS = [
    '#3B82F6', // blue-500
    '#10B981', // green-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#6366F1', // indigo-500
    '#D946EF' // fuchsia-500
]

// --- COMPONENT CHÍNH ---

const AirlineMarketShare = () => {
    // 1. Quản lý state của period
    const [period, setPeriod] = useState<MarketSharePeriod>('7days')

    // 2. useQuery để lấy DỮ LIỆU BIỂU ĐỒ (phụ thuộc vào 'period')
    const {
        data: response,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['airlineMarketShare', period], // queryKey thay đổi khi 'period' thay đổi
        queryFn: () => DashboardApi.getAirlineMarketShare(period) // Gọi lại API với 'period' mới
    })

    // 3. useMutation để xử lý EXPORT FILE (chỉ chạy khi được gọi)
    const exportMutation = useMutation({
        mutationFn: (period: MarketSharePeriod) => DashboardApi.exportAirlineMarketShare(period),
        onSuccess: (data) => {
            // 'data' là response từ axios, .data là nội dung blob
            const blob = new Blob([data.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })

            // Tạo URL ảo cho file blob
            const url = URL.createObjectURL(blob)
            // Tạo thẻ <a> ẩn
            const link = document.createElement('a')
            link.href = url
            // Đặt tên file download
            link.setAttribute('download', `bao_cao_thi_phan_${period}.xlsx`)

            // Thêm thẻ <a>, click, và gỡ bỏ
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url) // Giải phóng bộ nhớ
        },
        onError: (error) => {
            console.error('Lỗi khi xuất file:', error)
            alert('Xuất file thất bại!')
        }
    })

    // 4. Hàm xử lý khi click nút export
    const handleExportClick = () => {
        // Gọi mutation, truyền 'period' hiện tại
        exportMutation.mutate(period)
    }

    // 5. Xử lý trạng thái Loading
    if (isLoading) {
        return (
            <div className='md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                <div className='h-72 w-full mt-6 animate-pulse bg-gray-200 rounded-md'></div>
            </div>
        )
    }

    // 6. Xử lý trạng thái Lỗi
    if (isError) {
        return <div className='md:col-span-2 p-6 text-red-500'>Lỗi tải biểu đồ thị phần.</div>
    }

    // 7. Xử lý và định dạng dữ liệu (an toàn)
    const apiData = response?.data.data

    const chartLabels = apiData?.airlines.map((a) => a.airline_name) || []
    const chartDataPoints = apiData?.airlines.map((a) => a.ticket_count) || []

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Số vé',
                data: chartDataPoints,
                backgroundColor: CHART_COLORS.slice(0, chartLabels.length),
                borderColor: '#FFFFFF',
                borderWidth: 2
            }
        ]
    }

    // Dữ liệu cho các ô thông tin
    const totalTicketsText = `${apiData?.total_tickets || 0} vé`
    const periodText = `${formatDate(apiData?.period_start)} - ${formatDate(apiData?.period_end)}`

    // 8. Render component
    return (
        <ChartCard
            title='Thị phần Hãng hàng không'
            colSpan='md:col-span-2'
            filterType='dateRange'
            periodValue={period}
            onPeriodChange={setPeriod}
            onExportClick={handleExportClick}
            isExporting={exportMutation.isPending}
            isBooking={true}
            titleBlogOne='Tổng số vé'
            textBlogOne={totalTicketsText}
            titleBlogTwo='Giai đoạn'
            textBlogTwo={periodText}
        >
            {apiData && apiData.total_tickets > 0 ? (
                <DonutChart data={chartData} />
            ) : (
                <EmptyChartState
                    message='Không có dữ liệu'
                    description='Chưa có vé nào được bán trong thời gian này.'
                />
            )}
        </ChartCard>
    )
}

export default AirlineMarketShare
