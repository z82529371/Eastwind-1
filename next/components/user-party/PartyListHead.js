import React from 'react'
import styles from '@/styles/boyu/user-party.module.scss'

export default function PartyListHead({ role, changeRole }) {
  return (
    <div className={styles['party-list-head-bo']}>
      <ul
        className={`${styles['party-state-box-bo']} d-flex justify-content-around align-items-center text-center`}
      >
        <li
          onClick={() => changeRole('主揪')}
          className={`${styles['party-type-bo']} h5 ${
            role === '主揪' ? styles['type-choose-bo'] : ''
          }`}
        >
          主揪
        </li>
        <li
          onClick={() => changeRole('參團')}
          className={`${styles['party-type-bo']} h5 ${
            role === '參團' ? styles['type-choose-bo'] : ''
          }`}
        >
          參團
        </li>
      </ul>
    </div>
  )
}
