// (File: BaggageStatsChart.tsx - COMPONENT MỚI)
import  { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ChartOptions, ChartData } from 'chart.js'
import { DashboardApi, MarketSharePeriod } from '~/apis/dashboard.api'
import ChartCard from '../ChartCard/ChartCard'
import MiniAreaChart from '../MiniAreaChart/MiniAreaChart'
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

// Hàm định dạng tiền tệ an toàn
const formatCurrency = (value?: number | null) => {
    if (value === null || typeof value === 'undefined' || isNaN(value)) {
        return '0 ₫'
    }
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value)
}

// --- COMPONENT CHÍNH ---

const BaggageStatsChart = () => {
    // 1. Quản lý state của period
    const [period, setPeriod] = useState<MarketSharePeriod>('7days')

    // 2. useQuery để lấy DỮ LIỆU BIỂU ĐỒ
    const {
        data: response,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['baggageStats', period], // Tự động gọi lại khi 'period' thay đổi
        queryFn: () => DashboardApi.getBaggageStats(period)
    })

    // 3. useMutation ĐỂ XỬ LÝ EXPORT
    const exportMutation = useMutation({
        mutationFn: (period: MarketSharePeriod) => DashboardApi.exportBaggageStats(period),
        onSuccess: (data) => {
            const blob = new Blob([data.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `bao_cao_hanh_ly_${period}.xlsx`)
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
        return <div className='md:col-span-2 p-6 text-red-500'>Lỗi tải thống kê hành lý.</div>
    }

    // 7. Xử lý và định dạng dữ liệu
    const apiData = response?.data.data
    // Lấy labels (ngày) từ mảng 'baggage_services'
    const labels = apiData?.baggage_services.map((stat) => formatShortDate(stat.date)) || []
    // Lấy data (doanh thu) từ mảng 'baggage_services'
    const revenueData = apiData?.baggage_services.map((stat) => stat.revenue) || []

    // Tạo chartData động, dựa theo style (màu xanh lá) bạn cung cấp
    const chartData: ChartData<'line', (number | null)[], unknown> = {
        labels: labels,
        datasets: [
            {
                label: 'Doanh thu',
                data: revenueData,
                fill: true, // Bật tô màu vùng
                backgroundColor: 'rgba(16, 185, 129, 0.2)', // Xanh lá, mờ
                borderColor: '#10B981', // Xanh lá, đậm
                tension: 0.4
            }
        ]
    }

    // 8. Định nghĩa Options động, dựa theo style bạn cung cấp
    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    // Dùng hàm formatCurrency cho tooltip
                    label: (context) => `Doanh thu: ${formatCurrency(context.raw as number)}`
                }
            }
        },
        scales: {
            y: { display: false }, // Ẩn trục Y
            x: { display: false } // Ẩn trục X
        },
        elements: {
            point: {
                radius: 0 // Ẩn điểm chấm
            }
        }
    }

    // 9. Render component
    return (
        <ChartCard
            title='Thống kê Dịch vụ Hành lý'
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
            titleBlogOne='Tổng doanh thu'
            textBlogOne={formatCurrency(apiData?.total_revenue)}
            titleBlogTwo='Tổng đơn hàng'
            textBlogTwo={apiData?.total_orders.toString() || '0'}
        >
            {apiData && apiData.total_orders > 0 ? (
                <MiniAreaChart data={chartData} options={chartOptions} />
            ) : (
                <EmptyChartState
                    message='Không có dữ liệu'
                    description='Chưa có dịch vụ nào được bán trong thời gian này.'
                />
            )}
        </ChartCard>
    )
}

export default BaggageStatsChart
