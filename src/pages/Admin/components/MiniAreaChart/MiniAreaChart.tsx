// (File: MiniAreaChart.tsx - ĐÃ SỬA)
import React from 'react'
import { Line } from 'react-chartjs-2' // Biểu đồ vùng (Area chart) vẫn dùng component Line
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    ChartOptions,
    ChartData, // Import ChartData
    Filler // Import Filler
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler // Đăng ký Filler
)

// 1. Định nghĩa props mà component sẽ nhận
interface MiniAreaChartProps {
    data: ChartData<'line', (number | null)[], unknown>
    options: ChartOptions<'line'>
}

// 2. Sửa component để nhận props
const MiniAreaChart: React.FC<MiniAreaChartProps> = ({ data, options }) => {
    // 3. Xóa bỏ const data = {...} và const options = {...} (dữ liệu tĩnh)

    // 4. Render component Line với data và options động từ props
    return <Line options={options} data={data} />
}

export default MiniAreaChart
