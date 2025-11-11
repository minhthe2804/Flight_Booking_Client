import { formatCurrency } from '~/utils/utils'
import BarChart from '../../components/BarChart/BarChart'
import ChartCard from '../../components/ChartCard/ChartCard'
import DonutChart from '../../components/DonutChart/DonutChart'
import MiniAreaChart from '../../components/MiniAreaChart/MiniAreaChart'
import MiniLineChart from '../../components/MiniLineChart/MiniLineChart'
import StatCard from '../../components/StatCard/StatCard'

export default function Dashboard() {
    return (
        <>
            <h1 className='hidden md:block text-3xl font-bold text-gray-800 mb-8'>Dashboard</h1>

            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8'>
                <StatCard
                    title='Doanh thu tuần'
                    value='3.015.000 ₫'
                    change='-98.06%'
                    changeType='decrease'
                    description='so với tuần trước'
                />
                <StatCard title='Doanh thu tháng' value='258.261.042 ₫' description='39 đặt chỗ' />
                <StatCard title='Tổng số đặt chỗ hôm nay' value='1' description='1 vé bán ra' />
                <StatCard
                    title='Thống kê người dùng'
                    value='14'
                    description='24 hành khách (chiếm 58.33%)'
                    changeColor='text-green-500'
                />

                <ChartCard
                    title='Thị phần hãng hàng không'
                    colSpan='xl:col-span-2'
                    filterType='dateRange' // Chỉ cần truyền loại bộ lọc
                >
                    <DonutChart />
                </ChartCard>

                {/* Card Xu hướng doanh thu */}
                <ChartCard
                    title='Xu hướng doanh thu'
                    colSpan='xl:col-span-2'
                    filterType='monthYear' // Chỉ cần truyền loại bộ lọc
                >
                    <BarChart />
                </ChartCard>

                <ChartCard
                    title='Thống kê đặt chỗ'
                    colSpan='xl:col-span-2'
                    filterType='dateRange' // Chỉ cần truyền loại bộ lọc
                    isBooking
                    titleBlogOne='Tổng đặt chỗ'
                    textBlogOne='20'
                    titleBlogTwo='Tổng số vé bán ra'
                    textBlogTwo='36'
                >
                    <MiniLineChart />
                </ChartCard>

                <ChartCard
                    title='Thống kê dịch vụ hành lý '
                    colSpan='xl:col-span-2'
                    filterType='dateRange' // Chỉ cần truyền loại bộ lọc
                    isBooking
                    titleBlogOne='Tổng đơn hàng'
                    textBlogOne='5'
                    titleBlogTwo='Tổng doanh thu'
                    textBlogTwo={formatCurrency(1300000)}
                >
                    <MiniAreaChart />
                </ChartCard>
            </div>
        </>
    )
}
