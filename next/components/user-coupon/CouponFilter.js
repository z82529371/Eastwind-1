import styles from '@/styles/boyu/user-coupon.module.scss'

export default function CouponFilter({ filterStatus, setFilterStatus }) {
  return (
    <div className={styles['coupon-list-head-bo']}>
      <ul
        className={`${styles['coupon-state-box-bo']} d-flex justify-content-around align-items-center text-center`}
      >
        <li>
          <button
            type="button"
            className={`${styles['coupon-state-bo']} ${
              filterStatus === 'active' ? styles['state-choose-bo'] : ''
            }  h5`}
            onClick={() => setFilterStatus('active')}
          >
            可領取
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`${styles['coupon-state-bo']} ${
              filterStatus === 'unused' ? styles['state-choose-bo'] : ''
            } h5`}
            onClick={() => setFilterStatus('unused')}
          >
            可使用
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`${styles['coupon-state-bo']} ${
              filterStatus === 'used' ? styles['state-choose-bo'] : ''
            }  h5`}
            onClick={() => setFilterStatus('used')}
          >
            已使用
          </button>
        </li>
      </ul>
    </div>
  )
}
