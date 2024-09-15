import styles from '@/styles/boyu/user-coupon.module.scss'
import CouponCard from './CouponCard'

export default function CouponList({ coupons, filterStatus, redeemCoupon }) {
  return (
    <div className={styles['coupon-list-body-bo']}>
      {coupons.length === 0 ? (
        <div
          className={`${styles['no-coupons-bo']} d-flex justify-content-center align-items-center m-5`}
        >
          <p className="h5">
            尚未有{' '}
            {filterStatus === 'active'
              ? '可領取'
              : filterStatus === 'unused'
              ? '可使用'
              : '已使用'}{' '}
            的優惠券
          </p>
        </div>
      ) : (
        coupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            filterStatus={filterStatus}
            redeemCoupon={redeemCoupon}
          />
        ))
      )}
    </div>
  )
}
