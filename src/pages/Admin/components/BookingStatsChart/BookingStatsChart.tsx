// (File: BookingStatsChart.tsx - COMPONENT MỚI)
import  { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ChartOptions, ChartData } from 'chart.js'
import ChartCard from '../ChartCard/ChartCard'
import MiniLineChart from '../MiniLineChart/MiniLineChart'
import { DashboardApi, MarketSharePeriod } from '~/apis/dashboard.api'
import EmptyChartState from '../EmptyChartState/EmptyChartState'
// Import đầy đủ từ file API

// Import các component con

// --- HÀM TRỢ GIÚP ---
// Hàm định dạng ngày: '2025-10-31' -> '31/10'
const formatShortDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })
}

// --- COMPONENT CHÍNH ---

const BookingStatsChart = () => {
    // 1. Quản lý state của period
    const [period, setPeriod] = useState<MarketSharePeriod>('7days')

    // 2. useQuery để lấy DỮ LIỆU BIỂU ĐỒ
    const {
        data: response,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['bookingStats', period], // Tự động gọi lại khi 'period' thay đổi
        queryFn: () => DashboardApi.getBookingStats(period)
    })

    // 3. useMutation ĐỂ XỬ LÝ EXPORT
    const exportMutation = useMutation({
        mutationFn: (period: MarketSharePeriod) => DashboardApi.exportBookingStats(period),
        onSuccess: (data) => {
            const blob = new Blob([data.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `bao_cao_dat_cho_${period}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        },
        onError: (error) => {
            console.error('Lỗi khi xuất file:', error)
            alert('Xuất file thất bại!')
        }
    })

    // 4. HÀM XỬ LÝ CLICK EXPORT
    const handleExportClick = () => {
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
        return <div className='md:col-span-2 p-6 text-red-500'>Lỗi tải thống kê đặt chỗ.</div>
    }

    // 7. Xử lý và định dạng dữ liệu
    const apiData = response?.data.data
    const labels = apiData?.daily_stats.map((stat) => formatShortDate(stat.date)) || []

    const chartData: ChartData<'line', (number | null)[], unknown> = {
        labels: labels,
        datasets: [
            {
                label: 'Đặt chỗ', // Từ API: bookings_count
                data: apiData?.daily_stats.map((stat) => stat.bookings_count) || [],
                borderColor: '#3B82F6', // Xanh dương
                backgroundColor: 'rgba(59, 130, 246, 0.1)', // Màu nền xanh dương nhạt
                fill: true, // Bật tô màu nền
                tension: 0.4
            },
            {
                label: 'Hành khách', // Từ API: passengers_count
                data: apiData?.daily_stats.map((stat) => stat.passengers_count) || [],
                borderColor: '#F59E0B', // Vàng
                backgroundColor: 'rgba(245, 158, 11, 0.1)', // Màu nền vàng nhạt
                fill: true, // Bật tô màu nền
                tension: 0.4
            }
        ]
    }

    // 8. Định nghĩa Options cho biểu đồ (Hiển thị đầy đủ, không ẩn)
    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' }, // Hiển thị chú thích
            tooltip: { mode: 'index', intersect: false } // Hiển thị cả 2 khi di chuột
        },
        scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Số lượng' } },
            x: { grid: { display: false } }
        },
        elements: {
            point: {
                radius: 2 // Hiện điểm chấm nhỏ
            }
        }
    }

    // 9. Render component
    return (
        <ChartCard
            title='Thống kê Đặt chỗ'
            colSpan='md:col-span-2'
            filterType='dateRange' // Báo cho Card dùng bộ lọc 7/14 ngày
            // Props cho bộ lọc
            periodValue={period}
            onPeriodChange={setPeriod}
            // Props cho Export
            onExportClick={handleExportClick}
            isExporting={exportMutation.isPending}
            // Props cho ô thông tin
            isBooking={true}
            titleBlogOne='Tổng lượt đặt'
            textBlogOne={apiData?.total_bookings.toString() || '0'}
            titleBlogTwo='Tổng hành khách'
            textBlogTwo={apiData?.total_passengers.toString() || '0'}
        >
            {apiData && apiData.total_bookings > 0 ? (
                <MiniLineChart data={chartData} options={chartOptions} />
            ) : (
                <EmptyChartState
                    message='Không có dữ liệu'
                    description='Chưa có lượt đặt chỗ nào trong thời gian này.'
                />
            )}
        </ChartCard>
    )
}

export default BookingStatsChart
