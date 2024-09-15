import { useState } from 'react'
import Swal from 'sweetalert2'
import styles from '@/styles/boyu/user-coupon.module.scss'
import { FaPlus } from 'react-icons/fa6'

export default function CouponInputBox({ addCouponByCode }) {
  const [couponCode, setCouponCode] = useState('')

  const handleAddCoupon = () => {
    addCouponByCode(couponCode)
    setCouponCode('')
  }

  return (
    <div
      className={`${styles['add-coupon-box-bo']} d-flex flex-column flex-sm-row justify-content-center align-items-center gap-lg-5 gap-3 `}
    >
      <h6>新增優惠券</h6>
      <input
        type="text"
        placeholder="輸入優惠代碼"
        value={couponCode}
        className={`${styles['input-add-bo']} p`}
        onChange={(e) => setCouponCode(e.target.value)}
      />
      <button
        className={`${styles['btn-coupon-add']} h6 d-flex justify-content-between align-items-center`}
        onClick={handleAddCoupon}
      >
        <FaPlus />
        <h6>新增</h6>
      </button>
    </div>
  )
}
