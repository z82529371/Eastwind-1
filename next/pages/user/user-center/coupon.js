import { useState, useEffect, useContext } from 'react'
import styles from '@/styles/boyu/user-coupon.module.scss'
import UserCenterLayout from '@/components/layout/user-center-layout'
import { AuthContext } from '@/context/AuthContext'
import Swal from 'sweetalert2'
import CouponInputBox from '@/components/user-coupon/CouponInputBox'
import CouponFilter from '@/components/user-coupon/CouponFilter'
import CouponList from '@/components/user-coupon/CouponList'

export default function UserCoupons() {
  const { user } = useContext(AuthContext) // 獲取當前用戶資訊
  const userId = user?.id // 使用可選鏈式操作來確保 `user` 已初始化
  const [coupons, setCoupons] = useState([]) // 儲存從後端獲取的優惠券數據
  const [filterStatus, setFilterStatus] = useState('unused') // 預設顯示可領取的優惠券

  // 獨立函數：通過代碼新增優惠券
  const addCouponByCode = async (couponCode) => {
    if (!couponCode) {
      Swal.fire({
        title: '請輸入代碼',
        html: `<span class="p">請輸入有效的優惠代碼</span>`,
        icon: 'warning',
        customClass: {
          popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
          title: 'h6',
          icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
          confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
        },
        confirmButtonText: '確認', // 修改按鈕文字
      })
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3005/api/coupons/redeem-code/${userId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: couponCode }), // 傳遞優惠代碼至後端
        }
      )
      const result = await response.json()
      if (response.ok) {
        Swal.fire({
          title: '新增成功',
          html: `<span class="p">優惠券已新增!</span>`,
          icon: 'success',
          customClass: {
            popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
            title: 'h6',
            icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
            confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
          },
          confirmButtonText: '確認', // 修改按鈕文字
        })
        // 重新加載優惠券列表，切換到可使用的列表
        setFilterStatus('unused')
      } else {
        Swal.fire({
          title: '新增失敗',
          html: `<span class="p">${
            result.message || '優惠券無效或已被使用'
          }</span>`, // 正確使用方式
          icon: 'error',
          customClass: {
            popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
            title: 'h6',
            icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
            confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
          },
          confirmButtonText: '確認', // 修改按鈕文字
        })
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  // 根據狀態加載優惠券
  useEffect(() => {
    const fetchCoupons = async () => {
      if (!userId && filterStatus !== 'active') return

      let apiUrl = `http://localhost:3005/api/coupons/${filterStatus}/${userId}`

      try {
        const response = await fetch(apiUrl)
        if (response.ok) {
          const data = await response.json()
          const validCoupons = data.data.filter((coupon) => {
            const today = new Date().toISOString().split('T')[0]
            return coupon.valid_to >= today // 過濾出有效的優惠券
          })
          setCoupons(validCoupons)
        } else {
          console.error('無法撈取優惠券:', response.statusText)
        }
      } catch (error) {
        console.error('撈取優惠券時發生錯誤:', error)
      }
    }

    fetchCoupons()
  }, [filterStatus, userId])

  const redeemCoupon = async (couponId) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/coupons/add/${userId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ couponId }), // 傳遞選中的優惠券ID至後端
        }
      )

      const result = await response.json()
      if (response.ok) {
        Swal.fire({
          title: '領取成功',
          html: `<span class="p">優惠券領取成功!</span>`,
          icon: 'success',
          customClass: {
            popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
            title: 'h6',
            icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
            confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
          },
          confirmButtonText: '確認', // 修改按鈕文字
        })

        // 直接從 coupons 狀態中移除已領取的優惠券
        setCoupons((prevCoupons) =>
          prevCoupons.filter((coupon) => coupon.id !== couponId)
        )

        // 如果已領取，切換到可使用的列表
        setFilterStatus('unused')
      } else {
        Swal.fire({
          title: '領取失敗',
          html: `<span class="p">${result.message || '領取失敗'}</span>`, // 正確的使用方式
          icon: 'warning',
          customClass: {
            popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
            title: 'h6',
            icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
            confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
          },
          confirmButtonText: '確認', // 修改按鈕文字
        })
      }
    } catch (error) {
      console.error('領取優惠券時發生錯誤:', error)
    }
  }

  return (
    <div className={`${styles['user-coupon-box-bo']} w-100`}>
      <CouponInputBox addCouponByCode={addCouponByCode} />

      <div className={`${styles['coupon-list-box-bo']} flex-column d-flex`}>
        <CouponFilter
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        <CouponList
          coupons={coupons}
          filterStatus={filterStatus}
          redeemCoupon={redeemCoupon}
        />
      </div>
    </div>
  )
}

UserCoupons.getLayout = function (page) {
  return <UserCenterLayout>{page}</UserCenterLayout>
}
