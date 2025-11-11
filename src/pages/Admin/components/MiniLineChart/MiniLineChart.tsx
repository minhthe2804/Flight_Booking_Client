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
    Filler // Import Filler để tô màu
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

const data = {
    labels: ['12/10', '13/10', '14/10', '15/10', '16/10', '17/10', '18/10'],
    datasets: [
        {
            label: 'Đặt chỗ',
            data: [3, 5, 4, 2, 6, 4, 2],
            borderColor: '#3B82F6', // Xanh dương
            tension: 0.4
        },
        {
            label: 'Vé bán ra',
            data: [5, 8, 6, 3, 9, 5, 3],
            borderColor: '#F59E0B', // Vàng
            tension: 0.4
        }
    ]
}

const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false } // Hiển thị tooltip cho cả 2 đường
    },
    scales: {
        y: { display: false },
        x: { display: false }
    },
    elements: {
        point: {
            radius: 0 // Ẩn các điểm chấm trên đường
        }
    }
}

const MiniLineChart: React.FC = () => {
    return <Line options={options} data={data} />
}

export default MiniLineChart
