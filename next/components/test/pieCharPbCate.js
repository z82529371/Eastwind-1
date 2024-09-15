import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// 註冊 Chart.js 的模組
ChartJS.register(ArcElement, Tooltip, Legend)

const PieChartPbCate = ({ statistics = [] }) => {
  const data = {
    labels: ['課程', '商品'],
    datasets: [
      {
        label: 'price',
        data: statistics,
        backgroundColor: ['#2b4d37', '#1e8148'],
        borderColor: ['#2b4d37', '#1e8148'],
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
            size: 20, // 調整圖例文字的字體大小
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

export default PieChartPbCate
