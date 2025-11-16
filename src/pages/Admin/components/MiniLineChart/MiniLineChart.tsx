// (File: MiniLineChart.tsx - ĐÃ SỬA)
import React from 'react'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    ChartOptions,
    ChartData, // Import ChartData
    Filler
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
interface MiniLineChartProps {
    data: ChartData<'line', (number | null)[], unknown>
    options: ChartOptions<'line'>
}

// 2. Sửa component để nhận props
const MiniLineChart: React.FC<MiniLineChartProps> = ({ data, options }) => {
    // 3. Xóa bỏ const data = {...} và const options = {...} (dữ liệu tĩnh)

    // 4. Render component Line với data và options động từ props
    return <Line options={options} data={data} />
}

export default MiniLineChart
