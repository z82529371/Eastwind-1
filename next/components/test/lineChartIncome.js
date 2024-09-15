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

const LineChartIncome = ({ statistics = [] }) => {
  const data = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: statistics,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: 'rgba(75, 192, 192, 1)',
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

export default LineChartIncome
