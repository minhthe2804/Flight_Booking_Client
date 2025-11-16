// (File: BarChart.tsx - PHIÊN BẢN SỬA ĐÚNG)
import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData // Thêm ChartData
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// 1. Định nghĩa props mà component sẽ nhận từ cha
interface BarChartProps {
    // Dùng ChartData<'bar'> để định nghĩa kiểu dữ liệu chặt chẽ
    data: ChartData<'bar', (number | null)[], unknown>
    options: ChartOptions<'bar'>
}

// 2. Sửa component để nhận props
const BarChart: React.FC<BarChartProps> = ({ data, options }) => {
    // 3. XÓA BỎ const data = {...} và const options = {...} TĨNH Ở ĐÂY

    // 4. Render component Bar với data và options động nhận từ props
    return <Bar options={options} data={data} />
}

export default BarChart
