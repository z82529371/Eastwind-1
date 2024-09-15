import React from 'react'
import Lottie from 'lottie-react'
import loadingAnimation from './dice.json' // 引入 Lottie 動畫 JSON 文件

const Loading = () => {
  return (
    <div
      style={{
        position: 'fixed', // 設置為固定定位，懸浮在頁面上
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        minHeight: '100vh', // 確保頁面占據至少全屏的高度
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // 半透明背景色
        zIndex: 9999, // 確保在最上層
      }}
    >
      <Lottie
        animationData={loadingAnimation} // 設定動畫資料來源
        loop={true} // 設定動畫循環
        autoplay={true} // 設定動畫自動播放
        style={{ width: 200, height: 200 }} // 設定動畫顯示尺寸
      />
    </div>
  )
}

export default Loading
