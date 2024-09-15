import { useState, useEffect, useContext } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import { AuthContext } from '@/context/AuthContext'
import HeroSection from '@/components/home/HeroSection'
import IntroSection from '@/components/home/IntroSection'
import RoomSection from '@/components/home/RoomSection'
import ProductSection from '@/components/home/ProductSection'
import CourseSection from '@/components/home/CourseSection'
import styles from '@/styles/boyu/home.module.scss'
import MouseMove from '@/components/mouseMove'

export default function Home() {
  const router = useRouter()

  const { user } = useContext(AuthContext) // 使用 AuthContext 獲取當前登入用戶資訊

  const [isClient, setIsClient] = useState(false) // 客戶端渲染狀態

  // 在客戶端渲染時設置 isClient 為 true
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 清除 localStorage 中的指定項目
  useEffect(() => {
    localStorage.removeItem('registeredAccount')
    localStorage.removeItem('registeredPassword')
    localStorage.removeItem('savedAccount')
    localStorage.removeItem('resetAccount')
  }, [])

  // 檢查是否需要顯示 SweetAlert
  useEffect(() => {
    if (localStorage.getItem('showWelcomeAlert') === 'true') {
      Swal.fire({
        title: '歡迎加入！',
        html: `<span class="p">請先填寫會員資料。</span>`,
        icon: 'info',
        confirmButtonText: '確認',
        customClass: {
          popup: `${styles['swal-popup-bo']}`,
          title: 'h6',
          icon: `${styles['swal-icon-bo']}`,
          confirmButton: `${styles['swal-btn-bo']}`,
        },
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('showWelcomeAlert') // 移除標記
          router.push('/user/user-center/info-edit') // 跳轉到資料編輯頁面
        }
      })
    }
  }, [])

  // 檢查用戶 ID 是否為 62，若是則跳轉到管理頁面
  useEffect(() => {
    if (user && user.id === 62) {
      router.push('http://localhost:3000/admin/chart')
      Swal.fire({
        title: '登入成功！',
        html: `<span class="p">管理員 歡迎回來！</span>`,
        icon: 'success',
        customClass: {
          popup: `${styles['swal-popup-bo']}`,
          title: 'h6',
          icon: `${styles['swal-icon-bo']}`,
          confirmButton: `${styles['swal-btn-bo']}`,
        },
        confirmButtonText: '確認',
      })
    }
  }, [user])

  return (
    <>
      {isClient && (
        <div className={styles['bg-video-box']}>
          <video
            src="/video/bg-video.mp4"
            autoPlay
            muted
            loop
            className={styles['bg-video-bo']}
          ></video>
          <div className={styles['video-overlay-bo']}></div>
        </div>
      )}
      <main className={styles['body']}>
        <MouseMove />
        {/* 主視覺 */}
        <HeroSection />
        {/* intro */}
        <IntroSection />
        {/* 棋牌室 */}
        <RoomSection />
        {/* 商品 */}
        <ProductSection />
        {/* 線上課程 */}
        <CourseSection />
      </main>
    </>
  )
}
