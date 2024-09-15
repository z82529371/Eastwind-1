import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import styles from './user-siderbar.module.scss'
import { FaUserCircle, FaAddressCard } from 'react-icons/fa'
import { HiTicket } from 'react-icons/hi2'
import {
  FaChevronDown,
  FaShop,
  FaHeartCircleCheck,
  FaUserGroup,
} from 'react-icons/fa6'
import { ImBook } from 'react-icons/im'
import { IoReceipt } from 'react-icons/io5'
import Link from 'next/link'
import { AuthContext } from '@/context/AuthContext'

export default function UserSidebar() {
  const router = useRouter()
  const [activeLink, setActiveLink] = useState('info') // 狀態：追蹤當前活躍的鏈接
  const [firstLink, setFirstLink] = useState('info') // 初始化 firstLink 為 info

  // 從 AuthContext 中獲取 user 狀態
  const { user } = useContext(AuthContext)

  useEffect(() => {
    // 當 user 狀態變化時，強制重新渲染
    setActiveLink((prev) => prev)
  }, [user])

  const userImgSrc = () => {
    if (user && user.user_img) {
      return `/images/boyu/users/${user.user_img}.jpg?${new Date().getTime()}`
    } else if (user && user.photo_url) {
      return user.photo_url
    } else if (user && user.gender === '男') {
      return '/images/boyu/users/user-male-default.svg'
    } else {
      return '/images/boyu/users/user-female-default.svg'
    }
  }

  // 當路徑發生變化時，更新 activeLink 和 firstLink 的狀態
  useEffect(() => {
    const path = router.pathname.split('/').pop() // 獲取當前路徑的最後部分

    if (router.pathname.startsWith('/user/user-center/order')) {
      // 如果路徑是 /user/user-center/order 或 /user/user-center/order/[oid]
      setActiveLink('order')
      setFirstLink('order')
    } else if (path === 'info-edit') {
      setActiveLink('info')
      setFirstLink('info')
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
      case 'info':
        return <FaAddressCard />

      case 'booking':
        return <FaShop />

      case 'party':
        return <FaUserGroup />

      case 'order':
        return <IoReceipt />

      case 'course':
        return <ImBook />

      case 'favorite':
        return <FaHeartCircleCheck />

      case 'coupon':
        return <HiTicket />

      default:
        return null
    }
  }

  // 根據鏈接名稱返回對應的標籤

  function getLabel(link) {
    switch (link) {
      case 'info':
        return '個人資料'

      case 'booking':
        return '訂桌紀錄'

      case 'party':
        return '揪團紀錄'

      case 'order':
        return '歷史訂單'

      // case 'course':
      //   return '課程'

      case 'favorite':
        return '我的最愛'

      case 'coupon':
        return '優惠卷'

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
            className={`d-none d-md-flex ${styles['user-sidebar-title-bo']} d-flex justify-content-center align-items-center h6  gap-3`}
          >
            <FaUserCircle />
            會員中心
          </div>
          <div className={styles['user-img-box-bo']}>
            {/* 使用來自 Context 的 user.user_img 來顯示用戶照片 */}
            <img
              className={`${styles['user-img-bo']}`}
              src={userImgSrc()}
              alt={user?.username || 'User'}
            />
          </div>
          <div
            className={`${styles['user-welcome-box-bo']} h6 d-none d-md-block`}
          >
            {/* 使用來自 Context 的 user.username 來顯示用戶名稱 */}
            歡迎，{user?.username || '用戶'}。
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
                href="/user/user-center/info"
                className={`${
                  styles['user-sidebar-link-bo']
                } h6 d-flex align-items-center gap-4 ${
                  activeLink === 'info' ? styles['user-link-active'] : ''
                }`}
              >
                <FaAddressCard /> 個人資料
              </Link>
            </li>

            {/* 選單項目：訂桌紀錄 */}
            <li>
              <Link
                href="/user/user-center/booking"
                className={`${
                  styles['user-sidebar-link-bo']
                } h6 d-flex align-items-center gap-4 ${
                  activeLink === 'booking' ? styles['user-link-active'] : ''
                }`}
              >
                <FaShop />
                訂桌紀錄
              </Link>
            </li>

            {/* 選單項目：揪團紀錄 */}
            <li>
              <Link
                href="/user/user-center/party"
                className={`${
                  styles['user-sidebar-link-bo']
                } h6 d-flex align-items-center gap-4 ${
                  activeLink === 'party' ? styles['user-link-active'] : ''
                }`}
              >
                <FaUserGroup />
                揪團紀錄
              </Link>
            </li>

            {/* 選單項目：歷史訂單 */}
            <li>
              <Link
                href="/user/user-center/order"
                className={`${
                  styles['user-sidebar-link-bo']
                } h6 d-flex align-items-center gap-4 ${
                  activeLink === 'order' ? styles['user-link-active'] : ''
                }`}
              >
                <IoReceipt />
                歷史訂單
              </Link>
            </li>

            {/* 選單項目：課程
            <li>
              <Link
                href="/user/user-center/course"
                className={`${
                  styles['user-sidebar-link-bo']
                } h6 d-flex align-items-center gap-4 ${
                  activeLink === 'course' ? styles['user-link-active'] : ''
                }`}
              >
                <ImBook />
                課程
              </Link>
            </li> */}

            {/* 選單項目：我的最愛 */}
            <li>
              <Link
                href="/user/user-center/favorite"
                className={`${
                  styles['user-sidebar-link-bo']
                } h6 d-flex align-items-center gap-4 ${
                  activeLink === 'favorite' ? styles['user-link-active'] : ''
                }`}
              >
                <FaHeartCircleCheck />
                我的最愛
              </Link>
            </li>

            {/* 選單項目：優惠卷 */}
            <li>
              <Link
                href="/user/user-center/coupon"
                className={`${
                  styles['user-sidebar-link-bo']
                } h6 d-flex align-items-center gap-4 ${
                  activeLink === 'coupon' ? styles['user-link-active'] : ''
                }`}
              >
                <HiTicket />
                優惠卷
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
                  href={`/user/user-center/${firstLink}`}
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
                {firstLink !== 'info' && (
                  <li>
                    <Link
                      href="/user/user-center/info"
                      onClick={() => updateActiveLink('info')}
                      className={`${
                        styles['user-sidebar-link-bo']
                      } h6 d-flex align-items-center gap-4 ${
                        activeLink === 'info' ? styles['user-link-active'] : ''
                      }`}
                    >
                      <FaAddressCard />
                      個人資料
                    </Link>
                  </li>
                )}
                {firstLink !== 'booking' && (
                  <li>
                    <Link
                      href="/user/user-center/booking"
                      onClick={() => updateActiveLink('booking')}
                      className={`${
                        styles['user-sidebar-link-bo']
                      } h6 d-flex align-items-center gap-4 ${
                        activeLink === 'booking'
                          ? styles['user-link-active']
                          : ''
                      }`}
                    >
                      <FaShop />
                      訂桌紀錄
                    </Link>
                  </li>
                )}
                {firstLink !== 'party' && (
                  <li>
                    <Link
                      href="/user/user-center/party"
                      onClick={() => updateActiveLink('party')}
                      className={`${
                        styles['user-sidebar-link-bo']
                      } h6 d-flex align-items-center gap-4 ${
                        activeLink === 'party' ? styles['user-link-active'] : ''
                      }`}
                    >
                      <FaUserGroup />
                      揪團紀錄
                    </Link>
                  </li>
                )}
                {firstLink !== 'order' && (
                  <li>
                    <Link
                      href="/user/user-center/order"
                      onClick={() => updateActiveLink('order')}
                      className={`${styles['user-sidebar-link-bo']}
                        h6 d-flex align-items-center gap-4 ${
                          activeLink === 'order'
                            ? styles['user-link-active']
                            : ''
                        }`}
                    >
                      <IoReceipt />
                      歷史訂單
                    </Link>
                  </li>
                )}
                {/* {firstLink !== 'course' && (
                  <li>
                    <Link
                      href="/user/user-center/course"
                      onClick={() => updateActiveLink('course')}
                      className={`${styles['user-sidebar-link-bo']}
                        h6 d-flex align-items-center gap-4 ${
                          activeLink === 'course'
                            ? styles['user-link-active']
                            : ''
                        }`}
                    >
                      <ImBook />
                      課程
                    </Link>
                  </li>
                )} */}
                {firstLink !== 'favorite' && (
                  <li>
                    <Link
                      href="/user/user-center/favorite"
                      onClick={() => updateActiveLink('favorite')}
                      className={`${styles['user-sidebar-link-bo']}
                        h6 d-flex align-items-center gap-4 ${
                          activeLink === 'favorite'
                            ? styles['user-link-active']
                            : ''
                        }`}
                    >
                      <FaHeartCircleCheck />
                      我的最愛
                    </Link>
                  </li>
                )}
                {firstLink !== 'coupon' && (
                  <li>
                    <Link
                      href="/user/user-center/coupon"
                      onClick={() => updateActiveLink('coupon')}
                      className={`${styles['user-sidebar-link-bo']}
                        h6 d-flex align-items-center gap-4 ${
                          activeLink === 'coupon'
                            ? styles['user-link-active']
                            : ''
                        }`}
                    >
                      <HiTicket />
                      優惠卷
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
