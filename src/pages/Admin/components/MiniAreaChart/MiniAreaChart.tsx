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
    Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

const data = {
    labels: ['Ngày 1', 'Ngày 2', 'Ngày 3', 'Ngày 4', 'Ngày 5', 'Ngày 6', 'Ngày 7'],
    datasets: [
        {
            label: 'Doanh thu',
            data: [200000, 100000, 150000, 200000, 350000, 180000, 200000],
            fill: true, // Quan trọng: Bật tô màu vùng
            backgroundColor: 'rgba(16, 185, 129, 0.2)', // Xanh lá, mờ (emerald-500)
            borderColor: '#10B981', // Xanh lá, đậm
            tension: 0.4
        }
    ]
}

const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index', // Hiển thị tooltip theo chỉ số trên trục X
        intersect: false // Hiển thị tooltip ngay cả khi không chạm vào điểm dữ liệu
    },
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (context) => `Doanh thu: ${context.formattedValue} ₫`
            }
        }
    },
    scales: {
        y: { display: false },
        x: { display: false }
    },
    elements: {
        point: {
            radius: 0
        }
    }
}

const MiniAreaChart: React.FC = () => {
    return <Line options={options} data={data} />
}

export default MiniAreaChart
