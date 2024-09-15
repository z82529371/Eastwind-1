import styles from '@/styles/boyu/user-coupon.module.scss'
import Swal from 'sweetalert2'
import {
  FaPlus,
  FaMagnifyingGlass,
  FaBan,
  FaMoneyBill,
  FaXmark,
} from 'react-icons/fa6'
import { FaPercent } from 'react-icons/fa'

export default function CouponCard({ coupon, filterStatus, redeemCoupon }) {
  const handleButtonClick = () => {
    if (filterStatus === 'active') {
      redeemCoupon(coupon.id)
    } else {
      window.location.href = '/product/productList'
    }
  }

  return (
    <div
      key={coupon.id}
      className={`${styles['coupon-card-bo']} d-flex flex-column justify-content-start align-items-center gap-3`}
    >
      <div className="h5 d-flex w-100 justify-content-between align-items-center">
        <h5 className="text-nowrap">{coupon.name}</h5>
        <div
          className={`${styles['btn-detail-box-bo']} d-flex justify-content-end w-100`}
        >
          {coupon.status === 'used' ? (
            <div
              className={`${styles['text-coupon-detail']} p d-flex justify-content-between align-items-center`}
            >
              <FaXmark />
              <div
                className={`${styles['btn-text-bo']} d-flex justify-content-center align-items-center text-center`}
              >
                <p>已使用</p>
              </div>
            </div>
          ) : coupon.status === 'inactive' ? (
            <div
              className={`${styles['text-coupon-detail']} p d-flex justify-content-between align-items-center`}
            >
              <FaBan />
              <div
                className={`${styles['btn-text-bo']} d-flex justify-content-center align-items-center text-center`}
              >
                <p>已失效</p>
              </div>
            </div>
          ) : (
            <button
              className={`${styles['btn-coupon-detail']} p d-flex justify-content-between align-items-center`}
              onClick={handleButtonClick}
            >
              {filterStatus === 'active' ? (
                <FaPlus className={`${styles['btn-icon-bo']} `} />
              ) : (
                <FaMagnifyingGlass className={`${styles['btn-icon-bo']} `} />
              )}
              <div
                className={`${styles['btn-text-bo']} d-flex justify-content-center align-items-center text-center`}
              >
                <p>{filterStatus === 'active' ? '領取' : '去逛逛'}</p>
              </div>
            </button>
          )}
        </div>
      </div>

      <div
        className={`${styles['coupon-card-body-bo']} d-flex justify-content-start align-items-center w-100`}
      >
        <div
          className={`${styles['coupon-type-box-bo']} d-flex justify-content-center align-items-center flex-column gap-3`}
        >
          {coupon.discount_type === 'percent' ? (
            <>
              <FaPercent className={`${styles['icon-shop-bo']} `} />
              <p className={styles['coupon-type-text-bo']}>折數折扣</p>
            </>
          ) : (
            <>
              <FaMoneyBill className={`${styles['icon-shop-bo']} `} />
              <p className={styles['coupon-type-text-bo']}>現金折扣</p>
            </>
          )}
        </div>

        <div
          className={`${styles['coupon-text-box-bo']} d-flex flex-column align-items-start gap-3`}
        >
          <h6
            className={`${styles['list-text-bo']} d-flex justify-content-center align-items-center`}
          >
            {coupon.discount_type === 'percent'
              ? coupon.discount_value % 10 === 0
                ? `打 ${10 - coupon.discount_value / 10} 折`
                : `打 ${10 - coupon.discount_value / 10} 折`
              : `折 ${coupon.discount_value} 元`}
          </h6>
          <p
            className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center`}
          >
            低消 {coupon.limit_value} 元
          </p>
          <div
            className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center text-start`}
          >
            <div
              className={`${styles['time-text-box-bo']} d-flex justify-content-center align-items-start text-start`}
            >
              <p>有效日期 :&nbsp;</p>
              <p>{coupon.valid_to}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
