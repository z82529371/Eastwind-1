import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// 註冊 Chart.js 的模組
ChartJS.register(ArcElement, Tooltip, Legend)

const PieChartAge = ({ statistics = [] }) => {
  const data = {
    labels: ['20歲以下', '21-35', '36-50', '51歲以上'],
    datasets: [
      {
        label: 'people',
        data: statistics,
        backgroundColor: ['#ffe9b1', '#b79347', '#76592a', '#3f2f16'],
        borderColor: ['#ffe9b1', '#b79347', '#76592a', '#3f2f16'],
        borderWidth: 1,
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
            size: 12, // 調整圖例文字的字體大小
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  }

  return <Pie data={data} options={options} />
}

export default PieChartAge
