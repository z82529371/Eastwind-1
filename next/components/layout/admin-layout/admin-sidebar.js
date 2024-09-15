import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import styles from './admin-siderbar.module.scss'
import { FaChevronDown, FaChartLine, FaTruck } from 'react-icons/fa6'
import Link from 'next/link'
import { AuthContext } from '@/context/AuthContext'
import { BsChatDots } from 'react-icons/bs'

export default function AdminSidebar() {
  const router = useRouter()
  const [activeLink, setActiveLink] = useState('chart') // 狀態：追蹤當前活躍的鏈接
  const [firstLink, setFirstLink] = useState('chart') // 初始化 firstLink 為 info

  // 從 AuthContext 中獲取 user 狀態
  const { user } = useContext(AuthContext)

  useEffect(() => {
    // 當 user 狀態變化時，強制重新渲染
    setActiveLink((prev) => prev)
  }, [user])

  // 當路徑發生變化時，更新 activeLink 和 firstLink 的狀態
  useEffect(() => {
    const path = router.pathname.split('/').pop() // 獲取當前路徑的最後部分

    if (router.pathname.startsWith('/admin/chart')) {
      // 如果路徑是 /user/user-center/order 或 /user/user-center/order/[oid]
      setActiveLink('chart')
      setFirstLink('chart')
    } else {
      setActiveLink(path)
      setFirstLink(path) // 確保 firstLink 也會更新為當前路徑
    }
  }, [router.pathname])

  // 更新 activeLink 和 firstLink 的函數
  const updateActiveLink = (link) => {
    setFirstLink(link)
    setActiveLink(link)
  }

  // 根據鏈接名稱返回對應的圖標

  function getIcon(link) {
    switch (link) {
      case 'chart':
        return <FaChartLine />

      case 'arrival':
        return <FaTruck />

      case 'chat':
        return <BsChatDots />

      default:
        return null
    }
  }

  // 根據鏈接名稱返回對應的標籤

  function getLabel(link) {
    switch (link) {
      case 'chart':
        return '數據分析'

      case 'arrival':
        return '出貨狀況'

      case 'chat':
        return '客服中心'

      default:
        return ''
    }
  }
  return (
    <section>
      {/* 桌面版側邊欄 */}
      <aside
        className={`${styles['user-desktop-sidebar-bo']}  flex-column align-items-center h-100 d-none d-md-flex gap-5`}
      >
        <div
          className={`${styles['user-sidebar-head-bo']} d-flex flex-column justify-content-center align-items-center`}
        >
          <div
            className={`${styles['user-welcome-box-bo']} h6 d-none d-md-block`}
          >
            {/* 使用來自 Context 的 user.username 來顯示用戶名稱 */}
            歡迎，管理員
          </div>
        </div>
        <div
          className={`${styles['user-sidebar-body-bo']} d-flex justify-content-start align-items-center`}
        >
          <ul
            className={`${styles['user-sidebar-menu-bo']} d-flex flex-column`}
          >
            {/* 選單項目：個人資料 */}
            <li>
              <Link
                href="/admin/chart"
                className={`${
                  styles['user-sidebar-link-bo']
                } h6 d-flex align-items-center gap-4 ${
                  activeLink === 'chart' ? styles['user-link-active'] : ''
                }`}
              >
                <FaChartLine /> 數據分析
              </Link>
            </li>
            <li>
              <Link
                href="/admin/arrival"
                className={`${
                  styles['user-sidebar-link-bo']
                } h6 d-flex align-items-center gap-4 ${
                  activeLink === 'arrival' ? styles['user-link-active'] : ''
                }`}
              >
                <FaTruck /> 出貨狀況
              </Link>
            </li>

            <li>
              <Link
                href="/admin/chat"
                className={`${
                  styles['user-sidebar-link-bo']
                } h6 d-flex align-items-center gap-4 ${
                  activeLink === 'chat' ? styles['user-link-active'] : ''
                }`}
              >
                <FaTruck /> 客服中心
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* 行動版側邊欄 */}
      <aside
        className={`${styles['user-mobile-sidebar-bo']} d-flex flex-column align-items-center h-100 d-md-none`}
      >
        <div
          className={`${styles['user-sidebar-body-bo']} d-flex justify-content-start align-items-center`}
        >
          <ul
            className={`${styles['user-sidebar-menu-bo']} d-flex flex-column`}
          >
            {/* 下拉選單的第一個鏈接，顯示當前選中的選項 */}
            <li>
              <input
                type="checkbox"
                id="showDetail"
                className={`d-none ${styles['show-detail-bo']}`}
              />
              <label
                htmlFor="showDetail"
                id="firstLink"
                className={`${
                  styles['user-sidebar-link-bo']
                } h6 d-flex justify-content-between align-items-center gap-4 ${
                  styles['first-link-bo']
                } ${
                  activeLink === firstLink ? styles['user-link-active'] : ''
                }`}
              >
                <Link
                  href={`/admin/${firstLink}`}
                  className={`h6 d-flex gap-4 justify-content-between align-items-center`}
                >
                  {getIcon(firstLink)}
                  {getLabel(firstLink)}
                </Link>
                <FaChevronDown
                  className={`fa-solid fa-chevron-down d-block d-md-none ${styles['chevron-icon']}`}
                />
              </label>

              {/* 下拉選單的其餘選項 */}
              <ul
                id="linkList"
                className={`d-md-block ${styles['user-mobile-sidebar-submenu-bo']}`}
              >
                {/* 手動渲染各個項目並檢查是否等於 firstLink */}
                {firstLink !== 'chart' && (
                  <li>
                    <Link
                      href="/admin/chart"
                      onClick={() => updateActiveLink('info')}
                      className={`${
                        styles['user-sidebar-link-bo']
                      } h6 d-flex align-items-center gap-4 ${
                        activeLink === 'info' ? styles['user-link-active'] : ''
                      }`}
                    >
                      <FaChartLine />
                      數據分析
                    </Link>
                  </li>
                )}
                {firstLink !== 'arrival' && (
                  <li>
                    <Link
                      href="/admin/arrival"
                      onClick={() => updateActiveLink('info')}
                      className={`${
                        styles['user-sidebar-link-bo']
                      } h6 d-flex align-items-center gap-4 ${
                        activeLink === 'info' ? styles['user-link-active'] : ''
                      }`}
                    >
                      <FaTruck />
                      出貨狀況
                    </Link>
                  </li>
                )}
                {firstLink !== 'chat' && (
                  <li>
                    <Link
                      href="/admin/chat"
                      onClick={() => updateActiveLink('info')}
                      className={`${
                        styles['user-sidebar-link-bo']
                      } h6 d-flex align-items-center gap-4 ${
                        activeLink === 'info' ? styles['user-link-active'] : ''
                      }`}
                    >
                      <BsChatDots />
                      客服中心
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </aside>
    </section>
  )
}
