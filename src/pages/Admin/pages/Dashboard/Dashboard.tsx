import { useQuery } from '@tanstack/react-query'

import StatCard from '../../components/StatCard/StatCard'
import { formatCurrency } from '~/utils/utils'
import { DashboardApi } from '~/apis/dashboard.api'
import AirlineMarketShare from '../../components/AirlineMarketShare/AirlineMarketShare'
import RevenueTrendChart from '../../components/RevenueTrendChart/RevenueTrendChart'
import BookingStatsChart from '../../components/BookingStatsChart/BookingStatsChart'
import BaggageStatsChart from '../../components/BaggageStatsChart/BaggageStatsChart'

export default function Dashboard() {
    // Gọi API Tuần (sử dụng DashboardApi)
    const { data: weeklyResponse } = useQuery({
        queryKey: ['weeklyRevenueStats'],
        queryFn: DashboardApi.getWeeklyRevenue
    })

    // Gọi API Tháng (sử dụng DashboardApi)
    const { data: monthlyResponse } = useQuery({
        queryKey: ['monthlyRevenueStats'],
        queryFn: DashboardApi.getMonthlyRevenue
    })

    const { data: todayResponse } = useQuery({
        queryKey: ['todayBookingsStats'],
        queryFn: DashboardApi.getTodayBookings
    })

    const { data: userStatsResponse } = useQuery({
        queryKey: ['userStats'],
        queryFn: DashboardApi.getUserStats // Gọi hàm mới
    })

    const weeklyData = weeklyResponse?.data.data
    const monthlyData = monthlyResponse?.data.data
    const todayData = todayResponse?.data.data
    const userStatsData = userStatsResponse?.data.data
    // Logic cho Doanh thu Tuần

    const revenueChangeType = (weeklyData?.percentage_change as number) >= 0 ? 'increase' : 'decrease'
    const revenueChangeValue = `${Math.abs(weeklyData?.percentage_change as number).toFixed(2)}%`
    // *** LOGIC MỚI CHO THẺ USER THEO YÊU CẦU ***
    // Tính tỷ lệ: (người dùng / hành khách) * 100
    let userPassengerRatio = 0
    if ((userStatsData?.total_passengers as number) > 0) {
        // Tránh chia cho 0 nếu total_passengers là 0
        userPassengerRatio = ((userStatsData?.total_users as number) / Number(userStatsData?.total_passengers)) * 100
    }
    // Tạo chuỗi mô tả
    const userStatDescription = `${userStatsData?.total_passengers} hành khách (chiếm ${userPassengerRatio.toFixed(2)}%)`
    return (
        <>
            <h1 className='hidden md:block text-3xl font-bold text-gray-800 mb-8'>Dashboard</h1>

            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8'>
                <StatCard
                    title='Doanh thu (Tuần)'
                    value={formatCurrency(weeklyData?.total_revenue as number)}
                    change={revenueChangeValue}
                    changeType={revenueChangeType}
                    description='so với tuần trước'
                />
                <StatCard
                    title='Doanh thu tháng'
                    value={formatCurrency(monthlyData?.total_revenue as number)}
                    description={`Đặt chỗ ${monthlyData?.total_bookings as number}`}
                />
                <StatCard
                    title='Tổng số đặt chỗ hôm nay'
                    value={todayData?.total_bookings as number}
                    description={`${todayData?.total_tickets_sold} vé bán ra`}
                />

                <StatCard
                    title='Thống kê người dùng'
                    value={userStatsData?.total_users.toString() as string} // 9
                    description={userStatDescription} // "165 hành khách (chiếm 5.45%)"
                    changeColor='text-green-500' // Theo ví dụ của bạn
                />

                <AirlineMarketShare />

                {/* Card Xu hướng doanh thu */}
                <RevenueTrendChart />

                <BookingStatsChart />

                <BaggageStatsChart />
            </div>
        </>
    )
}
