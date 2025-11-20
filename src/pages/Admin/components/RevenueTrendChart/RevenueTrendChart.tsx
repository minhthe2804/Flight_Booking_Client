import  { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ChartOptions, ChartData } from 'chart.js'
import { DashboardApi } from '~/apis/dashboard.api'
import ChartCard from '../ChartCard/ChartCard'
import BarChart from '../BarChart/BarChart'
import EmptyChartState from '../EmptyChartState/EmptyChartState'

// Import các component con

// --- (Các hàm trợ giúp formatShortDate, formatCurrency giữ nguyên) ---

const formatShortDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })
}

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

const RevenueTrendChart = () => {
    // (Phần useState, useQuery, useMutation, handlers... giữ nguyên)
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    console.log(currentMonth)
    const [month, setMonth] = useState<number>(currentMonth)
    const [year, setYear] = useState<number>(currentYear)

    const {
        data: response,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['revenueTrend', month, year],
        queryFn: () => DashboardApi.getRevenueTrend(month, year)
    })

    const exportMutation = useMutation({
        mutationFn: ({ m, y }: { m: number; y: number }) => DashboardApi.exportRevenueTrend(m, y),
        onSuccess: (data) => {
            // ... (logic export)
            const blob = new Blob([data.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `bao_cao_doanh_thu_T${month}_${year}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        },
        onError: (error) => {
            console.error('Lỗi khi xuất file doanh thu:', error)
            alert('Xuất file thất bại!')
        }
    })

    const handleExportClick = () => {
        exportMutation.mutate({ m: month, y: year })
    }

    // (Phần xử lý isLoading, isError giữ nguyên)
    if (isLoading) {
        return (
            <div className='md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                <div className='h-72 w-full mt-6 animate-pulse bg-gray-200 rounded-md'></div>
            </div>
        )
    }
    if (isError) {
        return <div className='md:col-span-2 p-6 text-red-500'>Lỗi tải biểu đồ doanh thu.</div>
    }

    // (Phần xử lý apiData, labels, revenueData giữ nguyên)
    const apiData = response?.data.data
    const labels = apiData?.daily_revenue.map((stat) => formatShortDate(stat.date)) || []
    const revenueData = apiData?.daily_revenue.map((stat) => stat.revenue / 1_000_000) || []

    // === THAY ĐỔI TẠI ĐÂY ===
    // Định nghĩa data cho BarChart
    const chartData: ChartData<'bar', (number | null)[], unknown> = {
        labels: labels,
        datasets: [
            {
                label: 'Doanh thu (triệu đồng)',
                data: revenueData,
                backgroundColor: '#3B82F6',
                borderRadius: 4,
                // Thêm thuộc tính này để giới hạn độ rộng của 1 cột
                maxBarThickness: 60 // Đặt là 60px (bạn có thể đổi thành 40, 50, 80...)
            }
        ]
    }
    // === KẾT THÚC THAY ĐỔI ===

    // (Phần chartOptions giữ nguyên)
    const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: `Xu hướng doanh thu Tháng ${month}/${year}`,
                align: 'center',
                padding: { bottom: 20 },
                font: { size: 13, weight: 'bold' },
                color: '#444'
            }
        },
        scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Doanh thu (triệu đồng)' } },
            x: { grid: { display: false } }
        }
    }

    // (Phần return component ChartCard giữ nguyên)
    return (
        <ChartCard
            title='Xu hướng Doanh thu'
            colSpan='md:col-span-2'
            filterType='monthYear'
            monthValue={month}
            yearValue={year}
            onMonthChange={setMonth}
            onYearChange={setYear}
            onExportClick={handleExportClick}
            isExporting={exportMutation.isPending}
            isBooking={true}
            titleBlogOne='Tổng doanh thu'
            textBlogOne={formatCurrency(apiData?.total_revenue)}
            titleBlogTwo='Tổng đơn hàng'
            textBlogTwo={apiData?.total_orders.toString() || '0'}
        >
            {apiData && apiData.total_orders > 0 ? (
                <BarChart data={chartData} options={chartOptions} />
            ) : (
                <EmptyChartState message='Không có doanh thu' description='Chưa có đơn hàng nào trong tháng này.' />
            )}
        </ChartCard>
    )
}

export default RevenueTrendChart
