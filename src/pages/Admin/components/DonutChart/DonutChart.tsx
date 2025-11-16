// (File: DonutChart.tsx)
import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

// --- ĐỊNH NGHĨA PROPS MÀ COMPONENT NÀY SẼ NHẬN ---
interface ChartData {
    labels: string[]
    datasets: Array<{
        label: string
        data: number[]
        backgroundColor: string[]
        borderColor: string
        borderWidth: number
    }>
}

interface DonutChartProps {
    data: ChartData | any
}
// --------------------------------------------------

// Các tùy chọn (options) có thể giữ nguyên vì chúng chung
const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } },
    cutout: '70%'
}

// *** Sửa component để nhận `data` từ props ***
const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
    return <Doughnut data={data} options={options} />
}

export default DonutChart
