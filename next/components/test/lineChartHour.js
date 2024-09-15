import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// 註冊 Chart.js 的模組
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const LineChartHour = ({ statistics = [] }) => {
  const data = {
    labels: [
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
    ],
    datasets: [
      {
        label: 'Hourly Booking',
        data: statistics,
        borderColor: '#d71515',
        backgroundColor: '#d715158b',
        fill: true,
        tension: 0,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointBackgroundColor: '#d71515',
        pointBorderColor: '#d71515',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14, // 調整圖例文字的字體大小
          },
        },
      },
      title: {
        display: true,
        text: 'Monthly Revenue for 2024',
        font: {
          size: 18, // 調整標題字體大小
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
          font: {
            size: 16,
          },
        },
        ticks: {
          font: {
            size: 16, // 調整X軸標籤字體大小
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Revenue (NTD)',
          font: {
            size: 16,
          },
        },
        ticks: {
          font: {
            size: 16, // 調整Y軸標籤字體大小
          },
          beginAtZero: true,
        },
      },
    },
  }

  return <Line data={data} options={options} />
}

export default LineChartHour
