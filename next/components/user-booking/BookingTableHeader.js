import React from 'react'
import { FaSort } from 'react-icons/fa6'
import styles from '@/styles/boyu/user-booking.module.scss'

export default function BookingTableHeader({ activeSortIndex, sortByIndex }) {
  return (
    <div className={styles['booking-list-th-bo']}>
      <ul className="text-center">
        <li
          className="p d-flex justify-content-center align-items-center text-center gap-3"
          onClick={() => sortByIndex(activeSortIndex === 1 ? 0 : 1)}
        >
          預訂編號 <FaSort />
        </li>
        <li
          className="p d-flex justify-content-center align-items-center text-center gap-3"
          onClick={() => sortByIndex(activeSortIndex === 3 ? 2 : 3)}
        >
          棋牌室 <FaSort />
        </li>
        <li
          className="p d-flex justify-content-center align-items-center text-center gap-3"
          onClick={() => sortByIndex(activeSortIndex === 5 ? 4 : 5)}
        >
          預訂時間 <FaSort />
        </li>
        <li className="p d-flex justify-content-center align-items-center text-center gap-3"></li>
      </ul>
    </div>
  )
}
