import React from 'react'
import styles from '@/styles/boyu/user-info.module.scss'

export default function UserImage({ imageSrc, createdAt, userData }) {
  return (
    <div
      className={`${styles['default-img-box-bo']} ${styles['move-up-bo']} col-12 col-lg-4 d-flex flex-column justify-content-center align-items-center position-relative`}
    >
      <div className={styles['user-img-box-bo']}>
        <img
          className={`${styles['user-img-bo']}`}
          src={imageSrc}
          alt={userData?.username || 'User'}
        />
      </div>
      <div
        className={`${styles['create-date-box-bo']} h6 text-center d-flex justify-content-center align-items-center`}
      >
        <h6>創建日期&nbsp;:&nbsp;</h6>
        <h6>{createdAt}</h6>
      </div>
    </div>
  )
}
