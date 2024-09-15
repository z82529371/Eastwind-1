import { useContext, useEffect, useState } from 'react'
import styles from '@/styles/bearlong/headerAdmin.module.scss'
import { IoHome } from 'react-icons/io5'
import { FaUser, FaRightFromBracket } from 'react-icons/fa6'
import { FaShoppingCart } from 'react-icons/fa'
import useAuth from '@/hooks/use-auth-bo'
import Link from 'next/link'
import { AuthContext } from '@/context/AuthContext'
import Swal from 'sweetalert2'

export default function HeaderAdmin() {
  const [isChecked, setIsChecked] = useState(false) // 用於管理復選框狀態

  const { logout } = useAuth()
  const { user } = useContext(AuthContext)

  const onLogout = (event) => {
    event.preventDefault()

    // 顯示登出確認提示

    Swal.fire({
      title: '您確定要登出嗎？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確認登出',
      cancelButtonText: '取消登出',
      customClass: {
        popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
        title: 'h6',
        icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
        confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
        cancelButton: `${styles['swal-btn-cancel-bo']}`, // 你可以自定義取消按鈕的樣式
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logout() // 如果用戶確認登出，執行登出操作
        Swal.fire({
          title: '登出成功！',
          icon: 'success',
          confirmButtonText: 'OK', // 修改按鈕文字

          customClass: {
            title: 'h6',
            icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
            confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
          },
        })
      }
    })
  }

  const onLinkClick = () => {
    setIsChecked(false) // 點擊連結後取消選取復選框
  }

  return (
    <>
      <header
        className={`${styles['header-bo']} fixed-top container-fluid sticky-top py-3`}
      >
        <div
          className={`${styles['header-box-bo']}  container-fluid d-flex justify-content-between align-items-center `}
        >
          <div className={styles['logo-box-bo']}>
            <Link href="/admin/chart">
              <img
                src="/images/boyu/logo.svg"
                alt=""
                className={styles['logo-bo']}
              />
            </Link>
          </div>
          <nav className={`${styles['nav-bar-bo']}  `}>
            <ul
              className={`d-flex justify-content-center align-items-center ${styles['nav-list-bo']}`}
            >
              <li>
                <Link
                  className={`h6 ${styles['nav-link-bo']}`}
                  href="/admin/chart"
                >
                  企業後台
                </Link>
              </li>
            </ul>
          </nav>
          <div className={styles['icon-box-bo']}>
            <ul
              className={`d-flex justify-content-center align-items-center ${styles['icon-list-bo']}`}
            >
              <li>
                <Link href="/admin/chart">
                  <IoHome className={` ${styles['icon-bo']} me-4 me-md-5`} />
                </Link>
              </li>
              {user && ( // 只有在 user 存在時才顯示登出按鈕
                <li>
                  <Link href="" type="button" onClick={onLogout}>
                    <FaRightFromBracket
                      className={` ${styles['icon-bo']} me-4 me-md-0`}
                    />
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
        <style jsx>
          {`
            header {
              padding-right: 0 !important;
              margin-right: 0 !important;
            }
          `}
        </style>
      </header>
    </>
  )
}
