import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const data = {
    labels: ['VietJet Air', 'Vietnam Airlines', 'United Airlines', 'American Airlines'],
    datasets: [
        {
            label: 'Thị phần',
            data: [55, 30, 10, 5],
            backgroundColor: ['#3B82F6', '#10B981', '#2dd4bf', '#F59E0B'],
            borderColor: '#FFFFFF',
            borderWidth: 2
        }
    ]
}

const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } },
    cutout: '70%'
}

const DonutChart: React.FC = () => <Doughnut data={data} options={options} />

export default DonutChart
