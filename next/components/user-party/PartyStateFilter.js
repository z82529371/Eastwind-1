import React from 'react'
import styles from '@/styles/boyu/user-party.module.scss'

export default function PartyStateFilter({ selectedStatus, changeStatus }) {
  return (
    <ul
      className={`${styles['party-state-box-bo']} d-flex justify-content-around align-items-center text-center`}
    >
      <li
        onClick={() => changeStatus('waiting')}
        className={`${styles['party-state-bo']} h6 ${
          selectedStatus === 'waiting' ? styles['state-choose-bo'] : ''
        }`}
      >
        等待中
      </li>
      <li
        onClick={() => changeStatus('completed')}
        className={`${styles['party-state-bo']} h6 ${
          selectedStatus === 'completed' ? styles['state-choose-bo'] : ''
        }`}
      >
        已完成
      </li>
      <li
        onClick={() => changeStatus('cancelled')}
        className={`${styles['party-state-bo']} h6 ${
          selectedStatus === 'cancelled' ? styles['state-choose-bo'] : ''
        }`}
      >
        已取消
      </li>
      <li
        onClick={() => changeStatus('failed')}
        className={`${styles['party-state-bo']} h6 ${
          selectedStatus === 'failed' ? styles['state-choose-bo'] : ''
        }`}
      >
        已流團
      </li>
    </ul>
  )
}
