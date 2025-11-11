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
    ChartOptions
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const data = {
    labels: ['5/1', '6/1', '7/1', '9/1', '10/1', '11/1', '12/1', '13/1', '14/1', '16/1', '17/1', '18/1', '24/1'],
    datasets: [
        {
            label: 'Doanh thu (triệu đồng)',
            data: [20, 40, 12, 5, 15, 25, 10, 5, 58, 25, 48, 2],
            backgroundColor: '#3B82F6',
            borderRadius: 4
        }
    ]
}

const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        title: {
            // Thêm tiêu đề phụ để hiển thị rõ tháng/năm
            display: true,
            text: 'Xu hướng doanh thu Tháng 1/2025',
            align: 'center',
            padding: {
                bottom: 20
            },
            font: {
                size: 13,
                weight: 'bold'
            },
            color: '#444' // text-gray-500
        }
    },
    scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Doanh thu (triệu đồng)' } },
        x: { grid: { display: false } }
    }
}

const BarChart: React.FC = () => <Bar options={options} data={data} />

export default BarChart
