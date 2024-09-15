import React from 'react'
import styles from '@/styles/boyu/user-booking.module.scss'

export default function BookingStatusTabs({ selectedStatus, changeStatus }) {
  return (
    <div className={styles['booking-list-head-bo']}>
      <ul
        className={`${styles['booking-state-box-bo']} d-flex justify-content-around align-items-center text-center`}
      >
        <li>
          <button
            onClick={() => changeStatus('booked')}
            className={`${styles['booking-state-bo']} h5 ${
              selectedStatus === 'booked' ? styles['state-choose-bo'] : ''
            }`}
          >
            已預訂
          </button>
        </li>
        <li>
          <button
            onClick={() => changeStatus('completed')}
            className={`${styles['booking-state-bo']} h5 ${
              selectedStatus === 'completed' ? styles['state-choose-bo'] : ''
            }`}
          >
            已完成
          </button>
        </li>
        <li>
          <button
            onClick={() => changeStatus('cancelled')}
            className={`${styles['booking-state-bo']} h5 ${
              selectedStatus === 'cancelled' ? styles['state-choose-bo'] : ''
            }`}
          >
            已取消
          </button>
        </li>
      </ul>
    </div>
  )
}
